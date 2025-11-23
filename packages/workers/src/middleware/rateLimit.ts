/**
 * Rate Limiting Middleware (Stub)
 * Example: Apply per-email or per-IP limits to endpoints (OTP, login, etc)
 *
 * TODO: Implement actual logic with D1 and KV cache
 */

import type { Env } from '../config/environment';

export async function rateLimit(
  identifier: string, // e.g., email or IP
  env: Env,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  // [Stub] Always allow for now (development mode)
  // Implement D1 or KV logic to count requests and expire after windowMs
  return true;
}
