import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StarIcon } from './Icons'

gsap.registerPlugin(ScrollTrigger)

// Column 1 items
const col1Cards = [
  {
    type: 'review',
    quote: '“An unforgettable evening. The duck magret is classical culinary perfection at its absolute apex.”',
    source: 'Le Figaro Gastronomie',
    role: 'Chief Food Critic'
  },
  {
    type: 'photo',
    image: '/images/screen2_plated_dish.png',
    tag: 'Signature Plat',
    title: 'Canard de Challans aux Mûres'
  },
  {
    type: 'review',
    quote: '“Bernard Pacaud does not chase fleeting modern trends; he defines eternal gastronomic harmony.”',
    source: 'Gault & Millau',
    role: 'Editorial Review'
  },
  {
    type: 'review',
    quote: '“The grandest temple of classical sauces in the entire Western world.”',
    source: 'Financial Times',
    role: 'Life & Arts Review'
  }
]

// Column 2 items
const col2Cards = [
  {
    type: 'review',
    quote: '“The soul of Rue Saint-Honoré. Candlelit grandeur accompanied by unmatched warmth and discreet charm.”',
    source: 'The New York Times',
    role: 'International Dining Dispatch'
  },
  {
    type: 'photo',
    image: '/images/screen1_full.png',
    tag: 'Atmosphere',
    title: 'Twilight Candlelit Grandeur'
  },
  {
    type: 'review',
    quote: '“Three Michelin stars held with unwavering integrity, classical rigor, and poetic soul for over 35 years.”',
    source: 'Michelin Guide Inspector',
    role: 'Trois Étoiles Heritage'
  },
  {
    type: 'review',
    quote: '“Every mouthful of the wild mushroom velouté evokes pure Parisian history.”',
    source: 'Le Monde',
    role: 'Gastronomie de France'
  }
]

// Column 3 items
const col3Cards = [
  {
    type: 'photo',
    image: '/images/screen3_chef_kitchen.png',
    tag: 'Haute Maîtrise',
    title: 'Chef Bernard Pacaud at Pass'
  },
  {
    type: 'review',
    quote: '“Flawless classical sauces, sublime cellaring, and an ethereal dessert sequence.”',
    source: "World's 50 Best",
    role: 'Academy Review'
  },
  {
    type: 'review',
    quote: '“A pilgrimage for every true devotee of classical French haute cuisine.”',
    source: 'L’Obs',
    role: 'Parisian Life'
  },
  {
    type: 'photo',
    image: '/images/menu_cheese.jpg',
    tag: 'Terroir d’Exception',
    title: 'Affinage 24 Mois Chariot'
  }
]

function CardItem({ card }) {
  if (card.type === 'photo') {
    return (
      <div className="w-full h-52 rounded-[16px] overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-surface-container-highest/30 shrink-0 select-none group">
        <img
          alt={card.title}
          src={card.image}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-container/95 via-primary-container/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-4 text-on-surface z-10">
          <span className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary font-semibold block">
            {card.tag}
          </span>
          <p className="font-headline-md text-sm text-inverse-surface font-serif mt-0.5">
            {card.title}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f3ebdd] text-[#2a0a0c] p-6 rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-[#e2d5c3] flex flex-col justify-between gap-4 shrink-0 cursor-pointer hover:shadow-2xl transition-all select-none">
      <p className="font-serif italic text-base sm:text-[17px] text-[#2a0a0c] leading-relaxed">
        {card.quote}
      </p>
      <div className="pt-2 border-t border-[#2a0a0c]/10 flex flex-col gap-0.5">
        <p className="font-label-caps text-xs uppercase tracking-[0.18em] text-[#723522] font-semibold">
          {card.source}
        </p>
        <span className="text-xs text-[#514443]">
          {card.role}
        </span>
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  const containerRef = useRef(null)
  const counterRef = useRef(null)
  const [counterVal, setCounterVal] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Counter animation 0 -> 1,134 on viewport enter
    const counterObj = { count: 0 }
    ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(counterObj, {
          count: 1134,
          duration: 2.0,
          ease: 'power3.out',
          onUpdate: () => {
            setCounterVal(Math.round(counterObj.count))
          },
          onComplete: () => {
            setCounterVal(1134)
          }
        })
      },
      once: true
    })
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-primary-container py-24 sm:py-32 overflow-hidden max-w-full"
      id="reviews"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[640px]">

          {/* Left Side: Accolades & Critiques Counter (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 z-20">
            <span className="font-label-caps text-xs uppercase tracking-[0.25em] text-secondary font-semibold">
              Accolades & Critiques
            </span>

            <div className="flex flex-col">
              <span
                ref={counterRef}
                className="font-headline-lg text-6xl sm:text-7xl lg:text-8xl text-inverse-surface leading-none tracking-tight font-serif"
              >
                {counterVal.toLocaleString()}
              </span>

              {/* 5-Star Row using reliable SVG Stars */}
              <div className="flex items-center gap-1.5 text-secondary mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="w-6 h-6 text-secondary" />
                ))}
                <span className="font-body-md text-base text-on-surface font-semibold ml-3">
                  4.9 / 5.0
                </span>
              </div>
            </div>

            <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-sm leading-relaxed">
              Verified Michelin Guide Selection and international critiques since our 1988 founding.
            </p>

            <a
              className="font-label-caps text-xs uppercase text-secondary tracking-widest hover:underline flex items-center gap-2 transition-all w-fit group min-h-[44px] cursor-pointer"
              href="#reservations"
            >
              <span>Read all accolades & press</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Right Side: 3D Infinite Upward Marquee Wall (7 cols) */}
          <div className="lg:col-span-7 relative h-[640px] sm:h-[680px] overflow-hidden max-w-full flex items-center">

            {/* Gradient masks fading TOP, BOTTOM, and LEFT smoothly, right edge bleeds off-screen */}
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                perspective: '1200px',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            >
              <div
                className="w-full grid grid-cols-2 md:grid-cols-3 gap-5"
                style={{
                  transform: 'rotateY(-12deg) rotateX(6deg)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
              >

                {/* Column 1: Infinite Upward (speed 40s) */}
                <div className="marquee-col flex flex-col gap-5 will-change-transform animate-marquee-up-40 hover:[animation-play-state:paused]">
                  {[...col1Cards, ...col1Cards].map((card, idx) => (
                    <CardItem key={`c1-${idx}`} card={card} />
                  ))}
                </div>

                {/* Column 2: Infinite Counter Movement Downward (speed 55s) */}
                <div className="marquee-col flex flex-col gap-5 will-change-transform animate-marquee-down-55 hover:[animation-play-state:paused]">
                  {[...col2Cards, ...col2Cards].map((card, idx) => (
                    <CardItem key={`c2-${idx}`} card={card} />
                  ))}
                </div>

                {/* Column 3: Infinite Upward (speed 48s) */}
                <div className="marquee-col hidden md:flex flex-col gap-5 will-change-transform animate-marquee-up-48 hover:[animation-play-state:paused]">
                  {[...col3Cards, ...col3Cards].map((card, idx) => (
                    <CardItem key={`c3-${idx}`} card={card} />
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
