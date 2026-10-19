/* New illustrated landmarks placed on the arena rim, outside the hexagons. */
(()=>{
 const art=window.VOLCANO_LAVA_ART;if(!art)return;
 const before=atmosphere,images={};let enabled=true;
 const pieces=[
  ['brazier',-337,-188,82,1,17],['brazier',334,130,78,-1,17],
  ['obsidian',-337,130,86,-1,16],['obsidian',337,-132,88,1,16],
  ['vent',-181,-312,96,1,17],['vent',193,-306,88,-1,17],
  ['obsidian',-324,283,65,1,14],['brazier',326,275,68,-1,14]
 ];
 // Keep the new rim pieces separate from small older outcrops at the same locations.
 for(let i=art.groups.length-1;i>=0;i--){const g=art.groups[i];if(g[0]==='outcrop'&&Math.abs(g[1])<385&&pieces.some(p=>Math.hypot(p[1]-g[1],p[2]-g[2])<78))art.groups.splice(i,1)}
 art.groups.push(...pieces);art.groups.sort((a,b)=>a[2]-b[2]);
 for(const [key,file]of Object.entries({brazier:'basalt-brazier-v1.png',obsidian:'obsidian-geode-v1.png',vent:'sulfur-vent-v1.png'})){
  const image=new Image();images[key]=image;art.assets[key]=image;image.onload=()=>{if(enabled)art.assets[key]=image;sceneKey=''};image.src='assets/'+file;
 }
 const row=document.createElement('label');row.className='row';row.innerHTML='Detalhes da arena <input type="checkbox" checked>';document.querySelector('.controls h2').after(row);
 row.querySelector('input').onchange=e=>{enabled=e.target.checked;for(const key of Object.keys(images))art.assets[key]=enabled?images[key]:null;sceneKey=''};
 $('reset').addEventListener('click',()=>{enabled=true;row.querySelector('input').checked=true;Object.assign(art.assets,images);sceneKey=''});
 atmosphere=function(){before();if(!enabled||!config.decor||!config.elements)return;const t=reducedMotion?0:time,power=config.energy/100;
  for(let index=0;index<pieces.length;index++){
   const [kind,x,y,,,z]=pieces[index];if(kind==='obsidian')continue;
   if(kind==='brazier'){
    const p=point(x,y,z+23),r=25*p.s,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'rgba(255,146,47,'+(.1+power*.08)+')');g.addColorStop(1,'#ff8a2000');c.save();c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore();
    if(!reducedMotion)for(let j=0;j<(config.quality==='low'?2:5);j++){
     const age=(t*.47+j*.21+index*.17)%1,q=point(x+Math.sin(t*1.8+j)*4,y,z+23+age*27);c.save();c.globalAlpha=Math.sin(age*Math.PI)*.8*power;c.fillStyle=j%2?'#ffd687':'#fa9c42';c.beginPath();c.ellipse(q.x,q.y,1.2*q.s,2.2*q.s,.2,0,Math.PI*2);c.fill();c.restore();
    }
   }else if(config.clouds){
    for(let j=0;j<(config.quality==='low'?2:4);j++){
     const age=reducedMotion?.4:(t*.19+j*.26+index*.13)%1,p=point(x+Math.sin(t*.4+j)*age*9,y,z+11+age*58),r=(8+age*21)*p.s,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'rgba(216,188,159,'+Math.sin(age*Math.PI)*.14+')');g.addColorStop(1,'#ad867000');c.save();c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);c.restore();
    }
   }
  }
 };
})();
