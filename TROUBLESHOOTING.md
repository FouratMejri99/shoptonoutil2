# Troubleshooting Database Connection Issues

## Error: `ENOTFOUND db.xbxwjmqmowypokicazor.supabase.co`

This error means the hostname cannot be resolved. Here's how to fix it:

### Step 1: Verify Your Supabase Project

1. Go to https://supabase.com/dashboard
2. Check if your project `xbxwjmqmowypokicazor` exists
3. **Important**: Make sure the project is **NOT paused**
   - Paused projects cannot accept connections
   - If paused, click "Restore project" or "Resume"

### Step 2: Get the Correct Connection String

1. In Supabase Dashboard, go to your project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection string** section
4. Select **URI** tab
5. Copy the **full connection string** (it should look like):
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```

### Step 3: Update Your .env File

Replace your current `DATABASE_URL` with the correct connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your actual database password
- If you don't know the password, reset it in Supabase Dashboard
- Make sure there are no extra spaces or quotes in the connection string

### Step 4: Test the Connection

Run the connection test script:

```bash
cd solupedia-dashboard-source
pnpm run db:test
```

This will:
- ✅ Validate the connection string format
- ✅ Test DNS resolution
- ✅ Test database connection
- ✅ Show helpful error messages if something fails

### Step 5: Run Migrations

Once the connection test passes:

```bash
pnpm run db:push
```

## Common Issues

### Issue: "Project not found"
**Solution**: The project reference in your connection string might be wrong. Get a fresh connection string from Supabase.

### Issue: "Connection refused"
**Solution**: 
- Check if the project is paused (most common)
- Verify the port number (5432 for direct, 6543 for pooling)
- Check firewall/network settings

### Issue: "Authentication failed"
**Solution**:
- Verify the password is correct
- Reset the database password in Supabase Dashboard
- Make sure special characters in password are URL-encoded

### Issue: "SSL required"
**Solution**: The code automatically enables SSL for Supabase. If you still see this error, make sure you're using the correct connection string format.

## Alternative: Using Connection Pooling

For better performance and reliability, use Supabase's connection pooling:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

You can find this connection string in:
**Supabase Dashboard → Settings → Database → Connection string → Session mode**

## Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify Project Status**: Make sure it's not paused
3. **Get Fresh Credentials**: Generate a new connection string from the dashboard
4. **Check Network**: Ensure you can reach Supabase servers
5. **Review Logs**: Check server console for detailed error messages

## Quick Test Command

```bash
# Test connection
pnpm run db:test

# If successful, run migrations
pnpm run db:push

# Start server
pnpm run dev
```






