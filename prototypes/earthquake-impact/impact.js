/* Tile displacement experiment: original floor textures, independent slab motion. */
(()=>{
 const arena=document.getElementById('arenaView'),cv=document.createElement('canvas');cv.width=1280;cv.height=800;cv.style.cssText='position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:1';arena.insertBefore(cv,document.getElementById('units'));const ctx=cv.getContext('2d');
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;background:#302d24;color:#f6e3b9;border:2px solid #bca16e;padding:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;font:13px Arial;max-width:calc(100% - 24px)';ui.innerHTML='<b>TERREMOTO · PISO EM PLACAS</b><button data-view>Ver arena</button><button data-play>Repetir impacto</button><span aria-live="polite">Área: 2 casas ao redor do impacto</span>';document.body.append(ui);ui.querySelectorAll('button').forEach(b=>b.style.cssText='min-height:36px;background:#a14737;color:#fff0cd;border:1px solid #bca16e;padding:6px 12px');
 let raf=0,attacker=null,target=null,windup=0,sequence=0;const moved=new Map();
 function prepare(){
  document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;
  if(attacker?.el?.isConnected&&target?.el?.isConnected)return;
  stop();clearCombatUnits();
  const make=(id,side,r,c)=>{const line=LINES.find(L=>L.ids.includes(id));if(!line)throw new Error('Pokémon não encontrado: '+id);const unit=mkCU({line:line.i,star:line.ids.indexOf(id)+1,items:[],r,c},side);B.units.push(unit);addCUEl(unit);return unit};
  attacker=make(76,0,4,3);target=make(25,1,4,4);attacker.target=target;target.target=attacker;faceTo(attacker,target);faceTo(target,attacker);updateCUEl(attacker);updateCUEl(target);
  ui.querySelector('[data-view]').hidden=true;ui.querySelector('span').textContent='Golem: Terremoto → Pikachu: reação do piso';
 }
 function stop(){cancelAnimationFrame(raf);ctx.clearRect(0,0,1280,800);moved.forEach(v=>{v.u.x=v.x;v.u.y=v.y;updateCUEl(v.u);v.u.el.style.translate=v.translate});moved.clear()}
 function play(){
  stop();drawGrid();const start=performance.now(),reduced=!!CFG.reduceFx||matchMedia('(prefers-reduced-motion:reduce)').matches;
  const snapshot=document.createElement('canvas');snapshot.width=1280;snapshot.height=800;const sg=snapshot.getContext('2d');
  // Both original layers use a 640px horizontal apron; arena has a 256px top apron.
  sg.drawImage(document.getElementById('scene'),640*CS,0,1280*CS,800*CS,0,0,1280,800);
  sg.drawImage(document.getElementById('arenabase'),640*CS,256*CS,1280*CS,800*CS,0,0,1280,800);
  const tiles=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const d=hdist(4,3,r,c);if(d>2)continue;const p=hexXY(r,c),radius=S_-2,k=perspectiveScale(r),seed=r*17+c*29;
   let rng=seed+431;const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296};
   const verts=Array.from({length:6},(_,i)=>{const a=(60*i-30)*Math.PI/180;return[Math.cos(a)*radius*k,Math.sin(a)*radius*k]});
   const center=[(random()-.5)*radius*.5,(random()-.5)*radius*.5],offset=seed%2;
   const branches=Array.from({length:3},(_,i)=>{const v=verts[(i*2+offset)%6],path=[center];for(let j=1;j<4;j++){const f=j/4;path.push([center[0]+(v[0]-center[0])*f+(random()-.5)*radius*.2,center[1]+(v[1]-center[1])*f+(random()-.5)*radius*.2])}path.push(v);return path});
   const fragments=branches.map((branch,i)=>{const next=(i+1)%3,index=(i*2+offset)%6,points=[...branch,verts[(index+1)%6],...branches[next].slice().reverse()];const cx=points.reduce((s,v)=>s+v[0],0)/points.length,cy=points.reduce((s,v)=>s+v[1],0)/points.length,length=Math.hypot(cx-center[0],cy-center[1])||1;return{points,x:(cx-center[0])/length,y:(cy-center[1])/length,tilt:(random()-.5)*.06,depth:3+random()*3}});
   tiles.push({r,c,...p,radius,k,d,fragments,phase:seed*.7,angle:(seed%9-4)*.004,delay:d*.13});
  }
  let reaction=-1;
  const unitEls=B.units.filter(u=>u.el&&u.alive).map(u=>({el:u.el,u,baseX:u.x,baseY:u.y}));
  function frame(now){const t=(now-start)/1000;ctx.clearRect(0,0,1280,800);const end=Math.max(0,Math.min(1,(5.4-t)/1.4));
   // Cover the original static tile faces with a dark seam bed before moving their textures.
   tiles.forEach(p=>{const age=t-p.delay;if(age<0)return;const onset=Math.min(1,age*8);ctx.globalAlpha=onset*end;hexPath(ctx,p.x,p.y,p.radius+1,p.k);ctx.fillStyle='#211f19';ctx.fill()});ctx.globalAlpha=1;
   tiles.forEach(p=>{
    const age=t-p.delay;if(age<0)return;const envelope=Math.max(0,1-age/3.6),amp=reduced?0:envelope*(p.d===0?18:13),dx=Math.sin(age*27+p.phase)*amp*.85,dy=Math.sin(age*34+p.phase)*amp*1.1,lift=Math.sin(Math.min(1,age/.45)*Math.PI)*amp,rot=Math.sin(age*22+p.phase)*p.angle*4*envelope;
    const gap=Math.min(1,age*4)*end*(p.d===0?5:3);
    ctx.save();ctx.translate(p.x+dx,p.y+dy-lift);ctx.rotate(rot);ctx.globalAlpha=end;
    // Seams are empty space between textured fragments, not strokes on the surface.
    p.fragments.forEach(f=>{
     ctx.save();ctx.translate(f.x*gap,f.y*gap);ctx.rotate(reduced?0:f.tilt*envelope);
     const path=()=>{ctx.beginPath();f.points.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath()};
     ctx.save();ctx.translate(0,f.depth);path();ctx.fillStyle='#62553e';ctx.fill();ctx.restore();
     ctx.save();path();ctx.clip();ctx.drawImage(snapshot,-p.x,-p.y);ctx.restore();
     // Exposed bevel stays subtle and irregular; no repeated central zigzag.
     ctx.beginPath();const boundary=f.points.slice(0,5);boundary.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.strokeStyle='#bca77b';ctx.lineWidth=.8;ctx.stroke();ctx.restore();
    });
    ctx.restore();
    // Small grit only at seams, no clouds or glowing shock rings.
    if(age<1.3){ctx.globalAlpha=(1-age/1.3)*.6;ctx.fillStyle='#796b4f';for(let j=0;j<3;j++){const a=p.phase+j*2.1,x=p.x+Math.cos(a)*p.radius*.7,y=p.y+Math.sin(a)*p.radius*.6-age*12;ctx.fillRect(Math.round(x),Math.round(y),2,2)}ctx.globalAlpha=1}
   });
   unitEls.forEach(({el,u,baseX,baseY})=>{
    const p=tiles.find(p=>p.r===u.r&&p.c===u.c);if(!p)return;
    if(!moved.has(el))moved.set(el,{u,x:baseX,y:baseY,translate:el.style.translate});
    const age=t-p.delay;if(age<0)return;
    const env=Math.max(0,1-age/3.6),amp=reduced?0:env*(p.d===0?18:13);
    const dx=Math.sin(age*27+p.phase)*amp*.85,dy=Math.sin(age*34+p.phase)*amp*1.1,lift=Math.sin(Math.min(1,age/.45)*Math.PI)*amp;
    // Use the same world coordinates as the moving tile, not a decorative CSS offset.
    u.x=baseX+dx;u.y=baseY+dy-lift;updateCUEl(u);
    if(u===target){
     if(reaction<0){reaction=0;PMD.playNames(el,['Hurt'])}
    }
   });
   if(t<5.4)raf=requestAnimationFrame(frame);else{stop();ui.querySelector('span').textContent='Pronto para repetir'}
  }
  ui.querySelector('span').textContent='Cada placa reage à passagem do abalo';raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-play]').textContent='▶ Golem: Terremoto';
 ui.querySelector('[data-play]').onclick=async()=>{
  const request=++sequence;clearTimeout(windup);prepare();stop();SND.init();
  ui.querySelector('span').textContent='Preparando reação de impacto…';
  const data=await PMD.get(25,false);
  if(data)await PMD.ensure(data,'Hurt');
  if(request!==sequence)return;
  const move=attacker.moves.find(m=>m.emerald==='EARTHQUAKE');
  ui.querySelector('span').textContent='Golem prepara '+(move?.n||'Terremoto');
  PMD.playNames(attacker.el,['Slam','Attack','Strike']);
  windup=setTimeout(()=>{play();ui.querySelector('span').textContent='Reação rápida de susto + movimento da placa · sem dano';},380);
 };
 ui.querySelector('[data-view]').textContent='Preparar Golem × Pikachu';
 ui.querySelector('[data-view]').onclick=prepare;
 addEventListener('pagehide',()=>{sequence++;clearTimeout(windup);stop()});
})();

