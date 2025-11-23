-- Migration 0001: Create users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free',
  payment_status TEXT DEFAULT 'inactive',
  created_at INTEGER NOT NULL
);

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);
