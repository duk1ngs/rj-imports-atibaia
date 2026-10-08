const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro=document.querySelector('.intro'),mediaIntro=matchMedia('(prefers-reduced-motion: reduce)');
let introTimer;
const closeIntro=()=>{clearTimeout(introTimer);if(intro){intro.classList.remove('active');intro.hidden=true}document.body.classList.remove('intro-playing');document.body.classList.add('entry-ready');dispatchEvent(new Event('retail:entered'));mediaIntro.removeEventListener('change',closeIntro)};
if(intro&&!reduced){intro.classList.add('active');document.body.classList.add('intro-playing');introTimer=setTimeout(closeIntro,2300);mediaIntro.addEventListener('change',closeIntro)}else closeIntro();
const menu = document.querySelector('.menubutton');
const links = document.querySelector('.navlinks');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Fechar' : 'Menu';
  links?.classList.toggle('open', open);
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); if(menu) menu.textContent = 'Menu';
}));
document.addEventListener('keydown', e => {
  if(e.key==='Escape' && menu?.getAttribute('aria-expanded')==='true') { menu.click(); menu.focus(); }
});
if (!reduced && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }), {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const img = gallery.querySelector('.gallery-image');
  const caption = gallery.querySelector('[data-caption]');
  let latest = 0;
  gallery.querySelectorAll('[data-src]').forEach(button => button.addEventListener('click', async () => {
    const request = ++latest;
    const next = new Image(); next.src = button.dataset.src;
    try { await next.decode(); } catch { return; }
    if(request !== latest) return;
    img.src = next.src; img.alt = button.dataset.alt || '';
    gallery.querySelectorAll('[data-src]').forEach(b => b.setAttribute('aria-pressed', String(b===button)));
    if(caption) caption.textContent = button.dataset.caption || button.textContent;
  }));
});
document.querySelectorAll('[data-interest]').forEach(select => select.addEventListener('change', () => {
  const a = document.querySelector(select.dataset.target);
  if(a) a.href = 'https://wa.me/' + select.dataset.phone + '?text=' + encodeURIComponent('Olá! Vim pelo site da ' + select.dataset.business + ' e gostaria de saber mais sobre ' + select.value + '.');
}));
