'use client';

/**
 * OrderForm.jsx — Sklep u Dvořáků
 *
 * Luxury split-panel wine order form.
 *
 * LEFT PANEL — Form:
 *   • Wine selector cards — each wine is a horizontal editorial
 *     card. Qty stepper (+/−) with animated digit roll.
 *     Card border illuminates gold when qty > 0.
 *     Bottle SVG as icon with warm underglow on active.
 *
 *   • Customer detail inputs — underline-only, no border-box.
 *     Floating label: absolute positioned, scales to 75% and
 *     translates up on focus or when filled.
 *     Gold underline scaleX(0→1) on focus.
 *
 *   • Textarea for special requests — same floating treatment.
 *
 *   • Event selector — radio-style row picks for tasting events.
 *
 *   • Submit: full-width luxury fill-wipe button.
 *
 * RIGHT PANEL — Live order summary (sticky):
 *   • Each selected wine animates in as a line item.
 *   • Subtotal, 15% delivery, total with rule-draw.
 *   • Empty state: elegant "your selection is empty" illustration.
 *   • Total counter: GSAP number tween on each change.
 */

import {
  useState, useRef, useEffect, useCallback, useMemo, useId,
} from 'react';
import gsap from 'gsap';
import { Minus, Plus, ShoppingBag, ChevronRight, Check } from 'lucide-react';

/* ── Wine catalogue (mirrors WineShowcase data) ─────────────── */
const WINE_CATALOGUE = [
  { id: 'w1', name: 'Welschriesling',    vintage: '2022', style: 'Bílé · Suché',     price: 195, bottleColor: '#C9A84C' },
  { id: 'w2', name: 'Müller-Thurgau',    vintage: '2023', style: 'Bílé · Polosuché', price: 185, bottleColor: '#8ab87a' },
  { id: 'w3', name: 'Cabernet Moravia',  vintage: '2021', style: 'Červené · Suché',  price: 265, bottleColor: '#4A0E1A' },
  { id: 'w4', name: 'Ryzlink Vlašský',   vintage: '2022', style: 'Bílé · Suché',     price: 175, bottleColor: '#d4b24a' },
  { id: 'w5', name: 'Svatovavřinecké',   vintage: '2020', style: 'Červené · Suché',  price: 285, bottleColor: '#2d080e' },
];

const DELIVERY = 0.15;

