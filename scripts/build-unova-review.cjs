const fs=require('fs');
const species=JSON.parse(fs.readFileSync('modes/idle/unova/catalog.json','utf8')),sprites=JSON.parse(fs.readFileSync('modes/idle/unova/SPRITES.json','utf8'));
fs.mkdirSync('prototypes/unova-review',{recursive:true});
fs.writeFileSync('prototypes/unova-review/catalog.js','window.UNOVA_REVIEW='+JSON.stringify(species.map(s=>({id:s.id,name:s.name,types:s.types,from:s.from,event:s.legendary||s.mythical,normal:sprites.variants.includes(String(s.id).padStart(4,'0')),shiny:sprites.variants.includes(String(s.id).padStart(4,'0')+'/0000/0001')})))+';\n');
console.log('Built 156-species review catalog with exact installed variant availability.');
