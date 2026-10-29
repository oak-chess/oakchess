/* Exercise the actual Idle move selector against every form and its recorded learnset. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const box={window:{}};vm.createContext(box);
for(const f of ['assets/dex/learnsets.js','assets/dex/catalog.js','assets/playable-moves.js','modes/idle/playable-moves.js','modes/idle/move-slots.js'])vm.runInContext(fs.readFileSync(f,'utf8'),box,{filename:f});
const html=fs.readFileSync('modes/idle/index.html','utf8'),lines=[];
for(const m of html.matchAll(/^ln\((\d+),(\[[^\n]+?\]),(\[[^\n]+?\]),/gm))lines.push({ids:JSON.parse(m[2]),names:vm.runInNewContext(m[3])});
box.window.IDLE_MOVE_SLOTS.configure(lines,box.window.DEX_EXPANSION);
const source=html.match(/function movesFor\(L,star,all=false\)\{[^\n]+\}/)[0];vm.runInContext(source,box);
let forms=0;const short=[];
for(const L of lines)for(const [i,id]of L.ids.entries()){
 const registered=box.window.PLAYABLE_MOVES[id];assert(registered?.length,'Missing loadout '+id);const actual=box.movesFor(L,i+1);assert(actual.length>=1&&actual.length<=Math.min(4,registered.length));assert.deepEqual(Array.from(actual,m=>m.id),Array.from(registered.slice(0,actual.length),m=>m.id));if(new Set(L.ids).size===3)assert.equal(actual.length,Math.min(registered.length,i===0?2:i===1?3:4),'Changed three-stage family '+L.names[i]);assert.equal(new Set(actual.map(m=>m.id)).size,actual.length,'Repeated move '+id);const learnset=new Set(box.window.DEX_LEARNSETS[id].moves.map(m=>m[0]));for(const move of actual)assert(learnset.has(move.id),'Illegal move '+id+':'+move.id);if(actual.length<4)short.push({name:L.names[i],count:actual.length});forms++;
}
for(const name of ['Pinsir','Tauros','Lapras','Fearow','Charizard']){const L=lines.find(l=>l.names.includes(name)),star=L.names.indexOf(name)+1;assert.equal(box.movesFor(L,star).length,4,name+' should use four registered moves')}
if(fs.existsSync('prototypes/idle-arena-studies/real.html'))assert.equal(source,fs.readFileSync('prototypes/idle-arena-studies/real.html','utf8').match(/function movesFor\(L,star,all=false\)\{[^\n]+\}/)[0],'Prototype selector mismatch');
for(const [name,count]of [['Squirtle',2],['Wartortle',3],['Blastoise',4],['Spearow',2],['Fearow',4],['Pinsir',4],['Eevee',2],['Tyrogue',2],['Wurmple',2],['Silcoon',1],['Beautifly',4],['Chansey',3],['Rhyperior',4]]){const L=lines.find(l=>l.names.includes(name));assert.equal(box.movesFor(L,L.names.indexOf(name)+1).length,count,name)}assert(fs.readFileSync('index.html','utf8').includes('star>=3?4:star>=2?3:2'),'Campaign rules changed');
console.log('Passed: '+forms+' forms checked: original three-stage progression retained, short final families completed, legal moves and campaign unchanged.');console.log('Verified '+short.length+' form entries retaining reduced loadouts or their original progression.');
