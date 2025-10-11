# SOL eMenu Technical Specifications

## Overview
This document provides comprehensive technical specifications for the SOL eMenu web application, including architecture, API specifications, database schema, and implementation details.

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Backend API   │    │  Data Sources   │
│                 │    │                 │    │                 │
│ Next.js SPA     │◄──►│  API Routes     │◄──►│  Directus CMS   │
│ React 18        │    │  Server-side    │    │  PostgreSQL     │
│ TypeScript      │    │  Authentication │    │  CukCuk API     │
│ Tailwind CSS    │    │  Validation     │    │  File Storage   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Custom components with shadcn/ui compatibility
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router with client-side navigation

#### Backend
- **Runtime**: Node.js 18+
- **API Routes**: Next.js API Routes
- **Authentication**: JWT tokens with secure cookie handling
- **Database**: PostgreSQL via Directus
- **Headless CMS**: Directus 10.x
- **File Storage**: Directus file management

#### Deployment & Operations
- **Process Management**: PM2
- **Environment**: Development, Staging, Production
- **Monitoring**: Health checks and error tracking
- **Version Control**: Git with GitHub

## API Specifications

### Base Configuration
- **Base URL**: `https://sol-kore.alphabits.team`
- **API Prefix**: `/api`
- **Authentication**: Bearer tokens via HTTP-only cookies
- **Content-Type**: `application/json`
- **CORS**: Configured for production domains

### Authentication Endpoints

#### POST `/api/auth/login`
**Description**: Authenticate user and establish session
```json
Request: {
  "email": "string",
  "password": "string"
}

Response: {
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "role": {
        "id": "string",
        "name": "string"
      }
    },
    "token": "string"
  }
}
```

#### POST `/api/auth/logout`
**Description**: Terminate user session
```json
Response: {
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
**Description**: Get current authenticated user
```json
Response: {
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "role": {
      "id": "string",
      "name": "string"
    },
    "permissions": ["string"]
  }
}
```

#### POST `/api/auth/impersonate`
**Description**: Impersonate user for branch switching
```json
Request: {
  "branch_id": "string | null"
}

Response: {
  "success": true,
  "message": "Branch context updated"
}
```

### Core Data Endpoints

#### GET `/api/branches`
**Description**: Fetch all restaurant branches
```json
Query Parameters:
  - search: string (optional)
  - is_active: boolean (optional)
  - limit: number (default: 50)
  - page: number (default: 1)

Response: {
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "display_name": "string",
      "external_id": "string",
      "is_active": boolean,
      "address": "string",
      "phone": "string",
      "email": "string",
      "timezone": "string",
      "currency": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "meta": {
    "total": number,
    "page": number,
    "limit": number
  }
}
```

#### GET `/api/menu-items`
**Description**: Fetch menu items with filtering
```json
Query Parameters:
  - search: string (optional)
  - category: string (optional)
  - active: boolean (optional)
  - limit: number (default: 20)
  - page: number (default: 1)

Response: {
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "price": number,
      "category_name": "string",
      "category_code": "string",
      "is_active": boolean,
      "is_available": boolean,
      "image_url": "string",
      "track_inventory": boolean,
      "allergen_info": object,
      "dietary_restrictions": ["string"],
      "preparation_time": number,
      "spice_level": number,
      "sync_status": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

#### GET `/api/orders`
**Description**: Fetch orders with comprehensive filtering
```json
Query Parameters:
  - search: string (optional)
  - status: string (optional)
  - branch_id: string (optional)
  - date_from: string (optional, ISO format)
  - date_to: string (optional, ISO format)
  - limit: number (default: 20)
  - page: number (default: 1)

Response: {
  "success": true,
  "data": [
    {
      "id": "string",
      "order_number": "string",
      "customer_name": "string",
      "customer_phone": "string",
      "total_amount": number,
      "status": "string",
      "branch_name": "string",
      "table_number": "string",
      "order_type": "string",
      "items": [
        {
          "name": "string",
          "quantity": number,
          "price": number
        }
      ],
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

#### GET `/api/analytics`
**Description**: Fetch analytics data for reports
```json
Query Parameters:
  - period: string (7d, 30d, 90d, 1y)
  - branch_id: string (optional)

Response: {
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": number,
      "totalOrders": number,
      "activeCustomers": number,
      "avgOrderValue": number,
      "revenueChange": number,
      "ordersChange": number,
      "customersChange": number,
      "avgOrderChange": number
    },
    "salesData": [
      {
        "date": "string",
        "revenue": number,
        "orders": number,
        "customers": number
      }
    ],
    "topProducts": [
      {
        "name": "string",
        "category": "string",
        "orders": number,
        "revenue": number,
        "percentage": number
      }
    ],
    "categoryPerformance": [
      {
        "name": "string",
        "orders": number,
        "revenue": number,
        "percentage": number
      }
    ],
    "peakHours": [
      {
        "hour": "string",
        "orders": number,
        "revenue": number
      }
    ],
    "tablePerformance": [
      {
        "tableId": "string",
        "totalOrders": number,
        "revenue": number,
        "occupancyRate": number,
        "avgTurnover": number
      }
    ]
  },
  "period": "string",
  "dateRange": {
    "start": "string",
    "end": "string"
  }
}
```

### Synchronization Endpoints

#### GET `/api/sync-logs`
**Description**: Fetch synchronization logs
```json
Query Parameters:
  - status: string (optional)
  - source: string (optional)
  - limit: number (default: 50)
  - page: number (default: 1)

