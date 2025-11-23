/**
 * Marketer Suite Workers API
 * Main entry point for Cloudflare Workers
 * Handles routing to authentication and test endpoints
 */

import { getLanguage } from './middleware/language';
import { handleAuth } from './routes/auth';
import type { Env } from './config/environment';
import { HTTP_STATUS } from './config/constants';

function corsHeaders(extra: Record<string, string> = {}) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extra
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    try {
      // AUTH ROUTES
      if (url.pathname.startsWith('/api/auth') || url.pathname === '/api/protected') {
        const res = await handleAuth(request, env);
        // Patch CORS headers cho mọi response
        const rawBody = await res.text();
        return new Response(rawBody, {
          status: res.status,
          headers: corsHeaders(Object.fromEntries(res.headers)),
        });
      }
      // TEST ENDPOINT
      if (url.pathname === '/api/test') {
        const lang = await getLanguage(request, env);
        let message = '';
        if (lang === 'vi') {
          message = 'Xin chào từ Marketer Suite! 🚀 (Ngôn ngữ: Tiếng Việt)';
        } else {
          message = 'Hello from Marketer Suite! 🚀 (Language: English)';
        }
        return new Response(
          JSON.stringify({
            success: true,
            language: lang,
            message,
            environment: env.ENVIRONMENT,
            timestamp: new Date().toISOString(),
          }),
          { status: HTTP_STATUS.OK, headers: corsHeaders() }
        );
      }
      // HEALTH CHECK
      if (url.pathname === '/health' || url.pathname === '/') {
        return new Response(
          JSON.stringify({
            status: 'healthy',
            service: 'marketer-suite-api',
            environment: env.ENVIRONMENT,
            timestamp: new Date().toISOString(),
          }),
          { status: HTTP_STATUS.OK, headers: corsHeaders() }
        );
      }
      // 404: Not Found
      return new Response(
        JSON.stringify({ success: false, error: 'Not found', path: url.pathname }),
        { status: HTTP_STATUS.NOT_FOUND, headers: corsHeaders() }
      );
    } catch (error) {
      // Global Error Handler
      console.error('❌ Unhandled error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, headers: corsHeaders() }
      );
    }
  },
};
