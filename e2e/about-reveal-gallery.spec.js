import { expect, test } from '@playwright/test';

test('About gallery renders six empty frames and repeats its reveal @routes', async ({ page }) => {
  const clientErrors = [];
  page.on('pageerror', (error) => clientErrors.push(error.message));

  await page.goto('/om-oss', { waitUntil: 'domcontentloaded' });

  const gallery = page.locator('.about-reveal-gallery');
  const frames = gallery.locator('[data-about-gallery-item]');
  await expect(frames).toHaveCount(6);
  await expect(gallery.locator('img')).toHaveCount(0);

  const firstFrame = frames.nth(0);
  await expect(firstFrame).toHaveAttribute('data-in-view', 'false');

  await gallery.evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.72 });
  });
  await expect(firstFrame).toHaveAttribute('data-in-view', 'true');

  await page.evaluate(() => window.scrollTo({ top: 0 }));
  await expect(firstFrame).toHaveAttribute('data-in-view', 'false');

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  expect(clientErrors).toEqual([]);
});

test('About gallery is fully visible without animation for reduced motion @routes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/om-oss', { waitUntil: 'domcontentloaded' });

  const gallery = page.locator('.about-reveal-gallery');
  await gallery.scrollIntoViewIfNeeded();

  const frame = gallery.locator('[data-about-gallery-item]').nth(0);
  const mediaState = await frame.locator('.about-reveal-gallery__media').evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      clipPath: styles.clipPath,
      opacity: styles.opacity,
      transform: styles.transform,
      transitionDuration: styles.transitionDuration,
    };
  });

  expect(mediaState.opacity).toBe('1');
  expect(mediaState.clipPath).toContain('0px 0px');
  expect(Number.parseFloat(mediaState.transitionDuration)).toBeLessThanOrEqual(0.001);
});

test('About gallery keeps its deliberate composition at required viewport sizes @routes', async ({ page }) => {
  const viewports = [
    { width: 2560, height: 1440 },
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/om-oss', { waitUntil: 'domcontentloaded' });

    const result = await page.evaluate(() => {
      const frames = Array.from(document.querySelectorAll('[data-about-gallery-item]'));
      const bounds = frames.map((frame) => {
        const { left, right, top, bottom } = frame.getBoundingClientRect();
        return { left, right, top, bottom };
      });
      const overlaps = bounds.some((frame, index) => bounds.slice(index + 1).some((other) => (
        frame.left < other.right
        && frame.right > other.left
        && frame.top < other.bottom
        && frame.bottom > other.top
      )));

      return {
        count: frames.length,
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
        overlaps,
      };
    });

    expect(result.count).toBe(6);
    expect(result.horizontalOverflow).toBeLessThanOrEqual(1);
    expect(result.overlaps).toBe(false);
  }
});
