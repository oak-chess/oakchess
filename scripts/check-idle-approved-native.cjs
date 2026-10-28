const path=require('path'),assert=require('node:assert/strict');const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fixture={gold:10000,wins:0,items:[],balls:0,area:0,last:Date.now(),trainerLevel:75,team:[{id:'carry-partner',name:'Squirtle',star:3,level:75,xp:0,condition:1,potency:5,nature:'Hardy',ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31},items:[],favorite:true,locked:true,pos:{z:'b',r:5,c:3}}],collection:[],tutorial:{complete:true,introduced:true},world:{location:'field',badges:[],regionWins:Array(32).fill(0),tasks:[],eggs:[]}};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{const p=await b.newPage({viewport:{width:1400,height:950}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(s=>{localStorage.setItem('oakchess-idle:official-start-v1','1');if(!localStorage.getItem('oakchess-idle:journey-native-v2'))localStorage.setItem('oakchess-idle:journey-native-v2',JSON.stringify({...s,last:Date.now()}));let f;Object.defineProperty(window,'createIdleSystems',{get(){return ctx=>{window.carryCtx=ctx;return window.carrySystems=f(ctx)}},set(v){f=v}})},fixture);
await p.goto('file:///'+path.resolve('modes/idle/index.html').replaceAll('\\','/'));await p.waitForFunction(()=>window.carrySystems);

await p.locator('#combatbtn').click();await p.waitForFunction(()=>G.phase==='combat');await p.evaluate(()=>{G.paused=true});
const result=await p.evaluate(async()=>{
 await EMERALD_MOVES.warmMoves(IDLE_MOVE_EFFECTS.keys);
 const u=B.units.find(u=>u.side===0),t=B.units.find(u=>u.side===1);u.target=t;u.L={...u.L,passive:{id:'test',n:'Test'}};
 const canvas=document.createElement('canvas');canvas.width=1400;canvas.height=950;const g=canvas.getContext('2d');
 const draw=g.drawImage.bind(g),draws=[];g.drawImage=(img,...args)=>{draws.push(img.src);return draw(img,...args)};
 const modes={};Object.values(PLAYABLE_MOVES).flat().forEach(m=>{modes[m.emerald]??=m});
 const checks=[];const legacy={};for(const key of ['aoe','fx','glow','ring','charge','healFx','impact','buffFx','shieldFx','zone']){legacy[key]=FX[key];FX[key]=()=>{throw Error('Legacy overlay '+key)}}
 try{for(const key of IDLE_MOVE_EFFECTS.keys){
  const spec=IDLE_APPROVED_EFFECTS[key],mv=modes[key]||{emerald:key,n:key,t:'water',k:spec.mode==='self'?'heal':spec.mode==='area'?'burst':'bolt',p:1};
  B.ev=[];EMERALD_MOVES.clear();draws.length=0;u.moves=[mv];u.mi=0;u.skillToken=null;u.castCd=0;u.lock=0;u.atkCd=0;u.mana=u.maxMana*2;u.alive=true;t.alive=true;t.hp=t.maxHp=1e9;
  // Keep native cast selection, mana debit, schedule and damage; bypass only the readiness gate between samples.
  const ready=SKILL_RHYTHM.ready;SKILL_RHYTHM.ready=()=>true;try{cast(u)}finally{SKILL_RHYTHM.ready=ready}
  for(let i=0;i<8&&B.ev.length;i++){const ev=B.ev.splice(0);for(const e of ev)e.fn()}
  EMERALD_MOVES.update(.1);EMERALD_MOVES.draw(g);
  // Projectile callbacks run at arrival during gameplay. Exercise the actual native impact adapter here too.
  if(!draws.length&&spec.mode!=='self')EMERALD_MOVES.hit(mv,t.x,cyOf(t),1,{x:u.x,y:cyOf(u)});
  EMERALD_MOVES.update(.05);EMERALD_MOVES.draw(g);
  if(!draws.some(src=>src.endsWith('/'+spec.id+'.png')))throw Error('No approved sheet in native cast '+key);
  checks.push(key);
 }}finally{for(const key in legacy)FX[key]=legacy[key]}
 return checks;
});assert.equal(result.length,24);assert.deepEqual(errors,[]);console.log('Passed: 24 native casts use approved sheets without legacy area/charge/impact overlays.');
}finally{await b.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
