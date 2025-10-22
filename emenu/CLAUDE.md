<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

- Prefer to Manage the server process with PM2 and ecosystem.config.js file, unless for debugging.
- Vendure ecommerce service installation is at /Users/dev/code/emenu-kore/emenu . It runs at port 3000 mapped to CloudFlare Tunnel https://sol-menu.alphabits.team
- If port 3000 is used, that means we need to restart the server by PM2 (remember to do npm install).I need
- We are using Directus SDK (Full SDK Doc https://directus.io/docs/guides/connect/sdk)
- Use Directus MCP to check with actual backend if needed.
- Try not to tail or watch logs/process for too long.
- Database file is at /Users/dev/casa/DATA/AppData/kore/database/data.db (SQlite3)
- Read solmenu/.cursor/rules/convex_rules.mdc for rules to work with Convex

Styling Rules:
- Primary tone Red: #9B1D20 (ruby red for accents and highlights)
- Background tone: #FFE4E1 (a soft peach-red complement)
- Text tone: #333333 (a dark gray for readability)
- Navigation/Secondary tone: #F5F5F5 (a light gray-white for contrast)
- Use flat color professional modern styling, with micro animation for subtle interactions.

Implementation rules
- Review existing utils, services, helpers, models, controller, UI components,... before creating new one, prefer to consolidate in a few files following D.R.Y principles.

