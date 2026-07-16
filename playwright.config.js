import { defineConfig } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT || 4173);

const desktop = (name, width, height, grep) => ({
  name,
  grep,
  use: { viewport: { width, height } },
});

const touch = (name, width, height, grep) => ({
  name,
  grep,
  use: { viewport: { width, height }, hasTouch: true, isMobile: true },
});

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    desktop('desktop-1366x768', 1366, 768, /@(routes|home|reduced)/),
    desktop('desktop-1440x900', 1440, 900, /@home/),
    desktop('desktop-1920x1080', 1920, 1080, /@home/),
    desktop('desktop-2560x1440', 2560, 1440, /@home/),
    desktop('desktop-1024x768', 1024, 768, /@home/),
    desktop('tablet-768x1024', 768, 1024, /@home/),
    desktop('mobile-390x844', 390, 844, /@home/),
    touch('touch-390x844', 390, 844, /@touch/),
  ],
});
