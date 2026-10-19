/* Read painted lava positions for runtime effects; original artwork is unchanged. */
const fs=require('fs'),path=require('path');let sharp;try{sharp=require('sharp')}catch{sharp=require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')}
const root=path.resolve(__dirname,'../prototypes/moltres-arena/assets');
(async()=>{const out={};for(const [key,file]of Object.entries({ground:'caldera-v1.png',outcrop:'basalt-garden-v1.png',landmark:'lava-perch-v1.png',brazier:'basalt-brazier-v1.png',obsidian:'obsidian-geode-v1.png',vent:'sulfur-vent-v1.png'})){
 const {data,info}=await sharp(path.join(root,file)).resize({width:256}).ensureAlpha().raw().toBuffer({resolveWithObject:true}),heat=Buffer.alloc(info.width*info.height);
 for(let i=0;i<heat.length;i++){const r=data[i*4],g=data[i*4+1],b=data[i*4+2],a=data[i*4+3];heat[i]=a>100&&r>175&&g>60&&r>g*1.18&&g>b*1.45?Math.round(Math.min(1,(r-170)/65,(g-b)/85)*a):0}
 out[key]={w:info.width,h:info.height,heat:heat.toString('base64')};
}fs.writeFileSync(path.join(root,'heat-data.js'),'window.MOLTRES_HEAT_DATA='+JSON.stringify(out)+';\n');console.log('Prepared painted lava coordinates for '+Object.keys(out).length+' assets.');})().catch(e=>{console.error(e);process.exitCode=1});
