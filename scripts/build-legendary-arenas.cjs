/* Package the approved prototypes as isolated paint/tick adapters for the game. */
const fs=require('fs'),path=require('path');
let sharp;try{sharp=require('sharp')}catch{sharp=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')}
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const adapter=read('assets/misty-arena.js'),point=adapter.slice(adapter.indexOf('function point('),adapter.indexOf('function poly(')).replace('(x+2)*60/64','(x+4)*10/11');
const geo=read('prototypes/legendary-birds-arena/geometry.js');
const helpers=read('prototypes/legendary-birds-arena/solo.js');
const primitiveHelpers=helpers.slice(helpers.indexOf('const colors='),helpers.indexOf('let audio=null'));
const header=`
const root=globalThis,realDocument=root.document,window=Object.create(root),uiRoot=realDocument.createElement('div'),controls=new Map();
const images=[];const Image=function(...args){const im=new root.Image(...args);images.push(im);im.addEventListener('load',()=>sceneKey='');im.addEventListener('error',()=>sceneKey='');return im};
uiRoot.innerHTML='<section class="controls"><h2>Ambiente</h2></section>';
const canvas=realDocument.createElement('canvas');canvas.width=1280;canvas.height=800;
const $=id=>{if(id==='scene')return canvas;if(!controls.has(id)){const el=realDocument.createElement('button');el.id=id;controls.set(id,el)}return controls.get(id)};
const document={createElement:realDocument.createElement.bind(realDocument),getElementById:$,querySelector:q=>uiRoot.querySelector(q),body:uiRoot,get hidden(){return realDocument.hidden},addEventListener:(name,fn,options)=>realDocument.addEventListener(name,fn,options)};
let c=canvas.getContext('2d'),W=1280,H=800,dpr=1,time=0,paused=false,zoom=1,pan=0,battle=false,gridSoftness=0,sceneKey='',mode='scene',benchMode=false,sceneHeightOffset=10,active=false,wasActive=false;
let reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,showScenicBird=false,scenicPerched=false;
const systemReduced=reducedMotion,defaults={energy:80,volume:50,light:100,decor:true,elements:true,clouds:true,quality:'high'},config={...defaults};
const scenery=realDocument.createElement('canvas');scenery.width=1280;scenery.height=800;
let audio=null,sound=false;
function syncAudio(){}
function ensureAudio(state){
 const allowed=state.active&&!state.paused&&!state.mute&&!realDocument.hidden&&state.sfx>0;
 if(allowed&&root.__legendaryAudioUnlocked&&!audio){try{
  const ctx=new AudioContext(),gain=ctx.createGain(),rainBus=ctx.createGain(),windGain=ctx.createGain(),filter=ctx.createBiquadFilter(),buffer=ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate),data=buffer.getChannelData(0);let low=0;
  for(let i=0;i<data.length;i++){low=(low+(Math.random()*2-1)*.035)/1.035;data[i]=low*3}
  const src=ctx.createBufferSource();src.buffer=buffer;src.loop=true;filter.type='lowpass';filter.frequency.value=theme.kind==='articuno'?1900:theme.kind==='zapdos'?850:320;
  gain.gain.value=0;rainBus.gain.value=.08;windGain.gain.value=theme.kind==='moltres'?.055:.08;src.connect(filter);filter.connect(windGain);windGain.connect(gain);rainBus.connect(gain);gain.connect(ctx.destination);src.start();audio={ctx,gain,rainBus};
 }catch{}}
 sound=allowed&&!!audio;config.volume=Math.round(state.sfx*70);
 if(audio){audio.gain.gain.setTargetAtTime(sound?state.sfx:0,audio.ctx.currentTime,.08);if(sound&&audio.ctx.state==='suspended'&&root.__legendaryAudioUnlocked)audio.ctx.resume().catch(()=>{})}
}
const weatherFX=realDocument.createElement('canvas'),floorFX=realDocument.createElement('canvas');
weatherFX.width=2560;weatherFX.height=800;weatherFX.style.cssText='position:absolute;left:-640px;top:0;width:2560px;height:800px;pointer-events:none;display:none;z-index:1';
floorFX.width=1280;floorFX.height=800;floorFX.style.cssText='position:absolute;inset:0;width:1280px;height:800px;pointer-events:none;display:none';
realDocument.getElementById('world').appendChild(weatherFX);realDocument.getElementById('arenaView').insertBefore(floorFX,realDocument.getElementById('units'));
`;
const tail=`
let lastGrid=-1,lastViewportWidth=0;
const backdrop=new Image();backdrop.src='assets/legendary-art/'+theme.kind+'/'+({articuno:'glacial-cave-v1.webp',moltres:'caldera-v1.webp',zapdos:'power-station-v1.webp'}[theme.kind]);
return {
 paint(g,layer,isAngled){c=g;angled=isAngled;sceneHeightOffset=10;
  if(images.some(im=>im.src&&!im.complete)){if(layer!=='arena'){g.fillStyle=theme.sky[0];g.fillRect(-640,0,2560,800)}sceneKey='painted';return}
  if(layer!=='arena'){mode='scene';c.fillStyle=theme.sky[0];c.fillRect(-640,0,2560,800);const visibleWidth=Math.min(2560,Math.max(1280,realDocument.getElementById('stage').offsetWidth));if(backdrop.complete&&backdrop.naturalWidth)c.drawImage(backdrop,(1280-visibleWidth)/2,0,visibleWidth,800);else background()}
  if(layer!=='scene'){mode='field';arena();decor();benchMode=true;bench();benchMode=false}
  sceneKey='painted';
 },
 tick(dt,state){active=!!state.active;ensureAudio(state);weatherFX.style.display=active?'block':'none';floorFX.style.display=active?'block':'none';
  if(!active){if(wasActive){time=0;gridSoftness=0;sceneKey=''}wasActive=false;return false}
  const viewportWidth=realDocument.getElementById('stage').offsetWidth;if(viewportWidth!==lastViewportWidth){lastViewportWidth=viewportWidth;sceneKey=''}wasActive=true;angled=state.angled;paused=state.paused;reducedMotion=systemReduced;config.quality=state.reduceFx?'low':state.quality;battle=state.combat;showScenicBird=state.preparation||!!state.preview||!!state.birdObserver||!!state.birdArrival;scenicPerched=!!state.birdPerched||state.combat;
  if(!paused&&!realDocument.hidden)time+=dt;
  gridSoftness+=((battle?1:0)-gridSoftness)*(1-Math.exp(-(paused?0:dt)*5));const grid=Math.round(gridSoftness*10),dirty=sceneKey===''||grid!==lastGrid;lastGrid=grid;
  c=floorFX.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,1280,800);mode='field';window.ARENA_EMBLEM_TRANSITION?.draw();
  c=weatherFX.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,2560,800);c.setTransform(1,0,0,1,640,0);mode='scene';sceneHeightOffset=10;
  if(!realDocument.hidden&&!images.some(im=>im.src&&!im.complete)){window.BIRD_LAVA?.groundGlow();window.BIRD_LAVA?.decorationGlow();atmosphere()}
  return dirty;
 }
};
`;
async function build(){for(const bird of ['articuno','moltres','zapdos']){
 const directory='prototypes/'+bird+'-arena',html=read(directory+'/index.html'),files=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>path.posix.normalize(directory+'/'+m[1]));
 const sources=[];
 const artwork=fs.readdirSync(path.join(root,directory,'assets')).filter(file=>/\.png$/i.test(file));
 for(const file of files){
  if(file.endsWith('/solo.js')||file.endsWith('/geometry.js'))continue;
  let source=read(file);
  if(file.endsWith('/lava-flow.js'))source=source.replace(/\n\}\)\(\);\s*$/,'\nwindow.BIRD_LAVA={groundGlow,decorationGlow};\n})();');
  if(file.endsWith('/thunderstorm.js'))source=source.replace('volume.connect(ctx.destination)','volume.connect(audio.gain)').replace('gain.connect(audio.gain)','gain.connect(audio.rainBus)');
  if(file.endsWith('/'+bird+'.js')){
   source=source.replace(/\bbattle\b/g,'scenicPerched').replace('if(!enabled)return;','if(!enabled||!showScenicBird)return;');
   source=source.replace('x:Math.cos(t*.19)*540,y:-75+Math.sin(t*.19)*300,z:145+Math.sin(t*.37)*24','x:Math.cos(t*.19)*440,y:30+Math.sin(t*.19)*180,z:75+Math.sin(t*.37)*18');
   source=source.replace('const bounds=a.bounds,bottom=bounds?.fb?.[r]?.[frame]??a.fh-1;', 'const bounds=a.bounds,bottom=bounds?.fb?.[r]?.[frame]??a.fh-1; p.y=Math.max(20+(bottom+1)*scale,Math.min(780-(a.fh-bottom-1)*scale,p.y));p.x=Math.max(24+a.fw*scale/2,Math.min(1256-a.fw*scale/2,p.x));');
  }
  source=source.replaceAll('../../assets/pmd/','__SHARED_PMD__/').replace(/(['"])assets\//g,'$1assets/legendary-art/'+bird+'/').replaceAll('__SHARED_PMD__/','assets/pmd/');
  for(const file of artwork)source=source.replaceAll(file,file.replace(/\.png$/i,'.webp'));
  source=source.replaceAll('-floor-v1.png','-floor-v1.webp');
  source=source.replaceAll('Math.max(W/art.naturalWidth,H/art.naturalHeight)*Math.max(1,zoom*.3+.7)*1.12','Math.min(W/art.naturalWidth,H/art.naturalHeight)').replaceAll('Math.max(W/im.naturalWidth,H/im.naturalHeight)*Math.max(1,zoom*.3+.7)*1.12','Math.min(W/im.naturalWidth,H/im.naturalHeight)');
  if(file.endsWith('/blizzard.js'))source=source.replace('c.fillStyle=veil;c.fillRect(0,0,W,H)', 'c.fillStyle=veil;c.fillRect(-640,0,2560,H)');
  sources.push('// '+file+'\n'+source);
 }
 const output=path.join(root,'assets/legendary-art',bird);fs.mkdirSync(output,{recursive:true});
 for(const file of artwork){const input=path.join(root,directory,'assets',file),target=path.join(output,file.replace(/\.png$/i,'.webp'));if(!fs.existsSync(target)||fs.statSync(target).mtimeMs<fs.statSync(input).mtimeMs)await sharp(input).webp({quality:88,alphaQuality:95,effort:5}).toFile(target);const old=path.join(output,file);if(fs.existsSync(old))fs.unlinkSync(old)}
 const factory='create'+bird[0].toUpperCase()+bird.slice(1)+'Arena';
 const code='/* Generated from approved prototypes by scripts/build-legendary-arenas.cjs. */\nwindow.'+factory+'=function(){\n'+header+'\nlet angled=true;\n'+point+'\n'+geo.slice(geo.indexOf('function poly('))+'\nfunction random(seed){const n=Math.sin(seed*127.1+311.7)*43758.5453;return n-Math.floor(n)}\n'+primitiveHelpers+'\n'+sources.join('\n')+'\n'+tail+'\n};\n';
 fs.writeFileSync(path.join(root,'assets',bird+'-arena.js'),code);
 console.log('Packaged '+bird+' with '+sources.length+' source modules.');
}
}
build().catch(error=>{console.error(error);process.exitCode=1});
