# Supabase Database Setup Guide

## Getting Your Supabase Connection String

Your `.env` file currently has:

```
DATABASE_URL='https://xbxwjmqmowypokicazor.supabase.co'
```

This is just the project URL. You need the **PostgreSQL connection string** instead.

### Steps to Get Your Connection String:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xbxwjmqmowypokicazor`

2. **Navigate to Database Settings**
   - Click on **Settings** (gear icon) in the left sidebar
   - Click on **Database**

3. **Find Connection String**
   - Scroll down to **Connection string** section
   - Select **URI** tab
   - Copy the connection string that looks like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres
     ```

4. **Get Your Database Password**
   - If you don't remember your password, go to **Settings** → **Database**
   - Click **Reset database password** if needed
   - Or check your project settings

5. **Update Your .env File**
   - Replace the current `DATABASE_URL` with the full connection string:
     ```env
     DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"
     ```
   - Replace `YOUR_PASSWORD` with your actual database password

## Alternative: Using Connection Pooling (Recommended for Production)

For better performance, use Supabase's connection pooling:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:6543/postgres?pgbouncer=true"
```

Note: Port `6543` is for connection pooling, port `5432` is direct connection.

## Running Database Migrations

After setting up your connection string, run the migrations:

```bash
cd solupedia-dashboard-source
pnpm run db:push
```

This will create all the necessary tables in your Supabase database.

## Setting Up RLS Policies

After running migrations, you need to set up Row Level Security (RLS) policies for the employees table. Run the SQL script in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `SUPABASE_RLS_POLICIES.sql`
4. Run the script

This will:

- Enable RLS on the employees table
- Create policies for read, insert, update, and delete operations
- Add performance indexes
- Create a trigger for auto-updating the `updatedAt` field

## Verifying Connection

The application will automatically test the connection on startup. Check the server logs for:

- `[Database] Successfully connected to database` ✅
- Or error messages if connection fails ❌

## Troubleshooting

### Connection Refused

- Make sure your Supabase project is active
- Check that the password is correct
- Verify the connection string format

### SSL Required

- Supabase requires SSL connections
- The code automatically enables SSL for Supabase connections
- If you see SSL errors, make sure you're using the correct connection string

### Database Not Found

- Make sure you're using the `postgres` database (default)
- The connection string should end with `/postgres`

## Security Notes

⚠️ **Never commit your `.env` file to git!**

- The `.env` file is already in `.gitignore`
- Keep your database password secure
- Use environment variables in production
