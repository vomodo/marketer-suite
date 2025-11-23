export const PAYMENT_INTEGRATION_MD = `
# Payment Integration with CASSO

## Overview

- CASSO monitors Vietnamese bank transactions  
- When user transfers with description "MARKETER-SUITE <email>", webhook triggers  

## Setup

1. Create CASSO account and connect bank  
2. Generate API key and webhook secret  
3. Setup webhook URL in CASSO dashboard pointing to Worker endpoint

## Webhook Handling

- Verify signature of incoming webhook  
- Parse user email from transaction description  
- Update user subscription and tier in D1  
- Send confirmation email via N8N webhook

## Testing Locally

- Use ngrok or cloudflared to expose local server  
- Send mock payload and validate processing

## Security

- Strict signature verification  
- Rate limiting webhook endpoint  
- Log failed attempts
`;
