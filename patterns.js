import { createDraft } from './model.js';

// Fixed chart drafts: holes A–D in each string; one F/B string per pick.
// Picks are chronological. Colors approximate the reference images.
const CHART_DRAFTS = {
  "ember-lattice": {
    palette: {"K": "#080808", "R": "#bf2314", "G": "#a38e55", "N": "#f1e3c9"},
    threading: ["KKKK", "KKKK", "RRKG", "GRNK", "KGRN", "NKGR", "RNKG", "GRNK", "KGRN", "NKGR", "RNKG", "GRNK", "KGRN", "NKGR", "GKNR", "KNRG", "NRGK", "RGKN", "GKNR", "KNRG", "NRGK", "RGKN", "GKNR", "KNRG", "NRGK", "RRKN", "KKKK", "KKKK"],
    slants: "SZZZZZZZZZZZZZSSSSSSSSSSSSSZ",
    turns: [
      "FFBBFFFFBBBBBBBBBBBBFFFFBBFF",
      "FFBBFFFFBBBBBBBBBBBBFFFFBBFF",
      "FFFFFFFFFFBBBBBBBBFFFFFFFFFF",
      "FFFFFFFFFFBBBBBBBBFFFFFFFFFF",
      "FFFFFFBBFFFFFFFFFFFFBBFFFFFF",
      "FFFFFFBBFFFFFFFFFFFFBBFFFFFF",
      "FFBBBBFFFFFFFFFFFFFFFFBBBBFF",
      "FFBBBBFFFFFFFFFFFFFFFFBBBBFF",
      "FFBBBBBBBBFFFFFFFFBBBBBBBBFF",
      "FFBBBBBBBBFFFFFFFFBBBBBBBBFF",
      "FFFFBBBBBBBBFFFFFFFFBBBBFFFF",
      "FFFFBBBBBBBBFFFFFFFFBBBBFFFF",
      "FFBBFFFFBBBBBBBBFFFFFFFFBBFF",
      "FFBBFFFFBBBBBBBBFFFFFFFFBBFF",
      "FFFFFFFFFFBBFFBBBBFFFFFFFFFF",
      "FFFFFFFFFFBBFFBBBBFFFFFFFFFF",
      "FFBBBBBBBBFFFFBBFFBBBBBBBBFF",
      "FFBBBBBBBBFFFFBBFFBBBBBBBBFF",
      "FFFFBBBBBBBBFFFFFFFFBBBBFFFF",
      "FFFFBBBBBBBBFFFFFFFFBBBBFFFF",
      "FFBBFFFFBBBBBBBBFFFFFFFFBBFF",
      "FFBBFFFFBBBBBBBBFFFFFFFFBBFF",
      "FFFFFFFFFFBBFFBBBBFFFFFFFFFF",
      "FFFFFFFFFFBBFFBBBBFFFFFFFFFF",
      "FFBBBBBBBBFFFFBBFFBBBBBBBBFF",
      "FFBBBBBBBBFFFFBBFFBBBBBBBBFF",
      "FFFFBBBBBBBBFFFFFFFFBBBBFFFF",
      "FFFFBBBBBBBBFFFFFFFFBBBBFFFF",
      "FFBBFFFFBBBBBBBBFFFFFFFFBBFF",
      "FFBBFFFFBBBBBBBBFFFFFFFFBBFF",
      "FFFFFFFFFFBBBBBBBBFFFFFFFFFF",
      "FFFFFFFFFFBBBBBBBBFFFFFFFFFF",
      "FFFFFFBBBBBBBBBBBBBBBBFFFFFF",
      "FFFFFFBBBBBBBBBBBBBBBBFFFFFF",
      "FFBBBBFFBBBBBBBBBBBBFFBBBBFF",
      "FFBBBBFFBBBBBBBBBBBBFFBBBBFF",
      "FFBBBBBBBBFFFFFFFFBBBBBBBBFF",
      "FFBBBBBBBBFFFFFFFFBBBBBBBBFF",
      "FFFFBBBBFFFFFFFFFFFFBBBBFFFF",
      "FFFFBBBBFFFFFFFFFFFFBBBBFFFF",
      "FFBBFFBBFFFFFFFFFFFFBBFFBBFF",
      "FFBBFFBBFFFFFFFFFFFFBBFFBBFF",
      "FFFFBBFFBBBBBBBBBBBBFFBBFFFF",
      "FFFFBBFFBBBBBBBBBBBBFFBBFFFF",
      "FFBBFFFFBBBBBBBBBBBBFFFFBBFF",
      "FFBBFFFFBBBBBBBBBBBBFFFFBBFF",
    ],
  },
  "blue-scroll": {
    palette: {"K": "#080808", "W": "#f3eddd", "U": "#3475a8"},
    threading: ["KKKK", "WWWW", "WWWW", "WWWW", "WWWW", "WWWK", "WWKU", "WKUK", "KUKW", "UKWK", "UKWK", "UUKW", "UUUK", "UUUU", "UUUU", "UUUU", "UUUU", "KKKK"],
    slants: "SZSSSSSSSSZZZZZZSZ",
    turns: [
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFBBBFFBBBFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFF",
    ],
  },
  "scarlet-diamonds": {
    palette: {"K": "#080808", "R": "#920d0d", "N": "#e3e2d8"},
    threading: ["KKKK", "NNNN", "RRRK", "RRKN", "RKNN", "KNNN", "NKNN", "NNKN", "NNNK", "NNKR", "NKRR", "KRRR", "KRRR", "NKRR", "NNKR", "NNNK", "NNKN", "NKNN", "KNNN", "RKNN", "RRKN", "RRRK", "NNNN", "KKKK"],
    slants: "ZSSSSSSSSSSSZZZZZZZZZZZS",
    turns: [
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "FFFFFFFFFFFFFFFFFFFFFFFF",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
    ],
  },
  "turquoise-braid": {
    palette: {"K": "#080808", "G": "#818181", "R": "#d50b12", "U": "#16e9ed"},
    threading: ["KKKK", "RRRK", "KKKK", "RRRR", "RRRK", "RRKU", "UKUK", "KUKG", "UKGK", "KGKU", "UKUK", "KUKR", "RRRR", "KKKK", "RRRK", "KKKK"],
    slants: "SZSSSSSSSSSSSSSS",
    turns: [
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFFFF",
      "FFBBFFBBBBBFFFFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFFFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBFFFBBBFFFBFF",
      "FFBBFFBBBBBFFFFF",
      "FFBBBBBBBBBBBBFF",
      "FFBBBBBBBBBBBBFF",
    ],
  },
};

