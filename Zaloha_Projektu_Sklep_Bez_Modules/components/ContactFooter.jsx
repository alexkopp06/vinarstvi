'use client';

/**
 * ContactFooter.jsx — Sklep u Dvořáků
 *
 * Final section + full footer in one component.
 * Upper: contact split — address/info left, quick contact form right.
 * Lower: footer bar — logo, nav links, copyright, and a large
 *         ghost brand statement that scrolls faintly behind.
 */

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { useLenis } from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  { Icon: MapPin, label: 'Adresa',      val: 'Zámecká 14, 693 01 Hustopeče' },
  { Icon: Phone,  label: 'Telefon',     val: '+420 777 123 456' },
  { Icon: Mail,   label: 'E-mail',      val: 'info@sklepudvoraku.cz' },
  { Icon: Clock,  label: 'Otevírací doba', val: 'Út–So: 10:00–18:00' },
];

const FOOTER_LINKS = [
  { label: 'Vína',      href: '#vina' },
  { label: 'Sklep',     href: '#sklep' },
  { label: 'Degustace', href: '#degustace' },
  { label: 'Objednat',  href: '/order' },
  { label: 'Kontakt',   href: '#kontakt' },
];

export default function ContactFooter() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headingRef  = useRef(null);
  const infoRef     = useRef(null);
  const formAreaRef = useRef(null);
  const ruleRef     = useRef(null);

  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg]     = useState('');
  const [sent, setSent]   = useState(false);
  const lenis = useLenis();

  /* Floating label helper */
  const mkFloat = (id, labelId) => ({
    onFocus: () => {
      const lbl = document.getElementById(labelId);
      if (lbl) gsap.to(lbl, { y: -20, scale: 0.75, color: 'var(--color-gold)', duration: 0.3, ease: 'power3.out', overwrite: 'auto', transformOrigin: 'left center' });
      const line = document.getElementById(`${id}-line`);
      if (line) gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    },
    onBlur: (val) => {
      const lbl = document.getElementById(labelId);
      const line = document.getElementById(`${id}-line`);
      if (!val && lbl) gsap.to(lbl, { y: 0, scale: 1, color: 'rgba(245,236,215,0.2)', duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      if (line) gsap.to(line, { scaleX: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    },
  });

  useEffect(() => {
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop: () => lenis.scroll,
        getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }),
      });
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(eyebrowRef.current, { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } });

      const hLines = headingRef.current?.querySelectorAll('.cf-line') ?? [];
      hLines.forEach((line, i) => {
        gsap.fromTo(line, { yPercent: 110 },
          { yPercent: 0, duration: 1.0, ease: 'power4.out', delay: i * 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
      });

      gsap.fromTo(infoRef.current?.children ?? [],
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: infoRef.current, start: 'top 80%' } });

      gsap.fromTo(formAreaRef.current, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: formAreaRef.current, start: 'top 82%' } });

      gsap.fromTo(ruleRef.current, { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: ruleRef.current, start: 'top 85%' } });
    }, sectionRef);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [lenis]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSent(true);
  };

  return (
    <footer ref={sectionRef} id="kontakt" style={{ background: 'var(--color-charcoal-mid)' }}>

      {/* ── Contact split ──────────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{
          paddingTop:    'clamp(80px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 8vw, 120px)',
          paddingLeft:   'clamp(24px, 8vw, 120px)',
          paddingRight:  'clamp(24px, 6vw, 80px)',
          gap: 'clamp(48px, 8vw, 100px)',
        }}
      >
        {/* Left — info */}
        <div>
          <div ref={eyebrowRef} className="flex items-center gap-3 mb-6" style={{ opacity: 0 }}>
            <div className="h-px w-6" style={{ background: 'var(--color-gold)' }} />
            <span className="font-body text-[10px] tracking-widest3 uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.28em' }}>
              Kontakt
            </span>
          </div>

          <div ref={headingRef} className="mb-10" style={{ lineHeight: 0.9 }}>
            {['Přijďte nás', 'navštívit.'].map(line => (
              <div key={line} className="overflow-hidden">
                <div className="cf-line font-display" style={{ fontSize: 'clamp(34px, 5.5vw, 80px)', color: 'var(--color-cream)', fontWeight: 400, letterSpacing: '0.01em', paddingBottom: '0.1em', willChange: 'transform' }}>
                  {line}
                </div>
              </div>
            ))}
          </div>

          <div ref={infoRef} className="flex flex-col gap-5">
            {CONTACT_INFO.map(({ Icon, label, val }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon size={14} style={{ color: 'var(--color-gold-muted)' }} />
                </div>
                <div>
                  <div className="font-body text-[9px] tracking-widest uppercase mb-0.5" style={{ color: 'var(--color-gold-muted)', letterSpacing: '0.22em' }}>
                    {label}
                  </div>
                  <div className="font-body text-sm" style={{ color: 'var(--color-cream-muted)', letterSpacing: '0.03em' }}>
                    {val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-4 mt-10">
            {[{ Icon: Instagram, label: 'Instagram' }, { Icon: Facebook, label: 'Facebook' }].map(({ Icon, label }) => (
              <a key={label} href="#"
                className="flex items-center justify-center w-9 h-9"
                style={{ border: '1px solid rgba(201,168,76,0.2)', color: 'var(--color-gold-muted)' }}
                aria-label={label}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(201,168,76,0.6)', color: 'var(--color-gold)', duration: 0.3, overwrite: 'auto' })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(201,168,76,0.2)', color: 'var(--color-gold-muted)', duration: 0.4, overwrite: 'auto' })}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Right — quick contact form */}
        <div ref={formAreaRef} style={{ opacity: 0 }}>
          {sent ? (
            <div className="flex flex-col gap-5 pt-4">
              <div className="h-px w-8" style={{ background: 'var(--color-gold)' }} />
              <p className="font-display" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', color: 'var(--color-cream)', fontWeight: 400, lineHeight: 1.2 }}>
                Zpráva odeslána.<br />
                <span style={{ color: 'var(--color-gold-muted)', fontSize: '0.7em', fontStyle: 'italic' }}>Ozveme se do 24 hodin.</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-8" noValidate>
              <p className="font-body font-light text-sm leading-relaxed" style={{ color: 'var(--color-cream-muted)', letterSpacing: '0.03em', maxWidth: '38ch' }}>
                Rádi zodpovíme vaše dotazy nebo domluvíme osobní návštěvu.
              </p>

              {/* Name */}
              {[
                { id: 'cf-name',  label: 'Vaše jméno', type: 'text',  val: name,  set: setName  },
                { id: 'cf-email', label: 'E-mail',      type: 'email', val: email, set: setEmail },
              ].map(({ id, label, type, val, set }) => {
                const handlers = mkFloat(id, `lbl-${id}`);
                return (
                  <div key={id} className="relative">
                    <label id={`lbl-${id}`} htmlFor={id}
                      className="absolute left-0 top-2.5 pointer-events-none font-body text-sm"
                      style={{ color: 'rgba(245,236,215,0.2)', letterSpacing: '0.04em', transformOrigin: 'left center', willChange: 'transform, color',
                        ...(val && { transform: 'translateY(-20px) scale(0.75)', color: 'var(--color-cream-faint)' }) }}>
                      {label}
                    </label>
                    <input id={id} type={type} value={val} required
                      onChange={e => set(e.target.value)}
                      onFocus={handlers.onFocus}
                      onBlur={() => handlers.onBlur(val)}
                      className="w-full bg-transparent font-body text-sm pt-2.5 pb-2 outline-none"
                      style={{ color: 'var(--color-cream)', borderBottom: '1px solid rgba(201,168,76,0.15)', caretColor: 'var(--color-gold)' }}
                      data-cursor="text"
                    />
                    <div id={`${id}-line`} className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'var(--color-gold)', transformOrigin: 'left center', transform: 'scaleX(0)', willChange: 'transform' }} />
                  </div>
                );
              })}

              {/* Message */}
              <div className="relative">
                {(() => { const handlers = mkFloat('cf-msg', 'lbl-cf-msg'); return (
                  <>
                    <label id="lbl-cf-msg" htmlFor="cf-msg"
                      className="absolute left-0 top-2.5 pointer-events-none font-body text-sm"
                      style={{ color: 'rgba(245,236,215,0.2)', letterSpacing: '0.04em', transformOrigin: 'left center', willChange: 'transform, color',
                        ...(msg && { transform: 'translateY(-20px) scale(0.75)', color: 'var(--color-cream-faint)' }) }}>
                      Vaše zpráva
                    </label>
                    <textarea id="cf-msg" value={msg} rows={3} required
                      onChange={e => setMsg(e.target.value)}
                      onFocus={handlers.onFocus}
                      onBlur={() => handlers.onBlur(msg)}
                      className="w-full bg-transparent font-body text-sm pt-2.5 pb-2 outline-none resize-none"
                      style={{ color: 'var(--color-cream)', borderBottom: '1px solid rgba(201,168,76,0.15)', caretColor: 'var(--color-gold)' }}
                      data-cursor="text"
                    />
                    <div id="cf-msg-line" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'var(--color-gold)', transformOrigin: 'left center', transform: 'scaleX(0)', willChange: 'transform' }} />
                  </>
                ); })()}
              </div>

              <button type="submit"
                className="relative overflow-hidden self-start flex items-center gap-4 px-8 py-3.5"
                style={{ border: '1px solid rgba(201,168,76,0.4)', color: 'var(--color-gold)', background: 'transparent', cursor: 'pointer', minWidth: '200px' }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget.querySelector('.cff'), { scaleX: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
                  gsap.to(e.currentTarget.querySelector('.cft'), { color: 'var(--color-charcoal)', duration: 0.3, overwrite: 'auto' });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget.querySelector('.cff'), { scaleX: 0, duration: 0.4, ease: 'power3.inOut', overwrite: 'auto' });
                  gsap.to(e.currentTarget.querySelector('.cft'), { color: 'var(--color-gold)', duration: 0.3, overwrite: 'auto' });
                }}
              >
                <span className="cff absolute inset-0 origin-left" style={{ background: 'var(--color-gold)', transform: 'scaleX(0)', willChange: 'transform' }} />
                <span className="cft relative z-10 font-body text-xs tracking-widest uppercase transition-none" style={{ letterSpacing: '0.22em', willChange: 'color' }}>
                  Odeslat zprávu
                </span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Footer bar ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        {/* Top rule */}
        <div ref={ruleRef} style={{ height: '1px', background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-muted) 20%, transparent 60%)', transformOrigin: 'left center', transform: 'scaleX(0)' }} />

        {/* Ghost brand statement */}
        <div className="overflow-hidden pointer-events-none select-none" aria-hidden="true" style={{ paddingLeft: 'clamp(24px, 8vw, 120px)', paddingTop: '32px', paddingBottom: '0' }}>
          <div className="font-display font-bold leading-none"
            style={{ fontSize: 'clamp(48px, 11vw, 160px)', color: 'transparent', WebkitTextStroke: '1px rgba(201,168,76,0.05)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            SKLEP U DVOŘÁKŮ
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{ paddingLeft: 'clamp(24px, 8vw, 120px)', paddingRight: 'clamp(24px, 6vw, 80px)', paddingTop: '24px', paddingBottom: '32px' }}
        >
          {/* Nav */}
          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer navigace">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a key={href} href={href}
                className="font-body text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--color-cream-faint)', letterSpacing: '0.2em' }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { color: 'var(--color-gold-muted)', duration: 0.3, overwrite: 'auto' })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { color: 'var(--color-cream-faint)', duration: 0.4, overwrite: 'auto' })}
              >
                {label}
              </a>
            ))}
          </nav>
          {/* Copyright */}
          <p className="font-body text-[10px]" style={{ color: 'rgba(245,236,215,0.15)', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} Sklep u Dvořáků · Hustopeče · Česká republika
          </p>
        </div>
      </div>
    </footer>
  );
}