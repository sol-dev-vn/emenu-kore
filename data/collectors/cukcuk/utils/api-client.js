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

  async getCukCukMenuItems(includeInactive = false, categoryId = null, options = {}) {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();

      let menuItems = [];

      // Resume options
      const checkpoint = options.checkpoint || null;
      const onCheckpoint = options.onCheckpoint || null;
      const resumeMode = !!checkpoint;
      let resumeReached = !resumeMode;

      try {
        // Get all branches first to fetch menu items for all branches
        const branchesResult = await client.branches.getAll({ includeInactive });
        const branches = branchesResult?.Data || branchesResult?.data?.Data || [];

        if (branches.length === 0) {
          logger.warn('No branches found to fetch menu items from');
          return [];
        }

        logger.info(`Fetching menu items from ${branches.length} branches${resumeMode ? ` (resuming at branch ${checkpoint.branchId} page ${checkpoint.page || 1})` : ''}`);

        // Fetch menu items from each branch (support resume checkpoint)
        for (const branch of branches) {
          try {
            // If resuming, skip branches until reaching target branchId
            if (resumeMode && !resumeReached) {
              if (branch.Id === checkpoint.branchId) {
                resumeReached = true;
              } else {
                logger.debug(`Skipping branch ${branch.Name} (${branch.Id}) due to resume checkpoint`);
                continue;
              }
            }

            const initialPage = resumeReached && resumeMode && branch.Id === checkpoint.branchId ? (checkpoint.page || 1) : 1;

            const requestParams = {
              Page: initialPage,
              Limit: 100, // Maximum per page
              BranchId: branch.Id,
              CategoryId: categoryId || '',
              KeySearch: '',
              IncludeInactive: includeInactive
            };

            // Direct API call to inventory items paging endpoint (ensure full path)
            const response = await client.client.post('/api/v1/inventoryitems/paging', requestParams);
            const payload = response?.data ?? response;
            const dataArray = Array.isArray(payload?.Data)
              ? payload.Data
              : Array.isArray(payload?.data?.Data)
              ? payload.data.Data
              : [];
            const total = payload?.Total ?? payload?.data?.Total ?? dataArray.length;

            logger.debug(
              `Branch ${branch.Name} (${branch.Id}) page ${requestParams.Page}: items=${dataArray.length}, total=${total}`
            );

            if (dataArray.length > 0) {
              const branchMenuItems = dataArray.map(item => ({
                ...item,
                BranchId: branch.Id,
                BranchName: branch.Name
              }));
              menuItems = menuItems.concat(branchMenuItems);
            }

            // Emit checkpoint after fetching initial page
            if (typeof onCheckpoint === 'function') {
              try { onCheckpoint({ branchId: branch.Id, branchName: branch.Name, page: requestParams.Page }); } catch (e) { logger.warn(`onCheckpoint failed: ${e.message}`); }
            }

            // Check if there are more pages
            if (total > requestParams.Limit) {
              const totalPages = Math.ceil(total / requestParams.Limit);
              for (let page = requestParams.Page + 1; page <= totalPages; page++) {
                const paginatedParams = { ...requestParams, Page: page };
                const pageResponse = await client.client.post('/api/v1/inventoryitems/paging', paginatedParams);
                const pagePayload = pageResponse?.data ?? pageResponse;
                const pageDataArray = Array.isArray(pagePayload?.Data)
                  ? pagePayload.Data
                  : Array.isArray(pagePayload?.data?.Data)
                  ? pagePayload.data.Data
                  : [];

                logger.debug(
                  `Branch ${branch.Name} (${branch.Id}) page ${page}: items=${pageDataArray.length}`
                );

                if (pageDataArray.length > 0) {
                  const branchMenuItems = pageDataArray.map(item => ({
                    ...item,
                    BranchId: branch.Id,
                    BranchName: branch.Name
                  }));
                  menuItems = menuItems.concat(branchMenuItems);
                }

                // Emit checkpoint after each page
                if (typeof onCheckpoint === 'function') {
                  try { onCheckpoint({ branchId: branch.Id, branchName: branch.Name, page }); } catch (e) { logger.warn(`onCheckpoint failed: ${e.message}`); }
                }
              }
            }
          } catch (error) {
            logger.warn(`Failed to fetch menu items for branch ${branch.Name} (${branch.Id}): ${error.message}`);
          }
        }

        const count = Array.isArray(menuItems) ? menuItems.length : 0;
        logger.success(`Retrieved ${count} menu items from CukCuk`);
        return menuItems;

      } catch (error) {
        logger.error(`Failed to fetch menu items: ${error.message}`);

        // Fallback: try different approaches
        if (client.products && typeof client.products.getList === 'function') {
          const result = await client.products.getList({ includeInactive, categoryId });
          menuItems = result.Data || result.data || result;
        } else if (client.inventoryItems && typeof client.inventoryItems.getList === 'function') {
          const result = await client.inventoryItems.getList({ includeInactive, categoryId });
          menuItems = result.Data || result.data || result;
        }

        const count = Array.isArray(menuItems) ? menuItems.length : 0;
        logger.success(`Retrieved ${count} menu items from CukCuk (fallback method)`);
        return menuItems;
      }
    });
  }

  async getCukCukTables(branchId = null, includeInactive = false) {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();

      if (!branchId) {
        logger.warn('Tables API requires a branchId parameter');
        return [];
      }

      // Use the correct API method: tables.getByBranch(branchId)
      if (client.tables && typeof client.tables.getByBranch === 'function') {
        const result = await client.tables.getByBranch(branchId);
        const tables = result.Data?.ListTable || [];
        const count = Array.isArray(tables) ? tables.length : 0;

        logger.success(`Retrieved ${count} tables from CukCuk for branch ${branchId}`);

        // Add branch context to each table
        return tables.map(table => ({
          ...table,
          BranchId: branchId
        }));
      } else {
        logger.warn('Tables getByBranch method not available');
        return [];
      }
    });
  }

  async getCukCukAllTables(includeInactive = false) {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();

      // First get all branches
      const branchesResult = await client.branches.getAll({ includeInactive });
      const branches = branchesResult.Data || [];

      if (branches.length === 0) {
        logger.warn('No branches found to fetch tables from');
        return [];
      }

      logger.info(`Fetching tables from ${branches.length} branches`);
      let allTables = [];

      // Fetch tables for each branch
      for (const branch of branches) {
        try {
          const branchTables = await this.getCukCukTables(branch.Id, includeInactive);
          allTables = allTables.concat(branchTables);
        } catch (error) {
          logger.warn(`Failed to fetch tables for branch ${branch.Name} (${branch.Id}): ${error.message}`);
        }
      }

      logger.success(`Retrieved ${allTables.length} total tables from CukCuk`);
      return allTables;
    });
  }

  async getCukCukLayouts(includeInactive = false) {
    return this.withRetry(async () => {
      const client = await this.initializeCukCukClient();

      // Try different approaches to get layouts
      let layouts = [];

      // Try 1: Check if layouts method exists
      if (client.layouts && typeof client.layouts.getList === 'function') {
        const result = await client.layouts.getList({ includeInactive });
        layouts = result.Data || result.data || result;
      }
      // Try 2: Check if there are other layout-related methods
      else if (client.layouts && typeof client.layouts.getAll === 'function') {
        const result = await client.layouts.getAll({ includeInactive });
        layouts = result.Data || result.data || result;
      }
      // Try 3: Check if layouts are under a different service
      else {
        logger.warn('Layouts API not directly available - would need direct API call');
      }

      const count = Array.isArray(layouts) ? layouts.length : 0;
      logger.success(`Retrieved ${count} layouts from CukCuk`);
      return layouts;
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

  async getDirectusItems(collection, filters = {}, limit = null, options = {}) {
    return this.withRetry(async () => {
      const params = {};

      // Support both old format (filters as object) and new format
      if (filters && typeof filters === 'object') {
        params.filter = filters;
      }

      // Enhanced query options
      if (limit) params.limit = limit;
      if (options.sort) params.sort = options.sort;
      if (options.fields) params.fields = options.fields;
      if (options.offset) params.offset = options.offset;
      if (options.page) params.page = options.page;
      if (options.search) params.search = options.search;

      // Support for advanced Directus query options
      if (options.deep) params.deep = options.deep;
      if (options.alias) params.alias = options.alias;
      if (options.aggregate) params.aggregate = options.aggregate;
      if (options.group) params.group = options.group;
      if (options.version) params.version = options.version;
      if (options.export) params.export = options.export;
      if (options.backlink) params.backlink = options.backlink;

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

  async createSyncLog(syncType, status, stats, errorDetails = null, options = {}) {
    const now = new Date().toISOString();
    const syncLog = {
      sync_type: syncType,
      source: 'cukcuk',
      status: status,
      records_processed: stats.created + stats.updated + stats.failed,
      records_created: stats.created || 0,
      records_updated: stats.updated || 0,
      records_failed: stats.failed || 0,
      // Correct timestamp fields (matching actual collection schema)
      started_at: stats.startTime ? new Date(stats.startTime).toISOString() : now,
      completed_at: (status === 'completed' || status === 'failed') ? now : null,
      duration_seconds: stats.duration || null,
      // Enhanced tracking fields
      triggered_by: options.triggeredBy || 'manual',
      batch_id: options.batchId || this.generateBatchId(syncType),
      api_endpoint: options.apiEndpoint || this.getApiEndpoint(syncType),
      branch_id: options.branchId || null,
      data_checksum: options.dataChecksum || null,
      retry_count: options.retryCount || 0,
      last_error_message: errorDetails || null,
      performance_metrics: options.performanceMetrics || {
        api_calls: stats.apiCalls || 0,
        avg_response_time: stats.avgResponseTime || 0,
        memory_usage: process.memoryUsage()
      },
      warning_count: stats.warnings || 0,
      // New fields for enhanced logging
      date_created: now,
      date_updated: now,
      session_log: options.sessionLog || null,
      log_file_path: options.logFilePath || null
    };

    try {
      const result = await this.createDirectusItem('sync_logs', syncLog);
      logger.debug(`Enhanced sync log created: ${syncType} - ${status} (${syncLog.batch_id})`);
      return result;
    } catch (error) {
      logger.error(`Failed to create sync log: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a unique batch ID for sync operations
   */
  generateBatchId(syncType) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `${syncType}-${timestamp}-${random}`;
  }

  /**
   * Get the API endpoint for a sync type
   */
  getApiEndpoint(syncType) {
    const endpoints = {
      'branches': '/branches',
      'categories': '/categories',
      'menu_items': '/inventoryitems/paging',
      'tables': '/tables',
      'layouts': '/layouts',
      'full': '/multiple'
    };
    return endpoints[syncType] || '/unknown';
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

  async findLatestSyncLog(syncType, statuses = ['failed', 'in_progress']) {
    return this.withRetry(async () => {
      const response = await this.getDirectusItems('sync_logs', {
        sync_type: { _eq: syncType },
        status: { _in: statuses }
      }, 1, { sort: ['-date_created'] });
      const data = response?.data || [];
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    });
  }

  // Utility methods for common query patterns

  /**
   * Get items with sorting
   */
  async getDirectusItemsSorted(collection, filters = {}, sort = [], limit = null) {
    return this.getDirectusItems(collection, filters, limit, { sort });
  }

  /**
   * Get specific fields from items
   */
  async getDirectusItemsFields(collection, filters = {}, fields = [], limit = null) {
    return this.getDirectusItems(collection, filters, limit, { fields });
  }

  /**
   * Get items with pagination
   */
  async getDirectusItemsPaginated(collection, filters = {}, page = 1, limit = 50) {
    return this.getDirectusItems(collection, filters, limit, { page });
  }

  /**
   * Search items
   */
  async searchDirectusItems(collection, searchTerm, filters = {}, limit = null) {
    return this.getDirectusItems(collection, filters, limit, { search: searchTerm });
  }

  /**
   * Get items with related data (deep queries)
   */
  async getDirectusItemsWithRelations(collection, filters = {}, relations = {}, limit = null) {
    return this.getDirectusItems(collection, filters, limit, { deep: relations });
  }

  /**
   * Get items with aggregate functions
   */
  async getDirectusItemsAggregate(collection, filters = {}, aggregate = {}, limit = null) {
    return this.getDirectusItems(collection, filters, limit, { aggregate });
  }
}

module.exports = { ApiClient };