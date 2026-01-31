import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  console.error('\nPlease set DATABASE_URL in your .env file');
  process.exit(1);
}

console.log('🔍 Testing database connection...');
console.log('📋 Connection string format:', DATABASE_URL.substring(0, 30) + '...');

// Validate format
if (!DATABASE_URL.startsWith('postgresql://') && !DATABASE_URL.startsWith('postgres://')) {
  console.error('\n❌ ERROR: Invalid DATABASE_URL format');
  console.error('Expected format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres');
  console.error('\nCurrent value:', DATABASE_URL);
  process.exit(1);
}

// Extract hostname for testing
try {
  const url = new URL(DATABASE_URL);
  const hostname = url.hostname;
  console.log('🌐 Hostname:', hostname);
  
  // Test DNS resolution (non-blocking - we'll try connection anyway)
  const dns = await import('dns/promises');
  let dnsResolved = false;
  try {
    await dns.lookup(hostname);
    console.log('✅ DNS resolution: OK');
    dnsResolved = true;
  } catch (dnsError) {
    console.warn('\n⚠️  DNS WARNING: Cannot resolve hostname:', hostname);
    console.warn('   This is often a Windows DNS cache issue.');
    console.warn('   Attempting connection anyway (the connection might still work)...\n');
    dnsResolved = false;
  }
} catch (urlError) {
  console.error('\n❌ ERROR: Invalid connection string URL format');
  console.error('Error:', urlError.message);
  process.exit(1);
}

// Test database connection
try {
  console.log('\n🔌 Attempting to connect to database...');
  const sql = postgres(DATABASE_URL, { 
    max: 1,
    ssl: DATABASE_URL.includes('supabase.co') ? 'require' : false,
    connect_timeout: 10
  });
  
  const result = await sql`SELECT version() as version, current_database() as database`;
  console.log('✅ Connection successful!');
  console.log('📊 Database:', result[0].database);
  console.log('🔧 PostgreSQL version:', result[0].version.split(' ')[0] + ' ' + result[0].version.split(' ')[1]);
  
  await sql.end();
  console.log('\n🎉 All checks passed! Your database connection is working.');
} catch (error) {
  console.error('\n❌ CONNECTION ERROR:', error.message);
  
  if (error.message.includes('ENOTFOUND') || error.code === 'ENOTFOUND') {
    console.error('\n💡 DNS Resolution Failed - Windows DNS Cache Issue');
    console.error('\n🔧 Try these solutions:');
    console.error('\n1. Flush Windows DNS Cache (Run as Administrator):');
    console.error('   ipconfig /flushdns');
    console.error('\n2. Use Connection Pooling (Recommended):');
    console.error('   Get connection string from Supabase Dashboard → Settings → Database');
    console.error('   Use "Session mode" (port 6543) instead of direct connection (port 5432)');
    console.error('   Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true');
    console.error('\n3. Check Project Status:');
    console.error('   Run: pnpm run db:check-status');
    console.error('   (Your project is ACTIVE_HEALTHY, so this is a local DNS issue)');
    console.error('\n4. Try Different DNS Server:');
    console.error('   - Use Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)');
    console.error('   - Or wait a few minutes and try again');
  } else if (error.message.includes('password') || error.message.includes('authentication')) {
    console.error('\n💡 Authentication failed. Please check:');
    
    // Check if using connection pooling
    const url = new URL(DATABASE_URL);
    const isPooling = url.hostname.includes('pooler.supabase.com');
    const username = url.username;
    
    if (isPooling && !username.includes('.')) {
      console.error('\n❌ CRITICAL: Wrong username format for connection pooling!');
      console.error(`   Current username: ${username}`);
      console.error('   Expected format: postgres.[PROJECT_REF]');
      console.error('   Example: postgres.pmonzbwnmaydjxuobtwy');
      console.error('\n🔧 Fix:');
      console.error('   1. Go to Supabase Dashboard → Settings → Database');
      console.error('   2. Select "Session mode" (connection pooling)');
      console.error('   3. Copy the COMPLETE connection string');
      console.error('   4. It should start with: postgresql://postgres.[PROJECT_REF]:...');
      console.error('   5. Update DATABASE_URL in .env file');
    } else {
      console.error('  1. Is the database password correct?');
      console.error('  2. Try resetting the password in Supabase dashboard:');
      console.error('     Settings → Database → Reset database password');
      console.error('  3. Make sure special characters in password are URL-encoded');
      console.error('  4. Run: pnpm run db:validate (to check connection string format)');
    }
  } else if (error.message.includes('SSL')) {
    console.error('\n💡 SSL connection issue. The code should handle this automatically.');
  } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
    console.error('\n💡 Connection timeout. This might be a network/firewall issue.');
    console.error('   Try using connection pooling (port 6543) instead.');
  }
  
  process.exit(1);
}





