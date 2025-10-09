# Core backend + eMenu Module

## 🥘 Public eMenu platform
- Production: https://em.sol.com.vn → (pending domain)
- DEV: https://sol-emenu.alphabits.team → http://localhost:3520

## 👩🏼‍🍳 Core API Backend + 🧑🏻‍💻 Admin Portal
- Production https://kore.sol.com.vn → (pending domain)
- DEV: https://sol-kore.alphabits.team → http://localhost:11111

# Tech Stack Specifications

- Directus and Postgres (Docker `docker/sol-kore-api-database.yaml`).
- Claude Code CLI with custom settings for GLM 4.6 LLM model ([Lite Coding Plan](https://docs.z.ai/devpack/overview) from [z.ai docs](https://docs.z.ai/scenario-example/develop-tools/claude))
- `btop` for realtime load monitoring.

# Important Storage Folders

**💾 Core Database (Postgres) storage location**

```
source: /Users/dev/casa/DATA/AppData/kore/database
target: /directus/database
```

**🛠️ Directus extension and file uploads location**

```
source: /Users/dev/casa/DATA/AppData/kore/data/uploads
target: /directus/uploads

source: /Users/dev/casa/DATA/AppData/kore/data/extensions
target: /directus/extensions
```

**🧑🏻‍💻 Primary source code - IDE Workspace**

```
/Users/dev/code/emenu-kore
```

This also mapped to the IDE default workspace folder.
