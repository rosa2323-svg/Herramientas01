import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../../../../Downloads/mastertech-frontend/src/styles/estilos.css'
import '../../../../Downloads/mastertech-frontend/src/styles/chatbot.css'
import App from './App'
import { AlertProvider } from '../../../../Downloads/mastertech-frontend/src/context/AlertContext'
import { AuthProvider } from '../../../../Downloads/mastertech-frontend/src/context/AuthContext'
import { CartProvider } from '../../../../Downloads/mastertech-frontend/src/context/CartContext'
import { CatalogProvider } from '../../../../Downloads/mastertech-frontend/src/context/CatalogContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <CatalogProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </CatalogProvider>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>,
)
