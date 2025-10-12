# SOL eMenu Platform - Technical Specifications

## 🎯 Overview

The SOL eMenu platform is a comprehensive digital menu system designed for SOL.com.vn's restaurant network. It enables customers to browse menus and place orders via QR code scanning while providing restaurant staff with powerful management tools.

## 🌐 Platform URLs

### Public eMenu Platform
- **Production**: https://em.sol.com.vn *(pending domain setup)*
- **Development**: https://sol-emenu.alphabits.team → `http://localhost:3520`
- **Landing Page**: `/` (root path) - Generic welcome page with SOL logo
- **QR Code Routes**: `/qr?table=[table_id]` - Direct menu access via table QR codes
- **QR Scanner**: Built-in QR code scanning capability on landing page

### Operation Portal (Web Management)
- **Access**: `/login` - Staff authentication and management portal
- **Dashboard**: `/dashboard` - Overview of all restaurant operations
- **QR Management**: `/qr-codes` - Comprehensive QR code management interface

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

### Operation Portal (/login)
**Staff authentication and management interface accessible at `/login`**

#### Authentication & Security
- **Login Methods**: Email or phone number with password
- **Role-Based Access**: Different permission levels for managers, staff, and administrators
- **Password Reset**: Email-based password recovery
- **Session Management**: Secure session handling with automatic logout
- **Two-Factor Authentication**: Optional enhanced security (disabled by default)

#### Dashboard Overview (/dashboard)
- **Real-time Statistics**: Active tables, pending orders, revenue overview
- **Branch Performance**: Multi-branch operational metrics
- **Quick Actions**: Fast access to common management tasks
- **Alert System**: Notifications for important events and issues

#### Branch Management
- **Multi-Branch Support**: Each branch maintains independent menu and pricing
- **Zone Configuration**: Multi-zone layout configuration per branch
- **Table Status Monitoring**: Real-time table status updates and management
- **Staff Assignment**: Manage staff permissions per branch

#### QR Code Management (/qr-codes)
**Comprehensive QR code generation and management system**

##### QR Code Generation
- **Automatic Generation**: Create QR codes for all tables automatically
- **Custom QR Codes**: Generate QR codes with custom designs and branding
- **Bulk Operations**: Generate QR codes for entire branches or zones at once
- **QR Code Format**: `https://sol-emenu.alphabits.team/qr?table=[table_id]`

##### QR Code Display & Management
- **Table Overview**: Grid view of all tables with QR code status
- **Search & Filter**: Find specific tables by zone, status, or table code
- **QR Code Preview**: Visual preview of generated QR codes
- **Download Options**:
  - Individual QR code downloads (PNG, SVG)
  - Bulk PDF generation for printing
  - A4 format with table labels and QR codes

##### QR Code Features
- **Expiry Management**: Set expiry dates for temporary QR codes
- **Access Control**: Restrict QR code access by time or date
- **Analytics**: Track QR code scan frequency and usage patterns
- **Custom Branding**: Add SOL logo and custom colors to QR codes

##### Advanced QR Operations
```javascript
// QR Code Generation API Example
const generateQRCode = (tableId, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const qrUrl = `${baseUrl}/qr?table=${tableId}`;

  return {
    url: qrUrl,
    tableId: tableId,
    format: options.format || 'png',
    size: options.size || 'medium',
    branding: options.branding || true
  };
};
```

#### Content Management
- **Promotional Banners**: Configure eMenu header promotional content
- **Campaign Management**: Set up and manage promotional campaigns
- **Sync Job Monitoring**: Real-time status of CukCuk synchronization jobs
- **Menu Customization**: Modify menu presentation and ordering

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

### Landing Page (/) - Welcome Experience ✅ **IMPLEMENTED**
**Root path landing page providing elegant entry point to the SOL eMenu system**

#### Visual Design ✅
- **SOL Branding**: Full SOL logo prominently displayed
- **Clean Layout**: Minimalist design with focus on ease of use
- **Responsive Design**: Optimized for mobile and tablet devices
- **Loading States**: Smooth transitions and loading animations
- **Gradient Background**: Orange-to-red gradient matching SOL brand colors

#### Core Features ✅
- **QR Code Scanner**: Built-in camera-based QR code scanning capability
  - Mobile-first scanning interface using @yudiel/react-qr-scanner
  - Automatic QR code detection and processing
  - **❌ Manual table entry removed** for streamlined QR-only workflow
- **Welcome Message**: Brief introduction to SOL eMenu system
- **Restaurant Information**: Compact footer with website, hotline, Zalo, and email links
- **Language Selection**: Multi-language support (Vietnamese, English) with selector component

#### User Experience Flow ✅
1. **Initial Landing**: Display SOL logo and welcome message with language selector
2. **Primary Action**: "Scan QR Code" button opens camera interface
3. **Direct Navigation**: Automatic redirect to menu upon successful scan
4. **Error Handling**: Graceful handling of camera permissions and invalid QR codes

