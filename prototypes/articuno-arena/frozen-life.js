/* Dense illustrated borders and repeating organic frost growth. Prototype only. */
(()=>{
 const previousDecor=decor,previousAtmosphere=atmosphere;
 const shore=new Image(),landmark=new Image();let shoreReady=false,landmarkReady=false,density=100,iceOn=true;
 shore.onload=()=>{shoreReady=true;sceneKey=''};shore.src='assets/icy-shore-v1.png';
 landmark.onload=()=>{landmarkReady=true;sceneKey=''};landmark.src='assets/frozen-waterfall-v1.png';
 const panel=document.createElement('div');panel.innerHTML='<label class="row">Gelo se formando <input id="iceGrowth" type="checkbox" checked></label><label class="row">Decoração extra <input id="iceDensity" type="range" min="20" max="100" step="10" value="100"></label>';
 document.querySelector('.controls h2').after(panel);
 panel.querySelector('#iceGrowth').onchange=e=>iceOn=e.target.checked;
 panel.querySelector('#iceDensity').oninput=e=>{density=Number(e.target.value);sceneKey=''};
 $('reset').addEventListener('click',()=>{density=100;iceOn=true;panel.querySelector('#iceGrowth').checked=true;panel.querySelector('#iceDensity').value=100;sceneKey=''});
 // Shores connect the clusters; only the two main landmarks repeat at a distance.
 const objects=[
  {kind:'landmark',x:-562,y:-203,z:-24,w:325,flip:1},
  {kind:'landmark',x:607,y:322,z:-24,w:236,flip:-1},
  {kind:'shore',x:409,y:28,z:-18,w:190,flip:-1},
  {kind:'shore',x:-389,y:340,z:-19,w:181,flip:1},
  {kind:'shore',x:238,y:-360,z:-12,w:163,flip:-1},
  {kind:'shore',x:-451,y:-134,z:-20,w:152,flip:1},
  {kind:'shore',x:-389,y:72,z:-17,w:120,flip:-1},
  {kind:'shore',x:-473,y:272,z:-20,w:161,flip:1},
  {kind:'shore',x:464,y:-177,z:-21,w:153,flip:-1},
  {kind:'shore',x:403,y:143,z:-17,w:127,flip:1},
  {kind:'shore',x:489,y:300,z:-20,w:157,flip:-1},
  {kind:'shore',x:-284,y:-337,z:15,w:115,flip:1},
  {kind:'shore',x:308,y:-312,z:15,w:94,flip:-1},
  {kind:'shore',x:-305,y:302,z:15,w:89,flip:-1}
 ];
 objects.sort((a,b)=>a.y-b.y);
 function snowGround(){
  // Broad linked snowbanks give the decorations common ground instead of floating bases.
  const banks=[[-464,-204,183,118],[-408,-34,100,175],[-447,220,155,143],[460,-225,148,122],[414,32,98,172],[466,234,157,144],[-247,-345,164,61],[234,-344,145,60],[-372,331,108,58]];
  c.save();c.beginPath();c.rect(0,0,W,H);
  const inner=roundedPoints(-291,-278,13,582,556,44).map(p=>point(...p));inner.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.clip('evenodd');
  banks.forEach(([x,y,rx,ry],index)=>{
   const pts=Array.from({length:26},(_,i)=>{const a=i/26*Math.PI*2,k=.87+random(index*53+i)*.2;return point(x+Math.cos(a)*rx*k,y+Math.sin(a)*ry*k,-20)});
   const center=point(x,y,-20),edge=point(x,y-ry,-20),g=c.createLinearGradient(edge.x,edge.y,center.x,center.y+ry*center.s*.6);g.addColorStop(0,'#c7e6eecc');g.addColorStop(.55,'#91c2d3cc');g.addColorStop(1,'#447b98aa');
   c.beginPath();const last=pts[pts.length-1];c.moveTo((last.x+pts[0].x)/2,(last.y+pts[0].y)/2);pts.forEach((p,i)=>{const n=pts[(i+1)%pts.length];c.quadraticCurveTo(p.x,p.y,(p.x+n.x)/2,(p.y+n.y)/2)});c.closePath();c.fillStyle=g;c.fill();
   c.save();c.clip();for(let j=0;j<26;j++){const q=point(x+(random(j+index*31)-.5)*rx*2,y+(random(j+index*29+30)-.5)*ry*2,-19);c.fillStyle=j%2?'#ecfbff30':'#274f6b15';c.beginPath();c.ellipse(q.x,q.y,(9+random(j)*20)*q.s,2*q.s,-.15,0,Math.PI*2);c.fill()}c.restore();
  });c.restore();
 }
 decor=function(){if(config.decor)snowGround();previousDecor();if(!config.decor)return;
  objects.forEach((o,i)=>{if(random(i+292)*100>density)return;const img=o.kind==='shore'?shore:landmark;if(o.kind==='shore'?!shoreReady:!landmarkReady)return;
   const p=point(o.x,o.y,o.z),w=o.w*p.s,h=w*img.naturalHeight/img.naturalWidth;c.save();c.translate(p.x,p.y);c.scale(o.flip,1);c.drawImage(img,-w/2,-h*.87,w,h);c.restore();
  });
 };
 // Paint fern-like, branching ice veins once; reveal them as frost spreads.
 function frostTexture(seed){
  const cv=document.createElement('canvas');cv.width=cv.height=192;const g=cv.getContext('2d');g.translate(96,96);
  const halo=g.createRadialGradient(0,0,0,0,0,82);halo.addColorStop(0,'#d7faff38');halo.addColorStop(.7,'#a9eaff14');halo.addColorStop(1,'#a9eaff00');g.fillStyle=halo;g.fillRect(-96,-96,192,192);
  g.lineCap='round';g.lineJoin='round';
  for(let arm=0;arm<9;arm++){
   const angle=arm*Math.PI*2/9+random(seed+arm)*.18,length=45+random(seed+arm+30)*37;
   g.save();g.rotate(angle);g.strokeStyle='#c6f3ff';g.lineWidth=.9;g.beginPath();g.moveTo(0,0);g.bezierCurveTo(12,3,length*.65,-5,length,2);g.stroke();
   for(let j=1;j<8;j++){
    const x=length*j/9,span=(1-j/10)*(9+random(seed+j+arm)*10);
    for(const sign of [-1,1]){g.globalAlpha=.4+random(seed+j*7+arm)*.5;g.strokeStyle=j%2?'#e1fbff':'#8cdaef';g.beginPath();g.moveTo(x-5,0);g.quadraticCurveTo(x+span*.25,sign*span*.35,x+span*.65,sign*span);g.stroke();g.lineWidth=.55;g.beginPath();g.moveTo(x+span*.25,sign*span*.48);g.lineTo(x+span*.65+3,sign*span*.47);g.stroke();g.lineWidth=.9}
   }g.restore();
  }return cv;
 }
 const patches=[{x:-340,y:-80,z:18,size:43,seed:2},{x:349,y:173,z:18,size:46,seed:7},{x:-450,y:245,z:-17,size:68,seed:13},{x:430,y:14,z:-17,size:73,seed:19},{x:224,y:-338,z:18,size:57,seed:23}];
 for(const p of patches)p.texture=frostTexture(p.seed*29+17);
 function growth(){if(!iceOn||!config.elements||!config.decor)return;
  const t=reducedMotion?0:time,low=config.quality==='low';
  patches.forEach((patch,i)=>{if(low&&i%2)return;if(random(i+292)*100>density)return;
   const phase=(t+i*2.31)%24;
   const progress=reducedMotion?1:phase<11?phase/11:phase<19?1:Math.max(0,(24-phase)/5);
   if(progress<.02)return;const p=point(patch.x,patch.y,patch.z),radius=patch.size*p.s;
   c.save();c.translate(p.x,p.y);c.scale(1,.53);c.beginPath();c.arc(0,0,radius*progress,0,Math.PI*2);c.clip();c.globalAlpha=.28+progress*.6;
   c.drawImage(patch.texture,-radius,-radius,radius*2,radius*2);c.restore();
   if(!reducedMotion&&phase<11){
    for(let j=0;j<4;j++){const a=j*1.57+i*.7+t*.12,x=p.x+Math.cos(a)*radius*progress,y=p.y+Math.sin(a)*radius*.53*progress;
     c.save();c.globalAlpha=.25+Math.sin(t*2+j)*.15;c.fillStyle='#dcfbff';c.beginPath();c.ellipse(x,y,1.4*p.s,1.4*p.s,0,0,Math.PI*2);c.fill();c.restore()}
   }
  });
  if(!shoreReady)return;
  // Gradual bottom-up growth of illustrated ice shelves, offset across the rim.
  for(let i=0;i<2;i++){
   const p=point(i?350:-349,i?170:-92,18),cycle=reducedMotion?12:(t+i*3.7)%28;
   const grow=reducedMotion?1:cycle<12?cycle/12:cycle<23?1:(28-cycle)/5;
   if(grow<=0)continue;const w=77*p.s,h=w*shore.naturalHeight/shore.naturalWidth,base=p.y+h*.12;
   c.save();c.beginPath();c.rect(p.x-w/2,base-h*grow,w,h*grow);c.clip();c.globalAlpha=.35+.65*grow;c.drawImage(shore,p.x-w/2,base-h,w,h);c.restore();
  }
 }
 atmosphere=function(){previousAtmosphere();growth()};
})();
