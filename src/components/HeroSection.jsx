import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection({ onProgressUpdate, onLoaded }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const headlineRef = useRef(null)
  const riservatoRef = useRef(null)
  const ctaButtonsRef = useRef(null)

  const reserveBtnRef = useMagnetic(0.25)
  const menuBtnRef = useMagnetic(0.25)

  const imagesRef = useRef([])
  const frameCountRef = useRef(72)
  const currentRenderedFrameRef = useRef(0)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const frameCount = isMobile ? 36 : 72
    frameCountRef.current = frameCount
    const frameFolder = isMobile ? '/frames-mobile' : '/frames'

    const images = new Array(frameCount)
    imagesRef.current = images

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: false })

    // Device performance & reduced motion detection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isLowPower = Boolean(
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4)
    )

    // Nearest-frame lookup so canvas never flickers or renders blank
    const getClosestLoadedImage = (index) => {
      const safe = Math.min(frameCount - 1, Math.max(0, index))
      if (images[safe] && images[safe].complete && images[safe].naturalWidth > 0) {
        return images[safe]
      }
      for (let offset = 1; offset < frameCount; offset++) {
        const prev = safe - offset
        if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
          return images[prev]
        }
        const next = safe + offset
        if (next < frameCount && images[next]?.complete && images[next]?.naturalWidth > 0) {
          return images[next]
        }
      }
      return null
    }

    const renderFrame = (index) => {
      const img = getClosestLoadedImage(index)
      if (!img) return

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      if (cw === 0 || ch === 0 || iw === 0 || ih === 0) return

      const scale = Math.max(cw / iw, ch / ih)
      const nw = iw * scale
      const nh = ih * scale
      const cx = (cw - nw) / 2
      const cy = (ch - nh) / 2

      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh)
      currentRenderedFrameRef.current = index
    }

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      renderFrame(currentRenderedFrameRef.current)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Step 1: Preload frame 0 immediately (< 35KB) and render instantly
    const firstImg = new Image()
    firstImg.src = `${frameFolder}/frame_0001.webp`
    firstImg.onload = () => {
      images[0] = firstImg
      renderFrame(0)
      if (onProgressUpdate) onProgressUpdate(40)
    }

    // Step 2: Load keyframes spaced across the sequence (only 8-12 frames total ~300KB)
    const keyframeStep = Math.max(2, Math.floor(frameCount / 10))
    const keyframeIndices = []
    for (let i = 0; i < frameCount; i += keyframeStep) {
      if (i !== 0) keyframeIndices.push(i)
    }
    if (!keyframeIndices.includes(frameCount - 1)) {
      keyframeIndices.push(frameCount - 1)
    }

    let loadedKeyframes = 0
    const totalKeyframes = keyframeIndices.length
    let isKeyframesComplete = false

    const loadRemainingFrames = () => {
      const remainingQueue = []
      for (let i = 0; i < frameCount; i++) {
        if (!images[i]) remainingQueue.push(i)
      }

      let activeRequests = 0
      const maxConcurrent = 3

      const next = () => {
        while (activeRequests < maxConcurrent && remainingQueue.length > 0) {
          const idx = remainingQueue.shift()
          activeRequests++
          const img = new Image()
          const paddedIndex = String(idx + 1).padStart(4, '0')
          img.src = `${frameFolder}/frame_${paddedIndex}.webp`
          img.onload = img.onerror = () => {
            images[idx] = img
            activeRequests--
            next()
          }
        }
      }
      next()
    }

    keyframeIndices.forEach((idx) => {
      const img = new Image()
      const paddedIndex = String(idx + 1).padStart(4, '0')
      img.src = `${frameFolder}/frame_${paddedIndex}.webp`
      const onDone = () => {
        images[idx] = img
        loadedKeyframes++
        const pct = 40 + Math.round((loadedKeyframes / totalKeyframes) * 60)
        if (onProgressUpdate) onProgressUpdate(pct)

        if (loadedKeyframes === totalKeyframes && !isKeyframesComplete) {
          isKeyframesComplete = true
          if (onLoaded) onLoaded()
          loadRemainingFrames()
        }
      }
      img.onload = onDone
      img.onerror = onDone
    })

    // Safety timeout: Never let the loader hang more than 1.2s on any laptop or connection
    const safetyTimer = setTimeout(() => {
      if (!isKeyframesComplete) {
        isKeyframesComplete = true
        if (onProgressUpdate) onProgressUpdate(100)
        if (onLoaded) onLoaded()
        loadRemainingFrames()
      }
    }, 1200)

    // Reduced motion or low-power fallback:
    if (prefersReducedMotion || (isLowPower && isMobile)) {
      renderFrame(0)
      gsap.set(headlineRef.current, { opacity: 1, y: 0 })
      gsap.set(riservatoRef.current, { opacity: 0, display: 'none' })
      gsap.set(ctaButtonsRef.current, { opacity: 1, y: 0 })
      return () => {
        clearTimeout(safetyTimer)
        window.removeEventListener('resize', resizeCanvas)
      }
    }

    const state = { frame: 0 }

    // Master ScrollTrigger timeline pinned for ~400vh
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=400%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        refreshPriority: 10,
        onUpdate: (self) => {
          const targetFrame = Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(self.progress * (frameCount - 1)))
          )
          renderFrame(targetFrame)
        },
        onLeave: () => {
          renderFrame(frameCount - 1)
        },
        onLeaveBack: () => {
          renderFrame(0)
        }
      }
    })

    tl.to(state, {
      frame: frameCount - 1,
      ease: 'none',
      duration: 1
    }, 0)

    // Phase 1: Headline "Authentic French dining since 1988." appears at ~55-60%, swaps out around 78%
    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
      0.55
    )
    tl.to(
      headlineRef.current,
      { opacity: 0, y: -25, duration: 0.08, ease: 'power2.in' },
      0.78
    )

    // Phase 2: At ~82% - 85% swap in "Riservato." with blur-to-sharp fade
    tl.fromTo(
      riservatoRef.current,
      { opacity: 0, filter: 'blur(16px)', y: 20 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.12, ease: 'power2.out' },
      0.82
    )

    // Phase 3: CTA buttons fade in last (~90% to 1.0)
    tl.fromTo(
      ctaButtonsRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' },
      0.90
    )

    return () => {
      clearTimeout(safetyTimer)
      window.removeEventListener('resize', resizeCanvas)
      tl.kill()
    }
  }, [onProgressUpdate, onLoaded])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-primary-container max-w-full"
    >
      {/* Background Frame Sequence Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Cinematic Vignettes and Gradients matching Stitch template */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/40 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/85 via-primary-container/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(28,8,9,0.7)_100%)] pointer-events-none" />

      {/* Foreground Content Layer */}
      <div className="relative z-10 w-full h-full px-6 sm:px-12 md:px-16 max-w-7xl mx-auto flex flex-col justify-end pb-16 sm:pb-20 md:pb-24 pointer-events-none">
        <div className="max-w-3xl flex flex-col gap-6 pointer-events-auto">

          {/* Grid Stack: Headline and Riservato swap in place */}
          <div className="grid grid-cols-1 grid-rows-1">

            {/* 1. Main Headline Block (reveals at ~60%) */}
            <div
              ref={headlineRef}
              className="col-start-1 row-start-1 flex flex-col gap-3 opacity-0 will-change-transform"
            >
              <span className="font-label-caps text-xs uppercase text-secondary tracking-[0.3em]">
                Rue Saint-Honoré • Paris Ier
              </span>
              <h1 className="font-headline-lg text-4xl sm:text-6xl md:text-7xl text-on-surface leading-[1.08] tracking-tight font-serif">
                Authentic{' '}
                <span className="italic font-normal text-secondary font-headline-lg">
                  French dining
                </span>{' '}
                since 1988.
              </h1>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
                Three decades of quiet mastery, uncompromised classical technique,
                and the timeless culinary heritage of Chef Bernard Pacaud.
              </p>
            </div>

            {/* 2. Riservato Block (swaps directly in place at ~85% with blur-to-sharp fade) */}
            <div
              ref={riservatoRef}
              className="col-start-1 row-start-1 flex flex-col gap-3 opacity-0 will-change-transform"
              style={{ willChange: 'opacity, filter' }}
            >
              <span className="font-label-caps text-xs uppercase text-secondary tracking-[0.35em]">
                Table Close-up • Intimate Gastronomy
              </span>
              <h2 className="font-headline-lg text-4xl sm:text-6xl md:text-7xl italic font-normal text-primary-fixed tracking-wide font-serif leading-[1.08]">
                Riservato.
              </h2>
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-lg leading-relaxed">
                A candlelit alcove reserved exclusively for an evening of transcendence and Michelin heritage.
              </p>
            </div>

          </div>

          {/* 3. CTA Buttons (fading in last) */}
          <div
            ref={ctaButtonsRef}
            className="flex flex-wrap items-center gap-4 opacity-0"
          >
            <div ref={reserveBtnRef} className="magnetic-btn">
              <a
                className="font-label-caps text-xs uppercase px-7 py-3.5 rounded-full bg-secondary text-on-secondary shadow-lg shadow-primary-container/80 hover:brightness-110 transition-all tracking-widest inline-flex items-center justify-center min-h-[48px] cursor-pointer"
                href="#reservations"
              >
                Reserve a Table
              </a>
            </div>
            <div ref={menuBtnRef} className="magnetic-btn">
              <a
                className="font-label-caps text-xs uppercase px-7 py-3.5 rounded-full bg-surface-container/80 text-inverse-surface backdrop-blur-md shadow-sm hover:bg-surface-container-high transition-all tracking-widest inline-flex items-center justify-center min-h-[48px] border border-outline-variant/30 cursor-pointer"
                href="#menu"
              >
                View Menu
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
