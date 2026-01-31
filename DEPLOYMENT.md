# Deployment Guide for Solupedia Dashboard

This guide outlines the steps to deploy the Solupedia Dashboard and Website to a production environment.

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL Database**: You can use a managed service like Supabase (recommended), Neon, AWS RDS, or a self-hosted instance.
- **pnpm**: Recommended package manager (or npm/yarn).

### For Supabase Users

If you're using Supabase, see `SUPABASE_SETUP.md` for detailed setup instructions. The application automatically:
- Enables SSL for Supabase connections
- Validates connection string format
- Provides helpful error messages for common issues

## 1. Environment Configuration

Create a `.env` file in the root directory (or configure environment variables in your hosting provider's dashboard) with the following variables:

```env
# Database Connection
# For Supabase, use the connection string from: Settings → Database → Connection string → URI
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
# Or use connection pooling (recommended): postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_URL="postgresql://user:password@host:port/database"

# Security
# Generate a strong, unique secret key for JWT tokens
JWT_SECRET="your-strong-production-secret-key"

# App Configuration
NODE_ENV="production"
VITE_APP_TITLE="Solupedia Professional Localization"
VITE_APP_LOGO="/logo-blue-full.png"

# OAuth Configuration (if using OAuth)
OAUTH_SERVER_URL="your-oauth-server-url"
VITE_APP_ID="your-app-id"
OWNER_OPEN_ID="your-owner-open-id"

# Admin Setup (Optional - for initial setup)
# These are used to seed the initial admin account if needed
ADMIN_EMAIL="admin@solupedia.com"
ADMIN_PASSWORD="secure-password"
```

**Important Notes:**
- The `DATABASE_URL` is **required** in production. The server will exit if it's missing.
- For Supabase, ensure your project is **not paused** and use the correct connection string format.
- Never commit `.env` files to version control (already in `.gitignore`).

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
# Test database connection first
pnpm run db:test

# Push schema changes to the production database
pnpm run db:push

# Optional: Initialize admin account
pnpm run supabase:seed-admin
```

**Note:** The `db:push` command uses `drizzle-kit push` which is the recommended method for Supabase. It will automatically sync your schema without creating migration files.

## 4. Running the Application

To start the application in production mode:

```bash
pnpm start
```

The server will:
- Validate required environment variables
- Initialize database connection on startup
- Run on port 3000 (or the port defined by `PORT` environment variable or your hosting provider)
- Automatically find an available port if 3000 is busy

**Windows Users:** The `start` script uses `cross-env` for cross-platform compatibility, so it works on Windows, macOS, and Linux.

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

### Database Connection Errors

-   **"DATABASE_URL is required"**: Set the `DATABASE_URL` environment variable in your `.env` file or hosting provider's dashboard.
-   **"ENOTFOUND" errors**: 
    - For Supabase: Check if your project is paused in the Supabase dashboard
    - Verify the connection string format is correct
    - Get a fresh connection string from Supabase Dashboard → Settings → Database
-   **"Authentication failed"**: 
    - Verify your database password is correct
    - For Supabase: Reset the password in Settings → Database if needed
-   **Connection refused**: Ensure your database accepts connections from your server's IP address (for managed services like Supabase, this is usually automatic).

### Build Failures

-   **Memory errors**: Check memory usage. If building on a small instance, you might need to increase swap space.
-   **Missing dependencies**: Run `pnpm install` before building.

### Port Issues

-   **Port already in use**: The server will automatically find an available port starting from 3000.
-   **Port blocked**: Ensure port 3000 (or your configured port) is exposed and not blocked by a firewall.

### Supabase-Specific Issues

-   **Project paused**: Resume your project in the Supabase dashboard
-   **Wrong connection string format**: Use the connection string from Supabase Dashboard → Settings → Database → Connection string → URI tab
-   **SSL errors**: The application automatically enables SSL for Supabase connections. If you see SSL errors, verify your connection string format.

### Getting Help

-   Check the server logs for detailed error messages
-   Run `pnpm run db:test` to test your database connection
-   See `SUPABASE_SETUP.md` for Supabase-specific setup
-   See `TROUBLESHOOTING.md` for more detailed troubleshooting steps
