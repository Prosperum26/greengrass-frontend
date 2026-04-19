# Greengrass Frontend

<p align="center">
  <strong>Environmental Events Platform - Frontend</strong>
</p>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

Greengrass Frontend is a modern React application for an environmental events platform. It provides a seamless user experience for discovering, registering, and participating in eco-friendly events with gamification features.

### Key Capabilities

- **Event Discovery**: Browse and search environmental events with map integration
- **Event Management**: Create, register, and manage event participation
- **QR Check-in**: Scan QR codes for event attendance verification
- **Gamification**: Earn points, badges, and track leaderboard rankings
- **Real-time Features**: Live notifications and updates
- **Responsive Design**: Optimized for all device sizes

---

## Tech Stack

| Category        | Technology              | Version |
| --------------- | ----------------------- | ------- |
| **Framework**   | React                   | ^19.2.4 |
| **Build Tool**  | Vite                    | ^8.0.4  |
| **Styling**     | Tailwind CSS            | ^3.4.19 |
| **Routing**     | React Router DOM        | ^7.14.0 |
| **HTTP Client** | Axios                   | ^1.15.0 |
| **Forms**       | React Hook Form         | ^7.72.1 |
| **Validation**  | Zod                     | ^4.3.6  |
| **Maps**        | Leaflet + React Leaflet | ^5.0.0  |
| **QR Scanner**  | @zxing/browser          | ^0.1.5  |
| **Linting**     | ESLint                  | ^9.39.4 |

---

## Project Structure

```
greengrass-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API clients & interceptors
│   │   ├── client.js      # Axios configuration
│   │   ├── auth.js        # Authentication APIs
│   │   ├── events.js      # Event management APIs
│   │   └── ...
│   ├── components/        # Shared UI components
│   │   ├── ui/           # Button, Card, Input, Modal...
│   │   ├── layout/       # Header, Sidebar, Footer
│   │   └── common/       # Toast, Loading, ErrorBoundary
│   ├── features/          # Feature-based modules
│   │   ├── auth/         # Login, Register, OAuth
│   │   ├── events/       # Event listing, details, registration
│   │   ├── checkin/      # QR scanner, GPS validation
│   │   ├── gamification/ # Points, badges, leaderboard
│   │   ├── map/          # Interactive map with markers
│   │   └── profile/      # User profiles, history
│   ├── contexts/          # React contexts (Auth, Error)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page-level components
│   ├── routes/            # Route definitions
│   ├── utils/             # Utilities & constants
│   └── styles/            # Global styles
├── .github/workflows/      # CI/CD pipelines
├── docs/                   # Documentation
└── ui-prototype/           # Design prototypes
```

### Architecture Principles

- **Feature-Based Structure**: Each feature is self-contained with its own components, hooks, and API calls
- **Component Composition**: Reusable UI components with clear prop interfaces
- **Context API**: Global state management for auth and error handling
- **Custom Hooks**: Encapsulated logic for data fetching and form handling

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** 1.x (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd greengrass-frontend

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env
```

### Development

```bash
# Start dev server
yarn dev

# Run linter
yarn lint

# Build for production
yarn build

# Preview production build
yarn preview
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required
VITE_API_URL=http://localhost:3000        # Backend API URL
VITE_APP_NAME=GreenGrass                    # App name

# Optional
VITE_API_TIMEOUT=10000                      # API timeout (ms)
VITE_DEBUG=false                           # Debug mode
VITE_ANALYTICS_ENABLED=false               # Analytics
```

See `.env.example` for full configuration options.

---

## Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment with the following configuration:

```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### Deploy Steps

1. **Connect Repository**: Import your GitHub repo to Vercel
2. **Configure Environment**: Add all environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to `main`

#### Environment Variables on Vercel

Set these in Vercel Project Settings:

- `VITE_API_URL` - Production API URL
- `VITE_APP_ENV` - Set to `production`
- `VITE_ANALYTICS_ENABLED` - Enable analytics for production

### Other Platforms

The `dist/` folder contains the static build output and can be deployed to:

- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting

---

## CI/CD

### GitHub Actions Workflow

The project includes automated CI/CD pipeline (`.github/workflows/deploy.yml`):

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linter
      - Build application
      - Deploy to Vercel
```

### Required Secrets

Configure these in GitHub Settings > Secrets:

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

---

## Development Guidelines

### Code Style

- **Linting**: ESLint with React Hooks and React Refresh plugins
- **Formatting**: Follow existing code style (2 spaces, single quotes)
- **Imports**: Use barrel exports from feature `index.js` files

### Naming Conventions

- **Components**: PascalCase (`EventCard.jsx`)
- **Hooks**: camelCase with `use` prefix (`useEvents.js`)
- **Utils**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE

### Git Workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

---

## Available Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `yarn dev`     | Start development server (port 5173) |
| `yarn build`   | Build for production                 |
| `yarn preview` | Preview production build locally     |
| `yarn lint`    | Run ESLint                           |

---

## Troubleshooting

### Common Issues

**'vite' is not recognized**

```bash
yarn install
yarn dev
```

**Port 5173 in use**

```bash
yarn dev -- --port 3000
```

**Dependencies issues**

```bash
# Windows
Remove-Item -Recurse -Force node_modules
Remove-Item yarn.lock
yarn install

# macOS/Linux
rm -rf node_modules yarn.lock
yarn install
```

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Built with 💚 for a greener planet
</p>