#### Multi-language Support 🚧 **IN PROGRESS**
**Expanding language support for international customers**

#### Supported Languages ✅ **CURRENT**
- **Vietnamese** (vi) - Primary language for Vietnam market
- **English** (en) - International standard

#### Planned Languages 🔄 **ADDING**
- **Japanese** (ja) - For Japanese tourists and expats
- **Korean** (ko) - For Korean tourists and business visitors
- **Mandarin Chinese** (zh) - For Chinese tourists
- **Russian** (ru) - For Russian tourists

#### Language Implementation
```typescript
// Language Support Structure
const translations = {
  en: { /* English translations */ },
  vi: { /* Vietnamese translations */ },
  ja: { /* Japanese translations */ },
  ko: { /* Korean translations */ },
  zh: { /* Mandarin Chinese translations */ },
  ru: { /* Russian translations */ }
};
```

#### Full-Screen QR Scanner 🚧 **IN PROGRESS**
**Enhanced mobile QR scanning experience**

#### Current Implementation ✅
- Mobile-responsive QR scanner component
- Camera permission handling
- QR code detection and processing
- Error handling for camera access

#### Mobile Optimization 🔄 **IMPROVING**
- **Full-screen interface** on mobile devices
- **Immersive scanning** experience without UI distractions
- **Better camera utilization** for improved QR detection
- **Touch-friendly controls** optimized for mobile
- **Responsive sizing** that adapts to screen dimensions

#### Mobile QR Scanner Enhancement
```css
/* Full-screen mobile QR scanner */
@media (max-width: 768px) {
  .qr-scanner-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 50;
  }
}
```

#### Technical Implementation
```javascript
// Landing Page Component Structure
const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="brand-header">
        <img src="/logo_full.png" alt="SOL eMenu" />
        <h1>Welcome to SOL eMenu</h1>
      </header>

      <main className="action-section">
        <QRScannerComponent onScan={handleQRScan} />
        <ManualEntryComponent />
      </main>

      <footer className="info-section">
        <RestaurantInfo />
        <LanguageSelector />
      </footer>
    </div>
  );
};
```

### QR Code Direct Access (/qr?table=[table_id]) ✅ **IMPLEMENTED**
**Direct menu access via QR code scanning**

#### Route Structure ✅
- **URL Pattern**: `/qr?table=[table_id]`
- **Table Validation**: API endpoint to verify table exists and is accessible
- **Branch Detection**: API endpoint to fetch branch information from table ID
- **Menu Loading**: Placeholder for branch-specific menu and pricing

#### User Experience ✅
1. **QR Code Scan**: Customer scans table QR code on landing page
2. **Direct Access**: Immediate redirect to table-specific menu page
3. **Menu Display**: Branch-appropriate menu with table context (demo placeholder)
4. **Header**: Shows table name, branch information, and change table option
5. **Footer**: Simple copyright notice

#### API Implementation ✅
- **Branch API**: `/api/branches/[branchId]` - Fetch branch information
- **Table API**: `/api/tables/[tableId]` - Fetch table information
- **Error Handling**: Graceful handling of invalid table IDs and API errors
- **Loading States**: Loading spinner during data fetching
- **Toast Notifications**: Success/error feedback using Sonner

### Branch-Specific Experience
- **Individualized Menus**: Each branch maintains custom menu and pricing
- **Zone-Based Layout**: Tailored table arrangements per branch zone
- **Table Context**: Menu displays table number and zone information
- **Personalized Experience**: Custom branding and promotions per branch

### eMenu Interface Layout
1. **Table Header**: Display current table and zone information
2. **Promotional Banners** (configurable via operator portal)
3. **Menu Categories** (grid or list view options)
4. **Featured Items** (highlighted popular dishes)
5. **Promotions Section** (special offers and campaigns)
6. **Order Summary**: Real-time cart and order details


## 🛠️ Technical Stack

### Frontend Development ✅ **IMPLEMENTED**
- **Framework**: Next.js 15 with React 19 and TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom design system
- **QR Code Scanning**: @yudiel/react-qr-scanner for mobile camera access
- **State Management**: React hooks and context API
- **Notifications**: Sonner for toast notifications
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography
- **Animations**: Tailwind CSS transitions and custom animations
- **Multi-language Support**: Vietnamese, English, Japanese, Korean, Mandarin, Russian
- **Mobile Optimization**: Full-screen QR scanner interface for mobile devices

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
- **Package Management**: npm with workspaces for monorepo structure
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode

## 🎨 UI/UX Design System

### Component Library
- **Base Components**: shadcn/ui provides accessible, customizable UI components
- **Design Tokens**: CSS custom properties for consistent spacing, colors, and typography
- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktop
- **Dark Mode Support**: Built-in theme switching capability

