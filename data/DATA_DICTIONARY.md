# Data Schema and Metrics Definitions

## Overview
This document defines the complete database schema for the SOL eMenu platform, including Directus collections for storing CukCuk integration data, eMenu functionality, and system management.

---

## eMenu Core Schema

### branches
Restaurant branch management with CukCuk integration
```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  external_id VARCHAR(100), -- CukCuk branch ID
  external_source VARCHAR(50) DEFAULT 'cukcuk',
  is_active BOOLEAN DEFAULT true,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  opening_hours JSON, -- Store opening hours JSON
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  currency VARCHAR(3) DEFAULT 'VND',
  tax_rate DECIMAL(5,4) DEFAULT 0.0000,
  service_rate DECIMAL(5,4) DEFAULT 0.0000,
  has_vat BOOLEAN DEFAULT false,
  has_service BOOLEAN DEFAULT false,
  vat_rate DECIMAL(5,4) DEFAULT 0.0000,
  service_rate DECIMAL(5,4) DEFAULT 0.0000,
  is_base_depot BOOLEAN DEFAULT false,
  is_chain_branch BOOLEAN DEFAULT false,
  settings JSON, -- Additional branch-specific settings
  sort INTEGER DEFAULT 0,

  -- Enhanced sync tracking fields
  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'synced', 'failed'
  last_sync_at TIMESTAMP, -- Last synchronization attempt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_branches_external_id ON branches(external_id);
CREATE INDEX idx_branches_code ON branches(code);
CREATE INDEX idx_branches_active ON branches(is_active);
CREATE INDEX idx_branches_sync_status ON branches(sync_status);
CREATE INDEX idx_branches_last_sync ON branches(last_sync_at);
```

### zones
Physical zones within branches for table organization
```sql
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  description TEXT,
  capacity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  settings JSON, -- Zone-specific settings
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_zones_branch_id ON zones(branch_id);
CREATE INDEX idx_zones_active ON zones(is_active);
```

### tables
Restaurant tables with QR code functionality
```sql
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  table_code VARCHAR(100) UNIQUE NOT NULL, -- QR code identifier
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  description TEXT,
  capacity INTEGER DEFAULT 4,
  min_capacity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  qr_code_url VARCHAR(500), -- Full QR code URL
  qr_code_image VARCHAR(500), -- Path to QR code image
  position JSON, -- {x: 0, y: 0, width: 100, height: 100} for layout
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, reserved, cleaning
  last_order_time TIMESTAMP,
  settings JSON, -- Table-specific settings
  sort INTEGER DEFAULT 0,

  -- Enhanced sync tracking fields
  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'synced', 'failed'
  last_sync_at TIMESTAMP, -- Last synchronization attempt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_tables_branch_id ON tables(branch_id);
CREATE INDEX idx_tables_zone_id ON tables(zone_id);
CREATE INDEX idx_tables_code ON tables(table_code);
CREATE INDEX idx_tables_status ON tables(status);
CREATE INDEX idx_tables_active ON tables(is_active);
CREATE INDEX idx_tables_sync_status ON tables(sync_status);
CREATE INDEX idx_tables_last_sync ON tables(last_sync_at);
```

