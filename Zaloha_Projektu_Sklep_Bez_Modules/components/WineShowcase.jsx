'use client';

/**
 * WineShowcase.jsx — Sklep u Dvořáků  v10 "Spotlight"
 *
 * ★ wine-bottle.png: průhledné pozadí, rozměry 2000 × 2362 px
 *   → umístit do /public/images/wine-bottle.png
 *
 * Layout — třísloupkový grid:
 *  ┌──────────────────────────────────────────────────────┐
 *  │                   TOP BAR  56px                      │
 *  ├───────────────────┬──────────────┬───────────────────┤
 *  │  LEFT INFO PANEL  │   BOTTLE     │  TASTING PANEL    │
 *  │  1fr              │  SPOTLIGHT   │  1fr              │
 *  ├───────────────────┴──────────────┴───────────────────┤
 *  │              SELECTOR STRIP  72px                    │
 *  └──────────────────────────────────────────────────────┘
 *
 * ZMĚNY:
 * – CTA "Více o víně" → "Chci ochutnat" s odkazem na booking
 * – Mobilní optimalizace (desktop/laptop beze změny)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   LAYOUT
───────────────────────────────────────────────────────── */
const TOP_H = 56;   // px — horní lišta
const SEL_H = 72;   // px — selector strip

const BOTTLE_W = 'clamp(220px,28vw,380px)';
const BOTTLE_ASPECT = '2000 / 2362';

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENY
───────────────────────────────────────────────────────── */
const BG    = '#4a0404';
const CREAM = '244,234,215';
const GOLD  = '200,166,74';

const BOTTLE_SRC = '/images/wine-bottle.png';

/* ─────────────────────────────────────────────────────────
   KATALOG VÍN
───────────────────────────────────────────────────────── */
const WINES = [
  {
    id: 'w1', num: '01',
    name: 'Rulandské šedé', vintage: '2022',
    style: 'Bílé · Suché', appellation: 'Pozdní sběr',
    region: 'Hustopečská podoblast',
    notes: ['Zralá hruška', 'Luční med', 'Jemná chlebovinka'],
    pairing: 'Drůbež na bylinkách a krémové omáčky',
    desc: 'Plné a extraktivní víno s typickou chlebovinkou, medovými tóny a dlouhou, sametově hladkou dochutí, která zrcadlí naše vápencové podloží.',
    badge: 'Doporučujeme', accent: '200,166,74',
  },
  {
    id: 'w2', num: '02',
    name: 'Sauvignon', vintage: '2023',
    style: 'Bílé · Suché', appellation: 'Pozdní sběr',
    region: 'Hustopečská podoblast',
    notes: ['Černý bez', 'Bílá broskev', 'Jemná kopřiva'],
    pairing: 'Kozí sýry a čerstvý chřest',
    desc: 'Svěží a uhrančivě aromatické víno. Šťavnatou kyselinku doplňují bohaté tóny kvetoucího černého bezu a listu černého rybízu.',
    badge: 'Novinka', accent: '148,195,128',
  },
  {
    id: 'w3', num: '03',
    name: 'Ryzlink rýnský', vintage: '2021',
    style: 'Bílé · Suché', appellation: 'Výběr z hroznů',
    region: 'Hustopečská podoblast',
    notes: ['Květ lípy', 'Meruňka', 'Lehká mineralita'],
    pairing: 'Pečené sladkovodní ryby a asijská kuchyně',
    desc: 'Královská odrůda v celé své kráse. Pevná struktura, pikantní kyselinka a jemná kořenitost, která zráním nabývá na ušlechtilosti a eleganci.',
    badge: 'Prémium', accent: '210,185,85',
  },
  {
    id: 'w4', num: '04',
    name: 'Chardonnay', vintage: '2022',
    style: 'Bílé · Suché', appellation: 'Výběr z hroznů',
    region: 'Hustopečská podoblast',
    notes: ['Tropické ovoce', 'Lískový oříšek', 'Vanilkový lusk'],
    pairing: 'Těstoviny s mořskými plody a jemná bílá masa',
    desc: 'Mohutné a komplexní víno s krémovou strukturou. Harmonické spojení zralého žlutého ovoce a jemného doteku dubového dřeva.',
    badge: null, accent: '230,190,100',
  },
  {
    id: 'w5', num: '05',
    name: 'Pálava', vintage: '2022',
    style: 'Bílé · Polosladké', appellation: 'Výběr z hroznů',
    region: 'Hustopečská podoblast',
    notes: ['Divoká růže', 'Zralé liči', 'Sladké koření'],
    pairing: 'Pikantní úpravy sýrů a ovocné dezerty',
    desc: 'Okouzlující, plné a příjemně kořenité víno s nezaměnitelným aroma kvetoucích růží, exotického ovoce a dlouhým medovým závěrem.',
    badge: 'Oblíbené', accent: '240,200,120',
  }
];

