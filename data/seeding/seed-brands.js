#!/usr/bin/env node

/**
 * Main seeding script for SOL Brands
 * This script creates all brand entities, brand menus, categories, and sample data
 */

import { brands } from './config/brands.js';
import { getCategoriesForBrand } from './config/categories.js';
import { getSampleItemsForBrand } from './config/sample-items.js';
import { getAllBranchMappings } from './config/branch-mappings.js';
import { validateBrandData, validateBrandMenuData, validateCategoryData } from './utils/data-validator.js';
import { FileUploader } from './utils/file-uploader.js';

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-directus-token-here';

class BrandSeeder {
  constructor() {
    this.directusUrl = DIRECTUS_URL;
    this.token = DIRECTUS_TOKEN;
    this.fileUploader = new FileUploader(this.directusUrl, this.token);
    this.createdBrands = new Map();
    this.createdBrandMenus = new Map();
    this.createdCategories = new Map();
    this.createdMenuItems = new Map();
    this.existingBranches = new Map();
  }

  /**
   * Generic method to create items in Directus
   */
  async createDirectusItem(collection, data) {
    try {
      // For menu_items, limit returned fields to avoid the images alias issue
      const url = collection === 'menu_items'
        ? `${this.directusUrl}/items/${collection}?fields=id,name,code,price,is_available,brand_menu`
        : `${this.directusUrl}/items/${collection}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create ${collection}: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Create brand entities
   */
  async createBrands() {
    console.log('🏢 Creating brand entities...');

    for (const brandConfig of brands) {
      try {
        // Validate brand data
        validateBrandData(brandConfig);

        console.log(`  Creating brand: ${brandConfig.name}`);

        // Upload brand logo
        const logo = await this.fileUploader.uploadBrandLogo(
          brandConfig.name,
          brandConfig.brand_color
        );

        // Create brand entity
        const brandData = {
          name: brandConfig.name,
          slug: brandConfig.slug,
          description: brandConfig.description,
          brand_color: brandConfig.brand_color,
          secondary_color: brandConfig.secondary_color,
          website_url: brandConfig.website_url,
          contact_email: brandConfig.contact_email,
          contact_phone: brandConfig.contact_phone,
          logo: logo?.id || null,
          is_active: true,
          sort: brandConfig.sort
        };

        const brand = await this.createDirectusItem('brands', brandData);
        this.createdBrands.set(brandConfig.id, brand);

        console.log(`  ✅ Created brand: ${brandConfig.name} (ID: ${brand.id})`);

      } catch (error) {
        console.error(`  ❌ Failed to create brand ${brandConfig.name}:`, error);
        throw error;
      }
    }

    console.log(`✅ Created ${this.createdBrands.size} brands\n`);
  }

  /**
   * Create brand menus
   */
  async createBrandMenus() {
    console.log('📋 Creating brand menus...');

    for (const [brandId, brand] of this.createdBrands) {
      try {
        console.log(`  Creating brand menu for: ${brand.name}`);

        const brandConfig = brands.find(b => b.id === brandId);

        const menuData = {
          brand: brand.id,
          name: `${brand.name} Menu`,
          description: `Master menu for ${brand.name}`,
          is_active: true,
          default_currency: 'VND',
          tax_rate: 0.08, // 8% VAT
          service_rate: 0.05, // 5% service charge
          sort: 1
        };

        validateBrandMenuData(menuData);
        const brandMenu = await this.createDirectusItem('brand_menus', menuData);
        this.createdBrandMenus.set(brandId, brandMenu);

        console.log(`  ✅ Created brand menu: ${brandMenu.name} (ID: ${brandMenu.id})`);

      } catch (error) {
        console.error(`  ❌ Failed to create brand menu for ${brand.name}:`, error);
        throw error;
      }
    }

    console.log(`✅ Created ${this.createdBrandMenus.size} brand menus\n`);
  }

  /**
   * Create categories
   */
  async createCategories() {
    console.log('📂 Creating categories...');

    for (const [brandId, brand] of this.createdBrands) {
      try {
        console.log(`  Creating categories for: ${brand.name}`);

        const categories = getCategoriesForBrand(brandId);
        const brandMenu = this.createdBrandMenus.get(brandId);

        let sortOrder = 1;

        for (const categoryConfig of categories) {
          const categoryData = {
            name: categoryConfig.name,
            slug: categoryConfig.slug,
            description: categoryConfig.description,
            brand: brand.id,
            brand_menu: brandMenu.id,
            display_order: sortOrder,
            is_active: true,
            sort: sortOrder
          };

          validateCategoryData(categoryData);
          const category = await this.createDirectusItem('categories', categoryData);

          console.log(`    ✅ Created category: ${category.name} (ID: ${category.id})`);
          sortOrder++;
        }

      } catch (error) {
        console.error(`  ❌ Failed to create categories for ${brand.name}:`, error);
        throw error;
      }
    }

    console.log(`✅ Created categories for all brands\n`);
  }

  /**
   * Create sample menu items
   */
  async createSampleMenuItems() {
    console.log('🍱 Creating sample menu items...');

    for (const [brandId, brand] of this.createdBrands) {
      try {
        console.log(`  Creating sample items for: ${brand.name}`);

        const brandMenu = this.createdBrandMenus.get(brandId);
        const sampleItems = getSampleItemsForBrand(brandId);

        let sortIndex = 1;

        for (const itemConfig of sampleItems) {
          const itemData = {
            brand_menu: brandMenu.id,
            name: itemConfig.name,
            code: itemConfig.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: itemConfig.description,
            price: itemConfig.price,
            is_available: true,
            sort: sortIndex,
            preparation_time: itemConfig.preparation_time || 15,
            dietary_info: itemConfig.dietary_info || [],
            external_source: 'seeding_script',
            is_active: true
          };

          const item = await this.createDirectusItem('menu_items', itemData);

          // Store the created menu item for later branch mapping
          if (!this.createdMenuItems.has(brandId)) {
            this.createdMenuItems.set(brandId, []);
          }
          this.createdMenuItems.get(brandId).push(item);

          console.log(`    ✅ Created menu item: ${item.name} (ID: ${item.id})`);
          sortIndex++;
        }

      } catch (error) {
        console.error(`  ❌ Failed to create sample items for ${brand.name}:`, error);
        // Don't throw here - continue with other brands
      }
    }

    console.log(`✅ Created sample menu items for all brands\n`);
  }

  /**
   * Load existing branches from Directus
   */
  async loadExistingBranches() {
    console.log('🏢 Loading existing branches...');

    try {
      const response = await fetch(`${this.directusUrl}/items/branches?limit=-1`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to load branches: ${response.statusText}`);
      }

