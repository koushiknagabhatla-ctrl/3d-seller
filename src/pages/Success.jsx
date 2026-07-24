import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useCart } from '../store/cart.js'
import { formatPrice } from '../data/products.js'

export default function Success() {
  const order = useCart((s) => s.lastOrder)

  if (!order) return <Navigate to="/shop" replace />

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(50px, 8vw, 100px)', maxWidth: 760, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }}
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: '#000',
            color: '#f7f1e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
          }}
        >
          <Check size={40} strokeWidth={2.5} />
        </motion.div>

        <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.8rem)' }}>
          Order <span className="serif-accent">confirmed</span>
        </h1>
        <p style={{ color: 'var(--ink-60)', margin: '18px auto 8px', maxWidth: '46ch' }}>
          Thank you, {order.name.split(' ')[0]}. Your objects are heading to the printer. A confirmation has been
          sent to {order.email}.
        </p>
        <p className="label" style={{ marginBottom: 40 }}>Order {order.id}</p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius)',
            padding: 'clamp(22px, 4vw, 36px)',
            textAlign: 'left',
            marginBottom: 36,
          }}
        >
          {order.items.map((it) => (
            <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', fontSize: '0.95rem' }}>
              <span>{it.name} <span style={{ color: 'var(--ink-60)' }}>× {it.qty}</span></span>
              <span style={{ fontWeight: 600 }}>{formatPrice(it.price * it.qty)}</span>
            </div>
          ))}
          <hr className="divider" style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-60)', marginTop: 14 }}>
            Delivering to: {order.address}
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 40 }}>
          <Link to="/shop" className="btn btn-dark">Continue shopping <ArrowRight size={17} /></Link>
          <Link to="/custom" className="btn btn-ghost">Book a custom print</Link>
        </div>
      </div>
    </div>
  )
}
