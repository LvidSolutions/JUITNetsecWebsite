import { useEffect } from 'react';
import './DistortedText.css';
import { createReloadWords, reloadConfig } from './textReload.js';

const textSelector = 'h1, h2, h3, h4, h5, h6, p, a, button, span, dt, dd, li';

function directText(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sourceText(element) {
  return Array.from(element.childNodes)
    .map((node) => (node.nodeName === 'BR' ? '\n' : node.textContent))
    .join('')
    .replace(/[\t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();
}

function getIntensity(element) {
  const strong = element.matches('h1, h2') || element.classList.contains('footer-stats-panel__value');
  if (strong) return 'strong';
  if (element.matches('p, a, button')) return 'medium';
  return 'subtle';
}

function createLayer(documentRef, value, seed, intensity) {
  const config = reloadConfig(intensity);
  const layer = documentRef.createElement('span');
  layer.className = 'text-reload-layer';
  layer.setAttribute('aria-hidden', 'true');

  createReloadWords(value, seed, config.maxIntermediates).forEach((word) => {
    if (word.type === 'space') {
      layer.append(word.value);
      return;
    }

    const wordElement = documentRef.createElement('span');
    wordElement.className = 'text-reload-word';

    word.glyphs.forEach((glyph) => {
      const glyphElement = documentRef.createElement('span');
      glyphElement.className = 'text-reload-glyph';

      const measure = documentRef.createElement('span');
      measure.className = 'text-reload-glyph__measure';
      measure.textContent = glyph.character;

      const track = documentRef.createElement('span');
      track.className = 'text-reload-glyph__track';
      track.style.setProperty('--glyph-delay', `${glyph.delay}ms`);
      track.style.setProperty('--glyph-travel', `-${glyph.rail.length - 1}em`);
      track.style.setProperty('--glyph-steps', glyph.rail.length - 1);
      glyph.rail.forEach((character) => {
        const glyphValue = documentRef.createElement('span');
        glyphValue.textContent = character;
        track.append(glyphValue);
      });

      glyphElement.append(measure, track);
      wordElement.append(glyphElement);
    });
    layer.append(wordElement);
  });

  return layer;
}

function wrapSource(element) {
  const sourceNodes = Array.from(element.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR',
  );
  if (!sourceNodes.some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())) return null;

  const source = document.createElement('span');
  source.className = 'text-reload-source';
  sourceNodes[0].before(source);
  sourceNodes.forEach((node) => source.append(node));
  return source;
}

export function HomeTextEffects() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll('[data-home-cursor-scope="true"]'));
    const registered = [];
    const observers = [];
    let seed = 101;

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

        const source = wrapSource(element);
        if (!source) return;
        const intensity = getIntensity(element);
        const config = reloadConfig(intensity);
        let sequence = 0;
        let timeout = 0;
        let hoverStarted = false;
        seed += 97;
        let layer = null;

        element.classList.add('home-text-distort');
        element.dataset.distortionText = value;
        element.dataset.cursor = element.closest('a, button') ? 'interactive' : 'text';
        element.style.setProperty('--reload-duration', `${config.duration}ms`);

        const onEnter = () => {
          if (hoverStarted) return;
          hoverStarted = true;
          window.clearTimeout(timeout);
          sequence += 1;
          layer?.remove();
          layer = createLayer(document, sourceText(source), seed + sequence * 7919, intensity);
          element.append(layer);
          element.dataset.distortionActive = 'true';
          element.dataset.reloadActive = 'true';
          timeout = window.setTimeout(() => {
            delete element.dataset.distortionActive;
            delete element.dataset.reloadActive;
            layer?.remove();
            layer = null;
          }, config.duration + config.settleDelay);
        };
        const onLeave = () => {
          window.clearTimeout(timeout);
          hoverStarted = false;
          delete element.dataset.distortionActive;
          delete element.dataset.reloadActive;
          layer?.remove();
          layer = null;
        };

        element.addEventListener('pointerenter', onEnter);
        element.addEventListener('pointerleave', onLeave);
        element.addEventListener('pointermove', onEnter);
        registered.push({ element, source, layer: () => layer, onEnter, onLeave, timeout: () => timeout });
      });

      // Statistikvärden räknas upp efter mount. Synka endast det visuella
      // lagrets text när innehållet ändras; animationen och layouten rörs inte.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const target = mutation.target.nodeType === Node.TEXT_NODE ? mutation.target.parentElement : mutation.target;
          const element = target?.closest?.('.home-text-distort');
          if (!element) return;
          const source = element.querySelector(':scope > .text-reload-source');
          const value = source ? sourceText(source) : directText(element);
          if (value) element.dataset.distortionText = value;
        });
      });
      observer.observe(root, { childList: true, characterData: true, subtree: true });
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      registered.forEach(({ element, source, layer, onEnter, onLeave, timeout }) => {
        window.clearTimeout(timeout());
        element.removeEventListener('pointerenter', onEnter);
        element.removeEventListener('pointerleave', onLeave);
        element.removeEventListener('pointermove', onEnter);
        layer()?.remove();
        Array.from(source.childNodes).forEach((node) => source.before(node));
        source.remove();
        element.classList.remove('home-text-distort');
        delete element.dataset.distortionText;
        delete element.dataset.distortionActive;
        delete element.dataset.cursor;
        element.style.removeProperty('--reload-duration');
      });
    };
  }, []);

  return null;
}
