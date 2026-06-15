/* The background module (and its Three.js CDN import) loads dynamically so a
   failed fetch degrades to the CSS fallback instead of killing the whole app. */

/* ---- Constants ---- */

const PALETTES = [
  { base: '#f4f1ec', mid: '#ddc9a4', accent: '#c83b2c' },
  { base: '#efe5d3', mid: '#cfae7e', accent: '#a04428' },
  { base: '#1d0e09', mid: '#54200f', accent: '#ff6a4d' },
  { base: '#15100c', mid: '#33231a', accent: '#ff5b46' },
  { base: '#240c06', mid: '#722809', accent: '#ff7a3c' },
  { base: '#1f1606', mid: '#6b4c12', accent: '#e9b44a' },
  { base: '#071f1b', mid: '#155244', accent: '#41c39e' },
  { base: '#0f1130', mid: '#2b2e6b', accent: '#8d8fff' },
  { base: '#220609', mid: '#6d0f1f', accent: '#ff4d5e' },
  { base: '#0e0c0a', mid: '#221910', accent: '#ff5b46' },
  { base: '#f3efe7', mid: '#d9c19c', accent: '#c83b2c' },
  { base: '#b03021', mid: '#d24a30', accent: '#ffd9c2' },
  { base: '#efe9e0', mid: '#d4c2a8', accent: '#b3402f' },
  { base: '#efe9e0', mid: '#d4c2a8', accent: '#b3402f' },
  { base: '#120a07', mid: '#2e1710', accent: '#e05c3a' }, // stop 14 — epilogue close (deep ember charcoal)
];

const SELECTORS_WITH_CUSTOM_REVEALS = [
  '#prologue',
  '#manifesto',
  '#workflow',
  '#tools',
  '.tool-scene',
  '#terminal',
  '#install',
  '#faq',
  '#epilogue',
];

/* ---- Boot ---- */

function failsafe() {
  document.documentElement.classList.remove('js');
}

async function boot() {
  if (!window.gsap || !window.ScrollTrigger) {
    failsafe();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Browser scroll restoration races Lenis + ScrollTrigger measurement on reload,
  // shifting every scrubbed trigger. The story always boots from a stable position:
  // the top, or the deep-linked chapter.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const sections = gsap.utils.toArray('.chapter');

  // The painted background attaches late (see below); triggers read it through
  // this ref so the choreography never waits on the Three.js CDN fetch.
  const bgRef = { current: null };
  const lenis = initLenis(reduceMotion);

  initAnchors(lenis, reduceMotion);
  splitWords();

  if (reduceMotion) {
    initReducedMotion(null);
  } else {
    initReveals(sections);
    initScenes(sections, coarsePointer);
  }

  const paletteProxy = initPaletteProgress(sections, bgRef);
  initChapterState(sections);
  initNav(lenis);

  window.__railsToolkit = { lenis, bg: bgRef };
  window.__rtBooted = true;
  if (window.__rtWatchdog) {
    clearTimeout(window.__rtWatchdog);
  }
  document.documentElement.classList.add('js');

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    const hash = window.location.hash;
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  });

  // The background is now a static CSS blueprint surface (see .bg-blueprint in the
  // markup and main.css); its colours are driven by the per-chapter palette
  // variables and the data-chapter swaps below — there is no WebGL module to load.
  void paletteProxy;
}

boot().catch(() => failsafe());

/* ---- Background ---- */

function initBackground(reduceMotion, createPaintedBackground) {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof createPaintedBackground !== 'function') {
    document.body.classList.add('no-webgl');
    return null;
  }

  let bg = null;
  try {
    bg = createPaintedBackground(canvas, PALETTES);
  } catch {
    document.body.classList.add('no-webgl');
    return null;
  }

  if (bg === null) {
    document.body.classList.add('no-webgl');
    return null;
  }

  bg.start();
  bg.setIntensity(reduceMotion ? 0 : 1);
  return bg;
}

/* ---- Lenis + Anchors ---- */

