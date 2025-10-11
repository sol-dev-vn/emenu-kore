#!/usr/bin/env node

/**
 * SOL eMenu - CukCuk Data Synchronization
 *
 * Comprehensive sync system for synchronizing data from CukCuk POS to Directus
 * Features:
 * - Branch synchronization
 * - Category synchronization
 * - Menu item synchronization
 * - Table synchronization
 * - Error handling and retry logic
 * - Progress tracking and logging
 * - Configurable sync options
 * - Health monitoring
 */

const path = require('path');
const dotenv = require('dotenv');

// Load env from project root, fallback to cukcuk collector directory
const rootEnv = dotenv.config();
if (rootEnv.error) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}
const { logger } = require('./utils/logger');
const { ApiClient } = require('./utils/api-client');
const { DataMapper } = require('./utils/data-mapper');
const { syncConfig } = require('./utils/sync-config');

class CukCukSync {
  constructor() {
    this.apiClient = new ApiClient();
    this.dataMapper = new DataMapper();
    this.config = syncConfig;
    this.stats = {
      startTime: new Date(),
      endTime: null,
      totalProcessed: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalFailed: 0,
      syncTypes: {}
    };
  }

  /**
   * Initialize the sync system
   */
  async initialize() {
    logger.section('SOL eMenu - CukCuk Data Synchronization');

    // Validate configuration
    const validation = this.config.validate();
    if (!validation.isValid) {
      logger.error('Configuration validation failed');
      if (validation.errors && validation.errors.length) {
        logger.error(`Errors: ${validation.errors.join(', ')}`);
      }
      throw new Error('Invalid configuration');
    }

    // Print configuration summary
    this.config.print();

    // Test API connections
    await this.testConnections();

    logger.success('Sync system initialized successfully');
  }

