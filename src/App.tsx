import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../../../../Downloads/mastertech-frontend/src/components/AdminLayout'
import Layout from '../../../../Downloads/mastertech-frontend/src/components/Layout'
import ProtectedRoute from '../../../../Downloads/mastertech-frontend/src/components/ProtectedRoute'
import Cart from '../../../../Downloads/mastertech-frontend/src/pages/Cart'
import Category from '../../../../Downloads/mastertech-frontend/src/pages/Category'
import Home from '../../../../Downloads/mastertech-frontend/src/pages/Home'
import Mision from '../../../../Downloads/mastertech-frontend/src/pages/Mision'
import Nosotros from '../../../../Downloads/mastertech-frontend/src/pages/Nosotros'
import PagoConfirmar from '../../../../Downloads/mastertech-frontend/src/pages/PagoConfirmar'
import ProductDetail from '../../../../Downloads/mastertech-frontend/src/pages/ProductDetail'
import Profile from '../../../../Downloads/mastertech-frontend/src/pages/Profile'
import Register from '../../../../Downloads/mastertech-frontend/src/pages/Register'
import Search from '../../../../Downloads/mastertech-frontend/src/pages/Search'
import Terminos from '../../../../Downloads/mastertech-frontend/src/pages/Terminos'
import AdminCategorias from '../../../../Downloads/mastertech-frontend/src/pages/admin/Categorias'
import AdminDashboard from '../../../../Downloads/mastertech-frontend/src/pages/admin/Dashboard'
import AdminProductos from '../../../../Downloads/mastertech-frontend/src/pages/admin/Productos'
import AdminUsuarios from '../../../../Downloads/mastertech-frontend/src/pages/admin/Usuarios'
import AdminVentas from '../../../../Downloads/mastertech-frontend/src/pages/admin/Ventas'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="categoria/:slug" element={<Category />} />
        <Route path="buscar" element={<Search />} />
        <Route path="producto/:id" element={<ProductDetail />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="registro" element={<Register />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="mision" element={<Mision />} />
        <Route path="terminos" element={<Terminos />} />
        <Route element={<ProtectedRoute />}>
          <Route path="perfil" element={<Profile />} />
          <Route path="pago/confirmar" element={<PagoConfirmar />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute soloAdmin />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="productos" replace />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="ventas" element={<AdminVentas />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
