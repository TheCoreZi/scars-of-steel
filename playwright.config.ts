import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  projects: [
    {
      name: "mobile-320",
      use: { viewport: { height: 800, width: 320 } },
    },
    {
      name: "tablet-768",
      use: { viewport: { height: 1024, width: 768 } },
    },
    {
      name: "zoom-200",
      use: {
        deviceScaleFactor: 2,
        viewport: { height: 450, width: 640 },
      },
    },
    {
      name: "desktop-1280",
      use: { viewport: { height: 900, width: 1280 } },
    },
  ],
  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    reuseExistingServer: false,
    url: "http://127.0.0.1:5173",
  },
});
