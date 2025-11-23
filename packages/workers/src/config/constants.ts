/**
 * Application Constants
 * Centralized configuration values for authentication, validation, and business logic
 */

// ============================================
// Authentication & Security
// ============================================

/**
 * OTP (One-Time Password) expiration time in milliseconds
 * Default: 5 minutes
 */
export const OTP_EXPIRY_MS = 5 * 60 * 1000;

/**
 * JWT token expiration time in minutes
 * Default: 60 minutes (1 hour)
 */
export const JWT_EXPIRY_MIN = 60;

/**
 * Length of OTP code
 * Default: 6 digits
 */
export const OTP_LENGTH = 6;

/**
 * Minimum OTP value (100000 for 6-digit OTP)
 */
export const OTP_MIN_VALUE = Math.pow(10, OTP_LENGTH - 1);

/**
 * Maximum OTP value (999999 for 6-digit OTP)
 */
export const OTP_MAX_VALUE = Math.pow(10, OTP_LENGTH) - 1;

// ============================================
// Validation Patterns
// ============================================

/**
 * Email validation regex
 * Validates standard email format: user@domain.tld
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email validation with stricter rules
 * - No leading/trailing dots
 * - No consecutive dots
 * - Valid TLD (2-6 characters)
 */
export const EMAIL_REGEX_STRICT = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,6}$/;

// ============================================
// Rate Limiting
// ============================================

/**
 * Maximum OTP requests per email per hour
 */
export const MAX_OTP_REQUESTS_PER_HOUR = 5;

/**
 * Maximum failed login attempts before temporary lockout
 */
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;

/**
 * Lockout duration in milliseconds (15 minutes)
 */
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

// ============================================
// Response Messages Keys
// ============================================

/**
 * Standard API response message keys
 * Used with i18n system for localized messages
 */
export const MESSAGE_KEYS = {
  OTP_SENT: 'otpSent',
  OTP_RESENT: 'otpResent',
  OTP_INVALID: 'otpInvalid',
  AUTH_SUCCESS: 'authSuccess',
  INVALID_EMAIL: 'invalidEmail',
  MISSING_OTP: 'missingOtp',
  NOT_FOUND: 'notFound',
  API_NOT_FOUND: 'apiNotFound',
  SESSION_EXPIRED: 'sessionExpired',
  RATE_LIMIT_EXCEEDED: 'rateLimitExceeded',
} as const;

// ============================================
// User Tiers & Limits
// ============================================

export const USER_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const TIER_LIMITS = {
  [USER_TIERS.FREE]: {
    dailyApiCalls: 100,
    monthlyToolUsage: 50,
  },
  [USER_TIERS.PRO]: {
    dailyApiCalls: 1000,
    monthlyToolUsage: 500,
  },
  [USER_TIERS.ENTERPRISE]: {
    dailyApiCalls: 10000,
    monthlyToolUsage: 5000,
  },
} as const;

// ============================================
// HTTP Status Codes
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
