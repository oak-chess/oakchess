/* Approved trainer duel. Presentation only; combat owns all game state. */
(()=>{
'use strict';
const legacy=showVS,escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null,ac=null,master=null,noiseBuffer=null,audioReady=false;
const voices=new Set(),settings={get sound(){return !CFG.mute&&CFG.sfx>0}};
function stopAudio(){for(const voice of voices){try{voice.stop()}catch{}}voices.clear()}
function audioInit(){try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=CFG.mute?0:Math.max(0,Math.min(1,CFG.sfx))*.38;const limit=ac.createDynamicsCompressor();limit.threshold.value=-16;limit.ratio.value=6;master.connect(limit);limit.connect(ac.destination);noiseBuffer=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const data=noiseBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1}ac.resume().catch(()=>{});audioReady=true}catch{audioReady=false}}
function voice({type='sine',from=220,to=110,duration=.25,volume=.3,pan=0,delay=0,noise=false,filter=1800}){
 if(!audioReady||!settings.sound||ac.state!=='running')return;
 const now=ac.currentTime+delay,source=noise?ac.createBufferSource():ac.createOscillator(),gain=ac.createGain(),tone=ac.createBiquadFilter(),stereo=ac.createStereoPanner();
 if(noise){source.buffer=noiseBuffer;source.loop=true}else{source.type=type;source.frequency.setValueAtTime(Math.max(20,from),now);source.frequency.exponentialRampToValueAtTime(Math.max(20,to),now+duration)}
 tone.type=noise?'bandpass':'lowpass';tone.frequency.setValueAtTime(filter,now);tone.frequency.exponentialRampToValueAtTime(Math.max(100,filter*.3),now+duration);tone.Q.value=.7;stereo.pan.value=pan;
 gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+Math.min(.015,duration/5));gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
 source.connect(tone);tone.connect(gain);gain.connect(stereo);stereo.connect(master);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();tone.disconnect();gain.disconnect();stereo.disconnect()};source.start(now);source.stop(now+duration+.025);
}
function sound(name,type){
 if(name==='intro')voice({from:65,to:110,duration:.6,volume:.4});
 if(name==='red'||name==='blue'){voice({noise:true,filter:2200,duration:.25,volume:.4,pan:name==='red'?-.7:.7});voice({type:'triangle',from:170,to:360,duration:.18,volume:.15})}
 if(name==='summon'){
  if(type==='fire')voice({noise:true,filter:750,duration:.7,volume:.6});
  else if(type==='water'||type==='ice')voice({noise:true,filter:2600,duration:.55,volume:.35});
  else for(let i=0;i<3;i++)voice({type:type==='electric'?'square':'sine',from:330*2**(i/5),to:480*2**(i/5),duration:.35,volume:.13,delay:i*.08});
 }
 if(name==='impact'){voice({from:150,to:35,duration:.55,volume:.8});voice({noise:true,filter:1700,duration:.36,volume:.65});for(let i=0;i<3;i++)voice({type:'triangle',from:392*2**(i/3),to:392*2**(i/3),duration:.6,volume:.12,delay:.08})}
 if(name==='text')voice({type:'triangle',from:760,to:600,duration:.035,volume:.065,filter:2300});
 if(name==='open'){voice({noise:true,filter:3200,duration:.8,volume:.4});voice({from:100,to:240,duration:.6,volume:.2})}
 if(name==='ready')for(const [i,n]of [392,494,587,784].entries())voice({type:'triangle',from:n,to:n,duration:.32,volume:.18,delay:i*.08});
}
function strongest(list,side){
 return list.map((unit,index)=>{
  const L=LINES[unit.line],star=unit.star||1,id=L.ids[star-1];let stats=baseStats(L,star,side===0),power=0;
  const live=side===1?B.units.find(u=>u.side===1&&u.line===unit.line&&u.star===star&&u.r===unit.r&&u.c===unit.c):null;
  if(live)power=live.maxHp+live.atk*live.as*10+live.spell*3+live.armor*5+live.mr*5;
  else{const seq=B.seq;try{const temp=mkCU({...unit,r:0,c:0,scale:unit.scale||1,hpx:unit.hpx||(unit.shiny?SHB:1),dx:unit.dx||(unit.shiny?SHB:1)},side);if(side===0){applyBoons([temp]);if(G.tower)TOWER.previewStats(temp,unit)}power=temp.maxHp+temp.atk*temp.as*10+temp.spell*3+temp.armor*5+temp.mr*5}catch{power=stats.hp+stats.atk*10+stats.sp*3}finally{B.seq=seq}}
  return{unit,L,star,id,power,index,types:typesOf(L,star),name:L.names[star-1]};
 }).sort((a,b)=>b.star-a.star||b.L.c-a.L.c||b.power-a.power||a.index-b.index)[0];
}
function portrait(el,slug){if(!el||!slug)return;el.src=trainerUrl(slug);el.onerror=()=>{el.onerror=null;el.src=trPortrait(slug)};trResolve(slug,url=>{if(el.isConnected)el.src=url})}
showVS=function(done){
 if(current)current.cancel();
 const overlay=document.getElementById('vs');let scene=null;
 try{
  const ally=strongest(boardUnits(),0),foe=strongest(G.enemy||[],1);if(!ally||!foe){legacy(done);return}
  const info=G.round||{},secret=info.kind==='secret'&&!G.mewHelp,trainer=!!G.oppSlug,wild=info.kind==='pve',rightName=secret?'???':G.oppName||foe.name;
  const color=t=>TYPES[t]?.c||'#aa91c9',leftColor=color(ally.types[0]),rightColor=color(foe.types[0]);
  const sprite=x=>x.unit.shiny?shinyUrl(sprFront(x.id)):sprFront(x.id),typeText=x=>x.types.map(t=>TYPES[t]?.n||t).join(' / ');
  const esc=escape,quote=G.oppQuote||G.foe?.q||(wild?'Um grupo de Pokémon selvagens apareceu!':G.tower?'A próxima prova da Torre começa agora.':'Mostre a força da sua equipe!');
  const fighter=(x,side)=>`<div class="fighter ${side}"><img class="partner" src="${esc(sprite(x))}" alt="${esc(x.name)}" style="${secret&&side==='foe'?'filter:brightness(0) drop-shadow(0 0 16px #c080ee)':''}"><img class="trainer" alt="${side==='player'?'Seu treinador':esc(rightName)}" ${side==='foe'&&!trainer?'hidden':''}><div class="nameplate"><small>${side==='player'?'SEU DESTAQUE':trainer?'DESTAQUE ADVERSÁRIO':G.tower?'DESAFIO DA TORRE':'ENCONTRO'}</small><b>${side==='player'?'VOCÊ':esc(rightName)}</b><span>${secret&&side==='foe'?'PODER DESCONHECIDO':esc(x.name)+' '+ '★'.repeat(x.star)+' · '+esc(typeText(x))}</span></div><div class="summon"></div></div>`;
  clearTimeout(VSTO);overlay.classList.add('oak-cutscene');overlay.style.removeProperty('opacity');overlay.style.setProperty('--ally',leftColor);overlay.style.setProperty('--foe',rightColor);
  overlay.innerHTML=`<div class="screen" ${!trainer?'data-wild="true"':''}><canvas class="world" width="240" height="150"></canvas><div class="shade"></div><div class="rays"></div><div class="cinema top"></div><div class="cinema bottom"></div><div class="chapter">${esc(info.lbl||G.oppName||'DUELO')}<strong>${G.tower?'TORRE DOS DESAFIOS':'JORNADA POR KANTO'}</strong></div><div class="edition"><b>OAKCHESS</b> / ${esc(typeText(ally))} × ${esc(secret?'???':typeText(foe))}</div><div class="cut left"></div><div class="cut right"></div><div class="diagonal"></div>${fighter(ally,'player')}${fighter(foe,'foe')}<div class="vs">VS</div><div class="quote"></div><div class="flash"></div><button type="button" class="cutscene-skip">Pular ›</button></div>`;
  const q=s=>overlay.querySelector(s),world=q('.world'),ctx=world.getContext('2d');
  // Keep compact geometry even if an older stylesheet is still cached.
  q('.screen').style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:78%;height:36%;min-height:0;border:2px solid #c6a969';
  overlay.style.background='transparent';
  const bg=ctx.createLinearGradient(0,140,240,10);bg.addColorStop(0,leftColor);bg.addColorStop(.5,'#281b35');bg.addColorStop(1,rightColor);ctx.fillStyle=bg;ctx.fillRect(0,0,240,150);
  ctx.fillStyle='#080b164d';ctx.fillRect(0,0,240,150);const rand=n=>{const f=Math.sin(n*72.938)*43758.5453;return f-Math.floor(f)};
  for(let i=0;i<75;i++){const x=rand(i+2)*240,y=rand(i+59)*150;ctx.fillStyle=x<120?leftColor:rightColor;ctx.globalAlpha=.2+rand(i+9)*.4;ctx.fillRect(x,y,1,1+i%3)}ctx.globalAlpha=1;
  for(const [i,c]of [leftColor,rightColor].entries()){ctx.strokeStyle=c+'66';for(let n=0;n<4;n++){ctx.beginPath();ctx.ellipse(i?190:50,80,24+n*12,20+n*8,i?-.6:.6,0,Math.PI*2);ctx.stroke()}}
  portrait(q('.player .trainer'),'red');if(trainer)portrait(q('.foe .trainer'),G.oppSlug);
  for(const [i,img]of [...overlay.querySelectorAll('.partner')].entries()){const data=i?foe:ally;img.onerror=()=>{img.onerror=null;img.src=data.unit.shiny?shinyUrl(sprStatic(data.id)):sprStatic(data.id)}}
  let t=0,last=performance.now(),raf=0,ended=false;const duration=9.25,reduced=!!CFG.reduceFx||matchMedia('(prefers-reduced-motion: reduce)').matches,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-(1-clamp(x))**3;
  const events=[{t:.4,n:'red'},{t:1.05,n:'blue'},{t:1.85,n:'summon',type:ally.types[0],id:ally.id},{t:2.3,n:'summon',type:foe.types[0],id:foe.id},{t:3.1,n:'impact'},{t:7.65,n:'open'},{t:8.6,n:'ready'},...Array.from({length:15},(_,i)=>({t:4.08+i*.09,n:'text'}))];
  const detach=()=>{cancelAnimationFrame(raf);clearTimeout(VSTO);stopAudio();overlay.onclick=null;document.removeEventListener('keydown',key);overlay.classList.remove('show','oak-cutscene');overlay.style.removeProperty('opacity');current=null};
  const finish=()=>{if(ended)return;ended=true;const proceed=G.phase==='vs';detach();if(proceed){SND.music('battle');done()}};
  const key=e=>{if(['Escape','Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();finish()}};
  scene={cancel(){if(ended)return;ended=true;detach()}};current=scene;
  function draw(){
   const enter=ease((t-.4)/.8),other=ease((t-1.05)/.85),a=ease((t-1.85)/.65),b=ease((t-2.3)/.65),impact=clamp((t-3.1)/.22),end=ease((t-7.65)/1.6),motion=reduced?0:1;
   overlay.style.opacity=String(1-end);
   q('.player').style.cssText=`opacity:${enter};transform:translateX(${((1-enter)*-150-end*160)*motion}px)`;q('.foe').style.cssText=`opacity:${other};transform:translateX(${((1-other)*150+end*160)*motion}px)`;
   for(const [i,amount]of [a,b].entries()){const el=q(i?'.foe .partner':'.player .partner');el.style.opacity=amount;el.style.transform=`${i?'scaleX(-1) ':''}translateY(${(1-amount)*18*motion}px) scale(${1-(1-amount)*.45*motion})`;const circle=q(i?'.foe .summon':'.player .summon');circle.style.opacity=amount<1?Math.sin(amount*Math.PI)*.8:0}
   q('.cut.left').style.opacity=enter;q('.cut.right').style.opacity=other;q('.diagonal').style.opacity=other;
   q('.vs').style.opacity=impact;q('.vs').style.transform=`translate(-50%,-50%) scale(${1+(1-impact)*1.8*motion})`;
   q('.quote').textContent=quote.slice(0,Math.floor(quote.length*clamp((t-4.05)/1.45)));q('.quote').style.opacity=clamp((t-4)/.3);
   q('.flash').style.opacity=!reduced&&t>3.1&&t<3.32?Math.sin((t-3.1)/.22*Math.PI)*.4:0;
   world.style.transform=`scale(${1+Math.min(t,7.65)*.009*motion})`;q('.rays').style.backgroundPosition=t*25+'px '+t*14+'px';
  }
  function frame(now){if(ended)return;if(G.phase!=='vs'){scene.cancel();return}const before=t;t=Math.min(duration,t+Math.max(0,now-last)/1000);last=now;if(master)master.gain.value=CFG.mute?0:Math.max(0,Math.min(1,CFG.sfx))*.38;if(t-before<.4)for(const event of events)if(event.t>before&&event.t<=t){sound(event.n,event.type);if(event.id&&CFG.cry)SND.cry(event.id,.55)}draw();if(t>=duration)finish();else raf=requestAnimationFrame(frame)}
  q('.cutscene-skip').onclick=e=>{e.stopPropagation();finish()};overlay.onclick=finish;document.addEventListener('keydown',key);overlay.classList.add('show');draw();audioInit();sound('intro');raf=requestAnimationFrame(frame);VSTO=setTimeout(finish,duration*1000+250);
 }catch(error){if(scene)scene.cancel();else{overlay.classList.remove('oak-cutscene','show');overlay.style.removeProperty('opacity')}console.warn('Versus cutscene fallback:',error);legacy(done)}
};
window.addEventListener('pagehide',()=>{if(current)current.cancel();stopAudio()});
})();
