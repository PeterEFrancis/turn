import test from 'node:test';
import assert from 'node:assert/strict';
import { PATTERNS, createPreset } from '../patterns.js';
import { weave, resizeDraft, validateDraft, fabricSVG, chartSVG } from '../model.js';

const bands = PATTERNS.filter(pattern => pattern.group === 'reference');

test('Every library band loads a complete, editable four-hole draft at its own dimensions', () => {
  assert.equal(bands.length, 7);
  for (const pattern of bands) {
    const draft = createPreset(pattern.id, { holes: 8, cards: 6, picks: 4 });
    assert.deepEqual([draft.holes, draft.cards, draft.picks], [4, pattern.cards, pattern.picks]);
    assert.deepEqual(validateDraft(JSON.parse(JSON.stringify(draft))), draft);
    const palette = new Set(draft.colors.map(color => color.hex));
    assert.ok(draft.threads.flat().every(color => palette.has(color)));
    const preview = fabricSVG(draft);
    assert.ok(preview.includes(`for ${pattern.cards} tablets and ${pattern.picks} picks`));
    assert.ok(!/NaN|undefined/.test(preview));
    assert.ok(chartSVG(draft).includes(`PICKS 1–${pattern.picks}`));
  }
});

test('Original starters keep the selected card type and size, including odd hole counts', () => {
  for (let holes = 3; holes <= 8; holes++) {
    for (const pattern of PATTERNS.filter(pattern => pattern.group === 'basic')) {
      const draft = createPreset(pattern.id, { holes, cards: 18, picks: 36 });
      assert.deepEqual([draft.holes, draft.cards, draft.picks], [holes, 18, 36]);
      assert.deepEqual(validateDraft(draft), draft);
    }
  }
});

test('Editing one preset does not change its library original or another draft', () => {
  for (const pattern of bands) {
    const expected = createPreset(pattern.id);
    const edited = createPreset(pattern.id);
    edited.threads[0][0] = '#123456';
    edited.turns[0][0] = edited.turns[0][0] === 'F' ? 'B' : 'F';
    edited.slants[0] = edited.slants[0] === 'S' ? 'Z' : 'S';
    edited.colors[0].hex = '#abcdef';
    assert.deepEqual(createPreset(pattern.id), expected);
  }
  assert.throws(() => createPreset('not-a-pattern'), /Choose a pattern/);
});

test('Photo adaptations weave color pairs and repeat seamlessly from their real turning plans', () => {
  for (const id of ['rose-vine', 'ivory-braid', 'golden-ramshorns']) {
    const draft = createPreset(id);
    const fabric = weave(draft);
    for (let row = 0; row < draft.picks; row += 2) {
      assert.deepEqual(draft.turns[row], draft.turns[row + 1]);
      assert.deepEqual(fabric[row].map(cell => cell.color), fabric[row + 1].map(cell => cell.color));
    }
    const doubled = weave(resizeDraft(draft, { picks: draft.picks * 2 }));
    assert.deepEqual(doubled.slice(0, draft.picks).map(row => row.map(cell => cell.color)), doubled.slice(draft.picks).map(row => row.map(cell => cell.color)));
  }
  const rose = createPreset('rose-vine');
  const roseColor = rose.colors[0].hex;
  const firstLeaf = weave(rose)[0].slice(2, -2).map(cell => cell.color === roseColor ? '1' : '0').join('');
  assert.equal(firstLeaf, '00000000111100000000');
});

test('Blue scroll retains the selective four-pick reversals from the reference chart', () => {
  const draft = createPreset('blue-scroll');
  assert.equal(draft.turns[0].join(''), 'F'.repeat(18));
  for (let pick = 4; pick < 8; pick++) {
    const backwards = draft.turns[pick].flatMap((dir, card) => dir === 'B' ? [card + 1] : []);
    assert.deepEqual(backwards, [6, 7, 8, 11, 12, 13]);
  }
  assert.equal(draft.turns[8].join(''), 'F'.repeat(18));
});

test('Scarlet diamonds retains its full threading and four-forward/four-backward cycle', () => {
  const draft = createPreset('scarlet-diamonds');
  assert.equal(draft.cards, 24);
  assert.deepEqual(draft.threads[2], ['#920d0d', '#920d0d', '#920d0d', '#080808']);
  assert.ok(draft.turns.every((row, pick) => row.every(dir => dir === (pick % 8 < 4 ? 'F' : 'B'))));
});

test('Turquoise braid keeps the changes later in the chart, not just the first four picks repeated', () => {
  const draft = createPreset('turquoise-braid');
  assert.notDeepEqual(draft.turns[20], draft.turns[0]);
  assert.notDeepEqual(draft.turns[21], draft.turns[1]);
  assert.notDeepEqual(draft.turns[25], draft.turns[1]);
  assert.notDeepEqual(draft.turns[29], draft.turns[1]);
});
