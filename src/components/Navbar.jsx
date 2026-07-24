import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../store/cart.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/custom', label: 'Custom Print' },
  { to: '/cart', label: 'Cart' },
]

export default function Navbar() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const openDrawer = useCart((s) => s.openDrawer)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenu(false), [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menu)
    return () => document.body.classList.remove('no-scroll')
  }, [menu])

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          height: 'var(--nav-h)',
          display: 'flex',
          alignItems: 'center',
          background: scrolled || menu ? 'rgba(247,241,229,0.85)' : 'transparent',
          backdropFilter: scrolled || menu ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled || menu ? 'blur(14px)' : 'none',
          borderBottom: scrolled && !menu ? '1px solid var(--ink-06)' : '1px solid transparent',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '-0.02em', zIndex: 2 }}>
            FORMA<span style={{ color: 'var(--accent)' }}>.</span>studio
          </Link>

          <nav style={{ display: 'flex', gap: 36 }} className="nav-desktop">
            {links.slice(0, 3).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="u-link"
                style={({ isActive }) => ({
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--accent)' : '#000',
                  opacity: isActive ? 1 : 0.75,
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 2 }}>
            <button
              onClick={openDrawer}
              aria-label={`Open cart, ${count} items`}
              style={{ position: 'relative', padding: 10, display: 'flex' }}
            >
              <ShoppingBag size={21} strokeWidth={1.8} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 0,
                      background: 'var(--accent)',
                      color: '#fff',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      width: 17,
                      height: 17,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              className="nav-burger"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu((m) => !m)}
              style={{ padding: 10, display: 'none' }}
            >
              {menu ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 850,
              background: 'var(--bg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'var(--pad)',
              gap: 8,
            }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <NavLink to={l.to} className="display" style={{ fontSize: 'clamp(2.4rem, 9vw, 4rem)' }}>
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: 32, fontSize: '0.85rem' }}
            >
              Sculptural objects, printed layer by layer.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
