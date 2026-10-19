/* Irregular distant lightning, wet-ground reflections and delayed thunder. */
(()=>{
 const before=atmosphere,voices=new Set();let enabled=true,nextStrike=2.8,event=null,seed=1,lastTime=0,noiseBuffer=null,crackBuffer=null,rainSource=null;
 const row=document.createElement('label');row.className='row';row.innerHTML='Relâmpagos e trovões <input type="checkbox" checked>';document.querySelector('.controls h2').after(row);
 row.querySelector('input').onchange=e=>{enabled=e.target.checked;if(!enabled)event=null};
 function silence(){for(const voice of voices)voice.volume.gain.setTargetAtTime(0,voice.ctx.currentTime,.025)}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)silence()});
 $('reset').addEventListener('click',()=>{enabled=true;row.querySelector('input').checked=true;event=null;nextStrike=time+4;silence()});
 function stormSound(strength,crack=false){
  if(!sound||!audio||paused||document.hidden||audio.ctx.state!=='running')return;
  const ctx=audio.ctx;
  if(!noiseBuffer){noiseBuffer=ctx.createBuffer(1,ctx.sampleRate*3.8,ctx.sampleRate);const data=noiseBuffer.getChannelData(0);let low=0,peak=0;for(let i=0;i<data.length;i++){low=(low+(Math.random()*2-1)*.085)/1.085;const swell=.65+.2*Math.sin(i/ctx.sampleRate*8)+.15*Math.sin(i/ctx.sampleRate*19);data[i]=low*swell;peak=Math.max(peak,Math.abs(data[i]))}for(let i=0;i<data.length;i++)data[i]=data[i]/Math.max(.01,peak)*.85}
  if(!crackBuffer){crackBuffer=ctx.createBuffer(1,ctx.sampleRate*.32,ctx.sampleRate);const data=crackBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/ctx.sampleRate*11)}
  const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),envelope=ctx.createGain(),volume=ctx.createGain(),now=ctx.currentTime;
  const duration=crack?.32:3.8;src.buffer=crack?crackBuffer:noiseBuffer;src.playbackRate.value=crack?1:.85+strength*.15;filter.type='lowpass';filter.frequency.value=crack?2600:650+strength*420;filter.Q.value=.35;
  envelope.gain.setValueAtTime(0,now);envelope.gain.linearRampToValueAtTime(crack?.48+strength*.22:.65+strength*.3,now+(crack?.004:.065));envelope.gain.exponentialRampToValueAtTime(.001,now+duration);
  volume.gain.value=Math.sqrt(config.volume/100)*.8;src.connect(filter);filter.connect(envelope);envelope.connect(volume);volume.connect(ctx.destination);
  const voice={src,ctx,volume};voices.add(voice);src.onended=()=>{voices.delete(voice);src.disconnect();filter.disconnect();envelope.disconnect();volume.disconnect()};src.start();src.stop(now+duration+.1);
 }
 function rainAudio(){
  if(!audio||!sound||audio.ctx.state!=='running')return;
  if(!rainSource){const ctx=audio.ctx,buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.5;const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;src.loop=true;filter.type='bandpass';filter.frequency.value=2700;filter.Q.value=.45;gain.gain.value=0;src.connect(filter);filter.connect(gain);gain.connect(audio.gain);src.start();rainSource={gain,ctx}}
  rainSource.gain.gain.setTargetAtTime(config.elements&&!paused&&!document.hidden?config.energy/100*1.15:0,rainSource.ctx.currentTime,.2);
 }
 function makeStrike(t,power){
  const side=seed%2?1:-1,target=point(side*(side<0?490:443),side<0?-182:-220,72),origin={x:target.x+side*(76+random(seed+41)*120),y:-28};
  const nodes=[origin];for(let i=1;i<=12;i++){const k=i/12;nodes.push({x:origin.x+(target.x-origin.x)*k+(random(seed*71+i)-.5)*37*(1-k*.7),y:origin.y+(target.y-origin.y)*k})}
  const result={start:t,delay:.8+random(seed+21)*1.5,strength:.65+random(seed+10)*.35,side,nodes,heard:false,seed};
  seed++;nextStrike=t+(7+random(seed+52)*9)/(Math.max(.3,power)*.6+.4);return result;
 }
 function lightning(e,age,power){
  if(reducedMotion||age>1.1)return;
  // Stronger cloud illumination with a soft decay, rather than an abrupt white blink.
  const attack=Math.exp(-age*7),after=age>.23?.18*Math.exp(-(age-.23)*5):0,intensity=(attack+after)*e.strength*power;
  if(intensity<.012)return;
  const end=e.nodes.at(-1),radius=W*.6,g=c.createRadialGradient(end.x,end.y,0,end.x,end.y,radius);g.addColorStop(0,'rgba(187,222,247,'+(intensity*.29)+')');g.addColorStop(.55,'rgba(163,200,228,'+(intensity*.13)+')');g.addColorStop(1,'#a9d0ee00');c.save();c.globalCompositeOperation='screen';c.fillStyle=g;c.fillRect(end.x-radius,end.y-radius,radius*2,radius*2);const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'rgba(190,221,242,'+(intensity*.1)+')');sky.addColorStop(1,'#afcde600');c.fillStyle=sky;c.fillRect(0,0,W,H);c.restore();
  if(age<.24){
   c.save();c.globalAlpha=Math.max(0,1-age/.24)*power*.95;c.lineJoin='round';c.lineCap='round';c.beginPath();e.nodes.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle='#739cbe';c.lineWidth=5;c.stroke();c.strokeStyle='#e8f4ff';c.lineWidth=1.8;c.stroke();
   const split=e.nodes[5],branch=e.nodes[8];c.globalAlpha*=.5;c.beginPath();c.moveTo(split.x,split.y);c.lineTo(split.x-e.side*29,split.y+9);c.lineTo(branch.x-e.side*65,branch.y+9);c.stroke();c.restore();
  }
  // Broken reflections follow puddle-like streaks rather than an opaque glow disk.
  for(let i=0;i<6;i++){
   const p=point(e.side*(399+random(i+e.seed)*138),-175+i*62,-20);c.save();c.globalAlpha=intensity*.26;c.strokeStyle='#d4eaf5';c.lineWidth=(2+random(i)*2)*p.s;c.beginPath();c.moveTo(p.x-13*p.s,p.y);c.quadraticCurveTo(p.x,p.y+2*p.s,p.x+(10+random(i+5)*19)*p.s,p.y-p.s);c.stroke();c.restore();
  }
 }
 atmosphere=function(){before();const t=time,power=config.energy/100;
  rainAudio();
  for(const voice of voices)voice.volume.gain.setTargetAtTime(sound&&enabled&&config.elements&&power>.05&&!paused&&!document.hidden?Math.sqrt(config.volume/100)*.8:0,voice.ctx.currentTime,.04);
  if(t<lastTime){event=null;nextStrike=t+4}lastTime=t;
  if(!enabled||!config.elements||power<=.05)return;
  if(t>=nextStrike){event=makeStrike(t,power);stormSound(event.strength*power,true)}
  if(!event)return;const age=t-event.start;lightning(event,age,power);
  if(!event.heard&&age>=event.delay){event.heard=true;stormSound(event.strength*power)}
  if(age>4.5)event=null;
 };
})();