// Original double-faced adaptations of the photographed bands. Each pixel
// becomes two quarter-turns, so all previews come from real thread/turn data.
const PHOTO_MOTIFS = {
  "rose-vine": {
    palette: {"background": "#172e4b", "foreground": "#e7a2b3", "border": "#284f70"},
    pixels: [
      "00000000111100000000",
      "00000001111100000000",
      "00000011101110000000",
      "00000111000111000000",
      "00000110000011100000",
      "00000110000001110000",
      "00001111000000110000",
      "00001101000001110000",
      "00001111100011100000",
      "00000111000111000000",
      "00000011101110000000",
      "00100001011100000100",
      "00100000111000000100",
      "00000001110010000000",
      "00000011100111000000",
      "00000111000011100000",
      "00000110000111110000",
      "00000110000010110000",
      "00000110000011110000",
      "00000111000001100000",
      "00000011100001100000",
      "00000001110011100000",
      "00000000111111000000",
      "00000000011110000000",
    ],
  },
  "ivory-braid": {
    palette: {"background": "#234a75", "foreground": "#f0e8d1", "border": "#c6ad53"},
    pixels: [
      "00000000010100000000",
      "00000000001000000000",
      "00000000010100000000",
      "00000000100010000000",
      "00000001000001000000",
      "00000010000000100000",
      "00000101000100010000",
      "00000100101000010000",
      "00000100010000010000",
      "00000010000000100000",
      "00000001000001000000",
      "00100000100010000100",
      "00100000010100000100",
      "00000000001000000000",
      "00000000010100000000",
      "00000000100010000000",
      "00000001000001000000",
      "00000010000000100000",
      "00000100010001010000",
      "00000100001010010000",
      "00000100000100010000",
      "00000010000000100000",
      "00000001000001000000",
      "00000000100010000000",
    ],
  },
  "golden-ramshorns": {
    palette: {"background": "#511d25", "foreground": "#d7b46e", "border": "#1f272a", "optionalCenterAccent": "#f0e4bc"},
    pixels: [
      "000000000001000000000000",
      "000000000010100000000000",
      "000000000100010000000000",
      "000000001000001000000000",
      "000000010001000110000000",
      "000000100010100001000000",
      "000001000010010000100000",
      "000010000100001000010000",
      "000100001000000100001000",
      "000010000100001000010000",
      "000001000100010000100000",
      "000000100010100001000000",
      "000011011001000110000000",
      "000100001100001000000000",
      "000100110110010000010000",
      "000100001010100000101000",
      "000100010001000001000100",
      "000010100010100010000100",
      "000001000100110001100100",
      "000000001000011000001100",
      "000000010001000110110000",
      "000000100010100001000000",
      "000001000010010000100000",
      "000010000100001000010000",
      "000100001000000100001000",
      "000010000100001000010000",
      "000001000100010000100000",
      "000000100010100001000000",
      "000000010001000110000000",
      "000000001000001000000000",
      "000000000100010000000000",
      "000000000010100000000000",
    ],
  },
};
export const PATTERNS = [
  { id: 'rose-vine', name: 'Rose vine', group: 'reference', kind: 'Photo inspired', technique: 'Double faced', holes: 4, cards: 24, picks: 48, description: 'Rose leaves and curling stems on midnight blue.' },
  { id: 'ivory-braid', name: 'Ivory braid', group: 'reference', kind: 'Photo inspired', technique: 'Double faced', holes: 4, cards: 24, picks: 48, description: 'Fine ivory interlace with golden edge stripes.' },
  { id: 'ember-lattice', name: 'Ember lattice', group: 'reference', kind: 'Chart draft', technique: 'Individual turns', holes: 4, cards: 28, picks: 46, description: 'Red and gold ribbons weave through black diamonds.' },
  { id: 'blue-scroll', name: 'Blue scroll', group: 'reference', kind: 'Chart draft', technique: 'Individual turns', holes: 4, cards: 18, picks: 20, description: 'Linked black scrolls divide ivory and blue.' },
  { id: 'scarlet-diamonds', name: 'Scarlet diamonds', group: 'reference', kind: 'Chart draft', technique: '4 forward / 4 backward', holes: 4, cards: 24, picks: 32, description: 'Red diamonds framed by crisp ivory zigzags.' },
  { id: 'golden-ramshorns', name: 'Golden ram’s horns', group: 'reference', kind: 'Photo inspired', technique: 'Double faced', holes: 4, cards: 28, picks: 64, description: 'Golden diamonds and small curls on a wine-red band.' },
  { id: 'turquoise-braid', name: 'Turquoise braid', group: 'reference', kind: 'Chart draft', technique: 'Individual turns', holes: 4, cards: 16, picks: 32, description: 'Bright turquoise ribbons inside red and black borders.' },
  { id: 'chevron', name: 'Classic chevron', group: 'basic', description: 'Mirrored diagonals, turning all tablets forward.' },
  { id: 'diamond', name: 'Nested diamonds', group: 'basic', description: 'Reverse together to turn chevrons into diamonds.' },
  { id: 'stripe', name: 'Simple stripes', group: 'basic', description: 'Solid stripes for exploring your thread palette.' },
  { id: 'blank', name: 'Blank canvas', group: 'basic', description: 'An uncolored draft ready for your own design.' },
];

