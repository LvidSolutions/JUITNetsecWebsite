import test from 'node:test';
import assert from 'node:assert/strict';
import { readPublicContactConfig } from '../src/lib/contactConfig.js';

test('keeps the contact form disabled unless the flag is exactly true', () => {
  for (const value of [undefined, '', 'false', 'TRUE', '1', true]) {
    const config = readPublicContactConfig({
      VITE_CONTACT_FORM_ENABLED: value,
      VITE_TURNSTILE_SITE_KEY: 'public-site-key',
    });
    assert.equal(config.enabled, false);
    assert.equal(config.configured, false);
  }
});

test('requires both the public feature flag and a non-empty Turnstile site key', () => {
  assert.deepEqual(
    readPublicContactConfig({
      VITE_CONTACT_FORM_ENABLED: 'true',
      VITE_TURNSTILE_SITE_KEY: '  public-site-key  ',
    }),
    {
      enabled: true,
      turnstileSiteKey: 'public-site-key',
      configured: true,
    },
  );

  assert.equal(
    readPublicContactConfig({
      VITE_CONTACT_FORM_ENABLED: 'true',
      VITE_TURNSTILE_SITE_KEY: '   ',
    }).configured,
    false,
  );
});

test('returns an immutable public configuration object', () => {
  const config = readPublicContactConfig({});
  assert.equal(Object.isFrozen(config), true);
});
