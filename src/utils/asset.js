/**
 * Base path helper utilities for routing and assets
 */

function getBasePath() {
  const envBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (envBase && envBase !== '.' && envBase !== './') {
    return envBase;
  }
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/gamedev.profile')) {
    return '/gamedev.profile';
  }
  return '';
}

export const BASE_PATH = getBasePath();

/**
 * Prepends the base path to a relative route.
 */
export function route(path = '') {
  if (!path || path === '/') {
    return BASE_PATH ? `${BASE_PATH}/` : '/';
  }
  if (path.startsWith('/#')) {
    return BASE_PATH ? `${BASE_PATH}/${path.slice(1)}` : path;
  }
  if (path.startsWith('#')) {
    return BASE_PATH ? `${BASE_PATH}/${path}` : `/${path}`;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

/**
 * Returns public asset path with base prepended.
 */
export function asset(path = '') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

/**
 * Strips the base path prefix and query string from current window pathname
 */
export function normalizePath(pathname = (typeof window !== 'undefined' ? window.location.pathname : '/')) {
  let clean = pathname.split('?')[0].split('#')[0] || '/';

  if (BASE_PATH && clean.startsWith(BASE_PATH)) {
    clean = clean.slice(BASE_PATH.length);
  } else if (clean.startsWith('/gamedev.profile')) {
    clean = clean.slice('/gamedev.profile'.length);
  }

  // Remove trailing slashes (except root '/')
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  if (!clean || clean === '') {
    return '/';
  }

  return clean.startsWith('/') ? clean : `/${clean}`;
}

/**
 * Navigates safely within the app using HTML5 history, respecting base path.
 */
export function navigateTo(targetPath) {
  const fullPath = route(targetPath);
  window.history.pushState(null, '', fullPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (!targetPath.includes('#')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
