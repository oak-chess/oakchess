'use strict';
// Sector scenery is independent of the accepted containment prototype.
let arenaKind='containment';
const sectors={
 depot:{name:'Entrada e depósito',range:'1–10',color:'#e4ac57',description:'Portão de carga, suprimentos e vigilância na entrada da base.'},
 containment:{name:'Setor de contenção',range:'11–20',color:'#ed698b',description:'Celas vigiadas e terminais para os Pokémon capturados.'},
 lab:{name:'Laboratório Rocket',range:'21–30',color:'#65e3cf',description:'Experimentos, cápsulas de pesquisa e energia em circulação.'},
 command:{name:'Central de comando',range:'31–40',color:'#79aeff',description:'Monitoramento da operação e segurança reforçada.'},
 giovanni:{name:'Quartel de Giovanni',range:'41–50',color:'#ff526c',description:'O coração da organização. O confronto final espera na etapa 50.'}
};
$('sector').onchange=()=>{arenaKind=$('sector').value;const sector=sectors[arenaKind];document.querySelector('header h1').textContent=sector.name;document.querySelector('header p').textContent=sector.description;$('stage-range').textContent='ETAPAS '+sector.range;$('status').innerHTML='<i></i>'+sector.name+' · '+(state.combat?'Combate':'Preparação');reset()};
function screenPanel(x,y,z,w,h,title){
 poly([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],'#0a1725','#6b879d');
 label(title,x+w/2,y+1,z+h-18,13,sectors[arenaKind].color);
 for(let i=0;i<5;i++){const yy=z+12+i*(h-40)/5;line([x+12,y+2,yy],[x+w-12,y+2,yy],'#36546f',1);for(let j=0;j<6;j++){const v=8+(Math.sin(time*.8+i+j)*.5+.5)*18;line([x+18+j*(w-30)/6,y+3,yy],[x+18+j*(w-30)/6,y+3,yy+v],sectors[arenaKind].color,3)}}
}
function capsule(x,y,id){
 box(x-52,y-45,0,104,90,27,['#547d83','#142c36','#25444f','#83c9ca']);
 poly([[x-40,y+32,5],[x+40,y+32,5],[x+40,y+32,143],[x-40,y+32,143]],'#3ebda22b','#7affd6');
 for(const dx of [-43,43])line([x+dx,y+34,3],[x+dx,y+34,148],'#87e5cf',5);
 if(state.mons)drawMon(id,x,y+12,25,70,false);
 for(let i=0;i<7;i++){const z=15+((time*20+i*19)%115);ellipse(x+Math.sin(i*4+time)*27,y+34,z,2,2,'#a1ffe0')}
 box(x-51,y-43,157,102,88,15,['#426b78','#213d4b','#2e505e','#8ccbc9']);
 label('PESQUISA',x,y+46,166,10,'#a0f9dd');
 if(state.effects)glow(x,y,60,95,'#26e8ba22');
}
function sectorScenery(){
 const sector=sectors[arenaKind],accent=sector.color;
 // Replace the utilitarian markings with a sector-specific circulation route.
 for(const x of [-775,390])poly([[x,-350,-24],[x+370,-350,-24],[x+370,430,-24],[x,430,-24]],arenaKind==='giovanni'?'#641c3199':'#111e3099',accent);
 for(const x of [-790,790])line([x,-430,8],[x,420,8],accent,4);
 poly([[-810,-468,118],[810,-468,118],[810,-468,205],[-810,-468,205]],'#111523','#675066');
 label(sector.name.toUpperCase(),0,-465,174,28,accent);
 fan(-725,-466,76);fan(725,-466,76);
 if(arenaKind==='depot'){
  // Loading shutter with horizontal ribs, forklift and stacked freight.
  poly([[-220,-395,0],[220,-395,0],[220,-395,193],[-220,-395,193]],'#4e4140','#dfa75d');
  for(let z=12;z<190;z+=17)line([-215,-393,z],[215,-393,z],'#79665b',4);
  label('DOCA 01 / CARGA',0,-390,80,24,'#f0c282');
  for(const x of [-665,460])for(let y=-260;y<290;y+=140){crate(x,y);crate(x+70,y);if(y<0){box(x,y,81,65,58,55,['#766048','#392e2c','#584735','#d2ad71']);label('R',x+32,y+59,55,24,'#e88b79')}}
  conveyor();terminal(-440,-270);
  box(-700,285,29,140,87,55,['#c49b44','#5a3d25','#8f642e','#e4bc67']);
  for(const x of [-695,-590])for(const y of [293,347])ellipse(x,y,-10,17,18,'#101722');
  for(const x of [-682,-610])line([x,330,30],[x,330,136],'#c8ab75',8);
  line([-682,330,130],[-610,330,130],'#e0bd79',8);
  for(const x of [-681,-612])box(x,343,-14,12,100,10,['#b9b7aa','#3e454e','#69727b','#d7d4be']);
  label('RECEBIMENTO',-570,430,-22,16,accent);
 }else if(arenaKind==='lab'){
  door();for(const x of [-610,590])for(const [i,y]of [-180,85].entries())capsule(x,y,i?109:41);
  desk(-730,-330);desk(530,-330);terminal(-455,-315);terminal(390,-315);
  for(const x of [-760,745])pipe([[x,340,145],[x,-420,145],[x*.6,-420,145]],'#57b6aa',12);
  screenPanel(-190,-372,20,380,125,'ANÁLISE GENÉTICA');
 }else if(arenaKind==='command'){
  screenPanel(-350,-395,30,700,160,'REDE ROCKET / KANTO');
  for(const x of [-700,-570,460,590])rack(x,-250);
  for(const x of [-720,545]){desk(x,10);desk(x,190)}
  terminal(-435,-170);terminal(370,-170);camera(-560,70);camera(560,70,true);
  for(const x of [-670,650]){line([x,300,0],[x,300,115],accent,6);glow(x,300,110,60,'#5a98ff22')}
 }else{
  // Private headquarters: tall pillars, red carpet and command dais.
  poly([[-250,-430,-23],[250,-430,-23],[250,490,-23],[-250,490,-23]],'#67172e','#bd8d54');
  for(const x of [-690,590])for(const y of [-310,-60,190]){
   box(x-14,y-14,-4,112,100,25,['#62504f','#211724','#302231','#ad805a']);
   box(x,y,198,84,74,202,['#8d6b64','#302330','#46303c','#bb8c6a']);
   line([x+42,y+76,8],[x+42,y+76,184],'#ee4b6a',4);
   label('R',x+42,y+77,112,45,'#df4b68');
  }
  box(-220,-397,0,440,114,30,['#58434b','#271c29','#372633','#b3896b']);
  box(-95,-385,96,190,46,97,['#3e2635','#211822','#291d2a','#ae6f70']);
  box(-55,-410,168,110,18,95,['#8b3d50','#522437','#652a3f','#c88d79']);
  label('R',0,-390,130,62,'#ff5d7e');
  for(const x of [-330,260]){box(x,-407,165,70,12,163,['#ae7659','#632b40','#7f3b48','#dda675']);label('R',x+35,-393,94,61,'#f56c83')}
  for(const x of [-470,470])terminal(x,-250);
  label('GIOVANNI / COMANDO SUPREMO',0,-270,14,16,'#edb18e');
 }
}
function sectorBoardTrim(){
 if(arenaKind==='containment')return;
 const accent=sectors[arenaKind].color;
 for(const x of [-319,319])line([x,-275,18],[x,302,18],accent,4);
 label(sectors[arenaKind].name.toUpperCase(),0,-291,22,12,accent);
 if(arenaKind==='giovanni')for(const x of [-338,326])for(const y of [-285,285]){box(x,y,42,12,25,55,['#b68d62','#483140','#695042','#f0c390']);glow(x,y,40,32,'#ff405744')}
}
