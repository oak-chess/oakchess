/* Animate only the molten regions already painted into the artwork. */
(()=>{
 const back=document.createElement('canvas'),front=document.createElement('canvas'),materials={};let enabled=true,pulsing=true;
 const control=document.createElement('div');control.innerHTML='<label class="row">Lava em movimento <input type="checkbox" data-lava="flow" checked></label><label class="row">Pulsação da lava <input type="checkbox" data-lava="pulse" checked></label>';
 document.querySelector('.controls h2').after(control);
 control.querySelector('[data-lava="flow"]').onchange=e=>enabled=e.target.checked;
 control.querySelector('[data-lava="pulse"]').onchange=e=>pulsing=e.target.checked;
 $('reset').addEventListener('click',()=>{enabled=pulsing=true;control.querySelectorAll('input').forEach(el=>el.checked=true)});
 function material(key,t){
  const im=window.VOLCANO_LAVA_ART?.assets[key],data=window.MOLTRES_HEAT_DATA?.[key];if(!data||!im?.complete||!im.naturalWidth)return null;
  let mat=materials[key];if(!mat){
   const surface=document.createElement('canvas'),mask=document.createElement('canvas');surface.width=mask.width=data.w;surface.height=mask.height=data.h;
   const bytes=Uint8Array.from(atob(data.heat),ch=>ch.charCodeAt(0)),image=mask.getContext('2d').createImageData(data.w,data.h),active=[];
   for(let i=0;i<bytes.length;i++)if(bytes[i]){active.push(i);image.data[i*4]=image.data[i*4+1]=image.data[i*4+2]=255}
   mat=materials[key]={surface,mask,bytes,image,active,stamp:null};
  }
  const stamp=[Math.floor(t*(config.quality==='low'?8:16)),enabled,pulsing,reducedMotion].join(':');if(mat.stamp===stamp)return mat.surface;mat.stamp=stamp;
  const ctx=mat.surface.getContext('2d');ctx.clearRect(0,0,data.w,data.h);ctx.globalCompositeOperation='source-over';
  // Gently advect painted highlights inside the original fissure silhouette.
  for(let row=0;row<data.h;row+=4){
   const move=enabled&&!reducedMotion,dx=move?Math.sin(t*.8+row*.08)*1.1:0,dy=move?Math.sin(t*.65-row*.035)*.7:0;
   const sourceY=Math.max(0,Math.min(data.h-4,row+dy));
   ctx.drawImage(im,0,sourceY/data.h*im.naturalHeight,im.naturalWidth,Math.min(4,data.h-row)/data.h*im.naturalHeight,dx,row,data.w,Math.min(4,data.h-row));
  }
  // Uneven pulses travel through individual veins rather than flashing the entire scene.
  for(const i of mat.active){const x=i%data.w,y=Math.floor(i/data.w),wave=pulsing&&!reducedMotion?.52+.48*Math.sin(t*(.85+key.length*.04)+y*.07+x*.045):.6;mat.image.data[i*4+3]=Math.round(mat.bytes[i]*(.36+wave*.64))}
  const mg=mat.mask.getContext('2d');mg.putImageData(mat.image,0,0);ctx.globalCompositeOperation='destination-in';ctx.drawImage(mat.mask,0,0);ctx.globalCompositeOperation='source-over';return mat.surface;
 }
 function groundGlow(){if(!config.elements||config.energy<=0)return;const art=window.VOLCANO_LAVA_ART,rect=art?.groundRect();if(!rect)return;const texture=material('ground',reducedMotion?0:time);if(!texture)return;
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.23*config.energy/100;c.drawImage(texture,rect.x,rect.y,rect.w,rect.h);c.restore();
 }
 function decorationGlow(){if(!config.elements||!config.decor||config.energy<=0)return;const art=window.VOLCANO_LAVA_ART;if(!art)return;
  const t=reducedMotion?0:time;
  for(const [kind,x,y,width,flip,z]of art.groups){const texture=material(kind,t),im=art.assets[kind];if(!texture||!im?.naturalWidth)continue;const p=point(x,y,z),w=width*p.s,h=w*im.naturalHeight/im.naturalWidth;c.save();c.translate(p.x,p.y);c.scale(flip,1);c.globalCompositeOperation='lighter';c.globalAlpha=.23*config.energy/100;c.drawImage(texture,-w/2,-h*.87,w,h);c.restore()}
  // Match the same painted ledge that Moltres lands on.
  const tex=material('landmark',t),im=art.assets.landmark;if(tex&&im?.naturalWidth){const p=point(0,-314,16),w=186*p.s,h=w*im.naturalHeight/im.naturalWidth;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.2*config.energy/100;c.drawImage(tex,p.x-w/2,p.y-h*.8,w,h);c.restore()}
 }
 cachedScene=function(){
  const key=[W,H,dpr,zoom,pan,config.decor,config.quality,Math.round(gridSoftness*10)].join('|');
  if(key!==sceneKey){const main=c;
   for(const layer of [back,front]){if(layer.width!==canvas.width)layer.width=canvas.width;if(layer.height!==canvas.height)layer.height=canvas.height;const ctx=layer.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H)}
   c=back.getContext('2d');background();arena();c=front.getContext('2d');decor();bench();c=main;sceneKey=key;
  }
  c.drawImage(back,0,0,W,H);if(enabled||pulsing)groundGlow();c.drawImage(front,0,0,W,H);if(enabled||pulsing)decorationGlow();
 };
})();
