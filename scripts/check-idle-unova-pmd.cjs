const fs=require('fs'),assert=require('node:assert/strict'),vm=require('vm'),box={window:{}};
const manifest=JSON.parse(fs.readFileSync('modes/idle/unova/SPRITES.json','utf8'));
vm.runInNewContext(fs.readFileSync('modes/idle/unova/pmd-data.js','utf8'),box);
let directions=0;
for(const [file,meta]of Object.entries(manifest.sheets)){
 const png=fs.readFileSync('assets/pmd/'+file);assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(png.readUInt32BE(16),meta.w*meta.frames);const rows=png.readUInt32BE(20)/meta.h;assert([1,8].includes(rows));if(rows===8)directions++;
}
for(const variant of manifest.variants){const key=variant.replace('/0000/0001','s'),xml=box.window.IDLE_UNOVA_PMD[key];assert(xml);assert(xml.includes('<Name>Walk</Name>'));assert(fs.existsSync('assets/pmd/sprite/'+variant+'/credits.txt'));assert(!manifest.missing.some(v=>v.variant===variant))}
assert.equal(manifest.variants.length+manifest.missing.length,312);
assert(fs.readFileSync('modes/idle/index.html','utf8').includes('modes/idle/unova/runtime.js'));
console.log('Passed: '+manifest.variants.length+' original variants, '+Object.keys(manifest.sheets).length+' PNG/XML pairs ('+directions+' with eight directions), attribution files, explicit missing variants and integrated runtime.');
