# SOL eMenu Web Application

A modern NextJS single-page application for restaurant branch management with real-time CukCuk POS integration.

## 🚀 Features

- **Real-time Branch Management**: Monitor and manage restaurant branches across all locations
- **CukCuk POS Integration**: Seamless synchronization with CukCuk restaurant management system
- **Modern UI/UX**: Clean, responsive design built with Tailwind CSS
- **API Health Monitoring**: Real-time API connection status and health checks
- **Environment Configuration**: Support for development, staging, and production environments
- **Performance Optimized**: Built with NextJS 14+ and TypeScript for optimal performance

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API Integration**: Directus Headless CMS
- **Deployment**: PM2 Process Management
- **POS Integration**: CukCuk API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Access to Directus API with proper permissions
- PM2 for production deployment (optional)

## 🔧 Installation & Setup

### 1. Clone and Install

```bash
# Navigate to the project directory
cd sol-emenu-web

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env.local

# Edit the environment file
nano .env.local
```

### 3. Configure Environment Variables

Update `.env.local` with your configuration:

```bash
# Directus API Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_TOKEN=your_directus_static_token_here

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=SOL eMenu
NEXT_PUBLIC_APP_VERSION=1.0.0

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://sol-kore.alphabits.team
```

### 4. Get Directus API Token

1. Access your Directus instance at the configured URL
2. Navigate to **Settings → API & Authentication → Tokens**
3. Create a new static token with appropriate permissions
4. Copy the token and add it to your `.env.local` file

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Deployment

### Development Deployment

```bash
# Using PM2
pm2 start ecosystem.config.js --env development

# Or direct npm
npm run start
```

### Production Deployment

```bash
# Build the application
npm run build

# Deploy with PM2
pm2 start ecosystem.config.js --env production

# Or use ecosystem file directly
pm2 reload ecosystem.config.js --env production
```

## 📊 Application Structure

```
sol-emenu-web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── page.tsx        # Main landing page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   └── BranchTable.tsx # Branch data table
│   ├── lib/               # Utility libraries
│   │   └── directus.ts     # Directus API client
│   └── services/          # Business logic services
│       └── branchService.ts
├── public/               # Static assets
│   └── sol-logo.svg      # SOL logo
├── .env.local           # Environment variables
├── ecosystem.config.js  # PM2 configuration
└── PROJECT_README.md    # This file
```

## 🔌 API Integration

### Directus API Endpoints Used

- `GET /items/branches` - Fetch all restaurant branches
- `GET /items/branches/:id` - Fetch specific branch
- `POST /items/branches` - Create new branch
- `PATCH /items/branches/:id` - Update branch
- `DELETE /items/branches/:id` - Delete branch
- `GET /health` - Health check endpoint
- `GET /server/info` - Server information

### Branch Data Structure

Each branch contains:

```typescript
interface Branch {
  id: string;
  name: string;
  code: string;
  description?: string;
  external_id?: string;
  is_active: boolean;
  address?: string;
  phone?: string;
  email?: string;
  opening_hours?: Record<string, any>;
  timezone: string;
  currency: string;
  tax_rate: number;
  service_rate: number;
  has_vat: boolean;
  has_service: boolean;
  created_at: string;
  updated_at: string;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if Directus URL is correct and accessible
   - Verify the API token has proper permissions
   - Ensure network connectivity to Directus server

2. **Environment Variables Not Loading**
   - Ensure `.env.local` exists in the project root
   - Restart the development server after changing environment variables
   - Check for syntax errors in the environment file

3. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
   - Check TypeScript errors in the console

### Health Check

The application includes health check endpoints:

- `GET /api/health` - Basic health check
- `POST /api/health` with `{"detailed": true}` - Detailed health check

## 📝 Development Notes

### Environment Variables

- **Public Variables** (`NEXT_PUBLIC_*`): Exposed to browser, used for client-side configuration
- **Server Variables**: Server-side only, used for secure API tokens and sensitive data

### Styling

The application uses Tailwind CSS for styling. Custom configurations can be modified in `tailwind.config.js`.

### API Client

The Directus API client (`src/lib/directus.ts`) handles all API communication with proper error handling and authentication.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Documentation**: Check the inline documentation and comments
- **Issues**: Create an issue in the repository
- **API Documentation**: Refer to Directus API documentation

## 🔐 Security Notes

- Never commit `.env.local` files to version control
- Use HTTPS in production environments
- Implement proper CORS configuration in Directus
- Regularly rotate API tokens
- Monitor API access logs for suspicious activity