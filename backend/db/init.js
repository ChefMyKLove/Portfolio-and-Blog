const { pool } = require('./db');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database...');

    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        patreon_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        is_patron BOOLEAN DEFAULT false,
        access_token TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createTableQuery);
    console.log('✅ Users table created successfully');

    // Create index on patreon_id for faster lookups
    await pool.query('CREATE INDEX IF NOT EXISTS idx_patreon_id ON users(patreon_id);');
    console.log('✅ Index created on patreon_id');

    // Create blog_posts table for future use
    const createPostsTableQuery = `
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT,
        excerpt VARCHAR(1000),
        author_id INTEGER REFERENCES users(id),
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createPostsTableQuery);
    console.log('✅ Blog posts table created successfully');

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
