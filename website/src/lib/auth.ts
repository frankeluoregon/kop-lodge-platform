/**
 * OIDC-based authentication for the admin panel.
 * Compatible with Authentik (and any OIDC-compliant provider).
 *
 * Required env vars (set via wrangler secret):
 *   OIDC_ISSUER        - e.g. https://auth.example.com/application/o/kop/
 *   OIDC_CLIENT_ID     - OAuth2 client ID
 *   OIDC_CLIENT_SECRET - OAuth2 client secret
 *   SESSION_SECRET     - 64-char hex string (32 bytes) for AES-GCM
 *
 * Groups in your OIDC provider control access:
 *   kop-admin          → access all lodge admin panels
 *   kop-{lodge-slug}   → access that specific lodge's admin panel
 */

import {
  decryptSession,
  getSessionCookie,
  type SessionData,
} from "./session.js";

export type { SessionData };

export interface AuthEnv {
  OIDC_ISSUER: string;
  OIDC_CLIENT_ID: string;
  SESSION_SECRET: string;
}

/** Returns true if OIDC is properly configured (not placeholder values). */
export function isOidcConfigured(env: AuthEnv): boolean {
  return !!env.OIDC_ISSUER && !env.OIDC_ISSUER.includes("example.com");
}

/** Dev-mode session used when OIDC is not configured. */
export const DEV_SESSION: SessionData = {
  email: "dev@local",
  groups: ["kop-admin"],
  exp: Math.floor(Date.now() / 1000) + 86400 * 365,
};

/** Returns the session if the user is authenticated, otherwise null. */
export async function getSession(
  request: Request,
  env: AuthEnv,
): Promise<SessionData | null> {
  const token = getSessionCookie(request);
  if (!token) return null;
  return decryptSession(token, env.SESSION_SECRET);
}

/**
 * Check if a session has access to a specific lodge admin.
 * Returns true if the user is in 'kop-admin' or 'kop-{lodgeSlug}'.
 */
export function canAccessLodge(
  session: SessionData,
  lodgeSlug: string,
): boolean {
  return (
    session.groups.includes("kop-admin") ||
    session.groups.includes(`kop-${lodgeSlug}`)
  );
}

/** Build the OIDC authorization URL with PKCE. */
export async function buildAuthorizationUrl(
  issuer: string,
  clientId: string,
  redirectUri: string,
  state: string,
): Promise<{ url: string; codeVerifier: string }> {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
  const codeVerifier = btoa(String.fromCharCode(...verifierBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const authEndpoint = `${issuer.replace(/\/$/, "")}/authorize`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid email profile groups",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return { url: `${authEndpoint}?${params}`, codeVerifier };
}

/** Exchange authorization code for tokens and extract session data. */
export async function exchangeCode(
  issuer: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string,
  codeVerifier: string,
): Promise<SessionData> {
  const tokenEndpoint = `${issuer.replace(/\/$/, "")}/token`;
  const res = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const tokens = (await res.json()) as { id_token: string };
  return decodeIdToken(tokens.id_token);
}

/** Decode JWT payload (token was just issued by trusted OIDC server). */
function decodeIdToken(idToken: string): SessionData {
  const [, payloadB64] = idToken.split(".");
  const payload = JSON.parse(
    atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")),
  ) as {
    email?: string;
    sub?: string;
    groups?: string[];
    exp?: number;
  };

  const email = payload.email ?? payload.sub ?? "unknown";
  const groups = payload.groups ?? [];
  const exp = payload.exp ?? Math.floor(Date.now() / 1000) + 86400;

  return { email, groups, exp };
}
