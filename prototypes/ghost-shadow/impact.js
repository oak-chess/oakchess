/* Ghost dash experiment: sink, travel as a floor shadow, then emerge beside target. */
(()=>{
 const arena=document.getElementById('arenaView'),floor=document.createElement('canvas');floor.width=1280;floor.height=800;floor.style.cssText='position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:1';arena.insertBefore(floor,document.getElementById('units'));const g=floor.getContext('2d');
 const style=document.createElement('style');style.textContent='#world .unit.ghost-shadow-demo .bob{animation:none!important;overflow:hidden}#world .unit.ghost-shadow-demo .sh{visibility:hidden}#world .unit.ghost-shadow-demo .spr canvas.pmdc{animation:none!important}';document.head.append(style);
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;max-width:calc(100% - 24px);display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px;border:2px solid #bca16e;background:#302d24;color:#f6e3b9;font:13px Arial';ui.innerHTML='<b>PROTÓTIPO · AVANÇO FANTASMA</b><select aria-label="Pokémon fantasma"><option value="92">Gastly</option><option value="93">Haunter</option><option value="94" selected>Gengar</option></select><button data-prepare>Preparar arena</button><button data-play>▶ Mergulhar na sombra</button><span aria-live="polite">Afundar → deslocar pelo chão → emergir</span>';document.body.append(ui);ui.querySelectorAll('button,select').forEach(b=>b.style.cssText='min-height:36px;padding:6px 12px;border:1px solid #bca16e;background:#665075;color:#fff0cd');
 let ghost,target,raf=0,token=0,restore=null;
 function reset(){cancelAnimationFrame(raf);g.clearRect(0,0,1280,800);if(restore){const {node,css,brow,items,x,y}=restore;node.style.cssText=css;ghost.el.querySelector('.brow').style.opacity=brow;ghost.el.querySelector('.its').style.opacity=items;ghost.el.classList.remove('ghost-shadow-demo');ghost.x=x;ghost.y=y;ghost.el._pmdOne=null;updateCUEl(ghost);restore=null}}
 function prepare(){reset();document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;
  if(!ghost?.el?.isConnected||ghost.id!==Number(ui.querySelector('select').value)){clearCombatUnits();const make=(id,side,r,c)=>{const L=LINES.find(L=>L.ids.includes(id)),u=mkCU({line:L.i,star:L.ids.indexOf(id)+1,items:[],r,c},side);B.units.push(u);addCUEl(u);return u};ghost=make(Number(ui.querySelector('select').value),0,5,2);target=make(25,1,3,4)}
  ghost.target=target;target.target=ghost;faceTo(ghost,target);faceTo(target,ghost);updateCUEl(ghost);updateCUEl(target);ui.querySelector('[data-prepare]').hidden=true;
 }
 function run(){
  const node=ghost.el.querySelector('canvas.pmdc')||ghost.el.querySelector('.spr img');if(!node){ui.querySelector('span').textContent='Sprite ainda carregando. Tente novamente.';return}
  restore={node,css:node.style.cssText,brow:ghost.el.querySelector('.brow').style.opacity,items:ghost.el.querySelector('.its').style.opacity,x:ghost.x,y:ghost.y};
  const start=performance.now(),origin={x:ghost.x,y:ghost.y},end=hexXY(3,3),height=Math.max(50,node.getBoundingClientRect().height/(SC||1)),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const silhouette=document.createElement('canvas');silhouette.width=node.width||node.naturalWidth||96;silhouette.height=node.height||node.naturalHeight||96;const sg=silhouette.getContext('2d');sg.drawImage(node,0,0,silhouette.width,silhouette.height);sg.globalCompositeOperation='source-in';sg.fillStyle='#18151e';sg.fillRect(0,0,silhouette.width,silhouette.height);
  ghost.el.classList.add('ghost-shadow-demo');
  const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>n*n*(3-2*n);
  function point(p){const e=smooth(clamp(p));return{x:origin.x+(end.x-origin.x)*e,y:origin.y+(end.y-origin.y)*e}}
  function shadow(x,y,width,alpha,phase){
   g.save();g.globalAlpha=alpha;g.fillStyle='#211b2b';g.beginPath();g.moveTo(x-width*.6,y);g.bezierCurveTo(x-width*.55,y-9,x-width*.12,y-12,x+width*.1,y-8);g.bezierCurveTo(x+width*.75,y-10,x+width*.7,y+6,x+width*.2,y+7);g.bezierCurveTo(x-width*.3,y+11,x-width*.65,y+6,x-width*.6,y);g.fill();
   g.globalAlpha=alpha*.75;g.imageSmoothingEnabled=false;g.drawImage(silhouette,x-width*.6,y-8,width*1.2,16);
   g.globalAlpha=alpha*.3;g.strokeStyle='#756184';g.lineWidth=1;g.beginPath();g.ellipse(x,y,width*.55,8+Math.sin(phase*8),0,.2,Math.PI*.95);g.stroke();g.restore();
  }
  function shadowFace(x,y,alpha){
   g.save();g.translate(x,y);g.scale(1,.52);g.globalAlpha=alpha;
   g.fillStyle='#1c1627';g.beginPath();
   if(ghost.id===92){g.arc(0,-4,30,0,Math.PI*2);g.fill();g.globalAlpha=alpha*.4;for(let j=0;j<9;j++){const a=j*Math.PI*2/9;g.beginPath();g.ellipse(Math.cos(a)*31,Math.sin(a)*27-4,9,7,a,0,Math.PI*2);g.fill()}g.globalAlpha=alpha}
   else if(ghost.id===93){g.moveTo(-35,-5);g.lineTo(-42,-26);g.lineTo(-24,-20);g.lineTo(-28,-39);g.lineTo(-9,-28);g.lineTo(0,-34);g.lineTo(14,-27);g.lineTo(33,-38);g.lineTo(29,-17);g.lineTo(43,-21);g.lineTo(33,6);g.lineTo(18,18);g.lineTo(0,27);g.lineTo(-22,16);g.closePath();g.fill();for(const side of[-1,1]){g.beginPath();g.moveTo(side*39,13);g.lineTo(side*52,6);g.lineTo(side*50,18);g.lineTo(side*59,14);g.lineTo(side*54,27);g.lineTo(side*40,24);g.closePath();g.fill()}}
   else{g.moveTo(-30,7);g.quadraticCurveTo(-38,-10,-25,-23);g.lineTo(-29,-39);g.lineTo(-11,-29);g.quadraticCurveTo(0,-34,11,-29);g.lineTo(29,-39);g.lineTo(25,-23);g.quadraticCurveTo(38,-8,30,8);g.quadraticCurveTo(0,34,-30,7);g.fill()}
   // Narrow red eyes and the wide, toothy grin belong to the shadow itself.
   g.fillStyle=ghost.id===94?'#cf5369':'#e2dbe3';g.beginPath();g.moveTo(-21,-15);g.lineTo(-6,-9);g.lineTo(-8,-3);g.lineTo(-19,-6);g.closePath();g.fill();g.beginPath();g.moveTo(21,-15);g.lineTo(6,-9);g.lineTo(8,-3);g.lineTo(19,-6);g.closePath();g.fill();
   if(ghost.id!==94){g.fillStyle='#6d345d';g.fillRect(-13,-10,3,6);g.fillRect(10,-10,3,6)}
   g.fillStyle='#d5cbd3';g.beginPath();g.moveTo(-23,0);g.quadraticCurveTo(0,13,23,0);g.quadraticCurveTo(15,23,0,24);g.quadraticCurveTo(-15,23,-23,0);g.fill();
   g.strokeStyle='#302638';g.lineWidth=1.4;for(let i=-2;i<=2;i++){const x=i*6;g.beginPath();g.moveTo(x,8-Math.abs(i)*1.4);g.lineTo(x*.9,22-Math.abs(i)*2);g.stroke()}g.restore();
  }
  function frame(now){const t=(now-start)/1000;g.clearRect(0,0,1280,800);let sink=0,p=0,label='';
   if(t<.55){sink=smooth(clamp(t/.55));label=ghost.name+' afunda na própria sombra'}
   else if(t<1.65){sink=1;p=clamp((t-.55)/1.1);label='Somente a sombra desliza até o alvo'}
   else if(t<2){sink=1;p=1;label='O rosto de '+ghost.name+' aparece na sombra'}
   else{sink=1-smooth(clamp((t-2)/.65));p=1;label=ghost.name+' emerge da sombra ao lado do alvo'}
   const pos=point(p);ghost.x=pos.x;ghost.y=pos.y;ghost.moving=false;updateCUEl(ghost);
   node.style.translate=`0px ${sink*height}px`;node.style.filter=`brightness(${1-sink*.87}) saturate(${1-sink*.85})`;node.style.opacity=sink>.995?'0':'1';
   ghost.el.querySelector('.brow').style.opacity=String(1-sink);ghost.el.querySelector('.its').style.opacity=String(1-sink);
   if(p>0&&p<1)for(let j=5;j>=1;j--){const trail=point(p-j*.025);shadow(trail.x,trail.y,26-j*2,(6-j)*.045,t)}
   const pool=32+Math.sin(sink*Math.PI)*12;shadow(pos.x,pos.y,pool,.45+sink*.5,t);
   if(t>1.45&&t<2.65){const faceAlpha=Math.min(1,(t-1.45)/.2)*Math.min(1,(2.65-t)/.45);shadowFace(pos.x,pos.y,faceAlpha)}
   ui.querySelector('span').textContent=label;
   if(t<3.2)raf=requestAnimationFrame(frame);else{node.style.cssText=restore.css;ghost.el.querySelector('.brow').style.opacity=restore.brow;ghost.el.querySelector('.its').style.opacity=restore.items;ghost.el.classList.remove('ghost-shadow-demo');g.clearRect(0,0,1280,800);ui.querySelector('span').textContent='Gengar emergiu · repetir reinicia o avanço'}
  }
  // Lower motion amplitude is implicit: only a floor translation, with no camera shake.
  if(reduce)node.style.transition='none';raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-prepare]').onclick=prepare;
 ui.querySelector('select').onchange=()=>{token++;prepare()};
 ui.querySelector('[data-play]').onclick=async()=>{const request=++token;prepare();SND.init();ui.querySelector('span').textContent='Preparando o sprite do Gengar…';await PMD.get(ghost.id,false);if(CFG.pmd&&!ghost.el._pmd){await new Promise(resolve=>setTimeout(resolve,120))}if(request===token)run()};
 addEventListener('pagehide',()=>{token++;reset()});
})();
