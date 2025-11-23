-- Migration 0005: Add language preference to users table
-- Supports Vietnamese (vi) and English (en)
ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'vi';

-- Create index for language queries
CREATE INDEX idx_users_language ON users(language);