/* ── Tiny bottle icon ───────────────────────────────────────── */
function BottleIcon({ color, active }) {
  return (
    <svg viewBox="0 0 28 80" style={{ height: '52px', width: 'auto' }} aria-hidden="true">
      <defs>
        <linearGradient id={`bf-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.6" />
          <stop offset="50%"  stopColor={color} stopOpacity="1"   />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Capsule */}
      <rect x="9" y="4" width="10" height="7" rx="1" fill={color} opacity={active ? 1 : 0.5} />
      {/* Neck */}
      <path d="M10 11 L9 18 L19 18 L18 11Z" fill={`url(#bf-${color})`} opacity={active ? 1 : 0.5} />
      {/* Shoulder */}
      <path d="M9 18 Q4 22 4 26 L24 26 Q24 22 19 18Z" fill={`url(#bf-${color})`} opacity={active ? 1 : 0.5} />
      {/* Body */}
      <rect x="4" y="26" width="20" height="48" rx="1" fill={`url(#bf-${color})`} opacity={active ? 1 : 0.5} />
      {/* Sheen */}
      <rect x="6" y="18" width="4" height="56" rx="1" fill="white" opacity={active ? 0.08 : 0.03} />
      {/* Label */}
      <rect x="6" y="34" width="16" height="22" rx="0.5" fill="white" opacity={active ? 0.15 : 0.07} />
    </svg>
  );
}

/* ── Quantity stepper ───────────────────────────────────────── */
function Stepper({ value, onChange, max = 24 }) {
  const numRef = useRef(null);
  const prevVal = useRef(value);

  useEffect(() => {
    if (!numRef.current || value === prevVal.current) return;
    const dir = value > prevVal.current ? -1 : 1;
    gsap.fromTo(numRef.current,
      { y: dir * 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out', overwrite: 'auto' }
    );
    prevVal.current = value;
  }, [value]);

  return (
    <div className="flex items-center gap-0">
      <button
        type="button"
        onClick={() => value > 0 && onChange(value - 1)}
        disabled={value === 0}
        className="flex items-center justify-center transition-colors duration-200"
        style={{
          width: '32px', height: '32px',
          border: '1px solid rgba(201,168,76,0.2)',
          color: value === 0 ? 'rgba(201,168,76,0.2)' : 'var(--color-gold)',
          background: 'transparent',
          cursor: value === 0 ? 'default' : 'pointer',
        }}
        aria-label="Snížit počet"
      >
        <Minus size={12} />
      </button>

      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: '40px', height: '32px',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          background: value > 0 ? 'rgba(201,168,76,0.06)' : 'transparent',
          transition: 'background 0.3s ease',
        }}
      >
        <span
          ref={numRef}
          className="font-display text-sm"
          style={{
            color: value > 0 ? 'var(--color-gold)' : 'var(--color-cream-muted)',
            lineHeight: 1,
            willChange: 'transform',
          }}
        >
          {value}
        </span>
      </div>

      <button
        type="button"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        className="flex items-center justify-center transition-colors duration-200"
        style={{
          width: '32px', height: '32px',
          border: '1px solid rgba(201,168,76,0.2)',
          color: value >= max ? 'rgba(201,168,76,0.2)' : 'var(--color-gold)',
          background: 'transparent',
          cursor: value >= max ? 'default' : 'pointer',
        }}
        aria-label="Zvýšit počet"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

/* ── Wine selector card ─────────────────────────────────────── */
function WineCard({ wine, qty, onChange }) {
  const cardRef  = useRef(null);
  const glowRef  = useRef(null);
  const prevQty  = useRef(qty);
  const active   = qty > 0;

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      borderColor: active ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.1)',
      background: active
        ? 'rgba(201,168,76,0.04)'
        : 'rgba(26,22,18,0.5)',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: active ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    prevQty.current = qty;
  }, [active, qty]);

  return (
    <div
      ref={cardRef}
      className="relative flex items-center gap-4 p-4 transition-none"
      style={{
        border: '1px solid rgba(201,168,76,0.1)',
        background: 'rgba(26,22,18,0.5)',
        willChange: 'background, border-color',
      }}
    >
      {/* Active indicator bar — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-transform duration-400"
        style={{
          background: 'var(--color-gold)',
          transform: active ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'center',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Bottle icon */}
      <div className="relative flex-shrink-0 pl-2">
        <div
          ref={glowRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{
            width: '30px', height: '8px',
            background: wine.bottleColor,
            filter: 'blur(8px)',
            opacity: 0,
            willChange: 'opacity',
          }}
        />
        <BottleIcon color={wine.bottleColor} active={active} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-display leading-tight"
          style={{
            fontSize: 'clamp(14px, 1.4vw, 18px)',
            color: active ? 'var(--color-cream)' : 'var(--color-cream-muted)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            transition: 'color 0.3s ease',
          }}
        >
          {wine.name}
        </h4>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span
            className="font-body text-[10px] tracking-wider uppercase"
            style={{ color: 'var(--color-gold-muted)', letterSpacing: '0.18em' }}
          >
            {wine.vintage}
          </span>
          <span style={{ color: 'var(--color-cream-faint)', fontSize: '5px' }}>◆</span>
          <span
            className="font-body text-[10px]"
            style={{ color: 'var(--color-cream-faint)' }}
          >
            {wine.style}
          </span>
        </div>
      </div>

      {/* Price per bottle */}
      <div className="flex-shrink-0 text-right mr-2 hidden sm:block">
        <span
          className="font-display text-sm"
          style={{
            color: active ? 'var(--color-gold)' : 'var(--color-cream-faint)',
            fontWeight: 400,
            transition: 'color 0.3s ease',
          }}
        >
          {wine.price} Kč
        </span>
        <div
          className="font-body text-[9px] mt-0.5 text-right"
          style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.1em' }}
        >
          / lahev
        </div>
      </div>

      {/* Stepper */}
      <div className="flex-shrink-0">
        <Stepper value={qty} onChange={onChange} />
      </div>
    </div>
  );
}

