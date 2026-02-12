/**
 * Simple token-based admin authentication.
 * The admin token is stored as a SHA-256 hex hash in the ADMIN_TOKEN_HASH env var.
 * To generate: echo -n "your-secret-token" | sha256sum
 */

export async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminToken(
  token: string,
  storedHash: string,
): Promise<boolean> {
  if (!storedHash || !token) return false;
  const hash = await hashToken(token);
  return hash === storedHash;
}

export function getAdminToken(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  // Also check Authorization header for API calls
  const auth = request.headers.get("authorization") ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}
