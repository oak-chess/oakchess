/* Soundtrack selection for the official Jornada Idle, using the native audio mixer. */
window.createIdleMusic=function(ctx){
 const habitat={forest:'forest',deepwood:'forest',hive:'forest',meadow:'meadow',cliffs:'meadow',dunes:'meadow',garden:'garden',safari:'garden',cave:'cave',quarry:'cave',ironmine:'cave',ancient:'cave',lake:'water',beach:'water',abyss:'water',marsh:'ghost',ghost:'ghost',haunted:'ghost',psychic:'ghost',frost:'ice',glacier:'ice',dragon:'dragon',summit:'dragon',ember:'volcano',volcano:'volcano',inferno:'volcano',power:'trainer',dojo:'trainer',champions:'gym',frontier:'gym'};
 let lastKey=null;
 function key(){const challenge=ctx.challenge();if(challenge){if(challenge.kind==='rocket')return ctx.combat()?'rocket-battle':'rocket-hideout';if(challenge.kind==='legendary')return 'idle-'+(['Mew','Mewtwo'].includes(challenge.label)?'mewtwo':'birds');return 'idle-'+(['boss','rematch','league','tower'].includes(challenge.kind)?'gym':'trainer')}
 if(document.querySelector('#idle-shop:not([hidden])'))return 'idle-shop';
 if(ctx.center())return 'idle-center';
 return 'idle-'+(habitat[ctx.state.hunts?.kind]||'meadow')}
 function sync(force=false){const selected=key();if(force||selected!==lastKey){lastKey=selected;SND.music(ctx.combat()?'battle':'plan')}}
 function mount(){window.IDLE_MUSIC={key};sync(true);setInterval(()=>{if(!document.hidden)sync()},500);document.addEventListener('pointerdown',()=>{SND.init();sync(true)},{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync(true)})}
 return {mount,sync};
};
