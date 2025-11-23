import { getLanguage } from './middleware/language';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Test endpoint: /api/test
    if (url.pathname === '/api/test') {
      // Detect language từ header (Accept-Language)
      const lang = await getLanguage(request, env);
<<<<<<< HEAD
      
      const message = lang === 'vi'
        ? 'Xin chào từ Marketer Suite! 🚀 (Ngôn ngữ: Tiếng Việt)'
        : 'Hello from Marketer Suite! 🚀 (Language: English)';
=======
      let message = '';
      if (lang === 'vi') {
        message = 'Xin chào từ Marketer Suite! 🚀 (Ngôn ngữ: Tiếng Việt)';
      } else {
        message = 'Hello from Marketer Suite! 🚀 (Language: English)';
      }
>>>>>>> 12ee76956992c4d4ad1fb470c0974de6593ba114

      return new Response(
        JSON.stringify({
          success: true,
          language: lang,
          message,
        }),
<<<<<<< HEAD
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
=======
        { status: 200, headers: { 'Content-Type': 'application/json' } }
>>>>>>> 12ee76956992c4d4ad1fb470c0974de6593ba114
      );
    }

    // 404 fallback
    return new Response('Not found', { status: 404 });
  },
};
