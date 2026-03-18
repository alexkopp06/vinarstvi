'use client';

import { useEffect, useRef, useState } from 'react';

const BOOKING_URL = 'https://rustikal.cz/booking/#/packages';

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once into <head>)
───────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* ── Scroll reveal ── */
.of3-fade {
  opacity: 0;
  transform: translateY(52px);
  transition:
    opacity  1s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.of3-fade.of3-in { opacity: 1; transform: none; }
.of3-d0  { transition-delay: 0s; }
.of3-d1  { transition-delay: 0.10s; }
.of3-d2  { transition-delay: 0.20s; }
.of3-d3  { transition-delay: 0.30s; }
.of3-d4  { transition-delay: 0.40s; }
.of3-d5  { transition-delay: 0.50s; }

/* ── 6-column editorial grid ── */
.of3-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 36px;
  padding: 0 6vw;
  max-width: 1640px;
  margin: 0 auto;
}
/* First 3 cards: 2 cols each */
.of3-grid > .of3-wrap:nth-child(-n+3) { grid-column: span 2; }
/* Last 2 cards: 3 cols each – wider spotlight row */
.of3-grid > .of3-wrap:nth-child(n+4) { grid-column: span 3; }

@media (max-width: 1120px) {
  .of3-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .of3-grid > .of3-wrap:nth-child(-n+3),
  .of3-grid > .of3-wrap:nth-child(n+4) {
    grid-column: span 1;
  }
}
@media (max-width: 640px) {
  .of3-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 5vw;
  }
  .of3-grid > .of3-wrap { grid-column: span 1 !important; }
}

/* ── Card shell ── */
.of3-card {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  background: #F8F1E4;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow:
    0 2px 6px  rgba(44, 4, 4, 0.06),
    0 8px 28px rgba(44, 4, 4, 0.09);
  transition:
    transform  0.75s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}
.of3-card:hover {
  transform: translateY(-16px) scale(1.015);
  box-shadow:
    0 6px 20px  rgba(44, 4, 4, 0.14),
    0 30px 70px rgba(44, 4, 4, 0.20),
    0 0 0 1.5px rgba(201, 168, 76, 0.45);
}

/* ── Photo zone ── */
.of3-photo {
  position: relative;
  height: 240px;
  overflow: hidden;
  flex-shrink: 0;
}
/* Taller photo for the wider bottom-row cards */
.of3-grid > .of3-wrap:nth-child(n+4) .of3-photo { height: 280px; }
@media (max-width: 1120px) {
  .of3-grid > .of3-wrap:nth-child(n+4) .of3-photo { height: 240px; }
}

.of3-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}
.of3-card:hover .of3-photo-img { transform: scale(1.07); }

/* Bottom-fade on photo */
.of3-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 30%,
    rgba(26, 4, 4, 0.38) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* Decorative large number on photo */
.of3-photo-num {
  position: absolute;
  bottom: 10px;
  right: 18px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 88px;
  font-weight: 300;
  line-height: 1;
  color: rgba(255, 255, 255, 0.18);
  z-index: 2;
  pointer-events: none;
  user-select: none;
  transition: color 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.of3-card:hover .of3-photo-num {
  color: rgba(201, 168, 76, 0.45);
  transform: scale(1.08) translate(-6px, -6px);
}

/* Category pill on photo */
.of3-photo-tag {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 3;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 60px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(20, 4, 4, 0.30);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #fff;
  transition: background 0.4s ease, border-color 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
}
.of3-card:hover .of3-photo-tag {
  background: rgba(20, 4, 4, 0.55);
  border-color: rgba(201, 168, 76, 0.55);
  transform: translate(2px, -2px);
}

/* Centered SVG icon on photo placeholder */
.of3-photo-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.of3-card:hover .of3-photo-icon { transform: scale(1.12) translateY(-4px); }

/* ── Gold separator line (reveals on hover) ── */
.of3-gold-reveal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #C9A84C, #E3C878 50%, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.12s;
  z-index: 4;
}
.of3-card:hover .of3-gold-reveal { transform: scaleX(1); }

/* ── Card content ── */
.of3-body {
  padding: 30px 32px 34px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.of3-body-eyebrow {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 110, 60, 0.6);
  margin-bottom: 12px;
}

.of3-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(26px, 2.4vw, 36px);
  font-weight: 400;
  color: #1E0606;
  line-height: 1.08;
  white-space: pre-line;
  margin-bottom: 16px;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.of3-card:hover .of3-card-title { transform: translateX(5px); }

