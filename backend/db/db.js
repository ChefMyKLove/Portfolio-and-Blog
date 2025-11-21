const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/chefmyklove_blog'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Save or update user
const saveUser = async (userData) => {
  const { patreon_id, email, first_name, last_name, is_patron, access_token } = userData;
  
  try {
    const query = `
      INSERT INTO users (patreon_id, email, first_name, last_name, is_patron, access_token, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (patreon_id) 
      DO UPDATE SET 
        email = $2,
        first_name = $3,
        last_name = $4,
        is_patron = $5,
        access_token = $6,
        updated_at = NOW()
      RETURNING *;
    `;
    
    const result = await pool.query(query, [patreon_id, email, first_name, last_name, is_patron, access_token]);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// Get user by Patreon ID
const getUser = async (patreonId) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE patreon_id = $1', [patreonId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Get all patrons
const getPatrons = async () => {
  try {
    const result = await pool.query('SELECT patreon_id, email, first_name, last_name FROM users WHERE is_patron = true');
    return result.rows;
  } catch (error) {
    console.error('Error getting patrons:', error);
    throw error;
  }
};

module.exports = {
  pool,
  saveUser,
  getUser,
  getPatrons
};
