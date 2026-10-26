import { useState, type InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { grupoClase?: string }

export default function PasswordInput({ grupoClase = '', className = '', ...resto }: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <div className={`input-group ${grupoClase}`}>
      <input {...resto} type={visible ? 'text' : 'password'}
             className={`form-control bg-black text-white border-secondary rounded-start-3 ${className}`} />
      <button className="btn btn-outline-secondary" type="button"
              aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setVisible(v => !v)}>
        <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} />
      </button>
    </div>
  )
}
