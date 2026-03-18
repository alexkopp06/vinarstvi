'use client';

/**
 * Rezervace.jsx — Vinařství Rustikal
 * Booking / Experience landing page
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar'; // ← přidáno

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const BOOKING_URL = 'https://rustikal.cz/booking/#/packages';

const CREAM  = '244,234,215';
const GOLD   = '200,166,74';
const WINE   = '74,4,4';

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────────────────
   PACKAGES
───────────────────────────────────────────────────────── */
const PACKAGES = [
  {
    id: 'p1',
    num: '01',
    title: 'Degustace pro dva',
    subtitle: 'Intimní zážitek',
    desc: 'Soukromá degustace pěti moravských vín přímo v historickém sklípku. Sommelier vám odhalí příběh každé láhve.',
    includes: ['5× degustační vzorek', 'Výběr sýrů a uzenin', 'Průvodce sommeliera', 'Sklenka na památku'],
    duration: '90 minut',
    persons: '2 osoby',
    accent: '200,166,74',
    badge: 'Nejoblíbenější',
  },
  {
    id: 'p2',
    num: '02',
    title: 'Večer v sklepě',
    subtitle: 'Premium experience',
    desc: 'Celý sklípek jen pro vás. Večeře na kamenem dlážděné podlaze, svíčky, živá hudba a výběr z celého portfolia vín.',
    includes: ['Plná večeře', '7× prémiová degustace', 'Živá moravská muzika', 'Ubytování v penzionu'],
    duration: '4+ hodiny',
    persons: '2–8 osob',
    accent: '186,130,58',
    badge: 'Doporučujeme',
  },
  {
    id: 'p3',
    num: '03',
    title: 'Firemní degustace',
    subtitle: 'Team experience',
    desc: 'Nezapomenutelný teambuilding nebo firemní akce. Moravský sklípek jako kulisa pro vaše obchodní vztahy.',
    includes: ['Exkluzivní pronájem sklípku', 'Catering na míru', 'Vinné kvízy a hry', 'Firemní etikety'],
    duration: 'Dle dohody',
    persons: '10–50 osob',
    accent: '148,195,128',
    badge: 'Skupiny',
  },
];

/* ─────────────────────────────────────────────────────────
   FACTS
───────────────────────────────────────────────────────── */
const FACTS = [
  { num: '1892', label: 'Rok založení' },
  { num: '12°C', label: 'Teplota ve sklepě' },
  { num: '38+',  label: 'Druhů vín' },
  { num: '4km',  label: 'Od Hustopečí' },
];

