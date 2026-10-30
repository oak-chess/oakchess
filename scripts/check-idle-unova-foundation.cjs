const fs=require('fs'),assert=require('node:assert/strict'),crypto=require('crypto');
const root='modes/idle/unova/',list=JSON.parse(fs.readFileSync(root+'catalog.json','utf8')),report=JSON.parse(fs.readFileSync(root+'AUDIT.json','utf8')),manifest=JSON.parse(fs.readFileSync(root+'source/manifest.json','utf8'));
assert.equal(list.length,156);assert.equal(new Set(list.map(s=>s.id)).size,156);
for(let id=494;id<=649;id++)assert(list.some(s=>s.id===id));
const byId=new Map(list.map(s=>[s.id,s]));
assert.equal(list.filter(s=>s.legendary||s.mythical).length,13);
assert.equal(list.filter(s=>!s.legendary&&!s.mythical).length,143);
for(const s of list){assert(s.name);assert(s.types.length>=1&&s.types.length<=2);assert(s.learnset.moves.length);if(s.from)assert(byId.has(s.from));const visited=new Set();let current=s;while(current.from){assert(!visited.has(current.id),'Evolution cycle');visited.add(current.id);current=byId.get(current.from)}for(const move of s.learnset.moves)assert(move.length===3&&move.every(Number.isFinite));if(s.sprites.normalReady)assert(s.sprites.normalAnimations.includes('Walk')&&s.sprites.normalAnimations.includes('Idle'))}
const rule=id=>byId.get(id).referenceEvolutions.find(r=>r.is_default==='1'&&+r.evolution_trigger_id<=3);
for(const [id,level]of [[496,17],[497,36],[499,17],[500,36],[502,17],[503,36],[634,50],[635,64],[637,59],[628,54],[630,54]])assert.equal(+rule(id).minimum_level,level,'Evolution level '+id);
assert.equal(+rule(589).trade_species_id,616);assert.equal(+rule(617).trade_species_id,588);
for(const [file,hash]of Object.entries(manifest.sha256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'source/'+file)).digest('hex'),hash,'Changed reference '+file);
assert.equal(report.integrationEnabled,true);assert(fs.readFileSync('modes/idle/index.html','utf8').includes('modes/idle/unova/runtime.js'),'Unova runtime must be loaded');
console.log('Passed: 156 species, 143 ordinary/13 event species, complete learnsets, acyclic families, reference levels, reciprocal trade evolutions, source hashes and integrated runtime.');
