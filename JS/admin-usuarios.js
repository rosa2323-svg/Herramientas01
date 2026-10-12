// ===== ADMINISTRACIÓN DE USUARIOS =====
(function () {

    // ----- Estado de la vista -----
    const estado = { texto: "" };

    // ----- Elementos de la página -----
    const cuerpo = document.getElementById("cuerpoTabla");
    const buscador = document.getElementById("buscador");
    const modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalle"));

    // ----- Utilidades -----
    // 2026-02-03 -> 03/02/2026
    const formatoFecha = fecha => fecha.split("-").reverse().join("/");

    // ----- Filtro de búsqueda -----
    // Ignora mayúsculas y tildes: "lucia" encuentra "Lucía"
    const normalizar = texto => String(texto).toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    function usuariosVisibles() {
        const t = normalizar(estado.texto.trim());
        return obtenerUsuarios().filter(u =>
            !t ||
            normalizar(u.nombre).includes(t) ||
            normalizar(u.correo).includes(t) ||
            normalizar(u.rol).includes(t));
    }

    // ----- Tabla de usuarios -----
    function insigniaEstado(activo) {
        return activo
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Deshabilitado</span>';
    }

    // Selector de rol de una fila (el rol actual queda seleccionado)
    function selectorRol(u) {
        const opciones = ROLES_USUARIO.map(rol =>
            `<option value="${escaparHtml(rol)}"${rol === u.rol ? " selected" : ""}>${escaparHtml(rol)}</option>`
        ).join("");
        return `<select class="form-select form-select-sm w-auto" data-accion="rol" data-id="${u.id}"
                        aria-label="Rol de ${escaparHtml(u.nombre)}">${opciones}</select>`;
    }

    // Botón que habilita o deshabilita según el estado actual
    function botonEstado(u) {
        return u.activo
            ? `<button type="button" class="btn-accion btn-editar" data-accion="estado" data-id="${u.id}">
                   <i class="bi bi-slash-circle"></i> Deshabilitar</button>`
            : `<button type="button" class="btn-accion btn-editar" data-accion="estado" data-id="${u.id}">
                   <i class="bi bi-check-circle"></i> Habilitar</button>`;
    }

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
                </td>
            </tr>`).join("");
    }

    // ----- Detalle del usuario -----
    function abrirDetalle(usuario) {
        // textContent evita inyectar HTML con los datos del usuario
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

    // ----- Eventos de la tabla -----
    cuerpo.addEventListener("click", e => {
        const boton = e.target.closest("button[data-accion]");
        if (!boton) return;
        const usuario = obtenerUsuarios().find(u => u.id === Number(boton.dataset.id));
        if (!usuario) return;

        if (boton.dataset.accion === "detalle") abrirDetalle(usuario);
        if (boton.dataset.accion === "estado") alternarEstado(usuario);
    });

    cuerpo.addEventListener("change", e => {
        const selector = e.target.closest('select[data-accion="rol"]');
        if (!selector) return;
        cambiarRol(Number(selector.dataset.id), selector.value);
    });

    // ----- Eventos de búsqueda -----
    buscador.addEventListener("input", e => {
        estado.texto = e.target.value;
        pintarTabla();
    });

    document.getElementById("btnLimpiar").addEventListener("click", () => {
        estado.texto = "";
        buscador.value = "";
        pintarTabla();
    });

    pintarTabla();
})();