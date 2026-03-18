'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'O nás',    href: '#sklep'        },
  { label: 'Galerie',  href: '#sklep-galerie' },
  { label: 'Vína',     href: '#vina'          },
  { label: 'Zážitky', href: '#nabidka'        },
];

const BOOKING_PAGES = ['/kontakt', '/rezervace'];

/* Smooth scroll — pouze na homepage */
function handleSmoothScroll(e, href) {
  if (href.startsWith('#')) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
}

/* Na jiné stránce vynutíme window.location.href.
   Next.js router by kotvu tiše ignoroval a stránka
   by skočila na začátek místo na správnou sekci. */
function handleCrossPageNav(e, href) {
  if (href.startsWith('#')) {
    e.preventDefault();
    window.location.href = '/' + href;
  }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef   = useRef(null);
  const pathname = usePathname();

  const isHomepage    = pathname === '/';
  const forceScrolled = !isHomepage;
  const scrolled      = forceScrolled || isScrolled;
  const isBookingPage = BOOKING_PAGES.includes(pathname);

  const cta = isBookingPage
    ? { label: 'Termín',    href: 'https://rustikal.cz/booking/#/packages', external: true  }
    : { label: 'Rezervace', href: '/kontakt',                                external: false };

  /* href pro <a> tag */
  function getLinkHref(href) {
    return isHomepage ? href : '/' + href;
  }

  /* onClick handler — homepage = smooth scroll, jinak = window.location */
  function getLinkClick(href) {
    return isHomepage
      ? (e) => handleSmoothScroll(e, href)
      : (e) => handleCrossPageNav(e, href);
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    el.style.opacity = '0';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 1.4s ease';
      el.style.opacity = '1';
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Raleway:wght@200;300;400&display=swap');

        .nb-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          transition:
            background 0.6s ease,
            backdrop-filter 0.6s ease,
            box-shadow 0.6s ease,
            padding 0.5s ease;
        }

        .nb-root.top {
          background: linear-gradient(
            to bottom,
            rgba(6, 2, 2, 0.72) 0%,
            rgba(6, 2, 2, 0.36) 60%,
            transparent 100%
          );
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          box-shadow: none;
          padding-top: 12px;
        }

        .nb-root.scrolled {
          background: rgba(11, 8, 6, 0.92);
          backdrop-filter: blur(22px) saturate(150%);
          -webkit-backdrop-filter: blur(22px) saturate(150%);
          box-shadow: 0 1px 0 rgba(193, 155, 60, 0.13);
          padding-top: 0;
        }

        .nb-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 56px;
          transition: height 0.5s cubic-bezier(0.25,1,0.5,1);
        }

        .nb-root.top      .nb-inner { height: 100px; }
        .nb-root.scrolled .nb-inner { height: 62px;  }

        .nb-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .nb-logo img {
          height: 92px;
          width: auto;
          object-fit: contain;
          transition: height 0.5s cubic-bezier(0.25,1,0.5,1), opacity 0.3s ease;
        }

        .nb-root.scrolled .nb-logo img {
          height: 54px;
        }

        .nb-logo img:hover {
          opacity: 0.85;
        }

        .nb-links {
          display: flex;
          align-items: center;
          gap: 44px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nb-link {
          font-family: 'Raleway', sans-serif;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(242, 235, 217, 0.92);
          text-decoration: none;
          transition: color 0.35s ease;
          position: relative;
          text-shadow:
            0 1px 4px rgba(0,0,0,0.70),
            0 2px 12px rgba(0,0,0,0.50);
        }

        .nb-root.scrolled .nb-link {
          text-shadow: none;
        }

        .nb-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1px;
          background: #C9A84C;
          transition: width 0.4s cubic-bezier(0.25,1,0.5,1);
        }

        .nb-link:hover { color: #C9A84C; }
        .nb-link:hover::after { width: 100%; }

        .nb-cta {
          font-family: 'Raleway', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #C9A84C;
          text-decoration: none;
          padding: 11px 28px;
          border: 1px solid rgba(201, 168, 76, 0.55);
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(0,0,0,0.35);
        }

        .nb-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #C9A84C;
          transform: translateY(101%);
          transition: transform 0.45s cubic-bezier(0.25,1,0.5,1);
        }

        .nb-cta:hover::before { transform: translateY(0); }
        .nb-cta:hover { color: #0E0A08; }
        .nb-cta span { position: relative; z-index: 1; }

        .nb-right {
          display: flex;
          align-items: center;
          gap: 52px;
        }

        .nb-burger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          filter: drop-shadow(0 1px 4px rgba(0,0,0,0.65));
        }

        .mob {
          position: fixed;
          inset: 0;
          z-index: 40;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 48px;
          background: rgba(8, 5, 3, 0.98);
          backdrop-filter: blur(24px);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }

        .mob.open { opacity: 1; visibility: visible; }

        .mob-link {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 6.5vw, 4rem);
          font-weight: 400;
          font-style: italic;
          color: rgba(242, 235, 217, 0.55);
          text-decoration: none;
          display: block;
          transition: color 0.3s ease, transform 0.3s ease;
          line-height: 1.3;
        }

        .mob-link:hover { color: #C9A84C; transform: translateX(8px); }

        .mob-num {
          font-family: 'Raleway', sans-serif;
          font-size: 9px;
          font-weight: 200;
          letter-spacing: 0.22em;
          color: rgba(201, 168, 76, 0.35);
          display: block;
          margin-bottom: 4px;
        }

        .mob-cta-line {
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
        }

        .mob-cta {
          font-family: 'Raleway', sans-serif;
          font-size: 10px;
          font-weight: 200;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #C9A84C;
          text-decoration: none;
        }

        @media (max-width: 767px) {
          .nb-links, .nb-cta { display: none !important; }
          .nb-burger { display: block; }
          .nb-inner { padding: 0 24px; }
          .nb-root.top      .nb-inner { height: 72px; }
          .nb-root.scrolled .nb-inner { height: 54px; }
          .nb-logo img { height: 60px; }
          .nb-root.scrolled .nb-logo img { height: 44px; }
        }
      `}</style>

      <header
        ref={navRef}
        className={'nb-root ' + (scrolled ? 'scrolled' : 'top')}
        role="navigation"
      >
        <div className="nb-inner">

          {/* Logo */}
          <a href="/" className="nb-logo">
            <img
              src="/rustikal-logo-vertikalni-white.png"
              alt="Hotel Rustikal"
            />
          </a>

          {/* Desktop right side */}
          <div className="nb-right">
            <ul className="nb-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={getLinkHref(link.href)}
                    className="nb-link"
                    onClick={getLinkClick(link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={cta.href}
              className="nb-cta"
              {...(cta.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {}
              )}
            >
              <span>{cta.label}</span>
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="nb-burger"
            onClick={() => setIsMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {isMenuOpen
              ? <X size={24} color="#F2EBD9" />
              : <Menu size={24} color="#F2EBD9" />
            }
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={'mob ' + (isMenuOpen ? 'open' : '')}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 0.55s ease ${i * 0.08 + 0.08}s, transform 0.55s ease ${i * 0.08 + 0.08}s`,
              }}
            >
              <span className="mob-num">0{i + 1}</span>
              <a
                href={getLinkHref(link.href)}
                className="mob-link"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (isHomepage) {
                    handleSmoothScroll(e, link.href);
                  } else {
                    handleCrossPageNav(e, link.href);
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div
          className="mob-cta-line"
          style={{
            opacity: isMenuOpen ? 1 : 0,
            transition: 'opacity 0.5s ease 0.4s',
          }}
        >
          <a
            href={cta.href}
            className="mob-cta"
            {...(cta.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {}
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {isBookingPage ? 'Rezervovat termín →' : 'Rezervovat degustaci →'}
          </a>
        </div>
      </div>
    </>
  );
}