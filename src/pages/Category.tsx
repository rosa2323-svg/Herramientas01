import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useCatalog } from '../context/CatalogContext'
import { categoriaPorSlug } from '../utils/categorias'

export default function Category() {
  const { slug } = useParams()
  const { categorias, productos, cargando } = useCatalog()
  const categoria = categoriaPorSlug(categorias, slug)
  const titulo = categoria?.nombre ?? 'Categoría no encontrada'

  useEffect(() => { document.title = `Categoría: ${titulo}` }, [titulo])

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-3">
          <li className="breadcrumb-item"><Link className="text-dark text-decoration-none fw-bold" to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{cargando ? 'Categoría' : titulo}</li>
        </ol>
      </nav>
      <h4 className="fw-bold mb-4">{cargando ? '' : titulo}</h4>
      {cargando
        ? <p className="text-muted">Cargando…</p>
        : <ProductGrid productos={categoria ? productos.filter(p => p.categoriaId === categoria.id) : []} />}
    </div>
  )
}
