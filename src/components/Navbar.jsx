import React, { useState, useEffect } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { MenuIcon, CloseIcon, PersonIcon } from './Icons'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isOnLight, setIsOnLight] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const bookBtnRef = useMagnetic(0.25)

  useEffect(() => {
    let prevY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY

      // Check if scrolled past top threshold
      if (currentY > 40) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Hide on scroll down, show on scroll up
      if (currentY <= 60) {
        setIsVisible(true)
      } else if (currentY > prevY + 8) {
        // Scrolling down -> hide navbar
        setIsVisible(false)
      } else if (currentY < prevY - 8) {
        // Scrolling up -> show navbar
        setIsVisible(true)
      }

      prevY = currentY

      // Adaptive Theme: Check if a light section is under the navbar
      const lightSection = document.querySelector('[data-nav-theme="light"]')
      if (lightSection) {
        const rect = lightSection.getBoundingClientRect()
        if (rect.top <= 70 && rect.bottom >= 35) {
          setIsOnLight(true)
        } else {
          setIsOnLight(false)
        }
      } else {
        setIsOnLight(false)
      }

      // Detect active section
      const sections = ['menu', 'story', 'private-dining', 'reviews', 'reservations']
      const scrollPos = currentY + 200
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? isOnLight
            ? 'nav--on-light py-0 backdrop-blur-md shadow-md'
            : 'nav--on-dark py-0 backdrop-blur-md shadow-[0_4px_24px_rgba(28,8,9,0.45)]'
          : isOnLight
            ? 'bg-[#f3ebdd]/80 backdrop-blur-[4px] border-b border-[#2a0a0c]/15 py-2'
            : 'bg-gradient-to-b from-primary-container/85 to-transparent backdrop-blur-[2px] border-b border-transparent py-2'
      }`}
    >
      <div className="h-16 sm:h-20 w-full px-4 sm:px-6 md:px-margin flex items-center justify-between max-w-full">
        {/* Left: Desktop Nav Links / Mobile Hamburger Button */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none rounded-lg hover:bg-surface-variant/30 cursor-pointer transition-colors duration-300 ${
              isOnLight ? 'text-[#2a0a0c]' : 'text-on-surface'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon className={`w-6 h-6 transition-colors duration-300 ${isOnLight ? 'text-[#2a0a0c]' : 'text-on-surface'}`} />
            ) : (
              <MenuIcon className={`w-6 h-6 transition-colors duration-300 ${isOnLight ? 'text-[#2a0a0c]' : 'text-on-surface'}`} />
            )}
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#menu"
              className={`text-xs sm:text-[13px] lg:text-[14px] font-medium uppercase tracking-[0.16em] min-h-[44px] flex items-center transition-all duration-300 cursor-pointer ${
                activeSection === 'menu'
                  ? isOnLight
                    ? 'text-[#723522] border-b-2 border-[#723522] pb-0.5'
                    : 'text-secondary border-b-2 border-secondary pb-0.5'
                  : isOnLight
                    ? 'text-[#2a0a0c]/80 hover:text-[#2a0a0c]'
                    : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Menu
            </a>
            <a
              href="#story"
              className={`text-xs sm:text-[13px] lg:text-[14px] font-medium uppercase tracking-[0.16em] min-h-[44px] flex items-center transition-all duration-300 cursor-pointer ${
                activeSection === 'story'
                  ? isOnLight
                    ? 'text-[#723522] border-b-2 border-[#723522] pb-0.5'
                    : 'text-secondary border-b-2 border-secondary pb-0.5'
                  : isOnLight
                    ? 'text-[#2a0a0c]/80 hover:text-[#2a0a0c]'
                    : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Since 1988
            </a>
            <a
              href="#private-dining"
              className={`text-xs sm:text-[13px] lg:text-[14px] font-medium uppercase tracking-[0.16em] min-h-[44px] flex items-center transition-all duration-300 cursor-pointer ${
                activeSection === 'private-dining'
                  ? isOnLight
                    ? 'text-[#723522] border-b-2 border-[#723522] pb-0.5'
                    : 'text-secondary border-b-2 border-secondary pb-0.5'
                  : isOnLight
                    ? 'text-[#2a0a0c]/80 hover:text-[#2a0a0c]'
                    : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Private Dining
            </a>
            <a
              href="#reviews"
              className={`text-xs sm:text-[13px] lg:text-[14px] font-medium uppercase tracking-[0.16em] min-h-[44px] flex items-center transition-all duration-300 cursor-pointer ${
                activeSection === 'reviews'
                  ? isOnLight
                    ? 'text-[#723522] border-b-2 border-[#723522] pb-0.5'
                    : 'text-secondary border-b-2 border-secondary pb-0.5'
                  : isOnLight
                    ? 'text-[#2a0a0c]/80 hover:text-[#2a0a0c]'
                    : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Reviews
            </a>
          </nav>
        </div>

        {/* Brand Logo - Center */}
        <a
          href="#"
          className="flex flex-col items-center justify-center text-center select-none group px-2 cursor-pointer transition-colors duration-300"
        >
          <span
            className={`font-headline-sm text-lg sm:text-headline-sm uppercase tracking-[0.16em] transition-colors duration-300 whitespace-nowrap ${
              isOnLight
                ? 'text-[#2a0a0c] group-hover:text-[#723522]'
                : 'text-on-surface group-hover:text-primary-fixed'
            }`}
          >
            L'Ambroisie
          </span>
          <span
            className={`font-label-caps-sm text-[8px] sm:text-label-caps-sm uppercase tracking-[0.25em] -mt-0.5 transition-colors duration-300 ${
              isOnLight ? 'text-[#723522]' : 'text-on-surface-variant'
            }`}
          >
            Paris
          </span>
        </a>

        {/* Right CTA & Phone */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <a
            className={`text-xs sm:text-[13px] uppercase transition-colors duration-300 tracking-widest hidden lg:inline-flex min-h-[44px] items-center cursor-pointer ${
              isOnLight
                ? 'text-[#2a0a0c]/80 hover:text-[#2a0a0c]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            href="tel:+33142965627"
          >
            +33 1 42 96 56 27
          </a>
          <div ref={bookBtnRef} className="magnetic-btn">
            <a
              className={`text-[11px] sm:text-xs font-medium uppercase px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-300 tracking-widest min-h-[44px] flex items-center justify-center shadow-sm cursor-pointer whitespace-nowrap ${
                isOnLight
                  ? 'border-[#2a0a0c]/40 text-[#2a0a0c] hover:bg-[#2a0a0c] hover:text-[#f3ebdd]'
                  : 'border-secondary/40 text-on-surface hover:bg-secondary hover:text-on-secondary'
              }`}
              href="#reservations"
            >
              Book a Table
            </a>
          </div>
          <div
            className={`w-8 h-8 rounded-full hidden sm:flex items-center justify-center shadow-md cursor-pointer hover:brightness-110 transition-all duration-300 shrink-0 ${
              isOnLight ? 'bg-[#2a0a0c] text-[#f3ebdd]' : 'bg-primary text-on-primary'
            }`}
          >
            <PersonIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 py-4 flex flex-col gap-1 shadow-2xl backdrop-blur-xl border-b transition-colors duration-300 ${
            isOnLight
              ? 'bg-[#f3ebdd]/98 border-[#2a0a0c]/20 text-[#2a0a0c]'
              : 'bg-primary-container/98 border-surface-container-highest text-on-surface'
          }`}
        >
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm uppercase tracking-widest min-h-[48px] flex items-center border-b cursor-pointer ${
              isOnLight ? 'border-[#2a0a0c]/15 text-[#2a0a0c]' : 'border-surface-container-highest/40 text-on-surface'
            }`}
          >
            Menu
          </a>
          <a
            href="#story"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm uppercase tracking-widest min-h-[48px] flex items-center border-b cursor-pointer ${
              isOnLight ? 'border-[#2a0a0c]/15 text-[#2a0a0c]' : 'border-surface-container-highest/40 text-on-surface'
            }`}
          >
            Since 1988
          </a>
          <a
            href="#private-dining"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm uppercase tracking-widest min-h-[48px] flex items-center border-b cursor-pointer ${
              isOnLight ? 'border-[#2a0a0c]/15 text-[#2a0a0c]' : 'border-surface-container-highest/40 text-on-surface'
            }`}
          >
            Private Dining
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm uppercase tracking-widest min-h-[48px] flex items-center border-b cursor-pointer ${
              isOnLight ? 'border-[#2a0a0c]/15 text-[#2a0a0c]' : 'border-surface-container-highest/40 text-on-surface'
            }`}
          >
            Reviews
          </a>
          <a
            href="#reservations"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm uppercase tracking-widest text-secondary min-h-[48px] flex items-center border-b border-surface-container-highest/40 cursor-pointer"
          >
            Book a Table
          </a>
          <a
            href="tel:+33142965627"
            className="font-body-sm text-secondary tracking-widest min-h-[48px] flex items-center pt-1 cursor-pointer"
          >
            +33 1 42 96 56 27
          </a>
        </div>
      )}
    </header>
  )
}
