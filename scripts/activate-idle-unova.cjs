/* One-time promotion after isolated integration validation. Does not read browser saves. */
const fs=require('fs'),path=require('path');
const read=p=>fs.readFileSync(p,'utf8'),file='modes/idle/index.html',old=read(file),preview='prototypes/unova-review/runtime/';
if(old.includes('/* unova-roster:start */'))throw Error('Unova already integrated; do not repeat promotion');
const art=JSON.parse(read('modes/idle/unova/ART-SOURCES.json'));
if(art.gyms.length!==8||art.events.length!==13)throw Error('Incomplete environment set');
for(const entry of [...art.gyms,...art.events])if(!fs.existsSync(entry.output))throw Error('Missing art '+entry.key);
const modules=['idle','gacha','field-notes','special-crystals','systems','screen','party','life-ui','life','arena-seal'];
const originalFiles=[file,...modules.map(name=>'modes/idle/'+name+'.js')];
for(const source of originalFiles){const backup=path.join('tmp/unova-before-integration',source);fs.mkdirSync(path.dirname(backup),{recursive:true});if(!fs.existsSync(backup))fs.copyFileSync(source,backup)}
const fixture='scripts/fixtures/idle-pre-unova-lines.json';if(!fs.existsSync(fixture))fs.writeFileSync(fixture,JSON.stringify([...old.matchAll(/^ln\(\d+,(\[[^\n]+?\]),/gm)].map(m=>JSON.parse(m[1])),null,2)+'\n');
let html=read('prototypes/unova-review/real.html');
for(const name of modules){fs.copyFileSync(preview+name+'.js','modes/idle/'+name+'.js');html=html.replaceAll(preview+name+'.js','modes/idle/'+name+'.js')}
for(const name of ['metadata','activate-moves']){fs.copyFileSync(preview+name+'.js','modes/idle/unova/'+name+'.js');html=html.replaceAll(preview+name+'.js','modes/idle/unova/'+name+'.js')}
html=html.replace('<script src="'+preview+'seed.js"></script>','').replace("prefix='oakchess-unova-integration:'","prefix='oakchess-idle:'").replace('<title>OakChess · Unova em integração</title>','<title>OakChess · Jornada Idle</title>').replaceAll('unova-preview-1','unova-1');
html=html.replace(/<div style="position:fixed;bottom:3px;left:50%;[^"]+">UNOVA · TESTE ISOLADO · CENÁRIOS PROVISÓRIOS<\/div>/,'');
if(html.includes(preview)||html.includes('CENÁRIOS PROVISÓRIOS'))throw Error('Preview-only reference left behind');
fs.writeFileSync(file,html);
console.log('Integrated Unova into the local Idle: 156 species, eight destinations, 13 events and 21 environments. Browser save prefix and old line indices preserved. Nothing published.');
