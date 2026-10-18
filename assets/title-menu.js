(function(){
const root=document.getElementById('tpress'),menu=document.getElementById('tmain');
if(!root||!menu)return;
const toggle=document.createElement('button');toggle.type='button';toggle.id='titleMenuToggle';toggle.setAttribute('aria-label','Abrir menu principal');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','tmain');toggle.innerHTML='<span class="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span><span>MENU</span><b class="hamburger-reward" aria-hidden="true"></b>';root.prepend(toggle);
const items=()=>[...menu.querySelectorAll('.r2 .ti')];
const descriptions={pokedex:'Pokémon e animações',achievements:'Desafios e recompensas',history:'Suas últimas jornadas',scores:'Seus melhores resultados',battleReports:'Detalhes das batalhas',options:'Áudio, jogo e visual'};
const icons={
 pokedex:'<path d="M4 1h9v14H3V3h1z"/><path d="M5 8h6v4H5zM7 3h4v3H7z" fill="#14283b"/><path d="M4 2h2v2H4zM5 13h2v1H5z" fill="#fff2be"/>',
 achievements:'<path d="M6 1h4v3h4v3h-2v2h-2v5H6V9H4V7H2V4h4z"/><path d="M7 10h2v3H7z" fill="#14283b"/>',
 history:'<path d="M5 1h6v2h2v2h2v6h-2v2h-2v2H5v-2H3v-2H1V5h2V3h2z"/><path d="M5 3h6v2h2v6h-2v2H5v-2H3V5h2z" fill="#14283b"/><path d="M7 4h2v4h3v2H7z"/>',
 scores:'<path d="M4 1h8v2h3v6h-3v2H9v2h3v2H4v-2h3v-2H4V9H1V3h3z"/><path d="M3 5h1v2H3zM12 5h1v2h-1z" fill="#14283b"/>',
 battleReports:'<path d="M3 1h8v2h2v12H3z"/><path d="M5 5h6v1H5zM5 8h2v4H5zM8 7h2v5H8zM11 9h1v3h-1z" fill="#14283b"/>',
 options:'<path d="M6 1h4v2h3v3h2v4h-2v3h-3v2H6v-2H3v-3H1V6h2V3h3z"/><path d="M6 5h4v1h1v4h-1v1H6v-1H5V6h1z" fill="#14283b"/>'
};
let decorated='';
function organize(){
 const row=menu.querySelector('.r2');if(!row)return;const all=items(),signature=all.map(el=>el.dataset.act).sort().join('|');if(signature===decorated)return;decorated=signature;
 if(!menu.querySelector('.title-tools-heading')){const header=document.createElement('div');header.className='title-tools-heading';header.innerHTML='<span class="title-tools-ball" aria-hidden="true"></span><div><small>SEU ESPAÇO</small><b>Central do treinador</b></div>';menu.prepend(header)}
 row.querySelectorAll('.title-tools-group').forEach(el=>el.remove());
 for(const [label,actions] of [['COLEÇÃO',['pokedex','achievements']],['REGISTROS',['history','scores','battleReports']],['PREFERÊNCIAS',['options']]]){
  const group=document.createElement('div');group.className='title-tools-group';group.textContent=label;group.setAttribute('role','presentation');row.append(group);
  for(const action of actions){const el=all.find(item=>item.dataset.act===action);if(!el)continue;
   if(!el.querySelector('.title-tools-icon')){const icon=document.createElement('span');icon.className='title-tools-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 16 16" fill="currentColor" shape-rendering="crispEdges">'+(icons[action]||icons.options)+'</svg>';el.prepend(icon);
    const copy=document.createElement('span');copy.className='title-tools-copy';const title=el.querySelector('.tl');if(title)copy.append(title);const note=document.createElement('small');note.textContent=descriptions[action]||'';copy.append(note);el.append(copy);
   }
   row.append(el);
  }
 }
}
organize();new MutationObserver(organize).observe(menu,{childList:true,subtree:true});
function setOpen(on,focus=false){root.classList.toggle('tools-open',on);toggle.setAttribute('aria-expanded',String(on));toggle.setAttribute('aria-label',on?'Fechar menu principal':'Abrir menu principal');menu.inert=!on;items().forEach(el=>{el.tabIndex=on?0:-1;el.classList.remove('sel')});if(on&&focus)items()[0]?.focus();else if(!on&&focus)toggle.focus()}
setOpen(false);
toggle.onclick=e=>{e.stopPropagation();SND.init();SND.click();setOpen(!root.classList.contains('tools-open'),true)};
menu.addEventListener('click',e=>{if(e.target.closest('.r2 .ti'))setOpen(false)},true);
document.addEventListener('pointerdown',e=>{if(!root.contains(e.target))setOpen(false)});
window.addEventListener('keydown',e=>{
 if(document.querySelector('#pokedex.show,#battleReports.show'))return;
 if(LAB.st!=='title'||!root.classList.contains('tools-layout')||document.querySelector('#menu.show,#hist.show,#scores.show,#achievements.show'))return;
 const opened=root.classList.contains('tools-open'),inside=root.contains(e.target),launcher=e.target===toggle;
 if(!opened&&!launcher&&!(TM.view==='main'||TM.view==='tower'))return;
 if(!opened&&!launcher&&!['Enter',' ','ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 if(!inside&&opened)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setOpen(false,true);return}
 if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();if(!opened){setOpen(true,true);return}const all=items(),i=all.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?all.length-1:(i+(e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:1)+all.length)%all.length;all[next]?.focus();return}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(launcher||!opened){setOpen(!opened,true)}else{const item=e.target.closest('.ti');if(item)item.click()}}
},true);
function badge(){const item=menu.querySelector('[data-act="achievements"]'),count=Number(item&&item.dataset.pending)||0;toggle.classList.toggle('has-rewards',count>0);toggle.querySelector('b').textContent=count||''}
new MutationObserver(badge).observe(menu,{subtree:true,attributes:true,attributeFilter:['data-pending']});badge();
})();
