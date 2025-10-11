#!/usr/bin/env node

/**
 * Session Logger for CukCuk Sync Operations
 *
 * Captures all sync session output and stores it both in filesystem
 * and in Directus sync_logs collection for complete audit trail
 */

const fs = require('fs').promises;
const path = require('path');
const { logger } = require('./logger');

class SessionLogger {
  constructor(options = {}) {
    this.logDir = options.logDir || path.resolve(__dirname, '../logs/data/cukcuk');
    this.sessionId = options.sessionId || this.generateSessionId();
    this.startTime = new Date();
    this.buffer = [];
    this.isEnabled = options.enabled !== false;
    this.syncLogId = null;
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };
  }

  generateSessionId() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `sync-${timestamp}-${random}`;
  }

  getLogFileName() {
    const date = this.startTime.toISOString().split('T')[0];
    return `${date}_${this.sessionId}.log`;
  }

  getLogFilePath() {
    return path.join(this.logDir, this.getLogFileName());
  }

  /**
   * Start capturing console output
   */
  async start() {
    if (!this.isEnabled) return;

    // Ensure log directory exists
    await fs.mkdir(this.logDir, { recursive: true });

    // Override console methods to capture output
    const self = this;

    console.log = function(...args) {
      self.originalConsole.log(...args);
      self.capture('log', ...args);
    };

    console.error = function(...args) {
      self.originalConsole.error(...args);
      self.capture('error', ...args);
    };

    console.warn = function(...args) {
      self.originalConsole.warn(...args);
      self.capture('warn', ...args);
    };

    console.info = function(...args) {
      self.originalConsole.info(...args);
      self.capture('info', ...args);
    };

    console.debug = function(...args) {
      self.originalConsole.debug(...args);
      self.capture('debug', ...args);
    };

    // Write session header
    this.writeHeader();
  }

  writeHeader() {
    const header = [
      '=' .repeat(80),
      `CukCuk Sync Session Started`,
      `Session ID: ${this.sessionId}`,
      `Start Time: ${this.startTime.toISOString()}`,
      `Process ID: ${process.pid}`,
      `Node Version: ${process.version}`,
      `Working Directory: ${process.cwd()}`,
      '=' .repeat(80),
      ''
    ];

    header.forEach(line => this.capture('log', line));
  }

  capture(level, ...args) {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');

    const logEntry = {
      timestamp,
      level,
      message: formattedArgs,
      relativeTime: Date.now() - this.startTime.getTime()
    };

    this.buffer.push(logEntry);

    // Also write to file immediately for safety
    this.writeToFile(logEntry);
  }

  async writeToFile(logEntry) {
    if (!this.isEnabled) return;

    try {
      const logLine = `[${logEntry.timestamp}] [${logEntry.level.toUpperCase()}] ${logEntry.message}\n`;
      await fs.appendFile(this.getLogFilePath(), logLine, 'utf8');
    } catch (error) {
      // Fallback to original console if file writing fails
      this.originalConsole.error('Failed to write to session log file:', error.message);
    }
  }

  /**
   * Get the current session log as formatted text
   */
  getSessionLog() {
    if (!this.isEnabled) return '';

    return this.buffer.map(entry => {
      const relativeTime = (entry.relativeTime / 1000).toFixed(3);
      return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [+${relativeTime}s] ${entry.message}`;
    }).join('\n');
  }

  /**
   * Get the session log as HTML for rich text display
   */
  getSessionLogHTML() {
    if (!this.isEnabled) return '';

    return this.buffer.map(entry => {
      const relativeTime = (entry.relativeTime / 1000).toFixed(3);
      const levelClass = entry.level.toLowerCase();
      const escapedMessage = entry.message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

      return `<div class="log-entry log-${levelClass}">
        <span class="timestamp">[${entry.timestamp}]</span>
        <span class="level">[${entry.level.toUpperCase()}]</span>
        <span class="relative-time">[+${relativeTime}s]</span>
        <span class="message">${escapedMessage}</span>
      </div>`;
    }).join('\n');
  }

  /**
   * Set the associated sync log ID in Directus
   */
  setSyncLogId(syncLogId) {
    this.syncLogId = syncLogId;
  }

  /**
   * Get session statistics
   */
  getStats() {
    const endTime = Date.now();
    const duration = endTime - this.startTime.getTime();
    const levelCounts = this.buffer.reduce((counts, entry) => {
      counts[entry.level] = (counts[entry.level] || 0) + 1;
      return counts;
    }, {});

    return {
      sessionId: this.sessionId,
      startTime: this.startTime.toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: duration,
      durationFormatted: this.formatDuration(duration),
      totalEntries: this.buffer.length,
      levelCounts,
      logFilePath: this.getLogFilePath(),
      syncLogId: this.syncLogId
    };
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Write session footer and stop capturing
   */
  async stop() {
    if (!this.isEnabled) return;

    const stats = this.getStats();

    // Write session footer
    const footer = [
      '',
      '=' .repeat(80),
      `CukCuk Sync Session Completed`,
      `End Time: ${stats.endTime}`,
      `Duration: ${stats.durationFormatted}`,
      `Total Log Entries: ${stats.totalEntries}`,
      `Log Levels: ${Object.entries(stats.levelCounts).map(([level, count]) => `${level}: ${count}`).join(', ')}`,
      `Log File: ${stats.logFilePath}`,
      '=' .repeat(80),
      ''
    ];

    footer.forEach(line => this.capture('log', line));

    // Restore original console methods
    Object.assign(console, this.originalConsole);

    logger.info(`Session logging completed. Log saved to: ${stats.logFilePath}`);
    return stats;
  }

  /**
   * Cleanup old log files (keep last 30 days)
   */
  async cleanupOldLogs(daysToKeep = 30) {
    try {
      const files = await fs.readdir(this.logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(this.logDir, file);
          const stats = await fs.stat(filePath);

          if (stats.mtime < cutoffDate) {
            await fs.unlink(filePath);
            logger.info(`Cleaned up old log file: ${file}`);
          }
        }
      }
    } catch (error) {
      logger.warn(`Failed to cleanup old logs: ${error.message}`);
    }
  }
}

module.exports = { SessionLogger };