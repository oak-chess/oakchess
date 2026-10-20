$rootPath = Split-Path $PSScriptRoot -Parent
$forestAdapter = [IO.File]::ReadAllText((Join-Path $rootPath 'assets/viridian-arena.js'))
$geometry = $forestAdapter.Substring($forestAdapter.IndexOf('function poly('), $forestAdapter.IndexOf('function random(')-$forestAdapter.IndexOf('function poly('))
$audioStart = $forestAdapter.IndexOf('function unlockAudio(')
$audioEnd = $forestAdapter.IndexOf('return{', $audioStart)
$ambient = $forestAdapter.Substring($audioStart, $audioEnd-$audioStart)
$header = @'
// Adaptação visual do protótipo aprovado, sem regras de combate.
window.FACTORY=function(){
let c,W=1280,H=800,time=0,paused=false,gridSoftness=0,angled=true,mode='scene',benchMode=false,sceneHeightOffset=0;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const config=CONFIG;
let audio=null,sound=false,unlocked=false,lastGrid=0;
const effects=document.createElement('canvas');effects.id='EFFECTID';effects.width=2560;effects.height=800;effects.style.cssText='position:absolute;left:-640px;top:0;width:2560px;height:800px;pointer-events:none;display:none;z-index:1';
document.getElementById('world').appendChild(effects);
const backEffects=document.createElement('canvas');backEffects.width=2560;backEffects.height=800;backEffects.style.cssText='position:absolute;left:-640px;top:0;width:2560px;height:800px;pointer-events:none;display:none';
document.getElementById('world').insertBefore(backEffects,document.getElementById('arenaView'));
function point(x,y,z=0){
 if(mode==='field'){
  if(benchMode){x=BENCHX;y-=46.5}
  if(!angled)return{x:640+x,y:332.5+y-(z-10),s:1};
  // Projeta a altura no espaço e desfaz apenas a transformação do canvas-pai.
  const a=38*Math.PI/180,wy=(y-67.5)*1.02,wz=(z-10)*1.02,k=2200/(2200-wy*Math.sin(a)-wz*Math.cos(a));
  const q=(6+wy*Math.cos(a)-wz)*k,flatY=2200*(q-6)/(1.02*(2200*Math.cos(a)+q*Math.sin(a))),flatK=2200/(2200-flatY*1.02*Math.sin(a));
  return{x:640+x*k/flatK,y:400+flatY,s:k/flatK};
 }
 if(!angled)return{x:640+x,y:332.5+y-(z-sceneHeightOffset),s:1};
 const a=38*Math.PI/180,wy=(y-67.5)*1.02,wz=(z-sceneHeightOffset)*1.02,k=2200/(2200-wy*Math.sin(a)-wz*Math.cos(a));
 return{x:640+x*1.02*k,y:400+(6+wy*Math.cos(a)-wz)*k,s:1.02*k};
}
'@
$tail = @'
return{
 paint(g,layer,isAngled){
  c=g;angled=isAngled;
  if(layer!=='arena'){mode='scene';g.fillStyle='BGCOLOR';g.fillRect(-640,0,2560,800);SCENECALL}
  if(layer!=='scene'){mode='field';FIELDCALL;benchMode=true;BENCHCALL;benchMode=false}
 },
 tick(dt,state){
  effects.style.display=state.active?'block':'none';
  backEffects.style.display=state.active?'block':'none';
  ambientAudio(state.active&&!state.paused&&!state.mute&&!document.hidden,state.sfx*SOUNDFACTOR);
  if(!state.active)return false;
  angled=state.angled;paused=state.paused;config.quality=state.quality;
  if(!paused)time+=dt;
  gridSoftness+=((state.combat?1:0)-gridSoftness)*(1-Math.exp(-dt*5));
  const grid=Math.round(gridSoftness*10),dirty=grid!==lastGrid;lastGrid=grid;
  c=backEffects.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,2560,800);c.setTransform(1,0,0,1,640,0);mode='scene';sceneHeightOffset=10;
  if(!document.hidden){BACKANIMCALL}
  sceneHeightOffset=0;
  c=effects.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,2560,800);c.setTransform(1,0,0,1,640,0);mode='scene';
  if(!document.hidden){ANIMCALL}
  return dirty;
 }
};
};
'@
function Write-Arena($name,$factory,$settings,$source,$scene,$field,$bench,$animation,$bg,$factor) {
 $head=$header.Replace('FACTORY',$factory).Replace('CONFIG',$settings).Replace('EFFECTID',($name+'Atmosphere')).Replace('BENCHX',$(if($name -eq 'misty'){'(x+2)*60/64'}else{'(x+4)*10/11'}))
 $backAnimation=if($name -eq 'misty'){"for(const side of [-1,1])for(let i=0;i<3;i++)waterfall(side*373,-185+i*145,0,1,72,i*.21+(side+1)*.13);frontWaterfalls();"}else{''}
 $footer=$tail.Replace('SCENECALL',$scene).Replace('FIELDCALL',$field).Replace('BENCHCALL',$bench).Replace('BACKANIMCALL',$backAnimation).Replace('ANIMCALL',$animation).Replace('BGCOLOR',$bg).Replace('SOUNDFACTOR',$factor)
 $soundCode=$ambient
 if($name -eq 'brock'){$soundCode=$soundCode.Replace('filter.frequency.value=1100','filter.frequency.value=420')}
 if($name -eq 'misty'){$soundCode=$soundCode.Replace('filter.frequency.value=1100','filter.frequency.value=5000').Replace('data[i]=low*3','data[i]=low*3+(Math.random()*2-1)*.3')}
 if($name -eq 'mewtwo'){
  $soundCode=@'
document.addEventListener('pointerdown',()=>unlocked=true,{once:true});
document.addEventListener('keydown',()=>unlocked=true,{once:true});
function ambientAudio(enabled,volume){
 if(enabled&&unlocked&&!audio){try{const ctx=new AudioContext(),gain=ctx.createGain();gain.gain.value=0;gain.connect(ctx.destination);for(const frequency of [55,82.6,110.3]){const osc=ctx.createOscillator(),level=ctx.createGain();osc.type='sine';osc.frequency.value=frequency;level.gain.value=.22;osc.connect(level);level.connect(gain);osc.start()}audio={ctx,gain}}catch(e){unlocked=false}}
 sound=enabled&&!!audio;if(audio){audio.gain.gain.setTargetAtTime(sound?volume*.03:0,audio.ctx.currentTime,.25);if(sound&&audio.ctx.state==='suspended'&&unlocked)audio.ctx.resume().catch(()=>{})}
}
'@
 }
 [IO.File]::WriteAllText((Join-Path $rootPath ('assets/'+$name+'-arena.js')),($head+"`r`n"+$geometry+"`r`n"+$source+"`r`n"+$soundCode+"`r`n"+$footer))
}
$brock=[IO.File]::ReadAllText((Join-Path $rootPath 'prototypes/brock-arena/index.html'))
$brock=$brock.Substring($brock.IndexOf('function rock('),$brock.IndexOf('let audio=null')-$brock.IndexOf('function rock('))
$brock=$brock.Replace('c.fillRect(0,0,W,H);','c.fillRect(-640,0,2560,H);')
$brock+="`r`n"+[IO.File]::ReadAllText((Join-Path $rootPath 'prototypes/brock-arena/dust.js'))
Write-Arena 'brock' 'createBrockArena' "{dust:50,volume:15,light:100,decor:true,crystals:false,quality:'high'}" $brock 'quarry();' 'arena();gymDecor()' 'bench()' 'dust();' '#28271e' '1.6'
$misty=[IO.File]::ReadAllText((Join-Path $rootPath 'prototypes/misty-arena/index.html'))
$mistySource=$misty.Substring($misty.IndexOf('function ring('),$misty.IndexOf('let battlePreview=false')-$misty.IndexOf('function ring('))
$mistySource=$mistySource.Replace("../../assets/pmd/",'assets/pmd/').Replace("!`$('swimmers').checked",'!config.swimmers')
$mistySource=$mistySource.Replace('c.fillRect(0,0,W,H);','c.fillRect(-640,0,2560,H);')
$mistySource=$mistySource.Replace('((d.x*W-time*110*d.z)%(W+100)+W+100)%(W+100)-50','((d.x*2560-time*110*d.z)%2660+2660)%2660-690')
$mistySource=$mistySource.Replace('for(const side of [-1,1])for(let i=0;i<3;i++)waterfall(side*373,-185+i*145,0,1,72,i*.21+(side+1)*.13);','')
$storm=$misty.Substring($misty.IndexOf('function stormFlash(){'),$misty.IndexOf('function draw(ts)')-$misty.IndexOf('function stormFlash(){'))
$storm=$storm.Replace("!`$('lightning').checked",'!config.lightning')
$storm=$storm.Replace('c.fillRect(0,0,W,H);','c.fillRect(-640,0,2560,H);')
$mistySource="const drops=Array.from({length:850},()=>({x:Math.random(),y:Math.random(),v:.55+Math.random(),z:.4+Math.random()*.8}));let nextLightning=8,lightningStart=-100,lightningSide=.5;`r`n"+$mistySource+"`r`n"+$storm
Write-Arena 'misty' 'createMistyArena' "{rain:100,light:100,waves:true,decor:true,quality:'high',rainVolume:5,swimmers:true,lightning:!reducedMotion}" $mistySource 'ocean();seaScenery();islandBase();' 'deck();decorations()' 'swimmingBench()' "drawSwimmingPokemon();rain();if(!state.reduceFx)stormFlash();" '#125269' '.65'
$mewtwo=[IO.File]::ReadAllText((Join-Path $rootPath 'prototypes/mewtwo-arena/mewtwo.js'))
$mewtwoSource=$mewtwo.Substring($mewtwo.IndexOf('function stone('),$mewtwo.IndexOf('function cachedScene(')-$mewtwo.IndexOf('function stone('))
$mewtwoSource+="`r`n"+$mewtwo.Substring($mewtwo.IndexOf('const glowSprite='),$mewtwo.IndexOf('let audio=null')-$mewtwo.IndexOf('const glowSprite='))
$mewtwoSource=$mewtwoSource.Replace('point(-268+i*66,340,14)','point(-240+i*60,292.5,14)')
$cosmos=[IO.File]::ReadAllText((Join-Path $rootPath 'prototypes/mewtwo-arena/cosmos.js'))
$cosmos=$cosmos.Replace('c.fillRect(0,0,W,H);','c.fillRect(-640,0,2560,H);').Replace('const x=random(i+7)*W,y=random(i+411)*H','const x=-640+random(i+7)*2560,y=random(i+411)*H').Replace("config.quality==='high'?420:170","config.quality==='high'?840:340")
$mewtwoSource="function random(seed){const n=Math.sin(seed*127.1+311.7)*43758.5453;return n-Math.floor(n)}`r`n"+$cosmos+"`r`n"+$mewtwoSource
$mewtwoSource+=@'

function integratedCosmos(){
 const logicalWidth=W,viewportWidth=document.getElementById('stage').clientWidth||1280;
 W=viewportWidth;c.save();c.translate(-(viewportWidth-logicalWidth)/2,0);cosmicBackground();c.restore();W=logicalWidth;
}
'@
Write-Arena 'mewtwo' 'createMewtwoArena' "{energy:65,volume:25,light:85,decor:true,aura:true,levitation:true,quality:'high'}" $mewtwoSource 'integratedCosmos();' 'arena();psychicDecor()' 'bench()' "psychicField();c.fillStyle='rgba(5,8,20,'+((100-config.light)/170)+')';c.fillRect(-640,0,2560,H);" '#100e20' '1'
