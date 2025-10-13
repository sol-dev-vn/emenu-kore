#!/usr/bin/env node

/**
 * Batch Directus Data Cleanup Script
 * Uses bulk operations to efficiently clear large collections
 */

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-directus-token-here';

class BatchCleanup {
  constructor() {
    this.directusUrl = DIRECTUS_URL;
    this.token = DIRECTUS_TOKEN;
  }

  /**
   * Get count of items in a collection
   */
  async getItemCount(collection) {
    const url = collection === 'menu_items'
      ? `${this.directusUrl}/items/${collection}?fields=id&limit=1&meta=total_count`
      : `${this.directusUrl}/items/${collection}?limit=1&meta=total_count`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (!response.ok) {
      console.log(`  ⚠️  Could not get count for ${collection}: ${response.statusText}`);
      return 0;
    }

    const result = await response.json();
    return result.meta?.total_count || 0;
  }

  /**
   * Delete items in batches using the API endpoint
   */
  async deleteItemsInBatches(collection, batchSize = 100) {
    console.log(`🗑️  Clearing ${collection}...`);

    const totalItems = await this.getItemCount(collection);
    if (totalItems === 0) {
      console.log(`  ✅ ${collection} is already empty`);
      return;
    }

    console.log(`  📊 Found ${totalItems} items to delete`);

    let deletedCount = 0;
    let hasMore = true;

    while (hasMore) {
      // Get a batch of items to delete
      const url = collection === 'menu_items'
        ? `${this.directusUrl}/items/${collection}?limit=${batchSize}&fields=id`
        : `${this.directusUrl}/items/${collection}?limit=${batchSize}&fields=id`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection} batch: ${response.statusText}`);
      }

      const result = await response.json();
      const items = result.data || [];

      if (items.length === 0) {
        hasMore = false;
        break;
      }

      // Delete each item in the batch
      let batchDeleted = 0;
      for (const item of items) {
        const deleteResponse = await fetch(`${this.directusUrl}/items/${collection}/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.token}` }
        });

        if (deleteResponse.ok) {
          deletedCount++;
          batchDeleted++;
        } else {
          console.log(`    ⚠️  Failed to delete item ${item.id}: ${deleteResponse.statusText}`);
        }
      }

      console.log(`    ✅ Deleted ${batchDeleted} items (total: ${deletedCount}/${totalItems})`);

      // If we got fewer items than the batch size, we're done
      if (items.length < batchSize) {
        hasMore = false;
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`  ✅ Completed: Deleted ${deletedCount} items from ${collection}`);
  }

  /**
   * Run the complete cleanup process
   */
  async runCleanup() {
    console.log('🧹 Starting batch Directus data cleanup...\n');

    try {
      const collections = [
        'branch_menu_items',
        'menu_items',
        'categories',
        'brand_menus',
        'branches',
        'brands'
      ];

      for (const collection of collections) {
        await this.deleteItemsInBatches(collection, 50); // Smaller batches for stability
        console.log();
      }

      console.log('🎉 Batch Directus data cleanup completed successfully!');

    } catch (error) {
      console.error('❌ Batch cleanup failed:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new BatchCleanup();
  cleanup.runCleanup().catch(console.error);
}

export default BatchCleanup;