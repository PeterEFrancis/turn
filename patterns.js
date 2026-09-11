import { GROFF_PATTERNS } from './groff-patterns.js?v=9';
import { createDraft } from './model.js?v=9';

// Holes A–D in each string; chronological F/B picks. Short plans repeat to
// fill the preset. Rose is a four-thread adaptation of the photographed motif.
// See README for reconstruction details and sources.
const CHART_DRAFTS = {

  "rose-vine": {
    palette: {"R": "#e7a2b3", "K": "#172e4b", "U": "#284f70"},
    paletteNames: {"R": "Rose", "K": "Midnight blue", "U": "Blue edge"},
    threading: ["UUUU", "KKKK", "KKKK", "RKKK", "KRRK", "KKRK", "KRKK", "RKKK", "KKKR", "KKRK", "KRKK", "KRRK", "KRKK", "KKKK", "KKKK", "UUUU"],
    slants: "SZSSSSSSSSSSSSSZ",
    turns: ["FFFFFBBBFFFBBFFF", "FFFFBBBBFFFFFFFF", "FFFBBBBBBFFFFFFF", "FFFBBBBFFFFFFFFF", "FFFBBBBFFBFFFFFF", "FFFFFFFFFFFFBFFF", "FFFFFFFFFFBBFFFF", "FFFFFFFBBBBBBFFF", "FFFBFFFBBBBBBFFF", "FFFBFFFBBBBBFFFF", "FFFBBFFBBBBFBFFF", "FFFBBBBBBBBBBFFF", "FFFFFBBBFFFBBFFF", "FFFBBBBBFFFFFFFF", "FFFBBBBBFFFFFFFF", "FFFBBBBFBFFFFFFF", "FFFBBBFBBFFFFFFF", "FFFFBBBBBBBBBFFF", "FFFBFFBBBBBBBFFF", "FFFFFFFFFBBBBFFF", "FFFFFFFFFBBBFFFF", "FFFFFFFFFBBBFFFF", "FFFBFFFFFBBFFFFF", "FFFBBFFFFFFFFFFF"],
  },

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

export const PATTERNS = [
  { id: 'rose-vine', name: 'Rose vine', group: 'reference', kind: '4-thread version', technique: 'Dublin dragons', holes: 4, cards: 16, picks: 48, description: 'Alternating rose dragon curls and small side accents on navy.' },
  { id: 'ember-lattice', name: 'Ember lattice', group: 'reference', kind: 'Chart draft', technique: 'Individual turns', holes: 4, cards: 28, picks: 46, description: 'Red and gold ribbons weave through black diamonds.' },
  { id: 'blue-scroll', name: 'Blue scroll', group: 'reference', kind: 'Chart draft', technique: 'Individual turns', holes: 4, cards: 18, picks: 20, description: 'Linked black scrolls divide ivory and blue.' },
  { id: 'scarlet-diamonds', name: 'Scarlet diamonds', group: 'reference', kind: 'Chart draft', technique: '4 forward / 4 backward', holes: 4, cards: 24, picks: 32, description: 'Red diamonds framed by crisp ivory zigzags.' },
  { id: 'turquoise-braid', name: 'Turquoise braid', group: 'reference', kind: 'Chart draft', technique: 'Individual turns', holes: 4, cards: 16, picks: 32, description: 'Bright turquoise ribbons inside red and black borders.' },
  ...GROFF_PATTERNS.map(source => ({
    id: `groff-${String(source.number).padStart(2, '0')}`,
    name: `Groff ${String(source.number).padStart(2, '0')} · ${source.title}`,
    group: 'groff', kind: `GROFF ${String(source.number).padStart(2, '0')}`,
    holes: 4, cards: source.cards, picks: groffPickCount(source),
    ...(source.weft ? {weftPicks: source.weft.filter(Boolean).length * groffPickCount(source) / source.repeat.length} : {}),
    technique: turningSummary(source.repeat),
    description: source.weft ? 'Woven sections with braided gaps. 72-turn plan, including turns without weft.' : `${turningSummary(source.repeat)}.${source.number === 50 ? ' Split, cross, and rejoin three bands.' : ''}`,
    needsReview: source.uncertainties.length > 0,
  })),
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
    ...(source.startHole===undefined?{}:{startHole:source.startHole}),
    name: pattern.name,
    holes: 4,
    cards: pattern.cards,
    picks: pattern.picks,
    colors: Object.entries(source.palette).map(([symbol, hex]) => ({ name: source.paletteNames?.[symbol] || names[symbol], hex })),
    threads: source.threading.map(card => [...card].map(hole => hole==='.'?null:source.palette[hole])),
    slants: [...source.slants],
    turns: Array.from({ length: pattern.picks }, (_,pick) => [...source.turns[pick % source.turns.length]]),
  };
}

export function createPreset(id, { holes = 4, cards = 20, picks = 32 } = {}) {
  const pattern = getPattern(id);
  if (pattern.group === 'basic') return createDraft(holes, cards, picks, id);
  if (pattern.group === 'groff') return groffDraft(GROFF_PATTERNS.find(source => `groff-${String(source.number).padStart(2, '0')}` === id), pattern);
  return chartDraft(pattern);
}

function groffPickCount(source) {
  return source.repeat.length * Math.max(1, Math.ceil(32 / source.repeat.length));
}
function turningSummary(repeat) {
  if ([...repeat].every(turn => turn === 'F')) return 'Continuous forward';
  const runs = [];
  for (const turn of repeat) {
    if (runs.at(-1)?.turn === turn) runs.at(-1).count++;
    else runs.push({ turn, count: 1 });
  }
  return runs.map(({turn, count}) => `${count}${turn}`).join(' / ');
}
function groffDraft(source, pattern) {
  const symbols = source.rows.map(row => [...row]);
  for (const cell of source.resolvedCells || []) symbols[cell.row][cell.card] = cell.symbol;
  const colors = [...new Map(Object.values(source.palette).map(color => [color.hex, {...color}])).values()];
  return {
    version: 1, name: pattern.name.slice(0, 80), holes: 4, cards: source.cards, picks: pattern.picks,
    colors,
    // Source forward A→B→C→D becomes Turn's decreasing clockwise labels.
    // U→S and D→Z retain the source photo's chevron/stitch relationship.
    startHole: 0,
    threads: Array.from({length: source.cards}, (_,card) => [0,3,2,1].map(row => source.palette[symbols[row][card]].hex)),
    slants: [...source.arrows].map(arrow => arrow === 'U' ? 'S' : 'Z'),
    turns: Array.from({length: pattern.picks}, (_,pick) => Array(source.cards).fill(source.repeat[pick % source.repeat.length])),
    ...(source.weft ? {weft: Array.from({length: pattern.picks}, (_,pick) => source.weft[pick % source.weft.length])} : {}),
    source: `Russell E. Groff, Card Weaving · Pattern ${source.number} · printed p. ${source.printedPage} (PDF p. ${source.pdfPage})`,
    notes: [
      `Source pattern: ${source.title}.`,
      `Turn one hole per step. ${turningSummary(source.repeat)}${source.repeat.includes('B') ? '; repeat this turning sequence.' : '.'}`,
      'Converted hole labels: Turn A/B/C/D = book A/D/C/B; book up/down arrows = S/Z. Start with A upper-near. Colors approximate the named yarns.',
      ...source.notes,
      ...source.uncertainties.map(note => `Source check: ${note}`),
    ],
  };
}
