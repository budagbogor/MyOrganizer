require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  const client = await pool.connect();
  try {
    console.log('🔌 Connected to NeonDB');
    console.log('📦 Creating tables...');

    await client.query(`
      -- User profile
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT '',
        role VARCHAR(255) DEFAULT '',
        initial VARCHAR(5) DEFAULT 'U',
        color VARCHAR(50) DEFAULT 'gold',
        theme VARCHAR(10) DEFAULT 'dark',
        links JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Work tasks
      CREATE TABLE IF NOT EXISTS work (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        priority VARCHAR(20) DEFAULT 'sedang',
        status VARCHAR(20) DEFAULT 'todo',
        due DATE,
        notes TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Business items
      CREATE TABLE IF NOT EXISTS business (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT '',
        status VARCHAR(50) DEFAULT 'aktif',
        notes TEXT DEFAULT '',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Sales pipeline
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        company VARCHAR(255) DEFAULT '',
        contact VARCHAR(255) DEFAULT '',
        stage VARCHAR(50) DEFAULT 'lead',
        value BIGINT DEFAULT 0,
        probability INTEGER DEFAULT 0,
        close_date DATE,
        next_step TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Family members
      CREATE TABLE IF NOT EXISTS family (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT '',
        relation VARCHAR(100) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        birthday DATE,
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Calendar events
      CREATE TABLE IF NOT EXISTS calendar (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        date DATE NOT NULL,
        type VARCHAR(50) DEFAULT 'pribadi',
        priority VARCHAR(20) DEFAULT 'normal',
        reminder BOOLEAN DEFAULT false,
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Contacts
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) DEFAULT '',
        company VARCHAR(255) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        tag VARCHAR(50) DEFAULT '',
        notes TEXT DEFAULT '',
        last_contact DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Credentials (encrypted)
      CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service VARCHAR(255) NOT NULL,
        username VARCHAR(255) DEFAULT '',
        password_enc TEXT DEFAULT '',
        password_iv TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        category VARCHAR(100) DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Important data
      CREATE TABLE IF NOT EXISTS data_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        value TEXT DEFAULT '',
        category VARCHAR(100) DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Plans
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        phase VARCHAR(100) DEFAULT '',
        status VARCHAR(50) DEFAULT 'planning',
        priority VARCHAR(20) DEFAULT 'sedang',
        details TEXT DEFAULT '',
        milestones TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Notes
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT DEFAULT '',
        pinned BOOLEAN DEFAULT false,
        color VARCHAR(50) DEFAULT 'gold',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✅ All tables created successfully!');

    // Check if default user exists
    const userCheck = await client.query('SELECT id FROM users LIMIT 1');
    if (userCheck.rows.length === 0) {
      console.log('👤 Creating default user...');
      await client.query(`
        INSERT INTO users (name, role, initial, color, theme)
        VALUES ('User', 'Personal', 'U', 'gold', 'dark')
      `);
      console.log('✅ Default user created');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('Tables: users, work, business, sales, family, calendar, contacts, credentials, data_items, plans, notes');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
