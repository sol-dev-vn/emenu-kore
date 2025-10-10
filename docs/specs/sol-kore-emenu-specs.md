# SOL eMenu Platform - Technical Specifications

## 🎯 Overview

The SOL eMenu platform is a comprehensive digital menu system designed for SOL.com.vn's restaurant network. It enables customers to browse menus and place orders via QR code scanning while providing restaurant staff with powerful management tools.

## 🌐 Platform URLs

### Public eMenu Platform
- **Production**: https://em.sol.com.vn *(pending domain setup)*
- **Development**: https://sol-emenu.alphabits.team → `http://localhost:3520`

### Core API Backend & Admin Portal
- **Production**: https://kore.sol.com.vn *(pending domain setup)*
- **Development**: https://sol-kore.alphabits.team → `http://localhost:11111`

## 🚀 Core Features

### Data Integration

#### CukCuk API Synchronization
Real-time synchronization with CukCuk's restaurant management system including branches, inventory, and menu data.

**Integration Package**: [`@luutronghieu/cukcuk-api-client`](https://socket.dev/npm/package/@luutronghieu/cukcuk-api-client/overview/1.2.0)

#### Branches API Integration

**Authentication Headers**
```http
Authorization: Bearer [access-token]
CompanyCode: [company-code]
```

**API Endpoints**

1. **List All Branches**
   ```
   POST /api/v1/branchs/all
   ```
   - **Parameter**: `includeInactive` (boolean) - Include inactive branches in response
   - **Response**: `ServiceResult` containing array of `Branch` objects

2. **Get Branch Settings**
   ```
   POST /api/v1/branchs/setting/{branchId}
   ```
   - **Parameter**: `branchId` (string, required) - Unique branch identifier
   - **Response**: `ServiceResult` containing single `BranchSetting` object

**Branch Object Structure**
```json
{
  "Id": "string",
  "Code": "string",
  "Name": "string",
  "IsBaseDepot": "boolean",
  "IsChainBranch": "boolean"
}
```

**BranchSetting Object Structure**
```json
{
  "Id": "string",
  "Code": "string",
  "Name": "string",
  "IsBaseDepot": "boolean",
  "IsChainBranch": "boolean",
  "HasVATRate": "boolean",
  "VATRate": "number",
  "HasServiceRate": "boolean",
  "ServiceRate": "number"
}
```

**Branch Synchronization Logic**
1. Fetch all active branches using `/api/v1/branchs/all`
2. For each branch, retrieve detailed settings via `/api/v1/branchs/setting/{branchId}`
3. Map CukCuk branch data to SOL eMenu branch structure
4. Store `external_id` field for CukCuk integration reference
5. Configure branch-specific menu pricing and tax settings
6. Set up branch zones and table layouts per location

#### Additional API References
- **Food Items Schema**: [CukCuk Inventory API Documentation](https://github.com/tronghieu/CukCuk-api-client/blob/HEAD/docs/inventory-items-api.markdown)

### Super Admin Portal (Directus)
- **Table & Zone Management**: Configure restaurant layouts and seating arrangements
- **Live Dashboard**: Real-time monitoring of table statuses across all brands and zones
- **User Administration**: Create and manage accounts for store managers and employees
- **System Configuration**: Global settings and platform-wide controls

### Operator Portal (Store Staff)
- **Authentication & Security**
  - Login via email or phone number
  - Password reset functionality
  - Two-factor authentication (optional, disabled by default)

- **Branch Management**
  - Each branch maintains independent menu and pricing
  - Multi-zone layout configuration per branch
  - Table status monitoring and management

- **QR Code System**
  - Unique QR code per table: `https://qr.sol.com.vn/tables/[table-code]?ts=[timestamp]`
  - Table code generation: `(100000000000).toString(36)` for unique alphanumeric strings
  - Bulk QR code generation and printing (A4 PDF export by zone/table)

- **Content Management**
  - Promotional banner configuration (eMenu header section)
  - Campaign visibility (synchronized from Cukcuk data)
  - Sync job monitoring and status tracking

### Menu Management System
- **Food Item Configuration**
  - Base data synchronized from Cukcuk API
  - Extended metadata via JSON `meta` field (pricing, promotions, related items)
  - External ID mapping for multi-platform integration
  - Customizable options and add-ons system

```json
[
  {
    "category": "Base",
    "mandatory": true,
    "multiple": false,
    "default": "soft-noodle",
    "options": [
      {
        "title": "Soft",
        "value": "soft-noodle",
        "cost": 1.00,
        "sort": 0
      },
      {
        "title": "Hard Noodle",
        "value": "hard-noodle",
        "cost": 1.00,
        "sort": 1
      }
    ]
  },
  {
    "category": "Spiciness Level",
    "mandatory": true,
    "multiple": false,
    "default": "no-spicy",
    "options": [
      {
        "title": "No Spicy",
        "value": "no-spicy",
        "cost": 0.00,
        "sort": 1
      },
      {
        "title": "Spicy",
        "value": "spicy",
        "cost": 0.00,
        "sort": 2
      }
    ]
  },
  {
    "category": "More Toppings",
    "mandatory": false,
    "multiple": true,
    "default": "none",
    "options": [
      {
        "title": "+1 Egg",
        "value": "add-1-egg",
        "cost": 1.50,
        "sort": 1
      },
      {
        "title": "+1 Seaweed",
        "value": "add-1-seaweed",
        "cost": 0.50,
        "sort": 2
      }
    ]
  }
]
```

- **Combo Management**
  - Custom combos created from existing menu items
  - Flexible quantity configuration per item
  - Automatic price calculation (`price_before_combo`)
  - Rich metadata support

- **Combo Metadata Structure**
```json
{
  "id": "[generated-id]",
  "title": "Combo Name (single line)",
  "description": "Detailed description text",
  "photo": "[uploadable image file]",
  "price_before_combo": "[auto-calculated from item costs]",
  "feature_tag": "best-seller|popular|special",
  "price": "[final price before tax]"
}
```

## 📱 Customer-Facing eMenu

### Branch-Specific Experience
- **Individualized Menus**: Each branch maintains custom menu and pricing
- **Zone-Based Layout**: Tailored table arrangements per branch zone
- **QR Code Access**: Direct table-to-menu mapping via unique QR codes

### eMenu Interface Layout
1. **Promotional Banners** (configurable via operator portal)
2. **Menu Categories** (grid or list view options)
3. **Featured Items** (highlighted popular dishes)
4. **Promotions Section** (special offers and campaigns)


## 🛠️ Technical Stack

### Backend Infrastructure
- **Headless CMS**: Directus with PostgreSQL database
  - Docker configuration: `docker/sol-kore-api-database.yaml`
- **AI Development**: Claude Code CLI with GLM 4.6 LLM model
  - Configuration: [Lite Coding Plan](https://docs.z.ai/devpack/overview)
  - Documentation: [z.ai Claude Integration](https://docs.z.ai/scenario-example/develop-tools/claude)
- **System Monitoring**: `btop` for real-time performance tracking

### Development Environment
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 for production deployments
- **Network Tunneling**: Cloudflare Tunnel for secure external access

## 💾 Storage Architecture

### Database Storage
**PostgreSQL Database Location**
```
Source: /Users/dev/casa/DATA/AppData/kore/database
Target: /directus/database (container mount)
```

### Application Storage
**Directus File Storage**
```
Source: /Users/dev/casa/DATA/AppData/kore/data/uploads
Target: /directus/uploads (container mount)

Source: /Users/dev/casa/DATA/AppData/kore/data/extensions
Target: /directus/extensions (container mount)
```

### Development Workspace
**Primary Source Code Repository**
```
Location: /Users/dev/code/emenu-kore
IDE Mapping: Default workspace folder
```

## 🔧 System Configuration

### Environment Variables
- Database connection strings
- API endpoints and authentication tokens
- Cukcuk API integration credentials
- Cloudflare tunnel configurations

### Security Considerations
- Two-factor authentication for admin access
- Role-based user permissions
- Secure QR code generation with timestamps
- Encrypted data transmission via HTTPS tunnels

---

*This specification document serves as the technical blueprint for the SOL eMenu platform implementation and maintenance.*
