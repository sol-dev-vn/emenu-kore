#!/usr/bin/env node

/**
 * Fast Cleanup Script - Efficiently removes old menu items
 * Uses larger batches and parallel processing for speed
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-directus-token-here';

class FastCleanup {
  constructor() {
    this.directusUrl = DIRECTUS_URL;
    this.token = DIRECTUS_TOKEN;
  }

  /**
   * Delete items using parallel processing
   */
  async deleteItemsParallel(filter, batchSize = 200, maxConcurrent = 10) {
    console.log(`🚀 Starting parallel deletion with ${maxConcurrent} concurrent operations...`);

    // Get IDs of items to delete first
    const filterString = encodeURIComponent(JSON.stringify(filter));
    const countUrl = `${this.directusUrl}/items/menu_items?filter=${filterString}&limit=1&meta=total_count&fields=id`;

    const countResponse = await fetch(countUrl, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (!countResponse.ok) {
      throw new Error(`Failed to get count: ${countResponse.statusText}`);
    }

    const countResult = await countResponse.json();
    const totalCount = countResult.meta?.total_count || 0;

    console.log(`📊 Found ${totalCount} items to delete`);

    if (totalCount === 0) {
      return 0;
    }

    // Get all item IDs first (with fields limitation to avoid images issue)
    const allItemsUrl = `${this.directusUrl}/items/menu_items?filter=${filterString}&limit=${totalCount}&fields=id,name,code`;

    const allItemsResponse = await fetch(allItemsUrl, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (!allItemsResponse.ok) {
      throw new Error(`Failed to fetch items: ${allItemsResponse.statusText}`);
    }

    const allItems = await allItemsResponse.json();
    const items = allItems.data || [];

    console.log(`📥 Retrieved ${items.length} item IDs`);

    // Process items in parallel batches
    let deletedCount = 0;
    const promises = [];

    for (let i = 0; i < items.length; i += batchSize * maxConcurrent) {
      // Create batch of promises
      const batchPromises = [];

      for (let j = 0; j < maxConcurrent && (i + j * batchSize) < items.length; j++) {
        const batchStart = i + j * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, items.length);
        const batchItems = items.slice(batchStart, batchEnd);

        const promise = this.deleteBatch(batchItems, batchStart, batchEnd);
        batchPromises.push(promise);
      }

      // Wait for current batch of promises to complete
      const batchResults = await Promise.all(batchPromises);
      deletedCount += batchResults.reduce((sum, count) => sum + count, 0);

      console.log(`✅ Processed ${Math.min(i + batchSize * maxConcurrent, items.length)}/${items.length} items (${deletedCount} deleted)`);

      // Small delay between batches to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return deletedCount;
  }

  /**
   * Delete a batch of items
   */
  async deleteBatch(items, batchStart, batchEnd) {
    let deletedCount = 0;

    for (const item of items) {
      try {
        const deleteResponse = await fetch(
          `${this.directusUrl}/items/menu_items/${item.id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${this.token}` }
          }
        );

        if (deleteResponse.ok) {
          deletedCount++;
        }
      } catch (error) {
        // Continue with other items if one fails
      }
    }

    return deletedCount;
  }

  /**
   * Run the fast cleanup
   */
  async runFastCleanup() {
    console.log('⚡ Starting fast cleanup of old menu items...\n');

    try {
      // Define filters for different types of old items
      const cukcukFilter = { "external_source": { "_eq": "cukcuk" } };
      const orphanedFilter = {
        "_and": [
          { "external_source": { "_neq": "seeding_script" } },
          { "brand_menu": { "_null": true } }
        ]
      };

      let totalDeleted = 0;

      // Clean up CukCuk items
      console.log('🗑️  Cleaning up CukCuk menu items...');
      const cukcukDeleted = await this.deleteItemsParallel(cukcukFilter, 100, 15);
      totalDeleted += cukcukDeleted;

      console.log(`\n✅ Deleted ${cukcukDeleted} CukCuk items`);

      // Clean up orphaned items
      console.log('\n🗑️  Cleaning up orphaned menu items...');
      const orphanedDeleted = await this.deleteItemsParallel(orphanedFilter, 100, 15);
      totalDeleted += orphanedDeleted;

      console.log(`\n✅ Deleted ${orphanedDeleted} orphaned items`);

      console.log(`\n🎉 Fast cleanup completed! Deleted ${totalDeleted} old menu items total.`);

    } catch (error) {
      console.error('❌ Fast cleanup failed:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new FastCleanup();
  cleanup.runFastCleanup().catch(console.error);
}

export default FastCleanup;