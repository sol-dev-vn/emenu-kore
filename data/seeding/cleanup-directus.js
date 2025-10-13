#!/usr/bin/env node

/**
 * Directus Data Cleanup Script
 * Removes all brand-related data in correct order to avoid foreign key constraints
 */

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-directus-token-here';

class DirectusCleanup {
  constructor() {
    this.directusUrl = DIRECTUS_URL;
    this.token = DIRECTUS_TOKEN;
  }

  /**
   * Generic method to delete all items from a collection
   */
  async deleteAllItems(collection) {
    try {
      console.log(`🗑️  Clearing ${collection}...`);

      // First, get all items (limit fields for menu_items to avoid images alias issue)
      const url = collection === 'menu_items'
        ? `${this.directusUrl}/items/${collection}?limit=-1&fields=id,name,code,price,is_available,brand_menu`
        : `${this.directusUrl}/items/${collection}?limit=-1`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection}: ${response.statusText}`);
      }

      const result = await response.json();
      const items = result.data || [];

      if (items.length === 0) {
        console.log(`  ✅ ${collection} is already empty`);
        return;
      }

      // Delete all items
      let deletedCount = 0;
      for (const item of items) {
        const deleteResponse = await fetch(`${this.directusUrl}/items/${collection}/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.token}` }
        });

        if (deleteResponse.ok) {
          deletedCount++;
        } else {
          console.log(`  ⚠️  Failed to delete ${collection} item ${item.id}: ${deleteResponse.statusText}`);
        }
      }

      console.log(`  ✅ Deleted ${deletedCount} items from ${collection}`);

    } catch (error) {
      console.error(`  ❌ Error clearing ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Clean up data in correct order (child collections first)
   */
  async runCleanup() {
    console.log('🧹 Starting Directus data cleanup...\n');

    try {
      // Delete in order of dependency (child collections first)
      const collections = [
        'branch_menu_items',    // Many-to-many relationship
        'menu_items',          // Depends on brand_menus, categories
        'categories',          // Depends on brands, brand_menus
        'brand_menus',         // Depends on brands
        'branches',            // Depends on brands
        'brands'               // Parent collection
      ];

      for (const collection of collections) {
        await this.deleteAllItems(collection);
        console.log(); // Add spacing
      }

      console.log('🎉 Directus data cleanup completed successfully!');

    } catch (error) {
      console.error('❌ Data cleanup failed:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new DirectusCleanup();
  cleanup.runCleanup().catch(console.error);
}

export default DirectusCleanup;