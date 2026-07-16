import { expect, test } from '@playwright/test';

async function skipIntroLoader(page) {
  await page.addInitScript(() => window.sessionStorage.setItem('juit:introSeen', '1'));
}

async function setHeroProgress(page, progress) {
  await page.evaluate((nextProgress) => {
    const hero = document.querySelector('#hem');
    window.scrollTo({ top: hero.offsetTop + hero.offsetHeight * nextProgress, behavior: 'auto' });
  }, progress);
}

test('homepage logo collapses after landing, reverses on hover and leaves navigation fixed @home', async ({ page }) => {
  await skipIntroLoader(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const logo = page.getByTestId('interactive-logo');
  await expect(logo).toHaveAttribute('data-state', 'wordmark');

  await setHeroProgress(page, 0.47);
  await expect(logo).toHaveAttribute('data-state', 'cube');

  const navBefore = await page.locator('header nav a').evaluateAll((links) =>
    links.slice(0, 4).map((link) => {
      const rect = link.getBoundingClientRect();
      return [Math.round(rect.left), Math.round(rect.right)];
    }),
  );

  await logo.hover();
  await expect(logo).toHaveAttribute('data-state', 'wordmark');

  const navAfter = await page.locator('header nav a').evaluateAll((links) =>
    links.slice(0, 4).map((link) => {
      const rect = link.getBoundingClientRect();
      return [Math.round(rect.left), Math.round(rect.right)];
    }),
  );
  expect(navAfter).toEqual(navBefore);

  await page.mouse.move(0, 500);
  await expect(logo).toHaveAttribute('data-state', 'cube');

  await logo.focus();
  await expect(logo).toHaveAttribute('data-state', 'wordmark');
  await page.evaluate(() => document.activeElement?.blur());
  await expect(logo).toHaveAttribute('data-state', 'cube');

  await setHeroProgress(page, 0.35);
  await expect(logo).toHaveAttribute('data-state', 'wordmark');
});

test('logo remains readable on touch devices and on non-homepage routes @home', async ({ page }) => {
  await skipIntroLoader(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await setHeroProgress(page, 0.47);

  const logo = page.getByTestId('interactive-logo');
  const touchOnly = await page.evaluate(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches === false);
  await expect(logo).toHaveAttribute('data-state', touchOnly ? 'wordmark' : 'cube');

  await page.goto('/tjanster', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'JUIT NetSec AB, go to home page' })).toBeVisible();
});

test('reduced motion retains the state model without cube rotation @reduced', async ({ page }) => {
  await skipIntroLoader(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await setHeroProgress(page, 0.47);

  const logo = page.getByTestId('interactive-logo');
  await expect(logo).toHaveAttribute('data-state', 'cube');
  await logo.focus();
  await expect(logo).toHaveAttribute('data-state', 'wordmark');
});

test('touch users retain the readable wordmark after the intro landing @touch', async ({ page }) => {
  await skipIntroLoader(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await setHeroProgress(page, 0.47);

  await expect(page.getByTestId('interactive-logo')).toHaveAttribute('data-state', 'wordmark');
});
