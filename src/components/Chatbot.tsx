import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Producto } from '../api/types'
import { useAlert } from '../context/AlertContext'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { categoriaPorPalabra } from '../utils/categorias'
import { formatoSoles, imagenProducto, IMG_DEFECTO, marcaDe, normalizar } from '../utils/format'

// Asistente simulado (sin IA): responde con reglas sobre el catálogo real del backend.
// Para conectar una IA, reemplaza solo obtenerRespuesta().

const CLAVE_HISTORIAL = 'mastertech_chatbot_historial'
const MAX_HISTORIAL = 40
const RETARDO_MS = 900
const BIENVENIDA = 'Hola, soy el asistente de Master Tech. Puedo ayudarte a elegir productos, revisar stock y recomendarte según lo que has comprado antes. ¿En qué te ayudo?'
const SUGERENCIAS = ['Recomiéndame algo', 'Quiero una laptop gamer', 'Celulares disponibles', 'Ver ofertas']

interface Mensaje { texto: string; tipo: 'bot' | 'usuario' | 'error'; hora: string; productos?: number[] }
interface Respuesta { texto: string; productos?: Producto[] }

const hora = () => new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

function leerHistorial(): Mensaje[] {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) ?? 'null')
    return Array.isArray(g) ? g : []
  } catch { return [] }
}

