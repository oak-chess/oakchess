/* Inputs are the cached PokéAPI CSVs also used by the Idle species builders. */
const fs=require('fs');
function csv(file){const [head,...rows]=fs.readFileSync('tmp/dex-source/'+file,'utf8').trim().split(/\r?\n/).map(x=>x.split(','));return rows.map(row=>Object.fromEntries(head.map((k,i)=>[k,row[i]])))}
const species=csv('pokemon_species.csv'),groups=csv('pokemon_egg_groups.csv'),by=Object.fromEntries(species.map(r=>[r.id,r])),out={};
for(const r of species){let root=r;while(root.evolves_from_species_id&&by[root.evolves_from_species_id])root=by[root.evolves_from_species_id];out[r.id]={generation:+r.generation_id,root:+root.id,chain:+r.evolution_chain_id,genderRate:+r.gender_rate,baby:r.is_baby==='1',legendary:r.is_legendary==='1'||r.is_mythical==='1',groups:groups.filter(g=>g.species_id===r.id).map(g=>+g.egg_group_id)}}
fs.writeFileSync('modes/idle/breeding-data.js','/* PokéAPI species and egg groups; source: https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv (2026-10-25). */\nwindow.IDLE_BREEDING_DATA='+JSON.stringify(out)+';\n');console.log(Object.keys(out).length+' species metadata entries built.');
