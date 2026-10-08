/* One master texture, event-driven native material narrative. No scroll interception. */
(()=>{'use strict';
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
 function mount(root){
  if(root.__cinematic)return root.__cinematic;
  const mq=matchMedia('(prefers-reduced-motion: reduce)'),mobile=()=>innerWidth<=700;
  const actor=root.querySelector('.phone-travel'),copy=root.querySelector('.cinema-copy'),handoff=root.querySelector('.cinema-handoff');
  const layers=[...root.querySelectorAll('.finish-layer')],buttons=[...root.querySelectorAll('[data-finish-button]')],label=root.querySelector('[data-finish-label]');
  const names=buttons.map(b=>b.textContent.trim()),colors=buttons.map(b=>(getComputedStyle(b.querySelector('i')).backgroundColor.match(/[\d.]+/g)||['128','128','128']).slice(0,3).map(Number)),maximum=layers.length-1;
  const owned=[root,actor,copy,handoff,...layers].map(el=>({el,style:el.getAttribute('style'),inert:el.inert}));
  const originalButtons=buttons.map(el=>({el,disabled:el.disabled,pressed:el.getAttribute('aria-pressed')}));
  const originalLabel=label.textContent,originalData=['progress','finish','sceneState'].map(key=>[key,root.dataset[key]]);
  let frame=0,top=0,range=1,lastY=scrollY,manual=null,active=-1,visible=true,destroyed=false;
  root.classList.add('cinema-ready');buttons.forEach(b=>b.disabled=false);
  const measure=()=>{top=root.getBoundingClientRect().top+scrollY;range=Math.max(1,root.offsetHeight-innerHeight)};
  function paint(){frame=0;if(destroyed||document.hidden)return;
   const p=mq.matches?0:clamp((scrollY-top)/range);root.dataset.progress=p.toFixed(4);
   let v=manual??(p===0?clamp(Number(root.dataset.initialFinish)||0,0,maximum):clamp((p-.07)/.7)*maximum);
   const lo=Math.floor(v),hi=Math.min(maximum,lo+1),mix=ease(v-lo);
   layers.forEach((l,i)=>l.style.opacity=String(i===lo?1-mix:i===hi?mix:0));
   const selected=Math.round(v);if(selected!==active){active=selected;label.textContent=names[selected];buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));root.dataset.finish=names[selected];}
   root.style.setProperty('--material-light',`rgb(${colors[lo].map((n,i)=>Math.round(n+(colors[hi][i]-n)*mix)).join(' ')})`);root.style.setProperty('--set-shift',`${(-p*(mobile()?18:42)).toFixed(2)}px`);
   const departure=ease((p-.81)/.17),copyDeparture=ease((p-.65)/.15),travel=ease(p);
   actor.style.transform=mq.matches?'':`translate(${(mobile()?0:travel*68).toFixed(2)}px,${(travel*(mobile()?38:92)).toFixed(2)}px) rotate(${(-12+travel*15).toFixed(2)}deg) rotateY(${((mobile()?-2.5:-7)+travel*(mobile()?5:11)).toFixed(2)}deg) scale(${(1-travel*(mobile()?.16:.24)-(mobile()?departure*.20:0)).toFixed(4)})`;
   copy.style.opacity=String(1-copyDeparture);copy.style.transform=mq.matches?'':`translateY(${-copyDeparture*32}px)`;copy.inert=copyDeparture>.9;
   handoff.style.opacity=String(departure);handoff.style.transform=mq.matches?'':`translateY(${(1-departure)*32}px)`;handoff.inert=departure<.9;
   root.dataset.sceneState=p>.9?'handoff':p>.07?'transform':'hero';
  }
  const schedule=()=>{if(!frame&&!destroyed)frame=requestAnimationFrame(paint)};
  const scroll=()=>{if(Math.abs(scrollY-lastY)>.5){if(!mq.matches){manual=null;root.classList.remove('manual-finish')}lastY=scrollY}if(visible)schedule()};
  const resize=()=>{measure();schedule()};
  const preference=()=>{root.classList.toggle('cinema-reduced',mq.matches);measure();schedule()};
  const select=e=>{const b=e.target.closest('[data-finish-button]');if(!b||!root.contains(b))return;lastY=scrollY;manual=Number(b.dataset.finishButton);root.classList.toggle('manual-finish',!mq.matches);schedule()};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else resize()};
  root.addEventListener('click',select);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize,{passive:true});mq.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);
  const observer='IntersectionObserver'in window?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)resize();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'50px'}):null;observer?.observe(root);
  preference();paint();
  const image=new Image();image.src=root.dataset.master;image.decode().then(()=>{if(!destroyed)root.classList.add('product-decoded')},()=>{if(!destroyed)root.classList.add('product-unavailable')});
  const api={destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(frame);observer?.disconnect();root.removeEventListener('click',select);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);mq.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);root.classList.remove('cinema-ready','cinema-reduced','manual-finish','product-decoded','product-unavailable');owned.forEach(({el,style,inert})=>{if(style===null)el.removeAttribute('style');else el.setAttribute('style',style);el.inert=inert;});originalButtons.forEach(({el,disabled,pressed})=>{el.disabled=disabled;if(pressed===null)el.removeAttribute('aria-pressed');else el.setAttribute('aria-pressed',pressed)});originalData.forEach(([key,value])=>{if(value===undefined)delete root.dataset[key];else root.dataset[key]=value});label.textContent=originalLabel;delete root.__cinematic;},refresh:resize};root.__cinematic=api;return api;
 }
 window.CinematicProduct={mount};document.querySelectorAll('[data-cinematic]').forEach(mount);
})();
