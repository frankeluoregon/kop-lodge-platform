import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { fileURLToPath } from "url";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react()],
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  vite: {
    resolve: {
      alias: {
        "~/": fileURLToPath(new URL("./src/", import.meta.url)),
      },
    },
    plugins: [
      {
        name: "message-channel-shim",
        enforce: "pre",
        renderChunk(code, chunk) {
          // Inject a minimal MessageChannel shim into the SSR renderers chunk
          // so react-dom/server doesn't crash on import in the Workers runtime.
          // The server renderer is never actually called (all islands use client:only).
          if (chunk.fileName.includes("renderers")) {
            const shim = `if(typeof MessageChannel==="undefined"){globalThis.MessageChannel=class MessageChannel{constructor(){this.port1={onmessage:null,postMessage(){},close(){}};this.port2={onmessage:null,postMessage(m){if(this.port1?.onmessage)this.port1.onmessage({data:m})},close(){}};this.port2.port1=this.port1;this.port1.port2=this.port2}}}\n`;
            return shim + code;
          }
        },
      },
    ],
  },
});
