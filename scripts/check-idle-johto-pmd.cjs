const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'assets/pmd'),context={window:{}};
for(const file of ['anim-data.js','bounds-data.js'])vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const source=JSON.parse(fs.readFileSync(path.join(base,'johto-source.json'),'utf8'));
const tag=(xml,n)=>xml.match(new RegExp('<'+n+'>([^<]+)</'+n+'>'))?.[1];
let variants=0,sheets=0,directions=new Map(),legacy=0;
for(const key of Object.keys(context.window.PMD_ANIM_DATA))if(+key.replace('s','')<152||+key.replace('s','')>251)legacy++;
for(let id=152;id<=251;id++)for(const shiny of [false,true]){
 const n=String(id).padStart(4,'0'),key=n+(shiny?'s':''),dir=n+(shiny?'/0000/0001':'');
 const xml=context.window.PMD_ANIM_DATA[key];assert(xml,'Missing runtime XML '+key);
 assert.equal(xml,fs.readFileSync(path.join(base,'sprite',dir,'AnimData.xml'),'utf8'),'Embedded/local XML mismatch '+key);
 assert(fs.existsSync(path.join(base,'sprite',dir,'credits.txt')),'Missing credits '+key);
 const anims=new Map([...xml.matchAll(/<Anim>([\s\S]*?)<\/Anim>/g)].map(m=>[tag(m[1],'Name'),m[1]]));
 function resolve(name){const seen=new Set();let anim=anims.get(name);while(anim&&tag(anim,'CopyOf')){assert(!seen.has(name),'Cyclic animation '+key);seen.add(name);name=tag(anim,'CopyOf');anim=anims.get(name)}return anim}
 assert(resolve('Idle')||resolve('Walk'),'No idle/walk '+key);
 for(const [name,anim]of anims){if(tag(anim,'CopyOf')){assert(resolve(name),'Unresolved alias '+key+' '+name);continue}
  const fw=+tag(anim,'FrameWidth'),fh=+tag(anim,'FrameHeight'),frames=[...anim.matchAll(/<Duration>(\d+)<\/Duration>/g)].length;
  const relative=dir+'/'+name+'-Anim.png',file=path.join(base,'sprite',relative);assert(fs.existsSync(file),'Missing sheet '+relative);
  const data=fs.readFileSync(file),w=data.readUInt32BE(16),h=data.readUInt32BE(20);assert.equal(w,fw*frames,'Frame count '+relative);assert.equal(h%fh,0,'Rows '+relative);
  const rows=h/fh;assert([1,8].includes(rows),'Unsupported direction count '+relative+': '+rows);directions.set(rows,(directions.get(rows)||0)+1);
  const bound=context.window.PMD_BOUNDS_DATA[relative];assert(bound,'Missing prepared bounds '+relative);assert.equal(bound.fw,fw);assert.equal(bound.fh,fh);
  sheets++;
 }
 variants++;
}
assert.equal(variants,200);assert.equal(sheets,source.sheets);assert(legacy>0,'Other species disappeared');
console.log(JSON.stringify({species:100,variants,sheets,rows:Object.fromEntries(directions),retainedOtherVariants:legacy,revision:source.revision}));
