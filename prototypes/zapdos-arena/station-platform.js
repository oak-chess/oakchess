/* Textured stone surfaces follow the same projected coordinates as the hex grid. */
(()=>{
 const originalArena=arena,originalBench=bench,beforeAtmosphere=atmosphere,rock=new Image(),metal=new Image();let ready=false,metalReady=false;
 rock.onload=()=>{ready=true;sceneKey=''};rock.src='assets/power-station-v1.png';
 metal.onload=()=>{metalReady=true;sceneKey=''};metal.src='assets/zapdos-floor-v1.png';
 function triangle(src,dst,crop,image=rock){
  const [s0,s1,s2]=src,[p0,p1,p2]=dst,ux=s1.x-s0.x,uy=s1.y-s0.y,vx=s2.x-s0.x,vy=s2.y-s0.y,det=ux*vy-vx*uy;
  if(Math.abs(det)<1e-8)return;
  const a=((p1.x-p0.x)*vy-(p2.x-p0.x)*uy)/det,b=((p1.y-p0.y)*vy-(p2.y-p0.y)*uy)/det,
   cc=((p2.x-p0.x)*ux-(p1.x-p0.x)*vx)/det,d=((p2.y-p0.y)*ux-(p1.y-p0.y)*vx)/det;
  c.save();c.beginPath();c.moveTo(p0.x,p0.y);c.lineTo(p1.x,p1.y);c.lineTo(p2.x,p2.y);c.closePath();c.clip();
  c.transform(a,b,cc,d,p0.x-a*s0.x-cc*s0.y,p0.y-b*s0.x-d*s0.y);
  c.drawImage(image,crop[0]*image.naturalWidth,crop[1]*image.naturalHeight,crop[2]*image.naturalWidth,crop[3]*image.naturalHeight,0,0,1,1);c.restore();
 }
 function surface(x,y,z,w,h,r,crop,steps=4,image=rock){
  c.save();clipFace(roundedPoints(x,y,z,w,h,r));
  for(let row=0;row<steps;row++)for(let col=0;col<steps;col++){
   const u=col/steps,v=row/steps,u1=(col+1)/steps,v1=(row+1)/steps;
   const uv=[{x:u,y:v},{x:u1,y:v},{x:u1,y:v1},{x:u,y:v1}],pts=uv.map(p=>point(x+p.x*w,y+p.y*h,z));
   triangle([uv[0],uv[1],uv[2]],[pts[0],pts[1],pts[2]],crop,image);triangle([uv[0],uv[2],uv[3]],[pts[0],pts[2],pts[3]],crop,image);
  }c.restore();
 }
 function emblem(){
  const ring=(r)=>Array.from({length:49},(_,i)=>{const a=i*Math.PI*2/48;return[Math.cos(a)*r,Math.sin(a)*r,13]});
  face(ring(79),'#081b2838','#c7a65375');face(ring(72),'#0c1c271a','#d9c17b32');
  const wing=[[-9,-5],[-67,-49],[-49,-8],[-76,-26],[-51,17],[-64,17],[-23,40],[-6,13]];
  for(const side of [1,-1])face(wing.map(([x,y])=>[x*side,y,14]),'#d9b64d78','#f6d68c80');
  face([[7,-43,15],[-15,-2,15],[-1,-2,15],[-7,43,15],[20,-12,15],[6,-10,15]],'#f2ce67b3','#ffe5a9aa');
 }
 window.ARENA_EMBLEM_TRANSITION?.setPainter(emblem);
 arena=function(){if(!ready){originalArena();return}
  // A golden-edged electrical platform, grounded in the old power-station courtyard.
  roundedBox(-365,-335,-12,730,670,77,15,['#414c54','#252f39','#303c46']);
  surface(-365,-335,-11,730,670,77,[.25,.24,.5,.52]);
  roundedBox(-295,-282,4,590,564,41,19,['#b49851','#29343e','#665239']);
  roundedBox(-288,-275,7,576,550,37,15,['#202c3a','#1b2531','#33404c']);
  roundedBox(-282,-269,9,564,538,34,12,['#44515f','#24303a','#35424a']);
  surface(-282,-269,10,564,538,34,metalReady?[0,0,1,1]:[.32,.27,.36,.44],4,metalReady?metal:rock);
  c.save();clipFace(roundedPoints(-282,-269,11,564,538,34));
  const radius=42,hw=Math.sqrt(3)*radius,gw=7.5*hw;
  for(let row=0;row<8;row++)for(let col=0;col<7;col++){
   const x=-gw/2+hw/2+(col+(row%2?.5:0))*hw,y=-3.5*1.5*radius+row*1.5*radius,pts=Array.from({length:6},(_,i)=>{const a=(60*i-30)*Math.PI/180;return[x+Math.cos(a)*41,y+Math.sin(a)*41,11]});
   c.globalAlpha=1-gridSoftness*.9;
   face(pts,(row+col)%2?'#d9b9621c':'#06162525');
   c.strokeStyle='#08131fd9';c.lineWidth=4;c.stroke();
   c.strokeStyle=row>=4?'#f4d789e6':'#d3eaf5de';c.lineWidth=1.8;c.stroke();
  }c.globalAlpha=1;
  if(!window.ARENA_EMBLEM_TRANSITION)emblem();c.restore();
  for(const side of [-1,1]){
   line([side*287,-222,13],[side*287,221,13],'#a57e3b',2);
   for(const y of [-199,-58,94,219]){roundedBox(side*287-6,y-10,16,12,20,3,5,['#c0a557','#54442e','#746139']);line([side*287-2,y-5,17],[side*287-2,y+5,17],'#c9e7edaa',1)}
  }
  for(const x of [-260,260])for(const y of [-251,251])roundedBox(x-11,y-9,15,22,18,4,5,['#d1b46a','#63512f','#8b7244']);
 };
 bench=function(){if(!ready){originalBench();return}
  // Nine metal docking pads with brass edges and inset numbers.
  for(let i=0;i<9;i++){
   const x=-298+i*66,z=11;
   roundedBox(x,317,z,61,46,7,10,['#a28a4d','#26313e','#67583c']);
   roundedBox(x+3,320,z+1,55,39,5,3,['#354451','#26313d','#495361']);
   surface(x+3,320,z+1.5,55,39,5,metalReady?[.18+(i%3)*.05,.2+Math.floor(i/3)*.05,.32,.32]:[.32+(i%3)*.06,.33+Math.floor(i/3)*.06,.075,.075],1,metalReady?metal:rock);
   // A restrained warm edge and distinct small chips instead of repeated orange Y marks.
   line([x+8,359,z+2],[x+52,359,z+2],'#dec36f',2);
   for(const dx of [8,52]){const p=point(x+dx,325,z+2);c.save();c.fillStyle='#cbb77f';c.beginPath();c.arc(p.x,p.y,1.4*p.s,0,Math.PI*2);c.fill();c.restore()}
   const p=point(x+30,342,z+2);c.save();c.translate(p.x,p.y);c.scale(1,.65);c.font='700 '+12*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle='#1e1b23';c.fillText(i+1,0,5*p.s);c.fillStyle='#ead0aa';c.fillText(i+1,0,4*p.s);c.restore();
  }
  const p=point(0,383,-3);c.save();c.font='600 '+9*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle='#e6bf91';c.fillText('BANCO DO TIME · 9 VAGAS',p.x,p.y);c.restore();
 };
 atmosphere=function(){beforeAtmosphere();if(!config.decor||!config.elements)return;const t=reducedMotion?0:time;
  for(const side of [-1,1])for(const [i,y]of [-199,-58,94,219].entries()){
   const p=point(side*287,y,19),alpha=reducedMotion?.2:.12+.13*(.5+.5*Math.sin(t*1.35+i*.9+side)),r=12*p.s,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'rgba(161,216,239,'+alpha+')');g.addColorStop(1,'#9dd8ef00');c.save();c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore();
  }
 };
})();
