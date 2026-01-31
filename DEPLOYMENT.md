# Deployment Guide for Solupedia Dashboard

This guide outlines the steps to deploy the Solupedia Dashboard and Website to a production environment.

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL Database**: You can use a managed service like Supabase, Neon, AWS RDS, or a self-hosted instance.
- **pnpm**: Recommended package manager (or npm/yarn).

## 1. Environment Configuration

Create a `.env` file in the root directory (or configure environment variables in your hosting provider's dashboard) with the following variables:

```env
# Database Connection
# Replace with your production database connection string
DATABASE_URL="postgresql://user:password@host:port/database"

# Security
# Generate a strong, unique secret key for JWT tokens
JWT_SECRET="your-strong-production-secret-key"

# App Configuration
NODE_ENV="production"
VITE_APP_TITLE="Solupedia Professional Localization"
VITE_APP_LOGO="/logo-blue-full.png"

# Admin Setup (Optional - for initial setup)
# These are used to seed the initial admin account if needed
# ADMIN_EMAIL="admin@solupedia.com"
# ADMIN_PASSWORD="secure-password"
```

## 2. Build the Application

To prepare the application for production, run the build command. This compiles the React frontend and bundles the Node.js backend.

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build
```

This will create a `dist` directory containing the compiled assets and server code.

## 3. Database Migration

Ensure your production database schema is up to date.

```bash
# Push schema changes to the production database
pnpm run db:push
```

## 4. Running the Application

To start the application in production mode:

```bash
pnpm start
```

The server will typically run on port 3000 (or the port defined by your hosting provider).

## 5. Hosting Options

### Option A: VPS (DigitalOcean, AWS EC2, Linode)

1.  Provision a Linux server (Ubuntu recommended).
2.  Install Node.js and PostgreSQL (or use a managed DB).
3.  Clone the repository.
4.  Set up environment variables in `.env`.
5.  Run `pnpm install && pnpm run build`.
6.  Use a process manager like **PM2** to keep the application running:
    ```bash
    npm install -g pm2
    pm2 start dist/index.js --name "solupedia"
    pm2 save
    pm2 startup
    ```
7.  Set up Nginx as a reverse proxy to forward traffic from port 80/443 to port 3000.
8.  Configure SSL with Certbot (Let's Encrypt).

### Option B: Platform as a Service (Railway, Render, Heroku)

Since this project is a monorepo with both frontend and backend in one, it's easiest to deploy as a single web service.

**Railway / Render:**
1.  Connect your GitHub repository.
2.  Set the **Build Command** to: `pnpm install && pnpm run build`
3.  Set the **Start Command** to: `pnpm start`
4.  Add your Environment Variables in the dashboard.
5.  Deploy.

### Option C: Vercel (Frontend Only / Full Stack)

This project uses a custom Express/Node.js backend. Deploying to Vercel requires adapting the server to Serverless Functions or deploying the backend separately.

**Recommended:** Deploy the backend to Railway/Render (Option B) and the frontend to Vercel if you want to split them, but the current configuration is optimized for a single server deployment.

## 6. Verification

After deployment:
1.  Visit the homepage and ensure all assets load correctly.
2.  Go to `/solupedia-admin` and log in with your admin credentials.
3.  Test the contact forms and other interactive features.
4.  Verify that time tracking and employee portals are functioning.

## Troubleshooting

-   **Database Connection Errors:** Double-check your `DATABASE_URL`. Ensure your database accepts connections from your server's IP.
-   **Build Failures:** Check memory usage. If building on a small instance, you might need to increase swap space.
-   **Port Issues:** Ensure port 3000 (or your configured port) is exposed and not blocked by a firewall.
