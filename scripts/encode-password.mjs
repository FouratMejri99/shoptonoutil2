import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get password from command line argument or use the provided one
const password = process.argv[2] || 'Fsm4561!12';

console.log('🔐 Password Encoding Helper\n');
console.log('Original password:', password);
console.log('');

// URL encode the password
const encoded = encodeURIComponent(password);
console.log('✅ URL-encoded password:', encoded);
console.log('   (Use this in your connection string, not the original password)');
console.log('');

// Show the mapping
const specialChars = {
  '!': '%21',
  '@': '%40',
  '#': '%23',
  '$': '%24',
  '%': '%25',
  '&': '%26',
  '+': '%2B',
  '=': '%3D',
  '?': '%3F',
  '/': '%2F',
  ':': '%3A',
  ';': '%3B',
  ',': '%2C',
  '(': '%28',
  ')': '%29',
  '[': '%5B',
  ']': '%5D',
  '{': '%7B',
  '}': '%7D',
  '|': '%7C',
  '\\': '%5C',
  '^': '%5E',
  '~': '%7E',
  '`': '%60',
  '*': '%2A',
  '"': '%22',
  '<': '%3C',
  '>': '%3E',
  ' ': '%20'
};

console.log('Character mapping in your password:');
let hasSpecial = false;
for (const char of password) {
  if (specialChars[char]) {
    console.log(`   ${char} → ${specialChars[char]}`);
    hasSpecial = true;
  }
}

if (!hasSpecial) {
  console.log('   (No special characters that need encoding)');
}

console.log('');
console.log('📝 Example connection string format:');
console.log('');
console.log('For Connection Pooling (Recommended):');
console.log(`postgresql://postgres.pmonzbwnmaydjxuobtwy:${encoded}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`);
console.log('');
console.log('For Direct Connection:');
console.log(`postgresql://postgres:${encoded}@db.pmonzbwnmaydjxuobtwy.supabase.co:5432/postgres`);
console.log('');
console.log('💡 Copy the connection string above and update your .env file');
console.log('   Make sure to replace [PROJECT_REF] and [REGION] if needed');

