import { useCallback, useEffect, useRef, useState } from 'react';
import './ContactMonitorCTA.css';

const MODEL_UID = '89027483558948aab39357d669166ed8';
const VIEWER_SCRIPT_URL = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
const VIEWER_SCRIPT_ID = 'juit-sketchfab-viewer-api';
const CONTACT_ROUTE = '/kontakt';
const SCRIPT_TIMEOUT_MS = 12000;
const VIEWER_TIMEOUT_MS = 25000;

let viewerScriptPromise;

/**
 * @typedef {{ uid?: string }} SketchfabTexture
 * @typedef {{ enable?: boolean, color?: number[], texture?: SketchfabTexture }} SketchfabMaterialChannel
 * @typedef {{ id?: string, name?: string, stateSetID?: string, channels?: Record<string, SketchfabMaterialChannel> }} SketchfabMaterial
 * @typedef {{
 *   start: (callback?: () => void) => void,
 *   stop: () => void,
 *   setUserInteraction: (enabled: boolean, callback?: (error: unknown) => void) => void,
 *   addEventListener: (event: string, callback: () => void) => void,
 *   getMaterialList: (callback: (error: unknown, materials?: SketchfabMaterial[]) => void) => void,
 *   getTextureList: (callback: (error: unknown, textures?: unknown[]) => void) => void,
 *   getSceneGraph: (callback: (error: unknown, graph?: unknown) => void) => void,
 *   addTexture: (source: string, callback: (error: unknown, textureUid?: string) => void) => void,
 *   setMaterial: (material: SketchfabMaterial, callback?: () => void) => void
 * }} SketchfabAPI
 * @typedef {{ init: (uid: string, options: { autostart: number, autospin: number, scrollwheel: number, animation_autoplay: number, camera: number, dnt: number, dof_circle: number, ui_hint: number, max_texture_size: number, success: (api: SketchfabAPI) => void, error: () => void }) => void }} SketchfabClient
 */

function loadViewerScript(allowRetry = true) {
  if (window.Sketchfab) {
    return Promise.resolve();
  }

  if (viewerScriptPromise) {
    return viewerScriptPromise;
  }

  viewerScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(VIEWER_SCRIPT_ID);
    const script = existing || document.createElement('script');
    let settled = false;

    const finish = (callback) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      callback();
    };

    const handleLoad = () => {
      finish(() => (window.Sketchfab ? resolve() : reject(new Error('Sketchfab API was unavailable after load.'))));
    };

    const handleError = () => finish(() => reject(new Error('Sketchfab Viewer API could not load.')));
    const timeout = window.setTimeout(
      () => finish(() => reject(new Error('Sketchfab Viewer API load timed out.'))),
      SCRIPT_TIMEOUT_MS,
    );

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    if (!existing) {
      script.id = VIEWER_SCRIPT_ID;
      script.src = VIEWER_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  }).catch(async (error) => {
    viewerScriptPromise = undefined;
    document.getElementById(VIEWER_SCRIPT_ID)?.remove();

    if (allowRetry) {
      return loadViewerScript(false);
    }

    throw error;
  });

  return viewerScriptPromise;
}

function createContactTexture() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;

  canvas.width = 2048;
  canvas.height = 1024;

  context.fillStyle = '#050505';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'rgba(255, 255, 255, 0.055)';
  context.lineWidth = 2;
  for (let x = 0; x <= canvas.width; x += 128) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 128) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.fillStyle = '#00C853';
  context.fillRect(160, 220, 18, 482);
  context.font = "600 52px 'Space Grotesk', sans-serif";
  context.letterSpacing = '16px';
  context.fillStyle = '#A9E8B4';
  context.fillText('SECURE CONNECTION', 230, 282);
  context.font = "700 184px 'Space Grotesk', sans-serif";
  context.letterSpacing = '4px';
  context.fillStyle = '#FFFFFF';
  context.fillText('CONTACT US', 226, 512);
  context.strokeStyle = '#00C853';
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(230, 632);
  context.lineTo(760, 632);
  context.lineTo(820, 572);
  context.moveTo(760, 632);
  context.lineTo(820, 692);
  context.stroke();
  context.font = "500 38px 'Space Grotesk', sans-serif";
  context.letterSpacing = '10px';
  context.fillStyle = '#E5E7EB';
  context.fillText('START A TECHNICAL DISCUSSION', 230, 756);

  return canvas.toDataURL('image/png');
}

function materialScore(material) {
  const name = `${material.name || ''} ${material.id || ''} ${material.stateSetID || ''}`.toLowerCase();
  const channels = material.channels || {};
  let score = 0;

  if (/screen/.test(name)) score += 60;
  if (/lcd|display/.test(name)) score += 55;
  if (/monitor/.test(name)) score += 45;
  if (/panel/.test(name)) score += 40;
  if (/emissive|emit/.test(name)) score += 25;
  if (/glass/.test(name)) score += 10;
  if (channels.EmitColor?.enable) score += 18;
  if (channels.AlbedoPBR?.texture?.uid || channels.DiffuseColor?.texture?.uid) score += 12;

  return score;
}