Response: {
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "string",
      "status": "string",
      "source": "string",
      "started_at": "string",
      "completed_at": "string",
      "records_processed": number,
      "records_failed": number,
      "error_details": "string"
    }
  ]
}
```

#### GET `/api/sync-logs/[id]`
**Description**: Fetch detailed sync log information
```json
Response: {
  "success": true,
  "data": {
    "id": "string",
    "type": "string",
    "status": "string",
    "source": "string",
    "started_at": "string",
    "completed_at": "string",
    "records_processed": number,
    "records_failed": number,
    "error_details": "string",
    "details": object
  }
}
```

## Database Schema

### Directus Collections

#### Branches (`branches`)
```sql
- id (uuid, primary key)
- name (string, required)
- code (string, required, unique)
- display_name (string)
- external_id (string)
- description (text)
- is_active (boolean, default: true)
- address (text)
- phone (string)
- email (string)
- timezone (string, default: 'Asia/Ho_Chi_Minh')
- currency (string, default: 'VND')
- tax_rate (decimal, default: 0.10)
- service_rate (decimal, default: 0.05)
- has_vat (boolean, default: true)
- has_service (boolean, default: true)
- opening_hours (json)
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Menu Items (`menu_items`)
```sql
- id (uuid, primary key)
- name (string, required)
- code (string, required, unique)
- description (text)
- price (decimal)
- category_name (string)
- category_code (string)
- is_active (boolean, default: true)
- is_available (boolean, default: true)
- image_url (string)
- track_inventory (boolean, default: false)
- allergen_info (json)
- dietary_restrictions (json)
- preparation_time (integer)
- spice_level (integer, min: 0, max: 5)
- external_id (string)
- sync_status (string, default: 'pending')
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Categories (`categories`)
```sql
- id (uuid, primary key)
- name (string, required)
- code (string, required, unique)
- description (text)
- is_active (boolean, default: true)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Orders (`orders`)
```sql
- id (uuid, primary key)
- order_number (string, required, unique)
- customer_name (string)
- customer_phone (string)
- customer_email (string)
- total_amount (decimal, required)
- subtotal_amount (decimal)
- tax_amount (decimal)
- service_amount (decimal)
- status (string, required)
- branch_id (uuid, foreign key to branches)
- table_number (string)
- order_type (string, required) // 'dine_in', 'takeaway', 'delivery'
- notes (text)
- external_id (string)
- sync_status (string, default: 'pending')
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Order Items (`order_items`)
```sql
- id (uuid, primary key)
- order_id (uuid, foreign key to orders, required)
- menu_item_id (uuid, foreign key to menu_items, required)
- quantity (integer, required, min: 1)
- unit_price (decimal, required)
- total_price (decimal, required)
- special_instructions (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tables (`tables`)
```sql
- id (uuid, primary key)
- number (string, required, unique)
- zone_id (uuid, foreign key to zones)
- capacity (integer, required, min: 1)
- status (string, default: 'available') // 'available', 'occupied', 'cleaning', 'reserved'
- position_x (integer)
- position_y (integer)
- qr_code_url (string)
- external_id (string)
- sync_status (string, default: 'pending')
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Zones (`zones`)
```sql
- id (uuid, primary key)
- name (string, required)
- code (string, required, unique)
- display_name (string)
- description (text)
- is_active (boolean, default: true)
- branch_id (uuid, foreign key to branches)
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Promotions (`promotions`)
```sql
- id (uuid, primary key)
- name (string, required)
- code (string, unique)
- description (text)
- type (string, required) // 'percentage', 'fixed', 'bogo'
- value (decimal, required)
- minimum_order_amount (decimal)
- maximum_discount_amount (decimal)
- start_date (timestamp)
- end_date (timestamp)
- is_active (boolean, default: true)
- usage_limit (integer)
- usage_count (integer, default: 0)
- applicable_items (json) // Array of menu item IDs
- applicable_categories (json) // Array of category IDs
- created_at (timestamp)
- updated_at (timestamp)
- user_created (uuid, foreign key to directus_users)
- user_updated (uuid, foreign key to directus_users)
```

#### Sync Logs (`sync_logs`)
```sql
- id (uuid, primary key)
- type (string, required) // 'menu_items', 'orders', 'tables', 'zones'
- status (string, required) // 'pending', 'in_progress', 'completed', 'failed'
- source (string, required) // 'cukcuk', 'manual', 'scheduled'
- started_at (timestamp)
- completed_at (timestamp)
- records_processed (integer, default: 0)
- records_failed (integer, default: 0)
- error_details (text)
- configuration (json)
- created_at (timestamp)
- updated_at (timestamp)
```

## Frontend Component Architecture

### Component Hierarchy
```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Landing page
├── portal/
│   ├── layout.tsx               # Portal layout with sidebar
│   ├── page.tsx                 # Dashboard
│   ├── menu-management/
│   │   └── page.tsx            # Menu management interface
│   ├── tables-zones/
│   │   └── page.tsx            # Table & zone management
│   ├── visual-tables/
│   │   └── page.tsx            # Visual table management (Live Dashboard)
│   ├── orders/
│   │   └── page.tsx            # Order management
│   ├── promotions/
│   │   └── page.tsx            # Promotion management
│   ├── sync-logs/
│   │   └── page.tsx            # Sync logs viewer
│   ├── reports/
│   │   └── page.tsx            # Reports & analytics
│   └── master/
│       ├── brands-branches/
│       │   └── page.tsx        # Brand & branch management
│       ├── staff/
│       │   └── page.tsx        # Staff management
│       └── roles/
│           └── page.tsx        # Role & permission management
├── api/
│   ├── auth/                    # Authentication endpoints
│   ├── branches/                # Branch management endpoints
│   ├── menu-items/              # Menu item endpoints
│   ├── orders/                  # Order endpoints
│   ├── tables/                  # Table endpoints
│   ├── promotions/              # Promotion endpoints
│   ├── sync-logs/               # Sync log endpoints
│   └── analytics/               # Analytics endpoints
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── BranchTable.tsx          # Branch data table
│   ├── LoadingSpinner.tsx       # Loading component
│   └── VisualTableCanvas.tsx    # Visual table management
└── lib/
    ├── directus.ts              # Directus API client
    └── utils.ts                 # Utility functions
```

### Key Components Specifications

#### VisualTableCanvas Component
```typescript
interface VisualTableCanvasProps {
  tables: Table[];
  zones: Zone[];
  selectedZone: string | null;
  onZoneChange: (zoneId: string) => void;
  readOnly?: boolean;
}

interface Table {
  id: string;
  number: string;
  zone_id: string;
  capacity: number;
  status: 'available' | 'occupied' | 'cleaning' | 'reserved';
  position_x: number;
  position_y: number;
  current_order?: {
    id: string;
    customer_name: string;
    duration: number;
  };
}

interface Zone {
  id: string;
  name: string;
  display_name: string;
  color: string;
}
```

#### MenuManagement Component
```typescript
interface MenuItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  price?: number;
  category_name?: string;
  category_code?: string;
  is_active: boolean;
  is_available: boolean;
  image_url?: string;
  track_inventory: boolean;
  spice_level?: number;
  sync_status: 'synced' | 'pending' | 'failed';
}

interface CategoryGroup {
  name: string;
  categories: Category[];
  items: MenuItem[];
  itemCount: number;
  activeCount: number;
}
```

## Security Specifications

### Authentication & Authorization
- **JWT Tokens**: Secure, HTTP-only cookies with SameSite=Strict
- **Session Management**: Automatic token refresh and expiration handling
- **Role-Based Access Control**: Granular permissions by role
- **Branch Impersonation**: Secure branch switching for admin users

### Data Security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries via Directus
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies and secure headers

### API Security
- **Rate Limiting**: Implemented on critical endpoints
- **CORS Configuration**: Restricted to approved domains
- **HTTPS Enforcement**: All production traffic over HTTPS
- **Environment Variables**: Secure configuration management

## Performance Specifications

### Frontend Performance
- **Bundle Size**: < 200KB total, < 50KB initial
- **Load Time**: < 2 seconds initial load
- **Interaction Response**: < 100ms for user interactions
- **Lighthouse Scores**: >90 for all categories

### Backend Performance
- **API Response Time**: < 500ms for 95th percentile
- **Database Queries**: Optimized with proper indexing
- **Caching Strategy**: Response caching where appropriate
- **Concurrent Users**: Support for 100+ concurrent users

### Monitoring & Logging
- **Health Checks**: `/api/health` endpoint
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Usage tracking and reporting

## Deployment Specifications

### Environment Configuration
```bash
# Production Environment
NODE_ENV=production
NEXT_PUBLIC_DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_TOKEN=production_token
NEXT_PUBLIC_API_BASE_URL=https://sol-kore.alphabits.team

# Development Environment
NODE_ENV=development
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=development_token
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### PM2 Configuration
```javascript
module.exports = {
  apps: [
    {
      name: 'web-emenu',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max_old_space_size=1024'
    }
  ]
};
```

## Testing Specifications

### Test Coverage Requirements
- **Unit Tests**: > 80% code coverage for business logic
- **Integration Tests**: All API endpoints tested
- **E2E Tests**: Critical user flows tested
- **Performance Tests**: Load testing for peak usage

### Testing Framework
- **Unit Testing**: Jest + React Testing Library
- **Integration Testing**: Jest + Supertest
- **E2E Testing**: Cypress (planned)
- **Performance Testing**: Lighthouse CI

### Critical Test Scenarios
1. **Authentication Flow**: Login, logout, session management
2. **QR Code Scanning**: Table selection and menu access
3. **Order Management**: Complete order lifecycle
4. **Data Synchronization**: CukCuk integration
5. **Branch Switching**: Impersonation and context switching

## Browser Support

### Supported Browsers
- **Chrome**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 15+

### Progressive Web App Features
- **Offline Support**: Basic functionality available offline
- **App-like Experience**: Full-screen mode support
- **Push Notifications**: Order status updates (planned)

## Internationalization

### Supported Languages
- **Primary**: English
- **Secondary**: Vietnamese (planned)
- **Additional**: Chinese, Japanese (future consideration)

### Localization Features
- **Date/Time Formatting**: Localized formats
- **Currency Formatting**: Multi-currency support
- **Number Formatting**: Locale-specific formatting
- **Text Direction**: LTR support (RTL planned)

## Accessibility

### WCAG 2.1 Compliance
- **Level AA**: Target compliance level
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Compatible with major screen readers
- **Color Contrast**: WCAG AA contrast ratios
- **Focus Management**: Logical focus flow and indicators

### Accessibility Features
- **ARIA Labels**: Comprehensive ARIA labeling
- **Alt Text**: Descriptive alt text for images
- **Semantic HTML**: Proper HTML5 semantic structure
- **Responsive Design**: Works with screen magnifiers

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration for live data
2. **Mobile Applications**: Native iOS and Android apps
3. **Advanced Analytics**: Machine learning for insights
4. **Multi-tenant Architecture**: Support for multiple restaurant chains
5. **API V2**: GraphQL support for efficient data fetching

### Scalability Considerations
- **Database Optimization**: Read replicas for scaling
- **CDN Integration**: Static asset delivery optimization
- **Microservices Architecture**: Service decomposition for scalability
- **Load Balancing**: Horizontal scaling capabilities

---

**Document Version**: 1.0.0
**Last Updated**: January 2024
**Next Review**: March 2024

This specifications document serves as the authoritative technical reference for the SOL eMenu web application and should be updated as features and architecture evolve.