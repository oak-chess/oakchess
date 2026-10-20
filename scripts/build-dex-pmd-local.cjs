const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/dex/pmd'),result={};
const value=(xml,key)=>xml.match(new RegExp('<'+key+'>([^<]+)</'+key+'>'))?.[1];
for(const id of fs.readdirSync(dir)){
 const folder=path.join(dir,id),sourceFile=path.join(folder,'source.json');if(!fs.existsSync(sourceFile))continue;
 const source=JSON.parse(fs.readFileSync(sourceFile,'utf8').replace(/^\uFEFF/,'')),xml=fs.readFileSync(path.join(folder,'AnimData.xml'),'utf8');
 const nodes=[...xml.matchAll(/<Anim>([\s\S]*?)<\/Anim>/g)].map(m=>m[1]);let anim=nodes.find(n=>value(n,'Name')==='Idle')||nodes.find(n=>value(n,'Name')==='Walk');if(!anim)continue;
 const name=value(anim,'Name');let guard=0;while(value(anim,'CopyOf')&&guard++<8){const copy=nodes.find(n=>value(n,'Name')===value(anim,'CopyOf'));if(!copy)break;anim=copy}
 const w=+value(anim,'FrameWidth'),h=+value(anim,'FrameHeight'),sheet='assets/dex/pmd/'+id+'/'+value(anim,'Name')+'-Anim.png';
 if(w&&h&&fs.existsSync(path.join(root,sheet)))result[source.path]={w,h,name,durations:[...anim.matchAll(/<Duration>(\d+)<\/Duration>/g)].map(m=>+m[1]),sheet};
 const attackSource=path.join(folder,'attack.json');
 if(result[source.path]&&fs.existsSync(attackSource)){
  const info=JSON.parse(fs.readFileSync(attackSource,'utf8').replace(/^\uFEFF/,'')),attack=nodes.find(n=>value(n,'Name')===info.name),attackSheet='assets/dex/pmd/'+id+'/'+info.name+'-Anim.png';
  if(attack&&fs.existsSync(path.join(root,attackSheet)))result[source.path].attack={w:+value(attack,'FrameWidth'),h:+value(attack,'FrameHeight'),durations:[...attack.matchAll(/<Duration>(\d+)<\/Duration>/g)].map(m=>+m[1]),sheet:attackSheet};
 }
}
fs.writeFileSync(path.join(root,'assets/dex/pmd-local.js'),'window.DEX_PMD_LOCAL='+JSON.stringify(result)+';\n');
console.log(Object.keys(result).length+' prévias PMD locais');
