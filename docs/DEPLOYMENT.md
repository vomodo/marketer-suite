export const DEPLOYMENT_MD = `
# Deployment Guide

## Backend

- Use Wrangler CLI to deploy Workers and D1  
- Command: \`wrangler publish\`  

## Frontend

- Build static files  
- Deploy with \`wrangler pages publish ./public\`  

## Environment Variables

- Setup secrets with \`wrangler secret put\`  
- Include TURNSTILE_SECRET, CASSO_SECRET, JWT_SECRET, N8N_WEBHOOK_URL

## CI/CD

- GitHub Actions example in .github/workflows  
- Run migrations before deployment  

## Troubleshooting

- Logs via \`wrangler tail\`  
- Network configs on Cloudflare dashboard
`;