.of3-card-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px;
  font-weight: 300;
  line-height: 1.68;
  color: #7A5048;
  flex: 1;
  transition: color 0.45s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.04s;
}
.of3-card:hover .of3-card-desc {
  color: #4A2818;
  transform: translateX(5px);
}

/* Details strip */
.of3-details {
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid rgba(201, 168, 76, 0.14);
  display: flex;
  flex-direction: column;
  gap: 9px;
  transition: border-color 0.4s ease;
}
.of3-card:hover .of3-details { border-color: rgba(201, 168, 76, 0.38); }

.of3-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #A07860;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), color 0.4s ease;
}
.of3-detail-row:nth-child(1) { transition-delay: 0.07s; }
.of3-detail-row:nth-child(2) { transition-delay: 0.12s; }
.of3-card:hover .of3-detail-row { transform: translateX(5px); color: #6A3820; }
.of3-detail-val {
  font-weight: 500;
  color: #C9A84C;
}

/* CTA button */
.of3-cta {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  margin-top: 24px;
  align-self: flex-start;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #C9A84C;
  text-decoration: none;
  border: 1px solid rgba(201, 168, 76, 0.38);
  border-radius: 8px;
  padding: 13px 26px;
  position: relative;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  transition: color 0.4s ease, border-color 0.4s ease, box-shadow 0.45s ease;
}
.of3-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #C9A84C, #E3C878);
  transform: translateX(-101%);
  transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 0;
}
.of3-cta:hover::before { transform: none; }
.of3-cta:hover {
  color: #2C0404;
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(201, 168, 76, 0.28);
}
.of3-cta > * { position: relative; z-index: 1; }
.of3-cta-arrow {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.of3-cta:hover .of3-cta-arrow { transform: translateX(5px); }

/* ── Section header ── */
.of3-header {
  padding: 0 6vw;
  margin-bottom: 80px;
  max-width: 1640px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
}
@media (max-width: 860px) {
  .of3-header { flex-direction: column; align-items: flex-start; margin-bottom: 56px; }
  .of3-header-right { text-align: left !important; max-width: 100% !important; }
}

.of3-eyebrow {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C9A84C;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 22px;
}
.of3-eyebrow::before {
  content: '';
  display: block;
  width: 44px;
  height: 1px;
  background: linear-gradient(90deg, #C9A84C, transparent);
}

.of3-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(56px, 7.5vw, 108px);
  font-weight: 300;
  color: #F5ECD7;
  line-height: 0.90;
  letter-spacing: -2px;
}
.of3-headline em {
  font-style: italic;
  color: #FFF8E7;
  padding-right: 8px;
}

.of3-header-right {
  max-width: 300px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(245, 236, 215, 0.42);
  text-align: right;
}

/* ── Photo upload hint (shown on hover if no image) ── */
.of3-upload-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  z-index: 5;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(10px);
  padding: 6px 18px;
  border-radius: 60px;
  border: 1px solid rgba(255,255,255,0.15);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
  pointer-events: none;
  white-space: nowrap;
}
.of3-card:hover .of3-upload-hint { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── Subtle noise overlay on section ── */
.of3-section-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  z-index: 1;
}

