/**
 * Environment Configuration
 * Defines TypeScript interfaces for Cloudflare Workers bindings
 * and utilities for environment detection
 */

export interface Env {
  // D1 Database binding
  DB: D1Database;
  
  // KV Namespace bindings
  JWT_CACHE: KVNamespace;
  SESSIONS: KVNamespace;
  
  // Secrets (set via wrangler secret put)
  JWT_SECRET: string;
  N8N_WEBHOOK_URL: string;
  TURNSTILE_SECRET: string;
  CASSO_API_KEY: string;
  CASSO_WEBHOOK_SECRET: string;
  
  // Environment variable
  ENVIRONMENT: 'development' | 'production';
}

/**
 * Check if running in development mode
 * @param env - Environment bindings
 * @returns true if in development, false if in production
 */
export function isDev(env: Env): boolean {
  return env.ENVIRONMENT === 'development';
}

/**
 * Check if running in production mode
 * @param env - Environment bindings
 * @returns true if in production, false if in development
 */
export function isProd(env: Env): boolean {
  return env.ENVIRONMENT === 'production';
}
