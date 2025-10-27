# SOL eMenu - Technology Stack Overview

## 🚀 **Latest Stack Information - Updated October 2025**

This document provides a comprehensive overview of the current technology stack used in the SOL eMenu project.

## 📦 **Core Dependencies**

### **Frontend Framework**
- **Next.js**: 15.2.4 (Latest with App Router and Turbopack)
- **React**: 18.3.1 (Latest stable version)
- **TypeScript**: 5.8.3 (Strict mode enabled)

### **UI & Styling**
- **Tailwind CSS**: 3.4.17 (Latest stable version)
- **shadcn/ui**: 3.5.0 (Modern component library)
- **Radix UI**: Multiple primitives for accessible components
  - @radix-ui/react-avatar: 1.1.2
  - @radix-ui/react-checkbox: 1.1.4
  - @radix-ui/react-dialog: 1.1.6
  - @radix-ui/react-dropdown-menu: 2.1.6
  - @radix-ui/react-label: 2.1.2
  - @radix-ui/react-navigation-menu: 1.2.5
  - @radix-ui/react-progress: 1.1.7
  - @radix-ui/react-radio-group: 1.2.3
  - @radix-ui/react-select: 2.1.6
  - @radix-ui/react-separator: 1.1.2
  - @radix-ui/react-slot: 1.1.2
  - @radix-ui/react-switch: 1.2.6
  - @radix-ui/react-tabs: 1.1.13
  - @radix-ui/react-tooltip: 1.1.8

### **Form Handling & Validation**
- **React Hook Form**: 7.55.0 (Latest version)
- **Zod**: 3.24.2 (Schema validation)
- **@hookform/resolvers**: 5.0.1 (Form validation integration)

### **Backend Integration**
- **Directus SDK**: 19.1.0 (Full TypeScript SDK)
- **Directus Visual Editing**: 1.1.0 (Live content editing)
- **directus-sdk-typegen**: 0.2.0 (Automatic type generation)

### **State Management & Utilities**
- **clsx**: 2.1.1 (Conditional className utility)
- **tailwind-merge**: 2.6.0 (Tailwind class merging)
- **class-variance-authority**: 0.7.1 (Component variant management)
- **cmdk**: 1.1.1 (Command palette functionality)

### **Authentication & Security**
- **jose**: 5.9.6 (JWT token handling)

### **User Experience**
- **react-hot-toast**: 2.6.0 (Toast notifications)
- **next-themes**: 0.4.6 (Theme switching)
- **lucide-react**: 0.487.0 (Icon library)
- **@yudiel/react-qr-scanner**: (QR code scanning - check package.json for version)

### **Performance & Queuing**
- **p-queue**: 8.1.0 (Promise queue management)

## 🛠️ **Development Dependencies**

### **TypeScript & Build Tools**
- **TypeScript**: 5.8.3
- **tsx**: 4.19.3 (TypeScript execution)
- **@next/bundle-analyzer**: 15.2.4 (Bundle size analysis)

### **Code Quality & Linting**
- **ESLint**: 9.24.0 (Latest version)
- **ESLint Configs**:
  - @eslint/js: 9.24.0
  - @next/eslint-plugin-next: 15.2.4
  - eslint-config-next: 15.2.4
  - eslint-config-prettier: 10.1.1
  - eslint-plugin-import: 2.31.0
  - eslint-plugin-promise: 7.2.1
  - eslint-plugin-react: 7.37.5
  - eslint-plugin-tailwindcss: 3.18.0
- **TypeScript ESLint**: 8.29.1

### **Formatting & Style**
- **Prettier**: 3.5.3 (Code formatting)
- **@trivago/prettier-plugin-sort-imports**: 5.2.2 (Import sorting)
- **prettier-plugin-tailwindcss**: 0.6.11 (Tailwind class sorting)

### **Package Management**
- **bun**: 1.3.1 (Fast package manager, alternative to npm)

### **Testing**
- **Jest**: (Configured for testing with coverage support)

### **CSS & PostCSS**
- **PostCSS**: 8.5.3
- **tailwindcss-animate**: 1.0.7 (Animation utilities)
- **@tailwindcss/typography**: 0.5.16 (Typography plugin)

