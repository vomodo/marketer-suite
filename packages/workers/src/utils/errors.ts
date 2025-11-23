/**
 * Localized Error Messages
 * Provides error messages in Vietnamese and English
 */

import { SupportedLanguage } from '../middleware/language';

export enum ErrorCode {
  // Authentication Errors
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // OTP Errors
  OTP_INVALID = 'OTP_INVALID',
  OTP_EXPIRED = 'OTP_EXPIRED',
  OTP_SEND_FAILED = 'OTP_SEND_FAILED',
  
  // Rate Limiting
  RATE_LIMIT = 'RATE_LIMIT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Validation Errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_EMAIL = 'INVALID_EMAIL',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  
  // Security
  TURNSTILE_FAILED = 'TURNSTILE_FAILED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_VERIFICATION_FAILED = 'PAYMENT_VERIFICATION_FAILED',
  INVALID_TIER = 'INVALID_TIER',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

type ErrorMessages = {
  [key in ErrorCode]: string;
};

const ERROR_MESSAGES: Record<SupportedLanguage, ErrorMessages> = {
  vi: {
    // Authentication
    INVALID_TOKEN: 'Token không hợp lệ',
    TOKEN_EXPIRED: 'Token đã hết hạn',
    INVALID_CREDENTIALS: 'Thông tin đăng nhập không đúng',
    UNAUTHORIZED: 'Không có quyền truy cập',
    
    // OTP
    OTP_INVALID: 'Mã OTP không đúng',
    OTP_EXPIRED: 'Mã OTP đã hết hạn',
    OTP_SEND_FAILED: 'Không thể gửi mã OTP',
    
    // Rate Limiting
    RATE_LIMIT: 'Vượt quá giới hạn sử dụng',
    RATE_LIMIT_EXCEEDED: 'Bạn đã vượt quá số lần sử dụng cho phép',
    
    // Validation
    INVALID_INPUT: 'Dữ liệu không hợp lệ',
    INVALID_EMAIL: 'Email không hợp lệ',
    MISSING_PARAMETER: 'Thiếu tham số bắt buộc',
    
    // Security
    TURNSTILE_FAILED: 'Xác thực bảo mật thất bại',
    FORBIDDEN: 'Không có quyền thực hiện hành động này',
    
    // Payment
    PAYMENT_FAILED: 'Thanh toán thất bại',
    PAYMENT_VERIFICATION_FAILED: 'Không thể xác thực thanh toán',
    INVALID_TIER: 'Gói dịch vụ không hợp lệ',
    
    // Database
    DATABASE_ERROR: 'Lỗi cơ sở dữ liệu',
    RECORD_NOT_FOUND: 'Không tìm thấy dữ liệu',
    
    // General
    INTERNAL_ERROR: 'Lỗi hệ thống',
    SERVICE_UNAVAILABLE: 'Dịch vụ tạm thời không khả dụng',
  },
  
  en: {
    // Authentication
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized access',
    
    // OTP
    OTP_INVALID: 'Invalid OTP code',
    OTP_EXPIRED: 'OTP code has expired',
    OTP_SEND_FAILED: 'Failed to send OTP code',
    
    // Rate Limiting
    RATE_LIMIT: 'Rate limit exceeded',
    RATE_LIMIT_EXCEEDED: 'You have exceeded the usage limit',
    
    // Validation
    INVALID_INPUT: 'Invalid input',
    INVALID_EMAIL: 'Invalid email address',
    MISSING_PARAMETER: 'Missing required parameter',
    
    // Security
    TURNSTILE_FAILED: 'Security verification failed',
    FORBIDDEN: 'You do not have permission to perform this action',
    
    // Payment
    PAYMENT_FAILED: 'Payment failed',
    PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',
    INVALID_TIER: 'Invalid service tier',
    
    // Database
    DATABASE_ERROR: 'Database error',
    RECORD_NOT_FOUND: 'Record not found',
    
    // General
    INTERNAL_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  },
};

/**
 * Get localized error message
 * @param code - Error code
 * @param lang - Language code
 * @returns Localized error message
 */
export function getErrorMessage(
  code: ErrorCode,
  lang: SupportedLanguage = 'vi'
): string {
  return ERROR_MESSAGES[lang][code] || ERROR_MESSAGES.en[code];
}

/**
 * Create error response object
 * @param code - Error code
 * @param lang - Language code
 * @param details - Optional additional details
 * @returns Error response object
 */
export function createErrorResponse(
  code: ErrorCode,
  lang: SupportedLanguage = 'vi',
  details?: Record<string, any>
) {
  return {
    error: getErrorMessage(code, lang),
    code,
    ...(details && { details }),
  };
}

/**
 * HTTP status codes for error responses
 */
export const ERROR_STATUS_CODES: Record<ErrorCode, number> = {
  // 401 Unauthorized
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 401,
  INVALID_CREDENTIALS: 401,
  UNAUTHORIZED: 401,
  OTP_INVALID: 401,
  OTP_EXPIRED: 401,
  
  // 403 Forbidden
  FORBIDDEN: 403,
  TURNSTILE_FAILED: 403,
  
  // 400 Bad Request
  INVALID_INPUT: 400,
  INVALID_EMAIL: 400,
  MISSING_PARAMETER: 400,
  INVALID_TIER: 400,
  
  // 404 Not Found
  RECORD_NOT_FOUND: 404,
  
  // 429 Too Many Requests
  RATE_LIMIT: 429,
  RATE_LIMIT_EXCEEDED: 429,
  
  // 500 Internal Server Error
  DATABASE_ERROR: 500,
  INTERNAL_ERROR: 500,
  OTP_SEND_FAILED: 500,
  PAYMENT_FAILED: 500,
  PAYMENT_VERIFICATION_FAILED: 500,
  
  // 503 Service Unavailable
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Create JSON error response
 * @param code - Error code
 * @param lang - Language code
 * @param details - Optional details
 * @returns Response object
 */
export function jsonError(
  code: ErrorCode,
  lang: SupportedLanguage = 'vi',
  details?: Record<string, any>
): Response {
  const status = ERROR_STATUS_CODES[code] || 500;
  return new Response(
    JSON.stringify(createErrorResponse(code, lang, details)),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
