import { expect, test } from '@playwright/test';

const routes = [
  ['services', '/tjanster'],
  ['about', '/om-oss'],
  ['contact', '/kontakt'],
];

for (const [name, path] of routes) {
  test(`${name} renders without client errors or horizontal overflow @routes`, async ({ page }) => {
    const clientErrors = [];
    page.on('pageerror', (error) => clientErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') clientErrors.push(message.text());
    });

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#huvudinnehall')).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
    expect(clientErrors).toEqual([]);

    if (name === 'contact') {
      const openForm = page.getByRole('button', { name: /say hi/i });
      await expect(openForm).toBeVisible();
      await openForm.click();
      await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
    }
  });
}

test('home renders without client errors or horizontal overflow @home', async ({ page }) => {
  const clientErrors = [];
  page.on('pageerror', (error) => clientErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') clientErrors.push(message.text());
  });

  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('#huvudinnehall')).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  expect(clientErrors).toEqual([]);
});

test('home renders with reduced motion @reduced', async ({ page }) => {
  const clientErrors = [];
  page.on('pageerror', (error) => clientErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#huvudinnehall')).toBeVisible();
  expect(clientErrors).toEqual([]);
});