### **Global Configuration**
- **globals**: 16.0.0 (ESLint globals configuration)

## 🔧 **Development Tools Integration**

### **AI Development Tools (MCP Servers)**
- **Directus MCP**: https://sol-kore.alphabits.team/mcp
- **Shadcn MCP**: Component generation and management
- **Memory MCP**: Context and memory management for AI
- **Time MCP**: Time-related utilities
- **Sequential Thinking MCP**: Enhanced reasoning capabilities

### **Process Management**
- **PM2**: Production process manager
- **ecosystem.config.js**: PM2 configuration file

### **Containerization**
- **Docker**: Directus backend containerization
- **Docker Compose**: Multi-container orchestration

### **Network & Deployment**
- **Cloudflare Tunnel**: Secure external access
- **Development URL**: https://sol-menu.alphabits.team
- **Directus Admin**: https://sol-kore.alphabits.team

## 🎯 **Key Features & Capabilities**

### **Performance**
- **Turbopack**: Ultra-fast development builds
- **Next.js 15**: Latest optimizations and features
- **Bundle Analyzer**: Built-in bundle size optimization
- **Code Splitting**: Automatic route and component splitting

### **Developer Experience**
- **Type Safety**: Full TypeScript coverage with auto-generated types
- **Hot Reload**: Fast refresh with Turbopack
- **AI Integration**: Multiple MCP servers for enhanced development
- **Component Library**: Comprehensive shadcn/ui component set
- **Form Validation**: Robust form handling with Zod schemas

### **Content Management**
- **Directus Integration**: Full CMS capabilities with TypeScript SDK
- **Visual Editing**: Live content editing interface
- **Type Generation**: Automatic TypeScript type generation from Directus schema
- **File Management**: Integrated asset and media handling

### **Security & Authentication**
- **JWT Handling**: Secure token management with Jose
- **Environment Variables**: Secure configuration management
- **API Security**: Backend proxy pattern for API calls

## 🔄 **Package Scripts**

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "generate:types": "tsx ./src/lib/directus/generateDirectusTypes.ts",
  "lint": "next lint",
  "lint:fix": "eslint --fix \"src/**/*.{js,jsx,ts,tsx}\"",
  "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --coverage --watchAll=false --passWithNoTests"
}
```

## 📊 **Environment Configuration**

### **Required Environment Variables**
```bash
# Directus Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_TOKEN=your_directus_token
DIRECTUS_FORM_TOKEN=your_form_token

# Application Configuration
NEXT_PUBLIC_APP_NAME=SOL eMenu
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Visual Editing
NEXT_PUBLIC_ENABLE_VISUAL_EDITING=true

# Development
NODE_ENV=development
```

## 🚀 **Deployment Architecture**

### **Development Environment**
- **Local Development**: http://localhost:3000 (Turbopack enabled)
- **Directus Development**: https://sol-kore.alphabits.team
- **External Access**: https://sol-menu.alphabits.team (Cloudflare Tunnel)

### **Production Environment**
- **Process Manager**: PM2 with ecosystem configuration
- **Directus Production**: https://kore.sol.com.vn (pending setup)
- **Database**: SQLite with persistent storage
- **Containerization**: Docker for Directus backend

### **Storage Architecture**
- **Database**: `/Users/dev/casa/DATA/AppData/kore/database/data.db`
- **File Uploads**: `/Users/dev/casa/DATA/AppData/kore/data/uploads`
- **Directus Extensions**: `/Users/dev/casa/DATA/AppData/kore/data/extensions`
- **Source Code**: `/Users/dev/code/emenu-kore/emenu`

## 📈 **Performance Optimizations**

1. **Build Performance**: Turbopack for ultra-fast development builds
2. **Bundle Optimization**: Next.js 15 with automatic code splitting
3. **Image Optimization**: Next.js Image component with automatic optimization
4. **Font Optimization**: Local font loading with Next.js font optimization
5. **CSS Optimization**: Tailwind CSS with purging for minimal CSS
6. **Type Safety**: Full TypeScript coverage for runtime error prevention

---

*This stack overview is maintained and updated regularly to reflect the latest dependencies and configurations used in the SOL eMenu project.*