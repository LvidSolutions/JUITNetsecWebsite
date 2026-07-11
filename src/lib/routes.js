export const ROUTES = Object.freeze({
  '/': Object.freeze({
    page: 'home',
    title: 'JUIT NetSec AB – IT security, networking and infrastructure',
  }),
  '/tjanster': Object.freeze({
    page: 'services',
    title: 'Services – JUIT NetSec AB',
  }),
  '/om-oss': Object.freeze({
    page: 'about',
    title: 'About – JUIT NetSec AB',
  }),
  '/about': Object.freeze({
    page: 'about',
    title: 'About – JUIT NetSec AB',
  }),
  '/kontakt': Object.freeze({
    page: 'contact',
    title: 'Contact – JUIT NetSec AB',
  }),
  '/contact': Object.freeze({
    page: 'contact',
    title: 'Contact – JUIT NetSec AB',
  }),
});

export const CLIENT_ROUTE_PATHS = Object.freeze(Object.keys(ROUTES));
export const VERCEL_REWRITE_PATHS = Object.freeze(
  CLIENT_ROUTE_PATHS.filter((path) => path !== '/'),
);

export function normalizePath(path) {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

export function getRoute(path) {
  return ROUTES[normalizePath(path)] || null;
}
