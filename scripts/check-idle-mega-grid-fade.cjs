
const path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('modes/idle/index.html').replaceAll('\\','/'));
 await page.waitForFunction(()=>window.IDLE_MEGA_ARENAS?.length===31);
 const results=await page.evaluate(()=>{
  G.paused=true;const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1000;const g=canvas.getContext('2d');
  const original={hex:aHexT,wall:aWallT,emblem:aEmblemT,well:arWell},saved=LEGACY_HEX_SOFTNESS;const results=[];
  try{for(const arena of IDLE_MEGA_ARENAS){const T=ARENA_THEMES[arena.theme],samples=[];
   for(const softness of [0,.5,1]){const hex=[],solid=[];LEGACY_HEX_SOFTNESS=softness;
    aHexT=(ctx,...args)=>{hex.push(ctx.globalAlpha);return original.hex(ctx,...args)};
    aWallT=(ctx,...args)=>{solid.push(ctx.globalAlpha);return original.wall(ctx,...args)};
    aEmblemT=(ctx,...args)=>{solid.push(ctx.globalAlpha);return original.emblem(ctx,...args)};
    arWell=(ctx,...args)=>{solid.push(ctx.globalAlpha);return original.well(ctx,...args)};
    paintThemed(g,'arena',T);if(hex.length!==ROWS*COLS)throw Error('Missing grid '+arena.key);
    if(hex.some(a=>Math.abs(a-(1-softness*.88))>.0001))throw Error('Wrong fade '+arena.key);
    if(solid.length!==3||solid.some(a=>a!==1)||g.globalAlpha!==1)throw Error('Transparent floor or leaked alpha '+arena.key);
    samples.push(hex[0]);
   }results.push({key:arena.key,alpha:samples});
  }}finally{aHexT=original.hex;aWallT=original.wall;aEmblemT=original.emblem;arWell=original.well;LEGACY_HEX_SOFTNESS=saved}
  return results;
 });assert.equal(results.length,31);assert.deepEqual(errors,[]);console.log('Passed: all 31 Mega grids fade from 1 to 0.12, with opaque decks, emblems and benches and no alpha leakage.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
