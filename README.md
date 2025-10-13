# SOL.com.vn - Sense of Life

[<img src="https://www.sol.com.vn/logo/main_logo_sol.png" height="200px">](https://www.sol.com.vn/logo/main_logo_sol.png)

## 🏢 About Company

SOL.com.vn is a leading Japanese culinary brand in Vietnam, operating 30+ independent restaurants ranging from iconic fine dining to casual establishments. We are committed to delivering exceptional dining experiences with outstanding service quality, embodied in our 7 service promises: delicious, hospitable, professional, clean, convenient, valuable, and authentic Japanese service.

**Vision**: Become the #1 Modern Japanese F&B Chain in Vietnam with 200 restaurants by 2028, expanding to 1,000 restaurants globally by 2035.

📖 **Detailed company information**: See [docs/ABOUT_COMPANY.md](docs/ABOUT_COMPANY.md)

## 🚀 Projects & Architecture

This monorepo contains all digital infrastructure for SOL.com.vn's restaurant operations:

| Project | Description | Technology Stack | Status |
|---------|-------------|------------------|---------|
| **emenu** | 🆕 Next.js-based eMenu platform with Directus CMS integration | Next.js 15 + React 19 + TypeScript + Directus | ✅ **Active** |
| **emenu-old** | Legacy SvelteKit eMenu application (archived) | SvelteKit + Node.js | 📦 **Archived** |
| **data** | Data dictionary, schemas, and documentation | Markdown | ✅ **Active** |
| **docs** | Technical documentation, API specs, deployment guides | Markdown | ✅ **Active** |

## 📋 Quick Start

### Prerequisites
- Node.js 18+ (recommended: Node.js 22+)
- pnpm (recommended package manager)
- PM2 (for production deployment)

### 🆕 eMenu Next.js Application (Current Active Project)

#### Installation

```bash
# Clone the repository
git clone https://github.com/sol-comvn/emenu-kore.git
cd emenu-kore

# Navigate to the active eMenu project
cd emenu

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Update .env with your Directus configuration
```

#### Development

```bash
# Start development server (default port: 3000)
pnpm run dev

# Start on custom port (e.g., 3520)
pnpm run dev -- --port 3520
```

#### Production Deployment with PM2

```bash
# From the root directory, deploy with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs emenu-dev

# Stop application
pm2 stop emenu-dev
```

The application is currently deployed at: **http://localhost:3520**

### Legacy Projects (Archived)

The previous SvelteKit-based eMenu application has been archived in `emenu-old/` directory for reference.

## 🏗️ Technical Architecture (Current)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   emenu/        │    │   Directus CMS   │    │  PostgreSQL DB  │
│   (Next.js)     │◄──►│   (Headless)     │◄──►│                 │
│   - React 19    │    │   - Content Mgmt │    │   - Data Store  │
│   - TypeScript  │    │   - API Layer   │    │   - User Auth   │
│   - Tailwind    │    │   - Real-time   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   PM2 Runtime   │    │   Admin Portal   │
│   (Production)  │    │   (Directus)     │
│   - Port 3520   │    │   - Content UI   │
│   - Auto-restart│    │   - User Mgmt    │
└─────────────────┘    └──────────────────┘
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Specification](docs/KORE_API_SPECIFICATION.md) | Complete API documentation and endpoints |
| [Data Dictionary](data/DATA_DICTIONARY.md) | Database schema and data definitions |
| [Deployment Guide](docs/DEPLOYMENT_NETWORK_DOMAINS.md) | Network domains and deployment configuration |
| [eMenu Specifications](docs/specs/sol-kore-emenu-specs.md) | Detailed eMenu platform specifications |
| [AI IDE Usage](docs/HOW_TO_USE_AI_IDE.md) | Guide for using AI development tools |

## 🏢 Restaurant Portfolio

Our current restaurant locations include:

- **Miwaku Premium** - Iconic Anniversary Restaurant at Landmark 81
- **S79 Japanese Teppanyaki** - Premium teppanyaki experience
- **Kohaku Sashimi & Yakiniku** - Traditional Japanese cuisine
- **Kohaku Sushi** - Authentic sushi and sashimi
- **Kohaku Udon & Ramen** - Japanese noodle specialties
- **Date Nariya** - Japanese Gyutan Steak
- **Machida Shoten** - Traditional Japanese izakaya

