# Fix DNS Error: Cannot Resolve Hostname

## The Problem

The error `ENOTFOUND db.xbxwjmqmowypokicazor.supabase.co` means your computer cannot find this hostname. This usually happens when:

1. **Supabase project is paused** (most common)
2. **Wrong project reference** in connection string
3. **Connection string format is incorrect**

## Solution Steps

### Step 1: Check Supabase Project Status

1. Go to: https://supabase.com/dashboard
2. Look for your project `xbxwjmqmowypokicazor`
3. **Check if it shows "Paused"** - this is the #1 cause!

**If Paused:**
- Click on the project
- Click **"Restore project"** or **"Resume"**
- Wait a few minutes for it to become active
- Try the connection test again

**If Project Doesn't Exist:**
- The project reference `xbxwjmqmowypokicazor` might be wrong
- Check your Supabase dashboard for the correct project reference

### Step 2: Get Fresh Connection String

Even if the project is active, get a fresh connection string:

1. In Supabase Dashboard → Your Project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **"Connection string"** section
4. You'll see multiple options:

#### Option A: Direct Connection (Port 5432)
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Option B: Connection Pooling (Port 6543) - **RECOMMENDED**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important:** Use the **Session mode** connection string (port 6543) for better reliability!

### Step 3: Update Your .env File

Replace your current `DATABASE_URL` with the fresh connection string:

```env
# Option 1: Direct connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"

# Option 2: Connection pooling (RECOMMENDED)
DATABASE_URL="postgresql://postgres.xbxwjmqmowypokicazor:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Note:** 
- Replace `YOUR_PASSWORD` with your actual database password
- Replace `us-east-1` with your actual region (check in Supabase dashboard)
- Make sure there are no extra spaces

### Step 4: Test Again

```bash
pnpm run db:test
```

### Step 5: If Still Failing - Alternative Connection String Format

Sometimes Supabase uses a different format. Try this:

1. In Supabase Dashboard → Settings → Database
2. Look for **"Connection pooling"** section
3. Use the **"Session mode"** connection string
4. It might look like:
   ```
   postgresql://postgres.xbxwjmqmowypokicazor:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## Quick Checklist

- [ ] Project is **NOT paused** in Supabase dashboard
- [ ] Got **fresh connection string** from Supabase dashboard
- [ ] Using correct **password** (reset if needed)
- [ ] Connection string has **no extra spaces** or quotes
- [ ] Tried **connection pooling** format (port 6543)
- [ ] Ran `pnpm run db:test` again

## Still Not Working?

1. **Verify Project Reference:**
   - In Supabase dashboard, check the project URL
   - It should match: `https://xbxwjmqmowypokicazor.supabase.co`
   - If different, use that project reference in connection string

2. **Check Network:**
   - Try accessing: https://xbxwjmqmowypokicazor.supabase.co
   - If this doesn't load, the project might be deleted or paused

3. **Create New Project (if needed):**
   - If project doesn't exist, create a new one
   - Get the connection string from the new project
   - Update your `.env` file

## Common Mistakes

❌ **Wrong:** `DATABASE_URL='https://xbxwjmqmowypokicazor.supabase.co'`  
✅ **Correct:** `DATABASE_URL="postgresql://postgres:PASSWORD@db.xbxwjmqmowypokicazor.supabase.co:5432/postgres"`

❌ **Wrong:** Missing password or using wrong password  
✅ **Correct:** Use the actual database password from Supabase

❌ **Wrong:** Project is paused  
✅ **Correct:** Resume the project in Supabase dashboard




