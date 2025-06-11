# Pacefe - React Frontend Application

A modern React application built with Vite, TypeScript, and TanStack Router for managing calendars, transfers, and organizations.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Update the `.env` file with your actual values:
   ```env
   VITE_API_BASE_URL=your_api_base_url_here
   VITE_SENTRY_DSN=your_sentry_dsn_here (optional)
   VITE_ENVIRONMENT=development
   ```

### Development

Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
pnpm build
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run coverage
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes | - |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | No | - |
| `VITE_ENVIRONMENT` | Environment name | No | development |

## 📦 Deployment

### Environment Setup

1. **Production Environment Variables**: Create appropriate `.env.production` file or set environment variables in your deployment platform:
   ```env
   VITE_API_BASE_URL=https://your-production-api.com
   VITE_SENTRY_DSN=your-production-sentry-dsn
   VITE_ENVIRONMENT=production
   ```

2. **Build the Application**:
   ```bash
   npm run build
   ```

3. **Deploy the `dist/` folder** to your hosting platform (Vercel, Netlify, AWS S3, etc.)

### Deployment Platforms

#### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

#### AWS S3 + CloudFront
1. Build the application: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Configure CloudFront distribution
4. Set up proper routing for SPA

## 🛠️ Development Tools

- **Linting**: ESLint with custom configuration
- **Formatting**: Built-in with ESLint
- **Testing**: Vitest with React Testing Library
- **Type Checking**: TypeScript
- **Git Hooks**: Husky with lint-staged
- **Commit Linting**: Commitlint with conventional commits

## 📁 Project Structure

```
src/
├── api/                 # Generated API client
├── components/          # Reusable UI components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication
│   ├── calendar/       # Calendar management
│   ├── dashboard/      # Dashboard
│   ├── organizations/  # Organization management
│   └── transfers/      # Transfer management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── routes/             # TanStack Router routes
└── stores/             # State management
```

## 🔒 Security Considerations

- All sensitive data is stored in environment variables
- API tokens are handled securely through interceptors
- No hardcoded secrets in the codebase
- Environment files are properly gitignored

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Commit with conventional commit format
6. Push and create a pull request

## 📄 License

This project is private and proprietary.
