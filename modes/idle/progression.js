/* Shared experience curve: trainer and partners have separate accumulated progress. */
window.IDLE_XP={
 need(level){const n=Math.max(1,Math.floor(level));return 50*(n*n-3*n+4)},
 add(member,amount){member.xp=Math.max(0,Number(member.xp)||0)+Math.max(0,Math.round(amount));while(member.xp>=this.need(member.level)){member.xp-=this.need(member.level);member.level++}member.xpSchema=2;member.lastXpGain=Math.max(0,Math.round(amount));member.earnedXp=(member.earnedXp||0)+member.lastXpGain},
 trainer(state,amount){const m={level:state.trainerLevel,xp:state.trainerXp};this.add(m,amount);state.trainerLevel=m.level;state.trainerXp=m.xp},
 migrate(state){if(state.levelSchema===2)return;for(const m of [...state.team,...(state.collection||[])]){m.xp=Math.floor(Math.min(.999,Math.max(0,(m.xp||0)/(m.level*12)))*this.need(m.level));m.xpSchema=2;m.legacyEvolution=m.star>1}state.trainerXp=Math.floor(Math.min(.999,Math.max(0,state.trainerXp/(state.trainerLevel*20)))*this.need(state.trainerLevel));state.levelSchema=2}
};
