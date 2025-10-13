# SOL.com.vn - Sense of Life

[<img src="https://www.sol.com.vn/logo/main_logo_sol.png" height="200px">](https://www.sol.com.vn/logo/main_logo_sol.png)

## 🏢 About Company

SOL.com.vn is a leading Japanese culinary brand in Vietnam, operating 30+ independent restaurants ranging from iconic fine dining to casual establishments. We are committed to delivering exceptional dining experiences with outstanding service quality, embodied in our 7 service promises: delicious, hospitable, professional, clean, convenient, valuable, and authentic Japanese service.

**Vision**: Become the #1 Modern Japanese F&B Chain in Vietnam with 200 restaurants by 2028, expanding to 1,000 restaurants globally by 2035.

📖 **Detailed company information**: See [docs/ABOUT_COMPANY.md](docs/ABOUT_COMPANY.md)

## 🚀 Projects & Architecture

This monorepo contains all digital infrastructure for SOL.com.vn's restaurant operations:

| Project | Description | Technology Stack |
|---------|-------------|------------------|
| **emenu-hub** | Mobile-responsive eMenu platform with real-time data synchronization | React/Next.js + Cukcuk API |
| **data** | Data dictionary, schemas, and documentation | Markdown |
| **docs** | Technical documentation, API specs, deployment guides | Markdown |

## 📋 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL 16+

### Installation

```bash
# Clone the repository
git clone https://github.com/sol-comvn/emenu-kore.git
cd emenu-kore

# Install dependencies for all projects
npm run install:all

# Or install individually
cd api-service && npm install
cd ../web-emenu && npm install
cd ../web && npm install
```

### Development Setup

```bash
# Start development environment
npm run dev

# Start individual services
npm run dev:api      # API service (Directus)
npm run dev:emenu    # eMenu platform
npm run dev:web      # Corporate website
```

### Docker Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
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

## 🔧 Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   web-emenu     │    │   api-service    │    │  PostgreSQL DB  │
│   (Frontend)    │◄──►│   (Directus)     │◄──►│                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   Cukcuk API    │    │   Admin Portal   │
│   (External)    │    │   (Directus)     │
└─────────────────┘    └──────────────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
