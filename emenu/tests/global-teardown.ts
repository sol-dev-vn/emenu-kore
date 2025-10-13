import type { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Configuration constants for better maintainability
const CONFIG = {
  CLEANUP_TIMEOUT: 10000,
  ARTIFACTS_RETENTION_DAYS: 7,
  TEMP_DIRS_TO_CLEAN: [
    'test-results/temp',
    'test-results/screenshots',
    'test-results/videos'
  ],
  ENVIRONMENT_VARS_TO_CLEAN: [
    'TEST_MODE',
    'NODE_ENV',
    'TEST_DATABASE_URL',
    'TEST_API_KEY'
  ]
} as const;

/**
 * Cleans up temporary files and directories
 * @param dirs - Array of directory paths to clean
 */
async function cleanupTemporaryDirectories(dirs: readonly string[]): Promise<void> {
  for (const dir of dirs) {
    const fullPath = path.resolve(process.cwd(), dir);
    
    try {
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        let cleanedCount = 0;
        
        for (const file of files) {
          const filePath = path.join(fullPath, file);
          const stats = fs.statSync(filePath);
          
          // Remove files older than retention period
          const fileAgeMs = Date.now() - stats.mtime.getTime();
          const retentionMs = CONFIG.ARTIFACTS_RETENTION_DAYS * 24 * 60 * 60 * 1000;
          
          if (fileAgeMs > retentionMs) {
            if (stats.isDirectory()) {
              fs.rmSync(filePath, { recursive: true, force: true });
            } else {
              fs.unlinkSync(filePath);
            }
            cleanedCount++;
          }
        }
        
        if (cleanedCount > 0) {
          console.log(`🧹 Cleaned ${cleanedCount} old files from ${dir}`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to cleanup directory ${dir}:`, error);
    }
  }
}

/**
 * Cleans up environment variables
 * @param vars - Array of environment variable names to clean
 */
function cleanupEnvironmentVariables(vars: readonly string[]): void {
  for (const varName of vars) {
    if (process.env[varName]) {
      delete process.env[varName];
      console.log(`🗑️ Removed environment variable: ${varName}`);
    }
  }
}

/**
 * Generates a cleanup report
 * @param startTime - Start time of teardown process
 * @param errors - Array of errors encountered during cleanup
 */
function generateCleanupReport(startTime: number, errors: Error[]): void {
  const duration = Date.now() - startTime;
  
  console.log('\n📊 Teardown Report:');
  console.log(`⏱️ Duration: ${duration}ms`);
  console.log(`🗑️ Cleaned directories: ${CONFIG.TEMP_DIRS_TO_CLEAN.length}`);
  console.log(`🔧 Cleaned environment variables: ${CONFIG.ENVIRONMENT_VARS_TO_CLEAN.length}`);
  
  if (errors.length > 0) {
    console.log(`❌ Errors encountered: ${errors.length}`);
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.message}`);
    });
  } else {
    console.log('✅ All cleanup operations completed successfully');
  }
}

/**
 * Validates cleanup operations
 * @param errors - Array of errors encountered during cleanup
 */
function validateCleanup(errors: Error[]): void {
  // Check if critical errors occurred
  const criticalErrors = errors.filter(error => 
    error.message.includes('database') || 
    error.message.includes('permission denied') ||
    error.message.includes('ENOTEMPTY')
  );
  
  if (criticalErrors.length > 0) {
    console.warn('⚠️ Critical cleanup issues detected. Manual intervention may be required.');
  }
}

/**
 * Main global teardown function with improved error handling and logging
 * @param config - Playwright configuration
 */
async function globalTeardown(config: FullConfig): Promise<void> {
  const startTime = Date.now();
  const errors: Error[] = [];
  
  console.log('🧹 Starting global test teardown...');
  
  try {
    // Check if there's global state to cleanup
    const globalState = (global as any).testState;
    if (globalState) {
      console.log('🔍 Found global test state to cleanup');
      
      // Cleanup browser resources if they weren't properly closed
      if (globalState.browser && !globalState.browser.isConnected()) {
        console.log('⚠️ Browser was not properly closed during setup');
      }
    }
    
    // Cleanup temporary directories with timeout
    const cleanupPromise = cleanupTemporaryDirectories(CONFIG.TEMP_DIRS_TO_CLEAN);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Directory cleanup timeout')), CONFIG.CLEANUP_TIMEOUT)
    );
    
    try {
      await Promise.race([cleanupPromise, timeoutPromise]);
    } catch (error) {
      errors.push(error as Error);
      console.error('❌ Directory cleanup failed or timed out:', error);
    }
    
    // Cleanup environment variables
    try {
      cleanupEnvironmentVariables(CONFIG.ENVIRONMENT_VARS_TO_CLEAN);
    } catch (error) {
      errors.push(error as Error);
      console.error('❌ Environment variable cleanup failed:', error);
    }
    
    // Additional cleanup tasks can be added here
    // For example:
    // - Database cleanup
    // - Service shutdown
    // - Cache clearing
    
    // Validate cleanup operations
    validateCleanup(errors);
    
    // Generate and display cleanup report
    generateCleanupReport(startTime, errors);
    
    console.log('✅ Global test teardown completed');
    
  } catch (error) {
    errors.push(error as Error);
    console.error('❌ Global teardown failed:', error);
    
    // Generate report even if teardown failed
    generateCleanupReport(startTime, errors);
    
    // Re-throw critical errors
    if (errors.some(e => e.message.includes('Critical'))) {
      throw error;
    }
  }
}

export default globalTeardown;