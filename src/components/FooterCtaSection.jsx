import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'
import { LocationIcon, ScheduleIcon } from './Icons'

gsap.registerPlugin(ScrollTrigger)

export default function FooterCtaSection() {
  const containerRef = useRef(null)
  const bgImageRef = useRef(null)
  const lineWrapRef = useRef(null)
  const bookBtnRef = useMagnetic(0.3)
  const contentWrapRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const bgImage = bgImageRef.current
    const lineWrap = lineWrapRef.current
    const contentWrap = contentWrapRef.current

    if (!container || !bgImage) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set(bgImage, { scale: 1 })
      gsap.set(lineWrap?.querySelectorAll('.mask-reveal-line'), { y: '0%', opacity: 1 })
      return
    }

    // Scroll scrub timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 0.8
      }
    })

    // 1. Night street image scales 1.2 -> 1.0
    tl.fromTo(
      bgImage,
      { scale: 1.2 },
      { scale: 1.0, ease: 'none', duration: 1 },
      0
    )

    // 2. Line by line mask reveal
    const lines = lineWrap?.querySelectorAll('.mask-reveal-line')
    if (lines && lines.length > 0) {
      tl.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          stagger: 0.15,
          ease: 'power3.out',
          duration: 0.6
        },
        0.15
      )
    }

    // 3. Book button fades up
    const ctaBtn = contentWrap?.querySelector('.cta-book-button')
    if (ctaBtn) {
      tl.fromTo(
        ctaBtn,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
        0.45
      )
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <footer className="w-full max-w-full flex flex-col bg-surface-container-lowest overflow-hidden" id="reservations">
      {/* Upper CTA Section with Night Window background */}
      <section
        ref={containerRef}
        className="relative w-full min-h-[620px] flex flex-col justify-between bg-primary-container overflow-hidden max-w-full"
      >
        {/* Background Image scaling 1.2 -> 1.0 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <img
            ref={bgImageRef}
            src="/images/screen4_night_window.webp"
            alt="Moody nighttime Parisian restaurant view"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover will-change-transform"
          />
          {/* Moody Overlays matching Stitch design */}
          <div className="absolute inset-0 bg-primary-container/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-primary-container/60 to-primary-container/90" />
        </div>

        {/* Centered Call to Action Display */}
        <div
          ref={contentWrapRef}
          className="relative z-10 w-full px-6 sm:px-12 md:px-16 pt-24 pb-16 flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto"
        >
          <span className="font-label-caps text-xs uppercase tracking-[0.3em] text-secondary mb-3 font-semibold">
            Service du Soir • Place Éphémère
          </span>

          {/* Masked Headline: reveals line by line */}
          <div ref={lineWrapRef} className="flex flex-col items-center max-w-4xl overflow-hidden py-1">
            <div className="overflow-hidden">
              <h2 className="mask-reveal-line font-headline-lg text-4xl sm:text-6xl md:text-7xl text-inverse-surface tracking-tight will-change-transform font-serif leading-[1.1]">
                See you on
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="mask-reveal-line font-headline-lg text-4xl sm:text-6xl md:text-7xl text-inverse-surface tracking-tight italic font-serif text-secondary will-change-transform leading-[1.1]">
                Rue Saint-Honoré.
              </h2>
            </div>
          </div>

          <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-lg mt-4 mb-8 leading-relaxed">
            Reservations open thirty days in advance. Tables for the autumn season are currently available.
          </p>

          <div ref={bookBtnRef} className="magnetic-btn cta-book-button">
            <a
              className="font-label-caps text-xs uppercase px-8 py-4 rounded-full bg-secondary text-on-secondary shadow-2xl hover:brightness-110 transition-all tracking-widest inline-flex items-center justify-center min-h-[48px] text-sm font-semibold cursor-pointer"
              href="tel:+33142965627"
            >
              Book a Table
            </a>
          </div>
        </div>

        {/* Integrated Sub-Footer Details Row */}
        <div className="relative z-10 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-surface-container-highest/30 max-w-full">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-on-surface-variant font-body-sm text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <LocationIcon className="w-4 h-4 text-secondary shrink-0" />
              <span>277 Rue Saint-Honoré, 75001 Paris</span>
            </div>
            <div className="flex items-center gap-2">
              <ScheduleIcon className="w-4 h-4 text-secondary shrink-0" />
              <span>Tuesday – Saturday: 18:00 – 23:30 • Sunday & Monday: Closed</span>
            </div>
            <div className="flex items-center gap-4 font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
              <a className="hover:text-secondary transition-colors min-h-[44px] flex items-center cursor-pointer" href="#">
                Instagram
              </a>
              <span>/</span>
              <a className="hover:text-secondary transition-colors min-h-[44px] flex items-center cursor-pointer" href="#">
                Resy
              </a>
              <span>/</span>
              <a className="hover:text-secondary transition-colors min-h-[44px] flex items-center cursor-pointer" href="#">
                Contact
              </a>
              <span>/</span>
              <span>© 1988–2025 L'Ambroisie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Footer */}
      <div className="w-full bg-surface-container-lowest border-t border-surface-container-highest/20 max-w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-16">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-12 pb-12">
            <div className="max-w-md">
              <p className="font-headline-md text-2xl text-on-surface tracking-wide uppercase font-serif">
                L'Ambroisie
              </p>
              <p className="font-body-md text-sm text-on-surface-variant mt-2 leading-relaxed">
                9 Place des Vosges, 75004 Paris, France • Established 1988 on Rue Saint-Honoré
              </p>
            </div>
            <div className="flex flex-wrap gap-12">
              <div className="flex flex-col gap-2">
                <span className="font-label-caps text-xs uppercase text-secondary tracking-widest font-semibold">
                  Reservations
                </span>
                <a href="tel:+33142965627" className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer min-h-[32px] flex items-center">
                  +33 1 42 96 56 27
                </a>
                <a href="mailto:service@ambroisie-paris.com" className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors cursor-pointer min-h-[32px] flex items-center">
                  service@ambroisie-paris.com
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-label-caps text-xs uppercase text-secondary tracking-widest font-semibold">
                  Service Hours
                </span>
                <span className="font-body-md text-sm text-on-surface-variant">
                  Tuesday – Saturday
                </span>
                <span className="font-body-md text-sm text-on-surface-variant">
                  Lunch 12:00 • Dinner 20:00
                </span>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-on-surface-variant font-label-caps text-xs uppercase tracking-widest border-t border-surface-container-highest/20 gap-3">
            <p>© 1988–2025 L'Ambroisie Paris. All rights reserved.</p>
            <p>Haute Gastronomie Française</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
