import test from 'node:test';
import assert from 'node:assert/strict';
import { GROFF_PATTERNS } from '../groff-patterns.js';
import { PATTERNS, createPreset, getPattern } from '../patterns.js';
import { chartSVG, escapeXML, fabricSVG, validateDraft, weave, wovenPickCount } from '../model.js';

const groff = PATTERNS.filter(pattern => pattern.group === 'groff');
const idFor = number => `groff-${String(number).padStart(2, '0')}`;
const sourceFor = number => GROFF_PATTERNS.find(source => source.number === number);
const clone = value => JSON.parse(JSON.stringify(value));
const hex = /^#[0-9a-f]{6}$/i;

test('The library contains Groff 1–53 exactly once and keeps the five retained reference bands', () => {
  const numbers = Array.from({ length: 53 }, (_, index) => index + 1);
  assert.deepEqual(GROFF_PATTERNS.map(source => source.number), numbers);
  assert.deepEqual(groff.map(pattern => pattern.id), numbers.map(idFor));
  assert.equal(new Set(PATTERNS.map(pattern => pattern.id)).size, PATTERNS.length);
  assert.deepEqual(PATTERNS.filter(pattern => pattern.group === 'reference').map(pattern => pattern.id), [
    'rose-vine', 'ember-lattice', 'blue-scroll', 'scarlet-diamonds', 'turquoise-braid',
  ]);
  assert.deepEqual(PATTERNS.filter(pattern => pattern.group === 'basic').map(pattern => pattern.id), [
    'chevron', 'diamond', 'stripe', 'blank',
  ]);
  assert.equal(PATTERNS.length, 5 + 53 + 4, 'Removed Ivory and Golden bands must not return with this collection');
  for (const id of ['groff-00', 'groff-54', 'groff-1', 'not-a-pattern']) {
    assert.throws(() => getPattern(id), /Choose a pattern from the library/);
    assert.throws(() => createPreset(id), /Choose a pattern from the library/);
  }
});

test('Every literal Groff chart has complete rows, named colors, arrows, and an explicit resolution for unknown cells', () => {
  for (const source of GROFF_PATTERNS) {
    const label = idFor(source.number);
    assert.ok(source.title.trim(), `${label}: title`);
    assert.ok(Number.isInteger(source.pdfPage) && source.pdfPage > 0, `${label}: PDF page`);
    assert.ok(Number.isInteger(source.printedPage) && source.printedPage > 0, `${label}: printed page`);
    assert.ok(Number.isInteger(source.cards) && source.cards >= 2 && source.cards <= 64, `${label}: tablet count`);
    assert.equal(source.rows.length, 4, `${label}: four source holes`);
    assert.equal(source.arrows.length, source.cards, `${label}: one arrow per tablet`);
    assert.match(source.arrows, /^[UD]+$/, `${label}: source arrow symbols`);
    assert.match(source.repeat, /^[FB]+$/, `${label}: quarter-turn sequence`);
    assert.ok(source.repeat.length <= 160, `${label}: sequence fits one editable draft`);
    for (const field of ['notes', 'uncertainties']) {
      assert.ok(Array.isArray(source[field]) && source[field].every(note => typeof note === 'string' && note.trim()), `${label}: ${field}`);
    }
    for (const [symbol, color] of Object.entries(source.palette)) {
      assert.match(symbol, /^[A-Z]$/, `${label}: palette symbol`);
      assert.ok(color.name.trim(), `${label}: color name for ${symbol}`);
      assert.match(color.hex, hex, `${label}: color for ${symbol}`);
    }
    const resolutions = new Map();
    for (const cell of source.resolvedCells || []) {
      assert.ok(Number.isInteger(cell.row) && cell.row >= 0 && cell.row < 4, `${label}: resolution row`);
      assert.ok(Number.isInteger(cell.card) && cell.card >= 0 && cell.card < source.cards, `${label}: resolution tablet`);
      const key = `${cell.row}:${cell.card}`;
      assert.ok(!resolutions.has(key), `${label}: duplicate resolution ${key}`);
      assert.equal(source.rows[cell.row][cell.card], '?', `${label}: preserve the literal uncertain cell`);
      assert.ok(source.palette[cell.symbol], `${label}: resolution has a named color`);
      resolutions.set(key, cell.symbol);
    }
    for (const [rowIndex, row] of source.rows.entries()) {
      assert.equal(row.length, source.cards, `${label}: source row ${rowIndex + 1}`);
      for (const [card, symbol] of [...row].entries()) {
        if (symbol === '?') {
          assert.ok(resolutions.has(`${rowIndex}:${card}`), `${label}: unresolved source cell`);
          assert.ok(source.uncertainties.length, `${label}: resolution must be disclosed`);
        } else assert.ok(source.palette[symbol], `${label}: unnamed symbol ${symbol}`);
      }
    }
    if (source.weft) {
      assert.equal(source.weft.length, source.repeat.length, `${label}: weft follows the complete repeat`);
      assert.ok(Array.from(source.weft).every(value => typeof value === 'boolean'), `${label}: weft markers`);
    }
  }
});

