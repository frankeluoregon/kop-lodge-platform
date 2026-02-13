import type { APIRoute } from "astro";
import { exchangeCode } from "../../lib/auth";
import { encryptSession, makeSessionCookie } from "../../lib/session";

export const GET: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const url = new URL(request.url);
  const code  = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  // Read PKCE cookie
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pkceMatch = cookieHeader.match(/(?:^|;\s*)kop_pkce=([^;]+)/);
  if (!pkceMatch) {
    return new Response("Missing PKCE cookie", { status: 400 });
  }

  let pkceData: { codeVerifier: string; state: string };
  try {
    pkceData = JSON.parse(decodeURIComponent(pkceMatch[1]));
  } catch {
    return new Response("Invalid PKCE cookie", { status: 400 });
  }

  if (pkceData.state !== state) {
    return new Response("State mismatch", { status: 400 });
  }

  let redirectTo = "/";
  try {
    const stateData = JSON.parse(atob(state)) as { redirect?: string };
    if (stateData.redirect) redirectTo = stateData.redirect;
  } catch {
    // use default redirect
  }

  const callbackUrl = `${url.origin}/auth/callback`;

  let sessionData;
  try {
    sessionData = await exchangeCode(
      env.OIDC_ISSUER,
      env.OIDC_CLIENT_ID,
      env.OIDC_CLIENT_SECRET,
      callbackUrl,
      code,
      pkceData.codeVerifier,
    );
  } catch (err) {
    return new Response(`Authentication failed: ${String(err)}`, { status: 500 });
  }

  const encryptedSession = await encryptSession(sessionData, env.SESSION_SECRET);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": [
        makeSessionCookie(encryptedSession),
        // Clear PKCE cookie
        "kop_pkce=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
      ].join(", "),
    },
  });
};
