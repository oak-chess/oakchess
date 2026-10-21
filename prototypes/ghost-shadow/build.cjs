const fs=require('fs'),path=require('path');
let html=fs.readFileSync(path.resolve(__dirname,'../../index.html'),'utf8');
html=html.replace('<head>','<head><base href="../../"><script>(()=>{const p=Storage.prototype,g=p.getItem,s=p.setItem,r=p.removeItem;p.getItem=function(k){return g.call(this,"ghost-shadow-prototype:"+k)};p.setItem=function(k,v){return s.call(this,"ghost-shadow-prototype:"+k,v)};p.removeItem=function(k){return r.call(this,"ghost-shadow-prototype:"+k)}})();</script>');
html=html.replace('</body>','<script src="prototypes/ghost-shadow/impact.js?v=3"></script></body>');
fs.writeFileSync(path.join(__dirname,'index.html'),html);


