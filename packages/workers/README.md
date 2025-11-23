# Production Deployment Checklist

## 🚀 Chuẩn bị Environment Production

### 1. Tạo D1 database production
```bash
wrangler d1 create marketer-suite-prod
```

### 2. Run migrations cho database production
```bash
wrangler d1 migrations apply marketer-suite-prod --env production
```

### 3. Tạo KV Namespace cho production
- Vào Cloudflare Dashboard > Workers > KV
- Tạo 2 namespace: `JWT_CACHE` và `SESSIONS`
- Lấy ID và ghi vào wrangler.toml phần production

### 4. Đặt secrets cho production
```bash
wrangler secret put JWT_SECRET --env production
wrangler secret put N8N_WEBHOOK_URL --env production
wrangler secret put TURNSTILE_SECRET --env production
wrangler secret put CASSO_API_KEY --env production
wrangler secret put CASSO_WEBHOOK_SECRET --env production
```

### 5. Deploy sản phẩm production
```bash
npm run deploy:prod
```

### 6. Kiểm tra health check production
```bash
curl https://marketer-suite-api.workers.dev/health
```

### 7. Checklist pre-production
- [ ] Đã migrate DB production thành công
- [ ] OTP KHÔNG xuất hiện trong response
- [ ] JWT có signature real (KHÔNG phải .localdev)
- [ ] Webhook hoạt động thật sự, nhận email
- [ ] Tất cả secrets đã đặt đủ
- [ ] Rate limiting middleware hoạt động
- [ ] Turnstile middleware hoạt động
- [ ] SSL/TLS OK
- [ ] CORS đúng domain production
