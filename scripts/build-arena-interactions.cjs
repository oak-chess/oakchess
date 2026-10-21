/* Adapt the approved visual experiments into isolated combat-clock renderers. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,'prototypes',name,'impact.js'),'utf8').replace(/\r/g,'');
function between(source,a,b){const start=source.indexOf(a),end=source.indexOf(b,start);if(start<0||end<0)throw Error('Missing renderer boundary: '+a);return source.slice(start,end)}
const element=read('element-impact');
const css=between(element,'shockStyle.textContent=`','`;document.head.append(shockStyle);').replace('shockStyle.textContent=`','').replaceAll('prototype-','arena-react-')+'\nbody.game-paused .unit.arena-react-electrocuted canvas.pmdc,body.game-paused .unit.arena-react-electrocuted .spr>img{animation-play-state:paused!important}\n';
fs.writeFileSync(path.join(root,'assets/arena-interactions.css'),css);
function adapt(source){
 return source.replaceAll('prototype-','arena-react-')
 .replace(/ui\.querySelector\('span'\)\.textContent=(?:'[^']*'|modes\[mode\]\.(?:n\+'[^']*'|label));?/g,'')
 .replaceAll('performance.now()','clock.now()')
 .replaceAll('requestAnimationFrame(frame)','queue(frame)')
 .replaceAll('cancelAnimationFrame(raf)','unqueue()')
 .replaceAll('inner.animate(','trackAnimation(job,inner,')
 .replaceAll('hexXY(3,3)','hexXY(event.r,event.c)')
 .replaceAll('hdist(3,3,','hdist(event.r,event.c,')
 .replaceAll('hdist(4,3,','hdist(event.r,event.c,')
 .replaceAll('if(d>2)continue','if(d>event.radius)continue')
 .replaceAll('if(d<=2)','if(d<=event.radius)')
 .replaceAll('for(let v=0;v<5;v++)','for(let v=0;v<Math.min(5,Math.max(2,event.radius*2+1));v++)')
 .replaceAll("PMD.playNames(attacker.el,['Shoot','Charge','Attack']);",'')
 .replaceAll("PMD.playNames(attacker.el,['Charge','Shoot','Attack']);",'')
 .replaceAll("PMD.playNames(attacker.el,['Shoot','Charge']);",'')
 .replaceAll("hexXY(2,i?5:3)","slideDestination(u,event)");
}
const factories=[];
function factory(name,body,setup,entry){factories.push(`function ${name}(event,job){\n${setup}\n${adapt(body)}\n${entry}();return {draw:now=>{if(job.next)job.next(now)},stop:()=>stop()};\n}`)}
const common=`const env=environment(event,job),{attacker,targets,clock,queue,unqueue,updateCUEl,PMD,B}=env;let raf=0;`;
factory('elements',between(element,' function path(g,points)',"\n ui.querySelector('[data-prepare]').onclick"),`${common}let bases=[];const current=event.kind,mode=current;const floor=env.layer(1),fx=env.layer(2500);`,'run');
// The original element stop function also owns body layers and direction canvases.
const elementStop=between(element,' function stop(reset=true)', '\n function prepare()');
factories[0]=factories[0].replace(' function path(g,points)',adapt(elementStop)+'\n function path(g,points)');
const quake=read('earthquake-impact');
factory('earthquake',between(quake,' function stop()',"\n ui.querySelector('[data-play]')"),`${common}const ctx=env.layer(1),moved=new Map();const cv=ctx.canvas,target=targets[0];`,'play');
const surf=read('surf-impact');
const surfRun=between(surf,' function run()',"\n ui.querySelector('[data-prepare]')").replace('Math.abs(w)<100','Math.abs(w)<100&&hdist(event.r,event.c,r,c)<=event.radius').replace('   if(t<5)',`   targets.slice(1).forEach(u=>{const px=u._baseX-origin.x,py=u._baseY-origin.y,s=px*dx+py*dy,age=t-(.35+s/220);if(age<0)return;if(!u._surfHit){u._surfHit=true;PMD.playNames(u.el,['Hurt'])}const carried=95*(1-Math.exp(-Math.max(0,front-s)/80)),lift=reduce?0:Math.sin(Math.min(1,age/.85)*Math.PI)*13;u.x=u._baseX+dx*carried;u.y=u._baseY+dy*carried-lift;updateCUEl(u)});
   if(t<5)`);
factory('surf',between(surf,' function stop(reset=true)','\n function prepare()')+'\n'+surfRun,`${common}const g=env.layer(1),f=env.layer(2500);let base=null;const target=targets[0]||env.center;`,'run');
const ice=read('ice-impact');
factory('ice',between(ice,' function stop(reset=true)','\n function prepare()')+'\n'+between(ice,' function run()',"\n ui.querySelector('[data-prepare]')"),`${common}const g=env.layer(1);let bases=[];`,'run');
const header=fs.readFileSync(path.join(root,'scripts/arena-interactions-runtime.txt'),'utf8');
const output=header.replace('/* GENERATED_RENDERERS */',factories.join('\n'));
new Function(output);
fs.writeFileSync(path.join(root,'assets/arena-interactions.js'),output);
console.log('Approved arena renderers built.');
