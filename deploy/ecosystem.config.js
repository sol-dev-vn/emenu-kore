// SOL eMenu Platform - Complete Ecosystem Configuration
// Manages all services: Directus API, eMenu Web Application, and supporting services

module.exports = {
  apps: [
    // Directus Headless CMS (API + Database)
    {
      name: 'sol-kore-api',
      script: 'npx',
      args: 'directus start',
      cwd: '/Users/dev/code/emenu-kore/sol-emenu-web',

      // Environment Configuration
      env: {
        NODE_ENV: 'development',
        PORT: 11111,
        ADMIN_EMAIL: 'sol.dev.vn@gmail.com',
        ADMIN_PASSWORD: 'sol.dev.kore.password!',
        DB_CLIENT: 'sqlite3',
        DB_FILENAME: '/directus/database/data.db',
        PUBLIC_URL: 'https://sol-id.alphabits.team',
        SECRET: '481nas0dnaodf7yugjh24oi4u97yiqghrwfsuywirh41',
        WEBSOCKETS_ENABLED: 'true'
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 11111,
        ADMIN_EMAIL: 'sol.dev.vn@gmail.com',
        ADMIN_PASSWORD: 'sol.dev.kore.password!',
        DB_CLIENT: 'sqlite3',
        DB_FILENAME: '/directus/database/data.db',
        PUBLIC_URL: 'https://kore.sol.com.vn',
        SECRET: '481nas0dnaodf7yugjh24oi4u97yiqghrwfsuywirh41',
        WEBSOCKETS_ENABLED: 'true'
      },

      // Process Configuration
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '3G',

      // Logging Configuration
      log_file: '/Users/dev/code/emenu-kore/logs/sol-kore-api.log',
      out_file: '/Users/dev/code/emenu-kore/logs/sol-kore-api-out.log',
      error_file: '/Users/dev/code/emenu-kore/logs/sol-kore-api-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Application Configuration
      kill_timeout: 10000,
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',

      // Docker Integration (using existing container)
      interpreter: 'none',
      interpreter_args: '',

      // Volume Mounts (from existing Docker setup)
      env_file: '.env',

      // Health Check
      health_check_grace_period: 10000,

      // Custom script to handle Docker container
      script: 'docker',
      args: 'start the-kore',

      // Additional Docker configuration
      docker: {
        image: 'directus/directus:latest',
        container: 'the-kore',
        port: '11111:8055'
      }
    },

    // SOL eMenu Web Application
    {
      name: 'sol-emenu-web',
      script: 'npm',
      args: 'start',
      cwd: '/Users/dev/code/emenu-kore/sol-emenu-web',

      // Environment Configuration
      env: {
        NODE_ENV: 'development',
        PORT: 3520,
        NEXT_PUBLIC_DIRECTUS_URL: 'https://sol-kore.alphabits.team',
        DIRECTUS_URL: 'https://sol-kore.alphabits.team',
        DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN || 'your_directus_static_token_here',
        NEXT_PUBLIC_APP_NAME: 'SOL eMenu',
        NEXT_PUBLIC_APP_VERSION: '1.0.0',
        NEXT_PUBLIC_API_BASE_URL: 'https://sol-kore.alphabits.team'
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 3520,
        NEXT_PUBLIC_DIRECTUS_URL: 'https://kore.sol.com.vn',
        DIRECTUS_URL: 'https://kore.sol.com.vn',
        DIRECTUS_TOKEN: process.env.PRODUCTION_DIRECTUS_TOKEN,
        NEXT_PUBLIC_APP_NAME: 'SOL eMenu',
        NEXT_PUBLIC_APP_VERSION: '1.0.0',
        NEXT_PUBLIC_API_BASE_URL: 'https://kore.sol.com.vn'
      },

      // Process Configuration
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // Logging Configuration
      log_file: '/Users/dev/code/emenu-kore/logs/sol-emenu-web.log',
      out_file: '/Users/dev/code/emenu-kore/logs/sol-emenu-web-out.log',
      error_file: '/Users/dev/code/emenu-kore/logs/sol-emenu-web-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Application Configuration
      kill_timeout: 5000,
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',

      // Node Configuration
      node_args: '--max-old-space-size=1024',

      // Environment Variables for Next.js
      env_file: '.env.local',

      // Health Check
      health_check_grace_period: 3000,

      // Advanced Configuration
      wait_ready: true,
      listen_timeout: 3000,

      // Development Specific
      dev: {
        watch: ['src', 'public', '.env.local'],
        ignore_watch: ['node_modules', '.next', 'logs'],
        env: {
          NODE_ENV: 'development',
          PORT: 3520
        }
      }
    },

    // Optional: Nginx Reverse Proxy (for production)
    {
      name: 'sol-nginx-proxy',
      script: 'nginx',
      args: '-g "daemon off;" -c /Users/dev/code/emenu-kore/deploy/nginx.conf',

      env: {
        NODE_ENV: 'production'
      },

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',

      log_file: '/Users/dev/code/emenu-kore/logs/sol-nginx.log',
      out_file: '/Users/dev/code/emenu-kore/logs/sol-nginx-out.log',
      error_file: '/Users/dev/code/emenu-kore/logs/sol-nginx-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      kill_timeout: 3000,
      restart_delay: 2000,
      max_restarts: 5,
      min_uptime: '5s',

      // Health check
      health_check_grace_period: 5000,

      // Only start in production
      autostart: process.env.NODE_ENV === 'production'
    }
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['sol-kore.alphabits.team'],
      ref: 'origin/main',
      repo: 'git@github.com:sol-dev-vn/emenu-kore.git',
      path: '/var/www/sol-emenu',
      'pre-deploy-local': '',
      'post-deploy': `
        cd /var/www/sol-emenu &&
        git pull origin main &&
        cd sol-emenu-web && npm install && npm run build &&
        cd .. &&
        pm2 reload ecosystem.config.js --env production &&
        pm2 save
      `,
      'pre-setup': ''
    },

    staging: {
      user: 'deploy',
      host: ['staging.sol.com.vn'],
      ref: 'origin/develop',
      repo: 'git@github.com:sol-dev-vn/emenu-kore.git',
      path: '/var/www/sol-emenu-staging',
      'post-deploy': `
        cd /var/www/sol-emenu-staging &&
        git pull origin develop &&
        cd sol-emenu-web && npm install && npm run build &&
        cd .. &&
        pm2 reload ecosystem.config.js --env staging
      `
    }
  }
};