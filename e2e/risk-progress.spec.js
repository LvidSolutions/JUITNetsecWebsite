import { expect, test } from '@playwright/test';

async function scrollSceneToProgress(page, progress) {
  await page.evaluate((nextProgress) => {
    const scene = document.querySelector('#hem');
    const start = window.scrollY + scene.getBoundingClientRect().top;
    const range = scene.offsetHeight - window.innerHeight;
    window.scrollTo(0, start + range * nextProgress);
  }, progress);
  await page.waitForTimeout(100);
}

async function finishMonitorMedia(page) {
  await expect(page.locator('.hero-transition-scene__media')).toHaveJSProperty('readyState', 4);
  await scrollSceneToProgress(page, 0.46);
  for (let tick = 0; tick < 4; tick += 1) {
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(20);
    await expect(page.locator('#hem')).toHaveAttribute('data-phase', 'IDLE');
  }
  await page.mouse.wheel(0, 180);
  await expect(page.locator('#hem')).toHaveAttribute('data-phase', 'PLAYING');
  await page.locator('.hero-transition-scene__media').evaluate((video) => {
    video.dispatchEvent(new Event('ended'));
  });
  await expect(page.locator('#hem')).toHaveAttribute('data-phase', 'READY', { timeout: 3_000 });
}

test('the monitor handoff becomes the original scroll-driven C reveal @home', async ({ page }, testInfo) => {
  const clientErrors = [];
  page.on('pageerror', (error) => clientErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('net::ERR_NETWORK_ACCESS_DENIED')) {
      clientErrors.push(message.text());
    }
  });

  await page.addInitScript(() => window.sessionStorage.setItem('juit:introSeen', '1'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const monitorOpacity = () => page.locator('.contact-monitor-cta').evaluate((element) => Number.parseFloat(getComputedStyle(element.parentElement).opacity));
  expect(await monitorOpacity()).toBeLessThanOrEqual(0.01);
  await scrollSceneToProgress(page, 0.46);
  await page.waitForTimeout(700);
  expect(await monitorOpacity()).toBeGreaterThanOrEqual(0.99);
  const monitorWidth = await page.locator('.contact-monitor-cta').evaluate((element) => element.getBoundingClientRect().width);
  const expectedMonitorWidth = (page.viewportSize()?.width || 0) < 640 ? 336 : 480;
  expect(monitorWidth).toBeGreaterThanOrEqual(expectedMonitorWidth - 1);
  expect(monitorWidth).toBeLessThanOrEqual(expectedMonitorWidth + 1);
  await page.screenshot({ path: testInfo.outputPath('contact-before-playback.png') });
  await finishMonitorMedia(page);

  await scrollSceneToProgress(page, 0.95);
  const scene = page.locator('#hem');
  await expect(scene.locator('.risk-progress--embedded')).toHaveCSS('opacity', '1');
  const handoffGeometry = await page.evaluate(() => {
    const readRect = (element) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      return { left, top, width, height };
    };
    return {
      transition: readRect(document.querySelector('.risk-progress--embedded .risk-progress__initial-c')),
      text: readRect(document.querySelector('#risklandskapet .risk-progress__initial-c')),
    };
  });
  expect(Math.abs(handoffGeometry.transition.left - handoffGeometry.text.left)).toBeLessThan(1);
  expect(Math.abs(handoffGeometry.transition.top - handoffGeometry.text.top)).toBeLessThan(1);
  expect(Math.abs(handoffGeometry.transition.width - handoffGeometry.text.width)).toBeLessThan(1);
  expect(Math.abs(handoffGeometry.transition.height - handoffGeometry.text.height)).toBeLessThan(1);
  const handoffSection = page.locator('#risklandskapet');
  await expect(handoffSection).toHaveAttribute('data-overlay-active', 'true');
  await expect(handoffSection).toHaveCSS('visibility', 'visible');
  await page.screenshot({ path: testInfo.outputPath('handoff.png') });

  const section = page.locator('#risklandskapet');
  const words = section.locator('.risk-progress__word');
  await expect(words).toHaveCount(83);
  await expect(section.locator('.risk-progress__word--stat')).toHaveCount(4);

  const dimensions = await section.evaluate((element) => ({
    top: window.scrollY + element.getBoundingClientRect().top,
    range: element.offsetHeight - window.innerHeight,
  }));
  expect(dimensions.range).toBeGreaterThan(0);

  await page.evaluate(({ top }) => window.scrollTo(0, top), dimensions);
  await page.waitForTimeout(80);
  const atStart = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(atStart).toBeLessThanOrEqual(0.001);
  const initialCTypography = await section.evaluate((element) => {
    const character = element.querySelector('.risk-progress__initial-c');
    const text = element.querySelector('.risk-progress__text');
    return {
      characterSize: getComputedStyle(character).fontSize,
      textSize: getComputedStyle(text).fontSize,
      characterFamily: getComputedStyle(character).fontFamily,
      textFamily: getComputedStyle(text).fontFamily,
    };
  });
  expect(initialCTypography.characterSize).toBe(initialCTypography.textSize);
  expect(initialCTypography.characterFamily).toBe(initialCTypography.textFamily);
  await expect(words.nth(0)).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.screenshot({ path: testInfo.outputPath('reveal-start.png') });

  await page.evaluate(({ top, range }) => window.scrollTo(0, top + range * 0.5), dimensions);
  await page.waitForTimeout(80);
  const midway = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(midway).toBeGreaterThan(0.49);
  expect(midway).toBeLessThan(0.51);
  await page.screenshot({ path: testInfo.outputPath('reveal-middle.png') });

  await page.evaluate(({ top, range }) => window.scrollTo(0, top + range), dimensions);
  await page.waitForTimeout(80);
  const atEnd = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(atEnd).toBeGreaterThanOrEqual(0.999);
  const finalWordOffset = await words.nth(82).evaluate((element) => {
    const values = getComputedStyle(element).transform.match(/matrix\\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\\s*([^\\)]+)\\)/);
    return Number.parseFloat(values?.[1] || '0');
  });
  expect(Math.abs(finalWordOffset)).toBeLessThan(0.001);
  await page.screenshot({ path: testInfo.outputPath('reveal-complete.png') });

  await page.evaluate(({ top, range }) => window.scrollTo(0, top + range * 0.5), dimensions);
  await page.waitForTimeout(80);
  const reverseMidway = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(reverseMidway).toBeGreaterThan(0.49);
  expect(reverseMidway).toBeLessThan(0.51);
  await expect(words.nth(82)).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  await page.evaluate(({ top }) => window.scrollTo(0, top), dimensions);
  await page.waitForTimeout(80);
  const reverseStart = await section.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue('--risk-progress')));
  expect(reverseStart).toBeLessThanOrEqual(0.001);

  await scrollSceneToProgress(page, 0.7);
  await expect(scene.locator('.hero-transition-scene__character')).toHaveCSS('opacity', '1');
  await expect(scene.locator('.risk-progress--embedded')).toHaveCSS('opacity', '0');
  await page.screenshot({ path: testInfo.outputPath('reverse-monitor-c.png') });

  await scrollSceneToProgress(page, 0.4);
  await expect(scene).toHaveAttribute('data-phase', 'IDLE');

  await scrollSceneToProgress(page, 0.46);
  for (let tick = 0; tick < 5; tick += 1) {
    await page.mouse.wheel(0, 180);
  }
  await expect(scene).toHaveAttribute('data-phase', 'PLAYING');
  await page.locator('.hero-transition-scene__media').evaluate((video) => video.dispatchEvent(new Event('ended')));
  await expect(scene).toHaveAttribute('data-phase', 'READY', { timeout: 3_000 });

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  expect(clientErrors).toEqual([]);
});
