# Environment Variables Guide

This guide explains where to get each environment variable for your `.env` file.

## Required Variables

### 1. `DATABASE_URL` ✅ (You already have this!)

**What it is:** PostgreSQL connection string for your database

**Where to get it:**
- **Supabase:** Dashboard → Settings → Database → Connection string → Session mode (port 6543)
- **Format:** `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`

**Example:**
```env
DATABASE_URL="postgresql://postgres.rzucruak:Fsm4561%2112@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

### 2. `JWT_SECRET` (Line 3 in env.ts)

**What it is:** Secret key for signing JWT tokens (used for authentication cookies)

**Where to get it:**
- **Generate your own:** Use any random string generator
- **Online generator:** https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
- **Command line:** 
  ```bash
  # On Linux/Mac:
  openssl rand -base64 32
  
  # On Windows (PowerShell):
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```

**Example:**
```env
JWT_SECRET="your-super-secret-random-string-at-least-32-characters-long"
```

**Important:** 
- Make it long (at least 32 characters)
- Keep it secret (never commit to git)
- Use different secrets for development and production

---

### 3. `VITE_APP_ID` (Line 2 in env.ts)

**What it is:** Your OAuth application ID (if using OAuth authentication)

**Where to get it:**
- **If using Manus OAuth:** From your Manus project settings
- **If using custom OAuth:** From your OAuth provider (Google, GitHub, etc.)
- **If NOT using OAuth:** Can be left empty or set to a placeholder

**Example:**
```env
VITE_APP_ID="your-oauth-app-id"
```

**For development/testing:**
```env
VITE_APP_ID="local-dev"
```

---

## Optional Variables

### 4. `OAUTH_SERVER_URL`

**What it is:** URL of your OAuth server

**Where to get it:**
- **Manus OAuth:** Usually `https://api.manus.computer` or similar
- **Custom OAuth:** Your OAuth provider's base URL
- **If NOT using OAuth:** Can be left empty

**Example:**
```env
OAUTH_SERVER_URL="https://api.manus.computer"
```

---

### 5. `OWNER_OPEN_ID`

**What it is:** The OpenID of the owner/admin user (automatically gets admin role)

**Where to get it:**
- **After OAuth login:** Check the user's `openId` field in the database
- **From OAuth provider:** Usually returned after successful authentication
- **If NOT using OAuth:** Can be left empty

**Example:**
```env
OWNER_OPEN_ID="user-open-id-from-oauth"
```

---

### 6. `BUILT_IN_FORGE_API_URL` & `BUILT_IN_FORGE_API_KEY`

**What it is:** API credentials for Forge API (if using Forge services)

**Where to get it:**
- **From Forge dashboard:** If you're using Forge services
- **If NOT using Forge:** Can be left empty

**Example:**
```env
BUILT_IN_FORGE_API_URL="https://api.forge.example.com"
BUILT_IN_FORGE_API_KEY="your-forge-api-key"
```

---

### 7. `ADMIN_EMAIL` & `ADMIN_PASSWORD`

**What it is:** Initial admin account credentials (optional, for seeding)

**Where to get it:**
- **You create these:** Choose your own admin email and password
- **Used by:** `pnpm run supabase:seed-admin` script

**Example:**
```env
ADMIN_EMAIL="admin@solupedia.com"
ADMIN_PASSWORD="your-secure-password"
```

---

### 8. `NODE_ENV`

**What it is:** Environment mode (development or production)

**Where to get it:**
- **You set this:** Based on your environment
- **Development:** `development`
- **Production:** `production`

**Example:**
```env
NODE_ENV="development"
# or
NODE_ENV="production"
```

---

### 9. `PORT`

**What it is:** Port number for the server to run on

**Where to get it:**
- **You choose this:** Default is 3000
- **Development:** Usually 3000
- **Production:** Depends on your hosting provider

**Example:**
```env
PORT=3000
```

---

### 10. `VITE_APP_TITLE` & `VITE_APP_LOGO`

**What it is:** App branding configuration

**Where to get it:**
- **You set these:** Your app's title and logo path

**Example:**
```env
VITE_APP_TITLE="Solupedia Professional Localization"
VITE_APP_LOGO="/logo-blue-full.png"
```

---

## Complete .env File Example

```env
# Database Connection (REQUIRED)
DATABASE_URL="postgresql://postgres.rzucruak:Fsm4561%2112@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Security (REQUIRED)
JWT_SECRET="your-super-secret-random-string-at-least-32-characters-long-change-this"

# OAuth Configuration (OPTIONAL - if using OAuth)
VITE_APP_ID="your-oauth-app-id"
OAUTH_SERVER_URL="https://api.manus.computer"
OWNER_OPEN_ID="user-open-id-from-oauth"

# Forge API (OPTIONAL - if using Forge)
BUILT_IN_FORGE_API_URL=""
BUILT_IN_FORGE_API_KEY=""

# Admin Setup (OPTIONAL - for initial admin account)
ADMIN_EMAIL="admin@solupedia.com"
ADMIN_PASSWORD="secure-password"

# App Configuration
NODE_ENV="development"
PORT=3000
VITE_APP_TITLE="Solupedia Professional Localization"
VITE_APP_LOGO="/logo-blue-full.png"
```

---

## Quick Setup for Development

If you just want to get started quickly:

```env
# Required
DATABASE_URL="your-connection-string-from-supabase"
JWT_SECRET="dev-secret-key-change-in-production-12345678901234567890"

# Optional (can leave empty if not using OAuth)
VITE_APP_ID=""
OAUTH_SERVER_URL=""
OWNER_OPEN_ID=""

# App config
NODE_ENV="development"
```

---

## How to Generate JWT_SECRET

### Option 1: Online Generator
1. Go to: https://randomkeygen.com/
2. Copy a "CodeIgniter Encryption Keys" (256-bit)
3. Paste it as your `JWT_SECRET`

### Option 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## Security Notes

⚠️ **Never commit your `.env` file to git!**
- The `.env` file is already in `.gitignore`
- Keep all secrets secure
- Use different secrets for development and production
- Rotate secrets periodically

---

## Verification

After setting up your `.env` file:

1. **Test database connection:**
   ```bash
   pnpm run db:test
   ```

2. **Check environment variables:**
   ```bash
   pnpm run db:debug
   ```

3. **Start the server:**
   ```bash
   pnpm run dev
   ```

If everything is set up correctly, the server should start without errors!

