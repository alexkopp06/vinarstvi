'use client';

/**
 * CellarGallery.jsx — Sklep u Dvořáků
 * v7 "Optimized Vault"
 * OPRAVY VÝKONU:
 * - clipPath reveal → opacity + translateX (GPU akcelerace)
 * - will-change pouze na aktivně animovaných prvcích
 * - loading="eager" pro první (hero) obrázek
 * - once: true na všech ScrollTriggerech
 * - onLeave → onMouseLeave (fix React event bug)
 * - parallax omezen na 3 obrázky místo 5
 * - skewX odstraněn z heading animace (eliminuje layout recalc)
 * - getBoundingClientRect cache reset pouze při resize
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ── Tokens — BEZE ZMĚNY ─────────────────────────────────────── */
const GOLD  = '201, 168, 76';
const CREAM = '240, 228, 208';
const BG    = '#4A0404';
const PAD_L = 'clamp(24px, 8vw, 120px)';
const PAD_R = 'clamp(24px, 6vw, 80px)';

/* ── Editorial grid data — BEZE ZMĚNY ───────────────────────── */
const GRID = [
  {
    id: 'g1',
    src: '/obrazkos.png',
    alt: 'Kamenné klenby starého sklepa',
    title: 'Víno v kroji', sub: 'Moravský folklor a chuť domova',
    tag: 'DEGUSTACE', num: '01',
    gridArea: '1 / 1 / 3 / 2',
    objPos: 'center 30%',
    loading: 'eager',
    parallax: true,
  },
  {
    id: 'g2',
    src: '/pastika.png',
    alt: 'Vinice za soumraku nad Hustopečemi',
    title: 'Společné slavnosti', sub: 'Setkání přátel vína v Hustopečích',
    tag: 'AKCE', num: '02',
    gridArea: '1 / 2 / 2 / 4',
    objPos: 'center 55%',
    loading: 'lazy',
    parallax: true,
  },
  {
    id: 'g3',
    src: '/pas.png',
    alt: 'Večerní degustace moravského vína',
    title: 'Moravský stůl', sub: 'Domácí speciality ke každému vínu',
    tag: 'GASTRO', num: '03',
    gridArea: '1 / 4 / 2 / 5',
    objPos: 'center 25%',
    loading: 'lazy',
    parallax: false,
  },
  {
    id: 'g4',
    src: 'jupi.png',
    alt: 'Řada lahví moravského vína',
    title: 'Večery pod klenbou', sub: 'Smích, víno a příběhy ve sklepě',
    tag: 'ZÁŽITKY', num: '04',
    gridArea: '2 / 2 / 3 / 3',
    objPos: 'center 40%',
    loading: 'lazy',
    parallax: false,
  },
  {
    id: 'g5',
    src: 'sklep.png',
    alt: 'Ruční sběr hroznů v Hustopečích',
    title: 'Živá tradice', sub: 'Tanec a zpěv ve starých sklepích',
    tag: 'FOLKLOR', num: '05',
    gridArea: '2 / 3 / 3 / 5',
    objPos: 'center 45%',
    loading: 'lazy',
    parallax: true,
  },
];

const STATS = [
  { num: '2007', label: 'Rok založení' },
{ num: '12+', label: 'Vzorků k degustaci' },
  { num: '8 m',  label: 'Pod zemí'   },
  { num: '12 ha', label: 'Vinic'     },
];

