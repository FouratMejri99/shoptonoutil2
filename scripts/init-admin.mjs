import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function initializeAdmin() {
  let sql;
  try {
    sql = postgres(DATABASE_URL, { 
      max: 1,
      ssl: DATABASE_URL.includes('supabase.co') || DATABASE_URL.includes('pooler.supabase.com') ? 'require' : false
    });

    const email = process.env.ADMIN_EMAIL || 'weseily@solupedia.com';
    const password = process.env.ADMIN_PASSWORD || 'Zuna9sK_4SoQ!sx#G';

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const existing = await sql`
      SELECT * FROM "adminCredentials" WHERE email = ${email}
    `;

    if (existing.length > 0) {
      console.log('✓ Admin credentials already exist for', email);
      await sql.end();
      process.exit(0);
    }

    await sql`
      INSERT INTO "adminCredentials" (email, "passwordHash", "isActive", "createdAt", "updatedAt") 
      VALUES (${email}, ${passwordHash}, true, NOW(), NOW())
    `;

    console.log('✓ Admin credentials initialized successfully');
    console.log('Email:', email);
    console.log('Password: (hashed and stored securely)');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize admin credentials:', error);
    if (sql) await sql.end();
    process.exit(1);
  }
}

initializeAdmin();
