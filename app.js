import { PATTERNS, getPattern, createPreset } from './patterns.js?v=9';
import {COLORS,createDraft,weave,wovenPickCount,threadCount,fabricSVG,escapeXML,mod,validateDraft,resizeDraft,chartSVG} from './model.js?v=9';
const $=s=>document.querySelector(s);let draft=createDraft(),activeColor=COLORS[0].hex,showBack=false;
function render(){
const wovenRows=wovenPickCount(draft),hasUnwefted=!!draft.weft?.includes(false);
$('#pick-count-label').textContent=draft.weft?'Turn rows':'Picks';$('.preview-step').textContent=draft.weft?'1 hole / turn':'1 step / pick';
$('#draft-notes').hidden=!draft.source&&!draft.notes?.length;
$('#draft-source').textContent=draft.source||'Pattern notes';
$('#source-checks').innerHTML=(draft.notes||[]).filter(note=>note.startsWith('Source check:')).map(note=>`<p>${escapeXML(note)}</p>`).join('');
$('#draft-instructions').innerHTML=(draft.notes||[]).filter(note=>!note.startsWith('Source check:')).map(note=>`<li>${escapeXML(note)}</li>`).join('');
const previewNote=hasUnwefted?'Preview shows woven sections only. Braided gaps and their length are not simulated.':(draft.notes||[]).find(note=>note.startsWith('This is a flat threading preview.'))||'';
$('#preview-note').textContent=previewNote;$('#preview-note').hidden=!previewNote;

if(activeColor!==null&&!draft.colors.some(color=>color.hex===activeColor))activeColor=draft.colors[0].hex;
$('#start-hole').innerHTML=Array.from({length:draft.holes},(_,h)=>`<option value="${h}" ${h===(draft.startHole??draft.holes-1)?'selected':''}>${String.fromCharCode(65+h)}</option>`).join('');
$('#card-type').value=draft.holes;$('#card-count').value=draft.cards;$('#pick-count').value=draft.picks;$('#draft-name').value=draft.name;
$('#thread-count').textContent=`${threadCount(draft)} threads`;$('#preview-size').textContent=`${draft.cards} tablets · ${wovenRows} picks${hasUnwefted?` / ${draft.picks} turns`:""}`;$('#draft-stats').textContent=`${draft.holes}-hole cards / ${threadCount(draft)} warp threads`;
$('#ruler-middle').textContent=Math.ceil(wovenRows/2);$('#ruler-end').textContent=wovenRows;$('#ruler-middle').parentElement.firstElementChild.textContent=wovenRows?'01':'0';
$('#palette').innerHTML=draft.colors.map(c=>`<button class="swatch" style="--swatch:${c.hex};--check:${parseInt(c.hex.slice(1,3),16)*.299+parseInt(c.hex.slice(3,5),16)*.587+parseInt(c.hex.slice(5,7),16)*.114>160?'#414b3d':'#fff'}" aria-label="Select ${escapeXML(c.name)}" aria-pressed="${activeColor===c.hex}" data-color="${c.hex}" title="${escapeXML(c.name)}"></button>`).join('')+`<button class="swatch empty-swatch" aria-label="Select empty hole" aria-pressed="${activeColor===null}" data-color="empty" title="Empty hole">∅</button>`;
const pts=Array.from({length:draft.holes},(_,h)=>{const a=-Math.PI/2+Math.PI/draft.holes+(h+draft.holes-1-(draft.startHole??draft.holes-1))*2*Math.PI/draft.holes;return [70+47*Math.cos(a),66+47*Math.sin(a)];});
$('#card-illustration').innerHTML=`<svg viewBox="0 0 140 132" aria-label="${draft.holes}-hole tablet diagram"><polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="#f6eddf" stroke="#dacdbc" stroke-width="1.5" stroke-linejoin="round"/>${pts.map(([x,y],h)=>`<circle cx="${70+(x-70)*.68}" cy="${66+(y-66)*.68}" r="4.5" fill="${draft.threads[0][h]??'#fff'}" stroke="#d2bfa5" stroke-width="1"/><text x="${70+(x-70)*1.22}" y="${70+(y-66)*1.22}" text-anchor="middle" fill="#969083" font-size="10">${String.fromCharCode(65+h)}</text>`).join('')}<text x="70" y="70" text-anchor="middle" fill="#b5a996" font-size="16" font-family="serif">${draft.holes}</text></svg>`;
$('#rotation-label').textContent=`${draft.holes===4?'¼':`1/${draft.holes}`} turn per pick`;$('.card-caption span:last-child').textContent=`A–${String.fromCharCode(64+draft.holes)}`;
let threading='<span></span>'+Array.from({length:draft.cards},(_,c)=>`<span class="chart-label">${c+1}</span>`).join('');for(let h=0;h<draft.holes;h++){threading+=`<span class="chart-label">${String.fromCharCode(65+h)}</span>`;for(let c=0;c<draft.cards;c++)threading+=`<button class="hole-cell${draft.threads[c][h]===null?' empty-hole':''}" data-card="${c}" data-hole="${h}" style="--thread:${draft.threads[c][h]??'#fff'}" aria-label="Tablet ${c+1}, hole ${String.fromCharCode(65+h)}, ${draft.threads[c][h]??'empty'}" title="Tablet ${c+1} · Hole ${String.fromCharCode(65+h)}">${draft.threads[c][h]===null?'∅':''}</button>`;}
threading+='<span class="chart-label">↗</span>'+draft.slants.map((s,c)=>`<button class="slant-cell" data-card="${c}" data-slant="${s}" aria-label="Tablet ${c+1}: ${s} threading. Click to flip">${s}</button>`).join('');$('#thread-chart').style.setProperty('--cards',draft.cards);$('#thread-chart').innerHTML=threading;
let turns='<span class="chart-label column-head">↓</span>'+(draft.weft?'<span class="chart-label column-head" title="Insert weft">W</span>':'')+Array.from({length:draft.cards},(_,c)=>`<span class="chart-label column-head">${c+1}</span>`).join('');for(let r=0;r<draft.picks;r++){turns+=`<button class="pick-label" data-pick="${r}" title="Reverse all tablets in pick ${r+1}" aria-label="Reverse all tablets in pick ${r+1}">${String(r+1).padStart(2,'0')}${draft.weft?.[r]===false?'*':''}</button>`;if(draft.weft)turns+=`<input class="weft-cell" type="checkbox" data-weft-pick="${r}" aria-label="Insert weft on turn row ${r+1}" title="${draft.weft[r]?'Insert weft':'Turn without weft'}" ${draft.weft[r]?'checked':''}>`;for(let c=0;c<draft.cards;c++)turns+=`<button class="turn-cell" data-card="${c}" data-pick="${r}" data-dir="${draft.turns[r][c]}" aria-label="Pick ${r+1}, tablet ${c+1}: ${draft.turns[r][c]==='F'?'forward':'backward'}. Click to reverse">${draft.turns[r][c]}</button>`;}$('#turn-chart').classList.toggle('with-weft',!!draft.weft);$('#turn-chart').style.setProperty('--cards',draft.cards);$('#turn-chart').innerHTML=turns;
$('.turning-bottom span:last-child').textContent=draft.weft?'W = insert weft · * = no weft':'Pick 1 at top ↓';$('#woven-preview').innerHTML=fabricSVG(draft,showBack);$('#preview-face').textContent=showBack?'Back of band':'Front of band';updateStateLabels();
}
let history=[],future=[],dirty=false,painting=false,paintCheckpoint=false,toastTimer;
const snapshot=()=>JSON.stringify(draft);
function checkpoint(){history.push(snapshot());if(history.length>80)history.shift();future=[];dirty=true;}
function updateStateLabels(){
$('#undo').disabled=!history.length;$('#redo').disabled=!future.length;
const color=draft.colors.find(c=>c.hex===activeColor);$('#active-color-name').textContent=activeColor===null?'Empty hole':color?.name||activeColor;$('.mini-swatch').style.background=activeColor??'#fff';$('.mini-swatch').textContent=activeColor===null?'∅':'';
const rows=draft.turns.map(r=>r.every(x=>x===r[0])?r[0]:'mixed');
let repeat='Custom turns';if(rows.every(r=>r==='F'))repeat='All forward';else if(rows.every(r=>r==='B'))repeat='All backward';else if(!rows.includes('mixed')){let period=rows.length;for(let p=1;p<=rows.length/2;p++){if(rows.every((v,i)=>v===rows[i%p])){period=p;break;}}const runs=[];for(const d of rows.slice(0,period)){if(runs.at(-1)?.d===d)runs.at(-1).n++;else runs.push({d,n:1});}if(runs.length<=4)repeat=runs.map(r=>`${r.n}${r.d}`).join(' / ');}
$('#preview-repeat').textContent=repeat;$('#status-message').textContent=dirty?'Draft changed · Save a copy to keep your work.':'Ready to weave something good.';
$('#apply-preset').title='Replace threading and turns with this starting pattern. Undo is available.';
}
function notice(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3800);}
function change(action,message){checkpoint();action();render();if(message)notice(message);}
function undo(){if(!history.length)return;future.push(snapshot());draft=JSON.parse(history.pop());dirty=true;render();syncRepeatInputs();}
function redo(){if(!future.length)return;history.push(snapshot());draft=JSON.parse(future.pop());dirty=true;render();syncRepeatInputs();}
function resize(values){try{const next=resizeDraft(draft,values);if(JSON.stringify(next)===snapshot())return;change(()=>draft=next,values.holes?'Card type updated. Existing hole colors are kept; extra holes start natural.':undefined);}catch(e){notice(e.message);render();}}
function setColor(hex){activeColor=hex;render();}
function paint(cell){const c=Number(cell.dataset.card),h=Number(cell.dataset.hole);if(draft.threads[c][h]===activeColor)return;if(!paintCheckpoint){checkpoint();paintCheckpoint=true;}draft.threads[c][h]=activeColor;if(c===0)$('#card-illustration').querySelectorAll('circle')[h].setAttribute('fill',activeColor??'#fff');cell.style.setProperty('--thread',activeColor??'#fff');cell.classList.toggle('empty-hole',activeColor===null);cell.textContent=activeColor===null?'∅':'';cell.setAttribute('aria-label',`Tablet ${c+1}, hole ${String.fromCharCode(65+h)}, ${activeColor??'empty'}`);$('#thread-count').textContent=`${threadCount(draft)} threads`;$('#draft-stats').textContent=`${draft.holes}-hole cards / ${threadCount(draft)} warp threads`;$('#woven-preview').innerHTML=fabricSVG(draft);updateStateLabels();}
$('#palette').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(b)setColor(b.dataset.color==='empty'?null:b.dataset.color);});
$('#custom-color').addEventListener('change',e=>{const hex=e.target.value.toLowerCase();if(draft.colors.some(c=>c.hex===hex)){setColor(hex);return;}if(draft.colors.length>=24){notice('The palette supports up to 24 colors. Select an existing color.');return;}change(()=>{draft.colors.push({name:`Custom ${hex}`,hex});activeColor=hex;});});
$('#thread-chart').addEventListener('pointerdown',e=>{const cell=e.target.closest('.hole-cell');if(!cell||e.button!==0||e.pointerType==='touch')return;e.preventDefault();painting=true;paintCheckpoint=false;cell.focus({preventScroll:true});paint(cell);});
$('#thread-chart').addEventListener('pointerover',e=>{if(painting&&e.buttons===1){const cell=e.target.closest('.hole-cell');if(cell)paint(cell);}});
document.addEventListener('pointerup',()=>{if(painting){painting=false;paintCheckpoint=false;}});
$('#thread-chart').addEventListener('click',e=>{const hole=e.target.closest('.hole-cell');if(hole){paintCheckpoint=false;paint(hole);paintCheckpoint=false;return;}const cell=e.target.closest('.slant-cell');if(cell){const c=Number(cell.dataset.card);change(()=>draft.slants[c]=draft.slants[c]==='S'?'Z':'S');$(`.slant-cell[data-card="${c}"]`).focus({preventScroll:true});}});
$('#turn-chart').addEventListener('click',e=>{const cell=e.target.closest('.turn-cell'),row=e.target.closest('.pick-label');if(cell){const r=Number(cell.dataset.pick),c=Number(cell.dataset.card);change(()=>draft.turns[r][c]=draft.turns[r][c]==='F'?'B':'F');$(`.turn-cell[data-pick="${r}"][data-card="${c}"]`).focus({preventScroll:true});}else if(row){const r=Number(row.dataset.pick);change(()=>draft.turns[r]=draft.turns[r].map(d=>d==='F'?'B':'F'));$(`.pick-label[data-pick="${r}"]`).focus({preventScroll:true});}});
$('#turn-chart').addEventListener('change',e=>{const input=e.target.closest('[data-weft-pick]');if(input){const r=Number(input.dataset.weftPick),checked=input.checked;change(()=>draft.weft[r]=checked);$(`[data-weft-pick="${r}"]`).focus({preventScroll:true});}});
function applyRepeat(f,b){if(!Number.isInteger(f)||!Number.isInteger(b)||f<0||b<0||f>32||b>32||f+b===0)throw new Error('Use 0–32 turns in each direction, with at least one turn.');change(()=>{draft.turns=Array.from({length:draft.picks},(_,r)=>Array(draft.cards).fill(r%(f+b)<f?'F':'B'));},`Applied ${f} forward / ${b} backward turns.`);}
$('#apply-repeat').addEventListener('click',()=>{try{applyRepeat(Number($('#forward-count').value),Number($('#backward-count').value));}catch(e){notice(e.message);}});
$('#all-forward').addEventListener('click',()=>{applyRepeat(draft.holes,0);$('#forward-count').value=draft.holes;$('#backward-count').value=0;});
for(const [selector,key] of [['#card-count','cards'],['#pick-count','picks']])$(selector).addEventListener('input',e=>{if(e.target.value!==''&&e.target.validity.valid)resize({[key]:Number(e.target.value)});});
$('#start-hole').addEventListener('change',e=>change(()=>draft.startHole=Number(e.target.value)));
$('#card-type').addEventListener('change',e=>resize({holes:Number(e.target.value)}));$('#card-count').addEventListener('change',e=>resize({cards:Number(e.target.value)}));$('#pick-count').addEventListener('change',e=>resize({picks:Number(e.target.value)}));
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{const [key,step]=b.dataset.step.split(':');resize({[key]:Math.max(key==='cards'?2:4,Math.min(key==='cards'?64:160,draft[key]+Number(step)))});}));
function previewSelectedPattern(){
 const pattern=getPattern($('#preset').value);
 $('#preset-description').textContent=pattern.group==='basic'
  ? `${pattern.description} Uses your current dimensions.`
  : `${pattern.description} Loads ${pattern.holes}-hole cards, ${pattern.cards} tablets and ${pattern.picks} ${pattern.weftPicks===undefined?'picks':'turn rows'}.`;
}
function syncRepeatInputs(){
 const uniform=draft.turns.every(row=>row.every(dir=>dir===row[0]));
 if(!uniform){$('#forward-count').value='';$('#backward-count').value='';return;}
 const rows=draft.turns.map(row=>row[0]);
 if(rows.every(dir=>dir==='F')){$('#forward-count').value=draft.holes;$('#backward-count').value=0;return;}
 let f=0,b=0;while(rows[f]==='F')f++;while(rows[f+b]==='B')b++;
 $('#forward-count').value=Math.min(f,32);$('#backward-count').value=Math.min(b,32);
}
function loadPattern(id){
 const next=createPreset(id,{holes:draft.holes,cards:draft.cards,picks:draft.picks});
 change(()=>{draft=next;activeColor=draft.colors[0].hex;},`${getPattern(id).name} loaded. Undo restores your previous draft.`);
 $('#preset').value=id;previewSelectedPattern();syncRepeatInputs();
 return {name:draft.name,holes:draft.holes,cards:draft.cards,picks:draft.picks};
}
function renderPatternLibrary(){
 for(const group of ['groff','reference','basic']){
  const target=`#${group}-patterns`;
  $(target).innerHTML=PATTERNS.filter(pattern=>pattern.group===group).map(pattern=>{
   const sample=createPreset(pattern.id,{holes:draft.holes,cards:draft.cards,picks:draft.picks});
   const meta=group==='basic'?'Your card type & dimensions':`${sample.cards} tablets · ${sample.picks} ${sample.weft?'turns':'picks'}`;
   return `<button class="pattern-card" data-pattern="${pattern.id}" aria-label="Load ${escapeXML(pattern.name)}"><span class="pattern-sample">${fabricSVG(sample)}<span class="sample-label">${pattern.kind||'BASIC'}</span></span><span class="pattern-card-copy"><span class="pattern-card-name">${escapeXML(pattern.name)}</span><span class="pattern-card-info">${meta}${pattern.needsReview?' · <b class="source-badge">Source check</b>':''}</span><span class="pattern-card-description">${escapeXML(pattern.description)}</span><span class="pattern-card-action">Use this pattern →</span></span></button>`;
  }).join('');
 }
}
for(const [group,label] of [['reference','Vines, braids & geometric bands'],['groff','Groff · All 53 book patterns']]){
 const options=document.createElement('optgroup');options.label=label;
 for(const pattern of PATTERNS.filter(pattern=>pattern.group===group))options.append(new Option(pattern.name,pattern.id));
 $('#preset').append(options);
}
function filterPatternLibrary(){
 const query=$('#pattern-search').value.trim().toLowerCase(),numberQuery=query.match(/^(?:groff\s*|#)0?(\d{1,2})$/);let count=0;
 for(const card of document.querySelectorAll('[data-pattern]')){
  const pattern=getPattern(card.dataset.pattern);
  const number=pattern.group==='groff'?String(Number(pattern.id.slice(6))):'';
  const text=`${pattern.name} ${pattern.description} ${pattern.cards||''} tablets ${number}`.toLowerCase();
  card.hidden=numberQuery ? pattern.id!==`groff-${numberQuery[1].padStart(2,'0')}` : !!query&&!query.split(/\s+/).every(word=>text.includes(word));
  if(!card.hidden)count++;
 }
 for(const section of document.querySelectorAll('[data-pattern-group]'))section.hidden=![...section.querySelectorAll('[data-pattern]')].some(card=>!card.hidden);
 $('#pattern-results').textContent=`${count} ${count===1?'pattern':'patterns'}${query?' found':' in the library'}`;
}
$('#pattern-search').addEventListener('input',filterPatternLibrary);
$('#preset').addEventListener('change',previewSelectedPattern);
$('#apply-preset').addEventListener('click',()=>loadPattern($('#preset').value));
$('#browse-patterns').addEventListener('click',()=>{renderPatternLibrary();filterPatternLibrary();$('#pattern-dialog').showModal();});
$('#close-pattern-library').addEventListener('click',()=>$('#pattern-dialog').close());
$('#pattern-dialog').addEventListener('click',event=>{
 const card=event.target.closest('[data-pattern]');
 if(card){loadPattern(card.dataset.pattern);$('#pattern-dialog').close();return;}
 if(event.target===$('#pattern-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}
});
previewSelectedPattern();
let editingName=false;
$('#draft-name').addEventListener('focus',()=>editingName=false);
$('#draft-name').addEventListener('input',e=>{if(!editingName){checkpoint();editingName=true;}draft.name=e.target.value||'Untitled pattern';updateStateLabels();});
$('#draft-name').addEventListener('blur',e=>{draft.name=e.target.value.trim()||'Untitled pattern';e.target.value=draft.name;});
$('#undo').addEventListener('click',undo);$('#redo').addEventListener('click',redo);
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();e.shiftKey?redo():undo();}const cell=e.target.closest('.hole-cell,.turn-cell');if(!cell)return;const offset={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!offset)return;e.preventDefault();const isHole=cell.classList.contains('hole-cell'),key=isHole?'hole':'pick',c=Math.max(0,Math.min(draft.cards-1,Number(cell.dataset.card)+offset[0])),r=Math.max(0,Math.min((isHole?draft.holes:draft.picks)-1,Number(cell.dataset[key])+offset[1]));$(`.${isHole?'hole-cell':'turn-cell'}[data-card="${c}"][data-${key}="${r}"]`).focus();});
$('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());$('[data-close]').addEventListener('click',()=>$('#help-dialog').close());$('#help-dialog').addEventListener('click',e=>{if(e.target===$('#help-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
function download(content,type,extension){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(draft.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'weaving-draft')+extension;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
$('#save-button').addEventListener('click',()=>{download(JSON.stringify(draft,null,2),'application/json','.json');dirty=false;updateStateLabels();$('#status-message').textContent='Draft downloaded · Open the file here to keep editing.';notice('Editable draft downloaded.');});
$('#open-button').addEventListener('click',()=>$('#file-input').click());$('#file-input').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2_000_000)throw new Error('Choose a draft file smaller than 2 MB.');const next=validateDraft(JSON.parse(await file.text()));change(()=>{draft=next;activeColor=draft.colors[0].hex;},'Draft opened. Your previous draft is available with Undo.');syncRepeatInputs();}catch(error){notice(error instanceof SyntaxError?'This file is not valid JSON. Open a draft saved from Turn.':error.message);}finally{e.target.value='';}});
$('#export-svg').addEventListener('click',()=>{download(chartSVG(draft),'image/svg+xml','.svg');notice('Threading chart, turning plan, and woven preview exported.');});
function preparePrint(){let sheet=$('#print-sheet');if(!sheet){sheet=document.createElement('section');sheet.id='print-sheet';document.body.append(sheet);}sheet.innerHTML=Array.from({length:Math.ceil(draft.picks/28)},(_,i)=>`<div class="${i?'print-page':''}">${chartSVG(draft,{start:i*28,end:Math.min((i+1)*28,draft.picks),includeThreading:i===0,includePreview:i===0})}</div>`).join('');}
$('#print-button').addEventListener('click',()=>{preparePrint();window.print();});window.addEventListener('beforeprint',preparePrint);window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
render();
const context=document.modelContext;
if(context?.registerTool){const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
register({name:'list_weaving_patterns',title:'List weaving patterns',description:'List the built-in weaving patterns and the dimensions they load.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(){return PATTERNS.map(pattern=>({...pattern,holes:pattern.holes||draft.holes,cards:pattern.cards||draft.cards,picks:pattern.picks||draft.picks}));}});
register({name:'load_weaving_pattern',title:'Load weaving pattern',description:'Replace the draft with a built-in pattern, including its palette, threading and turns. Detailed bands load four-hole cards; basic patterns use current dimensions. Undo restores the previous draft.',inputSchema:{type:'object',properties:{id:{type:'string',enum:PATTERNS.map(pattern=>pattern.id)}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input.id!=='string'||Object.keys(input).some(key=>key!=='id'))throw new Error('Provide a pattern id.');return loadPattern(input.id);}});
register({name:'read_weaving_draft',title:'Read weaving draft',description:'Read the current tablet weaving draft, including hole colors, threading, and turns.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(){return JSON.parse(snapshot());}});
register({name:'configure_weaving_draft',title:'Configure weaving draft',description:'Resize the current draft while retaining existing colors and turns. Added holes use natural thread.',inputSchema:{type:'object',properties:{holes:{type:'integer',minimum:3,maximum:8},cards:{type:'integer',minimum:2,maximum:64},picks:{type:'integer',minimum:4,maximum:160}},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['holes','cards','picks'].includes(k)))throw new Error('Provide holes, cards, or picks.');const next=resizeDraft(draft,input);change(()=>draft=next);return {holes:draft.holes,cards:draft.cards,picks:draft.picks};}});
register({name:'apply_turning_repeat',title:'Apply turning repeat',description:'Replace all turning instructions with repeating forward then backward turns.',inputSchema:{type:'object',properties:{forward:{type:'integer',minimum:0,maximum:32},backward:{type:'integer',minimum:0,maximum:32}},required:['forward','backward'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||Object.keys(input).some(k=>!['forward','backward'].includes(k)))throw new Error('Provide forward and backward turn counts.');applyRepeat(input.forward,input.backward);$('#forward-count').value=input.forward;$('#backward-count').value=input.backward;return {picks:draft.picks,forward:input.forward,backward:input.backward};}});
}
