export const ARCHITECTURE_MD = `
# Architecture Overview

## System Diagram

\\\`
┌─────────────────────────────────────────┐
│  Frontend (Cloudflare Pages)            │
│  - Vanilla JS/HTML/CSS                  │
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
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┬──────────────┬──────┐
      ↓             ↓              ↓      ↓
┌──────────┐  ┌──────────┐  ┌─────────┐ ┌────────┐
│ D1 (SQL) │  │ KV Cache │  │ R2 File │ │ N8N    │
│ 5GB DB   │  │ Sessions │  │ Storage │ │ SMTP   │
└──────────┘  └──────────┘  └─────────┘ └────────┘
                                             ↓
                                      ┌──────────────┐
                                      │ CASSO API    │
                                      │ Payment      │
                                      └──────────────┘
\\\`

## Components

- Frontend: Pure vanilla JS, deployed on Cloudflare Pages  
- Backend: Cloudflare Workers, handling auth, tools, webhooks  
- Database: Cloudflare D1 (SQLite compatible) storing users, OTP, usage, payments  
- KV Storage: caching JWTs and other session data  
- R2 Storage: file exports and backups  
- Third-party: N8N for webhook email, CASSO for payment webhook  

## Security Measures

- Turnstile for bot protection  
- JWT for request authentication  
- Rate limiting managed in Workers using D1 tracking

## Scalability & Free Tier Usage

- Workers free tier: 100K requests/day  
- D1 free tier: 5M reads and 100K writes/day  
- KV free tier: 1GB storage, 100K reads/day  
- R2 free tier: 10GB storage  
- Suitable for MVP and scaling up to ~10K users free  
`;
