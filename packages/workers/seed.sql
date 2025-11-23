-- Seed test users for local development
INSERT INTO users (email, tier, language, payment_status, created_at) VALUES
('test-vi@example.com', 'free', 'vi', 'inactive', strftime('%s', 'now') * 1000),
('test-en@example.com', 'free', 'en', 'inactive', strftime('%s', 'now') * 1000),
('pro-vi@example.com', 'pro', 'vi', 'active', strftime('%s', 'now') * 1000),
('pro-en@example.com', 'pro', 'en', 'active', strftime('%s', 'now') * 1000);

-- Test OTP code (expires in 5 minutes from now)
INSERT INTO otp_codes (email, code, expires_at) VALUES
('test-vi@example.com', '123456', strftime('%s', 'now') * 1000 + 300000),
('test-en@example.com', '654321', strftime('%s', 'now') * 1000 + 300000);
