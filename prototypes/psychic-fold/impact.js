/* Psychic fold prototype on the original arena; no damage or changes to the main game. */
(()=>{
 const arena=document.getElementById('arenaView');
 const layer=z=>{const cv=document.createElement('canvas');cv.width=1280;cv.height=800;cv.style.cssText=`position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:${z}`;arena.append(cv);return cv.getContext('2d')},floor=layer(1),fx=layer(2500);
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;max-width:calc(100% - 24px);display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#302d24;color:#f6e3b9;border:2px solid #bca16e;padding:8px;font:13px Arial';ui.innerHTML='<b>PROTÓTIPO · DOBRA PSÍQUICA</b><select aria-label="Pokémon psíquico"><option value="63">Abra</option><option value="64">Kadabra</option><option value="65" selected>Alakazam</option></select><button data-prepare>Preparar arena</button><button data-play>▶ Dobrar o espaço</button><span aria-live="polite">Aura → imagens residuais → reaparecer</span>';document.body.append(ui);ui.querySelectorAll('button,select').forEach(b=>b.style.cssText='min-height:36px;padding:6px 12px;border:1px solid #bca16e;background:#765478;color:#fff0cd;font:13px Arial');
 const css=document.createElement('style');css.textContent='#world .unit.psychic-fold-demo .bob{animation:none!important}#world .unit.psychic-fold-demo .sh{visibility:hidden}';document.head.append(css);
 let psychic,target,raf=0,token=0,state=null;
 function reset(){cancelAnimationFrame(raf);floor.clearRect(0,0,1280,800);fx.clearRect(0,0,1280,800);if(state){const {node,old,x,y}=state;node.style.translate=old.translate;node.style.scale=old.scale;node.style.opacity=old.opacity;node.style.filter=old.filter;psychic.el.querySelector('.brow').style.opacity=old.brow;psychic.el.querySelector('.its').style.opacity=old.items;psychic.el.classList.remove('psychic-fold-demo');psychic.x=x;psychic.y=y;updateCUEl(psychic);state=null}}
 function prepare(){reset();document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;const id=+ui.querySelector('select').value;
  if(!psychic?.el?.isConnected||psychic.id!==id){clearCombatUnits();const make=(id,side,r,c)=>{const L=LINES.find(L=>L.ids.includes(id)),u=mkCU({line:L.i,star:L.ids.indexOf(id)+1,r,c,items:[]},side);B.units.push(u);addCUEl(u);return u};psychic=make(id,0,5,2);target=make(25,1,3,4)}
  psychic.target=target;faceTo(psychic,target);faceTo(target,psychic);updateCUEl(psychic);updateCUEl(target);ui.querySelector('[data-prepare]').hidden=true;
 }
 const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>n*n*(3-2*n);
 function run(){
  const node=psychic.el.querySelector('canvas.pmdc')||psychic.el.querySelector('.spr img');if(!node)return;
  const image=document.createElement('canvas');image.width=node.width||node.naturalWidth;image.height=node.height||node.naturalHeight;if(!image.width||!image.height){ui.querySelector('span').textContent='Sprite carregando. Tente novamente.';return}const ig=image.getContext('2d');ig.drawImage(node,0,0,image.width,image.height);
  const tint=document.createElement('canvas');tint.width=image.width;tint.height=image.height;const tg=tint.getContext('2d');tg.drawImage(image,0,0);tg.globalCompositeOperation='source-in';tg.fillStyle='#c8a1e2';tg.fillRect(0,0,tint.width,tint.height);
  const r=node.getBoundingClientRect(),w=r.width/SC,h=r.height/SC,origin={x:psychic.x,y:psychic.y},end=hexXY(3,3),start=performance.now();
  state={node,x:origin.x,y:origin.y,old:{translate:node.style.translate,scale:node.style.scale,opacity:node.style.opacity,filter:node.style.filter,brow:psychic.el.querySelector('.brow').style.opacity,items:psychic.el.querySelector('.its').style.opacity}};
  psychic.el.classList.add('psychic-fold-demo');const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function ripple(p,progress,alpha){floor.save();floor.strokeStyle='#bda1dc';floor.lineWidth=1.5;floor.globalAlpha=alpha;for(let i=0;i<3;i++){const radius=10+(progress+i*.16)%1*39;floor.beginPath();floor.ellipse(p.x,p.y,radius,radius*.35,0,0,Math.PI*2);floor.stroke()}floor.restore()}
  function residue(x,y,alpha,scale=1){fx.save();fx.globalAlpha=alpha;fx.imageSmoothingEnabled=false;fx.drawImage(tint,x-w*scale/2,y-h*scale,w*scale,h*scale);fx.restore()}
  function frame(now){const t=(now-start)/1000;floor.clearRect(0,0,1280,800);fx.clearRect(0,0,1280,800);let visibility=1,label='';
   const departure=clamp(t/.65),arrival=clamp((t-1.2)/.55),moving=t>=.65;
   if(!moving){visibility=1-smooth(clamp((t-.18)/.47));label=psychic.name+' concentra a energia e dobra o espaço'}
   else if(t<1.2){visibility=0;label='Imagens residuais atravessam a dobra'}
   else{visibility=smooth(arrival);label=psychic.name+' reaparece na contração do espaço'}
   psychic.x=moving?end.x:origin.x;psychic.y=moving?end.y:origin.y;updateCUEl(psychic);
   node.style.opacity=String(visibility);node.style.scale=reduced?'1 1':`${Math.max(.2,visibility)} ${1+(1-visibility)*.16}`;node.style.filter=`brightness(${1+(1-visibility)*.7}) sepia(.25) hue-rotate(225deg) drop-shadow(0 0 ${3+(1-visibility)*6}px #b97cd6)`;
   psychic.el.querySelector('.brow').style.opacity=String(visibility);psychic.el.querySelector('.its').style.opacity=String(visibility);
   const charge=Math.sin(departure*Math.PI);if(t<.8){ripple(origin,departure,charge*.65);residue(origin.x-6,origin.y,charge*.22);residue(origin.x+6,origin.y,charge*.22)}
   if(t>.42&&t<1.65){for(let i=0;i<7;i++){const delay=.48+i*.085,age=t-delay;if(age<0||age>.5)continue;const p=(i+1)/8,x=origin.x+(end.x-origin.x)*p,y=origin.y+(end.y-origin.y)*p;residue(x,y,Math.sin(age/.5*Math.PI)*.43,.92)}}
   if(t>1.05&&t<2.1){const age=clamp((t-1.05)/1.05),intensity=Math.sin(age*Math.PI);ripple(end,1-age,intensity*.75);if(!reduced){fx.save();fx.globalAlpha=intensity*.75;fx.strokeStyle='#d7b7ee';fx.lineWidth=1.5;for(let i=0;i<4;i++){const a=i*Math.PI/2+t,rad=14+(1-arrival)*28,x=end.x+Math.cos(a)*rad,y=end.y-h*.45+Math.sin(a)*rad*.65;fx.beginPath();fx.moveTo(x-Math.cos(a)*7,y-Math.sin(a)*5);fx.lineTo(x,y);fx.stroke()}fx.restore()}}
   ui.querySelector('span').textContent=label;
   if(t<2.3)raf=requestAnimationFrame(frame);else{node.style.translate=state.old.translate;node.style.scale=state.old.scale;node.style.opacity=state.old.opacity;node.style.filter=state.old.filter;psychic.el.querySelector('.brow').style.opacity=state.old.brow;psychic.el.querySelector('.its').style.opacity=state.old.items;psychic.el.classList.remove('psychic-fold-demo');floor.clearRect(0,0,1280,800);fx.clearRect(0,0,1280,800);ui.querySelector('span').textContent='Dobra concluída · repetir reinicia a cena'}
  }raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-prepare]').onclick=prepare;ui.querySelector('select').onchange=()=>{token++;prepare()};
 ui.querySelector('[data-play]').onclick=async()=>{const request=++token;prepare();SND.init();ui.querySelector('span').textContent='Preparando sprite…';await PMD.get(psychic.id,false);if(CFG.pmd&&!psychic.el._pmd)await new Promise(resolve=>setTimeout(resolve,120));if(request===token)run()};
 addEventListener('pagehide',()=>{token++;reset()});
})();
