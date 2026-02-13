import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { fileURLToPath } from "url";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  vite: {
    resolve: {
      alias: {
        "~/": fileURLToPath(new URL("./src/", import.meta.url)),
      },
    },
  },
});