/* ── Floating gold orb glows ── */
@keyframes of3-orb-drift {
  0%   { transform: translate(0, 0)    scale(1); }
  50%  { transform: translate(30px, -20px) scale(1.08); }
  100% { transform: translate(0, 0)    scale(1); }
}
.of3-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  animation: of3-orb-drift 18s ease-in-out infinite;
}
`;

/* ─────────────────────────────────────────────
   CARD DATA
───────────────────────────────────────────── */
const CARDS = [
  {
    id: 'c1',
    num: '01',
    tag: 'Pobyt',
    title: 'Víkendový pobyt\ns cimbálem',
    desc: 'Dva dny v srdci vinorodého kraje. Ubytování, polopenze, živý cimbál a ochutnávka vín přímo ve sklepě.',
    details: [
      { label: 'Délka pobytu', value: 'Pátek–Neděle' },
      { label: 'Zahrnuje', value: 'Ubytování + polopenze' },
    ],
    isForm: false,
    accent: '#C9A84C',
    photoGradient: 'linear-gradient(135deg, #4A1E04 0%, #8B4A1A 40%, #C47A35 70%, #E8A850 100%)',
    photoIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <path d="M14 44 Q36 16 58 44" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
        <circle cx="36" cy="28" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/>
        <path d="M28 36 Q36 46 44 36" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"/>
        <line x1="18" y1="50" x2="54" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="14" y1="54" x2="58" y2="54" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    id: 'c2',
    num: '02',
    tag: 'Rustikal',
    title: 'Pátek v hotelu\nRustikal',
    desc: 'Jedinečný páteční večer v rustikálním stylu. Tradiční kuchyně, moravské víno a živá cimbálová muzika.',
    details: [
      { label: 'Termín', value: 'Každý pátek' },
      { label: 'Program', value: 'Večeře + cimbál' },
    ],
    isForm: false,
    accent: '#D4804A',
    photoGradient: 'linear-gradient(135deg, #3B1A08 0%, #7A3E18 40%, #B06030 70%, #D48858 100%)',
    photoIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <rect x="20" y="30" width="32" height="22" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/>
        <path d="M28 30 L28 24 Q28 19 36 18 Q44 19 44 24 L44 30" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/>
        <line x1="30" y1="41" x2="30" y2="46" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
        <line x1="36" y1="41" x2="36" y2="46" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
        <line x1="42" y1="41" x2="42" y2="46" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
        <circle cx="36" cy="38" r="2.5" fill="rgba(255,255,255,0.55)"/>
      </svg>
    ),
  },
  {
    id: 'c3',
    num: '03',
    tag: 'Pobyt',
    title: 'Ubytování\ns polopenzí',
    desc: 'Pohodlné ubytování uprostřed vinohradů. Snídaně a večeře z místních surovin, klid a výhledy na Pálavu.',
    details: [
      { label: 'Cena od', value: '1 290 Kč / noc' },
      { label: 'Pokoje', value: 'Rodinné + 2lůžkové' },
    ],
    isForm: false,
    accent: '#7AAE60',
    photoGradient: 'linear-gradient(135deg, #1A3410 0%, #365C22 40%, #5C8C3A 70%, #88BC58 100%)',
    photoIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <path d="M12 50 L36 18 L60 50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" fill="none"/>
        <rect x="26" y="36" width="20" height="16" rx="1" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" fill="none"/>
        <rect x="28" y="38" width="7" height="7" rx="0.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" fill="none"/>
        <rect x="37" y="38" width="7" height="4" rx="0.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" fill="none"/>
        <line x1="20" y1="50" x2="52" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    id: 'c4',
    num: '04',
    tag: 'Soukromé',
    title: 'Soukromé\nakce a oslavy',
    desc: 'Narozeniny, výročí, rodinné oslavy — zařídíme vše od výzdoby po výběr vín. Váš výběr, váš čas, vaše vzpomínka.',
    isForm: true,
    accent: '#C48AB0',
    photoGradient: 'linear-gradient(135deg, #3A1028 0%, #6E2E50 40%, #A85880 70%, #D494B0 100%)',
    photoIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <circle cx="25" cy="29" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/>
        <circle cx="47" cy="29" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/>
        <path d="M12 54 Q14 42 25 41" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none"/>
        <path d="M47 41 Q58 42 60 54" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none"/>
        <path d="M27 42 L45 42" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9"/>
        <circle cx="36" cy="54" r="4" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'c5',
    num: '05',
    tag: 'Business',
    title: 'Firemní\nakce a teambuildng',
    desc: 'Teambuilding ve vinici, firemní degustace nebo večírek s cimbálem. Profesionální servis a neopakovatelný zážitek pro váš tým.',
    isForm: true,
    accent: '#7AA0CC',
    photoGradient: 'linear-gradient(135deg, #0E1E34 0%, #1E3C62 40%, #345A8A 70%, #5888BE 100%)',
    photoIcon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <rect x="18" y="26" width="36" height="26" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/>
        <path d="M28 26 L28 22 Q28 19 30 19 L42 19 Q44 19 44 22 L44 26" stroke="rgba(255,255,255,0.65)" strokeWidth="1.1" fill="none"/>
        <line x1="18" y1="38" x2="54" y2="38" stroke="rgba(255,255,255,0.3)" strokeWidth="0.9"/>
        <circle cx="36" cy="38" r="3.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" fill="none"/>
        <circle cx="36" cy="38" r="1.2" fill="rgba(255,255,255,0.55)"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   HOOK – scroll-triggered fade
───────────────────────────────────────────── */
function useFade() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.classList.add('of3-in'); io.unobserve(el); }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   PHOTO COMPONENT
───────────────────────────────────────────── */
function CardPhoto({ card, src }) {
  return (
    <div className="of3-photo">
      {src ? (
        <img className="of3-photo-img" src={src} alt={card.title.replace('\n', ' ')} />
      ) : (
        <div
          className="of3-photo-img"
          style={{ background: card.photoGradient }}
          aria-hidden="true"
        />
      )}

      <div className="of3-photo-icon">{card.photoIcon}</div>

      <span
        className="of3-photo-tag"
        style={{ color: card.accent, borderColor: card.accent + '55' }}
      >
        {card.tag}
      </span>

      <span className="of3-photo-num">{card.num}</span>

      {!src && <span className="of3-upload-hint">+ Přidat fotografii</span>}

      <div className="of3-gold-reveal" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CARD COMPONENT
───────────────────────────────────────────── */
function Card({ card, index, imageSrc }) {
  const wrapRef = useFade();

  return (
    <div
      ref={wrapRef}
      className={`of3-wrap of3-fade of3-d${index + 1}`}
    >
      {/* Entire card is a booking link */}
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="of3-card"
        style={{ textDecoration: 'none' }}
      >
        <CardPhoto card={card} src={imageSrc} />

        <div className="of3-body">
          <p className="of3-body-eyebrow">{card.num} — {card.tag}</p>

          <h3 className="of3-card-title">{card.title}</h3>

          <p className="of3-card-desc">{card.desc}</p>

          {card.isForm ? (
            <div className="of3-cta">
              <span>Nezávazná poptávka</span>
              <svg
                className="of3-cta-arrow"
                width="15"
                height="15"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2 7H12M7 2L12 7L7 12"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="of3-details">
              {card.details.map((d) => (
                <div className="of3-detail-row" key={d.label}>
                  <span>{d.label}</span>
                  <span className="of3-detail-val">{d.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function OffersSection({
  images = {},
}) {
  const headerRef = useFade();
  const gridRef   = useFade();

  useEffect(() => {
    if (!document.getElementById('of3-styles')) {
      const s = document.createElement('style');
      s.id = 'of3-styles';
      s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <section
    id="nabidka"
    
      style={{
        position: 'relative',
        background: '#4A0404',
        minHeight: '100vh',
        paddingTop: 'clamp(80px, 10vh, 140px)',
        paddingBottom: 'clamp(80px, 10vh, 140px)',
        color: '#F5ECD7',
        overflow: 'hidden',
      }}
    >
      <div
        className="of3-orb"
        style={{
          width: 700, height: 700,
          top: '-200px', left: '-180px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)',
          animationDuration: '22s',
        }}
      />
      <div
        className="of3-orb"
        style={{
          width: 600, height: 600,
          bottom: '-100px', right: '-150px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
          animationDuration: '28s',
          animationDelay: '-9s',
        }}
      />
      <div
        className="of3-orb"
        style={{
          width: 400, height: 400,
          top: '40%', left: '50%',
          background: 'radial-gradient(circle, rgba(74, 4, 4, 0.6) 0%, transparent 70%)',
          animationDuration: '16s',
          animationDelay: '-4s',
        }}
      />

      <div className="of3-section-noise" />

      <div
        ref={headerRef}
        className="of3-header of3-fade of3-d0"
        style={{ marginBottom: 'clamp(48px, 6vh, 84px)' }}
      >
        <div className="of3-header-left">
          <p className="of3-eyebrow">Naše nabídka</p>
          <h2 className="of3-headline">
            Vyberte<br />
            <em>svůj</em> zážitek
          </h2>
        </div>

        <p className="of3-header-right">
          Každý pobyt je jiný příběh. Vyberte zážitek, který vám nejlépe sedí —
          nebo nás kontaktujte a sestavíme program na míru.
        </p>
      </div>

      <div
        style={{
          width: 56,
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin: '0 auto clamp(48px, 6vh, 80px)',
          position: 'relative',
          zIndex: 2,
        }}
      />

      <div
        ref={gridRef}
        className="of3-grid of3-fade of3-d0"
        style={{ position: 'relative', zIndex: 2 }}
      >
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            imageSrc={images[card.id] || null}
          />
        ))}
      </div>
    </section>
  );
}