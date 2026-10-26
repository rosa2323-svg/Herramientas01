import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from 'react-bootstrap'
import { api } from '../../api/client'
import type { Categoria } from '../../api/types'
import { useCatalog } from '../../context/CatalogContext'

export default function AdminCategorias() {
  const { categorias, productos, recargar, cargando } = useCatalog()
  const [editando, setEditando] = useState<Categoria | 'nueva' | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [porEliminar, setPorEliminar] = useState<Categoria | null>(null)
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null)

  useEffect(() => { document.title = 'MASTER TECH | Admin de categorías' }, [])

  const cuenta = (id: number) => productos.filter(p => p.categoriaId === id).length

  const abrir = (c: Categoria | 'nueva') => {
    setForm(c === 'nueva' ? { nombre: '', descripcion: '' } : { nombre: c.nombre, descripcion: c.descripcion ?? '' })
    setError(null); setEditando(c)
  }

  const guardar = async (e: FormEvent) => {
    e.preventDefault()
    const nombre = form.nombre.trim()
    if (!nombre) return setError('Escribe el nombre de la categoría.')
    if (categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase() && (editando === 'nueva' || c.id !== (editando as Categoria).id)))
      return setError('Ya existe una categoría con ese nombre.')
    setGuardando(true)
    try {
      const datos = { nombre, descripcion: form.descripcion.trim() }
      if (editando === 'nueva') await api.crearCategoria(datos)
      else if (editando) await api.actualizarCategoria(editando.id, datos)
      await recargar()
      setAviso({ ok: true, texto: editando === 'nueva' ? 'Categoría creada.' : 'Categoría actualizada.' })
      setEditando(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!porEliminar) return
    try {
      await api.eliminarCategoria(porEliminar.id)
      await recargar()
      setAviso({ ok: true, texto: `Se eliminó "${porEliminar.nombre}".` })
    } catch (err) {
      setAviso({ ok: false, texto: err instanceof Error ? err.message : 'No se pudo eliminar.' })
    } finally {
      setPorEliminar(null)
    }
  }

  return (
    <div className="admin-principal-angosto mx-auto">
      <div className="admin-encabezado">
        <div>
          <h1 className="admin-titulo">Gestión de categorías</h1>
          <p className="admin-subtitulo">Solo se pueden eliminar categorías que no tengan productos.</p>
        </div>
        <button type="button" className="btn btn-mastertech px-4" onClick={() => abrir('nueva')}><i className="bi bi-plus-lg me-1" />Nueva categoría</button>
      </div>

      {aviso && (
        <div className={`alert ${aviso.ok ? 'alert-success' : 'alert-danger'} d-flex justify-content-between`} role="alert">
          <span>{aviso.texto}</span>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setAviso(null)} />
        </div>
      )}

      <div className="tabla-envoltorio">
        <table className="tabla-admin">
          <thead><tr><th>#</th><th>Nombre</th><th>Descripción</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr><td colSpan={5}><div className="vacio"><i className="bi bi-tags" />{cargando ? 'Cargando…' : 'Aún no hay categorías. Crea la primera con "Nueva categoría".'}</div></td></tr>
            ) : categorias.map(c => {
              const n = cuenta(c.id)
              return (
                <tr key={c.id}>
                  <td className="texto-tenue">{c.id}</td>
                  <td className="fw-semibold">{c.nombre}</td>
                  <td className="texto-tenue">{c.descripcion || '—'}</td>
                  <td>{n === 0
                    ? <span className="etiqueta-conteo conteo-vacia">Vacía</span>
                    : <span className="etiqueta-conteo conteo-con">{n} producto{n === 1 ? '' : 's'}</span>}</td>
                  <td className="celda-acciones">
                    <button type="button" className="btn-accion btn-editar" onClick={() => abrir(c)}><i className="bi bi-pencil-fill" /> Editar</button>
                    {n === 0
                      ? <button type="button" className="btn-accion btn-borrar" onClick={() => setPorEliminar(c)}><i className="bi bi-trash-fill" /> Eliminar</button>
                      : <span className="btn-accion btn-bloqueado" title="Tiene productos asociados"><i className="bi bi-lock-fill" /> Bloqueado</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal show={editando !== null} onHide={() => !guardando && setEditando(null)} centered>
        <form onSubmit={guardar} noValidate>
          <Modal.Header closeButton><Modal.Title>{editando === 'nueva' ? 'Nueva categoría' : 'Editar categoría'}</Modal.Title></Modal.Header>
          <Modal.Body>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="mb-3">
              <label className="form-label" htmlFor="cNombre">Nombre</label>
              <input id="cNombre" className="form-control" placeholder="Ej. Laptops" maxLength={100} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </div>
            <div>
              <label className="form-label" htmlFor="cDescripcion">Descripción</label>
              <textarea id="cDescripcion" className="form-control" rows={3} maxLength={255} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" disabled={guardando} onClick={() => setEditando(null)}>Cancelar</button>
            <button type="submit" className="btn btn-mastertech px-4" disabled={guardando}><i className="bi bi-check-lg me-1" />{guardando ? 'Guardando…' : 'Guardar'}</button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal show={porEliminar !== null} onHide={() => setPorEliminar(null)} centered size="sm">
        <Modal.Header closeButton><Modal.Title>Eliminar categoría</Modal.Title></Modal.Header>
        <Modal.Body>Vas a eliminar <strong>{porEliminar?.nombre}</strong>. Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setPorEliminar(null)}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={eliminar}>Eliminar</button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
