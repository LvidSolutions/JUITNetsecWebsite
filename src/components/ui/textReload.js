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
    const index = Math.floor((seed / 0x100000000) * variants.length);
    return variants[index];
  }

  return TECHNICAL_GLYPHS[seed % TECHNICAL_GLYPHS.length];
}

export function createGlyphRail(character, seed, maxIntermediates = 4) {
  if (/\s/.test(character)) return [character];

  let current = seed >>> 0;
  [current] = nextRandom(current);
  const intermediateCount = 2 + Math.floor((current / 0x100000000) * Math.max(1, maxIntermediates - 1));
  const rail = [];

  for (let index = 0; index < intermediateCount; index += 1) {
    [current] = nextRandom(current);
    rail.push(glyphFor(character, current));
  }

  rail.push(character);
  return rail;
}

export function createReloadWords(text, seed, maxIntermediates) {
  let current = seed >>> 0;
  let characterIndex = 0;

  return text.split(/(\s+)/).map((token, tokenIndex) => {
    if (/^\s+$/.test(token)) {
      return { type: 'space', value: token, key: `space-${tokenIndex}` };
    }

    const glyphs = Array.from(token).map((character) => {
      [current] = nextRandom(current);
      const rail = createGlyphRail(character, current, maxIntermediates);
      const glyph = {
        character,
        rail,
        delay: characterIndex * 11 + Math.floor((current / 0x100000000) * 6),
        key: `glyph-${tokenIndex}-${characterIndex}`,
      };
      characterIndex += 1;
      return glyph;
    });

    return { type: 'word', glyphs, key: `word-${tokenIndex}` };
  });
}

export function reloadConfig(intensity = 'medium') {
  if (intensity === 'subtle') {
    return { duration: 260, maxIntermediates: 3, settleDelay: 70 };
  }
  if (intensity === 'strong') {
    return { duration: 440, maxIntermediates: 5, settleDelay: 130 };
  }
  return { duration: 340, maxIntermediates: 4, settleDelay: 100 };
}
