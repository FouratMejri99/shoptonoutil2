import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_da173308dd9000227242f677867027d4d20a93bb';

// Extract project reference from connection string
function extractProjectRef(connectionString) {
  try {
    const url = new URL(connectionString);
    const hostname = url.hostname;
    
    // Try to extract from db.PROJECT_REF.supabase.co format
    const directMatch = hostname.match(/^db\.([^.]+)\.supabase\.co$/);
    if (directMatch) {
      return directMatch[1];
    }
    
    // Try to extract from pooler format: aws-0-REGION.pooler.supabase.com
    // In this case, we need to check the username part: postgres.PROJECT_REF
    const username = url.username;
    const poolerMatch = username.match(/^postgres\.([^.]+)$/);
    if (poolerMatch) {
      return poolerMatch[1];
    }
    
    // Try to extract from postgres.PROJECT_REF format in username
    if (username.includes('.')) {
      return username.split('.')[1];
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function checkProjectStatus(projectRef) {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === 'sbp_da173308dd9000227242f677867027d4d20a93bb') {
    console.log('⚠️  Using default access token. For better results, set SUPABASE_ACCESS_TOKEN in .env');
  }
  
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      console.error(`❌ Project "${projectRef}" not found`);
      console.error('💡 This could mean:');
      console.error('   1. The project reference is incorrect');
      console.error('   2. You don\'t have access to this project');
      console.error('   3. The project was deleted');
      return false;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      if (response.status === 401) {
        console.error('💡 Invalid access token. Update SUPABASE_ACCESS_TOKEN in .env');
      }
      return false;
    }

    const project = await response.json();
    
    console.log('✅ Project found!');
    console.log(`   Name: ${project.name}`);
    console.log(`   Region: ${project.region}`);
    console.log(`   Status: ${project.status || 'active'}`);
    console.log(`   Project URL: ${project.project_url || `https://${projectRef}.supabase.co`}`);
    
    // Check if project is paused
    if (project.status === 'INACTIVE' || project.status === 'PAUSED' || project.pausedAt) {
      console.error('\n⚠️  PROJECT IS PAUSED!');
      console.error('💡 To fix this:');
      console.error('   1. Go to: https://supabase.com/dashboard');
      console.error(`   2. Find project "${project.name}"`);
      console.error('   3. Click "Restore project" or "Resume"');
      console.error('   4. Wait a few minutes for it to become active');
      console.error('   5. Try the connection test again');
      return false;
    }
    
    console.log('\n✅ Project is active and ready to accept connections!');
    return true;
    
  } catch (error) {
    console.error('❌ Error checking project status:', error.message);
    console.error('💡 This might be a network issue or invalid access token');
    return false;
  }
}

async function main() {
  console.log('🔍 Checking Supabase project status...\n');
  
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.error('Please set DATABASE_URL in your .env file');
    process.exit(1);
  }
  
  // Extract project reference
  const projectRef = extractProjectRef(DATABASE_URL);
  
  if (!projectRef) {
    console.error('❌ Could not extract project reference from DATABASE_URL');
    console.error('Current connection string format:', DATABASE_URL.substring(0, 50) + '...');
    console.error('\n💡 Expected formats:');
    console.error('   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres');
    console.error('   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres');
    process.exit(1);
  }
  
  console.log(`📋 Project Reference: ${projectRef}`);
  console.log(`🌐 Hostname: ${new URL(DATABASE_URL).hostname}\n`);
  
  const isActive = await checkProjectStatus(projectRef);
  
  if (!isActive) {
    console.log('\n💡 Next steps:');
    console.log('   1. Verify project status in Supabase dashboard');
    console.log('   2. Get a fresh connection string from: Settings → Database → Connection string');
    console.log('   3. Update DATABASE_URL in .env file');
    console.log('   4. Run: pnpm run db:test');
    process.exit(1);
  }
  
  console.log('\n💡 If you still get DNS errors (Windows DNS cache issue):');
  console.log('   1. Flush DNS cache: ipconfig /flushdns (run as Administrator)');
  console.log('   2. Use connection pooling (port 6543) - more reliable');
  console.log('   3. Get connection string from: Settings → Database → Session mode');
  console.log('   4. See WINDOWS_DNS_FIX.md for detailed troubleshooting');
}

main().catch(console.error);

