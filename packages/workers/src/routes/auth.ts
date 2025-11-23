import { signJWT } from "../utils/jwt";
import { messages } from "../utils/i18n";

// Gửi OTP qua webhook N8N
async function sendOTPViaWebhook(email: string, code: string, language: string) {
  await fetch("https://n8n.ducvu.vn/webhook/microtools-email-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, language }),
  });
}

function respond(lang: string, key: keyof typeof messages, data: any = {}, success = false) {
  return Response.json({ success, message: messages[key][lang], ...data }, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export async function handleAuth(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const body = await request.json().catch(() => ({}));
  const lang = body.language || "vi";

  // === REGISTER / LOGIN: gửi OTP ===
  if (path === "/api/auth/register") {
    const { email } = body;
    if (!email || typeof email !== "string") {
      return respond(lang, "invalidEmail");
    }
    let user = await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first();
    if (!user) {
      await env.DB.prepare(
        "INSERT INTO users (email, tier, payment_status, language, created_at) VALUES (?, 'free', 'inactive', ?, ?)"
      ).bind(email, lang, Date.now()).run();
    }
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    await env.DB.prepare("INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)")
      .bind(email, otp, expires).run();
    await sendOTPViaWebhook(email, otp, lang);
    return respond(lang, "otpSent", { email, otp }, true); // otp để test dev
  }

  // === RESEND OTP ===
  if (path === "/api/auth/resend-otp") {
    const { email } = body;
    if (!email || typeof email !== "string") {
      return respond(lang, "invalidEmail");
    }
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    await env.DB.prepare("INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)")
      .bind(email, otp, expires).run();
    await sendOTPViaWebhook(email, otp, lang);
    return respond(lang, "otpResent", { email, otp }, true);
  }

  // === VERIFY OTP ===
  if (path === "/api/auth/verify-otp") {
    const { email, code } = body;
    if (!email || !code) {
      return respond(lang, "missingOtp");
    }
    const row = await env.DB.prepare(
      "SELECT * FROM otp_codes WHERE email=? AND code=? AND expires_at >=?"
    ).bind(email, code, Date.now()).first();
    if (!row) {
      return respond(lang, "otpInvalid");
    }
    const user = await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first();
    if (!user) {
      return respond(lang, "notFound");
    }
    const jwtPayload = { id: user.id, email: user.email, tier: user.tier, language: user.language };
    const token = await signJWT(jwtPayload, env.JWT_SECRET); // await nếu Promise
    return Response.json({ success: true, message: messages.authSuccess[lang], token, user: jwtPayload });
  }

  // === Demo: Route bảo vệ JWT ===
  if (path === "/api/protected") {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace(/^Bearer /, "");
    const user = token ? (await import("../utils/jwt")).verifyJWT(token, env.JWT_SECRET) : null;
    if (!user) {
      return respond(lang, "sessionExpired");
    }
    return Response.json({ success: true, user });
  }

  return respond(lang, "apiNotFound");
}
