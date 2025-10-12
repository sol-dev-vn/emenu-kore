- We are using Directus as the database for the project.
- The Directus instance is running on https://sol-kore.alphabits.team/.
- Always begin a new session by looking at docs/DEPLOYMENT_NETWORK_DOMAINS.md for full technical documentation.
- See README.md for full project file structure and components.

# Docker deployment
- Directus + SQLite has been deployed at https://sol-kore.alphabits.team/ (auth with API Token).
- Directus MCP is available and configured for Trae IDE & Claude Code (https://sol-kore.alphabits.team/mcp).

# Improtant files and folder structure
- deploy/ecosystem.config.js : PM2 process configuration for API service and CukCuk data collector.
- api-service: Core Directus installation for Authentication, Admin Portal, and custom plugins | Directus + PostgreSQL.
- emenu: Mobile-responsive eMenu platform with real-time data synchronization | SvelteKit + Directus API.
- data: Data dictionary, schemas, and documentation. Cukcuk Data collector sync job.
- docs: Technical documentation, API specs, deployment guides.
- docker: Docker Compose configuration for CasaOS existing deployment.

# Data Collectors - Sync Tasks
- data/collectors/cukcuk/sync.js: Data collector for CukCuk API (run with PM2, hourly).
