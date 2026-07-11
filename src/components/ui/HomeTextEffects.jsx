import { useEffect } from 'react';
import './DistortedText.css';

const textSelector = 'h1, h2, h3, h4, h5, h6, p, a, button, span, dt, dd, li';

function directText(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function randomize(element) {
  const strong = element.matches('h1, h2') || element.classList.contains('footer-stats-panel__value');
  const shift = strong ? 5 + Math.round(Math.random() * 2) : 2 + Math.round(Math.random() * 3);
  const duration = strong ? 440 + Math.round(Math.random() * 110) : 340 + Math.round(Math.random() * 100);
  const aTop = 8 + Math.round(Math.random() * 26);
  const aBottom = 44 + Math.round(Math.random() * 28);
  const bTop = 48 + Math.round(Math.random() * 28);
  const bBottom = 7 + Math.round(Math.random() * 25);

  element.style.setProperty('--distortion-shift', `${shift}px`);
  element.style.setProperty('--distortion-duration', `${duration}ms`);
  element.style.setProperty('--distortion-clip-a-top', `${aTop}%`);
  element.style.setProperty('--distortion-clip-a-bottom', `${aBottom}%`);
  element.style.setProperty('--distortion-clip-b-top', `${bTop}%`);
  element.style.setProperty('--distortion-clip-b-bottom', `${bBottom}%`);
}

export function HomeTextEffects() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll('[data-home-cursor-scope="true"]'));
    const registered = [];
    const observers = [];

    roots.forEach((root) => {
      root.querySelectorAll(textSelector).forEach((element) => {
        if (
          element.dataset.distortionText ||
          element.closest('[aria-hidden="true"], .sr-only, svg, [data-no-distortion]')
        ) {
          return;
        }

        const value = directText(element);
        if (!value) return;

        element.classList.add('home-text-distort');
        element.dataset.distortionText = value;
        element.dataset.cursor = element.closest('a, button') ? 'interactive' : 'text';

        const onEnter = () => {
          randomize(element);
          element.dataset.distortionActive = 'true';
        };
        const onLeave = () => {
          delete element.dataset.distortionActive;
        };

        element.addEventListener('pointerenter', onEnter);
        element.addEventListener('pointerleave', onLeave);
        registered.push({ element, onEnter, onLeave });
      });

      // Statistikvärden räknas upp efter mount. Synka endast det visuella
      // lagrets text när innehållet ändras; animationen och layouten rörs inte.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const target = mutation.target.nodeType === Node.TEXT_NODE ? mutation.target.parentElement : mutation.target;
          const element = target?.closest?.('.home-text-distort');
          if (!element) return;
          const value = directText(element);
          if (value) element.dataset.distortionText = value;
        });
      });
      observer.observe(root, { childList: true, characterData: true, subtree: true });
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      registered.forEach(({ element, onEnter, onLeave }) => {
        element.removeEventListener('pointerenter', onEnter);
        element.removeEventListener('pointerleave', onLeave);
        element.classList.remove('home-text-distort');
        delete element.dataset.distortionText;
        delete element.dataset.distortionActive;
        delete element.dataset.cursor;
        element.style.removeProperty('--distortion-shift');
        element.style.removeProperty('--distortion-duration');
        element.style.removeProperty('--distortion-clip-a-top');
        element.style.removeProperty('--distortion-clip-a-bottom');
        element.style.removeProperty('--distortion-clip-b-top');
        element.style.removeProperty('--distortion-clip-b-bottom');
      });
    };
  }, []);

  return null;
}
