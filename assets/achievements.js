(function(){
'use strict';
const KEY='oakchess_achievements_v1';
const defs=[
 ['brock','Primeira insígnia','Derrote Brock.','journey',1,'title','Aprendiz de Kanto','#d2b780'],
 ['badges','Colecionador de insígnias','Conquiste as oito insígnias na mesma run.','journey',8,'frame','Esmeralda','#8ee3ac'],
 ['champion','Campeão de Kanto','Vença o Campeão da Liga.','journey',1,'title','Campeão de Kanto','#f5d879'],
 ['legend','Lenda de Kanto','Derrote Mewtwo na campanha no Difícil.','journey',1,'frame','Aurora psíquica','#ce9cff'],
 ['evolve2','Primeira evolução','Forme um Pokémon ★★.','team',1,'trail','Azul celeste','#8dd4ff'],
 ['evolve3','Potencial máximo','Forme um Pokémon ★★★.','team',1,'frame','Rubi','#f39595'],
 ['dream','Equipe dos sonhos','Coloque três Pokémon ★★★ juntos na arena.','team',3,'title','Criador de estrelas','#ffe58a'],
 ['synergy','Especialista','Ative uma sinergia com seis espécies diferentes na arena.','strategy',6,'trail','Verde vital','#92edb2'],
 ['craft','Combinação perfeita','Crie um item no Craft.','strategy',1,'frame','Safira','#92c4ff'],
 ['equipped','Time preparado','Inicie uma batalha com todos os Pokémon da arena equipados.','strategy',1,'trail','Dourado','#ffdb7c'],
 ['survivor','Último de pé','Vença uma batalha com apenas um aliado sobrevivente.','challenge',1,'title','Contra todas as chances','#f7b985'],
 ['flawless','Vitória impecável','Vença uma batalha de Líder sem perder nenhum aliado.','challenge',1,'trail','Violeta estelar','#d7a5ff'],
 ['misty','Maré vencida','Derrote Misty.','journey',1,'frame','Maré de Cerulean','#6bdbe3'],
 ['erika','Jardim conquistado','Derrote Erika.','journey',1,'title','Guardião do jardim','#b4e993'],
 ['sabrina','Mente inabalável','Derrote Sabrina.','journey',1,'trail','Rosa psíquico','#ffa4dc'],
 ['fullteam','Força total','Coloque nove Pokémon juntos na arena.','team',9,'frame','Constelação','#c5d2ff'],
 ['shiny','Brilho raro','Compre um Pokémon shiny na loja.','collection',1,'trail','Luz prateada','#e4f5ff'],
 ['researcher','Pesquisador de Kanto','Compre 25 espécies diferentes na loja, ao longo das suas partidas.','collection',25,'title','Pesquisador de Kanto','#93dcd1'],
 ['gold50','Reserva estratégica','Acumule 50 de ouro de uma vez durante uma partida.','economy',50,'frame','Tesouro antigo','#edbe6e'],
 ['gold100','Cofre de Kanto','Acumule 100 de ouro de uma vez durante uma partida.','economy',100,'title','Magnata de Kanto','#ffe68f'],
 ['crafter10','Mestre artesão','Crie dez itens no Craft, ao longo das suas partidas.','strategy',10,'trail','Forja incandescente','#ffac76'],
 ['buyer50','Olho para talentos','Compre 50 Pokémon na loja, ao longo das suas partidas.','collection',50,'frame','Expedição','#b7c69b'],
 ['clutch','Coração de campeão','Vença um Líder com 20 ou menos de vida do treinador antes da batalha.','challenge',1,'title','Coração de campeão','#ff999b'],
 ['accessible','Talento acessível','Vença o Campeão sem Pokémon de custo 5 na sua equipe da batalha.','challenge',1,'trail','Chama azul','#8ebcff']
].map(a=>({id:a[0],name:a[1],desc:a[2],category:a[3],target:a[4],kind:a[5],reward:a[6],color:a[7],secret:a[0]==='legend'}));
function createStore(storage,onUnlock=()=>{}){
 let raw;try{raw=JSON.parse(storage.getItem(KEY)||'{}')}catch(e){raw={}}if(!raw||typeof raw!=='object')raw={};
 const state={progress:{},claimed:{},equipped:{title:'',frame:'',trail:''},unlocked:{},counters:{crafts:0,purchases:0},species:[]};
 for(const key of ['crafts','purchases']){const n=Number(raw.counters&&raw.counters[key]);state.counters[key]=Number.isFinite(n)?Math.min(key==='crafts'?10:50,Math.max(0,Math.floor(n))):0}
 if(Array.isArray(raw.species))state.species=[...new Set(raw.species.filter(n=>Number.isInteger(n)&&n>0&&n<2000))].slice(0,25);
 for(const d of defs){const n=Number(raw.progress&&raw.progress[d.id]);state.progress[d.id]=Number.isFinite(n)?Math.max(0,Math.min(d.target,Math.floor(n))):0;if(state.progress[d.id]>=d.target){state.unlocked[d.id]=Number(raw.unlocked&&raw.unlocked[d.id])||1;state.claimed[d.id]=!!(raw.claimed&&raw.claimed[d.id])}}
 for(const kind of ['title','frame','trail']){const id=raw.equipped&&raw.equipped[kind];if(defs.some(d=>d.id===id&&d.kind===kind&&state.claimed[id]))state.equipped[kind]=id}
 let storageError=false;function save(){try{storage.setItem(KEY,JSON.stringify(state));storageError=false}catch(e){storageError=true}}
 function progress(id,value,silent=false){const d=defs.find(x=>x.id===id);if(!d||!Number.isFinite(value))return false;const before=state.progress[id];const next=Math.min(d.target,Math.max(before,Math.floor(value)));if(next===before)return false;state.progress[id]=next;const unlocked=next===d.target&&before<d.target;if(unlocked)state.unlocked[id]=Date.now();save();if(unlocked&&!silent)onUnlock(d);return unlocked}
 function claim(id){const d=defs.find(x=>x.id===id);if(!d||state.progress[id]<d.target||state.claimed[id])return false;state.claimed[id]=true;save();return true}
 function equip(kind,id){if(!['title','frame','trail'].includes(kind))return false;if(id&&!defs.some(d=>d.id===id&&d.kind===kind&&state.claimed[id]))return false;state.equipped[kind]=id;save();return true}
 function increment(key){if(!['crafts','purchases'].includes(key))return;state.counters[key]=Math.min(key==='crafts'?10:50,state.counters[key]+1);progress(key==='crafts'?'crafter10':'buyer50',state.counters[key]);save()}
 function remember(id){if(!Number.isInteger(id)||id<=0||state.species.includes(id)||state.species.length>=25)return;state.species.push(id);progress('researcher',state.species.length);save()}
 return{state,progress,claim,equip,increment,remember,storageError:()=>storageError};
}
if(typeof module!=='undefined'&&module.exports){module.exports={defs,createStore};return}
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories={all:'Todas',journey:'Jornada',team:'Equipe',strategy:'Estratégia',collection:'Colecionismo',economy:'Economia',challenge:'Desafios'};
const kinds={title:'Título de treinador',frame:'Moldura do verso',trail:'Rastro da Poké Bola'};
const icon=d=>{const shapes={journey:'M5 2h5v5H5zm9 0h5v5h-5zM6 7h12v3h3v5h-3v3h-4v3h3v2H7v-2h3v-3H6v-3H3v-5h3z',team:'M10 2h4v4h4v4h4v4h-4v4h-4v4h-4v-4H6v-4H2v-4h4V6h4z',strategy:'M12 2h8l-5 7h4l-9 13H6l5-10H5z',collection:'M7 2h10v3h4v4h2v6h-2v4h-4v3H7v-3H3v-4H1V9h2V5h4zm-2 8v4h5v3h4v-3h5v-4h-5V7h-4v3z',economy:'M7 2h10v3h4v4h2v6h-2v4h-4v3H7v-3H3v-4H1V9h2V5h4zm2 5v10h6V7z',challenge:'M2 2h5l9 9 3-3 3 3-3 3 3 3-3 3-3-3-3 3-3-3 3-3L2 7zm15 0h5v5l-5 5-5-5zM2 17l5-5 5 5-5 5H2z'};return '<svg viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="'+d.color+'" d="'+(shapes[d.category]||shapes.journey)+'"/><path fill="#fff4c4" opacity=".6" d="M7 5h3v2H7z"/></svg>'};
let category='all',filter='all',selected='brock',tab='goals',returnFocus=null,queue=[],activeNotice=null,noticeRemaining=0,noticeLastTick=0,noticeHadEvent=false;
let store;try{store=createStore(localStorage,d=>{queue.push(d);refreshBadge();if(panel.classList.contains('show'))render()})}catch(e){store=createStore({getItem:()=>null,setItem:()=>{}},d=>queue.push(d))}
const state=store.state;
const panel=document.createElement('div');panel.id='achievements';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','achTitle');panel.innerHTML='<section class="ach-book"><header><div><small>REGISTROS DA SUA JORNADA</small><h2 id="achTitle">Caderno do Treinador</h2></div><button class="ach-close" aria-label="Fechar conquistas">✕</button></header><div class="ach-overview"></div><nav class="ach-tabs"><button data-tab="goals">Conquistas</button><button data-tab="collection">Coleção</button></nav><div class="ach-body"><aside></aside><main><div class="ach-filters"></div><div class="ach-list"></div></main><section class="ach-detail" aria-label="Detalhes da conquista"></section></div><footer>Progresso salvo neste navegador · Recompensas cosméticas</footer></section>';stage.appendChild(panel);
const notification=document.createElement('div');notification.id='achievementNotice';notification.setAttribute('role','status');notification.setAttribute('aria-live','polite');stage.appendChild(notification);
const loadout=document.createElement('div');loadout.className='ach-loadout';panel.querySelector('.ach-tabs').after(loadout);
const feedback=document.createElement('div');feedback.className='ach-feedback';feedback.setAttribute('role','status');panel.querySelector('.ach-book').appendChild(feedback);let feedbackTimer;
function announce(text){feedback.textContent=text;clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>feedback.textContent='',3500)}
function renderLoadout(){loadout.innerHTML='<small>SEU ESTILO ATUAL</small>'+['title','frame','trail'].map(kind=>{const d=defs.find(x=>x.id===state.equipped[kind]);return '<button data-loadout="'+kind+'" style="--reward:'+(d?d.color:'#8198b8')+'"><i></i><span><small>'+kinds[kind]+'</small><b>'+esc(d?d.reward:'Padrão')+'</b></span></button>'}).join('')}
function available(){return defs.filter(d=>state.progress[d.id]>=d.target&&!state.claimed[d.id]).length}
function refreshBadge(){const b=$('#tpress [data-act="achievements"]');if(b){b.dataset.pending=available();b.classList.toggle('has-rewards',available()>0);b.setAttribute('aria-label','Conquistas'+(available()?' · '+available()+' recompensas para resgatar':''))}}
function secret(d){return d.secret&&state.progress[d.id]<d.target}
function render(){
 renderLoadout();
 panel.querySelector('footer').textContent=store.storageError()?'Não foi possível salvar no navegador · Progresso disponível apenas nesta sessão':'Progresso salvo neste navegador · Recompensas cosméticas';
 const done=defs.filter(d=>state.progress[d.id]>=d.target).length;
 panel.querySelector('.ach-overview').innerHTML='<div><b>'+done+'<small> / '+defs.length+'</small></b><span>CONQUISTAS</span></div><div class="ach-total"><span>Sua jornada registrada</span><div><i style="width:'+done/defs.length*100+'%"></i></div></div><p>'+available()+' recompensa'+(available()===1?'':'s')+' para resgatar</p>';
 panel.querySelectorAll('.ach-tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.tab===tab);b.setAttribute('aria-pressed',b.dataset.tab===tab)});
 panel.querySelector('aside').innerHTML=Object.entries(tab==='goals'?categories:{all:'Toda a coleção',title:'Títulos',frame:'Molduras',trail:'Rastros'}).map(([k,n])=>'<button data-category="'+k+'" class="'+(category===k?'on':'')+'">'+n+'</button>').join('');
 panel.querySelector('.ach-filters').innerHTML=tab==='goals'?Object.entries({all:'Todas',progress:'Em andamento',done:'Concluídas',claim:'Para resgatar'}).map(([k,n])=>'<button data-filter="'+k+'" class="'+(filter===k?'on':'')+'">'+n+'</button>').join(''):'<span>Resgate conquistas para ampliar sua coleção.</span>';
 const list=defs.filter(d=>tab==='goals'?(category==='all'||d.category===category)&&(filter==='all'||filter==='progress'&&state.progress[d.id]<d.target||filter==='done'&&state.progress[d.id]>=d.target||filter==='claim'&&state.progress[d.id]>=d.target&&!state.claimed[d.id]):state.claimed[d.id]&&(category==='all'||d.kind===category));
 if(!list.some(d=>d.id===selected))selected=list[0]&&list[0].id;
 panel.querySelector('.ach-list').innerHTML=list.length?list.map(d=>{const done=state.progress[d.id]>=d.target,claimed=state.claimed[d.id];return '<button class="ach-row '+(selected===d.id?'selected ':'')+(done?'completed':'locked')+'" data-select="'+d.id+'" aria-pressed="'+(selected===d.id)+'"><span class="ach-seal">'+icon(d)+'</span><span class="ach-row-content"><b>'+esc(secret(d)?'Encontro secreto':tab==='collection'?d.reward:d.name)+'</b><small>'+esc(tab==='collection'?kinds[d.kind]:secret(d)?'Um desafio além da Liga espera por você.':d.desc)+'</small><span class="ach-progress"><i style="width:'+state.progress[d.id]/d.target*100+'%"></i></span></span><span class="ach-state">'+(tab==='collection'?(state.equipped[d.kind]===d.id?'EM USO':'DISPONÍVEL'):done?(claimed?'RESGATADA':'RESGATAR'):state.progress[d.id]+'/'+d.target)+'</span></button>'}).join(''):'<div class="ach-empty">'+(tab==='collection'?'Sua coleção começa com a primeira recompensa resgatada.':'Nenhuma conquista neste filtro.')+'</div>';
 const d=defs.find(x=>x.id===selected),detail=panel.querySelector('.ach-detail');
 if(!d){detail.innerHTML='<p>Escolha outra categoria para explorar.</p>';return}
 const unlocked=state.progress[d.id]>=d.target,claimed=state.claimed[d.id];
 detail.dataset.reward=d.id;
 detail.innerHTML='<div class="ach-big-seal '+(unlocked?'':'locked')+'">'+icon(d)+'</div><small>'+esc(tab==='collection'?kinds[d.kind]:categories[d.category])+'</small><h3>'+esc(secret(d)?'Encontro secreto':d.name)+'</h3><p>'+esc(secret(d)?'Há uma presença poderosa além da Liga. Vença no maior desafio.':d.desc)+'</p><div class="ach-reward-preview" style="--reward:'+d.color+'">'+(d.kind==='frame'?'<div class="ach-card-preview"></div>':d.kind==='trail'?'<div class="ach-ball-preview">●</div>':'<b>'+esc(d.reward)+'</b>')+'</div><small>RECOMPENSA · '+kinds[d.kind]+'</small><b class="ach-reward-name">'+esc(secret(d)?'Recompensa secreta':d.reward)+'</b>'+(unlocked&&!claimed?'<button class="ach-primary" data-claim="'+d.id+'">Resgatar recompensa</button>':claimed?'<button class="ach-primary" data-equip="'+d.id+'">'+(state.equipped[d.kind]===d.id?'Remover cosmético':'Equipar recompensa')+'</button>':'<div class="ach-locked-label">'+state.progress[d.id]+' / '+d.target+' · EM ANDAMENTO</div>');
}
function applyCosmetics(){for(const kind of ['frame','trail']){const d=defs.find(x=>x.id===state.equipped[kind]);if(d)document.documentElement.style.setProperty('--ach-'+kind,d.color);else document.documentElement.style.removeProperty('--ach-'+kind)}document.body.dataset.achFrame=state.equipped.frame||'default';document.body.classList.toggle('ach-frame-equipped',!!state.equipped.frame);document.body.classList.toggle('ach-trail-equipped',!!state.equipped.trail)}
function title(){const d=defs.find(x=>x.id===state.equipped.title);return d?d.reward:''}
function open(){returnFocus=document.activeElement;category='all';filter='all';tab='goals';render();panel.classList.add('show');panel.querySelector('.ach-close').focus()}
function close(){panel.classList.remove('show');if(returnFocus&&returnFocus.isConnected)returnFocus.focus()}
panel.addEventListener('click',e=>{const b=e.target.closest('button');if(e.target===panel||b&&b.classList.contains('ach-close')){close();return}if(!b)return;if(b.dataset.tab){tab=b.dataset.tab;category='all';filter='all'}if(b.dataset.category)category=b.dataset.category;if(b.dataset.filter)filter=b.dataset.filter;if(b.dataset.select)selected=b.dataset.select;if(b.dataset.claim){if(store.claim(b.dataset.claim)){SND.click();refreshBadge()}}if(b.dataset.equip){const d=defs.find(x=>x.id===b.dataset.equip);store.equip(d.kind,state.equipped[d.kind]===d.id?'':d.id);applyCosmetics();SND.click()}const focusKey=b.dataset.claim?'equip':b.dataset.equip?'equip':null;render();const attribute=focusKey||['tab','category','filter','select'].find(k=>b.dataset[k]);if(attribute){const value=focusKey?selected:b.dataset[attribute];const next=panel.querySelector('[data-'+attribute+'="'+value+'"]');if(next)next.focus()}});
window.addEventListener('keydown',e=>{if(!panel.classList.contains('show'))return;e.stopImmediatePropagation();if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const nodes=[...panel.querySelectorAll('button:not(:disabled)')],first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}},true);
function boardProgress(){if(DEMO.on||G.over||!['plan','combat','result'].includes(G.phase))return;const team=boardUnits();store.progress('fullteam',team.length);store.progress('gold50',Number(G.gold)||0);store.progress('gold100',Number(G.gold)||0);store.progress('dream',team.filter(u=>u.star>=3).length);const counts=typeCounts(team);store.progress('synergy',Math.max(0,...Object.values(counts)));for(const u of allUnits()){if(u.star>=2)store.progress('evolve2',1);if(u.star>=3)store.progress('evolve3',1)}store.progress('badges',(G.badges||[]).length)}
function battleStart(){if(DEMO.on)return;G._achievementStartHp=G.hp;boardProgress();const team=boardUnits();if(team.length&&team.every(u=>u.items.length))store.progress('equipped',1)}
function battleEnd(win){if(DEMO.on)return;const team=B.units.filter(u=>u.side===0),living=team.filter(u=>u.alive),r=G.round||{};if(!win)return;if(living.length===1)store.progress('survivor',1);if(r.kind==='boss'){for(const [gym,id]of [[0,'brock'],[1,'misty'],[3,'erika'],[5,'sabrina']])if(r.gym===gym)store.progress(id,1);if(G._achievementStartHp>0&&G._achievementStartHp<=20)store.progress('clutch',1);if(team.length&&living.length===team.length)store.progress('flawless',1);store.progress('badges',new Set([...(G.badges||[]),r.gym]).size)}if(r.kind==='champ'){store.progress('champion',1);if(team.length&&team.every(u=>u.L&&u.L.c<5))store.progress('accessible',1)}if(r.kind==='secret'&&G.runDiff==='hard')store.progress('legend',1)}
function migrate(){let history=[];try{history=JSON.parse(localStorage.getItem('ptft_runs_v2')||'[]')}catch(e){}if(!Array.isArray(history))return;for(const run of history){store.progress('badges',Number(run.badges)||0,true);for(const [badges,id]of [[1,'brock'],[2,'misty'],[4,'erika'],[6,'sabrina']])if(run.badges>=badges)store.progress(id,1,true);store.progress('gold50',Number(run.gold)||0,true);store.progress('gold100',Number(run.gold)||0,true);if(run.win)store.progress('champion',1,true);const us=run.last&&run.last.us||[];if(us.some(u=>u.star>=2))store.progress('evolve2',1,true);if(us.some(u=>u.star>=3))store.progress('evolve3',1,true);if(run.win&&(run.diff||run.last&&run.last.diff)==='hard'&&run.last&&/Mewtwo/i.test(run.last.foe||''))store.progress('legend',1,true)}}
const achievementSoundsPlayed=new Set();
function playAchievementSound(){
 if(CFG.mute||!(CFG.noticeVol>0)||DEMO.on)return;
 try{const ctx=playAchievementSound.ctx||(playAchievementSound.ctx=(typeof playNoticeTone==='function'&&playNoticeTone.ctx)||new (window.AudioContext||window.webkitAudioContext)());const play=()=>{if(CFG.mute||ctx.state!=='running')return;const start=ctx.currentTime+.015;[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),t=start+i*.105,end=t+(i===3?.28:.12);o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(CFG.noticeVol*.19,t+.012);g.gain.exponentialRampToValueAtTime(.0001,end);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(end+.015)});};if(ctx.state==='suspended')ctx.resume().then(play).catch(()=>{});else play()}catch(e){}
}
function notifyTick(){
 const now=performance.now(),elapsed=noticeLastTick?Math.min(1000,now-noticeLastTick):0;noticeLastTick=now;
 const event=!!(G.eventModal||STORY.on||$('#eventov'));
 const blocked=document.hidden||G.paused||$('#achievements.show')||$('#menu.show')||$('#hist.show')||$('#scores.show')||$('#battleVideoViewer.show')||!['plan','combat','result'].includes(G.phase)||DEMO.on;
 if(blocked){notification.classList.remove('show');return}
 if(activeNotice){if(noticeHadEvent&&!event)noticeRemaining=Math.max(noticeRemaining,4000);noticeHadEvent=event;if(!event)noticeRemaining-=elapsed;positionNotice();notification.classList.add('show');if(noticeRemaining<=0){notification.classList.remove('show');activeNotice=null}return}
 if(event||!queue.length)return;
 activeNotice=queue.shift();noticeRemaining=8000;noticeHadEvent=false;const d=activeNotice;notification.style.setProperty('--notice-color',d.color);notification.innerHTML='<span class="ach-toast-seal">'+icon(d)+'</span><div><small>CONQUISTA DESBLOQUEADA</small><b>'+esc(d.name)+'</b><span>'+esc(d.reward)+' · resgate no caderno</span></div>';positionNotice();notification.classList.add('show');if(!achievementSoundsPlayed.has(d.id)){achievementSoundsPlayed.add(d.id);playAchievementSound()}
}
function positionNotice(){notification.style.bottom='16px';notification.style.right='16px';const dialog=$('#eventdlg');if(dialog&&dialog.getClientRects().length){const root=stage.getBoundingClientRect(),rect=dialog.getBoundingClientRect(),scale=root.height/stage.clientHeight||1;notification.style.bottom=Math.max(16,stage.clientHeight-(rect.top-root.top)/scale+12)+'px'}}
window.addEventListener('resize',()=>{if(activeNotice)positionNotice()});
loadout.addEventListener('click',e=>{const b=e.target.closest('[data-loadout]');if(!b)return;e.stopPropagation();tab='collection';category=b.dataset.loadout;filter='all';selected=state.equipped[category];render();const next=panel.querySelector('[data-category="'+category+'"]');if(next)next.focus()});
panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.claim&&state.claimed[b.dataset.claim])announce('Recompensa resgatada! Você já pode equipá-la.');if(b.dataset.equip){const d=defs.find(x=>x.id===b.dataset.equip);announce(state.equipped[d.kind]===d.id?d.reward+' equipado.':'Cosmético removido. Visual padrão restaurado.')}});
const btn=document.createElement('div');btn.className='ti';btn.dataset.act='achievements';btn.setAttribute('role','menuitem');btn.tabIndex=-1;btn.innerHTML='<i class="tar">▶</i><span class="tl">CONQUISTAS</span>';$('#tmain .r2').appendChild(btn);btn.addEventListener('click',e=>{e.stopPropagation();open()});
if(typeof T_DESC!=='undefined')T_DESC.achievements='Consulte suas conquistas, resgate recompensas e equipe cosméticos.';
function craft(){if(DEMO.on)return;store.progress('craft',1);store.increment('crafts')}
function purchase(unit){if(DEMO.on||!unit)return;store.increment('purchases');store.remember(LINES[unit.line].ids[0]);if(unit.shiny)store.progress('shiny',1)}
window.ACH={open,boardProgress,battleStart,battleEnd,craft,purchase,title,decorate:(root,record)=>{if(record){record.trainerTitle=title();store.progress('gold50',record.gold);store.progress('gold100',record.gold)}if(!title())return;const label=document.createElement('div');label.className='ach-equipped-title';label.textContent=title();root.prepend(label)}};
migrate();refreshBadge();applyCosmetics();setInterval(()=>{boardProgress();notifyTick()},350);
})();
