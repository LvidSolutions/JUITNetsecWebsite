import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.sessionStorage.setItem('juit:introSeen', '1'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test('FAQ accordion is accessible and keeps one panel open @home', async ({ page }) => {
  const section = page.getByRole('region', { name: 'FAQ' });
  await section.scrollIntoViewIfNeeded();

  const intro = section.locator('.faq-section__intro');
  const viewport = page.viewportSize();
  await expect(intro).toHaveCSS('position', viewport && viewport.width >= 1024 ? 'sticky' : 'static');

  const questions = section.getByRole('button');
  await expect(questions).toHaveCount(12);

  const first = questions.nth(0);
  const second = questions.nth(1);
  const firstPanelId = await first.getAttribute('aria-controls');

  await expect(first).toHaveAttribute('type', 'button');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(first).toHaveAttribute('aria-controls', /^faq-answer-0$/);
  await expect(page.locator(`#${firstPanelId}`)).toHaveAttribute('aria-hidden', 'true');

  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator(`#${firstPanelId}`)).toHaveAttribute('aria-hidden', 'false');

  await second.click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(second).toHaveAttribute('aria-expanded', 'true');

  await second.press('Space');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS('outline-style', 'solid');
  await first.press('Enter');
  await expect(first).toHaveAttribute('aria-expanded', 'true');

  await expect(section.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/kontakt');
  const faqSharesSceneWithFooter = await page.locator('main').evaluate((main) => {
    const scene = main.lastElementChild;
    return Boolean(
      scene?.classList.contains('faq-footer-scene') &&
      scene.querySelector('.faq-section') &&
      scene.querySelector('.footer-scroll-scene footer'),
    );
  });
  expect(faqSharesSceneWithFooter).toBe(true);

  const video = page.locator('.faq-footer-scene__video');
  await expect(video).toHaveAttribute('preload', 'metadata');
  expect(await video.evaluate((element) => ({
    autoplay: element.autoplay,
    muted: element.muted,
    playsInline: element.playsInline,
  }))).toEqual({ autoplay: true, muted: true, playsInline: true });
});

test('footer reveal masks the shared video without changing its viewport dimensions @home', async ({ page }) => {
  const footer = page.locator('.footer-scroll-scene');
  const video = page.locator('.faq-footer-scene__video');

  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await footer.evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top));
  await page.waitForTimeout(50);
  const before = await video.evaluate((element) => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  });

  await page.evaluate(() => window.scrollBy(0, Math.min(window.innerHeight * 0.42, 360)));
  await page.waitForTimeout(50);
  const after = await video.evaluate((element) => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  });
  const edge = page.locator('.faq-footer-scene__edge--left');

  expect(before).toEqual(after);
  expect(await edge.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(0);
});

test('FAQ has no horizontal overflow with reduced motion @reduced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'domcontentloaded' });

  const section = page.getByRole('region', { name: 'FAQ' });
  await section.scrollIntoViewIfNeeded();
  await section.getByRole('button').nth(0).press('Enter');

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  const transitionDuration = await section
    .getByRole('button')
    .nth(0)
    .evaluate((button) => Number.parseFloat(getComputedStyle(button).transitionDuration));
  expect(transitionDuration).toBeLessThanOrEqual(0.001);
});
