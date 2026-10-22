/* Reveal the existing arena during event choices; never rebuild the board. */
(()=>{
 const trigger=document.createElement('button');trigger.type='button';trigger.className='team-view-trigger';trigger.textContent='▦ Ver arena e banco';trigger.hidden=true;trigger.dataset.teamViewControl='';document.body.append(trigger);
 const back=document.createElement('button');back.type='button';back.className='team-view-return';back.textContent='← Voltar ao evento';back.hidden=true;back.dataset.teamViewControl='';document.body.append(back);
 let host=null,focus=null,opened=false,wasPaused=false,units=[];
 function eventHost(){const carousel=document.querySelector('#carousel.show');if(carousel)return carousel;const event=document.getElementById('eventov');if(event)return event;if(G.phase!=='starter'&&G.eventModal&&!G.over)return document.getElementById('towerOverlay');return null}
 function close(){if(!opened)return;opened=false;host?.classList.remove('team-view-event-hidden');units.forEach(el=>el.classList.remove('team-view-real-unit'));units=[];document.body.classList.remove('team-view-real');back.hidden=true;G.paused=wasPaused;hideTip();sync();if(focus?.isConnected)focus.focus();SND.mback()}
 function show(){if(opened)return;host=eventHost();if(!host)return;focus=document.activeElement;wasPaused=G.paused;G.paused=true;opened=true;hideTip();host.classList.add('team-view-event-hidden');document.body.classList.add('team-view-real');units=allUnits().map(u=>u.el).filter(Boolean);units.forEach(el=>el.classList.add('team-view-real-unit'));trigger.hidden=true;back.hidden=false;back.focus();SND.init();SND.msel()}
 function sync(){const active=eventHost();if(opened){if(!host?.isConnected||active!==host)close();return}const carousel=active?.id==='carousel',parent=carousel?active:document.body;if(trigger.parentElement!==parent)parent.append(trigger);trigger.classList.toggle('in-carousel',carousel);trigger.hidden=!active}
 trigger.onclick=show;back.onclick=close;
 // Preserve hover inspection while preventing moves or event choices during this lookup.
 for(const name of ['pointerdown','click','contextmenu','touchstart'])window.addEventListener(name,e=>{if(!opened||e.target.closest('[data-team-view-control]'))return;e.preventDefault();e.stopImmediatePropagation()},{capture:true,passive:false});
 window.addEventListener('keydown',e=>{if(!opened||e.ctrlKey||e.metaKey||['F5','F11','F12'].includes(e.key))return;e.stopImmediatePropagation();e.preventDefault();if(e.key==='Escape'||((e.key==='Enter'||e.key===' ')&&!e.repeat))close();else if(e.key==='Tab')back.focus()},true);
 setInterval(sync,180);sync();window.TEAM_VIEW={open:show,close,get isOpen(){return opened}};
})();
