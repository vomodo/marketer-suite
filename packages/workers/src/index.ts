import { getLanguage } from './middleware/language';
import { handleAuth } from './routes/auth';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Route AUTH backend
    if (url.pathname.startsWith("/api/auth") || url.pathname === "/api/protected") {
      return await handleAuth(request, env);
    }

    // Test endpoint: /api/test (giữ nguyên cho dev test)
    if (url.pathname === '/api/test') {
      const lang = await getLanguage(request, env);
      let message = '';
      if (lang === 'vi') {
        message = 'Xin chào từ Marketer Suite! 🚀 (Ngôn ngữ: Tiếng Việt)';
      } else {
        message = 'Hello from Marketer Suite! 🚀 (Language: English)';
      }
      return new Response(
        JSON.stringify({ success: true, language: lang, message }),
        { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 404 fallback
    return new Response('Not found', { status: 404 });
  },
};
