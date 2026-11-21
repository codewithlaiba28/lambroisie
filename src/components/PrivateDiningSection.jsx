import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'
import { WineBarIcon, VerifiedIcon, MenuBookIcon, ExpandMoreIcon } from './Icons'

gsap.registerPlugin(ScrollTrigger)

export default function PrivateDiningSection() {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const cardBgRef = useRef(null)
  const initialContentRef = useRef(null)
  const salonContentRef = useRef(null)
  const cardImageRef = useRef(null)
  const inquireBtnRef = useMagnetic(0.25)

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    const cardBg = cardBgRef.current
    const initialContent = initialContentRef.current
    const salonContent = salonContentRef.current
    const cardImage = cardImageRef.current

    if (!container || !card) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set(card, { clipPath: 'inset(0% 0% 0% 0% round 16px)' })
      gsap.set(cardBg, { backgroundColor: '#2a0a0c' })
      gsap.set(initialContent, { opacity: 0, display: 'none' })
      gsap.set(salonContent, { opacity: 1, display: 'flex' })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        refreshPriority: 4
      }
    })

    // Phase 1: Image card expands from small rounded rectangle to large using clip-path/inset (0 -> 0.40)
    tl.fromTo(
      card,
      {
        clipPath: 'inset(10% 12% 10% 12% round 20px)',
        scale: 0.94
      },
      {
        clipPath: 'inset(0% 0% 0% 0% round 16px)',
        scale: 1.0,
        ease: 'power2.inOut',
        duration: 0.40
      },
      0
    )

    // Phase 2: Card background morphs to rich deep burgundy, and image dims/vignettes (0.40 -> 0.65)
    tl.to(
      cardBg,
      {
        backgroundColor: '#2a0a0c',
        duration: 0.25,
        ease: 'power2.inOut'
      },
      0.40
    )

    tl.to(
      cardImage,
      {
        opacity: 0.22,
        scale: 1.05,
        duration: 0.25,
        ease: 'power2.out'
      },
      0.40
    )

    // Phase 3: Content cross-fades from initial state to "Up to 25 guests" Salon Saint-Honoré state (0.42 -> 0.75)
    tl.to(
      initialContent,
      {
        opacity: 0,
        y: -16,
        duration: 0.15,
        ease: 'power2.in'
      },
      0.42
    )

    tl.fromTo(
      salonContent,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out'
      },
      0.55
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[580px] bg-[#f3ebdd] text-[#2a0a0c] overflow-hidden max-w-full flex items-center justify-center"
      id="private-dining"
      data-nav-theme="light"
    >
      <div className="relative w-full h-full max-h-[100svh] flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto">
        {/* Section Header: Compact to fit comfortably in 100svh */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto gap-1 z-10 shrink-0">
          <span className="font-label-caps text-[11px] uppercase tracking-[0.25em] text-[#723522] font-semibold">
            Discreet Prestige
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#2a0a0c] leading-tight">
            Private Dining & Salons
          </h2>
          <p className="font-body text-xs sm:text-[13.5px] text-[#514443] max-w-md leading-relaxed hidden sm:block">
            Historic architecture meets bespoke French gastronomy for high-profile gatherings and intimate celebrations.
          </p>
        </div>

        {/* Morphing Expanding Card Container (compact, NO inner scrollbar, auto height) */}
        <div className="relative w-full max-w-4xl mx-auto my-auto flex items-center justify-center flex-1 max-h-[460px] sm:max-h-[480px] md:max-h-[510px]">
          <div
            ref={cardRef}
            className="relative w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden will-change-transform rounded-[16px]"
          >
            {/* Morphing Background Layer */}
            <div
              ref={cardBgRef}
              className="absolute inset-0 w-full h-full bg-primary-container transition-colors duration-500"
            />

            {/* Background Image */}
            <img
              ref={cardImageRef}
              alt="L'Ambroisie Salon Privé"
              src="/images/screen1_full.png"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-80"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/95 via-primary-container/50 to-primary-container/30 pointer-events-none" />

            {/* State A: Initial Card Content */}
            <div
              ref={initialContentRef}
              className="absolute inset-0 p-6 sm:p-8 md:p-[32px] flex flex-col justify-between text-on-surface z-10 pointer-events-none select-none"
            >
              <div>
                <span className="font-label-caps text-[11px] uppercase tracking-[0.25em] text-secondary font-semibold">
                  Private Dining
                </span>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-inverse-surface leading-tight">
                  An Intimate French Experience
                </h3>
                <p className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                  <ExpandMoreIcon className="w-4 h-4 text-secondary" />
                  Scroll to explore suites & salons
                </p>
              </div>
            </div>

            {/* State B: Cross-faded Burgundy "Up to 25 guests" State (NO INNER SCROLL, fully fits) */}
            <div
              ref={salonContentRef}
              className="absolute inset-0 p-5 sm:p-6 md:p-[32px] flex flex-col justify-between text-on-surface z-20 opacity-0 pointer-events-auto select-none overflow-hidden"
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Header Row: Title + Pill */}
                <div className="flex items-center justify-between border-b border-surface-container-highest/50 pb-3">
                  <div>
                    <span className="font-label-caps text-[11px] uppercase tracking-widest text-secondary font-semibold block">
                      Exclusive Suite
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl md:text-[32px] text-inverse-surface leading-snug mt-0.5">
                      Salon Saint-Honoré
                    </h3>
                  </div>
                  <span className="font-display text-xs sm:text-[14px] italic text-primary-fixed bg-surface-container/80 px-3.5 py-1.5 rounded-full border border-secondary/30 whitespace-nowrap">
                    Up to 25 guests
                  </span>
                </div>

                {/* Paragraph: 15px / 1.5 line height */}
                <p className="font-body text-[14px] sm:text-[15px] leading-[1.5] text-on-surface-variant max-w-2xl">
                  From bespoke multi-course menus to private sommelier wine pairings, our Salon Saint-Honoré offers discreet elegance and tailored gastronomy for your most memorable gatherings.
                </p>

                {/* 3 Feature Boxes: 12px padding, 16px gaps, 1 col mobile / 3 cols desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-[16px] pt-1 text-on-surface">
                  <div className="flex items-center gap-2.5 bg-surface-container/60 p-[12px] rounded-xl border border-surface-container-highest/30">
                    <WineBarIcon className="w-4 h-4 text-secondary shrink-0" />
                    <span className="font-body text-xs sm:text-[13px] text-inverse-surface leading-tight">
                      Dedicated Master Sommelier selection
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-surface-container/60 p-[12px] rounded-xl border border-surface-container-highest/30">
                    <VerifiedIcon className="w-4 h-4 text-secondary shrink-0" />
                    <span className="font-body text-xs sm:text-[13px] text-inverse-surface leading-tight">
                      Discreet rear entrance on Rue Saint-Honoré
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-surface-container/60 p-[12px] rounded-xl border border-surface-container-highest/30">
                    <MenuBookIcon className="w-4 h-4 text-secondary shrink-0" />
                    <span className="font-body text-xs sm:text-[13px] text-inverse-surface leading-tight">
                      Personalized menus signed by Chef Pacaud
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Row */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-surface-container-highest/30 mt-1">
                <span className="font-label-caps text-[10.5px] sm:text-xs uppercase tracking-widest text-on-surface-variant hidden md:inline-block">
                  Valet parking & discreet security accommodation available
                </span>
                <div ref={inquireBtnRef} className="magnetic-btn w-full sm:w-auto">
                  <a
                    className="inline-flex items-center justify-center font-label-caps text-xs uppercase px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-secondary text-on-secondary shadow-lg hover:brightness-110 transition-all tracking-widest cursor-pointer min-h-[44px] w-full sm:w-auto font-semibold"
                    href="#reservations"
                  >
                    Inquire for Private Events
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 24px Gap below card to Email Line */}
        <div className="text-center shrink-0 z-10 mt-6 pt-0">
          <span className="font-label-caps text-xs uppercase tracking-widest text-[#723522]/85 font-medium">
            For bespoke banquet inquiries: private@ambroisie-paris.com
          </span>
        </div>
      </div>
    </section>
  )
}
