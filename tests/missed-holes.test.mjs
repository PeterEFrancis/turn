import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraft,validateDraft,resizeDraft,threadCount,chartSVG,fabricSVG,weave} from '../model.js';
import {createPreset} from '../patterns.js';

test('Empty holes remain empty through save/open, resizing, and adding tablets',()=>{
 const draft=createDraft(4,2,12);
 draft.threads[1]=[null,'#abcdef',null,'#123456'];
 assert.deepEqual(validateDraft(JSON.parse(JSON.stringify(draft))),draft);
 const resized=resizeDraft(draft,{holes:6,cards:3,picks:20});
 assert.deepEqual(resized.threads[2],[null,'#abcdef',null,'#123456','#f0e3c6','#f0e3c6']);
 assert.equal(threadCount(draft),6);
 assert.equal(threadCount(resized),14);
 for(const invalid of [undefined,'',false,0]){
  const broken=structuredClone(draft);broken.threads[0][0]=invalid;
  assert.throws(()=>validateDraft(broken));
 }
});

test('Ivory follows the photographed opposite-hole threading and paired T marks',()=>{
 const draft=createPreset('ivory-braid');
 const blue='#234a75',ivory='#f0e8d1';
 const expected=[[null,blue,null,ivory],[blue,null,ivory,null],[null,ivory,null,blue],[ivory,null,blue,null]];
 assert.equal(draft.cards,16);
 for(let card=0;card<12;card++){
  assert.deepEqual(draft.threads[card+2],expected[card%4]);
  assert.equal(draft.slants[card+2],'Z');
 }
 const marked=[[1,2,9,10],[1,2,3,4,5,6],[3,4,5,6,7,8,11,12],[1,2,5,6,7,8,9,10],[7,8,9,10,11,12],[3,4,11,12]];
 for(let pick=0;pick<draft.picks;pick++){
  const backwards=draft.turns[pick].slice(2,14).flatMap((dir,index)=>dir==='B'?[index+1]:[]);
  assert.deepEqual(backwards,marked[Math.floor((pick%12)/2)]);
  for(const card of [0,1,14,15])assert.equal(draft.turns[pick][card],'F');
 }
 assert.equal(threadCount(draft),40);
 const fabric=weave(draft).map(row=>row.map(({color,slant})=>({color,slant})));
 assert.deepEqual(fabric.slice(0,12),fabric.slice(12,24));
});

test('Empty holes export as empty symbols and count only actual warp threads',()=>{
 const draft=createPreset('ivory-braid'),svg=chartSVG(draft);
 assert.ok(svg.includes('40 warp threads'));
 assert.equal([...svg.matchAll(/>∅<\/text>/g)].length,24);
 for(const output of [svg,fabricSVG(draft),fabricSVG(draft,true)])assert.ok(!/NaN|undefined|fill="null"|stroke="null"/.test(output));
});

test('A selected starting hole changes the first exposed thread and survives save/open',()=>{
 const draft=createDraft(4,2,12);draft.startHole=0;
 assert.equal(weave(draft)[0][0].hole,0);
 assert.deepEqual(validateDraft(JSON.parse(JSON.stringify(draft))),draft);
 assert.ok(chartSVG(draft).includes('Start with B upper-far, A upper-near.'));
 assert.equal(createPreset('ivory-braid').startHole,0);
 const resized=resizeDraft({...draft,holes:4,startHole:3},{holes:3});
 assert.equal(resized.startHole,2);
 for(const startHole of [-1,4,0.5,'A',null])assert.throws(()=>validateDraft({...draft,startHole}));
});

test('Opposite-hole FFBB exposes complementary faces and uninterrupted three-pick floats',()=>{
 const draft=createDraft(4,2,12),blue='#234a75',ivory='#f0e8d1';
 draft.threads=Array.from({length:2},()=>[null,blue,null,ivory]);
 draft.turns=Array.from({length:12},(_,r)=>Array(2).fill(r%4<2?'F':'B'));
 const front=weave(draft),back=weave(draft,true);
 assert.deepEqual(front.map(row=>row[0].color),Array.from({length:12},(_,r)=>r%4===1?blue:ivory));
 for(let r=0;r<12;r++){
  assert.notEqual(front[r][0].color,back[r][0].color);
  assert.equal((front[r][0].hole+2)%4,back[r][0].hole);
 }
 const cells=[...fabricSVG(draft).matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)]
  .map(match=>({points:match[1].split(' ').map(point=>point.split(',').map(Number)),color:match[2]}));
 const areas=cells.filter(cell=>cell.color===ivory).map(({points:p})=>Math.abs(p.reduce((area,[x,y],i)=>area+x*p[(i+1)%4][1]-y*p[(i+1)%4][0],0))/2);
 assert.ok(areas.some(area=>Math.abs(area-3*12*12*.92)<.01),'Three picks form one continuous float polygon');
 assert.equal(cells.length,14,'Each column has seven physical floats, including clipped ends');
 draft.threads[0][1]=ivory;
 assert.equal([...fabricSVG(draft).matchAll(/<polygon /g)].length,14,'Equal colors in different holes still represent different yarns');
});

test('Sparse drafts remain renderable for every card type, including completely empty tablets',()=>{
 for(let holes=3;holes<=8;holes++){
  const draft=createDraft(holes,2,20);
  draft.threads[0].fill(null);draft.threads[1]=draft.threads[1].map((color,h)=>h%2?color:null);
  for(const back of [false,true]){
   const data=weave(draft,back);
   assert.ok(data.every(row=>row[0].color===null));
   for(const row of data)if(row[1].hole!==null)assert.equal(row[1].color,draft.threads[1][row[1].hole]);
   assert.ok(!/NaN|undefined|fill="null"/.test(fabricSVG(draft,back)));
  }
 }
});
