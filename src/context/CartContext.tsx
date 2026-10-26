import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Producto } from '../api/types'

const CLAVE_CARRITO = 'carritoMasterTech'

export interface ItemCarrito {
  id: number
  nombre: string
  precio: number
  imagenUrl: string | null
  marca: string
  stock: number
  cantidad: number
}

interface CartCtx {
  items: ItemCarrito[]
  cuenta: number
  total: number
  agregar: (p: Producto, cantidad?: number) => { ok: boolean; mensaje?: string }
  setCantidad: (id: number, cantidad: number) => void
  quitar: (id: number) => void
  vaciar: () => void
  /** Alinea nombre, precio y stock del carrito con el catálogo vigente; quita lo que ya no existe. */
  sincronizar: (catalogo: Producto[]) => void
}

const Ctx = createContext<CartCtx | null>(null)

function leer(): ItemCarrito[] {
  try {
    const crudo = JSON.parse(localStorage.getItem(CLAVE_CARRITO) ?? '[]')
    return Array.isArray(crudo)
      ? crudo
          .filter(i => i && typeof i === 'object')
          .map(i => ({ ...i, id: Number(i.id) }))
          .filter(i => Number.isFinite(i.id))
      : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(leer)

  useEffect(() => {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items)) } catch { /* sin almacenamiento */ }
  }, [items])

  const agregar = useCallback((p: Producto, cantidad = 1) => {
    if (p.stock <= 0) return { ok: false, mensaje: 'Este producto está agotado.' }
    const existente = items.find(i => i.id === p.id)
    const actual = existente?.cantidad ?? 0
    if (actual + cantidad > p.stock) {
      return { ok: false, mensaje: 'No hay más stock disponible de este producto.' }
    }
    setItems(prev => existente
      ? prev.map(i => (i.id === p.id ? { ...i, cantidad: i.cantidad + cantidad, stock: p.stock } : i))
      : [...prev, {
          id: p.id, nombre: p.nombre, precio: p.precio, imagenUrl: p.imagenUrl ?? null,
          marca: p.marca ?? '', stock: p.stock, cantidad,
        }])
    return { ok: true }
  }, [items])

  const setCantidad = useCallback((id: number, cantidad: number) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, cantidad: Math.min(i.stock, Math.max(1, Math.floor(cantidad) || 1)) } : i))
  }, [])

  const quitar = useCallback((id: number) => setItems(prev => prev.filter(i => i.id !== id)), [])
  const vaciar = useCallback(() => setItems([]), [])

  const sincronizar = useCallback((catalogo: Producto[]) => {
    setItems(prev => {
      const sig = prev.flatMap(i => {
        const p = catalogo.find(x => x.id === i.id)
        if (!p || p.stock <= 0) return []
        return [{
          ...i, nombre: p.nombre, precio: p.precio, stock: p.stock,
          imagenUrl: p.imagenUrl ?? null, marca: p.marca ?? '', cantidad: Math.min(i.cantidad, p.stock),
        }]
      })
      return JSON.stringify(sig) === JSON.stringify(prev) ? prev : sig
    })
  }, [])

  const valor = useMemo<CartCtx>(() => ({
    items,
    cuenta: items.reduce((a, i) => a + i.cantidad, 0),
    total: items.reduce((a, i) => a + i.precio * i.cantidad, 0),
    agregar, setCantidad, quitar, vaciar, sincronizar,
  }), [items, agregar, setCantidad, quitar, vaciar, sincronizar])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart debe usarse dentro de CartProvider')
  return c
}
