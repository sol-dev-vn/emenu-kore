# Project Context

## Purpose
SOL eMenu (KORE) is a comprehensive digital restaurant management platform for SOL.com.vn's Japanese restaurant chain in Vietnam. The system enables customers to browse menus and place orders via QR code scanning while providing restaurant staff with powerful management tools. The platform integrates with CukCuk POS system for real-time menu synchronization and order management across 30+ restaurant locations.

## Tech Stack

### Frontend (eMenu Application)
- **Framework**: Svelte 5 with SvelteKit, TypeScript
- **UI Components**: Radix UI primitives with Bits UI and custom components
- **Styling**: Tailwind CSS v4 with custom design system and dark mode support
- **QR Code Scanning**: @yudiel/react-qr-scanner for mobile camera access
- **State Management**: Svelte 5 runes for reactive state, custom stores for complex state
- **Form Handling**: SvelteKit native forms with validation
- **Icons**: Lucide React and Lucide Svelte
- **Internationalization**: Paraglide JS for multi-language support (Vietnamese, English, Japanese, Korean, Mandarin, Russian)
- **Markdown**: MDsvex for .md/.svx file processing
- **Deployment**: Netlify adapter

### Backend & Infrastructure
- **Headless CMS**: Directus with PostgreSQL database
- **Database**: PostgreSQL 16+ with comprehensive schema for restaurant operations
- **POS Integration**: CukCuk API client for real-time menu and order synchronization
- **AI Development**: Claude Code CLI with GLM 4.6 LLM model
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 for production deployments
- **Network Tunneling**: Cloudflare Tunnel for secure external access

### Development Tools
- **Package Management**: npm with workspaces for monorepo structure
- **Code Quality**: Prettier with Svelte and Tailwind plugins, TypeScript strict mode
- **Testing**: Vitest with browser (Playwright) and node environments
- **Type Checking**: SvelteCheck for Svelte-specific type checking

## Project Conventions

### Code Style
- **Formatting**: Prettier with tabs, single quotes, no trailing commas, 100 char print width
- **File Naming**: kebab-case for components and files, PascalCase for Svelte components
- **Component Structure**: Use `<script>` blocks at top, followed by markup, then styles
- **TypeScript**: Strict mode enabled, proper type annotations required
- **CSS**: Tailwind utility classes, custom color palette: deep-navy, medium-teal, light-mint, cyan-accent, dark-teal

### Architecture Patterns
- **Monorepo Structure**: Organized into api-service, web-emenu, and web directories
- **File-Based Routing**: SvelteKit file-based routing with route groups
- **Component Architecture**: Radix UI primitives via Bits UI for accessibility, reusable business logic components
- **Data Flow**: Directus CMS for content management, server load functions for data fetching, client-side state for interactive UI
- **API Security**: Backend proxy pattern - no Directus tokens in frontend, all API requests through secure backend

### Testing Strategy
- **Unit Testing**: Vitest for component and utility testing
- **Browser Testing**: Playwright for end-to-end testing
- **Test Files**: .spec.ts naming convention
- **Coverage**: Both client (browser) and server (node) test environments

### Git Workflow
- **Branching**: Feature branches from main, descriptive naming
- **Commits**: Conventional commits with clear descriptions
- **Pull Requests**: Required for all changes, automated checks

## Domain Context

### Restaurant Operations
- **Multi-Branch Management**: 30+ restaurants with independent menus and pricing
- **Zone-Based Layout**: Physical zones within branches for table organization
- **Table Management**: QR code-enabled tables with status tracking
- **Menu Synchronization**: Real-time sync with CukCuk POS system
- **Order Management**: Complete order lifecycle from placement to completion

### Business Rules
- **Branch Independence**: Each branch maintains custom menu and pricing
- **Table Context**: Menu displays table number and zone information
- **QR Code Access**: Direct menu access via table QR codes
- **Multi-Language Support**: Vietnamese (primary), English, Japanese, Korean, Mandarin, Russian
- **Order Types**: On-site, take-away, delivery with different pricing structures

### Data Model
- **Core Entities**: Branches, Zones, Tables, Categories, Menu Items, Combos, Orders
- **Integration Fields**: External ID mapping for CukCuk integration
- **Sync Tracking**: Enhanced sync status tracking with resume functionality
- **Performance Metrics**: Sales performance tracking and analytics

## Important Constraints

### Technical Constraints
- **No Client-Side Tokens**: All sensitive API credentials stored server-side only
- **Backend API Gateway**: All external API requests routed through secure backend
- **Real-Time Synchronization**: CukCuk API integration must support real-time updates
- **Mobile-First Design**: Primary interface is mobile devices via QR codes
- **Multi-Language**: Support for 6 languages with proper internationalization

### Business Constraints
- **Restaurant Operations**: Must support peak hours with high concurrent usage
- **Offline Capability**: Limited offline support for basic menu browsing
- **Payment Integration**: Future integration with restaurant POS systems
- **Regulatory Compliance**: Vietnamese food service regulations and data privacy

### Performance Constraints
- **Load Times**: Menu loading under 2 seconds on mobile devices
- **QR Code Processing**: Immediate table detection and menu loading
- **Concurrent Users**: Support for 1000+ simultaneous users per branch
- **Data Synchronization**: Near real-time sync with CukCuk API

## External Dependencies

### Critical Services
- **Directus CMS**: Primary data management and admin interface
- **CukCuk POS API**: Menu synchronization and order management
- **Cloudflare Tunnel**: Secure external access for development
- **Netlify**: Frontend hosting and deployment

### APIs and Integrations
- **CukCuk API Client**: @luutronghieu/cukcuk-api-client for POS integration
- **Directus SDK**: @directus/sdk for CMS interaction
- **Paraglide JS**: Internationalization framework
- **QR Code Libraries**: Mobile camera access and QR processing

### Development Infrastructure
- **PostgreSQL Database**: Located at `/Users/dev/casa/DATA/AppData/kore/database`
- **File Storage**: Directus file system at `/Users/dev/casa/DATA/AppData/kore/data/`
- **Development Workspace**: `/Users/dev/code/emenu-kore`
- **Container Services**: Docker Compose for local development

### External URLs
- **eMenu Production**: https://em.sol.com.vn (pending)
- **eMenu Development**: https://sol-emenu.alphabits.team
- **API Production**: https://kore.sol.com.vn (pending)
- **API Development**: https://sol-kore.alphabits.team
