/**
 * Turnstile Middleware (Stub)
 * Example: Bot protection for public endpoints
 *
 * TODO: Implement with Cloudflare Turnstile verification logic
 */

import type { Env } from '../config/environment';

export async function verifyTurnstile(
  token: string,
  env: Env
): Promise<boolean> {
  // [Stub] Always returns true (for now)
  // TODO: Add HTTP POST to Turnstile API with token and secret
  return true;
}
