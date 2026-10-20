/* Rocket-only presentation; the existing campaign resolves the battle. */
(()=>{
'use strict';
let active=null,ac=null,gain=null;const voices=new Set();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stopAudio(){for(const n of voices){try{n.stop()}catch{}}voices.clear()}
function initAudio(){try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();gain=ac.createGain();gain.connect(ac.destination)}gain.gain.value=CFG.mute?0:Math.max(0,Math.min(1,CFG.sfx))*.28;ac.resume().catch(()=>{})}catch{}}
function tone(alarm=true){
 if(!ac||ac.state!=='running'||CFG.mute||!CFG.sfx)return;
 const now=ac.currentTime,o=ac.createOscillator(),v=ac.createGain();o.type=alarm?'triangle':'sine';o.frequency.setValueAtTime(alarm?650:145,now);
 if(alarm){o.frequency.exponentialRampToValueAtTime(980,now+.1);o.frequency.exponentialRampToValueAtTime(540,now+.23)}else o.frequency.exponentialRampToValueAtTime(42,now+.3);
 v.gain.setValueAtTime(0,now);v.gain.linearRampToValueAtTime(alarm?.38:.5,now+.015);v.gain.exponentialRampToValueAtTime(.0001,now+(alarm?.27:.4));o.connect(v);v.connect(gain);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();v.disconnect()};o.start(now);o.stop(now+(alarm?.28:.42));
}
window.ROCKET_CUTSCENE={show(done,strongest){
 if(active)active.cancel();const overlay=document.getElementById('vs'),world=document.getElementById('world'),originalTransform=world.style.transform;
 let raf=0,t=0,last=performance.now(),ended=false,musicStarted=false;
 const length=5.2,reduced=!!CFG.reduceFx||matchMedia('(prefers-reduced-motion: reduce)').matches,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
 const finish=()=>{if(ended)return;const proceed=G.phase==='vs';cancel();if(proceed){SND.music('battle');done()}};
 const key=e=>{if(['Enter','Escape',' '].includes(e.key)){e.preventDefault();e.stopPropagation();finish()}};
 function cancel(){if(ended)return;ended=true;cancelAnimationFrame(raf);clearTimeout(VSTO);stopAudio();world.style.transform=originalTransform;document.removeEventListener('keydown',key);overlay.onclick=null;overlay.classList.remove('rocket-cutscene','show');overlay.style.removeProperty('background');active=null}
 try{
  const mons=[],remaining=[...(G.enemy||[])];for(let i=0;i<2&&remaining.length;i++){const pick=strongest(remaining,1);if(!pick)break;mons.push(pick);remaining.splice(remaining.indexOf(pick.unit),1)}
  const monHtml=mons.map((m,i)=>`<img class="rocket-mon ${i?'right':'left'}" src="${esc(m.unit.shiny?shinyUrl(sprFront(m.id)):sprFront(m.id))}" alt="${esc(m.name)}">`).join('');
  overlay.classList.remove('oak-cutscene');overlay.classList.add('rocket-cutscene');overlay.style.removeProperty('opacity');overlay.style.background='transparent';
  overlay.innerHTML=`<div class="rocket-danger"></div><div class="rocket-warning"><small>PERIGO · EMBOSCADA</small><b>A Equipe Rocket interceptou sua jornada!</b></div><div class="rocket-strip"><div class="rocket-lines"></div><div class="rocket-label">TRANSMISSÃO INTERROMPIDA</div><div class="rocket-logo" aria-hidden="true">R</div><img class="rocket-agent left" alt="${esc(G.oppName||'Recruta Rocket')}"><img class="rocket-agent right" alt="Recruta Rocket">${monHtml}<canvas class="rocket-smoke" width="720" height="184" aria-hidden="true"></canvas><div class="rocket-caption"><small>EMBOSCADA</small><b>EQUIPE ROCKET</b><span>“Seus Pokémon vêm com a gente!”</span></div></div>`;
  const q=s=>overlay.querySelector(s),warning=q('.rocket-warning'),strip=q('.rocket-strip'),danger=q('.rocket-danger'),logo=q('.rocket-logo'),left=q('.rocket-agent.left'),right=q('.rocket-agent.right'),caption=q('.rocket-caption'),lines=q('.rocket-lines'),g=q('canvas').getContext('2d');
  const main=G.oppSlug||'rocketgrunt',partner=/gruntf|ariana/i.test(main)?'rocketgrunt':'rocketgruntf';
  for(const [el,slug]of [[left,main],[right,partner]]){el.src=trainerUrl(slug);el.onerror=()=>{el.onerror=null;el.src=trPortrait(slug)};trResolve(slug,url=>{if(el.isConnected)el.src=url})}
  const images=[...overlay.querySelectorAll('.rocket-mon')];images.forEach((img,i)=>img.onerror=()=>{img.onerror=null;img.src=mons[i].unit.shiny?shinyUrl(sprStatic(mons[i].id)):sprStatic(mons[i].id)});
  function draw(){
   const warn=ease(t/.16)*(1-ease((t-.92)/.35)),intro=ease((t-1.1)/.65),exit=ease((t-4.45)/.75);
   warning.style.opacity=warn;warning.style.clipPath=`inset(0 ${(1-ease(t/.2))*50}%)`;danger.style.opacity=!reduced&&t<1.12?Math.sin(clamp(t/1.12)*Math.PI)*.55:0;
   const shake=!reduced&&t>.13&&t<.92?Math.sin((t-.13)/.79*Math.PI):0;world.style.transform=shake?`${originalTransform} translate(${Math.sin(t*79)*4*shake}px,${Math.cos(t*91)*2*shake}px)`:originalTransform;
   strip.style.opacity=intro*(1-exit);strip.style.clipPath=reduced?'none':`inset(${(1-intro)*50}% 0)`;
   const r=ease((t-1.25)/.45);logo.style.opacity=r*(1-ease((t-2.2)/.6)*.55);logo.style.transform=`translate(-50%,-50%) scale(${reduced?1:1.25-r*.25})`;
   const a=ease((t-1.65)/.65),b=ease((t-1.85)/.65);left.style.opacity=a;right.style.opacity=b;left.style.transform=`translateX(${reduced?0:(1-a)*-60}px)`;right.style.transform=`translateX(${reduced?0:(1-b)*60}px) scaleX(-1)`;
   const mon=ease((t-2.05)/.65);images.forEach((img,i)=>{img.style.opacity=mon;img.style.transform=`${i?'scaleX(-1) ':''}translateY(${reduced?0:(1-mon)*10}px)`});caption.style.opacity=ease((t-2.5)/.35);lines.style.backgroundPosition=(reduced?0:t*18)+'px 0';
   g.clearRect(0,0,720,184);for(let i=0;i<17;i++){const progress=clamp((t-1.05)/2),x=i*49-25+Math.sin(i*7+(reduced?0:t))*12,y=154-Math.sin(i*2.3)*29-progress*44,cloud=1-ease((t-2.05)/1.05),radius=38+Math.sin(i)*15,fog=g.createRadialGradient(x,y,0,x,y,radius);fog.addColorStop(0,`rgba(151,93,167,${cloud*.72})`);fog.addColorStop(.6,`rgba(93,53,117,${cloud*.55})`);fog.addColorStop(1,'rgba(70,35,85,0)');g.fillStyle=fog;g.fillRect(x-radius,y-radius,radius*2,radius*2)}
  }
  function frame(now){if(ended)return;if(G.phase!=='vs'){cancel();return}const before=t;t=Math.min(length,t+Math.max(0,now-last)/1000);last=now;if(gain)gain.gain.value=CFG.mute?0:Math.max(0,Math.min(1,CFG.sfx))*.28;
   if(t-before<.4){for(const at of [.06,.38,.7])if(before<=at&&t>at)tone();if(before<1.4&&t>=1.4)tone(false)}
   if(t>=1.1&&!musicStarted){musicStarted=true;SND.music('battle')}draw();if(t>=length)finish();else raf=requestAnimationFrame(frame)
  }
  active={cancel};clearTimeout(VSTO);overlay.onclick=finish;document.addEventListener('keydown',key);overlay.classList.add('show');SND.init();initAudio();draw();raf=requestAnimationFrame(frame);VSTO=setTimeout(finish,length*1000+250);
 }catch(error){cancel();console.warn('Rocket cutscene fallback:',error);if(G.phase==='vs'){SND.music('battle');done()}}
}};
window.addEventListener('pagehide',()=>{if(active)active.cancel();stopAudio()});
})();