  /**
   * Test API connections
   */
  async testConnections() {
    logger.section('Testing API Connections');

    try {
      const healthCheck = await this.apiClient.healthCheck();

      if (healthCheck.directus.status === 'healthy') {
        logger.success(`Directus: Connected (${healthCheck.directus.latency}ms)`);
      } else {
        throw new Error(`Directus connection failed: ${healthCheck.directus.message}`);
      }

      if (healthCheck.cukcuk.status === 'healthy') {
        logger.success(`CukCuk: Connected (${healthCheck.cukcuk.latency}ms)`);
      } else {
        throw new Error(`CukCuk connection failed: ${healthCheck.cukcuk.message}`);
      }

    } catch (error) {
      logger.error(`Connection test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get sync statistics for a type
   */
  getTypeStats(type) {
    if (!this.stats.syncTypes[type]) {
      this.stats.syncTypes[type] = {
        processed: 0,
        created: 0,
        updated: 0,
        failed: 0,
        startTime: null,
        endTime: null
      };
    }
    return this.stats.syncTypes[type];
  }

  /**
   * Update sync statistics
   */
  updateStats(type, operation, count = 1) {
    const typeStats = this.getTypeStats(type);
    typeStats[operation] += count;
    // Only increment totalProcessed when marking an item as processed
    if (operation === 'processed') {
      this.stats.totalProcessed += count;
    }

    if (operation === 'created') {
      this.stats.totalCreated += count;
    } else if (operation === 'updated') {
      this.stats.totalUpdated += count;
    } else if (operation === 'failed') {
      this.stats.totalFailed += count;
    }
  }

  /**
   * Synchronize branches from CukCuk to Directus
   */
  async syncBranches() {
    const syncType = 'branches';
    const syncConfig = this.config.getSyncConfig(syncType);
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Branch sync disabled, skipping...');
      return;
    }

    logger.syncStart('Branches');
    typeStats.startTime = new Date();

    try {
      // Fetch branches from CukCuk
      const cukcukBranches = await this.apiClient.getCukCukBranches(false);
      logger.info(`Found ${cukcukBranches.length} branches in CukCuk`);

      if (cukcukBranches.length === 0) {
        logger.warn('No branches found to sync');
        await this.apiClient.createSyncLog(syncType, 'completed', { created: 0, updated: 0, failed: 0 });
        return;
      }

      // Map data
      const mappingResult = this.dataMapper.mapBatch(cukcukBranches, 'branch');
      logger.info(`Mapped ${mappingResult.successCount} branches successfully`);

      if (mappingResult.errorCount > 0) {
        logger.warn(`${mappingResult.errorCount} branches failed to map`);
        mappingResult.errors.forEach(error => {
          logger.error(`Mapping error: ${JSON.stringify(error)}`);
        });
      }

      // Process branches
      let processed = 0;
      const branchMap = new Map(); // Will store external_id -> primary_key mapping

      for (const branchData of mappingResult.results) {
        try {
          this.updateStats(syncType, 'processed');

          // Check if branch already exists
          const existing = await this.apiClient.getDirectusItems('branches', {
            external_id: { _eq: branchData.external_id }
          }, 1);

          let branchId;
          if (existing.data && existing.data.length > 0) {
            // Update existing branch
            const result = await this.apiClient.updateDirectusItem('branches', existing.data[0].id, branchData);
            branchId = existing.data[0].id;
            this.updateStats(syncType, 'updated');
            logger.debug(`Updated branch: ${branchData.name}`);
          } else {
            // Create new branch
            const result = await this.apiClient.createDirectusItem('branches', branchData);
            branchId = result.data.id;
            this.updateStats(syncType, 'created');
            logger.debug(`Created branch: ${branchData.name}`);
          }

          // Store mapping for other sync operations
          if (branchData.external_id) {
            branchMap.set(branchData.external_id, branchId);
          }

          processed++;
          if (syncConfig.enableProgressLogging && processed % syncConfig.progressLogInterval === 0) {
            logger.syncProgress('Branch', processed, mappingResult.results.length);
          }

        } catch (error) {
          this.updateStats(syncType, 'failed');
          logger.error(`Failed to sync branch "${branchData.name}": ${error.message}`);
        }
      }

      typeStats.endTime = new Date();
      const duration = typeStats.endTime - typeStats.startTime;
      typeStats.duration = Math.round(duration / 1000);

      logger.syncSuccess('Branches', typeStats);
      logger.info(`Branch sync completed in ${Math.round(duration / 1000)}s`);

      // Create sync log
      await this.apiClient.createSyncLog(syncType, 'completed', typeStats);

      // Return branch map for other sync operations
      return branchMap;

    } catch (error) {
      typeStats.endTime = new Date();
      if (typeStats.startTime) {
        typeStats.duration = Math.round((typeStats.endTime - typeStats.startTime) / 1000);
      }
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Branches', error);
      throw error;
    }
  }

  /**
   * Synchronize categories from CukCuk to Directus
   */
  async syncCategories(branchMap = new Map()) {
    const syncType = 'categories';
    const syncConfig = this.config.getSyncConfig(syncType);
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Category sync disabled, skipping...');
      return;
    }

    logger.syncStart('Categories');
    typeStats.startTime = new Date();

    try {
      // Fetch categories from CukCuk
      const cukcukCategories = await this.apiClient.getCukCukCategories(false);
      logger.info(`Found ${cukcukCategories.length} categories in CukCuk`);

      if (cukcukCategories.length === 0) {
        logger.warn('No categories found to sync');
        await this.apiClient.createSyncLog(syncType, 'completed', { created: 0, updated: 0, failed: 0 });
        return;
      }

      // Map data with branch mapping
      const mappingResult = this.dataMapper.mapBatch(cukcukCategories, 'category', branchMap);
      logger.info(`Mapped ${mappingResult.successCount} categories successfully`);

      // Process categories
      let processed = 0;
      for (const categoryData of mappingResult.results) {
        try {
          this.updateStats(syncType, 'processed');

          // Check if category already exists
          const existing = await this.apiClient.getDirectusItems('categories', {
            external_id: { _eq: categoryData.external_id }
          }, 1);

          if (existing.data && existing.data.length > 0) {
            // Update existing category
            await this.apiClient.updateDirectusItem('categories', existing.data[0].id, categoryData);
            this.updateStats(syncType, 'updated');
            logger.debug(`Updated category: ${categoryData.name}`);
          } else {
            // Create new category
            await this.apiClient.createDirectusItem('categories', categoryData);
            this.updateStats(syncType, 'created');
            logger.debug(`Created category: ${categoryData.name}`);
          }

          processed++;
          if (syncConfig.enableProgressLogging && processed % syncConfig.progressLogInterval === 0) {
            logger.syncProgress('Category', processed, mappingResult.results.length);
          }

        } catch (error) {
          this.updateStats(syncType, 'failed');
          logger.error(`Failed to sync category "${categoryData.name}": ${error.message}`);
        }
      }

      typeStats.endTime = new Date();
      const duration = typeStats.endTime - typeStats.startTime;
      typeStats.duration = Math.round(duration / 1000);

      logger.syncSuccess('Categories', typeStats);
      logger.info(`Category sync completed in ${Math.round(duration / 1000)}s`);

      // Create sync log
      await this.apiClient.createSyncLog(syncType, 'completed', typeStats);

    } catch (error) {
      typeStats.endTime = new Date();
      if (typeStats.startTime) {
        typeStats.duration = Math.round((typeStats.endTime - typeStats.startTime) / 1000);
      }
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Categories', error);
      throw error;
    }
  }

  /**
   * Synchronize menu items from CukCuk to Directus
   */
  async syncMenuItems() {
    const syncType = 'menu_items';
    const syncConfig = this.config.getSyncConfig(syncType);
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Menu items sync disabled, skipping...');
      return;
    }

    logger.syncStart('Menu Items');
    typeStats.startTime = new Date();

    // Resume / checkpoint detection and create in-progress sync_log
    const resumeEnabled = (syncConfig && syncConfig.resumeEnabled) || this.config.get('resumeEnabled');
    const resumeReset = (syncConfig && syncConfig.resumeReset) || this.config.get('resumeReset');
    let checkpoint = null;
    let syncLogId = null;

    try {
      if (resumeEnabled && !resumeReset) {
        const lastLog = await this.apiClient.findLatestSyncLog(syncType, ['failed', 'in_progress']);
        const lastCheckpoint = lastLog && lastLog.performance_metrics && lastLog.performance_metrics.checkpoint;
        if (lastCheckpoint && lastCheckpoint.branchId) {
          checkpoint = { branchId: lastCheckpoint.branchId, branchName: lastCheckpoint.branchName, page: lastCheckpoint.page || 1 };
          logger.info(`Resuming menu_items sync from branch ${checkpoint.branchId} page ${checkpoint.page}`);
        }
      }

      const initialLog = await this.apiClient.createSyncLog(syncType, 'in_progress', typeStats, null, {
        performanceMetrics: {
          api_calls: 0,
          avg_response_time: 0,
          memory_usage: process.memoryUsage(),
          checkpoint: checkpoint || null
        }
      });
      syncLogId = initialLog?.data?.id || null;
    } catch (e) {
      logger.warn(`Failed to create in-progress sync log: ${e.message}`);
    }

    try {
      // Fetch menu items from CukCuk (with resume options)
      const cukcukMenuItems = await this.apiClient.getCukCukMenuItems(false, null, {
        checkpoint,
        onCheckpoint: async (cp) => {
          if (!syncLogId) return;
          try {
            await this.apiClient.updateDirectusItem('sync_logs', syncLogId, {
              performance_metrics: {
                api_calls: 0,
                avg_response_time: 0,
                memory_usage: process.memoryUsage(),
                checkpoint: cp
              }
            });
          } catch (err) {
            logger.warn(`Failed to update checkpoint: ${err.message}`);
          }
        }
      });
      logger.info(`Found ${cukcukMenuItems.length} menu items in CukCuk`);

      if (cukcukMenuItems.length === 0) {
        logger.warn('No menu items found to sync');
        // finalize log as completed with zero records
        if (syncLogId) {
          try {
            await this.apiClient.updateDirectusItem('sync_logs', syncLogId, {
              status: 'completed',
              sync_completed_at: new Date().toISOString(),
              records_processed: 0,
              records_created: 0,
              records_updated: 0,
              records_failed: 0,
              duration_seconds: 0
            });
          } catch (e) {
            logger.warn(`Failed to finalize sync log: ${e.message}`);
          }
        } else {
          await this.apiClient.createSyncLog(syncType, 'completed', { created: 0, updated: 0, failed: 0 });
        }
        return;
      }

      // Map data
      const mappingResult = this.dataMapper.mapBatch(cukcukMenuItems, 'menu_item');
      logger.info(`Mapped ${mappingResult.successCount} menu items successfully`);

      if (mappingResult.errorCount > 0) {
        logger.warn(`${mappingResult.errorCount} menu items failed to map`);
        mappingResult.errors.forEach(error => {
          logger.error(`Mapping error: ${JSON.stringify(error)}`);
        });
      }

      // Process menu items
      let processed = 0;
      for (const menuItemData of mappingResult.results) {
        try {
          this.updateStats(syncType, 'processed');

          // Check if menu item already exists
          const existing = await this.apiClient.getDirectusItems('menu_items', {
            external_id: { _eq: menuItemData.external_id }
          }, 1);

          if (existing.data && existing.data.length > 0) {
            // Update existing menu item
            await this.apiClient.updateDirectusItem('menu_items', existing.data[0].id, menuItemData);
            this.updateStats(syncType, 'updated');
            logger.debug(`Updated menu item: ${menuItemData.name}`);
          } else {
            // Create new menu item
            await this.apiClient.createDirectusItem('menu_items', menuItemData);
            this.updateStats(syncType, 'created');
            logger.debug(`Created menu item: ${menuItemData.name}`);
          }

          processed++;
          const progressEnabled = (syncConfig && syncConfig.enableProgressLogging) || this.config.get('enableProgressLogging');
          const progressInterval = (syncConfig && syncConfig.progressLogInterval) || this.config.get('progressLogInterval');
          if (progressEnabled && processed % progressInterval === 0) {
            logger.syncProgress('Menu Item', processed, mappingResult.results.length);
            // Update partial progress to sync_log
            if (syncLogId) {
              try {
                const stats = this.getTypeStats(syncType);
                await this.apiClient.updateDirectusItem('sync_logs', syncLogId, {
                  records_processed: stats.created + stats.updated + stats.failed,
                  records_created: stats.created,
                  records_updated: stats.updated,
                  records_failed: stats.failed
                });
              } catch (e) {
                logger.warn(`Failed to update progress in sync log: ${e.message}`);
              }
            }
          }

        } catch (error) {
          this.updateStats(syncType, 'failed');
          logger.error(`Failed to sync menu item "${menuItemData.name}": ${error.message}`);
        }
      }

      typeStats.endTime = new Date();
      const duration = typeStats.endTime - typeStats.startTime;
      typeStats.duration = Math.round(duration / 1000);

      logger.syncSuccess('Menu Items', typeStats);
      logger.info(`Menu items sync completed in ${Math.round(duration / 1000)}s`);

      // Finalize sync log
      if (syncLogId) {
        try {
          await this.apiClient.updateDirectusItem('sync_logs', syncLogId, {
            status: 'completed',
            sync_completed_at: new Date().toISOString(),
            records_processed: typeStats.created + typeStats.updated + typeStats.failed,
            records_created: typeStats.created,
            records_updated: typeStats.updated,
            records_failed: typeStats.failed,
            duration_seconds: typeStats.duration
          });
        } catch (e) {
          logger.warn(`Failed to finalize sync log: ${e.message}`);
        }
      } else {
        await this.apiClient.createSyncLog(syncType, 'completed', typeStats);
      }

    } catch (error) {
      typeStats.endTime = new Date();
      if (typeStats.startTime) {
        typeStats.duration = Math.round((typeStats.endTime - typeStats.startTime) / 1000);
      }

      // Mark log as failed
      if (syncLogId) {
        try {
          await this.apiClient.updateDirectusItem('sync_logs', syncLogId, {
            status: 'failed',
            sync_completed_at: new Date().toISOString(),
            records_processed: typeStats.created + typeStats.updated + typeStats.failed,
            records_created: typeStats.created || 0,
            records_updated: typeStats.updated || 0,
            records_failed: typeStats.failed || 0,
            duration_seconds: typeStats.duration,
            last_error_message: error.message
          });
        } catch (e) {
          logger.warn(`Failed to update failed sync log: ${e.message}`);
        }
      } else {
        await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      }
      logger.syncError('Menu Items', error);
      throw error;
    }
  }

  /**
   * Synchronize tables from CukCuk to Directus
   */
  async syncTables() {
    const syncType = 'tables';
    const syncConfig = this.config.getSyncConfig(syncType);
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Tables sync disabled, skipping...');
      return;
    }

    logger.syncStart('Tables');
    typeStats.startTime = new Date();

    try {
      // Fetch tables from CukCuk (get all tables from all branches)
      const cukcukTables = await this.apiClient.getCukCukAllTables(false);
      logger.info(`Found ${cukcukTables.length} tables in CukCuk`);

      if (cukcukTables.length === 0) {
        logger.warn('No tables found to sync');
        await this.apiClient.createSyncLog(syncType, 'completed', { created: 0, updated: 0, failed: 0 });
        return;
      }

      // Map data
      const mappingResult = this.dataMapper.mapBatch(cukcukTables, 'table');
      logger.info(`Mapped ${mappingResult.successCount} tables successfully`);

      if (mappingResult.errorCount > 0) {
        logger.warn(`${mappingResult.errorCount} tables failed to map`);
        mappingResult.errors.forEach(error => {
          logger.error(`Mapping error: ${JSON.stringify(error)}`);
        });
      }

      // Process tables
      let processed = 0;
      for (const tableData of mappingResult.results) {
        try {
          this.updateStats(syncType, 'processed');

          // Check if table already exists
          const existing = await this.apiClient.getDirectusItems('tables', {
            external_id: { _eq: tableData.external_id }
          }, 1);

          if (existing.data && existing.data.length > 0) {
            // Update existing table
            await this.apiClient.updateDirectusItem('tables', existing.data[0].id, tableData);
            this.updateStats(syncType, 'updated');
            logger.debug(`Updated table: ${tableData.name}`);
          } else {
            // Create new table
            await this.apiClient.createDirectusItem('tables', tableData);
            this.updateStats(syncType, 'created');
            logger.debug(`Created table: ${tableData.name}`);
          }

          processed++;
          if (syncConfig.enableProgressLogging && processed % syncConfig.progressLogInterval === 0) {
            logger.syncProgress('Table', processed, mappingResult.results.length);
          }

        } catch (error) {
          this.updateStats(syncType, 'failed');
          logger.error(`Failed to sync table "${tableData.name}": ${error.message}`);
        }
      }

      typeStats.endTime = new Date();
      const duration = typeStats.endTime - typeStats.startTime;
      typeStats.duration = Math.round(duration / 1000);

      logger.syncSuccess('Tables', typeStats);
      logger.info(`Tables sync completed in ${Math.round(duration / 1000)}s`);

      // Create sync log
      await this.apiClient.createSyncLog(syncType, 'completed', typeStats);

    } catch (error) {
      typeStats.endTime = new Date();
      if (typeStats.startTime) {
        typeStats.duration = Math.round((typeStats.endTime - typeStats.startTime) / 1000);
      }
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Tables', error);
      throw error;
    }
  }

  /**
   * Synchronize layouts from CukCuk to Directus
   */
  async syncLayouts() {
    const syncType = 'layouts';
    const syncConfig = this.config.getSyncConfig(syncType);
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Layouts sync disabled, skipping...');
      return;
    }

    logger.syncStart('Layouts');
    typeStats.startTime = new Date();

    try {
      // Fetch layouts from CukCuk
      const cukcukLayouts = await this.apiClient.getCukCukLayouts(false);
      logger.info(`Found ${cukcukLayouts.length} layouts in CukCuk`);

      if (cukcukLayouts.length === 0) {
        logger.warn('No layouts found to sync');
        await this.apiClient.createSyncLog(syncType, 'completed', { created: 0, updated: 0, failed: 0 });
        return;
      }

      // Map data
      const mappingResult = this.dataMapper.mapBatch(cukcukLayouts, 'layout');
      logger.info(`Mapped ${mappingResult.successCount} layouts successfully`);

      if (mappingResult.errorCount > 0) {
        logger.warn(`${mappingResult.errorCount} layouts failed to map`);
        mappingResult.errors.forEach(error => {
          logger.error(`Mapping error: ${JSON.stringify(error)}`);
        });
      }

      // Process layouts
      let processed = 0;
      for (const layoutData of mappingResult.results) {
        try {
          this.updateStats(syncType, 'processed');

          // Check if layout already exists
          const existing = await this.apiClient.getDirectusItems('layouts', {
            external_id: { _eq: layoutData.external_id }
          }, 1);

          if (existing.data && existing.data.length > 0) {
            // Update existing layout
            await this.apiClient.updateDirectusItem('layouts', existing.data[0].id, layoutData);
            this.updateStats(syncType, 'updated');
            logger.debug(`Updated layout: ${layoutData.name}`);
          } else {
            // Create new layout
            await this.apiClient.createDirectusItem('layouts', layoutData);
            this.updateStats(syncType, 'created');
            logger.debug(`Created layout: ${layoutData.name}`);
          }

          processed++;
          if (syncConfig.enableProgressLogging && processed % syncConfig.progressLogInterval === 0) {
            logger.syncProgress('Layout', processed, mappingResult.results.length);
          }

        } catch (error) {
          this.updateStats(syncType, 'failed');
          logger.error(`Failed to sync layout "${layoutData.name}": ${error.message}`);
        }
      }

      typeStats.endTime = new Date();
      const duration = typeStats.endTime - typeStats.startTime;
      typeStats.duration = Math.round(duration / 1000);

      logger.syncSuccess('Layouts', typeStats);
      logger.info(`Layouts sync completed in ${Math.round(duration / 1000)}s`);

      // Create sync log
      await this.apiClient.createSyncLog(syncType, 'completed', typeStats);

    } catch (error) {
      typeStats.endTime = new Date();
      if (typeStats.startTime) {
        typeStats.duration = Math.round((typeStats.endTime - typeStats.startTime) / 1000);
      }
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Layouts', error);
      throw error;
    }
  }

  /**
   * Run the complete synchronization
   */
  async run() {
    this.stats.startTime = new Date();

    try {
      await this.initialize();

      // Skip branches and tables per temporary disable; remove layouts entirely
      // const branchMap = await this.syncBranches();
      const branchMap = new Map();
      await this.syncCategories(branchMap);

      logger.debug('Starting menu_items synchronization (branches disabled, layouts removed)');
      await this.syncMenuItems(branchMap);
      // await this.syncTables(branchMap); // temporarily disabled
      // await this.syncLayouts(branchMap); // removed per request

      // Finalize
      this.stats.endTime = new Date();
      const totalDuration = this.stats.endTime - this.stats.startTime;

      this.printSummary(totalDuration);

      if (this.stats.totalFailed === 0) {
        logger.success('🎉 All synchronizations completed successfully!');
        process.exit(0);
      } else {
        logger.warn(`Synchronization completed with ${this.stats.totalFailed} errors`);
        process.exit(1);
      }

    } catch (error) {
      this.stats.endTime = new Date();
      logger.error(`Synchronization failed: ${error.message}`);
      if (this.config.get('enableDetailedLogging')) {
        logger.error('Stack trace:', error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Print synchronization summary
   */
  printSummary(duration) {
    logger.section('Synchronization Summary');

    const summary = {
      totalDuration: Math.round(duration / 1000),
      totalProcessed: this.stats.totalProcessed,
      totalCreated: this.stats.totalCreated,
      totalUpdated: this.stats.totalUpdated,
      totalFailed: this.stats.totalFailed,
      syncTypes: {}
    };

    for (const [type, stats] of Object.entries(this.stats.syncTypes)) {
      if (stats.processed > 0) {
        summary.syncTypes[type] = {
          processed: stats.processed,
          created: stats.created,
          updated: stats.updated,
          failed: stats.failed,
          duration: stats.endTime ? Math.round((stats.endTime - stats.startTime) / 1000) : 0
        };
      }
    }

    logger.info(`Total Duration: ${summary.totalDuration}s`);
    logger.info(`Total Processed: ${summary.totalProcessed}`);
    logger.info(`Total Created: ${summary.totalCreated}`);
    logger.info(`Total Updated: ${summary.totalUpdated}`);
    logger.info(`Total Failed: ${summary.totalFailed}`);

    logger.info('\nSync Type Details:');
    for (const [type, stats] of Object.entries(summary.syncTypes)) {
      logger.info(`  ${type}:`);
      logger.info(`    Processed: ${stats.processed}`);
      logger.info(`    Created: ${stats.created}`);
      logger.info(`    Updated: ${stats.updated}`);
      logger.info(`    Failed: ${stats.failed}`);
      logger.info(`    Duration: ${stats.duration}s`);
    }
  }

  /**
   * Get current sync status
   */
  getStatus() {
    return {
      isRunning: this.stats.startTime !== null && this.stats.endTime === null,
      stats: this.stats,
      config: this.config.getSummary()
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    logger.info('Shutting down sync system...');
    this.stats.endTime = new Date();

    if (this.stats.totalProcessed > 0) {
      this.printSummary(this.stats.endTime - this.stats.startTime);
    }

    logger.info('Sync system shutdown complete');
    process.exit(0);
  }
}

// Graceful shutdown handling
const sync = new CukCukSync();

process.on('SIGINT', async () => {
  logger.info('\nReceived SIGINT signal');
  await sync.shutdown();
});

process.on('SIGTERM', async () => {
  logger.info('\nReceived SIGTERM signal');
  await sync.shutdown();
});

process.on('uncaughtException', async (error) => {
  logger.error('Uncaught Exception:', error);
  await sync.shutdown();
});

process.on('unhandledRejection', async (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await sync.shutdown();
});

// Start the sync
if (require.main === module) {
  sync.run().catch(error => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = CukCukSync;