# I18n Implementation Guide - Marketer Suite

## Tổng quan

Hệ thống i18n (internationalization) của Marketer Suite hỗ trợ song ngữ **Tiếng Việt** và **Tiếng Anh**, cho phép người dùng chuyển đổi linh hoạt giữa hai ngôn ngữ.

---

## Kiến trúc i18n

### 1. Core Components

```
packages/frontend/src/
├── context/
│   └── LanguageContext.js      # Global state management
├── locales/
│   ├── vi.js                    # Vietnamese translations
│   └── en.js                    # English translations
├── utils/
│   └── i18n.js                  # Utility functions
└── components/
    └── LanguageToggle.js        # Language switcher UI
```

### 2. LanguageContext

**Chức năng chính**:
- Quản lý ngôn ngữ hiện tại (default: `vi`)
- Lưu trữ preference vào `localStorage`
- Publish/Subscribe pattern cho language changes
- Load và quản lý translation files
- Translation với parameter interpolation
- Hỗ trợ dot notation cho nested keys

**API Methods**:
```javascript
// Get/Set language
languageContext.getLanguage()           // Returns: 'vi' | 'en'
languageContext.setLanguage('en')      // Switch to English
languageContext.toggleLanguage()       // Toggle vi ↔ en

// Translations
languageContext.t('common.buttons.save')                    // "Lưu" or "Save"
languageContext.t('dashboard.greeting', { name: 'John' })   // "Xin chào, John!" or "Hello, John!"

// Subscribe to changes
const unsubscribe = languageContext.subscribe((lang) => {
  console.log('Language changed to:', lang);
});
```

### 3. Translation Files Structure

**Cấu trúc JSON nested**:
```javascript
// vi.js / en.js
export default {
  common: {
    buttons: { save: 'Lưu', cancel: 'Hủy' },
    messages: { loading: 'Đang tải...' },
  },
  auth: {
    login: { title: 'Đăng nhập', subtitle: '...' },
  },
  tools: {
    keywordResearch: { name: 'Nghiên cứu Từ khóa', ... },
  },
};
```

**Quy tắc tổ chức**:
- Group theo module/feature (`common`, `auth`, `tools`, `dashboard`)
- Nested structure để dễ quản lý
- Consistent keys giữa `vi.js` và `en.js`
- Sử dụng `{{param}}` cho dynamic values

---

## Hướng dẫn sử dụng

### Frontend Implementation

#### 1. Import utilities
```javascript
import { t, getCurrentLanguage, setLanguage, onLanguageChange } from './utils/i18n.js';
```

#### 2. Sử dụng trong HTML templates
```javascript
function render() {
  const html = `
    <h1>${t('dashboard.title')}</h1>
    <p>${t('dashboard.greeting', { name: userName })}</p>
    <button>${t('common.buttons.save')}</button>
  `;
  container.innerHTML = html;
}
```

#### 3. Reactive UI updates
```javascript
class MyComponent {
  constructor() {
    this.unsubscribe = onLanguageChange(() => {
      this.render(); // Re-render khi ngôn ngữ thay đổi
    });
  }
  
  destroy() {
    this.unsubscribe(); // Cleanup
  }
}
```

#### 4. Language Toggle Component
```javascript
import LanguageToggle from './components/LanguageToggle.js';

const toggleContainer = document.getElementById('lang-toggle');
const languageToggle = new LanguageToggle(toggleContainer);
```

#### 5. Format utilities
```javascript
import { formatNumber, formatDate, formatCurrency } from './utils/i18n.js';

formatNumber(1234567);                    // "1.234.567" (vi) or "1,234,567" (en)
formatDate(new Date());                   // "23 tháng 11, 2025" (vi) or "November 23, 2025" (en)
formatCurrency(500000);                   // "500.000 ₫" (vi) or "₫500,000" (en)
```

---

## Backend Integration

### 1. API Language Header

**Request Header**:
```
Accept-Language: vi
```

**Workers middleware**:
```typescript
// packages/workers/src/middleware/language.ts
export function getLanguageFromRequest(request: Request): string {
  const header = request.headers.get('Accept-Language');
  const lang = header?.split(',')[0]?.split('-')[0] || 'vi';
  return ['vi', 'en'].includes(lang) ? lang : 'vi';
}
```

### 2. Localized Error Messages

```typescript
// packages/workers/src/utils/errors.ts
const ERROR_MESSAGES = {
  vi: {
    INVALID_TOKEN: 'Token không hợp lệ',
    RATE_LIMIT: 'Vượt quá giới hạn sử dụng',
  },
  en: {
    INVALID_TOKEN: 'Invalid token',
    RATE_LIMIT: 'Rate limit exceeded',
  },
};

export function getErrorMessage(code: string, lang: string): string {
  return ERROR_MESSAGES[lang]?.[code] || ERROR_MESSAGES.en[code];
}
```

### 3. Email Templates

**N8N webhook với language parameter**:
```typescript
// Send OTP email
await fetch(N8N_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({
    email: user.email,
    otp: otpCode,
    language: userLanguage, // 'vi' or 'en'
  }),
});
```

**N8N workflow**:
- Separate email templates cho vi/en
- Route dựa trên `language` field

---

## Best Practices

### 1. Translation Keys Naming

