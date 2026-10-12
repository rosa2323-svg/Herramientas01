const CLAVE_CATEGORIAS = "mastertech_categorias";
const UMBRAL_STOCK_BAJO = 5;

const CATEGORIAS_INICIALES = [
    { id: 1, slug: "laptops",     nombre: "Laptops",     descripcion: "Laptops y PCs de escritorio" },
    { id: 2, slug: "telefonos",   nombre: "Teléfonos",   descripcion: "Smartphones y celulares" },
    { id: 3, slug: "accesorios",  nombre: "Accesorios",  descripcion: "Periféricos y consolas" },
    { id: 4, slug: "componentes", nombre: "Componentes", descripcion: "Partes para armado de PC" }
];

/**
 * Lee una lista de localStorage; si no existe o está dañada, usa una copia de la inicial.
 * @param {string} clave - Clave de almacenamiento.
 * @param {Array} inicial - Valores por defecto.
 * @returns {Array} Lista leída o copia de la inicial.
 */
function leerLista(clave, inicial) {
    try {
        const guardado = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(guardado) ? guardado : structuredClone(inicial);
    } catch {
        return structuredClone(inicial);
    }
}

/**
 * Guarda una lista en localStorage como JSON, capturando errores de cuota o permisos.
 * @param {string} clave - Clave de almacenamiento.
 * @param {Array} lista - Datos a guardar.
 * @returns {{ok: boolean, error?: string}} Resultado de la escritura.
 */
function guardarLista(clave, lista) {
    try {
        localStorage.setItem(clave, JSON.stringify(lista));
        return { ok: true };
    } catch {
        return { ok: false, error: "No se pudo guardar. Revisa el espacio o los permisos del navegador." };
    }
}

/**
 * Calcula el siguiente id disponible de una lista.
 * @param {Array<{id: number}>} lista - Elementos con id numérico.
 * @returns {number} Id mayor + 1.
 */
function siguienteId(lista) {
    return lista.reduce((max, x) => Math.max(max, x.id), 0) + 1;
}

// ---------- Productos ----------

/**
 * Obtiene la lista de productos guardada, o los productos iniciales si no hay datos.
 * @returns {Array<Object>} Lista de productos.
 */
function obtenerProductos() {
    return leerLista(CLAVE_PRODUCTOS, PRODUCTOS_INICIALES);
}

/**
 * Crea un producto nuevo con un id autogenerado.
 * @param {Object} datos - Datos del producto.
 * @returns {Object} Producto creado.
 */
function crearProducto(datos) {
    const lista = obtenerProductos();
    const nuevo = { ...datos, id: siguienteId(lista) };
    lista.push(nuevo);
    guardarLista(CLAVE_PRODUCTOS, lista);
    return nuevo;
}

/**
 * Actualiza un producto conservando los campos que el formulario no edita (ej. especificaciones).
 * @param {number} id - Id del producto.
 * @param {Object} datos - Campos a modificar.
 */
function actualizarProducto(id, datos) {
    const lista = obtenerProductos().map(p => (p.id === id ? { ...p, ...datos, id } : p));
    guardarLista(CLAVE_PRODUCTOS, lista);
}

/**
 * Elimina un producto por su id.
 * @param {number} id - Id del producto.
 */
function eliminarProducto(id) {
    guardarLista(CLAVE_PRODUCTOS, obtenerProductos().filter(p => p.id !== id));
}

/**
 * Calcula total de productos, productos con stock bajo y valor del inventario.
 * @param {Array<Object>} lista - Productos.
 * @returns {{total: number, stockBajo: number, valorInventario: number}} Métricas calculadas.
 */
function calcularMetricas(lista) {
    return {
        total: lista.length,
        stockBajo: lista.filter(p => p.stock <= UMBRAL_STOCK_BAJO).length,
        valorInventario: lista.reduce((suma, p) => suma + p.precio * p.stock, 0)
    };
}

// ---------- Categorías ----------

/**
 * Obtiene la lista de categorías guardada, o las categorías iniciales si no hay datos.
 * @returns {Array<Object>} Lista de categorías.
 */
function obtenerCategorias() {
    return leerLista(CLAVE_CATEGORIAS, CATEGORIAS_INICIALES);
}

/**
 * Cuenta los productos que pertenecen a una categoría.
 * @param {string} slug - Slug de la categoría.
 * @returns {number} Cantidad de productos asociados.
 */
function contarProductosPorCategoria(slug) {
    return obtenerProductos().filter(p => p.categoria === slug).length;
}

