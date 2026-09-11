export const COLORS=[{name:'Terracotta',hex:'#c85038'},{name:'Midnight',hex:'#283e4d'},{name:'Natural',hex:'#f0e3c6'},{name:'Rose',hex:'#d99b87'},{name:'Moss',hex:'#87977e'}];
export const mod=(n,m)=>((n%m)+m)%m;
export function createDraft(holes=4,cards=20,picks=32,preset='chevron'){
const colors=COLORS.map(x=>({...x}));
const threads=Array.from({length:cards},(_,c)=>Array.from({length:holes},(_,h)=>{
if(preset==='blank')return colors[2].hex;
if(c<2||c>=cards-2)return colors[c%2===0?1:2].hex;
if(preset==='stripe')return colors[Math.floor(c/2)%3].hex;
// The two cards at the S/Z join need the same phase, including odd widths.
const phase=Math.min(c-2,cards-3-c+cards%2);
const v=mod(h+phase,holes);
return v===0?colors[0].hex:v===1?colors[1].hex:colors[2].hex;
}));
const forward=preset==='stripe'?holes*2:holes;
return {version:1,name:({chevron:'Classic chevron',diamond:'Nested diamonds',stripe:'Simple stripes',blank:'Untitled pattern'})[preset]||'Untitled pattern',holes,cards,picks,colors,threads,slants:Array.from({length:cards},(_,c)=>c<cards/2?'S':'Z'),turns:Array.from({length:picks},(_,r)=>Array.from({length:cards},()=>preset==='stripe'||preset==='chevron'?'F':r%(forward*2)<forward?'F':'B'))};
}
export function weave(draft,back=false){
 const positions=Array(draft.cards).fill(draft.startHole??draft.holes-1);
 const sparse=draft.threads.map(card=>card.includes(null));
 return draft.turns.map(row=>row.map((dir,c)=>{
  const step=dir==='F'?1:-1;
  const corner=mod(positions[c]+(step===1?0:1)+(back?Math.floor(draft.holes/2):0),draft.holes);
  positions[c]-=step;
  let hole=corner,color=draft.threads[c][hole];
  if(sparse[c]){
   // A sparse card's visible yarn is the occupied hole above the weft, not
   // necessarily the corner used by a fully threaded warp-twined tablet.
   // Opposite-hole pairs have exactly one upper and one lower yarn.
   // See https://www.stringpage.com/tw/twohole.html for their 3/1 floats.
   const surface=draft.threads[c].flatMap((thread,index)=>{
    const angle=(mod(index-positions[c],draft.holes)+.5)*2*Math.PI/draft.holes;
    const height=Math.sin(angle)*(back?-1:1);
    return thread!==null&&height>1e-9?[{hole:index,color:thread,height}]:[];
   });
   surface.sort((a,b)=>Math.abs(b.height-a.height)>1e-9?b.height-a.height:(a.hole===corner?-1:b.hole===corner?1:a.hole-b.hole));
   hole=surface[0]?.hole??null;color=surface[0]?.color??null;
  }
  return {color,slant:(draft.slants[c]==='S'?-1:1)*step*(back?-1:1),hole,position:positions[c]};
 }));
}
export const threadCount=draft=>draft.threads.flat().filter(color=>color!==null).length;
export const wovenPickCount=draft=>Array.from({length:draft.picks},(_,r)=>draft.weft?.[r]!==false).filter(Boolean).length;
export const escapeXML=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
export function fabricSVG(draft,back=false,scale=12){
 // Every turn changes the tablets, including turns made without inserting weft.
 // Only woven rows occupy height in this schematic; extra-twist shape is not modeled.
 const data=weave(draft,back).filter((_,r)=>draft.weft?.[r]!==false),picks=data.length,dy=scale*.92,w=draft.cards*scale,h=Math.max(1,picks*dy);
 const point=(x,y)=>`${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;
 // Adjacent picks share this exact edge, including when a tablet reverses.
 const edge=(r,c)=>{
  // Mirror the chart slant because this preview places pick 1 at the top.
  const y=r*dy,offset=r===0||r===picks?0:-data[r-1][c].slant*dy/2;
  return [y-offset,y+offset];
 };
 let content='',outlines='';
 const sparse=draft.threads.map(card=>card.includes(null));
 for(let r=0;r<picks;r++)for(let c=0;c<draft.cards;c++){
  const p=data[r][c];
  // One unbroken exposed yarn is one float, even across a turn reversal.
  // Keep separate stitches on fully threaded tablets and preserve their geometry.
  if(sparse[c]&&r>0&&data[r-1][c].hole===p.hole)continue;
  let end=r+1;
  if(sparse[c])while(end<picks&&data[end][c].hole===p.hole)end++;
  const x=c*scale,[tl,tr]=edge(r,c),[bl,br]=edge(end,c),color=p.color??'#e7e3da';
  const points=[[x,tl],[x+scale,tr],[x+scale,br],[x,bl]];
  // A same-color stroke closes subpixel antialias seams without separating stitches.
  content+=`<polygon points="${points.map(([px,py])=>point(px,py)).join(' ')}" fill="${color}" stroke="${color}" stroke-width="${scale*.04}" stroke-linejoin="round"/>`;
  outlines+=`<path d="M${point(x,bl)} L${point(x+scale,br)} L${point(x+scale,tr)}"/>`;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Woven ${back?'back':'front'} preview for ${draft.cards} tablets and ${picks} picks"><title>${escapeXML(draft.name)} — woven preview</title>${content}<g fill="none" stroke="#000" stroke-opacity=".16" stroke-width="${scale*.025}">${outlines}</g></svg>`;
}

