/* Finite reference timeline; product replacement is a discrete cut. */
(()=>{'use strict';
const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n)},lerp=(a,b,t)=>a+(b-a)*t;
function mount(root){
 if(root.__cinematic)return root.__cinematic;
 const actor=root.querySelector('.phone-travel'),copy=root.querySelector('.cinema-copy'),lead=root.querySelector('.cinema-lead'),handoff=root.querySelector('.cinema-handoff'),word=root.querySelector('.cinema-word');
 const layers=[...root.querySelectorAll('.finish-layer')],buttons=[...root.querySelectorAll('[data-finish-button]')],label=root.querySelector('[data-finish-label]'),order=(root.dataset.finishOrder||'0,1,2,3').split(',').map(Number),names=buttons.map(b=>b.textContent.trim()),mq=matchMedia('(prefers-reduced-motion: reduce)');
 const controls=root.querySelector('.cinema-controls'),owned=[root,actor,copy,lead,handoff,word,controls,...layers].map(el=>({el,style:el.getAttribute('style'),inert:el.inert,hidden:el.getAttribute('aria-hidden')}));
 const originalLabel=label.textContent,originalButtons=buttons.map(el=>({el,disabled:el.disabled,pressed:el.getAttribute('aria-pressed')})),originalData=['progress','sceneState','entryProgress','finish','finishIndex'].map(k=>[k,root.dataset[k]]),originalDetails=[...root.querySelectorAll('[data-product-detail]')].map(el=>({el,src:el.getAttribute('src')}));
 let frame=0,top=0,range=1,manual=null,lastY=scrollY,visible=true,destroyed=false,active=-1,start=0,entering=false,entered=false;
 root.classList.add('cinema-ready');buttons.forEach(b=>b.disabled=false);
 const measure=()=>{top=root.getBoundingClientRect().top+scrollY;range=Math.max(1,root.offsetHeight-innerHeight)},schedule=()=>{if(!frame&&!destroyed)frame=requestAnimationFrame(paint)};
 function paint(now=performance.now()){
  frame=0;if(destroyed||document.hidden)return;const mobile=innerWidth<=700,p=mq.matches?0:clamp((scrollY-top)/range);
  if(p>.005){entering=false;entered=true;root.classList.add('timeline-complete')}
  const t=mq.matches||!entering?1:clamp((now-start)/3400);
  if(entering&&t>=1){entering=false;entered=true;root.classList.add('timeline-complete')}
  const index=manual??order[Math.min(3,Math.floor(p/.215))];
  if(index!==active){active=index;layers.forEach((el,i)=>{el.style.opacity=i===index?'1':'0';el.setAttribute('aria-hidden',String(i!==index))});buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));label.textContent=names[index];root.dataset.finish=names[index];root.dataset.finishIndex=String(index);root.style.setProperty('--material-light',getComputedStyle(buttons[index].querySelector('i')).backgroundColor);root.querySelectorAll('[data-product-detail]').forEach(img=>img.src=layers[index].src)}
  const exit=ease((p-.84)/.16),ui=mq.matches?1:(entering?ease((t-.58)/.42):entered?1:0);let x=0,y=0,r=mobile?14:45,s=1;
  if(entering){if(t<.32){const a=ease(t/.32);y=lerp(-115,0,a);r=lerp(90,70,a);s=lerp(.7,.96,a)}else if(t<.58){const a=ease((t-.32)/.26);r=lerp(70,68,a);s=lerp(.96,1.09,a)}else{const a=ease((t-.58)/.42);r=lerp(68,mobile?14:45,a);s=lerp(1.09,1,a)}}
  if(!mq.matches&&entered){const travel=ease(p);x=mobile?0:travel*6;y=travel*(mobile?5:9)+exit*(mobile?10:16);r=(mobile?14:45)-travel*10;s=1-travel*(mobile?.06:.1)-exit*(mobile?.28:.22)}
  actor.style.transform=`translate(calc(-50% + ${x.toFixed(3)}vw),calc(-50% + ${y.toFixed(3)}vh)) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(4)})`;actor.style.opacity=mq.matches||entered||entering?'1':'0';
  word.style.transform=`translate(-50%,${(entering?lerp(-50,-4,ease((t-.58)/.42)):-4).toFixed(2)}%)`;root.style.setProperty('--ui-opacity',ui.toFixed(4));root.style.setProperty('--set-shift',`${-p*24}px`);
  const departure=ease((p-.72)/.12);copy.style.opacity=lead.style.opacity=String(ui*(1-departure));copy.inert=lead.inert=departure>.9||ui<.95;handoff.style.opacity=String(exit);handoff.inert=exit<.95;controls.inert=ui<.95;
  root.dataset.progress=p.toFixed(4);root.dataset.sceneState=exit>.8?'handoff':p>.01?'product-cut':entering?'reveal':'hero';root.dataset.entryProgress=t.toFixed(4);if(entering&&visible)schedule();
 }
 const enteredEvent=()=>{if(destroyed)return;measure();if(mq.matches||scrollY>top+5){entered=true;entering=false;root.classList.add('timeline-complete')}else{entered=false;entering=true;start=performance.now();root.classList.remove('timeline-complete')}schedule()};
 const scroll=()=>{if(Math.abs(scrollY-lastY)>.5){if(!mq.matches)manual=null;lastY=scrollY}if(visible)schedule()},resize=()=>{measure();schedule()},preference=()=>{root.classList.toggle('cinema-reduced',mq.matches);if(mq.matches){entering=false;entered=true;root.classList.add('timeline-complete')}measure();schedule()},select=e=>{const b=e.target.closest('[data-finish-button]');if(!b||!root.contains(b))return;manual=Number(b.dataset.finishButton);lastY=scrollY;entering=false;entered=true;root.classList.add('timeline-complete');paint()},visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else resize()};
 root.addEventListener('click',select);addEventListener('scroll',scroll,{passive:true});addEventListener('resize',resize,{passive:true});addEventListener('retail:entered',enteredEvent);mq.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);
 const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)resize();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'100px'});observer.observe(root);
 measure();preference();if(document.body.classList.contains('entry-ready')){entered=true;root.classList.add('timeline-complete')}paint();
 Promise.all(layers.map(img=>img.decode())).then(()=>{if(!destroyed)root.classList.add('product-decoded')},()=>{if(!destroyed&&layers[active]?.naturalWidth===0)root.classList.add('product-unavailable')});
 const api={refresh:resize,destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(frame);observer.disconnect();root.removeEventListener('click',select);removeEventListener('scroll',scroll);removeEventListener('resize',resize);removeEventListener('retail:entered',enteredEvent);mq.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);root.classList.remove('cinema-ready','cinema-reduced','timeline-complete','product-decoded','product-unavailable');owned.forEach(({el,style,inert,hidden})=>{if(style===null)el.removeAttribute('style');else el.setAttribute('style',style);el.inert=inert;if(hidden===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',hidden)});originalButtons.forEach(({el,disabled,pressed})=>{el.disabled=disabled;if(pressed===null)el.removeAttribute('aria-pressed');else el.setAttribute('aria-pressed',pressed)});originalData.forEach(([k,v])=>{if(v===undefined)delete root.dataset[k];else root.dataset[k]=v});label.textContent=originalLabel;originalDetails.forEach(({el,src})=>el.setAttribute('src',src));delete root.__cinematic}};root.__cinematic=api;return api;
}
window.CinematicProduct={mount};document.querySelectorAll('[data-cinematic]').forEach(mount);
})();
