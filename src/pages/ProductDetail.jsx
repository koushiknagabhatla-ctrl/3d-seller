import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Star, Truck, Move3D } from 'lucide-react'
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
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(20px, 3vw, 40px)' }}>
        {/* breadcrumb */}
        <nav style={{ fontSize: '0.82rem', color: 'var(--ink-60)', marginBottom: 'clamp(18px, 3vw, 30px)' }} aria-label="Breadcrumb">
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
            className="card-surface"
            style={{ position: 'relative', aspectRatio: '1 / 1', maxHeight: '78vh' }}
          >
            {product.image && !modelSrc(product) ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
          </motion.div>

          {/* ---------- INFO ---------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="label">{product.category}</span>
                {product.badge && (
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: '#000',
                      color: '#f7f1e5',
                      padding: '5px 12px',
                      borderRadius: 999,
                    }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)' }}>{product.name}</h1>
              <p className="serif-accent" style={{ fontSize: '1.35rem', color: 'var(--ink-60)', marginTop: 6 }}>
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
              <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatPrice(product.price)}</span>
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

            {/* specs */}
            <div style={{ borderTop: '1px solid var(--ink-12)' }}>
              {[
                ['Material', product.material],
                ['Dimensions', product.dimensions],
                ['Print time', product.printTime],
                ['Made', 'To order, ships in 3–5 days'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '13px 0',
                    borderBottom: '1px solid var(--ink-06)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span style={{ color: 'var(--ink-60)' }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

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
          </div>
        </div>

        {/* ---------- RELATED ---------- */}
        {related.length > 0 && (
          <section style={{ marginTop: 'clamp(70px, 10vw, 130px)' }}>
            <Reveal>
              <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', marginBottom: 'clamp(24px, 4vw, 40px)' }}>
                You may also <span className="serif-accent">like</span>
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

      <style>{`
        .pd-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(28px, 5vw, 72px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .pd-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
