/* Build sprite alpha bounds once so file:// and hosted games share the same anchors. */
const fs=require('fs'),path=require('path'),vm=require('vm');
let sharp;try{sharp=require('sharp')}catch{sharp=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')}
const root=path.resolve(__dirname,'..'),base=path.join(root,'assets/pmd/sprite'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/pmd/anim-data.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(root,'modes/idle/mega/pmd-data.js'),'utf8'),context);const jobs=[],result={};
for(const [key,xml] of Object.entries(context.window.PMD_ANIM_DATA)){if(!['0006/0001','0006/0001s','0094/0001','0094/0001s','0303/0001','0303/0001s'].includes(key))continue;
 const bare=key.endsWith('s')?key.slice(0,-1):key;const dir=key.endsWith('s')?bare+(bare.includes('/')?'/0001/':'/0000/0001/'):bare+'/';
 for(const match of xml.matchAll(/<Anim>([\s\S]*?)<\/Anim>/g)){
  const get=tag=>match[1].match(new RegExp('<'+tag+'>([^<]+)</'+tag+'>'))?.[1];
  const fw=+get('FrameWidth'),fh=+get('FrameHeight'),name=get('Name'),file=dir+name+'-Anim.png';
  if(fw&&fh&&fs.existsSync(path.join(base,file)))jobs.push({file,fw,fh});
 }
}
async function worker(){while(jobs.length){const {file,fw,fh}=jobs.pop();
 const {data,info}=await sharp(path.join(base,file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const nr=Math.max(1,Math.round(info.height/fh)),nf=Math.max(1,Math.round(info.width/fw));
 let mnx=fw,mny=fh,mxx=-1,mxy=-1;const rb=Array(nr).fill(-1),rt=Array(nr).fill(fh),fb=Array.from({length:nr},()=>Array(nf).fill(-1));
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>8){
  const cx=x%fw,cy=y%fh,r=Math.min(nr-1,Math.floor(y/fh)),f=Math.floor(x/fw);
  mnx=Math.min(mnx,cx);mxx=Math.max(mxx,cx);mny=Math.min(mny,cy);mxy=Math.max(mxy,cy);rb[r]=Math.max(rb[r],cy);rt[r]=Math.min(rt[r],cy);fb[r][f]=Math.max(fb[r][f],cy);
 }
 if(mxx<0)continue;
 for(let r=0;r<nr;r++)if(rb[r]<0){rb[r]=mxy;rt[r]=mny}
 result[file]={fw,fh,mnx,mny,mxx,mxy,rb,rt,fb};
}}
Promise.all(Array.from({length:8},worker)).then(()=>{
 const sorted=Object.fromEntries(Object.entries(result).sort(([a],[b])=>a.localeCompare(b)));
 fs.writeFileSync(path.join(root,'modes/idle/mega/bounds-data.js'),'Object.assign(window.PMD_BOUNDS_DATA,'+JSON.stringify(sorted)+');\n');
 console.log('Prepared alpha bounds for '+Object.keys(sorted).length+' sprite sheets.');
}).catch(e=>{console.error(e);process.exitCode=1});
