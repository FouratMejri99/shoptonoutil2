import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function initializeAdmin() {
  let sql;
  try {
    // Create postgres connection
    sql = postgres(DATABASE_URL, { max: 1 });

    const email = 'weseily@solupedia.com';
    const password = 'Zuna9sK_4SoQ!sx#G';

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if admin already exists
    const existing = await sql`
      SELECT * FROM "adminCredentials" WHERE email = ${email}
    `;

    if (existing.length > 0) {
      console.log('✓ Admin credentials already exist for', email);
      await sql.end();
      process.exit(0);
    }

    // Insert admin credentials
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
