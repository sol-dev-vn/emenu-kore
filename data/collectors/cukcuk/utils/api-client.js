#!/usr/bin/env node

/**
 * API client utilities for CukCuk and Directus
 * Provides unified interface for both APIs with retry logic and error handling
 */

const axios = require('axios');
const { CukCukClient } = require('@luutronghieu/cukcuk-api-client');
const { logger } = require('./logger');

class ApiClient {
  constructor(config = {}) {
    this.directusUrl = config.directusUrl || process.env.DIRECTUS_URL;
    this.directusToken = config.directusToken || process.env.DIRECTUS_API_TOKEN;
    this.cukcukConfig = {
      secretKey: process.env.CUKCUK_SECRET_KEY,
      domain: process.env.CUKCUK_DOMAIN,
      appId: process.env.CUKCUK_APP_ID,
      companyCode: process.env.CUKCUK_COMPANY_CODE,
      baseUrl: process.env.CUKCUK_API_BASE_URL || 'https://graphapi.cukcuk.vn'
    };
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;

    // Initialize clients
    this.directus = this.createDirectusClient();
    this.cukcuk = null;
  }

  createDirectusClient() {
    return axios.create({
      baseURL: this.directusUrl,
      headers: {
        'Authorization': `Bearer ${this.directusToken}`,
        'Content-Type': 'application/json'
      },
      timeout: this.timeout
    });
  }

