const {chromium}=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--allow-file-access-from-files']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{localStorage.setItem('oakchess_achievements_v1',JSON.stringify({progress:{brock:1,evolve2:1,crafter10:5},claimed:{evolve2:true},equipped:{trail:'evolve2'}}))});
 await page.goto('file:///'+path.resolve('index.html').replace(/\\/g,'/'),{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.ACH,{timeout:30000});
 await page.evaluate(()=>ACH.open());await page.locator('#achievements.show').waitFor();
 fs.mkdirSync('tmp/achievement-review',{recursive:true});
 const layouts=[];
 for(const size of [{width:1440,height:900},{width:1280,height:720},{width:800,height:600}]){
  await page.setViewportSize(size);await page.waitForTimeout(250);
  const layout=await page.evaluate(()=>{const get=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight}};return{book:get('.ach-book'),body:get('.ach-body'),list:get('.ach-list'),detail:get('.ach-detail'),viewport:{width:innerWidth,height:innerHeight},rows:document.querySelectorAll('.ach-row').length}});
  layouts.push(layout);assert.equal(layout.rows,24);assert.ok(layout.book.y>=0&&layout.book.x>=0);assert.ok(layout.book.y+layout.book.height<=size.height+2);assert.ok(layout.list.clientHeight>=100,'Lista pequena demais');
  const action=await page.locator('[data-claim="brock"]').boundingBox();assert.ok(action&&action.y+action.height<=layout.detail.y+layout.detail.height+2,'Resgate deve ficar visível sem rolar os detalhes');
  await page.screenshot({path:'tmp/achievement-review/'+size.width+'.png'});
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('[data-select="brock"]').click();await page.locator('[data-claim="brock"]').click();await page.locator('[data-equip="brock"]').click();
 assert.equal(await page.evaluate(()=>ACH.title()),'Aprendiz de Kanto');
 await page.locator('.ach-tabs [data-tab="collection"]').click();assert.equal(await page.locator('.ach-row').count(),2);
 await page.locator('[data-loadout="trail"]').click();assert.equal(await page.locator('.ach-row').count(),1);
 await page.keyboard.press('Escape');assert.equal(await page.locator('#achievements').isVisible(),false);
 await page.evaluate(()=>{DEMO.on=false;B.on=false;G.phase='plan';G.paused=false;G.eventModal=false;G.gold=0;CFG.timer=false;STORY.on=false;document.getElementById('starter').classList.remove('show');ACH.craft()});
 await page.locator('#achievementNotice.show').waitFor();await page.waitForTimeout(300);
 const notice=await page.locator('#achievementNotice').boundingBox();assert.ok(notice.x>=0&&notice.y>=0);assert.ok(notice.x+notice.width<=1440);assert.ok(notice.y+notice.height<=900);
 const overlap=await page.evaluate(()=>{const a=document.getElementById('achievementNotice').getBoundingClientRect();return ['#combatbtn','#cards','#bagbtn','#sysbar'].filter(s=>{const el=document.querySelector(s);if(!el||!el.getClientRects().length)return false;const b=el.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top})});assert.deepEqual(overlap,[],'Aviso sobre controles');
 await page.screenshot({path:'tmp/achievement-review/notification.png'});
 await page.evaluate(()=>setMenu(true));await page.waitForTimeout(500);assert.equal(await page.locator('#achievementNotice.show').count(),0);await page.evaluate(()=>setMenu(false));await page.locator('#achievementNotice.show').waitFor();
 assert.deepEqual(errors,[],'Erros do jogo');
 console.log(JSON.stringify({layouts,errors,interactions:'Resgatar, equipar, filtrar coleção e fechar: OK',notification:'Posição, controles livres e espera durante configurações: OK'},null,2));await context.close();
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
