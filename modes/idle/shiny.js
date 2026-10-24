/* Shiny rules for the idle prototype; these are OakChess balance choices. */
window.IDLE_SHINY={rate:.000122,minIV:26,minPower:4,captureFactor:.25,captureCap:.25,
 sprite(src,shiny){return shiny?src.replace(/(\d+)\.(gif|png)$/,'shiny/$1.$2'):src},
 chance(state,L,maxHp,shiny,config=state.capture,speciesId=L.ids[0]){const simulated={...state,capture:{...state.capture,ball:config.ball}},base=window.IDLE_ITEMS.chance(simulated,L,maxHp,speciesId);if(base===null||!shiny)return base;return config.ball==='master'?1:Math.min(this.captureCap,base*this.captureFactor)}
};
