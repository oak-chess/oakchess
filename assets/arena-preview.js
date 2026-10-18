(function(){
if(!ARENA_PREVIEW)return;
document.body.classList.add('arena-preview');
const style=document.createElement('style');style.textContent='body.arena-preview #ttl{background:transparent!important;pointer-events:none!important}body.arena-preview #ttl>*{display:none!important}#arenaPreviewPanel{position:fixed;left:18px;bottom:18px;z-index:100000;background:#17152beF;color:#e7ddf4;border:2px solid #ad8bc9;padding:15px 18px;font:13px Segoe UI;max-width:290px;box-shadow:0 5px 22px #0008}#arenaPreviewPanel strong{display:block;color:#e4c1ff;margin-bottom:6px}#arenaPreviewPanel p{font-size:12px;color:#bfb1d1;line-height:1.5;margin:7px 0 12px}#arenaPreviewPanel a{display:inline-block;background:#4b385e;color:#f6edff;padding:8px 11px;border:1px solid #b498cd;text-decoration:none}';document.head.append(style);
const panel=document.createElement('section');panel.id='arenaPreviewPanel';panel.innerHTML='<strong>Prévia da arena do Mewtwo</strong><p>Visual integrado ao jogo, sem iniciar uma partida ou alterar sua campanha.</p><a href="index.html">Voltar ao jogo</a>';document.body.append(panel);
})();
