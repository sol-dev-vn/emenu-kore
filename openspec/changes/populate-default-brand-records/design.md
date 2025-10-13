## Context
The new Brand schema architecture has been implemented in Directus but contains no data. To demonstrate the value of the refactor and enable immediate testing of the updated sync scripts, we need to populate the database with realistic sample data. This includes creating all 7 Brand entities from the existing hardcoded mappings, establishing proper relationships, and adding sample content that reflects the actual restaurant operations.

### Brand Information Available
From the existing codebase, we have 7 brands with specific characteristics:
- **Miwaku Premium**: High-end anniversary restaurant at Landmark 81
- **S79 Japanese Teppanyaki**: Premium teppanyaki experience
- **Kohaku Sashimi & Yakiniku**: Traditional Japanese cuisine
- **Kohaku Sushi**: Authentic sushi and sashimi
- **Kohaku Udon & Ramen**: Japanese noodle specialties
- **Date Nariya**: Japanese Gyutan Steak
- **Machida Shoten**: Traditional Japanese izakaya

## Goals / Non-Goals
- **Goals**:
  - Create realistic sample data that reflects actual restaurant operations
  - Establish proper Brand, Brand Menu, and Category relationships
  - Provide immediate value from schema refactor
  - Enable testing of sync script updates
  - Create foundation for demonstration and development
- **Non-Goals**:
  - Create full production data (sample only)
  - Migrate all existing menu items (handled by sync script update)
  - Create complete menu catalogs (representative samples only)
  - Implement complex business logic (basic relationships only)

## Decisions
- **Decision**: Create comprehensive seeding script with placeholder images
  - **Alternatives considered**:
    1. Manual data entry (rejected - time-consuming and error-prone)
    2. SQL dump only (rejected - doesn't handle file uploads)
    3. Partial seeding (rejected - need complete structure for testing)
- **Decision**: Include brand-specific categories to demonstrate brand differentiation
  - **Rationale**: Shows value of brand-specific categorization vs global categories
- **Decision**: Create sample menu items with realistic pricing
  - **Rationale**: Enables testing of pricing and synchronization features
- **Decision**: Organize images in brand-specific folders
  - **Rationale**: Establishes proper file organization patterns

## Risks / Trade-offs
- **Data quality risk**: Sample data may not reflect real-world complexity
  - **Mitigation**: Use realistic pricing, descriptions, and brand-appropriate items
- **Performance risk**: Large number of image uploads may slow seeding
  - **Mitigation**: Use optimized placeholder images, implement batch uploads
- **Maintenance risk**: Sample data may become outdated
  - **Mitigation**: Create clear documentation, version seeding scripts
- **Complexity risk**: Complex relationships may cause seeding failures
  - **Mitigation**: Comprehensive error handling, validation checks, rollback capability

## Data Structure Design

### Brand Configuration
```javascript
const brands = [
  {
    id: 'miwaku_premium',
    name: 'Miwaku Premium',
    color: '#FF6B6B',
    description: 'Iconic Anniversary Restaurant at Landmark 81',
    categories: ['Premium Appetizers', 'Main Course', 'Premium Desserts', 'Wine Pairing'],
    sampleItems: ['Lobster Thermidor', 'Wagyu Steak', 'Caviar Platter']
  },
  // ... 6 more brands
]
```

### Category Hierarchy
- Common categories across all brands: Appetizers, Main Course, Desserts, Beverages
- Brand-specific categories based on cuisine type
- Subcategories for detailed organization (e.g., Main Course → Sushi/Rolls/Sashimi)

### Sample Data Volume
- 7 Brand entities
- 7 Brand Menu entities
- 35+ Categories (5 per brand average)
- 50+ Sample menu items
- 100+ Branch Menu Items relationships
- 20+ Images (logos and thumbnails)

## Implementation Plan
1. **Preparation Phase**
   - Create brand configuration data structure
   - Prepare placeholder images
   - Design folder structure for uploads

2. **Core Seeding Phase**
   - Create Brand entities with metadata
   - Establish Brand Menu relationships
   - Create category hierarchy for each brand
   - Upload images and assign to entities

3. **Sample Data Phase**
   - Create representative menu items for each brand
   - Establish Branch Menu Items relationships
   - Set pricing and availability
   - Add descriptive content

4. **Validation Phase**
   - Verify all relationships exist
   - Test data access patterns
   - Validate image uploads
   - Check data integrity

5. **Documentation Phase**
   - Document seeding process
   - Create usage guide
   - Add troubleshooting information

## File Organization
```
data/seeding/
├── seed-brands.js              # Main seeding script
├── config/
│   ├── brands.js              # Brand configuration data
│   ├── categories.js          # Category definitions
│   └── sample-items.js        # Sample menu items
├── assets/
│   ├── logos/                 # Brand logo images
│   └── thumbnails/            # Category thumbnails
└── utils/
    ├── file-uploader.js       # Image upload utilities
    └── data-validator.js      # Validation utilities
```

## Open Questions
- Should we include realistic branch addresses and contact information?
- Do we need to create sample users/staff for each brand?
- Should we implement different tax rates per brand or use standard rates?
- Do we need to create sample order data to demonstrate the full system?