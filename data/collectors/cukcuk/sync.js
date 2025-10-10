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

require('dotenv').config();

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
    if (!validation.valid) {
      logger.error('Configuration validation failed');
      logger.error('Errors:', validation.errors.join(', '));
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
    this.stats.totalProcessed += count;

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
      for (const branchData of mappingResult.results) {
        try {
          this.updateStats(syncType, 'processed');

          // Check if branch already exists
          const existing = await this.apiClient.getDirectusItems('branches', {
            external_id: { _eq: branchData.external_id }
          }, 1);

          if (existing.data && existing.data.length > 0) {
            // Update existing branch
            await this.apiClient.updateDirectusItem('branches', existing.data[0].id, branchData);
            this.updateStats(syncType, 'updated');
            logger.debug(`Updated branch: ${branchData.name}`);
          } else {
            // Create new branch
            await this.apiClient.createDirectusItem('branches', branchData);
            this.updateStats(syncType, 'created');
            logger.debug(`Created branch: ${branchData.name}`);
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

      logger.syncSuccess('Branches', typeStats);
      logger.info(`Branch sync completed in ${Math.round(duration / 1000)}s`);

      // Create sync log
      await this.apiClient.createSyncLog(syncType, 'completed', typeStats);

    } catch (error) {
      typeStats.endTime = new Date();
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Branches', error);
      throw error;
    }
  }

  /**
   * Synchronize categories from CukCuk to Directus
   */
  async syncCategories() {
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

      // Map data
      const mappingResult = this.dataMapper.mapBatch(cukcukCategories, 'category');
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

      logger.syncSuccess('Categories', typeStats);
      logger.info(`Category sync completed in ${Math.round(duration / 1000)}s`);

      // Create sync log
      await this.apiClient.createSyncLog(syncType, 'completed', typeStats);

    } catch (error) {
      typeStats.endTime = new Date();
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
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Menu items sync disabled, skipping...');
      return;
    }

    logger.syncStart('Menu Items');
    typeStats.startTime = new Date();

    try {
      logger.warn('Menu items sync not yet implemented - CukCuk API method needs to be added');
      logger.info('Skipping menu items sync for now');

      typeStats.endTime = new Date();
      await this.apiClient.createSyncLog(syncType, 'skipped', { created: 0, updated: 0, failed: 0 });

    } catch (error) {
      typeStats.endTime = new Date();
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Menu Items', error);
      throw error;
    }
  }

  /**
   * Synchronize tables from CukCuk to Directus
   */
  async syncTables() {
    const syncType = 'tables';
    const typeStats = this.getTypeStats(syncType);

    if (!this.config.get('syncTypes').includes(syncType)) {
      logger.info('Tables sync disabled, skipping...');
      return;
    }

    logger.syncStart('Tables');
    typeStats.startTime = new Date();

    try {
      logger.warn('Tables sync not yet implemented - CukCuk API method needs to be added');
      logger.info('Skipping tables sync for now');

      typeStats.endTime = new Date();
      await this.apiClient.createSyncLog(syncType, 'skipped', { created: 0, updated: 0, failed: 0 });

    } catch (error) {
      typeStats.endTime = new Date();
      await this.apiClient.createSyncLog(syncType, 'failed', typeStats, error.message);
      logger.syncError('Tables', error);
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

      // Run sync operations in order
      await this.syncBranches();
      await this.syncCategories();
      await this.syncMenuItems();
      await this.syncTables();

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