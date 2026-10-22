const DESCUENTO_PORCENTAJE = 15;
const CALIFICACION_DECORATIVA = 4.5;
const STOCK_BAJO = 5;

const NOMBRES_CATEGORIA = {
    laptops: "Laptops y Computadoras",
    telefonos: "Teléfonos y Tablets",
    accesorios: "Accesorios",
    componentes: "Componentes"
};

function normalizarProducto(p) {
    return {
        id: p.id,
        nombre: p.nombre,
        marca: p.marca || "Sin marca",
        precio: Number(p.precio),
        stock: p.stock ?? null,
        imagen: p.imagen || p.imagenUrl || "",
        categoria: p.categoria || "",
        descripcion: p.descripcion || "",
        especificaciones: normalizarEspecificaciones(p.especificaciones)
    };
}
function normalizarEspecificaciones(esp) {
    if (!esp) return [];
    if (Array.isArray(esp)) return esp;
    return Object.entries(esp).map(([nombre, valor]) => ({ nombre, valor }));
}

async function obtenerProducto(id) {
    const encontrado = productos.find(p => String(p.id) === String(id));
    return encontrado ? normalizarProducto(encontrado) : null;
}

async function obtenerRelacionados(producto) {
    return productos
        .filter(p => p.categoria === producto.categoria && String(p.id) !== String(producto.id))
        .slice(0, 4)
        .map(normalizarProducto);
}

function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function formatearPrecio(valor) {
    return "S/ " + Number(valor).toFixed(2);
}

function estrellasHTML(calificacion) {
    const llenas = Math.floor(calificacion);
    const media = calificacion - llenas >= 0.5;
    let html = "";
    for (let i = 0; i < llenas; i++) html += '<i class="bi bi-star-fill text-warning"></i> ';
    if (media) html += '<i class="bi bi-star-half text-warning"></i>';
    return html;
}

function etiquetaStockHTML(stock) {
    if (stock === null || stock > STOCK_BAJO) {
        return '<span class="etiqueta-stock bg-success text-white"><i class="bi bi-check-circle me-1"></i> En stock</span>';
    }
    if (stock > 0) {
        return `<span class="etiqueta-stock bg-warning text-dark">¡Solo ${stock} disponibles!</span>`;
    }
    return '<span class="etiqueta-stock bg-secondary text-white">Agotado</span>';
}

function especificacionesHTML(especificaciones) {
    if (!especificaciones.length) return "";
    const filas = especificaciones.map(e => `
        <tr>
            <th scope="row">${escapar(e.nombre)}</th>
            <td>${escapar(e.valor)}</td>
        </tr>`).join("");
    return `
        <div class="bg-white rounded-4 p-4 shadow-sm mb-4">
            <h5 class="fw-bold mb-3 pb-2 titulo-seccion d-inline-block">Información técnica</h5>
            <table class="tabla-especificaciones">
                <tbody>${filas}</tbody>
            </table>
        </div>`;
}

function descripcionHTML(descripcion) {
    if (!descripcion) return "";
    return `
        <div class="bg-white rounded-4 p-4 shadow-sm mb-4">
            <h5 class="fw-bold mb-1 pb-2 titulo-seccion d-inline-block">Descripción del producto</h5>
            <p class="text-muted mt-3 mb-0">${escapar(descripcion)}</p>
        </div>`;
}

