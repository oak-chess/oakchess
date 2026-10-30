/* Install validated original sheets; the live HTML does not load this module yet. */
const fs=require('fs'),path=require('path');
const stage='tmp/unova-pmd-source',manifest=JSON.parse(fs.readFileSync(stage+'/manifest.json','utf8'));
if(manifest.errors.length)throw Error('Unresolved source errors');
const data={};
for(const [variant,xml]of Object.entries(manifest.variants)){
 data[variant.replace('/0000/0001','s')]=xml;
 for(const file of ['AnimData.xml','credits.txt']){
  const to=path.join('assets/pmd/sprite',variant,file);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(stage,'sprite',variant,file),to);
 }
}
for(const file of Object.keys(manifest.sheets)){const dest=path.join('assets/pmd',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(stage,file),dest)}
fs.writeFileSync('modes/idle/unova/pmd-data.js','/* Verified source cycles, not activated in the live roster. */\nwindow.IDLE_UNOVA_PMD='+JSON.stringify(data)+';\n');
fs.copyFileSync(stage+'/credit_names.txt','modes/idle/unova/credit_names.txt');
fs.writeFileSync('modes/idle/unova/SPRITES.json',JSON.stringify({source:manifest.source,variants:Object.keys(manifest.variants).sort(),sheets:manifest.sheets,missing:manifest.missing,adaptation:'No generated directions or recoloring; original PMD sheets and durations retained.'},null,2)+'\n');
console.log('Installed '+Object.keys(data).length+' variants and '+Object.keys(manifest.sheets).length+' verified sheets.');