      const result = await response.json();

      for (const branch of result.data) {
        this.existingBranches.set(branch.id, branch);
      }

      console.log(`  ✅ Loaded ${this.existingBranches.size} existing branches\n`);
    } catch (error) {
      console.error(`  ❌ Failed to load existing branches:`, error);
      console.log(`  ⚠️  Continuing without branch mapping\n`);
    }
  }

  /**
   * Update existing branches with brand relationships
   */
  async updateBranchBrandRelationships() {
    console.log('🔗 Updating branch-brand relationships...');

    const branchMappings = getAllBranchMappings();
    let updatedCount = 0;

    for (const mapping of branchMappings) {
      try {
        // Find corresponding existing branch
        let existingBranch = null;
        for (const [branchId, branch] of this.existingBranches) {
          if (branch.name === mapping.branchName || branch.code === mapping.branchCode) {
            existingBranch = { ...branch, id: branchId };
            break;
          }
        }

        // Find the created brand
        const brand = this.createdBrands.get(mapping.brandId);
        if (!brand) {
          console.log(`  ⚠️  Brand ${mapping.brandId} not found, skipping branch ${mapping.branchName}`);
          continue;
        }

        if (existingBranch) {
          // Update existing branch with brand relationship
          const updateData = {
            brand: brand.id
          };

          const updateResponse = await fetch(`${this.directusUrl}/items/branches/${existingBranch.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          });

          if (updateResponse.ok) {
            console.log(`  ✅ Updated branch: ${existingBranch.name} → ${brand.name}`);
            updatedCount++;
          } else {
            console.log(`  ⚠️  Failed to update branch ${existingBranch.name}: ${updateResponse.statusText}`);
          }
        } else {
          // Create sample branch for testing
          const branchData = {
            name: mapping.branchName,
            code: mapping.branchCode,
            description: mapping.description,
            brand: brand.id,
            is_active: true,
            sort: updatedCount + 1
          };

          const newBranch = await this.createDirectusItem('branches', branchData);
          console.log(`  ✅ Created sample branch: ${newBranch.name} → ${brand.name}`);
          updatedCount++;
        }

      } catch (error) {
        console.error(`  ❌ Failed to process branch mapping for ${mapping.branchName}:`, error);
      }
    }

    console.log(`✅ Updated ${updatedCount} branch-brand relationships\n`);
  }

  /**
   * Create sample Branch Menu Items relationships
   */
  async createSampleBranchMenuItems() {
    console.log('🔗 Creating sample Branch Menu Items relationships...');

    // Get sample branches for each brand
    const branchMappings = getAllBranchMappings();
    let relationshipsCreated = 0;

    for (const [brandId, brand] of this.createdBrands) {
      try {
        const brandMenu = this.createdBrandMenus.get(brandId);
        const menuItems = this.createdMenuItems.get(brandId) || [];

        // Find branches for this brand
        const brandBranchMappings = branchMappings.filter(m => m.brandId === brandId);

        for (const branchMapping of brandBranchMappings.slice(0, 2)) { // Limit to 2 branches per brand for sample
          // Find the branch (either existing or create sample)
          let branch = null;
          for (const [branchId, existingBranch] of this.existingBranches) {
            if (existingBranch.name === branchMapping.branchName || existingBranch.code === branchMapping.branchCode) {
              branch = { ...existingBranch, id: branchId };
              break;
            }
          }

          if (!branch) {
            // Create sample branch
            const branchData = {
              name: branchMapping.branchName,
              code: branchMapping.branchCode,
              description: branchMapping.description,
              brand: brand.id,
              is_active: true,
              sort: 1
            };
            branch = await this.createDirectusItem('branches', branchData);
          }

          // Create Branch Menu Items for the first few menu items
          const sampleMenuItems = menuItems.slice(0, 3); // Limit to 3 items per branch

          for (const menuItem of sampleMenuItems) {
            const branchMenuItemData = {
              branch: branch.id,
              menu_item: menuItem.id,
              is_active: true,
              sort: relationshipsCreated + 1,
              availability_note: 'Available during normal operating hours'
            };

            await this.createDirectusItem('branch_menu_items', branchMenuItemData);
            relationshipsCreated++;
          }

          console.log(`  ✅ Created ${sampleMenuItems.length} Branch Menu Items for ${branch.name}`);
        }

      } catch (error) {
        console.error(`  ❌ Failed to create Branch Menu Items for ${brand.name}:`, error);
      }
    }

    console.log(`✅ Created ${relationshipsCreated} Branch Menu Items relationships\n`);
  }

  /**
   * Validate all created data
   */
  async validateCreatedData() {
    console.log('🔍 Validating created data...');

    // Check brands
    const brandsResponse = await fetch(`${this.directusUrl}/items/brands?limit=-1`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (brandsResponse.ok) {
      const brandsData = await brandsResponse.json();
      console.log(`  ✅ Found ${brandsData.data.length} brands in database`);
    }

    // Check brand menus
    const menusResponse = await fetch(`${this.directusUrl}/items/brand_menus?limit=-1`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (menusResponse.ok) {
      const menusData = await menusResponse.json();
      console.log(`  ✅ Found ${menusData.data.length} brand menus in database`);
    }

    // Check categories
    const categoriesResponse = await fetch(`${this.directusUrl}/items/categories?limit=-1`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log(`  ✅ Found ${categoriesData.data.length} categories in database`);
    }

    // Check menu items
    const menuItemsResponse = await fetch(`${this.directusUrl}/items/menu_items?limit=-1`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (menuItemsResponse.ok) {
      const menuItemsData = await menuItemsResponse.json();
      console.log(`  ✅ Found ${menuItemsData.data.length} menu items in database`);
    }

    // Check branch menu items
    const branchMenuItemsResponse = await fetch(`${this.directusUrl}/items/branch_menu_items?limit=-1`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (branchMenuItemsResponse.ok) {
      const branchMenuItemsData = await branchMenuItemsResponse.json();
      console.log(`  ✅ Found ${branchMenuItemsData.data.length} branch menu items in database`);
    }

    console.log(`✅ Data validation complete\n`);
  }

  /**
   * Run the complete seeding process
   */
  async run() {
    console.log('🚀 Starting SOL Brands seeding process...\n');

    try {
      await this.createBrands();
      await this.createBrandMenus();
      await this.createCategories();
      await this.createSampleMenuItems();
      await this.loadExistingBranches();
      await this.updateBranchBrandRelationships();
      await this.createSampleBranchMenuItems();
      await this.validateCreatedData();

      console.log('🎉 Brand seeding completed successfully!');
      console.log('\n📊 Summary:');
      console.log(`  - Brands created: ${this.createdBrands.size}`);
      console.log(`  - Brand menus created: ${this.createdBrandMenus.size}`);
      console.log(`  - Categories created: ${this.createdBrands.size * 5} (5 per brand)`);
      console.log(`  - Sample menu items created: ${this.createdMenuItems.size}`);
      console.log(`  - Branch mappings processed: ${this.existingBranches.size} existing, ${getAllBranchMappings().length} total`);
      console.log(`  - Branch Menu Items relationships: sample data created for testing`);

    } catch (error) {
      console.error('❌ Brand seeding failed:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const seeder = new BrandSeeder();
  seeder.run().catch(console.error);
}

export default BrandSeeder;