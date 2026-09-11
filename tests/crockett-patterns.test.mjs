import test from 'node:test';
import assert from 'node:assert/strict';
import { CROCKETT_PATTERNS } from '../crockett-patterns.js';
import { PATTERNS, createPreset, getPattern } from '../patterns.js';
import { chartSVG, escapeXML, fabricSVG, threadCount, validateDraft, weave } from '../model.js';

test('The library adds all 20 numbered Crockett drafts and 10 complete teaching drafts', () => {
  assert.equal(PATTERNS.length, 92);
  assert.deepEqual(CROCKETT_PATTERNS.filter(source => source.number).map(source => source.number), Array.from({length:20}, (_,i) => i + 1));
  assert.deepEqual(CROCKETT_PATTERNS.filter(source => !source.number).map(source => String(source.figure)), ['41','69.1','69.2','69.3','69.4','69.5','81','83','87','135']);
  assert.equal(new Set(PATTERNS.map(pattern => pattern.id)).size, PATTERNS.length);
});

test('Every Crockett draft preserves its source dimensions, valid yarns, and editable provenance', () => {
  for (const source of CROCKETT_PATTERNS) {
    const draft = createPreset(source.id, {holes:3, cards:2, picks:4});
    assert.equal(source.rows.length, source.holes, source.id);
    assert.equal(source.arrows.length, source.cards, source.id);
    assert.match(source.arrows, /^[LR]+$/);
    assert.match(source.repeat, /^[BF]+$/);
    for (const row of source.rows) {
      assert.equal(row.length, source.cards, source.id);
      for (const symbol of row) assert.ok(symbol === '.' || source.palette[symbol], `${source.id}: unknown symbol ${symbol}`);
    }
    assert.deepEqual([draft.holes, draft.cards], [source.holes, source.cards]);
    assert.ok(draft.picks >= 32 && draft.picks <= 160);
    assert.equal(draft.picks % source.repeat.length, 0);
    assert.deepEqual(validateDraft(JSON.parse(JSON.stringify(draft))), draft, source.id);
    assert.match(draft.source, /Candace Crockett, Card Weaving \(1973\)/);
    assert.ok(draft.source.includes(`Figure ${source.figure} · printed p. ${source.printedPage} (PDF p. ${source.pdfPage})`));
    assert.ok(draft.threads.flat().every(color => color === null || draft.colors.some(yarn => yarn.hex === color)));
    for (const back of [false, true]) assert.ok(!/NaN|undefined/.test(fabricSVG(draft, back)), source.id);
    const restored = createPreset(source.id);
    draft.threads[0][0] = '#123456'; draft.turns[0][0] = 'F'; draft.notes[0] = 'Edited'; draft.colors[0].hex = '#abcdef';
    assert.deepEqual(createPreset(source.id), restored, `${source.id}: editing does not mutate the library`);
  }
});

test('Crockett toward turns follow D/C/B/A, reversing repeats A, and left arrows form smooth angles', () => {
  const smooth = createPreset('crockett-threading-study-1');
  const cells = weave(smooth);
  const dark = smooth.colors[0].hex;
  // Figure 69.1: first cycle has the point at D6, opening out via C5/C7,
  // B4/B8, then A3/A6/A9. Figure 72 repeats A on the first away turn.
  assert.deepEqual(cells.slice(0,8).map(row => row.flatMap((cell,c) => cell.color === dark ? [c+1] : [])), [
    [6], [5,7], [4,8], [3,6,9], [3,6,9], [4,8], [5,7], [6],
  ]);
  assert.deepEqual(cells[1].map(cell => cell.slant), [1,1,1,1,1,1,-1,-1,-1,-1,-1]);
  const polygons = draft => [...fabricSVG(draft).matchAll(/<polygon points="([^"]+)" fill=/g)].map(match => match[1].split(' ').map(point => point.split(',').map(Number)));
  const a = polygons(smooth), b = polygons(createPreset('crockett-threading-study-2'));
  // Dark C5 and B4 meet along their complete common edge only in the smooth study.
  assert.deepEqual([a[1*11+4][0], a[1*11+4][3]], [a[2*11+3][1], a[2*11+3][2]]);
  assert.notDeepEqual([b[1*11+4][0], b[1*11+4][3]], [b[2*11+3][1], b[2*11+3][2]]);
  assert.deepEqual(createPreset('crockett-threading-study-4').slants, [...'ZZZZZSSSSSS']);
});

