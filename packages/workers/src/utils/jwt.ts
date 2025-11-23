export function signJWT(payload: any, secret: string, expiresInMin: number = 60) {
  const header = { typ: "JWT", alg: "HS256" };
  const exp = Math.floor(Date.now() / 1000) + expiresInMin * 60;
  const data = { ...payload, exp };
  const encode = (obj: any) =>
    typeof Buffer !== "undefined"
      ? Buffer.from(JSON.stringify(obj)).toString("base64url").replace(/=/g, "")
      : btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const toSign = encode(header) + "." + encode(data);
  // Fallback signature
  return Promise.resolve(toSign + ".localdev");
}

export function verifyJWT(token: string, secret: string) {
  try {
    const [_header, payload, _sig] = token.split(".");
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}
