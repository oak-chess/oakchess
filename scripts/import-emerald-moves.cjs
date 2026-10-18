/* Asset build tool. Run after unpacking pret/pokeemerald in tmp/emerald-source. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'tmp/emerald-source/pokeemerald-master');
const read=p=>fs.readFileSync(path.join(source,p),'utf8');
const graphics=read('src/graphics.c'),tables=read('src/data/battle_anim.h');
const gfx={},tags={},palettes={};
for(const m of graphics.matchAll(/const u(?:8|16|32)\s+(\w+)\[\]\s*=\s*INC(?:GFX|BIN)_U\d+\("([^"]+)"/g))gfx[m[1]]=m[2];
for(const key of Object.keys(gfx))if(/\.4bpp$/.test(gfx[key])&&fs.existsSync(path.join(source,gfx[key].replace(/\.4bpp$/,'.png'))))gfx[key]=gfx[key].replace(/\.4bpp$/,'.png');
for(const m of tables.matchAll(/\{(gBattleAnimSpriteGfx_\w+),\s*[^,]+,\s*(ANIM_TAG_\w+)\}/g))if(gfx[m[1]])tags[m[2]]=gfx[m[1]];
for(const m of tables.matchAll(/\{(gBattleAnimSpritePal_\w+),\s*(ANIM_TAG_\w+)\}/g))if(gfx[m[1]])palettes[m[2]]=gfx[m[1]];
const templates={},proceduralTemplates={},files=fs.readdirSync(path.join(source,'src')).filter(n=>/^battle_anim.*\.c$/.test(n));
for(const file of files){
 const text=read('src/'+file),anims={},lists={},affines={},affineLists={};
 for(const m of text.matchAll(/const union AffineAnimCmd\s+(\w+)\[\]\s*=\s*\{([\s\S]*?)\};/g)){
  const frames=[];for(const f of m[2].matchAll(/AFFINEANIMCMD_FRAME\(\s*(-?(?:0x[\da-f]+|\d+)),\s*(-?(?:0x[\da-f]+|\d+)),\s*(-?(?:0x[\da-f]+|\d+)),\s*(\d+)\)/gi))frames.push(f.slice(1).map(v=>v.startsWith('-0x')?-parseInt(v.slice(1),16):Number(v)));
  affines[m[1]]={frames,loop:/AFFINEANIMCMD_JUMP/.test(m[2])};
 }
 for(const m of text.matchAll(/const union AffineAnimCmd\s*\*\s*const\s+(\w+)\[\]\s*=\s*\{([\s\S]*?)\};/g))affineLists[m[1]]=[...m[2].matchAll(/\b([sg]\w+)\b/g)].map(x=>x[1]);
 for(const m of text.matchAll(/(?:static\s+)?const union AnimCmd\s+(\w+)\[\]\s*=\s*\{([\s\S]*?)\};/g)){
  const frames=[];
  for(const f of m[2].matchAll(/ANIMCMD_FRAME\(\s*(\d+),\s*(\d+)([^)]*)\)/g))frames.push([+f[1],+f[2],/hFlip\s*=\s*TRUE/.test(f[3])?1:0,/vFlip\s*=\s*TRUE/.test(f[3])?1:0]);
  anims[m[1]]={frames,loop:/ANIMCMD_JUMP/.test(m[2])};
 }
 for(const m of text.matchAll(/const union AnimCmd\s*\*\s*const\s+(\w+)\[\]\s*=\s*\{([\s\S]*?)\};/g))lists[m[1]]=[...m[2].matchAll(/\b([sg]\w+)\b/g)].map(x=>x[1]);
 for(const m of text.matchAll(/const struct SpriteTemplate\s+(\w+)\s*=\s*\{([\s\S]*?)\};/g)){
  const field=n=>m[2].match(new RegExp('\\.'+n+'\\s*=\\s*&?(\\w+)'))?.[1];
  const tag=field('tileTag'),png=tags[tag],sz=field('oam')?.match(/(\d+)x(\d+)/);
  if(!png||!fs.existsSync(path.join(source,png))){if(tag==='0'||tag==='ANIM_TAG_NONE')proceduralTemplates[m[1]]=field('callback');continue;}
  templates[m[1]]={tag,png,pal:palettes[field('paletteTag')]||palettes[tag],w:sz?+sz[1]:32,h:sz?+sz[2]:32,callback:field('callback'),animations:(lists[field('anims')]||[]).map(n=>anims[n]).filter(a=>a?.frames.length),affines:(affineLists[field('affineAnims')]||[]).map(n=>affines[n]).filter(a=>a?.frames.length)};
 }
}
const macros={};
for(const m of read('asm/macros/battle_anim_script.inc').matchAll(/\.macro\s+(\w+)\s+([^\n]+)\n([\s\S]*?)\.endm/g))if(/createsprite/.test(m[3]))macros[m[1]]={params:m[2].split(',').map(p=>p.trim().split(':')[0]),body:m[3].trim()};
function expand(line){
 const m=line.trim().match(/^(\w+)\s+(.*)$/),macro=m&&macros[m[1]];if(!macro)return [line];
 const values={},pos=m[2].split(',').map(p=>p.trim());let i=0;
 for(const p of pos){const eq=p.indexOf('=');if(eq>0)values[p.slice(0,eq).trim()]=p.slice(eq+1).trim();else values[macro.params[i++]]=p}
 return macro.body.replace(/\\(\w+)/g,(_,key)=>values[key]||'0').split(/\r?\n/);
}
const lines=read('data/battle_anim_scripts.s').split(/\r?\n/).flatMap(expand),labels={};
const unresolvedSprites=new Set(),branchCommands=new Set();
lines.forEach((l,i)=>{const m=l.match(/^(\w+)::?\s*(?:@.*)?$/);if(m)labels[m[1]]=i+1});
function sequence(label){
 const events=[],tasks=[],taskEvents=[],paletteEvents=[],sounds=[],backgrounds=[],choices=[],loaded=new Set();let clock=0,budget=2200;
 function visit(name,depth=0){if(depth>10||labels[name]==null)return;let pc=labels[name];
  while(pc<lines.length&&--budget>0&&events.length<160){
   const line=lines[pc++].replace(/@.*/,'').trim();if(!line||/^\w+::?$/.test(line))continue;
   const [cmd,...rest]=line.split(/\s+/),arg=rest.join(' '),args=arg.split(',').map(s=>s.trim());
   if(cmd==='end'||cmd==='return')return;
   if(cmd==='delay')clock+=Math.max(0,parseInt(arg)||0)/60;
   if(cmd==='waitforvisualfinish')clock+=.12;
   if(cmd==='loadspritegfx')loaded.add(arg);
   if(cmd==='call')visit(args[0],depth+1);
   if(cmd==='goto'){if(labels[args[0]]==null)return;pc=labels[args[0]];}
   if(cmd==='choosetwoturnanim'||cmd==='choosetwoturnanim2'){choices.push(...args);const begin=clock;visit(args[0],depth+1);clock=begin;visit(args[1],depth+1);return;}
   if(cmd==='createsprite'&&templates[args[0]])events.push({t:+clock.toFixed(3),sprite:args[0],anchor:args[1],args:args.slice(3)});
   if(cmd==='createsprite'&&!templates[args[0]]){
    if(proceduralTemplates[args[0]]){tasks.push(proceduralTemplates[args[0]]);taskEvents.push({t:+clock.toFixed(3),name:proceduralTemplates[args[0]],args:args.slice(3)})}
    else unresolvedSprites.add(args[0]);
   }
   if(/^jumpif|^jumparg|^choosetwo/.test(cmd))branchCommands.add(cmd);
   if(cmd==='createvisualtask'){tasks.push(args[0]);taskEvents.push({t:+clock.toFixed(3),name:args[0],args:args.slice(2)})}
   if(/palette|blend_color|flash_anim|setalpha|blendoff/.test(cmd))paletteEvents.push({t:+clock.toFixed(3),command:cmd,args});
   if(cmd==='createsoundtask'){const id=args.find(a=>/^SE_/.test(a));if(id)sounds.push({t:+clock.toFixed(3),id})}
   if(/^(playse|playsewithpan|panse|panse_1B|panse_26|loopsewithpan|waitplaysewithpan)$/.test(cmd)&&/^SE_/.test(args[0]))sounds.push({t:+clock.toFixed(3),id:args[0]});
   if(cmd==='fadetobg')backgrounds.push(args[0]);
  }
 }
 visit(label);return {events,tasks:[...new Set(tasks)],taskEvents,paletteEvents,sounds,backgrounds:[...new Set(backgrounds)],choices:[...new Set(choices)],tags:[...loaded],duration:+clock.toFixed(3)};
}
const moves={};
for(const m of read('include/constants/moves.h').matchAll(/^#define MOVE_(\w+) (\d+)\s*$/gm))if(+m[2]>0&&+m[2]<=354)moves[m[1]]={id:+m[2],...sequence('Move_'+m[1])};
for(const move of Object.values(moves))move.variants=move.choices.map(label=>({label,...sequence(label)}));
// Every move is retained in the catalog, including moves whose visuals use only tasks.
const out=path.join(root,'assets/move-fx');fs.mkdirSync(out,{recursive:true});
const used=new Set(Object.values(moves).flatMap(m=>m.events.map(e=>e.sprite)));
for(const move of Object.values(moves)){
 move.resources=Object.keys(templates).filter(k=>move.tags.includes(templates[k].tag));
 move.resources.forEach(k=>used.add(k));
}
const selected=Object.fromEntries(Object.entries(templates).filter(([k])=>used.has(k)));
const resources={};
for(const t of Object.values(selected)){
 const key=t.png+'|'+(t.pal||t.png);
 if(!resources[key])resources[key]={name:'sheet-'+Object.keys(resources).length,png:t.png,pal:t.pal||t.png};
 t.sheet=resources[key].name;delete t.png;delete t.pal;
}
fs.writeFileSync(path.join(out,'emerald-catalog.js'),'/* Generated from pret/pokeemerald; see README.md. */\nwindow.EMERALD_CATALOG='+JSON.stringify({moves,templates:selected})+';\n');
fs.writeFileSync(path.join(root,'tmp/emerald-source/resources.json'),JSON.stringify(Object.values(resources),null,2));
console.log(JSON.stringify({moves:Object.keys(moves).length,templates:used.size,sheets:Object.keys(resources).length,scripted:Object.values(moves).filter(m=>m.events.length).length}));
const sandbox={window:{}};require('vm').runInNewContext(fs.readFileSync(path.join(out,'aliases.js'),'utf8'),sandbox);
const aliases=sandbox.window.EMERALD_ALIASES;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),names=new Set();
const types='fire|water|grass|electric|ice|fighting|poison|ground|flying|psychic|bug|rock|ghost|dragon|dark|steel|fairy|normal';
const kinds='bolt|blast|burst|beam|drain|rush|multi|chain|storm|heal|field|barrage|meteor|buff|barrier';
const pattern=new RegExp("\\[\\s*'((?:\\\\.|[^'\\\\])*)'\\s*,\\s*'(?:"+types+'|'+kinds+")'",'g');
const roster=html.slice(html.indexOf('const LINES=[]'),html.indexOf('const PASSIVES='));
for(const m of roster.matchAll(pattern)){const name=m[1].replace(/\\'/g,"'");if(!types.split('|').includes(name)&&!kinds.split('|').includes(name))names.add(name)}
const rows=[...names].sort().map(name=>{const key=aliases[name],move=moves[key];return '| '+name+' | '+(key||'SEM ASSOCIAÇÃO')+' | '+(move?.events.length||0)+' |'});
fs.writeFileSync(path.join(out,'MAPPING.md'),'# Associação visual dos golpes do OakChess\n\nGerado pelo importador a partir do código do jogo e de aliases.js. Golpes próprios e posteriores à terceira geração usam equivalentes visuais; não alteram os nomes ou regras das habilidades. Redemoinho de Água usa WHIRLPOOL; o de Voador usa WHIRLWIND.\n\n| Golpe | Referência Emerald | Eventos de sprites na sequência |\n|---|---|---|\n'+rows.join('\n')+'\n');
console.log(JSON.stringify({mappedNames:names.size,unmapped:[...names].filter(n=>!moves[aliases[n]])}));
const callbacks=[...new Set(Object.values(selected).map(t=>t.callback).filter(Boolean))].sort();
const tasks=[...new Set(Object.values(moves).flatMap(m=>m.tasks))].sort();
const report='# Cobertura da integração Emerald\n\nGerado a partir da fonte, sem executar o jogo.\n\n'+
'- Golpes registrados: '+Object.keys(moves).length+'\n- Modelos locais de sprites: '+used.size+'\n- Folhas/paletas locais: '+Object.keys(resources).length+'\n- Callbacks C referenciados pelos sprites: '+callbacks.length+'\n- Tarefas visuais C referenciadas: '+tasks.length+'\n- Golpes com eventos de paleta: '+Object.values(moves).filter(m=>m.paletteEvents.length).length+'\n- Golpes com ramificações de dois turnos: '+Object.values(moves).filter(m=>m.variants.length).length+'\n\n'+
'## Execução no OakChess\n\nQuadros, inversões e transformações numéricas têm interpretação local. Sequências são divididas entre preparação, projétil e impacto, respeitando o momento do dano real. Paletas e tarefas de cor têm adaptação local. Órbitas, espirais, ricochetes e oscilações usam famílias de movimento adaptadas. Reduções de quantidade/duração respeitam qualidade e efeitos reduzidos.\n\n'+
'## Limites que continuam presentes\n\nOs callbacks C e as tarefas abaixo não são executados como código GBA. Algumas famílias possuem adaptação, outras usam um efeito equivalente. Listá-los ou importar suas referências não significa reprodução integral. Reprodução fiel de todos eles exige portas específicas ou um interpretador compatível com o motor GBA, inclusive seus estados de turnos, concursos e trocas.\n\n'+
'Comandos condicionais encontrados: '+[...branchCommands].sort().join(', ')+'.\n\n'+
'Sprites sem modelo importável: '+(unresolvedSprites.size?[...unresolvedSprites].sort().join(', '):'nenhum nos caminhos percorridos')+'.\n\n'+
'### Callbacks dos sprites\n\n'+callbacks.map(n=>'- `'+n+'`').join('\n')+'\n\n### Tarefas visuais\n\n'+tasks.map(n=>'- `'+n+'`').join('\n')+'\n';
fs.writeFileSync(path.join(out,'COVERAGE.md'),report);
