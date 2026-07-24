import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import { products, CATEGORIES } from '../data/products.js'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'rating', label: 'Top rated' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'All'
  const [sort, setSort] = useState('featured')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    let out = cat === 'All' ? [...products] : products.filter((p) => p.category === cat)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      out = out.filter((p) => (p.name + p.tagline + p.category).toLowerCase().includes(q))
    }
    if (sort === 'price-asc') out.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') out.sort((a, b) => b.price - a.price)
    if (sort === 'rating') out.sort((a, b) => b.rating - a.rating)
    return out
  }, [cat, sort, query])

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(30px, 5vw, 60px)' }}>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', marginBottom: 'clamp(16px, 2.5vw, 28px)' }}>
          Shop <span style={{ color: 'var(--accent)' }}>objects</span>
        </h1>

        {/* controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'clamp(24px, 4vw, 40px)',
            position: 'sticky',
            top: 'var(--nav-h)',
            zIndex: 10,
            background: 'rgba(247,241,229,0.9)',
            backdropFilter: 'blur(10px)',
            padding: '12px 0',
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setParams(c === 'All' ? {} : { cat: c })}
                style={{
                  padding: '9px 18px',
                  borderRadius: 999,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: cat === c ? '#000' : 'var(--ink-12)',
                  background: cat === c ? '#000' : 'transparent',
                  color: cat === c ? '#f7f1e5' : '#000',
                  transition: 'all 0.3s var(--ease-out)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search products"
              style={{
                background: 'transparent',
                border: '1px solid var(--ink-12)',
                borderRadius: 999,
                padding: '9px 18px',
                outline: 'none',
                fontSize: '0.85rem',
                width: 150,
              }}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
              style={{
                background: 'transparent',
                border: '1px solid var(--ink-12)',
                borderRadius: 999,
                padding: '9px 16px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* grid */}
        <AnimatePresence mode="popLayout">
          {list.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: 'var(--ink-60)', padding: '60px 0', textAlign: 'center' }}
            >
              Nothing matches "{query}". Try a different search.
            </motion.p>
          ) : (
            <motion.div
              key={cat + sort + query}
              layout
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                gap: 'clamp(18px, 3vw, 32px)',
              }}
            >
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
