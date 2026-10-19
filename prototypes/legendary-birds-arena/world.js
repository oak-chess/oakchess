const theme=window.BIRD_THEME;
function rockyPeak(x,y,z,r,h){const pts=Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7;return[x+Math.cos(a)*r,y+Math.sin(a)*r*.65,z]});for(let i=0;i<7;i++)face([pts[i],pts[(i+1)%7],[x-r*.12,y,z+h]],theme.rocks[i%theme.rocks.length]);}
function background(){
const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,theme.sky[0]);bg.addColorStop(.5,theme.sky[1]);bg.addColorStop(1,theme.sky[2]);c.fillStyle=bg;c.fillRect(0,0,W,H);
if(theme.kind==='articuno'){
// Gruta glacial, lago congelado e grandes formações de gelo.
for(let i=0;i<12;i++){const x=-1100+i*200;rockyPeak(x,-500,-40,130,160+random(i+2)*150);if(config.decor)crystal(x,-450,-25,25+random(i+5)*30)}
if(config.decor)for(const side of [-1,1])for(let i=0;i<5;i++){const x=side*(490+random(i+side+28)*200),y=-250+i*190;face([[x-90,y-45,-39],[x+70,y-60,-39],[x+110,y+40,-39],[x-60,y+65,-39]],'#39758a','#92cde077');crystal(x,y,-32,25+i*3);line([x-70,y-15,-37],[x+30,y+20,-37],'#bbf1f0aa',2)}
}else if(theme.kind==='zapdos'){
// Usina isolada na tempestade: torres, cabos e transformadores.
if(config.decor)for(const side of [-1,1])for(let i=0;i<4;i++){const x=side*(530+i%2*150),y=-370+i*230;for(const dx of [-26,26]){line([x+dx,y,-35],[x+dx*.45,y,140],'#72818d',5);line([x+dx,y,-35],[x-dx*.4,y,94],'#51616c',2)}for(let j=0;j<5;j++)line([x-24+j*2,y,j*30],[x+24-j*2,y,j*30],'#8c9590',3);line([x-58,y,135],[x+58,y,135],'#a4a997',6);for(const dx of [-40,40]){line([x+dx,y,135],[x+dx,y,151],'#d9bb68',4);line([x+dx,y,151],[x+dx,y+220,113],'#253444',1.5)}roundedBox(x-35,y-30,-20,70,60,7,20,['#6a7778','#384c58','#283d4e'])}
for(let i=0;i<9;i++){const x=-1000+i*250;rockyPeak(x,-560,-50,160,90+random(i)*90)}
}else{
// Cratera vulcânica com rios de lava e paredões de basalto.
for(let i=0;i<15;i++)rockyPeak(-1300+i*185,-520,-45,140,110+random(i+8)*180);
if(config.decor)for(const side of [-1,1])for(let i=0;i<5;i++){
const x=side*(490+random(i+side+10)*190),y=-330+i*200;
face([[x-60,y-60,-41],[x+30,y-45,-41],[x+90,y+45,-41],[x-10,y+75,-41]],'#c44d27','#ef9e4877');face([[x-18,y-48,-40],[x+9,y-39,-40],[x+50,y+45,-40],[x+3,y+50,-40]],'#ffbf53');rockyPeak(x-side*65,y,-38,42,45);flame(x,y,-30,16+i*2);
}
}
}
function arena(){
roundedBox(-375,-345,-9,750,690,95,33,[theme.edge,theme.side,theme.dark]);
c.save();clipFace(roundedPoints(-375,-345,-8,750,690,95));for(let i=0;i<90;i++){const x=-365+random(i+13)*730,y=-335+random(i+87)*670;line([x-15,y,-7],[x+20,y+12,-7],theme.kind==='moltres'?'#ef8b414d':theme.kind==='articuno'?'#d3faff77':'#b5a05166',1.5)}c.restore();
roundedBox(-290,-277,5,580,554,44,23,[theme.trim,theme.side,theme.dark]);roundedBox(-282,-269,8,564,538,40,20,[theme.floor[0],theme.side,theme.dark]);
c.save();clipFace(roundedPoints(-282,-269,10,564,538,40));const radius=42,hw=Math.sqrt(3)*radius,gw=7.5*hw;
for(let row=0;row<8;row++)for(let col=0;col<7;col++){const x=-gw/2+hw/2+(col+(row%2?.5:0))*hw,y=-3.5*1.5*radius+row*1.5*radius,pts=Array.from({length:6},(_,i)=>{const a=(60*i-30)*Math.PI/180;return[x+Math.cos(a)*41,y+Math.sin(a)*41,10]});c.save();c.globalAlpha=1-gridSoftness*.88;face(pts,theme.floor[(row+col)%2]);c.restore();face(pts,'#0000','rgba(210,220,213,'+(.38-gridSoftness*.34)+')');}
if(theme.kind==='zapdos')for(const side of [-1,1]){line([side*255,-230,11],[side*255,230,11],'#dfc76c66',2);for(let i=0;i<8;i++)line([side*245,-220+i*62,11],[side*265,-200+i*62,11],'#e0c45e77',3)}
if(theme.kind==='moltres')for(let i=0;i<16;i++){const x=-250+random(i)*500,y=-240+random(i+11)*480;line([x-12,y-9,11],[x,y,11],'#ec7c3b55',1);line([x,y,11],[x+21,y+7,11],'#e86d3355',1)}
const circle=(r,start=0,end=Math.PI*2)=>Array.from({length:49},(_,i)=>{const a=start+(end-start)*i/48;return[Math.cos(a)*r,Math.sin(a)*r,12]});face(circle(59),'#ede8de','#303e4e');face([[0,0,12],...circle(58,Math.PI,Math.PI*2)],'#bc665b');face([[-58,-3,13],[58,-3,13],[58,3,13],[-58,3,13]],'#303e4e');face(circle(59),'#0000','#303e4e');face(circle(16),'#303e4e');face(circle(11),'#eee7de');c.restore();
}
function decor(){if(!config.decor)return;
for(const side of [-1,1])for(let i=0;i<4;i++){const x=side*341,y=-245+i*160;
if(theme.kind==='articuno'){roundedBox(x-17,y-20,17,34,40,6,23,['#9ed7e3','#4d94ab','#326d8b']);crystal(x,y,19,14+i%2*5)}
else if(theme.kind==='zapdos'){roundedBox(x-18,y-20,16,36,40,4,23,['#8d9697','#4e646b','#344e5c']);for(let j=0;j<3;j++)roundedBox(x-15,y-14+j*10,23,30,6,2,9,['#e0c570','#87744d','#5a5b4b']);line([x,y,23],[x,y,49],'#cad1c6',3);bolt(x,y,58,12)}
else{rockyPeak(x,y,0,24,24);flame(x,y,23,15);for(let j=0;j<3;j++)line([x-10+j*9,y+22,1],[x-4+j*9,y+39,1],'#f8a84c88',2)}
}
roundedBox(-95,-338,13,190,49,15,30,[theme.trim,theme.side,theme.dark]);
if(theme.kind==='articuno'){for(let i=0;i<5;i++)crystal((i-2)*30,-315,15,16+i%2*7)}
else if(theme.kind==='zapdos'){for(const x of [-50,50]){line([x,-315,14],[x,-315,90],'#bbc2b4',5);bolt(x,-315,101,19)}line([-50,-315,73],[50,-315,73],'#e9cc77',2)}
else{for(const x of [-55,0,55])flame(x,-315,17,x===0?30:20)}
}
function bench(){
roundedBox(-315,308,-5,630,94,18,23,[theme.dark,theme.dark,'#182635']);
for(let i=0;i<9;i++){const x=-298+i*66;
if(theme.kind==='articuno'){roundedBox(x,317,11,61,46,8,13,['#bdebf2','#62a6bf','#3b7697']);face([[x+5,322,12],[x+53,322,12],[x+45,345,12],[x+12,353,12]],'#e2faff77');line([x+15,321,13],[x+30,338,13],'#fffafa99',1);line([x+30,338,13],[x+49,347,13],'#fffafa99',1)}
else if(theme.kind==='zapdos'){roundedBox(x,317,11,61,46,4,13,['#87989c','#4a656e','#304c5a']);for(let j=0;j<5;j++)line([x+8+j*10,321,13],[x+13+j*10,329,13],j%2?'#e8c65b':'#2b3e43',4);line([x+6,353,13],[x+55,353,13],'#f1d86c',2)}
else{roundedBox(x,317,11,61,46,6,13,['#625b62','#383845','#242b3b']);line([x+6,325,13],[x+25,338,13],'#f38d4388',2);line([x+25,338,13],[x+51,333,13],'#ffbd5d88',1);line([x+25,338,13],[x+31,355,13],'#e96e3288',1)}
const p=point(x+30,344,14);c.save();c.translate(p.x,p.y);c.scale(1,.65);c.font='700 '+12*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle=theme.kind==='articuno'?'#285877':theme.accent;c.fillText(i+1,0,4*p.s);c.restore();}
const p=point(0,409,-12);c.font='600 '+9*p.s+'px Segoe UI';c.textAlign='center';c.fillStyle=theme.accent;c.fillText('BANCO DO TIME · 9 VAGAS',p.x,p.y);
}
function cachedScene(){const key=[W,H,dpr,zoom,pan,config.decor,config.quality,Math.round(gridSoftness*10)].join('|');if(key!==sceneKey){const main=c;c=scenery.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);background();arena();decor();bench();c=main;sceneKey=key}c.drawImage(scenery,0,0,W,H)}
function atmosphere(){const t=reducedMotion?0:time,power=config.energy/100;
if(config.clouds)for(let i=0;i<5;i++){const x=((random(i+3)*W+t*(theme.kind==='moltres'?6:15))%(W+300))-150,y=H*(.15+random(i+29)*.8),r=W*.13,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,theme.kind==='moltres'?'#211c2960':theme.kind==='zapdos'?'#172a4160':'#c5e5ed25');g.addColorStop(1,'#b0c9dd00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
if(!config.elements)return;
const n=Math.round((config.quality==='high'?110:40)*power);
for(let i=0;i<n;i++){const age=(t*(theme.kind==='articuno'?.045:.08)+i*.137)%1,x=-900+random(i+17)*1800+Math.sin(t*.5+i)*25,y=-400+random(i+44)*900,z=theme.kind==='moltres'?-30+age*170:150-age*190,p=point(x,y,z);c.globalAlpha=.25+Math.sin(age*Math.PI)*.45;c.strokeStyle=theme.accent;c.fillStyle=theme.accent;
if(theme.kind==='articuno'){c.lineWidth=p.s;c.beginPath();c.moveTo(p.x-2*p.s,p.y);c.lineTo(p.x+2*p.s,p.y);c.moveTo(p.x,p.y-2*p.s);c.lineTo(p.x,p.y+2*p.s);c.stroke()}
else if(theme.kind==='zapdos'){c.lineWidth=p.s;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-3*p.s,p.y+10*p.s);c.stroke()}
else{c.beginPath();c.ellipse(p.x,p.y,1.4*p.s,2.5*p.s,.3,0,Math.PI*2);c.fill()}c.globalAlpha=1;}
if(config.decor&&theme.kind==='moltres')for(const x of [-55,0,55])flame(x,-315,17,x===0?30:20,t*4);
if(theme.kind==='zapdos'&&!reducedMotion&&Math.sin(t*.55)>.97){for(const side of [-1,1]){const x=side*50,bend=Math.sin(t*21)*15;line([x,-315,121],[x+bend,-315,85],'#fff2b7',2);line([x+bend,-315,85],[x-bend*.5,-315,49],'#ead17e',1.4)}}
}
