/* Read local PNG alpha during the build, so file:// never needs canvas readback. */
const fs=require('fs'),vm=require('vm'),zlib=require('zlib');
function alphaPNG(file){
 const png=fs.readFileSync(file);let w,h,type,depth,paletteAlpha=null;const compressed=[];
 for(let at=8;at+12<=png.length;){const length=png.readUInt32BE(at),kind=png.toString('ascii',at+4,at+8),bytes=png.subarray(at+8,at+8+length);at+=length+12;
  if(kind==='IHDR'){w=bytes.readUInt32BE(0);h=bytes.readUInt32BE(4);depth=bytes[8];type=bytes[9];if(bytes[12])throw Error('Interlaced PNG: '+file)}
  if(kind==='IDAT')compressed.push(bytes);if(kind==='tRNS')paletteAlpha=bytes;if(kind==='IEND')break;
 }
 if(depth!==8||![0,2,3,4,6].includes(type))throw Error('Unsupported PNG: '+file);
 const channels={0:1,2:3,3:1,4:2,6:4}[type],stride=w*channels,raw=zlib.inflateSync(Buffer.concat(compressed)),decoded=Buffer.alloc(h*stride),alpha=new Uint8Array(w*h);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c};
 let offset=0;
 for(let y=0;y<h;y++){const filter=raw[offset++];for(let x=0;x<stride;x++){const a=x>=channels?decoded[y*stride+x-channels]:0,b=y?decoded[(y-1)*stride+x]:0,c=y&&x>=channels?decoded[(y-1)*stride+x-channels]:0;
   const predictor=filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):NaN;
   if(!Number.isFinite(predictor))throw Error('Invalid PNG filter');decoded[y*stride+x]=(raw[offset++]+predictor)&255;
  }
  for(let x=0;x<w;x++){const p=y*stride+x*channels;alpha[y*w+x]=type===6?decoded[p+3]:type===4?decoded[p+1]:type===3?(paletteAlpha?.[decoded[p]]??255):255}
 }
 return {w,h,alpha};
}
const box={window:{}};vm.createContext(box);
for(const file of ['assets/move-fx/emerald-catalog.js','assets/move-fx/nine-catalog.js'])vm.runInContext(fs.readFileSync(file,'utf8'),box);
const images=new Map(),result={};
for(const [name,t] of Object.entries(box.window.EMERALD_CATALOG.templates)){
 if(!images.has(t.sheet))images.set(t.sheet,alphaPNG('assets/move-fx/sheets/'+t.sheet+'.png'));
 const image=images.get(t.sheet),offsets=new Set([0,...t.animations.flatMap(a=>a.frames.map(f=>f[0]))]);
 let left=t.w,top=t.h,right=-1,bottom=-1;
 for(const offset of offsets)for(let y=0;y<t.h;y++)for(let x=0;x<t.w;x++){
  const tile=offset+Math.floor(y/8)*(t.w/8)+Math.floor(x/8),sx=tile%(image.w/8)*8+x%8,sy=Math.floor(tile/(image.w/8))*8+y%8;
  if(sy<image.h&&image.alpha[sy*image.w+sx]>16){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
 }
 const span=right<0?Math.max(t.w,t.h):Math.max(right-left+1,bottom-top+1),particle=/Sparkle|Spark|Powder|Spore|Dust|Snow|Smoke|Particle/i.test(name+' '+t.callback);
 result[name]={correction:Math.min(particle?1.5:4,Math.max(1,Math.max(t.w,t.h)/Math.max(1,span))),cx:right<0?t.w/2:(left+right+1)/2,cy:bottom<0?t.h/2:(top+bottom+1)/2};
}
fs.writeFileSync('assets/move-fx/visible-bounds.js','/* Generated from local sprite alpha; no browser pixel reads required. */\nwindow.EMERALD_VISIBLE_BOUNDS='+JSON.stringify(result)+';\n');
console.log(Object.keys(result).length+' effect bounds generated');

// PMD preview foot anchors use the same build-time alpha reader.
vm.runInContext(fs.readFileSync('assets/dex/pmd-local.js','utf8'),box);
const ground={};
for(const data of Object.values(box.window.DEX_PMD_LOCAL))for(const info of [data,data.attack].filter(Boolean)){
 if(ground[info.sheet])continue;const image=alphaPNG(info.sheet),row=image.h>=info.h*8?2:0,rects=[];
 for(let frame=0;frame<Math.floor(image.w/info.w);frame++){let left=info.w,top=info.h,right=-1,bottom=-1;
  for(let y=0;y<info.h;y++)for(let x=0;x<info.w;x++)if(image.alpha[(row*info.h+y)*image.w+frame*info.w+x]>16){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
  rects.push(right<0?null:{x:left,y:top,w:right-left+1,h:bottom-top+1});
 }
 ground[info.sheet]={row,rects};
}
fs.writeFileSync('assets/dex/frame-bounds.js','/* Generated foot anchors for local PMD previews. */\nwindow.DEX_FRAME_BOUNDS='+JSON.stringify(ground)+';\n');
console.log(Object.keys(ground).length+' PMD pose bounds generated');