/* ── Single grid photo ───────────────────────────────────────── */
function GridPhoto({ photo }) {
  const wrapRef  = useRef(null);
  const imgRef   = useRef(null);
  const panelRef = useRef(null);
  const tagRef   = useRef(null);
  const titleRef = useRef(null);
  const subRef   = useRef(null);
  const hovTl    = useRef(null);
  const bnds     = useRef(null);

  /* Cache invalidaci při resize — ne při každém mousemove */
  useEffect(() => {
    const invalidate = () => { bnds.current = null; };
    window.addEventListener('resize', invalidate, { passive: true });
    return () => window.removeEventListener('resize', invalidate);
  }, []);

  useEffect(() => {
    hovTl.current = gsap.timeline({ paused: true })
      /* Jen zoom — žádné ztmavení ani filter */
      .to(imgRef.current, {
        scale: 1.06,
        duration: 0.9,
        ease: 'power2.out',
      }, 0)
      /* Frosted-glass panel vyjíždí zespodu */
      .fromTo(panelRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power4.out' }, 0)
      .fromTo(tagRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.08)
      .fromTo(titleRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.18)
      .fromTo(subRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.28);

    return () => hovTl.current?.kill();
  }, []);

  const onMove = useCallback((e) => {
    if (!wrapRef.current) return;
    /* Použij cache — nevolej getBoundingClientRect každý frame */
    if (!bnds.current) {
      bnds.current = wrapRef.current.getBoundingClientRect();
    }
    const { left, top, width, height } = bnds.current;
    const nx = ((e.clientX - left) / width  - 0.5) * 2;
    const ny = ((e.clientY - top)  / height - 0.5) * 2;
    gsap.to(wrapRef.current, { rotateY: nx * 5, rotateX: -ny * 3.5, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(imgRef.current,  { x: nx * -9, y: ny * -6, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
  }, []);

  const onEnter = useCallback(() => {
    /* Refresh cache při každém novém hoveru */
    bnds.current = wrapRef.current?.getBoundingClientRect() ?? null;
    hovTl.current?.play();
  }, []);

  const onLeave = useCallback(() => {
    hovTl.current?.reverse();
    gsap.to(wrapRef.current, { rotateY: 0, rotateX: 0, duration: 1.1, ease: 'elastic.out(1,0.48)', overwrite: 'auto' });
    gsap.to(imgRef.current,  { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1,0.48)', overwrite: 'auto' });
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', perspective: '900px' }}>
      {/* Floating number */}
      <div aria-hidden style={{
        position: 'absolute', top: 14, left: 16, zIndex: 20,
        fontFamily: 'var(--font-display,serif)', fontSize: 10,
        color: `rgba(${GOLD},0.55)`, letterSpacing: '0.22em',
        pointerEvents: 'none',
      }}>
        {photo.num}
      </div>

      <div
        ref={wrapRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
        style={{
          width: '100%', height: '100%', overflow: 'hidden',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        role="figure" aria-label={photo.alt}
      >
        {/* Photo */}
        <img
          ref={imgRef}
          src={photo.src}
          alt={photo.alt}
          decoding="async"
          loading={photo.loading}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: photo.objPos,
            transform: 'scale(1.05) translateZ(0)',
            willChange: 'transform',
            transition: 'none',
          }}
        />

        {/* Spodní gradient pro čitelnost při idle */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,2,2,0.5) 0%, transparent 35%)',
          zIndex: 4, pointerEvents: 'none',
        }} />

        {/* Hover panel — frosted glass */}
        <div ref={panelRef} style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '30px 22px 22px',
          clipPath: 'inset(100% 0 0 0)',
          background: 'rgba(240, 228, 208, 0.84)',
          backdropFilter: 'blur(16px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          borderTop: `1px solid rgba(${GOLD}, 0.3)`,
          zIndex: 10,
          willChange: 'clip-path',
        }}>
          <div style={{
            height: 1, marginBottom: 13,
            background: `linear-gradient(90deg,rgba(${GOLD},0.8) 0%,rgba(${GOLD},0.12) 60%,transparent 100%)`,
          }} />

          <div ref={tagRef} style={{
            display: 'inline-flex', padding: '4px 11px', marginBottom: 11,
            border: `1px solid rgba(148,108,28,0.4)`,
            background: `rgba(148,108,28,0.1)`,
            opacity: 0,
          }}>
            <span style={{
              fontFamily: 'var(--font-body,sans-serif)', fontSize: 8,
              textTransform: 'uppercase', letterSpacing: '0.28em',
              color: 'rgba(100,62,0,1)',
            }}>{photo.tag}</span>
          </div>

          <h3 ref={titleRef} style={{
            fontFamily: 'var(--font-display,serif)', fontWeight: 400,
            fontSize: 'clamp(15px,1.6vw,24px)',
            color: 'rgba(35,8,8,1)',
            letterSpacing: '0.02em', lineHeight: 1.12,
            marginBottom: 6, opacity: 0,
          }}>{photo.title}</h3>

          <p ref={subRef} style={{
            fontFamily: 'var(--font-body,sans-serif)', fontSize: 10,
            color: 'rgba(80,28,28,0.72)',
            letterSpacing: '0.045em', fontWeight: 300,
            opacity: 0,
          }}>{photo.sub}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function CellarGallery() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headingRef  = useRef(null);
  const descRef     = useRef(null);
  const ruleRef     = useRef(null);
  const gridRef     = useRef(null);
  const statsRef    = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop:             () => lenis.scroll,
        getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }),
      });
    }

    const ctx = gsap.context(() => {
      /* ── Eyebrow ── */
      gsap.fromTo(eyebrowRef.current,
        { opacity: 0, x: -22 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } });

      /* ── Heading — FIX: bez skewX (eliminuje layout recalc) ── */
      const lines = headingRef.current?.querySelectorAll('.cg-line') ?? [];
      lines.forEach((line, i) => {
        gsap.fromTo(line,
          { yPercent: 116 },
          { yPercent: 0, duration: 1.2, ease: 'power4.out', delay: i * 0.13,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } });
      });

      /* ── Desc ── */
      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.35,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 74%', once: true } });
      }

      /* ── Gold rule ── */
      if (ruleRef.current) {
        gsap.fromTo(ruleRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.1, ease: 'power3.inOut',
            scrollTrigger: { trigger: ruleRef.current, start: 'top 90%', once: true } });
      }

      /* ── Grid cells reveal ── */
      const cells = gridRef.current?.querySelectorAll('[data-cell]') ?? [];
      cells.forEach((cell, i) => {
        gsap.fromTo(cell,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', delay: i * 0.09,
            scrollTrigger: { trigger: gridRef.current, start: 'top 72%', once: true } });
      });

      /* ── Parallax — jen vybrané buňky (photo.parallax === true) ── */
      if (isDesktop) {
        cells.forEach((cell) => {
          if (!cell.dataset.parallax) return;
          const img = cell.querySelector('img');
          if (!img) return;
          gsap.fromTo(img,
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', force3D: true,
              scrollTrigger: {
                trigger: cell,
                start: 'top bottom', end: 'bottom top',
                scrub: 1.8,
              } });
        });
      }

      /* ── Stats ── */
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('[data-stat]');
        gsap.fromTo(items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 86%', once: true } });
      }
    }, sectionRef);

    return () => { ctx.revert(); };
  }, [lenis, isDesktop]);

  return (
    <>
      <section
        ref={sectionRef}
        id="sklep-galerie"
        style={{ background: BG, position: 'relative', overflow: 'hidden', paddingBottom: 'clamp(48px,7vw,100px)' }}
      >
        {/* Watermark */}
        <div aria-hidden style={{
          position: 'absolute', right: 'clamp(10px,2vw,28px)', top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          fontFamily: 'var(--font-display,serif)',
          fontSize: 'clamp(80px,16vw,220px)',
          color: 'transparent', WebkitTextStroke: `1px rgba(${GOLD},0.025)`,
          letterSpacing: '0.38em', userSelect: 'none',
          pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap',
        }}>GALERIE</div>

        {/* Tenká levá linka */}
        <div aria-hidden style={{
          position: 'absolute', left: 'clamp(10px,1.5vw,20px)', top: 0, bottom: 0,
          width: 1,
          background: `linear-gradient(to bottom, transparent 10%, rgba(${GOLD},0.14) 40%, rgba(${GOLD},0.14) 60%, transparent 90%)`,
          zIndex: 2,
        }} />

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 5,
          paddingTop: 'clamp(88px,11vw,150px)',
          paddingBottom: 'clamp(36px,4.5vw,60px)',
          paddingLeft: PAD_L, paddingRight: PAD_R,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 24,
        }}>
          <div>
            <div ref={eyebrowRef} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, opacity: 0 }}>
              <div style={{ width: 28, height: 1, background: `rgba(${GOLD},1)`, flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body,sans-serif)', fontSize: 9,
                letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(${GOLD},1)`,
              }}>Galerie · Sklep u Dvořáků</span>
            </div>

            <div ref={headingRef} style={{ lineHeight: 0.87 }}>
              {['Sklep,', 'vinice,', 'příběhy.'].map((word) => (
                <div key={word} style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                  <div className="cg-line" style={{
                    fontFamily: 'var(--font-display,serif)',
                    fontSize: 'clamp(44px,7.5vw,118px)',
                    color: `rgba(${CREAM},1)`,
                    fontWeight: 400, letterSpacing: '0.015em',
                    willChange: 'transform', display: 'block',
                  }}>{word}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={descRef} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            gap: 16, maxWidth: '24ch', paddingBottom: 8, opacity: 0, flexShrink: 0,
          }} className="hidden lg:flex">
            <p style={{
              fontFamily: 'var(--font-body,sans-serif)', fontSize: 11, lineHeight: 1.9,
              color: `rgba(${CREAM},0.32)`, letterSpacing: '0.022em', textAlign: 'right',
            }}>
              Rodinné vinařství v Hustopečích.<br />
              Tradice od roku 1884, ruční sběr,<br />
              přirozené metody vinifikace.
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display,serif)',
                fontSize: 52, color: `rgba(${CREAM},1)`,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.03em',
              }}>5</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontFamily: 'var(--font-body,sans-serif)', fontSize: 8,
                  letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(${GOLD},0.55)`,
                }}>Fotografií</span>
                <span style={{
                  fontFamily: 'var(--font-body,sans-serif)', fontSize: 8,
                  letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(${GOLD},0.3)`,
                }}>Ze sklepa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gold rule */}
        <div ref={ruleRef} style={{
          marginLeft: PAD_L, marginRight: PAD_R,
          height: 1, marginBottom: 'clamp(24px,3vw,44px)',
          background: `linear-gradient(90deg,rgba(${GOLD},0.6) 0%,rgba(${GOLD},0.06) 50%,transparent 100%)`,
          transformOrigin: 'left',
          willChange: 'transform, opacity',
          position: 'relative', zIndex: 5,
        }} />

        {/* ── Editorial photo grid ────────────────────────────── */}
        <div
          ref={gridRef}
          style={{
            position: 'relative', zIndex: 5,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'clamp(220px,32vw,460px) clamp(190px,26vw,380px)',
            gap: 'clamp(6px, 0.75vw, 12px)',
            paddingLeft: PAD_L, paddingRight: PAD_R,
          }}
        >
          {GRID.map((photo) => (
            <div
              key={photo.id}
              data-cell=""
              data-parallax={photo.parallax ? '' : undefined}
              style={{
                gridArea: photo.gridArea,
                opacity: 0,
                overflow: 'hidden',
                borderRadius: 'clamp(6px, 0.75vw, 12px)',
              }}
            >
              <GridPhoto photo={photo} />
            </div>
          ))}
        </div>

        {/* ── Stats & CTA bar ──────────────────────────────────── */}
        <div
          ref={statsRef}
          style={{
            position: 'relative', zIndex: 5,
            paddingTop: 'clamp(36px,5vw,70px)',
            paddingLeft: PAD_L, paddingRight: PAD_R,
            display: 'flex', alignItems: 'center',
            flexWrap: 'wrap', gap: 'clamp(20px,3.5vw,56px)',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: PAD_L, right: PAD_R, height: 1,
            background: `rgba(${GOLD},0.1)`,
          }} />

          {STATS.map(({ num, label }) => (
            <div key={num} data-stat="" style={{ display: 'flex', flexDirection: 'column', gap: 5, opacity: 0 }}>
              <span style={{
                fontFamily: 'var(--font-display,serif)',
                fontSize: 'clamp(26px,3.2vw,50px)',
                color: `rgba(${CREAM},1)`,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
              }}>{num}</span>
              <span style={{
                fontFamily: 'var(--font-body,sans-serif)', fontSize: 9,
                letterSpacing: '0.24em', textTransform: 'uppercase', color: `rgba(${GOLD},0.48)`,
              }}>{label}</span>
            </div>
          ))}

          <div style={{ flex: 1 }} />

          <a
            href="#vina"
            data-stat=""
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              fontFamily: 'var(--font-body,sans-serif)', fontSize: 10,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: `rgba(${GOLD},1)`, textDecoration: 'none',
              padding: '15px 30px',
              border: `1px solid rgba(${GOLD},0.28)`,
              opacity: 0,
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${GOLD},0.07)`;
              e.currentTarget.style.borderColor = `rgba(${GOLD},0.55)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = `rgba(${GOLD},0.28)`;
            }}
          >
            Prohlédnout naše vína
            <span style={{ display: 'inline-block' }}>→</span>
          </a>
        </div>

        {/* Bottom transition */}
        <div aria-hidden style={{ height: 'clamp(36px,4.5vw,60px)', position: 'relative', marginTop: 'clamp(36px,5vw,64px)' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${BG} 100%)`,
            pointerEvents: 'none',
          }} />
        </div>
      </section>
    </>
  );
}