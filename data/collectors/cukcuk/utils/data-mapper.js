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
      },
      menu_items: {
        'Id': 'external_id',
        'Name': 'name',
        'Code': 'code',
        'Description': 'description',
        'Price': 'price',
        'CategoryCode': 'category_code',
        'CategoryName': 'category_name',
        'Inactive': 'is_active',
        'UnitName': 'unit_name',
        'PrintGroup': 'print_group',
        'Barcode': 'barcode',
        'Image': 'image'
      },
      tables: {
        'Id': 'external_id',
        'Name': 'name',
        'Code': 'code',
        'Description': 'description',
        'Capacity': 'capacity',
        'ZoneId': 'zone_id',
        'ZoneName': 'zone_name',
        'Inactive': 'is_active',
        'TableType': 'table_type',
        'Shape': 'shape',
        'PosX': 'pos_x',
        'PosY': 'pos_y'
      },
      layouts: {
        'Id': 'external_id',
        'Name': 'name',
        'Code': 'code',
        'Description': 'description',
        'BranchId': 'branch_id',
        'BranchName': 'branch_name',
        'Inactive': 'is_active',
        'LayoutType': 'layout_type',
        'BackgroundImage': 'background_image'
      },
      orders: {
        'Id': 'external_id',
        'BillCode': 'order_number',
        'TableName': 'table_name',
        'AreaName': 'zone_name',
        'CustomerName': 'customer_name',
        'CustomerPhone': 'customer_phone',
        'CustomerEmail': 'customer_email',
        'Status': 'status',
        'Priority': 'priority',
        'OrderType': 'order_type',
        'SubTotal': 'subtotal',
        'TaxAmount': 'tax_amount',
        'DiscountAmount': 'discount_amount',
        'ServiceCharge': 'service_charge',
        'TotalAmount': 'total_amount',
        'PaymentMethod': 'payment_method',
        'PaymentStatus': 'payment_status',
        'Note': 'notes',
        'SpecialRequest': 'special_requests',
        'OrderTime': 'date_created',
        'UpdateTime': 'date_updated'
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
  mapCategory(cukcukCategory, branchMap = new Map()) {
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

      // Map branch relation using branch external ID to primary key
      if (cukcukCategory.BranchId && branchMap.has(cukcukCategory.BranchId)) {
        category.branch_relation = branchMap.get(cukcukCategory.BranchId);
        logger.debug(`Mapped category ${category.name} to branch ID: ${category.branch_relation}`);
      }

      // Add additional metadata
      category.meta = {
        cukcuk_data: {
          original: cukcukCategory,
          mapped_at: new Date().toISOString(),
          mapper_version: '2.0.0'
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
   * Map CukCuk menu item data to Directus menu_items collection
   */
  mapMenuItem(cukcukMenuItem, branchMap = new Map(), categoryMap = new Map()) {
    try {
      const menuItem = {
        name: cukcukMenuItem.Name || '',
        code: cukcukMenuItem.Code || cukcukMenuItem.Id || cukcukMenuItem.InventoryItemId,
        description: cukcukMenuItem.Description || `${cukcukMenuItem.Name || 'Unknown'} - Imported from CukCuk`,
        external_id: cukcukMenuItem.InventoryItemId || cukcukMenuItem.Id || cukcukMenuItem.Code,
        external_source: 'cukcuk',
        is_active: !cukcukMenuItem.Inactive,
        price: parseFloat(cukcukMenuItem.Price || cukcukMenuItem.SellingPrice) || 0,
        cost: parseFloat(cukcukMenuItem.Cost) || 0,
        external_category_id: cukcukMenuItem.CategoryID || '',
        category_code: cukcukMenuItem.CategoryID || '',
        category_name: cukcukMenuItem.CategoryName || '',
        unit_name: cukcukMenuItem.UnitName || 'piece',
        print_group: cukcukMenuItem.PrintGroup || '',
        barcode: cukcukMenuItem.Barcode || '',
        image_url: cukcukMenuItem.Image || '',
        sku: cukcukMenuItem.Code || cukcukMenuItem.Id || cukcukMenuItem.InventoryItemId,
        track_inventory: cukcukMenuItem.IsTrackInventory || false,
        allow_decimal: cukcukMenuItem.AllowDecimal || false,
        is_available: cukcukMenuItem.IsAvailable !== false,
        sort: 0,
        nutritional_info: {},
        allergen_info: {},
        preparation_time: parseInt(cukcukMenuItem.PreparationTime) || 0,
        spice_level: parseInt(cukcukMenuItem.SpiceLevel) || 0,
        dietary_restrictions: [],
        inventory_count: parseInt(cukcukMenuItem.InventoryCount) || 0,
        min_inventory: parseInt(cukcukMenuItem.MinInventory) || 0,
        is_taxable: cukcukMenuItem.IsTaxable !== false,
        tax_rate: parseFloat(cukcukMenuItem.TaxRate) || 0,
        sync_status: 'synced',
        last_sync_at: new Date().toISOString()
      };

      // Store complete CukCuk data for reference
      menuItem.external_data = {
        original: cukcukMenuItem,
        mapped_at: new Date().toISOString(),
        mapper_version: '2.0.0'
      };

      // Extract custom fields from CukCuk
      if (cukcukMenuItem.CustomFields) {
        menuItem.custom_fields = cukcukMenuItem.CustomFields;
      }

      // Extract tags if available
      if (cukcukMenuItem.Tags) {
        menuItem.tags = Array.isArray(cukcukMenuItem.Tags) ? cukcukMenuItem.Tags : [cukcukMenuItem.Tags];
      }

      // Handle item type for additional categorization
      if (cukcukMenuItem.ItemType) {
        menuItem.item_type = cukcukMenuItem.ItemType;
        // Map item type to descriptive name
        const itemTypeMap = {
          1: 'Món ăn',
          2: 'Món ăn theo nguyên liệu',
          3: 'Món ăn theo nhóm',
          4: 'Combo',
          5: 'Đồ uống đóng chai',
          6: 'Đồ uống pha chế',
          7: 'Mặt hàng khác',
          8: 'Nguyên vật liệu',
          10: 'Đồ uống theo nhóm',
          12: 'Combo tùy chọn'
        };
        menuItem.item_type_name = itemTypeMap[cukcukMenuItem.ItemType] || 'Khác';
      }

      // Add branch context if available
      if (cukcukMenuItem.BranchId) {
        menuItem.branch_id = cukcukMenuItem.BranchId;
        menuItem.branch_name = cukcukMenuItem.BranchName || '';
      }

      // Map branch relation using branch external ID to primary key
      if (cukcukMenuItem.BranchId && branchMap.has(cukcukMenuItem.BranchId)) {
        menuItem.branch_id = branchMap.get(cukcukMenuItem.BranchId);
        logger.debug(`Mapped menu item ${menuItem.name} to branch ID: ${menuItem.branch_id}`);
      }

      // Map category relationship using category external ID to primary key
      if (cukcukMenuItem.CategoryID && categoryMap.has(cukcukMenuItem.CategoryID)) {
        menuItem.category_id = categoryMap.get(cukcukMenuItem.CategoryID);
        logger.debug(`Mapped menu item ${menuItem.name} to category ID: ${menuItem.category_id}`);
      }

      // Add nutritional info if available
      if (cukcukMenuItem.NutritionalInfo) {
        menuItem.nutritional_info = cukcukMenuItem.NutritionalInfo;
      }

      // Add allergen info if available
      if (cukcukMenuItem.AllergenInfo) {
        menuItem.allergen_info = cukcukMenuItem.AllergenInfo;
      }

      // Add dietary restrictions if available
      if (cukcukMenuItem.DietaryRestrictions) {
        menuItem.dietary_restrictions = Array.isArray(cukcukMenuItem.DietaryRestrictions)
          ? cukcukMenuItem.DietaryRestrictions
          : [cukcukMenuItem.DietaryRestrictions];
      }

      logger.debug(`Mapped menu item: ${menuItem.name} (${menuItem.external_id}) - Price: ${menuItem.price} VND`);
      return menuItem;
    } catch (error) {
      logger.error(`Failed to map menu item ${cukcukMenuItem.Id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map CukCuk table data to Directus tables collection
   */
  mapTable(cukcukTable, branchMap = new Map()) {
    try {
      const table = {
        name: cukcukTable.MapObjectName || '',
        code: cukcukTable.MapObjectName || cukcukTable.MapObjectID,
        description: `${cukcukTable.MapObjectName || 'Unknown'} - Imported from CukCuk`,
        external_id: cukcukTable.MapObjectID,
        external_source: 'cukcuk',
        is_active: cukcukTable.IsAvailable !== undefined ? cukcukTable.IsAvailable : true,
        capacity: parseInt(cukcukTable.Capacity) || 4,
        zone_id: cukcukTable.AreaID || '',
        zone_name: cukcukTable.AreaName || 'Main Area',
        table_type: this.mapTableType(cukcukTable.TableType) || 'standard',
        shape: this.mapTableShape(cukcukTable.Shape) || 'rectangle',
        position_x: parseInt(cukcukTable.PosX) || 0,
        position_y: parseInt(cukcukTable.PosY) || 0,
        width: parseInt(cukcukTable.Width) || 80,
        height: parseInt(cukcukTable.Height) || 80,
        rotation: parseInt(cukcukTable.Rotation) || 0,
        is_mergeable: cukcukTable.AllowMergeTable || false,
        is_reserved: cukcukTable.IsReserved || false,
        is_available: cukcukTable.IsAvailable !== undefined ? cukcukTable.IsAvailable : true,
        branch_id: cukcukTable.BranchId || '',
        sort: 0,
        // Enhanced fields for CukCuk integration
        map_object_id: cukcukTable.MapObjectID,
        map_object_name: cukcukTable.MapObjectName,
        area_id: cukcukTable.AreaID,
        area_name: cukcukTable.AreaName,
        allow_merge_table: cukcukTable.AllowMergeTable || false,
        sync_status: 'synced',
        last_sync_at: new Date().toISOString()
      };

      // Map branch relation using branch external ID to primary key
      if (cukcukTable.BranchId && branchMap.has(cukcukTable.BranchId)) {
        table.branch_relation = branchMap.get(cukcukTable.BranchId);
        logger.debug(`Mapped table ${table.name} to branch ID: ${table.branch_relation}`);
      }

      // Store branch info for display purposes
      if (cukcukTable.BranchId && branchMap.has(cukcukTable.BranchId)) {
        const branchInfo = branchMap.get(cukcukTable.BranchId);
        table.branch_display_name = `${branchInfo.name} - ${branchInfo.code}`;
        logger.debug(`Mapped table ${table.name} to branch: ${table.branch_display_name}`);
      }

      // Store complete CukCuk data for reference
      table.external_sync_data = {
        original: cukcukTable,
        mapped_at: new Date().toISOString(),
        mapper_version: '2.0.0',
        branch_info: cukcukTable.BranchId ? branchMap.get(cukcukTable.BranchId) : null
      };

      // Generate QR code URL based on SOL eMenu format
      if (cukcukTable.BranchId && cukcukTable.MapObjectID) {
        table.qr_code_url = `https://sol.cukcuk.vn/order-online/self-order?branchID=${cukcukTable.BranchId}&idTable=${cukcukTable.MapObjectID}`;
      }

      logger.debug(`Mapped table: ${table.name} (${table.external_id}) in zone: ${table.zone_name} - Capacity: ${table.capacity}`);
      return table;
    } catch (error) {
      logger.error(`Failed to map table ${cukcukTable.MapObjectID}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map CukCuk layout data to Directus layouts collection
   */
  mapLayout(cukcukLayout) {
    try {
      const layout = {
        name: cukcukLayout.Name || '',
        code: cukcukLayout.Code || cukcukLayout.Id,
        description: cukcukLayout.Description || `${cukcukLayout.Name || 'Unknown'} - Imported from CukCuk`,
        external_id: cukcukLayout.Id,
        external_source: 'cukcuk',
        is_active: !cukcukLayout.Inactive,
        branch_id: cukcukLayout.BranchId || '',
        branch_name: cukcukLayout.BranchName || '',
        layout_type: cukcukLayout.LayoutType || 'restaurant',
        background_image: cukcukLayout.BackgroundImage || '',
        grid_size: 20,
        snap_to_grid: true,
        show_grid: true,
        is_default: false,
        sort: 0
      };

      // Add additional metadata
      layout.meta = {
        cukcuk_data: {
          original: cukcukLayout,
          mapped_at: new Date().toISOString(),
          mapper_version: '1.0.0'
        }
      };

      logger.debug(`Mapped layout: ${layout.name} (${layout.external_id})`);
      return layout;
    } catch (error) {
      logger.error(`Failed to map layout ${cukcukLayout.Id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map CukCuk order data to Directus orders collection
   */
  mapOrder(cukcukOrder, branchMap = new Map()) {
    try {
      const order = {
        order_number: cukcukOrder.BillCode || cukcukOrder.Code || cukcukOrder.Id,
        table_id: cukcukOrder.TableId || cukcukOrder.MapObjectID || '',
        table_name: cukcukOrder.TableName || cukcukOrder.MapObjectName || '',
        zone_name: cukcukOrder.AreaName || cukcukOrder.ZoneName || '',
        customer_name: cukcukOrder.CustomerName || '',
        customer_phone: cukcukOrder.CustomerPhone || '',
        customer_email: cukcukOrder.CustomerEmail || '',
        status: this.mapOrderStatus(cukcukOrder.Status) || 'pending',
        priority: this.mapOrderPriority(cukcukOrder.Priority) || 'normal',
        order_type: this.mapOrderType(cukcukOrder.OrderType) || 'dine_in',
        subtotal: parseFloat(cukcukOrder.SubTotal) || 0,
        tax_amount: parseFloat(cukcukOrder.TaxAmount) || 0,
        discount_amount: parseFloat(cukcukOrder.DiscountAmount) || 0,
        service_charge: parseFloat(cukcukOrder.ServiceCharge) || 0,
        total_amount: parseFloat(cukcukOrder.TotalAmount) || parseFloat(cukcukOrder.Amount) || 0,
        payment_method: this.mapPaymentMethod(cukcukOrder.PaymentMethod) || '',
        payment_status: this.mapPaymentStatus(cukcukOrder.PaymentStatus) || 'pending',
        notes: cukcukOrder.Note || cukcukOrder.Description || '',
        special_requests: cukcukOrder.SpecialRequest || '',
        branch_id: cukcukOrder.BranchId || '',
        staff_id: cukcukOrder.StaffId || '',
        external_id: cukcukOrder.Id || cukcukOrder.BillId,
        external_source: 'cukcuk',
        estimated_time: parseInt(cukcukOrder.EstimatedTime) || null,
        actual_time: parseInt(cukcukOrder.ActualTime) || null,
        date_created: cukcukOrder.OrderTime || cukcukOrder.CreatedDate || new Date().toISOString(),
        date_updated: cukcukOrder.UpdateTime || cukcukOrder.ModifiedDate || new Date().toISOString(),
        // Additional fields for order items
        order_items: this.mapOrderItems(cukcukOrder.OrderDetails || cukcukOrder.Items || []),
        // Sync tracking
        sync_status: 'synced',
        last_sync_at: new Date().toISOString()
      };

      // Store complete CukCuk data for reference
      order.external_data = {
        original: cukcukOrder,
        mapped_at: new Date().toISOString(),
        mapper_version: '1.0.0'
      };

      // Map branch relation using branch external ID to primary key
      if (cukcukOrder.BranchId && branchMap.has(cukcukOrder.BranchId)) {
        order.branch_relation = branchMap.get(cukcukOrder.BranchId);
        logger.debug(`Mapped order ${order.order_number} to branch ID: ${order.branch_relation}`);
      }

      // Add additional metadata
      if (cukcukOrder.CustomerCount) {
        order.customer_count = parseInt(cukcukOrder.CustomerCount) || 1;
      }

      if (cukcukOrder.GuestInfo) {
        order.guest_info = cukcukOrder.GuestInfo;
      }

      if (cukcukOrder.PromotionCode) {
        order.promotion_code = cukcukOrder.PromotionCode;
      }

      logger.debug(`Mapped order: ${order.order_number} (${order.external_id}) - Total: ${order.total_amount} VND`);
      return order;
    } catch (error) {
      logger.error(`Failed to map order ${cukcukOrder.Id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map order items from CukCuk order details
   */
  mapOrderItems(orderDetails) {
    if (!Array.isArray(orderDetails)) return [];

    return orderDetails.map(item => ({
      external_id: item.Id || item.ItemId,
      item_code: item.ItemCode || item.Code,
      item_name: item.ItemName || item.Name,
      quantity: parseInt(item.Quantity) || 1,
      unit_price: parseFloat(item.UnitPrice) || parseFloat(item.Price) || 0,
      total_price: parseFloat(item.TotalPrice) || parseFloat(item.Amount) || 0,
      notes: item.Note || '',
      status: this.mapOrderItemStatus(item.Status) || 'ordered',
      category_name: item.CategoryName || '',
      external_data: {
        original: item,
        mapped_at: new Date().toISOString()
      }
    }));
  }

  /**
   * Map CukCuk order status to Directus format
   */
  mapOrderStatus(cukcukStatus) {
    const statusMap = {
      'New': 'pending',
      'Confirmed': 'confirmed',
      'Preparing': 'preparing',
      'Ready': 'ready',
      'Served': 'served',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
      'Paid': 'completed',
      'Unpaid': 'pending'
    };
    return statusMap[cukcukStatus] || 'pending';
  }

  /**
   * Map CukCuk order priority to Directus format
   */
  mapOrderPriority(cukcukPriority) {
    const priorityMap = {
      'Urgent': 'urgent',
      'High': 'high',
      'Normal': 'normal',
      'Low': 'low'
    };
    return priorityMap[cukcukPriority] || 'normal';
  }

  /**
   * Map CukCuk order type to Directus format
   */
  mapOrderType(cukcukOrderType) {
    const typeMap = {
      'DineIn': 'dine_in',
      'TakeAway': 'takeaway',
      'Delivery': 'delivery',
      'Pickup': 'takeaway'
    };
    return typeMap[cukcukOrderType] || 'dine_in';
  }

  /**
   * Map CukCuk payment method to Directus format
   */
  mapPaymentMethod(cukcukPaymentMethod) {
    const methodMap = {
      'Cash': 'cash',
      'Card': 'card',
      'BankTransfer': 'bank_transfer',
      'EWallet': 'ewallet',
      'Credit': 'credit'
    };
    return methodMap[cukcukPaymentMethod] || '';
  }

  /**
   * Map CukCuk payment status to Directus format
   */
  mapPaymentStatus(cukcukPaymentStatus) {
    const statusMap = {
      'Paid': 'paid',
      'Unpaid': 'pending',
      'Pending': 'pending',
      'Failed': 'failed',
      'Refunded': 'refunded',
      'Partial': 'pending'
    };
    return statusMap[cukcukPaymentStatus] || 'pending';
  }

  /**
   * Map CukCuk order item status to Directus format
   */
  mapOrderItemStatus(cukcukStatus) {
    const statusMap = {
      'Ordered': 'ordered',
      'Preparing': 'preparing',
      'Ready': 'ready',
      'Served': 'served',
      'Cancelled': 'cancelled'
    };
    return statusMap[cukcukStatus] || 'ordered';
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

      case 'menu_item':
        if (!data.name || data.name.trim() === '') {
          errors.push('Menu item name is required');
        }
        if (!data.external_id || data.external_id.trim() === '') {
          errors.push('Menu item external_id is required');
        }
        if (data.price < 0) {
          errors.push('Menu item price cannot be negative');
        }
        break;

      case 'table':
        if (!data.name || data.name.trim() === '') {
          errors.push('Table name is required');
        }
        if (!data.external_id || data.external_id.trim() === '') {
          errors.push('Table external_id is required');
        }
        if (data.capacity < 1) {
          errors.push('Table capacity must be at least 1');
        }
        break;

      case 'layout':
        if (!data.name || data.name.trim() === '') {
          errors.push('Layout name is required');
        }
        if (!data.external_id || data.external_id.trim() === '') {
          errors.push('Layout external_id is required');
        }
        break;

      case 'order':
        if (!data.order_number || data.order_number.trim() === '') {
          errors.push('Order number is required');
        }
        if (!data.external_id || data.external_id.trim() === '') {
          errors.push('Order external_id is required');
        }
        if (data.total_amount < 0) {
          errors.push('Order total amount cannot be negative');
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
  mapBatch(items, type, branchMap = new Map(), categoryMap = new Map()) {
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
            mapped = this.mapCategory(item, branchMap);
            break;
          case 'menu_item':
            mapped = this.mapMenuItem(item, branchMap, categoryMap);
            break;
          case 'table':
            mapped = this.mapTable(item, branchMap);
            break;
          case 'layout':
            mapped = this.mapLayout(item, branchMap);
            break;
          case 'order':
            mapped = this.mapOrder(item, branchMap);
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

  /**
   * Map CukCuk table type to Directus format
   */
  mapTableType(cukcukType) {
    const typeMap = {
      1: 'standard',
      2: 'booth',
      3: 'private_room',
      4: 'bar',
      5: 'outdoor'
    };
    return typeMap[cukcukType] || 'standard';
  }

  /**
   * Map CukCuk table shape to Directus format
   */
  mapTableShape(cukcukShape) {
    const shapeMap = {
      1: 'rectangle',
      2: 'circle',
      3: 'square',
      4: 'other'
    };
    return shapeMap[cukcukShape] || 'rectangle';
  }
}

module.exports = { DataMapper };