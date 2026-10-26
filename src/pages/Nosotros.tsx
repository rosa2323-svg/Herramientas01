import { useEffect } from 'react'

export default function Nosotros() {
  useEffect(() => { document.title = 'Nosotros | MASTER TECH' }, [])
  return (
    <>

    <section className="container my-5 py-5">
        <div className="row align-items-center g-5">
            <div className="col-lg-6">
                <img
                        src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/Equipo.png"
                        alt="Equipo de Master Tech"
                        className="img-fluid rounded-3 shadow-lg" />
            </div>
            <div className="col-lg-6">
                <h6 className="text-uppercase fw-bold mb-2" style={{ color: 'var(--color-secundario)' }}>
                    Sobre nosotros
                </h6>
                <h1 className="display-5 fw-bold mb-4">
                    Tecnología confiable, a tu alcance
                </h1>
                <p className="lead text-secondary mb-4">
                    En <strong>Master Tech</strong> vendemos laptops, computadoras,
                    celulares y accesorios, y ofrecemos servicio técnico especializado
                    para que la tecnología nunca te falle.
                </p>
                <p className="text-secondary mb-4">
                    Nuestro equipo combina experiencia técnica y trato cercano para
                    asesorarte en tu compra o reparación, sin tecnicismos innecesarios
                    y con marcas en las que puedes confiar.
                </p>
                <div className="row g-3">
                    <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-secundario)' }}></i>
                            <span>Equipos originales</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-secundario)' }}></i>
                            <span>Servicio técnico</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-secundario)' }}></i>
                            <span>Garantía oficial</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-secundario)' }}></i>
                            <span>Asesoría personalizada</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section className="container py-4">
        <div className="text-center mb-5">
            <h6 className="text-uppercase fw-bold mb-2"
                style={{ color: 'var(--color-secundario)' }}>
                Master Tech en cifras
            </h6>
            <h2 className="display-6 fw-bold">
                Nuestro compromiso
            </h2>
            <p className="text-secondary">
                Aspectos que representan nuestra propuesta de valor.
            </p>
        </div>
        <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
                <div className="p-4 h-100 shadow-sm rounded-3">
                    <i className="bi bi-laptop display-5"
                       style={{ color: 'var(--color-secundario)' }}></i>
                    <h3 className="fw-bold mt-3">
                        +100
                    </h3>
                    <p className="text-secondary mb-0">
                        Productos tecnológicos
                    </p>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="p-4 h-100 shadow-sm rounded-3">
                    <i className="bi bi-grid-3x3-gap display-5"
                       style={{ color: 'var(--color-secundario)' }}></i>
                    <h3 className="fw-bold mt-3">
                        4
                    </h3>
                    <p className="text-secondary mb-0">
                        Categorías principales
                    </p>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="p-4 h-100 shadow-sm rounded-3">
                    <i className="bi bi-tools display-5"
                       style={{ color: 'var(--color-secundario)' }}></i>
                    <h3 className="fw-bold mt-3">
                        +50
                    </h3>
                    <p className="text-secondary mb-0">
                        Servicio técnicos realizados
                    </p>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="p-4 h-100 shadow-sm rounded-3">
                    <i className="bi bi-people display-5"
                       style={{ color: 'var(--color-secundario)' }}></i>
                    <h3 className="fw-bold mt-3">
                        4
                    </h3>
                    <p className="text-secondary mb-0">
                        Áreas representadas
                    </p>
                </div>
            </div>
        </div>
    </section>
    <section className="container py-5">
        <div className="text-center mb-5">
            <h6 className="text-uppercase fw-bold mb-2" style={{ color: 'var(--color-secundario)' }}>
                Nuestro equipo
            </h6>
            <h2 className="display-6 fw-bold">
                Conoce a nuestro equipo
            </h2>
            <p className="text-secondary">
                Las personas detrás de cada venta, cada reparación y cada
                recomendación en Master Tech.
            </p>
        </div>
        <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
                <div className="card product-card h-100 border-0 shadow-sm">
                    <img src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/almacen.png" className="card-img-top" alt="Encargado de Almacén" />
                    <div className="card-body text-center">
                        <h5 className="fw-bold">Encargado de Almacén</h5>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
                <div className="card product-card h-100 border-0 shadow-sm">
                    <img src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/tecnico.png" className="card-img-top" alt="Técnico de Soporte" />
                    <div className="card-body text-center">
                        <h5 className="fw-bold">Técnico de Soporte</h5>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
                <div className="card product-card h-100 border-0 shadow-sm">
                    <img src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/ventas.png" className="card-img-top" alt="Asesor de Ventas" />
                    <div className="card-body text-center">
                        <h5 className="fw-bold">Asesor de Ventas</h5>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
                <div className="card product-card h-100 border-0 shadow-sm">
                    <img src="https://fgxhqbwqjypgxwwafgam.supabase.co/storage/v1/object/public/Mision%20y%20Vision/administrador.png" className="card-img-top" alt="Administrador" />
                    <div className="card-body text-center">
                        <h5 className="fw-bold">Administrador</h5>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </>
  )
}