  async initializeCukCukClient() {
    if (this.cukcuk) {
      return this.cukcuk;
    }

    try {
      logger.info('Initializing CukCuk API client...');
      this.cukcuk = new CukCukClient(this.cukcukConfig);

      await this.cukcuk.account.login({
        Domain: this.cukcukConfig.domain,
        AppId: this.cukcukConfig.appId,
        LoginTime: new Date().toISOString(),
      });

      logger.success('CukCuk client initialized successfully');
      return this.cukcuk;
    } catch (error) {
      logger.error(`Failed to initialize CukCuk client: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generic retry wrapper for API calls
   */
  async withRetry(operation, retries = this.maxRetries) {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;

        if (attempt > 1) {
          logger.success(`Operation succeeded on attempt ${attempt}`);
        }

        return result;
      } catch (error) {
        lastError = error;
        const isRetryable = this.isRetryableError(error);

        if (!isRetryable || attempt === retries) {
          throw error;
        }

        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms: ${error.message}`);

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  isRetryableError(error) {
    // Network errors or 5xx server errors are retryable
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // HTTP status codes that are retryable
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    return retryableStatusCodes.includes(error.response?.status);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // CukCuk API methods
  async getCukCukBranches(includeInactive = false) {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();
      const result = await client.branches.getAll({ includeInactive });
      const branches = result.Data || result.data || result;
      const count = Array.isArray(branches) ? branches.length : 0;

      logger.success(`Retrieved ${count} branches from CukCuk`);
      return branches;
    });
  }

  async getCukCukCategories(includeInactive = false) {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();
      const result = await client.categories.getList({ includeInactive });
      const categories = result.Data || result.data || result;
      const count = Array.isArray(categories) ? categories.length : 0;

      logger.success(`Retrieved ${count} categories from CukCuk`);
      return categories;
    });
  }

  async getCukCukMenuItems() {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();
      // Note: This method would need to be implemented based on the actual CukCuk menu items API
      logger.warn('Menu items API not yet implemented in CukCuk client');
      return [];
    });
  }

  async getCukCukTables() {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();
      // Note: This method would need to be implemented based on the actual CukCuk tables API
      logger.warn('Tables API not yet implemented in CukCuk client');
      return [];
    });
  }

  // Directus API methods
  async testDirectusConnection() {
    return this.withRetry(async () => {
      const response = await this.directus.get('/server/info');
      logger.logConnection('Directus', 'connected', response.data.project?.project_name);
      return response.data;
    });
  }

  async getDirectusItems(collection, filters = {}, limit = null) {
    return this.withRetry(async () => {
      const params = { filter: filters };
      if (limit) params.limit = limit;

      const response = await this.directus.get(`/items/${collection}`, { params });
      return response.data;
    });
  }

  async createDirectusItem(collection, data) {
    return this.withRetry(async () => {
      const response = await this.directus.post(`/items/${collection}`, data);
      return response.data;
    });
  }

  async updateDirectusItem(collection, id, data) {
    return this.withRetry(async () => {
      const response = await this.directus.patch(`/items/${collection}/${id}`, data);
      return response.data;
    });
  }

  async createDirectusItems(collection, items) {
    // Batch create items (Directus supports batch operations)
    return this.withRetry(async () => {
      if (items.length === 0) return { data: [] };

      const response = await this.directus.post(`/items/${collection}`, items);
      return response.data;
    });
  }

  async upsertDirectusItem(collection, filter, data) {
    // Find existing item or create new one
    return this.withRetry(async () => {
      const existing = await this.getDirectusItems(collection, filter, 1);

      if (existing.data && existing.data.length > 0) {
        const item = existing.data[0];
        logger.debug(`Updating existing ${collection.slice(0, -1)}: ${item.id}`);
        return await this.updateDirectusItem(collection, item.id, data);
      } else {
        logger.debug(`Creating new ${collection.slice(0, -1)}`);
        return await this.createDirectusItem(collection, data);
      }
    });
  }

  async createSyncLog(syncType, status, stats, errorDetails = null) {
    const syncLog = {
      sync_type: syncType,
      source: 'cukcuk',
      status: status,
      records_processed: stats.created + stats.updated + stats.failed,
      records_created: stats.created,
      records_updated: stats.updated,
      records_failed: stats.failed,
      error_details: errorDetails
    };

    try {
      const result = await this.createDirectusItem('sync_logs', syncLog);
      logger.debug(`Sync log created: ${syncType} - ${status}`);
      return result;
    } catch (error) {
      logger.error(`Failed to create sync log: ${error.message}`);
      throw error;
    }
  }

  /**
   * Health check for both APIs
   */
  async healthCheck() {
    const results = {
      cukcuk: { status: 'unknown', message: '', latency: null },
      directus: { status: 'unknown', message: '', latency: null }
    };

    // Test Directus
    try {
      const start = Date.now();
      await this.testDirectusConnection();
      results.directus = {
        status: 'healthy',
        message: 'Connected successfully',
        latency: Date.now() - start
      };
    } catch (error) {
      results.directus = {
        status: 'unhealthy',
        message: error.message,
        latency: null
      };
    }

    // Test CukCuk
    try {
      const start = Date.now();
      await this.getCukCukBranches(false); // Quick test with branches
      results.cukcuk = {
        status: 'healthy',
        message: 'Connected successfully',
        latency: Date.now() - start
      };
    } catch (error) {
      results.cukcuk = {
        status: 'unhealthy',
        message: error.message,
        latency: null
      };
    }

    return results;
  }

  /**
   * Get sync statistics
   */
  async getSyncStats() {
    try {
      const logs = await this.getDirectusItems('sync_logs', {}, 10);
      const stats = {
        totalSyncs: logs.data?.length || 0,
        recentSyncs: logs.data?.slice(0, 5) || [],
        summary: {
          lastSync: logs.data?.[0]?.date_created || null,
          totalRecords: 0,
          successRate: 0
        }
      };

      // Calculate summary stats
      if (logs.data && logs.data.length > 0) {
        const completedSyncs = logs.data.filter(log => log.status === 'completed');
        stats.summary.successRate = Math.round((completedSyncs.length / logs.data.length) * 100);

        stats.summary.totalRecords = logs.data.reduce((sum, log) => {
          return sum + log.records_processed;
        }, 0);
      }

      return stats;
    } catch (error) {
      logger.error(`Failed to get sync stats: ${error.message}`);
      return { error: error.message };
    }
  }
}

module.exports = { ApiClient };