### Color Palette
- **Primary Colors**: Orange/Red gradient for SOL brand identity
- **Neutral Colors**: Gray scale for text and backgrounds
- **Semantic Colors**: Success (green), Warning (yellow), Error (red)
- **Accessibility**: WCAG AA compliant contrast ratios

### Typography
- **Font Family**: Geist Sans (system font stack)
- **Scale**: Responsive font sizes from xs to 4xl
- **Weight**: Regular, Medium, Semibold, Bold for hierarchy
- **Line Height**: Optimized for readability on mobile devices

### Spacing System
- **Base Unit**: 4px (0.25rem) for consistent spacing
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- **Components**: Consistent padding and margins across all components
- **Responsiveness**: Adaptive spacing for different screen sizes

### Animation Guidelines
- **Micro-interactions**: Hover states, button presses, and loading states
- **Page Transitions**: Smooth fade-in and slide-up animations
- **Loading States**: Skeleton loaders and spinners for better UX
- **Duration**: Fast (200ms) for micro-interactions, Slow (500ms) for page transitions

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

## 🔐 Security Architecture & API Design

### API Security Strategy
**Preventing Directus token exposure and CORS issues through secure backend routing**

#### Backend API Gateway Pattern
- **No Direct Directus Access**: Frontend never directly communicates with Directus
- **Backend Proxy**: All API requests route through Next.js API routes
- **Token Security**: Directus tokens stored securely in backend environment variables
- **CORS Resolution**: Backend handles all cross-origin requests securely

#### API Route Structure
```javascript
// Next.js API Routes Structure
/api/
├── auth/
│   ├── login.js          # Staff authentication
│   └── logout.js         # Session management
├── branches/
│   └── index.js          # Branch data from Directus
├── menu/
│   ├── items.js          # Menu items and categories
│   └── combos.js         # Combo meal data
├── tables/
│   └── index.js          # Table and zone information
└── orders/
    ├── create.js         # Order creation
    └── status.js         # Order status updates
```

#### Backend Implementation Example
```javascript
// pages/api/branches/index.js
export default async function handler(req, res) {
  // Backend securely fetches from Directus
  const directusResponse = await fetch(
    `${process.env.DIRECTUS_URL}/items/branches?limit=-1`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await directusResponse.json();

  // Forward data to frontend without exposing Directus credentials
  res.status(200).json(data);
}
```

#### Frontend API Usage
```javascript
// Frontend API calls through Next.js routes
const fetchBranches = async () => {
  const response = await fetch('/api/branches');
  const data = await response.json();
  return data.data;
};

const fetchMenuItems = async (branchId) => {
  const response = await fetch(`/api/menu/items?branch=${branchId}`);
  const data = await response.json();
  return data.data;
};
```

### Environment Security Configuration

#### Backend Environment Variables (.env.local)
```bash
# Directus API Configuration (Backend Only)
NEXT_PUBLIC_DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_TOKEN=39Omtm9x8eE3dOYxsI1iXk3MPZ9L235y

# CukCuk API Integration (Backend Only)
CUKCUK_API_TOKEN=secure_cukcuk_token
CUKCUK_COMPANY_CODE=sol

# Next.js Session Configuration
NEXTAUTH_URL=http://localhost:3520
NEXTAUTH_SECRET=your_session_secret_here
```

#### Public Environment Variables (Safe for Frontend)
```bash
# Public Application Configuration
NEXT_PUBLIC_APP_NAME=SOL eMenu
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_API_BASE_URL=http://localhost:3520/api
```

### CORS Configuration
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      // API route rewrites for security
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
```

### Security Benefits
- **Token Protection**: Directus tokens never exposed to client-side code
- **CORS Elimination**: Backend handles all cross-origin requests
- **Request Validation**: Backend validates and sanitizes all API requests
- **Rate Limiting**: Backend can implement rate limiting and security controls
- **Audit Trail**: All API requests logged through backend for security monitoring

## 🔧 System Configuration

### Environment Variables
- **Backend**: Database connection strings, Directus tokens, CukCuk API credentials
- **Frontend**: Only public configuration variables (no sensitive data)
- **Cloudflare**: Tunnel configurations for secure external access

### Security Considerations
- **No Client-Side Tokens**: All sensitive API credentials stored server-side only
- **Backend API Gateway**: All external API requests routed through secure backend
- **Role-Based Access**: Different permission levels for managers, staff, and administrators
- **Secure QR Codes**: QR code generation with timestamps and access controls
- **HTTPS Encryption**: All data transmission via encrypted tunnels
- **Session Management**: Secure session handling with automatic timeout
- **API Rate Limiting**: Protection against abuse and DDoS attacks

---

*This specification document serves as the technical blueprint for the SOL eMenu platform implementation and maintenance.*
