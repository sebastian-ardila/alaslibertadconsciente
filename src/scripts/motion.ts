// Capa de movimiento: solo se carga cuando la persona NO pidió reducir el movimiento.
// Todo el contenido es visible sin este archivo; aquí solo se agregan estados iniciales y animaciones.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

function smoothScroll() {
  const lenis = new Lenis({ duration: 1.15, anchors: { offset: -80 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('#hero-title .line > span', { yPercent: 110, duration: 1.4, stagger: 0.12 })
    .from('[data-hero-book]', { y: 60, opacity: 0, scale: 0.94, duration: 1.8 }, 0.15)
    .from('.hero__orbits circle', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 2, stagger: 0.12 }, 0.2)
    .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.55);
}

/** Estrellas en capas: cada capa se desplaza según su profundidad. */
function starParallax() {
  $$('.sf').forEach((field) => {
    const host = field.parentElement!;
    $$<SVGElement>('.sf__layer', field).forEach((layer) => {
      const depth = Number(layer.dataset.depth ?? 0.2);
      gsap.fromTo(layer, { yPercent: depth * 18 }, {
        yPercent: -depth * 18,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}

function heroDepth(mm: gsap.MatchMedia) {
  const hero = $('#inicio');
  if (!hero) return;
  // El libro sube más rápido que las órbitas: tres planos de profundidad.
  gsap.to('.hero__cover', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__orbits', { yPercent: -6, rotate: 35, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__copy', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  // Leve inclinación del libro siguiendo el cursor (solo punteros finos).
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const cover = $('[data-tilt]');
    if (!cover) return;
    const rx = gsap.quickTo(cover, 'rotationX', { duration: 0.9, ease: 'power3' });
    const ry = gsap.quickTo(cover, 'rotationY', { duration: 0.9, ease: 'power3' });
    gsap.set(cover, { transformPerspective: 900 });
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      ry(x * 12);
      rx(-y * 8);
    };
    hero.addEventListener('pointermove', onMove);
    return () => hero.removeEventListener('pointermove', onMove);
  });
}

/** Fotos dentro de arcos: la imagen se mueve dentro de su marco. */
function innerParallax() {
  $$('[data-parallax-inner]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -7 }, {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('figure') ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  $$('[data-depth-y]').forEach((el) => {
    const d = Number(el.dataset.depthY);
    gsap.fromTo(el, { y: -d / 2 }, {
      y: d / 2,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function presento() {
  const mock = $('[data-scale-in]');
  if (mock) {
    gsap.fromTo(mock, { scale: 0.86, yPercent: 8 }, {
      scale: 1,
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: mock, start: 'top bottom', end: 'center 55%', scrub: true },
    });
  }
}

function priceStrikes() {
  $$('[data-price]').forEach((card) => {
    const path = $<SVGPathElement>('.price__strike path', card);
    if (!path) return;
    gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: card, start: 'top 65%', once: true },
    });
  });
}

function painLines() {
  $$('[data-scrub-lines]').forEach((list) => {
    $$('li', list).forEach((li) => {
      // Arranca en un tono atenuado que igual cumple contraste AA (≈5.5:1).
      gsap.fromTo(li, { color: '#7d89a3' }, {
        color: '#e8eef7',
        ease: 'none',
        scrollTrigger: { trigger: li, start: 'top 88%', end: 'top 58%', scrub: true },
      });
    });
  });
}

/** El giro: la escena se fija, la frase aparece palabra por palabra y un sol dorado sube detrás. */
function turnScene() {
  const stage = $('[data-turn]');
  if (!stage) return;
  const stars = $('.sf', stage);
  gsap.set('[data-turn-night]', { opacity: 1 });
  gsap.set('[data-turn-sun]', { yPercent: 45, scale: 0.7, opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stage, start: 'top top', end: '+=170%', pin: true, scrub: 0.6, anticipatePin: 1 },
  });
  tl.from('[data-turn-lead]', { opacity: 0, y: 24, duration: 0.12 })
    .from('[data-turn-word]', { opacity: 0, yPercent: 40, filter: 'blur(8px)', duration: 0.12, stagger: 0.07 }, 0.08)
    .to('[data-turn-sun]', { yPercent: 0, scale: 1, opacity: 1, duration: 0.5 }, 0.3)
    .to('[data-turn-night]', { opacity: 0, duration: 0.45 }, 0.35)
    .to('.turn__rays', { rotate: 40, duration: 0.7 }, 0.3);
  if (stars) tl.to(stars, { opacity: 0.35, duration: 0.4 }, 0.45);
  tl.from('[data-turn-after]', { opacity: 0, y: 30, duration: 0.15 }, 0.72).to({}, { duration: 0.15 });
}

/** "Aquí es donde todo cambia": los cuatro verbos aparecen uno tras otro. */
function verbs() {
  const list = $('[data-verbs]');
  if (!list) return;
  gsap.from($$('li', list), {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: list, start: 'top 80%', once: true },
  });
}

/** Contenido del ebook: recorrido horizontal en escritorio; medallón fijo que cambia en móvil. */
function horizontalContents(mm: gsap.MatchMedia) {
  mm.add('(min-width: 1000px)', () => {
    const pin = $('[data-hscroll]');
    const track = $('[data-hscroll-track]');
    if (!pin || !track) return;
    const panels = $$('[data-panel]', track);
    const count = $('[data-ct-count]');
    const bar = $('[data-ct-progress]');
    // Se calcula por paneles (no con scrollWidth, que incluye el texto desplazado por el parallax).
    const distance = () => (panels.length - 1) * panels[0].offsetWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)));
          if (count) count.textContent = String(i + 1);
          if (bar) bar.style.transform = `scaleX(${(i + 1) / panels.length})`;
        },
      },
    });
    // Las imágenes de los paneles están fuera de pantalla en horizontal: se piden antes de llegar.
    ScrollTrigger.create({
      trigger: pin,
      start: 'top 300%',
      once: true,
      onEnter: () => $$<HTMLImageElement>('img', track).forEach((img) => (img.loading = 'eager')),
    });
    panels.forEach((panel) => {
      const st = { containerAnimation: tween, trigger: panel, start: 'left right', end: 'right left', scrub: true };
      // Tres velocidades: órbitas, medallón y texto se desplazan distinto dentro de cada panel.
      gsap.fromTo($('[data-ct-orbits]', panel), { rotate: -50 }, { rotate: 50, ease: 'none', scrollTrigger: st });
      gsap.fromTo($('[data-medal] img', panel), { rotate: -12, scale: 0.9 }, { rotate: 12, scale: 1.05, ease: 'none', scrollTrigger: st });
      gsap.fromTo($('[data-ct-text]', panel), { x: 140 }, { x: -140, ease: 'none', scrollTrigger: st });
    });
  });

  mm.add('(max-width: 999px)', () => {
    const imgs = $$('[data-stage-img]');
    const dots = $$('[data-stage-dot]');
    const panels = $$('[data-panel]');
    const medal = $('.ct__stage-medal');
    if (!imgs.length || !medal) return;
    const setActive = (i: number) => {
      imgs.forEach((el, j) => el.classList.toggle('is-active', i === j));
      dots.forEach((el, j) => el.classList.toggle('is-active', i === j));
    };
    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 62%',
        end: 'bottom 62%',
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
    // El medallón gira despacio mientras se recorre toda la lista de capítulos.
    gsap.fromTo(medal, { rotate: -20 }, {
      rotate: 20,
      ease: 'none',
      scrollTrigger: { trigger: '[data-hscroll]', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function sealAndFinale() {
  const seal = $('[data-seal]');
  if (seal) {
    gsap.fromTo('.seal__ring', { rotate: -40, svgOrigin: '150 150' }, {
      rotate: 140,
      ease: 'none',
      scrollTrigger: { trigger: seal, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
  const finale = $('[data-finale]');
  if (finale) {
    gsap.fromTo(finale, { color: '#5b6680', letterSpacing: '0.06em' }, {
      color: '#0a1733',
      letterSpacing: '0em',
      ease: 'none',
      scrollTrigger: { trigger: finale, start: 'top 95%', end: 'center 60%', scrub: true },
    });
  }
}

/**
 * Hilo dorado: un trazo continuo en el margen izquierdo que se dibuja al avanzar.
 * Se replica una capa por sección (detrás del contenido, encima del fondo) para no tapar el texto.
 */
function goldThread(mm: gsap.MatchMedia) {
  mm.add('(min-width: 900px)', () => {
    const main = $('main')!;
    const sections = $$(':scope > section, :scope > footer', main);
    const NS = 'http://www.w3.org/2000/svg';
    const layers: { layer: HTMLDivElement; svg: SVGSVGElement; path: SVGPathElement; stars: SVGGElement }[] = [];
    let samples: { l: number; y: number }[] = [];
    let total = 0;
    let starAt: number[] = [];

    sections.forEach((sec) => {
      const layer = document.createElement('div');
      layer.className = 'thread-layer';
      layer.setAttribute('aria-hidden', 'true');
      const svg = document.createElementNS(NS, 'svg');
      const path = document.createElementNS(NS, 'path');
      const stars = document.createElementNS(NS, 'g');
      svg.append(path, stars);
      layer.append(svg);
      sec.prepend(layer);
      layers.push({ layer, svg, path, stars });
    });

    const build = () => {
      const top = main.getBoundingClientRect().top + scrollY;
      const W = main.clientWidth;
      const H = main.scrollHeight;
      // El hilo ondula dentro del margen izquierdo, como la cinta de un libro: nunca cruza el contenido.
      const gutter = ($('.wrap', main)?.getBoundingClientRect().left ?? 48) - main.getBoundingClientRect().left;
      const cx = gutter / 2;
      const amp = Math.min(gutter * 0.28, 22);
      const startY = innerHeight * 0.3;
      const step = 560;
      const pts: [number, number][] = [];
      for (let y = startY, i = 0; y < H - 80; y += step, i++) pts.push([cx + (i % 2 ? amp : -amp), y]);
      pts.push([cx, H - 80]);
      pts.sort((a, b) => a[1] - b[1]);
      if (pts.length < 2) return;

      // Catmull-Rom → Bézier para una curva suave que pase por todas las anclas.
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
      }

      const probe = document.createElementNS(NS, 'path');
      probe.setAttribute('d', d);
      layers[0].svg.append(probe);
      total = probe.getTotalLength();
      samples = [];
      for (let l = 0; l <= total; l += 16) samples.push({ l, y: probe.getPointAtLength(l).y });
      // Siete estrellas repartidas a lo largo del hilo, una por Arcángel.
      starAt = Array.from({ length: 7 }, (_, i) => total * ((i + 0.5) / 7));
      const starPts = starAt.map((l) => probe.getPointAtLength(l));
      probe.remove();

      layers.forEach(({ layer, svg, path, stars }) => {
        const secTop = (layer.parentElement as HTMLElement).getBoundingClientRect().top + scrollY - top;
        svg.setAttribute('width', String(W));
        svg.setAttribute('height', String(H));
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.style.transform = `translateY(${-secTop}px)`;
        path.setAttribute('d', d);
        path.style.strokeDasharray = `${total}`;
        stars.innerHTML = starPts
          .map((p, i) => `<path data-i="${i}" transform="translate(${p.x - 9} ${p.y - 9}) scale(.75)" d="M12 0C12.8 8 16 11.2 24 12 16 12.8 12.8 16 12 24 11.2 16 8 12.8 0 12 8 11.2 11.2 8 12 0Z"/>`)
          .join('');
      });
      update();
    };

    const lengthAtY = (y: number) => {
      let lo = 0;
      let hi = samples.length - 1;
      if (!samples.length) return 0;
      if (y <= samples[0].y) return 0;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return samples[lo].l;
    };

    const update = () => {
      const top = main.getBoundingClientRect().top;
      const y = -top + innerHeight * 0.62;
      const l = lengthAtY(y);
      layers.forEach(({ path, stars }) => {
        path.style.strokeDashoffset = `${total - l}`;
        stars.querySelectorAll('path').forEach((s, i) => s.classList.toggle('on', l >= starAt[i]));
      });
    };

    ScrollTrigger.addEventListener('refresh', build);
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update });
    build();
    return () => {
      ScrollTrigger.removeEventListener('refresh', build);
      st.kill();
      layers.forEach(({ layer }) => layer.remove());
    };
  });
}

export function init() {
  document.documentElement.classList.add('motion');
  const mm = gsap.matchMedia();
  smoothScroll();
  heroIntro();
  heroDepth(mm);
  starParallax();
  innerParallax();
  presento();
  priceStrikes();
  painLines();
  turnScene();
  verbs();
  horizontalContents(mm);
  sealAndFinale();
  goldThread(mm);
  // Las fuentes cambian las alturas: recalcular cuando estén listas.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
}
