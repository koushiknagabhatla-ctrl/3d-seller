import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../store/cart.js'
import { getProduct, formatPrice } from '../data/products.js'
import ProductVisual from './ProductVisual.jsx'

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.toggle('no-scroll', drawerOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [drawerOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeDrawer()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  const lines = items
    .map((i) => ({ ...i, product: getProduct(i.id) }))
    .filter((l) => l.product)
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0)

  const goCheckout = () => {
    closeDrawer()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeDrawer}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 950, backdropFilter: 'blur(3px)' }}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(440px, 100vw)',
              background: 'var(--bg)',
              zIndex: 960,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 24px',
                borderBottom: '1px solid var(--ink-12)',
              }}
            >
              <p className="display" style={{ fontSize: '1.15rem' }}>
                Cart <span className="serif-accent" style={{ opacity: 0.6 }}>({lines.length})</span>
              </p>
              <button onClick={closeDrawer} aria-label="Close cart" style={{ padding: 8 }}>
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
              {lines.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80 }}>
                  <p className="serif-accent" style={{ fontSize: '1.6rem', marginBottom: 8 }}>Your cart is empty</p>
                  <p style={{ color: 'var(--ink-60)', fontSize: '0.9rem', marginBottom: 24 }}>
                    Objects worth holding are one click away.
                  </p>
                  <Link to="/shop" onClick={closeDrawer} className="btn btn-dark">
                    Browse the shop
                  </Link>
                </div>
              ) : (
                lines.map((l, i) => (
                  <motion.div
                    key={l.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '18px 0',
                      borderBottom: '1px solid var(--ink-06)',
                    }}
                  >
                    <Link
                      to={`/product/${l.id}`}
                      onClick={closeDrawer}
                      className="card-surface"
                      style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 14 }}
                    >
                      <ProductVisual product={l.product} />
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{l.product.name}</p>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatPrice(l.product.price * l.qty)}</p>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--ink-60)', marginTop: 2 }}>{l.product.material}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--ink-12)',
                            borderRadius: 999,
                          }}
                        >
                          <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease quantity" style={{ padding: '7px 11px' }}>
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, minWidth: 18, textAlign: 'center' }}>{l.qty}</span>
                          <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase quantity" style={{ padding: '7px 11px' }}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => remove(l.id)} aria-label={`Remove ${l.product.name}`} style={{ padding: 6, opacity: 0.55 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {lines.length > 0 && (
              <div style={{ padding: 24, borderTop: '1px solid var(--ink-12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--ink-60)' }}>Subtotal</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(subtotal)}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-60)', marginBottom: 16 }}>
                  {subtotal >= 1999 ? 'Free shipping unlocked ✦' : `Add ${formatPrice(1999 - subtotal)} more for free shipping`}
                </p>
                <button onClick={goCheckout} className="btn btn-dark btn-block">
                  Checkout
                </button>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: '0.88rem', textDecoration: 'underline' }}
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
