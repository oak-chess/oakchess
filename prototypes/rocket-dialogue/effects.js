/* Short synthesized UI tones; unlocked only by a user gesture. */
(()=>{
 let context=null,enabled=true,lastType=-1,lastSelect=-1;
 function unlock(){if(!enabled)return;try{context ||= new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{})}catch{}}
 addEventListener('pointerdown',unlock,{capture:true});addEventListener('keydown',unlock,{capture:true});
 function tone(frequency,start,duration,volume,wave='square',end=frequency){
  if(!enabled||!context||context.state!=='running'||document.hidden)return;
  const oscillator=context.createOscillator(),gain=context.createGain(),at=context.currentTime+start;
  oscillator.type=wave;oscillator.frequency.setValueAtTime(frequency,at);oscillator.frequency.exponentialRampToValueAtTime(end,at+duration);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.003);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  oscillator.connect(gain);gain.connect(context.destination);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};oscillator.start(at);oscillator.stop(at+duration+.008);
 }
 window.DIALOGUE_FX={play(kind){
  if(!context||!enabled)return;const now=context.currentTime;
  if(kind==='type'){if(now-lastType<.065)return;lastType=now;tone(480,0,.023,.014,'triangle',380)}
  else if(kind==='select'){if(now-lastSelect<.055)return;lastSelect=now;tone(690,0,.045,.022,'square',830)}
  else if(kind==='confirm'){tone(620,0,.045,.025);tone(930,.055,.075,.023)}
  else if(kind==='advance')tone(780,0,.055,.018,'triangle',1040);
 },toggle(){enabled=!enabled;if(enabled)unlock();return enabled}};
 document.getElementById('effects').onclick=()=>{const on=DIALOGUE_FX.toggle();document.getElementById('effects').setAttribute('aria-pressed',String(on));document.getElementById('effects').textContent=on?'♪ Efeitos ligados':'♪ Efeitos desligados';if(on)DIALOGUE_FX.play('select')};
})();
