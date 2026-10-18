/* Passive attacks share the battle clock and never trigger other basic-hit procs. */
(()=>{
 'use strict';
 const profiles={
  kindling:{move:'EMBER',name:'Brasas',type:'fire',every:3,power:.18,status:'burn',duration:3,value:.025},
  foxflame:{move:'EMBER',name:'Brasas',type:'fire',every:3,power:.16,status:'burn',duration:2.8,value:.018},
  venomfang:{move:'POISON_FANG',name:'Presas Venenosas',type:'poison',every:3,power:.18,status:'poison',duration:2.8,value:.016},
  voltage:{move:'THUNDER_SHOCK',name:'Choque do Trovão',type:'electric',every:4,power:.42,status:'stun',duration:.25,secondary:true},
  thunderpulse:{move:'SHOCK_WAVE',name:'Onda de Choque',type:'electric',every:4,power:.38,secondary:true},
  static:{move:'THUNDER_PUNCH',name:'Soco Trovão',type:'electric',chance:.18,power:.16,status:'stun',duration:.5}
 };
 const species=window.PASSIVE_ROSTER||{
  1:{move:'MEGA_DRAIN',name:'Mega Dreno',type:'grass',every:4,power:.35,drain:.6},
  58:{move:'EMBER',name:'Brasas',type:'fire',every:4,power:.22,status:'burn',duration:2.5,value:.012},
  92:{move:'NIGHT_SHADE',name:'Sombra Noturna',type:'ghost',every:4,power:.30,status:'slow',duration:1}
 };
 function profile(u){const p=species[u.L.ids[0]]||profiles[u.L.passive.id];return p?.forms?.[u.id]||p}
 function description(p){
  let text=p.chance?'Ataques básicos têm 18% de chance de lançar '+p.name:'A cada '+p.every+' acertos básicos, lança '+p.name;
  if(p.action==='heal')text+=' no aliado com menor proporção de PS, curando '+Math.round(p.power*100)+'% do Poder';
  else if(p.action==='shield')text+=' e ganha escudo de '+Math.round(p.power*100)+'% do Poder, limitado a 6% dos PS máximos, por 3s';
  else if(p.action==='splash')text+=' (apenas animação; ao evoluir, recebe Mordida)';
  else text+=' ('+Math.round(p.power*100)+'% do Ataque como dano '+(p.kind==='phys'?'físico':'especial')+')';
  if(p.secondary)text+=' em outro rival a até 2 casas do alvo; sem outro rival, atinge o próprio alvo';
  if(p.status==='burn')text+=', causando queimadura por '+String(p.duration).replace('.',',')+'s';
  if(p.status==='poison')text+=', envenenando por '+String(p.duration).replace('.',',')+'s';
  if(p.status==='stun')text+=', atordoando por '+String(p.duration).replace('.',',')+'s';
  if(p.status==='slow')text+=', reduzindo a velocidade por '+String(p.duration).replace('.',',')+'s';
  if(p.drain)text+=' e recupera '+Math.round(p.drain*100)+'% do dano causado como PS';
  return text+'. Intervalo mínimo de 2s entre ativações.';
 }
 // Clone per line: several lines share their original passive object.
 for(const line of LINES){const p=species[line.ids[0]]||profiles[line.passive.id];if(!p)continue;
  const old=line.passive,base=['kindling','foxflame','venomfang','voltage','thunderpulse','static'].includes(old.id)?(old.mobility?old.d+' ':''):old.d+' ';
  const forms=Object.entries(p.forms||{}).map(([id,form])=>{const index=line.ids.indexOf(+id);return (line.names[index]||'#'+id)+': '+description(form)}).join(' ');
  line.passive={...old,d:base+description(p)+(forms?' '+forms:''),passiveMove:p.move};
 }
 window.PASSIVE_MOVES={
  handles(u){return !!profile(u)},
  onBasic(u,target,damage){
   const p=profile(u);if(!p||damage<=0||!u.alive||B.over||!B.on||B.t<(u.castingUntil||0))return;
   u.passiveMoveHits=(u.passiveMoveHits||0)+1;
   if((u.passiveMoveCd||0)>0)return;
   if(p.chance?Math.random()>=p.chance:u.passiveMoveHits<p.every)return;
   let victim=target;
   if(p.action==='heal')victim=B.units.filter(e=>e.alive&&e.side===u.side&&e.hp<e.maxHp).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
   if(p.action==='shield'||p.action==='splash')victim=u;
   if(p.secondary)victim=B.units.filter(e=>e.alive&&e.side!==u.side&&e!==target&&hdist(target.r,target.c,e.r,e.c)<=2).sort((a,b)=>hdist(target.r,target.c,a.r,a.c)-hdist(target.r,target.c,b.r,b.c))[0]||target;
   if(!victim?.alive)return;
   u.passiveMoveHits=0;u.passiveMoveCd=2;
   const move={n:p.name,emerald:p.move,t:p.type,k:p.action==='heal'?'heal':p.action==='shield'?'barrier':'bolt',passive:true};
   move._variant=u._passiveVariation=(u._passiveVariation||0)+1;
   window.MOVE_PRESENTATION?.cast(u,victim,move);
   const preview=window.HEX_ATTACKS?.target(victim,move,.12,true);
   const raw=(p.stat==='spell'?u.spell*(1+u.ap):u.atk*(1+u.buffAtk))*(p.action?1:1+u.dmgAmp)*p.power;
   FX.text(u.x,u.y-66,p.name+'!',''+((PAL[p.type]||PAL.normal)[1]),11);
   // Capture references: no proc can jump to a later battle or fire after its owner dies.
   const units=B.units;
   const land=()=>{
    if(B.units!==units||B.over||!B.on||!u.alive||!victim.alive)return;
    window.HEX_ATTACKS?.activate(preview,victim);
    if(p.action){
     if(p.action==='heal'){healUnit(victim,raw,false,u);FX.healFx(victim.x,cyOf(victim))}
     if(p.action==='shield'){
      const added=Math.max(0,Math.min(raw,u.maxHp*.06,u.maxHp*.15-u.shield));
      if(added>0){u.shield+=added;u.shieldT=Math.max(u.shieldT,3);FX.shieldFx(u.x,cyOf(u))}
     }
     if(!window.EMERALD_MOVES?.start(move,victim.x,cyOf(victim)))window.EMERALD_MOVES?.hit(move,victim.x,cyOf(victim),.65);
     SND.hit(p.type,.35);return;
    }
    const before=victim._reportTaken||0;
    hurt(u,victim,raw,p.kind||'spec',{spell:true,passive:true});
    const dealt=Math.max(0,(victim._reportTaken||0)-before);
    if(victim.alive&&p.status)applyStatus(victim,p.status,p.duration,u,p.value);
    if(p.drain&&dealt>0){healUnit(u,dealt*p.drain,false,u);FX.healFx(u.x,cyOf(u))}
    if(!window.EMERALD_MOVES?.hit(move,victim.x,cyOf(victim),.75))FX.impact(p.type,victim.x,cyOf(victim),.75);
    SND.hit(p.type,.55);
   };
   if(p.delivery==='self'||p.delivery==='contact'||p.action==='splash')schedule(.12,land);
   else FX.shoot(u.x,cyOf(u),victim,p.type,660,.8,land,{move,preview});
  }
 };
})();
