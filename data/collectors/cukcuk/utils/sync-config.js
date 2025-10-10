#!/usr/bin/env node

/**
 * Sync configuration and settings management
 * Handles sync configuration, scheduling, and runtime settings
 */

const { logger } = require('./logger');

class SyncConfig {
  constructor() {
    this.defaultConfig = {
      // Sync settings
      syncTypes: ['branches', 'categories', 'menu_items', 'tables'],
      batchSize: 100,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,

      // Data processing
      enableValidation: true,
      enableTransformations: true,
      skipExisting: false,
      updateExisting: true,

      // Performance
      enableParallelProcessing: false,
      maxConcurrentItems: 5,
      enableProgressLogging: true,
      progressLogInterval: 10,

      // Logging and monitoring
      enableDetailedLogging: false,
      logLevel: 'info',
      enableMetrics: true,

      // Error handling
      failOnFirstError: false,
      maxErrorsPerType: 10,
      enableErrorRecovery: true,

      // Scheduling
      enableAutoSync: false,
      syncInterval: '0 2 * * *', // Daily at 2 AM
      timezone: 'Asia/Ho_Chi_Minh',

      // Data filters
      includeInactive: false,
      dateFrom: null,
      dateTo: null,
      customFilters: {}
    };

    this.config = { ...this.defaultConfig };
    this.loadEnvironmentConfig();
  }

  /**
   * Load configuration from environment variables
   */
  loadEnvironmentConfig() {
    // Sync configuration
    if (process.env.SYNC_BATCH_SIZE) {
      this.config.batchSize = parseInt(process.env.SYNC_BATCH_SIZE);
    }

    if (process.env.SYNC_RETRY_ATTEMPTS) {
      this.config.maxRetries = parseInt(process.env.SYNC_RETRY_ATTEMPTS);
    }

    if (process.env.SYNC_RETRY_DELAY) {
      this.config.retryDelay = parseInt(process.env.SYNC_RETRY_DELAY);
    }

    // Enable/disable sync types
    const syncFlags = {
      'SYNC_ENABLE_BRANCHES': 'branches',
      'SYNC_ENABLE_CATEGORIES': 'categories',
      'SYNC_ENABLE_MENU_ITEMS': 'menu_items',
      'SYNC_ENABLE_TABLES': 'tables',
      'SYNC_ENABLE_PROMOTIONS': 'promotions',
      'SYNC_ENABLE_ORDERS': 'orders'
    };

    const enabledSyncTypes = [];
    for (const [envVar, syncType] of Object.entries(syncFlags)) {
      if (process.env[envVar] === 'true') {
        enabledSyncTypes.push(syncType);
      }
    }

    if (enabledSyncTypes.length > 0) {
      this.config.syncTypes = enabledSyncTypes;
    }

    // Logging configuration
    if (process.env.LOG_LEVEL) {
      this.config.logLevel = process.env.LOG_LEVEL;
    }

    if (process.env.ENABLE_DETAILED_LOGGING === 'true') {
      this.config.enableDetailedLogging = true;
    }

    // Performance settings
    if (process.env.ENABLE_PARALLEL_SYNC === 'true') {
      this.config.enableParallelProcessing = true;
    }

    if (process.env.MAX_CONCURRENT_ITEMS) {
      this.config.maxConcurrentItems = parseInt(process.env.MAX_CONCURRENT_ITEMS);
    }

    logger.info('Configuration loaded from environment variables');
  }

  /**
   * Get configuration value
   */
  get(key, defaultValue = null) {
    return key.includes('.') ? this.getNested(key) : this.config[key] ?? defaultValue;
  }

  /**
   * Get nested configuration value
   */
  getNested(key) {
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return value;
  }

  /**
   * Set configuration value
   */
  set(key, value) {
    if (key.includes('.')) {
      this.setNested(key, value);
    } else {
      this.config[key] = value;
    }
  }

  /**
   * Set nested configuration value
   */
  setNested(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = this.config;

    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }

