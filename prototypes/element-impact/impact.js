/* Five visual experiments using the original arena and PMD sprites. */
(()=>{
 const shockStyle=document.createElement('style');shockStyle.textContent=`
 #world .unit.prototype-electrocuted .bob{animation:none!important}
 #world .unit.prototype-whirlwind .bob{animation:none!important}
 #world .unit.prototype-whirlwind canvas.pmdc,#world .unit.prototype-whirlwind .spr>img{animation:none!important}
 @keyframes prototypeWhirlSpin{0%,100%{rotate:-18deg}50%{rotate:18deg}}
 @media(prefers-reduced-motion:reduce){#world .unit.prototype-whirlwind canvas.pmdc,#world .unit.prototype-whirlwind .spr>img{animation:none!important}}
 #world .unit.prototype-electrocuted canvas.pmdc,#world .unit.prototype-electrocuted .spr>img{animation:prototypeShockShake .12s steps(2,end) infinite,prototypeShockFlash .32s steps(2,end) infinite!important;will-change:transform,filter}
 @keyframes prototypeShockShake{0%,100%{transform:translate(-7px,1px)}50%{transform:translate(7px,-2px)}}
 @keyframes prototypeShockFlash{0%,100%{filter:brightness(2) sepia(1) saturate(3) drop-shadow(0 0 5px #ffe04f)}50%{filter:brightness(.48) sepia(1) saturate(2) drop-shadow(0 0 3px #f5b731)}}
 @media(prefers-reduced-motion:reduce){#world .unit.prototype-electrocuted canvas.pmdc,#world .unit.prototype-electrocuted .spr>img{animation:none!important;filter:sepia(1) saturate(2) drop-shadow(0 0 4px #ffe04f)}}`;document.head.append(shockStyle);
 const arena=document.getElementById('arenaView'),makeLayer=z=>{const c=document.createElement('canvas');c.width=1280;c.height=800;c.style.cssText=`position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:${z}`;arena.append(c);return c.getContext('2d')},floor=makeLayer(1),fx=makeLayer(2500);
 const modes={fire:{n:'Fogo',id:6,label:'Chamas → brasas → piso chamuscado'},electric:{n:'Eletricidade',id:26,label:'Descargas pelo piso → contato → faíscas'},rock:{n:'Pedra',id:76,label:'Impacto → fragmentos quicando → poeira'},poison:{n:'Veneno',id:89,label:'Poças nas frestas → bolhas → dissipação'},wind:{n:'Vento',id:18,label:'Rajada → poeira e folhas → resistência'}};
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;max-width:calc(100% - 24px);display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px;border:2px solid #bca16e;background:#302d24;color:#f6e3b9;font:13px Arial';ui.innerHTML='<b>INTERAÇÕES DA ARENA</b><select aria-label="Elemento">'+Object.entries(modes).map(([k,m])=>`<option value="${k}">${m.n}</option>`).join('')+'</select><button data-prepare>Preparar arena</button><button data-play>▶ Demonstrar</button><span aria-live="polite">Cinco protótipos · sem dano</span>';document.body.append(ui);ui.querySelectorAll('button,select').forEach(b=>b.style.cssText='min-height:36px;padding:6px 12px;background:#765336;color:#fff0cd;border:1px solid #bca16e;font:13px Arial');
 const flameImage=new Image();
 const flameReady=new Promise(resolve=>{flameImage.onload=()=>resolve(true);flameImage.onerror=()=>resolve(false)});
 flameImage.src='assets/move-fx/emerald/fire.png';
 let attacker,targets=[],bases=[],raf=0,token=0,current='';
 function stop(reset=true){cancelAnimationFrame(raf);floor.clearRect(0,0,1280,800);fx.clearRect(0,0,1280,800);bases.forEach(p=>{p.u.el.classList.remove('prototype-electrocuted','prototype-whirlwind');if(p.fa!==undefined)p.u.fa=p.fa;p.fire?.remove();p.electric?.remove();if(p.spinSprite)p.spinSprite.style.rotate=p.spinRotate;if(p.turnCanvas){p.turnCanvas.remove();p.turnOriginal.style.display=p.turnDisplay}if(p.shockSprite){p.shockSprite.style.translate=p.shockTranslate;p.shockSprite.style.filter=p.shockFilter}});if(reset){bases.forEach(p=>{p.u.x=p.x;p.u.y=p.y;p.u.el.style.translate=p.translate;p.u.el._pmdOne=null;updateCUEl(p.u)});bases=[]}}
 function prepare(){stop();document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;const mode=ui.querySelector('select').value;
  if(current!==mode||!attacker?.el?.isConnected){clearCombatUnits();const make=(id,side,r,c)=>{const L=LINES.find(L=>L.ids.includes(id));if(!L)throw Error('Pokémon ausente '+id);const u=mkCU({line:L.i,star:L.ids.indexOf(id)+1,r,c,items:[]},side);B.units.push(u);addCUEl(u);return u};attacker=make(modes[mode].id,0,5,2);targets=[make(25,1,3,3),make(133,1,3,4)];current=mode}
  attacker.target=targets[0];faceTo(attacker,targets[0]);updateCUEl(attacker);targets.forEach(u=>{faceTo(u,attacker);updateCUEl(u)});ui.querySelector('[data-prepare]').hidden=true;ui.querySelector('span').textContent=modes[mode].label;
 }
 function path(g,points){g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath()}
 function bolt(g,x,y,x2,y2,seed,t){g.beginPath();g.moveTo(x,y);for(let i=1;i<=7;i++){const f=i/7,j=i===7?0:Math.sin(seed+i*17+Math.floor(t*15))*7;g.lineTo(x+(x2-x)*f+j,y+(y2-y)*f-j*.6)}g.stroke()}
 function run(){stop();const mode=current,start=performance.now(),origin=hexXY(3,3),reduced=!!CFG.reduceFx||matchMedia('(prefers-reduced-motion:reduce)').matches;
  bases=targets.map((u,i)=>({u,x:u.x,y:u.y,translate:u.el.style.translate,reacted:false,i,fa:u.fa}));
  const tiles=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const d=hdist(3,3,r,c);if(d<=2)tiles.push({...hexXY(r,c),r,c,d,seed:r*37+c*19})}
  const debris=Array.from({length:54},(_,i)=>{const a=i*2.39996,dist=15+(i%8)*12;return{x:origin.x+Math.cos(a)*dist,y:origin.y+Math.sin(a)*dist*.55,a,s:3+i%6,v:24+(i%7)*10,delay:(i%6)*.055}});
  PMD.playNames(attacker.el,['Shoot','Charge','Attack']);ui.querySelector('span').textContent=modes[mode].label;
  function frame(now){const t=(now-start)/1000,fade=Math.max(0,Math.min(1,(6-t)/1.6));floor.clearRect(0,0,1280,800);fx.clearRect(0,0,1280,800);
   tiles.forEach(p=>{const age=t-.35-p.d*.13;if(age<0)return;const onset=Math.min(1,age*5),a=onset*fade;
    floor.save();hexPath(floor,p.x,p.y,S_-2,perspectiveScale(p.r));floor.clip();
    if(mode==='fire'){
     const burn=Math.min(1,Math.max(0,(age-.7)/1.4));
     floor.globalAlpha=a*burn*.62;floor.fillStyle='#514530';
     path(floor,Array.from({length:11},(_,j)=>{const angle=j*Math.PI*2/11,radius=18+Math.sin(p.seed*4+j*7)*9;return[p.x+Math.cos(angle)*radius,p.y+Math.sin(angle)*radius*.65]}));floor.fill();
     if(age<3.5){const heat=floor.createRadialGradient(p.x,p.y,1,p.x,p.y,29);heat.addColorStop(0,'rgba(241,134,40,.35)');heat.addColorStop(1,'rgba(241,134,40,0)');floor.globalAlpha=a*Math.max(0,1-age/3.5);floor.fillStyle=heat;floor.fillRect(p.x-30,p.y-30,60,60)}
    }else if(mode==='electric'){
     if(age<3.6){
      const charge=a*Math.min(1,(3.6-age)/.7),angle=p.seed*.7+Math.floor(t*8)*.8;
      floor.globalAlpha=charge*.32;const glow=floor.createRadialGradient(p.x,p.y,2,p.x,p.y,38);glow.addColorStop(0,'#f5d96b');glow.addColorStop(1,'rgba(220,180,60,0)');floor.fillStyle=glow;floor.fillRect(p.x-40,p.y-40,80,80);
      for(let j=0;j<2;j++){const x2=p.x+Math.cos(angle+j*2.2)*32,y2=p.y+Math.sin(angle+j*2.2)*25;
       floor.globalAlpha=charge*.65;floor.lineWidth=5;floor.strokeStyle='#b18b37';bolt(floor,p.x-8,p.y+6,x2,y2,p.seed+j,t);
       floor.globalAlpha=charge;floor.lineWidth=2;floor.strokeStyle='#fff2a6';bolt(floor,p.x-8,p.y+6,x2,y2,p.seed+j,t);
      }
     }
    }else if(mode==='rock'){
     floor.globalAlpha=a*.23;floor.fillStyle='#75654b';for(let j=0;j<7;j++){const angle=p.seed+j*2.4;floor.fillRect(p.x+Math.cos(angle)*(8+j*3),p.y+Math.sin(angle)*(6+j*2),2+j%3,2)}
    }else if(mode==='poison'){
     const spread=Math.min(1,age*.8+.25),points=Array.from({length:12},(_,j)=>{const theta=j*Math.PI/6,r=(24+Math.sin(p.seed+j*2.4)*9)*spread;return[p.x+Math.cos(theta)*r,p.y+Math.sin(theta)*r*.64]});
     const puddle=()=>{floor.beginPath();const first=points[0],last=points.at(-1);floor.moveTo((first[0]+last[0])/2,(first[1]+last[1])/2);points.forEach((v,j)=>{const next=points[(j+1)%points.length];floor.quadraticCurveTo(...v,(v[0]+next[0])/2,(v[1]+next[1])/2)});floor.closePath()};
     floor.save();floor.translate(0,2);puddle();floor.globalAlpha=a*.8;floor.fillStyle='#3c3047';floor.fill();floor.restore();
     const liquid=floor.createRadialGradient(p.x-10,p.y-9,1,p.x,p.y,34);liquid.addColorStop(0,'#9e83ae');liquid.addColorStop(.48,'#71507f');liquid.addColorStop(1,'#42314f');puddle();floor.globalAlpha=a*.92;floor.fillStyle=liquid;floor.fill();
     floor.globalAlpha=a*.45;floor.strokeStyle='#b9a1bc';floor.lineWidth=1.2;floor.beginPath();floor.ellipse(p.x-7,p.y-5,10*spread,3*spread,-.2,Math.PI*1.05,Math.PI*1.9);floor.stroke();
     for(let j=0;j<3;j++){const bubble=(age*.65+p.seed*.07+j*.33)%1,bx=p.x+Math.sin(p.seed+j*3)*15*spread,by=p.y+Math.cos(p.seed+j*5)*9*spread,radius=1+bubble*4;floor.globalAlpha=a*Math.min(1,(1-bubble)*3);floor.fillStyle='#846591';floor.beginPath();floor.ellipse(bx,by,radius,radius*.75,0,0,Math.PI*2);floor.fill();floor.strokeStyle='#c6b1c8';floor.lineWidth=1;floor.beginPath();floor.ellipse(bx-1,by-1,radius*.65,radius*.45,-.3,Math.PI,Math.PI*1.85);floor.stroke()}
    }
    floor.restore();
    if(mode==='fire'&&age<3.3&&flameImage.complete&&flameImage.naturalWidth){
     const ignition=Math.min(1,age*8),out=Math.min(1,(3.3-age)/.7),count=p.d===2?1:2;
     fx.imageSmoothingEnabled=false;
     for(let j=0;j<count;j++){
      const phase=p.seed*.17+j*.43,x=p.x+Math.sin(p.seed+j*4)*15,y=p.y+Math.cos(p.seed*2+j)*9;
      const frames=Math.max(1,Math.floor(flameImage.naturalHeight/32)),frame=Math.floor((age*13+phase*8))%frames;
      const width=(34+(p.seed+j*13)%19)*ignition,height=(48+(p.seed+j*7)%29)*( .94+Math.sin(t*9+phase)*.06)*ignition;
      fx.globalAlpha=out*.94;fx.drawImage(flameImage,0,frame*32,32,32,Math.round(x-width/2),Math.round(y-height+7),width,height);
     }fx.globalAlpha=1;
    }
   });
   debris.forEach((p,i)=>{const age=t-.35-p.delay;if(age<0)return;
    if(mode==='rock'){
     const air=Math.max(0,Math.sin(Math.min(1,age/.65)*Math.PI)*p.v*.55)+Math.max(0,Math.sin(Math.max(0,Math.min(1,(age-.65)/.45))*Math.PI)*p.v*.16),drift=p.v*(1-Math.exp(-age*2)),x=p.x+Math.cos(p.a)*drift,y=p.y+Math.sin(p.a)*drift*.65;
     const size=p.s*(i%6===0?1.65:1.15);
     floor.globalAlpha=fade*.32;floor.fillStyle='#39362d';floor.beginPath();floor.ellipse(x+2,y+4,size*.95,3+size*.25,0,0,Math.PI*2);floor.fill();
     fx.save();fx.translate(x,y-air);fx.rotate(age<1.1?Math.sin(p.a)*age*3:Math.sin(p.a)*3.3);fx.globalAlpha=fade;
     const verts=[[-size,-size*.15],[-size*.45,-size*.9],[size*.43,-size*.76],[size,-size*.12],[size*.6,size*.62],[-size*.5,size*.7]],center=[-size*.12,-size*.02];
     path(fx,verts);fx.fillStyle='#68665a';fx.fill();
     path(fx,[verts[0],verts[1],verts[2],center]);fx.fillStyle=i%2?'#b1ad97':'#a09f91';fx.fill();
     path(fx,[verts[2],verts[3],verts[4],center]);fx.fillStyle='#77776b';fx.fill();
     path(fx,[verts[4],verts[5],verts[0],center]);fx.fillStyle='#4d5148';fx.fill();
     path(fx,verts);fx.strokeStyle='#41463c';fx.lineWidth=.8;fx.stroke();
     fx.strokeStyle='#d0c9ac';fx.lineWidth=.8;fx.beginPath();fx.moveTo(...verts[0]);fx.lineTo(...verts[1]);fx.lineTo(...verts[2]);fx.stroke();fx.restore();
     if(age<1.2){floor.globalAlpha=(1-age/1.2)*.2;floor.fillStyle='#c6b28b';floor.fillRect(x-7,y-3,16+age*12,6)}
    }else if(mode==='fire'&&age<2.8){fx.globalAlpha=Math.max(0,1-age/2.8)*.8;fx.fillStyle=i%3?'#dc944b':'#ffe2a1';fx.fillRect(p.x+Math.sin(age*3+i)*9,p.y-age*(15+i%6*5),2,2)}
    else if(mode==='electric'&&age<1.7&&i%3===0){const flicker=Math.sin(t*35+i)>.2;if(flicker){fx.globalAlpha=(1-age/1.7)*.8;fx.strokeStyle='#f5df91';fx.lineWidth=1.5;bolt(fx,p.x,p.y,p.x+Math.cos(p.a)*12,p.y-12,p.a,t)}}
    else if(mode==='wind'&&age<2.3){const flow=age*115,x=p.x+flow*.8,y=p.y-flow*.32-Math.sin(age*4+i)*7;fx.globalAlpha=Math.max(0,1-age/2.3)*.65;if(i%3){fx.fillStyle=i%2?'#89965d':'#b5a575';path(fx,[[x-5,y],[x,y-3],[x+6,y+1],[x,y+3]]);fx.fill()}else{fx.strokeStyle='#c8c3a2';fx.lineWidth=1;fx.beginPath();fx.moveTo(x,y);fx.lineTo(x-27,y+9);fx.stroke()}}
   });floor.globalAlpha=1;fx.globalAlpha=1;
   if(mode==='wind'&&t>.35&&t<4.8){
    // Independent funnels travel through the field, narrow at the floor and broad above.
    for(let v=0;v<5;v++){
     const age=t-.35-v*.16;if(age<0)continue;
     const strength=Math.min(1,age*4)*Math.min(1,(4.8-t)/.8),phase=v*2.399;
     const anchor=v<2?bases[v]:null,x=anchor?anchor.x+Math.sin(age*1.6+v)*12:origin.x+Math.cos(phase)*75+Math.sin(age*1.6+v)*30+age*12,y=anchor?anchor.y+Math.cos(age*1.4+v)*5:origin.y+Math.sin(phase)*46-age*6;
     floor.globalAlpha=strength*.25;floor.fillStyle='#4a4938';floor.beginPath();floor.ellipse(x,y+3,23,10,0,0,Math.PI*2);floor.fill();floor.globalAlpha=1;
     const height=86+(v%3)*12;
     for(let j=0;j<11;j++){
      const h=j/10,radius=7+h*30,cy=y-h*height,wobble=Math.sin(age*6-h*5+v)*h*7;
      fx.globalAlpha=strength*(.3+h*.25);fx.fillStyle='#aab4a1';fx.beginPath();fx.ellipse(x+wobble,cy,radius,radius*.28,0,0,Math.PI*2);fx.fill();
      fx.globalAlpha=strength*.95;fx.strokeStyle=j%2?'#f0f1d8':'#d2ddc7';fx.lineWidth=j%3?2.5:3.5;
      const spin=age*9+j*.8+v;fx.beginPath();fx.ellipse(x+wobble,cy,radius,radius*.28,0,spin,spin+Math.PI*1.25);fx.stroke();
     }
     for(let j=0;j<12;j++){
      const h=((age*.55+j/12)%1),a=age*8+j*2.4+v,radius=8+h*23;
      const px=x+Math.cos(a)*radius,py=y-h*height+Math.sin(a)*radius*.25;
      fx.globalAlpha=strength*(1-h*.6);fx.fillStyle=j%3?'#8e9e61':'#d3bc86';
      fx.save();fx.translate(px,py);fx.rotate(a);fx.fillRect(-3,-1,6,2);fx.restore();
     }
    }fx.globalAlpha=1;
   }
   bases.forEach(p=>{const age=t-.48-p.i*.13;if(age<0)return;if(!p.reacted){p.reacted=true;if(!['fire','electric','wind'].includes(mode))PMD.playNames(p.u.el,['Hurt'])}
    let dx=0,dy=0;if(mode==='electric'&&age<3.5&&!reduced){const power=Math.min(1,(3.5-age)/.7),pulse=Math.floor(age*20),direction=pulse%2?1:-1;dx=direction*7*power;dy=(pulse%3-1)*2.5*power}
    if(mode==='rock'&&age<.6&&!reduced){dx=Math.sin(age*19)*5*(1-age/.6);dy=-Math.sin(age/.6*Math.PI)*5}
    if(mode==='wind'){
     const windAge=t-.35-p.i*.16,strength=Math.max(0,Math.min(1,windAge*3,(4.8-t)/.7));
     const centerX=p.x+Math.sin(windAge*1.6+p.i)*12,centerY=p.y+Math.cos(windAge*1.4+p.i)*5;
     dx=(centerX-p.x)+(reduced?0:Math.cos(windAge*7)*10*strength);
     dy=(centerY-p.y)-strength*(reduced?2:8)+(reduced?0:Math.sin(windAge*7)*3*strength);
     if(!p.spinSprite){p.spinSprite=p.u.el.querySelector('canvas.pmdc')||p.u.el.querySelector('.spr>img');if(p.spinSprite)p.spinRotate=p.spinSprite.style.rotate}
     p.u.el.classList.toggle('prototype-whirlwind',strength>0);
     p.u.moving=false;p.u.el._pmdOne=null;
     p.u.fa=strength>0&&!reduced?(p.fa||0)+windAge*Math.PI*2*1.2:p.fa;
     const st=p.u.el._pmd;
     if(strength>0&&st){
      if(!p.turnCanvas){p.turnOriginal=st.cv;p.turnDisplay=st.cv.style.display;p.turnCanvas=document.createElement('canvas');p.turnCanvas.className='pmdc prototype-turn-canvas';p.turnOriginal.after(p.turnCanvas)}
      p.turnCanvas.width=st.d.cw;p.turnCanvas.height=st.d.ch;p.turnCanvas.style.cssText=st.cv.style.cssText;p.turnCanvas.style.display='block';p.turnCanvas.style.rotate='none';st.cv.style.display='none';
      const anim=st.d.Idle.rows>=8?st.d.Idle:st.d.Walk;
      const row=matchMedia('(prefers-reduced-motion:reduce)').matches?0:Math.floor(Math.max(0,windAge)*8)%Math.min(8,anim.rows);
      const frame=0,rb=anim.b.fb?.[row]?.[frame]??anim.b.rb[row]??anim.fh;
      const cg=p.turnCanvas.getContext('2d');cg.imageSmoothingEnabled=false;
      cg.drawImage(anim.img,0,row*anim.fh,anim.fw,anim.fh,Math.round(st.d.ax-anim.fw/2),st.d.ch-rb-1,anim.fw,anim.fh);
     }else if(p.turnCanvas){p.turnCanvas.remove();p.turnCanvas=null;p.turnOriginal.style.display=p.turnDisplay}
     if(p.spinSprite)p.spinSprite.style.rotate=p.spinRotate;
    }
    p.u.x=p.x+dx;p.u.y=p.y+dy;updateCUEl(p.u);
    if(mode==='fire'&&age<5&&flameImage.naturalWidth){
     const intensity=Math.min(1,age*6)*Math.min(1,(5-age)/.9),frames=Math.max(1,Math.floor(flameImage.naturalHeight/32));
     if(!p.fire){
      p.fire=document.createElement('div');p.fire.style.cssText='position:absolute;left:50%;bottom:-3px;transform:translateX(-50%);width:72px;height:72px;pointer-events:none;z-index:100';
      for(let j=0;j<2;j++){const flame=document.createElement('div');flame.style.cssText=`position:absolute;left:${j*24}px;bottom:${j?7:0}px;width:48px;height:48px;background-image:url("${flameImage.src}");background-size:48px auto;background-repeat:no-repeat;image-rendering:pixelated`;p.fire.append(flame)}
      p.u.el.querySelector('.in').append(p.fire);
     }
     p.fire.style.opacity=String(intensity*.95);
     Array.from(p.fire.children).forEach((flame,j)=>flame.style.backgroundPosition=`0px ${-(Math.floor(age*13+p.i*3+j*3 )%frames)*48}px`);
     // Flames remain attached to the occupied Pokémon, extending up its sides and body.
     fx.imageSmoothingEnabled=false;
     for(let j=0;j<3;j++){
      const frame=Math.floor(age*13+p.i*3+j*2)%frames,width=j===1?23:29,height=j===1?42:54;
      const x=p.u.x+(j-1)*13,y=p.u.y-4-(j===1?11:0);
      fx.globalAlpha=intensity*(j===1?.5:.85);
      fx.drawImage(flameImage,0,frame*32,32,32,Math.round(x-width/2),Math.round(y-height),width,height);
     }
     for(let j=0;j<9;j++){
      const rise=(age*30+j*9)%72,x=p.u.x+Math.sin(j*4+p.i+age*2)*19,y=p.u.y-17-rise;
      fx.globalAlpha=intensity*(1-rise/72);fx.fillStyle=j%3?'#f2a34e':'#ffe6a1';fx.fillRect(Math.round(x),Math.round(y),2,3);
     }fx.globalAlpha=1;
    }else if(mode==='fire'&&p.fire){p.fire.remove();p.fire=null}
    if(mode==='electric'&&age<3.5){
     p.u.el.classList.add('prototype-electrocuted');
     if(!p.shockSprite){p.shockSprite=p.u.el.querySelector('.spr');if(p.shockSprite){p.shockTranslate=p.shockSprite.style.translate;p.shockFilter=p.shockSprite.style.filter}}
     if(p.shockSprite){
      const tick=Math.floor(age*18),power=Math.min(1,(3.5-age)/.7),flash=Math.floor(age*5)%2===0;
      p.shockSprite.style.translate=reduced?'0px 0px':`${(tick%2?8:-8)*power}px ${(tick%3-1)*3*power}px`;
      p.shockSprite.style.filter=reduced?'drop-shadow(0 0 4px #ffe585)':flash?'brightness(1.65) sepia(.8) saturate(2) drop-shadow(0 0 5px #ffdc55)':'brightness(.8) sepia(.5) saturate(1.5) drop-shadow(0 0 3px #fff2ac)';
     }
     if(!p.electric){const c=document.createElement('canvas');c.width=96;c.height=112;c.style.cssText='position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);width:96px;height:112px;z-index:101;pointer-events:none';p.u.el.querySelector('.in').append(c);p.electric=c}
     const eg=p.electric.getContext('2d'),strength=Math.min(1,age*8)*Math.min(1,(3.5-age)/.7);eg.clearRect(0,0,96,112);
     // Local arcs wrap around the sprite instead of remaining on the floor.
     for(let j=0;j<5;j++){
      const theta=j*Math.PI*2/5+Math.floor(age*12)*.27,x=48+Math.cos(theta)*25,y=63+Math.sin(theta)*27,x2=48+Math.cos(theta+1.1)*29,y2=63+Math.sin(theta+1.1)*30;
      eg.globalAlpha=strength*.45;eg.strokeStyle='#edbc42';eg.lineWidth=5;bolt(eg,x,y,x2,y2,j+p.i*7,age);
      eg.globalAlpha=strength;eg.strokeStyle='#fff3a1';eg.lineWidth=2;bolt(eg,x,y,x2,y2,j+p.i*7,age);
     }
     eg.globalAlpha=strength*.85;eg.fillStyle='#ffffd5';for(let j=0;j<4;j++){const x=48+Math.sin(j*7+Math.floor(age*17))*31,y=62+Math.cos(j*3+Math.floor(age*13))*33;eg.fillRect(x-3,y,7,2);eg.fillRect(x,y-3,2,7)}eg.globalAlpha=1;
    }else if(mode==='electric'){p.u.el.classList.remove('prototype-electrocuted','prototype-whirlwind');if(p.electric){p.electric.remove();p.electric=null}if(p.shockSprite){p.shockSprite.style.translate=p.shockTranslate;p.shockSprite.style.filter=p.shockFilter}}
   });
   if(t<6)raf=requestAnimationFrame(frame);else{stop(false);ui.querySelector('span').textContent=modes[mode].n+' · pronto para repetir'}
  }raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-prepare]').onclick=prepare;
 ui.querySelector('select').onchange=()=>{token++;prepare()};
 ui.querySelector('[data-play]').onclick=async()=>{const request=++token;prepare();SND.init();ui.querySelector('span').textContent='Preparando reações…';await Promise.all([flameReady,...[25,133].map(async id=>{const d=await PMD.get(id,false);if(d)await PMD.ensure(d,'Hurt')})]);if(request===token)run()};
 addEventListener('pagehide',()=>{token++;stop()});
})();






