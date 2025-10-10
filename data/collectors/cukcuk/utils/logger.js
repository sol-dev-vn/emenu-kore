#!/usr/bin/env node

/**
 * Centralized logging utility for CukCuk sync operations
 * Provides consistent formatting and output levels
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class Logger {
  constructor(enableColors = true) {
    this.enableColors = enableColors;
  }

  colorize(message, color) {
    return this.enableColors ? `${color}${message}${colors.reset}` : message;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.log(this.colorize(`${prefix} ${message}`, colors.red));
        break;
      case 'warn':
      case 'warning':
        console.log(this.colorize(`${prefix} ${message}`, colors.yellow));
        break;
      case 'success':
        console.log(this.colorize(`${prefix} ${message}`, colors.green));
        break;
      case 'info':
        console.log(this.colorize(`${prefix} ${message}`, colors.blue));
        break;
      case 'debug':
        console.log(this.colorize(`${prefix} ${message}`, colors.magenta));
        break;
      default:
        console.log(this.colorize(`${prefix} ${message}`, colors.reset));
    }
  }

  info(message) {
    this.log(message, 'info');
  }

  success(message) {
    this.log(message, 'success');
  }

  error(message) {
    this.log(message, 'error');
  }

  warn(message) {
    this.log(message, 'warning');
  }

  debug(message) {
    this.log(message, 'debug');
  }

  section(message) {
    console.log(this.colorize(`\n=== ${message} ===`, colors.cyan));
  }

  table(data, headers = []) {
    if (!Array.isArray(data) || data.length === 0) {
      this.info('No data to display');
      return;
    }

    // Simple table formatting
    console.log(this.colorize('\n--- Data Table ---', colors.cyan));
    data.forEach((row, index) => {
      console.log(`[${index + 1}] ${JSON.stringify(row, null, 2)}`);
    });
    console.log(this.colorize('--- End Table ---\n', colors.cyan));
  }

  progressBar(current, total, label = 'Progress') {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * current) / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    process.stdout.write(`\r${this.colorize(label, colors.blue)}: [${this.colorize(bar, colors.green)}] ${percentage}% (${current}/${total})`);

    if (current === total) {
      console.log(); // New line when complete
    }
  }

  // Sync-specific logging methods
  syncStart(syncType) {
    this.section(`Starting ${syncType} Sync`);
  }

  syncProgress(type, current, total, item = '') {
    this.progressBar(current, total, `${type} Sync ${item}`);
  }

  syncSuccess(type, stats) {
    this.success(`${type} sync completed: ${stats.created} created, ${stats.updated} updated, ${stats.failed} failed`);
  }

  syncError(type, error) {
    this.error(`${type} sync failed: ${error.message}`);
  }

  logApiCall(method, url, status, duration) {
    this.debug(`API ${method} ${url} - Status: ${status} - ${duration}ms`);
  }

  logDataTransform(from, to, count) {
    this.info(`Transformed ${count} records from ${from} to ${to}`);
  }

  logConnection(service, status, details = '') {
    if (status === 'connected') {
      this.success(`Connected to ${service}${details ? `: ${details}` : ''}`);
    } else {
      this.error(`Failed to connect to ${service}${details ? `: ${details}` : ''}`);
    }
  }
}

// Export singleton instance
const logger = new Logger(process.env.NODE_ENV !== 'production');

module.exports = { logger, Logger };