### categories
Menu categories for food item organization
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  external_id VARCHAR(100), -- CukCuk category ID
  external_source VARCHAR(50) DEFAULT 'cukcuk',
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  icon VARCHAR(255), -- Icon or image URL
  color VARCHAR(7), -- Hex color code
  sort INTEGER DEFAULT 0,

  -- Enhanced sync tracking fields
  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'synced', 'failed'
  last_sync_at TIMESTAMP, -- Last synchronization attempt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_external_id ON categories(external_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sync_status ON categories(sync_status);
CREATE INDEX idx_categories_last_sync ON categories(last_sync_at);
```

### menu_items
Food and beverage items with CukCuk synchronization
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  external_id VARCHAR(100), -- CukCuk item ID
  external_source VARCHAR(50) DEFAULT 'cukcuk',
  category_id UUID REFERENCES categories(id),
  branch_id UUID REFERENCES branches(id), -- NULL if available at all branches
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_before_promo DECIMAL(10,2) DEFAULT 0.00,
  cost DECIMAL(10,2) DEFAULT 0.00,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  image VARCHAR(500), -- Image URL
  images JSON, -- Multiple images array
  tags JSON, -- ['vegetarian', 'spicy', 'popular']
  allergens JSON, -- Allergen information
  nutrition_info JSON, -- Nutritional information
  preparation_time INTEGER, -- Minutes
  addons JSON, -- Add-on options structure
  variants JSON, -- Size/variant options
  meta JSON, -- Additional metadata from CukCuk
  featured_tag VARCHAR(50), -- 'best-seller', 'popular', 'new', 'seasonal'
  sort INTEGER DEFAULT 0,

  -- Enhanced sync tracking fields
  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'synced', 'failed'
  last_sync_at TIMESTAMP, -- Last synchronization attempt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_menu_items_external_id ON menu_items(external_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_branch_id ON menu_items(branch_id);
CREATE INDEX idx_menu_items_active ON menu_items(is_active);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_featured ON menu_items(featured_tag);
CREATE INDEX idx_menu_items_sync_status ON menu_items(sync_status);
CREATE INDEX idx_menu_items_last_sync ON menu_items(last_sync_at);
```

### combos
Enhanced combo management system with CukCuk integration and custom analytics
```sql
CREATE TABLE combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,

  -- Pricing (Financial Layer - Synced with CukCuk)
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_before_combo DECIMAL(10,2) DEFAULT 0.00,
  cost DECIMAL(10,2) DEFAULT 0.00,

  -- Basic Configuration
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  image VARCHAR(500),
  images JSON,
  tags JSON,
  featured_tag VARCHAR(50),

  -- Combo Structure (Core Layer)
  combo_items JSON NOT NULL, -- [{item_id: uuid, external_item_id: string, quantity: decimal, included: boolean, category: string}]

  -- Financial Integration (CukCuk Compatibility)
  external_id VARCHAR(100), -- CukCuk combo ID if exists
  external_source VARCHAR(50) DEFAULT 'cukcuk',
  financial_category_id UUID REFERENCES categories(id), -- For financial reporting
  accounting_code VARCHAR(50), -- Accounting department code

  -- Enhanced Metadata (Analytics Layer)
  sales_category VARCHAR(100), -- 'family_meal', 'business_lunch', 'student_deal'
  meal_period VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'all_day'
  target_audience JSON, -- ['families', 'students', 'office_workers']
  profit_margin_tier VARCHAR(20), -- 'high', 'medium', 'low', 'loss_leader'
  seasonality VARCHAR(50), -- 'year_round', 'summer', 'winter', 'holiday'
  complexity_level INTEGER DEFAULT 1, -- 1-5 scale for kitchen operations

  -- Business Intelligence
  business_rules JSON, -- Pricing rules, availability conditions
  performance_targets JSON, -- Sales targets, profit goals
  competitive_positioning JSON, -- Market positioning data

  -- Operations
  preparation_time INTEGER, -- Minutes
  kitchen_station VARCHAR(100), -- Primary preparation station
  equipment_required JSON, -- ['oven', 'grill', 'fryer']

  -- Marketing & Display
  marketing_tags JSON, -- ['healthy', 'spicy', 'vegetarian', 'kids_friendly']
  display_priority INTEGER DEFAULT 0, -- Order in menu display
  promotional_badge VARCHAR(100), -- 'best_value', 'chef_special', 'limited_time'

  -- Custom Fields (Extensible)
  custom_attributes JSON, -- User-defined attributes
  meta JSON, -- Additional metadata

  -- Version Control
  version INTEGER DEFAULT 1,
  parent_combo_id UUID REFERENCES combos(id), -- For combo variations

  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_combos_active ON combos(is_active);
CREATE INDEX idx_combos_available ON combos(is_available);
CREATE INDEX idx_combos_featured ON combos(featured_tag);
CREATE INDEX idx_combos_external_id ON combos(external_id);
CREATE INDEX idx_combos_sales_category ON combos(sales_category);
CREATE INDEX idx_combos_meal_period ON combos(meal_period);
CREATE INDEX idx_combos_profit_tier ON combos(profit_margin_tier);
CREATE INDEX idx_combos_financial_category ON combos(financial_category_id);
```

### combo_analytics_categories
Custom categorization for sales reporting (independent of financial categories)
```sql
CREATE TABLE combo_analytics_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES combo_analytics_categories(id),

  -- Category Properties
  category_type VARCHAR(50) NOT NULL, -- 'sales_performance', 'customer_type', 'meal_type', 'profit_analysis'
  reporting_dimension VARCHAR(50), -- 'revenue', 'profit', 'volume', 'customer_satisfaction'

  -- Analytics Configuration
  color VARCHAR(7), -- Hex color for charts
  icon VARCHAR(255),
  display_order INTEGER DEFAULT 0,

  -- Business Rules
  inclusion_rules JSON, -- Rules for automatic categorization
  exclusion_rules JSON, -- Rules for exclusion

  is_active BOOLEAN DEFAULT true,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_combo_analytics_categories_type ON combo_analytics_categories(category_type);
CREATE INDEX idx_combo_analytics_categories_parent ON combo_analytics_categories(parent_id);
CREATE INDEX idx_combo_analytics_categories_active ON combo_analytics_categories(is_active);
```

### combo_category_mappings
Many-to-many mapping of combos to analytics categories
```sql
CREATE TABLE combo_category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  analytics_category_id UUID NOT NULL REFERENCES combo_analytics_categories(id) ON DELETE CASCADE,

  -- Mapping Properties
  weight DECIMAL(5,4) DEFAULT 1.0000, -- Weight for multi-category reporting
  is_primary BOOLEAN DEFAULT false, -- Primary category for reporting
  mapping_reason TEXT,

  -- Validity Period
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),

  UNIQUE(combo_id, analytics_category_id)
);

CREATE INDEX idx_combo_category_mappings_combo ON combo_category_mappings(combo_id);
CREATE INDEX idx_combo_category_mappings_category ON combo_category_mappings(analytics_category_id);
CREATE INDEX idx_combo_category_mappings_primary ON combo_category_mappings(is_primary);
```

### combo_performance_metrics
Sales performance tracking for combos
```sql
CREATE TABLE combo_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,

  -- Time Period
  report_date DATE NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'

  -- Sales Metrics
  orders_count INTEGER DEFAULT 0,
  units_sold INTEGER DEFAULT 0,
  gross_revenue DECIMAL(12,2) DEFAULT 0.00,
  net_revenue DECIMAL(12,2) DEFAULT 0.00,
  cost_of_goods_sold DECIMAL(12,2) DEFAULT 0.00,
  gross_profit DECIMAL(12,2) DEFAULT 0.00,
  profit_margin DECIMAL(5,4) DEFAULT 0.0000,

  -- Customer Metrics
  unique_customers INTEGER DEFAULT 0,
  repeat_customers INTEGER DEFAULT 0,
  customer_rating DECIMAL(3,2), -- Average rating

  -- Operational Metrics
  preparation_time_avg INTEGER, -- Average preparation time in minutes
  waste_percentage DECIMAL(5,4), -- Waste percentage

  -- Comparative Analysis
  vs_previous_period DECIMAL(5,4), -- Percentage change vs previous period
  vs_target DECIMAL(5,4), -- Percentage vs target

  -- Metadata
  external_sales_data JSON, -- Raw data from external systems

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id)
);

CREATE INDEX idx_combo_performance_combo_date ON combo_performance_metrics(combo_id, report_date);
CREATE INDEX idx_combo_performance_branch_date ON combo_performance_metrics(branch_id, report_date);
CREATE INDEX idx_combo_performance_period ON combo_performance_metrics(period_type);
```

### combo_variations
Combo size variations and options
```sql
CREATE TABLE combo_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,

  -- Variation Details
  name VARCHAR(255) NOT NULL, -- 'Small', 'Medium', 'Large', 'Family'
  code VARCHAR(100) NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_modifier_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'percentage'
  price_modifier_value DECIMAL(10,2) DEFAULT 0.00,

  -- Configuration
  size_multiplier DECIMAL(5,4) DEFAULT 1.0000, -- Multiplier for ingredients
  serving_size VARCHAR(100), -- '1-2 people', '3-4 people'
  additional_items JSON, -- Extra items in this variation

  -- Display
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_combo_variations_combo ON combo_variations(combo_id);
CREATE INDEX idx_combo_variations_active ON combo_variations(is_active);
```

### combo_ingredients_breakdown
Detailed ingredient breakdown for cost and inventory tracking
```sql
CREATE TABLE combo_ingredients_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES combo_variations(id) ON DELETE CASCADE,

  -- Ingredient Reference
  external_ingredient_id VARCHAR(100), -- CukCuk ingredient ID
  ingredient_name VARCHAR(255) NOT NULL,
  ingredient_category VARCHAR(100),

  -- Quantity and Cost
  quantity DECIMAL(10,4) NOT NULL,
  unit_of_measure VARCHAR(50),
  unit_cost DECIMAL(10,4) DEFAULT 0.00,
  total_cost DECIMAL(10,2) DEFAULT 0.00,

  -- Supply Chain
  supplier VARCHAR(255),
  supplier_sku VARCHAR(100),

  -- Nutritional Information
  calories DECIMAL(8,2),
  protein DECIMAL(6,2),
  carbs DECIMAL(6,2),
  fat DECIMAL(6,2),

  -- Allergen Information
  allergens JSON, -- ['gluten', 'dairy', 'nuts', 'soy']

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_combo_ingredients_combo ON combo_ingredients_breakdown(combo_id);
CREATE INDEX idx_combo_ingredients_variation ON combo_ingredients_breakdown(variation_id);
CREATE INDEX idx_combo_ingredients_external ON combo_ingredients_breakdown(external_ingredient_id);
```

### promotions
Promotional campaigns and discounts
```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  external_id VARCHAR(100), -- CukCuk promotion ID
  external_source VARCHAR(50) DEFAULT 'cukcuk',
  type VARCHAR(50) NOT NULL, -- 'discount', 'buy_one_get_one', 'combo_deal'
  discount_type VARCHAR(20), -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10,2) DEFAULT 0.00,
  min_order_amount DECIMAL(10,2) DEFAULT 0.00,
  max_discount_amount DECIMAL(10,2) DEFAULT 0.00,
  applicable_items JSON, -- Array of menu_item IDs
  applicable_categories JSON, -- Array of category IDs
  branch_id UUID REFERENCES branches(id), -- NULL if applicable to all branches
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  image VARCHAR(500),
  banner_text VARCHAR(255),
  terms_conditions TEXT,
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_promotions_external_id ON promotions(external_id);
CREATE INDEX idx_promotions_branch_id ON promotions(branch_id);
CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
```

### orders
Customer orders from eMenu
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  table_id UUID NOT NULL REFERENCES tables(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, preparing, ready, completed, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded
  payment_method VARCHAR(50),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  service_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'VND',
  notes TEXT,
  special_requests TEXT,
  order_items JSON NOT NULL, -- Detailed order items array
  promotion_id UUID REFERENCES promotions(id),
  external_order_id VARCHAR(100), -- For POS integration
  estimated_time INTEGER, -- Minutes
  actual_time INTEGER, -- Minutes
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_branch_id ON orders(branch_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_date_created ON orders(date_created);
CREATE INDEX idx_orders_external_id ON orders(external_order_id);
```

### banners
Promotional banners for eMenu
```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500) NOT NULL,
  mobile_image VARCHAR(500),
  link_url VARCHAR(500),
  link_target VARCHAR(20) DEFAULT '_self',
  position VARCHAR(50) DEFAULT 'top', -- 'top', 'middle', 'bottom'
  branch_id UUID REFERENCES branches(id), -- NULL if applicable to all branches
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_banners_branch_id ON banners(branch_id);
CREATE INDEX idx_banners_active ON banners(is_active);
CREATE INDEX idx_banners_position ON banners(position);
CREATE INDEX idx_banners_dates ON banners(start_date, end_date);
```

---

## Integration & Sync Schema

### sync_logs
Record of all CukCuk API synchronization activities
```sql
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type VARCHAR(50) NOT NULL, -- 'branches', 'menu_items', 'categories', 'promotions', 'tables'
  source VARCHAR(50) DEFAULT 'cukcuk',
  status VARCHAR(20) NOT NULL, -- 'running', 'completed', 'failed', 'partial'
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0, -- Records skipped due to resume functionality
  records_failed INTEGER DEFAULT 0,
  error_details JSON,
  last_sync_timestamp TIMESTAMP, -- Last timestamp from source system
  next_sync_at TIMESTAMP,

  -- Enhanced session logging
  session_log TEXT, -- Full session log in rich text format
  session_stats JSON, -- Session statistics (duration, entry counts, etc.)

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id)
);