function initLenis(reduceMotion) {
  if (reduceMotion || !window.Lenis) {
    return null;
  }

  const { gsap, ScrollTrigger, Lenis } = window;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function initAnchors(lenis, reduceMotion) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) {
      return;
    }

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    if (history.pushState) {
      history.pushState(null, '', hash);
    }
  });
}

/* ---- Split Text ---- */

function splitWords() {
  document.querySelectorAll('[data-split]').forEach((node) => {
    if (node.dataset.splitDone === 'true') {
      return;
    }

    splitNode(node, false);
    node.dataset.splitDone = 'true';
  });
}

function splitNode(node, isEm) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.replaceWith(splitTextNode(child.textContent || '', isEm));
      return;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      splitNode(child, isEm || child.tagName.toLowerCase() === 'em');
    }
  });
}

function splitTextNode(text, isEm) {
  const fragment = document.createDocumentFragment();
  const parts = text.match(/\S+|\s+/g) || [];

  parts.forEach((part) => {
    if (/^\s+$/.test(part)) {
      fragment.appendChild(document.createTextNode(part));
      return;
    }

    const word = document.createElement('span');
    const inner = document.createElement('span');
    word.className = isEm ? 'w is-em' : 'w';
    inner.className = 'wi';
    inner.textContent = part;
    word.appendChild(inner);
    fragment.appendChild(word);
  });

  return fragment;
}

/* ---- Shared Reveal Helpers ---- */

function wordInners(scope) {
  return scope ? Array.from(scope.querySelectorAll('.wi')) : [];
}

function revealItems(scope) {
  return scope ? Array.from(scope.querySelectorAll('[data-reveal]')) : [];
}

function setRevealInitial(targets) {
  if (targets && targets.length) {
    window.gsap.set(targets, { autoAlpha: 0, y: 44 });
  }
}

function setWordsInitial(targets) {
  if (targets && targets.length) {
    window.gsap.set(targets, { yPercent: 110 });
  }
}

function addWords(tl, scope, position = 0) {
  const words = wordInners(scope);
  setWordsInitial(words);
  if (words.length) {
    tl.to(words, {
      yPercent: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.05,
    }, position);
  }
}

function addReveal(tl, targets, position = '>-0.2', vars = {}) {
  const items = Array.isArray(targets) ? targets : Array.from(targets || []);
  setRevealInitial(items);
  if (items.length) {
    tl.to(items, {
      y: 0,
      autoAlpha: 1,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.09,
      ...vars,
    }, position);
  }
}

function chapterTimeline(section, vars = {}) {
  return window.gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 78%',
      toggleActions: 'play none none reverse',
    },
    ...vars,
  });
}

function hasCustomReveal(section) {
  return SELECTORS_WITH_CUSTOM_REVEALS.some((selector) => section.matches(selector));
}

function initReveals(sections) {
  sections.forEach((section) => {
    if (hasCustomReveal(section)) {
      return;
    }

    const tl = chapterTimeline(section);
    addWords(tl, section, 0);
    addReveal(tl, revealItems(section), 0.12);
  });
}

/* ---- Background Progress + Chapter State ---- */

function initPaletteProgress(sections, bgRef) {
  const { ScrollTrigger } = window;
  const proxy = { value: 0 };

  sections.forEach((section) => {
    const stop = Number.parseInt(section.dataset.stop || '0', 10);
    if (!Number.isFinite(stop) || stop <= 0) {
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      end: 'top 35%',
      scrub: true,
      onUpdate(self) {
        proxy.value = (stop - 1) + self.progress;
        if (bgRef.current) {
          bgRef.current.setProgress(proxy.value);
        }
      },
    });
  });

  return proxy;
}

function initChapterState(sections) {
  const { ScrollTrigger } = window;
  const first = sections[0];

  if (first) {
    activateChapter(first, true);
  }

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => activateChapter(section),
      onEnterBack: () => activateChapter(section),
    });
  });
}

