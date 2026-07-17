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

async function expectLogoAnchoredToHeader(page) {
  const offset = await page.evaluate(() => {
    const logo = document.querySelector('[data-testid="interactive-logo"]');
    const slot = document.querySelector('header .header-logo[aria-hidden="true"]');
    if (!logo || !slot) {
      return null;
    }

    const logoRect = logo.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    return {
      x: Math.abs((logoRect.left + logoRect.width / 2) - (slotRect.left + slotRect.width / 2)),
      y: Math.abs((logoRect.top + logoRect.height / 2) - (slotRect.top + slotRect.height / 2)),
    };
  });

  expect(offset).not.toBeNull();
  expect(offset.x).toBeLessThan(1);
  expect(offset.y).toBeLessThan(1);
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

test('logo remains readable on touch devices and interactive on non-homepage routes @home', async ({ page }) => {
  await skipIntroLoader(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await setHeroProgress(page, 0.47);

  const logo = page.getByTestId('interactive-logo');
  const touchOnly = await page.evaluate(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches === false);
  await expect(logo).toHaveAttribute('data-state', touchOnly ? 'wordmark' : 'cube');

  for (const path of ['/tjanster', '/om-oss', '/kontakt']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const routeLogo = page.getByTestId('interactive-logo');
    await expect(routeLogo).toHaveAttribute('data-state', touchOnly ? 'wordmark' : 'cube');
    await expectLogoAnchoredToHeader(page);

    if (!touchOnly) {
      await routeLogo.hover();
      await expect(routeLogo).toHaveAttribute('data-state', 'wordmark');
      await page.mouse.move(0, 500);
      await expect(routeLogo).toHaveAttribute('data-state', 'cube');
    }
  }
});

test('returning home immediately restores the full wordmark instead of a full-size cube @home', async ({ page }) => {
  await skipIntroLoader(page);
  await page.goto('/tjanster', { waitUntil: 'domcontentloaded' });

  const routeLogo = page.getByTestId('interactive-logo');
  await expect(routeLogo).toHaveAttribute('data-state', 'cube');
  await routeLogo.click();
  await page.waitForURL('**/');

  const homeLogo = page.getByTestId('interactive-logo');
  await expect(homeLogo).toHaveAttribute('data-state', 'wordmark');
  const cubeSize = await page.getByTestId('animated-logo-cube').evaluate((cube) => {
    const rect = cube.getBoundingClientRect();
    return Math.max(rect.width, rect.height);
  });
  expect(cubeSize).toBeLessThan(100);
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
