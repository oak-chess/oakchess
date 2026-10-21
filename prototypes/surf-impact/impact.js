/* Surf presentation experiment on the original arena, without combat damage. */
(()=>{
 const arena=document.getElementById('arenaView');
 const layer=z=>{const cv=document.createElement('canvas');cv.width=1280;cv.height=800;cv.style.cssText=`position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:${z}`;arena.append(cv);return cv};
 const ground=layer(1),crest=layer(2500),g=ground.getContext('2d'),f=crest.getContext('2d');
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;max-width:calc(100% - 24px);display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#302d24;color:#f6e3b9;border:2px solid #bca16e;padding:8px;font:13px Arial';
 ui.innerHTML='<b>PROTÓTIPO · SURF</b><button data-prepare>Preparar Blastoise × Pikachu</button><button data-play>▶ Blastoise: Surf</button><span aria-live="polite">Sem dano · cenário real</span>';document.body.append(ui);ui.querySelectorAll('button').forEach(b=>b.style.cssText='min-height:36px;padding:6px 12px;background:#306773;color:#fff0cd;border:1px solid #bca16e');
 let attacker,target,raf=0,token=0,base=null;
 function stop(reset=true){cancelAnimationFrame(raf);g.clearRect(0,0,1280,800);f.clearRect(0,0,1280,800);if(target&&base&&reset){target.x=base.x;target.y=base.y;updateCUEl(target);target.el._pmdOne=null}if(reset)base=null}
 function prepare(){
  stop();document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;
  if(!attacker?.el?.isConnected||!target?.el?.isConnected){clearCombatUnits();const make=(id,side,r,c)=>{const L=LINES.find(L=>L.ids.includes(id));const u=mkCU({line:L.i,star:L.ids.indexOf(id)+1,r,c,items:[]},side);B.units.push(u);addCUEl(u);return u};attacker=make(9,0,5,2);target=make(25,1,3,4)}
  attacker.target=target;target.target=attacker;faceTo(attacker,target);faceTo(target,attacker);updateCUEl(attacker);updateCUEl(target);ui.querySelector('[data-prepare]').hidden=true;
 }
 function run(){
  stop();base={x:target.x,y:target.y};const origin={x:attacker.x,y:attacker.y},vx=base.x-origin.x,vy=base.y-origin.y,length=Math.hypot(vx,vy),dx=vx/length,dy=vy/length,nx=-dy,ny=dx;
  const reduce=!!CFG.reduceFx||matchMedia('(prefers-reduced-motion:reduce)').matches,start=performance.now();let hit=false;
  const project=(s,w,lift=0)=>[origin.x+dx*s+nx*w,origin.y+dy*s+ny*w-lift];
  const tiles=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const p=hexXY(r,c),px=p.x-origin.x,py=p.y-origin.y,s=px*dx+py*dy,w=px*nx+py*ny;if(s>-40&&s<length+170&&Math.abs(w)<100)tiles.push({...p,r,c,s,w})}
  function frame(now){
   const t=(now-start)/1000,travel=(t-.35)*220,front=travel<=length+45?travel:length+45+95*(1-Math.exp(-(travel-length-45)/95)),fade=Math.max(0,Math.min(1,(5-t)/1.5));g.clearRect(0,0,1280,800);f.clearRect(0,0,1280,800);
   // Water spreads over the actual floor, leaving shallow pools that drain away.
   tiles.forEach(p=>{const age=(front-p.s)/220;if(age<0)return;const wet=Math.min(1,age*6)*Math.max(0,1-age/4)*fade;
    g.save();hexPath(g,p.x,p.y,S_-2,perspectiveScale(p.r));g.clip();g.fillStyle=`rgba(37,105,120,${wet*.48})`;g.fillRect(p.x-70,p.y-70,140,140);
    for(let j=0;j<4;j++){const s=p.s+Math.sin(t*2+j+p.r)*7,w=p.w+(j-1.5)*13;const a=project(s,w);g.strokeStyle=`rgba(176,220,210,${wet*.32})`;g.lineWidth=1;g.beginPath();g.moveTo(a[0]-nx*9,a[1]-ny*9);g.lineTo(a[0]+nx*9,a[1]+ny*9);g.stroke()}g.restore();
   });
   // A coherent moving ridge rather than a stream of small projectiles.
   if(front>0&&front<length+140){
    const edgeFade=Math.min(1,front/45,Math.max(0,(length+140-front)/80)),height=(reduce?18:36)*edgeFade,width=78;
    const back=[],lip=[];for(let w=-width;w<=width;w+=6){const taper=Math.sqrt(Math.max(0,1-w*w/(width*width))),bend=Math.sin(w*.06+t*5)*4;lip.push(project(front+bend,w,height*taper));back.push(project(front-52*taper,w,1))}
    f.beginPath();back.forEach((p,i)=>i?f.lineTo(...p):f.moveTo(...p));lip.slice().reverse().forEach(p=>f.lineTo(...p));f.closePath();const grad=f.createLinearGradient(0,origin.y-60,0,origin.y+20);grad.addColorStop(0,'#82c5c6');grad.addColorStop(1,'#276d84');f.globalAlpha=.82*edgeFade;f.fillStyle=grad;f.fill();
    f.strokeStyle='#d9ece0';f.lineWidth=3;f.beginPath();lip.forEach((p,i)=>i?f.lineTo(...p):f.moveTo(...p));f.stroke();f.globalAlpha=1;
    // Short foam curls break along the crest and collapse onto the surface.
    for(let j=0;j<15;j++){const w=-70+j*10,taper=Math.max(0,1-Math.abs(w)/80),a=project(front+Math.sin(j*2+t*8)*5,w,height*taper+Math.sin(t*9+j)*3);f.fillStyle=j%3?'#bde0d7':'#f0f0d8';f.globalAlpha=edgeFade*.85;f.fillRect(Math.round(a[0]/2)*2,Math.round(a[1]/2)*2,4+j%3*2,2)}f.globalAlpha=1;
   }
   const hitAge=t-(.35+length/220);
   if(hitAge>=0){
    if(!hit){hit=true;PMD.playNames(target.el,['Hurt'])}
    // Follow the travelling water front, then settle at its final displacement.
    const carried=95*(1-Math.exp(-Math.max(0,front-length)/80));
    const buoyancy=reduce?0:Math.sin(Math.min(1,hitAge/.85)*Math.PI)*13;
    target.x=base.x+dx*carried;target.y=base.y+dy*carried-buoyancy;updateCUEl(target);
    if(hitAge<1.2)for(let i=0;i<18;i++){const a=i*2.399,age=hitAge,dist=12+age*(35+i%5*8);f.globalAlpha=Math.max(0,1-age/1.1)*.8;f.fillStyle=i%2?'#a6d6d2':'#e1efe4';f.fillRect(target.x+Math.cos(a)*dist,target.y+Math.sin(a)*dist*.5-Math.sin(age*Math.PI)*25,3,5)}f.globalAlpha=1;
   }
   if(t<5)raf=requestAnimationFrame(frame);else{stop(false);ui.querySelector('span').textContent='Alvo carregado pela onda · repita para reiniciar a cena'}
  }
  PMD.playNames(attacker.el,['Charge','Shoot','Attack']);ui.querySelector('span').textContent='Onda → contato → respingos → escoamento';raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-prepare]').onclick=prepare;
 ui.querySelector('[data-play]').onclick=async()=>{const request=++token;prepare();SND.init();ui.querySelector('span').textContent='Preparando animações…';const data=await PMD.get(25,false);if(data)await PMD.ensure(data,'Hurt');if(request===token)run()};
 addEventListener('pagehide',()=>{token++;stop()});
})();

