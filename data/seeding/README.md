# SOL Brands Seeding Script

This directory contains the seeding scripts for populating Directus with SOL restaurant brand data.

## Usage

### Prerequisites
- Node.js 22+
- Directus instance running
- Directus API token with appropriate permissions

### Environment Variables
Set the following environment variables before running:

```bash
export DIRECTUS_URL="http://localhost:8055"  # Your Directus URL
export DIRECTUS_TOKEN="your-directus-token-here"  # Admin token
```

### Running the Script

```bash
# Navigate to the seeding directory
cd data/seeding

# Run the main seeding script
node seed-brands.js
```

## What Gets Created

The seeding script creates:

1. **7 Brand Entities** with complete metadata
   - Miwaku Premium
   - S79 Japanese Teppanyaki
   - Kohaku Sashimi & Yakiniku
   - Kohaku Sushi
   - Kohaku Udon & Ramen
   - Date Nariya
   - Machida Shoten

2. **7 Brand Menus** (one per brand)
   - Default currency: VND
   - Tax rate: 8%
   - Service rate: 5%

3. **35+ Categories** (5 per brand)
   - Brand-specific categories
   - Proper hierarchy and relationships

4. **Sample Menu Items** (3-4 per brand)
   - Realistic pricing (100k-600k VND)
   - Featured items marked
   - Proper relationships

5. **Placeholder Images**
   - Brand logos (SVG format)
   - Organized in folders
   - Brand-specific colors

## File Structure

```
data/seeding/
├── seed-brands.js              # Main seeding script
├── config/
│   └── brands.js              # Brand configuration data
├── utils/
│   ├── data-validator.js      # Validation utilities
│   └── file-uploader.js       # Image upload utilities
├── assets/
│   ├── logos/                 # Brand logos (generated)
│   └── thumbnails/            # Category thumbnails
└── README.md                  # This file
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure your Directus token has permissions to create items in all collections
2. **Invalid Token**: Verify your DIRECTUS_TOKEN environment variable
3. **Connection Failed**: Ensure Directus is running and DIRECTUS_URL is correct

### Debug Mode

You can add debug logging by modifying the script to use more verbose console output.

### Clean Up

If you need to clean up and re-run:
1. Delete created items via Directus admin interface
2. Or run the script with a `--clean` flag (future feature)

## Validation

The script includes comprehensive validation:
- Brand data validation (required fields, color format, slug format)
- Brand menu validation (currency format, rate validation)
- Category validation (required fields)
- File upload validation

## Notes

- This is a one-time seeding script for initial setup
- Images are generated as SVG placeholders
- All data is sample data for demonstration purposes
- Script can be extended with more sophisticated data generation