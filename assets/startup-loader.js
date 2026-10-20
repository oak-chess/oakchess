(()=>{
 const el=document.createElement('section');el.id='startupLoader';el.setAttribute('aria-label','Carregamento do jogo');
 el.innerHTML='<div class="startup-card"><div class="startup-ball" aria-hidden="true"></div><h1>POKÉMON TFT</h1><p data-status role="status" aria-live="polite">Preparando o jogo…</p><progress max="100" value="0" aria-label="Arquivos carregados"></progress><div class="startup-count"><span data-count>Iniciando</span><b data-percent>0%</b></div><div class="startup-files" data-files aria-label="Arquivos em carregamento"></div><p class="startup-note" data-note>Preparando a tela inicial. Pokémon, golpes e cenários adicionais carregam conforme você joga.</p><button data-retry hidden>Tentar novamente</button><button data-continue hidden>Entrar no jogo</button></div>';
 document.body.appendChild(el);
 const status=el.querySelector('[data-status]'),bar=el.querySelector('progress'),count=el.querySelector('[data-count]'),percent=el.querySelector('[data-percent]'),retry=el.querySelector('button');
 let files=[],failed=[],done=0,running=false;
 const active=new Set(),recent=[];
 function renderFiles(){el.querySelector('[data-files]').replaceChildren(...[...active].slice(0,4).concat(active.size?[]:recent.slice(-3)).map(url=>{const row=document.createElement('div');row.textContent=url;return row}))}
 function localAsset(url){return new Promise((resolve,reject)=>{let resource;const finish=ok=>{clearTimeout(timer);if(resource instanceof HTMLAudioElement){resource.pause();resource.removeAttribute('src');resource.load()}ok?resolve():reject(Error(url))};const timer=setTimeout(()=>finish(false),10000);
 if(/\.(png|webp|jpe?g|gif|svg)$/i.test(url)){resource=new Image();resource.onload=()=>finish(true);resource.onerror=()=>finish(false);resource.src=url}
 else if(/\.(ogg|mp3|wav|m4a)$/i.test(url)){resource=new Audio();resource.preload='auto';resource.oncanplaythrough=()=>finish(true);resource.onerror=()=>finish(false);resource.src=url;resource.load()}
 else{clearTimeout(timer);resolve()}
 })}

 const dom=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
 // Only resources visible on entry belong in the blocking queue. The full
 // manifest remains an inventory, never a request to download the whole game.
 function entryFiles(){
  const urls=new Set(),add=value=>{try{const url=new URL(value,location.href);if(url.origin===location.origin&&!url.protocol.startsWith('data'))urls.add(url.href)}catch{}};
  for(const node of document.querySelectorAll('#stage, #stage *')){
   if(!node.getClientRects().length||getComputedStyle(node).visibility==='hidden')continue;
   if(node.tagName==='IMG'&&(node.currentSrc||node.getAttribute('src')))add(node.currentSrc||node.getAttribute('src'));
   for(const pseudo of [null,'::before','::after']){
    const style=getComputedStyle(node,pseudo);
    if(pseudo&&(style.content==='none'||style.content==='normal'))continue;
    for(const match of style.backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))add(match[1]);
   }
  }
  return [...urls].map(url=>[url,0]);
 }

 const label=url=>/\/pmd\/|\/showdown\/|\/pokeapi\//.test(url)?'Preparando os Pokémon':/music|audio|\.(ogg|mp3|wav|m4a)$/.test(url)?'Carregando músicas e sons':/art|wallpaper|arena/.test(url)?'Carregando cenários e ilustrações':'Carregando interface e recursos';
 function update(url){const value=files.length?Math.floor(done/files.length*100):0;bar.value=value;percent.textContent=value+'%';count.textContent=done.toLocaleString('pt-BR')+' / '+files.length.toLocaleString('pt-BR')+' arquivos';if(url)status.textContent=label(url)+'…'}
 async function get(url,attempt=0){if(location.protocol==='file:')return localAsset(url);const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{const response=await fetch(url,{cache:attempt?'reload':'force-cache',signal:controller.signal});if(!response.ok)throw Error(response.status);await response.arrayBuffer()}finally{clearTimeout(timer)}}
 async function finish(){status.textContent='Finalizando a preparação…';if(document.fonts)await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,2500))]);
  await Promise.all([...document.querySelectorAll('#stage img')].filter(i=>i.getClientRects().length&&(i.currentSrc||i.getAttribute('src'))).map(async i=>{try{await Promise.race([i.decode(),new Promise(resolve=>setTimeout(resolve,2500))])}catch{}}));
  if(!window.OAK_GAME_INITIALIZED){status.textContent='Não foi possível iniciar o jogo. Recarregue a página.';retry.hidden=false;retry.textContent='Recarregar página';retry.onclick=()=>location.reload();return}
  status.textContent='Tudo pronto!';document.documentElement.classList.add('ready');window.dispatchEvent(new Event('oak-startup-ready'));requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('finished');setTimeout(()=>el.remove(),450)}));
 }
 async function run(queue){if(running)return;running=true;retry.hidden=true;el.querySelector('[data-continue]').hidden=true;failed=[];let next=0;
  await Promise.all(Array.from({length:8},async()=>{while(next<queue.length){const [url]=queue[next++];active.add(url);update(url);renderFiles();try{let success=false,lastError;for(let attempt=0;attempt<2&&!success;attempt++){try{await get(url,attempt);success=true}catch(error){lastError=error}}if(!success)throw lastError;done++;recent.push(url);if(recent.length>3)recent.shift();update(url)}catch{failed.push([url,0])}finally{active.delete(url);renderFiles()}}}));
  running=false;if(failed.length){status.textContent=failed.length===1?'1 arquivo não carregou.':failed.length.toLocaleString('pt-BR')+' arquivos não carregaram.';
 const list=el.querySelector('[data-files]');list.replaceChildren(...failed.map(([url])=>{const row=document.createElement('div');row.textContent='Falhou: '+url;row.title=url;return row}));
 el.querySelector('[data-note]').textContent='Os arquivos acima falharam após duas tentativas. Você pode tentar novamente.';
 retry.hidden=false;retry.onclick=()=>run(failed.slice());
 const optional=failed.every(([url])=>!/\.(js|css|json|woff2?|ttf)$/i.test(url));
 if(optional&&window.OAK_GAME_INITIALIZED){await finish();return}
 return}await finish();
 }
 dom.then(async()=>{try{
 files=entryFiles();
 if(location.protocol==='file:'){files=files.filter(([url])=>/\.(png|webp|jpe?g|gif|svg|ogg|mp3|wav|m4a)$/i.test(url));el.querySelector('[data-note]').textContent='Preparando a tela inicial local. Os demais recursos carregam conforme você joga.'}
 update();await run(files)
 }catch(error){status.textContent='Falha ao preparar o carregamento: '+error.message;retry.hidden=false;retry.onclick=()=>location.reload()}});
})();
