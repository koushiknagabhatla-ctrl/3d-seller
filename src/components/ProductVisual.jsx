// Lightweight SVG "product renders" used in grids/cards while real photos and
// GLB models are pending. Monochrome sculptural silhouettes with a soft hue tint.

const shapes = {
  torusknot: (c) => (
    <g fill="none" stroke={c} strokeWidth="7" strokeLinecap="round">
      <path d="M50 22c22 0 34 14 34 28s-14 28-34 28-34-14-34-28 12-28 34-28z" />
      <path d="M50 36c12 0 20 6 20 14s-8 14-20 14-20-6-20-14 8-14 20-14z" />
      <path d="M30 40c8-12 32-12 40 0M30 60c8 12 32 12 40 0" opacity="0.5" strokeWidth="4" />
    </g>
  ),
  torus: (c) => (
    <g fill="none" stroke={c} strokeLinecap="round">
      <ellipse cx="50" cy="50" rx="32" ry="30" strokeWidth="10" />
      <ellipse cx="50" cy="50" rx="18" ry="16" strokeWidth="4" opacity="0.45" />
    </g>
  ),
  icosahedron: (c) => (
    <g fill="none" stroke={c} strokeWidth="4" strokeLinejoin="round">
      <path d="M50 14 82 36 74 70 26 70 18 36z" />
      <path d="M50 14 50 44M18 36 50 44 82 36M26 70 50 44 74 70" opacity="0.55" />
    </g>
  ),
  capsule: (c) => (
    <g fill="none" stroke={c} strokeWidth="7" strokeLinecap="round">
      <path d="M36 20h28a0 0 0 0 1 0 0v44a14 14 0 0 1-14 14 14 14 0 0 1-14-14V20z" />
      <path d="M42 32h16" opacity="0.45" strokeWidth="4" />
    </g>
  ),
  box: (c) => (
    <g fill="none" stroke={c} strokeWidth="4" strokeLinejoin="round">
      <path d="M28 38 58 26l16 10-30 12z" />
      <path d="M28 38v26l30 12V50zM74 36v26L58 76" />
      <path d="M44 44v26" opacity="0.5" />
    </g>
  ),
  wave: (c) => (
    <g fill="none" stroke={c} strokeWidth="5" strokeLinecap="round">
      <path d="M18 36c10-10 22-10 32 0s22 10 32 0" />
      <path d="M18 52c10-10 22-10 32 0s22 10 32 0" opacity="0.7" />
      <path d="M18 68c10-10 22-10 32 0s22 10 32 0" opacity="0.4" />
    </g>
  ),
  knot2: (c) => (
    <g fill="none" stroke={c} strokeWidth="7" strokeLinecap="round">
      <path d="M35 70c-12-8-12-30 4-38s34 2 34 18-16 26-30 20" />
      <circle cx="62" cy="34" r="6" opacity="0.5" strokeWidth="4" />
    </g>
  ),
  cylinder: (c) => (
    <g fill="none" stroke={c} strokeWidth="4">
      <ellipse cx="50" cy="30" rx="26" ry="9" />
      <path d="M24 30v38c0 5 12 9 26 9s26-4 26-9V30" />
      <ellipse cx="50" cy="52" rx="26" ry="9" opacity="0.35" />
    </g>
  ),
  helix: (c) => (
    <g fill="none" stroke={c} strokeWidth="5" strokeLinecap="round">
      <path d="M36 20c20 8-16 18 8 26s-20 18 6 26" />
      <path d="M60 20c-20 8 16 18-8 26s20 18-6 26" opacity="0.55" />
    </g>
  ),
  sphere: (c) => (
    <g fill="none" stroke={c} strokeWidth="4">
      <circle cx="50" cy="50" r="30" />
      <ellipse cx="50" cy="50" rx="30" ry="11" opacity="0.5" />
      <ellipse cx="50" cy="50" rx="13" ry="30" opacity="0.3" />
    </g>
  ),
}

export default function ProductVisual({ product, size = '100%' }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        style={{ width: size, height: size, objectFit: 'cover', display: 'block' }}
      />
    )
  }

  const draw = shapes[product.shape] || shapes.sphere
  const tint = `hsl(${product.hue} 18% 91%)`
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={product.name}
      style={{ width: size, height: size, display: 'block' }}
    >
      <rect width="100" height="100" fill={tint} />
      <circle cx="50" cy="52" r="34" fill="rgba(0,0,0,0.04)" />
      {draw('#0a0a0a')}
      <ellipse cx="50" cy="86" rx="24" ry="4" fill="rgba(0,0,0,0.10)" />
    </svg>
  )
}
