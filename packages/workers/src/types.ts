/**
 * TypeScript Type Definitions for Workers
 */

/**
 * Cloudflare Worker Environment
 */
export interface Env {
  // D1 Database
  DB: D1Database;
  
  // KV Namespaces
  JWT_CACHE: KVNamespace;
  SESSIONS: KVNamespace;
  
  // R2 Buckets
  EXPORTS?: R2Bucket;
  
  // Environment Variables
  JWT_SECRET: string;
  TURNSTILE_SECRET: string;
  N8N_WEBHOOK_URL: string;
  CASSO_API_KEY: string;
  CASSO_WEBHOOK_SECRET: string;
}

/**
 * User object from database
 */
export interface User {
  id: number;
  email: string;
  tier: 'free' | 'pro';
  payment_status: 'inactive' | 'active';
  subscription_end?: string;
  language: 'vi' | 'en';
  created_at: number;
  updated_at?: number;
}

/**
 * JWT Payload
 */
export interface JWTPayload {
  userId: number;
  email: string;
  tier: string;
  language: 'vi' | 'en';
  iat: number;
  exp: number;
}

/**
 * OTP Code record
 */
export interface OTPCode {
  id: number;
  email: string;
  code: string;
  expires_at: number;
  created_at: number;
}

/**
 * Usage tracking record
 */
export interface UsageTracking {
  id: number;
  user_id: number;
  tool_name: string;
  usage_count: number;
  reset_date: string;
  created_at: number;
}

/**
 * Payment record
 */
export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  tier: string;
  transaction_id: string;
  status: 'pending' | 'verified' | 'failed';
  verified_at?: number;
  created_at: number;
}
