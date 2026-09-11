import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraft,weave,resizeDraft,validateDraft,chartSVG,fabricSVG} from '../model.js';

const stitches=draft=>[...fabricSVG(draft).matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)].map(match=>({
 points:match[1].split(' ').map(point=>point.split(',').map(Number)),color:match[2]
}));

test('Chevron and diamond colors meet on the same edge at odd and even S/Z joins',()=>{
 for(let holes=3;holes<=8;holes++)for(let cards=6;cards<=48;cards++)for(const preset of ['chevron','diamond']){
  const draft=createDraft(holes,cards,holes*2,preset),cells=stitches(draft),left=Math.ceil(cards/2)-1;
  for(let pick=0;pick<draft.picks;pick++){
   const a=cells[pick*cards+left],b=cells[pick*cards+left+1];
   const label=`${preset}, ${holes} holes, ${cards} tablets, pick ${pick+1}`;
   assert.equal(a.color,b.color,label);
   assert.deepEqual(a.points[1],b.points[0],label);
   assert.deepEqual(a.points[2],b.points[3],label);
  }
 }
});

test('Classic chevron diagonals stay connected across neighboring tablets',()=>{
 for(let holes=3;holes<=8;holes++)for(const cards of [7,19,20,21,47,48]){
  const draft=createDraft(holes,cards,holes*3),cells=stitches(draft),dy=12*.92;
  const colorAt=(column,side,y)=>{
   for(let row=0;row<draft.picks;row++){
    const cell=cells[row*cards+column],ends=side==='right'?[1,2]:[0,3];
    const [a,b]=ends.map(index=>cell.points[index][1]);
    if(y>=Math.min(a,b)&&y<Math.max(a,b))return cell.color;
   }
   assert.fail('No stitch covers the sampled edge');
  };
  for(let c=2;c<cards-3;c++)for(let r=1;r<draft.picks-1;r++)for(const offset of [.25,.75]){
   const y=(r+offset)*dy;
   assert.equal(colorAt(c,'right',y),colorAt(c+1,'left',y),`${holes} holes, ${cards} tablets, edge ${c+1}, pick ${r+1}`);
  }
 }
});
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
