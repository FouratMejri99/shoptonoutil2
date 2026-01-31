# Link Supabase Project - Quick Guide

## Option 1: Using Supabase CLI via npx (Recommended)

Since Supabase CLI can't be installed globally, use `npx` to run it:

```bash
cd solupedia-dashboard-source
npx supabase@latest link --project-ref xbxwjmqmowypokicazor
```

This will:
1. Prompt you to authenticate (you'll need to log in)
2. Link your local project to the Supabase project
3. Create a `.supabase` folder with project configuration
4. Automatically set up connection strings

**Note:** You'll need to authenticate with Supabase. The CLI will open a browser or provide a token.

## Option 2: Manual Connection String Setup

If the CLI linking doesn't work, get the connection string manually:

### Step 1: Get Connection String from Dashboard

1. Go to: https://supabase.com/dashboard/project/xbxwjmqmowypokicazor
2. Click **Settings** → **Database**
3. Scroll to **"Connection string"**
4. Click **"URI"** tab
5. Copy the connection string

### Step 2: Update .env File

Add to your `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"
```

Replace `YOUR_PASSWORD` with your database password.

### Step 3: Test Connection

```bash
pnpm run db:test
```

## Option 3: Using Your Access Token

If you want to use the access token you provided, you can:

1. **Add it to .env:**
   ```env
   SUPABASE_ACCESS_TOKEN=sbp_da173308dd9000227242f677867027d4d20a93bb
   ```

2. **However**, for direct database connections, you still need the PostgreSQL connection string. The access token is for API calls.

## Quick Commands

```bash
# Link project (requires authentication)
npx supabase@latest link --project-ref xbxwjmqmowypokicazor

# Test connection
pnpm run db:test

# Run migrations
pnpm run db:push
```

## Troubleshooting

### "Authentication required"
- The CLI will prompt you to log in
- Follow the instructions to authenticate

### "Project not found"
- Verify the project reference: `xbxwjmqmowypokicazor`
- Make sure you're logged into the correct Supabase account

### "Connection failed"
- Check if project is paused in dashboard
- Verify connection string format
- Make sure password is correct

## Recommended: Use Connection Pooling

For better reliability, use the **Session mode** connection string (port 6543):

```env
DATABASE_URL="postgresql://postgres.xbxwjmqmowypokicazor:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

You can find this in: **Settings → Database → Connection string → Session mode**




