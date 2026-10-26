import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { Categoria, Producto } from '../api/types'

interface CatalogCtx {
  productos: Producto[]
  categorias: Categoria[]
  cargando: boolean
  error: string | null
  recargar: () => Promise<void>
}

const Ctx = createContext<CatalogCtx | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.productos(), api.categorias()])
      setProductos(p)
      setCategorias(c)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { void recargar() }, [recargar])

  return <Ctx.Provider value={{ productos, categorias, cargando, error, recargar }}>{children}</Ctx.Provider>
}

export function useCatalog() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCatalog debe usarse dentro de CatalogProvider')
  return c
}
