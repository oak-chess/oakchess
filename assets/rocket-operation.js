/* Celadon infiltration. Uses the live board; campaign and Tower saves stay separate. */
(()=>{
'use strict';
const KEY='oakchess_rocket_operation_v1', RECORDS=KEY+'_records', PROGRESS=KEY+'_progress';
const INITIAL=[1,4,7,100,92,66], ALERT=['Oculto','Suspeita','Procurado','Alarme','Bloqueio'];
const ROOMS={
 patrol:{name:'Patrulha Rocket',icon:'R',text:'Vença os recrutas. Recompensa: 6 ouro e 2 XP.'},
 cells:{name:'Celas vigiadas',icon:'◇',text:'Vença os guardas e liberte um Pokémon. Recompensa: 5 ouro e 2 XP.'},
 depot:{name:'Depósito',icon:'▣',text:'Escolha um equipamento entre três. Sem combate.'},
 terminal:{name:'Terminal de segurança',icon:'⌘',text:'Reduza o alerta em 2 ou localize um depósito. Sem combate.'},
 shop:{name:'Contrabandista',icon:'₽',text:'Compre Pokémon e suprimentos com seu ouro. Sem combate.'},
 shelter:{name:'Abrigo',icon:'✚',text:'Recupere 5 de vida, reduza o alerta ou prepare um reforço para a próxima batalha.'},
 officer:{name:'Oficial Rocket',icon:'★',text:'Inimigos mais fortes. Recompensa: 9 ouro, 2 XP e um equipamento.'},
 boss:{name:'Giovanni',icon:'R',text:'Derrote o líder da base, recupere o Silph Scope e conclua a operação.'}
};
// Every sector offers a rescue, a trader and a shelter; optional routes remain explicit.
const ROUTES=[['patrol','cells'],['cells','depot'],['shop','shelter'],['terminal','patrol'],['cells','officer'],['shelter','shop'],['depot','patrol'],['terminal','shop'],['officer','cells'],['boss']];
let overlay=null,focusBefore=null,writing=false,saveFailed=false;
const hud=document.createElement('aside');hud.id='rocketOperationHud';hud.hidden=true;document.getElementById('stage').append(hud);
const active=()=>!!G.rocketOperation, state=()=>G.rocketOperation;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const copy=x=>JSON.parse(JSON.stringify(x));
const lineFor=id=>LINES.find(l=>!l.boss&&l.ids[0]===id);
const sprite=(id,shiny=false)=>shiny?shinyUrl(sprFront(id)):sprFront(id);
const equipment=()=>['band','helmet','bell','scarf'].filter(k=>ITEMBY[k]);
function random(){let x=state().rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;state().rng=x>>>0;return state().rng/4294967296}
function shuffled(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function valid(s){
 if(!s||s.version!==1||!s.operation||!s.game||!Array.isArray(s.units))return false;
 const t=s.operation,g=s.game;
 if(!Number.isInteger(t.step)||t.step<0||t.step>9||!Number.isInteger(t.alert)||t.alert<0||t.alert>4||!Number.isInteger(t.rng)||!Array.isArray(t.history)||!Array.isArray(t.rescued)||!Array.isArray(t.selected)||!['starter','map','intro','plan','room','shop','rescue','gate','result','ended'].includes(t.status))return false;
 if(t.room&&!ROOMS[t.room]||!Array.isArray(g.pool)||g.pool.length!==LINES.length||!Array.isArray(g.shop)||g.shop.some(x=>x&&(!LINES[x.line]||LINES[x.line].boss))||!Array.isArray(g.items)||g.items.some(k=>!ITEMBY[k])||![g.hp,g.gold,g.lvl,g.xp].every(Number.isFinite)||g.lvl<2||g.lvl>9)return false;
 if(t.pendingRescue&&(!lineFor(t.pendingRescue.id)||typeof t.pendingRescue.shiny!=='boolean'))return false;
 const used=new Set();return s.units.every(u=>{const p=u.pos,k=JSON.stringify(p);if(!LINES[u.line]||(LINES[u.line].boss&&!EEVEE_FORMS.includes(u.line))||!Number.isInteger(u.star)||u.star<1||u.star>3||!Array.isArray(u.items)||u.items.some(k=>!ITEMBY[k])||!p||used.has(k))return false;used.add(k);return p.z==='n'?Number.isInteger(p.i)&&p.i>=0&&p.i<9:p.z==='b'&&Number.isInteger(p.r)&&p.r>=4&&p.r<8&&Number.isInteger(p.c)&&p.c>=0&&p.c<7});
}
function save(force=false){
 if(!active()||writing||DEMO.on||G.pending.length||!force&&['combat','vs'].includes(G.phase))return false;
 writing=true;
 try{localStorage.setItem(KEY,JSON.stringify({version:1,operation:copy(state()),game:{hp:G.hp,gold:G.gold,lvl:G.lvl,xp:G.xp,streak:G.streak,items:G.items.slice(),pool:G.pool.slice(),shop:copy(G.shop),locked:G.locked,shPity:G.shPity||0,joyBuff:G.joyBuff||0,vials:{...G.vials},mk:G.mk?copy(G.mk):null},units:allUnits().filter(u=>u.pos).map(u=>({line:u.line,star:u.star,items:u.items.slice(),pos:{...u.pos},shiny:!!u.shiny,dexPurchased:!!u.dexPurchased,evoSkip:u.evoSkip??null}))}));saveFailed=false;return true}
 catch{if(!saveFailed)toast('Não foi possível salvar a Operação Rocket. Libere espaço no navegador antes de sair.');saveFailed=true;return false}
 finally{writing=false}
}
function close(){if(window.TEAM_VIEW?.isOpen)TEAM_VIEW.close();if(overlay){overlay.remove();overlay=null}document.body.classList.remove('rocket-entry-open');if(focusBefore?.isConnected)focusBefore.focus()}
function panel(title,text,html='',actions=[],entry=false){
 close();focusBefore=document.activeElement;
 if(active()){G.eventModal=true;hideTip()}else document.body.classList.add('rocket-entry-open');
 overlay=document.createElement('section');overlay.id='rocketOperationOverlay';overlay.className=entry?'rocket-operation-entry':'';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','rocketOperationTitle');
 overlay.innerHTML='<div class="rop-dialog"><header><span class="rop-eyebrow">OPERAÇÃO ROCKET · CELADON</span><h2 id="rocketOperationTitle">'+esc(title)+'</h2><p>'+esc(text)+'</p></header><div class="rop-body">'+html+'</div><footer>'+actions.map((a,i)=>'<button type="button" data-rop-action="'+i+'" class="'+(a.secondary?'secondary':'')+'">'+esc(a.label)+'</button>').join('')+'</footer></div>';
 document.body.append(overlay);const root=overlay;root.dataset.screen=entry?'entry':root.querySelector('.rop-starters')?'starter':root.querySelector('.rop-map')?'map':'event';
 actions.forEach((a,i)=>root.querySelector('[data-rop-action="'+i+'"]').onclick=()=>{if(overlay!==root)return;SND.init();SND.click();a.run()});
 root.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const els=[...root.querySelectorAll('button:not(:disabled),a[href]')];if(!els.length)return;const i=els.indexOf(document.activeElement);if(e.shiftKey&&i<=0||!e.shiftKey&&i===els.length-1){e.preventDefault();els[e.shiftKey?els.length-1:0].focus()}});
 root.querySelector('button')?.focus();return root;
}
// Prevent the game's global shortcuts from acting behind choices. V is handled by TEAM_VIEW first.
window.addEventListener('keydown',e=>{
 if(!overlay||window.TEAM_VIEW?.isOpen||e.ctrlKey||e.metaKey||e.altKey||['F5','F11','F12'].includes(e.key))return;
 e.stopImmediatePropagation();if(!overlay.contains(document.activeElement))overlay.querySelector('button')?.focus();
 if(e.key==='Tab'){const buttons=[...overlay.querySelectorAll('button:not(:disabled),a[href]')],i=buttons.indexOf(document.activeElement);if(buttons.length&&(e.shiftKey&&i<=0||!e.shiftKey&&i===buttons.length-1)){e.preventDefault();buttons[e.shiftKey?buttons.length-1:0].focus()}return}
 if(e.key==='Escape'){e.preventDefault();if(!active())close();return}
 if(['Enter',' '].includes(e.key)){e.preventDefault();if(!e.repeat&&overlay.contains(document.activeElement))document.activeElement.click()}
},true);
function menu(){
 const s=read(KEY),has=valid(s),running=has&&s.operation.status!=='ended',progress=read(PROGRESS)||{};
 panel('Operação Rocket','Infiltre-se na base de Celadon, liberte Pokémon e recupere o Silph Scope.',
 '<div class="rop-mission-cover"><img src="assets/mode-art/rocket-base.svg" alt="Base da Equipe Rocket em Celadon"><span><small>DOSSIÊ 01 / KANTO</small><b>Base escondida</b><em>10 etapas · Infiltração · Resgate</em></span></div><div class="rop-story"><article class="available"><b>01 · Base escondida</b><span>Celadon · 10 etapas · Giovanni</span><small>'+(progress.celadon?'✓ Silph Scope recuperado':'Disponível')+'</small></article><article><b>02 · Ecos de Lavender</b><span>Torre Pokémon · Resgate do Sr. Fuji</span><small>'+(progress.celadon?'Próxima operação · em expansão':'Após Celadon · em expansão')+'</small></article><article><b>03 · Silph sob ataque</b><span>Silph Co. · Libertação de Saffron</span><small>Expansão futura</small></article></div>'+(running?'<p class="rop-notice">Tentativa salva · etapa '+(s.operation.step+1)+'/10 · '+Math.round(s.game.hp)+' de vida · alerta '+s.operation.alert+'</p>':'')+'<p>Escolha três Pokémon, explore caminhos e proteja seus resgates. A dificuldade desta operação é própria; o ouro e a equipe pertencem a esta tentativa.</p>',
 [...(running?[{label:'Continuar operação',run:()=>launch(s)}]:[]),{label:'Iniciar operação',run:()=>running?confirmNew():launch()},{label:'Recordes',secondary:true,run:records},{label:'Voltar à biblioteca',secondary:true,run:close}],true);
}
function confirmNew(){panel('Substituir a tentativa?','A equipe e os recursos da Operação Rocket atual serão substituídos. Os recordes e o progresso de conclusão serão mantidos.','',[{label:'Voltar',run:menu},{label:'Começar nova operação',secondary:true,run:()=>launch()}],true)}
function clean(){
 close();window.AUTO_BATTLE?.stop();if(SAVE_TM){clearTimeout(SAVE_TM);SAVE_TM=null}clearTimeout(TITLE_TM);clearTimeout(VSTO);clearInterval(LAB.tm);stopTitleDemo();DEMO.on=false;DEMO.mute=false;B.on=false;clearCombatUnits();
 for(const k in UB)delete UB[k];unitsL.innerHTML='';CAR.on=false;cancelAnimationFrame(CAR.raf);closeBag();closeEvent();
 for(const id of ['starter','vs','over','lobby','carousel','badgeov','pausedOverlay'])document.getElementById(id)?.classList.remove('show');
 document.getElementById('towerWatcher')?.remove();LAB.st='done';stage.classList.remove('tdemo');document.body.classList.remove('combat','on-title','game-paused','legendary-dialog','tower-active');setMenu(false);SND.init();
}
function launch(s=null){
 clean();newGame();G.runDiff='normal';G.lvl=4;G.gold=10;G.xp=0;G.hp=100;G.mk=null;G.hintOn=false;G.casinoAt=[];
 const seed=(Math.random()*4294967295)>>>0||1;
 G.rocketOperation={version:1,id:Date.now().toString(36)+'-'+seed.toString(36),rng:seed,step:0,status:'starter',selected:[],room:null,alert:0,maxAlert:0,wins:0,losses:0,history:[],rescued:[],protected:0,enemy:null,offers:[],pendingRescue:null,lossAlertSteps:[],risky:false,startedAt:Date.now(),result:null};
 if(valid(s)){
  G.rocketOperation=copy(s.operation);Object.assign(G,copy(s.game));
  for(const su of s.units){const u=newUnit(su.line,su.star);u.items=su.items.slice();u.shiny=!!su.shiny;u.dexPurchased=!!su.dexPurchased;u.evoSkip=su.evoSkip;place(u,{...su.pos});attachEl(u,false)}
  allUnits().forEach(u=>{if(u.line===EEVEE&&u.star>=2&&u.evoSkip!==u.star&&!G.evoQueue.includes(u))G.evoQueue.push(u)});
 }
 // Only first-generation, non-legendary shop lines are stocked for this operation.
 G.pool=G.pool.map((n,i)=>LINES[i].ids[0]<=151&&!LINES[i].boss?n:0);
 document.body.classList.add('rocket-operation-active');G.phase='plan';G.eventModal=true;G.round=round(state().step);G.ri=state().step;SND.music('plan');setArenaTheme(7);showNpc(null);renderInv();layoutAll();renderHUD();
 if(state().status==='ended'){resultScreen();return}save(true);resume();
}
function round(i){return{rocketOperation:true,kind:'trainer',gym:0,lg:0,st:1+Math.floor(i/3),rn:i+1,n:10,lbl:(i+1)+'/10',kinds:Array(10).fill('trainer'),extra:true}}
function alertBy(n){const t=state();t.alert=Math.max(0,Math.min(4,t.alert+n));t.maxAlert=Math.max(t.maxAlert,t.alert)}
function starter(){
 const t=state();const root=panel('Prepare sua equipe','Escolha três Pokémon básicos. Eles começam com uma estrela; quatro vagas ficam disponíveis na arena.',
 '<div class="rop-starters">'+INITIAL.map(id=>{const l=lineFor(id),selected=t.selected.includes(id);return '<button type="button" data-starter="'+id+'" aria-pressed="'+selected+'"><img src="'+sprite(id)+'" alt=""><b>'+esc(l.names[0])+'</b><small>'+typesOf(l,1).map(k=>esc(TYPES[k].n)).join(' · ')+'</small></button>'}).join('')+'</div><div class="rop-selected-team" aria-label="Equipe selecionada">'+Array.from({length:3},(_,i)=>t.selected[i]?'<span><img src="'+sprite(t.selected[i])+'" alt="'+esc(lineFor(t.selected[i]).names[0])+'"></span>':'<span class="empty">+</span>').join('')+'</div><p class="rop-selection" aria-live="polite">'+t.selected.length+'/3 selecionados</p>',
 [{label:'Começar infiltração',run:()=>{if(t.selected.length!==3){toast('Escolha três Pokémon.');return}t.selected.forEach((id,i)=>{const l=lineFor(id),u=newUnit(l.i,1);G.pool[l.i]=Math.max(0,G.pool[l.i]-1);place(u,{z:'b',r:5+Math.floor(i/2),c:2+i});attachEl(u,true)});t.status='map';save(true);map()}},{label:'Salvar e sair',secondary:true,run:exit}]);
 root.querySelector('[data-rop-action="0"]').disabled=t.selected.length!==3;
 root.querySelectorAll('[data-starter]').forEach(b=>b.onclick=()=>{const id=+b.dataset.starter;if(t.selected.includes(id))t.selected=t.selected.filter(x=>x!==id);else if(t.selected.length<3)t.selected.push(id);else{toast('Selecione no máximo três Pokémon.');return}save(true);starter()});
}
function choices(){
 const t=state();if(!t.choices)t.choices=ROUTES[t.step].map((id,i)=>({id:t.alert>=3&&id==='patrol'?'officer':id,risk:i===1&&['patrol','officer','depot'].includes(id)&&t.step>2}));return t.choices;
}
function map(readOnly=false){
 const t=state();if(!readOnly){t.status='map';G.phase='plan';G.eventModal=true;choices();save(true)}
 const tiles=Array.from({length:10},(_,i)=>{const past=t.history.find(x=>x.step===i);return '<li title="Etapa '+(i+1)+' · '+(past?esc(ROOMS[past.room].name):i===9?'Giovanni':i===t.step?'Escolha atual':'Ainda não explorada')+'" class="'+(past?'done':i===t.step?'current':'')+'"><b>'+(past?'✓':i+1)+'</b><span>'+(past?esc(ROOMS[past.room].name):i===9?'Giovanni':i===t.step?'Escolha atual':'Caminho desconhecido')+'</span></li>'}).join('');
 const roomArt={patrol:trainerUrl('rocketgrunt'),cells:sprite(104),depot:itemUrl('choice-band'),terminal:itemUrl('card-key'),shop:trainerUrl('scientist'),shelter:sprite(113),officer:trainerUrl('rocketgruntf'),boss:trainerUrl('giovanni')};
 const list=readOnly?'':choices().map((c,i)=>'<button type="button" class="rop-room-card" data-kind="'+c.id+'" data-route="'+i+'"><span class="rop-route-art"><img src="'+roomArt[c.id]+'" alt=""><em>CAMINHO '+(i+1)+'</em></span><span class="rop-room-icon">'+ROOMS[c.id].icon+'</span><b>'+ROOMS[c.id].name+'</b><p>'+ROOMS[c.id].text+'</p><small>'+ (c.risk?'Rota arriscada · +1 alerta ao entrar':'Sem aumento de alerta ao entrar')+'</small></button>').join('');
 const root=panel('Mapa da infiltração','Setor '+Math.min(3,Math.floor(t.step/3)+1)+'/3 · Alerta '+t.alert+' — '+ALERT[t.alert],'<div class="rop-map-caption"><b>PLANTA DA BASE</b><span>Etapa '+(t.step+1)+' de 10 · '+t.rescued.length+' resgates</span></div><ol class="rop-map">'+tiles+'</ol><div class="rop-choices">'+list+'</div>',readOnly?[{label:'Voltar à preparação',run:()=>{close();G.eventModal=false;renderHUD()}}]:[{label:'Salvar e sair',secondary:true,run:exit}]);
 root.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>enter(+b.dataset.route));
}
function enter(index){
 const t=state();if(t.status!=='map')return;const c=choices()[index];if(!c)return;
 t.room=c.id;t.risky=c.risk;t.enemy=null;t.offers=[];t.roomDone=false;t.pendingRescue=null;t.ambush=['patrol','officer'].includes(t.room)&&t.alert>=4;
 if(c.risk)alertBy(1);
 if(['patrol','cells','officer','boss'].includes(t.room)){
  // Alert 4 is consumed by an announced ambush, rather than an invisible stat bonus.
  if(t.ambush)t.alert=2;
  t.status='intro';makeEnemy();save(true);intro();
 }else{t.status=t.room==='shop'?'shop':'room';save(true);resume()}
}
function makeEnemy(){
 const t=state();if(t.enemy)return t.enemy;
 const sector=Math.min(2,Math.floor(t.step/3)),officer=t.room==='officer',boss=t.room==='boss',pool=[19,41,23,109,96,27,66,88];
 const ids=boss?[95,111,29,32,104]:shuffled(pool).slice(0,2+sector+(officer?1:0));
 if(!boss&&t.alert>=2)ids.push(41);if(t.ambush)ids.push(109);
 t.enemy=placeEnemies(ids.map((id,i)=>{const l=lineFor(id),maxStar=Math.max(1,l.ids.findLastIndex(mon=>mon<=151)+1);return{line:l.i,star:boss?Math.min(maxStar,i===1?2:3):Math.min(maxStar,sector===2?2:1),items:officer||boss?[equipment()[i%equipment().length]].filter(Boolean):[],scale:1,hpx:boss?(id===95?1.65:1.15):officer?1.1:t.ambush?1.1:1,dx:1}}));return t.enemy;
}
function intro(){
 const t=state(),boss=t.room==='boss';setupBoard(false);
 panel(boss?'Giovanni bloqueia a saída':t.ambush?'Emboscada Rocket!':ROOMS[t.room].name,
 boss?'“Você chegou longe demais. O Silph Scope fica comigo!”':t.room==='cells'?'“Afaste-se das celas! Esses Pokémon pertencem à Equipe Rocket!”':t.ambush?'O alarme chamou reforços. Vença a emboscada para abrir passagem. O alerta caiu para 2.':'“Um intruso na base! Não vai passar por nós!”',
 '<div class="rop-opponent"><img src="'+trainerUrl(boss?'giovanni':'rocketgrunt')+'" alt="'+(boss?'Giovanni':'Recruta Rocket')+'"><div><b>'+G.oppName+'</b><p>'+ROOMS[t.room].text+'</p><small>'+t.enemy.length+' Pokémon · Alerta '+t.alert+'</small></div></div>',
 [{label:'Preparar equipe',run:()=>{t.status='plan';save(true);plan()}},{label:'Salvar e sair',secondary:true,run:exit}]);
}
function setupBoard(refreshShop=false){
 const t=state();closeBag();G.paused=false;G.over=false;G.ri=t.step;G.round=round(t.step);G.phase='plan';G.weather=null;G.routeMod=null;G.foe=null;G.retry=false;G.oppSlug=t.room==='boss'?'giovanni':'rocketgrunt';G.oppName=t.room==='boss'?'Giovanni':t.room==='officer'?'Oficial Rocket':t.ambush?'Patrulha de bloqueio':'Recruta Rocket';G.oppQuote=t.room==='cells'?'Não encoste nessas celas!':'A base está sob nosso controle!';
 document.body.classList.remove('combat');setArenaTheme(7);setWeatherFx();showNpc(null);G.enemy=makeEnemy();spawnEnemies(G.enemy);G.timerMax=G.timer=90;
 if(refreshShop&&!G.shop.some(Boolean))rollShop(true);renderInv();renderShop();updateTraitsUI();layoutAll();renderHUD();warmPlanAssets();
}
function plan(){if(!active())return;close();state().status='plan';G.eventModal=false;setupBoard();G.eventModal=false;save(true);setTimeout(()=>{if(active()&&G.phase==='plan'&&!G.eventModal)processEvoQueue()},600)}
function rewardItems(){const t=state();if(!t.offers.length)t.offers=shuffled(equipment()).slice(0,3);return t.offers}
function itemCards(){return rewardItems().map(k=>'<button type="button" data-item="'+k+'"><img src="'+itemUrl(ITEMBY[k].s)+'" alt=""><b>'+esc(ITEMBY[k].n)+'</b><small>'+esc(ITEMBY[k].d)+'</small></button>').join('')}
function bindItems(root,done){root.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>{const t=state(),k=b.dataset.item;if(t.roomDone||!t.offers.includes(k))return;t.roomDone=true;G.items.push(k);renderInv();SND.loot();done()})}
function room(){
 const t=state();clearCombatUnits();G.enemy=[];G.phase='plan';let root;
 if(t.room==='depot'){
  rewardItems();save(true);root=panel('Unidade de armazenamento','Escolha um equipamento para sua mochila.','<div class="rop-item-options">'+itemCards()+'</div>');bindItems(root,()=>complete());
 }else if(t.room==='terminal'){
  root=panel('Terminal de segurança','Você acessou os controles da base. Escolha uma ação.','<p>Os guardas ainda não perceberam o acesso. Desligue as câmeras ou descubra um suprimento escondido.</p>',[{label:'Desativar câmeras · −2 alerta',run:()=>{alertBy(-2);complete()}},{label:'Localizar depósito · +1 equipamento',secondary:true,run:()=>{t.room='depot';t.offers=[];save(true);room()}}]);
 }else if(t.room==='shelter'){
  root=panel('Abrigo entre os corredores','Sua equipe encontrou um lugar seguro para respirar. Escolha um cuidado.','<p>O reforço preparado aumenta ataque e vida dos seus Pokémon em 12% apenas na próxima batalha.</p>',[{label:'Recuperar 5 de vida',run:()=>{G.hp=Math.min(100,G.hp+5);complete()}},{label:'Esconder-se · −1 alerta',secondary:true,run:()=>{alertBy(-1);complete()}},{label:'Preparar reforço · próxima batalha',secondary:true,run:()=>{G.joyBuff=1;complete()}}]);
 }
 renderHUD();
}
function shop(){
 close();const t=state();G.phase='plan';G.eventModal=false;clearCombatUnits();G.enemy=[];G.oppSlug=null;showNpc(null);
 if(!t.shopOpened){rollShop(true);t.shopOpened=true}renderShop();renderInv();layoutAll();renderHUD();save(true);
 toast('Contrabandista: compre na loja abaixo. Use “Concluir compras” para seguir.');
}
function rescue(){
 const t=state();if(!t.pendingRescue){const id=shuffled([100,35,37,43,54,58,63,66,77,79,81,86,102,104,108,114,116,133].filter(id=>lineFor(id)))[0];t.pendingRescue={id,shiny:random()<.03};save(true)}
 const p=t.pendingRescue,l=lineFor(p.id),waiting=t.rescueChoice==='help';
 const root=panel(waiting?'Abra uma vaga no banco':'Uma cela foi aberta',waiting?'O Pokémon aguarda em segurança. Organize o banco para recebê-lo ou encaminhe-o para proteção.':'“Você veio me buscar?” O Pokémon está livre. Escolha como ele seguirá a operação.',
 '<div class="rop-rescue"><img src="'+sprite(p.id,p.shiny)+'" alt="'+esc(l.names[0])+'"><h3>'+esc(l.names[0])+(p.shiny?' ✦ Shiny':'')+'</h3><p>★ · '+typesOf(l,1).map(k=>esc(TYPES[k].n)).join(' · ')+'</p><small>Libertar conta como visto. O registro na Pokédex exige compra na loja.</small></div>',
 [{label:waiting?'Tentar receber no banco':'Ajudar na operação',run:()=>recruit()},{label:'Encaminhar para segurança',secondary:true,run:()=>protect()},{label:waiting?'Organizar banco':'Arrombar reserva · +1 equipamento e +1 alerta',secondary:true,run:()=>waiting?organizeRescue():riskRescue()}]);
 if(t.ransacked&&!waiting){const b=root.querySelector('[data-rop-action="2"]');b.disabled=true;b.textContent='Reserva aberta · equipamento recebido'}window.PDEX?.observe([{line:l.i,star:1,shiny:p.shiny}],'rocket:resgate');return root;
}
function finishRescue(help){const t=state(),p=t.pendingRescue;t.rescued.push({id:p.id,shiny:p.shiny,help,step:t.step});if(!help)t.protected++;t.pendingRescue=null;t.rescueChoice=null;complete()}
function recruit(){const t=state();if(t.status!=='rescue'||!t.pendingRescue)return;const slot=freeBenchSlot();if(slot<0){t.rescueChoice='help';save(true);rescue();return}const p=t.pendingRescue,l=lineFor(p.id),u=newUnit(l.i,1);u.shiny=p.shiny;place(u,{z:'n',i:slot});attachEl(u,true);mergeCheck();finishRescue(true)}
function protect(){if(state().status!=='rescue'||!state().pendingRescue)return;finishRescue(false)}
function riskRescue(){const t=state();if(t.ransacked)return;t.ransacked=true;alertBy(1);const k=shuffled(equipment())[0];if(k)G.items.push(k);renderInv();save(true);rescue();overlay.querySelectorAll('[data-rop-action="2"]').forEach(b=>{b.disabled=true;b.textContent='Reserva aberta · equipamento recebido'})}
function organizeRescue(){close();G.phase='plan';G.eventModal=false;renderHUD();toast('Libere uma vaga vendendo um Pokémon ou movendo-o para a arena. Depois clique em “Receber resgate”.')}
function complete(){
 const t=state();if(t.history.some(x=>x.step===t.step))return;
 t.history.push({step:t.step,room:t.room,alert:t.alert});t.roomDone=true;t.choices=null;t.enemy=null;t.shopOpened=false;t.ransacked=false;t.offers=[];
 G.phase='plan';G.eventModal=true;clearCombatUnits();G.enemy=[];G.oppSlug=null;
 if(t.step===9){end('won');return}
 t.status=[2,5,8].includes(t.step)?'gate':'result';save(true);renderHUD();checkpoint();
}
function checkpoint(){
 const t=state();if(t.status==='gate'){
  panel('Ponto de extração','Setor concluído. Você pode sair com os resgates ou continuar em direção a Giovanni.',
  '<div class="rop-stats"><span>Vida <b>'+Math.round(G.hp)+'</b></span><span>Resgates <b>'+t.rescued.length+'</b></span><span>Alerta <b>'+t.alert+'/4</b></span></div><p>Sair registra a tentativa e os resgates. Apenas derrotar Giovanni conclui Celadon e recupera o Silph Scope.</p>',[{label:'Continuar infiltração',run:next},{label:'Extrair e encerrar tentativa',secondary:true,run:confirmExtract},{label:'Salvar e sair · continuar depois',secondary:true,run:exit}]);
 }else panel('Passagem liberada','Etapa '+(t.step+1)+'/10 concluída. Escolha o próximo caminho.','<p>Objetivo: recuperar o Silph Scope e libertar os Pokémon da base.</p>',[{label:'Escolher próximo caminho',run:next},{label:'Salvar e sair',secondary:true,run:exit}]);
}
function next(){const t=state();if(!['result','gate'].includes(t.status))return;t.step++;t.room=null;t.status='map';G.ri=t.step;G.round=round(t.step);map()}
function confirmExtract(){panel('Encerrar a infiltração?','A tentativa será concluída agora. Você precisará começar outra para enfrentar Giovanni.','<p>Se deseja continuar esta mesma tentativa depois, escolha “Voltar” e use “Salvar e sair”.</p>',[{label:'Voltar',run:checkpoint},{label:'Confirmar extração',secondary:true,run:()=>end('extracted')}])}
function finish(){
 if(!active()||G.phase!=='combat')return;const t=state(),win=B.winner===0,winner=B.winner,survivors=B.units.filter(u=>u.alive&&u.side===winner).length;
 B.on=false;B.over=false;clearCombatUnits();for(const u of boardUnits())u.el.style.display='';document.body.classList.remove('combat');G.phase='plan';G.eventModal=true;G.lastResult=win;window.AUTO_BATTLE?.stop();
 if(!win){
  t.losses++;const damage=dmgBase(round(t.step).st)+survivors;G.hp=Math.max(0,G.hp-damage);
  if(!t.lossAlertSteps.includes(t.step)){t.lossAlertSteps.push(t.step);alertBy(1)}
  // Refresh the same encounter at its original strength. No repeated free rewards.
  t.status='plan';renderHUD();if(G.hp<=0){end('lost');return}save(true);
  panel('Os Rockets seguraram a passagem','−'+damage+' de vida · Alerta '+t.alert+' — '+ALERT[t.alert],'<p>“Ainda não acabou! Volte quando estiver preparado!”</p><p>Vença este encontro para avançar. A primeira derrota de cada etapa aumenta o alerta; novas tentativas não concedem recompensas.</p>',[{label:'Reorganizar e tentar novamente',run:plan},{label:'Salvar e sair',secondary:true,run:exit}]);return;
 }
 t.wins++;G.gold+=t.room==='officer'?9:t.room==='cells'?5:t.room==='boss'?12:6;addXp(2);renderInv();renderHUD();
 if(t.room==='cells'){t.status='rescue';save(true);rescue();return}
 if(t.room==='officer'){const k=shuffled(equipment())[0];if(k)G.items.push(k);renderInv()}
 complete();
}
function score(t,hp){return t.history.length*100+t.rescued.length*150+t.protected*50+(t.result==='won'?1000:0)+Math.round(hp)*5-Math.min(300,t.losses*25)}
function storeResult(){
 const t=state();try{
  const rows=read(RECORDS)||[],entry={id:t.id,at:t.endedAt,result:t.result,steps:t.history.length,rescued:t.rescued.length,protected:t.protected,hp:G.hp,maxAlert:t.maxAlert,losses:t.losses,score:score(t,G.hp)};
  const records=Array.isArray(rows)?rows:[];if(!records.some(r=>r.id===t.id))records.push(entry);localStorage.setItem(RECORDS,JSON.stringify(records.slice(-100)));
  if(t.result==='won'){const p=read(PROGRESS)||{};p.celadon=true;p.silphScope=true;p.completedAt=p.completedAt||t.endedAt;localStorage.setItem(PROGRESS,JSON.stringify(p))}return true;
 }catch{toast('Não foi possível registrar o resultado. O salvamento da tentativa será mantido.');return false}
}
function end(result){const t=state();t.result=result;t.endedAt=Date.now();t.status='ended';G.phase='plan';G.over=true;G.eventModal=true;G.oppSlug=null;clearCombatUnits();closeBag();save(true);storeResult();renderHUD();resultScreen()}
function resultScreen(){
 const t=state(),won=t.result==='won';G.over=true;G.eventModal=true;storeResult();
 panel(won?'Silph Scope recuperado!':t.result==='extracted'?'Extração concluída':'Fim da operação',won?'Giovanni recuou. Os Pokémon estão livres, e uma pista leva à Torre Pokémon de Lavender.':t.result==='extracted'?'Sua equipe deixou a base em segurança. Os resgates foram registrados.':'A base resistiu à infiltração. Monte outra equipe e tente uma nova estratégia.',
 '<div class="rop-result-emblem">'+(won?'✓':'R')+'</div><div class="rop-stats"><span>Pontuação <b>'+score(t,G.hp)+'</b></span><span>Etapas <b>'+t.history.length+'/10</b></span><span>Resgates <b>'+t.rescued.length+'</b></span><span>Protegidos <b>'+t.protected+'</b></span><span>Vida <b>'+Math.round(G.hp)+'</b></span><span>Maior alerta <b>'+t.maxAlert+'/4</b></span></div>'+(won?'<p class="rop-notice">Marco conquistado: Silph Scope. A próxima operação será Ecos de Lavender, disponível em uma expansão futura.</p>':''),
 [{label:'Voltar à biblioteca',run:exit},{label:'Iniciar outra operação',secondary:true,run:()=>panel('Começar outra operação?','O resultado desta tentativa já foi registrado.','',[{label:'Voltar',run:resultScreen},{label:'Nova operação',secondary:true,run:()=>launch()}])}]);
}
function records(){
 const rows=read(RECORDS),list=Array.isArray(rows)?rows.slice().sort((a,b)=>b.score-a.score):[];
 panel('Recordes da Operação Rocket','Tentativas registradas neste navegador.',list.length?'<ol class="rop-records">'+list.map(r=>'<li><b>'+Math.round(r.score)+' pontos</b><span>'+({won:'Missão concluída',lost:'Derrota',extracted:'Extração'}[r.result]||'Tentativa')+' · '+r.steps+'/10 etapas · '+r.rescued+' resgates</span><small>'+new Date(r.at).toLocaleDateString('pt-BR')+' · alerta máximo '+r.maxAlert+'</small></li>').join('')+'</ol>':'<p>Nenhuma tentativa encerrada.</p>',[{label:'Voltar',run:menu}],true);
}
function exit(){
 if(!active()){close();return}if(['combat','vs'].includes(G.phase)){toast('Conclua a batalha antes de salvar e sair.');return}
 if(!save(true))return;if(state().status==='ended'&&!storeResult())return;location.href='index.html';
}
function restart(){const t=state();if(!t)return;const modal=G.eventModal,paused=G.paused;G.paused=true;panel('Recomeçar a operação?','A equipe e os recursos desta tentativa serão substituídos.','',[{label:'Continuar tentativa',run:()=>{close();G.paused=paused;G.eventModal=modal;if(modal)resume()}},{label:'Recomeçar',secondary:true,run:()=>launch()}])}
function resume(){
 const t=state();G.round=round(t.step);G.ri=t.step;
 if(t.status==='starter')starter();else if(t.status==='map')map();else if(t.status==='intro')intro();else if(t.status==='plan')plan();else if(t.status==='room')room();else if(t.status==='shop')shop();else if(t.status==='rescue')rescue();else if(['gate','result'].includes(t.status))checkpoint();else resultScreen();
}
function decorate(){
 hud.hidden=!active();document.body.classList.toggle('rocket-operation-active',active());if(!active()){document.body.classList.remove('rocket-operation-shopping','rocket-operation-rescue-wait');return}const t=state(),busy=G.phase!=='plan'||G.eventModal||G.over,shopping=t.status==='shop';
 document.body.classList.toggle('rocket-operation-shopping',shopping&&!G.over);document.body.classList.toggle('rocket-operation-rescue-wait',t.status==='rescue'&&!G.eventModal);
 const chip=document.getElementById('campaignModeChip');if(chip)chip.hidden=true;
 document.getElementById('rtitle').textContent='CELADON · '+(t.step+1)+'/10';document.getElementById('rl1').textContent='Operação Rocket';document.getElementById('rl2').textContent=t.room?ROOMS[t.room].name:'Infiltração';document.getElementById('rl3').textContent='Alerta '+t.alert+' · '+ALERT[t.alert];
 document.getElementById('rchips').innerHTML=Array.from({length:3},(_,i)=>'<i class="'+(t.step>=i*3?'done':'')+'" title="Setor '+(i+1)+'">'+(i+1)+'</i>').join('');const leader=document.getElementById('lcount');if(leader){leader.hidden=false;leader.textContent=t.step===9?'Giovanni':'Giovanni em '+(9-t.step)}
 const lb=document.getElementById('lb');if(lb)lb.innerHTML='<small>OPERAÇÃO ROCKET</small><b>Celadon · '+(t.step+1)+'/10</b><span>Alerta '+t.alert+' · '+ALERT[t.alert]+'</span>';
 const signature=[t.status,t.step,t.alert,t.rescued.length,busy,shopping].join(':');if(hud.dataset.signature===signature)return;hud.dataset.signature=signature;
 hud.innerHTML='<div class="rop-hud-head"><strong>R</strong><span><small>SETOR '+Math.min(3,Math.floor(t.step/3)+1)+'/3</small><b>Operação Celadon</b></span></div><div class="rop-alert" aria-label="Alerta '+t.alert+' de 4"><b>'+ALERT[t.alert]+'</b><span>'+Array.from({length:4},(_,i)=>'<i class="'+(i<t.alert?'on':'')+'"></i>').join('')+'</span></div><p>Recupere o Silph Scope<br>'+t.rescued.length+' Pokémon resgatados</p><nav><button type="button" data-map '+(busy?'disabled':'')+'>Mapa</button><button type="button" data-exit '+(['combat','vs'].includes(G.phase)?'disabled':'')+'>Salvar e sair</button></nav>'+(shopping?'<button type="button" class="rop-hud-next" data-next>Concluir compras</button>':t.status==='rescue'&&!G.eventModal?'<button type="button" class="rop-hud-next" data-rescue>Receber resgate</button>':'');
 hud.querySelector('[data-map]').onclick=()=>map(true);hud.querySelector('[data-exit]').onclick=exit;hud.querySelector('[data-next]')?.addEventListener('click',()=>{if(t.status==='shop')complete()});hud.querySelector('[data-rescue]')?.addEventListener('click',rescue);
}
const previousHUD=renderHUD;renderHUD=function(){const r=previousHUD.apply(this,arguments);decorate();return r};
// A trader is the only room selling Pokémon. Free refreshes are internal setup calls.
const previousBuy=buyCard;buyCard=function(){if(active()&&state().status!=='shop'){toast('Encontre um contrabandista para comprar Pokémon.');return}return previousBuy.apply(this,arguments)};
const previousRoll=rollShop;rollShop=function(free){if(active()&&!free&&state().status!=='shop'){toast('A loja abre nos encontros com o contrabandista.');return}return previousRoll.apply(this,arguments)};
const previousMarketBuy=mkBuy;mkBuy=function(){if(active()&&state().status!=='shop'){toast('Os suprimentos são vendidos nos encontros com o contrabandista.');return}return previousMarketBuy.apply(this,arguments)};
window.ROCKET_OPERATION={get active(){return active()},menu,round,plan,finish,save,restart,exit,decorate};
window.addEventListener('pagehide',()=>save());
})();
