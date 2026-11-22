import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Preloader({ progress, isLoaded, onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      containerRef.current.style.pointerEvents = 'none'
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none'
          }
          if (onComplete) onComplete()
        }
      })
    }
  }, [isLoaded, onComplete])

  return (
    <div
      id="preloader"
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center text-center p-6 selection:bg-transparent"
    >
      <div className="flex flex-col items-center max-w-md w-full gap-8">
        {/* Crest / Logo */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-label-caps text-xs uppercase tracking-[0.4em] text-secondary">
            Paris • Rue Saint-Honoré
          </span>
          <h1 className="font-headline-lg text-4xl sm:text-5xl text-on-surface tracking-[0.15em] uppercase font-serif">
            L'Ambroisie
          </h1>
          <span className="font-title-editorial italic text-on-surface-variant text-base sm:text-lg">
            Haute Gastronomie Française
          </span>
        </div>

        {/* Minimalist Progress Meter */}
        <div className="w-64 flex flex-col gap-3 items-center">
          <div className="w-full h-[2px] bg-surface-container-highest rounded-full overflow-hidden relative">
            <div
              className="h-full bg-secondary transition-all duration-100 ease-out"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <div className="w-full flex justify-between items-center text-xs font-label-caps text-on-surface-variant tracking-widest">
            <span>PREPARING EXPERIENCE</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <p className="font-body-sm text-outline text-xs tracking-wider uppercase opacity-70">
          Scroll-driven cinematic presentation
        </p>
      </div>
    </div>
  )
}
