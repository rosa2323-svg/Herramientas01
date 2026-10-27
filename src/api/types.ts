export interface Producto {
  id: number
  nombre: string
  descripcion?: string | null
  precio: number
  marca?: string | null
  imagenUrl?: string | null
  stock: number
  categoriaId: number
  categoriaNombre?: string | null
}

export interface ProductoInput {
  nombre: string
  descripcion?: string
  precio: number
  marca: string
  stock: number
  categoriaId: number
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string | null
}

export type Rol = 'USER' | 'ADMIN'

export interface Sesion {
  token: string
  id: number
  email: string
  nombre: string
  rol: Rol
}

export interface DetalleVenta {
  id: number
  cantidad: number
  precioUnitario: number
  subtotal: number
  productoId: number
  productoNombre: string
  productoImagenUrl?: string | null
}

export interface Venta {
  id: number
  fecha: string
  total: number
  cantidadItems: number
  numeroOrden: string
  estado: string
  usuarioId?: number
  usuarioNombre?: string
  usuarioEmail?: string
  detalles: DetalleVenta[]
}

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: Rol
  dni?: string | null
  direccion?: string | null
  numeroTelefono?: string | null
  fechaRegistro?: string | null
}

export interface Perfil extends Usuario {
  biografia?: string | null
}

export interface RegistroData {
  nombre: string
  email: string
  password: string
  dni: string
  direccion: string
  numeroTelefono: string
}