/**
 * Convierte un texto en slug (minúsculas, sin tildes, separado por guiones).
 * @param {string} texto - Texto original.
 * @returns {string} Slug resultante.
 */
function crearSlug(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Crea una categoría nueva. El slug se genera a partir del nombre.
 * @param {{nombre: string, descripcion: string}} datos - Datos de la categoría.
 * @returns {{ok: boolean, error?: string}} Resultado de la operación.
 */
function crearCategoria({ nombre, descripcion }) {
    const lista = obtenerCategorias();
    const slug = crearSlug(nombre);
    if (!slug) return { ok: false, error: "Escribe un nombre válido." };
    if (lista.some(c => c.slug === slug)) return { ok: false, error: "Ya existe una categoría con ese nombre." };
    lista.push({ id: siguienteId(lista), slug, nombre, descripcion });
    return guardarLista(CLAVE_CATEGORIAS, lista);
}

/**
 * Actualiza nombre y descripción de una categoría. El slug no cambia
 * para no romper productos ni enlaces.
 * @param {number} id - Id de la categoría.
 * @param {{nombre: string, descripcion: string}} datos - Nuevos datos.
 * @returns {{ok: boolean, error?: string}} Resultado de la operación.
 */
function actualizarCategoria(id, { nombre, descripcion }) {
    const lista = obtenerCategorias();
    if (!lista.some(c => c.id === id)) {
        return { ok: false, error: "La categoría no existe." };
    }
    const slugNuevo = crearSlug(nombre);
    if (!slugNuevo) return { ok: false, error: "Escribe un nombre válido." };
    if (lista.some(c => c.id !== id && crearSlug(c.nombre) === slugNuevo)) {
        return { ok: false, error: "Ya existe una categoría con ese nombre." };
    }
    return guardarLista(CLAVE_CATEGORIAS, lista.map(c => (c.id === id ? { ...c, nombre, descripcion } : c)));
}

/**
 * Elimina una categoría si no tiene productos asociados.
 * @param {number} id - Id de la categoría.
 * @returns {{ok: boolean, error?: string}} Resultado de la operación.
 */
function eliminarCategoria(id) {
    const lista = obtenerCategorias();
    const categoria = lista.find(c => c.id === id);
    if (!categoria) return { ok: false, error: "La categoría no existe." };
    const cantidad = contarProductosPorCategoria(categoria.slug);
    if (cantidad > 0) {
        return { ok: false, error: `No se puede eliminar "${categoria.nombre}": tiene ${cantidad} producto(s) asociado(s).` };
    }
    return guardarLista(CLAVE_CATEGORIAS, lista.filter(c => c.id !== id));
}

// ---------- Usuarios ----------

/**
 * Obtiene la lista de usuarios guardada, o los usuarios iniciales si no hay datos.
 * @returns {Array<Object>} Lista de usuarios.
 */
function obtenerUsuarios() {
    return leerLista(CLAVE_USUARIOS, USUARIOS_INICIALES);
}

/**
 * Cambia el rol de un usuario.
 * @param {number} id - Identificador del usuario.
 * @param {string} rol - Nuevo rol (debe estar en ROLES_USUARIO).
 * @returns {{ok: boolean, error?: string}} Resultado de la operación.
 */
function cambiarRolUsuario(id, rol) {
    if (!ROLES_USUARIO.includes(rol)) return { ok: false, error: "Rol no válido." };
    const lista = obtenerUsuarios();
    if (!lista.some(u => u.id === id)) return { ok: false, error: "El usuario no existe." };
    return guardarLista(CLAVE_USUARIOS, lista.map(u => (u.id === id ? { ...u, rol } : u)));
}

/**
 * Habilita o deshabilita a un usuario.
 * @param {number} id - Identificador del usuario.
 * @param {boolean} activo - true para habilitar, false para deshabilitar.
 * @returns {{ok: boolean, error?: string}} Resultado de la operación.
 */
function cambiarEstadoUsuario(id, activo) {
    const lista = obtenerUsuarios();
    if (!lista.some(u => u.id === id)) return { ok: false, error: "El usuario no existe." };
    return guardarLista(CLAVE_USUARIOS, lista.map(u => (u.id === id ? { ...u, activo } : u)));
}

/**
 * Elimina un usuario por su id.
 * @param {number} id - Identificador del usuario.
 * @returns {{ok: boolean, error?: string}} Resultado de la operación.
 */
function eliminarUsuario(id) {
    const lista = obtenerUsuarios();
    if (!lista.some(u => u.id === id)) return { ok: false, error: "El usuario no existe." };
    return guardarLista(CLAVE_USUARIOS, lista.filter(u => u.id !== id));
}