CREATE INDEX idx_sync_logs_type ON sync_logs(sync_type);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_started_at ON sync_logs(started_at);
```

### sync_configurations
Configuration for automated synchronization
```sql
CREATE TABLE sync_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sync_type VARCHAR(50) NOT NULL,
  source VARCHAR(50) DEFAULT 'cukcuk',
  is_active BOOLEAN DEFAULT true,
  sync_frequency VARCHAR(20) DEFAULT 'manual', -- 'manual', 'hourly', 'daily', 'realtime'
  sync_endpoint VARCHAR(500),
  api_credentials JSON, -- Encrypted API credentials
  field_mapping JSON, -- Field mapping between source and target
  filters JSON, -- Data filters and conditions
  retry_config JSON, -- Retry configuration
  last_sync_at TIMESTAMP,
  next_sync_at TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_sync_config_type ON sync_configurations(sync_type);
CREATE INDEX idx_sync_config_active ON sync_configurations(is_active);
CREATE INDEX idx_sync_config_next_sync ON sync_configurations(next_sync_at);
```

---

## System Management Schema

### users
System users (managed by Directus)
```sql
-- Directus manages the users table automatically
-- Additional fields for eMenu-specific user data
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES directus_users(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  branch_id UUID REFERENCES branches(id),
  role VARCHAR(50) DEFAULT 'staff', -- 'super_admin', 'branch_manager', 'staff'
  permissions JSON, -- Role-based permissions
  preferences JSON, -- User preferences
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_branch_id ON user_profiles(branch_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
```

### system_settings
System-wide configuration
```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSON,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false, -- Whether settings are accessible via public API
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_public ON system_settings(is_public);
```

### audit_logs
Audit trail for all data changes
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(255) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
  old_values JSON,
  new_values JSON,
  changed_fields JSON,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_date_created ON audit_logs(date_created);
```

---

## POS Integration Schema

### cukcuk_tables
CukCuk restaurant table synchronization and mapping
```sql
CREATE TABLE cukcuk_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_object_id VARCHAR(100) NOT NULL, -- CukCuk MapObjectID
  map_object_name VARCHAR(255) NOT NULL, -- CukCuk MapObjectName
  area_id VARCHAR(100), -- CukCuk AreaID
  area_name VARCHAR(255), -- CukCuk AreaName
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL, -- Mapped to our tables
  is_available BOOLEAN DEFAULT true, -- CukCuk IsAvailable
  allow_merge_table BOOLEAN DEFAULT false, -- CukCuk AllowMergeTable
  external_sync_data JSON, -- Additional CukCuk table data
  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'synced', 'error'
  sync_error TEXT,
  last_sync_at TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_cukcuk_tables_map_object_id ON cukcuk_tables(map_object_id);
CREATE INDEX idx_cukcuk_tables_branch_id ON cukcuk_tables(branch_id);
CREATE INDEX idx_cukcuk_tables_table_id ON cukcuk_tables(table_id);
CREATE INDEX idx_cukcuk_tables_area_id ON cukcuk_tables(area_id);
CREATE INDEX idx_cukcuk_tables_sync_status ON cukcuk_tables(sync_status);
```

### cukcuk_categories
CukCuk category hierarchy synchronization
```sql
CREATE TABLE cukcuk_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(100) NOT NULL UNIQUE, -- CukCuk Id (GUID)
  code VARCHAR(100) NOT NULL, -- CukCuk Code
  name VARCHAR(255) NOT NULL, -- CukCuk Name
  description TEXT,
  is_leaf BOOLEAN DEFAULT true, -- CukCuk IsLeaf
  grade INTEGER DEFAULT 1, -- CukCuk Grade (1-9 hierarchy level)
  inactive BOOLEAN DEFAULT false, -- CukCuk Inactive
  parent_external_id VARCHAR(100), -- Parent category external_id
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL, -- Mapped to our categories
  sync_status VARCHAR(20) DEFAULT 'pending',
  sync_error TEXT,
  last_sync_at TIMESTAMP,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_cukcuk_categories_external_id ON cukcuk_categories(external_id);
CREATE INDEX idx_cukcuk_categories_code ON cukcuk_categories(code);
CREATE INDEX idx_cukcuk_categories_parent_id ON cukcuk_categories(parent_external_id);
CREATE INDEX idx_cukcuk_categories_grade ON cukcuk_categories(grade);
CREATE INDEX idx_cukcuk_categories_sync_status ON cukcuk_categories(sync_status);
```

### cukcuk_orders
Complete CukCuk order synchronization for POS integration
```sql
CREATE TABLE cukcuk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(100) NOT NULL UNIQUE, -- CukCuk Order ID
  order_no VARCHAR(100), -- CukCuk Order No
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL, -- Mapped to our orders

  -- Order Basic Info
  type INTEGER DEFAULT 1, -- 1: On-site, 2: Take-away, 3: Delivery
  status INTEGER DEFAULT 1, -- CukCuk status (1,2,3,4)
  customer_id VARCHAR(100), -- CukCuk CustomerId
  customer_name VARCHAR(255), -- CukCuk CustomerName
  customer_tel VARCHAR(50), -- CukCuk CustomerTel
  customer_address TEXT, -- CukCuk ShippingAddress

  -- Order Timing
  order_date TIMESTAMP, -- Order creation date
  shipping_date TIMESTAMP, -- CukCuk ShippingDate
  completed_date TIMESTAMP,

  -- Order Financials
  subtotal DECIMAL(12,2) DEFAULT 0.00,
  tax_amount DECIMAL(12,2) DEFAULT 0.00,
  service_amount DECIMAL(12,2) DEFAULT 0.00,
  discount_amount DECIMAL(12,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'VND',

  -- Order Details (JSON array of order items)
  order_details JSON NOT NULL, -- CukCuk OrderDetails array

  -- Additional Data
  table_mapping_id VARCHAR(100), -- CukCuk table mapping
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  external_sync_data JSON, -- Additional CukCuk order data

  -- Synchronization
  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'synced', 'error', 'partial'
  sync_error TEXT,
  last_sync_at TIMESTAMP,
  sync_direction VARCHAR(20) DEFAULT 'import', -- 'import', 'export', 'bidirectional'

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_cukcuk_orders_external_id ON cukcuk_orders(external_id);
CREATE INDEX idx_cukcuk_orders_order_no ON cukcuk_orders(order_no);
CREATE INDEX idx_cukcuk_orders_branch_id ON cukcuk_orders(branch_id);
CREATE INDEX idx_cukcuk_orders_order_id ON cukcuk_orders(order_id);
CREATE INDEX idx_cukcuk_orders_status ON cukcuk_orders(status);
CREATE INDEX idx_cukcuk_orders_type ON cukcuk_orders(type);
CREATE INDEX idx_cukcuk_orders_customer_id ON cukcuk_orders(customer_id);
CREATE INDEX idx_cukcuk_orders_order_date ON cukcuk_orders(order_date);
CREATE INDEX idx_cukcuk_orders_sync_status ON cukcuk_orders(sync_status);
```

### cukcuk_order_items
Detailed breakdown of CukCuk order items
```sql
CREATE TABLE cukcuk_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cukcuk_order_id UUID NOT NULL REFERENCES cukcuk_orders(id) ON DELETE CASCADE,
  external_item_id VARCHAR(100), -- CukCuk line item ID
  external_menu_item_id VARCHAR(100), -- CukCuk menu item ID
  menu_item_id UUID REFERENCES menu_items(id), -- Mapped to our menu items

  -- Item Details
  item_name VARCHAR(255) NOT NULL,
  item_code VARCHAR(100),
  quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  cost_price DECIMAL(12,2) DEFAULT 0.00,

  -- Item Modifiers
  modifiers JSON, -- [{name: 'extra cheese', price: 1.50}]
  notes TEXT,
  kitchen_notes TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'
  preparation_time INTEGER, -- Minutes
  actual_preparation_time INTEGER, -- Minutes

  -- Synchronization
  sync_status VARCHAR(20) DEFAULT 'pending',
  sync_error TEXT,

  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cukcuk_order_items_order_id ON cukcuk_order_items(cukcuk_order_id);
CREATE INDEX idx_cukcuk_order_items_menu_item_id ON cukcuk_order_items(menu_item_id);
CREATE INDEX idx_cukcuk_order_items_external_menu_item_id ON cukcuk_order_items(external_menu_item_id);
CREATE INDEX idx_cukcuk_order_items_status ON cukcuk_order_items(status);
```

### pos_order_status_mappings
Mapping between CukCuk order statuses and internal statuses
```sql
CREATE TABLE pos_order_status_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cukcuk_status INTEGER NOT NULL, -- CukCuk status (1,2,3,4)
  internal_status VARCHAR(50) NOT NULL, -- Internal status
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_pos_status_mappings_cukcuk ON pos_order_status_mappings(cukcuk_status);
CREATE INDEX idx_pos_status_mappings_internal ON pos_order_status_mappings(internal_status);
```

### pos_order_type_mappings
Mapping between CukCuk order types and internal types
```sql
CREATE TABLE pos_order_type_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cukcuk_type INTEGER NOT NULL, -- CukCuk type (1,2,3)
  internal_type VARCHAR(50) NOT NULL, -- 'dine_in', 'takeaway', 'delivery'
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_pos_type_mappings_cukcuk ON pos_order_type_mappings(cukcuk_type);
CREATE INDEX idx_pos_type_mappings_internal ON pos_order_type_mappings(internal_type);
```

### pos_integration_settings
POS integration configuration and credentials
```sql
CREATE TABLE pos_integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  pos_system VARCHAR(50) DEFAULT 'cukcuk',
  is_active BOOLEAN DEFAULT true,

  -- CukCuk API Credentials
  app_id VARCHAR(255), -- CukCuk AppID
  domain VARCHAR(255), -- CukCuk Domain
  secret_key VARCHAR(500), -- CukCuk SecretKey (encrypted)
  company_code VARCHAR(100), -- CukCuk CompanyCode
  access_token VARCHAR(500), -- Current access token (encrypted)
  token_expires_at TIMESTAMP,

  -- Sync Configuration
  sync_orders BOOLEAN DEFAULT true,
  sync_menu_items BOOLEAN DEFAULT true,
  sync_categories BOOLEAN DEFAULT true,
  sync_tables BOOLEAN DEFAULT true,
  sync_frequency VARCHAR(20) DEFAULT 'realtime', -- 'realtime', '5min', '15min', 'hourly', 'daily'
  auto_create_orders BOOLEAN DEFAULT false,

  -- API Configuration
  api_base_url VARCHAR(500) DEFAULT 'https://graphapi.cukcuk.vn',
  timeout_seconds INTEGER DEFAULT 30,
  retry_attempts INTEGER DEFAULT 3,

  -- Data Mapping
  field_mapping JSON, -- Field mapping between CukCuk and our system
  status_mapping JSON, -- Status code mappings
  default_branch_id UUID REFERENCES branches(id),

  -- Last Sync Information
  last_sync_at TIMESTAMP,
  last_successful_sync_at TIMESTAMP,
  sync_error_count INTEGER DEFAULT 0,

  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_created UUID REFERENCES users(id),
  user_updated UUID REFERENCES users(id)
);

CREATE INDEX idx_pos_integration_settings_active ON pos_integration_settings(is_active);
CREATE INDEX idx_pos_integration_settings_last_sync ON pos_integration_settings(last_sync_at);
```

---

## CRM Schema (Future Integration)

### customers
Customer information for loyalty and CRM
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  phone VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier VARCHAR(20) DEFAULT 'bronze',
  preferences JSON,
  is_active BOOLEAN DEFAULT true,
  last_visit_at TIMESTAMP,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_loyalty_tier ON customers(loyalty_tier);
```

---

## Sync Status Tracking & Resume Functionality

### Standard Sync Status Fields
All CukCuk-integrated collections include the following enhanced sync tracking fields:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `sync_status` | VARCHAR(20) | Current synchronization status | 'pending' |
| `last_sync_at` | TIMESTAMP | Last synchronization attempt timestamp | NULL |
| `created_at` | TIMESTAMP | Record creation timestamp | CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | Record modification timestamp | CURRENT_TIMESTAMP |

### Sync Status Values
- **`pending`** - Awaiting synchronization
- **`in_progress`** - Currently being synchronized
- **`synced`** - Successfully synchronized
- **`failed`** - Synchronization failed, will be retried

### Resume Logic Implementation
The sync system supports intelligent resume functionality:

```javascript
// Find records that need synchronization
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const itemsToSync = await this.apiClient.getDirectusItems('menu_items', {
  sync_status: { _in: ['pending', 'in_progress', 'failed'] },
  external_source: 'cukcuk',
  _or: [
    { last_sync_at: { _null: true } },
    { last_sync_at: { _lt: oneHourAgo } }
  ]
}, null, { sort: ['last_sync_at'] });
```

### Session Logger Integration
Comprehensive session logging captures all sync operations:

**Features:**
- Real-time console output capture
- Dual storage (filesystem + Directus)
- Session statistics and metrics
- Automatic log cleanup

**Storage Structure:**
- **File System**: `logs/data/cukcuk/YYYY-MM-DD_session-id.log`
- **Directus**: `sync_logs.session_log` (rich text format)
- **Directus**: `sync_logs.session_stats` (JSON metadata)

### Enhanced Indexes for Performance
New indexes added for sync optimization:

```sql
-- Sync status tracking indexes
CREATE INDEX idx_branches_sync_status ON branches(sync_status);
CREATE INDEX idx_branches_last_sync ON branches(last_sync_at);
CREATE INDEX idx_categories_sync_status ON categories(sync_status);
CREATE INDEX idx_categories_last_sync ON categories(last_sync_at);
CREATE INDEX idx_menu_items_sync_status ON menu_items(sync_status);
CREATE INDEX idx_menu_items_last_sync ON menu_items(last_sync_at);
CREATE INDEX idx_tables_sync_status ON tables(sync_status);
CREATE INDEX idx_tables_last_sync ON tables(last_sync_at);
```

---

## Directus Collection Configuration

### Recommended Directus Settings
- **Collections**: All tables above should be created as Directus collections
- **Permissions**: Role-based access control for different user types
- **Relations**: Proper foreign key relationships configured in Directus
- **Hooks**: Use Directus hooks for CukCuk synchronization logic
- **Validation**: Field validation rules for data integrity

### Suggested Directus Roles
1. **Super Admin**: Full access to all data and settings
2. **Branch Manager**: Access to branch-specific data and reports
3. **Staff**: Limited access for daily operations
4. **API**: Service account for CukCuk integration

### API Endpoints Structure
- `/branches` - Branch management
- `/zones` - Zone configuration
- `/tables` - Table management
- `/menu_items` - Food item catalog
- `/combos` - Combo management
- `/promotions` - Promotional campaigns
- `/orders` - Order management
- `/banners` - Promotional banners
- `/sync/*` - Synchronization endpoints

