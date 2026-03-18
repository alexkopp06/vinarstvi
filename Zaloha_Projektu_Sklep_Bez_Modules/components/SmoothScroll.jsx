'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {

    const instance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      infinite: false
    });

    lenisRef.current = instance;
    setLenis(instance);

    /* ─── PROPOJENÍ S SCROLLTRIGGER ─── */
    instance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      instance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ─── VISIBILITY HANDLER ─── */
    const onVisibility = () => {
      if (document.hidden) instance.stop();
      else instance.start();
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      instance.destroy();
      gsap.ticker.remove(instance.raf);
    };

  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
