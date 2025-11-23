/**
 * Language Detection Middleware
 * Detects user language from Accept-Language header or user preferences
 */

import { Env } from '../types';

export type SupportedLanguage = 'vi' | 'en';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['vi', 'en'];
const DEFAULT_LANGUAGE: SupportedLanguage = 'vi';

/**
 * Extract language from Accept-Language header
 * @param request - HTTP Request object
 * @returns Language code ('vi' or 'en')
 */
export function getLanguageFromHeader(request: Request): SupportedLanguage {
  const acceptLanguage = request.headers.get('Accept-Language');
  
  if (!acceptLanguage) {
    return DEFAULT_LANGUAGE;
  }
  
  // Parse Accept-Language header (e.g., "vi-VN,vi;q=0.9,en;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase().split('-')[0]);
  
  // Find first supported language
  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage;
    }
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Get language from user record in database
 * @param env - Cloudflare Worker environment
 * @param userId - User ID
 * @returns User's preferred language
 */
export async function getUserLanguage(
  env: Env,
  userId: number
): Promise<SupportedLanguage> {
  try {
    const result = await env.DB.prepare(
      'SELECT language FROM users WHERE id = ?'
    ).bind(userId).first<{ language: string }>();
    
    if (result && SUPPORTED_LANGUAGES.includes(result.language as SupportedLanguage)) {
      return result.language as SupportedLanguage;
    }
  } catch (error) {
    console.error('Error fetching user language:', error);
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Get language from request (header or user preference)
 * Priority: User DB preference > Accept-Language header > Default
 * @param request - HTTP Request
 * @param env - Cloudflare Worker environment
 * @param userId - Optional user ID for authenticated requests
 * @returns Language code
 */
export async function getLanguage(
  request: Request,
  env: Env,
  userId?: number
): Promise<SupportedLanguage> {
  // If user is authenticated, prioritize their saved preference
  if (userId) {
    const userLang = await getUserLanguage(env, userId);
    if (userLang) return userLang;
  }
  
  // Fall back to Accept-Language header
  return getLanguageFromHeader(request);
}

/**
 * Validate language code
 * @param lang - Language code to validate
 * @returns True if valid, false otherwise
 */
export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}
