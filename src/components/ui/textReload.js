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

function createStartPoints(length, seed, count) {
  if (length <= 1) return [0];

  let current = seed >>> 0;
  const anchors = [];

  for (let index = 0; index < count; index += 1) {
    [current] = nextRandom(current);
    const segmentStart = Math.floor((index * length) / count);
    const segmentEnd = Math.max(segmentStart, Math.floor(((index + 1) * length) / count) - 1);
    const span = segmentEnd - segmentStart + 1;
    anchors.push(segmentStart + Math.floor((current / 0x100000000) * span));
  }

  return [...new Set(anchors)].sort((first, second) => first - second);
}

export function createGlyphRail(character, seed, minIntermediates = 3, maxIntermediates = 6) {
  if (/\s/.test(character)) return [character];

  let current = seed >>> 0;
  [current] = nextRandom(current);
  const range = Math.max(0, maxIntermediates - minIntermediates);
  const intermediateCount = minIntermediates + Math.floor((current / 0x100000000) * (range + 1));
  const rail = [];

  for (let index = 0; index < intermediateCount; index += 1) {
    [current] = nextRandom(current);
    rail.push(glyphFor(character, current));
  }

  rail.push(character);
  return rail;
}

export function createReloadSequence(text, seed, config) {
  const characters = Array.from(text);
  const activeIndexes = characters
    .map((character, index) => (character === '\n' || /\s/.test(character) ? -1 : index))
    .filter((index) => index >= 0);
  const anchorCount = Math.min(config.anchorCount, Math.max(1, Math.ceil(activeIndexes.length / 7)));
  const anchors = createStartPoints(activeIndexes.length, seed, anchorCount).map((index) => activeIndexes[index]);
  let current = seed >>> 0;
  let maxDelay = 0;
  let activeIndex = 0;
  let tokenIndex = 0;
  const words = [];
  let word = null;

  characters.forEach((character, characterIndex) => {
    if (character === '\n') {
      words.push({ type: 'break', key: `break-${tokenIndex}` });
      tokenIndex += 1;
      word = null;
      return;
    }

    if (/\s/.test(character)) {
      words.push({ type: 'space', value: character, key: `space-${tokenIndex}` });
      tokenIndex += 1;
      word = null;
      return;
    }

    if (!word) {
      word = { type: 'word', glyphs: [], key: `word-${tokenIndex}` };
      words.push(word);
      tokenIndex += 1;
    }

    [current] = nextRandom(current);
    const distance = Math.min(...anchors.map((anchor) => Math.abs(characterIndex - anchor)));
    const jitter = Math.floor((current / 0x100000000) * config.delayJitter);
    const delay = distance * config.waveStep + jitter;
    const rail = createGlyphRail(character, current, config.minIntermediates, config.maxIntermediates);

    word.glyphs.push({
      character,
      rail,
      delay,
      key: `glyph-${characterIndex}-${activeIndex}`,
    });
    maxDelay = Math.max(maxDelay, delay);
    activeIndex += 1;
  });

  return {
    words,
    duration: config.duration + maxDelay,
  };
}

export function reloadConfig(intensity = 'medium') {
  if (intensity === 'subtle') {
    return {
      duration: 240,
      minIntermediates: 3,
      maxIntermediates: 4,
      anchorCount: 3,
      waveStep: 16,
      delayJitter: 6,
      settleDelay: 60,
    };
  }

  if (intensity === 'strong') {
    return {
      duration: 360,
      minIntermediates: 4,
      maxIntermediates: 6,
      anchorCount: 5,
      waveStep: 18,
      delayJitter: 8,
      settleDelay: 90,
    };
  }

  return {
    duration: 300,
    minIntermediates: 3,
    maxIntermediates: 5,
    anchorCount: 4,
    waveStep: 17,
    delayJitter: 7,
    settleDelay: 75,
  };
}
