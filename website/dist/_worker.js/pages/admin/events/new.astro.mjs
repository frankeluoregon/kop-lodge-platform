globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$AdminForm } from '../../../chunks/AdminForm_CoNl_yQ0.mjs';
import { g as getAdminToken, i as isValidAdminToken } from '../../../chunks/auth_B4Zu3cps.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const { DB, ADMIN_TOKEN_HASH } = Astro2.locals.runtime.env;
  const token = getAdminToken(Astro2.request);
  if (!await isValidAdminToken(token ?? "", ADMIN_TOKEN_HASH ?? "")) {
    return Astro2.redirect("/admin/login", 302);
  }
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    try {
      const f = await Astro2.request.formData();
      await DB.prepare(
        `INSERT INTO events (title, event_date, end_date, level, description, location, url, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        f.get("title"),
        f.get("event_date"),
        f.get("end_date") || null,
        f.get("level"),
        f.get("description") || null,
        f.get("location") || null,
        f.get("url") || null,
        f.get("published") === "on" ? 1 : 0
      ).run();
      return Astro2.redirect("/admin?saved=event", 302);
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "New Event", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Event Title *</label> <input type="text" name="title" required> </div> <div class="row"> <div class="field"> <label>Date *</label> <input type="date" name="event_date" required> </div> <div class="field"> <label>End Date <span class="hint">(optional)</span></label> <input type="date" name="end_date"> </div> </div> <div class="row"> <div class="field"> <label>Level *</label> <select name="level" required> <option value="lodge">Lodge Event</option> <option value="grand">Grand Lodge</option> <option value="supreme">Supreme Lodge</option> </select> </div> <div class="field"> <label>Location</label> <input type="text" name="location"> </div> </div> <div class="field"> <label>Description</label> <textarea name="description" style="min-height:100px"></textarea> </div> <div class="field"> <label>External URL <span class="hint">(optional)</span></label> <input type="url" name="url"> </div> <div class="field checkbox-row"> <input type="checkbox" id="published" name="published" checked> <label for="published" style="margin:0;font-weight:400">Published (visible on site)</label> </div> <div class="actions"> <button type="submit" class="btn primary">Add Event</button> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/events/new.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/events/new.astro";
const $$url = "/admin/events/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