✅ **DO**:
```javascript
t('tools.keywordResearch.name')           // Clear hierarchy
t('common.messages.loading')              // Reusable common strings
t('auth.errors.invalidOtp')               // Context-specific errors
```

❌ **DON'T**:
```javascript
t('KR_NAME')                              // Unclear abbreviation
t('loading_message')                      // Flat structure
t('error1')                               // Non-descriptive
```

### 2. Parameter Interpolation

✅ **DO**:
```javascript
// Translation file
{ greeting: "Xin chào, {{name}}! Bạn có {{count}} tin nhắn mới." }

// Usage
t('greeting', { name: 'John', count: 5 })
```

❌ **DON'T**:
```javascript
// Concatenation (hard to translate)
`Xin chào, ${name}! Bạn có ${count} tin nhắn mới.`
```

### 3. Handling Missing Translations

```javascript
// LanguageContext tự động log warning và return key
t('missing.key')  // Console: "Missing translation for key: missing.key in language: vi"
                  // Returns: "missing.key"
```

**Action**: Luôn kiểm tra console warnings và bổ sung translations thiếu

### 4. Testing Translations

```javascript
// Test both languages
setLanguage('vi');
assert(t('common.buttons.save') === 'Lưu');

setLanguage('en');
assert(t('common.buttons.save') === 'Save');
```

---

## Workflow thêm translations mới

### 1. Thêm key vào cả 2 files

**vi.js**:
```javascript
export default {
  // ...
  newFeature: {
    title: 'Tính năng mới',
    description: 'Mô tả tính năng',
  },
};
```

**en.js**:
```javascript
export default {
  // ...
  newFeature: {
    title: 'New Feature',
    description: 'Feature description',
  },
};
```

### 2. Sử dụng trong code

```javascript
const title = t('newFeature.title');
const desc = t('newFeature.description');
```

### 3. Test cả 2 ngôn ngữ

- Toggle language trong UI
- Verify text hiển thị đúng
- Check console không có warnings

---

## CSS Styling cho i18n

### Language-specific styles

```css
/* Adjust font for Vietnamese */
:lang(vi) {
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* Adjust font for English */
:lang(en) {
  font-family: 'Inter', 'Arial', sans-serif;
}

/* Language toggle component */
.language-toggle {
  display: flex;
  gap: 8px;
}

.language-toggle__btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.language-toggle__btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.language-toggle__btn:disabled {
  background: #007bff;
  color: white;
  border-color: #007bff;
  cursor: default;
}

.language-toggle__icon {
  font-size: 18px;
}

.language-toggle__text {
  font-weight: 600;
  margin-left: 4px;
}
```

---

## Performance Considerations

### 1. Lazy Loading Translations

```javascript
// Load only active language initially
const loadLanguage = async (lang) => {
  const translations = await import(`./locales/${lang}.js`);
  languageContext.loadTranslations(lang, translations.default);
};
```

### 2. Caching

- Translations được cache trong memory (LanguageContext)
- Language preference cached trong localStorage
- Không cần fetch lại khi refresh page

### 3. Bundle Size

- Total translation size: ~10KB (compressed)
- Minimal overhead cho application

---

## Troubleshooting

### Issue: Translations không update sau khi đổi ngôn ngữ

**Solution**: Đảm bảo component subscribe to language changes:
```javascript
onLanguageChange(() => this.render());
```

### Issue: Missing translation warning

**Solution**: 
1. Check key spelling trong translation file
2. Verify key exists trong cả `vi.js` và `en.js`
3. Đảm bảo translations đã load: `languageContext.loadTranslations()`

### Issue: Parameter interpolation không hoạt động

**Solution**: Sử dụng đúng syntax `{{param}}` trong translation string:
```javascript
// ✅ Correct
{ greeting: "Hello, {{name}}!" }

// ❌ Wrong
{ greeting: "Hello, ${name}!" }
```

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Vietnamese/English support
- ✅ Client-side language switching
- ✅ localStorage persistence
- ✅ Format utilities (number, date, currency)

### Phase 2 (Planned)
- [ ] Server-side language detection
- [ ] User language preference in database
- [ ] RTL language support (Arabic, Hebrew)
- [ ] Pluralization rules
- [ ] Translation management UI
- [ ] Export/Import translations (JSON/CSV)

### Phase 3 (Future)
- [ ] Automatic translation via AI
- [ ] Crowdsourced translation platform
- [ ] Translation versioning
- [ ] A/B testing for translations

---

## Checklist cho developers

- [ ] Đọc kỹ guide này trước khi implement i18n features
- [ ] Test với cả 2 ngôn ngữ (vi và en)
- [ ] Sử dụng `t()` function thay vì hardcode text
- [ ] Add translations vào cả `vi.js` và `en.js`
- [ ] Subscribe to language changes trong reactive components
- [ ] Test parameter interpolation
- [ ] Verify không có missing translation warnings
- [ ] Check UI layout với cả 2 ngôn ngữ (text length khác nhau)
- [ ] Document các translation keys mới trong PR

---

## Liên hệ

Nếu có câu hỏi về i18n implementation, liên hệ:
- Email: duc@ducvu.vn
- GitHub Issues: [marketer-suite/issues](https://github.com/vomodo/marketer-suite/issues)
