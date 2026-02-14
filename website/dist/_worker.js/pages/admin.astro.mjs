globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, l as defineStyleVars, g as addAttribute, n as renderHead, r as renderTemplate, k as renderComponent, o as Fragment, h as createAstro } from '../chunks/astro/server_BIT25mF3.mjs';
import { i as isOidcConfigured, g as getSession, D as DEV_SESSION } from '../chunks/auth_Bz-wnKq4.mjs';
import { b as getAllLodgesAdmin } from '../chunks/db_BhdykiHH.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const env = Astro2.locals.runtime.env;
  let session;
  if (isOidcConfigured(env)) {
    session = await getSession(Astro2.request, env);
    if (!session || !session.groups.includes("kop-admin")) {
      const redirect = encodeURIComponent(Astro2.url.pathname);
      return Astro2.redirect(`/auth/login?redirect=${redirect}`, 302);
    }
  } else {
    session = DEV_SESSION;
  }
  const lodges = await getAllLodgesAdmin(env.DB);
  const primary = "#252e67";
  const accent = "#f5a71c";
  const secondary = "#a91e23";
  const neutral = "#4a5072";
  const $$definedVars = defineStyleVars([{ primary, accent, secondary, neutral }]);
  return renderTemplate`<html lang="en" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Site Admin – Oregon Knights of Pythias</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <div class="tricolor-stripe" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <span${addAttribute(`${`background:${primary}`}; ${$$definedVars}`, "style")} data-astro-cid-u2h3djql></span> <span${addAttribute(`${`background:${secondary}`}; ${$$definedVars}`, "style")} data-astro-cid-u2h3djql></span> <span${addAttribute(`${`background:${accent}`}; ${$$definedVars}`, "style")} data-astro-cid-u2h3djql></span> </div> <div class="topbar" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <div class="brand" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <img src="/seal.svg" alt="KoP Seal" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <span data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Site Admin</span> </div> <nav data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <a href="/" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>View Site</a> <span class="user" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>${session.email}</span> ${isOidcConfigured(env) && renderTemplate`<a href="/auth/logout" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Log out</a>`} </nav> </div> <main data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <h1 data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Lodge Management</h1> <p class="subtitle" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Create and manage lodges across the Oregon Grand Domain.</p> <a class="btn add" href="/admin/lodges/new" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>+ Create Lodge</a> ${lodges.length === 0 ? renderTemplate`<div class="empty" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <p data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>No lodges yet. Create your first lodge to get started.</p> </div>` : renderTemplate`<table class="lodge-table" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <thead data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <tr data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <th data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>No.</th> <th data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Name</th> <th data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Slug</th> <th data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Status</th> <th data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}></th> </tr> </thead> <tbody data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> ${lodges.map((lodge) => renderTemplate`<tr${addAttribute(lodge.active ? "" : "inactive", "class")} data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <td data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>${lodge.number}</td> <td data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>${lodge.name}</td> <td class="slug" data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>/${lodge.slug}</td> <td data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <span${addAttribute(`badge ${lodge.active ? "active" : "disabled"}`, "class")} data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> ${lodge.active ? "Active" : "Inactive"} </span> </td> <td data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}> <a class="btn"${addAttribute(`/admin/lodges/edit?id=${lodge.id}`, "href")} data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Edit</a> ${lodge.active ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-u2h3djql": true, "style": $$definedVars }, { "default": async ($$result2) => renderTemplate` <a class="btn"${addAttribute(`/${lodge.slug}/`, "href")} data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Site</a> <a class="btn"${addAttribute(`/${lodge.slug}/admin`, "href")} data-astro-cid-u2h3djql${addAttribute($$definedVars, "style")}>Admin</a> ` })}` : null} </td> </tr>`)} </tbody> </table>`} </main> </body></html>`;
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
