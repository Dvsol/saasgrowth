import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "src/tests/e2e",
  webServer: { command: "npm run preview", url: "http://localhost:4321", reuseExistingServer: true },
  use: { baseURL: "http://localhost:4321" },
  reporter: "list",
});
