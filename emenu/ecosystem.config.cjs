module.exports = {
  apps: [
    {
      name: 'emenu',
      script: 'build/index.js',
      cwd: '/Users/dev/code/emenu-kore/emenu',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'development',
        PORT: 3520,
        HOST: '0.0.0.0',
        PUBLIC_DIRECTUS_URL: 'https://sol-kore.alphabits.team',
        ORIGIN: 'https://sol-menu.alphabits.team'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3520,
        HOST: '0.0.0.0',
        PUBLIC_DIRECTUS_URL: 'https://sol-kore.alphabits.team',
        ORIGIN: 'https://sol-menu.alphabits.team'
      },
      log_file: '/Users/dev/code/emenu-kore/emenu/logs/combined.log',
      out_file: '/Users/dev/code/emenu-kore/emenu/logs/out.log',
      error_file: '/Users/dev/code/emenu-kore/emenu/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
      // Health check configuration
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    }
  ],

  // Logging configuration
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  error_file: '/Users/dev/code/emenu-kore/emenu/logs/error.log',
  out_file: '/Users/dev/code/emenu-kore/emenu/logs/out.log',
  log_file: '/Users/dev/code/emenu-kore/emenu/logs/combined.log',
  merge_logs: true,
  time: true
};