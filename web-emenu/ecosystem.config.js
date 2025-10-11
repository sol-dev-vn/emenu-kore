// PM2 Ecosystem Configuration for SOL eMenu Web Application
// Production and development environment configuration

module.exports = {
  apps: [
    {
      name: 'web-emenu',
      script: 'npm',
      args: 'start',
      cwd: '/Users/dev/code/emenu-kore/web-emenu',

      // Environment Configuration
      env: {
        NODE_ENV: 'development',
        PORT: 3520,
        NEXT_PUBLIC_DIRECTUS_URL: 'https://sol-kore.alphabits.team',
        DIRECTUS_TOKEN: '39Omtm9x8eE3dOYxsI1iXk3MPZ9L235y',
        NEXT_PUBLIC_APP_NAME: 'SOL eMenu',
        NEXT_PUBLIC_APP_VERSION: '1.0.0'
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 3520,
        NEXT_PUBLIC_DIRECTUS_URL: 'https://kore.sol.com.vn',
        DIRECTUS_TOKEN: process.env.PRODUCTION_DIRECTUS_TOKEN,
        NEXT_PUBLIC_APP_NAME: 'SOL eMenu',
        NEXT_PUBLIC_APP_VERSION: '1.0.0'
      },

      // Process Configuration
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',

      // Logging Configuration
      log_file: '/Users/dev/code/emenu-kore/logs/web-emenu.log',
      out_file: '/Users/dev/code/emenu-kore/logs/web-emenu-out.log',
      error_file: '/Users/dev/code/emenu-kore/logs/web-emenu-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Application Configuration
      kill_timeout: 5000,
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',

      // Monitoring
      monitoring: false,

      // Node Configuration
      node_args: '--max-old-space-size=1024',

      // Environment Variables for Next.js
      env_file: '.env.local',

      // Health Check
      health_check_grace_period: 3000,

      // Advanced Configuration
      wait_ready: true,
      listen_timeout: 3000,

      // PM2 Plus Configuration (if available)
      pmx: true,

      // Development Specific
      dev: {
        watch: ['src', 'public', '.env.local'],
        ignore_watch: ['node_modules', '.next', 'logs'],
        env: {
          NODE_ENV: 'development',
          PORT: 3520
        }
      }
    }
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:sol-dev-vn/emenu-kore.git',
      path: '/var/www/web-emenu',
      'pre-deploy-local': '',
      'post-deploy': 'cd /var/www/web-emenu/web-emenu && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },

    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:sol-dev-vn/emenu-kore.git',
      path: '/var/www/web-emenu-staging',
      'post-deploy': 'cd /var/www/web-emenu-staging/web-emenu && npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};