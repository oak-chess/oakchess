/* Illustrated environment experiment; board geometry and atmosphere remain shared. */
(()=>{
 const originalBackground=background,originalDecor=decor,originalAtmosphere=atmosphere;
 const art=new Image();let ready=false,illustrated=true;
 const cluster=new Image();let clusterReady=false;
 const frost=new Image();let frostReady=false;
 // Dense clusters with a large anchor, smaller companions, and uneven gaps.
 const clusters=[
  [-451,214,216,-1,-24],[-506,139,104,1,-22],[-361,243,91,-1,16],[-566,254,132,1,-24],
  [464,-245,172,1,-24],[537,-205,106,-1,-22],[371,-214,86,1,16],
  [-263,-372,138,1,-24],[-351,-332,94,-1,15],[-167,-359,76,-1,-12],
  [362,180,96,-1,16],[468,221,139,1,-24],[540,175,85,-1,-24],
  [-370,-80,104,1,16],[-445,-28,126,-1,-24],
  [201,-366,118,-1,-24],[282,-338,78,1,15],[-373,364,116,1,-24]
 ];
 const frostBeds=[
  [-346,-105,99,1,17],[-401,-139,125,-1,-20],[-504,-53,91,1,-22],
  [345,190,93,-1,17],[412,255,107,1,-20],[551,65,168,1,-22],[456,98,98,-1,-22],
  [-577,-290,141,-1,-22],[-388,-310,88,1,17],[-236,-333,82,-1,17],
  [317,-305,85,-1,17],[332,63,75,1,17],[-337,154,71,-1,17],[-490,310,124,1,-22]
 ];
 cluster.onload=()=>{clusterReady=true;sceneKey=''};
 cluster.src='assets/snow-garden-v1.png';
 frost.onload=()=>{frostReady=true;sceneKey=''};frost.src='assets/frost-garden-v1.png';
 const row=document.createElement('div');row.className='row';
 row.innerHTML='<span>Cenário ilustrado</span><button type="button" aria-pressed="true">Ativado</button>';
 const button=row.querySelector('button');document.querySelector('.controls h2').after(row);
 const status=document.createElement('p');status.className='art-status';status.textContent='Carregando a gruta ilustrada…';row.after(status);
 const setStatus=()=>{status.textContent=!ready?'Carregando a gruta ilustrada…':illustrated?'Rochas e neve pintadas · ambiente em camadas.':'Versão geométrica original para comparação.'};
 button.onclick=()=>{illustrated=!illustrated;button.textContent=illustrated?'Ativado':'Desativado';button.setAttribute('aria-pressed',String(illustrated));sceneKey='';setStatus()};
 art.onload=async()=>{try{await art.decode()}catch{}ready=true;sceneKey='';setStatus();requestAnimationFrame(()=>document.body.classList.remove('scene-loading'))};
 art.onerror=()=>{sceneKey='';status.textContent='Não foi possível carregar a ilustração. Exibindo o cenário original.';requestAnimationFrame(()=>document.body.classList.remove('scene-loading'))};
 art.src='assets/glacial-cave-v1.png';
 background=function(){
  if(!ready||!illustrated||!config.decor){originalBackground();return}
  c.fillStyle='#173c55';c.fillRect(0,0,W,H);
  // A quiet camera layer: scenery moves more slowly than the playing field.
  const scale=Math.max(W/art.naturalWidth,H/art.naturalHeight)*Math.max(1,zoom*.3+.7)*1.12;
  const width=art.naturalWidth*scale,height=art.naturalHeight*scale;
  const x=(W-width)/2+Math.max(-W*.045,Math.min(W*.045,pan*Math.min(W/1280,H/800)*.22));
  c.drawImage(art,x,(H-height)/2,width,height);
  const shade=c.createRadialGradient(W*.5,H*.45,H*.12,W*.5,H*.5,W*.7);shade.addColorStop(0,'#102d4200');shade.addColorStop(1,'#06182d66');c.fillStyle=shade;c.fillRect(0,0,W,H);
 };
 decor=function(){if(!ready||!illustrated){originalDecor();return}if(!config.decor)return;
  // Carry the painted ice texture onto the wide rim instead of a flat plastic slab.
  c.save();c.beginPath();
  for(const pts of [roundedPoints(-375,-345,-8,750,690,95),roundedPoints(-290,-277,11,580,554,44)])pts.map(p=>point(...p)).forEach((p,i)=>{if(i)c.lineTo(p.x,p.y);else c.moveTo(p.x,p.y);if(i===pts.length-1)c.closePath()});
  c.clip('evenodd');
  const rimScale=Math.max(W/art.naturalWidth,H/art.naturalHeight)*Math.max(1,zoom*.3+.7)*1.12,rimW=art.naturalWidth*rimScale,rimH=art.naturalHeight*rimScale;
  c.globalAlpha=.62;c.drawImage(art,(W-rimW)/2+Math.max(-W*.045,Math.min(W*.045,pan*Math.min(W/1280,H/800)*.22)),(H-rimH)/2,rimW,rimH);c.restore();
  const elements=[...(clusterReady?clusters.map(e=>({e,img:cluster})):[]),...(frostReady?frostBeds.map(e=>({e,img:frost})):[])].sort((a,b)=>a.e[1]-b.e[1]);
  for(const {e:[x,y,width,flip,z=-24],img} of elements){const p=point(x,y,z),w=width*p.s,h=w*img.naturalHeight/img.naturalWidth;c.save();c.translate(p.x,p.y);c.scale(flip,1);c.drawImage(img,-w/2,-h*.88,w,h);c.restore()}
 };
 atmosphere=function(){
  originalAtmosphere();if(!ready||!illustrated||!config.decor)return;
  const t=reducedMotion?0:time,power=config.energy/100;
  if(config.clouds){
   // Long, translucent ground mist drifts between the painted rocks and board.
   for(const side of [-1,1])for(let i=0;i<3;i++){
    const p=point(side*(420+Math.sin(t*.16+i)*24),-200+i*210+Math.sin(t*.12+i)*28,-15);
    c.save();c.translate(p.x,p.y);c.scale(1,.2);const r=(90+i*16)*p.s,g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(190,235,248,'+(.09+.05*power)+')');g.addColorStop(1,'#bcefff00');c.fillStyle=g;c.fillRect(-r,-r,r*2,r*2);c.restore();
   }
  }
  if(!config.elements)return;
  for(let i=0;i<(config.quality==='low'?12:28);i++){
   const side=i%2?1:-1,phase=(t*.19+i*.143)%1;
   const p=point(side*(410+random(i+93)*140)-phase*20,-330+random(i+72)*680,18+phase*48);
   const alpha=Math.sin(phase*Math.PI)*(.16+power*.3),s=p.s*(1+random(i+3));
   c.save();c.globalAlpha=alpha;c.fillStyle='#e5fbff';c.beginPath();c.ellipse(p.x+Math.sin(t*.7+i)*9,p.y,s,s*.6,0,0,Math.PI*2);c.fill();c.restore();
  }
  // Brief glints on the ice, staggered rather than flashing together.
  for(let i=0;i<8;i++){
   const phase=(t*.23+i*.317)%1,alpha=reducedMotion?.22:Math.pow(Math.max(0,Math.sin(phase*Math.PI)),14)*.65;
   if(alpha<.02)continue;const p=point((i%2?1:-1)*(392+random(i+39)*74),-285+random(i+54)*550,12),r=(2+alpha*4)*p.s;
   c.save();c.globalAlpha=alpha;c.strokeStyle='#d6f7ff';c.lineWidth=p.s;c.beginPath();c.moveTo(p.x-r,p.y);c.lineTo(p.x+r,p.y);c.moveTo(p.x,p.y-r*1.6);c.lineTo(p.x,p.y+r*1.6);c.stroke();c.restore();
  }
 };
})();
