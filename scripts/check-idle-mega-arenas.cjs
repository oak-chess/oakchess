const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fixture={gold:50000,wins:5,balls:100,items:[],area:0,trainerLevel:350,last:Date.now(),world:{location:'field',badges:[0],regionWins:Array(24).fill(0),tasks:[],eggs:[]},team:[{id:'mega-char',name:'Charmander',star:3,level:350,xp:0,condition:1,shiny:true,potency:5,ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31},nature:'Hardy',items:[],pos:{z:'b',r:5,c:3}}],collection:[],tutorial:{complete:true,introduced:true}};
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>{if(r.url().includes('/0001/')||r.url().includes('/mega/'))missing.push(r.url())});await p.addInitScript(s=>{localStorage.setItem('oakchess-idle:official-start-v1','1');if(!localStorage.getItem('oakchess-idle:journey-native-v2'))localStorage.setItem('oakchess-idle:journey-native-v2',JSON.stringify({...s,last:Date.now()}));for(const name of ['Mega','Systems']){let factory;Object.defineProperty(window,'createIdle'+name,{get(){return ctx=>{if(name==='Mega')window.megaCtx=ctx;return window['test'+name]=factory(ctx)}},set(fn){factory=fn}})}},fixture);await p.goto('file:///'+path.resolve('modes/idle/index.html').replaceAll('\\','/'));await p.waitForTimeout(3000);assert.deepEqual(errors,[]);

await p.evaluate(()=>{testMega.intro();});
const initial=await p.evaluate(()=>({theme:ARENA_T?.id??null,area:megaCtx.state.area}));
for(const key of ['charizard-x','gengar','mawile']){
 await p.evaluate(key=>{megaCtx.state.team[0].condition=1;testSystems.startMega(key,true);G.paused=true},key);
 await p.waitForFunction(key=>G.phase==='combat'&&ARENA_T.id==='mega-'+key,key);
 await p.waitForFunction(key=>IDLE_MEGA_ARENA_ART.loaded(key),key);
 assert.equal(await p.locator('#world').getAttribute('data-arena'),'mega-'+key);
 assert(await p.evaluate(()=>IDLE_ARENA_SEAL.active));
 await p.waitForTimeout(1600);await p.screenshot({path:'tmp/mega-arena-'+key+'.png'});
 await p.evaluate(()=>{B.on=false;B.over=true;B.done=true;B.winner=0;demoNext()});await p.waitForTimeout(400);
 assert.equal(await p.evaluate(()=>ARENA_T?.id??null),initial.theme);
 assert.equal(await p.evaluate(()=>megaCtx.state.area),initial.area);
}
assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('Passed: three distinct Mega backgrounds loaded, native combat and animated seals, hunt restored after each battle, no browser errors or missing resources.');}finally{await browser.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
