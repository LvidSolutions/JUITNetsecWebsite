const TECHNICAL_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]{}<>/\\|_-=+*#%!?';

const signatureGlyphs = {
  A: ['4', 'V'],
  E: ['3', '='],
  G: ['6', 'C'],
  I: ['1', '|'],
  M: ['N', 'W'],
  O: ['0', 'Q'],
  R: ['7', 'K'],
  S: ['5', 'Z'],
  T: ['7', '+'],
  U: ['V', ']'],
  Y: ['V', '7'],
};

function nextRandom(seed) {
  const next = (seed * 1664525 + 1013904223) >>> 0;
  return [next, next / 0x100000000];
}

function glyphFor(character, seed) {
  const variants = signatureGlyphs[character.toUpperCase()];
  if (variants) {
    return variants[Math.floor((seed / 0x100000000) * variants.length)];
  }

  return TECHNICAL_GLYPHS[seed % TECHNICAL_GLYPHS.length];
}

function createGlyphRail(character, seed, config) {
  let current = seed >>> 0;
  [current] = nextRandom(current);
  const range = config.maxIntermediates - config.minIntermediates;
  const count = config.minIntermediates + Math.floor((current / 0x100000000) * (range + 1));
  const rail = [];

  for (let index = 0; index < count; index += 1) {
    [current] = nextRandom(current);
    rail.push(glyphFor(character, current));
  }

  rail.push(character);
  return rail;
}

function createWords(text) {
  let glyphIndex = 0;
  let tokenIndex = 0;

  return text.split(/(\s+)/).map((token) => {
    const key = `token-${tokenIndex}`;
    tokenIndex += 1;

    if (token === '\n') return { type: 'break', key };
    if (/^\s+$/.test(token)) return { type: 'space', value: token, key };

    return {
      type: 'word',
      key,
      glyphs: Array.from(token).map((character) => {
        const glyph = { character, index: glyphIndex };
        glyphIndex += 1;
        return glyph;
      }),
    };
  });
}

export function createSelectiveSequence(text, seed, config) {
  const words = createWords(text);
  const candidates = words.filter((word) => word.type === 'word' && word.glyphs.length > config.minSegment);
  const stripCount = Math.min(config.stripCount, candidates.length);
  const selectedGlyphs = new Map();
  let current = seed >>> 0;
  let maxDelay = 0;

  for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
    [current] = nextRandom(current);
    const segmentStart = Math.floor((stripIndex * candidates.length) / stripCount);
    const segmentEnd = Math.max(segmentStart, Math.floor(((stripIndex + 1) * candidates.length) / stripCount) - 1);
    const word = candidates[segmentStart + Math.floor((current / 0x100000000) * (segmentEnd - segmentStart + 1))];
    const segmentLength = Math.min(
      word.glyphs.length - 1,
      config.minSegment + Math.floor((current / 0x100000000) * (config.maxSegment - config.minSegment + 1)),
    );
    const startLimit = Math.max(0, word.glyphs.length - segmentLength);

    [current] = nextRandom(current);
    const start = Math.floor((current / 0x100000000) * (startLimit + 1));

    word.glyphs.slice(start, start + segmentLength).forEach((glyph, glyphOffset) => {
      [current] = nextRandom(current);
      const delay = stripIndex * config.stripStagger + glyphOffset * config.glyphStagger;
      selectedGlyphs.set(glyph.index, {
        ...glyph,
        delay,
        rail: createGlyphRail(glyph.character, current, config),
      });
      maxDelay = Math.max(maxDelay, delay);
    });
  }

  return {
    words: words.map((word) =>
      word.type === 'word'
        ? {
            ...word,
            glyphs: word.glyphs.map((glyph) => selectedGlyphs.get(glyph.index) || glyph),
          }
        : word,
    ),
    duration: config.duration + maxDelay,
  };
}

export function reloadConfig() {
  return {
    duration: 260,
    minIntermediates: 3,
    maxIntermediates: 5,
    stripCount: 3,
    minSegment: 2,
    maxSegment: 5,
    stripStagger: 54,
    glyphStagger: 16,
    settleDelay: 80,
  };
}
