import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const PROJECT_REF = 'xbxwjmqmowypokicazor';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_da173308dd9000227242f677867027d4d20a93bb';

console.log('🔍 Getting Supabase connection string...\n');

// Try to get connection string from Supabase API
try {
  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}`, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const project = await response.json();
  
  console.log('✅ Project found:', project.name);
  console.log('📊 Region:', project.region);
  console.log('🔗 Project URL:', project.project_url);
  
  // Get database password - we need to prompt user or get from settings
  console.log('\n📝 To get your connection string:');
  console.log('1. Go to: https://supabase.com/dashboard/project/' + PROJECT_REF);
  console.log('2. Navigate to: Settings → Database');
  console.log('3. Scroll to "Connection string" section');
  console.log('4. Copy the connection string from "URI" tab');
  console.log('\n💡 Connection string format:');
  console.log('   postgresql://postgres:[PASSWORD]@db.' + PROJECT_REF + '.supabase.co:5432/postgres');
  console.log('\n   OR (recommended - connection pooling):');
  console.log('   postgresql://postgres.' + PROJECT_REF + ':[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Alternative: Get connection string manually');
  console.log('1. Visit: https://supabase.com/dashboard/project/' + PROJECT_REF);
  console.log('2. Go to Settings → Database');
  console.log('3. Copy connection string from "Connection string" → "URI" tab');
}







