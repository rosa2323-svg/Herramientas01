import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Exige sesión (y rol ADMIN si soloAdmin). Sin sesión abre el modal de login y vuelve al inicio. */
export default function ProtectedRoute({ soloAdmin = false }: { soloAdmin?: boolean }) {
  const { sesion, esAdmin, cargando, abrirLogin } = useAuth()
  const sinSesion = !cargando && !sesion

  useEffect(() => { if (sinSesion) abrirLogin() }, [sinSesion, abrirLogin])

  if (cargando) return <div className="container py-5 text-center text-muted">Cargando…</div>
  if (!sesion) return <Navigate to="/" replace />
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
