'use client';



import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ── Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef   = useRef(null);
  const bgRef        = useRef(null);
  const videoRef     = useRef(null);
  const overlayRef   = useRef(null);
  const line1WrapRef = useRef(null);
  const line1Ref     = useRef(null);
  const line2WrapRef = useRef(null);
  const line2Ref     = useRef(null);
  const ruleRef      = useRef(null);
  const eyebrowRef   = useRef(null);
  const lenis        = useLenis();

  /* ── GSAP Entrance Timeline ──────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* Video brightness rise */
      tl.fromTo(bgRef.current,
        { filter: 'brightness(0.0)' },
        { filter: 'brightness(1)', duration: 3.0, ease: 'power2.inOut' },
        0
      );

      /* Overlay */
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.6 },
        0.4
      );

      /* eyebrowRef kept in timeline for timing integrity — element is empty */
      tl.fromTo(eyebrowRef.current,
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, duration: 1.0 },
        0.8
      );

      /* SKLEP — clip reveal */
      tl.fromTo(line1Ref.current,
        { yPercent: 115, skewY: 2 },
        { yPercent: 0, skewY: 0, duration: 1.2, ease: 'power4.out' },
        1.0
      );

      /* U DVOŘÁKŮ */
      tl.fromTo(line2Ref.current,
        { yPercent: 120, skewY: 1.5 },
        { yPercent: 0, skewY: 0, duration: 1.2, ease: 'power4.out' },
        1.18
      );

      /* Gold rule draw */
      tl.fromTo(ruleRef.current,
        { scaleX: 0.08, transformOrigin: 'left center', opacity: 0.4 },
        { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.inOut' },
        1.6
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── ScrollTrigger Parallax ──────────────────────────────── */
  useEffect(() => {
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
      /* Video parallax — pomalejší posun než scroll */
      gsap.to(bgRef.current, {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: true,
        },
      });

      /* Nadpis — lehký counter-parallax */
      gsap.to([line1WrapRef.current, line2WrapRef.current], {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [lenis]);

  /* ── Video autoplay — manuální spuštění jako záloha ────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      video.play().catch(() => {
        const onClick = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', onClick);
          document.removeEventListener('touchstart', onClick);
        };
        document.addEventListener('click', onClick, { once: true });
        document.addEventListener('touchstart', onClick, { once: true });
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  /* Sdílený text-shadow — maximální čitelnost na videu */
  const heroShadow = '0 2px 8px rgba(0,0,0,0.40)';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', minHeight: '640px' }}
      aria-label="Úvodní sekce — Hotel Rustikal"
    >

      {/* ════════════════════════════════════════════════
          VIDEO POZADÍ
          ════════════════════════════════════════════════ */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          willChange: 'transform, filter',
          transformOrigin: 'center center',
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center center',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          preload="auto"
        >
          <source src="/hero-white.mp4" type="video/mp4" />
        </video>

        {/* Gradient fallback */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse at 60% 40%, #7a2e3a 0%, transparent 50%),
              radial-gradient(ellipse at 20% 70%, #5a3040 0%, transparent 45%),
              linear-gradient(160deg, #3a1a22 0%, #4a2030 50%, #2a1018 100%)
            `,
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════
          CINEMATIC OVERLAY — 4 vrstvy  (výrazně zesvětleno)
          ════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{ opacity: 0, pointerEvents: 'none' }}
      >
        {/* Spodní přechod — jen pro čitelnost textu */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(
            to top,
            rgba(4, 0, 0, 0.72) 0%,
            rgba(4, 0, 0, 0.45) 20%,
            rgba(4, 0, 0, 0.12) 50%,
            rgba(4, 0, 0, 0.04) 72%,
            transparent 100%
          )`,
        }} />

        {/* Levý přechod — jen pro čitelnost textu */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(
            to right,
            rgba(4, 0, 0, 0.55) 0%,
            rgba(4, 0, 0, 0.25) 28%,
            rgba(4, 0, 0, 0.06) 55%,
            transparent 78%
          )`,
        }} />

        {/* Horní přechod */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(
            to bottom,
            rgba(4, 0, 0, 0.28) 0%,
            transparent 22%
          )`,
        }} />

        {/* Celkový tónový nádech — velmi lehký */}
        <div className="absolute inset-0" style={{
          background: 'rgba(50, 6, 12, 0.08)',
          mixBlendMode: 'multiply',
        }} />
      </div>

      {/* ════════════════════════════════════════════════
          CONTENT
          ════════════════════════════════════════════════ */}
      <div
        className="relative z-20 flex flex-col justify-end h-full pb-16 md:pb-20"
        style={{ paddingLeft: 'clamp(48px, 8vw, 160px)' }}
      >

        {/* ── Eyebrow odstraněn — prázdný div zachován pro GSAP ref ── */}
        <div ref={eyebrowRef} />

        {/* ── Nadpis ─────────────────────────────────── */}
        <div className="flex flex-col">



          {/* Vinařství */}
          <div
            ref={line1WrapRef}
            className="overflow-hidden relative z-10"
            style={{ lineHeight: 1.0 }}
          >
            <h1
              ref={line1Ref}
              className="font-display font-normal leading-none"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 72px)',
                color: 'var(--color-cream)',
                letterSpacing: '0.25em',
                willChange: 'transform',
                textShadow: heroShadow,
                textTransform: 'uppercase',
                opacity: 1.0,
              }}
            >
              Vinařství
            </h1>
          </div>

          {/* Rustikal */}
          <div
            ref={line2WrapRef}
            className="overflow-hidden relative z-10"
            style={{ lineHeight: 0.88, marginTop: '0.15em' }}
          >
            <h1
              ref={line2Ref}
              className="font-display font-normal leading-none"
              style={{
                fontSize: 'clamp(72px, 12vw, 180px)',
                letterSpacing: '-0.01em',
                willChange: 'transform',
              }}
              aria-label="Rustikal"
            >
              <span style={{
                background: 'linear-gradient(135deg, #fffbe0 0%, #e8c050 30%, #f5d96e 55%, #c89628 80%, #e8c050 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 600,
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))',
              }}>
                Rustikal
              </span>
            </h1>
          </div>

          {/* Zlatá dekorativní linka */}
          <div
            ref={ruleRef}
            className="mt-8 relative z-10"
            style={{
              height: '2px',
              width:  'clamp(160px, 34vw, 480px)',
              background: `linear-gradient(
                90deg,
                var(--color-gold-light) 0%,
                var(--color-gold)       45%,
                rgba(201,168,76,0.4)    85%,
                transparent             100%
              )`,
              transformOrigin: 'left center',
              willChange: 'transform',
              boxShadow: '0 0 24px rgba(201,168,76,0.5), 0 0 8px rgba(201,168,76,0.8)',
            }}
          />

        </div>
      </div>

      {/* ── Zlatá svislá linka — pravý okraj ─────────── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px hidden lg:block z-20"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(201,168,76,0.3) 20%,
            rgba(201,168,76,0.3) 80%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      />

    </section>
  );
}