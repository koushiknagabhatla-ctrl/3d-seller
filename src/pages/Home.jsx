import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { products } from '../data/products.js'

gsap.registerPlugin(ScrollTrigger)

const chars = (text) =>
  text.split('').map((c, i) => (
    <span key={i} className="hc">
      {c === ' ' ? ' ' : c}
    </span>
  ))

export default function Home() {
  const root = useRef(null)
  const heroRef = useRef(null)
  const heroProduct = products[0]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // hero — per-letter masked rise
      gsap.fromTo(
        '.hc',
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.02, delay: 0.15 }
      )
      // right-side photo — clip reveal upward, then slow parallax on scroll
      gsap.fromTo(
        '.hero-media',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.15, ease: 'power4.out', delay: 0.45 }
      )
      gsap.fromTo(
        '.hero-media img',
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        }
      )
      gsap.fromTo(
        '.hero-fade',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1, delay: 0.9 }
      )

      // hero — scrub parallax out
      gsap.to('.hero-inner', {
        yPercent: 14,
        autoAlpha: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // scroll-linked word reveal — words brighten one by one as you scroll
      gsap.utils.toArray('.scroll-words').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.sw'),
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 40%', scrub: true },
          }
        )
      })

      // generic scroll reveals
      gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div className="page">
      <div ref={root}>
        {/* ---------- HERO ---------- */}
        <section ref={heroRef} className="hero">
          <div className="container hero-inner">
            <div className="hero-left">
              <p className="label hero-fade">3D printed objects · Made to order</p>

              <h1 className="hero-title" aria-label="Sculptural objects in layers">
                <span className="hero-line">{chars('Sculptural')}</span>
                <span className="hero-line">{chars('objects in')}</span>
                <span className="hero-line hero-line-accent">{chars('layers.')}</span>
              </h1>

              <p className="hero-sub hero-fade">
                Every FORMA piece starts as a digital form and is printed to order — inspect it in interactive 3D
                before it exists, then have it made for you.
              </p>

              <div className="scroll-explore hero-fade" aria-hidden="true">
                <span className="scroll-text">Scroll</span>
                <span className="scroll-text scroll-text--clone">Scroll</span>
              </div>
            </div>

            <Link to={`/product/${heroProduct.id}`} className="hero-media" aria-label={heroProduct.name}>
              <img src={heroProduct.image} alt={heroProduct.name} />
            </Link>
          </div>
        </section>

        {/* ---------- FULL CATALOG ---------- */}
        <section className="container" style={{ paddingTop: 'clamp(48px, 6vw, 80px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
          <SectionHead label="The collection" title="Every object, printed to order" link="/shop" />
          <div className="grid-products">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="gsap-reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(28px, 4vw, 44px)' }}>
            <Link to="/shop" className="btn btn-dark">
              View the full catalog <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ---------- CUSTOM CTA BANNER ---------- */}
        <section className="container" style={{ paddingTop: 'clamp(48px, 6vw, 80px)' }}>
          <div
            className="gsap-reveal cta-banner"
            style={{
              background: 'var(--accent)',
              color: '#fff7e6',
              borderRadius: 'var(--radius)',
              padding: 'clamp(32px, 6vw, 72px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <h2 className="display" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.6rem)', maxWidth: '18ch' }}>
              Have an idea? We'll print it.
            </h2>
            <Link to="/custom" className="btn cta-btn" style={{ background: '#fff7e6', color: '#000', fontWeight: 700 }}>
              Book a custom print <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <style>{`
          .grid-products {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
            gap: clamp(18px, 3vw, 32px);
          }

          .hero {
            min-height: calc(100svh - var(--nav-h));
            display: flex;
            position: relative;
            overflow: hidden;
          }
          .hero-inner {
            width: 100%;
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            gap: clamp(24px, 4vw, 56px);
            align-items: stretch;
            padding-block: clamp(16px, 2.5vh, 36px) clamp(20px, 3.5vh, 44px);
          }
          .hero-left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: clamp(16px, 2.5vh, 26px);
          }
          .hero-title {
            font-family: var(--display);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            line-height: 0.98;
            font-size: clamp(2.2rem, 5.2vw, 4.6rem);
          }
          .hero-line {
            display: block;
            overflow: hidden;
            padding-bottom: 0.06em;
            margin-bottom: -0.06em;
          }
          .hc {
            display: inline-block;
            will-change: transform;
          }
          .hero-line-accent .hc { color: var(--accent); }
          .hero-media {
            display: block;
            border-radius: var(--radius);
            overflow: hidden;
            min-height: clamp(320px, 62vh, 720px);
            will-change: clip-path;
          }
          .hero-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            scale: 1.12;
            transition: scale 0.7s var(--ease-out);
          }
          .hero-media:hover img {
            scale: 1.18;
          }
          .hero-sub {
            max-width: 44ch;
            color: var(--ink-60);
            font-size: 1rem;
          }
          .scroll-explore {
            width: fit-content;
            overflow: hidden;
            position: relative;
          }
          .scroll-text {
            display: block;
            font-size: clamp(0.9rem, 1.05vw, 1.05rem);
            font-weight: 500;
            letter-spacing: 0.02em;
            color: var(--accent);
            will-change: transform;
            animation: scroll-down 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          }
          .scroll-text--clone {
            position: absolute;
            top: 0;
            left: 0;
            animation-name: scroll-down-clone;
          }
          @keyframes scroll-down {
            0% { transform: translateY(0); }
            100% { transform: translateY(100%); }
          }
          @keyframes scroll-down-clone {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .scroll-text { animation: none; }
            .scroll-text--clone { display: none; }
          }
          @media (max-width: 900px) {
            .hero-inner { grid-template-columns: 1fr; }
            .hero-media { min-height: 0; aspect-ratio: 4 / 3; }
          }
          @media (max-width: 640px) {
            .hero-hide-sm { display: none; }
          }
          .sw { display: inline-block; }

          .cta-btn:hover {
            box-shadow: 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.22);
            transform: translate(-2px, -2px);
          }
        `}</style>
      </div>
    </div>
  )
}

function SectionHead({ label, title, link }) {
  return (
    <div
      className="gsap-reveal"
      style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(24px, 4vw, 40px)', gap: 16 }}
    >
      <div>
        <p className="label" style={{ marginBottom: 10, color: 'var(--accent)' }}>{label}</p>
        <h2 className="display scroll-words" style={{ fontSize: 'clamp(1.7rem, 4vw, 3rem)' }}>
          {title.split(' ').map((w, i) => (
            <span key={i}>
              <span className="sw">{w}</span>{' '}
            </span>
          ))}
        </h2>
      </div>
      <Link to={link} className="u-link" style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
        View all →
      </Link>
    </div>
  )
}
