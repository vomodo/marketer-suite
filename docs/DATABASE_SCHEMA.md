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
  language TEXT DEFAULT 'vi',
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_language ON users(language);
\`\`\`

**New in v1.1**: Added `language` column to support bilingual interface (Vietnamese/English)

**Columns**:
- `id`: Auto-incrementing primary key
- `email`: Unique user email
- `tier`: User tier ('free' or 'pro')
- `payment_status`: Payment status ('inactive' or 'active')
- `subscription_end`: End date of subscription (for pro tier)
- `language`: User's preferred language ('vi' or 'en') - **NEW**
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

---

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

**Usage**: Stores OTP codes for email authentication

**Columns**:
- `id`: Auto-incrementing primary key
- `email`: Email address for OTP
- `code`: 6-digit OTP code
- `expires_at`: Expiration timestamp (5 minutes from creation)
- `created_at`: Creation timestamp

---

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

**Usage**: Tracks tool usage for rate limiting

**Columns**:
- `id`: Auto-incrementing primary key
- `user_id`: Reference to users table
- `tool_name`: Name of the tool used
- `usage_count`: Number of times used
- `reset_date`: Date when usage resets (monthly)
- `created_at`: Creation timestamp

**Constraints**: Unique combination of (user_id, tool_name, reset_date)

---

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

**Usage**: Tracks payment transactions

**Columns**:
- `id`: Auto-incrementing primary key
- `user_id`: Reference to users table
- `amount`: Payment amount (VND)
- `tier`: Tier purchased ('pro')
- `transaction_id`: Unique CASSO transaction ID
- `status`: Payment status ('pending', 'verified', 'failed')
- `verified_at`: Verification timestamp
- `created_at`: Creation timestamp

---

## Migrations

### Migration Files

1. **0001_create_users.sql**: Initial users table
2. **0002_create_otp_codes.sql**: OTP codes table
3. **0003_create_usage_tracking.sql**: Usage tracking table
4. **0004_create_payments.sql**: Payments table
5. **0005_add_user_language.sql**: Add language column to users - **NEW**

### Applying Migrations

**Local Development**:
\`\`\`bash
# Create local D1 database
wrangler d1 create marketer-suite-dev

# Apply migrations
wrangler d1 execute marketer-suite-dev --file=migrations/0001_create_users.sql
wrangler d1 execute marketer-suite-dev --file=migrations/0002_create_otp_codes.sql
wrangler d1 execute marketer-suite-dev --file=migrations/0003_create_usage_tracking.sql
wrangler d1 execute marketer-suite-dev --file=migrations/0004_create_payments.sql
wrangler d1 execute marketer-suite-dev --file=migrations/0005_add_user_language.sql
\`\`\`

**Production**:
\`\`\`bash
# Create production database
wrangler d1 create marketer-suite-prod

# Apply migrations
wrangler d1 execute marketer-suite-prod --file=migrations/0001_create_users.sql --remote
wrangler d1 execute marketer-suite-prod --file=migrations/0002_create_otp_codes.sql --remote
wrangler d1 execute marketer-suite-prod --file=migrations/0003_create_usage_tracking.sql --remote
wrangler d1 execute marketer-suite-prod --file=migrations/0004_create_payments.sql --remote
wrangler d1 execute marketer-suite-prod --file=migrations/0005_add_user_language.sql --remote
\`\`\`

---

## Database Queries Examples

### User Management

**Create user with language preference**:
\`\`\`sql
INSERT INTO users (email, tier, language, created_at)
VALUES ('user@example.com', 'free', 'vi', strftime('%s', 'now') * 1000);
\`\`\`

**Update user language**:
\`\`\`sql
UPDATE users 
SET language = 'en', updated_at = strftime('%s', 'now') * 1000
WHERE email = 'user@example.com';
\`\`\`

**Get user with language preference**:
\`\`\`sql
SELECT id, email, tier, language, payment_status
FROM users
WHERE email = 'user@example.com';
\`\`\`

### OTP Management

**Create OTP**:
\`\`\`sql
INSERT INTO otp_codes (email, code, expires_at)
VALUES (
  'user@example.com',
  '123456',
  strftime('%s', 'now') * 1000 + 300000  -- 5 minutes from now
);
\`\`\`

**Verify OTP**:
\`\`\`sql
SELECT *
FROM otp_codes
WHERE email = 'user@example.com'
  AND code = '123456'
  AND expires_at > strftime('%s', 'now') * 1000
ORDER BY created_at DESC
LIMIT 1;
\`\`\`

### Usage Tracking

**Track tool usage**:
\`\`\`sql
INSERT INTO usage_tracking (user_id, tool_name, reset_date)
VALUES (1, 'keyword_research', date('now', 'start of month'))
ON CONFLICT(user_id, tool_name, reset_date)
DO UPDATE SET usage_count = usage_count + 1;
\`\`\`

**Check usage limits**:
\`\`\`sql
SELECT usage_count
FROM usage_tracking
WHERE user_id = 1
  AND tool_name = 'keyword_research'
  AND reset_date = date('now', 'start of month');
\`\`\`

### Language Statistics

**Get language distribution**:
\`\`\`sql
SELECT 
  language,
  COUNT(*) as user_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
FROM users
GROUP BY language;
\`\`\`

---

## Performance Optimization

### Indexes

- `idx_users_email`: Fast user lookup by email
- `idx_users_language`: Fast filtering by language preference - **NEW**
- `idx_otp_email`: Fast OTP lookup by email

### Query Best Practices

1. **Use prepared statements** to prevent SQL injection
2. **Use indexes** for WHERE clauses
3. **Limit result sets** with LIMIT clause
4. **Clean up old data** regularly:
   - Delete expired OTP codes (older than 1 hour)
   - Archive old usage_tracking records (older than 12 months)

---

## Data Retention Policy

| Table | Retention | Cleanup Strategy |
|-------|-----------|------------------|
| users | Permanent | None |
| otp_codes | 1 hour | Auto-delete expired |
| usage_tracking | 12 months | Archive old data |
| payments | Permanent | None |

---

## Changelog

### v1.1.0 (2025-11-23)
- ✨ Added `language` column to `users` table
- ✨ Added index on `language` column
- ✨ Migration 0005 for language support

### v1.0.0 (2025-11-01)
- 🎉 Initial schema
- ✅ Users, OTP, Usage tracking, Payments tables

---

For more information, see:
- [Architecture Overview](./ARCHITECTURE.md)
- [I18N Implementation](./I18N_IMPLEMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
`;
