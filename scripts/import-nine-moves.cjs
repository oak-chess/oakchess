/* Narrow import of the missing playable move graphics from the expansion.
 * Source callbacks are referenced, not executed as GBA code. */
const fs=require('fs'),vm=require('vm');
const root='tmp/dex-source/',graphics=fs.readFileSync(root+'src_graphics.c','utf8'),tables=fs.readFileSync(root+'src_data_battle_anim.h','utf8');
const text=fs.readdirSync(root).filter(n=>/^src_battle_anim.*\.c$/.test(n)).map(n=>fs.readFileSync(root+n,'utf8')).join('\n');
const gfx={},tags={},anims={},lists={},templates={},resources=[];
for(const m of graphics.matchAll(/const u(?:8|16|32)\s+(\w+)\[\]\s*=\s*INC(?:GFX|BIN)_U\d+\("([^"]+)"/g))gfx[m[1]]=m[2];
for(const m of tables.matchAll(/BATTLE_ANIMATION\((ANIM_TAG_\w+),\s*(\w+),\s*[^,]+,\s*(\w+)\)/g))tags[m[1]]={png:gfx[m[2]],pal:gfx[m[3]]};
for(const m of text.matchAll(/(?:static\s+)?const union AnimCmd\s+(\w+)\[\]\s*=\s*\{([\s\S]*?)\};/g)){
 const frames=[...m[2].matchAll(/ANIMCMD_FRAME\(\s*(\d+),\s*(\d+)([^)]*)\)/g)].map(f=>[+f[1],+f[2],/hFlip\s*=\s*TRUE/.test(f[3])?1:0,/vFlip\s*=\s*TRUE/.test(f[3])?1:0]);
 anims[m[1]]={frames,loop:/ANIMCMD_JUMP/.test(m[2])};
}
for(const m of text.matchAll(/const union AnimCmd\s*\*\s*const\s+(\w+)\[\]\s*=\s*\{([\s\S]*?)\};/g))lists[m[1]]=[...m[2].matchAll(/\b([sg]\w+)\b/g)].map(m=>m[1]);
const selected=new Set(['gAuraSphereBlast','gDarkPulseSpriteTemplate','gNightSlashLeftSpriteTemplate','gNightSlashRightSpriteTemplate','gDragonPulseSpriteTemplate','gFlashCannonGrayChargeTemplate']);
function sheet(png,pal=png){
 if(!png)throw Error('Missing graphics reference');
 let entry=resources.find(r=>r.png===png&&r.pal===pal);
 if(!entry){entry={name:'nine-'+resources.length,png,pal};resources.push(entry)}
 return entry.name;
}
for(const m of text.matchAll(/const struct SpriteTemplate\s+(\w+)\s*=\s*\{([\s\S]*?)\};/g)){
 if(!selected.has(m[1]))continue;
 const field=n=>m[2].match(new RegExp('\\.'+n+'\\s*=\\s*&?(\\w+)'))?.[1],tag=field('tileTag'),size=field('oam')?.match(/(\d+)x(\d+)/),resource=tags[tag];
 templates[m[1]]={tag,sheet:sheet(resource?.png,tags[field('paletteTag')]?.pal||resource?.pal),w:+size?.[1]||32,h:+size?.[2]||32,callback:field('callback'),animations:(lists[field('anims')]||[]).map(n=>anims[n]).filter(a=>a?.frames.length),affines:[]};
}
for(const name of selected)if(!templates[name])throw Error('Missing template '+name);
templates.gOakAuraSphereOrb={tag:'ANIM_TAG_AURA_SPHERE',sheet:sheet('graphics/battle_anims/sprites/aura_sphere.png'),w:32,h:32,callback:'OakAuraSphereTravel',animations:[],affines:[]};
templates.gFlashCannonBallMovementTemplate={tag:'ANIM_TAG_FLASH_CANNON_BALL',sheet:sheet('graphics/battle_anims/sprites/flash_cannon_ball.png'),w:32,h:32,callback:'OakFlashCannonTravel',animations:[],affines:[]};
const box={window:{}};vm.runInNewContext(fs.readFileSync('assets/move-fx/emerald-catalog.js','utf8'),box);
// Iron Head ends with the source's flashing hit splat; bow/metallic shine are ported separately.
const splat=Object.keys(box.window.EMERALD_CATALOG.templates).find(n=>/BasicHitSplat/.test(n));
if(!splat)throw Error('Missing Iron Head impact resource');
const config={SURF:{id:57,kind:'wave',duration:1.05},HARDEN:{id:106,kind:'metal',duration:.8},AURA_SPHERE:{id:396,kind:'orb',sprite:'gOakAuraSphereOrb',impact:'gAuraSphereBlast',duration:.65},DARK_PULSE:{id:399,kind:'pulse',sprite:'gDarkPulseSpriteTemplate',duration:.7},NIGHT_SLASH:{id:400,kind:'slash',sprite:'gNightSlashLeftSpriteTemplate',second:'gNightSlashRightSpriteTemplate',duration:.65},AIR_SLASH:{id:403,kind:'air',sprite:'gSlashSliceSpriteTemplate',duration:.55},DRAGON_PULSE:{id:406,kind:'pulse',sprite:'gDragonPulseSpriteTemplate',duration:.7},FLASH_CANNON:{id:430,kind:'cannon',sprite:'gFlashCannonBallMovementTemplate',charge:'gFlashCannonGrayChargeTemplate',duration:.7},IRON_HEAD:{id:442,kind:'head',impact:splat,duration:.5}};
fs.writeFileSync('assets/move-fx/nine-catalog.js','/* Imported expansion graphics; movement adapters in nine-moves.js. */\nwindow.OAK_NINE_MOVES='+JSON.stringify(config)+';\nObject.assign(window.EMERALD_CATALOG.templates,'+JSON.stringify(templates)+');\n');
fs.writeFileSync(root+'nine-resources.json',JSON.stringify(resources,null,2));
console.log(JSON.stringify(resources));
