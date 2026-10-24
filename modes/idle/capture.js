/* Route encounters and capture management for the isolated idle prototype. */
window.createIdleCapture = function ({state, lines, sprite, save, changed, notify, reserveSlot, maxHpFor, onAttempt, maxRoster, openPC}) {
 const captureInbox=window.IDLE_CAPTURE_INBOX={events:[],total:0};
  state.ballStock=state.ballStock||{};
  const defaults={ball:'poke',duplicates:'keep',enabled:true,mode:'new',reserve:5,limit:20,used:0,offline:false};
  state.capture={...defaults,...state.capture};if(!window.IDLE_ITEMS.balls[state.capture.ball])state.capture.ball='poke';state.captureShiny={ball:'ultra',duplicates:'keep',enabled:true,mode:'all',reserve:0,limit:20,used:0,offline:false,prioritize:true,...state.captureShiny};if(!window.IDLE_ITEMS.balls[state.captureShiny.ball])state.captureShiny.ball='ultra';state.captureShiny.duplicates='keep';state.captureShiny.offline=false;state.captureShiny.reserves=state.captureShiny.reserves||{[state.captureShiny.ball]:state.captureShiny.reserve};
  state.capture.reserves=state.capture.reserves||{[state.capture.ball]:state.capture.reserve};
  for(const [config,fallback]of [[state.capture,'poke'],[state.captureShiny,'ultra']])if(window.IDLE_ITEMS.balls[config.ball]?.locked){config.reserves[config.ball]=config.reserve;config.ball=fallback;config.reserve=config.reserves[fallback]||0}
  state.balls=Number.isFinite(state.balls)?Math.max(0,state.balls):25;
  state.captureResearch=state.captureResearch||[0,0,0];
  state.captureLog=state.captureLog||[];
  state.collection=state.collection||[];
  state.captureFavorites=state.captureFavorites||[];
  state.discovered=Array.from(new Set([...(state.discovered||[]),...state.team.map(m=>m.name)]));
  state.safeAreas=state.safeAreas||[];
  const specs=[
    [['Caterpie','common'],['Weedle','common'],['Pidgey','common'],['Oddish','uncommon'],['Abra','rare']],
    [['Geodude','common'],['Sandshrew','common'],['Machop','uncommon'],['Onix','uncommon'],['Clefairy','rare']],
    [['Psyduck','common'],['Poliwag','common'],['Magikarp','common'],['Squirtle','uncommon'],['Dratini','rare']]
  ];
  const routes=specs.map(entries=>entries.map(([name,rarity])=>({line:lines.find(l=>!l.boss&&l.names.includes(name)),rarity})).filter(e=>e.line).filter((e,i,a)=>a.findIndex(x=>x.line.i===e.line.i)===i));
  const rarityName={common:'Comum',uncommon:'Incomum',rare:'Raro'};
  let activeTab='habitat',root,habitatProvider,objectiveProvider;const poolFor=()=>habitatProvider?habitatProvider():routes[state.area]||routes[0];
  const known=(name,shiny=false)=>[...state.team,...state.collection].some(m=>m.name===name&&(m.shiny===true)===shiny);
  function owned(name){return state.team.find(m=>m.name===name)||state.collection.find(m=>m.name===name)}
  const favorite=name=>state.captureFavorites.includes(name);
  const eligible=(name,config=state.capture)=>config.mode==='all'||(config.mode==='new'&&!known(name,config===state.captureShiny))||(config.mode==='favorites'&&favorite(name));
  const budget=(config=state.capture)=>window.IDLE_ITEMS.balls[config.ball]?.locked?0:Math.max(0,window.IDLE_ITEMS.stock(state,config.ball)||0);
  for(const config of [state.capture,state.captureShiny]){config.enabled=true;config.mode='all';config.reserve=0}
  const attemptedUnits=new WeakSet();
  function record(name,result,offline=false,details={}){const event={name,result,offline,time:Date.now(),...details};state.captureLog.unshift(event);state.captureLog=state.captureLog.slice(0,200);return event}
  function availableSlot(){const occupied=new Set(state.team.filter(m=>m.pos?.z==='n').map(m=>m.pos.i));for(let i=0;i<9;i++)if(!occupied.has(i))return i;return -1}
  function grant(name,offline,genes,caughtLevel){
    const speciesLine=lines.find(l=>l.names.includes(name)),baseName=speciesLine?.names[0]||name,caughtStar=Math.max(1,(speciesLine?.names.indexOf(name)??0)+1);
    state.fieldNotes=state.fieldNotes||{defeated:{},captured:{},contract:null,claims:0};state.fieldNotes.captured[name]=(state.fieldNotes.captured[name]||0)+1;
    const existing=owned(baseName);
    if(existing&&!genes?.shiny&&state.capture.duplicates==='candies'){existing.candy=(existing.candy||0)+1;record(name,'+1 doce',offline);return name+': +1 doce.'}
    const member={name:baseName,level:Math.max(1,Math.floor(caughtLevel||state.trainerLevel)),star:caughtStar,xp:0,candy:0,items:[],condition:1,quality:Math.round((.95+Math.random()*.1)*100)/100,caughtAt:Date.now()};
    Object.assign(member,genes||window.IDLE_INDIVIDUALS.roll(speciesLine,Date.now()+':capture:'+Math.random(),false));member.ivs={...member.ivs};
    const slot=offline?-1:availableSlot();
    if(state.team.length<(maxRoster?.()||15)&&slot>=0){member.pos={z:'n',i:slot};state.team.push(member);record(name,'Novo parceiro · banco',offline)}
    else{state.collection.push(member);record(name,'Novo parceiro · PC',offline)}
    return name+' capturado!'+(member.pos?' Foi para o banco.':' Foi para o PC do Centro Pokémon, sem ocupar a arena.');
  }
  function attempt(entry,offline=false){
    const name=entry.speciesName||entry.line.names[0],isShiny=entry.genes?.shiny===true,settings=isShiny?state.captureShiny:state.capture,chosen=budget(settings)>0?settings.ball:null,config={...settings,ball:chosen||settings.ball},history={speciesId:entry.line.ids[Math.max(0,entry.line.names.indexOf(name))],shiny:entry.genes?.shiny===true,area:state.area,hunt:state.hunts?.kind,wave:state.hunts?.wave,potency:entry.genes?.potency??null,ivTotal:entry.genes?.ivs?window.IDLE_INDIVIDUALS.total(entry.genes):null};
    if(!state.discovered.includes(name))state.discovered.push(name);
    if(!chosen){record(name,'Sem tentativa · bola selecionada indisponível',offline,{...history,status:'skipped',attempted:false});return name+' derrotado. A bola selecionada está sem estoque ou bloqueada. Nenhuma outra bola foi consumida.'}
    const chance=window.IDLE_SHINY.chance(state,entry.line,maxHpFor?.(entry.line,entry.line.names.indexOf(name)+1)||100,isShiny,config,history.speciesId);if(chance===null){record(name,'Taxa não cadastrada · sem consumo de bola',offline,{...history,status:'skipped',attempted:false});return 'Taxa de captura desta espécie não cadastrada; nenhuma bola foi usada.';}
    const ballKey=config.ball,ballItem=window.IDLE_ITEMS.balls[ballKey],ballName=ballItem.name;if(ballKey==='poke')state.balls--;else state.ballStock[ballKey]--;settings.used=(settings.used||0)+1;state.capture.lastSpent=(state.capture.lastSpent||0)+ballItem.price;state.capture.lastAttempts=(state.capture.lastAttempts||0)+1;state.capture.lastBall=ballKey;state.capture.lastVariant=isShiny?'shiny':'normal';state.capture.lastAttemptAt=Date.now();
    const success=Math.random()<chance;if(!offline)try{onAttempt?.({name,targetPoint:entry.targetPoint,success,converted:!isShiny&&config.duplicates==='candies'&&!!owned(entry.line.names[0]),sentToPC:state.team.length>=(maxRoster?.()||15)||availableSlot()<0,ballName,ballSprite:'assets/pokeapi/sprites/items/'+ballItem.sprite+'.png',pokemonSprite:window.IDLE_SHINY.sprite(sprite(entry.line.ids[Math.max(0,entry.line.names.indexOf(name))]),isShiny)})}catch(error){console.warn('Efeito de captura indisponível:',error)}
    if(success){state.capture.lastCaught=(state.capture.lastCaught||0)+1;const result=grant(name,offline,entry.genes,entry.level);Object.assign(state.captureLog[0],history,{status:'caught',attempted:true,ball:ballKey,chance,converted:state.captureLog[0].result.includes('doce'),destination:state.captureLog[0].result.includes('PC')?'pc':state.captureLog[0].result.includes('banco')?'bench':'candies'});state.captureLog[0].result+=' · '+ballName+' · '+(chance*100).toFixed(1)+'%';captureInbox.total++;captureInbox.events.unshift({...state.captureLog[0],level:entry.level});captureInbox.events=captureInbox.events.slice(0,20);if(entry.rarity==='rare')state.captureResearch[state.area]=0;return result}
    record(name,'Escapou · 1 '+ballName+' usada · '+(chance*100).toFixed(1)+'%',offline,{...history,status:'escaped',attempted:true,ball:ballKey,chance});
    return name+' escapou. A pesquisa de raros foi preservada.';
  }
  function encounterWeight(e){return (objectiveProvider?.().name==='Busca de espécies'&&favorite(e.line.names[0])?8:e.weight)||(e.rarity==='common'?6:e.rarity==='uncommon'?2:1)}
  function encounter(){
    const pool=poolFor(),chosen=[],rare=pool.find(e=>e.rarity==='rare');
    if(state.captureResearch[state.area]>=8&&rare)chosen.push(rare);
    while(chosen.length<3){const available=pool.filter(e=>!chosen.some(p=>p.line.i===e.line.i));if(!available.length)break;const weighted=available.flatMap(e=>Array(encounterWeight(e)).fill(e));chosen.push(weighted[Math.floor(Math.random()*weighted.length)]||available[0])}
    state.encounterGenes=chosen.map(e=>window.IDLE_INDIVIDUALS.roll(e.line));const shinyIndex=state.encounterGenes.findIndex(g=>g.shiny);if(shinyIndex>=0)notify('✦ Shiny encontrado: '+(chosen[shinyIndex].speciesName||chosen[shinyIndex].line.names[0])+'!');return chosen.map(e=>e.speciesName||e.line.names[0]);
  }
  function defeated(unit,targetPoint){
    if(!unit||unit.side!==1||unit.alive||attemptedUnits.has(unit))return null;attemptedUnits.add(unit);
    const name=unit.L.names[(unit.star||1)-1]||unit.L.names[0],pool=poolFor(),entry=pool.find(e=>(e.speciesName||e.line.names[0])===name)||{line:unit.L,speciesName:name,rarity:'common'};
    const result=attempt({...entry,speciesName:name,level:unit._idleLevel||entry.level,genes:unit._idleCaptureGenes||window.IDLE_INDIVIDUALS.roll(unit.L),targetPoint});save({capture:false});return result;
  }
  function victory(){
    if(!state.safeAreas.includes(state.area))state.safeAreas.push(state.area);
    state.captureResearch[state.area]=Math.min(8,state.captureResearch[state.area]+1);
    return 'Captura tentada individualmente nos selvagens derrotados, conforme o estoque de bolas.';
  }
  function offline(hours){
    if(!state.capture.offline||!state.capture.enabled||!state.safeAreas.includes(state.area))return '';
    const max=Math.min(Math.floor(Math.min(8,hours)*12),budget());
    if(max<1)return '';
    let caught=0;
    for(let i=0;i<max;i++){
      const pool=poolFor().filter(e=>e.rarity!=='rare'&&eligible(e.line.names[0]));
      if(!pool.length||budget()<=0)break;
      const before=state.captureLog.length?state.captureLog[0]:null;
      const entry=pool[Math.floor(Math.random()*pool.length)];attempt({...entry,genes:window.IDLE_INDIVIDUALS.roll(entry.line,Date.now()+':offline:'+i+':'+Math.random(),false)},true);
      if(state.captureLog[0]!==before&&state.captureLog[0].status==='caught')caught++;
    }
    return ' Captura offline: '+caught+' sucessos. Novos parceiros estão no PC.';
  }
  function commit(){save();changed();render()}
  function button(label,action,cls=''){const b=document.createElement('button');b.type='button';b.className='idle-capture-button '+cls;b.textContent=label;b.onclick=action;return b}
  function mount(panel){
    root=panel;panel.innerHTML='<header><div><small>EXPLORAR · ENCONTRAR · CAPTURAR</small><h2>Captura</h2></div><button class="idle-window-close" aria-label="Fechar captura">✕</button></header><div class="idle-capture-summary"><span id="capture-stock"></span><span id="capture-budget"></span></div><nav class="idle-capture-tabs" aria-label="Painéis de captura"></nav><div id="idle-capture-content"></div>';
    panel.querySelector('.idle-window-close').onclick=()=>panel.hidden=true;
    for(const [tab,title]of [['habitat','Habitantes da rota'],['history','Últimas capturas']])panel.querySelector('nav').append(button(title,()=>{activeTab=tab;render()},'capture-tab-'+tab));
    render();
  }
  function renderSettings(content,shiny=false){
    const config=shiny?state.captureShiny:state.capture,form=document.createElement('div');form.className='idle-capture-settings';content.append(form);
    const intro=document.createElement('p');intro.textContent='Uma tentativa por Pokémon selvagem derrotado, durante a luta. Sem limite de tentativas, reserva ou filtro de espécies. Cada tentativa consome uma bola; a captura depende da chance da espécie.';form.append(intro);
    const label=document.createElement('label');label.textContent=shiny?'Bola selecionada para shiny':'Bola selecionada para normais';const select=document.createElement('select');for(const [key,item]of Object.entries(window.IDLE_ITEMS.balls)){const o=document.createElement('option');o.value=key;o.disabled=!!item.locked;o.selected=config.ball===key;o.textContent=item.name+' ×'+window.IDLE_ITEMS.stock(state,key)+(item.locked?' · bloqueada':'');select.append(o)}select.onchange=()=>{if(window.IDLE_ITEMS.balls[select.value]?.locked)return;config.ball=select.value;commit()};label.append(select);form.append(label);
    const fallback=document.createElement('p');fallback.textContent='Usa somente a bola selecionada para normal ou shiny. Sem estoque, a tentativa não acontece e nenhuma outra bola é consumida. A Master Ball permanece bloqueada para eventos.';form.append(fallback);
    if(!shiny){const row=document.createElement('label');row.textContent='Capturas repetidas';const duplicate=document.createElement('select');for(const [key,text]of [['keep','Guardar no PC ou banco'],['candies','Converter em doces']]){const o=document.createElement('option');o.value=key;o.textContent=text;o.selected=config.duplicates===key;duplicate.append(o)}duplicate.onchange=()=>{config.duplicates=duplicate.value;commit()};row.append(duplicate);form.append(row);const offline=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=config.offline;check.onchange=()=>{config.offline=check.checked;commit()};offline.append(check,document.createTextNode('Permitir capturas offline'));form.append(offline)}
    const note=document.createElement('p');note.textContent=shiny?'Shiny: 0,0122% por aparição online; captura com ¼ da chance normal, limitada a 25%. Nunca é convertido em doces.':'Captura simula o alvo com 1 PS e sem status, com a fórmula da Geração III. Offline continua limitado ao período simulado de até 8 horas.';form.append(note);
  }
  function renderHabitat(content){
      const intro=document.createElement('p');intro.textContent='Os Pokémon abaixo habitam esta região. Vença encontros para descobri-los; cada selvagem derrotado recebe uma tentativa enquanto houver estoque da bola selecionada.';content.append(intro);
      const grid=document.createElement('div');grid.className='idle-habitat-grid';content.append(grid);
      for(const entry of poolFor()){
        const family=entry.line.names[0],name=entry.speciesName||family,form=Math.max(0,entry.line.names.indexOf(name)),seen=state.discovered.includes(family),have=known(family);
        const card=document.createElement('article');card.className='idle-habitat-card'+(seen?'':' undiscovered');
        const rarity=document.createElement('small');rarity.textContent=rarityName[entry.rarity];rarity.dataset.rarity=entry.rarity;
        const image=document.createElement('img');image.src=sprite(entry.line.ids[form]);image.alt=seen?name:'Espécie não descoberta';
        const title=document.createElement('b');title.textContent=seen?name:'Não descoberto';
        const status=document.createElement('span');status.textContent=have?'Na coleção':seen?'Encontrado':'Explore para descobrir';
        const chance=document.createElement('span');chance.className='idle-capture-chance';chance.textContent='Chance com '+window.IDLE_ITEMS.selectedBall(state).name+': '+((window.IDLE_ITEMS.chance(state,entry.line,maxHpFor?.(entry.line,Math.max(0,entry.line.names.indexOf(entry.speciesName))+1)||100,entry.line.ids[Math.max(0,entry.line.names.indexOf(entry.speciesName))])??0)*100).toFixed(1)+'%';const shinyChance=document.createElement('span');shinyChance.textContent='Shiny com '+window.IDLE_ITEMS.balls[state.captureShiny.ball].name+': '+((window.IDLE_SHINY.chance(state,entry.line,maxHpFor?.(entry.line)||100,true,state.captureShiny,entry.line.ids[Math.max(0,entry.line.names.indexOf(entry.speciesName))])??0)*100).toFixed(1)+'%';const total=poolFor().reduce((n,e)=>n+encounterWeight(e),0),encounterChance=document.createElement('span');encounterChance.textContent='Peso de encontro: '+encounterWeight(entry)+' / '+total+' · pesquisa pode garantir raro';const info=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Chance e prioridade';info.append(summary,chance,shinyChance,encounterChance,button(favorite(family)?'★ Priorizado':'☆ Priorizar',()=>{state.captureFavorites=favorite(family)?state.captureFavorites.filter(x=>x!==family):[...state.captureFavorites,family];commit();content.replaceChildren();renderHabitat(content)}));card.append(rarity,image,title,status,info);grid.append(card);
      }
      const research=document.createElement('div');research.className='idle-research';research.textContent='Pesquisa de raros: '+state.captureResearch[state.area]+'/8 vitórias. Após 8 vitórias, o próximo encontro inclui um raro. A captura continua dependendo da espécie e da bola selecionada. Progresso não é perdido por falta de bolas.';content.append(research);
  }
  function render(){
    if(!root)return;
    root.querySelector('#capture-stock').textContent=window.IDLE_ITEMS.selectedBall(state).name+' ×'+window.IDLE_ITEMS.stock(state,state.capture.ball);
    root.querySelector('#capture-budget').textContent=budget()+' bolas disponíveis · tentativas sem limite';
    for(const tab of ['habitat','history'])root.querySelector('.capture-tab-'+tab).setAttribute('aria-pressed',String(tab===activeTab));
    const content=root.querySelector('#idle-capture-content');content.replaceChildren();
    if(activeTab==='habitat'){
      renderHabitat(content);
    }else{
      if(!state.captureLog.length){const p=document.createElement('p');p.textContent='Nenhuma tentativa ainda. Inicie uma expedição para encontrar Pokémon.';content.append(p)}
      const list=document.createElement('div');list.className='idle-capture-history';content.append(list);
      for(const event of state.captureLog.slice(0,20)){const row=document.createElement('div'),L=lines.find(l=>l.names[0]===event.name),image=document.createElement('img');if(L)image.src=sprite(L.ids[0]);image.alt='';const words=document.createElement('span'),title=document.createElement('b'),detail=document.createElement('small');title.textContent=event.name;detail.textContent=event.result+(event.offline?' · Offline':'');words.append(title,detail);row.append(image,words);list.append(row)}
      if(state.collection.length)content.append(button('Abrir PC · '+state.collection.length+' Pokémon guardados',()=>openPC()));
    }
  }
  return {setHabitat(provider,objectives){habitatProvider=provider;objectiveProvider=objectives},mount,render,renderHabitat,renderSettings,encounter,victory,defeated,offline,start(){state.capture.used=0;state.captureShiny.used=0;state.capture.lastSpent=0;state.capture.lastAttempts=0;state.capture.lastCaught=0},routes};
};
