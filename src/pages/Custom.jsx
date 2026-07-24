import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Reveal, { SplitReveal } from '../components/Reveal.jsx'

const initial = { name: '', email: '', type: 'Decor object', size: 'Small (under 15 cm)', brief: '' }

export default function Custom() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email'
    if (form.brief.trim().length < 20) er.brief = 'Tell us a bit more (at least 20 characters)'
    setErrors(er)
    if (Object.keys(er).length === 0) {
      // Store locally until a backend/booking API is wired up.
      const bookings = JSON.parse(localStorage.getItem('forma-bookings') || '[]')
      bookings.push({ ...form, id: 'REQ' + Date.now().toString().slice(-8), at: new Date().toISOString() })
      localStorage.setItem('forma-bookings', JSON.stringify(bookings))
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 'clamp(60px, 10vw, 120px)', textAlign: 'center', maxWidth: 640 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.35 }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: '#000', color: '#f7f1e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 26px' }}
          >
            <Check size={36} strokeWidth={2.5} />
          </motion.div>
          <h1 className="display" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            Request <span className="serif-accent">received</span>
          </h1>
          <p style={{ color: 'var(--ink-60)', margin: '16px 0 32px' }}>
            We'll reply to {form.email} within 24 hours with a quote and timeline.
          </p>
          <button className="btn btn-dark" onClick={() => { setForm(initial); setSent(false) }}>
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(30px, 5vw, 60px)' }}>
        <div className="custom-grid">
          <div>
            <p className="label" style={{ marginBottom: 12 }}>Booking · Custom prints</p>
            <h1 className="display" style={{ fontSize: 'clamp(2.4rem, 7vw, 5.5rem)' }}>
              <SplitReveal text="Print your" />
              <br />
              <span className="serif-accent"><SplitReveal text="own idea." delay={0.15} /></span>
            </h1>
            <Reveal delay={0.3}>
              <p style={{ color: 'var(--ink-60)', maxWidth: '46ch', margin: '22px 0 34px' }}>
                From a napkin sketch to a finished STL — we prototype, refine and print one-off objects. You'll get a
                quote within 24 hours and a printed piece in as little as a week.
              </p>
              <div style={{ display: 'grid', gap: 0, maxWidth: 420 }}>
                {[
                  ['Quote', 'Within 24 hours, no commitment'],
                  ['Prototype', 'A test print photo before the final run'],
                  ['Delivery', '7–14 days depending on complexity'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 18, padding: '16px 0', borderBottom: '1px solid var(--ink-12)' }}>
                    <span style={{ fontWeight: 700, minWidth: 90 }}>{k}</span>
                    <span style={{ color: 'var(--ink-60)', fontSize: '0.92rem' }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <form
              onSubmit={submit}
              noValidate
              style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 'clamp(24px, 4vw, 40px)', display: 'grid', gap: 22 }}
            >
              <div className="field">
                <label className="label" style={{ fontSize: '0.68rem' }}>Your name</label>
                <input value={form.name} onChange={set('name')} autoComplete="name" />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="field">
                <label className="label" style={{ fontSize: '0.68rem' }}>Email</label>
                <input type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 22 }}>
                <div className="field">
                  <label className="label" style={{ fontSize: '0.68rem' }}>Object type</label>
                  <select value={form.type} onChange={set('type')}>
                    {['Decor object', 'Lighting', 'Desk accessory', 'Replacement part', 'Figurine / model', 'Other'].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label" style={{ fontSize: '0.68rem' }}>Approximate size</label>
                  <select value={form.size} onChange={set('size')}>
                    {['Small (under 15 cm)', 'Medium (15–30 cm)', 'Large (30–50 cm)', 'Not sure yet'].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label" style={{ fontSize: '0.68rem' }}>Describe your idea</label>
                <textarea
                  rows={5}
                  value={form.brief}
                  onChange={set('brief')}
                  placeholder="What is it, what's it for, any references or links…"
                  style={{ resize: 'vertical' }}
                />
                {errors.brief && <span className="error">{errors.brief}</span>}
              </div>
              <button type="submit" className="btn btn-dark btn-block">
                Request a quote <ArrowRight size={17} />
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-60)', textAlign: 'center' }}>
                Have a 3D file already? You'll be able to attach it after we reply.
              </p>
            </form>
          </Reveal>
        </div>
      </div>

      <style>{`
        .custom-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(32px, 6vw, 80px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .custom-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
