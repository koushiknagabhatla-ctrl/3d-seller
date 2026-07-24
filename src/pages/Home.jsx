import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { products } from '../data/products.js'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const root = useRef(null)
  const heroRef = useRef(null)

  const bestsellers = products.filter((p) => p.badge === 'Bestseller').slice(0, 4)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // hero — staggered line entrance
      gsap.fromTo(
        '.hero-line-inner',
        { yPercent: 115 },
        { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.12, delay: 0.1 }
      )
      gsap.fromTo(
        '.hero-fade',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1, delay: 0.55 }
      )
      // hero — scrub parallax out
      gsap.to('.hero-inner', {
        yPercent: 12,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
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
        {/* ---------- HERO — centered, product stage as focal point ---------- */}
        <section ref={heroRef} className="hero">
          <div className="container hero-inner">
            <div className="hero-center">
              <p className="label hero-fade" style={{ marginBottom: 16 }}>
                3D printed objects · Made to order
              </p>
              <h1 className="hero-title display">
                <span className="hero-line">
                  <span className="hero-line-inner">Sculptural objects,</span>
                </span>
                <span className="hero-line">
                  <span className="hero-line-inner">
                    engineered in <span style={{ color: 'var(--accent)' }}>layers.</span>
                  </span>
                </span>
              </h1>
              <p className="hero-fade hero-sub">
                Every FORMA piece starts as a digital form and is printed to order — inspect it in interactive 3D
                before it exists, then have it made for you.
              </p>
              <div className="hero-fade hero-ctas">
                <Link to="/shop" className="btn btn-dark">
                  Explore the catalog <ArrowRight size={17} />
                </Link>
                <Link to="/custom" className="btn btn-ghost">
                  Book a custom print
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURED ---------- */}
        <section className="container" style={{ paddingTop: 'clamp(48px, 6vw, 80px)', paddingBottom: 'clamp(24px, 3vw, 40px)' }}>
          <SectionHead label="Featured" title="Most wanted objects" link="/shop" />
          <div className="grid-products">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>

        {/* ---------- FULL CATALOG ---------- */}
        <section className="container" style={{ paddingTop: 'clamp(32px, 4vw, 56px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
          <SectionHead label="The collection" title="Every object, printed to order" link="/shop" />
          <div className="grid-products">
            {products.filter((p) => p.badge !== 'Bestseller').map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="gsap-reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(28px, 4vw, 44px)' }}>
            <Link to="/shop" className="btn btn-dark">
              View the full catalog <ArrowRight size={17} />
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
            display: flex;
            align-items: stretch;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid var(--ink-12);
          }
          .hero-inner {
            display: flex;
            flex-direction: column;
            gap: clamp(32px, 5vw, 56px);
            padding-block: clamp(40px, 6vw, 72px) clamp(40px, 5vw, 64px);
          }
          .hero-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .hero-title {
            font-size: clamp(2.6rem, 7.5vw, 6.2rem);
            max-width: 16ch;
          }
          .hero-line {
            display: block;
            overflow: hidden;
            padding-bottom: 0.08em;
            margin-bottom: -0.08em;
          }
          .hero-line-inner {
            display: inline-block;
            will-change: transform;
          }
          .hero-sub {
            max-width: 52ch;
            color: var(--ink-60);
            font-size: 1.05rem;
            margin: 20px 0 28px;
          }
          .hero-ctas {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            justify-content: center;
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
        <h2 className="display" style={{ fontSize: 'clamp(1.7rem, 4vw, 3rem)' }}>{title}</h2>
      </div>
      <Link to={link} className="u-link" style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
        View all →
      </Link>
    </div>
  )
}
