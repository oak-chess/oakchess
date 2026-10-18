/* One active cast at a time; spare mana is kept for a later cast. */
(()=>{
 const timings={bolt:.75,blast:.9,burst:.75,beam:.95,drain:.8,rush:.75,multi:1.05,chain:.95,storm:1.5,heal:.8,field:.85,barrage:1.3,meteor:1.55,buff:.8,barrier:.8};
 window.SKILL_RHYTHM={
  ready(u){return B.t>=(u.skillReadyAt||0)&&B.t>=(u.castingUntil||0)&&B.t>=(u.basicAnimationUntil||0)&&!(u.skillToken?.pending>0)},
  begin(u,mv){
   const life=timings[mv.k]||.85;
   u.mana=Math.max(0,u.mana-u.maxMana);u.castingUntil=B.t+life;u.skillReadyAt=u.castingUntil+.4;
   u.lock=Math.max(u.lock||0,life);u.skillToken={owner:u,pending:0,units:B.units};
   return u.skillToken;
  },
  launch(token){if(token)token.pending++},
  arrive(token){if(!token)return;token.pending=Math.max(0,token.pending-1);if(token.units===B.units)token.owner.skillReadyAt=Math.max(token.owner.skillReadyAt||0,B.t+.3)},
  status(u){
   const charges=Math.min(2,Math.floor(u.mana/u.maxMana)),remaining=Math.max(0,(u.skillReadyAt||0)-B.t);
   return {charges,remaining,casting:B.t<(u.castingUntil||0),waiting:charges>0&&!this.ready(u)};
  }
 };
 const style=document.createElement('style');style.textContent='.unit .mnb{position:relative}.unit .mnb::after{content:"";position:absolute;left:50%;top:0;bottom:0;border-left:1px solid #ecfaffbb}.unit.skill-wait .mnb i{background:linear-gradient(#e8c87b,#b88d3d)}.unit.skill-casting .mnb{box-shadow:0 0 4px #91dfff}';document.head.appendChild(style);
})();
