export const DATABASE_SCHEMA_MD = `
# Database Schema (Cloudflare D1)

## Tables

### users

\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free',
  payment_status TEXT DEFAULT 'inactive',
  subscription_end DATE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);
CREATE INDEX idx_users_email ON users(email);
\`\`\`

### otp_codes

\`\`\`sql
CREATE TABLE otp_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);
CREATE INDEX idx_otp_email ON otp_codes(email);
\`\`\`

### usage_tracking

\`\`\`sql
CREATE TABLE usage_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tool_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  reset_date DATE NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, tool_name, reset_date)
);
\`\`\`

### payments

\`\`\`sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  tier TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  verified_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
\`\`\`

## Migrations

- Apply migrations sequentially with Wrangler CLI  
`;
