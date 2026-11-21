import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export default function StorySection() {
  const containerRef = useRef(null)
  const pinWrapRef = useRef(null)
  const bgImageRef = useRef(null)
  const textRef = useRef(null)
  const accent1Ref = useRef(null)
  const accent2Ref = useRef(null)
  const signatureRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const pinWrap = pinWrapRef.current
    const bgImage = bgImageRef.current
    const textEl = textRef.current
    const accent1 = accent1Ref.current
    const accent2 = accent2Ref.current
    const signature = signatureRef.current

    if (!container || !pinWrap || !textEl) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set(bgImage, { scale: 1 })
      gsap.set([accent1, accent2, signature], { opacity: 1, y: 0 })
      return
    }

    // Split text into words using SplitType
    const split = new SplitType(textEl.querySelectorAll('.story-words'), {
      types: 'words',
      tagName: 'span'
    })

    // Initial word opacities at 0.15
    gsap.set(split.words, { opacity: 0.15 })
    gsap.set([accent1, accent2], { y: '100%', opacity: 0 })
    gsap.set(signature, { opacity: 0, y: 20 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=250%',
        pin: pinWrap,
        scrub: 0.7,
        anticipatePin: 1,
        refreshPriority: 6
      }
    })

    // 1. Background image slowly scales 1.15 -> 1.0
    tl.fromTo(
      bgImage,
      { scale: 1.15 },
      { scale: 1.0, ease: 'none', duration: 1 },
      0
    )

    // 2. Sequential word opacity 0.15 -> 1.0
    tl.to(
      split.words,
      {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        duration: 0.7
      },
      0.1
    )

    // 3. Accent 1 "authentic flavors" vertical slide in
    tl.fromTo(
      accent1,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, ease: 'power2.out', duration: 0.25 },
      0.35
    )

    // 4. Accent 2 "warm service." vertical slide in
    tl.fromTo(
      accent2,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, ease: 'power2.out', duration: 0.25 },
      0.60
    )

    // 5. Signature reveal at the conclusion
    tl.to(
      signature,
      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
      0.80
    )

    return () => {
      tl.kill()
      split.revert()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-primary-container overflow-hidden max-w-full"
      id="story"
    >
      <div
        ref={pinWrapRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center px-6 sm:px-12 md:px-16"
      >
        {/* Background Image slowly scaling 1.15 -> 1.0 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <img
            ref={bgImageRef}
            src="/images/screen3_chef_kitchen.png"
            alt="Chef plating in ambient kitchen pass"
            className="w-full h-full object-cover will-change-transform"
          />
          {/* Moody Overlay Gradients */}
          <div className="absolute inset-0 bg-primary-container/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container via-transparent to-primary-container" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,13,14,0.4)_0%,rgba(28,8,9,0.9)_100%)]" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center my-auto">
          <div
            ref={textRef}
            className="w-full flex flex-col items-center gap-6"
          >
            {/* Supertitle */}
            <span className="font-label-caps text-xs uppercase text-secondary tracking-[0.3em] font-semibold">
              L'Héritage Culinaire • Depuis 1988
            </span>

            {/* Main Upper Case Text with Scroll-scrubbed Word Opacity */}
            <div className="font-body-md text-xl sm:text-3xl md:text-4xl uppercase tracking-[0.08em] sm:tracking-[0.12em] text-on-surface leading-[1.6] max-w-3xl break-words">
              <span className="story-words inline">
                OUR STORY BEGAN IN 1988 WITH A SIMPLE VISION: TO CREATE A PLACE WHERE
              </span>

              {/* Italic Serif Accent Word 1 with Vertical Slide */}
              <div className="overflow-hidden inline-block align-middle my-2 sm:my-3 w-full">
                <span
                  ref={accent1Ref}
                  className="font-headline-lg text-3xl sm:text-6xl md:text-7xl italic font-normal text-secondary normal-case tracking-normal block drop-shadow-lg font-serif"
                >
                  authentic flavors
                </span>
              </div>

              <span className="story-words inline">MEET</span>

              {/* Italic Serif Accent Word 2 with Vertical Slide */}
              <div className="overflow-hidden inline-block align-middle my-2 sm:my-3 w-full">
                <span
                  ref={accent2Ref}
                  className="font-headline-lg text-3xl sm:text-6xl md:text-7xl italic font-normal text-primary-fixed normal-case tracking-normal block drop-shadow-lg font-serif"
                >
                  warm service.
                </span>
              </div>
            </div>

            {/* Divider and Signature */}
            <div
              ref={signatureRef}
              className="flex flex-col items-center gap-2 pt-4 opacity-0"
            >
              <div className="w-16 h-px bg-secondary/40 my-1" />
              <p className="font-headline-md text-lg sm:text-xl text-inverse-surface tracking-wider font-serif">
                Chef Bernard Pacaud
              </p>
              <span className="font-label-caps text-[10px] sm:text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                Maître Cuisinier de France
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
