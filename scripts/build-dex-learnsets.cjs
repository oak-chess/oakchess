/* Latest complete main-series learnset per species. Side-game battle rosters
 * (Champions/Legends/Let's Go) are not full move-learning tables. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),source=path.join(root,'tmp/dex-source');
const read=name=>fs.readFileSync(path.join(source,name),'utf8').trim().split(/\r?\n/);
const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/dex/catalog.js'),'utf8'),box);
const ids=new Set(box.window.DEX_EXPANSION.map(e=>e.id)),defaultPokemon=new Map();
for(const row of read('pokemon.csv').slice(1)){const cols=row.split(',');if(cols[7]==='1'&&ids.has(+cols[2]))defaultPokemon.set(+cols[0],+cols[2])}
const versionRows=read('version_groups.csv').slice(1).map(row=>row.split(','));
const versions=Object.fromEntries(versionRows.map(c=>[+c[0],c[1]])),versionOrder=Object.fromEntries(versionRows.map(c=>[+c[0],+c[3]]));
const result={};
for(const row of read('pokemon_moves.csv').slice(1)){
 const c=row.split(','),species=defaultPokemon.get(+c[0]);if(!species)continue;
 const version=+c[1];if(version>27||version===19||version===24)continue;let entry=result[species];if(!entry||versionOrder[version]>versionOrder[entry.version])entry=result[species]={version,game:versions[version]||String(version),moves:[]};
 if(version!==entry.version)continue;const move=+c[2],method=+c[3],level=+c[4];if(!entry.moves.some(m=>m[0]===move&&m[1]===method&&m[2]===level))entry.moves.push([move,method,level]);
}
for(const entry of Object.values(result))entry.moves.sort((a,b)=>a[1]-b[1]||a[2]-b[2]||a[0]-b[0]);
fs.writeFileSync(path.join(root,'assets/dex/learnsets.js'),'window.DEX_LEARNSETS='+JSON.stringify(result)+';\n');
console.log(Object.keys(result).length+' espécies com associações de golpes verificadas');
