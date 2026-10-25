/* Install a validated PMDCollab snapshot, merging rather than replacing other species. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const hoenn=process.argv.includes('--hoenn'),region=hoenn?'hoenn':'johto',first=hoenn?252:152,last=hoenn?386:251;
const root=path.resolve(__dirname,'..'),stage=path.join(root,'tmp/'+region+'-pmd-source'),dest=path.join(root,'assets/pmd');
const manifest=JSON.parse(fs.readFileSync(path.join(stage,'manifest.json'),'utf8'));
assert.equal(manifest.variants.length,hoenn?282:200);assert.deepEqual(JSON.parse(fs.readFileSync(path.join(stage,'errors.json'),'utf8')),[]);
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dest,'anim-data.js'),'utf8'),context);
const data=context.window.PMD_ANIM_DATA,normalize=s=>s.replace(/<@!?(\d+)>/g,'$1').trim();
const creditsText=fs.readFileSync(path.join(stage,'credit_names.txt'),'utf8');
const authors=new Map(creditsText.split(/\r?\n/).slice(1).filter(Boolean).map(line=>{const [name,id]=line.split('\t');return [normalize(id||name),name]}));
const bySpecies=new Map(),files=[];
for(const variant of manifest.variants){
 assert(/^\d{4}(?:\/\d{4}){0,2}$/.test(variant)&&+variant.slice(0,4)>=first&&+variant.slice(0,4)<=last,'Unexpected target '+variant);
 const xmlPath='sprite/'+variant+'/AnimData.xml',xml=fs.readFileSync(path.join(stage,xmlPath),'utf8');
 assert(xml.includes('<AnimData>'),'Invalid XML '+variant);
 const creditPath='sprite/'+variant+'/credits.txt',credits=fs.readFileSync(path.join(stage,creditPath),'utf8');
 const id=Number(variant.slice(0,4));if(!bySpecies.has(id))bySpecies.set(id,new Set());
 for(const line of credits.split(/\r?\n/)){const author=line.split('\t')[1];if(author)bySpecies.get(id).add(authors.get(normalize(author))||author)}
 const key=variant.replace('/0000/0001','s').replace(/\/(000[123])\/0001$/,'/$1s');data[key]=xml;
 files.push(xmlPath,creditPath);
}
files.push(...manifest.sheets);
// Validate every source before the first install write.
for(const file of files)assert(fs.existsSync(path.join(stage,file)),'Missing staged file '+file);
for(const file of files){const target=path.join(dest,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(stage,file),target)}
fs.writeFileSync(path.join(dest,'anim-data.js'),'window.PMD_ANIM_DATA='+JSON.stringify(data)+';\n');
fs.writeFileSync(path.join(dest,region+'-credit-names.txt'),creditsText);
fs.writeFileSync(path.join(dest,region+'-source.json'),JSON.stringify({...manifest.source,species:[first,last],variants:manifest.variants,sheets:manifest.sheets.length,license:'CC BY-NC 4.0',credits:'CREDITS.md'},null,2)+'\n');
const catalogContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/dex/catalog.js'),'utf8'),catalogContext);
const species=new Map(catalogContext.window.DEX_EXPANSION.map(s=>[s.id,s.name]));
const old=fs.readFileSync(path.join(dest,'CREDITS.md'),'utf8');
const existing=old.split(/\r?\n/).filter(line=>{const m=line.match(/^\| (\d+) \|/);return !m||+m[1]<first||+m[1]>last});
const marker='<!-- '+region+'-pmd-credits:start -->',end='<!-- '+region+'-pmd-credits:end -->';
let text=existing.join('\n').replace(new RegExp(marker+'[\\s\\S]*?'+end+'\\n?'),'').trimEnd();
text+='\n\n'+marker+'\n## '+(hoenn?'Hoenn':'Johto')+' — versões normal, shiny e formas incluídas\n\nFonte fixada na revisão `'+manifest.source.revision+'` do SpriteCollab. Históricos de autoria junto dos sprites; nomes em `'+region+'-credit-names.txt`. Sprites mantidos sem redesenho.\n\n| Nº | Pokémon | Autores registrados na fonte |\n|---:|---|---|\n';
for(const [id,names]of [...bySpecies].sort((a,b)=>a[0]-b[0]))text+='| '+id+' | '+species.get(id)+' | '+[...names].sort().join(', ')+' |\n';
text+=end+'\n';fs.writeFileSync(path.join(dest,'CREDITS.md'),text);
const htmlFile=path.join(root,'modes/idle/index.html');let html=fs.readFileSync(htmlFile,'utf8');
for(const file of ['anim-data','bounds-data'])html=html.replace(new RegExp('src="assets/pmd/'+file+'\\.js(?:\\?[^\"]*)?"'),'src="assets/pmd/'+file+'.js?v='+region+'-pmd-1"');
fs.writeFileSync(htmlFile,html);
console.log('Installed '+bySpecies.size+' species / '+manifest.variants.length+' variants / '+manifest.sheets.length+' sheets.');
