// Comportamiento que no depende de animaciones: header, barra de compra móvil y atribución de campañas.

/** Pasa los parámetros de campaña de la URL actual al checkout de Hotmart. */
function forwardCampaignParams() {
  const current = new URLSearchParams(location.search);
  const keep = [...current].filter(([k]) => /^(utm_|src$|sck$|xcod$|fbclid$|gclid$)/.test(k));
  if (!keep.length) return;
  document.querySelectorAll<HTMLAnchorElement>('a[data-cta]').forEach((a) => {
    const url = new URL(a.href);
    keep.forEach(([k, v]) => url.searchParams.set(k, v));
    a.href = url.toString();
  });
}

function headerAndSticky() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sticky = document.querySelector<HTMLElement>('[data-sticky]');
  const hero = document.getElementById('inicio');
  const footer = document.querySelector('footer');
  let lastY = scrollY;
  let pastHero = false;
  let atFooter = false;

  const setSticky = () => {
    if (!sticky) return;
    const show = pastHero && !atFooter;
    sticky.classList.toggle('is-visible', show);
    sticky.toggleAttribute('inert', !show);
    sticky.setAttribute('aria-hidden', String(!show));
    document.body.classList.toggle('has-sticky', show);
  };

  if (hero) {
    new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting;
      setSticky();
    }, { rootMargin: '-40% 0px 0px 0px' }).observe(hero);
  }
  if (footer) {
    new IntersectionObserver(([e]) => {
      atFooter = e.isIntersecting;
      setSticky();
    }).observe(footer);
  }

  const onScroll = () => {
    const y = scrollY;
    header?.classList.toggle('is-solid', y > 40);
    // Se esconde al bajar y reaparece al subir, para dejar espacio a la lectura.
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 600) header?.classList.add('is-hidden');
    if (goingUp) header?.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  // Si el foco entra al header oculto (teclado), se muestra.
  header?.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  onScroll();
}

forwardCampaignParams();
headerAndSticky();

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  import('./motion').then((m) => m.init());
}
