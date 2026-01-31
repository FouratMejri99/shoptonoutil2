# How to Get Your Supabase PostgreSQL Connection String

## Important Note

The access token you provided (`sbp_da173308dd9000227242f677867027d4d20a93bb`) is for Supabase API calls, not for direct database connections. 

For database connections, you need a **PostgreSQL connection string**.

## Step-by-Step Guide

### Method 1: From Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in with your account

2. **Select Your Project**
   - Find project: `xbxwjmqmowypokicazor`
   - Click on it

3. **Get Connection String**
   - Click **Settings** (gear icon) in left sidebar
   - Click **Database**
   - Scroll down to **"Connection string"** section
   - You'll see multiple tabs:
     - **URI** - Direct connection
     - **JDBC** - Java connection
     - **Golang** - Go connection
     - **Python** - Python connection
     - **Node.js** - Node.js connection

4. **Copy the Connection String**
   - Click on **"URI"** tab
   - You'll see something like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - OR for direct connection:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

5. **Get Your Database Password**
   - If you don't remember the password:
     - In **Settings → Database**
     - Click **"Reset database password"**
     - Copy the new password

6. **Update Your .env File**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"
   ```
   Replace `YOUR_PASSWORD` with the actual password.

### Method 2: Using Connection Pooling (Better for Production)

1. In **Settings → Database → Connection string**
2. Select **"Session mode"** (connection pooling)
3. Copy the connection string (uses port 6543)
4. It looks like:
   ```
   postgresql://postgres.xbxwjmqmowypokicazor:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Method 3: Using Your Access Token (Alternative Approach)

If you prefer to use the Supabase client library instead of direct PostgreSQL:

1. **Install Supabase Client** (if not already installed):
   ```bash
   pnpm add @supabase/supabase-js
   ```

2. **Use Supabase Client** instead of direct PostgreSQL connection
   - This uses REST API calls instead of direct database connections
   - Requires different code changes

**Note:** The current codebase uses direct PostgreSQL connections, so Method 1 or 2 is recommended.

## Quick Reference

### Connection String Format

**Direct Connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Connection Pooling (Recommended):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Your Project Details
- **Project Reference:** `xbxwjmqmowypokicazor`
- **Project URL:** `https://xbxwjmqmowypokicazor.supabase.co`

## After Getting Connection String

1. **Update .env file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"
   ```

2. **Test connection:**
   ```bash
   pnpm run db:test
   ```

3. **Run migrations:**
   ```bash
   pnpm run db:push
   ```

## Troubleshooting

### "Project not found"
- Verify you're logged into the correct Supabase account
- Check if project exists in dashboard

### "Cannot resolve hostname"
- Project might be paused - resume it in dashboard
- Check if connection string hostname matches project

### "Authentication failed"
- Password might be wrong - reset it in dashboard
- Make sure password is URL-encoded if it has special characters




