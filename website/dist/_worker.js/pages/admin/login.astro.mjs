globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, l as renderHead, r as renderTemplate, h as createAstro } from '../../chunks/astro/server_XPN6sfq-.mjs';
import { i as isValidAdminToken } from '../../chunks/auth_B4Zu3cps.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const { ADMIN_TOKEN_HASH } = Astro2.locals.runtime.env;
  let error = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const token = form.get("token")?.toString() ?? "";
    const valid = await isValidAdminToken(token, ADMIN_TOKEN_HASH ?? "");
    if (valid) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin",
          "Set-Cookie": `admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
        }
      });
    }
    error = "Invalid token. Please try again.";
  }
  return renderTemplate`<html lang="en" data-astro-cid-rf56lckb> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Login</title>${renderHead()}</head> <body data-astro-cid-rf56lckb> <div class="card" data-astro-cid-rf56lckb> <h1 data-astro-cid-rf56lckb>⚔ Lodge Admin</h1> <p class="sub" data-astro-cid-rf56lckb>Enter your admin token to continue.</p> ${error && renderTemplate`<p class="error" data-astro-cid-rf56lckb>${error}</p>`} <form method="POST" data-astro-cid-rf56lckb> <label for="token" data-astro-cid-rf56lckb>Admin Token</label> <input type="password" id="token" name="token" required autofocus placeholder="Enter token..." data-astro-cid-rf56lckb> <button type="submit" data-astro-cid-rf56lckb>Sign In</button> </form> </div> </body></html>`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/login.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