    target[lastKey] = value;
  }

  /**
   * Get sync configuration for a specific type
   */
  getSyncConfig(syncType) {
    const baseConfig = {
      batchSize: this.config.batchSize,
      maxRetries: this.config.maxRetries,
      retryDelay: this.config.retryDelay,
      timeout: this.config.timeout,
      enableValidation: this.config.enableValidation,
      enableTransformations: this.config.enableTransformations,
      skipExisting: this.config.skipExisting,
      updateExisting: this.config.updateExisting,
      failOnFirstError: this.config.failOnFirstError,
      maxErrorsPerType: this.config.maxErrorsPerType
    };

    // Type-specific configurations
    const typeConfigs = {
      branches: {
        batchSize: 50,
        enableParallelProcessing: false
      },
      categories: {
        batchSize: 100,
        enableParallelProcessing: false,
        preserveHierarchy: true
      },
      menu_items: {
        batchSize: 200,
        enableParallelProcessing: true,
        maxConcurrentItems: 10
      },
      tables: {
        batchSize: 150,
        enableParallelProcessing: true,
        maxConcurrentItems: 8
      }
    };

    return { ...baseConfig, ...(typeConfigs[syncType] || {}) };
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];

    // Required environment variables
    const requiredVars = [
      'DIRECTUS_URL',
      'DIRECTUS_API_TOKEN',
      'CUKCUK_SECRET_KEY',
      'CUKCUK_DOMAIN',
      'CUKCUK_APP_ID',
      'CUKCUK_COMPANY_CODE'
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    }

    // Configuration value validation
    if (this.config.batchSize < 1 || this.config.batchSize > 1000) {
      errors.push('batchSize must be between 1 and 1000');
    }

    if (this.config.maxRetries < 0 || this.config.maxRetries > 10) {
      errors.push('maxRetries must be between 0 and 10');
    }

    if (this.config.timeout < 1000 || this.config.timeout > 300000) {
      errors.push('timeout must be between 1000ms and 300000ms (5 minutes)');
    }

    if (this.config.maxConcurrentItems < 1 || this.config.maxConcurrentItems > 20) {
      errors.push('maxConcurrentItems must be between 1 and 20');
    }

    // Sync types validation
    const validSyncTypes = ['branches', 'categories', 'menu_items', 'tables', 'promotions', 'orders'];
    for (const syncType of this.config.syncTypes) {
      if (!validSyncTypes.includes(syncType)) {
        errors.push(`Invalid sync type: ${syncType}`);
      }
    }

    if (errors.length > 0) {
      logger.error(`Configuration validation failed: ${errors.join(', ')}`);
      return { valid: false, errors };
    }

    logger.success('Configuration validation passed');
    return { valid: true, errors: [] };
  }

  /**
   * Get configuration summary
   */
  getSummary() {
    return {
      syncTypes: this.config.syncTypes,
      batchSize: this.config.batchSize,
      maxRetries: this.config.maxRetries,
      enableParallelProcessing: this.config.enableParallelProcessing,
      maxConcurrentItems: this.config.maxConcurrentItems,
      logLevel: this.config.logLevel,
      environment: process.env.NODE_ENV || 'development',
      timezone: this.config.timezone
    };
  }

  /**
   * Export configuration to JSON
   */
  export() {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  import(configJson) {
    try {
      const imported = JSON.parse(configJson);
      this.config = { ...this.defaultConfig, ...imported };
      this.loadEnvironmentConfig(); // Re-apply environment overrides
      logger.success('Configuration imported successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to import configuration: ${error.message}`);
      return false;
    }
  }

  /**
   * Print configuration to console
   */
  print() {
    logger.section('Current Sync Configuration');
    const summary = this.getSummary();

    Object.entries(summary).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        logger.info(`${key}: ${value.join(', ')}`);
      } else {
        logger.info(`${key}: ${value}`);
      }
    });

    // Environment variables (safely)
    logger.section('Environment Configuration');
    const envVars = [
      'DIRECTUS_URL',
      'CUKCUK_DOMAIN',
      'CUKCUK_APP_ID',
      'NODE_ENV',
      'LOG_LEVEL'
    ];

    envVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        if (varName.includes('SECRET') || varName.includes('TOKEN')) {
          logger.info(`${varName}: ***configured***`);
        } else {
          logger.info(`${varName}: ${value}`);
        }
      }
    });
  }
}

// Export singleton instance
const syncConfig = new SyncConfig();

module.exports = { SyncConfig, syncConfig };