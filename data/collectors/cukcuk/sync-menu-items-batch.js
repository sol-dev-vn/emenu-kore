#!/usr/bin/env node

/**
 * Menu Items Batch Sync Script
 * Processes menu items in smaller batches to avoid memory issues
 */

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs').promises;

// Load env from project root, fallback to cukcuk collector directory
const rootEnv = dotenv.config();
if (rootEnv.error) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

const { logger } = require('./utils/logger');
const { ApiClient } = require('./utils/api-client');
const { DataMapper } = require('./utils/data-mapper');
const { syncConfig } = require('./utils/sync-config');

class MenuItemsBatchSync {
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
      totalFailed: 0
    };
  }

  async initialize() {
    logger.section('Menu Items Batch Synchronization');
    logger.info('Processing menu items in small batches to avoid memory issues');

    // Test API connections
    await this.testConnections();
    logger.success('Batch sync initialized successfully');
  }

  async testConnections() {
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

  async syncMenuItemsBatch() {
    try {
      logger.info('Starting batch menu items synchronization...');

      // Step 1: Get branches for mapping
      const branches = await this.apiClient.getCukCukBranches(false);
      logger.info(`Found ${branches.length} branches for mapping`);

      // Create branch map
      const branchMap = new Map();
      for (const branch of branches) {
        const existing = await this.apiClient.getDirectusItems('branches', {
          external_id: { _eq: branch.Id }
        }, 1);

        if (existing.data && existing.data.length > 0) {
          branchMap.set(branch.Id, existing.data[0].id);
        }
      }
      logger.info(`Created branch map with ${branchMap.size} mappings`);

      // Step 2: Get categories for mapping
      const categories = await this.apiClient.getCukCukCategories(false);
      logger.info(`Found ${categories.length} categories for mapping`);

      // Create category map
      const categoryMap = new Map();
      for (const category of categories) {
        const existing = await this.apiClient.getDirectusItems('categories', {
          external_id: { _eq: category.Id }
        }, 1);

        if (existing.data && existing.data.length > 0) {
          categoryMap.set(category.Id, existing.data[0].id);
        }
      }
      logger.info(`Created category map with ${categoryMap.size} mappings`);

      // Step 3: Get menu items data (this will save to JSON file)
      logger.info('Fetching menu items from CukCuk...');
      const allMenuItems = await this.apiClient.getCukCukMenuItems(false);
      logger.info(`Fetched ${allMenuItems.length} total menu items`);

      // Step 4: Process in small batches
      const batchSize = 50;
      const totalBatches = Math.ceil(allMenuItems.length / batchSize);
      logger.info(`Processing ${allMenuItems.length} items in ${totalBatches} batches of ${batchSize}`);

      for (let i = 0; i < totalBatches; i++) {
        const startIdx = i * batchSize;
        const endIdx = Math.min(startIdx + batchSize, allMenuItems.length);
        const batch = allMenuItems.slice(startIdx, endIdx);

        logger.info(`Processing batch ${i + 1}/${totalBatches} (${batch.length} items)`);

        // Map batch data
        const mappingResult = this.dataMapper.mapBatch(batch, 'menu_item', branchMap, categoryMap);

        // Process mapped items
        for (const menuItemData of mappingResult.results) {
          try {
            // Check if menu item already exists
            const existing = await this.apiClient.getDirectusItems('menu_items', {
              external_id: { _eq: menuItemData.external_id }
            }, 1);

            if (existing.data && existing.data.length > 0) {
              // Update existing menu item
              await this.apiClient.updateDirectusItem('menu_items', existing.data[0].id, menuItemData);
              await this.apiClient.updateDirectusItem('menu_items', existing.data[0].id, {
                sync_status: 'synced',
                last_sync_at: new Date().toISOString()
              });
              this.stats.totalUpdated++;
              logger.debug(`Updated menu item: ${menuItemData.name}`);
            } else {
              // Create new menu item
              const createData = {
                ...menuItemData,
                sync_status: 'synced',
                last_sync_at: new Date().toISOString()
              };
              await this.apiClient.createDirectusItem('menu_items', createData);
              this.stats.totalCreated++;
              logger.debug(`Created menu item: ${menuItemData.name}`);
            }
            this.stats.totalProcessed++;
          } catch (error) {
            this.stats.totalFailed++;
            logger.error(`Failed to sync menu item "${menuItemData.name}": ${error.message}`);
          }
        }

        // Garbage collection and pause between batches
        if (global.gc) {
          global.gc();
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

        logger.info(`Batch ${i + 1} completed. Progress: ${this.stats.totalProcessed}/${allMenuItems.length}`);
      }

      this.stats.endTime = new Date();
      const duration = Math.round((this.stats.endTime - this.stats.startTime) / 1000);

      logger.success('Menu items batch sync completed!');
      logger.info(`Total Duration: ${duration}s`);
      logger.info(`Total Processed: ${this.stats.totalProcessed}`);
      logger.info(`Total Created: ${this.stats.totalCreated}`);
      logger.info(`Total Updated: ${this.stats.totalUpdated}`);
      logger.info(`Total Failed: ${this.stats.totalFailed}`);

    } catch (error) {
      logger.error(`Batch sync failed: ${error.message}`);
      throw error;
    }
  }

  async run() {
    this.stats.startTime = new Date();
    try {
      await this.initialize();
      await this.syncMenuItemsBatch();

      if (this.stats.totalFailed === 0) {
        logger.success('🎉 Menu items synchronization completed successfully!');
        process.exit(0);
      } else {
        logger.warn(`Synchronization completed with ${this.stats.totalFailed} errors`);
        process.exit(1);
      }
    } catch (error) {
      this.stats.endTime = new Date();
      logger.error(`Synchronization failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Start the batch sync
const batchSync = new MenuItemsBatchSync();
batchSync.run().catch(error => {
  logger.error('Fatal error:', error);
  process.exit(1);
});