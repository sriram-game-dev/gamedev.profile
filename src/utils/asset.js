/**
 * Base path helper utilities for routing and assets
 * Supports both custom user root domain (https://<username>.github.io/)
 * and repository subfolder domain (https://<username>.github.io/profile/).
 */

function getBasePath() {
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/profile')) {
      return '/profile';
    }
    if (window.location.pathname.startsWith('/sriram-gamedev.github.io')) {
      return '/sriram-gamedev.github.io';
    }
  }
  const envBase = import.meta.env.BASE_URL || '/';
  if (envBase === './' || envBase === '.') return '';
  return envBase.replace(/\/$/, '');
}

export const BASE_PATH = getBasePath();

function getActiveSubfolder() {
  if (typeof window === 'undefined') return '';
  if (window.location.pathname.startsWith('/profile')) return '/profile';
  if (window.location.pathname.startsWith('/sriram-gamedev.github.io')) return '/sriram-gamedev.github.io';
  return '';
}

/**
 * Prepends the base path to a relative route.
 */
export function route(path = '') {
  const base = getActiveSubfolder();
  if (!path || path === '/') {
    return base ? `${base}/` : '/';
  }
  if (path.startsWith('/#')) {
    return base ? `${base}/${path.slice(1)}` : path;
  }
  if (path.startsWith('#')) {
    return base ? `${base}/${path}` : `/${path}`;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/**
 * Returns public asset path with base prepended.
 */
export function asset(path = '') {
  const base = getActiveSubfolder();
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/**
 * Strips the base path prefix and query string from current window pathname
 */
export function normalizePath(pathname = (typeof window !== 'undefined' ? window.location.pathname : '/')) {
  let clean = pathname.split('?')[0].split('#')[0] || '/';

  if (clean.startsWith('/profile')) {
    clean = clean.slice('/profile'.length);
  }
  if (clean.startsWith('/sriram-gamedev.github.io')) {
    clean = clean.slice('/sriram-gamedev.github.io'.length);
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
