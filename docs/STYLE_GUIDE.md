# Style Guide - Marketer Suite

## 1. Naming Convention & CSS Class Naming (BEM)

- Tuân thủ chuẩn **BEM (Block-Element-Modifier)** cho mọi lớp CSS:
  - `.block {}`  
  - `.block__element {}`  
  - `.block--modifier {}`
- Class name ngắn gọn, rõ ràng, dễ hiểu: ví dụ `.btn`, `.btn--primary`, `.header__nav`
- Tránh sử dụng nested selectors sâu hoặc !important trong CSS
- Sử dụng SCSS/PostCSS hoặc CSS Modules cho modularity và maintainability

---

## 2. i18n (Internationalization) Guidelines

### 2.1. Translation Key Usage

**ALWAYS use translation keys** thay vì hardcode text:

✅ **DO**:
```javascript
// Component
const title = t('tools.keywordResearch.name');
const button = `<button>${t('common.buttons.save')}</button>`;
```

❌ **DON'T**:
```javascript
// Hardcoded text
const title = 'Keyword Research';
const button = '<button>Save</button>';
```

### 2.2. Translation Key Naming Convention

- **Hierarchical structure**: `module.feature.element`
- **Lowercase with dots**: `auth.login.title`
- **Descriptive names**: `tools.keywordResearch.results.density`
- **Consistent across vi.js and en.js**

**Examples**:
```javascript
t('common.buttons.save')           // Common UI elements
t('auth.errors.invalidOtp')        // Error messages
t('dashboard.greeting')            // Page-specific text
t('tools.onpageSeo.score')        // Tool-specific labels
```

### 2.3. Parameter Interpolation

Sử dụng `{{param}}` syntax cho dynamic values:

```javascript
// Translation file
{
  greeting: "Xin chào, {{name}}!",
  usage: "Đã dùng {{used}}/{{total}}"
}

// Usage
t('greeting', { name: userName })
t('usage', { used: 5, total: 10 })
```

### 2.4. Component i18n Integration

**Subscribe to language changes** trong reactive components:

```javascript
import { t, onLanguageChange } from '../utils/i18n.js';

class MyComponent {
  constructor() {
    this.unsubscribe = onLanguageChange(() => {
      this.render(); // Re-render when language changes
    });
  }
  
  render() {
    this.container.innerHTML = `
      <h1>${t('dashboard.title')}</h1>
      <p>${t('dashboard.description')}</p>
    `;
  }
  
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe(); // Cleanup
    }
  }
}
```

### 2.5. CSS for i18n

**Language-specific styles**:

```css
/* Vietnamese font optimization */
:lang(vi) {
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* English font optimization */
:lang(en) {
  font-family: 'Inter', 'Arial', sans-serif;
}

/* Handle text overflow for longer translations */
.tool-card__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 2.6. Adding New Translations

**Workflow**:
1. Add key to `packages/frontend/src/locales/vi.js`
2. Add same key to `packages/frontend/src/locales/en.js`
3. Use `t('your.new.key')` in code
4. Test both languages
5. Check console for missing translation warnings

**Example**:

```javascript
// vi.js
export default {
  // ...
  newFeature: {
    title: 'Tính năng mới',
    description: 'Mô tả chi tiết',
  },
};

// en.js
export default {
  // ...
  newFeature: {
    title: 'New Feature',
    description: 'Detailed description',
  },
};
```

---

## 3. Comment Code

- Comment rõ ràng tại:
  - Các hàm/phương thức phức tạp hoặc có thuật toán không đơn giản  
  - API endpoint, xử lý business logic quan trọng  
  - Workarounds hoặc đoạn code đặc biệt cần chú ý
  - **i18n integration points**
- Comment theo chuẩn **JSDoc** cho JS/TS, ví dụ:

```javascript
/**
 * Get translated tool name
 * @param {string} toolId - Tool identifier
 * @returns {string} Localized tool name
 */
function getToolName(toolId) {
  return t(`tools.${toolId}.name`);
}
```

- Comment HTML chỉ dùng để đánh dấu các vùng lớn, cấu trúc
- Tránh comment thừa gây rối code

---

## 4. Thiết Kế Giao Diện

- Ưu tiên thiết kế **desktop-first** cho marketer (độ phân giải > 1280px)
- Hỗ trợ responsive tối thiểu cho tablet breakpoint (~768px)
- Sử dụng bảng màu & font chữ chuẩn theo brand guideline
- **Icon SVG:**  
  - Toàn bộ icon dưới dạng SVG chất lượng cao  
  - Áp dụng hệ thống **Flaticons** đồng bộ toàn trang
- **i18n-aware layouts**:
  - Accommodate longer text in English
  - Use flexible containers (flex/grid)
  - Avoid fixed widths for text elements
- Không dùng inline style trừ trường hợp bất khả kháng

---

## 5. Cấu Trúc & Phong Cách Code Frontend

### 5.1. Component Structure

```javascript
/**
 * Component file structure
 */
import { t, onLanguageChange } from '../utils/i18n.js';

