import { useEffect, useState } from 'react'

/** True once the page is scrolled beyond `threshold` px. */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

/** Returns normalized scroll progress from 0 to 1. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      const next = Math.min(1, Math.max(0, window.scrollY / docHeight))
      setProgress(next)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}

/** Reactive prefers-reduced-motion media query hook. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** Detects desktop fine pointer without touch primary input. */
export function useFinePointer() {
  const [pointer, setPointer] = useState({ isTouch: false, isFinePointer: false })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setPointer({
        isTouch,
        isFinePointer: mq.matches,
      })
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return pointer
}

/** Returns the id of the section currently in the middle band of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
        else if (window.scrollY < 200) setActive(null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

