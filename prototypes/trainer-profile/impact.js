/* Prototype: overworld trainers on the real arena, recalling a defeated Pokémon. */
(()=>{
 const arena=document.getElementById('arenaView');
 const layer=z=>{const cv=document.createElement('canvas');cv.width=1280;cv.height=800;cv.style.cssText=`position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:${z}`;arena.append(cv);return cv.getContext('2d')},ground=layer(1),front=layer(2500);
 const assets={},ready=Promise.all(['red_normal','red_item','leaf_normal','leaf_item'].map(name=>new Promise(resolve=>{const im=new Image();im.onload=()=>{assets[name]=im;resolve()};im.onerror=resolve;im.src='prototypes/trainer-profile/sprites/'+name+'.png'})));
 const ball=new Image();ball.src=itemUrl('poke-ball');
 const ui=document.createElement('div');ui.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;max-width:calc(100% - 24px);display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px;border:2px solid #bca16e;background:#302d24;color:#f6e3b9;font:13px Arial';ui.innerHTML='<b>MEU TREINADOR · PRÉVIA</b><button data-prepare>Preparar arena</button><button data-recall="0">Recolher meu Pokémon</button><span aria-live="polite">Seu treinador · recolhimento pela Pokébola</span>';ui.className='tp-demo-bar';document.body.append(ui);ui.querySelectorAll('button').forEach(b=>b.style.cssText='min-height:36px;padding:6px 12px;background:#7d5136;color:#fff0cd;border:1px solid #bca16e');
 const trainers=[{x:345,y:590,name:'VOCÊ',sprite:'red_normal',mirror:true}];

 addEventListener('trainer-profile-change',e=>{trainers[0].sprite=e.detail.trainer+'_normal';trainers[0].name=e.detail.name;reset();drawTrainers()});
 let pokemon=[],raf=0,token=0,restore=null,recallUntil=0,idleRaf=0;
 function reset(){recallUntil=0;cancelAnimationFrame(raf);front.clearRect(0,0,1280,800);if(restore){const {u,node,old}=restore;node.style.visibility=old.visibility;u.el.querySelector('.brow').style.opacity=old.brow;u.el.querySelector('.its').style.opacity=old.items;u.hp=u.maxHp;u.alive=true;u.el._pmdOne=null;updateCUEl(u);restore=null}}
 function drawTrainers(active=-1,gesture=false){
  ground.clearRect(0,0,1280,800);front.clearRect(0,0,1280,800);
  if(window.TRAINER_DUO){TRAINER_DUO.draw(front,345,590,performance.now(),1);front.font='11px Arial';front.textAlign='center';front.fillStyle='#f3deb0';front.fillText(trainers[0].name,345,612);return}
  trainers.forEach((p,i)=>{
   ground.globalAlpha=.45;ground.fillStyle='#17201a';ground.beginPath();ground.ellipse(p.x,p.y+2,27,9,0,0,Math.PI*2);ground.fill();ground.globalAlpha=1;
   const img=assets[i===0&&i===active&&gesture?(p.sprite.startsWith('leaf')?'leaf_item':'red_item'):p.sprite];if(img&&img.complete&&img.naturalWidth){const frame=i===0&&i===active&&gesture?5:2;front.save();front.translate(p.x,p.y);front.scale(p.mirror?-1:1,1);front.imageSmoothingEnabled=false;front.drawImage(img,frame*16,0,16,32,-30,-120,60,120);front.restore()}
   front.font='10px Arial';front.textAlign='center';front.fillStyle='#f3deb0';front.fillText(p.name,p.x,p.y+20);
  });
 }
 function prepare(){reset();document.getElementById('ttl')?.style.setProperty('display','none','important');document.body.classList.remove('on-title');clearTimeout(TITLE_TM);DEMO.on=false;B.on=false;
  if(!pokemon.length||!pokemon[0].el.isConnected){clearCombatUnits();const make=(id,side,r,c)=>{const L=LINES.find(L=>L.ids.includes(id)),u=mkCU({line:L.i,star:L.ids.indexOf(id)+1,r,c,items:[]},side);B.units.push(u);addCUEl(u);return u};pokemon=[make(25,0,5,2),make(1,1,2,4)];pokemon.forEach((u,i)=>{faceTo(u,pokemon[1-i]);updateCUEl(u)})}
  ui.querySelector('[data-prepare]').hidden=true;drawTrainers();
 }
 function recall(side){recallUntil=performance.now()+2500;window.TRAINER_DUO?.react('recall');
  const u=pokemon[side],node=u.el.querySelector('canvas.pmdc')||u.el.querySelector('.spr img');if(!node)return;
  const width=node.width||node.naturalWidth,height=node.height||node.naturalHeight;if(!width||!height){ui.querySelector('span').textContent='Sprite carregando. Tente novamente.';return}
  // Use the visible body bounds, excluding PMD padding reserved for attack poses.
  let sx=0,sy=0,sw=width,sh=height;
  const st=u.el._pmd;
  if(st&&node===st.cv){
   const a=st.d[st.name]||st.d.Idle,b=a.b,row=Math.min(a.rows-1,st.frow||0);
   const bottom=b.rb[row]??b.mxy,top=b.rt[row]??b.mny;
   sx=Math.max(0,Math.floor(st.d.ax-a.fw/2+b.mnx));
   sy=Math.max(0,Math.floor(st.d.ch-bottom-1+top));
   sw=Math.min(width-sx,b.mxx-b.mnx+1);sh=Math.min(height-sy,bottom-top+1);
  }
  const image=document.createElement('canvas');image.width=sw;image.height=sh;const ig=image.getContext('2d');ig.drawImage(node,sx,sy,sw,sh,0,0,sw,sh);ig.globalCompositeOperation='source-in';ig.fillStyle='#ff7f94';ig.fillRect(0,0,sw,sh);
  const rect=node.getBoundingClientRect(),px=rect.width/width,py=rect.height/height;
  // The arena has a perspective transform: screen coordinates cannot simply
  // be divided by SC. Use the same inverse projection as arena pointer input.
  const point=(x,y)=>toWorld({clientX:x,clientY:y});
  const screenX=rect.left+(sx+sw/2)*px,screenY=rect.top+(sy+sh/2)*py;
  const center=point(screenX,screenY),left=point(screenX-sw*px/2,screenY),right=point(screenX+sw*px/2,screenY),top=point(screenX,screenY-sh*py/2),bottom=point(screenX,screenY+sh*py/2);
  const w=Math.hypot(right.x-left.x,right.y-left.y),h=Math.hypot(bottom.x-top.x,bottom.y-top.y),owner=trainers[side],hand={x:owner.x+(side===0?26:-26),y:owner.y-68};
  restore={u,node,old:{visibility:node.style.visibility,brow:u.el.querySelector('.brow').style.opacity,items:u.el.querySelector('.its').style.opacity}};
  u.hp=0;updateCUEl(u);const started=performance.now(),reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const clamp=n=>Math.max(0,Math.min(1,n));
  function frame(now){const t=(now-started)/1000,gesture=t>.2&&t<1.8;drawTrainers(side,gesture);
   if(t>.25&&t<1.85){
    if(ball.complete&&ball.naturalWidth){front.imageSmoothingEnabled=false;front.drawImage(ball,hand.x-11,hand.y-11,22,22)}
   }
   if(t>.35&&t<1.6){
    const pull=clamp((t-.72)/.85),ease=1-Math.pow(1-pull,3),x=center.x+(hand.x-center.x)*ease,y=center.y+(hand.y-center.y)*ease;
    front.save();front.globalAlpha=Math.min(1,(t-.35)*8)*(1-pull*.6);front.lineCap='round';front.strokeStyle='rgba(246,87,115,.28)';front.lineWidth=10;front.beginPath();front.moveTo(hand.x,hand.y);front.lineTo(x,y);front.stroke();front.strokeStyle='#f76c86';front.lineWidth=3;front.stroke();front.strokeStyle='#ffd4d6';front.lineWidth=1;front.stroke();front.restore();
    node.style.visibility='hidden';u.el.querySelector('.brow').style.opacity='0';u.el.querySelector('.its').style.opacity='0';
    const scale=Math.max(.035,Math.pow(1-pull,1.6));front.save();front.globalAlpha=1-pull*.25;front.imageSmoothingEnabled=false;front.drawImage(image,x-w*scale/2,y-h*scale/2,w*scale,h*scale);front.restore();
    ui.querySelector('span').textContent=pull>0?'Pokémon sendo recolhido pela Pokébola':'Pokémon derrotado · conversão em energia';
   }
   if(t>=1.6){node.style.visibility='hidden';u.el.querySelector('.brow').style.opacity='0';u.el.querySelector('.its').style.opacity='0';const flash=clamp((t-1.6)/.45);if(flash<1){front.save();front.globalAlpha=(1-flash)*.85;front.strokeStyle='#ffd2c5';front.lineWidth=2;front.beginPath();front.ellipse(hand.x,hand.y,5+flash*19,5+flash*19,0,0,Math.PI*2);front.stroke();if(!reduced){front.fillStyle='#fff0d6';front.fillRect(hand.x-3,hand.y-7,6,14);front.fillRect(hand.x-7,hand.y-3,14,6)}front.restore()}ui.querySelector('span').textContent='Pokémon recolhido · repetir restaura a demonstração'}
   if(t<2.5)raf=requestAnimationFrame(frame);else drawTrainers();
  }raf=requestAnimationFrame(frame);
 }
 ui.querySelector('[data-prepare]').onclick=async()=>{await ready;prepare()};
 ui.querySelectorAll('[data-recall]').forEach(button=>button.onclick=async()=>{const request=++token;await ready;prepare();SND.init();const u=pokemon[+button.dataset.recall];await PMD.get(u.id,false);if(CFG.pmd&&!u.el._pmd)await new Promise(resolve=>setTimeout(resolve,120));if(request===token)recall(+button.dataset.recall)});
 ready.then(()=>{prepare();dispatchEvent(new Event('trainer-profile-ready'))});
 let idleLast=0;function idle(now){idleRaf=requestAnimationFrame(idle);if(now-idleLast<50||document.hidden||now<recallUntil||!document.querySelector('.tp-overlay')?.hidden)return;idleLast=now;drawTrainers()}idleRaf=requestAnimationFrame(idle);
 addEventListener('pagehide',()=>cancelAnimationFrame(idleRaf));
 addEventListener('pagehide',()=>{token++;reset()});
})();
