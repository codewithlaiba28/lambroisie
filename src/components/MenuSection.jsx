import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

// Single source of truth data array for all tabs with synced text, prices, images, captions and alts
const menuData = {
  'Pre-Concert': [
    {
      id: 0,
      title: 'Prélude Gourmand',
      price: '€65',
      description: 'Velouté soyeux de cèpes d’automne à la truffe noire d’hiver, gougères tièdes au Comté 24 mois.',
      image: '/images/menu_entree.jpg',
      alt: 'Velouté de cèpes à la truffe et gougères chaudes au Comté',
      caption: {
        eyebrow: 'Prélude de Saison',
        dishName: 'Velouté de Cèpes & Gougères au Comté',
        note: 'Service cadencé en 45 minutes avant l’Opéra'
      }
    },
    {
      id: 1,
      title: 'Plat Signature Rapide',
      price: '€95',
      description: 'Canard de Challans rôti aux mûres sauvages, mousseline de panais truffée et réduction au cassis.',
      image: '/images/screen2_plated_dish.png',
      alt: 'Canard de Challans aux mûres sauvages et mousseline',
      caption: {
        eyebrow: 'Plat Signature',
        dishName: 'Canard de Challans aux Mûres Sauvages',
        note: 'Accord sommelier Bourgueil Grand Mont inclus'
      }
    },
    {
      id: 2,
      title: 'Finale en Douceur',
      price: '€35',
      description: 'Tartelette chaude au chocolat Valrhona grand cru, crème glacée à la fève tonka et café d’Éthiopie.',
      image: '/images/menu_dessert.jpg',
      alt: 'Tartelette au chocolat Valrhona et mignardises de haute chocolaterie',
      caption: {
        eyebrow: 'Douceur Minute',
        dishName: 'Tartelette Valrhona & Café Grand Cru',
        note: 'Pâtisserie minute dressée à la commande'
      }
    }
  ],
  'Lunch': [
    {
      id: 0,
      title: 'Les Entrées du Midi',
      price: '€75',
      description: 'Velouté délicat de champignons des sous-bois, lamelles de truffe noire et brioche feuilletée dorée.',
      image: '/images/menu_entree.jpg',
      alt: 'Velouté soyeux de champignons des bois et truffe noire',
      caption: {
        eyebrow: 'Entrée Fraîcheur',
        dishName: 'Velouté de Sous-Bois & Truffe Noire',
        note: 'Sélection maraîchère biologique d’Île-de-France'
      }
    },
    {
      id: 1,
      title: 'Les Plats de Saison',
      price: '€115',
      description: 'Filet de turbot sauvage rôti au beurre noisette, mousseline d’artichauts et émulsion au Vin Jaune.',
      image: '/images/screen2_plated_dish.png',
      alt: 'Filet de turbot sauvage rôti au beurre noisette',
      caption: {
        eyebrow: 'Plat de Saison',
        dishName: 'Turbot Sauvage au Vin Jaune',
        note: 'Pêche artisanale côtière bretonne de petit bateau'
      }
    },
    {
      id: 2,
      title: 'Douceurs Légères',
      price: '€40',
      description: 'Soufflé minute au Grand Marnier et fruits confits d’Apt, sorbet rafraîchissant aux agrumes de Menton.',
      image: '/images/menu_dessert.jpg',
      alt: 'Soufflé minute au Grand Marnier et sorbet agrumes',
      caption: {
        eyebrow: 'Dessert du Chef',
        dishName: 'Soufflé Minute & Sorbet Agrumes',
        note: 'Création légère de notre chef pâtissier'
      }
    }
  ],
  'Dinner': [
    {
      id: 0,
      title: 'Les Entrées',
      price: '€95',
      description: 'Wild mushroom velouté, foie gras poêlé, black winter truffle shaving, pain brioché toasté.',
      image: '/images/menu_entree.jpg',
      alt: 'Velouté de cèpes, foie gras poêlé et lamelles de truffe noire d’hiver',
      caption: {
        eyebrow: 'Signature Entrée',
        dishName: 'Velouté de Cèpes & Truffe Noire',
        note: 'Foie Gras Poêlé • Pain Brioché Toasté'
      }
    },
    {
      id: 1,
      title: 'Les Plats de Résistance',
      price: '€160',
      description: 'Duck magret with wild blackberry gastrique, aged Wagyu ribeye en croûte de moelle, roasted Atlantic turbot bathed in Vin Jaune butter.',
      image: '/images/screen2_plated_dish.png',
      alt: 'Canard de Challans aux mûres sauvages et mousseline délicate',
      caption: {
        eyebrow: 'Signature Plat',
        dishName: 'Canard de Challans aux Mûres Sauvages',
        note: 'Recommended Sommelier Accord included'
      }
    },
    {
      id: 2,
      title: 'Les Fromages Affinés',
      price: '€45',
      description: 'Selection of artisan French cheeses from master affineurs, walnut honeycomb, toasted levain bread.',
      image: '/images/menu_cheese.jpg',
      alt: 'Plateau de fromages affinés artisanaux français avec Comté 24 mois, Brie de Meaux, Roquefort et miel aux noix',
      caption: {
        eyebrow: 'Sélection d’Exception',
        dishName: 'Plateau de Fromages de Maîtres Affineurs',
        note: 'Affinage 24 Mois • Comté, Brie de Meaux & Roquefort'
      }
    },
    {
      id: 3,
      title: 'Les Desserts & Nectars',
      price: '€50',
      description: 'Grand Marnier soufflé minute, dark Valrhona chocolate tartlet, rare vineyard honey nectar pairings.',
      image: '/images/menu_dessert.jpg',
      alt: 'Soufflé minute au Grand Marnier et tartelette au chocolat grand cru',
      caption: {
        eyebrow: 'Douceurs Impériales',
        dishName: 'Soufflé Minute Flambé au Grand Marnier',
        note: 'Accords Sauternes & Nectars de Vigne'
      }
    }
  ]
}

