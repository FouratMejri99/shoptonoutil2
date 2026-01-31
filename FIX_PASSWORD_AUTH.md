# Fix Password Authentication Error

## Issue Found

Your connection string is **missing the `?pgbouncer=true` parameter** which is required for connection pooling!

## Current Connection String

Your current connection string is:
```
postgresql://postgres.pmonzbwnmaydjxuobtwy:Fsm4561%2112@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

## Fixed Connection String

Add `?pgbouncer=true` at the end:

```env
DATABASE_URL="postgresql://postgres.pmonzbwnmaydjxuobtwy:Fsm4561%2112@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## Alternative: Try Direct Connection

If connection pooling still doesn't work, try the direct connection format:

```env
DATABASE_URL="postgresql://postgres:Fsm4561%2112@db.pmonzbwnmaydjxuobtwy.supabase.co:5432/postgres"
```

**Note:** For direct connection:
- Username is just `postgres` (no project ref)
- Port is `5432` (not 6543)
- Hostname is `db.pmonzbwnmaydjxuobtwy.supabase.co` (not pooler)

## Password Encoding

Your password `Fsm4561!12` is correctly encoded as `Fsm4561%2112` where:
- `!` → `%21`

This is correct and should work.

## Steps to Fix

1. **Open your `.env` file**

2. **Update the `DATABASE_URL` line** to include `?pgbouncer=true`:
   ```env
   DATABASE_URL="postgresql://postgres.pmonzbwnmaydjxuobtwy:Fsm4561%2112@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

3. **Save the file**

4. **Test the connection:**
   ```bash
   pnpm run db:test
   ```

5. **If it still fails, try direct connection:**
   ```env
   DATABASE_URL="postgresql://postgres:Fsm4561%2112@db.pmonzbwnmaydjxuobtwy.supabase.co:5432/postgres"
   ```

## Why This Matters

The `?pgbouncer=true` parameter tells Supabase's connection pooler how to handle the connection. Without it, authentication might fail even with correct credentials.

## Still Not Working?

If both formats fail:

1. **Verify the password in Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/pmonzbwnmaydjxuobtwy
   - Settings → Database
   - Check if you can see/reset the password

2. **Try without URL encoding** (just for testing):
   ```env
   DATABASE_URL="postgresql://postgres.pmonzbwnmaydjxuobtwy:Fsm4561!12@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

3. **Get a fresh connection string from Supabase:**
   - Dashboard → Settings → Database → Connection string
   - Copy the **exact** string they provide
   - Don't modify it, just paste it into `.env`

