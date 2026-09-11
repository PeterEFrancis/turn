import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraft,weave,resizeDraft,validateDraft,chartSVG,fabricSVG,wovenPickCount} from '../model.js';

const polygons=svg=>[...svg.matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)].map(match=>({
 points:match[1].split(' ').map(point=>point.split(',').map(Number)),color:match[2]
}));
const textLines=svg=>[...svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(match=>match[1]);

test('64-tablet source drafts retain metadata and weft instructions through save/open',()=>{
 const original={...createDraft(4,64,8),startHole:0,source:'Groff, page 23',notes:['Use white weft.','Twelve turns have no weft.'],weft:[true,true,false,false,true,true,false,false]};
 const restored=validateDraft(JSON.parse(JSON.stringify(original)));
 assert.deepEqual(restored,original);
 restored.notes[0]='Changed';restored.weft[0]=false;
 assert.equal(original.notes[0],'Use white weft.');assert.equal(original.weft[0],true);
 assert.throws(()=>validateDraft(createDraft(4,65,8)));
 assert.throws(()=>resizeDraft(original,{cards:65}));
});

test('Imported optional instructions reject malformed and sparse arrays',()=>{
 const draft=createDraft(4,20,8);
 for(const metadata of [
  {source:{}},{source:'x'.repeat(2001)},{notes:'note'},{notes:[null]},{notes:Array(2)},
  {notes:['x'.repeat(4001)]},{notes:Array(65).fill('note')},
  {weft:true},{weft:Array(7).fill(true)},{weft:Array(8).fill(1)},{weft:Array(8)},
 ])assert.throws(()=>validateDraft({...draft,...metadata}));
 assert.deepEqual(validateDraft(draft),draft,'Old files do not acquire optional fields');
 assert.equal(wovenPickCount(draft),draft.picks);
});

test('Resize repeats the weft plan with turns and preserves independent instruction arrays',()=>{
 const draft={...createDraft(4,4,4),source:'Source reference',notes:['Use white.'],weft:[true,false,false,true]};
 draft.turns[1].fill('B');
 const expanded=resizeDraft(draft,{cards:64,picks:10});
 assert.deepEqual(expanded.weft,[true,false,false,true,true,false,false,true,true,false]);
 assert.equal(expanded.turns[5][63],'B');
 assert.equal(expanded.source,draft.source);assert.deepEqual(expanded.notes,draft.notes);
 expanded.notes.push('Extra note.');expanded.weft[0]=false;
 assert.equal(draft.notes.length,1);assert.equal(draft.weft[0],true);
 assert.deepEqual(resizeDraft(expanded,{picks:4}).weft,[false,false,false,true]);
 assert.equal(resizeDraft(createDraft(),{cards:64}).weft,undefined);
});

test('Unwefted turns change the next exposed hole without creating fabric rows',()=>{
 const draft=createDraft(4,2,8);
 draft.threads=Array.from({length:2},()=>['#111111','#222222','#333333','#444444']);
 draft.turns=Array.from({length:8},()=>['F','F']);
 draft.weft=[true,false,false,true,true,false,true,true];
 assert.deepEqual(weave(draft).map(row=>row[0].hole),[3,2,1,0,3,2,1,0]);
 assert.equal(wovenPickCount(draft),5);
 for(const back of [false,true]){
  const svg=fabricSVG(draft,back,10),cells=polygons(svg);
  assert.equal(cells.length,10);
  assert.deepEqual(cells.filter((_,i)=>i%2===0).map(cell=>cell.color),back?
   ['#222222','#333333','#222222','#444444','#333333']:
   ['#444444','#111111','#444444','#222222','#111111']);
  const dimensions=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  assert.equal(Number(dimensions[1]),20);assert.ok(Math.abs(Number(dimensions[2])-46)<1e-9);
  for(let row=0;row<4;row++)for(let card=0;card<2;card++){
   const before=cells[row*2+card],after=cells[(row+1)*2+card];
   assert.deepEqual(before.points[3],after.points[0]);assert.deepEqual(before.points[2],after.points[1]);
  }
 }
});

test('Explicit all-weft plans preserve normal full and sparse rendering',()=>{
 for(const sparse of [false,true]){
  const draft=createDraft(4,4,16,'diamond');
  if(sparse)draft.threads=draft.threads.map(card=>card.map((thread,h)=>h%2?null:thread));
  const explicit={...draft,weft:Array(draft.picks).fill(true)};
  assert.equal(fabricSVG(explicit),fabricSVG(draft));
  assert.equal(fabricSVG(explicit,true),fabricSVG(draft,true));
 }
});

test('All-unwefted plans render safely with no invented woven cells',()=>{
 const draft={...createDraft(4,2,8),weft:Array(8).fill(false)};
 assert.equal(wovenPickCount(draft),0);assert.equal(weave(draft).length,8);
 const svg=fabricSVG(draft),chart=chartSVG(draft);
 assert.equal(polygons(svg).length,0);assert.equal(polygons(chart).length,0);
 assert.match(svg,/viewBox="0 0 24 1"/);
 assert.ok(!svg.includes('NaN'));assert.ok(!chart.includes('NaN'));
 assert.match(chart,/height="1" xmlns=/);
});

test('Export labels no-weft turns, wraps and escapes notes, and sizes a partial preview by woven rows',()=>{
 const draft={...createDraft(4,12,8),weft:[true,false,false,true,true,true,true,true],source:'Groff <source> & "scan"',notes:['Use <white> & never <script>alert(1)</script>. '+('Keep this instruction readable. '.repeat(20))]};
 const svg=chartSVG(draft,{end:4}),lines=textLines(svg),content=lines.join(' ');
 assert.ok(lines.includes('2*'));assert.ok(lines.includes('3*'));assert.ok(!lines.includes('4*'));
 assert.ok(content.includes('* Turn cards without inserting weft.'));
 assert.ok(content.includes('Preview shows woven sections only; braided gaps and their length are not simulated.'));
 assert.ok(content.includes('Source: Groff &lt;source&gt; &amp; &quot;scan&quot;'));
 assert.ok(content.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
 assert.ok(!svg.includes('<script>'));
 const preview=svg.match(/<svg x="[^"]+" y="130" width="([^"]+)" height="([^"]+)"/);
 assert.ok(preview);assert.equal(Number(preview[2]),Number(preview[1])*2*.92/12);
 assert.equal(polygons(svg).length,24);
 const noteLines=lines.filter(line=>line.includes('instruction readable'));
 assert.ok(noteLines.length>1,'Long source instructions wrap onto several lines');
 const height=Number(svg.match(/height="([^"]+)"/)[1]);
 const textY=[...svg.matchAll(/<text x="[^"]+" y="([^"]+)"/g)].map(match=>Number(match[1]));
 assert.ok(Math.max(...textY)<height,'Notes fit inside the export');
});
