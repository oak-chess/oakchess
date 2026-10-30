const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),box={window:{}};
for(const file of ['modes/idle/unova/moves.js','modes/idle/unova/evolutions.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),box);
const list=JSON.parse(fs.readFileSync('modes/idle/unova/catalog.json','utf8')),moves=box.window.IDLE_UNOVA_MOVES,rules=box.window.IDLE_UNOVA_EVOLUTIONS;
assert.equal(Object.keys(moves).length,156);
for(const species of list){const learned=new Set(species.learnset.moves.map(m=>m[0])),selected=moves[species.id];assert(selected.length>0&&selected.length<=4);assert.equal(new Set(selected.map(m=>m.id)).size,selected.length);for(const m of selected){assert(learned.has(m.id),'Illegal '+species.name+' '+m.n);assert(m.k&&m.n&&m.t);assert(Number.isFinite(m.p))}if(species.from){const r=rules[species.id];assert(r,'No evolution '+species.id);assert(Object.keys(r).length);if(r.tradePartner)assert(r.trade)}}
assert.equal(moves[602].length,3,'Do not invent a fourth Tynamo move');
for(const [id,item]of [[512,'leaf'],[514,'fire'],[516,'water'],[518,'moon'],[547,'sun'],[549,'sun'],[573,'shiny'],[604,'thunder'],[609,'dusk']])assert.equal(rules[id].item,item);
assert.equal(rules[555].level,35);assert.equal(rules[549].item,'sun');assert.equal(rules[589].tradePartner,616);assert.equal(rules[617].tradePartner,588);
assert.equal(rules[528].friendship,90);assert.equal(rules[542].friendship,90);
assert.equal(rules[635].level,64);assert.equal(rules[637].level,59);
assert(fs.readFileSync('modes/idle/index.html','utf8').includes('modes/idle/unova/runtime.js'));
console.log('Passed: 156 legal staged loadouts, no duplicate/invented attacks, base-form evolution items/levels, reciprocal trades, existing friendship scale and runtime integration present.');