export function resizeDraft(draft,{holes=draft.holes,cards=draft.cards,picks=draft.picks}){
if(!Number.isInteger(holes)||holes<3||holes>8||!Number.isInteger(cards)||cards<2||cards>64||!Number.isInteger(picks)||picks<4||picks>160)throw new Error('Use 3–8 holes, 2–64 tablets, and 4–160 picks.');
return {...draft,...(draft.startHole===undefined?{}:{startHole:Math.min(draft.startHole,holes-1)}),...(draft.notes===undefined?{}:{notes:[...draft.notes]}),...(draft.weft===undefined?{}:{weft:Array.from({length:picks},(_,r)=>draft.weft[r%draft.picks])}),holes,cards,picks,threads:Array.from({length:cards},(_,c)=>Array.from({length:holes},(_,h)=>(h<draft.holes?draft.threads[Math.min(c,draft.cards-1)][h]:COLORS[2].hex))),slants:Array.from({length:cards},(_,c)=>draft.slants[Math.min(c,draft.cards-1)]),turns:Array.from({length:picks},(_,r)=>Array.from({length:cards},(_,c)=>draft.turns[r%draft.picks][Math.min(c,draft.cards-1)]))};
}
export function validateDraft(input){
const fail=()=>{throw new Error('This file is not a valid Turn draft. Choose a JSON file saved from this studio.');};
const hex=s=>typeof s==='string'&&/^#[0-9a-f]{6}$/i.test(s);
if(!input||typeof input!=='object'||input.version!==1||typeof input.name!=='string'||input.name.length>80)fail();
const {holes,cards,picks,colors,threads,slants,turns,startHole,source,notes,weft}=input;
if(startHole!==undefined&&(!Number.isInteger(startHole)||startHole<0||startHole>=holes))fail();
if(source!==undefined&&(typeof source!=='string'||source.length>2000))fail();
if(notes!==undefined&&(!Array.isArray(notes)||notes.length>64||!Array.from(notes).every(note=>typeof note==='string'&&note.length<=4000)))fail();
if(weft!==undefined&&(!Array.isArray(weft)||weft.length!==picks||!Array.from(weft).every(pick=>typeof pick==='boolean')))fail();
if(!Number.isInteger(holes)||holes<3||holes>8||!Number.isInteger(cards)||cards<2||cards>64||!Number.isInteger(picks)||picks<4||picks>160)fail();
if(!Array.isArray(colors)||!colors.length||colors.length>24||!colors.every(c=>c&&typeof c.name==='string'&&c.name.length<=60&&hex(c.hex)))fail();
if(!Array.isArray(threads)||threads.length!==cards||!threads.every(row=>Array.isArray(row)&&row.length===holes&&row.every(color=>color===null||hex(color))))fail();
if(!Array.isArray(slants)||slants.length!==cards||!slants.every(s=>s==='S'||s==='Z'))fail();
if(!Array.isArray(turns)||turns.length!==picks||!turns.every(row=>Array.isArray(row)&&row.length===cards&&row.every(d=>d==='F'||d==='B')))fail();
return {version:1,...(startHole===undefined?{}:{startHole}),...(source===undefined?{}:{source}),...(notes===undefined?{}:{notes:[...notes]}),...(weft===undefined?{}:{weft:[...weft]}),name:input.name||'Untitled pattern',holes,cards,picks,colors:colors.map(c=>({name:c.name,hex:c.hex.toLowerCase()})),threads:threads.map(r=>r.map(h=>h===null?null:h.toLowerCase())),slants:[...slants],turns:turns.map(r=>[...r])};
}
function wrapExportText(text,columns){
 const lines=[];
 for(const paragraph of String(text).split(/\r?\n/)){
  let line='';
  for(let word of paragraph.split(/\s+/).filter(Boolean)){
   if(line&&line.length+word.length+1>columns){lines.push(line);line='';}
   while(word.length>columns){lines.push(word.slice(0,columns));word=word.slice(columns);}
   if(word)line+=(line?' ':'')+word;
  }
  if(line)lines.push(line);
 }
 return lines;
}
export function chartSVG(draft,{start=0,end=draft.picks,includeThreading=true,includePreview=true}={}){
const previewDraft={...draft,picks:end,turns:draft.turns.slice(0,end),...(draft.weft===undefined?{}:{weft:draft.weft.slice(0,end)})};
const cell=23,left=50,top=95,chartWidth=draft.cards*cell,threadHeight=includeThreading?(draft.holes+3)*cell+30:0,turnY=top+threadHeight+32,previewWidth=includePreview?Math.min(300,chartWidth):0,width=left+chartWidth+40+(includePreview?previewWidth+70:0),previewHeight=Math.max(1,previewWidth*wovenPickCount(previewDraft)*.92/draft.cards);
const noWeft=draft.weft?.some(pick=>!pick),columns=Math.max(16,Math.floor((width-56)/6.4));
const footerParagraphs=[...(noWeft?['* Turn cards without inserting weft.','Preview shows woven sections only; braided gaps and their length are not simulated.']:[]),...(draft.source?[`Source: ${draft.source}`]:[]),...(draft.notes??[]),`Start with ${String.fromCharCode(65+mod((draft.startHole??draft.holes-1)+1,draft.holes))} upper-far, ${String.fromCharCode(65+(draft.startHole??draft.holes-1))} upper-near. Read the labelled face from the right.`,'S/Z describes threading. Preview is schematic; sample to check yarn, floats, and tension.'];
const footer=footerParagraphs.flatMap(line=>wrapExportText(line,columns));
const footerY=Math.max(turnY+(end-start+1)*cell+30,includePreview?130+previewHeight:0)+18,height=footerY+footer.length*16+12;
const txt=(x,y,text,size=12,anchor='start')=>`<text x="${x}" y="${y}" fill="#444b45" font-family="Arial,sans-serif" font-size="${size}" text-anchor="${anchor}">${escapeXML(text)}</text>`;
let body=`<rect width="100%" height="100%" fill="white"/>${txt(28,34,draft.name,Math.min(24,(width-56)/Math.max(1,draft.name.length*.6)))}${txt(28,60,`${draft.holes} holes · ${draft.cards} tablets · ${noWeft?`${draft.picks} turns · ${wovenPickCount(draft)} weft picks`:`${draft.picks} picks`} · ${threadCount(draft)} warp threads`)}${txt(28,80,'One hole per turn. F = away; B = toward you. Pick 1 is at the top.',11)}`;
if(includeThreading){body+=txt(28,top+12,'THREADING',12);for(let c=0;c<draft.cards;c++){body+=txt(left+c*cell+cell/2,top+35,c+1,10,'middle');for(let h=0;h<draft.holes;h++){if(c===0)body+=txt(28,top+54+h*cell,String.fromCharCode(65+h),11);body+=`<rect x="${left+c*cell}" y="${top+39+h*cell}" width="21" height="21" fill="${draft.threads[c][h]??'#fff'}" stroke="#d7d9d2" stroke-width=".5"/>${draft.threads[c][h]===null?txt(left+c*cell+10.5,top+54+h*cell,'∅',13,'middle'):''}`;}body+=txt(left+c*cell+cell/2,top+54+draft.holes*cell,draft.slants[c],11,'middle');}}
body+=txt(28,turnY-18,`TURNING PLAN · ${noWeft?'TURN ROWS':'PICKS'} ${start+1}–${end}`,12);for(let c=0;c<draft.cards;c++)body+=txt(left+c*cell+cell/2,turnY,c+1,10,'middle');for(let r=start;r<end;r++){const y=turnY+7+(r-start)*cell;body+=txt(28,y+15,`${r+1}${draft.weft?.[r]===false?'*':''}`,10,'middle');for(let c=0;c<draft.cards;c++){const d=draft.turns[r][c];body+=`<rect x="${left+c*cell}" y="${y}" width="21" height="21" rx="2" fill="${d==='F'?'#eeeede':'#f2ded4'}"/>${txt(left+c*cell+cell/2,y+15,d,11,'middle')}`;}}
if(includePreview){const x=left+chartWidth+40;body+=txt(x,110,'WOVEN SCHEMATIC',12);const preview=fabricSVG(previewDraft).replace('<svg ',`<svg x="${x}" y="130" width="${previewWidth}" height="${previewHeight}" `);body+=preview;}
footer.forEach((line,index)=>{body+=txt(28,footerY+index*16,line,11);});
return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>${escapeXML(draft.name)} — complete tablet weaving draft</title><desc>${escapeXML(footerParagraphs.join('\n'))}</desc>${body}</svg>`;
}