test('All 53 Groff presets load, validate, render, and preserve their source dimensions and provenance', () => {
  for (const pattern of groff) {
    const source = sourceFor(Number(pattern.id.slice(6)));
    const draft = createPreset(pattern.id, { holes: 8, cards: 6, picks: 4 });
    assert.deepEqual([draft.holes, draft.cards, draft.picks], [4, source.cards, pattern.picks], pattern.id);
    assert.ok(draft.picks >= 32 && draft.picks <= 160, `${pattern.id}: useful preview length`);
    assert.equal(draft.picks % source.repeat.length, 0, `${pattern.id}: complete turning repeats`);
    assert.deepEqual(validateDraft(clone(draft)), draft, `${pattern.id}: JSON round trip`);
    assert.ok(pattern.description.trim() && pattern.technique.trim(), `${pattern.id}: library description`);
    assert.equal(pattern.needsReview, source.uncertainties.length > 0, `${pattern.id}: source review flag`);
    assert.match(draft.source, new RegExp(`Pattern ${source.number} · printed p\\. ${source.printedPage} \\(PDF p\\. ${source.pdfPage}\\)`));
    assert.ok(draft.notes.some(note => note.includes(source.title)), `${pattern.id}: complete source title survives display truncation`);
    assert.equal(draft.threads.length, source.cards);
    assert.ok(draft.threads.every(card => card.length === 4 && card.every(color => hex.test(color))));
    const palette = new Set(draft.colors.map(color => color.hex));
    assert.ok(draft.threads.flat().every(color => palette.has(color)), `${pattern.id}: threaded colors belong to the palette`);
    assert.equal(draft.turns.length, draft.picks);
    for (const [pick, row] of draft.turns.entries()) {
      assert.equal(row.length, source.cards, `${pattern.id}: turn row width`);
      assert.ok(row.every(turn => turn === source.repeat[pick % source.repeat.length]), `${pattern.id}: turn ${pick + 1}`);
    }
    const preview = fabricSVG(draft);
    assert.ok(preview.includes(`for ${source.cards} tablets and ${wovenPickCount(draft)} picks`), `${pattern.id}: preview dimensions`);
    assert.ok(!/NaN|undefined/.test(preview), `${pattern.id}: valid SVG geometry`);
  }
});

test('Book A/D/C/B maps to Turn A/B/C/D, with A at start zero and up arrows threaded S', () => {
  // This is the import convention, separate from the literal source charts.
  const bookRowForTurnHole = [0, 3, 2, 1];
  for (const source of GROFF_PATTERNS) {
    const draft = createPreset(idFor(source.number));
    assert.equal(draft.startHole, 0);
    for (let card = 0; card < source.cards; card++) {
      assert.equal(draft.slants[card], source.arrows[card] === 'U' ? 'S' : 'Z');
      for (const [hole, row] of bookRowForTurnHole.entries()) {
        const resolved = source.resolvedCells?.find(cell => cell.row === row && cell.card === card);
        const symbol = resolved?.symbol ?? source.rows[row][card];
        assert.equal(draft.threads[card][hole], source.palette[symbol].hex, `${source.number}: tablet ${card + 1}, Turn hole ${hole}`);
      }
    }
  }
  // Tablet 5 of Janice's first experiment has four different source colors,
  // making both a label swap and a wrong starting phase observable in weaving.
  const janice = createPreset('groff-45');
  const colors = sourceFor(45).palette;
  assert.deepEqual(janice.threads[4], ['B', 'G', 'D', 'T'].map(symbol => colors[symbol].hex));
  assert.deepEqual(weave(janice).slice(0, 4).map(row => row[4].color), ['B', 'T', 'D', 'G'].map(symbol => colors[symbol].hex));
  assert.deepEqual([createPreset('groff-41').slants[18], createPreset('groff-41').slants[20]], ['Z', 'S'], 'Retain the audited arrows on tablets 19 and 21');
});

