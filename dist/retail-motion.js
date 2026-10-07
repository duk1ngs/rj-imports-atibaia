/* Native adapters for the user-provided Zoom Parallax and Spotlight references.
 * Progressive enhancement; no dependency, wheel interception or perpetual loop.
 * Wrappers own motion, keeping text and controls outside transformed layers. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 801px)');
  const desktop = matchMedia('(min-width: 801px)');
  function spotlight(root) {
    const light = document.createElement('span');
    light.className = 'pointer-light'; light.setAttribute('aria-hidden', 'true');
    let frame = 0, rect, x = 0, y = 0, enabled = false;
    const move = event => {
      if (!enabled || event.pointerType === 'touch') return;
      x = event.clientX - rect.left; y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(() => {
        light.style.transform = `translate3d(${x}px,${y}px,0)`; frame = 0;
      });
    };
    const enter = event => {
      if (!enabled || event.pointerType === 'touch') return;
      rect = root.getBoundingClientRect(); move(event); light.classList.add('lit');
    };
    const leave = () => { light.classList.remove('lit'); cancelAnimationFrame(frame); frame = 0; };
    const reset = () => {
      enabled = fine.matches && !reduce.matches;
      if (enabled && !light.isConnected) root.append(light);
      if (!enabled) { leave(); light.remove(); }
    };
    const resize = () => { if (enabled) rect = root.getBoundingClientRect(); };
    const hide = () => { if (document.hidden) leave(); };
    root.addEventListener('pointerenter', enter); root.addEventListener('pointermove', move, {passive:true});
    root.addEventListener('pointerleave', leave); root.addEventListener('pointercancel', leave);
    window.addEventListener('resize', resize, {passive:true}); window.addEventListener('scroll', leave, {passive:true});
    document.addEventListener('visibilitychange', hide); fine.addEventListener('change', reset); reduce.addEventListener('change', reset); reset();
    return () => {
      leave(); light.remove(); root.removeEventListener('pointerenter', enter); root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave); root.removeEventListener('pointercancel', leave);
      window.removeEventListener('resize', resize); window.removeEventListener('scroll', leave);
      document.removeEventListener('visibilitychange', hide); fine.removeEventListener('change', reset); reduce.removeEventListener('change', reset);
    };
  }
  function zoomParallax(root) {
    const layers = [...root.querySelectorAll('[data-zoom-layer]')].slice(0, 7).map(el => ({
      el, max: Math.min(1.3, Math.max(1, Number(el.dataset.zoomMax) || 1.08)),
      shift: Math.min(24, Math.max(-24, Number(el.dataset.zoomShift) || 0)),
      original: el.style.transform, hint: el.style.willChange
    }));
    let visible = false, frame = 0, destroyed = false;
    const eligible = () => desktop.matches && !reduce.matches && !document.hidden && visible && !destroyed;
    const paint = () => {
      frame = 0; if (!eligible()) return;
      const rect = root.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
      for (const {el,max,shift} of layers) el.style.transform = `translate3d(0,${(p-.5)*shift}px,0) scale(${1+(max-1)*p})`;
    };
    const restore = () => layers.forEach(({el,original,hint}) => {el.style.transform = original; el.style.willChange = hint;});
    const schedule = () => { if (eligible() && !frame) frame = requestAnimationFrame(paint); };
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (!eligible()) restore();
      else { layers.forEach(({el}) => {el.style.willChange='transform';}); schedule(); }
    };
    if (!layers.length || !('IntersectionObserver' in window)) return () => {};
    const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting; reset();}); observer.observe(root);
    window.addEventListener('scroll', schedule, {passive:true}); window.addEventListener('resize', reset, {passive:true});
    document.addEventListener('visibilitychange', reset); desktop.addEventListener('change', reset); reduce.addEventListener('change', reset);
    return () => {
      destroyed = true; cancelAnimationFrame(frame); observer.disconnect(); restore();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', reset);
      document.removeEventListener('visibilitychange', reset); desktop.removeEventListener('change', reset); reduce.removeEventListener('change', reset);
    };
  }
  window.RetailMotion = {spotlight, zoomParallax};
  let dispose = [];
  const mount = () => { if (dispose.length) return; document.querySelectorAll('[data-spotlight]').forEach(el => dispose.push(spotlight(el))); document.querySelectorAll('[data-zoom-parallax]').forEach(el => dispose.push(zoomParallax(el))); };
  const unmount = () => {dispose.forEach(fn => fn()); dispose=[];};
  window.addEventListener('pagehide', unmount); window.addEventListener('pageshow', mount); mount();
})();
