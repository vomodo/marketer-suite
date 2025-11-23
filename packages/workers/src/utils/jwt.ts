/**
 * JWT Utilities
 * Handles JWT signing and verification with environment-aware security
 * - Development: Uses mock signature for fast iteration
 * - Production: Uses HMAC-SHA256 with Web Crypto API
 */

import { isDev } from '../config/environment';
import type { Env } from '../config/environment';
import { JWT_EXPIRY_MIN } from '../config/constants';

/**
 * Base64URL encode helper
 * Converts object to base64url format (RFC 4648)
 */
function base64UrlEncode(obj: any): string {
  const json = JSON.stringify(obj);
  const base64 = btoa(json);
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decode helper
 * Converts base64url string back to object
 */
function base64UrlDecode(str: string): any {
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const json = atob(base64);
  return JSON.parse(json);
}

/**
 * Sign JWT token
 * @param payload - Data to encode in JWT
 * @param env - Environment bindings
 * @param expiresInMin - Token expiration in minutes (default: 60)
 * @returns Signed JWT token string
 */
export async function signJWT(
  payload: any,
  env: Env,
  expiresInMin: number = JWT_EXPIRY_MIN
): Promise<string> {
  // JWT Header
  const header = {
    typ: 'JWT',
    alg: 'HS256',
  };

  // JWT Payload with expiration
  const exp = Math.floor(Date.now() / 1000) + expiresInMin * 60;
  const data = {
    ...payload,
    exp,
    iat: Math.floor(Date.now() / 1000), // Issued at
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(data);
  const toSign = `${encodedHeader}.${encodedPayload}`;

  // === DEVELOPMENT MODE: Mock signature ===
  if (isDev(env)) {
    console.log('⚠️ DEV MODE: Using mock JWT signature');
    console.log('📝 Token payload:', data);
    return `${toSign}.localdev`;
  }

  // === PRODUCTION MODE: Real HMAC-SHA256 signature ===
  try {
    // Import secret key for HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the token
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(toSign)
    );

    // Convert signature to base64url
    const signatureArray = new Uint8Array(signature);
    const signatureBase64 = btoa(
      String.fromCharCode(...signatureArray)
    );
    const signatureBase64Url = signatureBase64
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${toSign}.${signatureBase64Url}`;
  } catch (error) {
    console.error('❌ JWT signing failed:', error);
    throw new Error('Failed to sign JWT token');
  }
}

/**
 * Verify JWT token
 * @param token - JWT token string to verify
 * @param env - Environment bindings
 * @returns Decoded payload if valid, null if invalid
 */
export async function verifyJWT(
  token: string,
  env: Env
): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format');
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Decode payload
    const payload = base64UrlDecode(encodedPayload);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.warn('⚠️ JWT expired:', {
        expired: new Date(payload.exp * 1000).toISOString(),
        now: new Date(now * 1000).toISOString(),
      });
      return null;
    }

    // === DEVELOPMENT MODE: Skip signature verification ===
    if (isDev(env) && signature === 'localdev') {
      console.log('⚠️ DEV MODE: Skipping signature verification');
      console.log('✅ Token valid (dev mode):', payload.email);
      return payload;
    }

    // === PRODUCTION MODE: Verify HMAC-SHA256 signature ===
    try {
      const toVerify = `${encodedHeader}.${encodedPayload}`;

      // Import secret key for verification
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(env.JWT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      // Convert signature from base64url to ArrayBuffer
      const signatureBase64 = signature
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const signatureStr = atob(signatureBase64);
      const signatureArray = new Uint8Array(
        signatureStr.split('').map(c => c.charCodeAt(0))
      );

      // Verify signature
      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureArray,
        new TextEncoder().encode(toVerify)
      );

      if (!isValid) {
        console.error('❌ Invalid JWT signature');
        return null;
      }

      console.log('✅ JWT verified successfully:', payload.email);
      return payload;
    } catch (error) {
      console.error('❌ JWT verification failed:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ JWT parsing error:', error);
    return null;
  }
}
