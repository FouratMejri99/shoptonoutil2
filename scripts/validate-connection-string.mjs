import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not set');
  process.exit(1);
}

console.log('🔍 Validating connection string format...\n');

try {
  const url = new URL(DATABASE_URL);
  const hostname = url.hostname;
  const username = url.username;
  const port = url.port;
  const hasPassword = url.password && url.password.length > 0;
  
  console.log('📋 Connection String Details:');
  console.log(`   Hostname: ${hostname}`);
  console.log(`   Username: ${username}`);
  console.log(`   Port: ${port || 'default'}`);
  console.log(`   Password: ${hasPassword ? '*** (set)' : '❌ MISSING'}`);
  
  // Check if it's connection pooling
  const isPooling = hostname.includes('pooler.supabase.com');
  const isDirect = hostname.includes('.supabase.co') && !hostname.includes('pooler');
  
  console.log(`\n🔗 Connection Type: ${isPooling ? 'Connection Pooling' : isDirect ? 'Direct Connection' : 'Unknown'}`);
  
  // Validate username format for connection pooling
  if (isPooling) {
    console.log('\n✅ Connection Pooling Detected');
    
    if (!username.includes('.')) {
      console.error('\n❌ ERROR: Invalid username format for connection pooling!');
      console.error('   Current username:', username);
      console.error('   Expected format: postgres.[PROJECT_REF]');
      console.error('\n💡 Fix:');
      console.error('   1. Go to Supabase Dashboard → Settings → Database');
      console.error('   2. Select "Session mode" connection string');
      console.error('   3. Copy the FULL connection string (it should have postgres.[PROJECT_REF] as username)');
      console.error('   4. Example: postgresql://postgres.pmonzbwnmaydjxuobtwy:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres');
      process.exit(1);
    }
    
    const projectRef = username.split('.')[1];
    console.log(`   Project Reference: ${projectRef}`);
    
    if (port && port !== '6543') {
      console.warn(`   ⚠️  Warning: Expected port 6543 for connection pooling, got ${port}`);
    }
    
    if (!url.searchParams.has('pgbouncer')) {
      console.warn('   ⚠️  Warning: Missing ?pgbouncer=true parameter (recommended)');
    }
  }
  
  // Validate username format for direct connection
  if (isDirect) {
    console.log('\n✅ Direct Connection Detected');
    
    if (username !== 'postgres') {
      console.warn(`   ⚠️  Warning: Expected username 'postgres' for direct connection, got '${username}'`);
    }
    
    if (port && port !== '5432') {
      console.warn(`   ⚠️  Warning: Expected port 5432 for direct connection, got ${port}`);
    }
  }
  
  // Check password
  if (!hasPassword) {
    console.error('\n❌ ERROR: Password is missing from connection string!');
    console.error('   Format: postgresql://username:PASSWORD@host:port/database');
    process.exit(1);
  }
  
  // Check for special characters that might need URL encoding
  const password = url.password;
  const needsEncoding = /[^a-zA-Z0-9\-_.~]/.test(password);
  if (needsEncoding) {
    console.warn('\n⚠️  Warning: Password contains special characters');
    console.warn('   Make sure special characters are URL-encoded in the connection string');
    console.warn('   Common characters that need encoding:');
    console.warn('     @ → %40');
    console.warn('     # → %23');
    console.warn('     $ → %24');
    console.warn('     % → %25');
    console.warn('     & → %26');
    console.warn('     + → %2B');
    console.warn('     = → %3D');
    console.warn('     ? → %3F');
    console.warn('     / → %2F');
    console.warn('     : → %3A');
    console.warn('     ; → %3B');
    console.warn('     , → %2C');
    console.warn('     ( → %28');
    console.warn('     ) → %29');
    console.warn('     [ → %5B');
    console.warn('     ] → %5D');
    console.warn('     { → %7B');
    console.warn('     } → %7D');
    console.warn('     | → %7C');
    console.warn('     \\ → %5C');
    console.warn('     ^ → %5E');
    console.warn('     ~ → %7E');
    console.warn('     ` → %60');
    console.warn('     ! → %21');
    console.warn('     * → %2A');
    console.warn('     " → %22');
    console.warn('     < → %3C');
    console.warn('     > → %3E');
    console.warn('     Space → %20');
  }
  
  console.log('\n✅ Connection string format is valid!');
  console.log('\n💡 Next steps:');
  console.log('   1. If password authentication fails, verify the password is correct');
  console.log('   2. Reset password in Supabase Dashboard if needed: Settings → Database → Reset database password');
  console.log('   3. Make sure to copy the FULL connection string from Supabase dashboard');
  console.log('   4. Run: pnpm run db:test');
  
} catch (error) {
  console.error('\n❌ ERROR: Invalid connection string format');
  console.error('   Error:', error.message);
  console.error('\n💡 Expected format:');
  console.error('   postgresql://username:password@host:port/database');
  console.error('\n💡 For Supabase connection pooling:');
  console.error('   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true');
  console.error('\n💡 For Supabase direct connection:');
  console.error('   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres');
  process.exit(1);
}


