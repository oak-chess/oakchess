'use strict';
const canvas=document.getElementById('scene'),$=id=>document.getElementById(id);let c=canvas.getContext('2d');
let W=0,H=0,dpr=1,time=0,last=0,paused=false,zoom=1,pan=0,drag=null,battle=false,gridSoftness=0,frames=0,lastFps=0;
const defaults={energy:65,volume:15,light:100,decor:true,elements:true,clouds:true,quality:'high'},config={...defaults};
const scenery=document.createElement('canvas');let sceneKey='';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function random(seed){const n=Math.sin(seed*127.1+311.7)*43758.5453;return n-Math.floor(n)}
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,config.quality==='low'?1:1.5);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);scenery.width=canvas.width;scenery.height=canvas.height;sceneKey=''}addEventListener('resize',resize);resize();
const colors=['#8ad8f1','#f1d477','#f29461'];
function crystal(x,y,z,r){for(let i=0;i<3;i++){const px=x+(i-1)*r*.65,h=r*(i===1?2.8:1.8);face([[px-r*.3,y,z],[px,y,z+h],[px+r*.3,y,z],[px,y+r*.3,z-2]],i%2?'#8cd2eb':'#d3f2fa');face([[px,y,z+h],[px+r*.3,y,z],[px,y+r*.3,z-2]],'#508faa')}}
function flame(x,y,z,r,t=0){const p=point(x,y,z),s=p.s*r;c.save();c.translate(p.x,p.y);c.beginPath();c.moveTo(-s*.55,0);c.bezierCurveTo(-s,-s*.7,-s*.1,-s*1.15,-s*.05,-s*2);c.bezierCurveTo(s*.55,-s*1.2,s*.08,-s*.7,s*.6,-s*.9);c.bezierCurveTo(s*.9,-s*.2,s*.45,s*.2,-s*.55,0);c.fillStyle='#e67d47';c.fill();c.beginPath();c.moveTo(-s*.24,0);c.quadraticCurveTo(-s*.38,-s*.5,Math.sin(t)*s*.1,-s*1.15);c.quadraticCurveTo(s*.5,-s*.5,s*.2,0);c.fillStyle='#ffe09a';c.fill();c.restore()}
function bolt(x,y,z,r){face([[x-r*.05,y,z+r],[x-r*.5,y,z],[x-r*.02,y,z+r*.04],[x-r*.2,y,z-r],[x+r*.55,y,z+r*.25],[x+r*.08,y,z+r*.16]],'#ffe795','#fff2bd')}
function floatingIsland(x,y,size,seed){const top=Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9,r=size*(.8+random(i+seed)*.2);return[x+Math.cos(a)*r,y+Math.sin(a)*r*.65,-35]});for(let i=0;i<9;i++)face([top[i],top[(i+1)%9],[x-size*.08,y,-35-size*1.3]],i%2?'#3b4b63':'#53627a');face(top,'#8896a1','#bdc8c766');}
function sky(){
const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#162b49');bg.addColorStop(.43,'#526f91');bg.addColorStop(1,'#b1c1ca');c.fillStyle=bg;c.fillRect(0,0,W,H);
for(let i=0;i<12;i++){const x=random(i+7)*W,y=random(i+15)*H*.8,r=W*(.13+random(i+31)*.14),g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%2?'#e5e0cf1e':'#809cbd22');g.addColorStop(1,'#b1c4ce00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
if(!config.decor)return;
for(const side of [-1,1])for(let i=0;i<4;i++)floatingIsland(side*(560+random(i+side+20)*200),-350+i*230,40+random(i+64)*42,i+5);
for(let i=0;i<3;i++){
const x=(i-1)*550,y=-430;floatingIsland(x,y,90,i+31);
if(i===0)crystal(x,y,-25,28);if(i===1){line([x,y,-20],[x,y,70],'#8c8e82',7);bolt(x,y,81,27)}if(i===2){roundedBox(x-24,y-22,-15,48,44,9,16,['#a3977a','#625d52','#474f51']);flame(x,y,-10,27)}
}
}
function arena(){
roundedBox(-375,-345,-9,750,690,95,34,['#8e9ba8','#4d6077','#364b65']);
c.save();clipFace(roundedPoints(-375,-345,-8,750,690,95));for(let x=-365;x<375;x+=47)for(let y=-335;y<345;y+=45)face([[x,y,-7],[x+44,y,-7],[x+44,y+42,-7],[x,y+42,-7]],((x+y)/2)%2?'#a7b2b8':'#919fae','#657b8c66');c.restore();
roundedBox(-291,-278,5,582,556,45,22,['#cfb575','#8a805f','#5a655f']);roundedBox(-282,-269,8,564,538,40,20,['#aeb8bc','#72818a','#536879']);
c.save();clipFace(roundedPoints(-282,-269,10,564,538,40));const radius=42,hw=Math.sqrt(3)*radius,gw=7.5*hw;
for(let row=0;row<8;row++)for(let col=0;col<7;col++){const x=-gw/2+hw/2+(col+(row%2?.5:0))*hw,y=-3.5*1.5*radius+row*1.5*radius,pts=Array.from({length:6},(_,i)=>{const a=(60*i-30)*Math.PI/180;return[x+Math.cos(a)*41,y+Math.sin(a)*41,10]});c.save();c.globalAlpha=1-gridSoftness*.88;face(pts,row>=4?((row+col)%2?'#bdc5c5':'#c7ccca'):((row+col)%2?'#94a8b5':'#9eb1bc'));c.restore();face(pts,'#0000','rgba(62,84,99,'+(.5-gridSoftness*.45)+')')}
// Poké Bola sobre um selo triplo: gelo, trovão e fogo.
for(let i=0;i<3;i++){const a=-Math.PI/2+i*Math.PI*2/3,pts=Array.from({length:20},(_,j)=>{const t=a+(j/19-.5)*Math.PI*.57;return[Math.cos(t)*76,Math.sin(t)*76,12]});c.beginPath();pts.map(p=>point(...p)).forEach((p,j)=>j?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle=colors[i];c.lineWidth=3*point(0,0,12).s;c.stroke()}
const circle=(r,start=0,end=Math.PI*2)=>Array.from({length:49},(_,i)=>{const a=start+(end-start)*i/48;return[Math.cos(a)*r,Math.sin(a)*r,12]});face(circle(58),'#eee9da','#3a4a5f');face([[0,0,12],...circle(57,Math.PI,Math.PI*2)],'#c36e60');face([[-57,-3,13],[57,-3,13],[57,3,13],[-57,3,13]],'#3a4a5f');face(circle(58),'#0000','#3a4a5f');face(circle(15),'#3a4a5f');face(circle(10),'#eee9da');c.restore();
}
function decor(){if(!config.decor)return;
// Três altares traseiros com identidades próprias.
for(let i=0;i<3;i++){const x=(i-1)*215;roundedBox(x-46,-340,17,92,49,12,30,['#b2bbc1','#697c8d','#435e75']);line([x-33,-291,18],[x+33,-291,18],colors[i],3);if(i===0)crystal(x,-315,20,20);if(i===1){line([x,-315,18],[x,-315,68],'#d4b977',6);bolt(x,-315,76,23)}if(i===2)flame(x,-315,21,22)}
for(const side of [-1,1])for(let i=0;i<3;i++){const x=side*342,y=-190+i*205;roundedBox(x-15,y-18,22,30,36,6,30,['#b3bcbf','#738496','#4c647d']);line([x,y-15,23],[x,y+15,23],colors[i],3);if(i===0)crystal(x,y,24,10);if(i===1)bolt(x,y,46,14);if(i===2)flame(x,y,24,12)}
}
function bench(){
roundedBox(-315,308,-5,630,94,18,22,['#384e68','#20364f','#1a2d47']);
for(let i=0;i<9;i++){const x=-298+i*66,tint=colors[Math.floor(i/3)];roundedBox(x,317,11,61,46,8,13,['#c1c8c8','#778794','#536c80']);roundedBox(x+5,322,12,51,35,5,2,['#50647a','#3b4d62','#2c4057']);line([x+8,322,14],[x+53,322,14],tint,3);line([x+7,325,14],[x+7,350,14],tint,1.5);const p=point(x+30,344,15);c.save();c.translate(p.x,p.y);c.scale(1,.65);c.font='700 '+12*p.s+'px Segoe UI';c.fillStyle=tint;c.textAlign='center';c.fillText(i+1,0,4*p.s);c.restore()}
line([-298,379,0],[298,379,0],'#d4bd7d',3);const p=point(0,409,-12);c.font='600 '+9*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle='#e3e0c4';c.fillText('BANCO DO TIME · 9 VAGAS',p.x,p.y);
}
function cachedScene(){const key=[W,H,dpr,zoom,pan,config.decor,config.quality,Math.round(gridSoftness*10)].join('|');if(key!==sceneKey){const main=c;c=scenery.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);sky();arena();decor();bench();c=main;sceneKey=key}c.drawImage(scenery,0,0,W,H)}
const cloudSprite=document.createElement('canvas');cloudSprite.width=300;cloudSprite.height=130;
{const brush=cloudSprite.getContext('2d');for(let i=0;i<12;i++){const x=35+random(i+8)*230,y=40+random(i+11)*50,r=30+random(i+31)*25,g=brush.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#e3edf27a');g.addColorStop(.5,'#d8e5ec45');g.addColorStop(1,'#dbe7ed00');brush.fillStyle=g;brush.fillRect(x-r,y-r,r*2,r*2)}}
function atmosphere(){const t=reducedMotion?0:time,power=config.energy/100;
if(config.clouds)for(let i=0;i<(config.quality==='high'?9:4);i++){const x=((random(i+12)*W+t*(5+i%3))%(W+500))-250,y=H*(.2+random(i+24)*.8),s=.7+random(i+49)*1.2;c.save();c.globalAlpha=.18;c.drawImage(cloudSprite,x,y,300*s,130*s);c.restore()}
if(!config.elements)return;
const count=Math.round((config.quality==='high'?48:21)*power);
for(let i=0;i<count;i++){const zone=i%3,a=(t*(zone===0?.035:.07)+i*.137)%1,x=zone===0?-440-random(i+2)*210:zone===2?440+random(i+5)*210:-250+random(i+16)*500,y=-320+random(i+36)*670,z=zone===0?110-a*130:-25+a*140,p=point(x+Math.sin(t*.7+i)*10,y,z);c.strokeStyle=colors[zone];c.fillStyle=colors[zone];c.globalAlpha=Math.sin(a*Math.PI)*.7;
if(zone===0){c.lineWidth=p.s;for(let j=0;j<3;j++){const angle=j*Math.PI/3;c.beginPath();c.moveTo(p.x-Math.cos(angle)*3*p.s,p.y-Math.sin(angle)*3*p.s);c.lineTo(p.x+Math.cos(angle)*3*p.s,p.y+Math.sin(angle)*3*p.s);c.stroke()}}else if(zone===2){c.beginPath();c.ellipse(p.x,p.y,1.5*p.s,3*p.s,.2,0,Math.PI*2);c.fill()}else{c.fillRect(p.x,p.y,1.5*p.s,1.5*p.s)}c.globalAlpha=1;}
if(!reducedMotion){flame(215,-315,21,22,Math.sin(t*4));for(const side of [-1,1])flame(side*342,220,24,12,Math.sin(t*4+side))}
// Descargas pequenas apenas perto do altar de Zapdos, sem iluminar a tela inteira.
if(Math.sin(t*.65)>.94){const x=Math.sin(t*19)*18;line([0,-315,100],[x,-315,65],'#fff0b0aa',1.7);line([x,-315,65],[-x*.5,-315,42],'#f4d977aa',1.2)}
}
let audio=null,sound=false;
function syncAudio(){if(audio)audio.gain.gain.setTargetAtTime(sound&&!paused&&!document.hidden?config.volume/100*.22:0,audio.ctx.currentTime,.3);$('sound').textContent=sound?'Silenciar':'Ativar som';$('sound').setAttribute('aria-pressed',String(sound));$('audioStatus').textContent=sound?(paused?'Som pausado.':'Vento contínuo nas alturas.'):'Ative o som para ouvir o vento.'}
$('sound').onclick=async()=>{try{if(!audio){const ctx=new AudioContext(),gain=ctx.createGain(),filter=ctx.createBiquadFilter(),buffer=ctx.createBuffer(1,ctx.sampleRate*5,ctx.sampleRate),data=buffer.getChannelData(0);let low=0;for(let i=0;i<data.length;i++){low=(low+(Math.random()*2-1)*.025)/1.025;data[i]=low*3.5}const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=1600;gain.gain.value=0;noise.connect(filter);filter.connect(gain);gain.connect(ctx.destination);noise.start();audio={ctx,gain}}await audio.ctx.resume();sound=!sound;syncAudio()}catch(e){$('audioStatus').textContent='Não foi possível ativar o áudio.'}};document.addEventListener('visibilitychange',syncAudio);
function setPhase(value){battle=value;$('phaseLabel').textContent=battle?'Combate':'Preparação';$('battlePreview').textContent=battle?'Voltar à preparação':'Simular combate';$('battlePreview').setAttribute('aria-pressed',String(battle))}$('battlePreview').onclick=()=>setPhase(!battle);
for(const key of ['energy','volume','light'])$(key).oninput=e=>{config[key]=+e.target.value;syncAudio()};for(const key of ['decor','elements','clouds'])$(key).onchange=e=>config[key]=e.target.checked;$('quality').onchange=e=>{config.quality=e.target.value;resize()};$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Continuar ambiente':'Pausar ambiente';syncAudio()};
function restoreCamera(){zoom=1;pan=0}canvas.ondblclick=restoreCamera;$('reset').onclick=()=>{Object.assign(config,defaults);for(const key of ['energy','volume','light','quality'])$(key).value=config[key];for(const key of ['decor','elements','clouds'])$(key).checked=config[key];setPhase(false);paused=false;$('pause').textContent='Pausar ambiente';sound=false;restoreCamera();syncAudio();resize()};
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.6,Math.min(1.5,zoom-e.deltaY*.0006))},{passive:false});canvas.onpointerdown=e=>{drag={x:e.clientX,pan};canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(drag)pan=drag.pan+(e.clientX-drag.x)/Math.min(W/1280,H/800)};canvas.onpointerup=canvas.onpointercancel=()=>drag=null;
function draw(ts){const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;if(!paused)time+=dt;gridSoftness+=((battle?1:0)-gridSoftness)*(1-Math.exp(-dt*5));c.setTransform(dpr,0,0,dpr,0,0);cachedScene();atmosphere();c.fillStyle='rgba(5,17,31,'+((100-config.light)/160)+')';c.fillRect(0,0,W,H);frames++;if(ts-lastFps>1000){$('fps').textContent=Math.round(frames*1000/(ts-lastFps))+' FPS · '+(config.quality==='high'?'detalhada':'leve');frames=0;lastFps=ts}requestAnimationFrame(draw)}for(const key of ['energy','volume','light','quality'])$(key).value=config[key];setPhase(false);requestAnimationFrame(draw);
