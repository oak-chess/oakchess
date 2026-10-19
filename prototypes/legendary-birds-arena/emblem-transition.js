/* Draw the battle seal progressively without rebuilding the scenery each frame. */
(()=>{
 let painter=null,progress=0,lastTime=null;
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{const k=clamp(n);return k*k*(3-2*k)};
 function arc(radius,start,end,amount,color,width){
  if(amount<=0)return;const steps=Math.max(2,Math.ceil(80*amount));c.beginPath();
  for(let i=0;i<=steps;i++){const a=start+(end-start)*amount*i/steps,p=point(Math.cos(a)*radius,Math.sin(a)*radius,18);if(i)c.lineTo(p.x,p.y);else c.moveTo(p.x,p.y)}
  c.strokeStyle=color;c.lineWidth=width*point(0,0,18).s;c.lineCap='round';c.stroke();
 }
 function half(radius,start,end,color,alpha){if(alpha<=0)return;c.save();c.globalAlpha=alpha;const pts=Array.from({length:49},(_,i)=>{const a=start+(end-start)*i/48;return[Math.cos(a)*radius,Math.sin(a)*radius,17]});face(pts,color);c.restore()}
 function ball(p){
  const r=76,outer=smooth(p/.57),upper=smooth((p-.3)/.3),lower=smooth((p-.44)/.3),divider=smooth((p-.55)/.26),button=smooth((p-.73)/.27);
  half(r,Math.PI,Math.PI*2,'#c7594e',upper*.73);half(r,0,Math.PI,'#e4e8e0',lower*.68);
  arc(r,-Math.PI/2,Math.PI*1.5,outer,'#0e1c2bc9',5);
  arc(r,-Math.PI/2,Math.PI*1.5,outer,theme.kind==='articuno'?'#d4f3f5b0':'#e2cda8b0',1.2);
  if(divider>0){const a=point(-r*divider,0,19),b=point(r*divider,0,19);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle='#172330';c.lineWidth=5*a.s;c.lineCap='round';c.stroke()}
  if(button>0){
   const inner=Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2;return[Math.cos(a)*17,Math.sin(a)*17,20]});c.save();c.globalAlpha=button;face(inner,'#15212b');c.restore();
   arc(17,-Math.PI/2,Math.PI*1.5,button,'#d9e5df',1.5);
   const dot=Array.from({length:33},(_,i)=>{const a=i/32*Math.PI*2;return[Math.cos(a)*10,Math.sin(a)*10,21]});c.save();c.globalAlpha=smooth((p-.88)/.12)*.88;face(dot,'#e3ece5');c.restore();
  }
  if(p>.02&&p<.57&&!reducedMotion){const angle=-Math.PI/2+Math.PI*2*outer,q=point(Math.cos(angle)*r,Math.sin(angle)*r,20),radius=7*q.s,g=c.createRadialGradient(q.x,q.y,0,q.x,q.y,radius);g.addColorStop(0,theme.kind==='articuno'?'#e8fbffb0':'#ffe1a4a0');g.addColorStop(1,'#ffe2b000');c.save();c.fillStyle=g;c.fillRect(q.x-radius,q.y-radius,radius*2,radius*2);c.restore()}
 }
 window.ARENA_EMBLEM_TRANSITION={setPainter(fn){painter=fn},draw(){
  if(!painter)return;const dt=lastTime==null?0:Math.max(0,Math.min(.1,time-lastTime));lastTime=time;
  const target=battle?1:0;progress=reducedMotion?target:clamp(progress+(target?1:-1)*dt/(target?1.8:1.35));
  c.save();clipFace(roundedPoints(-282,-269,12,564,538,33));
  const emblemAlpha=1-smooth((progress-.03)/.64);if(emblemAlpha>.001){c.save();c.globalAlpha=emblemAlpha;painter();c.restore()}
  if(progress>.001)ball(progress);c.restore();
 }};
})();
