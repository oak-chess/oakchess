/* Species-specific combat loadouts, selected only from recorded learnsets.
 * Damage, cooldown and area remain OakChess adaptations, not cartridge rules. */
const fs=require('fs'),vm=require('vm');
const box={window:{}};vm.createContext(box);
for(const file of ['assets/dex/moves.js','assets/dex/learnsets.js','assets/dex/catalog.js','assets/move-fx/aliases.js'])vm.runInContext(fs.readFileSync(file,'utf8'),box);
const {DEX_MOVE_CATALOG:catalog,DEX_LEARNSETS:learnsets,DEX_EXPANSION:species}=box.window;
const idleOnly=process.argv.includes('--idle');
const html=fs.readFileSync(idleOnly?'modes/idle/index.html':'index.html','utf8'),lines=[];
const extract=html.slice(html.indexOf('const LINES=[];'),html.indexOf('/* ---------- Itens ---------- */'));
// Read the explicit line declarations without executing game startup.
for(const match of extract.matchAll(/^ln\((\d+),(\[[^\n]+?\]),(\[[^\n]+?\]),/gm))lines.push({cost:+match[1],ids:JSON.parse(match[2]),names:vm.runInNewContext(match[3])});
if(idleOnly){const ids=new Set([236,237,239,440,466]);for(let i=lines.length-1;i>=0;i--)if(!lines[i].ids.some(id=>ids.has(id)))lines.splice(i,1)}
const translations={};
for(const [name,key] of Object.entries(box.window.EMERALD_ALIASES))if(!translations[key])translations[key]=name;
Object.assign(translations,{MACH_PUNCH:'Soco Rápido',TRIPLE_KICK:'Chute Triplo',LOW_KICK:'Rasteira',THUNDER_SHOCK:'Choque do Trovão',SHOCK_WAVE:'Onda de Choque',THUNDER_PUNCH:'Soco do Trovão',ICE_PUNCH:'Soco de Gelo',LIGHT_SCREEN:'Tela de Luz',PROTECT:'Proteção',TACKLE:'Investida',EMBER:'Brasas',FLAMETHROWER:'Lança-chamas',FIRE_BLAST:'Explosão de Fogo',WATER_GUN:'Jato de Água',HYDRO_PUMP:'Hidrobomba',WHIRLWIND:'Redemoinho de Vento',WHIRLPOOL:'Redemoinho de Água',GUST:'Rajada',SWIFT:'Estrelas Cadentes',SWEET_KISS:'Beijo Doce',SILVER_WIND:'Vento Prateado',LEECH_LIFE:'Sanguessuga',ROCK_TOMB:'Tumba de Rochas',LUSTER_PURGE:'Expurgo de Luz',MIST_BALL:'Bola de Névoa',TRANSFORM:'Transformação',BODY_SLAM:'Pancada Corporal',SLASH:'Talho',AIR_CUTTER:'Corte Aéreo',MUD_SLAP:'Tapa de Lama',DISCHARGE:'Descarga',DOUBLE_EDGE:'Dois Gumes',STOMP:'Pisotear',VICE_GRIP:'Aperto de Garra',TELEPORT:'Teleporte',NIGHT_SHADE:'Sombra Noturna',SPARK:'Faísca',FIRE_PUNCH:'Soco de Fogo',ROCK_THROW:'Arremesso de Pedra',ROCK_BLAST:'Rajada de Rochas',SACRED_FIRE:'Fogo Sagrado',HEAT_WAVE:'Onda de Calor',FAINT_ATTACK:'Ataque Furtivo',FLASH_CANNON:'Canhão de Flash',AURA_SPHERE:'Esfera de Aura',X_SCISSOR:'Tesoura X',AIR_SLASH:'Corte de Ar',DRAGON_PULSE:'Pulso do Dragão',DARK_PULSE:'Pulso Sombrio',BUG_BUZZ:'Zumbido',DAZZLING_GLEAM:'Brilho Mágico',FAIRY_WIND:'Vento Feérico',DRAINING_KISS:'Beijo Drenante',ROOST:'Poleiro',SLACK_OFF:'Relaxar',HARDEN:'Endurecer',POUND:'Pancada',SCRATCH:'Arranhão',PECK:'Bicada',BITE:'Mordida',HEADBUTT:'Cabeçada',RAZOR_LEAF:'Folha Navalha',ABSORB:'Absorver',MEGA_DRAIN:'Mega Dreno',GIGA_DRAIN:'Giga Dreno',BUBBLE_BEAM:'Raio de Bolhas',CONFUSION:'Confusão',METAL_CLAW:'Garra de Metal',THUNDERBOLT:'Raio',TACKLE:'Investida',STRING_SHOT:'Disparo de Seda',POISON_STING:'Ferrão Venenoso',IRON_HEAD:'Cabeça de Ferro',FIRE_FANG:'Presas de Fogo',SPLASH:'Splash',TWISTER:'Tornado',DRAGON_RAGE:'Fúria do Dragão'});
// Supported combat behaviours. No arbitrary status move is turned into damage.
const groups={
 bolt:'EMBER WATER_GUN BUBBLE CONFUSION PSYBEAM SHADOW_BALL THUNDER_SHOCK SHOCK_WAVE MUD_SHOT MUD_SLAP ROCK_THROW POWER_GEM DRAGON_RAGE DRAGON_PULSE DARK_PULSE AURA_SPHERE SIGNAL_BEAM',
 beam:'FLAMETHROWER ICE_BEAM AURORA_BEAM SOLAR_BEAM HYPER_BEAM FLASH_CANNON BUBBLE_BEAM DRAGON_BREATH THUNDERBOLT HYDRO_PUMP PSYCHIC',
 blast:'FIRE_BLAST SLUDGE_BOMB SLUDGE ACID ANCIENT_POWER AIR_SLASH AIR_CUTTER GUST BUG_BUZZ DAZZLING_GLEAM TWISTER WATER_PULSE',
 rush:'MACH_PUNCH TACKLE SCRATCH POUND QUICK_ATTACK BITE CRUNCH WING_ATTACK PECK DRILL_PECK SLASH NIGHT_SLASH METAL_CLAW IRON_HEAD IRON_TAIL VINE_WHIP HORN_ATTACK HEADBUTT BODY_SLAM TAKE_DOWN DOUBLE_EDGE KARATE_CHOP CROSS_CHOP LOW_KICK BRICK_BREAK JUMP_KICK HI_JUMP_KICK ROLLING_KICK FIRE_PUNCH ICE_PUNCH THUNDER_PUNCH FIRE_FANG POISON_FANG LICK DIG ROLLOUT FLAME_WHEEL X_SCISSOR FURY_CUTTER DRAGON_CLAW ROCK_TOMB CRABHAMMER BONE_CLUB STOMP VICE_GRIP HYPER_FANG',
 multi:'TRIPLE_KICK DOUBLE_SLAP COMET_PUNCH FURY_ATTACK FURY_SWIPES TWINEEDLE DOUBLE_KICK TRI_ATTACK',
 barrage:'PIN_MISSILE ICICLE_SPEAR ROCK_BLAST BULLET_SEED SWIFT RAZOR_LEAF',
 burst:'EARTHQUAKE DISCHARGE SURF',
 drain:'ABSORB MEGA_DRAIN GIGA_DRAIN LEECH_LIFE DRAINING_KISS DRAIN_PUNCH',
 heal:'RECOVER SOFT_BOILED MOONLIGHT SYNTHESIS SLACK_OFF ROOST',
 barrier:'WITHDRAW HARDEN IRON_DEFENSE BARRIER LIGHT_SCREEN REFLECT PROTECT',
 buff:'SWORDS_DANCE AGILITY DRAGON_DANCE GROWTH CALM_MIND',
 splash:'SPLASH',
};
const behaviours=new Map(Object.entries(groups).flatMap(([kind,keys])=>keys.split(' ').map(key=>[key,kind])));
const preference={
 236:'TACKLE MACH_PUNCH LOW_KICK PROTECT',237:'TRIPLE_KICK MACH_PUNCH LOW_KICK PROTECT',239:'THUNDER_SHOCK SHOCK_WAVE THUNDER_PUNCH LIGHT_SCREEN',440:'POUND LIGHT_SCREEN PROTECT',466:'THUNDER_PUNCH DISCHARGE THUNDERBOLT ICE_PUNCH',
 1:'VINE_WHIP RAZOR_LEAF',2:'RAZOR_LEAF MEGA_DRAIN',3:'SOLAR_BEAM GIGA_DRAIN',4:'EMBER SCRATCH',5:'FLAME_WHEEL FLAMETHROWER',6:'FLAMETHROWER AIR_SLASH',
 7:'WATER_GUN WITHDRAW',8:'WATER_PULSE BITE',9:'HYDRO_PUMP FLASH_CANNON',10:'TACKLE STRING_SHOT',11:'HARDEN',12:'GUST BUG_BUZZ',13:'POISON_STING STRING_SHOT',14:'HARDEN',15:'TWINEEDLE X_SCISSOR',
 16:'GUST QUICK_ATTACK',17:'WING_ATTACK AIR_CUTTER',18:'AIR_SLASH WING_ATTACK',63:'CONFUSION',64:'PSYBEAM CONFUSION',65:'PSYCHIC RECOVER',
 66:'LOW_KICK KARATE_CHOP',67:'KARATE_CHOP BRICK_BREAK',68:'CROSS_CHOP BRICK_BREAK',74:'ROCK_THROW TACKLE',75:'ROCK_BLAST ROLLOUT',76:'EARTHQUAKE ROCK_BLAST',
 81:'THUNDER_SHOCK SONIC_BOOM',82:'SPARK THUNDERBOLT',462:'FLASH_CANNON DISCHARGE',92:'LICK NIGHT_SHADE',93:'SHADOW_BALL LICK',94:'SHADOW_BALL DARK_PULSE',
 129:'SPLASH TACKLE',130:'BITE HYDRO_PUMP',147:'TWISTER DRAGON_RAGE',148:'DRAGON_RAGE DRAGON_PULSE',149:'DRAGON_CLAW DRAGON_PULSE',
 172:'THUNDER_SHOCK QUICK_ATTACK',25:'THUNDERBOLT QUICK_ATTACK',26:'THUNDERBOLT IRON_TAIL',95:'ROCK_THROW ROCK_TOMB',208:'IRON_TAIL IRON_HEAD',123:'FURY_CUTTER WING_ATTACK',212:'X_SCISSOR IRON_HEAD',
 35:'MOONLIGHT POUND',36:'MOONLIGHT DAZZLING_GLEAM',113:'SOFT_BOILED POUND',242:'SOFT_BOILED DAZZLING_GLEAM',150:'PSYCHIC AURA_SPHERE',151:'PSYCHIC ANCIENT_POWER',144:'ICE_BEAM ANCIENT_POWER',145:'THUNDERBOLT DRILL_PECK',146:'FLAMETHROWER AIR_SLASH',
 133:'QUICK_ATTACK BITE',134:'WATER_PULSE HYDRO_PUMP',135:'THUNDERBOLT PIN_MISSILE',136:'FLAMETHROWER FIRE_FANG',132:'TRANSFORM',
};
// Special effects with explicit behaviour, rather than name-only substitutions.
behaviours.set('TELEPORT','teleport');behaviours.set('STRING_SHOT','debuff');behaviours.set('POISON_STING','bolt');behaviours.set('NIGHT_SHADE','bolt');behaviours.set('SPARK','rush');behaviours.set('TRANSFORM','transform');
const result={},report=[];
for(const line of lines)for(const [index,id]of line.ids.entries()){
 if(result[id])continue;
 const learnset=learnsets[id];if(!learnset)throw Error('Missing learnset: '+id);
 const record=species.find(s=>s.id===id),types=record?.types||[];
 const learned=new Map(learnset.moves.map(row=>[row[0],row]));
 const candidates=catalog.filter(m=>learned.has(m.id)&&behaviours.has(m.key));
 // Select recognizable moves first, then level-up STAB and legal coverage.
 const preferred=(preference[id]||'').split(' ');
 const score=m=>{const row=learned.get(m.id),p=preferred.indexOf(m.key);return (p>=0?1000-p*100:0)+(types.includes(m.type)?90:0)+(row[1]===1?50:0)+(m.category==='Status'?-35:0)+Math.min(100,m.power||0)*.25};
 candidates.sort((a,b)=>score(b)-score(a)||a.id-b.id);
 const chosen=candidates.slice(0,4);
 if(!chosen.length)throw Error('No supported legal move: '+id);
 result[id]=chosen.map(m=>{
  const k=behaviours.get(m.key),status=m.category==='Status',p=k==='barrage'?.33:k==='multi'?.65:status?1:Math.max(.65,Math.min(1.45,.65+(m.power||40)/160));
  const move={id:m.id,n:translations[m.key]||m.name,emerald:m.key,t:m.type,k,p,damageClass:m.category==='Físico'?'phys':'spec',targetId:m.targetId,visualStatus:m.status};
  if(k==='debuff'){move.st='slow';move.d=2;move.p=0}
  const secondary={EMBER:['burn',3,.1],FLAMETHROWER:['burn',3,.1],FIRE_BLAST:['burn',3,.1],FIRE_PUNCH:['burn',3,.1],FIRE_FANG:['burn',3,.1],THUNDER_SHOCK:['stun',.5,.1],THUNDERBOLT:['stun',.5,.1],THUNDER_PUNCH:['stun',.5,.1],ICE_BEAM:['freeze',.8,.1],ICE_PUNCH:['freeze',.8,.1],BODY_SLAM:['stun',.5,.3],POISON_STING:['poison',3,.3],SLUDGE_BOMB:['poison',3,.3]};
  if(secondary[m.key]){[move.st,move.d,move.statusChance]=secondary[m.key]}
  return move;
 });
 report.push({id,name:line.names[index],game:learnset.game,moves:result[id].map(m=>m.n+' ['+m.emerald+']').join(', ')});
}
fs.writeFileSync(idleOnly?'modes/idle/playable-moves.js':'assets/playable-moves.js','/* Generated by scripts/build-playable-moves.cjs'+(idleOnly?' --idle':'')+'. */\n'+(idleOnly?'Object.assign(window.PLAYABLE_MOVES,':'window.PLAYABLE_MOVES=')+JSON.stringify(result)+(idleOnly?');\n':';\n'));
fs.writeFileSync(idleOnly?'docs/IDLE-FAMILY-MOVES.md':'docs/PLAYABLE-MOVES.md','# Golpes por espécie do elenco atual\n\nCada associação consta na lista de aprendizado da espécie. Inclui nível e máquinas/tutores; não impõe um nível de RPG à evolução por estrelas. Dano, área e duração são adaptações do OakChess. Efeito disponível não significa animação conferida visualmente. Não adiciona espécies à loja ou à Torre.\n\n| Nº | Pokémon | Fonte | Golpes selecionados |\n|---|---|---|---|\n'+report.map(r=>'| '+r.id+' | '+r.name+' | '+r.game+' | '+r.moves+' |').join('\n')+'\n');
console.log(JSON.stringify({lines:lines.length,species:report.length,withFewerThanFour:report.filter(r=>result[r.id].length<4).map(r=>({id:r.id,count:result[r.id].length}))}));
