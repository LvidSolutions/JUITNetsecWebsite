import { useEffect, useRef } from 'react';
import './HomeCursor.css';

const finePointerQuery = '(hover: hover) and (pointer: fine)';

function distanceToRect(x, y, rect) {
  const horizontal = Math.max(rect.left - x, 0, x - rect.right);
  const vertical = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(horizontal, vertical);
}

function nearestCursorTarget(scope, target, x, y) {
  const directTarget = target.closest?.('[data-cursor][data-hover-radius]');
  if (directTarget && scope.contains(directTarget)) return directTarget;

  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  scope.querySelectorAll('[data-cursor][data-hover-radius]').forEach((candidate) => {
    const rect = candidate.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const radius = Number(candidate.dataset.hoverRadius) || 0;
    const distance = distanceToRect(x, y, rect);
    if (distance > radius || distance >= nearestDistance) return;

    nearest = candidate;
    nearestDistance = distance;
  });

  return nearest;
}

export function HomeCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(finePointerQuery);
    let frame = 0;
    let visible = false;
    let activeTarget = null;
    const pointer = { x: -100, y: -100, targetX: -100, targetY: -100 };

    const setActiveTarget = (nextTarget) => {
      if (activeTarget === nextTarget) return;

      if (activeTarget?.dataset.reloadProximity === 'true') {
        activeTarget.dispatchEvent(new CustomEvent('homecursorleave'));
      }
      activeTarget = nextTarget;
      if (activeTarget?.dataset.reloadProximity === 'true') {
        activeTarget.dispatchEvent(new CustomEvent('homecursorenter'));
      }
    };

    const render = () => {
      frame = 0;
      const cursor = cursorRef.current;
      if (!cursor || !visible) return;

      pointer.x += (pointer.targetX - pointer.x) * 0.62;
      pointer.y += (pointer.targetY - pointer.y) * 0.62;
      cursor.style.setProperty('--cursor-x', `${pointer.x}px`);
      cursor.style.setProperty('--cursor-y', `${pointer.y}px`);

      if (Math.abs(pointer.targetX - pointer.x) > 0.15 || Math.abs(pointer.targetY - pointer.y) > 0.15) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const hide = () => {
      visible = false;
      setActiveTarget(null);
      document.body.dataset.homeCursorActive = 'false';
      cursorRef.current?.setAttribute('data-visible', 'false');
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const update = (event) => {
      if (!media.matches || !(event.target instanceof Element)) {
        hide();
        return;
      }

      const scope = event.target.closest('[data-home-cursor-scope="true"]');
      if (!scope) {
        hide();
        return;
      }

      const cursor = cursorRef.current;
      const target = nearestCursorTarget(scope, event.target, event.clientX, event.clientY);
      const mode = target?.dataset.cursor || 'default';

      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      visible = true;
      document.body.dataset.homeCursorActive = 'true';
      cursor?.setAttribute('data-visible', 'true');
      cursor?.setAttribute('data-mode', mode);
      cursor?.setAttribute('data-proximity', target ? 'true' : 'false');
      setActiveTarget(target);
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const refreshPointerMode = () => {
      if (!media.matches) hide();
    };

    document.addEventListener('pointermove', update, { passive: true });
    document.addEventListener('pointerleave', hide);
    media.addEventListener('change', refreshPointerMode);

    return () => {
      document.removeEventListener('pointermove', update);
      document.removeEventListener('pointerleave', hide);
      media.removeEventListener('change', refreshPointerMode);
      window.cancelAnimationFrame(frame);
      setActiveTarget(null);
      delete document.body.dataset.homeCursorActive;
    };
  }, []);

  return (
    <div ref={cursorRef} className="home-cursor" data-visible="false" data-mode="default" aria-hidden="true">
      <span className="home-cursor__core" />
    </div>
  );
}
