/**
 * Authentication Routes
 * Handles user registration, OTP verification, and JWT authentication
 * with environment-aware security and comprehensive error handling
 */

import { signJWT, verifyJWT } from '../utils/jwt';
import { messages } from '../utils/i18n';
import type { Env } from '../config/environment';
import { isDev } from '../config/environment';
import {
  OTP_EXPIRY_MS,
  OTP_MIN_VALUE,
  OTP_MAX_VALUE,
  EMAIL_REGEX,
  HTTP_STATUS,
} from '../config/constants';

/**
 * Send OTP via N8N webhook with error handling
 * @returns true if successful, false if failed
 */
async function sendOTPViaWebhook(
  email: string,
  code: string,
  language: string,
  env: Env
): Promise<boolean> {
  try {
    const response = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, language }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return false;
    }

    console.log('✅ OTP sent via webhook to:', email);
    return true;
  } catch (error) {
    console.error('❌ Webhook error:', error);

    // Development: Continue even if webhook fails (for testing)
    if (isDev(env)) {
      console.log('⚠️ DEV MODE: Continuing despite webhook failure');
      return true; // Allow flow to continue in dev
    }

    return false;
  }
}

/**
 * Generate OTP code
 * @returns 6-digit OTP string
 */
function generateOTP(): string {
  const otp = Math.floor(OTP_MIN_VALUE + Math.random() * (OTP_MAX_VALUE - OTP_MIN_VALUE + 1));
  return otp.toString();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Standard API response helper
 */
function respond(
  lang: string,
  key: keyof typeof messages,
  data: any = {},
  success = false,
  status = HTTP_STATUS.OK
) {
  return Response.json(
    { success, message: messages[key][lang], ...data },
    {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
}

/**
 * Main authentication handler
 */
export async function handleAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Parse request body with error handling
  let body: any = {};
  try {
    body = await request.json();
  } catch (error) {
    console.error('❌ Invalid JSON body:', error);
    // Continue with empty body for routes that don't need it
  }

  const lang = body.language || 'vi';

  // ================================================
  // REGISTER / LOGIN: Send OTP
  // ================================================
  if (path === '/api/auth/register') {
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return respond(lang, 'invalidEmail', {}, false, HTTP_STATUS.BAD_REQUEST);
    }

    if (!isValidEmail(email)) {
      return respond(lang, 'invalidEmail', {}, false, HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Check if user exists, create if not
      let user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first();

      if (!user) {
        const result = await env.DB.prepare(
          'INSERT INTO users (email, tier, payment_status, language, created_at) VALUES (?, ?, ?, ?, ?)'
        )
          .bind(email, 'free', 'inactive', lang, Date.now())
          .run();

        if (!result.success) {
          console.error('❌ Failed to create user:', result.error);
          return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        console.log('✅ New user created:', email);
      }

      // Generate OTP
      const otp = generateOTP();
      const expires = Date.now() + OTP_EXPIRY_MS;

      // Store OTP in database
      const otpResult = await env.DB.prepare(
        'INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)'
      )
        .bind(email, otp, expires)
        .run();

      if (!otpResult.success) {
        console.error('❌ Failed to store OTP:', otpResult.error);
        return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      // Send OTP via webhook
      const webhookSuccess = await sendOTPViaWebhook(email, otp, lang, env);

      if (!webhookSuccess && !isDev(env)) {
        return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      // Prepare response
      const responseData: any = { email };

      // Development: Include OTP in response for testing
      if (isDev(env)) {
        responseData.otp = otp;
        responseData._devNote = 'OTP included for testing. Not available in production!';
      }

      return respond(lang, 'otpSent', responseData, true);
    } catch (error) {
      console.error('❌ Register error:', error);
      return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // ================================================
  // RESEND OTP
  // ================================================
  if (path === '/api/auth/resend-otp') {
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return respond(lang, 'invalidEmail', {}, false, HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Check if user exists
      const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first();

      if (!user) {
        return respond(lang, 'notFound', {}, false, HTTP_STATUS.NOT_FOUND);
      }

      // Generate new OTP
      const otp = generateOTP();
      const expires = Date.now() + OTP_EXPIRY_MS;

      // Store new OTP
      const otpResult = await env.DB.prepare(
        'INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)'
      )
        .bind(email, otp, expires)
        .run();

      if (!otpResult.success) {
        console.error('❌ Failed to store OTP:', otpResult.error);
        return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      // Send OTP via webhook
      const webhookSuccess = await sendOTPViaWebhook(email, otp, lang, env);

      if (!webhookSuccess && !isDev(env)) {
        return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      // Prepare response
      const responseData: any = { email };

      // Development: Include OTP in response
      if (isDev(env)) {
        responseData.otp = otp;
        responseData._devNote = 'OTP included for testing. Not available in production!';
      }

      return respond(lang, 'otpResent', responseData, true);
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // ================================================
  // VERIFY OTP
  // ================================================
  if (path === '/api/auth/verify-otp') {
    const { email, code } = body;

    // Validate inputs
    if (!email || !code) {
      return respond(lang, 'missingOtp', {}, false, HTTP_STATUS.BAD_REQUEST);
    }

    if (!isValidEmail(email)) {
      return respond(lang, 'invalidEmail', {}, false, HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Check OTP
      const otpRecord = await env.DB.prepare(
        'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND expires_at >= ?'
      )
        .bind(email, code, Date.now())
        .first();

      if (!otpRecord) {
        return respond(lang, 'otpInvalid', {}, false, HTTP_STATUS.UNAUTHORIZED);
      }

      // Get user data
      const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first();

      if (!user) {
        return respond(lang, 'notFound', {}, false, HTTP_STATUS.NOT_FOUND);
      }

      // Generate JWT
      const jwtPayload = {
        id: user.id,
        email: user.email,
        tier: user.tier,
        language: user.language,
      };

      const token = await signJWT(jwtPayload, env);

      // Delete used OTP (optional: for security)
      await env.DB.prepare('DELETE FROM otp_codes WHERE email = ? AND code = ?')
        .bind(email, code)
        .run();

      return Response.json(
        {
          success: true,
          message: messages.authSuccess[lang],
          token,
          user: jwtPayload,
        },
        {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // ================================================
  // PROTECTED ROUTE (Demo)
  // ================================================
  if (path === '/api/protected') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer /, '');

    if (!token) {
      return respond(lang, 'sessionExpired', {}, false, HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      const user = await verifyJWT(token, env);

      if (!user) {
        return respond(lang, 'sessionExpired', {}, false, HTTP_STATUS.UNAUTHORIZED);
      }

      return Response.json(
        { success: true, user },
        {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    } catch (error) {
      console.error('❌ Protected route error:', error);
      return respond(lang, 'sessionExpired', {}, false, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  // ================================================
  // 404: Route not found
  // ================================================
  return respond(lang, 'apiNotFound', {}, false, HTTP_STATUS.NOT_FOUND);
}
