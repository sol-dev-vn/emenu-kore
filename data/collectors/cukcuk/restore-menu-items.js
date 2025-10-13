#!/usr/bin/env node

/**
 * SOL eMenu - Menu Items Restoration from Raw Data
 *
 * Restores menu items from raw JSON data file to Directus backend
 * Processes data in batches of 100 records with proper branch and category mapping
 * Based on the existing sync.js logic
 */

const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { logger } = require('./utils/logger');
const { ApiClient } = require('./utils/api-client');
const { DataMapper } = require('./utils/data-mapper');
const { syncConfig } = require('./utils/sync-config');

class MenuItemsRestorer {
  constructor() {
    this.apiClient = new ApiClient();
    this.dataMapper = new DataMapper();
    this.config = syncConfig;
    this.batchSize = 100;
    this.stats = {
      startTime: new Date(),
      endTime: null,
      totalProcessed: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalFailed: 0,
      batches: []
    };
  }

  /**
   * Initialize the restoration system
   */
  async initialize() {
    logger.section('SOL eMenu - Menu Items Restoration');
    logger.info(`Batch size: ${this.batchSize} records`);

    // Validate configuration
    const validation = this.config.validate();
    if (!validation.isValid) {
      logger.error('Configuration validation failed');
      if (validation.errors && validation.errors.length) {
        logger.error(`Errors: ${validation.errors.join(', ')}`);
      }
      throw new Error('Invalid configuration');
    }

    // Test API connections
    await this.testConnections();
    logger.success('Restoration system initialized successfully');
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

    } catch (error) {
      logger.error(`Connection test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load raw data from JSON file
   */
  async loadRawData(filePath) {
    try {
      const fullPath = path.resolve(__dirname, filePath);
      const fileContent = await fs.readFile(fullPath, 'utf8');
      const data = JSON.parse(fileContent);

      logger.info(`Loaded raw data from: ${fullPath}`);
      logger.info(`Metadata: ${JSON.stringify(data.metadata, null, 2)}`);
      logger.info(`Total menu items: ${data.menu_items.length}`);

      return data;
    } catch (error) {
      logger.error(`Failed to load raw data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get existing branches from Directus for mapping
   */
  async getBranchMapping() {
    logger.info('Building branch mapping from Directus...');

    try {
      const branches = await this.apiClient.getDirectusItems('branches', {}, null, {
        sort: ['name']
      });

      const branchMap = new Map();
      if (branches.data && branches.data.length > 0) {
        branches.data.forEach(branch => {
          if (branch.external_id) {
            branchMap.set(branch.external_id, branch.id);
            logger.debug(`Branch mapping: ${branch.external_id} -> ${branch.id} (${branch.name})`);
          }
        });
      }

      logger.info(`Built branch mapping with ${branchMap.size} branches`);
      return branchMap;
    } catch (error) {
      logger.error(`Failed to get branch mapping: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get existing categories from Directus for mapping
   */
  async getCategoryMapping() {
    logger.info('Building category mapping from Directus...');

    try {
      const categories = await this.apiClient.getDirectusItems('categories', {}, null, {
        sort: ['name']
      });

      const categoryMap = new Map();
      if (categories.data && categories.data.length > 0) {
        categories.data.forEach(category => {
          if (category.external_id) {
            categoryMap.set(category.external_id, category.id);
            logger.debug(`Category mapping: ${category.external_id} -> ${category.id} (${category.name})`);
          }
        });
      }

      logger.info(`Built category mapping with ${categoryMap.size} categories`);
      return categoryMap;
    } catch (error) {
      logger.error(`Failed to get category mapping: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process a single batch of menu items
   */
  async processBatch(batchItems, batchNumber, branchMap, categoryMap) {
    const batchStats = {
      batchNumber,
      startTime: new Date(),
      endTime: null,
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    logger.info(`Processing batch ${batchNumber} (${batchItems.length} items)`);
    batchStats.startTime = new Date();

    // Map data using existing data mapper
    const mappingResult = this.dataMapper.mapBatch(batchItems, 'menu_item', branchMap, categoryMap);
    logger.info(`Mapped ${mappingResult.successCount} menu items successfully`);

    if (mappingResult.errorCount > 0) {
      logger.warn(`${mappingResult.errorCount} menu items failed to map`);
      mappingResult.errors.forEach(error => {
        logger.error(`Mapping error: ${JSON.stringify(error)}`);
        batchStats.errors.push(error);
      });
    }

    // Process each menu item
    for (const menuItemData of mappingResult.results) {
      try {
        this.stats.totalProcessed++;
        batchStats.processed++;

        // Check if menu item already exists
        const existing = await this.apiClient.getDirectusItems('menu_items', {
          external_id: { _eq: menuItemData.external_id }
        }, 1);

        if (existing.data && existing.data.length > 0) {
          // Update existing menu item
          await this.apiClient.updateDirectusItem('menu_items', existing.data[0].id, menuItemData);

          // Update sync status and timestamp
          await this.apiClient.updateDirectusItem('menu_items', existing.data[0].id, {
            sync_status: 'synced',
            last_sync_at: new Date().toISOString()
          });

          this.stats.totalUpdated++;
          batchStats.updated++;
          logger.debug(`Updated menu item: ${menuItemData.name} (ID: ${existing.data[0].id})`);
        } else {
          // Create new menu item with sync status
          const createData = {
            ...menuItemData,
            sync_status: 'synced',
            last_sync_at: new Date().toISOString()
          };
          await this.apiClient.createDirectusItem('menu_items', createData);
          this.stats.totalCreated++;
          batchStats.created++;
          logger.debug(`Created menu item: ${menuItemData.name}`);
        }

      } catch (error) {
        this.stats.totalFailed++;
        batchStats.failed++;

        // Try to update sync status to failed if we have an existing record
        try {
          const existing = await this.apiClient.getDirectusItems('menu_items', {
            external_id: { _eq: menuItemData.external_id }
          }, 1);

          if (existing.data && existing.data.length > 0) {
            await this.apiClient.updateDirectusItem('menu_items', existing.data[0].id, {
              sync_status: 'failed',
              last_sync_at: new Date().toISOString()
            });
          }
        } catch (updateError) {
          // Ignore if we can't update the failed status
        }

        logger.error(`Failed to process menu item "${menuItemData.name}": ${error.message}`);
        batchStats.errors.push({
          menuItem: menuItemData.name,
          external_id: menuItemData.external_id,
          error: error.message
        });
      }
    }

    batchStats.endTime = new Date();
    const duration = batchStats.endTime - batchStats.startTime;
    batchStats.duration = Math.round(duration / 1000);

    this.stats.batches.push(batchStats);
    logger.info(`Batch ${batchNumber} completed in ${batchStats.duration}s: ` +
                `${batchStats.created} created, ${batchStats.updated} updated, ${batchStats.failed} failed`);

    return batchStats;
  }

  /**
   * Run the complete restoration
   */
  async run(rawDataFilePath) {
    this.stats.startTime = new Date();

    try {
      await this.initialize();

      // Load raw data
      const rawData = await this.loadRawData(rawDataFilePath);
      const menuItems = rawData.menu_items;

      if (!menuItems || menuItems.length === 0) {
        logger.warn('No menu items found in raw data');
        return;
      }

      // Get branch and category mappings
      const branchMap = await this.getBranchMapping();
      const categoryMap = await this.getCategoryMapping();

      logger.info(`Starting restoration of ${menuItems.length} menu items in batches of ${this.batchSize}`);
      logger.info(`Branch mapping: ${branchMap.size} branches`);
      logger.info(`Category mapping: ${categoryMap.size} categories`);

      // Process in batches
      const totalBatches = Math.ceil(menuItems.length / this.batchSize);
      for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * this.batchSize;
        const endIndex = Math.min(startIndex + this.batchSize, menuItems.length);
        const batch = menuItems.slice(startIndex, endIndex);

        logger.info(`Processing batch ${i + 1}/${totalBatches} (items ${startIndex + 1}-${endIndex})`);

        await this.processBatch(batch, i + 1, branchMap, categoryMap);

        // Small delay between batches to avoid overwhelming the API
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Finalize
      this.stats.endTime = new Date();
      const totalDuration = this.stats.endTime - this.stats.startTime;

      this.printSummary(totalDuration);

      // Create restoration log
      await this.createRestorationLog();

      if (this.stats.totalFailed === 0) {
        logger.success('🎉 All menu items restored successfully!');
        process.exit(0);
      } else {
        logger.warn(`Restoration completed with ${this.stats.totalFailed} errors`);
        process.exit(1);
      }

    } catch (error) {
      this.stats.endTime = new Date();
      logger.error(`Restoration failed: ${error.message}`);
      if (this.config.get('enableDetailedLogging')) {
        logger.error('Stack trace:', error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Print restoration summary
   */
  printSummary(duration) {
    logger.section('Restoration Summary');

    const summary = {
      totalDuration: Math.round(duration / 1000),
      totalProcessed: this.stats.totalProcessed,
      totalCreated: this.stats.totalCreated,
      totalUpdated: this.stats.totalUpdated,
      totalFailed: this.stats.totalFailed,
      totalBatches: this.stats.batches.length
    };

    logger.info(`Total Duration: ${summary.totalDuration}s`);
    logger.info(`Total Processed: ${summary.totalProcessed}`);
    logger.info(`Total Created: ${summary.totalCreated}`);
    logger.info(`Total Updated: ${summary.totalUpdated}`);
    logger.info(`Total Failed: ${summary.totalFailed}`);
    logger.info(`Total Batches: ${summary.totalBatches}`);

    if (this.stats.batches.length > 0) {
      logger.info('\nBatch Details:');
      this.stats.batches.forEach(batch => {
        logger.info(`  Batch ${batch.batchNumber}: ` +
                   `${batch.created} created, ${batch.updated} updated, ` +
                   `${batch.failed} failed (${batch.duration}s)`);
        if (batch.errors.length > 0) {
          batch.errors.slice(0, 3).forEach(error => {
            logger.warn(`    Error: ${error.menuItem} - ${error.error}`);
          });
          if (batch.errors.length > 3) {
            logger.warn(`    ... and ${batch.errors.length - 3} more errors`);
          }
        }
      });
    }
  }

  /**
   * Create restoration log in Directus
   */
  async createRestorationLog() {
    try {
      const logData = {
        sync_type: 'menu_items_restoration',
        source: 'raw_data_file',
        status: this.stats.totalFailed === 0 ? 'completed' : 'completed_with_errors',
        records_processed: this.stats.totalProcessed,
        records_created: this.stats.totalCreated,
        records_updated: this.stats.totalUpdated,
        records_failed: this.stats.totalFailed,
        started_at: this.stats.startTime.toISOString(),
        completed_at: this.stats.endTime.toISOString(),
        duration_seconds: Math.round((this.stats.endTime - this.stats.startTime) / 1000),
        triggered_by: 'manual_restoration',
        batch_id: `restoration-${new Date().toISOString().replace(/[:.]/g, '-')}`,
        performance_metrics: {
          total_batches: this.stats.batches.length,
          avg_batch_duration: this.stats.batches.length > 0
            ? Math.round(this.stats.batches.reduce((sum, batch) => sum + batch.duration, 0) / this.stats.batches.length)
            : 0,
          memory_usage: process.memoryUsage()
        },
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString()
      };

      await this.apiClient.createDirectusItem('sync_logs', logData);
      logger.success('Restoration log created in Directus');
    } catch (error) {
      logger.warn(`Failed to create restoration log: ${error.message}`);
    }
  }

  /**
   * Get current restoration status
   */
  getStatus() {
    return {
      isRunning: this.stats.startTime !== null && this.stats.endTime === null,
      stats: this.stats,
      config: this.config.getSummary()
    };
  }
}

// Graceful shutdown handling
const restorer = new MenuItemsRestorer();

process.on('SIGINT', async () => {
  logger.info('\nReceived SIGINT signal');
  if (restorer.getStatus().isRunning) {
    restorer.stats.endTime = new Date();
    restorer.printSummary(restorer.stats.endTime - restorer.stats.startTime);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('\nReceived SIGTERM signal');
  if (restorer.getStatus().isRunning) {
    restorer.stats.endTime = new Date();
    restorer.printSummary(restorer.stats.endTime - restorer.stats.startTime);
  }
  process.exit(0);
});

// Start the restoration
if (require.main === module) {
  const rawDataFilePath = process.argv[2] || '../data/raw/items_raw_001.json';

  logger.info(`Starting menu items restoration from: ${rawDataFilePath}`);

  restorer.run(rawDataFilePath).catch(error => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = MenuItemsRestorer;