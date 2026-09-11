import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraft,weave,resizeDraft,validateDraft,chartSVG} from '../dist/model.js';
for(let n=3;n<=8;n++){
 test(`${n}-hole full revolutions and reversals follow the stated card convention`,()=>{
  let d=createDraft(n,2,n*2);d.turns=Array.from({length:n*2},(_,r)=>Array(2).fill(r<n?'F':'B'));
  const holes=weave(d).map(r=>r[0].hole);
  assert.deepEqual(holes,[...Array(n).keys()].reverse().concat([...Array(n).keys()]));
  d.turns=Array.from({length:n*2},(_,r)=>Array(2).fill(r%2?'B':'F'));
  assert.ok(weave(d).every(r=>r[0].hole===n-1));
  d.turns=Array.from({length:n*2},()=>Array(2).fill('B'));
  assert.deepEqual(weave(d).map(r=>r[0].hole),[...Array(n).keys(),...Array(n).keys()]);
 });
}
test('S/Z changes stitch direction while keeping the common-face color order',()=>{
 const d=createDraft();d.threads[1]=[...d.threads[0]];d.slants[0]='S';d.slants[1]='Z';
 for(const row of weave(d)){assert.equal(row[0].hole,row[1].hole);assert.equal(row[0].slant,-row[1].slant);}
 assert.equal(weave(d)[0][0].slant,-1);
});
test('Resizing retains holes and turns, fills new holes naturally, and keeps arrays independent',()=>{
 const d=createDraft();d.turns[0][1]='B';const next=resizeDraft(d,{holes:6,cards:22,picks:40});
 assert.deepEqual(next.threads[0].slice(0,4),d.threads[0]);assert.deepEqual(next.threads[0].slice(4),['#f0e3c6','#f0e3c6']);assert.equal(next.turns[0][1],'B');
 next.threads[21][0]='#ffffff';assert.notEqual(next.threads[20][0],'#ffffff');assert.equal(d.cards,20);assert.throws(()=>resizeDraft(d,{holes:9}));
});
test('Save/open round trip and malformed imported files',()=>{
 const d=createDraft(8,48,160);assert.deepEqual(validateDraft(JSON.parse(JSON.stringify(d))),d);
 const invalid=[null,{...d,version:2},{...d,cards:0},{...d,holes:4.5},{...d,turns:[]},{...d,threads:[['url(x)']]},{...d,colors:[{name:'x',hex:'red'}]},{...d,slants:['X']}];
 for(const input of invalid)assert.throws(()=>validateDraft(input));
});
test('SVG export includes escaped names, all picks, holes, and threading directions',()=>{
 const d=createDraft(6,12,40);d.name='<draft & "test">';const svg=chartSVG(d);
 assert.ok(svg.includes('&lt;draft &amp; &quot;test&quot;&gt;'));assert.ok(svg.includes('PICKS 1–40'));assert.ok(svg.includes('WOVEN SCHEMATIC'));assert.ok(!svg.includes('undefined'));assert.ok(!svg.includes('NaN'));
});
test('A printed page limits the fabric preview to its pick range',()=>{
 const d=createDraft(4,2,160);const svg=chartSVG(d,{start:0,end:28});
 const height=Number(svg.match(/height="([\d.]+)"/)[1]);assert.ok(height<1400);assert.ok(svg.includes('PICKS 1–28'));
});
