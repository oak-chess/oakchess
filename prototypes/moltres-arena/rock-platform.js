/* Textured stone surfaces follow the same projected coordinates as the hex grid. */
(()=>{
 const originalArena=arena,originalBench=bench,rock=new Image();let ready=false;
 rock.onload=()=>{ready=true;sceneKey=''};rock.src='assets/caldera-v1.png';
 function triangle(src,dst,crop){
  const [s0,s1,s2]=src,[p0,p1,p2]=dst,ux=s1.x-s0.x,uy=s1.y-s0.y,vx=s2.x-s0.x,vy=s2.y-s0.y,det=ux*vy-vx*uy;
  if(Math.abs(det)<1e-8)return;
  const a=((p1.x-p0.x)*vy-(p2.x-p0.x)*uy)/det,b=((p1.y-p0.y)*vy-(p2.y-p0.y)*uy)/det,
   cc=((p2.x-p0.x)*ux-(p1.x-p0.x)*vx)/det,d=((p2.y-p0.y)*ux-(p1.y-p0.y)*vx)/det;
  c.save();c.beginPath();c.moveTo(p0.x,p0.y);c.lineTo(p1.x,p1.y);c.lineTo(p2.x,p2.y);c.closePath();c.clip();
  c.transform(a,b,cc,d,p0.x-a*s0.x-cc*s0.y,p0.y-b*s0.x-d*s0.y);
  c.drawImage(rock,crop[0]*rock.naturalWidth,crop[1]*rock.naturalHeight,crop[2]*rock.naturalWidth,crop[3]*rock.naturalHeight,0,0,1,1);c.restore();
 }
 function surface(x,y,z,w,h,r,crop,steps=4){
  c.save();clipFace(roundedPoints(x,y,z,w,h,r));
  for(let row=0;row<steps;row++)for(let col=0;col<steps;col++){
   const u=col/steps,v=row/steps,u1=(col+1)/steps,v1=(row+1)/steps;
   const uv=[{x:u,y:v},{x:u1,y:v},{x:u1,y:v1},{x:u,y:v1}],pts=uv.map(p=>point(x+p.x*w,y+p.y*h,z));
   triangle([uv[0],uv[1],uv[2]],[pts[0],pts[1],pts[2]],crop);triangle([uv[0],uv[2],uv[3]],[pts[0],pts[2],pts[3]],crop);
  }c.restore();
 }
 arena=function(){if(!ready){originalArena();return}
  // Low basalt foundation, textured perimeter, and a readable stone playing field.
  roundedBox(-365,-335,-12,730,670,77,15,['#44383d','#2a252e','#30272f']);
  surface(-365,-335,-11,730,670,77,[.25,.24,.5,.52]);
  roundedBox(-288,-275,5,576,550,37,17,['#8b6350','#302832','#433039']);
  roundedBox(-282,-269,8,564,538,34,12,['#57464a','#28242c','#332830']);
  surface(-282,-269,10,564,538,34,[.32,.27,.36,.44]);
  c.save();clipFace(roundedPoints(-282,-269,11,564,538,34));
  const radius=42,hw=Math.sqrt(3)*radius,gw=7.5*hw;
  for(let row=0;row<8;row++)for(let col=0;col<7;col++){
   const x=-gw/2+hw/2+(col+(row%2?.5:0))*hw,y=-3.5*1.5*radius+row*1.5*radius,pts=Array.from({length:6},(_,i)=>{const a=(60*i-30)*Math.PI/180;return[x+Math.cos(a)*41,y+Math.sin(a)*41,11]});
   c.globalAlpha=1-gridSoftness*.72;face(pts,(row+col)%2?'#d6b7a909':'#100e1710','#d7b39a69');
  }c.globalAlpha=1;
  const ring=(r,start=0,end=Math.PI*2)=>Array.from({length:49},(_,i)=>{const a=start+(end-start)*i/48;return[Math.cos(a)*r,Math.sin(a)*r,13]});
  // An engraved emblem, subdued enough to share the same stone material.
  face(ring(57),'#95847744','#c0976c99');face([[0,0,13],...ring(56,Math.PI,Math.PI*2)],'#a54b304d');face([[-56,-2,14],[56,-2,14],[56,2,14],[-56,2,14]],'#28232bc9');face(ring(15),'#28232b','#c0976c99');face(ring(9),'#b99d7c99');c.restore();
 };
 bench=function(){if(!ready){originalBench();return}
  // Nine separate rocky seats; no large dark rectangle behind the bench.
  for(let i=0;i<9;i++){
   const x=-298+i*66,z=11;
   roundedBox(x,317,z,61,46,7,10,['#68514a','#312931','#463138']);
   surface(x,317,z+.5,61,46,7,[.32+(i%3)*.06,.33+Math.floor(i/3)*.06,.075,.075],1);
   // A restrained warm edge and distinct small chips instead of repeated orange Y marks.
   line([x+8,359,z+1],[x+52,359,z+1],'#d4935c88',1);
   const p=point(x+30,342,z+2);c.save();c.translate(p.x,p.y);c.scale(1,.65);c.font='700 '+12*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle='#1e1b23';c.fillText(i+1,0,5*p.s);c.fillStyle='#ead0aa';c.fillText(i+1,0,4*p.s);c.restore();
  }
  const p=point(0,383,-3);c.save();c.font='600 '+9*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle='#e6bf91';c.fillText('BANCO DO TIME · 9 VAGAS',p.x,p.y);c.restore();
 };
})();
