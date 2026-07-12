import { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(min, max, value) {
  const amount = clamp((value - min) / (max - min), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

function stableNoise(x, y, seed) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function blendedNoise(x, y, seed) {
  const cellX = Math.floor(x);
  const cellY = Math.floor(y);
  const localX = x - cellX;
  const localY = y - cellY;
  const smoothX = localX * localX * (3 - 2 * localX);
  const smoothY = localY * localY * (3 - 2 * localY);
  const top = stableNoise(cellX, cellY, seed) * (1 - smoothX) + stableNoise(cellX + 1, cellY, seed) * smoothX;
  const bottom =
    stableNoise(cellX, cellY + 1, seed) * (1 - smoothX) + stableNoise(cellX + 1, cellY + 1, seed) * smoothX;

  return top * (1 - smoothY) + bottom * smoothY;
}

function drawVideoCover(context, video, width, height, cropPosition) {
  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;

  if (!sourceWidth || !sourceHeight) return;

  const targetAspect = width / height;
  const sourceAspect = sourceWidth / sourceHeight;
  let drawWidth = sourceWidth;
  let drawHeight = sourceHeight;

  if (sourceAspect > targetAspect) {
    drawWidth = sourceHeight * targetAspect;
  } else {
    drawHeight = sourceWidth / targetAspect;
  }

  const [positionX, positionY] = cropPosition;
  const sourceX = (sourceWidth - drawWidth) * positionX;
  const sourceY = (sourceHeight - drawHeight) * positionY;

  context.drawImage(video, sourceX, sourceY, drawWidth, drawHeight, 0, 0, width, height);
}

function sourceSeed(source) {
  return Array.from(source).reduce((seed, character) => seed + character.charCodeAt(0), 0);
}

export function PixelatedServiceVideo({
  src,
  objectPosition,
  cropPosition,
  reducedMotion,
  interactionTargetRef,
  revealControllerRef,
  isSelected,
  revealBrightness = 0,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const pixelCanvasRef = useRef(null);
  const revealCanvasRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const pixelCanvas = pixelCanvasRef.current;
    const revealCanvas = revealCanvasRef.current;
    const pixelContext = pixelCanvas.getContext('2d', { alpha: false });
    const revealContext = revealCanvas.getContext('2d');
    const state = {
      animationFrame: null,
      bounds: null,
      disposed: false,
      displayHeight: 0,
      displayWidth: 0,
      field: null,
      globalProgress: 0,
      gridHeight: 0,
      gridWidth: 0,
      hasReveal: false,
      hovered: false,
      imageData: null,
      lastTimestamp: 0,
      maskCanvas: document.createElement('canvas'),
      maskContext: null,
      nextField: null,
      noise: null,
      pointerX: 0.5,
      pointerY: 0.5,
      previousPointerX: null,
      previousPointerY: null,
      reducedOpacity: 0,
      seed: sourceSeed(src),
      touchActivated: false,
      visible: false,
    };

    simulationRef.current = state;
    pixelContext.imageSmoothingEnabled = false;
    revealContext.imageSmoothingEnabled = true;

    function updateBounds() {
      state.bounds = interactionTargetRef.current?.getBoundingClientRect() ?? null;
    }

    function initialiseGrid() {
      const gridWidth = clamp(Math.round(state.displayWidth / 3.4), 112, 240);
      const gridHeight = clamp(Math.round((gridWidth * state.displayHeight) / state.displayWidth), 96, 320);

      if (gridWidth === state.gridWidth && gridHeight === state.gridHeight) return;

      state.gridWidth = gridWidth;
      state.gridHeight = gridHeight;
      state.field = new Float32Array(gridWidth * gridHeight);
      state.nextField = new Float32Array(gridWidth * gridHeight);
      state.noise = new Float32Array(gridWidth * gridHeight);
      state.imageData = state.maskContext.createImageData(gridWidth, gridHeight);
      state.maskCanvas.width = gridWidth;
      state.maskCanvas.height = gridHeight;

      for (let y = 0; y < gridHeight; y += 1) {
        for (let x = 0; x < gridWidth; x += 1) {
          const index = y * gridWidth + x;
          const baseNoise = blendedNoise(x * 0.075, y * 0.075, state.seed);
          const detailNoise = blendedNoise(x * 0.24, y * 0.24, state.seed + 19);
          state.noise[index] = clamp(baseNoise * 0.76 + detailNoise * 0.24, 0, 1);
          state.imageData.data[index * 4] = 255;
          state.imageData.data[index * 4 + 1] = 255;
          state.imageData.data[index * 4 + 2] = 255;
        }
      }
    }

    state.maskContext = state.maskCanvas.getContext('2d');

    function updateDimensions() {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));

      if (width === state.displayWidth && height === state.displayHeight) return;

      state.displayWidth = width;
      state.displayHeight = height;
      revealCanvas.width = width;
      revealCanvas.height = height;
      revealContext.imageSmoothingEnabled = true;
      initialiseGrid();
    }

    function startVideo() {
      if (!reducedMotion) {
        video.muted = true;
        video.play().catch(() => {});
      }
    }

    function drawPixelatedVideo() {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !state.displayWidth || !state.displayHeight) return;

      const pixelWidth = clamp(Math.round(state.displayWidth / 30), 12, 22);
      const pixelHeight = Math.max(8, Math.round((pixelWidth * state.displayHeight) / state.displayWidth));

      if (pixelCanvas.width !== pixelWidth || pixelCanvas.height !== pixelHeight) {
        pixelCanvas.width = pixelWidth;
        pixelCanvas.height = pixelHeight;
        pixelContext.imageSmoothingEnabled = false;
      }

      drawVideoCover(pixelContext, video, pixelWidth, pixelHeight, cropPosition);
    }

    function stamp(x, y, strength = 1) {
      if (!state.field) return;

      const centerX = Math.round(clamp(x, 0, 1) * (state.gridWidth - 1));
      const centerY = Math.round(clamp(y, 0, 1) * (state.gridHeight - 1));
      const radius = Math.max(3, Math.round(Math.min(state.gridWidth, state.gridHeight) * 0.065));

      for (let row = Math.max(0, centerY - radius - 2); row <= Math.min(state.gridHeight - 1, centerY + radius + 2); row += 1) {
        for (let column = Math.max(0, centerX - radius - 2); column <= Math.min(state.gridWidth - 1, centerX + radius + 2); column += 1) {
          const index = row * state.gridWidth + column;
          const distance = Math.hypot(column - centerX, row - centerY);
          const localRadius = radius * (0.78 + state.noise[index] * 0.42);

          if (distance >= localRadius) continue;

          const falloff = 1 - distance / localRadius;
          state.field[index] = Math.max(state.field[index], falloff * falloff * strength);
        }
      }

      state.hasReveal = true;
    }

    function stampTrail(x, y) {
      const previousX = state.previousPointerX;
      const previousY = state.previousPointerY;

      if (previousX === null || previousY === null) {
        stamp(x, y);
      } else {
        const distance = Math.hypot((x - previousX) * state.gridWidth, (y - previousY) * state.gridHeight);
        const steps = clamp(Math.ceil(distance / Math.max(2, state.gridWidth * 0.04)), 1, 12);

        for (let step = 1; step <= steps; step += 1) {
          const progress = step / steps;
          stamp(previousX + (x - previousX) * progress, previousY + (y - previousY) * progress, 0.9);
        }
      }

      state.previousPointerX = x;
      state.previousPointerY = y;
    }

    function simulateField(delta) {
      if (!state.field) return;

      const frameScale = Math.min(delta / 16.67, 2.5);
      state.globalProgress = clamp(
        state.globalProgress + (state.hovered ? delta / 850 : -delta / 900),
        0,
        1.12,
      );

      let strongestValue = 0;

      for (let row = 0; row < state.gridHeight; row += 1) {
        for (let column = 0; column < state.gridWidth; column += 1) {
          const index = row * state.gridWidth + column;
          const current = state.field[index];
          const north = state.field[Math.max(0, row - 1) * state.gridWidth + column];
          const south = state.field[Math.min(state.gridHeight - 1, row + 1) * state.gridWidth + column];
          const west = state.field[row * state.gridWidth + Math.max(0, column - 1)];
          const east = state.field[row * state.gridWidth + Math.min(state.gridWidth - 1, column + 1)];
          const neighbourMax = Math.max(north, south, west, east);
          const neighbourAverage = (north + south + west + east) * 0.25;
          const variation = state.noise[index];
          let next = current;

          if (state.hovered) {
            const pointerDistance = Math.hypot(
              column / Math.max(1, state.gridWidth - 1) - state.pointerX,
              row / Math.max(1, state.gridHeight - 1) - state.pointerY,
            );
            const radiatingRadius = 0.12 + state.globalProgress * 1.12;
            const irregularRadius = radiatingRadius * (0.8 + variation * 0.28);
            const radiatingFill = Math.max(0, 1 - pointerDistance / irregularRadius);
            const spread = Math.max(0, neighbourMax - (0.035 + variation * 0.055));
            const fillStart = 0.18 + variation * 0.68;
            const fill = smoothstep(fillStart, fillStart + 0.2, state.globalProgress);
            next = Math.max(
              current,
              current + spread * (0.58 + variation * 0.22) * frameScale,
              radiatingFill * smoothstep(0.02, 0.42, state.globalProgress),
              fill,
            );
          } else {
            const edgeDrain = Math.max(0, current - neighbourAverage) * 0.12;
            next = Math.max(0, current - (0.014 + variation * 0.026 + edgeDrain) * frameScale);
          }

          state.nextField[index] = clamp(next, 0, 1);
          strongestValue = Math.max(strongestValue, state.nextField[index]);
        }
      }

      const previous = state.field;
      state.field = state.nextField;
      state.nextField = previous;
      state.hasReveal = strongestValue > 0.012;
    }

    function drawOrganicReveal() {
      if (!state.hasReveal || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        revealContext.clearRect(0, 0, state.displayWidth, state.displayHeight);
        return;
      }

      for (let index = 0; index < state.field.length; index += 1) {
        state.imageData.data[index * 4 + 3] = Math.round(smoothstep(0.1, 0.82, state.field[index]) * 255);
      }

      state.maskContext.putImageData(state.imageData, 0, 0);
      revealContext.clearRect(0, 0, state.displayWidth, state.displayHeight);
      revealContext.globalCompositeOperation = 'source-over';
      revealContext.globalAlpha = 1;
      revealContext.imageSmoothingEnabled = true;
      drawVideoCover(revealContext, video, state.displayWidth, state.displayHeight, cropPosition);
      revealContext.globalCompositeOperation = 'destination-in';
      revealContext.drawImage(state.maskCanvas, 0, 0, state.displayWidth, state.displayHeight);
      if (revealBrightness > 0) {
        revealContext.globalCompositeOperation = 'source-atop';
        revealContext.fillStyle = `rgba(255, 255, 255, ${revealBrightness})`;
        revealContext.fillRect(0, 0, state.displayWidth, state.displayHeight);
      }
      revealContext.globalCompositeOperation = 'source-over';
    }

    function drawReducedReveal(delta) {
      const targetOpacity = state.hovered ? 1 : 0;
      state.reducedOpacity += (targetOpacity - state.reducedOpacity) * Math.min(1, (delta / 160) * 0.7);
      state.hasReveal = state.reducedOpacity > 0.012;
      revealContext.clearRect(0, 0, state.displayWidth, state.displayHeight);

      if (state.reducedOpacity <= 0.012 || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      revealContext.globalAlpha = state.reducedOpacity;
      revealContext.imageSmoothingEnabled = true;
      drawVideoCover(revealContext, video, state.displayWidth, state.displayHeight, cropPosition);
      if (revealBrightness > 0) {
        revealContext.globalCompositeOperation = 'source-atop';
        revealContext.fillStyle = `rgba(255, 255, 255, ${revealBrightness})`;
        revealContext.fillRect(0, 0, state.displayWidth, state.displayHeight);
      }
      revealContext.globalCompositeOperation = 'source-over';
      revealContext.globalAlpha = 1;
    }

    function scheduleFrame() {
      if (state.animationFrame || state.disposed) return;

      state.animationFrame = requestAnimationFrame((timestamp) => {
        state.animationFrame = null;
        const delta = Math.min(Math.max(timestamp - state.lastTimestamp, 8), 48);
        state.lastTimestamp = timestamp;

        if (state.visible) {
          drawPixelatedVideo();
          if (reducedMotion) {
            drawReducedReveal(delta);
          } else if (state.hasReveal || state.hovered) {
            simulateField(delta);
            drawOrganicReveal();
          }
        }

        const revealIsMoving = reducedMotion
          ? Math.abs((state.hovered ? 1 : 0) - state.reducedOpacity) > 0.012
          : state.hasReveal || state.hovered;

        if ((state.visible && !reducedMotion) || (state.visible && revealIsMoving)) {
          scheduleFrame();
        }
      });
    }

    state.scheduleFrame = scheduleFrame;

    function pointFromEvent(event) {
      const bounds = state.bounds;
      if (!bounds) return null;

      return {
        x: clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
        y: clamp((event.clientY - bounds.top) / bounds.height, 0, 1),
      };
    }

    function beginReveal(event) {
      updateBounds();
      const point = pointFromEvent(event);
      if (!point) return;

      state.hovered = true;
      state.touchActivated = false;
      state.pointerX = point.x;
      state.pointerY = point.y;
      state.previousPointerX = null;
      state.previousPointerY = null;
      stampTrail(point.x, point.y);
      scheduleFrame();
    }

    function moveReveal(event) {
      const point = pointFromEvent(event);
      if (!point) return;

      state.pointerX = point.x;
      state.pointerY = point.y;
      stampTrail(point.x, point.y);
      scheduleFrame();
    }

    function endReveal() {
      state.hovered = false;
      state.touchActivated = false;
      state.previousPointerX = null;
      state.previousPointerY = null;
      scheduleFrame();
    }

    function activateTouchFallback() {
      state.hovered = true;
      state.touchActivated = true;
      state.previousPointerX = null;
      state.previousPointerY = null;
      stampTrail(0.5, 0.5);
      scheduleFrame();
    }

    revealControllerRef.current = {
      activate: activateTouchFallback,
      enter: beginReveal,
      leave: endReveal,
      move: moveReveal,
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible) {
          updateDimensions();
          startVideo();
          scheduleFrame();
        }
      },
      { threshold: 0.05 },
    );
    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
      updateDimensions();
      scheduleFrame();
    });

    updateBounds();
    updateDimensions();
    intersectionObserver.observe(container);
    resizeObserver.observe(container);
    window.addEventListener('scroll', updateBounds, true);
    video.addEventListener('loadeddata', startVideo);
    video.addEventListener('loadeddata', scheduleFrame);
    video.addEventListener('playing', scheduleFrame);
    startVideo();

    return () => {
      state.disposed = true;
      cancelAnimationFrame(state.animationFrame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateBounds, true);
      video.removeEventListener('loadeddata', startVideo);
      video.removeEventListener('loadeddata', scheduleFrame);
      video.removeEventListener('playing', scheduleFrame);
      if (revealControllerRef.current?.enter === beginReveal) revealControllerRef.current = null;
    };
  }, [cropPosition, interactionTargetRef, reducedMotion, revealBrightness, revealControllerRef, src]);

  useEffect(() => {
    const state = simulationRef.current;
    if (!state || isSelected || !state.touchActivated) return;

    state.hovered = false;
    state.touchActivated = false;
    state.previousPointerX = null;
    state.previousPointerY = null;
    state.scheduleFrame?.();
  }, [isSelected]);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 isolate overflow-hidden bg-brand-black">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition }}
        src={src}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload={reducedMotion ? 'auto' : 'metadata'}
        disablePictureInPicture
      />
      <canvas ref={pixelCanvasRef} className="absolute inset-0 z-[1] h-full w-full" style={{ imageRendering: 'pixelated' }} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-brand-black/70" />
      <canvas ref={revealCanvasRef} className="pointer-events-none absolute inset-0 z-[3] h-full w-full" />
    </div>
  );
}
