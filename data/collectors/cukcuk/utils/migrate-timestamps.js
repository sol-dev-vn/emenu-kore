#!/usr/bin/env node

/**
 * Migration script to add timestamp fields to sync_logs collection
 * This script adds: started_at, completed_at, and duration_seconds fields
 */

require('dotenv').config();
const axios = require('axios');
const { logger } = require('./logger');

class Migration {
  constructor() {
    this.directusUrl = process.env.DIRECTUS_URL;
    this.directusToken = process.env.DIRECTUS_API_TOKEN;
    this.client = axios.create({
      baseURL: this.directusUrl,
      headers: {
        'Authorization': `Bearer ${this.directusToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async addTimestampField(fieldName) {
    logger.info(`Adding field: ${fieldName}`);

    try {
      const fieldConfig = {
        collection: 'sync_logs',
        field: fieldName,
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          options: {},
          display: 'datetime',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: this.getFieldNote(fieldName)
        },
        schema: {
          name: fieldName,
          is_primary: false,
          default_value: null
        }
      };

      const response = await this.client.post(`/collections/sync_logs/fields`, fieldConfig);
      logger.success(`Field ${fieldName} added successfully`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        logger.warn(`Field ${fieldName} already exists`);
        return;
      }
      logger.error(`API error: ${JSON.stringify(error.response?.data || error.message)}`);
      throw error;
    }
  }

  getFieldNote(fieldName) {
    const notes = {
      'started_at': 'When the sync operation started',
      'completed_at': 'When the sync operation completed',
      'duration_seconds': 'Duration of the sync operation in seconds'
    };
    return notes[fieldName] || '';
  }

  async runMigration() {
    logger.section('Adding Timestamp Fields to sync_logs Collection');

    try {
      // Test connection
      await this.client.get('/server/info');
      logger.success('Connected to Directus');

      // Fields to add
      const fields = ['started_at', 'completed_at', 'duration_seconds'];
      let successCount = 0;
      let errorCount = 0;

      for (const fieldName of fields) {
        try {
          await this.addTimestampField(fieldName);
          successCount++;
        } catch (error) {
          logger.error(`Failed to add field ${fieldName}: ${error.message}`);
          errorCount++;
        }
      }

      logger.section('Migration Summary');
      logger.info(`Successfully added: ${successCount} fields`);
      logger.info(`Failed to add: ${errorCount} fields`);

      if (errorCount === 0) {
        logger.success('Migration completed successfully!');
        process.exit(0);
      } else {
        logger.error('Migration completed with errors');
        process.exit(1);
      }

    } catch (error) {
      logger.error(`Migration failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the migration
const migration = new Migration();
migration.runMigration().catch(error => {
  logger.error('Fatal migration error:', error);
  process.exit(1);
});