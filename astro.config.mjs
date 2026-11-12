import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  output: "static",
  site: "https://ekis.example.com",
  trailingSlash: "ignore",
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
  },
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
  },
});
