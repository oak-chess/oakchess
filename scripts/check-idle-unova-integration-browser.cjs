const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const prefix=process.env.UNOVA_TEST_PREFIX||'oakchess-unova-integration:',fixture={gold:300000,wins:500,balls:100,items:[],area:32,trainerLevel:400,last:Date.now(),world:{location:'field',badges:Array.from({length:32},(_,i)=>i),regionWins:Array.from({length:32},(_,i)=>i+1),unlocks:{},tasks:[],eggs:[]},team:[{id:'unova-snivy',name:'Snivy',star:1,level:386,xp:0,condition:1,potency:3,pos:{z:'b',r:5,c:3}}],collection:[],tutorial:{contentVersion:3,complete:true,introduced:true}};
const entry=process.env.UNOVA_TEST_URL||'file:///'+path.resolve('prototypes/unova-review/real.html').replaceAll('\\','/');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(({fixture,prefix})=>{localStorage.setItem('oakchess-idle:unova-test-sentinel','preserved');const originalRead=Storage.prototype.getItem;window.unovaReadOriginalStorage=key=>originalRead.call(localStorage,key);localStorage.setItem(prefix+'official-start-v1','1');if(!localStorage.getItem(prefix+'journey-native-v2'))localStorage.setItem(prefix+'journey-native-v2',JSON.stringify({...fixture,last:Date.now()}));for(const name of ['Systems','Gacha','Events','Life','Hunts','Party','FieldNotes']){let factory;Object.defineProperty(window,'createIdle'+name,{get(){return ctx=>{window[name+'Ctx']=ctx;return window['test'+name]=factory(ctx)}},set(fn){factory=fn}})}},{fixture,prefix});
 await p.goto(entry);await p.waitForFunction(()=>document.body.classList.contains('idle-native-mode')&&window.testSystems);await p.waitForTimeout(1500);
 assert.deepEqual(errors,[]);
 const base=await p.evaluate(()=>({roster:new Set(LINES.flatMap(l=>l.ids)).size,regions:IDLE_WORLD_DATA.regions.length,continents:IDLE_CONTINENTS.all.map(c=>c.name),area:SystemsCtx.state.area,wins:SystemsCtx.state.world.regionWins.slice(0,32),sentinel:Storage.prototype.getItem.call(localStorage,'unova-test-sentinel')}));
 assert.equal(base.roster,649);assert.equal(base.regions,40);assert.deepEqual(base.continents,['Kanto','Johto','Hoenn','Sinnoh','Unova']);assert.equal(base.area,32);assert.deepEqual(base.wins,fixture.world.regionWins);
 // Original roster line indices must stay byte-for-byte stable.
 const oldIds=fs.existsSync('scripts/fixtures/idle-pre-unova-lines.json')?JSON.parse(fs.readFileSync('scripts/fixtures/idle-pre-unova-lines.json','utf8')):[...fs.readFileSync('modes/idle/index.html','utf8').matchAll(/^ln\(\d+,(\[[^\n]+?\]),/gm)].map(m=>JSON.parse(m[1]));
 assert.deepEqual(await p.evaluate(n=>LINES.slice(0,n).map(l=>l.ids),oldIds.length),oldIds);
 const purchase=await p.evaluate(()=>{const g=testGacha,before=SystemsCtx.state.gold,result=g.purchase('unova',10);return {ok:result.ok,reason:result.reason,cost:before-SystemsCtx.state.gold,count:result.eggs?.length,pool:g.pools.unova.entries.map(e=>({id:e.id,legendary:e.data.legendary,generation:e.data.generation}))}});
 assert(purchase.ok,purchase.reason);assert.equal(purchase.cost,50000);assert.equal(purchase.count,10);assert(purchase.pool.length>50);assert(purchase.pool.every(e=>!e.legendary&&e.generation===5));
 const hatched=await p.evaluate(()=>{const s=SystemsCtx.state,egg=s.world.eggs.find(e=>e.gachaRegion==='unova');egg.progress=egg.need;const result=testLife.hatch(egg);return {ok:result.ok,level:result.member?.level,region:result.member?.gachaRegion,source:result.member?.originSource}});
 assert.deepEqual(hatched,{ok:true,level:1,region:'unova',source:'gacha'});
 const rules=await p.evaluate(()=>{const s=SystemsCtx.state;s.world.location='center';s.world.stones={...s.world.stones,fire:1,water:1,leaf:1,sun:1};function mon(name){return testSystems.normalize({id:'evo-'+name,name,star:1,level:100,condition:1,friendship:100,potency:4,ivs:{hp:31,atk:20,def:15,spa:19,spd:18,spe:17},nature:'Hardy',items:[],locked:true,favorite:true,shiny:true})}s.collection=s.collection.filter(m=>m.name!=='Shelmet'&&m.name!=='Karrablast');const kar=mon('Karrablast');s.collection.push(kar);const absent=testSystems.evolveRule(kar).partyReady;const shell=mon('Shelmet');s.collection.push(shell);const ready=testSystems.evolveRule(kar),before=JSON.stringify({id:kar.id,ivs:kar.ivs,potency:kar.potency,shiny:kar.shiny,locked:kar.locked,favorite:kar.favorite}),ok=testSystems.evolve(kar),after=JSON.stringify({id:kar.id,ivs:kar.ivs,potency:kar.potency,shiny:kar.shiny,locked:kar.locked,favorite:kar.favorite});return {absent,ready:ready.partyReady,target:ready.targetName,ok,before,after,partnerRetained:s.collection.some(m=>m.id===shell.id),darumaka:testSystems.evolveRule(mon('Darumaka')).targetName}});
 assert.equal(rules.absent,false);assert.equal(rules.ready,true);assert.equal(rules.target,'Escavalier');assert(rules.ok);assert.equal(rules.before,rules.after);assert(rules.partnerRetained);assert.equal(rules.darumaka,'Darmanitan');
 const goals=await p.evaluate(()=>testLife.goals().filter(g=>g.region==='Unova'));assert(goals.length>0);
 const events=await p.evaluate(()=>EventsCtx.entries().filter(e=>e.region==='Unova'));assert.equal(events.length,13);assert(events.every(e=>e.level===300&&e.status==='locked'));assert(events.every(e=>!e.requirement.includes('desde o início')));
 await p.evaluate(()=>{const s=SystemsCtx.state;s.world.badges=Array.from({length:40},(_,i)=>i);Object.assign(s.world.unlocks,{'unova-swords':true,'unova-melody':true,'unova-plasma':true});s.world.location='field';testSystems.setRoute(32);testSystems.open('journey')});
 assert(await p.locator('.iw-continents').getByRole('button',{name:/Unova/}).isVisible());
 assert((await p.evaluate(()=>EventsCtx.entries().filter(e=>e.region==='Unova'))).every(e=>e.status==='available'));
 await p.evaluate(()=>testSystems.close());
 // Verify genuine variants and the native exact-species fallback on missing PMD cycles.
 const sprites=await p.evaluate(async()=>{const ready=await PMD.get(495,false),missing=await PMD.get(514,false);return {ready:ready?.Walk?.rows,missing:!!missing,portrait:new Image().src='assets/pokeapi/sprites/pokemon/other/showdown/514.gif'}});assert.equal(sprites.ready,8);assert.equal(sprites.missing,false);
 for(let area=32;area<40;area++){
  await p.evaluate(area=>{const s=SystemsCtx.state;s.world.challenge=null;for(const m of s.team)m.condition=1;testSystems.setRoute(area);const r=IDLE_WORLD_DATA.regions[area];testSystems.startLegendary({kind:'boss',id:'unova-test-gym-'+area,area,names:r.foes,level:r.level,scale:(1+(r.level-1)*.12)*1.3,star:1,label:r.leader});G.paused=true},area);
  await p.waitForFunction(()=>G.phase==='combat');await p.waitForFunction(area=>IDLE_UNOVA_ART.loaded(IDLE_UNOVA_ARENAS.find(e=>e.area===area).key),area);
  assert.equal(await p.evaluate(()=>ARENA_T.id.startsWith('unova-')),true);assert((await p.evaluate(()=>B.units.filter(u=>u.side===1).length))>=3);
  await p.evaluate(()=>{B.on=false;B.over=true;B.done=true;B.winner=0;demoNext()});await p.waitForTimeout(150);
 }
 for(const name of ['Victini','Cobalion','Terrakion','Virizion','Tornadus','Thundurus','Landorus','Reshiram','Zekrom','Kyurem','Keldeo','Meloetta','Genesect']){
  await p.evaluate(name=>{for(const m of SystemsCtx.state.team)m.condition=1;testSystems.startLegendary({kind:'legendary',id:'unova-test-'+name,label:name,names:[name],level:300,scale:(1+299*.12)*2.5,star:1});G.paused=true},name);
  await p.waitForFunction(()=>G.phase==='combat');await p.waitForFunction(name=>IDLE_UNOVA_ART.loaded(name.toLowerCase()),name);
  const unit=await p.evaluate(()=>{const u=B.units.find(u=>u.side===1);return {id:u.id,level:u._idleLevel,moves:u.moves.length,gem:ARENA_SPECIAL_CRYSTALS.category(u.id)}});
  assert.equal(unit.level,300);assert.equal(unit.moves,4);assert(unit.gem);
  await p.evaluate(()=>{B.on=false;B.over=true;B.done=true;B.winner=0;demoNext()});await p.waitForTimeout(150);
 }
 await p.waitForTimeout(1000);await p.screenshot({path:'tmp/unova-integration-tested.png'});
 const old=await p.evaluate(()=>({area:SystemsCtx.state.area,badges:SystemsCtx.state.world.badges,eggs:SystemsCtx.state.world.eggs.length}));
 await p.reload();await p.waitForFunction(()=>window.testSystems&&document.body.classList.contains('idle-native-mode'));await p.waitForTimeout(1000);
 assert.deepEqual(await p.evaluate(()=>({area:SystemsCtx.state.area,badges:SystemsCtx.state.world.badges,eggs:SystemsCtx.state.world.eggs.length})),old);
 assert.equal(await p.evaluate(()=>unovaReadOriginalStorage('oakchess-idle:unova-test-sentinel')),'preserved');
 assert.deepEqual(errors,[]);console.log('Passed: tested Idle entry, integrated Unova, 649 species/40 regions, old roster/save data, Unova gacha and level-one hatch, paired-trade evolution preserving partner/genes, collection goals, 13 gated events, native sprite fallback, 8 gyms/13 legendary combats and all 21 illustrated scenarios, reload.');
}finally{await b.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