class ComponentName {
  constructor(container) {
    this.container = container;
    this.state = {};
    this.unsubscribe = null;
    this.init();
  }
  
  init() {
    this.setupI18n();
    this.render();
    this.attachEventListeners();
  }
  
  setupI18n() {
    this.unsubscribe = onLanguageChange(() => this.render());
  }
  
  render() {
    // Use t() for all user-facing text
    this.container.innerHTML = `
      <div class="component">
        <h2>${t('component.title')}</h2>
      </div>
    `;
  }
  
  attachEventListeners() {
    // Event handlers
  }
  
  destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
```

### 5.2. Module Organization

- Component theo chức năng, tái sử dụng cao
- Logic tách riêng presentation
- **Always import i18n utilities** at the top
- Code rõ ràng, dễ đọc

---

## 6. Coding Practices Backend

### 6.1. TypeScript Standards

- Strict TypeScript với kiểu rõ ràng
- Kiểm tra lỗi & validate dữ liệu đầy đủ
- Sử dụng async/await để quản lý bất đồng bộ

### 6.2. i18n Backend Integration

**Language detection middleware**:

```typescript
// packages/workers/src/middleware/language.ts
export function getLanguage(request: Request): 'vi' | 'en' {
  const header = request.headers.get('Accept-Language');
  const lang = header?.split(',')[0]?.split('-')[0];
  return ['vi', 'en'].includes(lang) ? lang : 'vi';
}
```

**Localized error messages**:

```typescript
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

function getError(code: string, lang: string) {
  return ERROR_MESSAGES[lang][code];
}
```

**API responses**:

```typescript
// Include language in request
const lang = getLanguage(request);

return new Response(
  JSON.stringify({
    error: getError('INVALID_TOKEN', lang),
  }),
  { status: 401 }
);
```

### 6.3. Configuration Management

- Quản lý config & secrets qua biến môi trường
- Không hardcode credentials

---

## 7. Accessibility

- Tuân thủ WCAG cơ bản:
  - Sử dụng `aria-label` cho buttons/inputs
  - Language switching with `aria-label`
  - Semantic HTML (`<main>`, `<nav>`, `<section>`)
- **i18n accessibility**:
  - Update `<html lang="">` attribute dynamically
  - Provide translated `aria-label` attributes
  - Screen reader friendly language toggle

```javascript
// Update HTML lang attribute
document.documentElement.lang = getCurrentLanguage();

// Translated aria-label
`<button aria-label="${t('common.buttons.save')}">
  ${t('common.buttons.save')}
</button>`
```

---

## 8. Performance & Testing

### 8.1. Performance

- Tối ưu SVG và resource
- **i18n performance**:
  - Translations cached in memory
  - No external API calls
  - Fast language switching (~50ms)
  - Small bundle size (~10KB total)

### 8.2. Testing

**i18n testing checklist**:
- [ ] Test với cả Vietnamese và English
- [ ] Verify tất cả text được translate
- [ ] Check console không có missing translation warnings
- [ ] Test UI layout với cả 2 ngôn ngữ (text length)
- [ ] Test language toggle functionality
- [ ] Test parameter interpolation
- [ ] Verify localStorage persistence

```javascript
// Example test
setLanguage('vi');
assert(t('common.buttons.save') === 'Lưu');

setLanguage('en');
assert(t('common.buttons.save') === 'Save');
```

---

## 9. Quy Tắc Giao Tiếp Với Codebase

- Luôn review code nghiêm ngặt về:
  - Readability
  - Maintainability
  - **i18n compliance** (no hardcoded text)
- Git commit messages theo conventional commits:
  - `feat: Add Vietnamese translation for tools`
  - `fix: Correct English translation typo`
  - `i18n: Add language preference persistence`

---

## 10. i18n Checklist for Developers

**Before committing code**:

- [ ] All user-facing text uses `t()` function
- [ ] Translation keys added to both `vi.js` and `en.js`
- [ ] Component subscribes to language changes if reactive
- [ ] Console has no missing translation warnings
- [ ] Tested with both Vietnamese and English
- [ ] UI layout works with both languages
- [ ] Parameter interpolation tested
- [ ] Language toggle component included where needed
- [ ] Backend sends `Accept-Language` header
- [ ] API returns localized error messages

---

## Mục lục tài liệu liên quan  

- [README.md](../README.md)  
- [ARCHITECTURE.md](./ARCHITECTURE.md)  
- [I18N_IMPLEMENTATION.md](./I18N_IMPLEMENTATION.md)
- [AUTHENTICATION.md](./AUTHENTICATION.md)  
- [TURNSTILE_SETUP.md](./TURNSTILE_SETUP.md)  
- [PAYMENT_INTEGRATION.md](./PAYMENT_INTEGRATION.md)  
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)  
- [TOOLS_SPECIFICATION.md](./TOOLS_SPECIFICATION.md)  
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
- [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Mọi dev đều phải tuân thủ style guide này để đảm bảo chất lượng, hiệu quả phát triển và trải nghiệm người dùng tối ưu nhất, đặc biệt là hỗ trợ đa ngôn ngữ.**
