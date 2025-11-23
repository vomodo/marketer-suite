export const ARCHITECTURE_MD = `
# Architecture Overview

## System Diagram

\`\`\`
┌─────────────────────────────────────────┐
│  Frontend (Cloudflare Pages)            │
│  - Vanilla JS/HTML/CSS                  │
│  - i18n Layer (vi/en)                   │
│  - Global CDN + SSL                     │
│  - Unlimited bandwidth                  │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│  Cloudflare Workers (API Gateway)       │
│  - Auth Routes (/api/auth/*)            │
│  - Tool Routes (/api/tools/*)           │
│  - Webhook Routes (/api/webhooks/*)    │
│  - Rate Limiting & JWT Middleware       │
│  - Language Detection Middleware        │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┬──────────────┬──────┐
      ↓             ↓              ↓      ↓
┌──────────┐  ┌──────────┐  ┌─────────┐ ┌────────┐
│ D1 (SQL) │  │ KV Cache │  │ R2 File │ │ N8N    │
│ 5GB DB   │  │ Sessions │  │ Storage │ │ SMTP   │
│ + lang   │  │ + i18n   │  │         │ │ + lang │
└──────────┘  └──────────┘  └─────────┘ └────────┘
                                             ↓
                                      ┌──────────────┐
                                      │ CASSO API    │
                                      │ Payment      │
                                      └──────────────┘
\`\`\`

## Components

### Frontend Layer
- **Framework**: Pure vanilla JS, deployed on Cloudflare Pages
- **i18n System**: LanguageContext for Vietnamese/English support
  - Client-side language switching
  - localStorage persistence
  - Reactive UI updates
  - Format utilities (date, number, currency)
- **Styling**: BEM methodology with i18n-aware CSS
- **Icons**: SVG format from Flaticons

### Backend Layer  
- **Runtime**: Cloudflare Workers
- **Routes**:
  - `/api/auth/*` - Authentication endpoints
  - `/api/tools/*` - SEO & Content tools
  - `/api/webhooks/*` - Payment webhooks
- **Middleware**:
  - JWT authentication
  - Rate limiting
  - Language detection (Accept-Language header)
  - Error handling with localized messages

### Data Layer
- **D1 (SQLite)**: User data, OTP codes, usage tracking, payments
  - `users` table includes language preference column
- **KV Storage**: 
  - JWT tokens cache
  - Session data
  - i18n preference cache
- **R2 Storage**: File exports, backups, reports

### External Services
- **N8N**: Email automation with language-specific templates
- **CASSO**: Payment webhook integration
- **Turnstile**: Bot protection

---

## i18n Architecture

### Client-Side Flow

1. **Initial Load**:
   ```
   User visits site
   → Check localStorage for 'marketer_suite_lang'
   → Load appropriate translations (vi.js or en.js)
   → Render UI with selected language
   ```

2. **Language Switch**:
   ```
   User clicks language toggle
   → LanguageContext.setLanguage(newLang)
   → Save to localStorage
   → Notify all subscribers
   → Components re-render with new translations
   ```

3. **API Requests**:
   ```
   Frontend sends request
   → Include 'Accept-Language: vi' header
   → Backend detects language
   → Return localized error messages
   ```

### Server-Side Integration

1. **Language Detection Middleware**:
   ```typescript
   function getLanguage(request: Request): 'vi' | 'en' {
     const header = request.headers.get('Accept-Language');
     const lang = header?.split(',')[0]?.split('-')[0];
     return ['vi', 'en'].includes(lang) ? lang : 'vi';
   }
   ```

2. **Localized Responses**:
   ```typescript
   // Error messages
   const messages = {
     vi: { INVALID_TOKEN: 'Token không hợp lệ' },
     en: { INVALID_TOKEN: 'Invalid token' },
   };
   
   return new Response(
     JSON.stringify({ error: messages[lang].INVALID_TOKEN }), 
     { status: 401 }
   );
   ```

3. **Email Templates**:
   - N8N receives language parameter
   - Routes to appropriate template (vi/en)
   - Sends localized email content

---

## Security Measures

- **Turnstile**: Bot protection on all public endpoints
- **JWT**: Request authentication with KV caching
- **Rate Limiting**: Per-user and per-tool limits tracked in D1
- **Input Validation**: Strict TypeScript types and runtime checks
- **CORS**: Configured for frontend domain only
- **Secrets Management**: Environment variables via Wrangler

---

## Scalability & Free Tier Usage

### Cloudflare Free Tier Limits
- **Workers**: 100K requests/day
- **D1**: 5M reads, 100K writes/day
- **KV**: 1GB storage, 100K reads/day
- **R2**: 10GB storage
- **Pages**: Unlimited bandwidth

### Estimated Capacity
- ~10K active users on free tier
- ~50K tool executions/month
- ~1M API requests/month

### Scaling Strategy
- Optimize DB queries with indexes
- Cache frequently accessed data in KV
- Use R2 for large file storage
- Implement request coalescing
- Monitor with Cloudflare Analytics

---

## Performance Optimizations

### Frontend
1. **Lazy Loading**: Load translations on demand
2. **Caching**: localStorage for language preference
3. **Bundling**: Minified JS/CSS
4. **CDN**: Global distribution via Cloudflare Pages
5. **SVG Icons**: Inline SVG for instant rendering

### Backend
1. **KV Caching**: JWT tokens, session data
2. **DB Indexing**: Email, user_id, reset_date
3. **Connection Pooling**: D1 prepared statements
4. **Response Compression**: Gzip enabled
5. **Edge Computing**: Low latency globally

### i18n Performance
1. **Small Bundle Size**: ~10KB total translations
2. **No External Requests**: All translations bundled
3. **Memory Caching**: Translations loaded once
4. **Fast Switching**: No page reload needed

---

## Monitoring & Observability

### Metrics to Track
- Request count by endpoint
- Error rate by type
- Response time p50/p95/p99
- Language distribution (vi vs en)
- Tool usage by tier (free vs pro)
- Payment conversion rate

### Tools
- **Cloudflare Analytics**: Built-in metrics
- **Workers Analytics**: Detailed request logs
- **D1 Metrics**: Query performance
- **Custom Logging**: Structured JSON logs
- **Alerting**: Email/Slack notifications

---

## Deployment Architecture

### Environments
1. **Development**: Local with Wrangler CLI
2. **Staging**: Cloudflare preview deployments
3. **Production**: Cloudflare Workers + Pages

### CI/CD Pipeline
```
Git Push → GitHub Actions
  → Run tests
  → Build frontend
  → Deploy Workers (wrangler publish)
  → Deploy Pages (wrangler pages publish)
  → Run smoke tests
  → Notify team
```

### Rollback Strategy
- Git revert + redeploy
- Cloudflare Workers versioning
- Database migrations with down scripts
- Feature flags for gradual rollout

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|----------|
| Frontend | Vanilla JS | Client-side logic |
| i18n | LanguageContext | Multi-language support |
| Styling | BEM + CSS | Component styles |
| Backend | Cloudflare Workers | Serverless API |
| Database | D1 (SQLite) | Persistent data |
| Cache | KV Storage | Sessions & tokens |
| Files | R2 Storage | Exports & backups |
| Email | N8N Webhooks | OTP delivery |
| Payment | CASSO API | Bank transfers |
| Security | Turnstile | Bot protection |
| Hosting | Cloudflare Pages | Static site |
| CDN | Cloudflare | Global distribution |

---

## References

- [Database Schema](./DATABASE_SCHEMA.md)
- [Authentication Flow](./AUTHENTICATION.md)
- [i18n Implementation](./I18N_IMPLEMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Style Guide](./STYLE_GUIDE.md)

---

Architecture designed for scalability, performance, and developer experience.
`;
