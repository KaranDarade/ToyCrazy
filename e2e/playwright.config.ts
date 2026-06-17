import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 720 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
