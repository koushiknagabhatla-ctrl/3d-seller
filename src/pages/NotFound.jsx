import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="page">
      <div
        className="container"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 18,
        }}
      >
        <p className="display" style={{ fontSize: 'clamp(5rem, 20vw, 12rem)', lineHeight: 1 }}>
          4<span className="serif-accent">0</span>4
        </p>
        <p style={{ color: 'var(--ink-60)', maxWidth: '40ch' }}>
          This page doesn't exist — or hasn't been printed yet.
        </p>
        <Link to="/" className="btn btn-dark" style={{ marginTop: 8 }}>
          <ArrowLeft size={17} /> Back to home
        </Link>
      </div>
    </div>
  )
}
