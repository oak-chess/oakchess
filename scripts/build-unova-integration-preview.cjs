/* Generate an isolated real-engine integration. Never rewrite the production HTML. */
const fs=require('fs'),path=require('path');
const root='prototypes/unova-review',out=root+'/runtime';fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(p,'utf8'),files=new Map();
if(read('modes/idle/index.html').includes('/* unova-roster:start */'))throw Error('One-time scaffold already promoted. Use modes/idle/index.html for current integration tests.');
function replace(s,from,to,label){if(!s.includes(from))throw Error('Integration anchor missing: '+label);return s.replace(from,to)}
const species=JSON.parse(read('modes/idle/unova/catalog.json')),byId=new Map(species.map(s=>[s.id,s])),used=new Set(),rows=[];
for(const s of species){if(used.has(s.id))continue;if(s.from&&!used.has(s.from))throw Error('Parent out of order '+s.id);const ids=[s.id];used.add(s.id);while(ids.length<3){const child=species.filter(x=>x.from===ids.at(-1));if(child.length!==1)break;ids.push(child[0].id);used.add(child[0].id)}while(ids.length<3)ids.push(ids.at(-1));const records=ids.map(id=>byId.get(id)),types=s.types,role=types.includes('psychic')||types.includes('ghost')?'mage':types.includes('rock')||types.includes('steel')?'tank':types.includes('fighting')?'melee':'skirm',c=s.legendary||s.mythical?5:ids[0]!==ids.at(-1)?2:3;
 rows.push('ln('+[c,ids,records.map(r=>r.name),records.map(r=>r.types),role,['Investida','normal','rush',1]].map(JSON.stringify).join(',')+');');
}
let html=read('modes/idle/index.html');
html=replace(html,"prefix='oakchess-idle:'","prefix='oakchess-unova-integration:'",'isolated storage');
html=replace(html,'<title>OakChess · Jornada Idle</title>','<title>OakChess · Unova em integração</title>','title');
html=replace(html,'/* Lendárias (Mewtwo','/* unova-roster:start */\n'+rows.join('\n')+'\n/* unova-roster:end */\n/* Lendárias (Mewtwo','append roster');
const patch=(file,fn)=>{const name=path.basename(file);files.set(out+'/'+name,fn(read(file)));const tag=new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:\\?[^"\\s]*)?','g');html=html.replace(tag,out+'/'+name+'?v=unova-preview-1')};
patch('modes/idle/idle.js',s=>{
 s=replace(s,"'before-sinnoh'","'before-unova','before-sinnoh'",'backup');
 s=replace(s,'...window.IDLE_SINNOH_EVENT_LEVELS','...window.IDLE_SINNOH_EVENT_LEVELS,...window.IDLE_UNOVA_EVENT_LEVELS','levels');
 s=replace(s,'...window.IDLE_SINNOH_EVENT_GROUPS','...window.IDLE_SINNOH_EVENT_GROUPS,...window.IDLE_UNOVA_EVENT_GROUPS','groups');
 s=replace(s,"sinnohOrigin:['Sinnoh','Origem']","sinnohOrigin:['Sinnoh','Origem'],...window.IDLE_UNOVA_EVENT_META",'event navigation');
 s=replace(s,'const requirements={sinnohLakes:','const requirements={...window.IDLE_UNOVA_EVENT_REQUIREMENTS,sinnohLakes:','event requirements');return s;
});
patch('modes/idle/gacha.js',s=>replace(replace(s,"['sinnoh','Sinnoh',4,387]","['sinnoh','Sinnoh',4,387],['unova','Unova',5,494]",'gacha region'),"if(region==='sinnoh')","if(region==='unova')return w.badges.includes(31)||s.area>=32;if(region==='sinnoh')",'gacha unlock'));
patch('modes/idle/field-notes.js',s=>replace(replace(s,"['sinnoh','Sinnoh · 4ª geração']","['sinnoh','Sinnoh · 4ª geração'],['unova','Unova · 5ª geração']",'dex filter'),"dexScope==='sinnoh'?e.id>=387&&e.id<=493:","dexScope==='sinnoh'?e.id>=387&&e.id<=493:dexScope==='unova'?e.id>=494&&e.id<=649:",'dex scope'));
patch('modes/idle/special-crystals.js',s=>replace(replace(s,'488]','488,638,639,640,641,642,643,644,645,646]','legend crystals'),'493]','493,494,647,648,649]','mythic crystals'));
patch('modes/idle/systems.js',s=>{
 s=replace(s,'sinnohBadges:w.badges.filter',"unovaBadges:w.badges.filter(i=>continentOfArea(i)==='Unova').length,sinnohBadges:w.badges.filter",'mission metric');
 s=replace(s,'partyReady=!spec.party||all().some','partyId=spec.party||spec.tradePartner,partyName=window.DEX_EXPANSION.find(p=>p.id===partyId)?.name,partyReady=!partyId||all().some','trade partner');
 s=replace(s,'===spec.party','===partyId','partner predicate');s=replace(s,'partyRequired:spec.party,partyReady','partyRequired:partyId,partyName,partyReady','partner UI');s=replace(s,"(spec.party?' · Remoraid na equipe ou no PC':'')","(partyId?' · '+partyName+' na equipe ou no PC':'')",'partner text');
 s=s.replaceAll('Kanto, Johto, Hoenn e Sinnoh','Kanto, Johto, Hoenn, Sinnoh e Unova').replaceAll('Libera um grupo de eventos de Hoenn','Libera um grupo de eventos');return s;
});
for(const file of ['modes/idle/screen.js','modes/idle/party.js'])patch(file,s=>s.replaceAll("'Remoraid na equipe ou no PC'","(rule.partyName||'Remoraid')+' na equipe ou no PC'"));
patch('modes/idle/life-ui.js',s=>replace(s,"['Kanto','Johto','Hoenn']","['Kanto','Johto','Hoenn','Sinnoh','Unova']",'collection navigation'));
patch('modes/idle/life.js',s=>replace(s,"[['Kanto',1],['Johto',2],['Hoenn',3]]","[['Kanto',1],['Johto',2],['Hoenn',3],['Sinnoh',4],['Unova',5]]",'collection generation mapping'));
patch('modes/idle/arena-seal.js',s=>s.replaceAll('window.IDLE_SINNOH_ARENAS||[]','window.IDLE_SINNOH_ARENAS||[],window.IDLE_UNOVA_ARENAS||[]'));
const additions=['species','evolutions','moves','pmd-data','bounds-data','destinations','runtime'].map(f=>'<script src="modes/idle/unova/'+f+'.js"></script>').join('');
// These modules require the shared move/bounds dictionaries, which already exist before this anchor.
html=replace(html,'<script src="modes/idle/continents.js?v=hoenn-1">',additions+'<script src="modes/idle/continents.js?v=hoenn-1">','regional data before continent indexing');
html=replace(html,'<script src="modes/idle/sinnoh/arenas.js?v=1"></script>','<script src="modes/idle/sinnoh/arenas.js?v=1"></script><script src="modes/idle/unova/arenas.js"></script>','Unova arena registration');
const metadata=species.filter(s=>!read('assets/dex/catalog.js').includes('"id":'+s.id+',')).map(s=>({id:s.id,name:s.name,types:s.types,chain:s.chain,from:s.from,forms:[]}));
files.set(out+'/metadata.js','window.DEX_EXPANSION.push(...'+JSON.stringify(metadata)+');\nObject.assign(window.DEX_LEARNSETS,'+JSON.stringify(Object.fromEntries(species.map(s=>[s.id,s.learnset])))+');\n');
html=replace(html,'<script src="modes/idle/unova/species.js">','<script src="'+out+'/metadata.js"></script><script src="modes/idle/unova/species.js">','missing catalog metadata');
// PLAYABLE_MOVES loads later: reapply the opt-in pack immediately before boot.
files.set(out+'/activate-moves.js','Object.assign(window.PLAYABLE_MOVES,window.IDLE_UNOVA_MOVES);\n');
const bootTag='<script src="'+out+'/idle.js?v=unova-preview-1">';
html=replace(html,bootTag,'<script src="'+out+'/activate-moves.js"></script><script src="'+out+'/seed.js"></script>'+bootTag,'preview boot');
files.set(out+'/seed.js',`(()=>{if(localStorage.getItem('journey-native-v2'))return;localStorage.setItem('journey-native-v2',JSON.stringify({gold:300000,wins:500,area:32,trainerLevel:400,trainerXp:0,last:Date.now(),schemaVersion:5,team:['Snivy','Tepig','Oshawott','Lillipup','Purrloin','Munna'].map((name,i)=>({id:'unova-preview-'+i,name,star:1,level:386,xp:0,condition:1,pos:{z:'b',r:i<3?5:6,c:1+(i%3)*2}})),collection:[],items:[],world:{badges:Array.from({length:32},(_,i)=>i),regionWins:Array(40).fill(0),location:'route'}}))})();\n`);
html=replace(html,'</body>','<div style="position:fixed;bottom:3px;left:50%;transform:translateX(-50%);z-index:9999;background:#17131eea;color:#ffcf80;padding:3px 10px;border-radius:5px;font:11px Trebuchet MS;pointer-events:none">UNOVA · TESTE ISOLADO · CENÁRIOS PROVISÓRIOS</div></body>','preview banner');
files.set(root+'/real.html',html);
for(const [file,text]of files)fs.writeFileSync(file,text);
console.log('Built isolated real-engine preview: '+rows.length+' new lines, 156 species, 40 destinations. Production HTML unchanged.');
