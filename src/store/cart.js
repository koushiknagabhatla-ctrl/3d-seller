import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      items: [], // { id, qty }
      drawerOpen: false,
      lastOrder: null,

      add: (id, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === id)
          const items = existing
            ? s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i))
            : [...s.items, { id, qty }]
          return { items }
        }),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i)),
        })),

      clear: () => set({ items: [] }),

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      placeOrder: (order) => set({ lastOrder: order, items: [] }),

      count: () => get().items.reduce((n, i) => n + i.qty, 0),
    }),
    {
      name: 'forma-cart',
      partialize: (s) => ({ items: s.items, lastOrder: s.lastOrder }),
    }
  )
)
