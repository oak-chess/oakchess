/* Base Unova evolutions only. Regional forms remain outside this expansion. */
const fs=require('fs'),list=JSON.parse(fs.readFileSync('modes/idle/unova/catalog.json','utf8'));
const rules={},branches={},items={80:'sun',81:'moon',82:'fire',83:'thunder',84:'water',85:'leaf',107:'shiny',108:'dusk'},details=[];
for(const species of list){
 if(!species.from)continue;
 const rows=species.referenceEvolutions.filter(r=>r.is_default==='1'&&+r.evolution_trigger_id<=3&&(!r.required_pokemon_form_id||+r.required_pokemon_form_id===species.from)&&(!r.evolved_pokemon_form_id||+r.evolved_pokemon_form_id===species.id)&&!r.region_id);
 if(rows.length!==1)throw Error('Ambiguous base evolution '+species.id);
 const r=rows[0],rule={};
 if(r.minimum_level)rule.level=+r.minimum_level;
 if(r.minimum_happiness)rule.friendship=90; // Existing Idle friendship scale; official threshold remains in catalog.
 if(r.trigger_item_id){if(!items[r.trigger_item_id])throw Error('Unmapped evolution item '+r.trigger_item_id);rule.item=items[r.trigger_item_id]}
 if(r.evolution_trigger_id==='2')rule.trade=true;
 if(r.trade_species_id)rule.tradePartner=+r.trade_species_id;
 rules[species.id]=rule;
 (branches[species.from]??=[]).push(species.id);
 details.push({from:species.from,to:species.id,name:species.name,reference:r,idle:rule});
}
fs.writeFileSync('modes/idle/unova/evolutions.js','/* Prepared rules; integration is gated until Unova resources pass validation. */\nwindow.IDLE_UNOVA_EVOLUTIONS='+JSON.stringify(rules)+';\nwindow.IDLE_UNOVA_BRANCHES='+JSON.stringify(branches)+';\n');
fs.writeFileSync('modes/idle/unova/evolution-rules.json',JSON.stringify(details,null,2)+'\n');
console.log('Prepared '+details.length+' base evolutions; excluded regional-form alternatives.');
