const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const prototype=fs.readFileSync(path.join(root,'prototypes/ghost-shadow/impact.js'),'utf8').replace(/\r/g,'');
const a=prototype.indexOf('  function shadow('),b=prototype.indexOf('\n  function frame(',a);
if(a<0||b<0)throw Error('Approved shadow renderer not found');
let shapes=prototype.slice(a,b);
// Misdreavus also uses the shadow passive; retain its own hair/eyes rather than Gengar's face.
shapes=shapes.replace("   g.fillStyle='#1c1627';g.beginPath();",`   if(ghost.id===200){
    g.fillStyle='#1c1627';g.beginPath();g.moveTo(-23,9);g.bezierCurveTo(-43,5,-29,-8,-35,-23);g.quadraticCurveTo(-18,-18,-16,-32);g.quadraticCurveTo(0,-42,17,-29);g.quadraticCurveTo(34,-29,26,-13);g.quadraticCurveTo(45,5,24,14);g.quadraticCurveTo(0,27,-23,9);g.fill();
    g.fillStyle='#d1b86e';for(const side of [-1,1]){g.beginPath();g.ellipse(side*12,-9,7,5,side*.25,0,Math.PI*2);g.fill();g.fillStyle='#954c66';g.fillRect(side*12-1,-13,3,7);g.fillStyle='#d1b86e'}g.fillStyle='#b66679';g.fillRect(-3,5,6,3);g.restore();return;
   }
   g.fillStyle='#1c1627';g.beginPath();`);
const output=fs.readFileSync(path.join(root,'scripts/ghost-shadow-runtime.txt'),'utf8').replace('/* APPROVED_SHADOW_SHAPES */',shapes);
new Function(output);fs.writeFileSync(path.join(root,'assets/ghost-shadow.js'),output);
console.log('Ghost shadow renderer built.');
