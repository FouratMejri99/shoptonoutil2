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
  
  // Test DNS resolution
  const dns = await import('dns/promises');
  try {
    await dns.lookup(hostname);
    console.log('✅ DNS resolution: OK');
  } catch (dnsError) {
    console.error('\n❌ DNS ERROR: Cannot resolve hostname:', hostname);
    console.error('This could mean:');
    console.error('  1. The Supabase project might be paused or deleted');
    console.error('  2. The project reference in the connection string is incorrect');
    console.error('  3. There is a network connectivity issue');
    console.error('\n💡 Solutions:');
    console.error('  1. Check your Supabase dashboard: https://supabase.com/dashboard');
    console.error('  2. Verify the project is active (not paused)');
    console.error('  3. Get a fresh connection string from: Settings → Database → Connection string');
    process.exit(1);
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
  
  if (error.message.includes('ENOTFOUND')) {
    console.error('\n💡 The hostname cannot be resolved. Please check:');
    console.error('  1. Is your Supabase project active? (not paused)');
    console.error('  2. Is the connection string correct?');
    console.error('  3. Try getting a fresh connection string from Supabase dashboard');
  } else if (error.message.includes('password') || error.message.includes('authentication')) {
    console.error('\n💡 Authentication failed. Please check:');
    console.error('  1. Is the database password correct?');
    console.error('  2. Try resetting the password in Supabase dashboard');
  } else if (error.message.includes('SSL')) {
    console.error('\n💡 SSL connection issue. The code should handle this automatically.');
  }
  
  process.exit(1);
}


