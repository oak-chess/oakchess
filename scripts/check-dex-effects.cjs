/* Headless execution check with Canvas stubs. Not a browser/visual test. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');let draws=0;const missing=new Set();
const context=()=>new Proxy({drawImage(){draws++},createRadialGradient(){return {addColorStop(){}}},createLinearGradient(){return {addColorStop(){}}}},{get:(target,key)=>key in target?target[key]:(()=>{})});
class ImageStub{
 constructor(){this.complete=false;this.naturalWidth=0;this.naturalHeight=0;this.listeners={}}
 set src(url){this.url=url;const file=path.join(root,url);try{const png=fs.readFileSync(file);this.naturalWidth=png.readUInt32BE(16);this.naturalHeight=png.readUInt32BE(20);this.complete=true;queueMicrotask(()=>{this.onload?.();this.listeners.load?.()})}catch{this.complete=true;missing.add(url);queueMicrotask(()=>{this.onerror?.();this.listeners.error?.()})}}
 get src(){return this.url}addEventListener(name,fn){this.listeners[name]=fn}
}
const box={window:{},Image:ImageStub,document:{createElement(){return {width:0,height:0,getContext:context}}},console,Math,performance,CFG:{fxLevel:'normal',reduceFx:false},PAL:{normal:['#fff','#ccc','#aaa'],psychic:['#fff','#caf','#a6d']}};
vm.createContext(box);
for(const file of ['assets/move-fx/emerald-catalog.js','assets/move-fx/nine-catalog.js','assets/move-fx/nine-moves.js','assets/dex/moves.js','assets/dex/catalog.js','assets/dex/learnsets.js','assets/dex/pmd-local.js','assets/emerald-moves.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),box,{filename:file});
(async()=>{
 await new Promise(resolve=>setImmediate(resolve));const results=[];
 for(const move of box.window.DEX_MOVE_CATALOG.filter(m=>m.status==='adapted')){
  const renderer=box.window.CREATE_EMERALD_RENDERER();let emitted=0;draws=0;const errors=[];
  try{await renderer.ready();const base=move.expansionSequence||box.window.EMERALD_CATALOG.moves[move.localKey]||{events:[]},events=base.events||[];
   for(const event of events){if(renderer.availableTemplate(event.sprite))emitted+=+!!renderer.emitTemplate(event.sprite,320,115,1.8,0,0)}
   if(move.animationRenderer==='nine')emitted+=+!!renderer.preview({n:move.name,emerald:move.key,t:move.type,k:move.targetId===7?'barrier':'bolt'},90,115,320,115);else if(!events.length)emitted+=+!!renderer.hit({n:move.localKey,emerald:move.localKey,t:move.type,k:'burst'},320,115,1.6);
   for(let i=0;i<90;i++){renderer.draw(context());renderer.update(1/60)}
   if(move.localKey||move.animationRenderer==='nine'){const mv={n:move.key,emerald:move.key,t:move.type,k:'burst'};for(const method of ['hit','start','beam']){renderer.clear();try{if(method==='beam')renderer.beam(mv,90,115,320,115,20);else renderer[method](mv,320,115,1.5);for(let frame=0;frame<40;frame++){renderer.draw(context());renderer.update(1/60)}}catch(error){errors.push(method+': '+error.stack)}}}
  }catch(error){errors.push(error.stack)}
  results.push({id:move.id,name:move.name,emitted,canvasDrawCalls:draws,errors});
 }
 const actorErrors=[];for(const [key,entry]of Object.entries(box.window.DEX_PMD_LOCAL)){for(const info of [entry,entry.attack].filter(Boolean)){if(!fs.existsSync(path.join(root,info.sheet)))actorErrors.push(key+': missing '+info.sheet);if(!info.w||!info.h||!info.durations?.length)actorErrors.push(key+': invalid frame metadata')}}
 const summary={tested:results.length,exceptions:results.filter(r=>r.errors.length).length,noEmittedEffect:results.filter(r=>!r.emitted).length,missingSheets:[...missing],actorMetadataErrors:actorErrors.length,visualBrowserTest:false};
 fs.mkdirSync(path.join(root,'output/effect-check'),{recursive:true});fs.writeFileSync(path.join(root,'output/effect-check/results.json'),JSON.stringify({summary,actorErrors,results},null,2));console.log(JSON.stringify(summary));console.log(JSON.stringify(results.filter(r=>r.errors.length||!r.emitted).map(r=>({name:r.name,error:r.errors[0]?.split('\n')[0],emitted:r.emitted})).slice(0,20)));
})();
