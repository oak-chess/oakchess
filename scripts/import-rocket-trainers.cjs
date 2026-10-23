// Decode original Nitro TEX0 4bpp textures into native 32x32 pose strips.
// Inputs: prototypes/trainer-profile/sources/hgss-rocket from pret/pokeheartgold.
const fs=require('fs'),zlib=require('zlib'),path=require('path');
const root=path.resolve(__dirname,'..');
function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
function chunk(type,data){const t=Buffer.from(type),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([t,data])),data.length+8);return out}
function png(w,h,pixels){const header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=8;header[9]=6;const rows=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++)pixels.copy(rows,y*(w*4+1)+1,y*w*4,(y+1)*w*4);return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(rows)),chunk('IEND',Buffer.alloc(0))])}
for(const [id,name] of [[175,'ariana'],[176,'archer'],[244,'petrel'],[245,'proton']]){
 const b=fs.readFileSync(path.join(root,'prototypes/trainer-profile/sources/hgss-rocket/model'+id+'.nsbtx'));
 const base=b.readUInt32LE(16),dict=base+b.readUInt16LE(base+14),entry=dict+b.readUInt16LE(dict+6),count=b[dict+1],stride=b.readUInt16LE(entry),names=entry+b.readUInt16LE(entry+2);
 const data=base+b.readUInt32LE(base+20),palette=base+b.readUInt32LE(base+56),pixels=Buffer.alloc(count*32*32*4);
 const poses=[];
 for(let i=0;i<count;i++){
  const param=b.readUInt32LE(entry+4+i*stride),format=(param>>>26)&7,w=8<<((param>>>20)&7),h=8<<((param>>>23)&7);
  if(format!==3||w!==32||h!==32)throw Error('Unexpected texture format for '+name);
  const label=b.toString('ascii',names+i*16,names+(i+1)*16).replace(/\0.*$/,'');
  poses.push({label,param,source:data+(param&0xffff)*8});
 }
 poses.sort((a,b)=>Number(a.label.split('.').pop())-Number(b.label.split('.').pop()));
 poses.forEach((pose,i)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){
  const offset=y*32+x,packed=b[pose.source+(offset>>1)],index=(packed>>((offset&1)*4))&15,color=b.readUInt16LE(palette+index*2),dest=(y*count*32+i*32+x)*4;
  pixels[dest]=Math.round((color&31)*255/31);pixels[dest+1]=Math.round(((color>>5)&31)*255/31);pixels[dest+2]=Math.round(((color>>10)&31)*255/31);pixels[dest+3]=index===0&&(pose.param&(1<<29))?0:255;
 }});
 const output=png(count*32,32,pixels);
 for(const folder of ['assets/trainer-profile/sprites','prototypes/trainer-profile/sprites'])fs.writeFileSync(path.join(root,folder,name+'_normal.png'),output);
 console.log(name+': '+count+' original poses');
}
