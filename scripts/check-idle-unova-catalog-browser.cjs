/* Regression: animated sprites alone do not guarantee that catalog PNGs exist. */
const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),assert=require('node:assert/strict'),path=require('path');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const p=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{let factory;Object.defineProperty(window,'createIdleGachaUI',{get(){return ctx=>{window.unovaGachaUI=factory(ctx);return window.unovaGachaUI}},set(fn){factory=fn}})});
 await p.goto('file:///'+path.resolve('prototypes/unova-review/real.html').replaceAll('\\','/'));
 await p.waitForFunction(()=>window.unovaGachaUI);await p.waitForTimeout(800);
 const skip=p.getByRole('button',{name:/Pular por enquanto/});if(await skip.isVisible())await skip.click();
 const missing=await p.evaluate(async()=>{const files=Array.from({length:649},(_,i)=>'assets/pokeapi/sprites/pokemon/'+(i+1)+'.png');for(let id=494;id<=649;id++)for(const dir of ['shiny/','back/','back/shiny/'])files.push('assets/pokeapi/sprites/pokemon/'+dir+id+'.png');return (await Promise.all(files.map(async src=>{const image=new Image();image.src=src;try{await image.decode();return image.naturalWidth>0?null:src}catch{return src}}))).filter(Boolean)});
 assert.deepEqual(missing,[],'Broken catalog/static variants');
 await p.evaluate(()=>unovaGachaUI.open());await p.locator('#idle-gachapon [data-region=unova]').click();await p.locator('.ig-catalog-open').click();
 const input=p.locator('.ig-catalog-dialog input'),verified=[];
 for(const name of ['Blitzle','Throh','Tirtouga','Frillish','Shelmet','Bouffalant']){
  await input.fill(name);await p.waitForFunction(()=>{const images=[...document.querySelectorAll('.ig-catalog-grid img')];return images.length===1&&images.every(i=>i.complete&&i.naturalWidth>0)});
  assert.equal(await p.locator('.ig-catalog-grid img').getAttribute('alt'),name);verified.push(name);
 }
 await input.fill('');await p.waitForFunction(()=>[...document.querySelectorAll('.ig-catalog-grid img')].every(i=>i.complete&&i.naturalWidth>0));
 await p.screenshot({path:'tmp/unova-catalog-fixed.png'});assert.deepEqual(errors,[]);
 console.log(JSON.stringify({catalogPortraits:649,additionalUnovaStaticVariants:468,broken:missing.length,catalogVerified:verified,errors}));
}finally{await browser.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
