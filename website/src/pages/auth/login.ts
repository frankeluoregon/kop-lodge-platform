import type { APIRoute } from "astro";
import { buildAuthorizationUrl } from "../../lib/auth";

export const GET: APIRoute = async ({ request, locals, redirect }) => {
  const env = locals.runtime.env;
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/";

  const state = btoa(JSON.stringify({ redirect: redirectTo, nonce: crypto.randomUUID() }));
  const callbackUrl = `${url.origin}/auth/callback`;

  const { url: authUrl, codeVerifier } = await buildAuthorizationUrl(
    env.OIDC_ISSUER,
    env.OIDC_CLIENT_ID,
    callbackUrl,
    state,
  );

  // Store PKCE verifier + state in a short-lived cookie
  const pkcePayload = JSON.stringify({ codeVerifier, state });
  const pkgeCookie = `kop_pkce=${encodeURIComponent(pkcePayload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      "Set-Cookie": pkgeCookie,
    },
  });
};
