import test from 'node:test';
import assert from 'node:assert/strict';
import { PATTERNS, createPreset } from '../patterns.js';
import { weave, validateDraft, fabricSVG, chartSVG } from '../model.js';

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

test('Dragon adaptations repeat their curled motif after twenty-four picks', () => {
  for (const id of ['rose-vine', 'ivory-braid']) {
    const draft = createPreset(id);
    assert.equal(draft.cards, 16);
    assert.equal(draft.picks, 48);
    const fabric = weave(draft).map(row => row.map(({color, slant}) => ({color, slant})));
    assert.deepEqual(fabric.slice(0, 24), fabric.slice(24));
    for (let card = 2; card < 14; card++) {
      const turns = draft.turns.slice(0, 24).reduce((twist, row) => twist + (row[card] === 'F' ? 1 : -1), 0);
      assert.equal(Math.abs(turns) % 4, 0, 'Each repeat returns the tablet to its starting phase');
    }
  }
});

test('Dragon previews have one continuous stem, allowing small detached side accents', () => {
  // Test the rendered geometry: matching neighboring cell colors alone misses
  // breaks caused by the sloping edges of the woven stitches.
  function shareEdge(a, b) {
    const epsilon = 0.001;
    for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
      const p = a[i], q = a[(i + 1) % a.length];
      const r = b[j], s = b[(j + 1) % b.length];
      const dx = q[0] - p[0], dy = q[1] - p[1], length = Math.hypot(dx, dy);
      if (length < epsilon) continue;
      const distanceFromLine = v => Math.abs(dx * (v[1] - p[1]) - dy * (v[0] - p[0])) / length;
      if (distanceFromLine(r) > epsilon || distanceFromLine(s) > epsilon) continue;
      const alongEdge = v => ((v[0] - p[0]) * dx + (v[1] - p[1]) * dy) / length;
      const start = Math.max(0, Math.min(alongEdge(r), alongEdge(s)));
      const end = Math.min(length, Math.max(alongEdge(r), alongEdge(s)));
      if (end - start > epsilon) return true; // A shared point does not join a ribbon.
    }
    return false;
  }

  for (const [id, colorName] of [['rose-vine', 'Rose'], ['ivory-braid', 'Ivory']]) {
    const draft = createPreset(id), svg = fabricSVG(draft);
    const foreground = draft.colors.find(color => color.name === colorName).hex;
    const cells = [...svg.matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)]
      .filter(match => match[2] === foreground)
      .map(match => match[1].split(' ').map(point => point.split(',').map(Number)));
    const visited = new Set(), groups = [];
    for (let first = 0; first < cells.length; first++) {
      if (visited.has(first)) continue;
      const pending = [first], group = [];
      visited.add(first);
      while (pending.length) {
        const current = pending.pop();
        group.push(current);
        for (let next = 0; next < cells.length; next++) {
          if (!visited.has(next) && shareEdge(cells[current], cells[next])) {
            visited.add(next);
            pending.push(next);
          }
        }
      }
      groups.push(group);
    }
    const stem = groups.sort((a, b) => b.length - a.length)[0];
    assert.ok(stem?.length >= cells.length * 0.85, `${id}: most foreground stitches must form one ribbon`);
    const heights = stem.flatMap(cell => cells[cell].map(point => point[1]));
    const height = Number(svg.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1]);
    assert.equal(Math.min(...heights), 0, `${id}: the stem must reach the top`);
    assert.ok(Math.abs(Math.max(...heights) - height) < 0.001, `${id}: the stem must reach the bottom`);
  }
});

test('Golden horns use offset Sulawesi pairs and a complete 36-pick motif repeat', () => {
  const draft = createPreset('golden-ramshorns');
  assert.equal(draft.cards, 20);
  assert.equal(draft.picks, 72);
  assert.equal(draft.colors.length, 4);
  for (let card = 2; card < 18; card += 2) {
    assert.equal(draft.slants[card], draft.slants[card + 1]);
    assert.notDeepEqual(draft.threads[card], draft.threads[card + 1]);
    for (const row of draft.turns) assert.equal(row[card], row[card + 1]);
  }
  for (let pick = 0; pick < draft.picks; pick += 2) assert.deepEqual(draft.turns[pick], draft.turns[pick + 1]);
  const fabric = weave(draft).map(row => row.map(({color, slant}) => ({color, slant})));
  assert.deepEqual(fabric.slice(0, 36), fabric.slice(36));
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
