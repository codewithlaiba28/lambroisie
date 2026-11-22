import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MenuSection from './components/MenuSection'
import StorySection from './components/StorySection'
import PrivateDiningSection from './components/PrivateDiningSection'
import ReviewsSection from './components/ReviewsSection'
import FooterCtaSection from './components/FooterCtaSection'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [preloaderGone, setPreloaderGone] = useState(false)
  const lenisRef = useRef(null)

  // Global safety fallback: Unconditional unlock within 1.4s
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setLoadProgress(100)
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  // Initialize Lenis smooth scroll and sync with ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      document.body.style.overflow = ''
      setIsLoaded(true)
      setPreloaderGone(true)
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false
    })

    lenisRef.current = lenis
    window.lenis = lenis
    window.ScrollTrigger = ScrollTrigger

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tickerCb = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    // Stop Lenis and lock body scroll while preloader is active
    lenis.stop()
    document.body.style.overflow = 'hidden'

    // Smooth Anchor Scrolling delegation via Lenis
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (href && href !== '#' && href.length > 1) {
        const targetEl = document.querySelector(href)
        if (targetEl && lenisRef.current) {
          e.preventDefault()
          lenisRef.current.scrollTo(targetEl, {
            offset: 0,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    // Keyboard navigation guard to prevent skipping hero or pinned sections
    const handleKeyDown = (e) => {
      if (!lenisRef.current) return
      const heroDistance = window.innerHeight * 4
      const currentY = window.scrollY || window.pageYOffset

      if (e.code === 'End') {
        e.preventDefault()
        if (currentY < heroDistance) {
          lenisRef.current.scrollTo(heroDistance, {
            duration: 2.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          })
        } else {
          lenisRef.current.scrollTo(document.body.scrollHeight, {
            duration: 2.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          })
        }
      } else if (e.code === 'Home') {
        e.preventDefault()
        lenisRef.current.scrollTo(0, {
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })
      } else if (e.code === 'PageDown' || (e.code === 'Space' && !e.target.matches('input, textarea, button'))) {
        if (currentY < heroDistance) {
          e.preventDefault()
          const nextY = Math.min(heroDistance, currentY + window.innerHeight)
          lenisRef.current.scrollTo(nextY, {
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          })
        }
      } else if (e.code === 'PageUp') {
        if (currentY <= heroDistance && currentY > 0) {
          e.preventDefault()
          const prevY = Math.max(0, currentY - window.innerHeight)
          lenisRef.current.scrollTo(prevY, {
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Refresh ScrollTrigger when fonts and DOM are ready
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    const onResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      gsap.ticker.remove(tickerCb)
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', onResize)
      lenis.destroy()
    }
  }, [])

  // When preloader completes, start Lenis and refresh ScrollTrigger
  const handlePreloaderComplete = () => {
    document.body.style.overflow = ''
    setPreloaderGone(true)
    if (lenisRef.current) {
      lenisRef.current.start()
    }
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)
  }

  return (
    <div className="relative w-full max-w-full overflow-x-hidden min-h-screen bg-background text-on-surface selection:bg-secondary-container selection:text-on-surface">
      {/* Interactive Luxury Custom Cursor */}
      <CustomCursor />

      {/* Preloader with Progress Bar */}
      {!preloaderGone && (
        <Preloader
          progress={loadProgress}
          isLoaded={isLoaded}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="relative w-full max-w-full overflow-x-hidden">
        {/* 1. HERO (pinned ~400vh with canvas frames + text scrub + Riservato swap) */}
        <HeroSection
          onProgressUpdate={(p) => setLoadProgress(p)}
          onLoaded={() => setIsLoaded(true)}
        />

        {/* 2. MENU (pinned with 4 categories, left image crossfade with scale 1.08 -> 1 & clip-path wipe, cream panel slide in/out) */}
        <MenuSection />

        {/* 3. STORY (pinned with background scale 1.15 -> 1, SplitType word opacity 0.15 -> 1, italic serif accent slide) */}
        <StorySection />

        {/* 4. PRIVATE DINING (cream bg, image card expands via clip-path/inset, morphs to burgundy, content cross-fades to "Up to 25 guests" with salmon CTA) */}
        <PrivateDiningSection />

        {/* 5. REVIEWS (counter animates 0 -> 1,134 on enter, right 3D review wall with perspective 1200px, rotateY(-18deg) rotateX(8deg), 3 columns moving in opposite directions tied to scroll, left edge mask gradient) */}
        <ReviewsSection />

        {/* 6. FOOTER CTA (night street image scaling 1.2 -> 1, masked headline reveal line by line, Book button fade up, full footer) */}
        <FooterCtaSection />
      </main>
    </div>
  )
}
