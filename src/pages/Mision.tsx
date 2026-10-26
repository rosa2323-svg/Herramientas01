import { useEffect } from 'react'

export default function Mision() {
  useEffect(() => { document.title = 'Misión y Visión | MASTER TECH' }, [])
  return (
    <>

    <section className="container py-5">
        <div className="text-center mb-5">
            <span className="text-uppercase fw-semibold" style={{ color: 'var(--color-secundario)' }}>
                Master Tech
            </span>
            <h1 className="display-5 fw-bold mt-2">
                Misión y Visión
            </h1>
            <p className="lead text-secondary mt-3">
                Conoce hacia dónde vamos y qué nos mueve a diario en Master Tech.
            </p>
        </div>
        <section className="py-4">
            <div className="row align-items-center g-5">
                <div className="col-md-6">
                    <img
                            src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/misionmastertech.png"
                            className="img-fluid rounded-4 shadow"
                            alt="Misión de Master Tech" />
                </div>
                <div className="col-md-6">
                    <h2 className="fw-bold mb-4">
                        <i className="bi bi-bullseye me-2" style={{ color: 'var(--color-secundario)' }}></i>Nuestra Misión
                    </h2>
                    <p className="lead text-secondary">
                        Ofrecer laptops, equipos de cómputo, dispositivos móviles y accesorios
                        tecnológicos de calidad, junto con un servicio técnico confiable, para
                        que cada cliente tenga la herramienta correcta al mejor precio.
                    </p>
                    <p className="text-secondary">
                        Trabajamos para que comprar o reparar tu equipo sea una experiencia
                        simple: asesoría honesta, marcas garantizadas y soporte técnico
                        especializado antes, durante y después de la compra.
                    </p>
                </div>
            </div>
        </section>
        <hr className="my-5" />
        <section className="py-4">
            <div className="row align-items-center g-5">
                <div className="col-md-6 order-2 order-md-1">
                    <h2 className="fw-bold mb-4">
                        <i className="bi bi-eye me-2" style={{ color: 'var(--color-secundario)' }}></i>Nuestra Visión
                    </h2>
                    <p className="lead text-secondary">
                        Ser la tienda de tecnología de referencia, reconocida por la calidad
                        de nuestros productos, la rapidez de nuestro servicio técnico y la
                        confianza de nuestros clientes.
                    </p>
                    <p className="text-secondary">
                        Buscamos crecer de la mano de las nuevas tecnologías, ampliando
                        nuestro catálogo de laptops, componentes y servicios, sin perder
                        el trato cercano que nos caracteriza.
                    </p>
                </div>
                <div className="col-md-6 order-1 order-md-2">
                    <img
                            src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/visionmastertech.png"
                            className="img-fluid rounded-4 shadow"
                            alt="Visión de Master Tech" />
                </div>
            </div>
        </section>
        <hr className="my-5" />
        <section className="py-4">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Nuestros Valores</h2>
                <p className="text-secondary">Lo que respalda cada venta y cada reparación</p>
            </div>
            <div className="row g-4 text-center">
                <div className="col-md-3 col-6">
                    <i className="bi bi-shield-check display-5" style={{ color: 'var(--color-secundario)' }}></i>
                    <h6 className="fw-bold mt-3">Garantía</h6>
                    <p className="text-secondary small">Equipos y reparaciones respaldadas.</p>
                </div>
                <div className="col-md-3 col-6">
                    <i className="bi bi-lightning-charge display-5" style={{ color: 'var(--color-secundario)' }}></i>
                    <h6 className="fw-bold mt-3">Rapidez</h6>
                    <p className="text-secondary small">Atención y soporte técnico ágil.</p>
                </div>
                <div className="col-md-3 col-6">
                    <i className="bi bi-award display-5" style={{ color: 'var(--color-secundario)' }}></i>
                    <h6 className="fw-bold mt-3">Calidad</h6>
                    <p className="text-secondary small">Solo marcas y equipos confiables.</p>
                </div>
                <div className="col-md-3 col-6">
                    <i className="bi bi-people display-5" style={{ color: 'var(--color-secundario)' }}></i>
                    <h6 className="fw-bold mt-3">Cercanía</h6>
                    <p className="text-secondary small">Asesoría honesta y personalizada.</p>
                </div>
            </div>
        </section>
    </section>

    </>
  )
}
