import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lenis smooth scrolling driven by GSAP's ticker, kept in sync with
// ScrollTrigger. Resets scroll position (and refreshes triggers) on route change.
export default function SmoothScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    // let the new page mount before measuring trigger positions
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}
