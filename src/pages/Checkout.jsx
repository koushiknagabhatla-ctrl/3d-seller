import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { SplitReveal } from '../components/Reveal.jsx'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCart } from '../store/cart.js'
import { getProduct, formatPrice } from '../data/products.js'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  payment: 'cod',
}

export default function Checkout() {
  const { items, placeOrder } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)

  const lines = items.map((i) => ({ ...i, product: getProduct(i.id) })).filter((l) => l.product)
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0)
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99
  const total = subtotal + shipping

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Enter your full name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email'
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) er.phone = 'Enter a 10-digit phone number'
    if (form.address.trim().length < 8) er.address = 'Enter your full address'
    if (form.city.trim().length < 2) er.city = 'Enter your city'
    if (!/^\d{6}$/.test(form.pincode)) er.pincode = 'Enter a 6-digit PIN code'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (lines.length === 0) return navigate('/shop')
    if (!validate()) return
    setPlacing(true)
    // Simulated order placement — swap for a real payments/orders API when ready.
    setTimeout(() => {
      const order = {
        id: 'FRM' + Date.now().toString().slice(-8),
        items: lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, price: l.product.price })),
        total,
        name: form.name,
        email: form.email,
        address: `${form.address}, ${form.city} — ${form.pincode}`,
        payment: form.payment,
        placedAt: new Date().toISOString(),
      }
      placeOrder(order)
      navigate('/success')
    }, 1400)
  }

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
          <p className="serif-accent" style={{ fontSize: '2rem', marginBottom: 12 }}>Your cart is empty</p>
          <p style={{ color: 'var(--ink-60)', marginBottom: 28 }}>Add something before checking out.</p>
          <Link to="/shop" className="btn btn-dark">Go to shop <ArrowRight size={17} /></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(30px, 5vw, 60px)' }}>
        <h1 className="display" style={{ fontSize: 'clamp(2.4rem, 7vw, 5.5rem)', marginBottom: 'clamp(28px, 5vw, 52px)' }}>
          <SplitReveal text="Checkout" />
        </h1>

        <form onSubmit={submit} className="co-grid" noValidate>
          {/* ---------- FORM ---------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 4vw, 44px)' }}>
            <section>
              <p className="label" style={{ marginBottom: 20 }}>01 — Contact</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                <Field label="Full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                <Field label="Phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
              </div>
            </section>

            <section>
              <p className="label" style={{ marginBottom: 20 }}>02 — Delivery</p>
              <div style={{ display: 'grid', gap: 20 }}>
                <Field label="Address" value={form.address} onChange={set('address')} error={errors.address} autoComplete="street-address" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <Field label="City" value={form.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
                  <Field label="PIN code" inputMode="numeric" value={form.pincode} onChange={set('pincode')} error={errors.pincode} autoComplete="postal-code" />
                </div>
              </div>
            </section>

            <section>
              <p className="label" style={{ marginBottom: 20 }}>03 — Payment</p>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  ['cod', 'Cash on delivery', 'Pay when your object arrives'],
                  ['upi', 'UPI', 'GPay, PhonePe, Paytm — link sent at dispatch'],
                  ['card', 'Card', 'Secure payment link sent to your email'],
                ].map(([id, label, hint]) => (
                  <label
                    key={id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      border: '1px solid',
                      borderColor: form.payment === id ? '#000' : 'var(--ink-12)',
                      borderRadius: 16,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s',
                      background: form.payment === id ? 'var(--card)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={form.payment === id}
                      onChange={set('payment')}
                      style={{ accentColor: '#000', width: 17, height: 17 }}
                    />
                    <span>
                      <span style={{ fontWeight: 600, display: 'block' }}>{label}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ink-60)' }}>{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* ---------- SUMMARY ---------- */}
          <aside
            style={{
              background: 'var(--card)',
              borderRadius: 'var(--radius)',
              padding: 'clamp(22px, 3.5vw, 36px)',
              height: 'fit-content',
              position: 'sticky',
              top: 'calc(var(--nav-h) + 20px)',
            }}
          >
            <p className="display" style={{ fontSize: '1.2rem', marginBottom: 20 }}>Your order</p>
            <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
              {lines.map((l) => (
                <div key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 54, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--bg)' }}>
                    <ProductVisual product={l.product} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{l.product.name}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--ink-60)' }}>Qty {l.qty}</p>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatPrice(l.product.price * l.qty)}</p>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div style={{ display: 'grid', gap: 8, padding: '16px 0', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ink-60)' }}>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ink-60)' }}>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
            </div>
            <hr className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 22px', fontWeight: 700, fontSize: '1.15rem' }}>
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
            <motion.button type="submit" className="btn btn-dark btn-block" disabled={placing} whileTap={{ scale: 0.97 }}>
              {placing ? 'Placing order…' : <>Place order <Lock size={15} /></>}
            </motion.button>
            <p style={{ fontSize: '0.74rem', color: 'var(--ink-60)', textAlign: 'center', marginTop: 14 }}>
              Demo checkout — no payment is charged.
            </p>
          </aside>
        </form>
      </div>

      <style>{`
        .co-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: clamp(28px, 5vw, 64px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .co-grid { grid-template-columns: 1fr; }
          .co-grid aside { position: static !important; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, error, ...rest }) {
  return (
    <div className="field">
      <label className="label" style={{ fontSize: '0.68rem' }}>{label}</label>
      <input {...rest} aria-invalid={!!error} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}
