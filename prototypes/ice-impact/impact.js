/* Ice field visual prototype: frozen floor and loss of traction; no damage. */
(()=>{
 const arena=document.getElementById('arenaView'),cv=document.createElement('canvas');cv.width=1280;cv.height=800;cv.style.cssText='position:absolute;inset:0;width:1280px;height:800px;z-index:1;pointer-events:none';arena.append(cv);const g=cv.getContext('2d');
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;max-width:calc(100% - 24px);display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px;border:2px solid #bca16e;background:#302d24;color:#f6e3b9;font:13px Arial';ui.innerHTML='<b>PROTÓTIPO · PISO CONGELADO</b><button data-prepare>Preparar arena</button><button data-play>▶ Congelar área</button><span aria-live="polite">Gelo → perda de aderência → deslizamento</span>';document.body.append(ui);ui.querySelectorAll('button').forEach(b=>b.style.cssText='min-height:36px;padding:6px 12px;background:#436d7a;color:#fff0cd;border:1px solid #bca16e');
 let attacker,targets=[],raf=0,token=0,bases=[];
 function stop(reset=true){cancelAnimationFrame(raf);g.clearRect(0,0,1280,800);if(reset){bases.forEach(p=>{p.u.x=p.x;p.u.y=p.y;updateCUEl(p.u);p.u.el._pmdOne=null});bases=[]}}
 function prepare(){stop();document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;
  if(!attacker?.el?.isConnected){clearCombatUnits();const make=(id,side,r,c)=>{const L=LINES.find(L=>L.ids.includes(id)),u=mkCU({line:L.i,star:L.ids.indexOf(id)+1,r,c,items:[]},side);B.units.push(u);addCUEl(u);return u};attacker=make(131,0,5,2);targets=[make(25,1,3,3),make(133,1,3,4)];attacker.target=targets[0];targets.forEach(u=>{faceTo(u,attacker);updateCUEl(u)});faceTo(attacker,targets[0]);updateCUEl(attacker)}
  ui.querySelector('[data-prepare]').hidden=true;
 }
 function run(){
  stop();const start=performance.now(),origin=hexXY(3,3),reduced=!!CFG.reduceFx||matchMedia('(prefers-reduced-motion:reduce)').matches;
  const tiles=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const d=hdist(3,3,r,c);if(d<=2){const p=hexXY(r,c);tiles.push({...p,r,c,d,seed:r*31+c*13})}}
  bases=targets.map((u,i)=>{const away=hexXY(2,i?5:3),length=Math.hypot(away.x-u.x,away.y-u.y);return{u,x:u.x,y:u.y,dx:(away.x-u.x)/length,dy:(away.y-u.y)/length,distance:length*(i?1.05:1.35),delay:.6+hdist(3,3,u.r,u.c)*.16,reacted:false}});
  PMD.playNames(attacker.el,['Shoot','Charge']);
  function frame(now){const t=(now-start)/1000;g.clearRect(0,0,1280,800);
   tiles.forEach(p=>{const age=t-.4-p.d*.16;if(age<0)return;const freeze=Math.min(1,age*3),melt=Math.max(0,Math.min(1,(6-t)/1.6)),opacity=freeze*melt;
    const radius=S_-2,scale=perspectiveScale(p.r);
    g.save();g.globalAlpha=opacity*.85;hexPath(g,p.x,p.y+3,radius,scale);g.fillStyle='#527f91';g.fill();g.restore();
    g.save();hexPath(g,p.x,p.y,radius,scale);g.clip();
    const gradient=g.createLinearGradient(p.x-35,p.y-30,p.x+30,p.y+30);gradient.addColorStop(0,`rgba(235,250,248,${opacity*.92})`);gradient.addColorStop(.28,`rgba(161,216,230,${opacity*.86})`);gradient.addColorStop(.56,`rgba(85,153,187,${opacity*.82})`);gradient.addColorStop(.8,`rgba(196,235,238,${opacity*.9})`);gradient.addColorStop(1,`rgba(119,185,207,${opacity*.87})`);g.fillStyle=gradient;g.fillRect(p.x-70,p.y-70,140,140);
    // Broad trapped facets and translucent slanted reflections give the ice volume.
    g.globalAlpha=opacity*.42;g.fillStyle='#f1ffff';g.beginPath();g.moveTo(p.x-45,p.y+8);g.lineTo(p.x+8,p.y-38);g.lineTo(p.x+22,p.y-38);g.lineTo(p.x-32,p.y+14);g.closePath();g.fill();
    g.globalAlpha=opacity*.2;g.fillStyle='#2e769c';g.beginPath();g.moveTo(p.x-12,p.y+38);g.lineTo(p.x+9,p.y-7);g.lineTo(p.x+42,p.y+10);g.closePath();g.fill();
    g.globalAlpha=opacity*.32;g.strokeStyle='#fbffff';g.lineWidth=2;g.beginPath();g.moveTo(p.x-19,p.y+17);g.lineTo(p.x+17,p.y-15);g.stroke();
    // Thin frost branches follow the floor, with distinct patterns in each cell.
    g.globalAlpha=opacity*.65;g.strokeStyle='#e4f1ec';g.lineWidth=1;
    for(let j=0;j<3;j++){const a=p.seed+j*2.1,reach=(10+j*5)*freeze,ox=p.x+Math.sin(p.seed)*13,oy=p.y+Math.cos(p.seed)*11;g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+Math.cos(a)*reach,oy+Math.sin(a)*reach*.65);g.stroke()}
    g.globalAlpha=opacity*.38;g.fillStyle='#edf8ed';g.fillRect(p.x-23,p.y-12,27,2);g.fillRect(p.x+2,p.y+8,19,1);
    if(t>3.5){g.globalAlpha=opacity*.55;g.strokeStyle='#548696';g.beginPath();g.moveTo(p.x-18,p.y+13);g.lineTo(p.x-4,p.y+3);g.lineTo(p.x+3,p.y+6);g.lineTo(p.x+18,p.y-11);g.stroke()}
    g.restore();
    // Beveled frozen rim and small angular ice chips along the edge.
    g.save();g.globalAlpha=opacity*.9;hexPath(g,p.x,p.y,radius-1,scale);g.strokeStyle='#d8f7f7';g.lineWidth=2;g.stroke();
    for(let j=0;j<2;j++){const a=(p.seed+j*2.7),x=p.x+Math.cos(a)*radius*scale*.8,y=p.y+Math.sin(a)*radius*scale*.8;g.beginPath();g.moveTo(x-3,y+2);g.lineTo(x-1,y-7);g.lineTo(x+4,y-3);g.lineTo(x+5,y+2);g.closePath();g.fillStyle=j?'#b3e5ee':'#e6fcfa';g.fill()}g.restore();
   });
   bases.forEach(p=>{const age=t-p.delay;if(age<0)return;if(!p.reacted){p.reacted=true;PMD.playNames(p.u.el,['Hurt'])}
    // Initial loss of grip, inertial glide and gradual friction, without snapping back.
    const progress=Math.min(1,Math.max(0,age/1.8)),ease=1-Math.pow(1-progress,2.4),distance=p.distance*ease;
    p.u.x=p.x+p.dx*distance;p.u.y=p.y+p.dy*distance;updateCUEl(p.u);
    if(progress<1){const footY=p.u.y+7;g.globalAlpha=(1-progress)*.6;g.strokeStyle='#e9f7ee';g.lineWidth=2;g.beginPath();g.moveTo(p.u.x-p.dx*17,footY-p.dy*17);g.lineTo(p.u.x-p.dx*35,footY-p.dy*35);g.stroke();g.globalAlpha=1}
    if(!reduced&&age<.35){const inner=p.u.el.querySelector('.in');if(inner&&!p.tilted){p.tilted=true;inner.animate([{rotate:'0deg'},{rotate:(p.dx>0?'-9deg':'9deg')},{rotate:'0deg'}],{duration:700,easing:'ease-out'})}}
   });
   if(t<6)raf=requestAnimationFrame(frame);else{stop(false);ui.querySelector('span').textContent='Alvos pararam após deslizar · repetir reinicia a cena'}
  }
  ui.querySelector('span').textContent='Área congelando · Pikachu e Eevee perdem aderência';raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-prepare]').onclick=prepare;
 ui.querySelector('[data-play]').onclick=async()=>{const request=++token;prepare();SND.init();ui.querySelector('span').textContent='Preparando reações…';await Promise.all([25,133].map(async id=>{const data=await PMD.get(id,false);if(data)await PMD.ensure(data,'Hurt')}));if(request===token)run()};
 addEventListener('pagehide',()=>{token++;stop()});
})();
