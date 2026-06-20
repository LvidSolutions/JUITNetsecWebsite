import { useEffect, useRef, useState } from 'react';

const CELL = 7; // pixelstorlek
const RADIUS = 95; // fältets radie runt cursorn

/**
 * ChainGPT Labs-inspirerat pixel-/rasterfält runt muspekaren.
 * Ritar små diskreta rutor som genereras och flimrar nära cursorn,
 * tätare i mitten och glesare mot kanten. Monokromt vitt med
 * sporadisk grön accent, lagt med mix-blend screen över hero-typografin.
 * Avstängt på touch och vid prefers-reduced-motion. Blockerar inte klick.
 */
export function PixelCursorField({ containerRef }) {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(finePointer && !prefersReduced);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    function resize() {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const state = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false, alpha: 0 };

    function onMove(event) {
      const rect = container.getBoundingClientRect();
      state.tx = event.clientX - rect.left;
      state.ty = event.clientY - rect.top;
      state.active = true;
    }
    function onEnter(event) {
      const rect = container.getBoundingClientRect();
      state.x = state.tx = event.clientX - rect.left;
      state.y = state.ty = event.clientY - rect.top;
      state.active = true;
    }
    function onLeave() {
      state.active = false;
    }

    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);
    // mus-fallback för browsers/automation som inte synthesizar pointer-events
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    let raf;
    function frame() {
      state.x += (state.tx - state.x) * 0.2;
      state.y += (state.ty - state.y) * 0.2;
      state.alpha += ((state.active ? 1 : 0) - state.alpha) * 0.12;

      ctx.clearRect(0, 0, width, height);

      if (state.alpha > 0.01) {
        const cx = state.x;
        const cy = state.y;
        const startCol = Math.floor((cx - RADIUS) / CELL);
        const endCol = Math.ceil((cx + RADIUS) / CELL);
        const startRow = Math.floor((cy - RADIUS) / CELL);
        const endRow = Math.ceil((cy + RADIUS) / CELL);

        for (let col = startCol; col <= endCol; col += 1) {
          for (let row = startRow; row <= endRow; row += 1) {
            const px = col * CELL;
            const py = row * CELL;
            const dx = px + CELL / 2 - cx;
            const dy = py + CELL / 2 - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > RADIUS) {
              continue;
            }
            const falloff = 1 - dist / RADIUS; // 1 i mitten → 0 vid kanten
            if (Math.random() > falloff * 0.5) {
              continue; // glesare celler mot kanten
            }
            const flicker = 0.35 + Math.random() * 0.65;
            const a = falloff * falloff * flicker * state.alpha;
            if (Math.random() < 0.16) {
              ctx.fillStyle = `rgba(0,200,83,${a})`;
            } else {
              ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`;
            }
            ctx.fillRect(px, py, CELL - 1, CELL - 1);
          }
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, containerRef]);

  if (!enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 [mix-blend-mode:screen]"
    />
  );
}
