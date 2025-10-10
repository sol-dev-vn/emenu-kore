# SOL eMenu Project - AI Developer Guide

## 🚨 Quick Start for AI Assistants (Claude Code, Trae, GLM, Warpdev)

**Primary Resources (Read First):**
1. `docs/DEPLOYMENT_NETWORK_DOMAINS.md` - Complete technical documentation
2. `README.md` - Project structure and overview
3. `docs/HOW_TO_USE_AI_IDE.md` - IDE usage guide and tips

## 🏗️ Architecture Overview

**Database & Backend:**
- Directus instance: https://sol-kore.alphabits.team/
- Database: SQLite (development) / PostgreSQL (production)
- Directus MCP: https://sol-kore.alphabits.team/mcp (for AI IDE integration)

**Applications:**
- `web-emenu/` - Next.js eMenu platform (React/TypeScript + CukCuk API)
- `api-service/` - Directus headless CMS (auth, admin, custom plugins)

**Key Files:**
- `deploy/ecosystem.config.js` - PM2 process configuration
- `data/collectors/cukcuk/sync.js` - CukCuk API data sync (PM2, hourly)
- `docker/` - Docker Compose configurations
- `docs/` - Technical documentation and API specs

## 🔧 Development Commands

**PM2 Process Management:**
```bash
pm2 list                    # View all processes
pm2 restart web-emenu       # Restart web app
pm2 logs web-emenu          # View web app logs
pm2 save                    # Save PM2 configuration
```

**Docker Commands:**
```bash
docker ps                  # List running containers
docker restart the-kore     # Restart Directus container
```

**Git Workflow:**
```bash
git add .                   # Stage all changes
git commit -m "feat: description"
git push origin main        # Push to remote
```

## 🎯 AI Development Guidelines

**When Starting New Tasks:**
1. Always read `docs/DEPLOYMENT_NETWORK_DOMAINS.md` first
2. Check existing file structure with `tree -L 3`
3. Use conventional commit messages (feat:, fix:, docs:, refactor:)
4. Test deployment configurations before committing

**Code Standards:**
- TypeScript with strict typing
- Tailwind CSS for styling
- ESLint + Prettier for code formatting
- Follow existing patterns and naming conventions

**Deployment Best Practices:**
- Test in development environment first
- Use PM2 for process management
- Monitor logs for errors: `pm2 logs`
- Check API health endpoints before and after deployments
- Never touch `code-server` PM2 process. Do not stop or restart it.

## 📡 Environment Variables

**Web Application (.env.local):**
```bash
NEXT_PUBLIC_DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_TOKEN=your_static_token_here
NEXT_PUBLIC_APP_NAME=SOL eMenu
```

**API Configuration:**
- Development: https://sol-kore.alphabits.team
- Production: https://kore.sol.com.vn

## 🔄 Data Sync Process

**CukCuk Integration:**
- Sync script: `data/collectors/cukcuk/sync.js`
- Runs hourly via PM2
- Pulls restaurant data from CukCuk API
- Updates Directus collections with latest menu/branch info

**Manual Sync Trigger:**
```bash
pm2 restart cukcuk-sync
```

## 🐛 Common Issues & Solutions

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
# Reinstall dependencies
npm ci
```

**API Connection Issues:**
- Verify Directus URL is accessible
- Check API token permissions
- Ensure CORS is configured properly

**PM2 Process Issues:**
```bash
pm2 delete all        # Clear all processes
pm2 restart ecosystem.config.js  # Restart with config
```

## 📊 Monitoring & Logs

**Log Locations:**
- Web app: `/Users/dev/code/emenu-kore/logs/web-emenu*.log`
- API: `/Users/dev/code/emenu-kore/logs/sol-kore-api*.log`
- PM2: `pm2 logs --lines 100`

**Health Checks:**
- Web app: http://localhost:3520/api/health
- Directus API: https://sol-kore.alphabits.team/health
