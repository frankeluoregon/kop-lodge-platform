globalThis.process ??= {}; globalThis.process.env ??= {};
async function hashToken(token) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function isValidAdminToken(token, storedHash) {
  if (!storedHash || !token) return false;
  const hash = await hashToken(token);
  return hash === storedHash;
}
function getAdminToken(request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  const auth = request.headers.get("authorization") ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export { getAdminToken as g, isValidAdminToken as i };
