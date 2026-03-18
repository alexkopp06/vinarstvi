import Navbar         from '@/components/Navbar';
import Hero           from '@/components/Hero';
import AboutStory     from '@/components/AboutStory';
import CellarGallery  from '@/components/CellarGallery';
import WineShowcase   from '@/components/WineShowcase';
import EventsStrip    from '@/components/EventsStrip';
import ContactFooter  from '@/components/ContactFooter';

/**
 * app/page.jsx — FINAL ASSEMBLY
 *
 * Full landing page flow:
 *
 *   1. Navbar         — fixed, scroll-reactive, magnetic links
 *   2. Hero           — cinematic full-screen, GSAP 7-beat entrance
 *   3. AboutStory     — 3-act narrative: split / pull-quote / stats
 *   4. CellarGallery  — GSAP pinned horizontal scroll, hover reveals
 *   5. WineShowcase   — 3D tilt cards, editorial typography, drag slider
 *   6. EventsStrip    — brutalist ledger, expanding event drawers
 *   7. ContactFooter  — contact split + ghost brand footer
 *
 * CustomCursor is mounted globally in app/layout.jsx.
 * Lenis smooth scroll is initialised in components/SmoothScroll.jsx.
 */
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutStory />
      <CellarGallery />
      <WineShowcase />
      <EventsStrip />
      <ContactFooter />
    </main>
  );
}