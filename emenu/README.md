# SOL eMenu - Digital Restaurant Menu System

SOL eMenu is a **Next.js 15-based digital menu system** that is fully integrated with [Directus](https://directus.io/), offering
a complete restaurant management solution for digital menus and QR code ordering. The system leverages modern technologies like the
**Next.js App Router with Turbopack**, **React 19**, **TypeScript 5.8**, **Tailwind CSS 3.4**, and **Shadcn components**, providing a comprehensive platform for
modern restaurant operations.

## **Features**

- **Next.js 15 with Turbopack**: Latest Next.js with ultra-fast development server and optimized builds.
- **React 19**: Newest React version with latest features and performance improvements.
- **Full Directus SDK Integration**: Directus SDK v19.1.0 with TypeScript support for fetching and managing relational data.
- **Tailwind CSS 3.4**: Latest version with enhanced features for rapid UI styling.
- **TypeScript 5.8**: Strict typing for reliable code quality and better developer experience.
- **Shadcn Components**: Modern, accessible UI components built on Radix UI primitives.
- **React Hook Form 7.55**: Advanced form handling with Zod 3.24 validation.
- **ESLint 9.24 & Prettier**: Modern code quality tools with latest configurations.
- **Directus Visual Editing**: Integrated visual editing capabilities for content management.
- **AI Development Tools**: MCP server integration with Directus and shadcn components.
- **PM2 Process Management**: Production-ready process management with ecosystem configuration.
- **Cloudflare Tunnel**: Secure external access for development and staging.
- **MCP Integration**: Directus MCP server for AI IDE integration.

---

## **Package Management**

This project uses **npm** for managing dependencies. The project supports both **npm** and **bun** for enhanced performance. If you prefer faster installation times, you can use `bun` which is already included in devDependencies.

### Development Commands

```bash
# Install dependencies
npm install                    # or bun install

# Development server
npm run dev                    # Uses Next.js with Turbopack

# Build for production
npm run build

# Start production server
npm run start

# Generate Directus TypeScript types
npm run generate:types

# Code quality
npm run lint                   # ESLint checking
npm run lint:fix              # Auto-fix ESLint issues
npm run format                # Prettier formatting

# Testing
npm run test                   # Jest testing
npm run test:watch           # Jest in watch mode
npm run test:coverage        # Jest with coverage report
```

---

## **Draft Mode in Directus and Live Preview**

### **Draft Mode Overview**

Directus allows you to work on unpublished content using **Draft Mode**. This Next.js template is configured to support
Directus Draft Mode out of the box, enabling live previews of unpublished or draft content as you make changes.

### **Live Preview Setup**

[Directus Live Preview](https://docs.directus.io/guides/headless-cms/live-preview/nextjs.html)

- The live preview feature works seamlessly on deployed environments.
- To preview content on **localhost**, deploy your application to a staging environment.
- **Important Note**: Directus employs Content Security Policies (CSPs) that block live previews on `localhost` for
  security reasons. For a smooth preview experience, deploy the application to a cloud environment and use the
  deployment URL for Directus previews.

---

## **Getting Started**

### Prerequisites

To set up this project, ensure you have the following:

- **Node.js** (18.x or newer) - Recommended for Next.js 15 compatibility
- **npm** or **bun** - bun is included for enhanced performance
- Access to a **Directus** instance ([cloud or self-hosted](../../README.md))
- **PM2** - For production process management
- **Docker** - For Directus container deployment (if self-hosting)

## ⚠️ Directus Setup Instructions

For instructions on setting up Directus, choose one of the following:

- [Setting up Directus Cloud](https://github.com/directus-labs/starters?tab=readme-ov-file#using-directus-with-a-cloud-instance-recommended)
- [Setting up Directus Self-Hosted](https://github.com/directus-labs/starters?tab=readme-ov-file#using-directus-locally)

## 🚀 One-Click Deploy

You can instantly deploy this template using one of the following platforms:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/directus-labs/starters/tree/main/cms/nextjs&env=NEXT_PUBLIC_DIRECTUS_URL,NEXT_PUBLIC_SITE_URL,DIRECTUS_PUBLIC_TOKEN,NEXT_PUBLIC_ENABLE_VISUAL_EDITING)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/directus-labs/starters&branch=main&create_from_path=cms/nextjs)


### **Environment Variables**

To get started, you need to configure environment variables. Follow these steps:

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Update the following variables in your `.env` file:**

   - **`NEXT_PUBLIC_DIRECTUS_URL`**: URL of your Directus instance.
   - **`DIRECTUS_PUBLIC_TOKEN`**: Public token for accessing public resources in Directus. Use the token from the
     **Webmaster** account.
   - **`DIRECTUS_FORM_TOKEN`**: Token from the **Frontend Bot User** account in Directus for handling form submissions.
   - **`NEXT_PUBLIC_SITE_URL`**: The public URL of your site. This is used for SEO metadata and blog post routing.
   - **`DRAFT_MODE_SECRET`**: The secret you generate for live preview. This is used to view draft posts in directus and
     live edits.
   - **`NEXT_PUBLIC_ENABLE_VISUAL_EDITING`**: Enable or disable visual editing in Directus

## **Running the Application**

### Local Development

1. Install dependencies:

   ```bash
   npm install
   # Or for faster installation: bun install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Visit [http://localhost:3000](http://localhost:3000).

### Production Deployment

For production deployment using PM2:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start with PM2:

   ```bash
   pm2 start ecosystem.config.js
   ```

3. View logs:

   ```bash
   pm2 logs sol-emenu
   ```

The application runs on port 3000 and is accessible via Cloudflare Tunnel at https://sol-menu.alphabits.team

## Generate Directus Types

This repository includes [directus-sdk-typegen v0.2.0](https://www.npmjs.com/package/directus-sdk-typegen) to generate TypeScript types
for your Directus schema automatically.

#### Usage

1. Ensure your `.env` file is configured as described above.
2. Run the following command:
   ```bash
   npm run generate:types
   ```

This will generate TypeScript types in `src/types/directus-schema.ts` based on your Directus collections and fields.

## Folder Structure

```
src/
├── app/                              # Next.js App Router and APIs
│   ├── blog/                         # Blog-related routes
│   │   ├── [slug]/                   # Dynamic blog post route
│   │   │   └── page.tsx
│   ├── [permalink]/                  # Dynamic page route
│   │   └── page.tsx
│   ├── api/                          # API routes for draft/live preview and search
│   │   ├── draft/                    # Routes for draft previews
│   │   │   └── route.ts
│   │   ├── search/                   # Routes for search functionality
│   │   │   └── route.ts
│   ├── layout.tsx                    # Shared layout for all routes
├── components/                       # Reusable components
│   ├── blocks/                       # CMS blocks (Hero, Gallery, etc.)
│   │   └── ...
│   ├── forms/                        # Form components
│   │   ├── DynamicForm.tsx           # Renders dynamic forms with validation
│   │   ├── FormBuilder.tsx           # Manages form lifecycles and submission
│   │   ├── FormField.tsx             # Renders individual form fields dynamically
│   │   └── fields/                   # Form fields components
│   │   └── ...
│   ├── layout/                       # Layout components
│   │   ├── Footer.tsx
│   │   ├── NavigationBar.tsx
│   │   └── PageBuilder.tsx           # Assembles blocks into pages
│   ├── shared/                       # Shared utilities
│   │   └── DirectusImage.tsx         # Renders images from Directus
│   ├── ui/                           # Shadcn and other base UI components
│   │   └── ...
├── lib/                              # Utility and global logic
│   ├── directus/                     # Directus utilities
│   │   ├── directus.ts               # Directus client setup
│   │   ├── fetchers.ts               # API fetchers
│   │   ├── forms.ts                  # Directus form handling
│   │   ├── generateDirectusTypes.ts  # Generates Directus types
│   │   └── directus-utils.ts         # General Directus helpers
│   ├── zodSchemaBuilder.ts           # Zod validation schemas
├── styles/                           # Global styles
│   └── ...
├── types/                            # TypeScript types
│   └── directus-schema.ts            # Directus-generated types
```

---
