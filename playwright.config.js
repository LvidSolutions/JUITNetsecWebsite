import { defineConfig } from '@playwright/test';

const desktop = (name, width, height, grep) => ({
  name,
  grep,
  use: { viewport: { width, height } },
});

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    desktop('desktop-1366x768', 1366, 768, /@(routes|home|reduced)/),
    desktop('desktop-1440x900', 1440, 900, /@home/),
    desktop('desktop-1920x1080', 1920, 1080, /@home/),
    desktop('desktop-2560x1440', 2560, 1440, /@home/),
    desktop('tablet-768x1024', 768, 1024, /@home/),
    desktop('mobile-390x844', 390, 844, /@home/),
  ],
});
