export const API_DOCUMENTATION_MD = `
# API Documentation

## Request Headers

### Language Header
All API requests should include language preference:

\`\`\`
Accept-Language: vi
\`\`\`

Supported values: `vi` (Vietnamese), `en` (English)

Default: `vi` if not specified

---

## Auth Endpoints

### POST /api/auth/request-otp

Request OTP code for email authentication.

**Request**:
```json
{
  "email": "user@example.com",
  "turnstileToken": "cf-turnstile-token",
  "language": "vi"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Mã OTP đã được gửi đến email của bạn" // Localized based on language
}
```

**Response** (Error - 400):
```json
{
  "error": "Email không hợp lệ" // Localized error message
}
```

**Localized Messages**:
- `vi`: "Mã OTP đã được gửi đến email của bạn"
- `en`: "OTP code has been sent to your email"

---

### POST /api/auth/verify-otp

Verify OTP code and authenticate user.

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "language": "vi"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "tier": "free",
    "language": "vi"
  }
}
```

**Response** (Error - 401):
```json
{
  "error": "Mã OTP không đúng" // Localized
}
```

---

### POST /api/auth/logout

Invalidate JWT token.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Đăng xuất thành công" // Localized
}
```

---

## Tool Endpoints

All tool endpoints require JWT authentication.

**Headers**:
```
Authorization: Bearer <jwt-token>
Accept-Language: vi
```

---

### GET /api/tools/keyword-research

Analyze keyword metrics.

**Query Parameters**:
- `keyword` (required): Target keyword
- `language` (optional): Content language
- `location` (optional): Target location

**Example Request**:
```
GET /api/tools/keyword-research?keyword=seo%20tools&language=vi
```

**Response** (Success - 200):
```json
{
  "keyword": "seo tools",
  "density": 2.5,
  "search_volume": 10000,
  "competitor_score": 75,
  "lsi_keywords": [
    "seo software",
    "seo analytics",
    "keyword research"
  ],
  "message": "Phân tích hoàn tất" // Localized
}
```

**Response** (Rate Limit - 429):
```json
{
  "error": "Vượt quá giới hạn sử dụng",
  "limit": 5,
  "used": 5,
  "reset_date": "2025-12-01"
}
```

---

### POST /api/tools/onpage-seo

Analyze on-page SEO.

**Request**:
```json
{
  "url": "https://example.com/page"
}
```

**Alternative**:
```json
{
  "html": "<html>...</html>"
}
```

**Response** (Success - 200):
```json
{
  "score": 85,
  "issues": [
    {
      "type": "warning",
      "message": "Thẻ meta description quá ngắn", // Localized
      "element": "meta[name='description']"
    }
  ],
  "recommendations": [
    "Thêm thẻ schema markup", // Localized
    "Tối ưu thẻ H1"
  ],
  "meta_tags": {
    "title": "Page Title",
    "description": "Page description",
    "has_h1": true
  }
}
```

---

### POST /api/tools/backlink-analyzer

Analyze backlink profile.

**Request** (multipart/form-data):
```
file: backlinks.csv
```

**CSV Format**:
```csv
source_url,target_url,anchor_text,domain_authority
https://site1.com,https://example.com,SEO Tools,50
https://site2.com,https://example.com,Marketing,70
```

**Response** (Success - 200):
```json
{
  "total_backlinks": 150,
  "toxic_links": 5,
  "quality_score": 75,
  "top_domains": [
    {
      "domain": "site1.com",
      "backlinks": 25,
      "authority": 50
    }
  ],
  "message": "Phân tích hoàn tất" // Localized
}
```

---

### POST /api/tools/content-brief

Generate content brief.

**Request**:
```json
{
  "keyword": "seo best practices",
  "content_type": "blog"
}
```

**Response** (Success - 200):
```json
{
  "outline": [
    "Giới thiệu về SEO", // Localized based on request language
    "Các kỹ thuật SEO quan trọng",
    "Công cụ SEO hữu ích"
  ],
  "word_count": 2000,
  "related_topics": [
    "keyword research",
    "link building",
    "technical seo"
  ],
  "serp_insights": {
    "top_ranking_topics": [...]
  }
}
```

---

### POST /api/tools/content-optimizer

Optimize content in real-time.

**Request**:
```json
{
  "content": "Your article content here...",
  "target_keyword": "seo tools"
}
```

**Response** (Success - 200):
```json
{
  "score": 78,
  "keyword_density": 1.8,
  "readability_score": 65,
  "suggestions": [
    "Tăng mật độ từ khóa lên 2-3%", // Localized
    "Chia nhỏ đoạn văn để dễ đọc hơn"
  ],
  "metrics": {
    "word_count": 1500,
    "sentence_count": 75,
    "paragraph_count": 12
  }
}
```

---

## Webhook Endpoints

### POST /api/webhooks/casso

CASSO payment webhook handler.

**Authentication**: CASSO webhook signature

**Request** (from CASSO):
```json
{
  "amount": 500000,
  "description": "NAPTIEN user@example.com",
  "transaction_id": "FT123456789",
  "when": "2025-11-23T14:30:00Z"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Payment verified"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Localized error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

### Common Error Codes

| Code | HTTP | Vi Message | En Message |
|------|------|------------|------------|
| INVALID_TOKEN | 401 | Token không hợp lệ | Invalid token |
| TOKEN_EXPIRED | 401 | Token đã hết hạn | Token expired |
| RATE_LIMIT | 429 | Vượt quá giới hạn sử dụng | Rate limit exceeded |
| INVALID_INPUT | 400 | Dữ liệu không hợp lệ | Invalid input |
| TURNSTILE_FAILED | 400 | Xác thực bảo mật thất bại | Security verification failed |
| OTP_EXPIRED | 401 | Mã OTP đã hết hạn | OTP code expired |
| OTP_INVALID | 401 | Mã OTP không đúng | Invalid OTP code |

---

## Rate Limiting

### Free Tier
- Keyword Research: 5/month
- On-page SEO: 3/month
- Backlink Analyzer: 2/month
- Content Brief: 2/month
- Content Optimizer: 10/month
- Content Audit: 5/month

### Pro Tier
- All tools: Unlimited (với reasonable use policy)

**Rate Limit Response**:
```json
{
  "error": "Vượt quá giới hạn sử dụng", // Localized
  "limit": 5,
  "used": 5,
  "reset_date": "2025-12-01",
  "upgrade_url": "/upgrade-to-pro"
}
```

---

## Language Preference Storage

### User Language Preference

Language preference is stored in:
1. **Client-side**: localStorage (`marketer_suite_lang`)
2. **Server-side**: User record in D1 database

**Update language preference**:

POST /api/user/preferences
```json
{
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "language": "en"
}
```

---

## Testing

### Local Development

Test with different languages:

```bash
# Vietnamese request
curl -H "Accept-Language: vi" \
     -H "Authorization: Bearer <token>" \
     http://localhost:8787/api/tools/keyword-research?keyword=seo

# English request
curl -H "Accept-Language: en" \
     -H "Authorization: Bearer <token>" \
     http://localhost:8787/api/tools/keyword-research?keyword=seo
```

---

## SDKs & Client Libraries

### JavaScript/TypeScript Example

```javascript
const API_BASE = 'https://api.marketer-suite.com';
const token = localStorage.getItem('jwt_token');
const lang = localStorage.getItem('marketer_suite_lang') || 'vi';

async function analyzeKeyword(keyword) {
  const response = await fetch(
    `${API_BASE}/api/tools/keyword-research?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': lang,
      },
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error); // Localized error message
  }
  
  return response.json();
}
```

---

## Changelog

### v1.1.0 (2025-11-23)
- ✨ Added i18n support (Vietnamese/English)
- ✨ Language preference in user profile
- ✨ Localized error messages
- ✨ Accept-Language header support

### v1.0.0 (2025-11-01)
- 🎉 Initial API release
- ✅ Auth endpoints
- ✅ SEO tools
- ✅ Content tools
- ✅ Payment webhook

---

For more information, see:
- [I18N Implementation Guide](./I18N_IMPLEMENTATION.md)
- [Authentication Flow](./AUTHENTICATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
`;
