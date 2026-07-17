import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const VIDEO_SOURCE = '/assets/cosmos-services-columns.mp4';
const PANEL_GLIDE = [1, 0.5, 0, 0.5, 1];
const PANEL_MEDIA_Y = [0.58, 0.53, 0.48, 0.43, 0.38];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function useDesktopLayout() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return desktop;
}

function drawGlideFrame(context, video, width, height, glideOffset) {
  const gap = clamp(width * 0.005, 6, 18);
  const columnWidth = (width - gap * 13) / 14;
  const panelWidth = columnWidth * 2 + gap;
  const panelHeight = panelWidth * 2.4;
  const step = clamp(width * 0.02, 12, 32);
  const videoScale = Math.max(width / video.videoWidth, panelHeight / video.videoHeight);
  const videoWidth = video.videoWidth * videoScale;
  const videoHeight = video.videoHeight * videoScale;
  const videoX = (width - videoWidth) / 2;

  context.clearRect(0, 0, width, height);

  PANEL_GLIDE.forEach((glide, index) => {
    const x = (index * 2 + 2) * (columnWidth + gap);
    const y = step * (4 - index) + glideOffset * glide;
    const videoY = -(videoHeight - panelHeight) * PANEL_MEDIA_Y[index];

    context.save();
    context.beginPath();
    context.rect(x, y, panelWidth, panelHeight);
    context.clip();
    context.drawImage(video, videoX, y + videoY, videoWidth, videoHeight);

    const shade = context.createLinearGradient(0, y, 0, y + panelHeight);
    shade.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    shade.addColorStop(0.35, 'rgba(0, 0, 0, 0)');
    shade.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    context.fillStyle = shade;
    context.fillRect(x, y, panelWidth, panelHeight);
    context.restore();
  });
}

/**
 * The original version mounted five copies of the same MP4 and then corrected
 * decoder drift with a timer. This canvas keeps the five visual windows but
 * uses a single decoder and only paints on real video frames.
 */
function DesktopGlideCanvas({ reduceMotion }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!stage || !canvas || !video) return undefined;

    const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!context) return undefined;

    let frameRequest = 0;
    let videoFrameRequest = 0;
    let lastScrollY = window.scrollY;
    let targetOffset = 0;
    let currentOffset = 0;
    let visible = false;
    let width = 0;
    let height = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    function paint() {
      if (!visible || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !width || !height) return;
      currentOffset += (targetOffset - currentOffset) * 0.2;
      targetOffset *= 0.86;
      if (Math.abs(targetOffset) < 0.05) targetOffset = 0;
      if (Math.abs(currentOffset) < 0.05) currentOffset = 0;
      drawGlideFrame(context, video, width, height, reduceMotion ? 0 : currentOffset);
    }

    function queuePaint() {
      if (!frameRequest) {
        frameRequest = window.requestAnimationFrame(() => {
          frameRequest = 0;
          paint();
        });
      }
    }

    function onVideoFrame() {
      paint();
      if (visible && 'requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        videoFrameRequest = video.requestVideoFrameCallback(onVideoFrame);
      }
    }

    function resize() {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      queuePaint();
    }

    function onScroll() {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!reduceMotion) targetOffset = clamp(targetOffset - delta * 0.26, -56, 56);
      queuePaint();
    }

    function startVideo() {
      video.play().catch(() => {});
      queuePaint();
      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype && !videoFrameRequest) {
        videoFrameRequest = video.requestVideoFrameCallback(onVideoFrame);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startVideo();
        else video.pause();
      },
      { rootMargin: '160px 0px' },
    );
    const resizeObserver = new ResizeObserver(resize);

    observer.observe(stage);
    resizeObserver.observe(stage);
    video.addEventListener('loadeddata', resize, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    resize();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      video.removeEventListener('loadeddata', resize);
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
      if (videoFrameRequest && 'cancelVideoFrameCallback' in HTMLVideoElement.prototype) {
        video.cancelVideoFrameCallback(videoFrameRequest);
      }
    };
  }, [reduceMotion]);

  return (
    <div ref={stageRef} className="glide-services-hero__canvas-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="glide-services-hero__canvas" />
      <video ref={videoRef} loop muted playsInline preload="metadata" src={VIDEO_SOURCE} />
    </div>
  );
}

export function GlideServicesHero() {
  const reduceMotion = useReducedMotion();
  const desktop = useDesktopLayout();

  return (
    <section className="glide-services-hero" aria-labelledby="services-hero-title">
      <div className="glide-services-hero__composition">
        <div className="glide-services-hero__intro">
          <p className="glide-services-hero__label">Services</p>
          <h1 id="services-hero-title">Cybersecurity, networking and secure IT services</h1>
          <p>
            Practical expertise for resilient infrastructure, secure operations and technical
            decision-making.
          </p>
        </div>
        {desktop ? (
          <DesktopGlideCanvas reduceMotion={reduceMotion} />
        ) : (
          <div className="glide-services-hero__mobile-media" aria-hidden="true">
            <video autoPlay loop muted playsInline preload="metadata" src={VIDEO_SOURCE} />
          </div>
        )}
      </div>
    </section>
  );
}
