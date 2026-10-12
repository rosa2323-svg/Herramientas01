// ===== ADMINISTRACIÓN DE USUARIOS =====
(function () {

    // ----- Elementos de la página -----
    const cuerpo = document.getElementById("cuerpoTabla");

    // ----- Tabla de usuarios -----
    function insigniaEstado(activo) {
        return activo
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Deshabilitado</span>';
    }

    function pintarTabla() {
        const lista = obtenerUsuarios();

        if (lista.length === 0) {
            cuerpo.innerHTML = `<tr><td colspan="5"><div class="vacio"><i class="bi bi-inbox"></i>
                No hay usuarios registrados.</div></td></tr>`;
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

    pintarTabla();
})();