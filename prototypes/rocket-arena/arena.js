'use strict';
const canvas=document.getElementById('scene'),c=canvas.getContext('2d'),$=id=>document.getElementById(id);
let W=0,H=0,dpr=1,zoom=1,panX=0,panY=0,drag=null,time=0,last=0;
let benchLayer=false,angled=true;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const state={combat:false,alarm:false,mons:true,effects:!reduced};
const images=new Map();
for(const id of [1,4,7,25,41,52,104,109]){const im=new Image();im.src='../../assets/pokeapi/sprites/pokemon/'+id+'.png';images.set(id,im)}
const trainers=new Map();for(const name of ['red','rocketgrunt']){const im=new Image();im.src='../../assets/trainer-profile/sprites/'+name+'_normal.png';trainers.set(name,im)}
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=W*dpr;canvas.height=H*dpr}addEventListener('resize',resize);resize();
function point(x,y,z=0){if(benchLayer){x*=10/11;y-=90.5;z-=23}const p=RocketGeometry.project(x,y,z,angled),fit=RocketGeometry.fit(W,H),scale=fit.scale*zoom;return{x:W/2+(p.x-640+panX)*scale,y:(p.y+panY)*scale,s:p.s*scale}}
function poly(pts,fill,stroke){c.beginPath();pts.map(p=>point(...p)).forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function line(a,b,color,width=1){const p=point(...a),q=point(...b);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.strokeStyle=color;c.lineWidth=width*p.s;c.stroke()}
function box(x,y,z,w,h,d,col){poly([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],col[0],col[3]);poly([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z-d],[x,y+h,z-d]],col[1]);poly([[x+w,y,z],[x+w,y+h,z],[x+w,y+h,z-d],[x+w,y,z-d]],col[2])}
function glow(x,y,z,r,color){const p=point(x,y,z),g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r*p.s);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(p.x-r*p.s,p.y-r*p.s,r*p.s*2,r*p.s*2)}
function ellipse(x,y,z,rx,ry,color){const p=point(x,y,z);c.beginPath();c.ellipse(p.x,p.y,rx*p.s,ry*p.s,0,0,Math.PI*2);c.fillStyle=color;c.fill()}
function label(text,x,y,z,size,color){const p=point(x,y,z);c.font='700 '+Math.max(7,size*p.s)+'px Arial';c.textAlign='center';c.fillStyle=color;c.fillText(text,p.x,p.y)}
function hex(x,y,z,r){return Array.from({length:6},(_,i)=>{const a=(i*60-30)*Math.PI/180;return[x+Math.cos(a)*r,y+Math.sin(a)*r,z]})}
function floor(){
 c.fillStyle='#0b111c';c.fillRect(0,0,W,H);
 const bg=c.createRadialGradient(W*.5,H*.42,0,W*.5,H*.42,W*.7);bg.addColorStop(0,'#283142');bg.addColorStop(.6,'#101824');bg.addColorStop(1,'#070c14');c.fillStyle=bg;c.fillRect(0,0,W,H);
 // Warm resin service floor, with distinct blue maintenance and red containment lanes.
 for(let y=-650;y<650;y+=100)for(let x=-1050;x<1050;x+=100){poly([[x,y,-30],[x+98,y,-30],[x+98,y+98,-30],[x,y+98,-30]],(x/100+y/100)%2?'#352c30':'#3c3033','#554047');for(const dx of [7,90])for(const dy of [7,90])ellipse(x+dx,y+dy,-29,1.5,1.5,'#80616a')}
 for(const x of [-760,370]){
  poly([[x,-310,-28],[x+390,-310,-28],[x+390,360,-28],[x,360,-28]],'#1a3c4355','#64818366');
  line([x+10,-300,-27],[x+10,350,-27],'#b8a16e',3);line([x+380,-300,-27],[x+380,350,-27],'#b8a16e',3);
  for(let y=-265;y<350;y+=75)poly([[x+174,y,-27],[x+198,y-17,-27],[x+222,y,-27],[x+208,y,-27],[x+198,y-7,-27],[x+188,y,-27]],'#ba9d6766');
 }
 for(const [x,y]of [[-551,-90],[368,-111]]){
  poly([[x,y,-26],[x+181,y,-26],[x+181,y+179,-26],[x,y+179,-26]],'#5b293d','#da677d');
  for(let i=0;i<12;i++){const xx=x+i*15;poly([[xx,y,-25],[xx+9,y,-25],[xx+20,y+13,-25],[xx+11,y+13,-25]],i%2?'#1c1c26':'#d4a751');poly([[xx,y+167,-25],[xx+9,y+167,-25],[xx+20,y+179,-25],[xx+11,y+179,-25]],i%2?'#1c1c26':'#d4a751')}
 }
 for(let i=0;i<11;i++){const x=-270+i*50;poly([[x,454,-27],[x+30,454,-27],[x+30,477,-27],[x,477,-27]],'#a94a5b77')}
 label('ACESSO RESTRITO',0,496,-26,14,'#b28e9c');label('ZONA DE SEGURANÇA',-584,125,-26,11,'#d7ab79');label('CONTENÇÃO / 02',494,115,-26,11,'#d7ab79');
 for(const x of [-365,365]){line([x,-370,-27],[x,390,-27],'#ad344d',4);line([x+8,-370,-27],[x+8,390,-27],'#dd657a55',1)}
 for(let i=0;i<9;i++){const x=-286+i*66;poly([[x,365,-28],[x+30,365,-28],[x+8,380,-28],[x-22,380,-28]],i%2?'#211e27':'#a69462')}
}
function crate(x,y){box(x,y,22,65,58,48,['#39404b','#202934','#242e3b','#697183']);line([x+5,y+57,18],[x+59,y+57,-20],'#8290a1',3);line([x+59,y+57,18],[x+5,y+57,-20],'#8290a1',3);label('R',x+32,y+58,2,20,'#d34861')}
function terminal(x,y){box(x,y,30,72,52,58,['#465365','#202b3c','#2e3a4c','#8190a3']);poly([[x+5,y+10,29],[x+67,y+10,29],[x+67,y+43,29],[x+5,y+43,29]],'#151e2d','#6b839f');for(let i=0;i<4;i++)line([x+11,y+16+i*6,30],[x+28+(i%2)*20,y+16+i*6,30],i===3?'#ee647d':'#6cbdc4',2);box(x+9,y+3,112,54,5,67,['#303e51','#252f40','#455268','#7f8ba1']);poly([[x+14,y+8,105],[x+57,y+8,105],[x+57,y+8,52],[x+14,y+8,52]],'#173944','#6190a1');label('R',x+36,y+9,70,24,'#ec5877');if(state.effects)glow(x+35,y,80,60,'#488aa722')}
function cell(x,y,id){
 const h=123;box(x-5,y-5,0,140,135,23,['#4a3346','#201c2b','#33263a','#bd6785']);
 poly([[x+6,y+6,1],[x+124,y+6,1],[x+124,y+119,1],[x+6,y+119,1]],'#173d4266','#5e8897');
 // Rear bars first; all sides and roof remain transparent.
 for(let i=0;i<=6;i++){const xx=x+i*130/6;line([xx,y,4],[xx,y,h],'#748f9d',3)}
 for(let i=0;i<=5;i++){const yy=y+i*25;line([x,yy,4],[x,yy,h],'#8aabbb',3);line([x+130,yy,4],[x+130,yy,h],'#7196a8',3)}
 drawMon(id,x+65,y+74,5,78,false);
 for(let i=0;i<=6;i++){const xx=x+i*130/6;line([xx,y,h],[xx,y+125,h],'#c0d3dc',2);line([xx,y+125,4],[xx,y+125,h],'#bacfdc',3.5)}
 for(const z of [6,h]){line([x,y,z],[x+130,y,z],'#dfabbf',5);line([x,y+125,z],[x+130,y+125,z],'#d89bb3',5);line([x,y,z],[x,y+125,z],'#9a647e',5);line([x+130,y,z],[x+130,y+125,z],'#9a647e',5)}
 for(const xx of [x,x+130])for(const yy of [y,y+125])line([xx,yy,0],[xx,yy,h+3],'#d291aa',6);
 line([x,y+125,57],[x+130,y+125,57],'#99b8c9',3);
 box(x+81,y+122,77,26,8,26,['#ad3856','#4f1d33','#6c2841','#ff85aa']);label('R',x+94,y+132,59,15,'#ffd0de');
 label('CONTENÇÃO',x+65,y,h+19,10,'#e8a8bc');if(state.effects)glow(x+94,y+130,67,20,'#ef5a8133');
}
function door(){
 box(-130,-411,210,260,34,230,['#454d5d','#18202d','#242e3e','#8a95a5']);poly([[-112,-376,0],[-112,-376,189],[112,-376,189],[112,-376,0]],'#202b3b','#617087');line([0,-375,0],[0,-375,189],'#080f1c',4);label('R',0,-374,93,88,'#d93855');label('SETOR ROCKET',0,-375,169,12,'#c4cfdf');
 for(const x of [-125,125]){line([x,-374,15],[x,-374,195],'#f05a73',4);if(state.effects)glow(x,-374,90,100,'#df385229')}
}
function board(){
 // Deep structural plinth, stepped rim and luminous front fascia.
 ellipse(0,70,-38,370,305,'#03081188');
 box(-333,-308,-10,666,572,57,['#4a253b','#100f1b','#26182c','#8c4b67']);
 box(-322,-297,0,644,550,22,['#742e48','#251427','#47203a','#dc698e']);
 box(-308,-285,4,616,546,14,['#171c2a','#0b0c16','#191523','#75455e']);
 poly([[-331,264,-11],[331,264,-11],[331,264,-57],[-331,264,-57]],'#17273c','#62738b');
 line([-309,265,-23],[309,265,-23],'#ec6c8a',3);
 for(const x of [-290,-190,-90,90,190,290]){poly([[x-24,265,-32],[x+24,265,-32],[x+24,265,-48],[x-24,265,-48]],'#080f1b','#3e526e');for(let j=0;j<4;j++)line([x-18+j*11,266,-35],[x-18+j*11,266,-45],'#61738c',2)}
 for(const x of [-328,315])for(const y of [-290,-100,100,247]){box(x,y,15,13,22,25,['#9ca9bc','#2d3b51','#52677f','#c4ccda']);ellipse(x+6,y+10,16,2,2,'#222f42')}
 for(const x of [-315,315])line([x,-283,6],[x,248,6],'#778dab',3);
 for(const x of [-303,301])line([x,-280,-2],[x,250,-2],'#dc4d69',3);
 if(!state.combat)for(let r=0;r<8;r++)for(let col=0;col<7;col++){const x=RocketGeometry.hex(r,col).x,y=RocketGeometry.hex(r,col).y;const edge=r===0||r===7||col===0||col===6,fill=r<4?((r+col)%2?'#352333':'#2c1d2d'):((r+col)%2?'#1e3038':'#1b2832'),top=hex(x,y,6,42),base=hex(x,y,-2,42);for(let i=0;i<6;i++)if(i<3)poly([top[i],top[(i+1)%6],base[(i+1)%6],base[i]],'#0a111c','#141c2b');poly(top,fill,r<4?'#a34a65':'#467b86');poly(hex(x,y,7,33),null,r<4?'#dd688b1a':'#77bdc11a');if(edge)ellipse(x,y,8,2,2,r<4?'#ed7192':'#68bec3')}
 // Floor emblem: subdued enough to keep units legible.
 rocketEmblem();
 label('SETOR DE BATALHA',-180,-268,9,9,'#d98ba6');label('ROCKET / R-01',177,-268,9,9,'#d98ba6');for(const x of [-310,290])for(const y of [-294,248]){box(x,y,24,20,24,30,['#a64763','#35192c','#56233d','#f185a6']);line([x+4,y+12,26],[x+16,y+12,26],'#ffd4dd',3)}
}
function bench(){
 // Separate storage console, with raised sockets and a visible front face.
 box(-315,348,-11,630,82,48,['#3b4c65','#0c1729','#1b2e47','#8195af']);
 box(-306,348,9,612,72,22,['#596a81','#26394f','#374f6c','#a7b7cc']);
 for(let i=0;i<9;i++){const x=-295+i*66;box(x,354,18,62,55,13,['#263c55','#101f33','#1b304a','#7c94b1']);poly([[x+5,360,19],[x+56,360,19],[x+56,402,19],[x+5,402,19]],'#111e30','#445a77');line([x+8,403,20],[x+53,403,20],i<3?'#ff87a6':'#526681',2);label(String(i+1),x+31,398,21,8,'#93a9c5')}
 poly([[-312,431,-12],[312,431,-12],[312,431,-54],[-312,431,-54]],'#182c44','#607d9b');
 for(let i=0;i<12;i++)line([-279+i*49,432,-24],[-279+i*49,432,-43],'#55718f',3);
 line([-290,432,-16],[290,432,-16],'#d44f74',2);label('R  /  UNIDADE DE RESERVA',0,432,-34,11,'#cf95ae');
 if(state.mons)for(const [i,id] of [4,7,25].entries())drawMon(id,-264+i*66,383,23,62,false);
}
function drawMon(id,x,y,z,size,health=true){const im=images.get(id);if(!im?.complete||!im.naturalWidth)return;const p=point(x,y,z);ellipse(x,y,z-1,size*.25,8,'#060d1799');c.imageSmoothingEnabled=false;c.drawImage(im,p.x-size*p.s/2,p.y-size*p.s,size*p.s,size*p.s);if(health){c.fillStyle='#0c1722';c.fillRect(p.x-24*p.s,p.y-(size+4)*p.s,48*p.s,5*p.s);c.fillStyle=y<0?'#ed566e':'#79d6a8';c.fillRect(p.x-23*p.s,p.y-(size+3)*p.s,46*p.s,3*p.s)}}
function trainer(name,x,y){const im=trainers.get(name);if(!im?.complete||!im.naturalWidth)return;const p=point(x,y,0),frame=state.combat&&state.effects?Math.floor(time*1.2)%2+7:2;ellipse(x,y,0,20,8,'#050b1699');c.imageSmoothingEnabled=false;c.drawImage(im,Math.min(frame,Math.floor(im.naturalWidth/16)-1)*16,0,16,32,p.x-25*p.s,p.y-100*p.s,50*p.s,100*p.s);label(name==='red'?'VOCÊ':'RECRUTA ROCKET',x,y+21,0,10,'#c2cfe1')}
function animation(){
 if(!state.effects)return;
 const red=state.alarm?'#ff264f':'#dc566f';for(const x of [-420,420]){glow(x,-330,65,90,red+'35');const p=point(x,-330,65);c.fillStyle=red;c.fillRect(p.x-6*p.s,p.y-3*p.s,12*p.s,6*p.s)}
 if(state.alarm){c.globalAlpha=.04+.035*Math.sin(time*5);c.fillStyle='#ff204c';c.fillRect(0,0,W,H);c.globalAlpha=1}
 for(let i=0;i<9;i++){const y=((time*13+i*83)%800)-400,x=Math.sin(i*27)*590;const p=point(x,y,30);c.globalAlpha=.15+Math.sin(time+i)*.08;c.fillStyle='#b9cee8';c.fillRect(p.x,p.y,2*p.s,2*p.s)}c.globalAlpha=1;
}
function pipe(points,color='#637288',width=9){for(let i=1;i<points.length;i++){line(points[i-1],points[i],'#131e2d',width+5);line(points[i-1],points[i],color,width);line(points[i-1].map((v,j)=>v+(j===2?2:0)),points[i].map((v,j)=>v+(j===2?2:0)),'#a5b4c044',2)}for(const p of points)ellipse(...p,6,4,'#28394c','#718194')}
function rack(x,y){
 box(x,y,145,78,40,169,['#415067','#172334','#253448','#6c7d97']);
 for(let i=0;i<7;i++){const z=130-i*21;poly([[x+6,y+41,z],[x+72,y+41,z],[x+72,y+41,z-16],[x+6,y+41,z-16]],'#101c2c','#435370');
  for(let j=0;j<5;j++)line([x+12+j*8,y+42,z-5],[x+12+j*8,y+42,z-12],'#53677f',2);
  const on=!state.effects||Math.sin(time*(1+i*.18)+i*7)>-.35;line([x+59,y+43,z-8],[x+65,y+43,z-8],on?(i%3?'#62cad3':'#ed5a7d'):'#354657',3);
 }label('ROCKET / DATA',x+39,y+42,151,8,'#a8bbd2');
}
function fan(x,y,z){
 // Vertical assembly on the rear wall; the rotor lies in the X/Z plane.
 const ring=(r,depth=0)=>Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2;return[x+Math.cos(a)*r,y+depth,z+Math.sin(a)*r]});
 poly([[x-45,y,z-45],[x+45,y,z-45],[x+45,y,z+45],[x-45,y,z+45]],'#33465c','#8295ac');
 poly(ring(35,1),'#0d1928','#60768e');
 for(let i=0;i<4;i++){const a=i*Math.PI/2+(state.effects?time*1.9:0);poly([[x,y+2,z],[x+Math.cos(a)*30,y+2,z+Math.sin(a)*30],[x+Math.cos(a+.8)*27,y+2,z+Math.sin(a+.8)*27],[x+Math.cos(a+1.2)*8,y+2,z+Math.sin(a+1.2)*8]],'#8296ac','#a6b6c533')}
 poly(ring(7,3),'#b2c4d5','#50657d');
 for(const d of [-22,-11,0,11,22])line([x-32,y+4,z+d],[x+32,y+4,z+d],'#344960',2);
 for(const dx of [-38,38])for(const dz of [-38,38])line([x+dx-2,y+5,z+dz],[x+dx+2,y+5,z+dz],'#c2d0db',3);
}
function conveyor(){
 const x=480,y=100;box(x,y,-2,115,275,25,['#26354a','#0c1829','#1c2a3c','#74849d']);
 for(let i=0;i<17;i++){const yy=y+((i*17+(state.effects?time*18:0))%268);line([x+8,yy,0],[x+107,yy,0],'#71839e55',3)}
 for(const side of [x+3,x+112])line([side,y,4],[side,y+275,4],'#758799',4);
 for(let i=0;i<3;i++){const yy=y+((i*95+(state.effects?time*18:0))%220);box(x+24,yy,33,63,40,33,['#586275','#2e3c50','#3b4c61','#8a99ad']);label('R',x+55,yy+34,36,18,'#ef607a')}
 label('LOGÍSTICA',x+55,y+300,-8,11,'#9aaecb');
}
function camera(x,y,mirror=false){
 const dir=mirror?-1:1;line([x,y,-20],[x,y,132],'#74869e',6);box(x-19,y-12,143,38,24,20,['#596b83','#2e3f58','#3b4d65','#a0afc2']);
 const scan=state.effects?Math.sin(time*.7+(mirror?2:0))*.28:0,a=(mirror?Math.PI:0)+scan;
 const lens=[x+dir*20,y,133],end=[x+Math.cos(a)*140,y+90+Math.sin(a)*120,-24];
 if(state.effects){c.save();poly([lens,[end[0]-55,end[1]-25,end[2]],[end[0]+55,end[1]+25,end[2]]],state.alarm?'#f64c6714':'#68b6f410');c.restore()}
 glow(x+dir*20,y,133,12,state.alarm?'#ff537a88':'#88dbf977');label('CCTV',x,y,164,8,'#a6b9d4');
}
function tank(x,y){
 ellipse(x,y,-23,38,27,'#080e1b88');box(x-29,y-20,88,58,40,109,['#56627a','#26374d','#38475d','#8998b2']);
 ellipse(x,y,89,29,20,'#78869c');ellipse(x,y,91,19,12,'#293b51');
 line([x-32,y+21,61],[x+32,y+21,61],'#d8b45b',7);label('!',x,y+22,27,24,'#e5b964');
 pipe([[x+29,y,75],[x+55,y,75],[x+55,y+35,0]],'#4c7891',6);
 if(state.effects)for(let i=0;i<6;i++){const q=(time*.32+i/6)%1;glow(x+Math.sin(q*7+i)*10,y,96+q*65,9+q*16,'rgba(183,207,230,'+((1-q)*.055)+')')}
}
function decorations(){
 // Utilities stay outside the footprint of the 56 hexagons and nine reserve slots.



 rack(-590,-290);rack(-500,-380);rack(475,-390);rack(565,-290);
 fan(-680,-466,105);fan(680,-466,105);tank(-680,210);tank(675,230);
 conveyor();camera(-575,-95);camera(575,-105,true);
 for(const [x,y]of [[-710,-220],[700,-210]]){box(x,y,-17,75,115,14,['#24364c','#111d30','#17283c','#4b6786']);label('R',x+38,y+66,-13,47,'#bb385359');for(let i=0;i<5;i++)line([x+10,y+13+i*22,-12],[x+64,y+13+i*22,-12],'#94a5bc22',1)}
 for(const [x,y]of [[-555,355],[405,345]]){for(let i=0;i<3;i++)box(x+i*27,y,9,21,25,30,['#9d804d','#584a36','#715c3d','#b49c6a']);label('SUPRIMENTOS',x+38,y+43,-10,8,'#a3957e')}
}
function walls(){
 // Open front cutaway: the rear and side walls give the room a shared structure.
 const bottom=-29,top=225;
 poly([[-820,-470,bottom],[820,-470,bottom],[820,-470,top],[-820,-470,top]],'#263246','#63728a');
 poly([[-820,-470,bottom],[-820,470,bottom],[-820,470,top],[-820,-470,top]],'#1c2b3d','#526780');
 poly([[820,-470,bottom],[820,470,bottom],[820,470,top],[820,-470,top]],'#213047','#526780');
 for(let x=-800;x<820;x+=105){line([x,-469,0],[x,-469,220],'#0d192c',5);line([x+6,-468,8],[x+6,-468,215],'#677a962e',1)}
 for(const y of [8,115,220])line([-820,-468,y],[820,-468,y],'#8393ad44',2);
 for(const side of [-818,818]){
  for(let y=-440;y<460;y+=130){line([side,y,-20],[side,y,225],'#0e1a2d',7);box(side<0?side:side-12,y-8,225,12,20,253,['#42566e','#273a50','#324b64','#71839b'])}
  line([side,-455,190],[side,450,190],'#e84d70',3);
  line([side,-450,70],[side,450,70],'#637a9866',2);
 }
 for(const x of [-650,-350,350,650]){poly([[x-30,-467,196],[x+30,-467,196],[x+30,-467,185],[x-30,-467,185]],'#d5e5f4','#92a9c8');if(state.effects)glow(x,-460,178,100,'#8db5dc16')}
 label('ROCKET INDUSTRIES',-505,-465,155,26,'#bcc8da');label('LABORATÓRIO / CONTENÇÃO',490,-465,155,17,'#a7b8d0');
 // Overhead conduits follow the wall and descend into the control stations.
 pipe([[-790,360,165],[-790,-425,165],[-440,-425,165],[-440,-305,105]],'#73889e',13);
 pipe([[790,360,165],[790,-425,165],[440,-425,165],[440,-290,105]],'#8c7181',13);
 for(let y=-400;y<400;y+=100)for(const side of [-790,790]){line([side,y,160],[side<0?-818:818,y,160],'#b6c5d5',5);line([side,y,171],[side,y,157],'#c1c9d4',3)}
}
function desk(x,y){
 // Monitor, keyboard, drawers and metal legs share one workstation.
 box(x,y,48,150,72,9,['#57677c','#303d51','#3d4b61','#9aacc3']);
 for(const dx of [8,131])for(const dy of [8,52])box(x+dx,y+dy,40,10,12,67,['#7a8ba1','#34465d','#4b6078','#93a4b9']);
 box(x+103,y+20,37,36,39,56,['#43556f','#27374d','#334860','#6f849e']);
 for(let i=0;i<3;i++){line([x+106,y+60,28-i*15],[x+134,y+60,28-i*15],'#7d91ab',1);line([x+116,y+61,22-i*15],[x+126,y+61,22-i*15],'#a2afc2',2)}
 box(x+16,y+10,107,65,6,56,['#566981','#14283c','#344b65','#8fa7c3']);
 poly([[x+21,y+17,101],[x+76,y+17,101],[x+76,y+17,58],[x+21,y+17,58]],'#153343','#719bab');
 label('R',x+48,y+18,69,28,'#ed5f80');
 box(x+15,y+39,52,66,21,3,['#8a9aaf','#465a73','#596d86','#afc0d5']);
 for(let i=0;i<4;i++)line([x+20,y+43+i*4,53],[x+75,y+43+i*4,53],'#253d57',2);
 box(x+89,y+10,59,12,19,11,['#d0c9b6','#8f8b80','#aaa697','#e6dfcf']);
 pipe([[x+145,y+15,43],[x+170,y+15,43],[x+170,y-50,43],[x+170,y-50,-20]],'#3e6684',5);
}
function rocketEmblem(){
 const z=10,ring=Array.from({length:81},(_,i)=>{const a=i/80*Math.PI*2;return[77*Math.cos(a),77*Math.sin(a),z]});
 ellipse(0,0,z,77,77,'#0b142077');for(let i=1;i<ring.length;i++)line(ring[i-1],ring[i],'#b94f7155',1.5);
 // R is geometry in the floor plane, centered at (0,0), not upright text.
 const paths=[
  [[-26,43],[-26,-43],[8,-43],[21,-40],[30,-31],[33,-18],[29,-6],[20,3],[9,7],[-26,7]],
  [[7,7],[34,43]]
 ];
 const segments=[];for(const path of paths)for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];segments.push({a,b,length:Math.hypot(b[0]-a[0],b[1]-a[1])})}
 const total=segments.reduce((n,s)=>n+s.length,0),cycle=state.effects?time%7:5,progress=state.effects?Math.min(1,cycle/4):1;
 for(const s of segments)line([...s.a,z],[...s.b,z],'#7f304a66',6);
 let left=total*progress,head=null;
 c.save();c.shadowColor='#ff386d';c.shadowBlur=state.effects?15:0;
 for(const s of segments){if(left<=0)break;const t=Math.min(1,left/s.length),b=[s.a[0]+(s.b[0]-s.a[0])*t,s.a[1]+(s.b[1]-s.a[1])*t];line([...s.a,z],[...b,z],'#fa5d8a',5);line([...s.a,z+.2],[...b,z+.2],'#ffc1d4',1);head=b;left-=s.length}
 c.restore();
 if(state.effects&&head&&progress<1){glow(head[0],head[1],z+2,19,'#ff376c88');ellipse(head[0],head[1],z+2,2,2,'#fff0f6')}
 if(state.effects&&progress===1)glow(0,0,z,105,'#f73e6e12');
}
function rocketBenchTrim(){
 for(const x of [-321,308]){box(x,345,40,13,77,65,['#8d455c','#2d2437','#493449','#db718e']);label('R',x+6,390,42,14,'#ffd1dc')}
 line([-305,351,21],[305,351,21],'#f06387',3);
 for(let i=0;i<9;i++){const x=-264+i*66;ellipse(x,405,22,2.7,2.7,i<3?'#ff90ad':'#744357');if(i<3&&state.effects)glow(x,405,22,14,'#fa587d25')}
}
function frame(now){time+=state.effects&&last?Math.min(.05,(now-last)/1000):0;last=now;c.setTransform(dpr,0,0,dpr,0,0);floor();walls();if(arenaKind==='containment'){decorations();desk(-720,-300);desk(540,-300);door();terminal(-480,-300);terminal(405,-285);cell(-525,-65,104);cell(390,-85,41);crate(-510,235);crate(420,205)}else{sectorScenery()}board();sectorBoardTrim();
 if(state.mons){for(const [id,r,col] of [[109,1,2],[41,2,4],[52,1,5],[1,5,2],[4,6,3],[7,5,4]])drawMon(id,RocketGeometry.hex(r,col).x,RocketGeometry.hex(r,col).y,10,76)}
 trainer('rocketgrunt',342,-233);trainer('red',-345,294);benchLayer=true;bench();rocketBenchTrim();benchLayer=false;animation();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
for(const [id,key] of [['combat','combat'],['alarm','alarm'],['mons','mons'],['effects','effects']]){$(id).setAttribute('aria-pressed',state[key]);$(id).onclick=()=>{state[key]=!state[key];$(id).setAttribute('aria-pressed',state[key]);$('status').innerHTML='<i></i>'+(state.alarm?'Segurança em alerta':sectors[arenaKind].name)+' · '+(state.combat?'Combate':'Preparação')}}
$('sound').onclick=async()=>{const audio=$('music');if(!audio.paused){audio.pause();$('sound').textContent='Ativar música';$('sound').setAttribute('aria-pressed','false');return}audio.volume=.22;try{await audio.play();$('sound').textContent='Silenciar música';$('sound').setAttribute('aria-pressed','true')}catch{$('sound').textContent='Tentar música novamente'}};
function reset(){zoom=1;panX=0;panY=0}$('reset').onclick=reset;canvas.ondblclick=reset;
canvas.onpointerdown=e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,px:panX,py:panY};canvas.setPointerCapture(e.pointerId)};
canvas.onpointermove=e=>{if(!drag)return;const s=RocketGeometry.fit(W,H).scale*zoom;panX=drag.px+(e.clientX-drag.x)/s;panY=drag.py+(e.clientY-drag.y)/s};
canvas.onpointerup=canvas.onpointercancel=()=>drag=null;
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.6,Math.min(1.5,zoom-e.deltaY*.0007))},{passive:false});

$('perspective').onclick=()=>{angled=!angled;$('perspective').setAttribute('aria-pressed',angled);$('perspective').textContent=angled?'Câmera: perspectiva':'Câmera: frontal';reset()};
