import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Modal } from 'react-bootstrap'

interface AlertCtx {
  mostrarAlerta: (mensaje: string, exito?: boolean) => void
}

const Ctx = createContext<AlertCtx | null>(null)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerta, setAlerta] = useState<{ mensaje: string; exito: boolean } | null>(null)
  const mostrarAlerta = useCallback((mensaje: string, exito = false) => setAlerta({ mensaje, exito }), [])

  return (
    <Ctx.Provider value={{ mostrarAlerta }}>
      {children}
      <Modal show={alerta !== null} onHide={() => setAlerta(null)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className={`fw-bold w-100 text-center ${alerta?.exito ? 'text-success' : 'text-danger'}`}>
            <i className={`bi me-2 ${alerta?.exito ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'}`} />
            {alerta?.exito ? '¡Éxito!' : 'Atención'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pb-4">{alerta?.mensaje}</Modal.Body>
      </Modal>
    </Ctx.Provider>
  )
}

export function useAlert() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAlert debe usarse dentro de AlertProvider')
  return c
}
