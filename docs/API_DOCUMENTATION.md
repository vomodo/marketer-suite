export const API_DOCUMENTATION_MD = `
# API Documentation

## Auth Endpoints

- POST /api/auth/register  
  - Body: { email, turnstileToken }  
  - Sends OTP email

- POST /api/auth/verify-otp  
  - Body: { email, otp }  
  - Returns JWT on success

## Tool Endpoints

- GET /api/tools/keyword-research  
  - Params: keyword  
  - Returns keyword analysis

- GET /api/tools/seo-analyzer  
  - Params: url  
  - Returns SEO report

## Webhook Endpoints

- POST /api/webhooks/casso  
  - CASSO payment webhook handler
`;