🌐 [Visit our website](https://www.sol.com.vn) for complete restaurant information

## 🔧 Current eMenu Technology Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15.2.4 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS + Shadcn/UI components
- **Language**: TypeScript 5.8.3
- **State Management**: React Hooks + Server Components
- **Development**: Turbopack for fast HMR

### Backend (Directus Headless CMS)
- **CMS**: Directus (Cloud/Self-hosted)
- **Database**: PostgreSQL
- **API**: RESTful API with real-time capabilities
- **Authentication**: JWT-based auth system
- **Content Modeling**: Flexible schema management

### Deployment & Infrastructure
- **Process Manager**: PM2 v6.0.13
- **Runtime**: Node.js
- **Environment**: Development mode on port 3520
- **Logs**: Centralized logging with PM2
- **Auto-restart**: Enabled for high availability

### Key Features
- ✅ **Modern Stack**: Latest Next.js 15 with React 19
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **CMS Integration**: Directus headless CMS
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Performance**: Turbopack for development optimization
- ✅ **SEO Optimized**: Next.js built-in SEO features
- ✅ **Visual Editing**: Directus live preview support

## 🚀 Deployment Status

**Current Deployment**: ✅ **ACTIVE**
- **URL**: http://localhost:3520
- **Environment**: Development
- **Process**: `emenu-dev` (PM2)
- **Status**: Online and running
- **Last Deployed**: October 13, 2025

### PM2 Process Information
```bash
# Process Details
Name: emenu-dev
Mode: fork
PID: 89481
Status: online
CPU: 0%
Memory: 60.0MB
Uptime: 4s
```

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in the `emenu/` directory:

```bash
# Directus Configuration
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_PUBLIC_TOKEN=your-public-token
DIRECTUS_FORM_TOKEN=your-form-token

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3520
DRAFT_MODE_SECRET=your-draft-mode-secret
NEXT_PUBLIC_ENABLE_VISUAL_EDITING=true
```

### PM2 Configuration

The `ecosystem.config.js` file contains the PM2 configuration:

```javascript
module.exports = {
  apps: [
    {
      name: 'emenu-dev',
      script: 'npm',
      args: 'run dev -- --port 3520',
      cwd: './emenu',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3520
      }
    }
  ]
};
```

## 🔄 Migration Notes

### Recent Changes (October 2025)
- ✅ **Migrated** from SvelteKit to Next.js 15
- ✅ **Implemented** Directus CMS integration
- ✅ **Added** TypeScript support throughout
- ✅ **Deployed** with PM2 process manager
- ✅ **Updated** to modern React 19 and Tailwind CSS
- ✅ **Archived** legacy code in `emenu-old/`

### Migration Benefits
- 🚀 **Better Performance**: Next.js App Router and Turbopack
- 🛡️ **Type Safety**: Full TypeScript implementation
- 🎨 **Modern UI**: Shadcn/UI components with Tailwind CSS
- 🔧 **Better DX**: Improved development experience
- 📱 **Mobile-First**: Responsive design approach

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Setup** environment:
   ```bash
   cd emenu
   pnpm install
   cp .env.example .env
   # Update .env with your configuration
   ```
4. **Develop** your feature:
   ```bash
   pnpm run dev
   ```
5. **Test** your changes thoroughly
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Code Standards
- Use TypeScript for new code
- Follow ESLint and Prettier configurations
- Test on mobile devices
- Ensure accessibility standards
- Update documentation as needed

## 📞 Contact & Support

- **Corporate Office**: 663-665 Điện Biên Phủ, Phường Thạnh Mỹ Tây, TP.HCM
- **Hotline**: 0888104799 - 028.3636.09.09
- **Email**: contact@sol.com.vn
- **Zalo**: [Contact via Zalo](https://zalo.me/2735540598556716859)

## 📄 License

This project is proprietary and owned by CÔNG TY TNHH S.O.L

---

**Made with ❤️ for S.O.L - Sense of Life**

*"Nơi bạn có thể gặp gỡ hạnh phúc của chính mình"* - Where you can find happiness in yourself