test('The six-hole designs keep all six rows and the wide split chart stays in tablet order', () => {
  for (const [id,cards] of [['crockett-14',12], ['crockett-15',41]]) {
    const draft = createPreset(id);
    assert.deepEqual([draft.holes, draft.cards, draft.picks], [6,cards,36]);
    assert.deepEqual(weave(draft).slice(0,12).map(row => row[0].hole), [1,2,3,4,5,0,0,5,4,3,2,1]);
    assert.ok(draft.notes.some(note => note.includes('Turn A/B/C/D/E/F = book A/F/E/D/C/B')));
  }
  const wide = createPreset('crockett-15');
  assert.equal(wide.slants[19], 'S'); assert.equal(wide.slants[20], 'Z');
  assert.deepEqual(wide.threads[20], ['P','X','-','-','-','Z'].map(symbol => CROCKETT_PATTERNS.find(source => source.number === 15).palette[symbol].hex.toLowerCase()));
  assert.equal(createPreset('crockett-18').cards, 63);
});

test('Skip-hole empties and unspecified colors remain distinct', () => {
  const sparse = createPreset('crockett-20'), unkeyed = createPreset('crockett-10');
  assert.equal(threadCount(sparse), 44);
  assert.equal(sparse.threads.flat().filter(color => color === null).length, 28);
  assert.equal(threadCount(unkeyed), 96);
  assert.equal(unkeyed.threads.flat().filter(color => color === '#d8cbb4').length, 14);
  assert.ok(unkeyed.notes.some(note => note.startsWith('Source check:') && note.includes('Cream is an editable display choice')));
  assert.ok(sparse.notes.some(note => note.includes('No turning sequence is stated')));
});

test('Source count conflicts are disclosed rather than silently changing the charts', () => {
  const conflicts = [];
  for (const source of CROCKETT_PATTERNS.filter(source => source.counts)) {
    const counts = Object.fromEntries(Object.keys(source.palette).map(symbol => [symbol, source.rows.join('').split(symbol).length-1]));
    if (Object.entries(source.counts).some(([symbol,count]) => counts[symbol] !== count)) {
      conflicts.push(source.number);
      assert.ok(source.uncertainties.length);
    }
  }
  assert.deepEqual(conflicts, [2,13,15]);
  for (const source of CROCKETT_PATTERNS.filter(source => source.uncertainties.length)) {
    const draft = createPreset(source.id);
    assert.equal(getPattern(source.id).needsReview, true);
    const exported = chartSVG(draft).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
    for (const note of source.uncertainties) assert.ok(exported.includes(escapeXML(`Source check: ${note}`).replace(/\s+/g,' ')), source.id);
  }
});

test('Sampler starts and manual weaving limitations survive saving and exporting', () => {
  for (const id of ['crockett-sample-b', 'crockett-angle-study']) assert.equal(createPreset(id).startHole, 3);
  const sampler = createPreset('crockett-sample-b');
  assert.deepEqual(weave(sampler).slice(0,4).map(row => row[0].color), ['#292a2e','#f3ecdc','#f3ecdc','#292a2e']);
  for (const id of ['crockett-17', 'crockett-sample-b', 'crockett-double-weave-setup']) {
    const draft = createPreset(id);
    assert.ok(getPattern(id).description.startsWith('Preview shows'));
    const saved = validateDraft(JSON.parse(JSON.stringify(draft)));
    assert.ok(saved.notes.some(note => note.startsWith('Preview shows')));
    assert.ok(chartSVG(saved).includes('Preview shows'));
  }
  const split = createPreset('crockett-17');
  assert.equal(split.picks, 64);
  assert.equal(split.turns.map(row => row[0]).join(''), 'B'.repeat(24) + 'F'.repeat(40));
  assert.ok(split.notes.some(note => note.includes('this is the first passage')));
});
