// ===== ADMINISTRACIÓN DE USUARIOS =====
(function () {

    // ----- Estado de la vista -----
    const estado = { texto: "" };

    // ----- Elementos de la página -----
    const cuerpo = document.getElementById("cuerpoTabla");
    const buscador = document.getElementById("buscador");

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
            cuerpo.innerHTML = `<tr><td colspan="5"><div class="vacio"><i class="bi bi-inbox"></i>
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
            </tr>`).join("");
    }

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