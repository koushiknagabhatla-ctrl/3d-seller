import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Star, Truck, Move3D, Layers, Ruler, Clock, ChevronDown } from 'lucide-react'

const ACCORDIONS = [
  [
    'Shipping & delivery',
    'Printed to order and dispatched in 3–5 working days. Free shipping on orders over ₹1,999, flat ₹99 below that. A tracking link is emailed the moment your order ships.',
  ],
  [
    'Care instructions',
    'Wipe with a dry or slightly damp cloth. Keep away from open flame and long hours of direct sunlight. PLA-based prints are recyclable — return old pieces to us for a discount on your next order.',
  ],
]

const PAIRINGS = {
  Decor: ['Shelf styling', 'Console tables', 'Gifting'],
  Lighting: ['Bedside', 'Living room', 'Studio'],
  Desk: ['Workspace', 'Home office', 'Gifting'],
  Living: ['Coffee table', 'Kitchen', 'Entryway'],
}
import Reveal from '../components/Reveal.jsx'
import ModelViewer from '../components/ModelViewer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getProduct, products, formatPrice, modelSrc } from '../data/products.js'
import { useCart } from '../store/cart.js'
import NotFound from './NotFound.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProduct(id)
  const navigate = useNavigate()
  const add = useCart((s) => s.add)
  const openDrawer = useCart((s) => s.openDrawer)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [view, setView] = useState('photo')
  const [openAcc, setOpenAcc] = useState(null)

  if (!product) return <NotFound />

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0

  const addToCart = () => {
    add(product.id, qty)
    setAdded(true)
    openDrawer()
    setTimeout(() => setAdded(false), 1600)
  }

  const buyNow = () => {
    add(product.id, qty)
    navigate('/checkout')
  }

  return (
    <div className="page pd-page">
      <div className="container" style={{ paddingTop: 'clamp(8px, 1.2vw, 16px)' }}>
        {/* breadcrumb */}
        <nav style={{ fontSize: '0.82rem', color: 'var(--ink-60)', marginBottom: 'clamp(10px, 1.6vw, 18px)' }} aria-label="Breadcrumb">
          <Link to="/" className="u-link">Home</Link> <span style={{ margin: '0 8px' }}>/</span>
          <Link to="/shop" className="u-link">Shop</Link> <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#000' }}>{product.name}</span>
        </nav>

        <div className="pd-grid">
          {/* ---------- 3D VIEWER ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="card-surface pd-media"
            style={{ position: 'relative', aspectRatio: '1 / 1', maxHeight: '62vh' }}
          >
            {product.image && !modelSrc(product) && view === 'photo' ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <>
                <ModelViewer product={product} modelUrl={modelSrc(product)} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(247,241,229,0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    pointerEvents: 'none',
                  }}
                >
                  <Move3D size={15} /> Drag to rotate · Pinch to zoom
                </div>
                {!modelSrc(product) && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-40)',
                      pointerEvents: 'none',
                    }}
                  >
                    3D preview
                  </span>
                )}
              </>
            )}

            {product.image && !modelSrc(product) && (
              <div className="media-toggle" style={{ position: 'absolute', top: 14, left: 14, zIndex: 5 }}>
                {[
                  ['photo', 'Photo'],
                  ['3d', '3D view'],
                ].map(([id, labelText]) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={view === id ? 'media-toggle-on' : ''}
                    aria-pressed={view === id}
                  >
                    {labelText}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ---------- INFO ---------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                <span className="label">{product.category}</span>
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3.3rem)' }}>{product.name}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--ink-60)', marginTop: 6 }}>
                {product.tagline}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={i < Math.round(product.rating) ? '#000' : 'none'} strokeWidth={1.5} />
                ))}
              </span>
              <span style={{ fontWeight: 600 }}>{product.rating}</span>
              <span style={{ color: 'var(--ink-60)' }}>({product.reviews} reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatPrice(product.price)}</span>
              {product.compareAt && (
                <>
                  <span style={{ fontSize: '1.15rem', color: 'var(--ink-40)', textDecoration: 'line-through' }}>
                    {formatPrice(product.compareAt)}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a7a3a' }}>{discount}% off</span>
                </>
              )}
            </div>

            <p style={{ color: 'var(--ink-60)', lineHeight: 1.7 }}>{product.description}</p>

            {/* qty + actions */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--ink)',
                  borderRadius: 999,
                  height: 54,
                }}
              >
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" style={{ padding: '0 18px', height: '100%' }}>
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" style={{ padding: '0 18px', height: '100%' }}>
                  <Plus size={16} />
                </button>
              </div>
              <motion.button
                onClick={addToCart}
                className="btn btn-ghost"
                style={{ flex: 1, minWidth: 160, height: 54 }}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={added ? 'added' : 'add'}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {added ? 'Added ✦' : 'Add to cart'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <button onClick={buyNow} className="btn btn-dark" style={{ flex: 1, minWidth: 160, height: 54 }}>
                Buy now
              </button>
            </div>

            {/* trust row */}
            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--ink-60)' }}>
              <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><Truck size={15} /> Free shipping over ₹1,999</span>
            </div>

            {/* spec chips */}
            <div className="spec-chips">
              {[
                [Layers, 'Material', product.material],
                [Ruler, 'Size', product.dimensions],
                [Clock, 'Print time', product.printTime],
              ].map(([Icon, k, v]) => (
                <div key={k} className="spec-chip">
                  <Icon size={18} strokeWidth={1.6} color="var(--accent)" />
                  <span className="label" style={{ fontSize: '0.6rem' }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* how it's printed */}
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: '18px 20px', display: 'grid', gap: 8 }}>
              <p className="label" style={{ color: 'var(--accent)' }}>How it's printed</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.88rem', fontWeight: 600 }}>
                <span>0.12 mm layers</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>15% infill</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>Hand-sanded finish</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-60)' }}>Printed to order · Ships in 3–5 days</p>
            </div>

            {/* pairings */}
            {PAIRINGS[product.category] && (
              <div>
                <p className="label" style={{ marginBottom: 10 }}>Works well with</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PAIRINGS[product.category].map((t) => (
                    <span
                      key={t}
                      style={{
                        border: '1px solid var(--ink-12)',
                        borderRadius: 999,
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* accordions */}
            <div style={{ borderTop: '1px solid var(--ink-12)' }}>
              {ACCORDIONS.map(([t, body], i) => (
                <div key={t} style={{ borderBottom: '1px solid var(--ink-06)' }}>
                  <button
                    onClick={() => setOpenAcc(openAcc === i ? null : i)}
                    aria-expanded={openAcc === i}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px 0',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    {t}
                    <ChevronDown
                      size={17}
                      style={{ transform: openAcc === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openAcc === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ paddingBottom: 16, fontSize: '0.9rem', color: 'var(--ink-60)', lineHeight: 1.65 }}>
                          {body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- RELATED ---------- */}
        {related.length > 0 && (
          <section style={{ marginTop: 'clamp(70px, 10vw, 130px)' }}>
            <Reveal>
              <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', marginBottom: 'clamp(24px, 4vw, 40px)' }}>
                More from the <span className="serif-accent">collection</span>
              </h2>
            </Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
                gap: 'clamp(18px, 3vw, 32px)',
              }}
            >
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* mobile sticky buy bar */}
      <div className="buy-bar">
        <div>
          <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{formatPrice(product.price)}</p>
          {product.compareAt && (
            <p style={{ fontSize: '0.72rem', color: 'var(--ink-40)', textDecoration: 'line-through' }}>
              {formatPrice(product.compareAt)}
            </p>
          )}
        </div>
        <button onClick={addToCart} className="btn btn-ghost" style={{ flex: 1, padding: '13px 14px' }}>
          Add to cart
        </button>
        <button onClick={buyNow} className="btn btn-dark" style={{ flex: 1, padding: '13px 14px' }}>
          Buy now
        </button>
      </div>

      <style>{`
        .pd-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: clamp(28px, 5vw, 64px);
          align-items: start;
        }
        .spec-chips {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }
        .spec-chip {
          background: var(--white);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          transition: box-shadow 0.35s var(--ease-out), transform 0.35s var(--ease-out);
        }
        .spec-chip:hover {
          box-shadow: 0.35rem 0.35rem 0 rgba(0, 0, 0, 0.12);
          transform: translate(-2px, -2px);
        }
        .media-toggle {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          gap: 4px;
          background: rgba(247,241,229,0.9);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 4px;
        }
        .media-toggle button {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: background 0.3s, color 0.3s;
        }
        .media-toggle .media-toggle-on {
          background: var(--accent);
          color: #fff;
        }
        .buy-bar { display: none; }
        @media (min-width: 901px) {
          .pd-media {
            position: sticky;
            top: calc(var(--nav-h) + 16px);
          }
        }
        @media (max-width: 900px) {
          .pd-grid { grid-template-columns: 1fr; }
          .pd-page { padding-bottom: 110px; }
          .buy-bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 800;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px var(--pad);
            background: rgba(247,241,229,0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top: 1px solid var(--ink-12);
          }
        }
      `}</style>
    </div>
  )
}
