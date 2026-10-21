/* Player trainer and defeat recall, using the approved arena prototype. */
(()=>{
 if(location.pathname.includes('/prototypes/'))return;
 const arena=document.getElementById('arenaView');if(!arena)return;
 const layer=z=>{const cv=document.createElement('canvas');cv.width=1280;cv.height=800;cv.setAttribute('aria-hidden','true');cv.style.cssText=`position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;z-index:${z}`;arena.append(cv);return cv.getContext('2d')},ground=layer(1),front=layer(2501);
 const assets={};for(const name of ['red_normal','red_item']){const im=new Image();im.src='assets/trainers/'+name+'.png';assets[name]=im}
 const ball=new Image();ball.src=itemUrl('poke-ball');
 const trainers=[{x:345,y:590,name:'VOCÊ',sprite:'red_normal',mirror:true}],jobs=[];
 const clamp=n=>Math.max(0,Math.min(1,n));
 function visible(){return !DEMO.on&&!document.body.classList.contains('on-title')&&['plan','combat','result'].includes(G.phase)}
 function clear(){jobs.length=0;ground.clearRect(0,0,1280,800);front.clearRect(0,0,1280,800)}
 function drawTrainers(active=-1,gesture=false){
  ground.clearRect(0,0,1280,800);front.clearRect(0,0,1280,800);
  trainers.forEach((p,i)=>{
   ground.globalAlpha=.45;ground.fillStyle='#17201a';ground.beginPath();ground.ellipse(p.x,p.y+2,27,9,0,0,Math.PI*2);ground.fill();ground.globalAlpha=1;
   const img=assets[i===0&&i===active&&gesture?'red_item':p.sprite];if(img&&img.complete&&img.naturalWidth){const frame=i===0&&i===active&&gesture?5:2;front.save();front.translate(p.x,p.y);front.scale(p.mirror?-1:1,1);front.imageSmoothingEnabled=false;front.drawImage(img,frame*16,0,16,32,-30,-120,60,120);front.restore()}
   front.font='10px Arial';front.textAlign='center';front.fillStyle='#f3deb0';front.fillText(p.name,p.x,p.y+20);
  });
 }

 function begin(u){
  if(u.side!==0||!visible()||!assets.red_normal.complete||!assets.red_normal.naturalWidth)return false;
  const side=0,node=u.el?.querySelector('canvas.pmdc')||u.el?.querySelector('.spr img');if(!node)return false;
  try{
  const width=node.width||node.naturalWidth,height=node.height||node.naturalHeight;if(!width||!height){return false}
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

  jobs.push({u,node,image,w,h,center,hand,age:0});u.el.style.display='none';return true;
  }catch(e){return false}
 }
 function drawJob(job){
  const {u,node,image,w,h,center,hand}=job,t=job.age,reduced=CFG.reduceFx||matchMedia('(prefers-reduced-motion:reduce)').matches;
   if(t<=.35){front.imageSmoothingEnabled=false;front.drawImage(image,center.x-w/2,center.y-h/2,w,h)}
   if(t>.25&&t<1.85){
    if(ball.complete&&ball.naturalWidth){front.imageSmoothingEnabled=false;front.drawImage(ball,hand.x-11,hand.y-11,22,22)}
   }
   if(t>.35&&t<1.6){
    const pull=clamp((t-.72)/.85),ease=1-Math.pow(1-pull,3),x=center.x+(hand.x-center.x)*ease,y=center.y+(hand.y-center.y)*ease;
    front.save();front.globalAlpha=Math.min(1,(t-.35)*8)*(1-pull*.6);front.lineCap='round';front.strokeStyle='rgba(246,87,115,.28)';front.lineWidth=10;front.beginPath();front.moveTo(hand.x,hand.y);front.lineTo(x,y);front.stroke();front.strokeStyle='#f76c86';front.lineWidth=3;front.stroke();front.strokeStyle='#ffd4d6';front.lineWidth=1;front.stroke();front.restore();

    const scale=Math.max(.035,Math.pow(1-pull,1.6));front.save();front.globalAlpha=1-pull*.25;front.imageSmoothingEnabled=false;front.drawImage(image,x-w*scale/2,y-h*scale/2,w*scale,h*scale);front.restore();
   }

   if(t>=1.6){const flash=clamp((t-1.6)/.45);if(flash<1){front.save();front.globalAlpha=(1-flash)*.85;front.strokeStyle='#ffd2c5';front.lineWidth=2;front.beginPath();front.ellipse(hand.x,hand.y,5+flash*19,5+flash*19,0,0,Math.PI*2);front.stroke();if(!reduced){front.fillStyle='#fff0d6';front.fillRect(hand.x-3,hand.y-7,6,14);front.fillRect(hand.x-7,hand.y-3,14,6)}front.restore()}}

 }
 function tick(dt){
  if(!visible()){clear();return}
  for(let i=jobs.length-1;i>=0;i--){jobs[i].age+=dt;if(jobs[i].age>=2.5||!jobs[i].u.el?.isConnected)jobs.splice(i,1)}
  drawTrainers(jobs.length?0:-1,jobs.some(j=>j.age>.2&&j.age<1.8));
  for(const job of jobs)drawJob(job);
 }
 window.TRAINER_RECALL={begin,tick,clear};
})();
