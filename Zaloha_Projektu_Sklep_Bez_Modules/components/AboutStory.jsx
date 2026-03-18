'use client';

/**
 * AboutStory.jsx — Hotel Rustikal
 *
 * ACT I   — Asymmetric split (Historie)
 * ACT 1.5 — Transition Heading (Zažijte Moravu)
 * ACT II  — Cinematic Framed Snap Scroll (Zážitky, Cimbálka, Degustace)
 * ACT III — Stat strip (Statistiky)
 *
 * OPRAVY SLIDE 3 EXIT:
 * - end: '+=200%' → '+=300%'  (pin je 3× delší, každý slide má stejný buffer)
 * - snapTo: [0, 0.5, 1] → [0, 1/3, 2/3]  (slide 3 přistane na 66 %, ne 100 %)
 * - onUpdate prahy upraveny dle nových snap bodů
 * → Slide 3 má nyní plnohodnotný klidový buffer; stránka scrollne dolů
 *   teprve po dalším vědomém scrollu/swipu.
 *
 * MOBILNÍ OPTIMALIZACE (desktop/laptop layout beze změn):
 * - overflowX: hidden na section → ghost year nepřetéká na mobilu
 * - Obrázek ACT I: justify-center na mobilu, širší clamp
 * - Snap scroll heading: menší minimum na úzkých obrazovkách
 * - ACT I text section: plná šířka + vhodný padding
 * - Výšky a odsazení laděné přes media query injekci
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ─── Image sources ──────────────────────────────────────────── */
const IMG_PORTRAIT ='/banán.png';
const IMG_ACCENT =
'/spooky.png';
/* Background images for the Snap Slides */
const IMG_CELLAR   = '/obrázek.png';
const IMG_MUSIC    = '/dalsi-obrazek.png';
const IMG_VINEYARD = '/vinice.png';

/* ─── Stat strip data ────────────────────────────────────────── */
const STATS = [
  { value: 2007,  suffix: '',    label: 'Rok založení'  },
  { value: 12,    suffix: ' ha', label: 'Rozloha vinic' },
  { value: 40000, suffix: '+',   label: 'Lahví ročně'   },
];

/* ─── Soundwave bar heights ─────────────────────────────────── */
const WAVE_H = [38,58,82,96,68,84,100,72,88,62,98,52,74,44];

/* ─── Counter hook ───────────────────────────────────────────── */
function useCounter(ref, target, suffix, trigger) {
  useEffect(() => {
    if (!ref.current || !trigger) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power2.out',
      scrollTrigger: { trigger, start: 'top 75%', once: true },
      onUpdate: () => {
        if (ref.current)
          ref.current.textContent =
            Math.round(obj.val).toLocaleString('cs-CZ') + suffix;
      },
    });
  }, [ref, target, suffix, trigger]);
}

