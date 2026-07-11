import { useEffect, useRef, useState } from 'react';

function isDocumentVisible() {
  return typeof document === 'undefined' || document.visibilityState !== 'hidden';
}

export function HeroVideoBackground() {
  const videoRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);
  const [pageVisible, setPageVisible] = useState(isDocumentVisible);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;

    const sync = () => {
      setUseVideo(desktop.matches && !reduced.matches && !connection?.saveData);
    };

    const syncVisibility = () => setPageVisible(isDocumentVisible());

    sync();
    desktop.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    connection?.addEventListener?.('change', sync);
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      desktop.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      connection?.removeEventListener?.('change', sync);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (useVideo && pageVisible) {
      video.play()?.catch(() => {});
    } else {
      video.pause();
    }
  }, [pageVisible, useVideo]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-brand-black">
      {useVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/assets/go-to-loop.mp4" type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-brand-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,200,83,0.22),transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-brand-black via-brand-black/55 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-black/55 to-transparent" />
      <div className="hero-grid absolute inset-0 opacity-15" />
    </div>
  );
}
