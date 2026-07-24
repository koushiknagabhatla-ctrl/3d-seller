import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { formatPrice } from '../data/products.js'
import { useCart } from '../store/cart.js'
import ProductVisual from './ProductVisual.jsx'

export default function ProductCard({ product, index = 0 }) {
  const add = useCart((s) => s.add)
  const openDrawer = useCart((s) => s.openDrawer)

  const quickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    add(product.id)
    openDrawer()
  }

  return (
    <motion.div
      className="pcard"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.08 }}
    >
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <motion.div whileHover="hover" className="card-surface" style={{ position: 'relative' }}>
          <motion.div
            variants={{ hover: { scale: 1.06, rotate: -1.5 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ aspectRatio: '1 / 1' }}
          >
            <ProductVisual product={product} />
          </motion.div>

          <motion.button
            onClick={quickAdd}
            aria-label={`Add ${product.name} to cart`}
            variants={{ hover: { opacity: 1, y: 0 } }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="quick-add"
            style={{
              position: 'absolute',
              right: 14,
              bottom: 14,
              zIndex: 2,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} strokeWidth={2} />
          </motion.button>
        </motion.div>

        <div style={{ padding: '14px 4px 0', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>
              {product.category}
            </p>
            <p style={{ fontWeight: 600, fontSize: '0.98rem', letterSpacing: '-0.01em' }}>{product.name}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-60)', marginTop: 2 }}>{product.tagline}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-60)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={12} fill="currentColor" strokeWidth={0} /> {product.rating} · {product.reviews} reviews
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 600 }}>{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-40)', textDecoration: 'line-through' }}>
                {formatPrice(product.compareAt)}
              </p>
            )}
          </div>
        </div>
      </Link>

      <style>{`
        .pcard:hover .card-surface {
          box-shadow: 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.14);
          transform: translate(-3px, -3px);
        }
        @media (hover: none) {
          .quick-add { opacity: 1 !important; transform: none !important; }
          .pcard .card-surface { box-shadow: none !important; transform: none !important; }
        }
      `}</style>
    </motion.div>
  )
}