function StatItem({ value, suffix, label, triggerRef }) {
  const numRef = useRef(null);
  useCounter(numRef, value, suffix, triggerRef?.current);
  return (
    <div className="flex flex-col items-start gap-2">
      <span ref={numRef} className="font-display"
        style={{ fontSize: 'clamp(38px,5.5vw,80px)', color: 'var(--color-gold)',
          lineHeight: 1, letterSpacing: '-0.01em', fontWeight: 400 }}>0</span>
      <span className="font-body text-xs uppercase"
        style={{ color: 'var(--color-cream-muted)', letterSpacing: '0.22em' }}>{label}</span>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function AboutStory() {

  /* ACT I */
  const sectionRef    = useRef(null);
  const ghostYearRef  = useRef(null);
  const eyebrowRef    = useRef(null);
  const headingRef    = useRef(null);
  const para1Ref      = useRef(null);
  const para2Ref      = useRef(null);
  const signatureRef  = useRef(null);
  const imgWrapRef    = useRef(null);
  const imgRef        = useRef(null);
  const accentImgRef  = useRef(null);
  const accentWrapRef = useRef(null);

  /* ACT 1.5 - Transition Heading */
  const transitionHeadingRef = useRef(null);

  /* ACT II - Fullpage Snap Refs */
  const expSecRef = useRef(null);

  const bg1 = useRef(null);
  const bg2 = useRef(null);
  const bg3 = useRef(null);

  const imgInner1 = useRef(null);
  const imgInner2 = useRef(null);
  const imgInner3 = useRef(null);

  const text1 = useRef(null);
  const text2 = useRef(null);
  const text3 = useRef(null);

  const pill1 = useRef(null);
  const pill2 = useRef(null);
  const pill3 = useRef(null);

  /* ACT III */
  const statsSecRef  = useRef(null);
  const statsRuleRef = useRef(null);

  const lenis = useLenis();

  useEffect(() => {
    /* ── Inject keyframes + mobile overrides ───────────────── */
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rWave {
        from { transform: scaleY(0.12); opacity: 0.5; }
        to   { transform: scaleY(1);    opacity: 1;   }
      }
      .exp-cta-link:hover { border-color: rgba(201,168,76,0.9) !important; }

      /* ── MOBILNÍ OPTIMALIZACE ──────────────────────────────
         Desktop/laptop layout je beze změny.
         Vše níže platí jen pro breakpointy < 1024 px.
         ───────────────────────────────────────────────────── */

      /* ACT I – obrázek: zarovnání na střed + širší zobrazení */
      @media (max-width: 1023px) {
        .about-img-flex {
          justify-content: center !important;
          padding-left: 0 !important;
        }
        .about-img-wrap {
          width: min(82vw, 440px) !important;
          height: min(110vw, 620px) !important;
        }
        /* Odstranit přetečení ghost roku na mobilu */
        .about-ghost-year {
          overflow: hidden !important;
          max-width: 100vw !important;
        }
      }

      /* ACT I – text sloupec: plná šířka + symetrické odsazení */
      @media (max-width: 1023px) {
        .about-text-col {
          padding-top: 0 !important;
        }
      }

      /* ACT II – snap slide nadpisy: menší minimum na úzkých displejích */
      @media (max-width: 639px) {
        .snap-slide-heading {
          font-size: clamp(30px, 9.5vw, 62px) !important;
          line-height: 0.88 !important;
        }
        .snap-eyebrow {
          font-size: 9px !important;
          letter-spacing: 0.22em !important;
        }
        /* Více prostoru pro obsah snímků na mobilu */
        .snap-slide-text {
          padding-left: clamp(20px, 5vw, 40px) !important;
          padding-right: clamp(20px, 5vw, 40px) !important;
        }
        /* Transition heading – menší nadpis na malých telefonech */
        .transition-heading-h2 {
          font-size: clamp(34px, 10vw, 110px) !important;
        }
      }

      /* ACT III – stats: jemnější gap na malých obrazovkách */
      @media (max-width: 479px) {
        .stats-grid {
          gap: 2rem !important;
        }
      }
    `;
    document.head.appendChild(style);

    /* ── Lenis bridge ───────────────────────────────────────── */
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop: () => lenis.scroll,
        getBoundingClientRect: () => ({
          top: 0, left: 0,
          width: window.innerWidth, height: window.innerHeight,
        }),
      });
    }

    const ctx = gsap.context(() => {

      /* ══════════════════════════════════════
         ACT I
         ══════════════════════════════════════ */
      gsap.to(ghostYearRef.current, {
        yPercent: -22, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(eyebrowRef.current, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: eyebrowRef.current, start: 'top 82%' },
      });

      const headingLines = headingRef.current?.querySelectorAll('.reveal-line') || [];
      headingLines.forEach((line, i) => {
        gsap.fromTo(line, { yPercent: 110, skewY: 1 }, {
          yPercent: 0, skewY: 0, duration: 1.05, ease: 'power4.out', delay: i * 0.12,
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        });
      });

      [para1Ref, para2Ref, signatureRef].forEach((ref, i) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.15,
          scrollTrigger: { trigger: para1Ref.current, start: 'top 78%' },
        });
      });

      gsap.fromTo(imgWrapRef.current, { clipPath: 'inset(100% 0 0 0 round 16px)' }, {
        clipPath: 'inset(0% 0 0 0 round 16px)', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: imgWrapRef.current, start: 'top 82%' },
      });

      gsap.to(imgRef.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: imgWrapRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(accentWrapRef.current, { clipPath: 'inset(100% 0 0 0 round 16px)' }, {
        clipPath: 'inset(0% 0 0 0 round 16px)', duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: accentWrapRef.current, start: 'top 80%' },
      });

      /* ══════════════════════════════════════
         ACT 1.5 — Transition Heading Reveal
         ══════════════════════════════════════ */
      gsap.fromTo(transitionHeadingRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: transitionHeadingRef.current, start: 'top 85%' },
      });

      /* ══════════════════════════════════════
         ACT II — DISCRETE SNAP SCROLL
         ══════════════════════════════════════ */

      gsap.set(bg2.current, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(bg3.current, { clipPath: 'inset(100% 0 0 0)' });

      gsap.set(imgInner2.current, { scale: 1.1, yPercent: 0 });
      gsap.set(imgInner3.current, { scale: 1.1, yPercent: 5 });

      const tl = gsap.timeline({ paused: true });

      /* SLIDE 1 → SLIDE 2 (čas 0 → 1) */
      tl.to(imgInner1.current,
        { yPercent: -20, duration: 1, ease: 'none' }, 0);
      tl.to(text1.current,
        { y: -80, opacity: 0, duration: 0.6, ease: 'none' }, 0);

      tl.to(bg2.current,
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, 0);
      tl.to(imgInner2.current,
        { scale: 1, yPercent: 0, duration: 1, ease: 'none' }, 0);

      tl.fromTo(text2.current,
        { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'none' }, 0.4);
      tl.fromTo(pill2.current,
        { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'none' }, 0.4);

      /* SLIDE 2 → SLIDE 3 (čas 1 → 2) */
      tl.to(imgInner2.current,
        { yPercent: -15, duration: 1, ease: 'none' }, 1);
      tl.to(text2.current,
        { y: -80, opacity: 0, duration: 0.6, ease: 'none' }, 1);

      tl.to(bg3.current,
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, 1);
      tl.to(imgInner3.current,
        { scale: 1, yPercent: 0, duration: 1, ease: 'none' }, 1);

      tl.fromTo(text3.current,
        { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'none' }, 1.4);
      tl.fromTo(pill3.current,
        { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'none' }, 1.4);

      let currentSlide = 0;

      const goToSlide = (index) => {
        if (index === currentSlide) return;
        currentSlide = index;
        gsap.to(tl, {
          time: currentSlide,
          duration: 0.8,
          ease: 'power3.inOut',
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        trigger: expSecRef.current,
        pin: true,
        start: 'center center',
        end: '+=300%',
        snap: {
          snapTo: [0, 1/3, 2/3],
          duration: { min: 0.3, max: 0.6 },
          delay: 0.05,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          let targetSlide = 0;
          if (self.progress >= 1/6 && self.progress < 0.5) targetSlide = 1;
          else if (self.progress >= 0.5) targetSlide = 2;
          goToSlide(targetSlide);
        },
      });

      /* ══════════════════════════════════════
         ACT III
         ══════════════════════════════════════ */
      gsap.fromTo(statsRuleRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: statsSecRef.current, start: 'top 80%' },
        }
      );

    }, sectionRef);

    return () => {
      ctx.revert();
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, [lenis]);

  /* ── Shared micro-helpers ─────────────────────────────────── */
  const pip       = { width: '24px', height: '1px', background: 'var(--color-gold)', flexShrink: 0 };
  const ebStyle   = { fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-gold)' };
  const ruleMuted = { width: '60px', height: '1px', background: 'var(--color-gold-muted)' };

  const slideOverlay =
    'linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.04) 65%), ' +
    'linear-gradient(to top,   rgba(0,0,0,0.42) 0%, transparent 45%)';

  return (
    <section
      ref={sectionRef}
      id="sklep"
      className="relative"
      /* overflowX: hidden zabraňuje horizontálnímu přetečení ghost roku na mobilu.
         Na desktopu je obsah uvnitř viewportu, takže vizuálně nic nemění. */
      style={{ background: '#4A0404', overflowX: 'hidden' }}
    >

      {/* ACT I — HISTORIE A RODINA */}
      <div className="relative"
        style={{ paddingTop: 'clamp(80px,12vw,160px)', paddingBottom: 'clamp(20px,4vw,60px)' }}>

        {/* Ghost rok — třída about-ghost-year omezuje přetečení na mobilu */}
        <div ref={ghostYearRef}
          className="about-ghost-year absolute left-0 top-0 select-none pointer-events-none overflow-hidden"
          aria-hidden="true" style={{ zIndex: 0, top: '-2%' }}>
          <span className="font-display font-bold leading-none" style={{
            fontSize: 'clamp(160px,28vw,440px)', color: 'transparent',
            WebkitTextStroke: '1px rgba(201,168,76,0.07)',
            letterSpacing: '-0.03em', whiteSpace: 'nowrap', willChange: 'transform',
          }}>2007</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0"
          style={{ paddingLeft: 'clamp(24px,8vw,120px)', paddingRight: 'clamp(24px,6vw,80px)' }}>

          {/* Text sloupec — třída about-text-col nuluje paddingTop na mobilu */}
          <div className="about-text-col lg:col-span-5 flex flex-col justify-center"
            style={{ paddingTop: 'clamp(0px,6vw,80px)' }}>

            <div ref={eyebrowRef} className="flex items-center gap-3 mb-8" style={{ opacity: 0 }}>
              <div className="h-px w-6" style={{ background: 'var(--color-gold)' }} />
              <span className="font-body text-[10px] tracking-widest3 uppercase"
                style={{ color: 'var(--color-gold)', letterSpacing: '0.28em' }}>Náš příběh</span>
            </div>

            <div ref={headingRef} className="mb-8" style={{ lineHeight: 0.92 }}>
              {['Poctivá práce.', 'z lásky k zemi', 'a vínu.'].map((line) => (
                <div key={line} className="overflow-hidden">
                  <div className="reveal-line font-display" style={{
                    fontSize: 'clamp(32px,4.8vw,68px)', color: 'var(--color-cream)',
                    letterSpacing: '0.01em', fontWeight: 400, paddingBottom: '0.08em',
                    willChange: 'transform',
                  }}>{line}</div>
                </div>
              ))}
            </div>

            <div className="mb-8" style={{ height: '1px', width: '48px', background: 'var(--color-gold-muted)' }} />

            <p ref={para1Ref} className="font-body font-light mb-6 leading-relaxed"
              style={{ fontSize: 'clamp(14px,1.1vw,17px)', color: 'var(--color-cream-muted)',
                maxWidth: '42ch', opacity: 0 }}>
              Vinařství Rustikal zapustilo své první kořeny v roce 2007, tehdy ještě jako 
              společný sen a čistá radost party přátel. Tato neutuchající vášeň pro řemeslo 
              nás v roce 2010 dovedla k vysazení vlastních vinic, čímž jsme uzavřeli kruh 
              poctivé výroby. Od té chvíle provázíme každou bobuli na její cestě od prvního 
              jarního pupenu až po konečné plnění do lahví.
            </p>
            <p ref={para2Ref} className="font-body font-light leading-relaxed"
              style={{ fontSize: 'clamp(14px,1.1vw,17px)', color: 'var(--color-cream-muted)',
                maxWidth: '42ch', opacity: 0 }}>
              Dnes na dvanácti hektarech prosluněných tratí s pokorou opečováváme deset 
              ušlechtilých odrůd. Naše práce je tichým dialogem s přírodou, kde nespěcháme 
              a ctíme přirozený rytmus zrání. Každá lahev v sobě nese otisk trpělivosti 
              a poctivého ručního sběru, díky kterému může víno ve vaší sklenici 
              vyprávět svůj nefalšovaný příběh o slunci a zemi.
            </p>

            <div ref={signatureRef} className="flex items-center gap-4 mt-10" style={{ opacity: 0 }}>
              <div className="h-px flex-1 max-w-[40px]" style={{ background: 'var(--color-cream-faint)' }} />
              <span className="font-display italic"
                style={{ color: 'var(--color-cream-muted)', fontSize: '16px' }}>Vinařství Rustikal</span>
            </div>
          </div>

          {/* Obrázky — about-img-flex: na mobilu justify-center, na lg justify-end (beze změny) */}
          <div className="about-img-flex lg:col-span-7 relative flex items-start justify-center lg:justify-end gap-5 mt-16 lg:mt-0"
            style={{ paddingLeft: 'clamp(16px,4vw,64px)' }}>

            {/* Hlavní portrétní obrázek — about-img-wrap: media query rozšiřuje šířku na mobilu */}
            <div ref={imgWrapRef} className="about-img-wrap relative overflow-hidden flex-shrink-0"
              style={{ width: 'clamp(200px,32vw,440px)', height: 'clamp(320px,52vw,700px)',
                clipPath: 'inset(100% 0 0 0 round 16px)',
                borderRadius: '16px' }}>
              <img ref={imgRef} src={IMG_PORTRAIT}
                alt="Vinice Sklep u Dvořáků — Hustopeče"
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.14)', transformOrigin: 'center', willChange: 'transform' }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(18,8,4,0.55) 0%, transparent 50%)' }} />
            </div>

            {/* Akcentní obrázek — skrytý na mobilu, beze změny na lg */}
            <div ref={accentWrapRef}
              className="relative overflow-hidden flex-shrink-0 self-end hidden lg:block"
              style={{ width: 'clamp(140px,18vw,260px)', height: 'clamp(200px,32vw,420px)',
                clipPath: 'inset(100% 0 0 0 round 16px)', marginBottom: '60px',
                borderRadius: '16px' }}>
              <img ref={accentImgRef} src={IMG_ACCENT}
                alt="Detail sklípku — sudy a víno"
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.1)', transformOrigin: 'center' }} />
              <div className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: 'linear-gradient(to top, rgba(12,6,4,0.88) 0%, transparent 100%)' }}>
                <span className="font-display text-xs tracking-widest2 uppercase"
                  style={{ color: 'var(--color-gold-muted)' }}>Est. 1987</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACT 1.5 — TRANSITION HEADING */}
      <div ref={transitionHeadingRef} className="flex flex-col items-center justify-center text-center relative"
           style={{ padding: 'clamp(60px,10vw,120px) 24px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={pip} />
          <span className="font-body" style={ebStyle}>Nezapomenutelné chvíle</span>
          <div style={pip} />
        </div>
        {/* transition-heading-h2: menší font na úzkých obrazovkách přes media query */}
        <h2 className="transition-heading-h2 font-display uppercase italic" style={{
          fontSize: 'clamp(42px, 7.5vw, 110px)', color: 'var(--color-cream)',
          lineHeight: 0.85, letterSpacing: '-0.02em',
        }}>
          Zažijte Moravu<br/>všemi smysly
        </h2>
      </div>

      {/* ACT II — FRAMED CINEMATIC WIPE SCROLL */}
      <div
        ref={expSecRef}
        style={{
          height: 'clamp(600px, 80vh, 900px)',
          position: 'relative',
          width: 'calc(100% - clamp(32px, 6vw, 160px))',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}
      >

        {/* SLIDE 1 */}
        <div ref={bg1} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            ref={imgInner1}
            src={IMG_CELLAR}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transformOrigin: 'center',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: slideOverlay }} />
        </div>

        {/* SLIDE 2 — Cimbálka */}
        <div ref={bg2} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <img
            ref={imgInner2}
            src={IMG_MUSIC}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center top',
              transformOrigin: 'center top',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: slideOverlay }} />
        </div>

        {/* SLIDE 3 */}
        <div ref={bg3} style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          <img
            ref={imgInner3}
            src={IMG_VINEYARD}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transformOrigin: 'center',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: slideOverlay }} />
        </div>

        {/* SLIDE 1: Zážitek ve vinném sklípku
            snap-slide-text + snap-slide-heading + snap-eyebrow: media query ladiče */}
        <div ref={text1} className="snap-slide-text" style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 8vw, 100px)', paddingRight: 'clamp(24px, 6vw, 80px)',
          zIndex: 10,
        }}>
          <div style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={pip} />
              <span className="snap-eyebrow font-body" style={{ ...ebStyle, color: '#fff' }}>01 · Zážitek ve sklípku</span>
            </div>

            <h2 className="snap-slide-heading font-display uppercase italic" style={{
              fontSize: 'clamp(42px, 6vw, 100px)', color: '#fff',
              lineHeight: 0.85, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}>
              Kouzlo<br/>sklípku
            </h2>

            <div style={{ ...ruleMuted, marginTop: '28px', marginBottom: '28px' }} />

            <p className="font-body font-light" style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8,
            }}>
              Vstupte do prostor, kde voní dubové sudy a ožívá historie. Tradiční vinný sklípek
              nabízí unikátní atmosféru pro večerní posezení. Místo, kde starosti necháte před
              prahem a naplno vnímáte kouzlo jižní Moravy.
            </p>
          </div>
        </div>

        {/* SLIDE 2: Cimbálka */}
        <div ref={text2} className="snap-slide-text" style={{
          position: 'absolute', inset: 0, opacity: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 8vw, 100px)', paddingRight: 'clamp(24px, 6vw, 80px)',
          zIndex: 10,
        }}>
          <div style={{ maxWidth: '540px' }}>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '30px', marginBottom: '24px', opacity: 0.9 }}>
              {WAVE_H.map((h, i) => (
                <div key={i} style={{
                  width: '3px', height: `${h}%`, background: 'var(--color-gold)',
                  transformOrigin: 'bottom',
                  animationName: 'rWave',
                  animationDuration: `${0.4 + (i % 5) * 0.1}s`,
                  animationDelay: `${i * 0.05}s`,
                  animationIterationCount: 'infinite',
                  animationDirection: 'alternate',
                }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={pip} />
              <span className="snap-eyebrow font-body" style={{ ...ebStyle, color: '#fff' }}>02 · Živá Cimbálka</span>
            </div>

            <h2 className="snap-slide-heading font-display uppercase italic" style={{
              fontSize: 'clamp(42px, 6vw, 100px)', color: '#fff',
              lineHeight: 0.85, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}>
              Roztančené<br/>srdce
            </h2>

            <div style={{ ...ruleMuted, marginTop: '28px', marginBottom: '28px' }} />

            <p className="font-body font-light" style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8,
            }}>
              K dobrému vínu patří pravá moravská hudba. Melodie cimbálu, nespoutaný zpěv
              a cinkání sklenic se postarají o to, že z cizinců se u stolu stávají přátelé.
              Zažijte večer plný nefalšované radosti a folkloru.
            </p>
          </div>
        </div>

        {/* SLIDE 3: Víno & Degustace */}
        <div ref={text3} className="snap-slide-text" style={{
          position: 'absolute', inset: 0, opacity: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(24px, 8vw, 100px)', paddingRight: 'clamp(24px, 6vw, 80px)',
          zIndex: 10,
        }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 w-full items-center">

            <div style={{ maxWidth: '540px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={pip} />
                <span className="snap-eyebrow font-body" style={{ ...ebStyle, color: '#fff' }}>03 · Řízená Degustace</span>
              </div>

              <h2 className="snap-slide-heading font-display uppercase italic" style={{
                fontSize: 'clamp(42px, 6vw, 100px)', color: '#fff',
                lineHeight: 0.85, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}>
                Chuť<br/>naší země
              </h2>

              <div style={{ ...ruleMuted, marginTop: '28px', marginBottom: '28px' }} />

              <p className="font-body font-light" style={{
                fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8, marginBottom: '32px',
              }}>
                Připravíme pro vás degustaci těch nejlepších ročníků s odborným výkladem
                našeho someliéra. Ochutnejte Moravu v její nejčistší podobě. Každá kapka
                vypráví příběh slunce a pečlivé rodinné práce.
              </p>

              <a href="tel:+420775545760" className="exp-cta-link font-body"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '16px',
                  color: 'var(--color-gold)', textDecoration: 'none',
                  borderBottom: '1px solid rgba(201,168,76,0.40)',
                  paddingBottom: '8px', transition: 'border-color 0.3s ease',
                }}>
                
              </a>
            </div>

            {/* Right side stats — skryté na mobilu, beze změny na md+ */}
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="font-display uppercase" style={{
                fontSize: 'clamp(40px,7vw,100px)', color: 'var(--color-gold)',
                fontWeight: 400, lineHeight: 0.85, letterSpacing: '-0.03em',
                textShadow: '0 5px 15px rgba(0,0,0,0.6)',
              }}>
            
              </div>
              <div className="font-body text-[10px] tracking-widest3 uppercase mt-4 mb-12"
                style={{ color: 'rgba(255,255,255,0.9)' }}>
              
              </div>

              <div className="font-display uppercase" style={{
                fontSize: 'clamp(30px,5vw,70px)', color: 'rgba(201,168,76,0.8)',
                fontWeight: 400, lineHeight: 0.85, letterSpacing: '-0.02em',
                textShadow: '0 5px 15px rgba(0,0,0,0.6)',
              }}>
            
              </div>
              <div className="font-body text-[10px] tracking-widest3 uppercase mt-4"
                style={{ color: 'rgba(255,255,255,0.9)' }}>
             
              </div>
            </div>

          </div>
        </div>

        {/* ── PROGRESS PILLS ── */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '12px', alignItems: 'center', zIndex: 40,
        }}>
          {[pill1, pill2, pill3].map((ref, i) => (
            <div key={i} style={{
              width: '40px', height: '2px', borderRadius: '1px',
              background: 'rgba(255,255,255,0.2)', overflow: 'hidden',
            }}>
              <div ref={ref} style={{
                width: '100%', height: '100%', background: 'var(--color-gold)',
                transformOrigin: 'left',
                transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)',
              }} />
            </div>
          ))}
        </div>

      </div>

      {/* ACT III — stats-grid: jemnější gap na xs displejích */}
      <div ref={statsSecRef} className="relative" style={{
        paddingTop: 'clamp(80px,8vw,140px)', paddingBottom: 'clamp(60px,8vw,120px)',
        paddingLeft: 'clamp(24px,8vw,120px)', paddingRight: 'clamp(24px,6vw,80px)',
        background: '#4A0404',
      }}>
        <div ref={statsRuleRef} className="mb-16" style={{
          height: '1px',
          background:
            'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-muted) 40%, transparent 100%)',
          transformOrigin: 'left center', willChange: 'transform',
        }} />

        <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-14 sm:gap-8">
          {STATS.map((stat) => (
            <StatItem key={stat.label} value={stat.value} suffix={stat.suffix}
              label={stat.label} triggerRef={statsSecRef} />
          ))}
        </div>

        <div className="mt-16">
          <span className="font-body text-[10px] tracking-widest3 uppercase"
            style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.3em' }}>
            Hustopeče · Jihomoravský kraj · Česká republika
          </span>
        </div>
      </div>

    </section>
  );
}