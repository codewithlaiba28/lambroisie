import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    // Touch screen / mobile / reduced motion check
    if (window.matchMedia('(pointer: coarse)').matches || 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let cursorX = mouseX
    let cursorY = mouseY
    let followerX = mouseX
    let followerY = mouseY

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursor.style.opacity === '0') {
        cursor.style.opacity = '1'
        follower.style.opacity = '1'
      }
    }

    const onMouseLeave = () => {
      cursor.style.opacity = '0'
      follower.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    // Smooth render loop
    const ticker = gsap.ticker.add(() => {
      cursorX += (mouseX - cursorX) * 0.5
      cursorY += (mouseY - cursorY) * 0.5
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`

      followerX += (mouseX - followerX) * 0.18
      followerY += (mouseY - followerY) * 0.18
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`
    })

    // Hover detection for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, .cursor-pointer, .cursor-hover')
      if (target) {
        cursor.classList.add('scale-150', 'bg-secondary')
        follower.classList.add('scale-150', 'border-secondary', 'bg-secondary/15')
      }
    }

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, .cursor-pointer, .cursor-hover')
      if (target) {
        cursor.classList.remove('scale-150', 'bg-secondary')
        follower.classList.remove('scale-150', 'border-secondary', 'bg-secondary/15')
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <>
      {/* Central pinpoint */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-secondary pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out hidden md:block opacity-0"
        style={{ willChange: 'transform' }}
      />
      {/* Outer elegant halo ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-secondary/50 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out hidden md:block opacity-0 backdrop-blur-[1px]"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
