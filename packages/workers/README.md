# Marketer Suite Workers API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI (installed via npm)

### Installation

```bash
cd packages/workers
npm install
```

### Setup Development Environment

1. **Create `.dev.vars` file** (for local secrets):

```bash
# packages/workers/.dev.vars
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
N8N_WEBHOOK_URL=https://n8n.ducvu.vn/webhook/microtools-email-otp
TURNSTILE_SECRET=your-turnstile-secret
CASSO_API_KEY=your-casso-api-key
CASSO_WEBHOOK_SECRET=your-casso-webhook-secret
```

2. **Run database migrations**:

```bash
npm run d1:migrations:apply
```

3. **Seed test data** (optional):

```bash
wrangler d1 execute marketer-suite-dev --env development --file=./migrations/seed.sql
```

## 🛠️ Development

### Start Local Dev Server

```bash
# Start with remote D1 database
npm run dev

# Start with local SQLite (faster)
npm run dev:local
```

Server runs at: `http://localhost:8787`

### Test Endpoints

#### Health Check
```bash
curl http://localhost:8787/health
```

#### Test Endpoint
```bash
curl http://localhost:8787/api/test
```

#### Register (Get OTP)
```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","language":"vi"}'
```

**Development Response** (includes OTP for testing):
```json
{
  "success": true,
  "message": "Đã gửi mã OTP tới email!",
  "email": "test@example.com",
  "otp": "123456",
  "_devNote": "OTP included for testing. Not available in production!"
}
```

#### Verify OTP
```bash
curl -X POST http://localhost:8787/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","language":"vi"}'
```

**Response**:
```json
{
  "success": true,
  "message": "Xác thực thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "tier": "free",
    "language": "vi"
  }
}
```

#### Protected Route
```bash
curl http://localhost:8787/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔐 Environment Modes

### Development Mode Features
- ⚠️ Mock JWT signature (`.localdev`)
- ✅ OTP included in response for easy testing
- ✅ Webhook failures don't block flow
- 📝 Verbose console logging
- 🚀 Fast iteration without real crypto

### Production Mode Features
- ✅ Real HMAC-SHA256 JWT signature
- ❌ OTP never exposed in response
- ❌ Webhook failures return errors
- 🔒 Full security enabled
- ⚡ Optimized performance

## 📝 Database Management

### List Migrations
```bash
npm run d1:migrations:list
```

### Apply Migrations
```bash
npm run d1:migrations:apply
```

### Execute SQL
```bash
npm run d1:execute -- --command="SELECT * FROM users LIMIT 5"
```

### Reset Database (Development Only)
```bash
# Drop and recreate
wrangler d1 execute marketer-suite-dev --env development --command="DROP TABLE IF EXISTS users"
npm run d1:migrations:apply
```

## 🚀 Deployment

### Deploy to Staging
```bash
npm run deploy:staging
```

### Deploy to Production
```bash
# Set production secrets first
npm run secrets:put:prod JWT_SECRET
npm run secrets:put:prod N8N_WEBHOOK_URL
npm run secrets:put:prod TURNSTILE_SECRET
npm run secrets:put:prod CASSO_API_KEY
npm run secrets:put:prod CASSO_WEBHOOK_SECRET

# Deploy
npm run deploy:prod
```

### View Logs
```bash
# Development logs
npm run tail:dev

# Production logs
npm run tail:prod
```

## 🧪 Testing Checklist

### Local Testing (Development Mode)
- [ ] Health check endpoint works
- [ ] Test endpoint returns correct language
- [ ] Register sends OTP (check console for webhook call)
- [ ] OTP is visible in response
- [ ] Verify OTP returns JWT token
- [ ] Protected route accepts JWT
- [ ] Invalid JWT is rejected
- [ ] Expired OTP is rejected
- [ ] Invalid email format is rejected

### Staging Testing (Development Environment)
- [ ] All local tests pass on staging URL
- [ ] Webhook actually sends email
- [ ] Database persistence works
- [ ] JWT works across requests
- [ ] Rate limiting works (if implemented)

### Production Testing
- [ ] OTP NOT visible in response
- [ ] JWT signature is real (not `.localdev`)
- [ ] Webhook failures return errors
- [ ] All secrets are set correctly
- [ ] SSL/TLS working
- [ ] CORS configured correctly

## 🐛 Troubleshooting

### Issue: Webhook not sending emails
**Solution**: Check N8N webhook URL in `.dev.vars` and verify N8N workflow is active.

### Issue: JWT verification fails
**Solution**: 
- Development: Should use `.localdev` signature
- Production: Check `JWT_SECRET` is set correctly

### Issue: Database errors
**Solution**: 
```bash
npm run d1:migrations:list  # Check applied migrations
npm run d1:migrations:apply # Apply missing migrations
```

### Issue: "Module not found" errors
**Solution**:
```bash
rm -rf node_modules
npm install
```

### Issue: Wrangler dev not starting
**Solution**:
```bash
# Kill any running wrangler processes
pkill -f wrangler

# Clear cache
rm -rf .wrangler

# Restart
npm run dev
```

## 📚 API Documentation

Full API documentation: [docs/API_DOCUMENTATION.md](../../docs/API_DOCUMENTATION.md)

## 🏛 Architecture

System architecture: [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)

## 🔒 Security

Security guidelines: [docs/AUTHENTICATION.md](../../docs/AUTHENTICATION.md)

## 📦 Project Structure

```
packages/workers/
├── src/
│   ├── config/          # Configuration files
│   │   ├── environment.ts  # Env types and utilities
│   │   └── constants.ts    # App constants
│   ├── routes/          # API routes
│   │   └── auth.ts         # Authentication endpoints
│   ├── utils/           # Utility functions
│   │   ├── jwt.ts          # JWT signing/verification
│   │   └── i18n.ts         # Internationalization
│   ├── middleware/      # Request middleware
│   │   └── language.ts     # Language detection
│   └── index.ts         # Main entry point
├── migrations/       # D1 database migrations
├── wrangler.toml     # Cloudflare configuration
├── package.json      # Dependencies and scripts
└── .dev.vars         # Local secrets (gitignored)
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📝 License

Private project - All rights reserved.
