/**
 * Módulo de la vista de administración de usuarios: tabla, búsqueda,
 * detalle, cambio de rol, habilitar/deshabilitar y eliminación.
 */
(function () {

    // ----- Estado de la vista -----
    const estado = { texto: "", rol: "", estado: "" };
    let idPorEliminar = null;

    // ----- Elementos de la página -----
    const cuerpo = document.getElementById("cuerpoTabla");
    const buscador = document.getElementById("buscador");
    const filtroRol = document.getElementById("filtroRol");
    const filtroEstado = document.getElementById("filtroEstado");
    const modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalle"));
    const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

    // ----- Utilidades -----

    /**
     * Convierte una fecha ISO a formato dd/mm/aaaa (2026-02-03 -> 03/02/2026).
     * @param {string} fecha - Fecha en formato aaaa-mm-dd.
     * @returns {string} Fecha en formato dd/mm/aaaa.
     */
    const formatoFecha = fecha => fecha.split("-").reverse().join("/");

    // ----- Filtro de búsqueda -----

    /**
     * Pasa un texto a minúsculas y sin tildes: "Lucía" -> "lucia".
     * @param {*} texto - Texto a normalizar.
     * @returns {string} Texto normalizado.
     */
    const normalizar = texto => String(texto).toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    /**
     * Devuelve los usuarios que coinciden con el texto de búsqueda (nombre, correo o rol),
     * el rol elegido y el estado elegido. Los tres filtros se combinan.
     * @returns {Array<Object>} Usuarios filtrados.
     */
    function usuariosVisibles() {
        const t = normalizar(estado.texto.trim());
        return obtenerUsuarios().filter(u => {
            const coincideTexto = !t ||
                normalizar(u.nombre).includes(t) ||
                normalizar(u.correo).includes(t) ||
                normalizar(u.rol).includes(t);
            const coincideRol = !estado.rol || u.rol === estado.rol;
            const coincideEstado = !estado.estado ||
                (estado.estado === "activo" ? u.activo : !u.activo);
            return coincideTexto && coincideRol && coincideEstado;
        });
    }

    // ----- Tabla de usuarios -----

    /**
     * Genera la insignia HTML del estado de un usuario.
     * @param {boolean} activo - Si el usuario está activo.
     * @returns {string} HTML de la insignia.
     */
    function insigniaEstado(activo) {
        return activo
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Deshabilitado</span>';
    }

    /**
     * Genera el selector de rol de una fila (el rol actual queda seleccionado).
     * @param {Object} u - Usuario de la fila.
     * @returns {string} HTML del selector.
     */
    function selectorRol(u) {
        const opciones = ROLES_USUARIO.map(rol =>
            `<option value="${escaparHtml(rol)}"${rol === u.rol ? " selected" : ""}>${escaparHtml(rol)}</option>`
        ).join("");
        return `<select class="form-select form-select-sm w-auto" data-accion="rol" data-id="${u.id}"
                        aria-label="Rol de ${escaparHtml(u.nombre)}">${opciones}</select>`;
    }

    /**
     * Genera el botón que habilita o deshabilita según el estado actual del usuario.
     * @param {Object} u - Usuario de la fila.
     * @returns {string} HTML del botón.
     */
    function botonEstado(u) {
        return u.activo
            ? `<button type="button" class="btn-accion btn-editar" data-accion="estado" data-id="${u.id}">
                   <i class="bi bi-slash-circle"></i> Deshabilitar</button>`
            : `<button type="button" class="btn-accion btn-editar" data-accion="estado" data-id="${u.id}">
                   <i class="bi bi-check-circle"></i> Habilitar</button>`;
    }

    /**
     * Pinta la tabla de usuarios según el filtro actual, o un mensaje si no hay resultados.
     */
    function pintarTabla() {
        const lista = usuariosVisibles();

        if (lista.length === 0) {
            const mensaje = obtenerUsuarios().length === 0
                ? "No hay usuarios registrados."
                : "No hay usuarios que coincidan.";
            cuerpo.innerHTML = `<tr><td colspan="6"><div class="vacio"><i class="bi bi-inbox"></i>
                ${mensaje}</div></td></tr>`;
            return;
        }

        cuerpo.innerHTML = lista.map(u => `
            <tr>
                <td class="texto-tenue">${u.id}</td>
                <td class="fw-semibold">${escaparHtml(u.nombre)}</td>
                <td>${escaparHtml(u.correo)}</td>
                <td>${selectorRol(u)}</td>
                <td>${insigniaEstado(u.activo)}</td>
                <td class="celda-acciones">
                    <button type="button" class="btn-accion btn-editar" data-accion="detalle" data-id="${u.id}">
                        <i class="bi bi-eye-fill"></i> Ver detalle</button>
                    ${botonEstado(u)}
                    <button type="button" class="btn-accion btn-borrar" data-accion="eliminar" data-id="${u.id}">
                        <i class="bi bi-trash-fill"></i> Eliminar</button>
                </td>
            </tr>`).join("");
    }

    // ----- Detalle del usuario -----

    /**
     * Rellena y abre el modal con el detalle de un usuario.
     * Usa textContent para evitar inyectar HTML con los datos del usuario.
     * @param {Object} usuario - Usuario a mostrar.
     */
    function abrirDetalle(usuario) {
        document.getElementById("detalleId").textContent = usuario.id;
        document.getElementById("detalleNombre").textContent = usuario.nombre;
        document.getElementById("detalleCorreo").textContent = usuario.correo;
        document.getElementById("detalleTelefono").textContent = usuario.telefono;
        document.getElementById("detalleRol").textContent = usuario.rol;
        document.getElementById("detalleEstado").innerHTML = insigniaEstado(usuario.activo);
        document.getElementById("detalleFecha").textContent = formatoFecha(usuario.fechaRegistro);
        modalDetalle.show();
    }

    // ----- Cambio de rol -----

    /**
     * Cambia el rol de un usuario, muestra el resultado y vuelve a pintar la tabla.
     * @param {number} id - Id del usuario.
     * @param {string} rolNuevo - Rol seleccionado.
     */
    function cambiarRol(id, rolNuevo) {
        const usuario = obtenerUsuarios().find(u => u.id === id);
        const resultado = cambiarRolUsuario(id, rolNuevo);

        if (resultado.ok) {
            mostrarAviso("success", `Rol de ${usuario.nombre} actualizado a ${rolNuevo}.`);
        } else {
            mostrarAviso("danger", resultado.error);
        }
        pintarTabla(); // vuelve a pintar con el rol guardado
    }

    // ----- Habilitar / deshabilitar -----

    /**
     * Habilita o deshabilita a un usuario según su estado actual y muestra el resultado.
     * @param {Object} usuario - Usuario a modificar.
     */
    function alternarEstado(usuario) {
        const activoNuevo = !usuario.activo;
        const resultado = cambiarEstadoUsuario(usuario.id, activoNuevo);

        if (resultado.ok) {
            mostrarAviso("success", `Usuario ${activoNuevo ? "habilitado" : "deshabilitado"}: ${usuario.nombre}.`);
        } else {
            mostrarAviso("danger", resultado.error);
        }
        pintarTabla();
    }

    // ----- Eliminación con confirmación -----

    /**
     * Guarda el id del usuario y abre el modal de confirmación de eliminación.
     * Usa textContent para evitar inyectar HTML con el nombre del usuario.
     * @param {Object} usuario - Usuario a eliminar.
     */
    function pedirConfirmacion(usuario) {
        idPorEliminar = usuario.id;
        document.getElementById("nombreUsuarioEliminar").textContent = usuario.nombre;
        modalEliminar.show();
    }

    /**
     * Elimina el usuario pendiente de confirmación, muestra el resultado y vuelve a pintar la tabla.
     */
    function confirmarEliminacion() {
        if (idPorEliminar === null) return;
        const usuario = obtenerUsuarios().find(u => u.id === idPorEliminar);
        const resultado = eliminarUsuario(idPorEliminar);
        idPorEliminar = null;
        modalEliminar.hide();

        if (resultado.ok) {
            mostrarAviso("success", `Usuario eliminado: ${usuario.nombre}.`);
        } else {
            mostrarAviso("danger", resultado.error);
        }
        pintarTabla();
    }

    // ----- Eventos de la tabla -----

    /** Maneja los clics de la tabla: ver detalle, alternar estado o pedir eliminación. */
    cuerpo.addEventListener("click", e => {
        const boton = e.target.closest("button[data-accion]");
        if (!boton) return;
        const usuario = obtenerUsuarios().find(u => u.id === Number(boton.dataset.id));
        if (!usuario) return;

        if (boton.dataset.accion === "detalle") abrirDetalle(usuario);
        if (boton.dataset.accion === "estado") alternarEstado(usuario);
        if (boton.dataset.accion === "eliminar") pedirConfirmacion(usuario);
    });

    /** Maneja el cambio de rol desde el selector de una fila. */
    cuerpo.addEventListener("change", e => {
        const selector = e.target.closest('select[data-accion="rol"]');
        if (!selector) return;
        cambiarRol(Number(selector.dataset.id), selector.value);
    });

    document.getElementById("btnConfirmarEliminar").addEventListener("click", confirmarEliminacion);

// ----- Eventos de búsqueda y filtros -----

    /** Filtra la tabla cada vez que se escribe en el buscador. */
    buscador.addEventListener("input", e => {
        estado.texto = e.target.value;
        pintarTabla();
    });

    /** Filtra la tabla al elegir un rol en el desplegable. */
    filtroRol.addEventListener("change", e => {
        estado.rol = e.target.value;
        pintarTabla();
    });

    /** Filtra la tabla al elegir un estado en el desplegable. */
    filtroEstado.addEventListener("change", e => {
        estado.estado = e.target.value;
        pintarTabla();
    });

    /** Limpia el texto y los dos desplegables, y vuelve a mostrar todos los usuarios. */
    document.getElementById("btnLimpiar").addEventListener("click", () => {
        estado.texto = "";
        estado.rol = "";
        estado.estado = "";
        buscador.value = "";
        filtroRol.value = "";
        filtroEstado.value = "";
        pintarTabla();
    });

    pintarTabla();
})();