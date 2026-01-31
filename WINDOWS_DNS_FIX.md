# Fixing DNS Resolution Issues on Windows

## The Problem

Your Supabase project is **ACTIVE_HEALTHY**, but Windows cannot resolve the hostname `db.pmonzbwnmaydjxuobtwy.supabase.co`. This is a **local Windows DNS cache issue**, not a Supabase problem.

## Quick Fixes (Try in Order)

### Solution 1: Flush DNS Cache (Easiest)

1. **Open Command Prompt as Administrator:**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Or search for "cmd" → Right-click → "Run as administrator"

2. **Flush DNS cache:**
   ```cmd
   ipconfig /flushdns
   ```

3. **Try the connection test again:**
   ```bash
   pnpm run db:test
   ```

### Solution 2: Use Connection Pooling (Recommended)

Connection pooling often works better with DNS issues. Get the connection pooling string from Supabase:

1. Go to: https://supabase.com/dashboard/project/pmonzbwnmaydjxuobtwy
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Select **Session mode** (port 6543)
5. Copy the connection string - it should look like:
   ```
   postgresql://postgres.pmonzbwnmaydjxuobtwy:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

6. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres.pmonzbwnmaydjxuobtwy:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

7. Test again:
   ```bash
   pnpm run db:test
   ```

### Solution 3: Change DNS Server

If flushing DNS doesn't work, try using a different DNS server:

1. **Open Network Settings:**
   - Press `Win + I` → **Network & Internet** → **Advanced network settings** → **More network adapter options**
   - Or: Control Panel → Network and Sharing Center → Change adapter settings

2. **Right-click your active network adapter** → **Properties**

3. **Select "Internet Protocol Version 4 (TCP/IPv4)"** → **Properties**

4. **Select "Use the following DNS server addresses":**
   - Preferred: `8.8.8.8` (Google DNS)
   - Alternate: `8.8.4.4` (Google DNS)
   - Or use: `1.1.1.1` and `1.0.0.1` (Cloudflare DNS)

5. Click **OK** and restart your computer

6. Try the connection test again

### Solution 4: Wait and Retry

Sometimes DNS propagation takes a few minutes. Wait 5-10 minutes and try again.

### Solution 5: Use Hosts File (Advanced)

If nothing else works, you can manually map the hostname:

1. **Find the IP address** of your Supabase database (you may need to contact Supabase support or use `nslookup` from another machine)

2. **Edit hosts file:**
   - Open Notepad as Administrator
   - Open file: `C:\Windows\System32\drivers\etc\hosts`
   - Add line: `[IP_ADDRESS] db.pmonzbwnmaydjxuobtwy.supabase.co`
   - Save and close

**Note:** This is not recommended as IP addresses can change.

## Verify Project Status

Your project is confirmed active:
```bash
pnpm run db:check-status
```

This shows: `Status: ACTIVE_HEALTHY` ✅

## Why This Happens

- Windows DNS cache can become stale
- Some corporate networks block certain DNS queries
- DNS servers may have propagation delays
- Windows firewall or antivirus might interfere

## Connection Pooling vs Direct Connection

**Direct Connection (Port 5432):**
- `db.pmonzbwnmaydjxuobtwy.supabase.co:5432`
- More likely to have DNS issues
- Direct database connection

**Connection Pooling (Port 6543) - RECOMMENDED:**
- `aws-0-eu-west-1.pooler.supabase.com:6543`
- Better DNS resolution
- More reliable connections
- Better for production

## Still Not Working?

1. **Check Windows Firewall:**
   - Make sure it's not blocking the connection
   - Try temporarily disabling to test

2. **Check Antivirus:**
   - Some antivirus software blocks DNS queries
   - Try temporarily disabling to test

3. **Try from another network:**
   - Test from mobile hotspot
   - This will tell you if it's network-specific

4. **Contact Supabase Support:**
   - If project is active but DNS never resolves
   - They can check if there's an issue on their end

## Success Indicators

When it works, you'll see:
```
✅ DNS resolution: OK
✅ Connection successful!
📊 Database: postgres
🔧 PostgreSQL version: PostgreSQL 15.x
🎉 All checks passed! Your database connection is working.
```

