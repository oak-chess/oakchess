(()=>{
 const el=document.createElement('section');el.id='startupLoader';el.setAttribute('aria-label','Carregamento do jogo');
 el.innerHTML='<div class="startup-card"><div class="startup-ball" aria-hidden="true"></div><h1>POKÉMON TFT</h1><p data-status role="status" aria-live="polite">Preparando o jogo…</p><progress max="100" value="0" aria-label="Arquivos carregados"></progress><div class="startup-count"><span data-count>Iniciando</span><b data-percent>0%</b></div><div class="startup-files" data-files aria-label="Arquivos em carregamento"></div><p class="startup-note" data-note>Na primeira visita, o carregamento pode demorar mais. Os arquivos reutilizam o cache do navegador.</p><button data-retry hidden>Tentar novamente</button></div>';
 document.body.appendChild(el);
 const status=el.querySelector('[data-status]'),bar=el.querySelector('progress'),count=el.querySelector('[data-count]'),percent=el.querySelector('[data-percent]'),retry=el.querySelector('button');
 let files=[],failed=[],done=0,running=false;
 const active=new Set(),recent=[];
 function renderFiles(){el.querySelector('[data-files]').replaceChildren(...[...active].slice(0,4).concat(active.size?[]:recent.slice(-3)).map(url=>{const row=document.createElement('div');row.textContent=url;return row}))}
 function localAsset(url){return new Promise((resolve,reject)=>{let resource;const finish=ok=>{clearTimeout(timer);if(resource instanceof HTMLAudioElement){resource.pause();resource.removeAttribute('src');resource.load()}ok?resolve():reject(Error(url))};const timer=setTimeout(()=>finish(false),30000);
 if(/\.(png|webp|jpe?g|gif|svg)$/i.test(url)){resource=new Image();resource.onload=()=>finish(true);resource.onerror=()=>finish(false);resource.src=url}
 else if(/\.(ogg|mp3|wav|m4a)$/i.test(url)){resource=new Audio();resource.preload='auto';resource.oncanplaythrough=()=>finish(true);resource.onerror=()=>finish(false);resource.src=url;resource.load()}
 else{clearTimeout(timer);resolve()}
 })}

 const dom=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
 const loaded=new Promise(resolve=>document.readyState==='complete'?resolve():window.addEventListener('load',resolve,{once:true}));
 const label=url=>/\/pmd\/|\/showdown\/|\/pokeapi\//.test(url)?'Preparando os Pokémon':/music|audio|\.(ogg|mp3|wav|m4a)$/.test(url)?'Carregando músicas e sons':/art|wallpaper|arena/.test(url)?'Carregando cenários e ilustrações':'Carregando interface e recursos';
 function update(url){const value=files.length?Math.floor(done/files.length*100):0;bar.value=value;percent.textContent=value+'%';count.textContent=done.toLocaleString('pt-BR')+' / '+files.length.toLocaleString('pt-BR')+' arquivos';if(url)status.textContent=label(url)+'…'}
 async function get(url){if(location.protocol==='file:')return localAsset(url);const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);try{const response=await fetch(url,{cache:'force-cache',signal:controller.signal});if(!response.ok)throw Error(response.status);await response.arrayBuffer()}finally{clearTimeout(timer)}}
 async function finish(){status.textContent='Finalizando a preparação…';await loaded;if(document.fonts)await document.fonts.ready;
  await Promise.all([...document.querySelectorAll('#stage img')].filter(i=>i.currentSrc||i.getAttribute('src')).map(async i=>{try{await i.decode()}catch{}}));
  if(!window.OAK_GAME_INITIALIZED){status.textContent='Não foi possível iniciar o jogo. Recarregue a página.';retry.hidden=false;retry.textContent='Recarregar página';retry.onclick=()=>location.reload();return}
  status.textContent='Tudo pronto!';document.documentElement.classList.add('ready');window.dispatchEvent(new Event('oak-startup-ready'));requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('finished');setTimeout(()=>el.remove(),450)}));
 }
 async function run(queue){if(running)return;running=true;retry.hidden=true;failed=[];let next=0;
  await Promise.all(Array.from({length:8},async()=>{while(next<queue.length){const [url]=queue[next++];active.add(url);update(url);renderFiles();try{await get(url);done++;recent.push(url);if(recent.length>3)recent.shift();update(url)}catch{failed.push([url,0])}finally{active.delete(url);renderFiles()}}}));
  running=false;if(failed.length){status.textContent=failed.length.toLocaleString('pt-BR')+' arquivos não carregaram.';el.querySelector('[data-note]').textContent='Verifique sua conexão e tente novamente para concluir o carregamento.';retry.hidden=false;retry.onclick=()=>run(failed.slice());return}await finish();
 }
 dom.then(async()=>{try{
 files=window.OAK_STARTUP_FILES;
 if(!Array.isArray(files)||!files.length)throw Error('Lista de recursos ausente');
 if(location.protocol==='file:'){files=files.filter(([url])=>/\.(png|webp|jpe?g|gif|svg|ogg|mp3|wav|m4a)$/i.test(url));el.querySelector('[data-note]').textContent='Modo local: preparando imagens e sons. Os demais arquivos são lidos diretamente da pasta do jogo.'}
 update();await run(files)
 }catch(error){status.textContent='Falha ao preparar o carregamento: '+error.message;retry.hidden=false;retry.onclick=()=>location.reload()}});
})();
