import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.sessionStorage.setItem('juit:introSeen', '1'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('status', { name: 'Loading' }).waitFor({ state: 'hidden', timeout: 10_000 });
});

async function scrollSectionToProgress(page, progress) {
  await page.evaluate((targetProgress) => {
    const section = document.querySelector('#risklandskapet');
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    const sectionStart = window.scrollY + section.getBoundingClientRect().top;
    const scrollRange = section.offsetHeight - window.innerHeight;
    window.scrollTo(0, sectionStart + scrollRange * targetProgress);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  }, progress);
  await page.waitForTimeout(80);
}

test('risk landscape follows actual scroll progress without overflow @home', async ({ page }) => {
  const clientErrors = [];
  page.on('pageerror', (error) => clientErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') clientErrors.push(message.text());
  });

  const section = page.locator('#risklandskapet');
  const words = section.locator('.risk-progress__word');
  await expect(section).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(words).toHaveCount(83);
  await expect(section.locator('.risk-progress__word--stat')).toHaveCount(4);
  await expect(section.locator('.risk-progress__word--stat').nth(0)).toHaveCSS('color', 'rgb(0, 200, 83)');
  await expect(words.nth(0)).toHaveCSS('color', 'rgb(255, 255, 255)');

  await scrollSectionToProgress(page, 0.505);
  const midProgress = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(midProgress).toBeGreaterThan(0.49);
  expect(midProgress).toBeLessThan(0.52);

  const activeWord = words.nth(44);
  const partialTransform = await activeWord.evaluate((element) => getComputedStyle(element).transform);
  const partialClipPath = await activeWord.evaluate((element) => getComputedStyle(element).clipPath);
  expect(partialTransform).not.toBe('none');
  expect(partialTransform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
  expect(partialClipPath).not.toBe('none');

  await scrollSectionToProgress(page, 0.98);
  await expect(words.nth(82)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  await scrollSectionToProgress(page, 0.1);
  const reversedProgress = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(reversedProgress).toBeGreaterThan(0.09);
  expect(reversedProgress).toBeLessThan(0.12);

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  expect(clientErrors).toEqual([]);
});

test('risk landscape respects reduced motion @home', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'domcontentloaded' });

  const section = page.locator('#risklandskapet');
  const words = section.locator('.risk-progress__word');
  const viewport = page.viewportSize();
  const sectionHeight = await section.evaluate((element) => element.getBoundingClientRect().height);

  expect(sectionHeight).toBeLessThan((viewport?.height || 1) * 2);
  await expect(words.nth(20)).toHaveCSS('transform', 'none');
  await expect(words.nth(20)).toHaveCSS('clip-path', 'none');
  await expect(section.locator('.risk-progress__word--stat').nth(3)).toHaveCSS('color', 'rgb(0, 200, 83)');
});

test('captures risk landscape progress states @screens', async ({ page }, testInfo) => {
  test.skip(!process.env.RISK_CAPTURE, 'Visual capture is run explicitly.');

  for (const [label, progress] of [
    ['start', 0],
    ['10', 0.1],
    ['25', 0.25],
    ['50', 0.5],
    ['75', 0.75],
    ['90', 0.9],
    ['before-end', 0.99],
    ['end', 1],
  ]) {
    await scrollSectionToProgress(page, progress);
    await page.screenshot({ path: testInfo.outputPath(`risk-progress-${label}.png`) });
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('status', { name: 'Loading' }).waitFor({ state: 'hidden', timeout: 10_000 });
  await page.locator('#risklandskapet').scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('risk-progress-reduced-motion.png') });
});