function detalleHTML(p) {
    const hayStock = p.stock === null || p.stock > 0;
    const precioReferencia = p.precio / (1 - DESCUENTO_PORCENTAJE / 100);
    const nombreCategoria = NOMBRES_CATEGORIA[p.categoria] || p.categoria;

    return `
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="../index.html">Inicio</a></li>
                ${p.categoria ? `<li class="breadcrumb-item"><a href="categoria.html?cat=${encodeURIComponent(p.categoria)}">${escapar(nombreCategoria)}</a></li>` : ""}
                <li class="breadcrumb-item active">${escapar(p.nombre)}</li>
            </ol>
        </nav>

        <div class="row g-5 bg-white rounded-4 p-4 shadow-sm mb-4">
            <div class="col-md-5 d-flex align-items-center justify-content-center">
                <img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" class="imagen-principal">
            </div>

            <div class="col-md-7">
                <span class="etiqueta-marca mb-3 d-inline-block">${escapar(p.marca)}</span>
                <h1 class="fw-bold mb-2 titulo-producto">${escapar(p.nombre)}</h1>

                <div class="mb-3">
                    ${estrellasHTML(CALIFICACION_DECORATIVA)}
                    <span class="text-muted small ms-2">(${CALIFICACION_DECORATIVA} / 5)</span>
                </div>

                <hr>

                <div class="mb-3">
                    <span class="precio-principal">${formatearPrecio(p.precio)}</span>
                    <span class="ms-2 text-muted text-decoration-line-through small">${formatearPrecio(precioReferencia)}</span>
                    <span class="badge bg-danger ms-2">-${DESCUENTO_PORCENTAJE}%</span>
                </div>

                <div class="mb-4">${etiquetaStockHTML(p.stock)}</div>

                ${hayStock ? `
                <div class="mb-4">
                    <p class="fw-semibold mb-2">Cantidad:</p>
                    <div class="control-cantidad">
                        <button type="button" id="botonMenos" aria-label="Disminuir cantidad"><i class="bi bi-dash"></i></button>
                        <input type="number" id="cantidadInput" value="1" min="1" max="${p.stock ?? 99}">
                        <button type="button" id="botonMas" aria-label="Aumentar cantidad"><i class="bi bi-plus"></i></button>
                    </div>
                </div>` : ""}

                <div class="d-flex gap-3 flex-wrap mb-4">
                    <button type="button" id="botonAgregar" class="boton-agregar"
                            ${hayStock ? "" : "disabled"}
                            data-id="${escapar(p.id)}"
                            data-nombre="${escapar(p.nombre)}"
                            data-precio="${p.precio.toFixed(2)}"
                            data-imagen="${escapar(p.imagen)}"
                            data-marca="${escapar(p.marca)}">
                        <i class="bi bi-cart-plus me-2"></i>${hayStock ? "Agregar al carrito" : "Agotado"}
                    </button>
                    <a href="carrito.html" class="boton-carrito">
                        <i class="bi bi-cart3 me-2"></i>Ver carrito
                    </a>
                </div>

                <div class="row g-3">
                    ${tarjetaBeneficio("bi-truck", "Envío gratis", "A todo el Perú")}
                    ${tarjetaBeneficio("bi-shield-check", "Garantía", "12 meses oficial")}
                    ${tarjetaBeneficio("bi-arrow-counterclockwise", "Devolución", "30 días")}
                </div>
            </div>
        </div>

        ${especificacionesHTML(p.especificaciones)}
        ${descripcionHTML(p.descripcion)}`;
}

function tarjetaBeneficio(icono, titulo, texto) {
    return `
        <div class="col-4">
            <div class="tarjeta-beneficio">
                <i class="bi ${icono} d-block mb-1"></i>
                <p class="small fw-semibold mb-0">${titulo}</p>
                <p class="small text-muted mb-0">${texto}</p>
            </div>
        </div>`;
}

function tarjetaRelacionadoHTML(p) {
    return `
        <div class="col-6 col-md-3">
            <a href="producto.html?id=${encodeURIComponent(p.id)}" class="text-decoration-none text-dark">
                <div class="producto-relacionado bg-white rounded-4 p-3 shadow-sm h-100">
                    <img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}">
                    <p class="fw-semibold small mt-3 mb-1">${escapar(p.nombre)}</p>
                    <p class="fw-bold mb-0">${formatearPrecio(p.precio)}</p>
                </div>
            </a>
        </div>`;
}

/* ---------- Comportamiento ---------- */

function activarControles() {
    const input = document.getElementById("cantidadInput");
    const botonAgregar = document.getElementById("botonAgregar");

    function cambiarCantidad(delta) {
        if (!input) return;
        const max = parseInt(input.max) || 99;
        input.value = Math.min(max, Math.max(1, (parseInt(input.value) || 1) + delta));
    }

    document.getElementById("botonMenos")?.addEventListener("click", () => cambiarCantidad(-1));
    document.getElementById("botonMas")?.addEventListener("click", () => cambiarCantidad(1));
    input?.addEventListener("change", () => cambiarCantidad(0));

    botonAgregar?.addEventListener("click", () => {
        const cantidad = parseInt(input?.value) || 1;
        // Se conecta con carrito.js cuando exista (misma firma que en Phantom: agregarAlCarrito(boton))
        if (typeof agregarAlCarrito === "function") {
            for (let i = 0; i < cantidad; i++) agregarAlCarrito(botonAgregar);
        } else {
            console.warn("carrito.js aún no está cargado. Producto:", botonAgregar.dataset, "cantidad:", cantidad);
        }
    });

    // Imagen de respaldo si la ruta falla
    document.querySelector(".imagen-principal")?.addEventListener("error", e => {
        e.target.src = "../Imagenes/sinimagen.jpg";
    }, { once: true });
}

async function iniciarVistaProducto() {
    const contenedor = document.getElementById("detalleProducto");
    const id = new URLSearchParams(window.location.search).get("id");
    const producto = id ? await obtenerProducto(id) : null;

    if (!producto) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <h4 class="fw-bold">Producto no encontrado</h4>
                <a href="../index.html" class="boton-carrito d-inline-block mt-3">Volver al inicio</a>
            </div>`;
        return;
    }

    document.title = `Master Tech | ${producto.nombre}`;
    contenedor.innerHTML = detalleHTML(producto);
    activarControles();

    const relacionados = await obtenerRelacionados(producto);
    if (relacionados.length) {
        document.getElementById("relacionados").innerHTML = relacionados.map(tarjetaRelacionadoHTML).join("");
        document.getElementById("seccionRelacionados").classList.remove("d-none");
    }
}

iniciarVistaProducto();
