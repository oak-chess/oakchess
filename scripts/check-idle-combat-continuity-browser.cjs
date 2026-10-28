const path=require('path'),assert=require('node:assert/strict');const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fixture={gold:10000,wins:0,items:[],balls:0,area:0,last:Date.now(),trainerLevel:75,team:[{id:'carry-partner',name:'Squirtle',star:3,level:75,xp:0,condition:1,potency:5,nature:'Hardy',ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31},items:[],favorite:true,locked:true,pos:{z:'b',r:5,c:3}}],collection:[],tutorial:{complete:true,introduced:true},world:{location:'field',badges:[],regionWins:Array(32).fill(0),tasks:[],eggs:[]}};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{const p=await b.newPage({viewport:{width:1400,height:950}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(s=>{localStorage.setItem('oakchess-idle:official-start-v1','1');if(!localStorage.getItem('oakchess-idle:journey-native-v2'))localStorage.setItem('oakchess-idle:journey-native-v2',JSON.stringify({...s,last:Date.now()}));let f;Object.defineProperty(window,'createIdleSystems',{get(){return ctx=>{window.carryCtx=ctx;return window.carrySystems=f(ctx)}},set(v){f=v}})},fixture);
await p.goto('file:///'+path.resolve('modes/idle/index.html').replaceAll('\\','/'));await p.waitForFunction(()=>window.carrySystems);
const start=async()=>{await p.locator('#combatbtn').click();await p.waitForFunction(()=>G.phase==='combat');await p.evaluate(()=>{G.paused=true})};
const finish=async()=>{await p.evaluate(()=>{B.on=false;B.over=true;B.done=true;B.winner=0;demoNext()});await p.waitForFunction(()=>G.phase==='plan');await p.evaluate(()=>carryCtx.pause())};
const sequence=[];
for(let i=0;i<5;i++){
 await start();const result=await p.evaluate(i=>{const u=B.units.find(u=>u.side===0);if(i>0&&u.mana!==23)throw Error('Energy was reset: '+u.mana);const expected=u.moves[i%4].id;if(u.moves[u.mi%u.moves.length].id!==expected)throw Error('Wrong next move');u.target=B.units.find(u=>u.side===1&&u.alive);u.mana=u.maxMana;const name=u.moves[u.mi%u.moves.length].n,before=u.mi;cast(u);if(u.mi!==before+1)throw Error('Native cast did not advance');u.mana=23;return name},i);sequence.push(result);await finish();
 const saved=await p.evaluate(()=>carryCtx.state.team[0].combatCarry);assert.equal(saved.mana,23);assert.equal(saved.owner,'carry-partner');
 if(i===1){
  const before=JSON.stringify(saved);await p.reload();await p.waitForFunction(()=>window.carrySystems);assert.equal(JSON.stringify(await p.evaluate(()=>carryCtx.state.team[0].combatCarry)),before);
  await p.evaluate(()=>carrySystems.startLegendary({kind:'legendary',id:'carry-training-test',label:'Treino',names:['Pidgeot'],level:75,scale:1+74*.12,training:true}));await p.waitForFunction(()=>G.phase==='combat');
  assert.equal(await p.evaluate(()=>B.units.find(u=>u.side===0).mi),0);await p.evaluate(()=>{G.paused=true;const u=B.units.find(u=>u.side===0);u.mi=3;u.mana=u.maxMana*2});await finish();assert.equal(JSON.stringify(await p.evaluate(()=>carryCtx.state.team[0].combatCarry)),before);
 }
}
assert.deepEqual(sequence,['Hidrobomba','Canhão de Flash','Jato de Água','Surf','Hidrobomba']);
// A short, normal encounter must retain energy even without casting.
await start();const natural=await p.evaluate(()=>{const u=B.units.find(u=>u.side===0);const before=u.mana;u.mana=31;return {before,next:u.moves[u.mi%u.moves.length].id}});assert.equal(natural.before,23);await finish();assert.equal(await p.evaluate(()=>carryCtx.state.team[0].combatCarry.mana),31);
await start();await p.evaluate(()=>{const u=B.units.find(u=>u.side===0);u.mi=2;u.mana=42});await p.reload();await p.waitForFunction(()=>window.carrySystems);assert.equal(await p.evaluate(()=>carryCtx.state.team[0].combatCarry.mana),42);await start();assert.equal(await p.evaluate(()=>B.units.find(u=>u.side===0).mi),2);assert.equal(await p.evaluate(()=>B.units.find(u=>u.side===0).mana),42);await p.evaluate(()=>carryCtx.pause());
assert.equal(await p.evaluate(()=>movesFor(LINES.find(l=>l.names[0]==='Squirtle'),1).length),2);assert.equal(await p.evaluate(()=>carryCtx.state.team[0].favorite),true);assert.equal(await p.evaluate(()=>carryCtx.state.team[0].locked),true);assert.deepEqual(errors,[]);
console.log(JSON.stringify({passed:true,sequence,energyAcrossEncounters:true,reloadPreserved:true,challengeIsolated:true,ordinaryMoveAvailabilityPreserved:true}));
}finally{await b.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
