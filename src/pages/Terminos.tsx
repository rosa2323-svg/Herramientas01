import { useEffect } from 'react'
import { Accordion } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SECCIONES = [
  {
    titulo: '1. Aceptación de los términos',
    cuerpo: (
      <>
<p className="mb-0">Cuando navegas, creas tu cuenta o compras en Master Tech, aceptas estos términos. Te recomendamos leerlos con calma, y si algo no te queda claro, escríbenos a <a href="mailto:soporte@mastertech.pe">soporte@mastertech.pe</a> y te ayudamos.</p>
      </>
    ),
  },
  {
    titulo: '2. Uso del sitio y tu cuenta',
    cuerpo: (
      <>
<p>Puedes explorar el catálogo sin registrarte. Para comprar, necesitas una cuenta, y debes ser mayor de edad.</p>
                        <p className="mb-2">Para que tu cuenta esté segura y tus compras lleguen bien:</p>
                        <ul>
                            <li>Registra tus datos reales (nombre, dirección y teléfono) y mantenlos al día en <strong>Mi perfil</strong>.</li>
                            <li>Elige una contraseña de al menos 8 caracteres. Puedes cambiarla cuando quieras desde la pestaña <strong>Seguridad</strong>.</li>
                            <li>No compartas tu contraseña. Todo lo que se haga desde tu cuenta se considera hecho por ti.</li>
                            <li>Si notas movimientos que no reconoces, escríbenos a <a href="mailto:soporte@mastertech.pe">soporte@mastertech.pe</a>.</li>
                        </ul>
                        <p className="mb-0">El sitio debe utilizarse con información propia y veraz.</p>
      </>
    ),
  },
  {
    titulo: '3. Productos, precios y disponibilidad',
    cuerpo: (
      <>
<p>Los precios se muestran en soles (S/) e incluyen impuestos. Las imágenes corresponden a los productos que vendemos.</p>
                        <p className="mb-0">El stock disponible se muestra desde que ves el producto. Como la tienda funciona en línea y varias personas pueden comprar al mismo tiempo, esa disponibilidad puede cambiar mientras realizas tu compra. Si un producto se agota antes de que pagues, te lo indicaremos para que puedas elegir otra opción.</p>
      </>
    ),
  },
  {
    titulo: '4. Proceso de compra y medios de pago',
    cuerpo: (
      <>
<p className="mb-0">Tu pedido queda confirmado cuando recibes el correo de confirmación. Aceptamos tarjetas de crédito y débito.</p>
      </>
    ),
  },
  {
    titulo: '5. Envíos y entregas',
    cuerpo: (
      <>
<p>Enviamos a todo el Perú sin costo. El plazo de entrega se informa al confirmar la compra y depende de tu ubicación.</p>
                        <p className="mb-0">Revisa el paquete al recibirlo. Si llega dañado o incompleto, avísanos dentro de las 48 horas siguientes con fotos del producto y del empaque.</p>
      </>
    ),
  },
  {
    titulo: '6. Garantía y servicio técnico',
    cuerpo: (
      <>
<p>Los equipos nuevos tienen garantía oficial de 12 meses por defectos de fabricación, con tu comprobante de compra.</p>
                        <p className="mb-2">La garantía no cubre:</p>
                        <ul>
                            <li>Golpes, caídas o contacto con líquidos.</li>
                            <li>Reparaciones hechas por terceros no autorizados.</li>
                            <li>Desgaste normal por el uso.</li>
                        </ul>
                        <p className="mb-0">Nuestro servicio técnico atiende reparaciones y mantenimientos. Te damos un diagnóstico antes de iniciar cualquier trabajo.</p>
      </>
    ),
  },
  {
    titulo: '7. Cambios y devoluciones',
    cuerpo: (
      <>
<p>Puedes pedir un cambio o devolución si el producto tiene un defecto, no corresponde a lo que compraste o llegó dañado. Debe estar sin señales de mal uso y con su empaque y accesorios originales.</p>
                        <p className="mb-0">El reembolso se hace por el mismo medio de pago que usaste.</p>
      </>
    ),
  },
  {
    titulo: '8. Datos personales',
    cuerpo: (
      <>
<p>Usamos tus datos solo para procesar tus pedidos, entregarlos y atenderte. No los vendemos a terceros. Los tratamos conforme a la Ley N.° 29733, de Protección de Datos Personales.</p>
                        <p className="mb-0">Puedes pedir acceso, corrección o eliminación de tus datos escribiendo a <a href="mailto:soporte@mastertech.pe">soporte@mastertech.pe</a>.</p>
      </>
    ),
  },
  {
    titulo: '9. Propiedad intelectual',
    cuerpo: (
      <>
<p className="mb-0">El nombre, el logo, los textos y las imágenes del sitio pertenecen a Master Tech o a sus titulares. No puedes copiarlos ni usarlos con fines comerciales sin autorización por escrito.</p>
      </>
    ),
  },
  {
    titulo: '10. Reclamos y contacto',
    cuerpo: (
      <>
<p>Si tienes un problema con tu compra, escríbenos y lo resolvemos. También puedes presentar un reclamo en nuestro Libro de Reclamaciones, según el Código de Protección y Defensa del Consumidor (Ley N.° 29571).</p>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-1"><i className="bi bi-envelope-fill text-danger me-2"></i>soporte@mastertech.pe</li>
                            <li><i className="bi bi-telephone-fill text-danger me-2"></i>+51 999 888 777</li>
                        </ul>
      </>
    ),
  },
  {
    titulo: '11. Cambios en estos términos',
    cuerpo: (
      <>
<p className="mb-0">Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de actualización. Las compras ya realizadas se rigen por los términos que estaban vigentes al comprar.</p>
      </>
    ),
  },
]

export default function Terminos() {
  useEffect(() => { document.title = 'Términos y Condiciones | MASTER TECH' }, [])
  return (
    <div className="py-5">
      <div className="container">
        <section className="legal-banner rounded-4 shadow-sm text-white p-4 p-md-5 mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-3">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50">Inicio</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">Términos y Condiciones</li>
            </ol>
          </nav>
          <h1 className="fw-bold mb-2">Términos y Condiciones</h1>
          <p className="mb-0 opacity-75">Las reglas de compra, envío y garantía en Master Tech, explicadas de forma clara.</p>
          <p className="small mb-0 mt-3 opacity-75"><i className="bi bi-calendar-check me-2" />Última actualización: 13 de octubre de 2026</p>
        </section>

        <Accordion className="legal-acordeon">
          {SECCIONES.map((s, i) => (
            <Accordion.Item eventKey={String(i)} key={s.titulo}>
              <Accordion.Header>{s.titulo}</Accordion.Header>
              <Accordion.Body className="legal-texto text-secondary">{s.cuerpo}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
