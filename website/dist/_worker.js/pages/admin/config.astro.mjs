globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$AdminForm } from '../../chunks/AdminForm_CoNl_yQ0.mjs';
import { g as getAdminToken, i as isValidAdminToken } from '../../chunks/auth_B4Zu3cps.mjs';
import { g as getConfig } from '../../chunks/db_DFm1mHTU.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Config = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Config;
  const { DB, ADMIN_TOKEN_HASH } = Astro2.locals.runtime.env;
  const token = getAdminToken(Astro2.request);
  if (!await isValidAdminToken(token ?? "", ADMIN_TOKEN_HASH ?? "")) {
    return Astro2.redirect("/admin/login", 302);
  }
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    try {
      const form = await Astro2.request.formData();
      const fields = [
        "lodge_name",
        "lodge_number",
        "state",
        "grand_domain",
        "city",
        "meeting_schedule",
        "meeting_location",
        "phone",
        "email",
        "facebook_url",
        "primary_color",
        "accent_color",
        "tagline",
        "founded_year"
      ];
      const now = (/* @__PURE__ */ new Date()).toISOString();
      for (const key of fields) {
        const val = form.get(key)?.toString() ?? "";
        await DB.prepare(
          "INSERT INTO lodge_config (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at"
        ).bind(key, val, now).run();
      }
      message = "Settings saved successfully.";
    } catch (e) {
      isError = true;
      message = `Error saving settings: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  const config = await getConfig(DB);
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Lodge Settings" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="row"> <div class="field"> <label>Lodge Name</label> <input type="text" name="lodge_name"${addAttribute(config.lodge_name, "value")} required> </div> <div class="field"> <label>Lodge Number</label> <input type="text" name="lodge_number"${addAttribute(config.lodge_number, "value")}> </div> </div> <div class="row"> <div class="field"> <label>State / Grand Domain</label> <input type="text" name="state"${addAttribute(config.state, "value")}> </div> <div class="field"> <label>Grand Domain Name <span class="hint">(e.g. "Oregon")</span></label> <input type="text" name="grand_domain"${addAttribute(config.grand_domain, "value")}> </div> </div> <div class="row"> <div class="field"> <label>City</label> <input type="text" name="city"${addAttribute(config.city, "value")}> </div> <div class="field"> <label>Founded Year</label> <input type="text" name="founded_year"${addAttribute(config.founded_year, "value")}> </div> </div> <div class="field"> <label>Tagline</label> <input type="text" name="tagline"${addAttribute(config.tagline, "value")}> </div> <div class="field"> <label>Meeting Schedule</label> <input type="text" name="meeting_schedule"${addAttribute(config.meeting_schedule, "value")} placeholder="e.g. First and Third Monday, 7:00 PM"> </div> <div class="field"> <label>Meeting Location / Address</label> <input type="text" name="meeting_location"${addAttribute(config.meeting_location, "value")}> </div> <div class="row"> <div class="field"> <label>Phone</label> <input type="text" name="phone"${addAttribute(config.phone, "value")}> </div> <div class="field"> <label>Email</label> <input type="email" name="email"${addAttribute(config.email, "value")}> </div> </div> <div class="field"> <label>Facebook URL</label> <input type="url" name="facebook_url"${addAttribute(config.facebook_url, "value")}> </div> <div class="row"> <div class="field"> <label>Primary Color <span class="hint">(hex, e.g. #4B0082)</span></label> <input type="text" name="primary_color"${addAttribute(config.primary_color, "value")}> </div> <div class="field"> <label>Accent Color <span class="hint">(hex, e.g. #FFD700)</span></label> <input type="text" name="accent_color"${addAttribute(config.accent_color, "value")}> </div> </div> <div class="actions"> <button type="submit" class="btn primary">Save Settings</button> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/config.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/config.astro";
const $$url = "/admin/config";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Config,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
