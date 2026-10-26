import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { rutaCategoria } from '../utils/categorias'

export default function Footer() {
  const { categorias } = useCatalog()
  const { esAdmin } = useAuth()

  return (
    <footer className="bg-black text-white pt-5 border-top border-secondary">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <h4 className="fw-bold text-danger mb-3">MASTER TECH</h4>
            <p className="text-secondary small">
              Tu tienda tecnológica de confianza en Perú. Celulares, Computadores y Servicio Técnico al mejor precio.
            </p>
            <div className="mt-3">
              <a href="#" className="text-white me-3 fs-5 social-icon" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#" className="text-white me-3 fs-5 social-icon" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="#" className="text-white me-3 fs-5 social-icon" aria-label="TikTok"><i className="bi bi-tiktok" /></a>
            </div>
          </div>
          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-uppercase mb-3">Tienda</h6>
            <ul className="list-unstyled small">
              {categorias.map(c => (
                <li key={c.id}><Link to={rutaCategoria(c)} className="footer-link">{c.nombre}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-uppercase mb-3">Empresa</h6>
            <ul className="list-unstyled small">
              <li><Link to="/nosotros" className="footer-link">Nosotros</Link></li>
              <li><Link to="/mision" className="footer-link">Misión y Visión</Link></li>
              <li><Link to="/perfil" className="footer-link">Mi perfil</Link></li>
              <li><Link to="/terminos" className="footer-link">Términos y Condiciones</Link></li>
              {esAdmin && <li><Link to="/admin/productos" className="footer-link">Gestión de productos</Link></li>}
            </ul>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-uppercase mb-3">Contacto</h6>
            <p className="small text-secondary mb-2"><i className="bi bi-geo-alt-fill me-2 text-danger" /> Lima, Perú</p>
            <p className="small text-secondary mb-2"><i className="bi bi-envelope-fill me-2 text-danger" /> soporte@mastertech.pe</p>
            <p className="small text-secondary mb-3"><i className="bi bi-telephone-fill me-2 text-danger" /> +51 999 888 777</p>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary pb-3" />
      </div>
    </footer>
  )
}
