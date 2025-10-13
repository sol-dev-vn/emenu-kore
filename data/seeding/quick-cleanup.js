#!/usr/bin/env node

/**
 * Quick Cleanup Script - Only clears brand-related data efficiently
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-directus-token-here';

async function quickCleanup() {
  console.log('🚀 Quick cleanup: Clearing only brand-related data...\n');

  // Clear brands first (this will cascade delete related items in many cases)
  console.log('🗑️  Clearing brands...');

  try {
    const brandsResponse = await fetch(`${DIRECTUS_URL}/items/brands?limit=-1&fields=id,name`, {
      headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }
    });

    if (brandsResponse.ok) {
      const brands = await brandsResponse.json();
      console.log(`  📊 Found ${brands.data.length} brands to delete`);

      for (const brand of brands.data) {
        const deleteResponse = await fetch(`${DIRECTUS_URL}/items/brands/${brand.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }
        });

        if (deleteResponse.ok) {
          console.log(`  ✅ Deleted brand: ${brand.name}`);
        } else {
          console.log(`  ⚠️  Failed to delete brand ${brand.name}: ${deleteResponse.statusText}`);
        }
      }
    }
  } catch (error) {
    console.log(`  ⚠️  Error clearing brands: ${error.message}`);
  }

  // Clear remaining brand_menus if any exist
  console.log('\n🗑️  Clearing brand menus...');
  try {
    const menusResponse = await fetch(`${DIRECTUS_URL}/items/brand_menus?limit=-1&fields=id`, {
      headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }
    });

    if (menusResponse.ok) {
      const menus = await menusResponse.json();
      console.log(`  📊 Found ${menus.data.length} brand menus to delete`);

      for (const menu of menus.data.slice(0, 50)) { // Limit to avoid timeout
        const deleteResponse = await fetch(`${DIRECTUS_URL}/items/brand_menus/${menu.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }
        });

        if (deleteResponse.ok) {
          console.log(`  ✅ Deleted brand menu`);
        }
      }
    }
  } catch (error) {
    console.log(`  ⚠️  Error clearing brand menus: ${error.message}`);
  }

  console.log('\n✅ Quick cleanup completed! Ready to run seeding script.');
}

// Run the cleanup
quickCleanup().catch(console.error);