export function getPattern(id) {
  const pattern = PATTERNS.find(pattern => pattern.id === id);
  if (!pattern) throw new Error('Choose a pattern from the library.');
  return pattern;
}

function chartDraft(pattern) {
  const source = CHART_DRAFTS[pattern.id];
  const names = { K: 'Black', R: 'Red', G: pattern.id === 'turquoise-braid' ? 'Silver' : 'Antique gold', N: 'Natural', W: 'Ivory', U: pattern.id === 'blue-scroll' ? 'Azure' : 'Turquoise' };
  return {
    version: 1,
    name: pattern.name,
    holes: 4,
    cards: pattern.cards,
    picks: pattern.picks,
    colors: Object.entries(source.palette).map(([symbol, hex]) => ({ name: names[symbol], hex })),
    threads: source.threading.map(card => [...card].map(hole => source.palette[hole])),
    slants: [...source.slants],
    turns: source.turns.map(row => [...row]),
  };
}

function photoDraft(pattern) {
  const { pixels, palette } = PHOTO_MOTIFS[pattern.id];
  const { background, foreground, border } = palette;
  const width = pixels[0].length;
  const cards = width + 4;
  // AABB threading permits an arbitrary two-color design in paired turns.
  // At each row boundary the phase is either D or B. A forward pair exposes
  // the current color; a backward pair exposes the other one, with no holds.
  const threads = Array.from({ length: cards }, (_,card) => {
    const edge = card === 0 || card === cards - 1;
    const insideEdge = card === 1 || card === cards - 2;
    if (edge || insideEdge) return Array(4).fill(edge ? border : background);
    return [background, background, foreground, foreground];
  });
  const turns = [];
  for (let row = 0; row < pixels.length; row++) {
    const pair = Array.from({ length: cards }, (_,card) => {
      if (card < 2 || card >= cards - 2) return 'F';
      const forwardShowsForeground = row % 2 === 0;
      const wantForeground = pixels[row][card - 2] === '1';
      return wantForeground === forwardShowsForeground ? 'F' : 'B';
    });
    turns.push([...pair], [...pair]);
  }
  const foregroundName = pattern.id === 'rose-vine' ? 'Rose' : pattern.id === 'ivory-braid' ? 'Ivory' : 'Gold';
  return {
    version: 1, name: pattern.name, holes: 4, cards, picks: turns.length,
    colors: [
      { name: foregroundName, hex: foreground },
      { name: pattern.id === 'golden-ramshorns' ? 'Wine' : 'Midnight blue', hex: background },
      { name: pattern.id === 'ivory-braid' ? 'Golden edge' : 'Border', hex: border },
    ],
    threads,
    slants: Array.from({ length: cards }, (_,card) => card % 2 ? 'Z' : 'S'),
    turns,
  };
}

export function createPreset(id, { holes = 4, cards = 20, picks = 32 } = {}) {
  const pattern = getPattern(id);
  if (pattern.group === 'basic') return createDraft(holes, cards, picks, id);
  return CHART_DRAFTS[id] ? chartDraft(pattern) : photoDraft(pattern);
}
