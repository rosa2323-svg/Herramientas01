import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, registrarOnNoAutorizado, tokenStore } from '../api/client'
import type { Sesion } from '../api/types'

const CLAVE_SESION = 'mastertech_sesion'

interface AuthCtx {
  sesion: Sesion | null
  esAdmin: boolean
  cargando: boolean
  login: (email: string, password: string) => Promise<Sesion>
  logout: () => void
  loginAbierto: boolean
  abrirLogin: () => void
  cerrarLogin: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

function leerSesion(): Sesion | null {
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null') as Sesion | null
    return s && tokenStore.get() ? { ...s, token: tokenStore.get()! } : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion)
  const [cargando, setCargando] = useState<boolean>(() => leerSesion() !== null)
  const [loginAbierto, setLoginAbierto] = useState(false)

  const logout = useCallback(() => {
    tokenStore.clear()
    try { localStorage.removeItem(CLAVE_SESION) } catch { /* sin almacenamiento */ }
    setSesion(null)
  }, [])

  // Si el backend rechaza el token (vencido/inválido) se cierra la sesión local.
  useEffect(() => {
    registrarOnNoAutorizado(logout)
    return () => registrarOnNoAutorizado(null)
  }, [logout])

  // Se valida el token guardado al abrir la app.
  useEffect(() => {
    if (!tokenStore.get()) { setCargando(false); return }
    api.me()
      .then(me => {
        setSesion(prev => {
          const nueva = { ...me, token: tokenStore.get()! } as Sesion
          try { localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva)) } catch { /* sin almacenamiento */ }
          return prev ? nueva : prev
        })
      })
      .catch(() => { /* el 401 ya dispara logout; otros errores no cierran sesión */ })
      .finally(() => setCargando(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const s = await api.login(email, password)
    tokenStore.set(s.token)
    try { localStorage.setItem(CLAVE_SESION, JSON.stringify(s)) } catch { /* sin almacenamiento */ }
    setSesion(s)
    return s
  }, [])

  return (
    <Ctx.Provider value={{
      sesion, esAdmin: sesion?.rol === 'ADMIN', cargando, login, logout,
      loginAbierto, abrirLogin: () => setLoginAbierto(true), cerrarLogin: () => setLoginAbierto(false),
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return c
}
