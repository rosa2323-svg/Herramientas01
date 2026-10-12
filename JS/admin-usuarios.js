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
                <td><span class="etiqueta-categoria">${escaparHtml(u.rol)}</span></td>
                <td>${insigniaEstado(u.activo)}</td>
                <td class="celda-acciones">
                    <button type="button" class="btn-accion btn-editar" data-accion="detalle" data-id="${u.id}">
                        <i class="bi bi-eye-fill"></i> Ver detalle</button>
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

    // ----- Eventos de la tabla -----
    cuerpo.addEventListener("click", e => {
        const boton = e.target.closest("button[data-accion]");
        if (!boton) return;
        const usuario = obtenerUsuarios().find(u => u.id === Number(boton.dataset.id));
        if (!usuario) return;

        if (boton.dataset.accion === "detalle") abrirDetalle(usuario);
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