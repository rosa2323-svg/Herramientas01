export interface Orden<K extends string> { col: K; dir: 'asc' | 'desc' }

export function alternarOrden<K extends string>(actual: Orden<K> | null, col: K): Orden<K> {
  return actual?.col === col ? { col, dir: actual.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' }
}

export function ordenar<T>(lista: T[], valor: (x: T) => string | number, orden: { dir: 'asc' | 'desc' } | null): T[] {
  if (!orden) return lista
  const f = orden.dir === 'asc' ? 1 : -1
  return [...lista].sort((a, b) => {
    const va = valor(a), vb = valor(b)
    return (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'es')) * f
  })
}

interface Props<K extends string> {
  col: K
  orden: Orden<K> | null
  onOrden: (c: K) => void
  children: string
}

export default function SortableTh<K extends string>({ col, orden, onOrden, children }: Props<K>) {
  const activo = orden?.col === col
  const icono = !activo ? 'bi-arrow-down-up' : orden.dir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'
  return (
    <th className="ordenable" aria-sort={!activo ? 'none' : orden.dir === 'asc' ? 'ascending' : 'descending'}>
      <button type="button" className="btn-orden" onClick={() => onOrden(col)}>
        {children}<i className={`bi ${icono} icono-orden`} aria-hidden="true" />
      </button>
    </th>
  )
}
