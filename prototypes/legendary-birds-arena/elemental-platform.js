/* Articuno/Moltres floors retain the shared board coordinates and bench slots. */
(()=>{
 if(!['articuno','moltres'].includes(theme.kind))return;
 const ice=theme.kind==='articuno',originalArena=arena,originalBench=bench,before=atmosphere,image=new Image();let ready=false;
 const P=ice?{top:'#b3dae5',edge:'#d2eff2',side:'#497d98',dark:'#224e6d',ink:'#d2f7ff',rail:'#91d6e9',seat:'#80b8ce',number:'#e8fbff'}:{top:'#4b3538',edge:'#b47743',side:'#33252e',dark:'#1e202b',ink:'#f1b46d',rail:'#bf652c',seat:'#634136',number:'#ffe0a0'};
 document.body.classList.add('platform-loading');
 image.onload=()=>{ready=true;sceneKey='';requestAnimationFrame(()=>document.body.classList.remove('platform-loading'))};
 image.onerror=()=>{sceneKey='';document.body.classList.remove('platform-loading')};image.src='assets/'+theme.kind+'-floor-v1.png';
 function triangle(src,dst,crop){
  const [s0,s1,s2]=src,[p0,p1,p2]=dst,ux=s1.x-s0.x,uy=s1.y-s0.y,vx=s2.x-s0.x,vy=s2.y-s0.y,det=ux*vy-vx*uy;
  if(Math.abs(det)<1e-8)return;
  const a=((p1.x-p0.x)*vy-(p2.x-p0.x)*uy)/det,b=((p1.y-p0.y)*vy-(p2.y-p0.y)*uy)/det,cc=((p2.x-p0.x)*ux-(p1.x-p0.x)*vx)/det,d=((p2.y-p0.y)*ux-(p1.y-p0.y)*vx)/det;
  c.save();c.beginPath();c.moveTo(p0.x,p0.y);c.lineTo(p1.x,p1.y);c.lineTo(p2.x,p2.y);c.closePath();c.clip();c.transform(a,b,cc,d,p0.x-a*s0.x-cc*s0.y,p0.y-b*s0.x-d*s0.y);
  c.drawImage(image,crop[0]*image.naturalWidth,crop[1]*image.naturalHeight,crop[2]*image.naturalWidth,crop[3]*image.naturalHeight,0,0,1,1);c.restore();
 }
 function surface(x,y,z,w,h,r,crop=[0,0,1,1],steps=4){c.save();clipFace(roundedPoints(x,y,z,w,h,r));
  for(let row=0;row<steps;row++)for(let col=0;col<steps;col++){
   const u=col/steps,v=row/steps,u1=(col+1)/steps,v1=(row+1)/steps,uv=[{x:u,y:v},{x:u1,y:v},{x:u1,y:v1},{x:u,y:v1}],pts=uv.map(p=>point(x+p.x*w,y+p.y*h,z));
   triangle([uv[0],uv[1],uv[2]],[pts[0],pts[1],pts[2]],crop);triangle([uv[0],uv[2],uv[3]],[pts[0],pts[2],pts[3]],crop);
  }c.restore();
 }
 function circle(r,z=14){return Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return[Math.cos(a)*r,Math.sin(a)*r,z]})}
 function emblem(){
  face(circle(79),ice?'#163d622e':'#20141f55',ice?'#d6f6ff70':'#e5a15d75');face(circle(72),'#0000',ice?'#9cdcef40':'#c3783b40');
  if(ice){
   // Sweeping feather fans and a central snow crystal evoke Articuno.
   for(const side of [-1,1])for(let feather=0;feather<3;feather++){
    const pts=[],base=feather*9;
    for(let i=0;i<=16;i++){const k=i/16;pts.push([side*(11+58*k),-3-base-28*Math.sin(k*Math.PI*.7)+feather*7*k,15])}
    for(let i=16;i>=0;i--){const k=i/16;pts.push([side*(11+58*k),5-base-13*Math.sin(k*Math.PI)+feather*7*k,15])}
    face(pts,'#a9e5f25c','#e7fbff50');
   }
   for(let arm=0;arm<6;arm++){
    const a=arm*Math.PI/3,cos=Math.cos(a),sin=Math.sin(a);line([0,0,16],[cos*39,sin*39,16],'#e9fbffad',2);
    for(const sign of [-1,1]){const angle=a+sign*Math.PI/3;line([cos*26,sin*26,16],[cos*26-Math.cos(angle)*10,sin*26-Math.sin(angle)*10,16],'#d7f5ffad',1.6)}
   }
   face(circle(8,17),'#d9f8ffc0','#efffff');
  }else{
   // Rising flame-feathers and a central ember mark the Moltres sanctuary.
   const wing=[[-10,6],[-71,-32],[-52,-4],[-69,2],[-47,12],[-59,24],[-22,39],[-4,20]];
   for(const side of [-1,1])face(wing.map(([x,y])=>[x*side,y,15]),'#d482365e','#e9af5d7a');
   const flame=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2,x=Math.sin(a)*(15+Math.cos(a)*8),y=7-Math.cos(a)*41;flame.push([x+Math.sin(a*2)*7,y,16])}
   face(flame,'#e9a24f99','#ffce818a');face([[0,-17,17],[-10,14,17],[0,30,17],[11,10,17]],'#ffd68b99');
  }
 }
 window.ARENA_EMBLEM_TRANSITION?.setPainter(emblem);
 arena=function(){if(!ready){originalArena();return}
  roundedBox(-365,-335,-12,730,670,77,18,[P.top,P.side,P.dark]);surface(-365,-335,-11,730,670,77,[.09,.08,.82,.84]);
  roundedBox(-295,-282,4,590,564,42,20,[P.edge,P.side,P.dark]);
  roundedBox(-287,-274,7,574,548,36,13,[ice?'#4b8faf':'#38252a',P.dark,P.side]);
  surface(-282,-269,10,564,538,33);
  c.save();clipFace(roundedPoints(-282,-269,11,564,538,33));
  const hw=Math.sqrt(3)*42,gw=7.5*hw;
  for(let row=0;row<8;row++)for(let col=0;col<7;col++){
   const x=-gw/2+hw/2+(col+(row%2?.5:0))*hw,y=-3.5*63+row*63,pts=Array.from({length:6},(_,i)=>{const a=(60*i-30)*Math.PI/180;return[x+Math.cos(a)*41,y+Math.sin(a)*41,11]});
   c.globalAlpha=1-gridSoftness*.9;
   face(pts,(row+col)%2?(ice?'#c1f4ff24':'#f5a45c1c'):'#0b1a272b');
   c.strokeStyle=ice?'#154360cc':'#160f1dd9';c.lineWidth=4;c.stroke();
   c.strokeStyle=ice?'#d4f8fff0':'#ffd18ce6';c.lineWidth=1.8;c.stroke();
  }c.globalAlpha=1;if(!window.ARENA_EMBLEM_TRANSITION)emblem();c.restore();
  // Low elemental studs sit outside the usable hexagons.
  for(const side of [-1,1]){
   line([side*287,-219,13],[side*287,222,13],P.rail,1.4);
   for(const y of [-214,-69,93,221]){
    if(ice){face([[side*287-7,y,16],[side*287,y-10,20],[side*287+7,y,16],[side*287,y+10,16]],'#ace6f0','#e6fcffb0')}
    else{roundedBox(side*287-6,y-9,15,12,18,4,4,['#8c5737','#35222c','#57352e']);line([side*287-2,y-4,19],[side*287-2,y+5,19],'#f1aa58',1)}
   }
  }
 };
 bench=function(){if(!ready){originalBench();return}
  for(let i=0;i<9;i++){
   const x=-298+i*66,z=11;
   roundedBox(x,317,z,61,46,ice?9:7,11,[P.seat,P.side,P.dark]);
   surface(x+2,319,z+1,57,41,ice?7:5,[.17+(i%3)*.07,.2+Math.floor(i/3)*.07,.32,.32],1);
   line([x+9,359,z+2],[x+51,359,z+2],ice?'#c5f5ffc0':'#e79d53b0',1.7);
   const p=point(x+30,342,z+3);c.save();c.translate(p.x,p.y);c.scale(1,.65);c.font='700 '+12*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle=P.dark;c.fillText(i+1,0,5*p.s);c.fillStyle=P.number;c.fillText(i+1,0,4*p.s);c.restore();
  }
  const p=point(0,384,-3);c.save();c.font='600 '+9*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle=P.number;c.fillText('BANCO DO TIME · 9 VAGAS',p.x,p.y);c.restore();
 };
 atmosphere=function(){before();if(!config.decor||!config.elements)return;const t=reducedMotion?0:time;
  for(const side of [-1,1])for(let i=0;i<4;i++){
   const p=point(side*287,[-214,-69,93,221][i],20),pulse=reducedMotion?.18:.1+.15*(.5+.5*Math.sin(t*(ice?.6:1.1)+i*1.4+side)),r=(ice?12:15)*p.s,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,ice?'rgba(175,235,250,'+pulse+')':'rgba(255,151,60,'+pulse+')');g.addColorStop(1,ice?'#b0eaff00':'#fca05000');c.save();c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore();
  }
 };
})();
