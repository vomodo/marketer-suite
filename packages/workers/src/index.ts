import { getLanguage } from './middleware/language';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Test endpoint: /api/test
    if (url.pathname === '/api/test') {
      // Detect language từ header (Accept-Language)
      const lang = await getLanguage(request, env);
      
      const message = lang === 'vi'
        ? 'Xin chào từ Marketer Suite! 🚀 (Ngôn ngữ: Tiếng Việt)'
        : 'Hello from Marketer Suite! 🚀 (Language: English)';

      return new Response(
        JSON.stringify({
          success: true,
          language: lang,
          message,
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // 404 fallback
    return new Response('Not found', { status: 404 });
  },
};
