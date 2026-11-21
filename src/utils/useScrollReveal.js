import { useEffect } from 'react';

/**
 * Lightweight hook that attaches an IntersectionObserver to observe elements
 * with the `.reveal-on-scroll` class and triggers staggered reveal animations.
 * Automatically scans dynamic DOM mutations to prevent newly mounted components
 * from being trapped in an unrevealed state.
 */
export function useScrollReveal(dependency) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealElement = (el) => {
      el.classList.add('is-revealed');
    };

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      }
    );

    const observeUnrevealed = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      elements.forEach((el) => {
        // If element is already in viewport or parent is scrolled past, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          revealElement(el);
        } else {
          observer.observe(el);
        }
      });
    };

    observeUnrevealed();

    // Observe DOM mutations so dynamic tab switches or list updates are observed immediately
    let mutationObserver;
    if ('MutationObserver' in window) {
      mutationObserver = new MutationObserver(() => {
        observeUnrevealed();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutationObserver?.disconnect();
    };
  }, [dependency]);
}
