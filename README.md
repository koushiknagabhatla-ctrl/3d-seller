# FORMA Studio — 3D Printed Objects Shop

Shopping site for 3D printed objects. React + Vite, GSAP scroll animations,
Lenis smooth scrolling, interactive 3D product viewer (three.js), cart and
checkout, custom-print booking, Cloudflare R2 storage for 3D models.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

The `/api/upload-url` function (R2 uploads from the /admin page) only runs
under Vercel. To test it locally:

```bash
npm i -g vercel
vercel dev --listen 5173
```

## Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel (framework: Vite).
2. In **Project Settings → Environment Variables**, add the values from `.env`:
   `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
   `R2_ENDPOINT`, and `VITE_MODELS_BASE_URL` (public bucket URL).
3. Deploy. Page routing is handled by `vercel.json`.

> **Security:** the R2 keys were shared in a screenshot — rotate them in the
> Cloudflare dashboard (R2 → Manage API Tokens) before deploying publicly.
> `.env` is gitignored; never commit it.

## Adding real 3D models

1. Create an R2 bucket (default name `models`), make it publicly readable,
   set `VITE_MODELS_BASE_URL` to its public URL.
2. Open `/admin` and drag-drop a `.glb` file — it uploads to R2 and returns a
   key like `models/1721800000-orbit-vase.glb`.
3. Set that key as the product's `modelUrl` in `src/data/products.js`. The
   product page then shows the real model instead of the placeholder shape.

## Files

- `api/upload-url.js` — creates signed R2 upload links (keys stay on server)
- `src/App.jsx` — routes
- `src/index.css` — colors, fonts, shared styles
- `src/data/products.js` — product list and price helper
- `src/store/cart.js` — cart state, saved to localStorage
- `src/components/` — Navbar, CartDrawer, ProductCard, ProductVisual,
  ModelViewer (3D), Reveal (scroll animations), SmoothScroll (Lenis + GSAP)
- `src/pages/` — Home, Shop, ProductDetail, Cart, Checkout, Success,
  Custom (booking), Admin (model uploads), NotFound
