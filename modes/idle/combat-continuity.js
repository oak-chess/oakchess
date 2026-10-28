/* Keep a partner's energy and next move between ordinary hunt encounters.
 * Does not change move availability, costs, cooldowns or saved species. */
window.IDLE_COMBAT_CONTINUITY=(()=>{
 const moveKey=move=>move?.id!=null?'id:'+move.id:'move:'+(move?.emerald||move?.n||'');
 const limit=(unit,capacity)=>Math.max(0,Number.isFinite(capacity)?capacity:(Number(unit.maxMana)||0)*2);
 const energy=(value,max)=>Math.max(0,Math.min(max,Number.isFinite(value)?value:0));
 function capture(member,unit,capacity){
  if(!member||member.id==null||!unit?.moves?.length)return false;
  const cursor=Number.isFinite(unit.mi)?Math.max(0,Math.floor(unit.mi)):0;
  member.combatCarry={version:1,owner:member.id,next:moveKey(unit.moves[cursor%unit.moves.length]),mana:unit.alive===false?0:energy(unit.mana,limit(unit,capacity))};return true;
 }
 function restore(member,unit,capacity){
  const saved=member?.combatCarry;
  if(!unit?.moves?.length||saved?.version!==1||saved.owner!==member.id)return false;
  const index=unit.moves.findIndex(move=>moveKey(move)===saved.next);
  unit.mi=index<0?0:index;unit.mana=energy(saved.mana,limit(unit,capacity));return true;
 }
 return {capture,restore,moveKey};
})();
