/* Fresh isolated Chrome context; never uses the player's profile or saves. */
const assert=require('node:assert/strict'),path=require('node:path');
let chromium;try{({chromium}=require('playwright'))}catch{({chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
(async()=>{let browser;try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));await page.waitForFunction(()=>!!window.OAK_ARENA_ART&&!!window.TOWER);
 await page.evaluate(()=>{clearTimeout(TITLE_TM);clearInterval(LAB.tm);LAB.st='done';DEMO.on=false;B.on=false;newGame();CFG.timer=false;G.hintOn=false;G.ri=SCHED.findIndex(r=>r.kind==='boss'&&r.gym===2);const L=LINES.find(l=>l.ids.includes(25)),u=newUnit(L.i,L.ids.indexOf(25)+1);place(u,{z:'b',r:6,c:3});attachEl(u,false);startPlan()});
 await page.waitForFunction(()=>ARENA_T?.id==='electric');
 async function art(id){await page.waitForFunction(id=>{const c=document.createElement('canvas');return OAK_ARENA_ART.paint(c.getContext('2d'),arGeo(),ARENA_THEMES.find(t=>t.id===id))},id)}
 await art('electric');
 await page.evaluate(()=>{G.eventModal=false;beginBattle()});await page.waitForTimeout(350);
 assert(await page.evaluate(()=>B.on&&B.units.some(u=>u.side===0)&&B.units.some(u=>u.side===1)));
 await page.screenshot({path:'tmp/campaign-illustrated-arena.png'});
 await page.evaluate(()=>{B.on=false;TOWER.menu()});
 await page.locator('[data-entry-sector="1"]').click();await page.locator('[data-entry-explore]').click();
 await page.getByRole('button',{name:'Começar prévia',exact:true}).click();await page.locator('[data-choice="1"]').click();
 await page.waitForFunction(()=>G.tower?.floor===5&&ARENA_T?.id==='psychic');await art('psychic');
 await page.evaluate(()=>{G.eventModal=false;TOWER.begin()});await page.waitForTimeout(350);
 assert(await page.evaluate(()=>G.tower&&B.on&&B.units.some(u=>u.side===0)&&B.units.some(u=>u.side===1)));
 await page.screenshot({path:'tmp/tower-illustrated-arena.png'});await page.evaluate(()=>{B.on=false});
 const count=await page.evaluate(async()=>{for(const id of OAK_ARENA_ART.themes){const image=new Image();image.src='modes/idle/arena-art/'+({garden:'erika',poison:'koga',psychic:'sabrina',fire:'blaine',ground:'giovanni'}[id]||id)+'.webp';await image.decode()}return OAK_ARENA_ART.themes.length});
 assert.equal(count,14);assert.deepEqual(errors,[]);
 console.log('Passed: campaign Surge battle, tower psychic sector battle, shared 14 assets and no browser errors.');
}finally{await browser?.close()}})().catch(e=>{console.error(e.stack);process.exitCode=1});
