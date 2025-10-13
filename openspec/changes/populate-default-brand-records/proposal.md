## Why
The new Brand schema has been created but is empty. We need to populate Directus with default Brand entities, Brand Menus, sample Categories, and Branch Menu Items relationships to establish the foundation for the new brand-centric architecture. This will provide immediate value from the schema refactor and enable testing of the updated sync scripts.

## What Changes
- Create 7 Brand entities from existing hardcoded brand mappings
- Create Brand Menu for each Brand with proper configuration
- Populate sample Categories for each Brand
- Create sample Branch Menu Items relationships
- Add sample images for brand logos and category thumbnails
- Establish initial brand metadata (colors, descriptions, contact info)

## Impact
- **Affected specs**: brand-management, category-management, menu-synchronization
- **Affected code**:
  - New data seeding script to populate initial records
  - Brand configuration utilities
  - Image upload and organization utilities
- **Data creation**: 7 Brands, 7 Brand Menus, 20+ Categories, 100+ Branch Menu Items
- **Business operations**: Enables immediate testing and demonstration of new brand architecture