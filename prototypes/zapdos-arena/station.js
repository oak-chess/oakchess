/* Painted power-station environment with layered weather and local electric arcs. */
(()=>{
 const fallback=background,assets={};let ready=false,fauna=true,arcs=true;
 function load(key,file){return new Promise(resolve=>{const im=new Image();assets[key]=im;im.onload=async()=>{try{await im.decode()}catch{}sceneKey='';resolve(true)};im.onerror=()=>resolve(false);im.src='assets/'+file})}
 Promise.all([load('ground','power-station-v1.png'),load('coil','transformer-v1.png'),load('cabinet','switchgear-v1.png'),load('perch','substation-perch-v1.png'),load('pylon','broken-pylon-v1.png'),load('cables','cable-reel-v1.png'),load('cooling','cooling-manifold-v1.png')]).then(results=>{ready=results[0];sceneKey='';requestAnimationFrame(()=>document.body.classList.remove('scene-loading'))});
 function ground(){const im=assets.ground,s=Math.max(W/im.naturalWidth,H/im.naturalHeight)*Math.max(1,zoom*.3+.7)*1.12,w=im.naturalWidth*s,h=im.naturalHeight*s;c.drawImage(im,(W-w)/2+Math.max(-W*.045,Math.min(W*.045,pan*Math.min(W/1280,H/800)*.22)),(H-h)/2,w,h)}
 background=function(){if(!ready){fallback();return}c.fillStyle='#243342';c.fillRect(0,0,W,H);ground()};
 const groups=[
  // Upper-left: damaged transmission equipment, not another landing platform.
  ['pylon',-495,-177,235,1,-23],['coil',-354,-176,91,-1,16],['cables',-451,-75,136,1,-21],
  // Upper-right: compact transformer yard with a maintenance cabinet.
  ['coil',445,-227,158,1,-22],['cabinet',529,-188,115,-1,-22],['cables',368,-202,84,-1,16],
  // Lower-left: storage and maintenance, with varied low silhouettes.
  ['cabinet',-450,219,171,1,-22],['cables',-531,276,143,-1,-22],['coil',-340,144,87,-1,16],
  // Lower-right: pipes and valves, separated from the electrical yard.
  ['cooling',462,207,219,-1,-22],['cables',554,278,103,1,-22],['cabinet',340,156,87,1,16],
  // Small rim details and rear services; keep the central perch unique.
  ['cabinet',-232,-340,126,-1,15],['cables',-139,-329,83,1,16],
  ['cooling',221,-339,135,1,15],['coil',318,-308,73,-1,16],
  ['cables',-338,284,74,1,15],['coil',334,280,72,-1,15],
  ['pylon',-665,143,158,-1,-23],['cooling',644,-145,153,1,-23]
 ].sort((a,b)=>a[2]-b[2]);
 decor=function(){if(!ready||!config.decor)return;
  // Grounded cables connect selected assemblies without hiding the playable cells.
  for(const side of [-1,1]){
   const a=point(side*349,-203,14),b=point(side*361,-34,14),d=point(side*347,185,14);c.save();c.lineCap='round';c.lineWidth=5*a.s;c.strokeStyle='#1c232b';c.beginPath();c.moveTo(a.x,a.y);c.bezierCurveTo(b.x+side*9,b.y,b.x-side*8,b.y,d.x,d.y);c.stroke();c.lineWidth=a.s;c.strokeStyle='#8b827555';c.stroke();c.restore();
  }
  for(const [kind,x,y,width,flip,z]of groups){const im=assets[kind];if(!im?.complete||!im.naturalWidth)continue;const p=point(x,y,z),w=width*p.s,h=w*im.naturalHeight/im.naturalWidth;c.save();c.translate(p.x,p.y);c.scale(flip,1);c.drawImage(im,-w/2,-h*.87,w,h);c.restore()}
 };
 defaults.energy=80;config.energy=80;$('energy').value=80;
 const controls=document.createElement('div');controls.innerHTML='<label class="row">Pokémon elétricos <input data-station="fauna" type="checkbox" checked></label><label class="row">Arcos elétricos <input data-station="arcs" type="checkbox" checked></label>';
 document.querySelector('.controls h2').after(controls);controls.querySelector('[data-station="fauna"]').onchange=e=>fauna=e.target.checked;controls.querySelector('[data-station="arcs"]').onchange=e=>arcs=e.target.checked;
 $('reset').addEventListener('click',()=>{fauna=arcs=true;controls.querySelectorAll('input').forEach(el=>el.checked=true)});
 const inhabitants=[{id:'0025',x:-443,y:72,size:1.65,phase:1,row:1},{id:'0081',x:468,y:-140,size:1.6,phase:3,row:7,hover:true},{id:'0100',x:-490,y:281,size:1.55,phase:5,row:2},{id:'0125',x:489,y:258,size:1.7,phase:7,row:7}];
 const sheets={};for(const mon of inhabitants)for(const name of ['Walk','Idle']){const im=new Image();im.src='../../assets/pmd/sprite/'+mon.id+'/'+name+'-Anim.png';sheets[mon.id+name]=im}
 function drawFauna(){if(!fauna||!config.decor)return;const t=reducedMotion?0:time;
  for(const mon of inhabitants){const walk=!reducedMotion&&!mon.hover&&mon.id!=='0125'&&Math.sin(t*.17+mon.phase)>.5,name=walk?'Walk':'Idle',data=window.VOLT_ANIMATION?.[mon.id],a=data?.[name]||data?.Idle,im=sheets[mon.id+(data?.[name]?name:'Idle')];if(!a||!im?.complete||!im.naturalWidth)continue;
   const x=mon.x+Math.sin(t*.18+mon.phase)*17,y=mon.y+Math.sin(t*.12+mon.phase)*6,base=point(x,y,-18),p=point(x,y,mon.hover?-3+Math.sin(t*1.4)*4:-18),r=Math.min(Math.round(im.naturalHeight/a.fh)-1,walk?(Math.cos(t*.18+mon.phase)>0?2:6):mon.row);let tick=reducedMotion?0:(t*32+mon.phase*9)%a.dur.reduce((s,n)=>s+n,0),frame=0;while(frame<a.dur.length-1&&tick>=a.dur[frame])tick-=a.dur[frame++];
   c.save();c.globalAlpha=.17;c.fillStyle='#0a1523';c.beginPath();c.ellipse(base.x,base.y,20*base.s,6*base.s,0,0,Math.PI*2);c.fill();c.restore();
   const scale=p.s*mon.size,bottom=a.bounds?.fb?.[r]?.[frame]??a.fh-1;c.save();c.imageSmoothingEnabled=false;c.drawImage(im,frame*a.fw,r*a.fh,a.fw,a.fh,p.x-a.fw*scale/2,p.y-(bottom+1)*scale,a.fw*scale,a.fh*scale);c.restore();
  }
 }
 const mod=(n,m)=>(n%m+m)%m;
 function electricArc(start,end,t,alpha,seed){
  const a=point(...start),b=point(...end);c.save();c.globalAlpha=alpha;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(a.x,a.y);
  for(let i=1;i<8;i++){const k=i/8,jitter=(random(seed+i+Math.floor(t*16)*11)-.5)*14*a.s;c.lineTo(a.x+(b.x-a.x)*k+jitter,a.y+(b.y-a.y)*k+jitter*.3)}c.lineTo(b.x,b.y);
  c.strokeStyle='#6baff0';c.lineWidth=3*a.s;c.stroke();c.strokeStyle='#edfaff';c.lineWidth=a.s;c.stroke();c.restore();
 }
 function weather(){const t=reducedMotion?0:time,power=config.energy/100,low=config.quality==='low';
  if(config.elements&&power>0){
   const wind=.85+.26*Math.sin(t*.63)+.12*Math.sin(t*1.17+2);
   c.save();c.strokeStyle='#c0deed';
   for(let layer=0;layer<3;layer++){
    const count=Math.round((reducedMotion?8:low?[45,42,18][layer]:[115,125,65][layer])*power);
    for(let i=0;i<count;i++){
     const seed=i+layer*541,speed=[240,430,650][layer]*(.8+random(seed+19)*.45),x=mod(random(seed+77)*(W+160)-t*speed*.32*wind,W+160)-80,y=mod(random(seed+42)*(H+100)+t*speed,H+100)-50;
     const length=reducedMotion?3:[9,17,29][layer]*(.75+random(seed+14)*.5);
     c.globalAlpha=[.12,.23,.3][layer]*(.65+random(seed+55)*.5);c.lineWidth=[.65,.85,1.15][layer];c.beginPath();c.moveTo(x,y);c.lineTo(x-length*.34*wind,y+length);c.stroke();
    }
   }c.restore();
   // Rain rings remain on the ground around the board.
   if(!reducedMotion)for(let i=0;i<(low?15:46);i++){
    const age=(t*(.8+random(i+21)*.35)+i*.137)%1,p=point((i%2?1:-1)*(390+random(i+37)*220),-340+random(i+56)*745,-20);c.save();c.globalAlpha=(1-age)*.3*power;c.strokeStyle='#d3eaf1';c.lineWidth=.85*p.s;c.beginPath();c.ellipse(p.x,p.y,(2+age*13)*p.s,(1+age*4)*p.s,0,0,Math.PI*2);c.stroke();
    if(age<.2){const k=age/.2;for(const side of [-1,1]){c.beginPath();c.moveTo(p.x,p.y);c.quadraticCurveTo(p.x+side*3*p.s,p.y-7*Math.sin(k*Math.PI)*p.s,p.x+side*6*k*p.s,p.y-2*p.s);c.stroke()}}c.restore();
   }
   if(config.clouds&&!reducedMotion){
    for(let i=0;i<(low?1:3);i++){const phase=mod(t*.045+i*.37,1),x=W*(1.3-phase*1.6),y=H*(.25+i*.25),r=W*.23;c.save();c.translate(x,y);c.rotate(-.3);c.scale(1,.4);const mist=c.createRadialGradient(0,0,0,0,0,r);mist.addColorStop(0,'rgba(178,208,224,'+(.035*power)+')');mist.addColorStop(1,'#afcedc00');c.fillStyle=mist;c.fillRect(-r,-r,r*2,r*2);c.restore()}
   }
  }
  if(config.decor){for(let i=0;i<groups.length;i++){const [kind,x,y,,,z]=groups[i];if(kind!=='cabinet')continue;const p=point(x,y,z+23),r=13*p.s,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'rgba(245,204,96,'+(.12+(Math.sin(t*.8+i)+1)*.025)+')');g.addColorStop(1,'#f4c44b00');c.save();c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore()}}
  if(config.elements&&config.decor&&arcs&&power>.1){
   if(reducedMotion){for(const side of [-1,1]){const p=point(side*340,30,39);c.save();c.globalAlpha=.25;c.fillStyle='#a6d9f9';c.beginPath();c.arc(p.x,p.y,2*p.s,0,Math.PI*2);c.fill();c.restore()}}
   else{
    const burst=mod(t,7.8);if(burst>3.25&&burst<3.5)electricArc([-353,-173,50],[-340,143,48],t,.75*power,31);
    if(burst>5.1&&burst<5.34)electricArc([443,-239,48],[425,77,54],t,.72*power,79);
   }
  }
  if(config.clouds){for(let i=0;i<(low?3:6);i++){const phase=reducedMotion?.5:mod(t*.017+i*.19,1),p=point((i%2?1:-1)*(430+random(i+3)*150),-370+phase*850,45),r=(83+random(i)*47)*p.s,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'#13213120');g.addColorStop(1,'#13213100');c.save();c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore()}}
 }
 atmosphere=function(){if(!ready)return;drawFauna();weather()};
})();
