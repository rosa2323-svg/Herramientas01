import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Producto } from '../api/types'
import { useAlert } from '../context/AlertContext'
import { useCart } from '../context/CartContext'
import { formatoSoles, imagenProducto, IMG_DEFECTO, marcaDe, STOCK_BAJO } from '../utils/format'

export default function ProductCard({ producto }: { producto: Producto }) {
  const { agregar } = useCart()
  const { mostrarAlerta } = useAlert()
  const [agregado, setAgregado] = useState(false)

  const agotado = producto.stock <= 0
  const ultimas = producto.stock > 0 && producto.stock <= STOCK_BAJO
  const detalle = `/producto/${producto.id}`

  const onAgregar = () => {
    const r = agregar(producto)
    if (!r.ok) { mostrarAlerta(r.mensaje ?? 'No se pudo agregar el producto.'); return }
    setAgregado(true)
    setTimeout(() => setAgregado(false), 900)
  }

  return (
    <div className="col-6 col-sm-4 col-md-3">
      <div className="tarjeta-producto">
        <Link to={detalle}>
          <div className="tarjeta-producto-img">
            <img src={imagenProducto(producto.imagenUrl)} alt={producto.nombre}
                 onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG_DEFECTO }} />
          </div>
        </Link>
        <div className="p-3 d-flex flex-column flex-grow-1">
          <span className="tarjeta-producto-marca">{marcaDe(producto)}</span>
          <Link to={detalle} className="text-decoration-none text-reset">
            <p className="tarjeta-producto-nombre">{producto.nombre}</p>
          </Link>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="tarjeta-producto-precio">{formatoSoles(producto.precio)}</span>
            {agotado ? <span className="badge bg-secondary">Agotado</span>
              : ultimas ? <span className="badge bg-warning text-dark">Últimas {producto.stock}</span>
              : <span className="badge bg-success">En stock</span>}
          </div>
          <button type="button" className="btn-agregar" disabled={agotado || agregado} onClick={onAgregar}>
            {agregado
              ? <><i className="bi bi-check-lg me-1" />Agregado</>
              : <><i className="bi bi-cart-plus me-1" />{agotado ? 'Agotado' : 'Agregar al carrito'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