function activateChapter(section, immediate = false) {
  if (!section) {
    return;
  }

  document.body.dataset.chapter = section.id || '';
  document.body.dataset.ink = section.dataset.ink || 'dark';

  const numeral = document.getElementById('hud-numeral');
  const title = document.getElementById('hud-title');
  const nextNumeral = section.dataset.numeral || '';
  const nextTitle = section.dataset.title || '';

  if (!numeral || !title) {
    return;
  }

  if (immediate) {
    numeral.textContent = nextNumeral;
    title.textContent = nextTitle;
    return;
  }

  const { gsap } = window;
  gsap.killTweensOf([numeral, title]);
  gsap.to([numeral, title], {
    autoAlpha: 0,
    y: -6,
    duration: 0.14,
    ease: 'power2.out',
    onComplete() {
      numeral.textContent = nextNumeral;
      title.textContent = nextTitle;
      gsap.fromTo([numeral, title],
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' });
    },
  });
}

/* ---- Scenes ---- */

function initScenes(sections, coarsePointer) {
  initGhostNumerals(sections);
  initPrologue();
  initManifesto(coarsePointer);
  initWorkflow();
  initToolsIntro();
  initToolScenes();
  initTerminal();
  initInstall();
  initFaq();
  initEpilogue();
}

function initGhostNumerals(sections) {
  const { gsap } = window;

  sections.forEach((section) => {
    const numeral = section.querySelector('.scene-numeral');
    if (!numeral) {
      return;
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
      .fromTo(numeral, { yPercent: 18 }, { yPercent: -18, ease: 'none' }, 0)
      .fromTo(numeral, { autoAlpha: 0.035 }, {
        autoAlpha: 0.085,
        ease: 'none',
        duration: 0.5,
        yoyo: true,
        repeat: 1,
      }, 0);
  });
}

/* ---- Chapter: Prologue ---- */

function initPrologue() {
  const { gsap, ScrollTrigger } = window;
  const section = document.getElementById('prologue');
  if (!section) {
    return;
  }

  const rail = section.querySelector('.eyebrow-rail');
  const words = wordInners(section);
  const reveals = revealItems(section);
  const cue = section.querySelector('.scroll-cue');
  const driftTargets = Array.from(section.querySelectorAll('.h-display, .lede'));

  setWordsInitial(words);
  setRevealInitial(reveals);
  if (rail) {
    gsap.set(rail, { scaleX: 0, transformOrigin: 'left center' });
  }

  const tl = gsap.timeline({ delay: 0.25 });
  if (rail) {
    tl.to(rail, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 0);
  }
  if (words.length) {
    tl.to(words, {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.05,
    }, 0.12);
  }
  addReveal(tl, reveals, 0.46);

  if (cue) {
    gsap.to(cue, {
      y: 12,
      delay: 1.8,
      duration: 1.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  if (driftTargets.length) {
    gsap.to(driftTargets, {
      yPercent: -22,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

/* ---- Chapter: Manifesto ---- */

function initManifesto(coarsePointer) {
  const section = document.getElementById('manifesto');
  if (!section) {
    return;
  }

  const paragraphs = Array.from(section.querySelectorAll('.prose'));
  const signature = section.querySelector('.signature');
  const eyebrow = section.querySelector('.eyebrow');
  const tl = chapterTimeline(section);

  addReveal(tl, eyebrow ? [eyebrow] : [], 0);
  addWords(tl, section, 0.1);

  if (paragraphs.length) {
    window.gsap.set(paragraphs, {
      autoAlpha: 0,
      y: 36,
      filter: coarsePointer ? 'none' : 'blur(6px)',
    });
    tl.to(paragraphs, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out',
      stagger: 0.14,
    }, 0.36);
  }

  addReveal(tl, signature ? [signature] : [], '>-0.08');
}

/* ---- Chapter: Workflow ---- */

function initWorkflow() {
  const { gsap } = window;
  const section = document.getElementById('workflow');
  if (!section) {
    return;
  }

  const entry = chapterTimeline(section);
  addReveal(entry, revealItems(section), 0);
  addWords(entry, section, 0.08);

  const rail = section.querySelector('.pipeline-rail');
  const stations = Array.from(section.querySelectorAll('.station'));
  const arrows = Array.from(section.querySelectorAll('.station-arrow'));

  if (!rail && !stations.length) {
    return;
  }

  if (rail) {
    gsap.set(rail, { scaleX: 0, transformOrigin: 'left center' });
  }
  gsap.set(stations, { autoAlpha: 0, y: 36, rotation: -1.5 });
  gsap.set(arrows, { autoAlpha: 0 });

  const scrub = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 72%',
      end: 'bottom 42%',
      scrub: true,
    },
  });

  if (rail) {
    scrub.to(rail, { scaleX: 1, ease: 'none', duration: 1 }, 0);
  }

  stations.forEach((station, index) => {
    const at = 0.12 + index * 0.15;
    const arrow = station.querySelector('.station-arrow');
    scrub.to(station, {
      autoAlpha: 1,
      y: 0,
      rotation: 0,
      ease: 'power2.out',
      duration: 0.24,
    }, at);
    if (arrow) {
      scrub.to(arrow, { autoAlpha: 1, duration: 0.12, ease: 'none' }, at + 0.12);
    }
  });
}

/* ---- Chapter: Tools Intro ---- */

function initToolsIntro() {
  const section = document.getElementById('tools');
  if (!section) {
    return;
  }

  const tl = chapterTimeline(section);
  addReveal(tl, revealItems(section), 0);
  addWords(tl, section, 0.08);
}

/* ---- Chapter: Tool Scenes ---- */

function initToolScenes() {
  const { gsap } = window;

  document.querySelectorAll('.tool-scene').forEach((section) => {
    const tag = section.querySelector('.tool-tag');
    const name = section.querySelector('.tool-name');
    const stroke = section.querySelector('.paint-stroke');
    const blurb = section.querySelector('.tool-blurb');
    const meta = section.querySelector('.tool-meta');
    const actions = section.querySelector('.tool-actions');
    const words = wordInners(name || section);

    setRevealInitial([tag, blurb, meta, actions].filter(Boolean));
    setWordsInitial(words);
    if (stroke) {
      gsap.set(stroke, { scaleX: 0, transformOrigin: 'left center' });
    }

    const tl = chapterTimeline(section);
    addReveal(tl, tag ? [tag] : [], 0);
    if (words.length) {
      tl.to(words, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.05,
      }, '>-0.18');
    }
    if (stroke) {
      tl.to(stroke, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, '>-0.25');
    }
    addReveal(tl, blurb ? [blurb] : [], '>-0.28');
    addReveal(tl, meta ? [meta] : [], '>-0.5');
    addReveal(tl, actions ? [actions] : [], '>-0.65');

    if (name) {
      gsap.fromTo(name, { xPercent: 3 }, {
        xPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  });
}

/* ---- Chapter: Terminal ---- */

function initTerminal() {
  const { gsap } = window;
  const section = document.getElementById('terminal');
  if (!section) {
    return;
  }

  const entry = chapterTimeline(section);
  addReveal(entry, revealItems(section).filter((node) => !node.classList.contains('win')), 0);
  addWords(entry, section, 0.08);

  const stage = section.querySelector('.terminal-stage');
  const win = section.querySelector('.win');
  const lines = Array.from(section.querySelectorAll('.t-line'));

  if (!stage || !win) {
    return;
  }

  gsap.set(win, { autoAlpha: 0, y: 72, scale: 0.96 });
  gsap.set(lines, { autoAlpha: 0, y: 10 });

  const pinTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=170%',
      scrub: 0.6,
      pin: stage,
    },
  });

  pinTl.to(win, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    ease: 'power2.out',
    duration: 0.15,
  }, 0);

  lines.forEach((line, index) => {
    const progress = lines.length > 1 ? index / (lines.length - 1) : 0;
    const at = 0.15 + progress * 0.82;
    pinTl.to(line, {
      autoAlpha: 1,
      y: 0,
      duration: 0.035,
      ease: 'none',
    }, at);
  });
}

/* ---- Chapter: Install ---- */

function initInstall() {
  const section = document.getElementById('install');
  if (!section) {
    return;
  }

  const tl = chapterTimeline(section);
  const win = section.querySelector('.win');
  const lines = Array.from(section.querySelectorAll('.t-line'));
  const otherReveals = revealItems(section).filter((node) => node !== win);

  addReveal(tl, otherReveals, 0);
  addWords(tl, section, 0.08);
  addReveal(tl, win ? [win] : [], '>-0.1');

  if (lines.length) {
    window.gsap.set(lines, { autoAlpha: 0, y: 8 });
    tl.to(lines, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.05,
    }, '>-0.45');
  }
}

/* ---- Chapter: FAQ ---- */

function initFaq() {
  const section = document.getElementById('faq');
  if (!section) {
    return;
  }

  const tl = chapterTimeline(section);
  const details = Array.from(section.querySelectorAll('.faq-item'));
  const otherReveals = revealItems(section).filter((node) => !node.classList.contains('faq-item'));

  addReveal(tl, otherReveals, 0);
  addWords(tl, section, 0.08);
  addReveal(tl, details, '>-0.1', { stagger: 0.11 });
}

/* ---- Chapter: Epilogue ---- */

function initEpilogue() {
  const { gsap } = window;
  const section = document.getElementById('epilogue');
  if (!section) {
    return;
  }

  const track = section.querySelector('.track-line');
  const columns = Array.from(section.querySelectorAll('.footer-grid > *'));
  const legal = section.querySelector('.legal-row');

  if (track) {
    gsap.set(track, { scaleX: 0, transformOrigin: 'left center' });
  }
  gsap.set(columns, { autoAlpha: 0, y: 34 });
  if (legal) {
    gsap.set(legal, { autoAlpha: 0, y: 24 });
  }

  const tl = chapterTimeline(section);
  if (track) {
    tl.to(track, { scaleX: 1, duration: 1, ease: 'power3.out' }, 0);
  }
  if (columns.length) {
    tl.to(columns, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
    }, 0.18);
  }
  if (legal) {
    tl.to(legal, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '>-0.25');
  }
}

/* ---- Navigation ---- */

function initNav(lenis) {
  const { gsap, ScrollTrigger } = window;
  const nav = document.getElementById('site-nav');
  const progress = document.getElementById('nav-progress');
  let lastY = window.scrollY || 0;
  let hidden = false;

  function setHidden(nextHidden) {
    if (!nav || hidden === nextHidden) {
      return;
    }

    hidden = nextHidden;
    gsap.to(nav, {
      yPercent: hidden ? -110 : 0,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: true,
    });
  }

  function handleScroll(scrollValue) {
    const y = Math.max(0, scrollValue || window.scrollY || 0);
    const goingDown = y > lastY;
    setHidden(goingDown && y > 140);
    lastY = y;
  }

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => handleScroll(scroll));
  } else {
    window.addEventListener('scroll', () => handleScroll(window.scrollY), { passive: true });
  }

  if (progress) {
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      if (!lenis) {
        setHidden(self.direction === 1 && self.scroll() > 140);
      }
    },
  });
}

/* ---- Reduced Motion ---- */

function initReducedMotion(bg) {
  const { gsap } = window;

  if (bg) {
    bg.setIntensity(0);
  }

  gsap.set('[data-reveal]', { autoAlpha: 1, y: 0, clearProps: 'filter,transform' });
  gsap.set('.wi', { yPercent: 0 });
  gsap.set('.scene-numeral', { yPercent: 0 });
  gsap.set('.paint-stroke, .pipeline-rail, .track-line', { scaleX: 1 });
  gsap.set('.t-line', { autoAlpha: 1, y: 0 });
}
