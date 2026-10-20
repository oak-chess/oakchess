/* Adaptation layer, not a GBA emulator. Combat remains authoritative for hits. */
(()=>{
 'use strict';
 const catalog=window.EMERALD_CATALOG;if(!catalog)return;
 const sharedImages=new Map();
 function createRenderer(isolated=false){
 const images=sharedImages,frames=new Map(),active=[],resources=new Map();
 for(const [name,template] of Object.entries(catalog.templates)){
  if(!resources.has(template.tag))resources.set(template.tag,[]);
  resources.get(template.tag).push(name);
 }
 const travelRE=/ToTarget|Projectile|Missile|Beam|Shot|Throw|Spit|Linear|Moving|Flying|WaveFrom|AirWave|ShadowBall|RazorLeaf|DragonBreath/i;
 const hitRE=/HitSplat|Impact|Slash|Claw|Fang|Teeth|Explosion|Punch|Kick|Plume|Burst|Shock|Bolt/i;
 const orbitRE=/Orbit|Circling|Spiral|Dance|Ring|Rotat|Whirl/i;
 const number=(v,fallback=0)=>Number.isFinite(Number(v))?Number(v):fallback;
 const quality=()=>typeof CFG==='undefined'?'normal':CFG.fxLevel;
 const reduced=()=>typeof CFG!=='undefined'&&CFG.reduceFx;
 const maxEffects=()=>quality()==='low'?40:quality()==='high'?140:90;
 for(const t of Object.values(catalog.templates))if(!images.has(t.sheet)){
  const image=new Image(),entry={image,ready:false};images.set(t.sheet,entry);
  image.onload=()=>entry.ready=true;image.src='assets/move-fx/sheets/'+t.sheet+'.png';
 }
 function resolve(move){
  if(!move)return null;const name=typeof move==='string'?move:move.n;
  const key=typeof move==='object'&&move.emerald||(name==='Redemoinho'&&move.t==='water'?'WHIRLPOOL':window.EMERALD_ALIASES?.[name])||name;
  const base=catalog.moves[key];if(!base)return null;
  const variant=typeof move==='object'?move._variant:0;
  if(base.variants?.length&&Number.isFinite(variant)){
   const attack=base.variants.find(v=>/Unleash|SkullBashAttack|SkyAttackUnleash/.test(v.label));
   const selected=attack||base.variants[variant%base.variants.length];
   return {...base,...selected,resources:base.resources,id:base.id};
  }
  return base;
 }
 function available(name){const t=catalog.templates[name];return t&&images.get(t.sheet)?.ready}
 function candidates(move){return [...new Set([...move.events.map(e=>e.sprite),...move.resources])].filter(available)}
 function choose(move,kind){
  const all=candidates(move),match=re=>all.find(n=>re.test(n+' '+catalog.templates[n].callback));
  return (kind==='projectile'?match(travelRE):kind==='hit'?match(hitRE):match(orbitRE))||all[0];
 }
 function animation(template,variant=0){return template.animations[variant%Math.max(1,template.animations.length)]||{frames:[[0,8,0,0]],loop:true}}
 function drawSprite(g,name,x,y,scale,time,angle=0,variant=0,alpha=1){
  const template=catalog.templates[name];if(!template||!available(name))return false;
  const sequence=animation(template,variant),total=sequence.frames.reduce((n,f)=>n+Math.max(1,f[1]),0);
  let tick=Math.floor(time*60);tick=sequence.loop?tick%total:Math.min(tick,total-1);
  let frame=sequence.frames[0];for(const f of sequence.frames){frame=f;if(tick<Math.max(1,f[1]))break;tick-=Math.max(1,f[1])}
  const cacheKey=name+':'+frame[0];let canvas=frames.get(cacheKey);
  if(!canvas){
   canvas=document.createElement('canvas');canvas.width=template.w;canvas.height=template.h;
   const ctx=canvas.getContext('2d'),source=images.get(template.sheet).image,tilesAcross=source.naturalWidth/8;
   // Emerald frame offsets count 8x8 tiles, not rows in a sprite sheet.
   for(let y0=0;y0<template.h;y0+=8)for(let x0=0;x0<template.w;x0+=8){
    const tile=frame[0]+(y0/8)*(template.w/8)+x0/8,sx=(tile%tilesAcross)*8,sy=Math.floor(tile/tilesAcross)*8;
    if(sy+8<=source.naturalHeight)ctx.drawImage(source,sx,sy,8,8,x0,y0,8,8);
   }
   frames.set(cacheKey,canvas);
  }
  g.save();g.globalAlpha=alpha;g.globalCompositeOperation='source-over';g.imageSmoothingEnabled=false;
  const affine=template.affines?.[variant%Math.max(1,template.affines.length)];
  let sx=256,sy=256,rotation=0;
  if(affine?.frames.length){
   const total=affine.frames.reduce((n,f)=>n+f[3],0);let tick=Math.floor(time*60);if(affine.loop&&total)tick%=total;
   for(const f of affine.frames){if(!f[3]){sx=f[0]||256;sy=f[1]||256;rotation=f[2];continue}const steps=Math.min(tick,f[3]);sx+=f[0]*steps;sy+=f[1]*steps;rotation+=f[2]*steps;tick-=steps;if(tick<=0)break}
  }
  const factor=v=>Math.max(.55,Math.min(1.8,256/Math.max(32,Math.abs(v))));
  g.translate(Math.round(x),Math.round(y));g.rotate(angle+(reduced()?0:rotation*Math.PI/128));g.scale((frame[2]?-scale:scale)*factor(sx),(frame[3]?-scale:scale)*factor(sy));
  g.drawImage(canvas,-template.w/2,-template.h/2);g.restore();return true;
 }
 function enqueue(o){if(active.length>=maxEffects())return false;active.push({t:0,delay:0,life:.45,scale:1,variant:0,mode:'still',...o});return true}
 function duration(name,variant=0){const a=animation(catalog.templates[name],variant);return Math.max(.22,Math.min(.85,a.frames.reduce((n,f)=>n+f[1],0)/60))}
 function motion(name){
  const callback=catalog.templates[name]?.callback||'';
  if(/Spiral.*Inward|SpiralInward/.test(callback))return 'spiralIn';
  if(/Spiral/.test(callback))return 'spiralOut';
  if(/Bounce|Hop/.test(callback))return 'bounce';
  if(orbitRE.test(callback))return 'orbit';
  if(/Powder|Spore|Snow|Mist|Smoke/i.test(callback))return 'rise';
  return 'still';
 }
 function emit(move,name,x,y,scale,mode='still',delay=0,variant=0,extra={}){
  if(!name)return false;
  return enqueue({name,x,y,scale:Math.min(2.2,Math.max(.7,scale)),life:duration(name,variant),delay,variant,mode,...extra});
 }
 function taskEffect(move,x,y,scale,type){
  // Moves such as Psychic have background/affine tasks, with no sprite of their own.
  if(!move.tasks.length)return false;
  const palette=typeof PAL!=='undefined'&&(PAL[type]||PAL.psychic);
  const color=palette?palette[1]:'#c79aff';
  const family=move.tasks.join(' '),mode=/Heal|Recover|Growth|ScaleMon/.test(family)?'rise':/Elliptical|Rotate|Roll/.test(family)?'orbit':'pulse';
  return enqueue({name:null,x,y,scale,life:reduced()?.32:.55,color,mode});
 }
 function hit(mv,x,y,scale=1){
  const resolved=resolve(mv);
  if(resolved?.id===149){
   const name='gPsywaveRingSpriteTemplate';
   if(available(name)){
    const count=quality()==='low'?3:5;
    for(let i=0;i<count;i++)enqueue({name,x,y,scale:Math.max(.8,scale),life:.8,delay:i*.09,variant:0,mode:'psywave'});
    return true;
   }
  }
  if((api.sequence||(!isolated?window.EMERALD_SEQUENCES:null))?.impact?.(mv,x,y,scale))return true;
  const move=resolve(mv);if(!move)return false;const names=candidates(move);if(!names.length)return taskEffect(move,x,y,scale,mv.t);
  const primary=choose(move,'hit');
  // Preserve successive splats and directional cuts from the source script.
  const events=move.events.filter(e=>available(e.sprite)&&hitRE.test(e.sprite+' '+catalog.templates[e.sprite].callback));
  const count=quality()==='low'?2:reduced()?3:5;
  if(events.length){const first=events[0].t;events.slice(0,count).forEach((e,i)=>emit(move,e.sprite,x+Math.max(-24,Math.min(24,number(e.args[0]))),y+Math.max(-20,Math.min(20,number(e.args[1]))),scale,motion(e.sprite),Math.min(.22,Math.max(0,e.t-first)),i));return true}
  const ok=emit(move,primary,x,y,scale,motion(primary));
  if(!reduced()&&names.length>1)emit(move,names[names.length-1],x,y,scale*.8,'rise',.06);
  return ok;
 }
 function start(mv,x,y){
  // Psywave's rings are travelling sprites in Emerald; OakChess resolves this move as a burst.
  // Emit its expanding rings at the actual impact phase instead of dropping them at preparation.
  if(resolve(mv)?.id===149)return false;
  if((api.sequence||(!isolated?window.EMERALD_SEQUENCES:null))?.start?.(mv,x,y))return true;
  const move=resolve(mv);if(!move)return false;
  if(!['buff','barrier','heal','field','burst'].includes(mv.k))return false;
  const events=move.events.filter(e=>available(e.sprite)&&!travelRE.test(e.sprite+' '+catalog.templates[e.sprite].callback));
  if(!events.length)return taskEffect(move,x,y,1,mv.t);
  const count=quality()==='low'?3:reduced()?4:9,first=events[0].t;
  events.slice(0,count).forEach((e,i)=>{
   const mode=motion(e.sprite);
   emit(move,e.sprite,x,y,1,mode,Math.min(.4,e.t-first),i,{angle:i*2.399,radius:12+(i%3)*7});
  });return true;
 }
 function beam(mv,x1,y1,x2,y2,width=18){
  const move=resolve(mv);if(!move)return false;const name=choose(move,'projectile');if(!name)return false;
  if(move.id===53){
   const flame=available('gFlamethrowerFlameSpriteTemplate')?'gFlamethrowerFlameSpriteTemplate':name;
   return enqueue({name:flame,x:x1,y:y1,x2,y2,life:.78,mode:'flamethrower',width,angle:Math.atan2(y2-y1,x2-x1)});
  }
  const distance=Math.hypot(x2-x1,y2-y1),count=quality()==='low'?7:reduced()?12:22;
  const events=move.events.filter(e=>available(e.sprite)&&travelRE.test(e.sprite+' '+catalog.templates[e.sprite].callback));
  for(let i=0;i<count;i++){
   const event=events[i%Math.max(1,events.length)],sprite=event?.sprite||name;
   enqueue({name:sprite,x:x1,y:y1,x2,y2,life:.38,mode:'beam',position:i/Math.max(1,count-1),scale:Math.max(.8,Math.min(1.8,width/20)),variant:i,angle:Math.atan2(y2-y1,x2-x1),wave:reduced()?0:Math.min(8,width/3),distance});
  }return true;
 }
 function projectile(g,p){
  const mv=p.o?.move,move=resolve(mv);if(!move)return false;
  const name=choose(move,'projectile');if(!name)return false;
  const t=catalog.templates[name],angle=/Needle|Stinger|Leaf|AirWave|Arrow/i.test(t.callback+' '+name)?(p.dir||0):0;
  const scale=Math.max(.65,Math.min(2,(26*(p.size||1))/Math.max(t.w,t.h)));
  const age=p.age||0,callback=t.callback||'';
  // Secondary sprite motion stays local to the authoritative projectile position.
  const wave=!reduced()&&/SinWave|Bounce/.test(callback)?Math.sin(age*18)*4:0;
  const x=p.x+(p.ox||0)-Math.sin(p.dir||0)*wave,y=p.y+(p.oy||0)+Math.cos(p.dir||0)*wave;
  if(!reduced()&&/Spiral|Circling|Orbit/.test(callback))for(let i=0;i<2;i++){
   const a=age*12+i*Math.PI;drawSprite(g,name,x+Math.cos(a)*9,y+Math.sin(a)*6,scale*.45,age,angle,i,.45);
  }
  return drawSprite(g,name,x,y,scale,age,angle,Math.floor(age*2));
 }
 const api={resolve,start,hit,beam,projectile,
  ready(){return Promise.all([...images.values()].map(s=>s.image.complete?Promise.resolve():new Promise(resolve=>{s.image.addEventListener('load',resolve,{once:true});s.image.addEventListener('error',resolve,{once:true})})))},
  emitTemplate(name,x,y,scale,delay,variant,extra={}){if(!available(name))return false;return emit(null,name,x,y,scale,motion(name),delay,variant,extra)},
  availableTemplate:available,
  drawResource(g,tag,x,y,scale,time,variant=0,alpha=1){
   const names=(resources.get(tag)||[]).filter(available);
   if(!names.length)return false;
   const name=names[variant%names.length];
   return drawSprite(g,name,x,y,scale,time%Math.max(.2,duration(name,variant)),0,variant,alpha);
  },
  // Public playback entry point for future moves and regions. This is a visual adaptation.
  play(name,source,target,options={}){
   const move=resolve(name);if(!move)return false;
   const mv={n:name,k:options.kind||'bolt',t:options.type||'normal'};
   if(mv.k==='beam')return beam(mv,source.x,source.y,target.x,target.y,options.width);
   if(['buff','heal','barrier'].includes(mv.k))return start(mv,source.x,source.y);
   return hit(mv,target.x,target.y,options.scale||1);
  },
  update(dt){for(let i=active.length-1;i>=0;i--){const e=active[i];e.t+=dt;if(e.t>=e.life+e.delay)active.splice(i,1)}},
  draw(g){for(const e of active){
   const time=e.t-e.delay;if(time<0)continue;const k=Math.min(1,time/e.life),fade=Math.min(1,(1-k)*5);
   let x=e.x,y=e.y,rotation=0;
   if(e.mode==='travel'){const wave=Math.sin(k*Math.PI*4)*(e.wave||0);x+=(e.x2-e.x)*k-Math.sin(e.angle)*wave;y+=(e.y2-e.y)*k+Math.cos(e.angle)*wave;}
   if(e.mode==='beam'){const p=e.position,wave=Math.sin(p*Math.PI*6-k*Math.PI*4)*(e.wave||0);x+=(e.x2-e.x)*p-Math.sin(e.angle)*wave;y+=(e.y2-e.y)*p+Math.cos(e.angle)*wave;}
   if(e.mode==='rise')y-=k*22;
   if(e.mode==='bounce')y-=Math.abs(Math.sin(k*Math.PI*2))*16*(1-k);
   if(e.mode==='spiralIn'||e.mode==='spiralOut'){const angle=(e.angle||0)+k*Math.PI*3,radius=24*(e.mode==='spiralIn'?1-k:k);x+=Math.cos(angle)*radius;y+=Math.sin(angle)*radius*.6;rotation=angle*.25;}
   if(e.mode==='orbit'){const angle=(e.angle||0)+k*Math.PI*2;x+=Math.cos(angle)*(e.radius||18);y+=Math.sin(angle)*(e.radius||18)*.55;rotation=angle*.3;}
   if(e.mode==='flamethrower'){
    const dx=e.x2-e.x,dy=e.y2-e.y,length=Math.hypot(dx,dy)||1;
    const count=Math.min(90,Math.max(18,Math.ceil(length/(quality()==='low'?16:10))));
    const opacity=Math.min(1,time/.07,(e.life-time)/.16);
    // A thin warm core joins overlapping source sprites into a continuous flame stream.
    g.save();g.globalCompositeOperation='lighter';g.globalAlpha=opacity*.55;g.lineCap='round';
    g.strokeStyle='#ef5b16';g.lineWidth=Math.max(9,e.width*.65);g.beginPath();g.moveTo(e.x,e.y);g.lineTo(e.x2,e.y2);g.stroke();
    g.strokeStyle='#ffd46b';g.lineWidth=Math.max(3,e.width*.18);g.stroke();g.restore();
    for(let i=0;i<count;i++){
     const p=(i/count+time*1.65)%1;
     const ripple=Math.sin(p*23-time*26)*Math.min(5,e.width*.15)*Math.sin(p*Math.PI);
     const px=e.x+dx*p-Math.sin(e.angle)*ripple,py=e.y+dy*p+Math.cos(e.angle)*ripple;
     const size=(.85+p*.35)*(1+Math.sin(i*2.1+time*20)*.06);
     drawSprite(g,e.name,px,py,size,time+i*.018,e.angle,0,opacity*.88);
    }
   }else if(e.mode==='psywave'){
    const expansion=(.8+k*5.5)*e.scale;
    drawSprite(g,e.name,x,y,expansion,time,Math.PI/2,0,fade*.95);
   }else if(e.name)drawSprite(g,e.name,x,y,e.scale,time,rotation,e.variant,fade);
   else{
    g.save();g.globalCompositeOperation='source-over';g.globalAlpha=fade*(reduced()?.45:.7);g.strokeStyle=e.color;g.lineWidth=2;g.setLineDash([5,3]);
    const radius=(12+k*25)*e.scale;g.beginPath();g.ellipse(x,y,radius,radius*.65,0,0,Math.PI*2);g.stroke();g.restore();
   }
  }},
  clear(){active.length=0},get active(){return active.length>0}
 };
 return api;
 }
 window.CREATE_EMERALD_RENDERER=()=>createRenderer(true);
 window.EMERALD_MOVES=createRenderer();
})();
