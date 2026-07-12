import { useEffect } from 'react';

const finePointerQuery = '(hover: hover) and (pointer: fine)';

function distanceToRect(x, y, rect) {
  const horizontal = Math.max(rect.left - x, 0, x - rect.right);
  const vertical = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(horizontal, vertical);
}

function nearestReloadTarget(scope, target, x, y) {
  const directTarget = target.closest?.('[data-reload-proximity="true"]');
  if (directTarget && scope.contains(directTarget)) return directTarget;

  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  scope.querySelectorAll('[data-reload-proximity="true"]').forEach((candidate) => {
    const rect = candidate.getBoundingClientRect();
    const radius = Number(candidate.dataset.hoverRadius) || 0;
    const distance = distanceToRect(x, y, rect);

    if (!rect.width || !rect.height || distance > radius || distance >= nearestDistance) return;
    nearest = candidate;
    nearestDistance = distance;
  });

  return nearest;
}

export function HomeCursor() {
  useEffect(() => {
    const media = window.matchMedia(finePointerQuery);
    let activeTarget = null;

    const setActiveTarget = (nextTarget) => {
      if (activeTarget === nextTarget) return;
      activeTarget?.dispatchEvent(new CustomEvent('homecursorleave'));
      activeTarget = nextTarget;
      activeTarget?.dispatchEvent(new CustomEvent('homecursorenter'));
    };

    const update = (event) => {
      if (!media.matches || !(event.target instanceof Element)) {
        setActiveTarget(null);
        return;
      }

      const scope = event.target.closest('[data-home-cursor-scope="true"]');
      if (!scope) {
        setActiveTarget(null);
        return;
      }

      setActiveTarget(nearestReloadTarget(scope, event.target, event.clientX, event.clientY));
    };

    const clear = () => setActiveTarget(null);
    const refreshPointerMode = () => {
      if (!media.matches) clear();
    };

    document.addEventListener('pointermove', update, { passive: true });
    document.addEventListener('pointerleave', clear);
    media.addEventListener('change', refreshPointerMode);

    return () => {
      document.removeEventListener('pointermove', update);
      document.removeEventListener('pointerleave', clear);
      media.removeEventListener('change', refreshPointerMode);
      clear();
    };
  }, []);

  return null;
}
