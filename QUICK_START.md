# Quick Start Guide - Running Solupedia Dashboard

## Prerequisites

Before running the project, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Supabase Account** (free) - [Sign up here](https://supabase.com) OR **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
3. **pnpm** (recommended) or npm

### Install pnpm (if not installed)
```bash
npm install -g pnpm
```

## Quick Start Steps

### 1. Navigate to Project Directory
```bash
cd solupedia-dashboard-source
```

### 2. Install Dependencies

**Using pnpm (recommended):**
```bash
pnpm install
```

**Or using npm:**
```bash
npm install
```

### 3. Set Up Database

#### Option A: Using Supabase (Recommended)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from **Settings** → **Database** → **Connection string** (URI)
4. See `SUPABASE_SETUP.md` for detailed instructions

#### Option B: Using Local PostgreSQL

1. Open **pgAdmin** (comes with PostgreSQL)
2. Right-click on "Databases" → Create → Database
3. Name it: `solupedia_db`
4. Click Save

#### Create Environment File

Create a `.env.local` file in the `solupedia-dashboard-source` folder:

**For Supabase:**
```env
# Database Connection (Supabase)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

**For Local PostgreSQL:**
```env
# Database Connection (Local)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/solupedia_db"

# JWT Secret (generate a random string)
JWT_SECRET="your-random-secret-key-change-this"

# OAuth Configuration
VITE_APP_ID="local-dev"
OAUTH_SERVER_URL="http://localhost:3000"
VITE_OAUTH_PORTAL_URL="http://localhost:3000"

# Owner Info
OWNER_NAME="Solupedia Admin"
OWNER_OPEN_ID="admin@solupedia.com"

# App Configuration
VITE_APP_TITLE="Solupedia Improvement Dashboard"
VITE_APP_LOGO="/logo-blue-full.png"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT="http://localhost:3000"
VITE_ANALYTICS_WEBSITE_ID="solupedia"

# Forge API (optional)
BUILT_IN_FORGE_API_URL="http://localhost:3000"
BUILT_IN_FORGE_API_KEY="local-dev-key"
VITE_FRONTEND_FORGE_API_URL="http://localhost:3000"
VITE_FRONTEND_FORGE_API_KEY="local-dev-key"
```

**Important:** 
- For Supabase: Replace with your Supabase connection string
- For Local: Replace `YOUR_PASSWORD` with your PostgreSQL password

### 4. Initialize Database

Run the database migration:

```bash
pnpm run db:push
```

Or with npm:
```bash
npm run db:push
```

### 5. Start Development Server

```bash
pnpm run dev
```

Or with npm:
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000/
```

### 6. Access the Application

Open your browser and go to:
- **Homepage:** http://localhost:3000
- **Admin Portal:** http://localhost:3000/solupedia-admin
- **Employee Portal:** http://localhost:3000/employee/login

## Default Login Credentials

### Admin Portal
- **URL:** http://localhost:3000/solupedia-admin
- **Email:** `weseily@solupedia.com`
- **Password:** `admin123` ⚠️ **Change this in production!**

### Employee Portal
- **URL:** http://localhost:3000/employee/login
- Create employees via the admin portal

## Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm start            # Start production server

# Database
pnpm run db:push      # Run database migrations

# Testing
pnpm test             # Run tests
pnpm run check        # Type check without building
```

## Troubleshooting

### Port 3000 Already in Use

**Windows:**
```bash
# Find the process
netstat -ano | findstr :3000

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local` is correct
3. Verify the database `solupedia_db` exists
4. Verify the password is correct

### Dependencies Installation Fails

```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

Or with npm:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## Project Structure

```
solupedia-dashboard-source/
├── client/          # React frontend
├── server/          # Node.js backend (Express + tRPC)
├── drizzle/         # Database schema and migrations
├── shared/          # Shared types and constants
├── package.json     # Dependencies and scripts
└── .env.local       # Environment variables (create this)
```

## Next Steps

1. ✅ Run the application locally
2. ✅ Test the admin portal
3. ✅ Create employee accounts
4. ✅ Test time tracking features
5. ✅ Explore the website pages

## Need More Help?

- See `WINDOWS_SETUP_GUIDE.md` for detailed Windows setup
- See `README.md` for full documentation
- Check console output for error messages

---

**Happy coding! 🚀**

