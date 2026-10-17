(function(){
const root=document.getElementById('tpress'),menu=document.getElementById('tmain');
if(!root||!menu)return;
const toggle=document.createElement('button');toggle.type='button';toggle.id='titleMenuToggle';toggle.setAttribute('aria-label','Abrir menu principal');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','tmain');toggle.innerHTML='<span class="hamburger-lines" aria-hidden="true"><i></i><i></i><i></i></span><span>MENU</span><b class="hamburger-reward" aria-hidden="true"></b>';root.prepend(toggle);
const items=()=>[...menu.querySelectorAll('.r2 .ti')];
function setOpen(on,focus=false){root.classList.toggle('tools-open',on);toggle.setAttribute('aria-expanded',String(on));toggle.setAttribute('aria-label',on?'Fechar menu principal':'Abrir menu principal');menu.inert=!on;items().forEach(el=>{el.tabIndex=on?0:-1;el.classList.remove('sel')});if(on&&focus)items()[0]?.focus();else if(!on&&focus)toggle.focus()}
setOpen(false);
toggle.onclick=e=>{e.stopPropagation();SND.init();SND.click();setOpen(!root.classList.contains('tools-open'),true)};
items().forEach(el=>el.addEventListener('click',()=>setOpen(false)));
document.addEventListener('pointerdown',e=>{if(!root.contains(e.target))setOpen(false)});
window.addEventListener('keydown',e=>{
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
