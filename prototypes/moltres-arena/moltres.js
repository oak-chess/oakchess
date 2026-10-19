/* Scenic Moltres: the prototype's phase and clock drive flight and landing. */
(()=>{
 const previousAtmosphere=atmosphere,previousDecor=decor;
 const sheets={},perch=new Image();let perchReady=false,enabled=true;
 perch.onload=()=>{perchReady=true;sceneKey=''};perch.src='assets/lava-perch-v1.png';
 for(const name of ['Walk','Idle']){const image=new Image();image.src='../../assets/pmd/sprite/0146/'+name+'-Anim.png';sheets[name]=image}
 const row=document.createElement('label');row.className='row';row.innerHTML='Moltres no cenário <input type="checkbox" checked>';
 document.querySelector('.controls h2').after(row);row.querySelector('input').onchange=e=>enabled=e.target.checked;
 const flight=t=>({x:Math.cos(t*.19)*540,y:-75+Math.sin(t*.19)*300,z:145+Math.sin(t*.37)*24});
 const landing={x:0,y:-307,z:43},normalSize=1.65,flyingSize=4.8;let state='flight',started=0,origin=flight(0),lastBattle=false,lastTime=0,current=origin,lastPos=origin,size=flyingSize,originSize=flyingSize,heading=0;
 const mix=(a,b,k)=>({x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k,z:a.z+(b.z-a.z)*k});
 const ease=k=>k*k*(3-2*k);
 decor=function(){previousDecor();if(!config.decor||!perchReady)return;
  const p=point(0,-314,16),w=186*p.s,h=w*perch.naturalHeight/perch.naturalWidth;c.drawImage(perch,p.x-w/2,p.y-h*.8,w,h);
 };
 atmosphere=function(){previousAtmosphere();if(!enabled)return;
  const t=time;if(t<lastTime){state='flight';lastBattle=false;started=t}lastTime=t;
  if(battle!==lastBattle){origin={...current};originSize=size;started=t;state=battle?'landing':'takeoff';lastBattle=battle}
  const elapsed=t-started;
  if(state==='landing'){const k=reducedMotion?1:Math.min(1,elapsed/3.2);current=mix(origin,landing,ease(k));size=originSize+(normalSize-originSize)*ease(k);current.z+=Math.sin(k*Math.PI)*48;if(k>=1)state='perched'}
  else if(state==='perched'){current={...landing};size=normalSize}
  else if(state==='takeoff'){const k=reducedMotion?1:Math.min(1,elapsed/2.5);current=mix(origin,flight(t),ease(k));size=originSize+(flyingSize-originSize)*ease(k);if(k>=1)state='flight'}
  else{current=reducedMotion?{x:390,y:-220,z:100}:flight(t);size=flyingSize}
  const landed=state==='perched',name=landed?'Idle':'Walk',image=sheets[name],a=window.VOLCANO_ANIMATION?.['0146']?.[name];if(!a||!image.complete||!image.naturalWidth)return;
  const dx=current.x-lastPos.x,dy=current.y-lastPos.y;lastPos={...current};
  if(Math.abs(dx)+Math.abs(dy)>.01)heading=((2-Math.round(Math.atan2(dy,dx)*4/Math.PI))%8+8)%8;
  const direction=landed||reducedMotion?0:heading;
  const rows=Math.max(1,Math.round(image.naturalHeight/a.fh)),r=Math.min(rows-1,direction);
  const total=a.dur.reduce((s,n)=>s+n,0);let tick=reducedMotion?0:(t*40)%total,frame=0;
  while(frame<a.dur.length-1&&tick>=a.dur[frame])tick-=a.dur[frame++];
  const p=point(current.x,current.y,current.z),shadow=point(current.x,current.y,landed?25:-15),scale=p.s*size;
  c.save();c.translate(shadow.x,shadow.y);c.scale(1,.3);const shadowRadius=(29+Math.max(0,size-normalSize)*16)*shadow.s,shade=c.createRadialGradient(0,0,0,0,0,shadowRadius);shade.addColorStop(0,landed?'#110d182e':'#110d181a');shade.addColorStop(1,'#110d1800');c.fillStyle=shade;c.fillRect(-shadowRadius,-shadowRadius,shadowRadius*2,shadowRadius*2);c.restore();
  if(config.elements&&!reducedMotion&&!landed){
   for(let i=0;i<10;i++){const lag=(i+1)*.1,q=point(current.x-dx*70*lag,current.y-dy*70*lag,current.z-lag*9);c.fillStyle='rgba(255,167,69,'+(.2*(1-i/10))+')';c.fillRect(q.x-i*2,q.y+Math.sin(t*3+i)*6,2*p.s,2*p.s)}
  }
  const bounds=a.bounds,bottom=bounds?.fb?.[r]?.[frame]??a.fh-1;
  c.save();c.imageSmoothingEnabled=false;c.drawImage(image,frame*a.fw,r*a.fh,a.fw,a.fh,p.x-a.fw*scale/2,p.y-(bottom+1)*scale,a.fw*scale,a.fh*scale);c.restore();
  if(state==='perched'&&config.elements&&!reducedMotion&&elapsed<4.1){const k=Math.min(1,(elapsed-3.2)/.9);if(k>=0){c.save();c.globalAlpha=(1-k)*.4;c.strokeStyle='#ffd58d';c.lineWidth=p.s;c.beginPath();c.ellipse(p.x,p.y,(14+k*58)*p.s,(5+k*18)*p.s,0,0,Math.PI*2);c.stroke();c.restore()}}
 };
})();
