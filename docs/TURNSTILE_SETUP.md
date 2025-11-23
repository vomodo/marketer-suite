export const TURNSTILE_SETUP_MD = `
# Cloudflare Turnstile Setup Guide

## Production Setup

1. Create Turnstile site on Cloudflare dashboard for your domain  
2. Get sitekey (public) and secret (private)  
3. Add Turnstile widget to frontend form

\`\`\`html
<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
\`\`\`

4. Verify Turnstile token server-side in Worker

\`\`\`typescript
async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ secret, response: token })
  });
  const result = await resp.json();
  return result.success;
}
\`\`\`

## Local Development

- Use Cloudflare test sitekey and secret that always pass verification  
- Or create separate Turnstile site for localhost domain  
- Or enable bypass flag in dev environment (skip real verification)

## Tips

- Never commit real secret to git  
- Always verify token validity and expiry  
- Monitor failures for attack detection  
`;
