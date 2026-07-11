import test from 'node:test';
import assert from 'node:assert/strict';
import { CLIENT_ROUTE_PATHS, getRoute, normalizePath, ROUTES } from '../src/lib/routes.js';

test('normalizes trailing slashes without changing the root route', () => {
  assert.equal(normalizePath(''), '/');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath('/kontakt/'), '/kontakt');
  assert.equal(normalizePath('/kontakt'), '/kontakt');
});

test('returns immutable route metadata for every public path', () => {
  for (const path of CLIENT_ROUTE_PATHS) {
    const route = getRoute(path);
    assert.ok(route, `Missing route metadata for ${path}`);
    assert.equal(typeof route.page, 'string');
    assert.equal(typeof route.title, 'string');
    assert.ok(route.title.includes('JUIT NetSec AB'));
    assert.equal(Object.isFrozen(route), true);
  }

  assert.equal(Object.isFrozen(ROUTES), true);
});

test('returns null for unknown paths instead of silently mapping them to home', () => {
  assert.equal(getRoute('/does-not-exist'), null);
  assert.equal(getRoute('/api/contact'), null);
});
