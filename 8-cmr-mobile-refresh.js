{const style=document.createElement('style');style.textContent="@media(display-mode:standalone){:root{--cmrBrowserBottom:0px!important}}#cmrPullRefresh{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:1200;background:#fff;border:1px solid #bfdbfe;border-radius:24px;box-shadow:0 5px 20px #0056b320;padding:10px 18px;color:#0056b3;font:600 13px sans-serif;pointer-events:none}#cmrPullRefresh[hidden]{display:none}";document.head.appendChild(style);}
(function(){const vv=visualViewport;function stable(){const stand=navigator.standalone||matchMedia('(display-mode:standalone)').matches;const focused=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'');if(stand){document.documentElement.style.setProperty('--cmrBrowserBottom','0px');return}if(vv&&vv.offsetTop<0&&!focused)document.documentElement.style.setProperty('--cmrBrowserBottom','16px');}vv?.addEventListener('scroll',stable);vv?.addEventListener('resize',stable);window.addEventListener('resize',stable);stable();function clean(){document.querySelectorAll('.offerPill').forEach(e=>{if(/^\s*\d+(?:[.,]\d+)?%\s*[· ]+\s*(Baja|Media|Alta)\s*$/.test(e.textContent))e.textContent=e.textContent.replace(/^\s*\d+(?:[.,]\d+)?%\s*[· ]+\s*/,'')})}new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});clean();})();
(function(){
const mobile=()=>matchMedia('(max-width:768px)').matches;
const root=document.scrollingElement;let start=null,dy=0,busy=false,pulling=false;
const tip=document.createElement('div');tip.id='cmrPullRefresh';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.hidden=true;document.body.appendChild(tip);
const blocked=()=>!mobile()||busy||(typeof perfilActual==='undefined'||!perfilActual)||document.body.classList.contains('cmrLoggedOut')||!!document.querySelector('.modal-overlay.active')||/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'');
function nestedScroll(el){while(el&&el!==document.body){const style=getComputedStyle(el);if(/auto|scroll/.test(style.overflowY)&&el.scrollHeight>el.clientHeight+2)return true;el=el.parentElement;}return false;}
function reset(){start=null;dy=0;pulling=false;if(!busy)tip.hidden=true;}
async function refresh(){if(busy)return;busy=true;tip.hidden=false;tip.textContent='Actualizando…';try{
 if(cmrSection==='inicio')await cmrLoadHome();
 else if(cmrSection==='ofertas'&&cmrOfferView==='pipeline')await cmrLoadPipeline();
 else if(cmrSection==='ofertas'||cmrSection==='historial')await recargarHistorialSilencioso();
 else if(cmrSection==='clientes')await cmrLoadClientes();
 else if(cmrSection==='calendario')await cmrLoadVisitas();
 tip.textContent='Actualizado';
 }catch(e){tip.textContent='No se pudo actualizar. Vuelve a intentarlo.';}
 setTimeout(()=>{busy=false;reset();},1100);
}
document.addEventListener('touchstart',e=>{reset();if(e.touches.length!==1||blocked()||root.scrollTop>0||nestedScroll(e.target))return;start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
document.addEventListener('touchmove',e=>{if(!start||e.touches.length!==1||blocked())return;const y=e.touches[0].clientY-start.y,x=e.touches[0].clientX-start.x;if(y<0||Math.abs(x)>Math.abs(y)){reset();return;}if(root.scrollTop>0){reset();return;}dy=Math.min(y*.45,100);if(dy>5){pulling=true;if(e.cancelable)e.preventDefault();tip.hidden=false;tip.textContent=dy>=60?'Suelta para actualizar':'Tira para actualizar';tip.style.setProperty('--pull',Math.min(dy,70)+'px');}},{passive:false});
document.addEventListener('touchend',()=>{const fire=pulling&&dy>=60&&!blocked();reset();if(fire)refresh();},{passive:true});
document.addEventListener('touchcancel',reset,{passive:true});
})();
(function(){
function label(v){const n=parseFloat(String(v).replace(',','.'));return Number.isFinite(n)?n<=30?'Baja':n>=70?'Alta':'Media':'Sin registrar';}
function cleanProbability(){
document.querySelectorAll('#fichaGrid .fichaItem').forEach(e=>{if(e.querySelector('small')?.textContent.toLocaleLowerCase('es').includes('probabilidad')){const b=e.querySelector('b');if(b&&/\d/.test(b.textContent))b.textContent=label(b.textContent);}});
document.querySelectorAll('#pipeEditProbability option').forEach(e=>{if(e.value&&/\d/.test(e.textContent))e.textContent=label(e.value);});
document.querySelectorAll('#exitoPills .probPill,#editExitoPills .probPill,#pipeProbPills .probPill').forEach(e=>{if(/\d/.test(e.textContent))e.textContent=label(e.dataset.val||e.textContent);});
}
new MutationObserver(cleanProbability).observe(document.body,{subtree:true,childList:true,characterData:true});cleanProbability();
})();
