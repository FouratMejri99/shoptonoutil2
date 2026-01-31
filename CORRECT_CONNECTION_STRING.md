# Correct Connection String for Your Password

## Your Password
- **Original:** `Fsm4561!12`
- **URL-encoded:** `Fsm4561%2112` (the `!` becomes `%21`)

## Connection String Options

### Option 1: Connection Pooling (RECOMMENDED - Port 6543)

Use this in your `.env` file:

```env
DATABASE_URL="postgresql://postgres.pmonzbwnmaydjxuobtwy:Fsm4561%2112@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important:** 
- Username is `postgres.pmonzbwnmaydjxuobtwy` (with dot and project ref)
- Password is `Fsm4561%2112` (with `!` encoded as `%21`)
- Port is `6543` (connection pooling)

### Option 2: Direct Connection (Port 5432)

If you prefer direct connection:

```env
DATABASE_URL="postgresql://postgres:Fsm4561%2112@db.pmonzbwnmaydjxuobtwy.supabase.co:5432/postgres"
```

**Important:**
- Username is `postgres` (no project ref for direct connection)
- Password is `Fsm4561%2112` (with `!` encoded as `%21`)
- Port is `5432` (direct connection)

## Quick Steps

1. **Open your `.env` file**

2. **Update the `DATABASE_URL` line** with one of the options above

3. **Make sure:**
   - The password uses `%21` instead of `!`
   - For connection pooling: username is `postgres.pmonzbwnmaydjxuobtwy`
   - For direct connection: username is `postgres`

4. **Test the connection:**
   ```bash
   pnpm run db:test
   ```

## Why URL Encoding?

Special characters in passwords need to be URL-encoded when used in connection strings:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- And many others...

## Verify Your Connection String

Run this to check if your connection string format is correct:
```bash
pnpm run db:validate
```

## Still Having Issues?

1. **Double-check the password** - Make sure you copied it correctly from Supabase
2. **Reset the password** if needed:
   - Go to Supabase Dashboard → Settings → Database
   - Click "Reset database password"
   - Copy the new password and encode it
3. **Use connection pooling** (port 6543) - it's more reliable


