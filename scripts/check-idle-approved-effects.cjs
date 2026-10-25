/* Isolated Chrome only; no user profile or saved game is accessed. */
const assert=require('node:assert/strict'),path=require('node:path');
let chromium;try{({chromium}=require('playwright'))}catch{({chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
(async()=>{
 let browser;try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file:///'+path.resolve('modes/idle/index.html').replaceAll('\\','/'));
  await page.waitForFunction(()=>!!window.IDLE_MOVE_EFFECTS);
  const result=await page.evaluate(async()=>{
   const api=EMERALD_MOVES,keys=IDLE_MOVE_EFFECTS.keys;
   await api.warmMoves(keys);
   const canvas=document.createElement('canvas');canvas.width=400;canvas.height=260;const g=canvas.getContext('2d');
   const visible=()=>g.getImageData(0,0,400,260).data.some((v,i)=>i%4===3&&v>0);
   const checks=[];
   for(const key of keys){
    if(!await IDLE_MOVE_EFFECTS.ready(key))throw Error('Missing sheet '+key);
    const mv={emerald:key,n:key,k:'bolt',t:'normal'},self=IDLE_APPROVED_EFFECTS[key].mode==='self';
    api.clear();g.clearRect(0,0,400,260);
    if(self)api.start(mv,100,130);else api.hit(mv,280,130,1);
    api.update(.12);api.draw(g);if(!visible())throw Error('Invisible impact '+key);
    api.clear();g.clearRect(0,0,400,260);
    if(!api.projectile(g,{o:{move:mv},x:160,y:130,age:.15,size:1})||!visible())throw Error('Invisible projectile '+key);
    api.clear();g.clearRect(0,0,400,260);api.beam(mv,80,140,300,120,20);api.update(.1);api.draw(g);
    if(!visible())throw Error('Invisible beam '+key);
    api.update(10);if(api.active)throw Error('Effect did not expire '+key);
    checks.push(key);
   }
   api.clear();return checks;
  });
  assert.equal(result.length,24);assert.deepEqual(errors,[]);
  console.log('Passed: all 24 local sheets, actual Idle load, impacts/self effects, real-position projectiles, directional beams, expiry and clear.');
 }finally{await browser?.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
