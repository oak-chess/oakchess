/* Illustrated volcanic sanctuary. All animation uses the shared prototype clock. */
(()=>{
 const fallbackBackground=background;
 const assets={};let ready=false,fauna=true;
 function load(key,file){return new Promise(resolve=>{const im=new Image();assets[key]=im;im.onload=async()=>{try{await im.decode()}catch{}sceneKey='';resolve(true)};im.onerror=()=>resolve(false);im.src='assets/'+file})}
 Promise.all([load('ground','caldera-v1.png'),load('outcrop','basalt-garden-v1.png'),load('landmark','lava-perch-v1.png')]).then(results=>{ready=results[0];sceneKey='';requestAnimationFrame(()=>document.body.classList.remove('scene-loading'))});
 const scaleOf=im=>Math.max(W/im.naturalWidth,H/im.naturalHeight)*Math.max(1,zoom*.3+.7)*1.12;
 function ground(){const im=assets.ground,s=scaleOf(im),w=im.naturalWidth*s,h=im.naturalHeight*s;c.drawImage(im,(W-w)/2+Math.max(-W*.045,Math.min(W*.045,pan*Math.min(W/1280,H/800)*.22)),(H-h)/2,w,h)}
 background=function(){if(!ready){fallbackBackground();return}c.fillStyle='#29222c';c.fillRect(0,0,W,H);ground()};
 const groups=[
  ['landmark',-555,-188,301,1,-23],['landmark',594,281,241,-1,-24],
  ['outcrop',-422,-96,153,-1,-20],['outcrop',-373,-35,89,1,15],['outcrop',-490,-72,82,1,-22],
  ['outcrop',-458,205,187,1,-23],['outcrop',-366,244,94,-1,15],['outcrop',-548,246,109,-1,-23],
  ['outcrop',450,-257,181,-1,-22],['outcrop',367,-214,90,1,15],['outcrop',540,-213,102,1,-23],
  ['outcrop',409,63,136,1,-21],['outcrop',355,110,83,-1,15],['outcrop',500,90,88,-1,-22],
  ['outcrop',-251,-357,134,-1,-20],['outcrop',-163,-342,75,1,-15],
  ['outcrop',252,-342,121,1,-18],['outcrop',329,-306,71,-1,15],
  ['outcrop',-376,341,123,-1,-21],['outcrop',387,345,108,1,-21]
 ].sort((a,b)=>a[2]-b[2]);
 window.VOLCANO_LAVA_ART={assets,groups,groundRect(){const im=assets.ground;if(!im?.naturalWidth)return null;const s=scaleOf(im),w=im.naturalWidth*s,h=im.naturalHeight*s;return{x:(W-w)/2+Math.max(-W*.045,Math.min(W*.045,pan*Math.min(W/1280,H/800)*.22)),y:(H-h)/2,w,h}}};
 function appendFace(points){points.map(p=>point(...p)).forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath()}
 decor=function(){if(!ready)return;
  if(!config.decor)return;
  // The painted assets already contain their contact shadows; no opaque patches below them.
  for(const [kind,x,y,width,flip,z]of groups){const im=assets[kind];if(!im?.complete||!im.naturalWidth)continue;const p=point(x,y,z),w=width*p.s,h=w*im.naturalHeight/im.naturalWidth;c.save();c.translate(p.x,p.y);c.scale(flip,1);c.drawImage(im,-w/2,-h*.87,w,h);c.restore()}
 };
 defaults.energy=78;config.energy=78;$('energy').value=78;
 const inhabitants=[{id:'0037',x:-438,y:93,size:1.65,phase:1,row:1},{id:'0058',x:440,y:-157,size:1.65,phase:3,row:7},{id:'0077',x:-495,y:291,size:1.6,phase:5,row:2},{id:'0126',x:490,y:267,size:1.7,phase:7,row:7}];
 const sheets={};for(const u of inhabitants)for(const pose of ['Idle','Walk']){const im=new Image();im.src='../../assets/pmd/sprite/'+u.id+'/'+pose+'-Anim.png';sheets[u.id+pose]=im}
 const row=document.createElement('label');row.className='row';row.innerHTML='Pokémon de fogo <input type="checkbox" checked>';document.querySelector('.controls h2').after(row);row.querySelector('input').onchange=e=>fauna=e.target.checked;
 const hint=document.createElement('p');hint.textContent='Vulpix, Growlithe, Ponyta e Magmar habitam as bordas da cratera. Moltres pousa ao iniciar a simulação.';row.after(hint);
 function drawFauna(){if(!fauna||!config.decor)return;const t=reducedMotion?0:time;
  for(const u of inhabitants){const moving=!reducedMotion&&u.id!=='0126'&&Math.sin(t*.16+u.phase)>.5,name=moving?'Walk':'Idle',data=window.VOLCANO_ANIMATION?.[u.id],a=data?.[name]||data?.Idle,im=sheets[u.id+(data?.[name]?name:'Idle')];if(!a||!im?.complete||!im.naturalWidth)continue;
   const p=point(u.x+Math.sin(t*.18+u.phase)*16,u.y+Math.sin(t*.11+u.phase)*6,-18),r=Math.min(Math.round(im.naturalHeight/a.fh)-1,moving?(Math.cos(t*.18+u.phase)>0?2:6):u.row);let tick=reducedMotion?0:(t*32+u.phase*7)%a.dur.reduce((s,n)=>s+n,0),f=0;while(f<a.dur.length-1&&tick>=a.dur[f])tick-=a.dur[f++];
   c.save();c.fillStyle='#080c1780';c.beginPath();c.ellipse(p.x,p.y,22*p.s,7*p.s,0,0,Math.PI*2);c.fill();c.imageSmoothingEnabled=false;const sc=p.s*u.size,bottom=a.bounds?.fb?.[r]?.[f]??a.fh-1;c.drawImage(im,f*a.fw,r*a.fh,a.fw,a.fh,p.x-a.fw*sc/2,p.y-(bottom+1)*sc,a.fw*sc,a.fh*sc);c.restore();
  }
 }
 const vents=[[-430,-112],[-471,223],[430,-198],[423,79],[530,270],[-531,-189]];
 function volcanicEffects(){const t=reducedMotion?0:time,power=config.energy/100,low=config.quality==='low';
  if(config.elements){
   const count=Math.round((reducedMotion?18:low?60:155)*power);
   for(let i=0;i<count;i++){const age=(t*(.04+random(i+89)*.04)+i*.137)%1,p=point(-820+random(i+17)*1640+Math.sin(t*.4+i)*18,-370+random(i+44)*840,-22+age*190);c.save();c.globalAlpha=Math.sin(age*Math.PI)*(.2+random(i)*.4);c.fillStyle=i%4?'#d19275':'#ffc277';c.beginPath();c.ellipse(p.x,p.y,(i%4?.8:1.4)*p.s,1.5*p.s,.4,0,Math.PI*2);c.fill();c.restore()}
   for(let v=0;v<vents.length;v++){const [x,y]=vents[v],p=point(x,y,-18),r=(38+Math.sin(t*1.1+v)*4)*p.s;
    c.save();c.globalAlpha=.55;const glow=c.createRadialGradient(p.x,p.y,1,p.x,p.y,r);glow.addColorStop(0,'rgba(255,130,35,'+(.11+power*.19)+')');glow.addColorStop(1,'#ff6d1500');c.fillStyle=glow;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore();
    if(config.decor&&!reducedMotion&&power>.2)for(let j=0;j<(low?2:4);j++){const age=(t*.23+j*.23+v*.19)%1,q=point(x+(random(v*7+j)-.5)*32+Math.sin(t*.9+j)*9,y,8+age*76);c.save();c.globalAlpha=Math.sin(age*Math.PI)*.65*power;c.fillStyle=j%2?'#ffd58b':'#f49b50';c.beginPath();c.ellipse(q.x,q.y,1.3*q.s,2.3*q.s,-.3,0,Math.PI*2);c.fill();c.restore()}
   }
   // Thin cooling cracks illuminate in slow waves, restricted to the rocky rim.
   for(const side of [-1,1])for(let j=0;j<4;j++){
    const y=-219+j*126,p=point(side*335,y,14),q=point(side*343,y+21,14),end=point(side*331,y+47,14);c.save();c.strokeStyle='#fa9a47';c.globalAlpha=(.15+.12*Math.sin(t*.6+j+side))*power;c.lineWidth=p.s;c.beginPath();c.moveTo(p.x,p.y);c.quadraticCurveTo(q.x,q.y,end.x,end.y);c.stroke();c.restore();
   }
  }
  if(config.clouds){for(let i=0;i<(low?3:7);i++){const side=i%2?1:-1,phase=reducedMotion?.5:(t*.032+i*.173)%1,p=point(side*(420+random(i+81)*150),-260+random(i+39)*550,phase*130-10),r=(36+phase*64)*p.s;c.save();c.globalAlpha=Math.sin(phase*Math.PI)*(.08+power*.08);c.scale(1,1);const smoke=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);smoke.addColorStop(0,'#ae8b844d');smoke.addColorStop(1,'#38273100');c.fillStyle=smoke;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore()}}
 }
 atmosphere=function(){if(!ready)return;drawFauna();volcanicEffects()};
})();
