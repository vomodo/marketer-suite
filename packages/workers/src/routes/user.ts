/**
 * User Preferences API
 * Handles user language preference updates
 */

import { Env } from '../types';
import { getLanguage, isValidLanguage, SupportedLanguage } from '../middleware/language';
import { ErrorCode, jsonError } from '../utils/errors';

/**
 * Update user language preference
 * PATCH /api/user/preferences
 */
export async function updateUserPreferences(
  request: Request,
  env: Env,
  userId: number
): Promise<Response> {
  try {
    const body = await request.json() as { language?: string };
    const currentLang = await getLanguage(request, env, userId);
    
    // Validate language parameter
    if (!body.language) {
      return jsonError(ErrorCode.MISSING_PARAMETER, currentLang, {
        field: 'language',
      });
    }
    
    if (!isValidLanguage(body.language)) {
      return jsonError(ErrorCode.INVALID_INPUT, currentLang, {
        field: 'language',
        allowed: ['vi', 'en'],
      });
    }
    
    // Update user language in database
    await env.DB.prepare(
      'UPDATE users SET language = ?, updated_at = ? WHERE id = ?'
    )
      .bind(body.language, Date.now(), userId)
      .run();
    
    return new Response(
      JSON.stringify({
        success: true,
        language: body.language,
        message: body.language === 'vi' 
          ? 'Đã cập nhật ngôn ngữ thành công'
          : 'Language updated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating user preferences:', error);
    const lang = await getLanguage(request, env, userId);
    return jsonError(ErrorCode.INTERNAL_ERROR, lang);
  }
}

/**
 * Get user preferences
 * GET /api/user/preferences
 */
export async function getUserPreferences(
  request: Request,
  env: Env,
  userId: number
): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      'SELECT language, email, tier FROM users WHERE id = ?'
    ).bind(userId).first<{
      language: SupportedLanguage;
      email: string;
      tier: string;
    }>();
    
    if (!result) {
      const lang = await getLanguage(request, env);
      return jsonError(ErrorCode.RECORD_NOT_FOUND, lang);
    }
    
    return new Response(
      JSON.stringify({
        language: result.language || 'vi',
        email: result.email,
        tier: result.tier,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    const lang = await getLanguage(request, env);
    return jsonError(ErrorCode.INTERNAL_ERROR, lang);
  }
}