const TABS = ['Pre-Concert', 'Lunch', 'Dinner']

export default function MenuSection() {
  const containerRef = useRef(null)
  const listWindowRef = useRef(null)
  const listInnerRef = useRef(null)
  const imagesContainerRef = useRef(null)
  const tastingBtnRef = useMagnetic(0.2)

  // Default to Dinner (or Pre-Concert) - prompt specified tab order: PRE-CONCERT, LUNCH, DINNER
  const [activeTab, setActiveTab] = useState('Dinner')
  const [activeCategory, setActiveCategory] = useState(0)
  const activeCategoryRef = useRef(0)

  const categories = menuData[activeTab] || menuData.Dinner

  // Page Scroll Scrub Timeline: Pinned whole menu section, moves panel list translateY, NO inner scroll
  useEffect(() => {
    const container = containerRef.current
    const listInner = listInnerRef.current
    const listWindow = listWindowRef.current
    if (!container || !listInner || !listWindow) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Calculate how far the list needs to translateY inside its visible window
    const windowHeight = listWindow.offsetHeight
    const listHeight = listInner.scrollHeight
    const maxTranslate = Math.max(0, listHeight - windowHeight + 20)

    const catCount = categories.length

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=250%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        refreshPriority: 8,
        onUpdate: (self) => {
          const p = self.progress
          const stepIndex = Math.min(catCount - 1, Math.floor(p * catCount))
          if (stepIndex !== activeCategoryRef.current) {
            activeCategoryRef.current = stepIndex
            setActiveCategory(stepIndex)
          }
        }
      }
    })

    // Scrub the list up inside the panel as user scrolls the PAGE
    if (maxTranslate > 0) {
      tl.to(listInner, {
        y: -maxTranslate,
        ease: 'none',
        duration: 1
      }, 0)
    }

    return () => {
      tl.kill()
    }
  }, [activeTab, categories.length])

  // Left Image Crossfade with scale 1.08 -> 1 and clean clip-path wipe
  useEffect(() => {
    const imagesContainer = imagesContainerRef.current
    if (!imagesContainer) return

    const layers = imagesContainer.querySelectorAll('.dish-image-layer')
    layers.forEach((layer, idx) => {
      const img = layer.querySelector('img')
      if (idx === activeCategory) {
        gsap.killTweensOf([layer, img])
        gsap.set(layer, { zIndex: 10, visibility: 'visible' })
        gsap.fromTo(
          layer,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            opacity: 0.85
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out'
          }
        )
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.08 },
            { scale: 1.0, duration: 1.0, ease: 'power2.out' }
          )
        }
      } else {
        gsap.to(layer, {
          opacity: 0,
          zIndex: 1,
          duration: 0.35,
          delay: 0.2,
          onComplete: () => {
            if (idx !== activeCategoryRef.current) {
              layer.style.visibility = 'hidden'
            }
          }
        })
      }
    })
  }, [activeCategory])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setActiveCategory(0)
    activeCategoryRef.current = 0
    if (listInnerRef.current) {
      gsap.to(listInnerRef.current, { y: 0, duration: 0.4, ease: 'power2.out' })
    }
  }

  const progressStr = `0${activeCategory + 1} / 0${categories.length}`

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[560px] bg-primary-container overflow-hidden max-w-full flex items-center justify-center"
      id="menu"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-[48px] h-full flex items-center justify-center">
        {/* Inner Split Layout: calc(100svh - 96px) on desktop, min 560px, max 760px */}
        <div className="w-full h-full max-h-[calc(100svh-32px)] lg:h-[calc(100svh-96px)] lg:min-h-[560px] lg:max-h-[760px] flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-[24px] items-stretch">

          {/* Left Column: Signature Dish Photography with bottom gradient caption */}
          <div
            ref={imagesContainerRef}
            className="relative w-full h-[30svh] sm:h-[34svh] lg:h-full rounded-[16px] overflow-hidden shadow-2xl bg-surface-container-lowest border border-surface-container-highest/30 shrink-0 select-none"
          >
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="dish-image-layer absolute inset-0 w-full h-full transition-all will-change-transform"
                style={{
                  zIndex: idx === activeCategory ? 5 : 1,
                  visibility: idx === activeCategory ? 'visible' : 'hidden'
                }}
              >
                <img
                  alt={cat.alt}
                  src={cat.image}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-[16px] will-change-transform"
                />
                {/* Cinematic moody gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/95 via-primary-container/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                {/* Bottom caption padded 24px */}
                <div className="absolute bottom-0 left-0 p-4 sm:p-5 lg:p-[24px] flex flex-col gap-0.5 sm:gap-1 z-20 max-w-lg">
                  <span className="font-label-caps text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-secondary font-semibold">
                    {cat.caption.eyebrow}
                  </span>
                  <p className="font-display text-lg sm:text-[22px] lg:text-[24px] text-inverse-surface drop-shadow-md leading-snug">
                    {cat.caption.dishName}
                  </p>
                  <span className="font-body text-[11px] sm:text-xs text-on-surface-variant tracking-wider hidden sm:inline-block">
                    {cat.caption.note}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Warm Cream Panel #f3ebdd (NOT PINK, NO INNER SCROLLBAR) */}
          <div
            className="w-full flex-1 lg:h-full rounded-[16px] bg-[#f3ebdd] text-[#2a0a0c] px-5 py-4 sm:px-[28px] sm:py-[24px] lg:px-[32px] lg:py-[28px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#e2d5c3] overflow-hidden select-none"
          >
              {/* ZONE 1: Header Zone (Eyebrow, Title, Tabs, Counter) */}
              <div className="shrink-0 flex flex-col pb-3.5 border-b border-[#2a0a0c]/15">
                <span className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-[#723522] font-semibold mb-2 block">
                  Gastronomie Éternelle
                </span>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-[clamp(26px,2.6vw,38px)] text-[#2a0a0c] tracking-tight leading-none whitespace-nowrap">
                    Explore Our Menu
                  </h2>

                  {/* Right-aligned Tabs & Counter Row */}
                  <div className="flex items-center gap-2">
                    {/* Tab Pills: PRE-CONCERT, LUNCH, DINNER */}
                    <div className="flex items-center gap-1 bg-[#e5d6c2] p-1 rounded-full h-[36px]">
                      {TABS.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabClick(tab)}
                          className={`font-label-caps text-[12px] uppercase px-3 sm:px-3.5 h-[28px] rounded-full transition-all flex items-center justify-center cursor-pointer whitespace-nowrap ${
                            activeTab === tab
                              ? 'bg-[#2a0a0c] text-[#f3ebdd] font-semibold shadow-sm'
                              : 'text-[#2a0a0c] hover:text-[#723522]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Thin Progress Counter */}
                    <span className="font-mono text-[11px] tracking-widest text-[#723522] bg-[#ebdcc8] px-2.5 py-1 rounded-full border border-[#d8c5af] shrink-0 font-medium hidden sm:inline-block">
                      {progressStr}
                    </span>
                  </div>
                </div>
              </div>

              {/* ZONE 2: List Zone (flex: 1, shows ~2.5-3 items, translateY scrub, NO inner scrollbar) */}
              <div
                ref={listWindowRef}
                className="relative flex-1 overflow-hidden my-2.5"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)'
                }}
              >
                <div
                  ref={listInnerRef}
                  className="flex flex-col gap-2 py-1 will-change-transform"
                >
                  {categories.map((cat, idx) => {
                    const isActive = activeCategory === idx

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(idx)
                          activeCategoryRef.current = idx
                        }}
                        className={`rounded-xl py-[14px] px-[16px] transition-all duration-300 flex flex-col gap-1 cursor-pointer select-none ${
                          isActive
                            ? 'bg-[#ebdcc8]/80 shadow-sm opacity-100 border border-[#d8c5af]'
                            : 'opacity-40 hover:opacity-75 hover:bg-[#ebdcc8]/30 border border-transparent'
                        }`}
                      >
                        {/* Title & Price Row */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            {isActive ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#723522] shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                            )}
                            <h3
                              className={`font-display text-[20px] sm:text-[22px] tracking-wide transition-all ${
                                isActive
                                  ? 'italic font-normal text-[#2a0a0c]'
                                  : 'font-normal text-[#2a0a0c]'
                              }`}
                            >
                              {cat.title}
                            </h3>
                          </div>
                          <span
                            className={`font-display font-medium text-[18px] shrink-0 ${
                              isActive ? 'text-[#723522]' : 'text-[#2a0a0c]'
                            }`}
                          >
                            {cat.price}
                          </span>
                        </div>

                        {/* Description max 2 lines */}
                        <p className="font-body text-[13.5px] sm:text-[14px] leading-[1.5] text-[#514443] pl-4 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ZONE 3: Footer Zone (Taxes text + Request Tasting Menu CTA) */}
              <div className="shrink-0 pt-3 border-t border-[#2a0a0c]/15 flex items-center justify-between">
                <span className="font-label-caps text-[11px] uppercase tracking-widest text-[#723522]/80">
                  All taxes and service included
                </span>

                <a
                  ref={tastingBtnRef}
                  href="#reservations"
                  className="magnetic-btn font-label-caps text-[12px] uppercase text-[#723522] font-semibold tracking-widest hover:underline flex items-center gap-1 group cursor-pointer transition-all min-h-[36px]"
                >
                  <span>Request Tasting Menu</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
    </section>
  )
}
