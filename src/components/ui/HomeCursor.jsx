import { useEffect, useRef } from 'react';
import './HomeCursor.css';

const finePointerQuery = '(hover: hover) and (pointer: fine)';

export function HomeCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(finePointerQuery);
    let frame = 0;
    let visible = false;
    const pointer = { x: -100, y: -100, targetX: -100, targetY: -100 };

    const render = () => {
      frame = 0;
      const cursor = cursorRef.current;
      if (!cursor || !visible) return;
      pointer.x += (pointer.targetX - pointer.x) * 0.7;
      pointer.y += (pointer.targetY - pointer.y) * 0.7;
      cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      if (Math.abs(pointer.targetX - pointer.x) > 0.15 || Math.abs(pointer.targetY - pointer.y) > 0.15) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const hide = () => {
      visible = false;
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
      const mode = event.target.closest('[data-cursor]')?.getAttribute('data-cursor') || 'default';
      pointer.targetX = event.clientX - 13;
      pointer.targetY = event.clientY - 13;
      visible = true;
      document.body.dataset.homeCursorActive = 'true';
      cursor?.setAttribute('data-visible', 'true');
      cursor?.setAttribute('data-mode', mode);
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
      delete document.body.dataset.homeCursorActive;
    };
  }, []);

  return (
    <div ref={cursorRef} className="home-cursor" data-visible="false" data-mode="default" aria-hidden="true">
      <span className="home-cursor__core" />
    </div>
  );
}
