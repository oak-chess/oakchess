// Native scene coordinates; included in the live Rocket arena factory by the builder.
function lavenderScenery(){
 const level=Math.min(4,Math.floor(lavenderStep/10)),tints=['#353044','#393047','#40334f','#403045','#492e41'];
 c.fillStyle='#141320';c.fillRect(-640,0,2560,800);
 for(let y=-540;y<540;y+=90)for(let x=-990;x<990;x+=90)poly([[x,y,-30],[x+88,y,-30],[x+88,y+88,-30],[x,y+88,-30]],(x/90+y/90)%2?tints[level]:'#292737','#5c4e67');
 poly([[-820,-470,-29],[820,-470,-29],[820,-470,205],[-820,-470,205]],'#2e293e','#8d729c');
 for(const side of [-1,1])poly([[side*820,-470,-29],[side*820,470,-29],[side*820,470,95],[side*820,-470,205]],'#252337','#6b5c7c');
 label(['ENTRADA DA TORRE','GALERIA DAS MEMÓRIAS','SALÃO DOS ECOS','ESCADARIA DOS ESPÍRITOS','REFÚGIO DO SR. FUJI'][level],0,-465,168,22,'#dac4e6');
 for(const x of [-730,-560,490,660]){
  box(x,-420,155,65,65,181,['#766581','#302a42','#4a3d58','#a28cb0']);
  for(const y of [-260,-40,180]){
   box(x,y,-4,74,67,22,['#6e6377','#332c40','#483b55','#ac94ba']);
   poly([[x+9,y+28,0],[x+62,y+28,0],[x+62,y+28,67],[x+53,y+28,82],[x+19,y+28,82],[x+9,y+28,67]],'#72637d','#bca6c8');
   line([x+22,y+29,42],[x+50,y+29,42],'#c3a7d1',2);line([x+27,y+29,30],[x+46,y+29,30],'#a991b6',2);
   for(let i=0;i<3;i++)ellipse(x+25+i*9,y+53,0,4,3,i%2?'#d3b6d8':'#a68bc5');
  }
 }
 // Raised stairway leads onward, outside the combat footprint.
 for(let i=0;i<5;i++)box(-150,-410+i*18,34-i*8,300,20,12,['#81718b','#3c334b','#54445f','#b5a0c3']);
 poly([[-105,-465,16],[105,-465,16],[105,-465,145],[-105,-465,145]],'#191724','#9c82af');
 label(level===4?'SR. FUJI':'PRÓXIMO ANDAR',0,-464,100,18,'#d7c0e2');
 for(const x of [-420,420])for(const y of [-260,120,330]){
  box(x-17,y-17,44,34,34,70,['#81728a','#352d46','#57485f','#b4a0bf']);
  const shimmer=state.effects?Math.sin(time*2+x+y)*2:0;
  ellipse(x,y,55+shimmer,5,10,'#e7c486');
  if(!state.reduceFlashes)glow(x,y,55,60,'#e8bc6630');
 }
 if(state.effects){c.save();c.globalAlpha=.09;for(let i=0;i<6;i++){const x=Math.sin(time*.13+i)*570,y=-240+i*125;ellipse(x,y,-20,180,18,'#b9a7ce')}c.restore()}
}
function lavenderField(){
 // Reuse the approved physical field, then replace its Rocket lettering.
 board();
 poly([[-110,-75,11],[110,-75,11],[110,75,11],[-110,75,11]],'#28263a','#79658c');
 const ring=Array.from({length:61},(_,i)=>{const a=i/60*Math.PI*2;return[60*Math.cos(a),60*Math.sin(a),12]});
 for(let i=1;i<ring.length;i++)line(ring[i-1],ring[i],'#b99acb',2);
 line([-60,0,12],[60,0,12],'#b99acb',2);ellipse(0,0,13,13,10,'#d2b8dd');
 poly([[-280,-282,25],[280,-282,25],[280,-260,25],[-280,-260,25]],'#252337');
 label('TORRE POKÉMON / LAVENDER',0,-268,26,12,'#d6bfdf');
}
