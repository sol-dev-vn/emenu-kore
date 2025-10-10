#!/usr/bin/env node

/**
 * Data mapping utilities for CukCuk to Directus sync
 * Handles transformation of CukCuk data format to Directus collection format
 */

const { logger } = require('./logger');

class DataMapper {
  constructor() {
    this.fieldMappings = {
      branches: {
        'Id': 'external_id',
        'Name': 'name',
        'Code': 'code',
        'Address': 'address',
        'Phone': 'phone',
        'Description': 'description',
        'Inactive': 'is_active',
        'IsBaseDepot': 'is_base_depot',
        'IsChainBranch': 'is_chain_branch'
      },
      categories: {
        'Id': 'external_id',
        'Name': 'name',
        'Code': 'code',
        'Description': 'description',
        'Inactive': 'is_active',
        'ParentId': 'parent_id',
        'IsLeaf': 'is_leaf',
        'Grade': 'grade'
      }
    };
  }

  /**
   * Map CukCuk branch data to Directus branches collection
   */
  mapBranch(cukcukBranch) {
    try {
      const branch = {
        name: cukcukBranch.Name || '',
        code: cukcukBranch.Code || cukcukBranch.Id,
        description: cukcukBranch.Description || `${cukcukBranch.Name || 'Unknown'} - Imported from CukCuk`,
        external_id: cukcukBranch.Id,
        external_source: 'cukcuk',
        is_active: !cukcukBranch.Inactive,
        address: cukcukBranch.Address || '',
        phone: cukcukBranch.Phone || '',
        email: cukcukBranch.Email || '',
        is_base_depot: cukcukBranch.IsBaseDepot || false,
        is_chain_branch: cukcukBranch.IsChainBranch || false,
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'VND',
        tax_rate: 0.0000,
        service_rate: 0.0000,
        has_vat: false,
        has_service: false,
        settings: {},
        sort: 0
      };

      // Add any additional CukCuk fields to meta for debugging
      branch.meta = {
        cukcuk_data: {
          original: cukcukBranch,
          mapped_at: new Date().toISOString(),
          mapper_version: '1.0.0'
        }
      };

      logger.debug(`Mapped branch: ${branch.name} (${branch.external_id})`);
      return branch;
    } catch (error) {
      logger.error(`Failed to map branch ${cukcukBranch.Id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map CukCuk category data to Directus categories collection
   */
  mapCategory(cukcukCategory) {
    try {
      const category = {
        name: cukcukCategory.Name || '',
        code: cukcukCategory.Code || cukcukCategory.Id,
        description: cukcukCategory.Description || `${cukcukCategory.Name || 'Unknown'} - Imported from CukCuk`,
        external_id: cukcukCategory.Id,
        external_source: 'cukcuk',
        is_active: !cukcukCategory.Inactive,
        is_leaf: cukcukCategory.IsLeaf !== undefined ? cukcukCategory.IsLeaf : true,
        grade: cukcukCategory.Grade || 1,
        sort: 0
      };

      // Handle parent category if needed
      if (cukcukCategory.ParentId) {
        category.parent_external_id = cukcukCategory.ParentId;
        logger.debug(`Category ${category.name} has parent: ${cukcukCategory.ParentId}`);
      }

      // Add additional metadata
      category.meta = {
        cukcuk_data: {
          original: cukcukCategory,
          mapped_at: new Date().toISOString(),
          mapper_version: '1.0.0'
        }
      };

      logger.debug(`Mapped category: ${category.name} (${category.external_id})`);
      return category;
    } catch (error) {
      logger.error(`Failed to map category ${cukcukCategory.Id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generic field mapping function
   */
  mapFields(sourceData, mapping) {
    const result = {};

    for (const [sourceField, targetField] of Object.entries(mapping)) {
      if (sourceData[sourceField] !== undefined) {
        result[targetField] = sourceData[sourceField];
      }
    }

    return result;
  }

  /**
   * Validate mapped data
   */
  validateMappedData(data, type) {
    const errors = [];

    switch (type) {
      case 'branch':
        if (!data.name || data.name.trim() === '') {
          errors.push('Branch name is required');
        }
        if (!data.external_id || data.external_id.trim() === '') {
          errors.push('Branch external_id is required');
        }
        break;

      case 'category':
        if (!data.name || data.name.trim() === '') {
          errors.push('Category name is required');
        }
        if (!data.external_id || data.external_id.trim() === '') {
          errors.push('Category external_id is required');
        }
        break;
    }

    if (errors.length > 0) {
      logger.warn(`Validation failed for ${type}: ${errors.join(', ')}`);
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Batch map array of items
   */
  mapBatch(items, type) {
    const results = [];
    const errors = [];

    items.forEach((item, index) => {
      try {
        let mapped;
        switch (type) {
          case 'branch':
            mapped = this.mapBranch(item);
            break;
          case 'category':
            mapped = this.mapCategory(item);
            break;
          default:
            throw new Error(`Unknown mapping type: ${type}`);
        }

        const validation = this.validateMappedData(mapped, type);
        if (validation.valid) {
          results.push(mapped);
        } else {
          errors.push({
            index,
            external_id: item.Id,
            errors: validation.errors
          });
        }
      } catch (error) {
        errors.push({
          index,
          external_id: item.Id,
          error: error.message
        });
      }
    });

    logger.logDataTransform(`CukCuk ${type}`, `Directus ${type}`, results.length);

    return {
      results,
      errors,
      totalProcessed: items.length,
      successCount: results.length,
      errorCount: errors.length
    };
  }

  /**
   * Handle parent-child relationships for categories
   */
  resolveCategoryHierarchy(categories) {
    const categoryMap = new Map();
    const resolvedCategories = [];

    // First pass: create category map
    categories.forEach(cat => {
      if (cat.external_id) {
        categoryMap.set(cat.external_id, { ...cat, children: [] });
      }
    });

    // Second pass: resolve parent relationships
    categories.forEach(cat => {
      const category = categoryMap.get(cat.external_id);
      if (category && category.parent_external_id) {
        const parent = categoryMap.get(category.parent_external_id);
        if (parent) {
          parent.children.push(category);
          category.parent_id = parent.id; // Will be set after Directus insertion
        } else {
          logger.warn(`Parent category not found: ${category.parent_external_id} for ${category.external_id}`);
        }
      } else if (category) {
        resolvedCategories.push(category);
      }
    });

    logger.info(`Resolved category hierarchy: ${resolvedCategories.length} root categories found`);
    return resolvedCategories;
  }
}

module.exports = { DataMapper };