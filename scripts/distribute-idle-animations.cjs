/* Offline distribution from recorded learnsets. Never infers legality from type.
 * Preserve first two moves, growing families and every previously used move. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const box={window:{}};vm.createContext(box);
for(const f of ['assets/playable-moves.js','modes/idle/playable-moves.js','modes/idle/unova/moves.js','modes/idle/unova/activate-moves.js','assets/dex/moves.js','assets/dex/learnsets.js','assets/dex/catalog.js','modes/idle/move-effects/catalog.js','assets/move-fx/aliases.js'])vm.runInContext(fs.readFileSync(f,'utf8'),box);
const w=box.window,baseline=JSON.parse(JSON.stringify(w.PLAYABLE_MOVES)),profiles=structuredClone(baseline),catalog=new Map(w.DEX_MOVE_CATALOG.map(m=>[m.id,m])),learnsets=w.DEX_LEARNSETS,species=new Map(w.DEX_EXPANSION.map(s=>[s.id,s]));
for(const s of JSON.parse(fs.readFileSync('modes/idle/unova/catalog.json','utf8'))){species.set(s.id,s);learnsets[s.id]=s.learnset}
const recipes=JSON.parse(fs.readFileSync('modes/idle/pda-effects/mapping.json','utf8')),animated=new Set(recipes.moves.map(m=>m.canonicalMove.id));
for(const key of Object.keys(w.IDLE_APPROVED_EFFECTS)){const m=[...catalog.values()].find(m=>m.key===key);if(m)animated.add(m.id)}
const usage=new Map(),templates=new Map();for(const ms of Object.values(baseline))for(const m of ms){usage.set(m.id,(usage.get(m.id)||0)+1);templates.set(m.id,m)}
const initial=new Set(usage.keys()),children=new Set([...species.values()].filter(s=>s.from).map(s=>s.from));
const supportedStatus={POISON_GAS:['poison',3],TOXIC:['poison',3],COTTON_SPORE:['slow',3],STUN_SPORE:['stun',.5],THUNDER_WAVE:['stun',.5]};
const unsupported=new Set(['HORN_DRILL','GUILLOTINE','FISSURE','SHEER_COLD','DREAM_EATER','SUCKER_PUNCH','LAST_RESORT','WRAP','LEECH_SEED']);
const kinds={barrage:'PIN_MISSILE RAZOR_LEAF BULLET_SEED ROCK_BLAST',multi:'DOUBLE_SLAP DOUBLESLAP FURY_ATTACK FURY_SWIPES',beam:'HYDRO_CANNON',bolt:'EGG_BOMB MUD_BOMB OCTAZOOKA MAGICAL_LEAF ZAP_CANNON',blast:'ROCK_SLIDE BLIZZARD LAVA_PLUME HYPER_VOICE ECHOED_VOICE SILVER_WIND PSYSHOCK PSYWAVE OVERHEAT THUNDER SACRED_FIRE ICY_WIND',rush:'ASSURANCE BONE_CLUB BONEMERANG BUG_BITE CROSS_POISON DIZZY_PUNCH HAMMER_ARM JUMP_KICK KARATE_CHOP MEGA_KICK MEGA_PUNCH MEGAHORN PAY_DAY PLUCK POISON_JAB SHADOW_PUNCH SKULL_BASH STEEL_WING STRUGGLE_BUG SUPER_FANG THRASH WILD_CHARGE',burst:'PETAL_DANCE STONE_EDGE',buff:'SWORDS_DANCE',barrier:'SAFEGUARD'};
const kindByKey=new Map(Object.entries(kinds).flatMap(([k,keys])=>keys.split(' ').map(key=>[key,k])));
const names={ZAP_CANNON:'Canhão Elétrico',ECHOED_VOICE:'Voz Ecoante',SILVER_WIND:'Vento Prateado',SWORDS_DANCE:'Dança das Espadas',SAFEGUARD:'Salvaguarda',ASSURANCE:'Garantia',BONE_CLUB:'Clava de Osso',BONEMERANG:'Osso Bumerangue',BUG_BITE:'Picada de Inseto',CROSS_POISON:'Veneno Cruzado',DIZZY_PUNCH:'Soco Atordoante',DOUBLE_SLAP:'Tapa Duplo',EGG_BOMB:'Bomba de Ovo',HAMMER_ARM:'Braço Martelo',HYDRO_CANNON:'Hidrocanhão',HYPER_VOICE:'Voz Poderosa',ICY_WIND:'Vento Gelado',JUMP_KICK:'Chute Saltador',KARATE_CHOP:'Golpe de Caratê',LAVA_PLUME:'Pluma de Lava',MAGICAL_LEAF:'Folha Mágica',MEGA_KICK:'Megachute',MEGA_PUNCH:'Megassoco',MEGAHORN:'Megachifre',MUD_BOMB:'Bomba de Lama',OCTAZOOKA:'Octazooka',OVERHEAT:'Superaquecimento',PAY_DAY:'Dia de Pagamento',PETAL_DANCE:'Dança das Pétalas',PLUCK:'Bicada Voraz',POISON_GAS:'Gás Venenoso',POISON_JAB:'Golpe Venenoso',PSYSHOCK:'Choque Psíquico',PSYWAVE:'Onda Psíquica',ROCK_SLIDE:'Deslizamento de Pedras',SACRED_FIRE:'Fogo Sagrado',SHADOW_PUNCH:'Soco Sombrio',SKULL_BASH:'Cabeçada de Crânio',STEEL_WING:'Asa de Aço',STONE_EDGE:'Gume de Pedra',STRUGGLE_BUG:'Resistência de Inseto',SUPER_FANG:'Superpresa',THRASH:'Fúria',THUNDER:'Trovão',TOXIC:'Tóxico',WILD_CHARGE:'Investida Selvagem',BLIZZARD:'Nevasca',COTTON_SPORE:'Esporos de Algodão',STUN_SPORE:'Esporos Paralisantes',THUNDER_WAVE:'Onda do Trovão'};
function template(m){
 if(templates.has(m.id))return structuredClone(templates.get(m.id));
 if(unsupported.has(m.key))return null;
 const st=supportedStatus[m.key];if(m.category==='Status'&&!st&&!['SWORDS_DANCE','SAFEGUARD'].includes(m.key))return null;
 const k=st?'debuff':kindByKey.get(m.key);if(!k||(!st&&m.category!=='Status'&&!Number.isFinite(m.power)))return null;
 const p=st?0:m.category==='Status'?1:k==='barrage'?.33:k==='multi'?.65:Math.max(.65,Math.min(1.45,.65+(m.power||40)/160));
 const out={id:m.id,n:names[m.key]||m.name,emerald:m.key,t:m.type,k,p,damageClass:m.category==='Físico'?'phys':'spec',targetId:m.targetId,visualStatus:m.status};
 if(st){out.st=st[0];out.d=st[1]}
 if(m.key==='ZAP_CANNON'){out.st='stun';out.d=.5;out.statusChance=1}
 return out;
}
const report=[],reservations=new Set();
const wanted=[...animated].filter(id=>!initial.has(id)).map(id=>catalog.get(id)).filter(Boolean);
const legalSpecies=m=>Object.keys(profiles).map(Number).filter(id=>!children.has(id)&&learnsets[id]?.moves.some(row=>row[0]===m.id));
wanted.sort((a,b)=>legalSpecies(a).length-legalSpecies(b).length||a.id-b.id);
for(const m of wanted){const move=template(m),legal=legalSpecies(m);if(!move){report.push({id:m.id,key:m.key,name:m.name,status:'mechanics-pending',legalSpecies:legal});continue}
 const choices=[];for(const id of legal){const ms=profiles[id];if(ms.some(x=>x.id===m.id))continue;for(let slot=2;slot<4;slot++){if(reservations.has(id+':'+slot))continue;const replaced=ms[slot];if(replaced&&(usage.get(replaced.id)||0)<=1)continue;const record=species.get(id),stab=record?.types?.includes(m.type)?1:0,levelUp=learnsets[id].moves.some(row=>row[0]===m.id&&row[1]===1)?1:0;const previousChanges=report.filter(r=>r.species===id).length;choices.push({id,slot,replaced,score:stab*100+levelUp*40-previousChanges*30+(replaced&&replaced.t===m.type?10:0)})}}
 choices.sort((a,b)=>b.score-a.score||a.id-b.id||a.slot-b.slot);const choice=choices[0];if(!choice){report.push({id:m.id,key:m.key,name:m.name,status:legal.length?'protected-slots':'no-eligible-final-species',legalSpecies:legal});continue}
 const {id,slot,replaced}=choice;profiles[id][slot]=move;if(replaced)usage.set(replaced.id,usage.get(replaced.id)-1);usage.set(m.id,1);reservations.add(id+':'+slot);report.push({id:m.id,key:m.key,name:m.name,status:'assigned',species:id,pokemon:species.get(id)?.name,slot:slot+1,replaced:replaced?.emerald||null,source:learnsets[id].game});
}
const changed={};for(const [id,ms]of Object.entries(profiles))if(JSON.stringify(ms)!==JSON.stringify(baseline[id])){assert(ms.length<=4);assert.deepEqual(ms.slice(0,2),baseline[id].slice(0,2));assert(!children.has(+id));assert(ms.every(Boolean));changed[id]=ms}
const after=new Set(Object.values(profiles).flat().map(m=>m.id));for(const id of initial)assert(after.has(id),'Lost existing move '+id);
const summary={species:Object.keys(profiles).length,animated: animated.size,before:[...animated].filter(id=>initial.has(id)).length,after:[...animated].filter(id=>after.has(id)).length,newMoves:report.filter(r=>r.status==='assigned').length,changedSpecies:Object.keys(changed).length};
fs.writeFileSync('modes/idle/animated-loadouts.js','/* Generated by scripts/distribute-idle-animations.cjs. Legal final-form additions; first two moves preserved. */\nObject.assign(window.PLAYABLE_MOVES,'+JSON.stringify(changed)+');\n');
fs.writeFileSync('docs/IDLE-ANIMATION-DISTRIBUTION.json',JSON.stringify({summary,report},null,2)+'\n');
fs.writeFileSync('docs/IDLE-ANIMATION-DISTRIBUTION.md','# Distribuição das animações no Idle\n\n'+summary.newMoves+' golpes antes sem usuários receberam associação legal, em '+summary.changedSpecies+' espécies finais. Cobertura: '+summary.before+' → '+summary.after+' de '+summary.animated+' golpes com animação própria disponível nos dois pacotes.\n\nRegras: quatro golpes por perfil; primeiros dois preservados; nenhuma forma em crescimento alterada; nenhum golpe antes utilizado desaparece do catálogo; somente aprendizado registrado. Megas e bosses herdam o mesmo resolvedor por espécie. Dano, área e duração continuam adaptações do Idle. Golpes cuja mecânica específica ainda não é suportada não foram convertidos em dano genérico para aproveitar uma animação.\n\n| Golpe | Destino ou situação | Substituição |\n|---|---|---|\n'+report.map(r=>'| '+r.name+' | '+(r.status==='assigned'?r.pokemon+' (#'+r.species+'), vaga '+r.slot:r.status)+' | '+(r.replaced||'—')+' |').join('\n')+'\n');
console.log(JSON.stringify(summary));
