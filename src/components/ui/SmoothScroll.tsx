import Lenis from 'lenis'
import { useEffect } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useScroll'

declare global {
  interface Window {
    __evaLenis?: Lenis
  }
}

/**
 * Smooth inertial wheel & anchor scrolling powered by Lenis (same curve & duration as ekyamuhammad.com).
 * Automatically disabled when the user prefers reduced motion.
 */
export function SmoothScroll() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.__evaLenis = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Intercept anchor links (#section) for unified smooth scrolling with navbar offset
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }
      const target = e.target as Element | null
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      if (href === '#top') {
        e.preventDefault()
        lenis.scrollTo(0, { duration: 1.2 })
        window.history.pushState(null, '', href)
        return
      }

      const id = href.slice(1)
      const section = document.getElementById(id)
      if (!section) return

      e.preventDefault()
      lenis.scrollTo(section, {
        offset: -84,
        duration: 1.2,
      })
      window.history.pushState(null, '', href)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete window.__evaLenis
    }
  }, [reducedMotion])

  return null
}

