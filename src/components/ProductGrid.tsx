import type { Producto } from '../api/types'
import ProductCard from './ProductCard'

export default function ProductGrid({ productos, termino }: { productos: Producto[]; termino?: string }) {
  if (productos.length === 0) {
    return (
      <div className="row g-4">
        <div className="col-12 text-center py-5">
          <i className="bi bi-search fs-1 text-muted" />
          <h5 className="mt-3 text-muted">
            No encontramos productos{termino ? <> para <strong>"{termino}"</strong></> : null}
          </h5>
          <p className="text-muted small">Intenta con otro término o explora nuestras categorías.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="row g-4">
      {productos.map(p => <ProductCard key={p.id} producto={p} />)}
    </div>
  )
}
