import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DB_URI,
});

// Define table schemas for db
const userSchema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tokens_used INTEGER DEFAULT 0,
  tokens_reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const sessions = `
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const messageSchema = `
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sessions_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Run migration to create tables in db
async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(userSchema);
    await client.query(sessions);
    await client.query(messageSchema);
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
