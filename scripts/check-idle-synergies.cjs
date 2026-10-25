const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('modes/idle/index.html','utf8');
const definitions=html.slice(html.indexOf('const TRAITS={'),html.indexOf('const TID={'));
function read(idle){const c={window:{OAK_IDLE_MODE:idle}};vm.createContext(c);vm.runInContext(definitions+';this.traits=TRAITS',c);return c.traits}
const before=read(false),after=read(true);
assert.equal(Object.keys(after).length,18);
for(const [type,t]of Object.entries(after)){
 assert.equal(t.tiers.at(-1),6,type+' maximum');assert.equal(t.tiers.length,t.v.length);
 assert.deepEqual(Array.from(t.tiers.slice(0,before[type].tiers.length)),Array.from(before[type].tiers));
 assert.deepEqual(Array.from(t.v.slice(0,before[type].v.length)),Array.from(before[type].v));
 for(let i=1;i<t.tiers.length;i++){assert(t.tiers[i]>t.tiers[i-1]);assert(t.v[i]>t.v[i-1])}
 assert(t.v.every(Number.isFinite));
}
const start=html.indexOf('function typeCounts('),end=html.indexOf('\n',html.indexOf('function tierOf(',start));
const applyStart=html.indexOf('function applyTraits('),applyEnd=html.indexOf('/* ---------- alvo',applyStart);
const c={TRAITS:after,LINES:[],typesOf:L=>L.types};vm.createContext(c);
vm.runInContext(html.slice(start,end)+html.slice(applyStart,applyEnd)+';this.count=typeCounts;this.apply=applyTraits',c);
function unit(type,line){return {line,types:[type],maxHp:100,hp:100,as:1,atk:100,manaRegen:0,regen:0,dodge:0,ap:0,ls:0,armor:0,dmgAmp:0,crit:.15,critDmg:1.5,dr:0,shield:0}}
for(const type of Object.keys(after)){
 c.LINES.length=0;for(let i=0;i<6;i++)c.LINES.push({types:[type]});
 const team=Array.from({length:6},(_,i)=>unit(type,i)),foe={as:1};
 assert.equal(c.count(team)[type],6);assert.equal(c.count([team[0],team[0]])[type],1);
 assert.equal(c.apply(team,[foe])[type],6);
 const u=team[0],v=after[type].v.at(-1);
 const result={normal:u.maxHp/100-1,ground:u.maxHp/100-1,fire:u.burnV,water:u.manaRegen,grass:u.regen,electric:u.as-1,ice:u.freezeCh,fighting:u.atk/100-1,poison:u.shredV,flying:u.dodge,psychic:u.ap,bug:u.ls,rock:u.armor,dragon:u.dmgAmp,dark:u.crit-.15,steel:u.dr,fairy:u.shield/100,ghost:1-foe.as}[type];
 assert(Math.abs(result-v)<1e-8,type+' combat bonus');
}
console.log('Passed: 18 six-partner synergies, preserved earlier bonuses, increasing tiers, family deduplication and all actual combat bonuses.');