test('Groff 14 retains all 72 turns and marks only turns 25–36 and 61–72 without weft', () => {
  const draft = createPreset('groff-14');
  const sequence = 'BBBBFFFF'.repeat(3) + 'F'.repeat(12) + 'BBBBFFFF'.repeat(3) + 'B'.repeat(12);
  assert.equal(draft.picks, 72);
  assert.equal(draft.turns.map(row => row[0]).join(''), sequence);
  assert.deepEqual(draft.weft, Array.from({ length: 72 }, (_, row) => !(row >= 24 && row < 36 || row >= 60)));
  assert.equal(wovenPickCount(draft), 48);
  assert.match(getPattern('groff-14').description, /without weft/);
  assert.ok(fabricSVG(draft).includes('20 tablets and 48 picks'));
  const chart = chartSVG(draft);
  for (const row of [25, 36, 61, 72]) assert.ok(chart.includes(`>${row}*</text>`));
  for (const row of [24, 37, 60]) assert.ok(!chart.includes(`>${row}*</text>`));
  assert.ok(chart.includes('without inserting weft'));
});

test('The 56-tablet Santa draft explicitly resolves its overwritten cell to white while retaining the raw question mark', () => {
  const source = sourceFor(27);
  const draft = createPreset('groff-27');
  assert.equal(source.rows[0][1], '?');
  assert.deepEqual(source.resolvedCells, [{ row: 0, card: 1, symbol: 'W' }]);
  assert.equal(draft.cards, 56);
  assert.equal(draft.threads.flat().length, 224);
  assert.deepEqual(draft.threads[1], Array(4).fill(source.palette.W.hex));
  assert.deepEqual(validateDraft(clone(draft)), draft);
  assert.ok(draft.notes.some(note => /overwritten W\/G/.test(note) && /White is used/.test(note)));
  assert.ok(chartSVG(draft).includes('56 tablets'));
});

test('Source ambiguities stay visible in editable notes and exported charts', () => {
  assert.match(getPattern('groff-50').description, /Split, cross, and rejoin/);
  for (const number of [26, 27, 34, 38, 42, 49, 50]) {
    const source = sourceFor(number);
    const draft = createPreset(idFor(number));
    assert.equal(getPattern(idFor(number)).needsReview, true);
    assert.ok(source.uncertainties.length);
    const exportText = chartSVG(draft).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    for (const uncertainty of source.uncertainties) {
      const note = `Source check: ${uncertainty}`;
      assert.ok(draft.notes.includes(note), `${number}: uncertainty must remain visible in notes`);
      assert.ok(exportText.includes(escapeXML(note).replace(/\s+/g, ' ')), `${number}: uncertainty must survive export`);
    }
  }
});

test('Editing any Groff draft cannot mutate the collection or another instance', () => {
  const literalCharts = clone(GROFF_PATTERNS);
  for (const pattern of groff) {
    const expected = createPreset(pattern.id);
    const edited = createPreset(pattern.id);
    const neighborThread = [...edited.threads[1]];
    const nextTurn = [...edited.turns[1]];
    edited.threads[0][0] = '#123456';
    edited.turns[0][0] = edited.turns[0][0] === 'F' ? 'B' : 'F';
    edited.slants[0] = edited.slants[0] === 'S' ? 'Z' : 'S';
    edited.colors[0].hex = '#abcdef';
    edited.colors[0].name = 'Edited yarn';
    edited.notes[0] = 'Edited note';
    if (edited.weft) edited.weft[0] = !edited.weft[0];
    assert.deepEqual(edited.threads[1], neighborThread, `${pattern.id}: independent tablet arrays`);
    assert.deepEqual(edited.turns[1], nextTurn, `${pattern.id}: independent turning rows`);
    assert.deepEqual(createPreset(pattern.id), expected, `${pattern.id}: fresh draft stays unchanged`);
  }
  assert.deepEqual(GROFF_PATTERNS, literalCharts, 'Import must not rewrite the literal source data');
});
