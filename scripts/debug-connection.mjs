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

console.log('🔍 Debugging Connection String\n');

try {
  const url = new URL(DATABASE_URL);
  
  console.log('📋 Parsed Connection String:');
  console.log(`   Protocol: ${url.protocol}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Password: ${url.password ? '***' + url.password.slice(-2) : 'MISSING'}`);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port || 'default'}`);
  console.log(`   Database: ${url.pathname.replace('/', '')}`);
  console.log(`   Query: ${url.search || 'none'}`);
  
  const isPooling = url.hostname.includes('pooler.supabase.com');
  const isDirect = url.hostname.includes('.supabase.co') && !url.hostname.includes('pooler');
  
  console.log(`\n🔗 Connection Type: ${isPooling ? 'Connection Pooling' : isDirect ? 'Direct Connection' : 'Unknown'}`);
  
  // Check username format
  console.log('\n✅ Username Check:');
  if (isPooling) {
    if (url.username.includes('.')) {
      const parts = url.username.split('.');
      if (parts[0] === 'postgres' && parts[1]) {
        console.log(`   ✅ Correct format: postgres.[PROJECT_REF]`);
        console.log(`   Project Reference: ${parts[1]}`);
      } else {
        console.error(`   ❌ Wrong format! Expected: postgres.[PROJECT_REF]`);
        console.error(`   Current: ${url.username}`);
      }
    } else {
      console.error(`   ❌ WRONG! For connection pooling, username must be: postgres.[PROJECT_REF]`);
      console.error(`   Current username: ${url.username}`);
      console.error(`   Should be: postgres.pmonzbwnmaydjxuobtwy`);
      console.error(`\n💡 This is likely why authentication is failing!`);
    }
  } else if (isDirect) {
    if (url.username === 'postgres') {
      console.log(`   ✅ Correct format: postgres`);
    } else {
      console.error(`   ❌ Wrong format! Expected: postgres`);
      console.error(`   Current: ${url.username}`);
    }
  }
  
  // Check password
  console.log('\n🔐 Password Check:');
  if (!url.password || url.password.length === 0) {
    console.error('   ❌ Password is missing!');
  } else {
    console.log(`   ✅ Password is set (length: ${url.password.length} characters)`);
    
    // Check for special characters that might need encoding
    const specialChars = /[!@#$%^&*()+=\[\]{};':"\\|,.<>?\/\s]/;
    if (specialChars.test(url.password)) {
      console.log(`   ⚠️  Password contains special characters`);
      console.log(`   Original password: ${url.password}`);
      const encoded = encodeURIComponent(url.password);
      if (encoded !== url.password) {
        console.log(`   URL-encoded would be: ${encoded}`);
        console.log(`   💡 If authentication fails, try using the encoded version`);
      }
    }
  }
  
  // Check for common issues
  console.log('\n🔍 Common Issues Check:');
  let hasIssues = false;
  
  // Check for pgbouncer parameter
  if (isPooling && !url.searchParams.has('pgbouncer')) {
    console.error('   ❌ MISSING: ?pgbouncer=true parameter!');
    console.error('   This is REQUIRED for connection pooling authentication!');
    console.error('   Add ?pgbouncer=true to the end of your connection string');
    hasIssues = true;
  }
  
  // Check for quotes in the connection string
  if (DATABASE_URL.includes("'") || DATABASE_URL.includes('"')) {
    console.error('   ❌ Connection string contains quotes - remove them!');
    console.error('   In .env file, it should be: DATABASE_URL="..." (no extra quotes inside)');
    hasIssues = true;
  }
  
  // Check for spaces
  if (DATABASE_URL.includes(' ')) {
    console.error('   ❌ Connection string contains spaces - remove them!');
    hasIssues = true;
  }
  
  // Check port
  if (isPooling && url.port && url.port !== '6543') {
    console.warn(`   ⚠️  Connection pooling should use port 6543, got ${url.port}`);
  }
  if (isDirect && url.port && url.port !== '5432') {
    console.warn(`   ⚠️  Direct connection should use port 5432, got ${url.port}`);
  }
  
  if (!hasIssues) {
    console.log('   ✅ No obvious formatting issues found');
  }
  
  // Show what the connection string should look like
  console.log('\n📝 Expected Format:');
  if (isPooling) {
    console.log('   postgresql://postgres.pmonzbwnmaydjxuobtwy:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
  } else if (isDirect) {
    console.log('   postgresql://postgres:[PASSWORD]@db.pmonzbwnmaydjxuobtwy.supabase.co:5432/postgres');
  }
  
  console.log('\n💡 If password is correct but auth still fails:');
  console.log('   1. Verify username format matches the connection type');
  console.log('   2. Check for hidden characters or encoding issues');
  console.log('   3. Try resetting the password in Supabase dashboard');
  console.log('   4. Make sure .env file has no extra quotes or spaces');
  
} catch (error) {
  console.error('\n❌ ERROR parsing connection string:', error.message);
  console.error('\nCurrent DATABASE_URL (first 50 chars):', DATABASE_URL.substring(0, 50) + '...');
  console.error('\n💡 Check your .env file format');
}

