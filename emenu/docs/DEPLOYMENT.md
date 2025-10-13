# EMENU Deployment Guide

## Overview

This guide covers deploying the EMENU restaurant management system using PM2 on a local machine with Cloudflare tunnel for external access.

## Prerequisites

- Node.js 18+ installed
- PM2 installed globally (`npm install -g pm2`)
- Cloudflare tunnel configured for `sol-menu.alphabits.team` → `localhost:3520`
- Directus instance configured and accessible

## Environment Setup

### 1. Environment Variables

Copy the production environment template:
```bash
cp .env.production .env.local
```

Edit `.env.local` with your actual values:
- `PUBLIC_DIRECTUS_URL`: Your Directus instance URL
- `ORIGIN`: `https://sol-menu.alphabits.team`
- `SESSION_SECRET`: Generate a secure random string
- `JWT_SECRET`: Generate a secure random string

### 2. Install Dependencies

```bash
npm ci --production
```

### 3. Build Application

```bash
npm run build
```

## Deployment Methods

### Method 1: Automated Deployment Script

Use the provided deployment script:

```bash
# Full deployment
./scripts/deploy.sh

# Or with specific options
./scripts/deploy.sh --restart  # Restart only
./scripts/deploy.sh --stop      # Stop application
./scripts/deploy.sh --logs      # View logs
./scripts/deploy.sh --status    # Check status
./scripts/deploy.sh --monit     # Open PM2 monitor
```

### Method 2: Manual PM2 Deployment

1. **Stop existing processes:**
   ```bash
   pm2 stop emenu
   pm2 delete emenu
   ```

2. **Start the application:**
   ```bash
   pm2 start ecosystem.config.cjs --env production
   ```

3. **Save PM2 configuration:**
   ```bash
   pm2 save
   ```

4. **Verify deployment:**
   ```bash
   pm2 status
   curl http://localhost:3520
   ```

## PM2 Configuration

The `ecosystem.config.cjs` file contains the PM2 configuration:

- **Application**: Runs on port 3520, binds to 0.0.0.0
- **Memory**: Restarts if exceeding 1GB
- **Logging**: Logs to `logs/` directory
- **Restarts**: Automatic restart on crashes
- **Health Checks**: Built-in health monitoring

## Monitoring and Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Check status
pm2 status

# View logs
pm2 logs emenu

# View recent logs
pm2 logs emenu --lines 50

# Follow logs
pm2 logs emenu --lines 0 -f
```

### Log Files

Logs are stored in the `logs/` directory:
- `out.log` - Standard output
- `error.log` - Error output
- `combined.log` - Combined logs

### Log Rotation

PM2 automatically handles log rotation. For custom log rotation, you can use:

```bash
# Install pm2-logrotate
pm2 install pm2-logrotate

# Configure (optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Cloudflare Tunnel Integration

The application is configured to work with Cloudflare tunnel:

1. **Tunnel Configuration**: Ensure tunnel points `sol-menu.alphabits.team` → `localhost:3520`
2. **HTTPS**: Application receives HTTPS traffic via Cloudflare
3. **Origin Header**: Set to `https://sol-menu.alphabits.team` for proper redirects

## Troubleshooting

### Application Won't Start

1. **Check logs:**
   ```bash
   pm2 logs emenu --lines 50
   ```

2. **Check environment variables:**
   ```bash
   pm2 env 0
   ```

3. **Verify build:**
   ```bash
   npm run build
   ```

### Memory Issues

1. **Check memory usage:**
   ```bash
   pm2 monit
   ```

2. **Increase memory limit in `ecosystem.config.cjs`:**
   ```javascript
   max_memory_restart: '2G'  // Increase from 1G
   ```

### Port Conflicts

1. **Check what's using port 3520:**
   ```bash
   lsof -i :3520
   ```

2. **Kill process if needed:**
   ```bash
   kill -9 <PID>
   ```

### Directus Connection Issues

1. **Verify Directus URL is accessible**
2. **Check Directus token permissions**
3. **Test API connectivity:**
   ```bash
   curl -H "Authorization: Bearer <token>" <directus-url>/items/users
   ```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **HTTPS**: Always use HTTPS in production (via Cloudflare tunnel)
3. **Tokens**: Use secure, randomly generated secrets
4. **Firewall**: Ensure only necessary ports are exposed
5. **Updates**: Keep Node.js and dependencies updated

## Performance Optimization

### PM2 Clustering

For higher traffic, enable clustering:

```javascript
// ecosystem.config.cjs
instances: 'max',  // Use all CPU cores
exec_mode: 'cluster'
```

### Caching

- Enable browser caching via Cloudflare
- Implement API response caching
- Use CDN for static assets

## Backup and Recovery

### Application Backup

1. **Backup source code:**
   ```bash
   git archive --format=tar.gz HEAD > emenu-backup-$(date +%Y%m%d).tar.gz
   ```

2. **Backup PM2 configuration:**
   ```bash
   cp ecosystem.config.cjs ecosystem.config.cjs.backup
   ```

3. **Backup logs:**
   ```bash
   tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
   ```

### Recovery

1. **Restore from git:**
   ```bash
   git clone <repository-url>
   cd emenu
   ```

2. **Restore environment variables:**
   ```bash
   cp .env.production .env.local
   # Edit with actual values
   ```

3. **Deploy:**
   ```bash
   ./scripts/deploy.sh
   ```

## Maintenance

### Regular Tasks

1. **Check application health:** `pm2 status`
2. **Monitor logs:** `pm2 logs emenu --lines 20`
3. **Update dependencies:** `npm update`
4. **Security updates:** Keep Node.js updated

### Health Monitoring

Set up monitoring alerts for:
- Application downtime
- High memory usage
- Error rate spikes
- Performance degradation

## Support

For issues with:
- **Application functionality**: Check logs and PM2 status
- **Cloudflare tunnel**: Verify tunnel configuration
- **Directus**: Check Directus instance health
- **Performance**: Monitor PM2 metrics and logs

## Rollback Procedure

If deployment fails:

1. **Stop new version:**
   ```bash
   pm2 stop emenu
   ```

2. **Revert changes:**
   ```bash
   git checkout <previous-commit>
   ```

3. **Redeploy:**
   ```bash
   ./scripts/deploy.sh
   ```

4. **Verify functionality** before announcing restoration.