#!/usr/bin/env node

/**
 * Cleanup Old Menu Items Script
 * Removes menu items that are not part of our brand structure
 * (old CukCuk items and other orphaned menu items)
 */

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-directus-token-here';

class OldMenuItemsCleanup {
  constructor() {
    this.directusUrl = DIRECTUS_URL;
    this.token = DIRECTUS_TOKEN;
  }

  /**
   * Get count of old menu items to delete
   */
  async getOldMenuItemsCount() {
    try {
      // Get items that are clearly old: external_source = 'cukcuk' OR brand_menu is null
      const cukcukResponse = await fetch(
        `${this.directusUrl}/items/menu_items?filter=%7B%22external_source%22%3A%7B%22_eq%22%3A%22cukcuk%22%7D%7D&limit=1&meta=total_count&fields=id`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );

      let cukcukCount = 0;
      if (cukcukResponse.ok) {
        const cukcukResult = await cukcukResponse.json();
        cukcukCount = cukcukResult.meta?.total_count || 0;
      }

      const orphanedResponse = await fetch(
        `${this.directusUrl}/items/menu_items?filter=%7B%22_and%22%3A%5B%7B%22external_source%22%3A%7B%22_neq%22%3A%22seeding_script%22%7D%7D%2C%7B%22brand_menu%22%3A%7B%22_null%22%3Atrue%7D%7D%5D%7D&limit=1&meta=total_count&fields=id`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );

      let orphanedCount = 0;
      if (orphanedResponse.ok) {
        const orphanedResult = await orphanedResponse.json();
        orphanedCount = orphanedResult.meta?.total_count || 0;
      }

      return { cukcukCount, orphanedCount, total: cukcukCount + orphanedCount };
    } catch (error) {
      console.log(`  ⚠️  Error getting counts: ${error.message}`);
      return { cukcukCount: 0, orphanedCount: 0, total: 0 };
    }
  }

  /**
   * Delete old menu items in batches
   */
  async deleteOldMenuItems() {
    console.log('🗑️  Cleaning up old menu items...\n');

    const counts = await this.getOldMenuItemsCount();
    console.log(`📊 Found ${counts.total} old menu items to delete:`);
    console.log(`  - CukCuk items: ${counts.cukcukCount}`);
    console.log(`  - Orphaned items: ${counts.orphanedCount}`);

    if (counts.total === 0) {
      console.log('✅ No old menu items found. Database is already clean!');
      return;
    }

    let totalDeleted = 0;
    const batchSize = 50;

    // Delete CukCuk items first
    console.log('\n🗑️  Deleting CukCuk menu items...');
    let cukcukDeleted = await this.deleteItemsByFilter(
      { "external_source": { "_eq": "cukcuk" } },
      batchSize,
      "CukCuk"
    );
    totalDeleted += cukcukDeleted;

    // Delete orphaned items (not from seeding script and no brand_menu)
    console.log('\n🗑️  Deleting orphaned menu items...');
    let orphanedDeleted = await this.deleteItemsByFilter(
      {
        "_and": [
          { "external_source": { "_neq": "seeding_script" } },
          { "brand_menu": { "_null": true } }
        ]
      },
      batchSize,
      "orphaned"
    );
    totalDeleted += orphanedDeleted;

    console.log(`\n✅ Cleanup completed! Deleted ${totalDeleted} old menu items total.`);
  }

  /**
   * Delete items by filter in batches
   */
  async deleteItemsByFilter(filter, batchSize, itemType) {
    let deletedCount = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        // Get a batch of items to delete
        const filterString = encodeURIComponent(JSON.stringify(filter));
        const url = `${this.directusUrl}/items/menu_items?filter=${filterString}&limit=${batchSize}&fields=id,name,code`;

        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${itemType} items: ${response.statusText}`);
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
          const deleteResponse = await fetch(
            `${this.directusUrl}/items/menu_items/${item.id}`,
            {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${this.token}` }
            }
          );

          if (deleteResponse.ok) {
            deletedCount++;
            batchDeleted++;
          } else {
            console.log(`    ⚠️  Failed to delete ${itemType} item ${item.name} (${item.id}): ${deleteResponse.statusText}`);
          }
        }

        console.log(`    ✅ Deleted ${batchDeleted} ${itemType} items (total: ${deletedCount})`);

        // If we got fewer items than the batch size, we're done
        if (items.length < batchSize) {
          hasMore = false;
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`    ⚠️  Error in batch: ${error.message}`);
        hasMore = false;
      }
    }

    return deletedCount;
  }

  /**
   * Run the complete cleanup
   */
  async runCleanup() {
    console.log('🧹 Starting old menu items cleanup...\n');

    try {
      await this.deleteOldMenuItems();

      // Verify the cleanup
      console.log('\n🔍 Verifying cleanup results...');
      const finalCounts = await this.getOldMenuItemsCount();

      if (finalCounts.total === 0) {
        console.log('✅ Perfect! All old menu items have been removed.');
      } else {
        console.log(`⚠️  ${finalCounts.total} old items remain (this might be expected if some are in use).`);
      }

      console.log('\n🎉 Old menu items cleanup completed successfully!');

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new OldMenuItemsCleanup();
  cleanup.runCleanup().catch(console.error);
}

export default OldMenuItemsCleanup;