/* ─────────────────────────────────────────────────────────
   VINE SVG PATH — decorative
───────────────────────────────────────────────────────── */
function VineLine({ style }) {
  return (
    <svg viewBox="0 0 200 40" fill="none" style={{ overflow: 'visible', ...style }}>
      <path
        d="M0,20 C20,20 30,8 50,8 C70,8 70,32 90,32 C110,32 110,8 130,8 C150,8 150,32 170,32 C190,32 195,20 200,20"
        stroke={`rgba(${GOLD},0.35)`} strokeWidth="0.8" fill="none"
      />
      {[50,90,130].map(cx => (
        <g key={cx} transform={`translate(${cx},8)`}>
          <circle r="2.5" fill={`rgba(${GOLD},0.20)`} stroke={`rgba(${GOLD},0.45)`} strokeWidth="0.6"/>
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   3D WINE GLASS SVG — hero centerpiece
───────────────────────────────────────────────────────── */
function WineGlass3D({ accent = GOLD }) {
  const glassRef = useRef(null);
  const liquidRef = useRef(null);
  const shimmerRef = useRef(null);

  useEffect(() => {
    gsap.to(glassRef.current, {
      y: -18, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    gsap.to(liquidRef.current, {
      skewX: 3, skewY: 1, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    gsap.to(shimmerRef.current, {
      x: 60, opacity: 0, duration: 2.4, ease: 'power2.in', repeat: -1, repeatDelay: 3.5,
    });
  }, []);

  return (
    <div ref={glassRef} style={{ position: 'relative', width: 220, height: 380, margin: '0 auto' }}>
      <svg viewBox="0 0 220 380" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="bowlGrad" cx="38%" cy="42%" r="55%">
            <stop offset="0%" stopColor={`rgba(${WINE},0.05)`}/>
            <stop offset="60%" stopColor={`rgba(${WINE},0.18)`}/>
            <stop offset="100%" stopColor={`rgba(${WINE},0.55)`}/>
          </radialGradient>
          <radialGradient id="liquidGrad" cx="40%" cy="40%" r="55%">
            <stop offset="0%" stopColor="rgba(160,20,20,0.9)"/>
            <stop offset="100%" stopColor="rgba(80,4,4,1)"/>
          </radialGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`rgba(${CREAM},0.08)`}/>
            <stop offset="45%" stopColor={`rgba(${CREAM},0.22)`}/>
            <stop offset="100%" stopColor={`rgba(${CREAM},0.06)`}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="bowlClip">
            <path d="M58,40 Q52,100 48,160 Q44,200 58,215 Q80,228 110,228 Q140,228 162,215 Q176,200 172,160 Q168,100 162,40 Z"/>
          </clipPath>
        </defs>
        <ellipse cx="110" cy="365" rx="52" ry="8" fill={`rgba(${accent},0.18)`} filter="url(#glow)"/>
        <ellipse cx="110" cy="358" rx="46" ry="7" fill="none" stroke={`rgba(${CREAM},0.18)`} strokeWidth="1.2"/>
        <path d="M72,358 Q82,355 110,354 Q138,355 148,358" fill={`rgba(${CREAM},0.04)`} stroke="none"/>
        <path d="M102,355 L106,228 M118,228 L114,355" stroke="url(#stemGrad)" strokeWidth="1.4" fill="none"/>
        <path d="M106,228 L114,228 L114,355 L102,355 Z" fill={`rgba(${CREAM},0.04)`}/>
        <path
          d="M58,40 Q52,100 48,160 Q44,200 58,215 Q80,228 110,228 Q140,228 162,215 Q176,200 172,160 Q168,100 162,40 Z"
          fill="url(#bowlGrad)" stroke={`rgba(${CREAM},0.20)`} strokeWidth="0.8"
        />
        <g clipPath="url(#bowlClip)">
          <g ref={liquidRef}>
            <path
              d="M48,145 Q70,138 110,140 Q150,138 172,145 L172,228 Q148,232 110,232 Q72,232 48,228 Z"
              fill="url(#liquidGrad)" opacity="0.88"
            />
            <path d="M48,145 Q70,136 110,138 Q150,136 172,145" fill="none" stroke="rgba(220,100,100,0.40)" strokeWidth="1.5"/>
          </g>
        </g>
        <g ref={shimmerRef} style={{ opacity: 0.7 }}>
          <path d="M72,60 Q75,100 74,155" stroke={`rgba(${CREAM},0.55)`} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </g>
        <path d="M58,40 Q110,32 162,40" fill="none" stroke={`rgba(${CREAM},0.32)`} strokeWidth="1.0"/>
        <path d="M66,55 Q68,130 67,175" stroke={`rgba(${CREAM},0.12)`} strokeWidth="4" strokeLinecap="round" fill="none"/>
      </svg>
      <div style={{
        position: 'absolute', top: '30%', left: '10%',
        width: '80%', height: '50%',
        background: `radial-gradient(ellipse, rgba(${WINE},0.55) 0%, transparent 70%)`,
        filter: 'blur(28px)',
        zIndex: -1, pointerEvents: 'none',
      }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PACKAGE CARD
───────────────────────────────────────────────────────── */
function PackageCard({ pkg, onBook }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    gsap.to(card, { rotateY: x * 14, rotateX: -y * 10, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
    if (shineRef.current) gsap.to(shineRef.current, { opacity: 0.18, x: x * 60 + 50, y: y * 40 + 50, duration: 0.4 });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' });
    if (shineRef.current) gsap.to(shineRef.current, { opacity: 0, duration: 0.4 });
  };

  const A = pkg.accent;

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        background: `linear-gradient(145deg, rgba(${WINE},0.85) 0%, rgba(30,2,2,0.95) 100%)`,
        border: `1px solid rgba(${A},0.22)`,
        borderRadius: 2,
        padding: 'clamp(28px,3vw,44px)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={shineRef} style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(${CREAM},0.12), transparent 60%)`, pointerEvents: 'none', opacity: 0 }}/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(${A},0.9), transparent)`, boxShadow: `0 0 18px rgba(${A},0.5)` }}/>
      {pkg.badge && (
        <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 7, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${A},1)`, border: `1px solid rgba(${A},0.45)`, padding: '3px 10px' }}>
          {pkg.badge}
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 11, fontWeight: 400, letterSpacing: '0.30em', color: `rgba(${A},0.60)`, marginBottom: 16 }}>{pkg.num} / 03</div>
      <h3 style={{ fontFamily: 'var(--font-display,"Cormorant Garamond","Playfair Display",serif)', fontSize: 'clamp(24px,2.8vw,36px)', fontWeight: 600, lineHeight: 1.0, color: `rgba(${CREAM},1)`, margin: '0 0 6px', letterSpacing: '0.01em' }}>{pkg.title}</h3>
      <div style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${A},0.80)`, marginBottom: 20 }}>{pkg.subtitle}</div>
      <VineLine style={{ display: 'block', width: '100%', height: 20, marginBottom: 18 }}/>
      <p style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 'clamp(12px,0.9vw,13.5px)', fontWeight: 500, lineHeight: 1.85, color: `rgba(${CREAM},0.72)`, margin: '0 0 24px', letterSpacing: '0.02em' }}>{pkg.desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {pkg.includes.map((item) => (
          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', flexShrink: 0, background: `rgba(${A},0.9)`, boxShadow: `0 0 6px rgba(${A},0.5)` }}/>
            <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: `rgba(${CREAM},0.80)` }}>{item}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
        {[['⏱', pkg.duration], ['👥', pkg.persons]].map(([icon, val]) => (
          <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11 }}>{icon}</span>
            <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: `rgba(${CREAM},0.55)` }}>{val}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onBook(pkg)}
        style={{ width: '100%', padding: '14px 0', background: `linear-gradient(135deg, rgba(${A},0.18), rgba(${A},0.08))`, border: `1px solid rgba(${A},0.55)`, cursor: 'pointer', fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(${A},1)`, transition: 'background 0.28s, box-shadow 0.28s', position: 'relative', overflow: 'hidden' }}
        onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${A},0.32), rgba(${A},0.18))`; e.currentTarget.style.boxShadow = `0 0 32px rgba(${A},0.22)`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${A},0.18), rgba(${A},0.08))`; e.currentTarget.style.boxShadow = 'none'; }}
      >
        Rezervovat tento zážitek →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HORIZONTAL COMIC STRIP
───────────────────────────────────────────────────────── */

const FEATURES = [
  {
    id: 'sklep', num: '01', title: 'Tajemný sklep', tag: 'Historický prostor',
    desc: 'Kamenné klenby z roku 1892. 12 stupňů. Vůně dřeva a vína. Místo, kde čas stojí.',
    accent: '200,166,74',
    bg: 'linear-gradient(175deg, #1c0101 0%, #2e0606 60%, #180101 100%)',
    svg: (A) => (
      <svg viewBox="0 0 160 180" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <radialGradient id="ag1" cx="50%" cy="85%" r="50%"><stop offset="0%" stopColor={`rgba(${A},0.30)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
          <radialGradient id="ag2" cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor={`rgba(${A},0.08)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
        </defs>
        <ellipse cx="80" cy="155" rx="55" ry="18" fill="url(#ag1)"/>
        <ellipse cx="80" cy="60" rx="70" ry="55" fill="url(#ag2)"/>
        {[[0,0],[45,0],[0,28],[23,28],[45,28],[68,28],[0,56],[45,56]].map(([x,y],i)=>(<rect key={i} x={x} y={y} width="42" height="25" rx="1" fill="none" stroke={`rgba(${A},0.07)`} strokeWidth="0.6"/>))}
        <path d="M22,178 L22,100 Q22,30 80,28 Q138,30 138,100 L138,178" fill="#0c0101" stroke={`rgba(${A},0.55)`} strokeWidth="1.8"/>
        <path d="M32,178 L32,106 Q32,44 80,42 Q128,44 128,106 L128,178" fill="#060000" stroke={`rgba(${A},0.18)`} strokeWidth="0.6"/>
        <path d="M74,28 L80,16 L86,28 L80,34 Z" fill={`rgba(${A},0.70)`}/>
        <line x1="74" y1="28" x2="86" y2="28" stroke={`rgba(${A},0.40)`} strokeWidth="0.6"/>
        <line x1="80" y1="16" x2="80" y2="34" stroke={`rgba(${A},0.40)`} strokeWidth="0.6"/>
        {[58,72,86,100,114,128,142,156,170].map(y=>(<line key={y} x1="33" y1={Math.min(y,178)} x2="127" y2={Math.min(y,178)} stroke={`rgba(${A},0.07)`} strokeWidth="0.5"/>))}
        <rect x="36" y="112" width="40" height="34" rx="2" fill="none" stroke={`rgba(${A},0.18)`} strokeWidth="0.8"/>
        <rect x="84" y="112" width="40" height="34" rx="2" fill="none" stroke={`rgba(${A},0.18)`} strokeWidth="0.8"/>
        <rect x="39" y="115" width="34" height="28" rx="1" fill="none" stroke={`rgba(${A},0.09)`} strokeWidth="0.5"/>
        <rect x="87" y="115" width="34" height="28" rx="1" fill="none" stroke={`rgba(${A},0.09)`} strokeWidth="0.5"/>
        <circle cx="77" cy="152" r="4.5" fill="none" stroke={`rgba(${A},0.65)`} strokeWidth="1.2"/>
        <circle cx="83" cy="152" r="4.5" fill="none" stroke={`rgba(${A},0.65)`} strokeWidth="1.2"/>
        <circle cx="77" cy="152" r="1.5" fill={`rgba(${A},0.50)`}/>
        <circle cx="83" cy="152" r="1.5" fill={`rgba(${A},0.50)`}/>
        <g transform="translate(8,96)">
          <path d="M0,0 L0,18 L10,18 L10,0 Z" fill="#180202" stroke={`rgba(${A},0.45)`} strokeWidth="0.8" rx="1"/>
          <path d="M-2,-6 L12,-6 L12,0 L-2,0 Z" fill={`rgba(${A},0.25)`} stroke={`rgba(${A},0.45)`} strokeWidth="0.7"/>
          <path d="M-2,18 L12,18 L12,22 L-2,22 Z" fill={`rgba(${A},0.20)`} stroke={`rgba(${A},0.40)`} strokeWidth="0.7"/>
          <line x1="5" y1="-6" x2="5" y2="-14" stroke={`rgba(${A},0.35)`} strokeWidth="0.8"/>
          <ellipse cx="5" cy="9" rx="3.5" ry="4" fill={`rgba(${A},0.55)`}/>
          <ellipse cx="5" cy="22" rx="10" ry="6" fill={`rgba(${A},0.14)`}/>
        </g>
        <g transform="translate(142,96)">
          <path d="M0,0 L0,18 L10,18 L10,0 Z" fill="#180202" stroke={`rgba(${A},0.45)`} strokeWidth="0.8"/>
          <path d="M-2,-6 L12,-6 L12,0 L-2,0 Z" fill={`rgba(${A},0.25)`} stroke={`rgba(${A},0.45)`} strokeWidth="0.7"/>
          <path d="M-2,18 L12,18 L12,22 L-2,22 Z" fill={`rgba(${A},0.20)`} stroke={`rgba(${A},0.40)`} strokeWidth="0.7"/>
          <line x1="5" y1="-6" x2="5" y2="-14" stroke={`rgba(${A},0.35)`} strokeWidth="0.8"/>
          <ellipse cx="5" cy="9" rx="3.5" ry="4" fill={`rgba(${A},0.55)`}/>
          <ellipse cx="5" cy="22" rx="10" ry="6" fill={`rgba(${A},0.14)`}/>
        </g>
        <rect x="14" y="172" width="132" height="6" rx="1" fill={`rgba(${A},0.08)`} stroke={`rgba(${A},0.18)`} strokeWidth="0.5"/>
      </svg>
    ),
  },
  {
    id: 'vino', num: '02', title: 'Výjimečné víno', tag: 'Moravská tradice',
    desc: 'Přes 38 vzácných druhů. Bílá, červená, růžová — každý ročník s nezaměnitelným hlasem a příběhem.',
    accent: '186,62,58',
    bg: 'linear-gradient(175deg, #180101 0%, #3a0606 55%, #140101 100%)',
    svg: (A) => (
      <svg viewBox="0 0 160 180" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="vg1" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stopColor="#180000"/><stop offset="100%" stopColor="#280202"/></linearGradient>
          <radialGradient id="vg2" cx="35%" cy="35%" r="55%"><stop offset="0%" stopColor={`rgba(${A},0.12)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
          <radialGradient id="vg3" cx="50%" cy="75%" r="55%"><stop offset="0%" stopColor={`rgba(${A},0.28)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
        </defs>
        <ellipse cx="80" cy="150" rx="50" ry="22" fill="url(#vg3)"/>
        <path d="M56,52 Q50,68 48,96 L48,162 Q48,174 80,174 Q112,174 112,162 L112,96 Q110,68 104,52 Z" fill="url(#vg1)" stroke={`rgba(${A},0.45)`} strokeWidth="1.2"/>
        {[62,70,78].map((y,i)=>(<path key={y} d={`M${52+i*2},${y} Q80,${y-6} ${108-i*2},${y}`} fill="none" stroke={`rgba(${A},0.08)`} strokeWidth="0.6"/>))}
        <path d="M56,60 Q54,110 55,155" stroke={`rgba(244,234,215,0.10)`} strokeWidth="4" strokeLinecap="round"/>
        <path d="M59,58 Q57,100 58,148" stroke={`rgba(244,234,215,0.06)`} strokeWidth="2" strokeLinecap="round"/>
        <path d="M50,120 Q80,113 110,120 L110,162 Q110,170 80,170 Q50,170 50,162 Z" fill={`rgba(${A},0.55)`}/>
        <path d="M51,120 Q80,112 109,120" fill="none" stroke={`rgba(${A},0.70)`} strokeWidth="1.2"/>
        <rect x="72" y="22" width="16" height="34" rx="4" fill="url(#vg1)" stroke={`rgba(${A},0.40)`} strokeWidth="1"/>
        <path d="M70,18 Q80,12 90,18 L90,28 Q80,32 70,28 Z" fill={`rgba(${A},0.30)`} stroke={`rgba(${A},0.55)`} strokeWidth="0.8"/>
        <line x1="70" y1="22" x2="90" y2="22" stroke={`rgba(${A},0.20)`} strokeWidth="0.5"/>
        <line x1="70" y1="25" x2="90" y2="25" stroke={`rgba(${A},0.15)`} strokeWidth="0.4"/>
        <rect x="76" y="14" width="8" height="10" rx="2" fill="rgba(180,140,80,0.35)" stroke={`rgba(${A},0.30)`} strokeWidth="0.6"/>
        <rect x="52" y="100" width="56" height="48" rx="2" fill="rgba(20,4,4,0.8)" stroke={`rgba(${A},0.32)`} strokeWidth="0.9"/>
        <rect x="55" y="103" width="50" height="42" rx="1" fill="none" stroke={`rgba(${A},0.14)`} strokeWidth="0.5"/>
        <line x1="57" y1="112" x2="103" y2="112" stroke={`rgba(${A},0.18)`} strokeWidth="0.6"/>
        <line x1="60" y1="118" x2="100" y2="118" stroke={`rgba(${A},0.12)`} strokeWidth="0.4"/>
        <line x1="60" y1="124" x2="100" y2="124" stroke={`rgba(${A},0.12)`} strokeWidth="0.4"/>
        <line x1="60" y1="130" x2="100" y2="130" stroke={`rgba(${A},0.12)`} strokeWidth="0.4"/>
        {[[-6,-4],[-2,-4],[2,-4],[-4,0],[0,0],[4,0],[-2,4]].map(([dx,dy],i)=>(<circle key={i} cx={80+dx} cy={137+dy} r="2.2" fill={`rgba(${A},0.30)`} stroke={`rgba(${A},0.45)`} strokeWidth="0.4"/>))}
        <path d="M80,131 Q86,127 84,125" fill="none" stroke={`rgba(${A},0.35)`} strokeWidth="0.7" strokeLinecap="round"/>
        <ellipse cx="80" cy="176" rx="28" ry="5" fill={`rgba(${A},0.12)`}/>
      </svg>
    ),
  },
  {
    id: 'cimbalka', num: '03', title: 'Divoká cimbálka', tag: 'Živá muzika',
    desc: 'Živá moravská muzika rozezvučí celý sklep. Dýchající rytmus, co vás strhne do víru tance.',
    accent: '200,166,74',
    bg: 'linear-gradient(175deg, #1a0101 0%, #250303 60%, #120000 100%)',
    svg: (A) => (
      <svg viewBox="0 0 160 180" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0202"/><stop offset="100%" stopColor="#0e0101"/></linearGradient>
          <radialGradient id="cg2" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor={`rgba(${A},0.16)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
        </defs>
        <ellipse cx="80" cy="100" rx="72" ry="68" fill="url(#cg2)"/>
        <path d="M12,130 L22,72 L138,64 L148,130 Z" fill="url(#cg1)" stroke={`rgba(${A},0.50)`} strokeWidth="1.5"/>
        <path d="M18,127 L27,77 L133,69 L142,127 Z" fill="none" stroke={`rgba(${A},0.12)`} strokeWidth="0.6"/>
        {[80,90,100,110,120].map(y=>(<path key={y} d={`M${14+(y-80)*0.5},${y} Q80,${y-3} ${146-(y-80)*0.5},${y}`} fill="none" stroke={`rgba(${A},0.06)`} strokeWidth="0.5"/>))}
        <path d="M35,118 L35,108 L125,102 L125,112 Z" fill={`rgba(${A},0.12)`} stroke={`rgba(${A},0.28)`} strokeWidth="0.7"/>
        {Array.from({length:14},(_,i)=>i).map(i=>(<line key={i} x1={22+i*8} y1={73+i*0.7} x2={26+i*8} y2={128+i*0.2} stroke={`rgba(${A},0.28)`} strokeWidth="0.7"/>))}
        {[30,48,66,84,102,120,138].map((x,i)=>(<g key={x}><circle cx={x} cy={65+i*0.5} r="3.5" fill="#0e0101" stroke={`rgba(${A},0.40)`} strokeWidth="0.7"/><circle cx={x} cy={65+i*0.5} r="1.2" fill={`rgba(${A},0.50)`}/></g>))}
        <line x1="30" y1="130" x2="26" y2="168" stroke={`rgba(${A},0.35)`} strokeWidth="2" strokeLinecap="round"/>
        <line x1="80" y1="130" x2="80" y2="170" stroke={`rgba(${A},0.35)`} strokeWidth="2" strokeLinecap="round"/>
        <line x1="130" y1="130" x2="134" y2="168" stroke={`rgba(${A},0.35)`} strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="168" x2="30" y2="168" stroke={`rgba(${A},0.25)`} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="76" y1="170" x2="84" y2="170" stroke={`rgba(${A},0.25)`} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="130" y1="168" x2="138" y2="168" stroke={`rgba(${A},0.25)`} strokeWidth="1.5" strokeLinecap="round"/>
        <g transform="translate(50,50) rotate(-28)">
          <rect x="-1.5" y="0" width="3" height="32" rx="1.5" fill="rgba(180,140,80,0.30)" stroke={`rgba(${A},0.35)`} strokeWidth="0.6"/>
          <ellipse cx="0" cy="34" rx="6" ry="5" fill={`rgba(${A},0.55)`} stroke={`rgba(${A},0.70)`} strokeWidth="0.6"/>
        </g>
        <g transform="translate(105,44) rotate(22)">
          <rect x="-1.5" y="0" width="3" height="32" rx="1.5" fill="rgba(180,140,80,0.30)" stroke={`rgba(${A},0.35)`} strokeWidth="0.6"/>
          <ellipse cx="0" cy="34" rx="6" ry="5" fill={`rgba(${A},0.55)`} stroke={`rgba(${A},0.70)`} strokeWidth="0.6"/>
        </g>
        {[[140,32,15],[18,40,-12],[148,55,5]].map(([x,y,r],i)=>(<g key={i} transform={`translate(${x},${y}) rotate(${r})`} opacity={0.55+i*0.1}><ellipse cx="0" cy="0" rx="5" ry="3.5" fill={`rgba(${A},0.72)`}/><line x1="5" y1="0" x2="5" y2="-18" stroke={`rgba(${A},0.72)`} strokeWidth="1.1"/><path d="M5,-18 L14,-15 L14,-11 L5,-14 Z" fill={`rgba(${A},0.55)`}/></g>))}
        <g transform="translate(22,55)" opacity="0.45">
          <ellipse cx="0" cy="0" rx="4" ry="3" fill={`rgba(${A},0.60)`}/>
          <ellipse cx="12" cy="-4" rx="4" ry="3" fill={`rgba(${A},0.60)`}/>
          <line x1="4" y1="0" x2="4" y2="-18" stroke={`rgba(${A},0.60)`} strokeWidth="1"/>
          <line x1="16" y1="-4" x2="16" y2="-18" stroke={`rgba(${A},0.60)`} strokeWidth="1"/>
          <line x1="4" y1="-18" x2="16" y2="-18" stroke={`rgba(${A},0.55)`} strokeWidth="1.4"/>
        </g>
      </svg>
    ),
  },
  {
    id: 'jidlo', num: '04', title: 'Sváteční jídlo', tag: 'Moravská kuchyně',
    desc: 'Zlatavá kachna, svíčková s knedlíky, dozrálé sýry — autentická gastronomie, která doplní víno k naprosté dokonalosti.',
    accent: '186,130,58',
    bg: 'linear-gradient(175deg, #180101 0%, #2d0505 55%, #120000 100%)',
    svg: (A) => (
      <svg viewBox="0 0 160 180" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <radialGradient id="pg1" cx="50%" cy="55%" r="58%"><stop offset="0%" stopColor={`rgba(${A},0.22)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
        </defs>
        <ellipse cx="80" cy="120" rx="68" ry="62" fill="url(#pg1)"/>
        <ellipse cx="80" cy="128" rx="66" ry="46" fill="#0a0101" stroke={`rgba(${A},0.40)`} strokeWidth="1.5"/>
        {Array.from({length:24},(_,i)=>i).map(i=>(<line key={i} x1={80+60*Math.cos(i*Math.PI/12)} y1={128+42*Math.sin(i*Math.PI/12)} x2={80+66*Math.cos(i*Math.PI/12)} y2={128+46*Math.sin(i*Math.PI/12)} stroke={`rgba(${A},0.12)`} strokeWidth="0.6"/>))}
        <ellipse cx="80" cy="128" rx="54" ry="36" fill="#0d0101" stroke={`rgba(${A},0.15)`} strokeWidth="0.6"/>
        <path d="M44,128 Q50,100 80,97 Q110,100 116,128 Q110,148 80,151 Q50,148 44,128 Z" fill={`rgba(${A},0.28)`} stroke={`rgba(${A},0.50)`} strokeWidth="0.9"/>
        {[-12,-4,4,12].map(dx=>(<line key={dx} x1={80+dx} y1="100" x2={80+dx} y2="148" stroke={`rgba(${A},0.07)`} strokeWidth="0.5"/>))}
        <path d="M60,132 Q70,125 80,128 Q90,131 100,124" fill="none" stroke={`rgba(${A},0.75)`} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="58" cy="118" r="7" fill="rgba(40,80,30,0.55)" stroke="rgba(60,110,40,0.30)" strokeWidth="0.6"/>
        <circle cx="104" cy="118" r="7" fill="rgba(40,80,30,0.55)" stroke="rgba(60,110,40,0.30)" strokeWidth="0.6"/>
        <circle cx="80" cy="108" r="5" fill="rgba(40,80,30,0.40)"/>
        {[68,80,92].map((x,i)=>(<path key={x} d={`M${x},97 Q${x+5},88 ${x},80 Q${x-4},72 ${x},64`} fill="none" stroke="rgba(244,234,215,0.10)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={`${2+i} ${3+i}`}/>))}
        <g transform="translate(22,95)">
          <rect x="-1" y="0" width="2" height="52" rx="1" fill="rgba(200,180,140,0.28)" stroke={`rgba(${A},0.28)`} strokeWidth="0.6"/>
          {[-3,0,3].map(dx=>(<line key={dx} x1={dx} y1="0" x2={dx} y2="-14" stroke={`rgba(${A},0.28)`} strokeWidth="0.8" strokeLinecap="round"/>))}
        </g>
        <g transform="translate(136,93)">
          <rect x="-1" y="0" width="2" height="56" rx="1" fill="rgba(200,180,140,0.28)" stroke={`rgba(${A},0.28)`} strokeWidth="0.6"/>
          <path d="M1,0 Q8,-5 6,18 Q4,28 1,32" fill="rgba(200,180,140,0.18)" stroke={`rgba(${A},0.25)`} strokeWidth="0.6"/>
        </g>
        <ellipse cx="80" cy="178" rx="60" ry="8" fill={`rgba(${A},0.07)`}/>
      </svg>
    ),
  },
  {
    id: 'zabava', num: '05', title: 'Bouřlivá zábava', tag: 'Nezapomenutelný večer',
    desc: 'Vinné kvízy, smích, šťavnaté historky z vinohradů. Noc plná tepla, která nevyjde z hlavy ani druhý den.',
    accent: '148,195,128',
    bg: 'linear-gradient(175deg, #100101 0%, #220404 60%, #0e0101 100%)',
    svg: (A) => (
      <svg viewBox="0 0 160 180" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <radialGradient id="fg1" cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor={`rgba(${A},0.18)`}/><stop offset="100%" stopColor="transparent"/></radialGradient>
        </defs>
        <ellipse cx="80" cy="100" rx="72" ry="72" fill="url(#fg1)"/>
        <path d="M0,88 Q80,18 160,88" fill="none" stroke={`rgba(${A},0.10)`} strokeWidth="1"/>
        <line x1="4" y1="162" x2="156" y2="162" stroke={`rgba(${A},0.18)`} strokeWidth="0.8"/>
        <g transform="translate(30,162)">
          <path d="M-9,-78 Q-10,-55 -9,-38 L-9,0" fill="none" stroke={`rgba(${A},0.22)`} strokeWidth="8" strokeLinecap="round"/>
          <circle cx="0" cy="-86" r="13" fill="#0c0101" stroke={`rgba(${A},0.28)`} strokeWidth="1"/>
          <path d="M-4,-70 Q8,-85 14,-90" fill="none" stroke={`rgba(${A},0.28)`} strokeWidth="6" strokeLinecap="round"/>
          <g transform="translate(16,-94)">
            <path d="M-5,0 Q-6,8 -5,14 Q-2,18 0,18 Q2,18 5,14 Q6,8 5,0 Z" fill={`rgba(186,62,58,0.55)`} stroke={`rgba(${A},0.40)`} strokeWidth="0.7"/>
            <line x1="0" y1="18" x2="0" y2="26" stroke={`rgba(${A},0.30)`} strokeWidth="0.8"/>
          </g>
          <path d="M5,-70 Q-8,-78 -14,-76" fill="none" stroke={`rgba(${A},0.25)`} strokeWidth="5" strokeLinecap="round"/>
          <path d="M-9,-38 L-14,0 M-9,-38 L-4,0" fill="none" stroke={`rgba(${A},0.22)`} strokeWidth="6" strokeLinecap="round"/>
        </g>
        <g transform="translate(80,162)">
          <path d="M-10,-86 Q-11,-60 -10,-40 L-10,0" fill="none" stroke={`rgba(${A},0.28)`} strokeWidth="10" strokeLinecap="round"/>
          <circle cx="0" cy="-96" r="15" fill="#0c0101" stroke={`rgba(${A},0.35)`} strokeWidth="1.2"/>
          <path d="M-5,-76 Q-22,-96 -28,-102" fill="none" stroke={`rgba(${A},0.30)`} strokeWidth="7" strokeLinecap="round"/>
          <path d="M5,-76 Q22,-96 28,-102" fill="none" stroke={`rgba(${A},0.30)`} strokeWidth="7" strokeLinecap="round"/>
          <path d="M-10,-40 L-16,0 M-10,-40 L-4,0" fill="none" stroke={`rgba(${A},0.28)`} strokeWidth="7" strokeLinecap="round"/>
        </g>
        <g transform="translate(130,162)">
          <path d="M-9,-74 Q-10,-52 -9,-36 L-9,0" fill="none" stroke={`rgba(${A},0.22)`} strokeWidth="8" strokeLinecap="round"/>
          <circle cx="0" cy="-82" r="12" fill="#0c0101" stroke={`rgba(${A},0.28)`} strokeWidth="1"/>
          <path d="M-4,-66 Q-18,-80 -24,-84" fill="none" stroke={`rgba(${A},0.28)`} strokeWidth="6" strokeLinecap="round"/>
          <path d="M5,-66 Q14,-70 18,-68" fill="none" stroke={`rgba(${A},0.22)`} strokeWidth="5" strokeLinecap="round"/>
          <path d="M-9,-36 L-14,0 M-9,-36 L-4,0" fill="none" stroke={`rgba(${A},0.22)`} strokeWidth="6" strokeLinecap="round"/>
        </g>
        {[[55,42],[80,28],[106,42],[40,62],[120,58],[80,55]].map(([x,y],i)=>(<g key={i} transform={`translate(${x},${y})`} opacity={0.45+i*0.08}><line x1="-5" y1="0" x2="5" y2="0" stroke={`rgba(${A},1)`} strokeWidth="1.2" strokeLinecap="round"/><line x1="0" y1="-5" x2="0" y2="5" stroke={`rgba(${A},1)`} strokeWidth="1.2" strokeLinecap="round"/><line x1="-3" y1="-3" x2="3" y2="3" stroke={`rgba(${A},0.55)`} strokeWidth="0.7" strokeLinecap="round"/><line x1="3" y1="-3" x2="-3" y2="3" stroke={`rgba(${A},0.55)`} strokeWidth="0.7" strokeLinecap="round"/></g>))}
      </svg>
    ),
  },
];

/* ── EMOJI ICONS & HorizontalStrip — stejné jako původně ── */
const EMOJI_ICONS = {
  sklep: ({ A, anim }) => (
    <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, display: 'block', transform: anim ? 'translateY(-4px) scale(1.15)' : 'translateY(0) scale(1)', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', filter: anim ? `drop-shadow(0 0 10px rgba(${A},0.65))` : `drop-shadow(0 2px 6px rgba(${A},0.20))` }}>
      <rect x="4" y="6" width="40" height="38" rx="2" fill="none" stroke={`rgba(${A},0.18)`} strokeWidth="1"/>
      <path d="M10,44 L10,22 Q10,10 24,10 Q38,10 38,22 L38,44" fill={`rgba(${A},0.10)`} stroke={`rgba(${A},0.70)`} strokeWidth="1.8"/>
      <path d="M14,44 L14,24 Q14,14 24,14 Q34,14 34,24 L34,44" fill={`rgba(${A},0.06)`} stroke={`rgba(${A},0.30)`} strokeWidth="0.8"/>
      <path d="M20,10 L24,4 L28,10 Z" fill={`rgba(${A},0.80)`}/>
      <circle cx="22" cy="34" r="2" fill={`rgba(${A},0.65)`}/>
      <circle cx="26" cy="34" r="2" fill={`rgba(${A},0.65)`}/>
      {anim && <circle cx="24" cy="34" r="6" fill={`rgba(${A},0.15)`}/>}
    </svg>
  ),
  vino: ({ A, anim }) => (
    <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, display: 'block', transform: anim ? 'rotate(-8deg) scale(1.15)' : 'rotate(0) scale(1)', transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)', filter: anim ? `drop-shadow(0 0 12px rgba(${A},0.65))` : `drop-shadow(0 2px 6px rgba(${A},0.20))` }}>
      <path d="M18,12 Q16,16 15,24 L15,40 Q15,44 24,44 Q33,44 33,40 L33,24 Q32,16 30,12 Z" fill={`rgba(${A},0.14)`} stroke={`rgba(${A},0.65)`} strokeWidth="1.5"/>
      <rect x="20" y="6" width="8" height="8" rx="2.5" fill={`rgba(${A},0.12)`} stroke={`rgba(${A},0.55)`} strokeWidth="1"/>
      <path d="M19,5 Q24,2 29,5 L29,8 Q24,10 19,8 Z" fill={`rgba(${A},0.35)`} stroke={`rgba(${A},0.55)`} strokeWidth="0.7"/>
      <path d="M16,30 Q24,27 32,30 L32,40 Q32,42 24,42 Q16,42 16,40 Z" fill={`rgba(${A},0.50)`}/>
      <rect x="17" y="22" width="14" height="10" rx="1" fill="none" stroke={`rgba(${A},0.28)`} strokeWidth="0.7"/>
      <line x1="18" y1="14" x2="17.5" y2="38" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" strokeLinecap="round"/>
      {anim && <ellipse cx="24" cy="43" rx="10" ry="3" fill={`rgba(${A},0.18)`}/>}
    </svg>
  ),
  cimbalka: ({ A, anim }) => (
    <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, display: 'block', transform: anim ? 'scale(1.18) rotate(5deg)' : 'scale(1) rotate(0)', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', filter: anim ? `drop-shadow(0 0 12px rgba(${A},0.60))` : `drop-shadow(0 2px 6px rgba(${A},0.20))` }}>
      <path d="M4,28 L8,14 L40,11 L44,28 Z" fill={`rgba(${A},0.10)`} stroke={`rgba(${A},0.65)`} strokeWidth="1.6"/>
      {[0,1,2,3,4,5,6].map(i=>(<line key={i} x1={9+i*5} y1={15+i*0.4} x2={10+i*5} y2={27+i*0.2} stroke={`rgba(${A},0.35)`} strokeWidth="0.7"/>))}
      <g transform="translate(18,8) rotate(-25)"><rect x="-1" y="0" width="2" height="12" rx="1" fill={`rgba(${A},0.55)`}/><ellipse cx="0" cy="13" rx="3.5" ry="3" fill={`rgba(${A},0.80)`}/></g>
      <g transform="translate(30,7) rotate(18)"><rect x="-1" y="0" width="2" height="12" rx="1" fill={`rgba(${A},0.55)`}/><ellipse cx="0" cy="13" rx="3.5" ry="3" fill={`rgba(${A},0.80)`}/></g>
      <g transform={`translate(40,${anim?5:8}) rotate(-10)`} opacity="0.75" style={{transition:'transform 0.3s'}}><ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill={`rgba(${A},0.80)`}/><line x1="3.5" y1="0" x2="3.5" y2="-10" stroke={`rgba(${A},0.80)`} strokeWidth="1"/></g>
      <line x1="10" y1="28" x2="8" y2="42" stroke={`rgba(${A},0.40)`} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="28" x2="24" y2="44" stroke={`rgba(${A},0.40)`} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="38" y1="28" x2="40" y2="42" stroke={`rgba(${A},0.40)`} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  jidlo: ({ A, anim }) => (
    <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, display: 'block', transform: anim ? 'translateY(-5px) scale(1.14)' : 'translateY(0) scale(1)', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', filter: anim ? `drop-shadow(0 0 12px rgba(${A},0.55))` : `drop-shadow(0 2px 6px rgba(${A},0.20))` }}>
      <ellipse cx="24" cy="30" rx="18" ry="12" fill={`rgba(${A},0.08)`} stroke={`rgba(${A},0.55)`} strokeWidth="1.5"/>
      <ellipse cx="24" cy="30" rx="14" ry="9" fill={`rgba(${A},0.05)`} stroke={`rgba(${A},0.20)`} strokeWidth="0.7"/>
      <path d="M13,30 Q16,21 24,20 Q32,21 35,30 Q31,36 24,37 Q17,36 13,30 Z" fill={`rgba(${A},0.32)`} stroke={`rgba(${A},0.50)`} strokeWidth="0.8"/>
      <path d="M18,30 Q21,26 24,28 Q27,30 30,26" fill="none" stroke={`rgba(${A},0.80)`} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="16" cy="25" r="3" fill="rgba(60,110,40,0.55)"/>
      <circle cx="33" cy="25" r="3" fill="rgba(60,110,40,0.55)"/>
      <line x1="7" y1="22" x2="7" y2="42" stroke={`rgba(${A},0.40)`} strokeWidth="1.5" strokeLinecap="round"/>
      {[-2,0,2].map(dx=>(<line key={dx} x1={7+dx} y1="22" x2={7+dx} y2="16" stroke={`rgba(${A},0.40)`} strokeWidth="1" strokeLinecap="round"/>))}
      <line x1="41" y1="22" x2="41" y2="42" stroke={`rgba(${A},0.40)`} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M41,22 Q46,18 44,30" fill={`rgba(${A},0.22)`} stroke={`rgba(${A},0.38)`} strokeWidth="0.7"/>
      {anim && [20,24,28].map((x)=>(<path key={x} d={`M${x},20 Q${x+3},14 ${x},10`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round"/>))}
    </svg>
  ),
  zabava: ({ A, anim }) => (
    <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, display: 'block', transform: anim ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)', filter: anim ? `drop-shadow(0 0 14px rgba(${A},0.70))` : `drop-shadow(0 2px 6px rgba(${A},0.20))` }}>
      {Array.from({length:12},(_,i)=>{const angle=(i*30)*Math.PI/180;const r1=anim?8:6;const r2=anim?20:16;return(<line key={i} x1={24+r1*Math.cos(angle)} y1={24+r1*Math.sin(angle)} x2={24+r2*Math.cos(angle)} y2={24+r2*Math.sin(angle)} stroke={`rgba(${A},${i%3===0?0.90:0.45})`} strokeWidth={i%3===0?1.4:0.8} strokeLinecap="round" style={{transition:'all 0.4s'}}/>);})}
      {Array.from({length:12},(_,i)=>{const angle=(i*30+15)*Math.PI/180;const r1=anim?10:8;const r2=anim?15:12;return(<line key={i} x1={24+r1*Math.cos(angle)} y1={24+r1*Math.sin(angle)} x2={24+r2*Math.cos(angle)} y2={24+r2*Math.sin(angle)} stroke={`rgba(${A},0.28)`} strokeWidth="0.6" strokeLinecap="round" style={{transition:'all 0.4s'}}/>);})}
      <circle cx="24" cy="24" r={anim?4.5:3} fill={`rgba(${A},${anim?1:0.70})`} style={{transition:'all 0.4s'}}/>
      <circle cx="24" cy="24" r={anim?2:1.2} fill="rgba(255,255,220,0.90)" style={{transition:'all 0.4s'}}/>
      <circle cx="24" cy="24" r={anim?22:18} fill="none" stroke={`rgba(${A},${anim?0.25:0.12})`} strokeWidth="0.7" strokeDasharray="2 4" style={{transition:'all 0.4s'}}/>
    </svg>
  ),
};

function EmojiIcon({ id, accent }) {
  const [hovered, setHovered] = useState(false);
  const Icon = EMOJI_ICONS[id];
  if (!Icon) return null;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'inline-block', cursor: 'pointer', lineHeight: 0 }}>
      <Icon A={accent} anim={hovered}/>
    </div>
  );
}

function HorizontalStrip() {
  const [active, setActive] = useState(null);
  const stripRef = useRef(null);

  useEffect(() => {
    if (!stripRef.current) return;
    gsap.fromTo(stripRef.current.querySelectorAll('.strip-panel'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: stripRef.current, start: 'top 78%' } });
  }, []);

  return (
    <div ref={stripRef} style={{ display: 'flex', margin: '0 clamp(12px,3vw,48px) clamp(60px,8vh,100px)', position: 'relative', gap: 0, border: `1px solid rgba(${GOLD},0.10)`, overflow: 'visible' }}>
      <div aria-hidden style={{ position: 'absolute', top: '38%', left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(${GOLD},0.12) 10%, rgba(${GOLD},0.12) 90%, transparent)`, pointerEvents: 'none', zIndex: 0 }}/>
      {FEATURES.map((f, i) => {
        const isActive = active === f.id;
        const isLast = i === FEATURES.length - 1;
        const A = f.accent;
        const clipPath = isLast ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, calc(100% - 24px) 100%, 0 100%)';
        return (
          <div key={f.id} className="strip-panel"
            onMouseEnter={() => setActive(f.id)}
            onMouseLeave={() => setActive(null)}
            onClick={() => window.open(BOOKING_URL, '_blank', 'noopener,noreferrer')}
            style={{ flex: isActive ? '2.5 1 0' : '1 1 0', minWidth: 0, position: 'relative', cursor: 'pointer', transition: 'flex 0.55s cubic-bezier(0.16,1,0.3,1)', marginRight: isLast ? 0 : -20, background: f.bg, clipPath, zIndex: isActive ? 10 : FEATURES.length - i, opacity: 0 }}
          >
            <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '140px', opacity: 0.04, pointerEvents: 'none' }}/>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 90% 70% at 50% 40%, rgba(${A},0.09) 0%, transparent 65%)`, opacity: isActive ? 1 : 0, transition: 'opacity 0.4s', pointerEvents: 'none' }}/>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: isActive ? 3 : 1, background: `linear-gradient(90deg, transparent, rgba(${A},${isActive ? 0.9 : 0.25}), transparent)`, boxShadow: isActive ? `0 0 20px rgba(${A},0.45)` : 'none', transition: 'height 0.3s, box-shadow 0.3s, background 0.3s' }}/>
            <div style={{ position: 'absolute', top: 16, left: 18, fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', color: `rgba(${A},${isActive ? 0.60 : 0.25})`, transition: 'color 0.3s', zIndex: 3 }}>{f.num}</div>
            {isActive && (<><div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 32, borderTop: `2px solid rgba(${A},0.55)`, borderLeft: `2px solid rgba(${A},0.55)`, pointerEvents: 'none', zIndex: 3 }}/><div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderBottom: `2px solid rgba(${A},0.55)`, borderRight: `2px solid rgba(${A},0.55)`, pointerEvents: 'none', zIndex: 3 }}/></>)}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(36px,4vh,56px) clamp(14px,1.5vw,24px) clamp(24px,3vh,40px)', height: '100%', position: 'relative', zIndex: 2, minHeight: 480 }}>
              <div style={{ marginBottom: 10 }}><EmojiIcon id={f.id} accent={f.accent}/></div>
              <div style={{ width: '100%', maxWidth: isActive ? 200 : 120, flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'max-width 0.5s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 4px 24px rgba(${A},${isActive ? 0.30 : 0.10}))` }}>{f.svg(A)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '16px 0 14px', width: '100%' }}>
                <div style={{ flex: 1, height: 1, background: `rgba(${A},0.20)` }}/>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: `rgba(${A},${isActive ? 0.80 : 0.35})`, boxShadow: isActive ? `0 0 8px rgba(${A},0.6)` : 'none', transition: 'background 0.3s, box-shadow 0.3s', flexShrink: 0 }}/>
                <div style={{ flex: 1, height: 1, background: `rgba(${A},0.20)` }}/>
              </div>
              <div style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 7, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(${A},${isActive ? 0.80 : 0.40})`, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center', transition: 'color 0.3s' }}>{f.tag}</div>
              <div style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: isActive ? 'clamp(28px,2.8vw,40px)' : 'clamp(20px,2vw,28px)', fontWeight: 600, color: `rgba(${CREAM},${isActive ? 1 : 0.70})`, letterSpacing: '0.02em', lineHeight: 1, marginBottom: isActive ? 14 : 0, textAlign: 'center', transition: 'font-size 0.4s, color 0.3s, margin 0.4s' }}>{f.title}</div>
              <div style={{ maxHeight: isActive ? 120 : 0, overflow: 'hidden', opacity: isActive ? 1 : 0, transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s' }}>
                <p style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 'clamp(11.5px,0.88vw,13.5px)', fontWeight: 400, lineHeight: 1.80, color: `rgba(${CREAM},0.58)`, margin: 0, textAlign: 'center', letterSpacing: '0.02em' }}>{f.desc}</p>
              </div>
              <div style={{ marginTop: isActive ? 18 : 0, maxHeight: isActive ? 40 : 0, overflow: 'hidden', opacity: isActive ? 1 : 0, transition: 'max-height 0.4s, opacity 0.3s 0.1s, margin 0.4s', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${A},0.90)` }}>Rezervovat</span>
                <div style={{ width: 18, height: 1, background: `rgba(${A},0.70)` }}/>
              </div>
            </div>
            <div aria-hidden style={{ position: 'absolute', bottom: -10, right: isActive ? 10 : -5, fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(60px,8vw,110px)', fontWeight: 600, letterSpacing: '-0.02em', color: 'transparent', WebkitTextStroke: `1px rgba(${A},${isActive ? 0.12 : 0.05})`, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', transition: 'all 0.5s' }}>{f.num}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function Rezervace() {
  const pageRef       = useRef(null);
  const heroRef       = useRef(null);
  const factsRef      = useRef(null);
  const packagesRef   = useRef(null);
  const atmosphereRef = useRef(null);
  const finalCtaRef   = useRef(null);
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, delay: Math.random() * 6, dur: Math.random() * 4 + 4,
    }))
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-pre', { opacity: 0, y: 20, letterSpacing: '0.6em' }, { opacity: 1, y: 0, letterSpacing: '0.36em', duration: 1.1 }, 0.4);
      tl.fromTo('.hero-title-line', { yPercent: 110, skewY: 1.5 }, { yPercent: 0, skewY: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, 0.7);
      tl.fromTo('.hero-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 1.4);
      tl.fromTo('.hero-cta', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12 }, 1.7);
      tl.fromTo('.hero-glass', { opacity: 0, scale: 0.7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power4.out' }, 0.2);
      gsap.fromTo('.fact-item', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14, scrollTrigger: { trigger: factsRef.current, start: 'top 78%' } });
      gsap.fromTo('.pkg-card', { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', scrollTrigger: { trigger: packagesRef.current, start: 'top 75%' } });
      gsap.fromTo('.atm-item', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: atmosphereRef.current, start: 'top 75%' } });
      gsap.fromTo('.final-reveal', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, scrollTrigger: { trigger: finalCtaRef.current, start: 'top 78%' } });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleBook = () => window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
  const sectionPad = 'clamp(80px,10vh,140px) clamp(32px,8vw,120px)';

  return (
    <div ref={pageRef} style={{ background: '#2a0202', color: `rgba(${CREAM},1)`, fontFamily: 'var(--font-body,"Raleway",sans-serif)', overflowX: 'hidden', position: 'relative' }}>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        /* paddingTop kompenzuje výšku fixního navbaru */
        padding: `clamp(120px,14vh,160px) clamp(32px,8vw,120px) clamp(80px,10vh,140px)`,
        background: 'linear-gradient(160deg, #2a0202 0%, #4a0404 50%, #2a0202 100%)',
        overflow: 'hidden',
        gap: 'clamp(40px,6vw,100px)',
      }}>

        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '200px', opacity: 0.04, pointerEvents: 'none' }}/>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)', pointerEvents: 'none' }}/>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {particles.map(p => (<div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: '50%', background: `rgba(${GOLD},0.55)`, animation: `particleFloat ${p.dur}s ${p.delay}s ease-in-out infinite alternate`, filter: 'blur(0.5px)' }}/>))}
        </div>
        <div aria-hidden style={{ position: 'absolute', top: '-15%', right: '-5%', width: '55vw', height: '55vw', border: `1px solid rgba(${GOLD},0.07)`, borderRadius: '50%', pointerEvents: 'none' }}/>
        <div aria-hidden style={{ position: 'absolute', top: '5%', right: '10%', width: '35vw', height: '35vw', border: `1px solid rgba(${GOLD},0.05)`, borderRadius: '50%', pointerEvents: 'none' }}/>

        {/* LEFT — text */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-pre" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, opacity: 0 }}>
            <div style={{ width: 32, height: 1, background: `rgba(${GOLD},0.7)` }}/>
            <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.36em', textTransform: 'uppercase', color: `rgba(${GOLD},0.85)` }}>Vinařství Rustikal · Morava</span>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <h1 className="hero-title-line" style={{ fontFamily: 'var(--font-display,"Cormorant Garamond","Playfair Display",serif)', fontSize: 'clamp(42px,5.5vw,82px)', fontWeight: 300, lineHeight: 0.95, color: `rgba(${CREAM},0.92)`, margin: 0, letterSpacing: '0.02em' }}>Zažijte</h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 8 }}>
            <h1 className="hero-title-line" style={{ fontFamily: 'var(--font-display,"Cormorant Garamond","Playfair Display",serif)', fontSize: 'clamp(52px,7vw,110px)', fontWeight: 600, lineHeight: 0.90, margin: 0, letterSpacing: '-0.01em', background: 'linear-gradient(135deg, #fffbe0 0%, #e8c050 35%, #f5d96e 58%, #c89628 85%, #e8c050 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 2px 8px rgba(200,144,40,0.4))' }}>Rustikal</h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 32 }}>
            <h1 className="hero-title-line" style={{ fontFamily: 'var(--font-display,"Cormorant Garamond","Playfair Display",serif)', fontSize: 'clamp(26px,3.2vw,48px)', fontWeight: 300, lineHeight: 1.1, color: `rgba(${CREAM},0.65)`, margin: 0, letterSpacing: '0.12em', fontStyle: 'italic' }}>od roku 1892</h1>
          </div>
          <p className="hero-sub" style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 'clamp(13px,1.1vw,16px)', fontWeight: 400, lineHeight: 1.9, color: `rgba(${CREAM},0.65)`, maxWidth: '44ch', margin: '0 0 44px', letterSpacing: '0.03em', opacity: 0 }}>
            Vstupte do světa moravských vín, kde každá lahev vypráví příběh. Historický sklípek, výjimečná vína, nezapomenutelné zážitky — jen pro vás.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hero-cta"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: `linear-gradient(135deg, rgba(${GOLD},0.22), rgba(${GOLD},0.12))`, border: `1px solid rgba(${GOLD},0.65)`, fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${GOLD},1)`, textDecoration: 'none', transition: 'all 0.28s', opacity: 0, boxShadow: `0 0 0 rgba(${GOLD},0)` }}
              onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${GOLD},0.36), rgba(${GOLD},0.20))`; e.currentTarget.style.boxShadow = `0 0 40px rgba(${GOLD},0.25), inset 0 0 20px rgba(${GOLD},0.05)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${GOLD},0.22), rgba(${GOLD},0.12))`; e.currentTarget.style.boxShadow = `0 0 0 rgba(${GOLD},0)`; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span>Rezervovat zážitek</span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 5h12M8 1l4 4-4 4" stroke={`rgba(${GOLD},1)`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#zazitky" className="hero-cta"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: 'none', border: `1px solid rgba(${CREAM},0.18)`, fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(${CREAM},0.60)`, textDecoration: 'none', transition: 'all 0.28s', opacity: 0 }}
              onMouseEnter={e => { e.currentTarget.style.color = `rgba(${CREAM},0.95)`; e.currentTarget.style.borderColor = `rgba(${CREAM},0.45)`; }}
              onMouseLeave={e => { e.currentTarget.style.color = `rgba(${CREAM},0.60)`; e.currentTarget.style.borderColor = `rgba(${CREAM},0.18)`; }}
            >
              Prohlédnout zážitky
            </a>
          </div>
        </div>

        {/* RIGHT — wine glass */}
        <div className="hero-glass" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}>
          <WineGlass3D accent={GOLD}/>
          <div style={{ position: 'absolute', top: '12%', right: '-5%', background: `rgba(${WINE},0.88)`, border: `1px solid rgba(${GOLD},0.28)`, padding: '10px 16px', backdropFilter: 'blur(8px)', animation: 'floatCard 4s 0.5s ease-in-out infinite alternate' }}>
            <div style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 18, fontWeight: 600, color: `rgba(${GOLD},1)` }}>38+</div>
            <div style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(${CREAM},0.55)` }}>Druhů vín</div>
          </div>
          <div style={{ position: 'absolute', bottom: '20%', left: '-8%', background: `rgba(${WINE},0.88)`, border: `1px solid rgba(${GOLD},0.28)`, padding: '10px 16px', backdropFilter: 'blur(8px)', animation: 'floatCard 3.8s 1.2s ease-in-out infinite alternate' }}>
            <div style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 18, fontWeight: 600, color: `rgba(${GOLD},1)` }}>12°C</div>
            <div style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: `rgba(${CREAM},0.55)` }}>Ve sklepě</div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'scrollPulse 2.5s ease-in-out infinite', zIndex: 20 }}>
          <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: `rgba(${CREAM},0.32)` }}>Rolujte dolů</span>
          <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, rgba(${GOLD},0.6), transparent)` }}/>
        </div>
      </section>

      {/* ── COMIC STRIP ──────────────────────────────────── */}
      <section id="zazitky" ref={packagesRef} style={{ background: 'linear-gradient(180deg, #2a0202 0%, #3a0404 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', padding: 'clamp(60px,8vh,100px) clamp(32px,8vw,120px) clamp(32px,4vh,52px)', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: `rgba(${GOLD},0.30)` }}/>
            <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 8, fontWeight: 700, letterSpacing: '0.40em', textTransform: 'uppercase', color: `rgba(${GOLD},0.60)` }}>Co na vás čeká</span>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: `rgba(${GOLD},0.30)` }}/>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(34px,4.5vw,68px)', fontWeight: 400, color: `rgba(${CREAM},0.95)`, margin: 0, letterSpacing: '0.01em' }}>
            Celý večer,<em style={{ fontStyle: 'italic', color: `rgba(${GOLD},0.88)` }}> jeden příběh</em>
          </h2>
        </div>
        <HorizontalStrip />
      </section>

      {/* ── FACTS BAR ─────────────────────────────────────── */}
      <div ref={factsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid rgba(${GOLD},0.12)`, borderBottom: `1px solid rgba(${GOLD},0.12)`, background: `rgba(${WINE},0.35)`, backdropFilter: 'blur(10px)' }}>
        {FACTS.map((f, i) => (
          <div key={f.label} className="fact-item" style={{ opacity: 0, padding: 'clamp(28px,4vh,44px) clamp(20px,3vw,40px)', textAlign: 'center', borderRight: i < FACTS.length - 1 ? `1px solid rgba(${GOLD},0.10)` : 'none', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 600, color: `rgba(${GOLD},1)`, lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>{f.num}</div>
            <div style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${CREAM},0.45)` }}>{f.label}</div>
          </div>
        ))}
      </div>

      {/* ── ATMOSPHERE ────────────────────────────────────── */}
      <section ref={atmosphereRef} style={{ padding: sectionPad, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,8vw,120px)', alignItems: 'center', background: 'linear-gradient(180deg, #2a0202 0%, #3a0303 100%)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${GOLD},0.04) 0%, transparent 70%)`, pointerEvents: 'none' }}/>
        <div>
          <div className="atm-item" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, opacity: 0 }}>
            <div style={{ width: 28, height: 1, background: `rgba(${GOLD},0.6)` }}/>
            <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(${GOLD},0.75)` }}>Náš příběh</span>
          </div>
          <h2 className="atm-item" style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(32px,4vw,60px)', fontWeight: 400, lineHeight: 1.1, color: `rgba(${CREAM},0.95)`, margin: '0 0 28px', letterSpacing: '0.01em', opacity: 0 }}>
            Kde každý doušek<br/><em style={{ fontStyle: 'italic', color: `rgba(${GOLD},0.85)` }}>vypráví příběh</em>
          </h2>
          {[
  'V srdci hustopečských svahů, kde se slunce opírá do vápencového podloží, tvoříme vína s nezaměnitelným rukopisem a hlubokým charakterem. Naše vinařství je místem, kde se úcta k tradici potkává s odvahou dělat věci poctivě, a kde každá lahel zrcadlí jedinečný příběh naší krajiny.',
  'Náš historický sklípek z 19. století nabízí útočiště pro ty, kteří hledají víc než jen ochutnávku. Mezi cihelnými klenbami pro vás připravíme privátní večeře, profesionální firemní akce či komorní degustace s atmosférou, kterou jinde nenajdete. Zažijte Moravu v její nejsyrovější a nejkrásnější podobě.'
].map((text) => (
  <p 
    key={text} 
    className="atm-item" 
    style={{ 
      fontFamily: 'var(--font-body,"Raleway",sans-serif)', 
      fontSize: 'clamp(13px,1.0vw,15px)', 
      fontWeight: 400, 
      lineHeight: 1.92, 
      color: `rgba(${CREAM},0.62)`, 
      margin: '0 0 18px', 
      letterSpacing: '0.025em', 
      opacity: 0 
    }}
  >
    {text}
  </p>
))}
          <div className="atm-item" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 36, opacity: 0 }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${GOLD},1)`, transition: 'gap 0.24s' }}
              onMouseEnter={e => e.currentTarget.style.gap = '18px'}
              onMouseLeave={e => e.currentTarget.style.gap = '10px'}
            >
              Rezervovat místo
              <div style={{ width: 32, height: 1, background: `rgba(${GOLD},0.75)` }}/>
            </a>
          </div>
        </div>
        <div className="atm-item" style={{ opacity: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 12 }}>
          {[
            { label: 'Historický sklípek', sub: 'Nádherné prostory z roku 1892', icon: 'sklep', accent: GOLD, span: false },
            { label: 'Rodinná tradice', sub: 'Přes 130 let vášnivého pěstování', icon: 'vino', accent: '186,62,58', span: false },
            { label: 'Degustace & Events', sub: 'Intimně i velkolepě — pro 2 až 50 hostů', icon: 'zabava', accent: '148,195,128', span: true },
          ].map(tile => (
            <div key={tile.label} style={{ gridColumn: tile.span ? '1 / -1' : 'auto', padding: 'clamp(18px,2vw,26px)', background: `linear-gradient(135deg, rgba(${WINE},0.7), rgba(30,2,2,0.8))`, border: `1px solid rgba(${GOLD},0.14)`, position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s', display: 'flex', alignItems: 'center', gap: 16 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${GOLD},0.35)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${GOLD},0.14)`}
            >
              <div style={{ flexShrink: 0 }}><EmojiIcon id={tile.icon} accent={tile.accent}/></div>
              <div>
                <div style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(15px,1.5vw,20px)', fontWeight: 600, color: `rgba(${CREAM},0.92)`, marginBottom: 4 }}>{tile.label}</div>
                <div style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 10, fontWeight: 500, color: `rgba(${CREAM},0.42)`, letterSpacing: '0.04em' }}>{tile.sub}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderTop: `1px solid rgba(${GOLD},0.18)`, borderLeft: `1px solid rgba(${GOLD},0.18)`, transform: 'translate(50%,50%) rotate(45deg)', pointerEvents: 'none' }}/>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section ref={finalCtaRef} style={{ position: 'relative', padding: 'clamp(100px,14vh,180px) clamp(32px,8vw,120px)', textAlign: 'center', overflow: 'hidden', background: 'linear-gradient(180deg, #2a0202 0%, #4a0404 50%, #2a0202 100%)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(${GOLD},0.06) 0%, transparent 65%)`, pointerEvents: 'none' }}/>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '160px', opacity: 0.04, pointerEvents: 'none' }}/>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 280, height: 1, background: `linear-gradient(90deg, transparent, rgba(${GOLD},0.45), transparent)` }}/>
        <div className="final-reveal" style={{ opacity: 0 }}><VineLine style={{ display: 'block', width: 160, height: 24, margin: '0 auto 32px' }}/></div>
        <h2 className="final-reveal" style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(36px,5.5vw,84px)', fontWeight: 300, lineHeight: 1.05, color: `rgba(${CREAM},0.95)`, margin: '0 0 16px', letterSpacing: '0.02em', opacity: 0 }}>Vaše místo</h2>
        <h2 className="final-reveal" style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 'clamp(44px,6.5vw,100px)', fontWeight: 600, lineHeight: 1.0, margin: '0 0 32px', letterSpacing: '-0.01em', background: 'linear-gradient(135deg, #fffbe0 0%, #e8c050 35%, #f5d96e 58%, #c89628 85%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', opacity: 0 }}>čeká ve sklepě</h2>
        <p className="final-reveal" style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 'clamp(13px,1.1vw,16px)', fontWeight: 400, color: `rgba(${CREAM},0.55)`, lineHeight: 1.9, maxWidth: '52ch', margin: '0 auto 52px', letterSpacing: '0.025em', opacity: 0 }}>
          Přijďte ochutnat Moravu v místě, kde se tradice setkává s vášní pro víno. Rezervujte si termín ještě dnes.
        </p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="final-reveal"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '20px 48px', background: `linear-gradient(135deg, rgba(${GOLD},0.25) 0%, rgba(${GOLD},0.10) 100%)`, border: `1px solid rgba(${GOLD},0.65)`, fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 10, fontWeight: 700, letterSpacing: '0.30em', textTransform: 'uppercase', color: `rgba(${GOLD},1)`, textDecoration: 'none', transition: 'all 0.32s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 0 0 rgba(${GOLD},0)`, opacity: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${GOLD},0.40) 0%, rgba(${GOLD},0.22) 100%)`; e.currentTarget.style.boxShadow = `0 0 60px rgba(${GOLD},0.28), 0 0 120px rgba(${GOLD},0.12), inset 0 0 30px rgba(${GOLD},0.06)`; e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)'; e.currentTarget.style.letterSpacing = '0.36em'; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${GOLD},0.25) 0%, rgba(${GOLD},0.10) 100%)`; e.currentTarget.style.boxShadow = `0 0 0 rgba(${GOLD},0)`; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.letterSpacing = '0.30em'; }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="3" width="16" height="14" rx="1.5" stroke={`rgba(${GOLD},0.9)`} strokeWidth="1.2"/><path d="M1 7h16" stroke={`rgba(${GOLD},0.9)`} strokeWidth="1.2"/><path d="M5 1v4M13 1v4" stroke={`rgba(${GOLD},0.9)`} strokeWidth="1.2" strokeLinecap="round"/></svg>
          Otevřít rezervační systém
        </a>
        <div aria-hidden style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 280, height: 1, background: `linear-gradient(90deg, transparent, rgba(${GOLD},0.25), transparent)` }}/>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px clamp(32px,8vw,120px)', borderTop: `1px solid rgba(${GOLD},0.08)`, background: '#200101', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-display,"Cormorant Garamond",serif)', fontSize: 14, fontWeight: 600, color: `rgba(${GOLD},0.7)`, letterSpacing: '0.08em' }}>Vinařství Rustikal</span>
        <span style={{ fontFamily: 'var(--font-body,"Raleway",sans-serif)', fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', color: `rgba(${CREAM},0.28)` }}>Hustopečská podoblast · Morava · Česká republika</span>
      </div>

      {/* ── KEYFRAMES ─────────────────────────────────────── */}
      <style>{`
        @keyframes particleFloat {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-24px) scale(1.4); opacity: 0.0; }
        }
        @keyframes floatCard {
          from { transform: translateY(0px) rotate(-1deg); }
          to   { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: translateX(-50%) translateY(0); }
          50%     { opacity: 0.8; transform: translateX(-50%) translateY(6px); }
        }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .hero-glass { display: none !important; }
        }
      `}</style>
    </div>
  );
}