/* ─────────────────────────────────────────────────────────
    SVG GRAIN
────────────────────────────────────────────────────────── */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────────────────
   ROHOVÝ ORNAMENT
───────────────────────────────────────────────────────── */
function Corner({ pos = 'tl', accent }) {
  const map = {
    tl: { top: 0,    left: 0,   sx: 1,  sy: 1  },
    tr: { top: 0,    right: 0,  sx: -1, sy: 1  },
    bl: { bottom: 0, left: 0,   sx: 1,  sy: -1 },
    br: { bottom: 0, right: 0,  sx: -1, sy: -1 },
  };
  const { sx, sy, ...css } = map[pos];
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden
      style={{
        position: 'absolute', ...css,
        transform: `scale(${sx},${sy})`,
        opacity: 0.48, pointerEvents: 'none',
      }}>
      <path d="M1.5 13 L1.5 1.5 L13 1.5"
        stroke={`rgba(${accent},1)`} strokeWidth="1.2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   HLAVNÍ KOMPONENTA
═══════════════════════════════════════════════════════════ */
export default function WineShowcase() {

  const sectionRef = useRef(null);
  const bottleRef  = useRef(null);
  const beamRef    = useRef(null);
  const glowRef    = useRef(null);
  const bgTintRef  = useRef(null);
  const leftRef    = useRef(null);
  const rightRef   = useRef(null);
  const floatRef   = useRef(null);
  const tlRef      = useRef(null);
  const prevRef    = useRef(0);
  const dirRef     = useRef(1);

  const [activeIdx,   setActiveIdx]   = useState(0);
  const [displayWine, setDisplayWine] = useState(WINES[0]);
  const [isReady,     setIsReady]     = useState(false);

  const lenis = useLenis();
  const wine  = displayWine;
  const A     = wine.accent;

  /* ── Float ────────────────────────────────────────────── */
  const startFloat = useCallback(() => {
    floatRef.current?.kill();
    if (!bottleRef.current) return;
    floatRef.current = gsap.to(bottleRef.current, {
      y: -14, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
  }, []);

  /* ── Glow morph ───────────────────────────────────────── */
  const morphGlow = useCallback((fa, ta) => {
    const f = fa.split(',').map(Number);
    const t = ta.split(',').map(Number);
    const p = { v: 0 };
    gsap.to(p, {
      v: 1, duration: 1.1, ease: 'power2.inOut', overwrite: true,
      onUpdate() {
        const r = Math.round(f[0] + (t[0] - f[0]) * p.v);
        const g = Math.round(f[1] + (t[1] - f[1]) * p.v);
        const b = Math.round(f[2] + (t[2] - f[2]) * p.v);
        const c = `${r},${g},${b}`;
        if (glowRef.current)
          glowRef.current.style.background =
            `radial-gradient(ellipse 44% 76% at 50% 34%,rgba(${c},0.28) 0%,rgba(${c},0.09) 50%,transparent 74%)`;
        if (bgTintRef.current)
          bgTintRef.current.style.background =
            `radial-gradient(ellipse 130% 44% at 50% 0%,rgba(${c},0.07) 0%,transparent 62%)`;
        if (beamRef.current)
          beamRef.current.style.background =
            `linear-gradient(180deg,rgba(${c},0.16) 0%,rgba(${c},0.08) 46%,transparent 80%)`;
      },
    });
  }, []);

  /* ── Master přechod ───────────────────────────────────── */
  const go = useCallback((nextIdx, dir = 1) => {
    if (nextIdx < 0 || nextIdx >= WINES.length) return;
    const prev = prevRef.current;
    if (nextIdx === prev) return;

    tlRef.current?.kill();
    floatRef.current?.kill();
    gsap.killTweensOf(bottleRef.current);
    gsap.killTweensOf([leftRef.current, rightRef.current].filter(Boolean));

    prevRef.current = nextIdx;
    dirRef.current  = dir;

    morphGlow(WINES[prev].accent, WINES[nextIdx].accent);

    tlRef.current = gsap.timeline({
      onComplete() {
        setActiveIdx(nextIdx);
        setDisplayWine(WINES[nextIdx]);

        gsap.fromTo(bottleRef.current,
          { x: dir * 60, opacity: 0, rotateY: dir * -18, scale: 0.88 },
          { x: 0, opacity: 1, rotateY: 0, scale: 1,
            duration: 0.72, ease: 'power3.out', onComplete: startFloat }
        );
        gsap.fromTo(
          [leftRef.current, rightRef.current].filter(Boolean),
          { opacity: 0, y: 16, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.56, ease: 'power3.out', stagger: 0.05 }
        );
      },
    });

    tlRef.current.to(bottleRef.current,
      { x: -dir * 60, opacity: 0, rotateY: dir * 18, scale: 0.88,
        duration: 0.28, ease: 'power2.in' }
    );
    tlRef.current.to(
      [leftRef.current, rightRef.current].filter(Boolean),
      { opacity: 0, y: -10, filter: 'blur(5px)', duration: 0.18, ease: 'power2.in' },
      '<'
    );
  }, [morphGlow, startFloat]);

  /* ── Setup ────────────────────────────────────────────── */
  useEffect(() => {
    if (!sectionRef.current) return;

    const c0 = WINES[0].accent;
    if (glowRef.current)
      glowRef.current.style.background =
        `radial-gradient(ellipse 44% 76% at 50% 34%,rgba(${c0},0.28) 0%,rgba(${c0},0.09) 50%,transparent 74%)`;
    if (bgTintRef.current)
      bgTintRef.current.style.background =
        `radial-gradient(ellipse 130% 44% at 50% 0%,rgba(${c0},0.07) 0%,transparent 62%)`;
    if (beamRef.current)
      beamRef.current.style.background =
        `linear-gradient(180deg,rgba(${c0},0.16) 0%,rgba(${c0},0.08) 46%,transparent 80%)`;

    gsap.set([leftRef.current, rightRef.current].filter(Boolean), { opacity: 0, y: 24 });
    gsap.fromTo(bottleRef.current,
      { y: 80, opacity: 0, scale: 0.86 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 1.22, ease: 'power4.out', delay: 0.26,
        onComplete() { setIsReady(true); startFloat(); },
      }
    );
    gsap.to(
      [leftRef.current, rightRef.current].filter(Boolean),
      { opacity: 1, y: 0, duration: 0.92, ease: 'power3.out', delay: 0.50, stagger: 0.11 }
    );

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop:             () => lenis.scroll,
        getBoundingClientRect: () => ({
          top: 0, left: 0, width: window.innerWidth, height: window.innerHeight,
        }),
      });
    }

    const totalScroll = (WINES.length - 1) * window.innerHeight;
    let lastSnap = 0;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger:      sectionRef.current,
        start:        'top top',
        end:          `+=${totalScroll}`,
        pin:          true,
        anticipatePin: 1,
        snap: {
          snapTo:   1 / (WINES.length - 1),
          duration: { min: 0.36, max: 0.72 },
          delay:    0.04,
          ease:     'power3.inOut',
        },
        onUpdate(self) {
          const raw  = self.progress * (WINES.length - 1);
          const snap = Math.min(Math.round(raw), WINES.length - 1);
          if (snap !== lastSnap) {
            const d = snap > lastSnap ? 1 : -1;
            lastSnap = snap;
            go(snap, d);
          }
        },
      });
    }, sectionRef);

    const onKey = (e) => {
      const c = prevRef.current;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(c + 1,  1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(c - 1, -1);
    };
    window.addEventListener('keydown', onKey);

    /* ── Touch / swipe (mobil + trackpad) ──────────────────
       Horizontální swipe → mění víno
       Vertikální swipe   → nechá projet na ScrollTrigger (přirozený scroll)
    ─────────────────────────────────────────────────────── */
    let tx0 = 0;
    let ty0 = 0;
    let swipeHandled = false;

    const onTS = (e) => {
      tx0 = e.touches[0].clientX;
      ty0 = e.touches[0].clientY;
      swipeHandled = false;
    };
    const onTM = (e) => {
      if (swipeHandled) return;
      const dx = e.touches[0].clientX - tx0;
      const dy = e.touches[0].clientY - ty0;
      /* Pokud je pohyb víc horizontální než vertikální → swipe mezi víny */
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
        e.preventDefault();      // zamezit page-scroll jen pro horizontální swipe
        swipeHandled = true;
        const c = prevRef.current;
        go(dx < 0 ? c + 1 : c - 1, dx < 0 ? 1 : -1);
      }
      /* Vertikální pohyb → nic neblokujeme, ScrollTrigger/Lenis pokračují */
    };
    const onTE = (e) => {
      if (swipeHandled) return;
      const dx = e.changedTouches[0].clientX - tx0;
      const dy = e.changedTouches[0].clientY - ty0;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        const c = prevRef.current;
        go(dx < 0 ? c + 1 : c - 1, dx < 0 ? 1 : -1);
      }
    };

    const sec = sectionRef.current;
    sec.addEventListener('touchstart', onTS, { passive: true });
    sec.addEventListener('touchmove',  onTM, { passive: false }); // passive: false kvůli preventDefault
    sec.addEventListener('touchend',   onTE, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      sec.removeEventListener('touchstart', onTS);
      sec.removeEventListener('touchmove',  onTM);
      sec.removeEventListener('touchend',   onTE);
      floatRef.current?.kill();
      tlRef.current?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      id="vina"
      aria-label="Naše vína"
      style={{
        position:   'relative',
        height:     '100vh',
        background: BG,
        overflow:   'hidden',
        marginTop:  'clamp(-52px,-6.5vw,-88px)',
        userSelect: 'none',
      }}
    >

      {/* ── Dekorativní vrstvy ─────────────────────────────── */}
      <div ref={bgTintRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}/>
      <div ref={glowRef}   aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}/>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: GRAIN, backgroundSize: '160px',
        opacity: 0.028, mixBlendMode: 'overlay',
        pointerEvents: 'none', zIndex: 3,
      }}/>
      {/* Vignette */}
      <div aria-hidden style={{
        position:   'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 90% at 50% 42%,transparent 38%,rgba(20,1,1,0.32) 100%)',
        pointerEvents: 'none', zIndex: 4,
      }}/>
      {/* Boční přechody */}
      <div aria-hidden style={{
        position:   'absolute', inset: 0,
        background: `linear-gradient(to right,rgba(28,2,2,0.28) 0%,transparent 26%,transparent 74%,rgba(28,2,2,0.28) 100%)`,
        pointerEvents: 'none', zIndex: 4,
      }}/>

      {/* ══════════════════════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position:     'absolute', top: 0, left: 0, right: 0, height: TOP_H,
        display:      'flex', alignItems: 'center', justifyContent: 'space-between',
        padding:      '0 clamp(24px,4vw,64px)',
        zIndex:       40,
        borderBottom: `1px solid rgba(${CREAM},0.042)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 1, background: `rgba(${GOLD},0.55)` }}/>
          <span style={{
            fontFamily:    'var(--font-body,"Raleway",sans-serif)',
            fontSize:      8.5,
            fontWeight:    700,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color:         `rgba(${GOLD},0.80)`,
          }}>
            Naše vína
          </span>
        </div>
        <div style={{
          display:    'flex', alignItems: 'baseline', gap: 6,
          fontFamily: 'var(--font-display,"Cormorant Garamond","Playfair Display",serif)',
        }}>
          <span style={{ fontSize: 22, lineHeight: 1, color: `rgba(${A},1)`, transition: 'color 0.52s ease', fontWeight: 600 }}>
            {String(activeIdx + 1).padStart(2, '0')}
          </span>
          <span style={{ fontSize: 12, color: `rgba(${CREAM},0.28)` }}>/</span>
          <span style={{ fontSize: 12, color: `rgba(${CREAM},0.28)` }}>
            {String(WINES.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          TŘÍSLOUPKOVÝ STAGE
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position:              'absolute',
        top:                   TOP_H,
        bottom:                SEL_H,
        left:                  0,
        right:                 0,
        display:               'grid',
        gridTemplateColumns:   '1fr auto 1fr',
        alignItems:            'center',
        zIndex:                10,
        overflow:              'hidden',
      }}>

        {/* ────────────────────────────────────────────────────
            LEVÝ PANEL
        ──────────────────────────────────────────────────── */}
        <div style={{
          height:          '100%',
          display:         'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding:         '0 clamp(28px,3.6vw,56px)',
          position:        'relative',
          overflow:        'visible',
        }}>

          {/* Ghost číslo */}
          <div aria-hidden style={{
            position:        'absolute',
            bottom:          '8%',
            right:           'clamp(20px,2.5vw,40px)',
            fontFamily:      'var(--font-display,"Cormorant Garamond",serif)',
            fontSize:        'clamp(72px,11vw,148px)',
            color:           'transparent',
            WebkitTextStroke: `1px rgba(${A},0.10)`,
            lineHeight:      1,
            letterSpacing:   '-0.04em',
            pointerEvents:   'none',
            zIndex:          0,
            userSelect:      'none',
            transition:      'all 0.6s ease',
          }}>
            {wine.num}
          </div>

          <div ref={leftRef} style={{
            position:  'relative',
            zIndex:    2,
            maxWidth:  'clamp(280px,28vw,460px)',
            width:     '100%',
          }}>
            <Corner pos="tl" accent={A}/>
            <Corner pos="bl" accent={A}/>

            {/* Styl + badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 20, height: 1, background: `rgba(${A},0.90)`, flexShrink: 0 }}/>
              <span style={{
                fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color:         `rgba(${A},1)`,
                flexShrink:    0,
              }}>
                {wine.style}
              </span>
              {wine.badge && (
                <span style={{
                  fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                  fontSize:      8,
                  fontWeight:    700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color:         `rgba(${A},0.92)`,
                  border:        `1px solid rgba(${A},0.55)`,
                  padding:       '2px 9px',
                  flexShrink:    0,
                }}>
                  {wine.badge}
                </span>
              )}
            </div>

            {/* Název vína — dominantní */}
            <h2 style={{
              fontFamily:    'var(--font-display,"Cormorant Garamond","Playfair Display",serif)',
              fontSize:      'clamp(28px,3.4vw,52px)',
              fontWeight:    600,
              lineHeight:    1.0,
              letterSpacing: '0.01em',
              color:         `rgba(${CREAM},1)`,
              margin:        '0 0 clamp(8px,0.9vh,14px)',
              textShadow:    `0 2px 24px rgba(0,0,0,0.60)`,
              wordBreak:     'normal',
              overflowWrap:  'break-word',
              hyphens:       'auto',
            }}>
              {wine.name}
            </h2>

            {/* Vintage · Region */}
            <p style={{
              fontFamily:    'var(--font-display,"Cormorant Garamond",serif)',
              fontSize:      'clamp(12px,1.05vw,15px)',
              fontWeight:    500,
              color:         `rgba(${A},0.90)`,
              letterSpacing: '0.18em',
              margin:        '0 0 clamp(14px,2vh,24px)',
            }}>
              {wine.vintage} · {wine.region}
            </p>

            {/* Oddělovač */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(12px,1.6vh,20px)' }}>
              <div style={{ width: 32, height: 1, background: `rgba(${A},0.60)` }}/>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: `rgba(${A},0.60)` }}/>
            </div>

            {/* Popis */}
            <p style={{
              fontFamily:          'var(--font-body,"Raleway",sans-serif)',
              fontSize:            'clamp(11.5px,0.86vw,13.5px)',
              fontWeight:          500,
              lineHeight:          1.9,
              letterSpacing:       '0.025em',
              color:               `rgba(${CREAM},0.82)`,
              margin:              '0 0 clamp(18px,2.4vh,30px)',
              overflow:            'hidden',
              display:             '-webkit-box',
              WebkitLineClamp:     4,
              WebkitBoxOrient:     'vertical',
              textShadow:          '0 1px 8px rgba(0,0,0,0.50)',
            }}>
              {wine.desc}
            </p>

            {/* ── CTA: "Chci ochutnat" → booking ──────────────────── */}
            <a
              href="https://rustikal.cz/booking/#/packages"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:       'inline-flex', alignItems: 'center', gap: 10,
                textDecoration: 'none',
                fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                fontSize:      8.5,
                fontWeight:    700,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color:         `rgba(${A},1)`,
                transition:    'gap 0.28s ease,color 0.28s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = '16px'; }}
              onMouseLeave={e => { e.currentTarget.style.gap = '10px'; }}
            >
              Chci ochutnat
              <div style={{ width: 28, height: 1, background: `rgba(${A},0.80)` }}/>
            </a>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────
            STŘEDOVÁ SPOTLIGHT — láhev PNG
        ──────────────────────────────────────────────────── */}
        <div style={{
          position:      'relative',
          width:         BOTTLE_W,
          height:        '100%',
          display:       'flex', alignItems: 'flex-end', justifyContent: 'center',
          paddingBottom: 'clamp(10px,1.5vh,20px)',
        }}>

          <div ref={beamRef} aria-hidden style={{
            position:      'absolute',
            top:           0,
            left:          '50%',
            width:         '160%',
            height:        '72%',
            transform:     'translateX(-50%)',
            pointerEvents: 'none',
            zIndex:        1,
          }}/>

          <div ref={bottleRef} style={{
            position:       'relative',
            width:          '100%',
            transformStyle: 'preserve-3d',
            willChange:     'transform, opacity',
            zIndex:         2,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BOTTLE_SRC}
              alt={wine.name}
              draggable={false}
              style={{
                display:       'block',
                width:         '100%',
                height:        'auto',
                aspectRatio:   BOTTLE_ASPECT,
                objectFit:     'contain',
                pointerEvents: 'none',
                filter:        'drop-shadow(0 0 32px rgba(0,0,0,0.8)) brightness(1.04)',
              }}
            />

            <div aria-hidden style={{
              position:     'absolute',
              bottom:       2,
              left:         '50%',
              transform:    'translateX(-50%)',
              width:        '50%',
              height:       32,
              background:   `rgba(${wine.accent},0.52)`,
              filter:       'blur(22px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}/>

            <div aria-hidden style={{
              position:     'absolute',
              bottom:       8,
              left:         '50%',
              transform:    'translateX(-50%)',
              width:        '48%',
              height:       2,
              background:   `rgba(${wine.accent},0.84)`,
              boxShadow:    `0 0 28px 10px rgba(${wine.accent},0.26)`,
              borderRadius: '50%',
              pointerEvents: 'none',
            }}/>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────
            PRAVÝ PANEL — tasting notes + párování
        ──────────────────────────────────────────────────── */}
        <div style={{
          height:   '100%',
          display:  'flex', alignItems: 'center', justifyContent: 'flex-start',
          padding:  '0 clamp(28px,3.6vw,56px)',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Ghost vintage */}
          <div aria-hidden style={{
            position:         'absolute',
            bottom:           '8%',
            left:             'clamp(20px,2.5vw,40px)',
            fontFamily:       'var(--font-display,"Cormorant Garamond",serif)',
            fontSize:         'clamp(64px,9.5vw,128px)',
            color:            'transparent',
            WebkitTextStroke: `1px rgba(${A},0.10)`,
            lineHeight:       1,
            letterSpacing:    '-0.03em',
            pointerEvents:    'none',
            zIndex:           0,
            userSelect:       'none',
            transition:       'all 0.6s ease',
          }}>
            {wine.vintage}
          </div>

          <div ref={rightRef} style={{
            position: 'relative',
            zIndex:   2,
            maxWidth: 'clamp(200px,20vw,300px)',
            width:    '100%',
          }}>
            <Corner pos="tr" accent={A}/>
            <Corner pos="br" accent={A}/>

            {/* Appellation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 14, height: 1, background: `rgba(${A},0.55)`, flexShrink: 0 }}/>
              <span style={{
                fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                fontSize:      8.5,
                fontWeight:    700,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color:         `rgba(${CREAM},0.65)`,
              }}>
                {wine.appellation}
              </span>
            </div>

            {/* Chuťový profil label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 10, height: 1, background: `rgba(${A},0.44)`, flexShrink: 0 }}/>
              <span style={{
                fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                fontSize:      8,
                fontWeight:    700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color:         `rgba(${CREAM},0.55)`,
              }}>
                Chuťový profil
              </span>
            </div>

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,1.1vh,16px)', marginBottom: 24 }}>
              {wine.notes.map((note, ni) => (
                <div key={note} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width:        5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background:   `rgba(${A},${1 - ni * 0.18})`,
                    boxShadow:    `0 0 6px rgba(${A},0.50)`,
                  }}/>
                  <div style={{ flex: 1, height: 1, background: `rgba(${A},${0.28 - ni * 0.04})` }}/>
                  <span style={{
                    fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                    fontSize:      'clamp(11px,0.88vw,13px)',
                    fontWeight:    600,
                    letterSpacing: '0.04em',
                    color:         `rgba(${CREAM},${0.90 - ni * 0.12})`,
                    whiteSpace:    'nowrap',
                    textShadow:    '0 1px 8px rgba(0,0,0,0.55)',
                  }}>
                    {note}
                  </span>
                </div>
              ))}
            </div>

            {/* Párování oddělovač */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: `rgba(${A},0.65)` }}/>
              <div style={{ width: 22, height: 1, background: `rgba(${A},0.55)` }}/>
              <span style={{
                fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                fontSize:      8,
                fontWeight:    700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color:         `rgba(${CREAM},0.55)`,
              }}>
                Párování
              </span>
            </div>

            {/* Párování text */}
            <p style={{
              fontFamily:    'var(--font-body,"Raleway",sans-serif)',
              fontSize:      'clamp(11px,0.82vw,13px)',
              fontWeight:    500,
              color:         `rgba(${CREAM},0.78)`,
              letterSpacing: '0.04em',
              lineHeight:    1.78,
              margin:        0,
              maxWidth:      '22ch',
              textShadow:    '0 1px 8px rgba(0,0,0,0.50)',
            }}>
              {wine.pairing}
            </p>
          </div>
        </div>

      </div>{/* / grid */}

      {/* ══════════════════════════════════════════════════════
          NAVIGAČNÍ ŠIPKY
      ══════════════════════════════════════════════════════ */}
      {(['left', 'right']).map(side => {
        const d   = side === 'left' ? -1 : 1;
        const off = d === -1 ? activeIdx === 0 : activeIdx === WINES.length - 1;
        return (
          <button
            key={side}
            onClick={() => go(prevRef.current + d, d)}
            aria-label={d === -1 ? 'Předchozí víno' : 'Další víno'}
            style={{
              position:  'absolute',
              top:       `calc(${TOP_H}px + (100vh - ${TOP_H}px - ${SEL_H}px) / 2)`,
              [side]:    'clamp(10px,1.8vw,28px)',
              transform: 'translateY(-50%)',
              zIndex:    30,
              background: 'none', border: 'none',
              cursor:    off ? 'default' : 'pointer',
              width:     44, height: 44, padding: 0,
              display:   'flex', alignItems: 'center', justifyContent: 'center',
              opacity:   off ? 0.08 : 0.44,
              transition: 'opacity 0.28s',
            }}
            onMouseEnter={e => { if (!off) e.currentTarget.style.opacity = '0.92'; }}
            onMouseLeave={e => { if (!off) e.currentTarget.style.opacity = '0.44'; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d={d === -1 ? 'M10 2L5 7L10 12' : 'M4 2L9 7L4 12'}
                stroke={`rgba(${CREAM},1)`} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}

      {/* ══════════════════════════════════════════════════════
          SELECTOR STRIP
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position:     'absolute', bottom: 0, left: 0, right: 0, height: SEL_H,
        display:      'flex',
        zIndex:       28,
        borderTop:    `1px solid rgba(${CREAM},0.080)`,
        background:   'rgba(74,4,4,0.97)',
        backdropFilter: 'blur(8px)',
      }}>
        {WINES.map((w, i) => {
          const active = i === activeIdx;
          return (
            <button
              key={w.id}
              onClick={() => go(i, i > prevRef.current ? 1 : -1)}
              aria-label={`${w.name} ${w.vintage}${active ? ' (aktivní)' : ''}`}
              aria-pressed={active}
              style={{
                flex:        active ? '2.8 1 0' : '1 1 0',
                transition:  'flex 0.50s cubic-bezier(0.16,1,0.3,1)',
                background:  'none', border: 'none', cursor: 'pointer',
                padding:     '0 clamp(8px,1.2vw,18px)',
                display:     'flex', alignItems: 'center', gap: 10,
                position:    'relative', overflow: 'hidden',
                borderRight: i < WINES.length - 1 ? `1px solid rgba(${CREAM},0.070)` : 'none',
                minWidth:    0,
              }}
            >
              {/* LED linka */}
              <div aria-hidden style={{
                position:   'absolute', top: 0, left: 0, right: 0,
                height:     active ? 2 : 1,
                background: active ? `rgba(${w.accent},1)` : `rgba(${w.accent},0.28)`,
                boxShadow:  active ? `0 0 14px rgba(${w.accent},0.60)` : 'none',
                transition: 'height 0.36s,background 0.36s,box-shadow 0.36s',
              }}/>

              {/* Číslo */}
              <span style={{
                fontFamily:  'var(--font-display,"Cormorant Garamond",serif)',
                fontSize:    active ? 'clamp(16px,1.8vw,23px)' : 'clamp(12px,1.2vw,15px)',
                fontWeight:  active ? 600 : 400,
                color:       active ? `rgba(${w.accent},1)` : `rgba(${CREAM},0.32)`,
                lineHeight:  1, flexShrink: 0,
                transition:  'font-size 0.34s,color 0.34s',
                minWidth:    '1.8em', textAlign: 'center',
              }}>
                {w.num}
              </span>

              {/* Název + vintage — jen aktivní */}
              <div style={{
                display:    'flex', flexDirection: 'column', gap: 2,
                overflow:   'hidden', flex: 1, minWidth: 0,
                opacity:    active ? 1 : 0,
                transform:  active ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'opacity 0.24s ease 0.08s,transform 0.28s ease 0.08s',
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontFamily:   'var(--font-display,"Cormorant Garamond",serif)',
                  fontSize:     'clamp(12px,1.08vw,16px)',
                  fontWeight:   600,
                  color:        `rgba(${CREAM},0.96)`,
                  whiteSpace:   'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {w.name}
                </span>
                <span style={{
                  fontFamily:    'var(--font-body,"Raleway",sans-serif)',
                  fontSize:      7.5,
                  fontWeight:    600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color:         `rgba(${CREAM},0.45)`,
                }}>
                  {w.vintage}
                </span>
              </div>

              {/* Dot pro neaktivní */}
              {!active && (
                <div aria-hidden style={{
                  position:     'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)',
                  width:        3, height: 3, borderRadius: '50%',
                  background:   `rgba(${w.accent},0.40)`,
                }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Scroll hint ─────────────────────────────────────── */}
      {activeIdx === 0 && isReady && (
        <div aria-hidden style={{
          position:   'absolute',
          bottom:     SEL_H + 20,
          right:      'clamp(24px,4vw,64px)',
          zIndex:     30,
          display:    'flex', alignItems: 'center', gap: 8,
          animation:  'wsh 2.4s ease-in-out infinite',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily:    'var(--font-body,"Raleway",sans-serif)',
            fontSize:      7.5,
            fontWeight:    600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         `rgba(${CREAM},0.38)`,
          }}>
            Rolujte
          </span>
          <span style={{ color: `rgba(${CREAM},0.38)`, fontSize: 11 }}>↓</span>
        </div>
      )}

      {/* ── Progress bar ─────────────────────────────────────── */}
      <div aria-hidden style={{
        position:   'absolute', bottom: 0, left: 0, right: 0,
        height:     2,
        zIndex:     35,
        background: `rgba(${GOLD},0.052)`,
      }}>
        <div style={{
          height:     '100%',
          width:      `${(activeIdx / Math.max(WINES.length - 1, 1)) * 100}%`,
          background: `rgba(${A},0.72)`,
          boxShadow:  `0 0 10px rgba(${A},0.52)`,
          transition: 'width 0.62s cubic-bezier(0.16,1,0.3,1),background 0.5s ease',
        }}/>
      </div>

      <style>{`
        @keyframes wsh {
          0%,100% { opacity: .22; transform: translateY(0); }
          50%      { opacity: .72; transform: translateY(5px); }
        }
        #vina button:focus-visible {
          outline:        1px solid rgba(${GOLD},0.70);
          outline-offset: 2px;
          border-radius:  2px;
        }

        /* ── MOBILNÍ OPTIMALIZACE ───────────────────────────────
           Desktop/laptop layout je beze změny.
           Media query platí pouze pro < 640 px.
        ──────────────────────────────────────────────────────── */

        /* Pravý panel: skrytý na mobilu (původní chování zachováno) */
        @media (max-width: 640px) {
          #vina [data-right] { display: none; }
        }

        /* Levý panel: přizpůsobit font nadpisu na úzkých telefonech */
        @media (max-width: 480px) {
          #vina .wine-name-heading {
            font-size: clamp(22px, 7vw, 40px) !important;
          }
          /* Popis: zkrátit na 3 řádky na malých telefonech */
          #vina .wine-desc {
            -webkit-line-clamp: 3 !important;
          }
          /* Grid: na mobilu přepnout z třísloupce na 1 sloupeček
             (láhev uprostřed, levý panel dole) */
          #vina .stage-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
          }
        }

        /* Swipe hint na mobilu — "swipe" místo "rolujte" na dotykových zařízeních */
        @media (hover: none) and (pointer: coarse) {
          #vina .scroll-hint-text::after {
            content: ' · swipe';
            opacity: 0.6;
          }
        }
      `}</style>

    </section>
  );
}