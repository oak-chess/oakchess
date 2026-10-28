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
    if(!api.projectile(g,{o:{move:mv},x:160,y:130,age:.15,size:1}))throw Error('Unhandled projectile '+key);
    if(visible()!==(IDLE_APPROVED_EFFECTS[key].mode==='projectile'))throw Error('Wrong projectile presentation '+key);
    api.clear();g.clearRect(0,0,400,260);api.beam(mv,80,140,300,120,20);api.update(.1);api.draw(g);
    if(!visible())throw Error('Invisible beam '+key);
    api.update(10);if(api.active)throw Error('Effect did not expire '+key);
    checks.push(key);
   }
 
  // A beam must not tile impact sheets. Surf is a single travelling wave.
  const drawn=[],draw=g.drawImage.bind(g);g.drawImage=(img,...args)=>{drawn.push({src:img.src,args});draw(img,...args)};
  for(const key of ['THUNDERBOLT','ICE_BEAM','PSYCHIC','FLAMETHROWER','HYDRO_PUMP','SURF']){
   api.clear();drawn.length=0;const mv={emerald:key,k:key==='SURF'?'burst':'beam'};
   api.beam(mv,80,140,300,140,20);api.hit(mv,300,140,1);api.update(.1);api.draw(g);
   if(drawn.length!==1)throw Error('Duplicated beam/impact '+key+': '+drawn.length);
   if(key==='SURF'){
    const first=drawn[0].args[4];drawn.length=0;api.update(.2);api.draw(g);
    if(drawn.length!==1||drawn[0].args[4]<=first)throw Error('Surf wave did not travel');
   }
  }
  api.clear();return checks;
  });
  assert.equal(result.length,24);assert.deepEqual(errors,[]);
  console.log('Passed: all 24 local sheets, actual Idle load, impacts/self effects, projectile-only flight sprites, directional beams, expiry and clear.');
 }finally{await browser?.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
