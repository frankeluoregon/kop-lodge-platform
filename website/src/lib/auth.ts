/**
 * Cloudflare Access authentication for the admin panel.
 *
 * Cloudflare Access sits in front of /admin and /{lodge}/admin routes,
 * handling login via its own UI. This module verifies the JWT
 * that Access injects into every authenticated request.
 *
 * Required env vars:
 *   CF_ACCESS_TEAM_NAME  - your Zero Trust team name (e.g. "myorg")
 *                          Used to fetch public keys from
 *                          https://<team>.cloudflareaccess.com/cdn-cgi/access/certs
 *
 * Role management is in the D1 `admin_roles` table:
 *   email  | role
 *   -------|-------------
 *   a@b.co | site-admin       → access /admin and all lodge admins
 *   c@d.co | lodge:my-lodge   → access /my-lodge/admin only
 */

type D1Database = import("@cloudflare/workers-types").D1Database;

export interface SessionData {
  email: string;
  roles: string[];
}

export interface AuthEnv {
  CF_ACCESS_TEAM_NAME: string;
  DB: D1Database;
}

// --- Dev bypass ---

/** Returns true if Cloudflare Access is configured. */
export function isAccessConfigured(env: { CF_ACCESS_TEAM_NAME: string }): boolean {
  return !!env.CF_ACCESS_TEAM_NAME && env.CF_ACCESS_TEAM_NAME !== "your-team-name";
}

/** Dev-mode session used when Access is not configured. */
export const DEV_SESSION: SessionData = {
  email: "dev@local",
  roles: ["site-admin"],
};

// --- JWT verification ---

interface AccessJwtPayload {
  email: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

interface JwksKey {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg: string;
}

/** Cache public keys in memory for the lifetime of the Worker isolate. */
let cachedKeys: { keys: JwksKey[]; fetchedAt: number } | null = null;
const KEY_CACHE_TTL = 3600_000; // 1 hour

async function getPublicKeys(teamName: string): Promise<JwksKey[]> {
  if (cachedKeys && Date.now() - cachedKeys.fetchedAt < KEY_CACHE_TTL) {
    return cachedKeys.keys;
  }
  const url = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Access certs: ${res.status}`);
  const data = (await res.json()) as { keys: JwksKey[] };
  cachedKeys = { keys: data.keys, fetchedAt: Date.now() };
  return data.keys;
}

function base64UrlToArrayBuffer(b64url: string): ArrayBuffer {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const binary = atob(b64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function importRsaKey(jwk: JwksKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
}

/** Verify and decode the Cloudflare Access JWT. Returns the payload or null. */
async function verifyAccessJwt(
  token: string,
  teamName: string,
): Promise<AccessJwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const headerJson = JSON.parse(
      new TextDecoder().decode(base64UrlToArrayBuffer(parts[0])),
    ) as { kid: string; alg: string };

    const keys = await getPublicKeys(teamName);
    const matchingKey = keys.find((k) => k.kid === headerJson.kid);
    if (!matchingKey) return null;

    const key = await importRsaKey(matchingKey);
    const signature = base64UrlToArrayBuffer(parts[2]);
    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      signature,
      data,
    );
    if (!valid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToArrayBuffer(parts[1])),
    ) as AccessJwtPayload;

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    // Check issuer
    if (payload.iss !== `https://${teamName}.cloudflareaccess.com`) return null;

    return payload;
  } catch {
    return null;
  }
}

// --- Public API ---

/** Get session from Cloudflare Access JWT header. Returns null if invalid/missing. */
export async function getSession(
  request: Request,
  env: AuthEnv,
): Promise<SessionData | null> {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;

  const payload = await verifyAccessJwt(token, env.CF_ACCESS_TEAM_NAME);
  if (!payload) return null;

  // Look up roles from DB
  const roles = await getUserRoles(env.DB, payload.email);

  return { email: payload.email, roles };
}

/** Check if user is a site admin. */
export function isSiteAdmin(session: SessionData): boolean {
  return session.roles.includes("site-admin");
}

/**
 * Check if a session has access to a specific lodge admin.
 * Returns true if the user is a site-admin or has lodge:{slug} role.
 */
export function canAccessLodge(
  session: SessionData,
  lodgeSlug: string,
): boolean {
  return (
    session.roles.includes("site-admin") ||
    session.roles.includes(`lodge:${lodgeSlug}`)
  );
}

// --- DB role management ---

/** Get all roles for an email address. */
export async function getUserRoles(
  db: D1Database,
  email: string,
): Promise<string[]> {
  const res = await db
    .prepare("SELECT role FROM admin_roles WHERE email = ?")
    .bind(email.toLowerCase())
    .all<{ role: string }>();
  return res.results.map((r) => r.role);
}

/** Add a role for a user. */
export async function addUserRole(
  db: D1Database,
  email: string,
  role: string,
): Promise<void> {
  await db
    .prepare("INSERT OR IGNORE INTO admin_roles (email, role) VALUES (?, ?)")
    .bind(email.toLowerCase(), role)
    .run();
}

/** Remove a role from a user. */
export async function removeUserRole(
  db: D1Database,
  email: string,
  role: string,
): Promise<void> {
  await db
    .prepare("DELETE FROM admin_roles WHERE email = ? AND role = ?")
    .bind(email.toLowerCase(), role)
    .run();
}
