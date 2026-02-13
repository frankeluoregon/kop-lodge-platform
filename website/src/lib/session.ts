/**
 * Encrypted cookie sessions using AES-GCM (Web Crypto API).
 * SESSION_SECRET env var must be a 32-character (256-bit) hex string.
 */

export interface SessionData {
  email: string;
  groups: string[];
  exp: number; // Unix timestamp (seconds)
}

async function getKey(secret: string): Promise<CryptoKey> {
  const raw = new Uint8Array(
    secret.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
  );
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptSession(
  data: SessionData,
  secret: string,
): Promise<string> {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext,
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptSession(
  token: string,
  secret: string,
): Promise<SessionData | null> {
  try {
    const key = await getKey(secret);
    const combined = Uint8Array.from(atob(token), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    const data = JSON.parse(new TextDecoder().decode(plaintext)) as SessionData;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export function getSessionCookie(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)kop_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function makeSessionCookie(value: string, maxAge = 86400): string {
  return `kop_session=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return "kop_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}