function findScreenMaterial(materials) {
  return materials
    .map((material) => ({ material, score: materialScore(material) }))
    .sort((a, b) => b.score - a.score)[0] || null;
}

function cloneMaterial(material) {
  return JSON.parse(JSON.stringify(material));
}

function isDedicatedScreenMaterial(candidate) {
  const candidateName = `${candidate?.material?.name || ''} ${candidate?.material?.id || ''}`.toLowerCase();
  return Boolean(candidate && /(screen|lcd|display|panel)/.test(candidateName));
}

function applyTextureToScreen(api, materials, textureUid) {
  const candidate = findScreenMaterial(materials);
  // This model exposes a single shared material (monitor_01). Updating it would
  // remap the body, bezel and screen together, so only dedicated screen-like
  // materials are eligible for a texture change.
  if (!isDedicatedScreenMaterial(candidate)) {
    return Promise.resolve({ applied: false, material: null });
  }

  const material = cloneMaterial(candidate.material);
  const channelName = material.channels?.AlbedoPBR ? 'AlbedoPBR' : material.channels?.DiffuseColor ? 'DiffuseColor' : null;
  if (!channelName) {
    return Promise.resolve({ applied: false, material: candidate.material });
  }

  material.channels[channelName].enable = true;
  material.channels[channelName].texture = { uid: textureUid };

  if (material.channels?.EmitColor) {
    material.channels.EmitColor.enable = true;
    material.channels.EmitColor.color = [0.08, 0.32, 0.14];
  }

  return new Promise((resolve) => {
    api.setMaterial(material, () => {
      api.getMaterialList((error, updatedMaterials = []) => {
        const updatedMaterial = updatedMaterials.find(
          (item) => item.stateSetID === material.stateSetID || item.id === material.id,
        );
        const persistedTexture = updatedMaterial?.channels?.[channelName]?.texture?.uid;
        resolve({
          applied: !error && persistedTexture === textureUid,
          material: candidate.material,
        });
      });
    });
  });
}

