globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, n as defineStyleVars, g as addAttribute, l as renderHead, o as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_XPN6sfq-.mjs';
import { g as getAdminToken, i as isValidAdminToken } from './auth_B4Zu3cps.mjs';
import { g as getConfig } from './db_DFm1mHTU.mjs';
/* empty css                        */

const $$Astro = createAstro();
const $$AdminForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminForm;
  const { title, backUrl = "/admin", backLabel = "\u2190 Dashboard" } = Astro2.props;
  const { DB, ADMIN_TOKEN_HASH } = Astro2.locals.runtime.env;
  const token = getAdminToken(Astro2.request);
  const authed = await isValidAdminToken(token ?? "", ADMIN_TOKEN_HASH ?? "");
  if (!authed) return Astro2.redirect("/admin/login", 302);
  const config = await getConfig(DB);
  const primary = config.primary_color || "#4B0082";
  const accent = config.accent_color || "#FFD700";
  const $$definedVars = defineStyleVars([{ primary, accent }]);
  return renderTemplate`<html lang="en" data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} – Admin</title>${renderHead()}</head> <body data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}> <div class="topbar" data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}> <span class="brand" data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}>${config.lodge_name} — Admin</span> <nav data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}> <a href="/" data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}>View Site</a> <a href="/admin" data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}>Dashboard</a> <a href="/admin/logout" data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}>Log out</a> </nav> </div> <main data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}> <a class="back-link"${addAttribute(backUrl, "href")} data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}>${backLabel}</a> <h1 data-astro-cid-mhkynpfp${addAttribute($$definedVars, "style")}>${title}</h1> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/layouts/AdminForm.astro", void 0);

export { $$AdminForm as $ };
