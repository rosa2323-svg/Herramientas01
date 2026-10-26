
# Master Tech — Frontend (React + TypeScript + Vite)

Migración del front HTML/CSS/JS (`Herramientas01`) a React, conectado al backend Spring Boot.

## Ejecutar
```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8089
npm run dev              # http://localhost:5173
npm run build            # genera dist/
```
El backend debe estar en marcha y con `FRONTEND_URL=http://localhost:5173` (CORS + redirecciones de Stripe).

## Estructura
- `src/api/` cliente `fetch` con JWT (`client.ts`) y tipos (`types.ts`)
- `src/context/` sesión (JWT), catálogo, carrito (localStorage) y alertas
- `src/components/` Navbar, Footer, LoginModal, Chatbot, ProductCard, rutas protegidas, layout admin
- `src/pages/` tienda: Home, Category, Search, ProductDetail, Cart, PagoConfirmar, Register, Profile, Nosotros, Mision, Terminos
- `src/pages/admin/` Productos, Categorías, Ventas, Dashboard, Usuarios (solo rol ADMIN)

## Flujo de compra
Carrito en el navegador → `POST /api/v1/pedidos/checkout` (precios y stock se validan en el servidor) → Stripe Checkout → vuelve a `/pago/confirmar` → `POST /api/v1/pedidos/confirmar` registra la venta y descuenta stock.

## Rutas
`/` · `/categoria/:slug` · `/buscar?query=` · `/producto/:id` · `/carrito` · `/registro` · `/perfil` · `/nosotros` · `/mision` · `/terminos` · `/admin/{productos,categorias,ventas,dashboard,usuarios}`