export function ContactMonitorCTA() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const animationRef = useRef(0);
  const loadedRef = useRef(false);
  const visibleRef = useRef(true);
  const mountedRef = useRef(true);
  const apiRef = useRef(null);
  const tiltRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0, lastTime: 0, hovering: false });
  const [mode, setMode] = useState('placeholder');
  const [screenMaterial, setScreenMaterial] = useState('');
  const [textureStatus, setTextureStatus] = useState('pending');
  const [textureUid, setTextureUid] = useState('');

  const updateTilt = useCallback((time) => {
    const target = tiltRef.current;
    const element = containerRef.current;
    if (!element || !visibleRef.current) return;

    const elapsed = Math.min((time - target.lastTime) / 1000 || 0.016, 0.05);
    target.lastTime = time;
    const smoothing = 1 - Math.exp(-elapsed / 0.14);
    target.currentX += (target.targetX - target.currentX) * smoothing;
    target.currentY += (target.targetY - target.currentY) * smoothing;
    element.style.setProperty('--monitor-rotate-x', `${target.currentX.toFixed(3)}deg`);
    element.style.setProperty('--monitor-rotate-y', `${target.currentY.toFixed(3)}deg`);

    const settled = Math.abs(target.targetX - target.currentX) < 0.02 && Math.abs(target.targetY - target.currentY) < 0.02;
    if (!settled || target.hovering) {
      animationRef.current = window.requestAnimationFrame(updateTilt);
    } else {
      animationRef.current = 0;
    }
  }, []);

  const startTilt = useCallback(() => {
    if (!animationRef.current && visibleRef.current) {
      animationRef.current = window.requestAnimationFrame(updateTilt);
    }
  }, [updateTilt]);

  useEffect(() => {
    mountedRef.current = true;
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startTilt();
        } else if (animationRef.current) {
          window.cancelAnimationFrame(animationRef.current);
          animationRef.current = 0;
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(element);

    return () => {
      mountedRef.current = false;
      observer.disconnect();
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      apiRef.current?.stop?.();
    };
  }, [startTilt]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || loadedRef.current) return undefined;

    let observer;
    const beginLoad = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      setMode('loading');

      loadViewerScript()
        .then(() => {
          if (!mountedRef.current || !frameRef.current || !window.Sketchfab) return;

          const client = new window.Sketchfab('1.12.1', frameRef.current);
          const timeout = window.setTimeout(() => {
            if (mountedRef.current && !apiRef.current) setMode('fallback');
          }, VIEWER_TIMEOUT_MS);

          client.init(MODEL_UID, {
            autostart: 1,
            autospin: 0,
            scrollwheel: 0,
            animation_autoplay: 0,
            camera: 0,
            dnt: 1,
            dof_circle: 0,
            ui_hint: 0,
            max_texture_size: 1024,
            success(api) {
              if (!mountedRef.current) {
                api.stop();
                return;
              }
              apiRef.current = api;
              api.start();
              api.setUserInteraction(false);
              api.addEventListener('viewerready', () => {
                window.clearTimeout(timeout);
                if (!mountedRef.current) return;
                setMode('viewer');

                const texture = createContactTexture();
                if (!texture) {
                  setMode('viewer-fallback');
                  return;
                }

                api.getTextureList(() => {});
                api.getSceneGraph(() => {});
                api.getMaterialList((error, materials = []) => {
                  if (error || !materials.length || !mountedRef.current) {
                    if (mountedRef.current) setMode('viewer-fallback');
                    return;
                  }

                  const candidate = findScreenMaterial(materials);
                  if (!isDedicatedScreenMaterial(candidate)) {
                    setScreenMaterial(candidate?.material?.name || candidate?.material?.id || 'none');
                    setTextureStatus('fallback');
                    setMode('viewer-fallback');
                    return;
                  }

                  api.addTexture(texture, (textureError, textureUid) => {
                    if (textureError || !textureUid || !mountedRef.current) {
                      if (mountedRef.current) setMode('viewer-fallback');
                      return;
                    }

                    applyTextureToScreen(api, materials, textureUid).then(({ applied, material }) => {
                      if (!mountedRef.current) return;
                      if (applied) {
                        setScreenMaterial(material?.name || material?.id || material?.stateSetID || 'screen');
                        setTextureStatus('applied');
                        setTextureUid(textureUid);
                      } else {
                        setTextureStatus('fallback');
                        setMode('viewer-fallback');
                      }
                    });
                  });
                });
              });
            },
            error() {
              window.clearTimeout(timeout);
              if (mountedRef.current) setMode('fallback');
            },
          });
        })
        .catch(() => {
          if (mountedRef.current) setMode('fallback');
        });
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        beginLoad();
      },
      { rootMargin: '400px 0px', threshold: 0.01 },
    );
    observer.observe(element);

    return () => observer?.disconnect();
  }, []);

  const handlePointerMove = (event) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const percentX = ((event.clientX - rect.left) / rect.width) * 100;
    const percentY = ((event.clientY - rect.top) / rect.height) * 100;
    const target = tiltRef.current;
    target.targetX = Math.max(-6, Math.min(6, -(percentY - 50) * 0.12));
    target.targetY = Math.max(-9, Math.min(9, (percentX - 50) * 0.18));
    containerRef.current?.style.setProperty('--monitor-pointer-x', `${percentX}%`);
    containerRef.current?.style.setProperty('--monitor-pointer-y', `${percentY}%`);
    target.hovering = true;
    startTilt();
  };

  const handlePointerLeave = () => {
    const target = tiltRef.current;
    target.targetX = 0;
    target.targetY = 0;
    target.hovering = false;
    containerRef.current?.style.setProperty('--monitor-pointer-x', '50%');
    containerRef.current?.style.setProperty('--monitor-pointer-y', '50%');
    startTilt();
  };

  const showFallbackLabel = mode === 'viewer-fallback';
  const showLocalFallback = mode === 'fallback';

  return (
    <div
      className="contact-monitor-cta mt-8 sm:mt-10"
      data-mode={mode}
      data-screen-material={screenMaterial || undefined}
      data-texture-status={textureStatus}
      data-texture-uid={textureUid || undefined}
    >
      <div
        ref={containerRef}
        className="contact-monitor-cta__tilt"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
      >
        <div className="contact-monitor-cta__glow" aria-hidden="true" />
        <div className="contact-monitor-cta__frame">
          {showLocalFallback && (
            <div className="contact-monitor-cta__local-fallback" aria-hidden="true">
              <span className="contact-monitor-cta__fallback-kicker">Secure connection</span>
              <strong>CONTACT US</strong>
              <span className="contact-monitor-cta__fallback-arrow">&rarr;</span>
            </div>
          )}
          <iframe
            ref={frameRef}
            className="contact-monitor-cta__viewer"
            title="Interactive contact monitor"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
          />
          {(mode === 'placeholder' || mode === 'loading') && (
            <div className="contact-monitor-cta__placeholder" aria-hidden="true">
              <span />
            </div>
          )}
          {showFallbackLabel && (
            <div className="contact-monitor-cta__fallback-label" aria-hidden="true">
              <span>Secure connection</span>
              <strong>Contact us</strong>
              <em>Open a technical discussion</em>
            </div>
          )}
        </div>
        <a
          className="contact-monitor-cta__interaction"
          href={CONTACT_ROUTE}
          aria-label="Go to the contact page"
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.click();
          }}
        >
          <span className="sr-only">Contact us</span>
        </a>
      </div>
      <p className="contact-monitor-cta__caption" aria-live="polite">
        {mode === 'viewer' ? 'Contact us' : 'Start a technical discussion'}
      </p>
    </div>
  );
}
