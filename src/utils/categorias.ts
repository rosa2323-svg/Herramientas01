import type { Categoria } from '../api/types'
import { normalizar, slugify } from './format'

export const rutaCategoria = (c: Categoria) => `/categoria/${slugify(c.nombre)}`

export const categoriaPorSlug = (cats: Categoria[], slug: string | undefined) =>
  cats.find(c => slugify(c.nombre) === slug)

/** Primera categoría cuyo nombre contiene alguna de las palabras (sin tildes ni mayúsculas). */
export function categoriaPorPalabra(cats: Categoria[], ...palabras: string[]) {
  return cats.find(c => palabras.some(p => normalizar(c.nombre).includes(normalizar(p))))
}
