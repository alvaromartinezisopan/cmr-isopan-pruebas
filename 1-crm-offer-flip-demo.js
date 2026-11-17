/* CRM PRUEBAS: giro de ofertas, limitado al MODO DEMO. 17 nov 2026. */
(() => {
  'use strict';
  const style = document.createElement('style');
  style.id = 'crmOfferFlipStyle';
  style.textContent = `
#viewModal.crmOfferFlip{display:block!important;position:fixed;inset:0;padding:0!important;background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;opacity:1!important;visibility:visible!important;transition:none!important;overflow:hidden;z-index:1550}
.crmFlipShade{position:absolute;inset:0;background:rgba(15,23,42,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .38s cubic-bezier(.2,.7,.3,1);touch-action:none}
.crmFlipStage{position:fixed;transform-origin:top left;perspective:1200px;will-change:transform;transition:transform .38s cubic-bezier(.2,.7,.3,1)}
.crmFlipInner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .38s cubic-bezier(.2,.7,.3,1)}
.crmFlipFace{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.crmFlipFront{pointer-events:none}
.crmFlipFront>.pipeCard{position:absolute;left:0;top:0;margin:0!important;transform-origin:top left;transition:transform .38s cubic-bezier(.2,.7,.3,1);box-sizing:border-box;cursor:default!important}
.crmFlipBack{transform:rotateY(180deg);border-radius:24px;background:#fff;box-shadow:0 18px 50px rgba(15,23,42,.25);overflow:hidden}
#viewModal.crmOfferFlip .crmFlipBack>.modal-card{width:100%!important;max-width:none!important;height:100%!important;max-height:100%!important;margin:0!important;opacity:1!important;transform:none!important;transition:none!important;background:#fff;overflow:auto;overscroll-behavior:contain;touch-action:pan-y}
#viewModal.crmOfferFlip.crmFlipOpen .crmFlipInner{transform:rotateY(180deg)}
#viewModal.crmOfferFlip.crmFlipOpen .crmFlipShade{opacity:1}
@media(prefers-reduced-motion:reduce){.crmFlipStage,.crmFlipInner,.crmFlipFront>.pipeCard,.crmFlipShade{transition-duration:.01s!important}}
`;
  document.head.appendChild(style);
  let active = null;
  const demo = () => {
    try { return !!JSON.parse(sessionStorage.getItem('cmrModoDemo') || 'null'); }
    catch (_) { return false; }
  };
  const make = cls => { const n = document.createElement('div'); n.className = cls; return n; };
  const oldClose = cerrarFicha;
  const duration = () => matchMedia('(prefers-reduced-motion:reduce)').matches ? 10 : 380;
  function finish(a) {
    if (!a || active !== a) return;
    clearTimeout(a.timer);
    a.modal.appendChild(a.detail);
    a.shade.remove(); a.stage.remove();
    a.modal.classList.remove('crmOfferFlip', 'crmFlipOpen', 'active');
    a.source.style.visibility = a.visibility;
    a.source.removeAttribute('aria-hidden');
    active = null;
    oldClose();
    if (a.source.isConnected) a.source.focus({preventScroll:true});
  }
  function close(instant = false) {
    const a = active;
    if (!a) { oldClose(); return; }
    if (instant) { finish(a); return; }
    if (a.closing) return;
    a.closing = true;
    const r = a.source.getBoundingClientRect();
    if (!a.source.isConnected || !r.width || !r.height) { finish(a); return; }
    a.modal.classList.remove('crmFlipOpen');
    a.stage.style.transform = `translate(${r.left-a.target.left}px,${r.top-a.target.top}px) scale(${r.width/a.target.width},${r.height/a.target.height})`;
    a.front.style.transform = `scale(${a.target.width/r.width},${a.target.height/r.height})`;
    a.timer = setTimeout(() => finish(a), duration()+40);
  }
  cerrarFicha = () => close();
  function open(id, source) {
    if (active) return;
    const offer = cmrPipeRows.find(o => Number(o.id) === Number(id));
    if (!offer || !['enviada','negociacion'].includes(cmrPipePhaseOf(offer))) return;
    const r = source.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const modal = document.getElementById('viewModal');
    const detail = modal.querySelector('.modal-card');
    abrirFicha(mapearRegistro(offer));
    const width = Math.min(520, innerWidth*.92);
    const height = Math.min(700, innerHeight*.86);
    const target = {width,height,left:(innerWidth-width)/2,top:(innerHeight-height)/2};
    const shade = make('crmFlipShade');
    const stage = make('crmFlipStage');
    Object.assign(stage.style,{left:target.left+'px',top:target.top+'px',width:width+'px',height:height+'px'});
    stage.style.transform = `translate(${r.left-target.left}px,${r.top-target.top}px) scale(${r.width/width},${r.height/height})`;
    const inner = make('crmFlipInner');
    const face = make('crmFlipFace crmFlipFront');
    const front = source.cloneNode(true);
    front.removeAttribute('id');
    front.removeAttribute('tabindex');
    front.setAttribute('aria-hidden','true');
    front.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    front.querySelectorAll('button,a,input,select,[tabindex]').forEach(n => {n.tabIndex=-1;});
    Object.assign(front.style,{width:r.width+'px',height:r.height+'px',transform:`scale(${width/r.width},${height/r.height})`});
    face.appendChild(front);
    const back = make('crmFlipFace crmFlipBack'); back.appendChild(detail);
    inner.append(face,back); stage.appendChild(inner);
    modal.append(shade,stage);
    modal.classList.add('crmOfferFlip');
    modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-labelledby','fichaTitle');
    const a = {source,modal,detail,shade,stage,front,target,visibility:source.style.visibility,closing:false};
    active = a;
    source.style.visibility = 'hidden'; source.setAttribute('aria-hidden','true');
    shade.addEventListener('click', e => {e.stopPropagation();close();});
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (active !== a || a.closing) return;
      stage.style.transform = 'none';
      front.style.transform = `scale(${width/r.width})`;
      modal.classList.add('crmFlipOpen');
      detail.querySelector('.btn-close-modal')?.focus({preventScroll:true});
    }));
  }
  // Decorate only offer cards. Client cards and their actions stay unchanged.
  const renderCard = cmrPipeCard;
  cmrPipeCard = function(o) {
    const html = renderCard(o);
    if (!demo() || !['enviada','negociacion'].includes(cmrPipePhaseOf(o)) || html.includes('jefeCompact')) return html;
    return html.replace('<article ', `<article data-flip-offer="${Number(o.id)}" tabindex="0" aria-label="Abrir detalle de ${cmrEsc(o.referencia||'oferta')}" `);
  };
  document.addEventListener('click', e => {
    if (active && e.target.closest('#fichaEdit,#fichaSeguimiento')) {close(true);return;}
    const source = e.target.closest('#cmrPipeline article[data-flip-offer]');
    if (!source || !demo() || e.target.closest('button,a,select,input,label,[role="link"],.pipeActs')) return;
    if (typeof cmrPipeDragging !== 'undefined' && cmrPipeDragging !== null) return;
    e.preventDefault(); e.stopPropagation(); open(source.dataset.flipOffer,source);
  },true);
  document.addEventListener('keydown', e => {
    if (active && e.key === 'Escape') {e.preventDefault();e.stopImmediatePropagation();close();return;}
    if (active && e.key === 'Tab') {
      const buttons = [...active.detail.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(n=>!n.hidden&&n.getClientRects().length&&!n.disabled);
      const first=buttons[0],last=buttons[buttons.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      return;
    }
    const source = e.target.closest('article[data-flip-offer]');
    if(source && e.target===source && demo() && ['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();open(source.dataset.flipOffer,source);}
  },true);
  addEventListener('resize',()=>{if(active)close(true);});
})();
