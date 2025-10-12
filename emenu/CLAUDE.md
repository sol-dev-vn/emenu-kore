# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server on port 3520
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Check code formatting with Prettier

### Type Checking

- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run type checking in watch mode

### Testing

- `npm test` - Run all tests once
- `npm run test:unit` - Run unit tests with Vitest
- Tests are split into client (browser) and server (node) environments

### Database (Drizzle - currently configured but not actively used)

- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate TypeScript types from schema
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle studio

## Architecture Overview

### Tech Stack

- **Frontend**: Svelte 5 with SvelteKit, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with Bits UI and custom components
- **Styling**: Tailwind CSS with custom color palette and dark mode support
- **Content**: Directus headless CMS (remote instance)
- **Authentication**: Directus-based user authentication
- **Deployment**: Netlify adapter
- **Internationalization**: Paraglide JS for i18n support
- **Markdown**: MDsvex for .md/.svx file processing

### Key Architectural Patterns

#### File Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Radix/Bits UI components
│   │   └── *.svelte        # Custom components (Header, Footer, Hero, etc.)
│   ├── server/             # Server-side utilities
│   │   ├── auth.ts         # Directus authentication
│   │   ├── db/             # Database schema (Drizzle - configured but not active)
│   │   └── blog.ts         # Blog content management
│   ├── directus.js         # Directus SDK configuration
│   ├── utils.js            # Utility functions
│   └── paraglide/          # Internationalization files
├── routes/                 # SvelteKit file-based routing
│   ├── (blog)/             # Blog route group with markdown support
│   ├── api/                # API endpoints
│   ├── auth/               # Authentication routes
│   ├── tech-hotpot/        # Tech Hotpot content section
│   └── *.svelte            # Page components
└── hooks.{ts,server.ts}    # SvelteKit hooks
```

#### Component Architecture

- **UI Components**: Built on Radix UI primitives via Bits UI for accessibility
- **Custom Components**: Reusable business logic components (Header, Footer, Hero, etc.)
- **Layout Components**: Structural components with slots for flexibility
- **State Management**: Svelte 5 runes for reactive state, custom stores for complex state

#### Data Flow

- **Directus CMS**: Remote content management via REST API
- **Server Load Functions**: Data fetching on the server for SEO and performance
- **Client-side State**: Svelte stores and runes for interactive UI state
- **API Routes**: Server endpoints for dynamic content (blog posts, categories)

#### Authentication

- Directus-based authentication system
- Session management via custom Directus collection
- Server-side auth hooks for route protection
- User types defined in `src/lib/server/db/schema.ts`

#### Internationalization

- Paraglide JS setup for multi-language support
- Messages in `src/lib/paraglide/messages/`
- Runtime and server-side integration

### Development Workflow

#### Environment Setup

- Uses `.env` files for configuration
- Directus URL configured via `PUBLIC_DIRECTUS_URL`
- Development server allows localhost and specific domains

#### Styling Conventions

- Tailwind CSS utility-first approach
- Custom color palette: deep-navy, medium-teal, light-mint, cyan-accent, dark-teal
- Class-based dark mode implementation
- Component variants via tailwind-variants and class-variance-authority

#### Code Quality

- Prettier for code formatting with Svelte and Tailwind plugins
- TypeScript for type safety
- SvelteCheck for Svelte-specific type checking
- Vitest for unit testing with browser and node environments

#### Content Management

- Blog posts via Directus CMS with REST API
- Markdown support through MDsvex (.svx files)
- Dynamic routing for blog posts and tech hotpot content
- SEO-optimized with server-side rendering

### Important Notes

#### Database

- Drizzle ORM is configured but database functionality is not actively used
- Schema exists but migrations and queries are not implemented
- Focus is on Directus CMS for content management

#### Authentication

- Authentication system is implemented but may not be actively used
- Directus user management with custom session handling
- Routes exist but may not be protected in production

#### Testing

- Test infrastructure is set up with Vitest
- Both browser (Playwright) and node test environments configured
- Test files follow `.spec.ts` naming convention

#### Build and Deployment

- Netlify adapter for deployment
- SvelteKit build process with optimizations
- Static site generation where possible, SSR for dynamic content
