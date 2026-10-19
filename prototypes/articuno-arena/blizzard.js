/* Layered snow squalls and scenic Ice Pokémon. Uses only the prototype clock. */
(()=>{
 const previous=atmosphere;
 const inhabitants=[
  {id:'0087',name:'Dewgong',x:-457,y:72,size:1.65,phase:0,row:1},
  {id:'0091',name:'Cloyster',x:450,y:-50,size:1.65,phase:2,row:7},
  {id:'0124',name:'Jynx',x:-454,y:-273,size:1.55,phase:4,row:1},
  {id:'0131',name:'Lapras',x:481,y:260,size:1.8,phase:1,row:7},
  {id:'0087',name:'Dewgong',x:-546,y:282,size:1.15,phase:3,row:2},
  {id:'0091',name:'Cloyster',x:568,y:-287,size:1.2,phase:5,row:6}
 ];
 const images={};let fauna=true;
 for(const mon of inhabitants)for(const name of ['Idle','Walk']){
  const key=mon.id+name;if(images[key])continue;const image=new Image();image.src='../../assets/pmd/sprite/'+mon.id+'/'+name+'-Anim.png';images[key]=image;
 }
 const row=document.createElement('label');row.className='row';row.innerHTML='Pokémon de gelo <input type="checkbox" checked>';
 document.querySelector('.controls h2').after(row);row.querySelector('input').onchange=e=>fauna=e.target.checked;
 const note=document.createElement('p');note.textContent='Habitantes: Dewgong, Cloyster, Jynx e Lapras. Ajuste a nevasca para ver rajadas mais fortes.';row.after(note);
 defaults.energy=85;config.energy=85;$('energy').value=85;
 const flakes=Array.from({length:3},(_,layer)=>{
  const cv=document.createElement('canvas');cv.width=cv.height=32;const ctx=cv.getContext('2d'),r=layer===2?12:8;
  const glow=ctx.createRadialGradient(16,16,0,16,16,r);glow.addColorStop(0,'#f4fdffff');glow.addColorStop(.22,'#e8f9ffe6');glow.addColorStop(1,'#c5eaff00');ctx.fillStyle=glow;ctx.fillRect(0,0,32,32);return cv;
 });
 const mod=(n,m)=>((n%m)+m)%m;
 function drawPokemon(){if(!fauna||!config.decor)return;
  const t=reducedMotion?0:time;
  for(const mon of [...inhabitants].sort((a,b)=>a.y-b.y)){
   const mobile=mon.id==='0087'||mon.id==='0124',walk=mobile&&!reducedMotion&&Math.sin(t*.16+mon.phase)>.55;
   const name=walk?'Walk':'Idle',data=window.ICE_POKEMON_ANIMATION?.[mon.id],a=data?.[name]||data?.Idle,image=images[mon.id+(data?.[name]?name:'Idle')];
   if(!a||!image?.complete||!image.naturalWidth)continue;
   const drift=mobile?Math.sin(t*.19+mon.phase)*22:0,x=mon.x+drift,y=mon.y+Math.sin(t*.13+mon.phase)*8;
   const p=point(x,y,-19),scale=p.s*mon.size,rows=Math.max(1,Math.round(image.naturalHeight/a.fh)),direction=walk?(Math.cos(t*.19+mon.phase)>0?2:6):mon.row,r=Math.min(rows-1,direction);
   let tick=reducedMotion?0:(t*32+mon.phase*11)%a.dur.reduce((sum,n)=>sum+n,0),frame=0;
   while(frame<a.dur.length-1&&tick>=a.dur[frame])tick-=a.dur[frame++];
   c.save();c.globalAlpha=.19;c.fillStyle='#08253d';c.beginPath();c.ellipse(p.x,p.y,23*p.s,7*p.s,0,0,Math.PI*2);c.fill();c.restore();
   const bottom=a.bounds?.fb?.[r]?.[frame]??a.fh-1;
   c.save();c.imageSmoothingEnabled=false;c.drawImage(image,frame*a.fw,r*a.fh,a.fw,a.fh,p.x-a.fw*scale/2,p.y-(bottom+1)*scale,a.fw*scale,a.fh*scale);c.restore();
  }
 }
 function snowstorm(){const power=Math.max(0,Math.min(1,config.energy/100));if(!power||!config.elements)return;
  const t=reducedMotion?0:time,low=config.quality==='low';
  const gust=.65+.2*Math.sin(t*.73)+.15*Math.sin(t*1.31+2),wind=(.75+power*.8)*gust;
  c.save();
  // Wind-driven layers: fine distant snow, streaks, and soft near-camera flakes.
  for(let layer=0;layer<3;layer++){
   const count=Math.round((reducedMotion?12:low?[65,55,20][layer]:[210,170,65][layer])*power),speed=[55,125,240][layer]*(.5+power);
   for(let i=0;i<count;i++){
    const seed=i+layer*913,x=mod(random(seed+2)*(W+180)-t*speed*wind+Math.sin(t*.5+seed)*14,W+180)-90,y=mod(random(seed+82)*(H+100)+t*speed*.37,H+100)-50;
    const size=[1.2,2,5][layer]*(.65+random(seed+12)*.8);
    c.globalAlpha=([.26,.43,.3][layer]+gust*.11)*(.45+power*.55);
    if(layer===1&&!reducedMotion){c.strokeStyle='#dcf4ff';c.lineWidth=Math.max(.65,size*.45);c.beginPath();c.moveTo(x,y);c.lineTo(x-7*wind,y+3);c.stroke()}
    else c.drawImage(flakes[layer],x-size*2,y-size*2,size*4,size*4);
   }
  }
  if(config.clouds){
   // Broad snow curtains cross the edges; the center remains readable.
   for(let i=0;i<(low?2:4);i++){
    const cycle=mod(t*(.035+power*.025)+i*.29,1),x=W*(1.4-cycle*1.8),y=H*(.16+i*.22),r=W*.28;
    c.save();c.translate(x,y);c.rotate(-.24);c.scale(1,.26);const haze=c.createRadialGradient(0,0,0,0,0,r);haze.addColorStop(0,'rgba(215,242,255,'+(.06+power*.075)*gust+')');haze.addColorStop(1,'#e0f8ff00');c.globalAlpha=1;c.fillStyle=haze;c.fillRect(-r,-r,r*2,r*2);c.restore();
   }
   const veil=c.createRadialGradient(W*.5,H*.5,H*.22,W*.5,H*.5,W*.72);veil.addColorStop(0,'#daefff00');veil.addColorStop(1,'rgba(202,229,247,'+(.06+power*.17)+')');c.globalAlpha=1;c.fillStyle=veil;c.fillRect(0,0,W,H);
  }
  c.restore();
 }
 atmosphere=function(){previous();drawPokemon();snowstorm()};
})();
