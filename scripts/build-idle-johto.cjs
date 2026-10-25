const fs=require('fs'),vm=require('vm');
const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync('assets/dex/catalog.js','utf8'),box);
const species=new Map(box.window.DEX_EXPANSION.map(s=>[s.id,s]));
const families=[[152,153,154],[155,156,157],[158,159,160],[161,162],[163,164],[165,166],[167,168],[170,171],[173],[174],[175,176],[177,178],[179,180,181],[182],[183,184],[185],[186],[187,188,189],[190],[191,192],[193],[194,195],[196],[197],[199],[201],[202],[203],[204,205],[206],[207],[209,210],[211],[213],[214],[215],[216,217],[218,219],[220,221],[222],[223,224],[225],[226],[227],[231,232],[233],[234],[235],[238],[240],[241],[243],[244],[245],[246,247,248],[249],[250],[251]];
const file='modes/idle/index.html';let html=fs.readFileSync(file,'utf8');html=html.replace(/\/\* johto-roster:start \*\/[\s\S]*?\/\* johto-roster:end \*\/\n?/,'');
const present=new Set([...html.slice(html.indexOf('const LINES=[];'),html.indexOf('/* ---------- Itens ---------- */')).matchAll(/^ln\(\d+,(\[[^\n]+?\]),/gm)].flatMap(m=>JSON.parse(m[1])));
const added=[];for(const family of families){if(family.every(id=>present.has(id)))continue;if(family.some(id=>present.has(id)))throw Error('Overlapping family '+family);
 const ids=[...family];while(ids.length<3)ids.push(ids.at(-1));const records=ids.map(id=>species.has(id)?{...species.get(id),name:id===250?'Ho-Oh':species.get(id).name}:null);if(records.some(x=>!x))throw Error('Missing species');
 const t=records[0].types,legend=family[0]>=243&&family[0]<=245||family[0]>=249;
 const role=t.includes('psychic')||t.includes('ghost')?'mage':t.includes('steel')||t.includes('rock')?'tank':t.includes('fairy')?'support':t.includes('fighting')?'melee':'skirm';
 const cost=legend?5:family[0]===246||[214,227,241].includes(family[0])?4:family.length===3?2:family.length===2?2:3;
 added.push('ln('+[cost,ids,records.map(s=>s.name),records.map(s=>s.types),role,['Investida','normal','rush',1]].map(x=>JSON.stringify(x)).join(',')+');');
}
const marker=html.includes('/* hoenn-roster:start */')?'/* hoenn-roster:start */':'/* Lendárias (Mewtwo';const pos=html.indexOf(marker);if(pos<0)throw Error('Insertion marker missing');html=html.slice(0,pos)+'/* johto-roster:start */\n'+added.join('\n')+'\n/* johto-roster:end */\n'+html.slice(pos);fs.writeFileSync(file,html);console.log('Added Johto families:',added.length);
