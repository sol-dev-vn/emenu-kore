module.exports = {
  apps: [
    {
      name: 'emenu-dev',
      script: 'npm',
      args: 'run dev -- --port 3520',
      cwd: './emenu',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3520
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3520,
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3520'
      },
      error_file: './logs/emenu-error.log',
      out_file: './logs/emenu-out.log',
      log_file: './logs/emenu-combined.log',
      time: true,
      kill_timeout: 5000,
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Additional Next.js specific configurations
      node_args: '--max-old-space-size=1024',
      // Development mode specific
      development: true,
      // Port configuration
      port: 3520,
      // Custom environment variables for development
      env_file: './emenu/.env'
    }
  ]
};