/* ── Floating label input ───────────────────────────────────── */
function FloatInput({ id, label, type = 'text', value, onChange, required, autoComplete, span }) {
  const lineRef  = useRef(null);
  const labelRef = useRef(null);
  const isFilled = value.length > 0;

  const onFocus = useCallback(() => {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(labelRef.current, {
      y: -22, scale: 0.75, color: 'var(--color-gold)',
      duration: 0.3, ease: 'power3.out', overwrite: 'auto',
      transformOrigin: 'left center',
    });
  }, []);

  const onBlur = useCallback(() => {
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    if (!isFilled) {
      gsap.to(labelRef.current, {
        y: 0, scale: 1, color: 'var(--color-cream-faint)',
        duration: 0.3, ease: 'power3.out', overwrite: 'auto',
      });
    }
  }, [isFilled]);

  /* Keep label up when field has content */
  useEffect(() => {
    if (!labelRef.current) return;
    if (isFilled) {
      gsap.set(labelRef.current, { y: -22, scale: 0.75, color: 'var(--color-cream-muted)' });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative ${span === 2 ? 'col-span-1 sm:col-span-2' : 'col-span-1'}`}>
      <label
        ref={labelRef}
        htmlFor={id}
        className="absolute left-0 top-3 pointer-events-none font-body text-sm"
        style={{
          color: 'var(--color-cream-faint)',
          letterSpacing: '0.04em',
          transformOrigin: 'left center',
          willChange: 'transform, color',
          ...(isFilled && { transform: 'translateY(-22px) scale(0.75)', color: 'var(--color-cream-muted)' }),
        }}
      >
        {label}{required && <span style={{ color: 'var(--color-gold-muted)' }}> *</span>}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-transparent font-body text-sm pt-3 pb-2 outline-none"
        style={{
          color: 'var(--color-cream)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          letterSpacing: '0.03em',
          caretColor: 'var(--color-gold)',
        }}
        data-cursor="text"
      />

      {/* Focus underline */}
      <div
        ref={lineRef}
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'var(--color-gold)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/* ── Floating label textarea ────────────────────────────────── */
function FloatTextarea({ id, label, value, onChange }) {
  const lineRef  = useRef(null);
  const labelRef = useRef(null);
  const isFilled = value.length > 0;

  const onFocus = useCallback(() => {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(labelRef.current, { y: -22, scale: 0.75, color: 'var(--color-gold)', duration: 0.3, ease: 'power3.out', overwrite: 'auto', transformOrigin: 'left center' });
  }, []);
  const onBlur = useCallback(() => {
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    if (!isFilled) gsap.to(labelRef.current, { y: 0, scale: 1, color: 'var(--color-cream-faint)', duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
  }, [isFilled]);

  useEffect(() => {
    if (isFilled && labelRef.current) gsap.set(labelRef.current, { y: -22, scale: 0.75, color: 'var(--color-cream-muted)' });
  }, []); // eslint-disable-line

  return (
    <div className="relative col-span-1 sm:col-span-2 mt-4">
      <label ref={labelRef} htmlFor={id}
        className="absolute left-0 top-3 pointer-events-none font-body text-sm"
        style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.04em', transformOrigin: 'left center', willChange: 'transform, color',
          ...(isFilled && { transform: 'translateY(-22px) scale(0.75)', color: 'var(--color-cream-muted)' }) }}>
        {label}
      </label>
      <textarea id={id} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} rows={3}
        className="w-full bg-transparent font-body text-sm pt-3 pb-2 outline-none resize-none"
        style={{ color: 'var(--color-cream)', borderBottom: '1px solid rgba(201,168,76,0.18)', letterSpacing: '0.03em', caretColor: 'var(--color-gold)' }}
        data-cursor="text"
      />
      <div ref={lineRef} className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'var(--color-gold)', transformOrigin: 'left center', transform: 'scaleX(0)', willChange: 'transform' }} />
    </div>
  );
}

/* ── Order summary line item ─────────────────────────────────── */
function SummaryItem({ wine, qty, onRemove }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, x: 20, height: 0 },
      { opacity: 1, x: 0, height: 'auto', duration: 0.4, ease: 'power3.out' }
    );
  }, []);
  return (
    <div ref={ref} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: wine.bottleColor }} />
        <div>
          <div className="font-display text-xs" style={{ color: 'var(--color-cream)', fontWeight: 400, letterSpacing: '0.03em' }}>
            {wine.name}
          </div>
          <div className="font-body text-[10px] mt-0.5" style={{ color: 'var(--color-cream-faint)' }}>
            {qty} × {wine.price} Kč
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-sm" style={{ color: 'var(--color-gold)', fontWeight: 400 }}>
          {(qty * wine.price).toLocaleString('cs-CZ')} Kč
        </span>
        <button type="button" onClick={onRemove}
          className="opacity-30 hover:opacity-70 transition-opacity duration-200"
          style={{ color: 'var(--color-cream)', fontSize: '14px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label={`Odstranit ${wine.name}`}
        >×</button>
      </div>
    </div>
  );
}

/* ── Animated total number ──────────────────────────────────── */
function AnimatedTotal({ value }) {
  const ref = useRef(null);
  const prevRef = useRef(value);
  useEffect(() => {
    if (!ref.current || value === prevRef.current) return;
    const obj = { val: prevRef.current };
    gsap.to(obj, {
      val: value, duration: 0.6, ease: 'power3.out',
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val).toLocaleString('cs-CZ') + ' Kč'; },
    });
    prevRef.current = value;
  }, [value]);
  return (
    <span ref={ref} className="font-display" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', color: 'var(--color-gold)', fontWeight: 400 }}>
      {value.toLocaleString('cs-CZ')} Kč
    </span>
  );
}

/* ── Main OrderForm ─────────────────────────────────────────── */
export default function OrderForm() {
  const formRef    = useRef(null);
  const summaryRef = useRef(null);
  const submitRef  = useRef(null);

  /* Wine quantities */
  const [quantities, setQuantities] = useState(
    Object.fromEntries(WINE_CATALOGUE.map(w => [w.id, 0]))
  );

  /* Customer fields */
  const [fields, setFields] = useState({ name: '', email: '', phone: '', address: '', note: '' });

  /* Submission state */
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setQty  = useCallback((id, qty) => setQuantities(q => ({ ...q, [id]: qty })), []);
  const setField = useCallback((key) => (e) => setFields(f => ({ ...f, [key]: e.target.value })), []);

  /* Derived order data */
  const orderLines = useMemo(() =>
    WINE_CATALOGUE.filter(w => quantities[w.id] > 0).map(w => ({ wine: w, qty: quantities[w.id] })),
    [quantities]
  );
  const subtotal   = useMemo(() => orderLines.reduce((s, l) => s + l.wine.price * l.qty, 0), [orderLines]);
  const delivery   = orderLines.length > 0 ? Math.round(subtotal * DELIVERY) : 0;
  const total      = subtotal + delivery;
  const isEmpty    = orderLines.length === 0;

  /* Submit handler */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isEmpty) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400)); // simulate API
    setSubmitting(false);
    setSubmitted(true);
  }, [isEmpty]);

  /* Section entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-form-col]',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.18, duration: 1.0, ease: 'power3.out', delay: 0.3 }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  if (submitted) return <SuccessScreen />;

  return (
    <div ref={formRef} className="relative min-h-screen" style={{ background: 'var(--color-charcoal)' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          paddingTop: 'clamp(110px, 14vw, 180px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          paddingLeft: 'clamp(24px, 8vw, 120px)',
          paddingRight: 'clamp(24px, 6vw, 80px)',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
        }}
      >
        {/* Ghost label */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="font-display font-bold absolute -right-4 top-4" style={{ fontSize: 'clamp(100px, 18vw, 260px)', color: 'transparent', WebkitTextStroke: '1px rgba(201,168,76,0.04)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            OBJEDNÁVKA
          </span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-6" style={{ background: 'var(--color-gold)' }} />
            <span className="font-body text-[10px] tracking-widest3 uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.28em' }}>
              Přímý nákup
            </span>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(32px, 5.5vw, 80px)', color: 'var(--color-cream)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '0.02em' }}>
            Objednejte naše vína<br />
            <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>přímo od nás.</span>
          </h1>
        </div>
      </div>

      {/* ── Split layout ─────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row"
        style={{ paddingLeft: 'clamp(24px, 8vw, 120px)', paddingRight: 'clamp(24px, 6vw, 80px)' }}
        noValidate
      >

        {/* ════ LEFT — Form ════════════════════════════════════ */}
        <div
          data-form-col=""
          className="flex-1 py-12 lg:pr-16"
          style={{ opacity: 0 }}
        >

          {/* — Wine selection — */}
          <fieldset className="border-0 p-0 mb-14">
            <legend className="font-body text-[10px] tracking-widest3 uppercase mb-6 flex items-center gap-3"
              style={{ color: 'var(--color-gold)', letterSpacing: '0.28em' }}>
              <span className="font-display text-xs opacity-40" style={{ color: 'var(--color-cream)' }}>01</span>
              Výběr vín
            </legend>
            <div className="flex flex-col gap-3">
              {WINE_CATALOGUE.map(wine => (
                <WineCard
                  key={wine.id}
                  wine={wine}
                  qty={quantities[wine.id]}
                  onChange={(q) => setQty(wine.id, q)}
                />
              ))}
            </div>
            {isEmpty && (
              <p className="font-body text-xs mt-4" style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.06em', fontStyle: 'italic' }}>
                * Vyberte alespoň jedno víno pro dokončení objednávky.
              </p>
            )}
          </fieldset>

          {/* — Customer details — */}
          <fieldset className="border-0 p-0 mb-14">
            <legend className="font-body text-[10px] tracking-widest3 uppercase mb-8 flex items-center gap-3"
              style={{ color: 'var(--color-gold)', letterSpacing: '0.28em' }}>
              <span className="font-display text-xs opacity-40" style={{ color: 'var(--color-cream)' }}>02</span>
              Vaše kontaktní údaje
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              <FloatInput id="name"    label="Celé jméno"       value={fields.name}    onChange={setField('name')}    required autoComplete="name" />
              <FloatInput id="email"   label="E-mailová adresa" value={fields.email}   onChange={setField('email')}   required type="email" autoComplete="email" />
              <FloatInput id="phone"   label="Telefon"          value={fields.phone}   onChange={setField('phone')}   type="tel"    autoComplete="tel" />
              <FloatInput id="address" label="Doručovací adresa"value={fields.address} onChange={setField('address')} span={2}      autoComplete="street-address" />
              <FloatTextarea id="note" label="Speciální přání nebo poznámka" value={fields.note} onChange={setField('note')} />
            </div>
          </fieldset>

          {/* — Terms — */}
          <div className="flex items-start gap-3 mb-10">
            <div
              className="flex-shrink-0 flex items-center justify-center w-5 h-5 border mt-0.5 cursor-pointer"
              style={{ borderColor: 'rgba(201,168,76,0.35)', background: 'transparent' }}
            >
              <Check size={10} style={{ color: 'var(--color-gold)', opacity: 0.8 }} />
            </div>
            <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.03em' }}>
              Souhlasím se <a href="#" className="underline" style={{ color: 'var(--color-gold-muted)' }}>zpracováním osobních údajů</a> a <a href="#" className="underline" style={{ color: 'var(--color-gold-muted)' }}>obchodními podmínkami</a> Sklep u Dvořáků.
            </p>
          </div>

          {/* — Submit button — */}
          <button
            ref={submitRef}
            type="submit"
            disabled={isEmpty || submitting}
            className="relative overflow-hidden w-full sm:w-auto flex items-center gap-4 px-10 py-4"
            style={{
              border: '1px solid rgba(201,168,76,0.45)',
              color: isEmpty ? 'rgba(201,168,76,0.3)' : 'var(--color-gold)',
              background: 'transparent',
              cursor: isEmpty ? 'default' : 'pointer',
              transition: 'border-color 0.3s ease, color 0.3s ease',
              minWidth: '240px',
            }}
            onMouseEnter={(e) => {
              if (isEmpty) return;
              gsap.to(e.currentTarget.querySelector('.sb-fill'), { scaleX: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
              gsap.to(e.currentTarget.querySelector('.sb-text'), { color: 'var(--color-charcoal)', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
              gsap.to(e.currentTarget.querySelector('.sb-icon'), { x: 5, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            }}
            onMouseLeave={(e) => {
              if (isEmpty) return;
              gsap.to(e.currentTarget.querySelector('.sb-fill'), { scaleX: 0, duration: 0.45, ease: 'power3.inOut', overwrite: 'auto' });
              gsap.to(e.currentTarget.querySelector('.sb-text'), { color: 'var(--color-gold)', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
              gsap.to(e.currentTarget.querySelector('.sb-icon'), { x: 0, duration: 0.5, ease: 'elastic.out(1,0.4)', overwrite: 'auto' });
            }}
          >
            <span className="sb-fill absolute inset-0 origin-left" style={{ background: 'var(--color-gold)', transform: 'scaleX(0)', willChange: 'transform' }} />
            <span className="sb-text relative z-10 font-body text-xs tracking-widest uppercase transition-none" style={{ letterSpacing: '0.22em', willChange: 'color' }}>
              {submitting ? 'Odesílám…' : 'Odeslat objednávku'}
            </span>
            <span className="sb-icon relative z-10 inline-block" style={{ willChange: 'transform' }}>
              <ChevronRight size={14} />
            </span>
          </button>
        </div>

        {/* ════ RIGHT — Sticky summary ═════════════════════════ */}
        <div
          data-form-col=""
          ref={summaryRef}
          className="w-full lg:w-80 xl:w-96 py-12 lg:pl-12"
          style={{
            opacity: 0,
            borderLeft: '1px solid rgba(201,168,76,0.08)',
          }}
        >
          <div className="lg:sticky lg:top-28">
            {/* Summary header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ShoppingBag size={14} style={{ color: 'var(--color-gold)' }} />
                <span className="font-body text-[10px] tracking-widest3 uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.26em' }}>
                  Souhrn objednávky
                </span>
              </div>
              {!isEmpty && (
                <span className="font-display text-xs" style={{ color: 'var(--color-cream-faint)' }}>
                  {orderLines.reduce((s, l) => s + l.qty, 0)} lah.
                </span>
              )}
            </div>

            {/* Gold rule */}
            <div className="mb-6 h-px" style={{ background: 'linear-gradient(90deg, var(--color-gold) 0%, transparent 100%)', opacity: 0.3 }} />

            {/* Empty state */}
            {isEmpty ? (
              <div className="flex flex-col items-start gap-4 py-8">
                <div className="font-display text-4xl" style={{ color: 'rgba(201,168,76,0.1)', letterSpacing: '-0.02em' }}>
                  0
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.03em', maxWidth: '24ch' }}>
                  Váš košík je prázdný.<br />Vyberte vína vlevo.
                </p>
              </div>
            ) : (
              <>
                {/* Line items */}
                <div className="mb-6">
                  {orderLines.map(({ wine, qty }) => (
                    <SummaryItem
                      key={wine.id}
                      wine={wine}
                      qty={qty}
                      onRemove={() => setQty(wine.id, 0)}
                    />
                  ))}
                </div>

                {/* Subtotal & delivery */}
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: 'Mezisoučet', val: subtotal },
                    { label: 'Doprava (15 %)', val: delivery },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between">
                      <span className="font-body text-xs" style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.04em' }}>{label}</span>
                      <span className="font-body text-xs" style={{ color: 'var(--color-cream-muted)' }}>{val.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                  ))}
                </div>

                {/* Total rule */}
                <div className="h-px mb-4" style={{ background: 'rgba(201,168,76,0.2)' }} />

                {/* Total */}
                <div className="flex items-end justify-between">
                  <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-cream-muted)', letterSpacing: '0.2em' }}>
                    Celkem
                  </span>
                  <AnimatedTotal value={total} />
                </div>

                {/* Delivery note */}
                <p className="font-body text-[10px] mt-4 leading-relaxed" style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.04em' }}>
                  Doručení do 5–7 pracovních dnů.<br />
                  Osobní odběr ve sklepě zdarma.
                </p>
              </>
            )}

            {/* Seasonal suggestion */}
            <div
              className="mt-10 p-5"
              style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}
            >
              <p className="font-body text-[10px] tracking-wider uppercase mb-2" style={{ color: 'var(--color-gold-muted)', letterSpacing: '0.2em' }}>
                Tip sklepmistra
              </p>
              <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--color-cream-muted)', letterSpacing: '0.03em' }}>
                Skvělá kombinace: Welschriesling + Cabernet Moravia — světlé i tmavé pro každou příležitost.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ── Success screen ─────────────────────────────────────────── */
function SuccessScreen() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-success-item]',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center px-8" style={{ background: 'var(--color-charcoal)' }}>
      <div className="flex flex-col items-start max-w-lg gap-6">
        <div data-success-item="" className="flex items-center justify-center w-14 h-14 rounded-full" style={{ border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.06)' }}>
          <Check size={22} style={{ color: 'var(--color-gold)' }} />
        </div>
        <div data-success-item="" className="h-px w-12" style={{ background: 'var(--color-gold)' }} />
        <h2 data-success-item="" className="font-display" style={{ fontSize: 'clamp(28px, 5vw, 60px)', color: 'var(--color-cream)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '0.02em' }}>
          Objednávka<br />přijata.
        </h2>
        <p data-success-item="" className="font-body font-light leading-relaxed" style={{ color: 'var(--color-cream-muted)', fontSize: 'clamp(14px, 1.2vw, 17px)', letterSpacing: '0.03em' }}>
          Děkujeme za váš zájem. Potvrzení vám zašleme e-mailem do několika minut. Těšíme se na spolupráci.
        </p>
        <a data-success-item="" href="/"
          className="flex items-center gap-3 font-body text-xs tracking-widest uppercase"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.22em', marginTop: '8px' }}
          onMouseEnter={e => gsap.to(e.currentTarget.querySelector('span'), { x: 5, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })}
          onMouseLeave={e => gsap.to(e.currentTarget.querySelector('span'), { x: 0, duration: 0.5, ease: 'elastic.out(1,0.4)', overwrite: 'auto' })}
        >
          <span className="inline-block" style={{ willChange: 'transform' }}>←</span>
          Zpět na hlavní stránku
        </a>
      </div>
    </div>
  );
}