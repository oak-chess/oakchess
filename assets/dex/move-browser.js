/* Standalone move catalog. Does not assign moves to species or combat units. */
(()=>{
 const dex=document.getElementById('pokedex');if(!dex)return;
 const button=document.createElement('button');button.textContent='Catálogo de golpes';button.type='button';button.dataset.moveCatalog='open';dex.querySelector('.dex-tabs').append(button);
 const view=document.createElement('section');view.className='dex-move-library';view.hidden=true;
 view.innerHTML='<div class="dex-move-library-tools"><input type="search" aria-label="Buscar golpe" placeholder="Nome ou número do golpe…"><select aria-label="Disponibilidade do efeito"><option value="all">Todos os golpes</option><option value="adapted">Efeito adaptado</option><option value="pending">Pendente de importação</option></select></div><p class="dex-note">Consulta independente do elenco. Os nomes seguem a fonte em inglês. Efeito adaptado não representa reprodução integral do jogo original.</p><div class="dex-move-library-grid"><div data-move-list></div><article data-move-detail></article></div><nav class="dex-move-library-pages"><button data-prev>‹ Anterior</button><span data-page></span><button data-next>Próxima ›</button></nav>';
 dex.querySelector('.dex-window').insertBefore(view,dex.querySelector('footer'));
 // Script sprite anchors control GBA draw priority, not the receiving battler.
 function effectRecipient(move,event){
  const args=event?.args||[],selector=args.find(value=>/^ANIM_(?:TARGET|ATTACKER)$/.test(value));
  if(selector)return selector==='ANIM_ATTACKER'?'user':'target';
  const callback=window.EMERALD_CATALOG?.templates[event?.sprite]?.callback||'';
  if(/Charge|Gather|Warm|Focus|Prepare|Meditat|SwordsDance/i.test(callback+' '+(event?.sprite||'')))return 'user';
  return [4,5,7,13].includes(move.targetId)?'user':'target';
 }
 const catalog=window.DEX_MOVE_CATALOG||[];let page=0,selected=null,renderer=null,raf=0,session=0,actorSpecies=null;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function stop(){session++;cancelAnimationFrame(raf);renderer?.clear()}
 function detail(move){stop();selected=move;const type=typeof TYPES!=='undefined'?TYPES[move.type]:null;
  view.querySelector('[data-move-detail]').innerHTML='<small>#'+move.id+' · Geração '+move.generation+'</small><h3>'+esc(move.name)+'</h3><p>'+esc(type?.n||move.type)+' · '+move.category+'</p><div class="dex-stats"><span><b>'+(move.power??'—')+'</b> Poder</span><span><b>'+(move.accuracy==null?'—':move.accuracy+'%')+'</b> Precisão</span></div><p><b>'+(move.status==='adapted'?'Efeito adaptado':'Pendente de importação')+'</b></p><p class="dex-note">'+(move.status==='adapted'?(move.expansionSequence?'Sequência da expansão adaptada com sprites locais. Movimentos de câmera, tarefas C e sons originais não são reproduzidos nesta prévia.':'Recursos locais do Emerald com execução adaptada ao OakChess.'):'O registro do golpe foi catalogado. A animação completa ainda não foi importada.')+'</p>'+(move.status==='adapted'?'<canvas width="440" height="220" aria-label="Prévia do efeito"></canvas><button data-play-effect>▶ Ver efeito</button><p data-effect-status class="dex-note"></p>':'')+'<p class="dex-note">Fonte de dados: PokéAPI. Fonte visual: '+(move.localKey?'pret/pokeemerald':'rh-hideout/pokeemerald-expansion')+'. Nenhuma alteração nos golpes do elenco.</p>';
  view.querySelector('[data-play-effect]')?.addEventListener('click',play);
  view.querySelector('[data-move-detail]').scrollTop=0;
  const token=session;if(move.status==='adapted')requestAnimationFrame(()=>{if(token===session&&!view.hidden)play()});
 }
 async function play(){
  stop();const token=session,box=view.querySelector('[data-effect-status]'),canvas=view.querySelector('canvas'),move=selected;if(!canvas)return;
  const ctx=canvas.getContext('2d');box.textContent='Preparando Pokémon e efeito…';
  view.querySelector('[data-play-effect]').disabled=true;
  try{
   if(!window.CREATE_EMERALD_RENDERER)throw Error('Renderizador de efeitos indisponível');
   renderer=window.CREATE_EMERALD_RENDERER();
   const species=actorSpecies||+(Object.entries(window.DEX_LEARNSETS||{}).find(([,entry])=>entry.moves.some(row=>row[0]===move.id))?.[0]||25);
   const meta=(window.DEX_EXPANSION||[]).find(e=>e.id===species),form=meta?.forms.find(f=>!f.shiny)||meta?.forms[0],local=window.DEX_PMD_LOCAL?.[form?.path];
   const actor=new Image(),target=new Image(),attackImage=local?.attack?new Image():null;if(attackImage)attackImage.src=local.attack.sheet;actor.src=local?.sheet||'assets/pokeapi/sprites/pokemon/'+species+'.png';target.src='assets/pokeapi/sprites/pokemon/35.png';
   await Promise.race([Promise.all([actor.decode(),target.decode(),renderer.ready(),attackImage?attackImage.decode().catch(()=>null):Promise.resolve()]),new Promise((_,reject)=>setTimeout(()=>reject(Error('Os arquivos demoraram a carregar. Tente repetir.')),12000))]);
   if(token!==session)return;
   const base=move.localKey?window.EMERALD_CATALOG?.moves[move.localKey]:null,sequence=move.expansionSequence||base;
   const reference=move.localKey||move.key;
   const beamMove=!!move.localKey&&/^(FLAMETHROWER|ICE_BEAM|HYPER_BEAM|SOLAR_BEAM|AURORA_BEAM|PSYBEAM|BUBBLE_BEAM|SIGNAL_BEAM|DRAGON_BREATH)$/.test(reference);
   const support=[4,5,7,13].includes(move.targetId);
   const raw=beamMove?[]:sequence?.events||[],first=raw[0]?.t||0;
   const phases=window.CREATE_EMERALD_SEQUENCES?.(renderer),projectiles=[];
   const events=raw.filter(e=>renderer.availableTemplate(e.sprite)).map(e=>({...e,at:.55+Math.max(0,e.t-first)}));
   let taskPending=!events.length,elapsed=0,last=performance.now(),shown=false;
   const end=Math.max(3,Math.min(12,(events.at(-1)?.at||1)+1.8));
   const durations=local?.durations||[8],total=durations.reduce((a,b)=>a+b,0);
   const drawActor=()=>{const phase=elapsed%end,lunge=phase>.22&&phase<.75?Math.sin((phase-.22)/.53*Math.PI)*35:0;ctx.save();ctx.imageSmoothingEnabled=false;
    if(local){const attacking=elapsed>.2&&elapsed<1.3&&attackImage?.naturalWidth,frameData=attacking?local.attack:local,sheet=attacking?attackImage:actor,ds=frameData.durations.length?frameData.durations:[8],sum=ds.reduce((a,b)=>a+b,0);let t=attacking?Math.min(sum-1,Math.floor((elapsed-.2)*60)):Math.floor(elapsed*60)%sum,index=0;while(index<ds.length-1&&t>=ds[index])t-=ds[index++];index=Math.min(index,Math.floor(sheet.naturalWidth/frameData.w)-1);const size=Math.min(108/local.w,108/local.h),row=sheet.naturalHeight>=frameData.h*8?2:0;ctx.drawImage(sheet,index*frameData.w,row*frameData.h,frameData.w,frameData.h,70+lunge-frameData.w*size/2,192-frameData.h*size,frameData.w*size,frameData.h*size)}
    else ctx.drawImage(actor,16+lunge,87,108,108);
    ctx.drawImage(target,275,100,96,96);ctx.restore();
   };
   box.textContent=(meta?.name||'Pokémon')+' · preparação → execução → efeito'+(move.expansionSequence?' · adaptação visual':'');
   view.querySelector('[data-play-effect]').textContent='↻ Repetir ataque';
   function frame(now){if(token!==session||view.hidden||!dex.classList.contains('show'))return;
    try{const dt=Math.min(.05,(now-last)/1000);last=now;elapsed+=dt;ctx.clearRect(0,0,440,220);ctx.fillStyle='#0d232e';ctx.fillRect(0,0,440,220);ctx.fillStyle='#29474e';for(const x of [70,320]){ctx.beginPath();ctx.ellipse(x,185,48,12,0,0,Math.PI*2);ctx.fill()}drawActor();
     while(events.length&&events[0].at<=elapsed){const e=events.shift(),origin=effectRecipient(move,e)==='user',x=origin?90:320,y=150;if(!support&&phases?.phase(e)==='travel'){projectiles.push({started:elapsed,x:90,y:150,dir:0,age:0,size:1.4,type:move.type,o:{move:{n:move.name,emerald:reference,t:move.type,k:'bolt'}}})}else shown=renderer.emitTemplate(e.sprite,x,y,1.8,0,0)||shown}
     if(taskPending&&elapsed>.55){taskPending=false;const mv={n:move.localKey,emerald:move.localKey,t:move.type,k:support?'buff':beamMove?'beam':'burst'};shown=(beamMove?renderer.beam(mv,110,140,320,150,28):support?renderer.start(mv,90,150):renderer.hit(mv,320,150,1.6))||shown}
     renderer.update(dt);for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i],progress=Math.min(1,(elapsed-p.started)/.42);p.x=90+230*progress;p.age=elapsed-p.started;shown=renderer.projectile(ctx,p)||shown;if(progress===1){projectiles.splice(i,1);shown=renderer.hit(p.o.move,320,150,1.2)||shown}}renderer.draw(ctx);
     if(elapsed<end)raf=requestAnimationFrame(frame);else box.textContent=shown?'Ataque concluído. Clique em Repetir ataque para ver novamente.':'Este golpe ainda precisa de adaptação visual. A animação do Pokémon foi demonstrada.';
    }catch(error){box.textContent='Não foi possível reproduzir este efeito: '+error.message}
   }raf=requestAnimationFrame(frame);
  }catch(error){if(token===session)box.textContent=error.message}
  finally{if(token===session){const repeat=view.querySelector('[data-play-effect]');if(repeat)repeat.disabled=false}}
 }

 function render(){stop();const text=view.querySelector('input').value.toLowerCase(),status=view.querySelector('select').value,filtered=catalog.filter(m=>(!text||m.name.toLowerCase().includes(text)||String(m.id).includes(text))&&(status==='all'||m.status===status)),pages=Math.max(1,Math.ceil(filtered.length/40));page=Math.max(0,Math.min(page,pages-1));const visible=filtered.slice(page*40,page*40+40);
  view.querySelector('[data-move-list]').innerHTML=visible.map(m=>'<button data-move="'+m.id+'"><b>'+esc(m.name)+'</b><small>'+(m.status==='adapted'?'Adaptado':'Pendente')+' · '+esc(m.type)+'</small></button>').join('')||'<p>Nenhum golpe neste filtro.</p>';
  view.querySelector('[data-page]').textContent=(page+1)+' / '+pages+' · '+filtered.length+' golpes';view.querySelector('[data-prev]').disabled=page===0;view.querySelector('[data-next]').disabled=page===pages-1;
  if(visible.length)detail(visible.find(m=>m.id===selected?.id)||visible[0]);else view.querySelector('[data-move-detail]').replaceChildren();
 }
 window.DEX_MOVE_LIBRARY={open(id,species){actorSpecies=species||null;button.click();const move=catalog.find(m=>m.id===id);if(move)detail(move)}};
 button.onclick=()=>{dex.classList.add('dex-library-open');view.hidden=false;button.setAttribute('aria-pressed','true');render()};
 dex.querySelectorAll('[data-tab]').forEach(tab=>tab.addEventListener('click',()=>{stop();view.hidden=true;dex.classList.remove('dex-library-open');button.setAttribute('aria-pressed','false')}));
 view.querySelector('input').oninput=view.querySelector('select').onchange=()=>{page=0;render()};view.querySelector('[data-prev]').onclick=()=>{page--;render()};view.querySelector('[data-next]').onclick=()=>{page++;render()};
 view.onclick=e=>{const b=e.target.closest('[data-move]');if(b)detail(catalog.find(m=>m.id===+b.dataset.move))};
 new MutationObserver(()=>{if(!dex.classList.contains('show')&&!view.hidden){stop();view.hidden=true;dex.classList.remove('dex-library-open')}}).observe(dex,{attributes:true,attributeFilter:['class']});
})();
