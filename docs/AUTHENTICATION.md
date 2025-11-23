export const AUTHENTICATION_MD = `
# Authentication System

## User Registration Flow

- User submits email + Turnstile token  
- Backend verifies Turnstile token  
- Generate OTP code, store in D1 otp_codes table  
- Send OTP via N8N webhook SMTP  
- User submits OTP code for verification  
- Issue JWT token, store in KV cache  
- JWT sent with each request for secure API access

## Tables Involved

- users: user accounts with tier and payment status  
- otp_codes: temporary OTP storage with expiry  
- usage_tracking: monitor user API consumption

## Security

- OTP expiry: 10 minutes, single use  
- JWT expiry: 7 days  
- Turnstile mitigates bot registrations  
- Rejected requests logged for monitoring  
`;