export default function Chatbot() {
  const { productos, categorias } = useCatalog()
  const { agregar } = useCart()
  const { mostrarAlerta } = useAlert()
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>(() => {
    const h = leerHistorial()
    return h.length ? h : [{ texto: BIENVENIDA, tipo: 'bot', hora: hora() }]
  })
  const [escribiendo, setEscribiendo] = useState(false)
  const [entrada, setEntrada] = useState('')
  const zona = useRef<HTMLDivElement>(null)
  const idConversacion = useRef(0)

  useEffect(() => {
    const guardables = mensajes.filter(m => m.tipo !== 'error').slice(-MAX_HISTORIAL)
    try { localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(guardables)) } catch { /* sin cuota */ }
    zona.current?.scrollTo({ top: zona.current.scrollHeight })
  }, [mensajes, escribiendo, abierto])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const conStock = productos.filter(p => p.stock > 0)
  const deCategoria = (...palabras: string[]) => {
    const cat = categoriaPorPalabra(categorias, ...palabras)
    return cat ? conStock.filter(p => p.categoriaId === cat.id) : []
  }

  function responder(texto: string): Respuesta {
    const t = normalizar(texto)
    if (/(hola|buenas|buenos dias|buenas tardes|buenas noches)/.test(t))
      return { texto: 'Hola, ¿buscas algo en particular? Puedo recomendarte laptops, celulares, accesorios o componentes.' }
    if (/(laptop|computadora|pc|notebook|gamer)/.test(t))
      return { texto: 'Estas son las opciones de laptops y computadoras que tenemos con stock:', productos: deCategoria('laptop', 'computadora').slice(0, 4) }
    if (/(celular|telefono|smartphone|iphone|tablet)/.test(t))
      return { texto: 'Te dejo los teléfonos disponibles ahora:', productos: deCategoria('telefono', 'celular').slice(0, 4) }
    if (/(mouse|accesorio|consola|teclado|audifono)/.test(t))
      return { texto: 'Mira estos accesorios:', productos: [...deCategoria('accesorio'), ...deCategoria('consola')].slice(0, 4) }
    if (/(componente|ram|procesador|tarjeta de video|armar)/.test(t))
      return { texto: 'Para armado de PC tenemos esto:', productos: deCategoria('componente').slice(0, 4) }
    if (/(oferta|promo|descuento|pack)/.test(t))
      return { texto: 'Ahora hay packs con garantía oficial de 12 meses: Pack Laptop Pro, Pack Teléfono + Tablet y consola PlayStation 5. Los ves en el inicio de la tienda.' }
    if (/(recomiend|sugier|que me|algo)/.test(t))
      return { texto: 'Estos son algunos productos destacados:', productos: [...conStock].sort((a, b) => b.stock - a.stock).slice(0, 4) }
    if (/(envio|entrega|delivery)/.test(t)) return { texto: 'El envío es gratis a todo el Perú.' }
    if (/(garantia)/.test(t)) return { texto: 'Todos los productos tienen garantía oficial de 12 meses, y hay garantía extendida disponible.' }
    return { texto: 'Estoy en modo de prueba y entiendo consultas sobre laptops, celulares, accesorios, componentes, ofertas, envío y garantía.' }
  }

  const obtenerRespuesta = async (texto: string): Promise<Respuesta> => {
    await new Promise(r => setTimeout(r, RETARDO_MS))
    return responder(texto)
  }

  const enviar = async (textoCrudo: string) => {
    const texto = textoCrudo.trim()
    if (!texto || escribiendo) return
    const id = idConversacion.current
    setMensajes(m => [...m, { texto, tipo: 'usuario', hora: hora() }])
    setEscribiendo(true)
    try {
      const r = await obtenerRespuesta(texto)
      if (id !== idConversacion.current) return
      setMensajes(m => [...m, { texto: r.texto, tipo: 'bot', hora: hora(), productos: r.productos?.map(p => p.id) }])
    } catch {
      if (id !== idConversacion.current) return
      setMensajes(m => [...m, { texto: 'No pude comunicarme con el asistente. Inténtalo de nuevo en unos minutos.', tipo: 'error', hora: hora() }])
    } finally {
      if (id === idConversacion.current) setEscribiendo(false)
    }
  }

  const reiniciar = () => {
    idConversacion.current++
    setEscribiendo(false)
    setMensajes([{ texto: BIENVENIDA, tipo: 'bot', hora: hora() }])
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const t = entrada
    setEntrada('')
    void enviar(t)
  }

  const soloBienvenida = mensajes.length === 1 && mensajes[0].tipo === 'bot'

  return (
    <>
      <button type="button" className={`chatbot-boton ${abierto ? 'oculto' : ''}`} aria-label="Abrir asistente"
              onClick={() => setAbierto(true)} inert={abierto}>
        <i className="bi bi-chat-dots-fill" />
      </button>

      <section className={`chatbot-panel ${abierto ? 'abierto' : ''}`} aria-label="Asistente Master Tech" inert={!abierto}>
        <header className="chatbot-cabecera">
          <div className="chatbot-avatar"><i className="bi bi-robot" /></div>
          <div className="chatbot-titulo">
            <strong>Asistente Master Tech</strong>
            <span className="chatbot-estado">En línea</span>
          </div>
          <button type="button" className="chatbot-accion" title="Nueva conversación" aria-label="Nueva conversación" onClick={reiniciar}>
            <i className="bi bi-arrow-counterclockwise" />
          </button>
          <button type="button" className="chatbot-accion" title="Cerrar" aria-label="Cerrar" onClick={() => setAbierto(false)}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="chatbot-mensajes" ref={zona} aria-live="polite">
          {mensajes.map((m, i) => {
            const lista = (m.productos ?? []).map(id => productos.find(p => p.id === id)).filter((p): p is Producto => !!p)
            return (
              <div key={i}>
                <div className={`chatbot-mensaje ${m.tipo}`}>
                  {m.texto}<span className="chatbot-hora">{m.hora}</span>
                </div>
                {lista.length > 0 && (
                  <div className="chatbot-recomendaciones">
                    {lista.map(p => (
                      <article className="chatbot-producto" key={p.id}>
                        <div className="chatbot-producto-img">
                          <img src={imagenProducto(p.imagenUrl)} alt={p.nombre}
                               onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = IMG_DEFECTO }} />
                        </div>
                        <span className="chatbot-producto-marca">{marcaDe(p)}</span>
                        <p className="chatbot-producto-nombre">{p.nombre}</p>
                        <span className="chatbot-producto-precio">{formatoSoles(p.precio)}</span>
                        <div className="chatbot-producto-acciones">
                          <Link className="chatbot-producto-ver" to={`/producto/${p.id}`} onClick={() => setAbierto(false)}>Ver</Link>
                          <button type="button" className="chatbot-producto-agregar" disabled={p.stock <= 0}
                                  onClick={() => { const r = agregar(p); if (!r.ok) mostrarAlerta(r.mensaje ?? '') }}>
                            {p.stock <= 0 ? 'Agotado' : 'Agregar'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {escribiendo && <div className="chatbot-escribiendo"><span /><span /><span /></div>}
        </div>

        <div className="chatbot-sugerencias">
          {soloBienvenida && !escribiendo && SUGERENCIAS.map(s => (
            <button key={s} type="button" className="chatbot-sugerencia" onClick={() => void enviar(s)}>{s}</button>
          ))}
        </div>

        <form className="chatbot-formulario" onSubmit={onSubmit} autoComplete="off">
          <input type="text" className="chatbot-entrada" placeholder="Escribe tu mensaje..." maxLength={500} required
                 value={entrada} onChange={e => setEntrada(e.target.value)} disabled={escribiendo} />
          <button type="submit" className="chatbot-enviar" aria-label="Enviar" disabled={escribiendo}>
            <i className="bi bi-send-fill" />
          </button>
        </form>
      </section>
    </>
  )
}
