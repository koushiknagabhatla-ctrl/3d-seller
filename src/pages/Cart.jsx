import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { SplitReveal } from '../components/Reveal.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCart } from '../store/cart.js'
import { getProduct, formatPrice } from '../data/products.js'

export default function Cart() {
  const { items, setQty, remove } = useCart()
  const navigate = useNavigate()

  const lines = items.map((i) => ({ ...i, product: getProduct(i.id) })).filter((l) => l.product)
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0)
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(30px, 5vw, 60px)' }}>
        <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)', marginBottom: 'clamp(28px, 5vw, 56px)' }}>
          <SplitReveal text="Your" /> <span className="serif-accent"><SplitReveal text="cart" delay={0.1} /></span>
        </h1>

        {lines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
            <p className="serif-accent" style={{ fontSize: '2rem', marginBottom: 10 }}>Nothing here yet</p>
            <p style={{ color: 'var(--ink-60)', marginBottom: 28 }}>Find an object worth living with.</p>
            <Link to="/shop" className="btn btn-dark">Browse the shop <ArrowRight size={17} /></Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.div
                    key={l.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'flex',
                      gap: 'clamp(14px, 3vw, 28px)',
                      padding: 'clamp(18px, 3vw, 28px) 0',
                      borderBottom: '1px solid var(--ink-12)',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/product/${l.id}`} className="card-surface" style={{ width: 'clamp(90px, 14vw, 140px)', flexShrink: 0 }}>
                      <ProductVisual product={l.product} />
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/product/${l.id}`}>
                        <p style={{ fontWeight: 600, fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>{l.product.name}</p>
                      </Link>
                      <p style={{ fontSize: '0.85rem', color: 'var(--ink-60)', marginTop: 2 }}>{l.product.material}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink-12)', borderRadius: 999 }}>
                          <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease" style={{ padding: '8px 13px' }}><Minus size={14} /></button>
                          <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center', fontSize: '0.9rem' }}>{l.qty}</span>
                          <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase" style={{ padding: '8px 13px' }}><Plus size={14} /></button>
                        </div>
                        <button onClick={() => remove(l.id)} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.82rem', opacity: 0.6 }}>
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.2rem)', whiteSpace: 'nowrap' }}>
                      {formatPrice(l.product.price * l.qty)}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* summary */}
            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#000',
                color: '#f7f1e5',
                borderRadius: 'var(--radius)',
                padding: 'clamp(24px, 4vw, 40px)',
                height: 'fit-content',
                position: 'sticky',
                top: 'calc(var(--nav-h) + 20px)',
              }}
            >
              <p className="display" style={{ fontSize: '1.3rem', marginBottom: 24 }}>Order summary</p>
              <Row k="Subtotal" v={formatPrice(subtotal)} />
              <Row k="Shipping" v={shipping === 0 ? 'Free' : formatPrice(shipping)} />
              <Row k="Taxes" v="Included" />
              <div style={{ borderTop: '1px solid rgba(247,241,229,0.2)', margin: '18px 0', paddingTop: 18, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: '1.3rem' }}>{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-block"
                style={{ background: '#f7f1e5', color: '#000', fontWeight: 700 }}
              >
                Proceed to checkout <ArrowRight size={17} />
              </button>
              <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: '0.85rem', textDecoration: 'underline', opacity: 0.7 }}>
                Continue shopping
              </Link>
            </motion.aside>
          </div>
        )}
      </div>

      <style>{`
        .cart-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: clamp(28px, 5vw, 64px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
          .cart-grid aside { position: static !important; }
        }
      `}</style>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.92rem' }}>
      <span style={{ opacity: 0.65 }}>{k}</span>
      <span style={{ fontWeight: 600 }}>{v}</span>
    </div>
  )
}
