// Dashboard de indicadores (KPI)
(function () {
    // Verifica que Chart.js (CDN) se haya cargado antes de este script
    if (typeof Chart === "undefined") {
        console.error("Chart.js no se cargó. Revisa el <script> del CDN en admin-dashboard.html");
        return;
    }
    // Configuración global de Chart.js para todos los gráficos del dashboard
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    Chart.defaults.color = "#555";
    Chart.defaults.responsive = true;
    let dias = 30; // período por defecto
    // Últimos N días del mock data
    const periodoActual = () => DASHBOARD_DATOS.slice(-dias);
    const nombreProducto = id => (productos.find(p => p.id === id) || {}).nombre || ("Producto " + id);

    // Producto más vendido del período ---
    function productoMasVendido(periodo) {
        const totales = {};
        periodo.forEach(d => d.ventas.forEach(v => {
            totales[v.id] = (totales[v.id] || 0) + v.cantidad;
        }));
        let mejor = null;
        Object.entries(totales).forEach(([id, cantidad]) => {
            if (!mejor || cantidad > mejor.cantidad) mejor = { id: Number(id), cantidad: cantidad };
        });
        return mejor;
    }
    function renderProductoMasVendido(periodo) {
        const top = productoMasVendido(periodo);
        document.getElementById("kpiProducto").textContent = top ? nombreProducto(top.id) : "Sin datos";
        document.getElementById("kpiProductoUnidades").textContent =
            top ? top.cantidad + " unidades en " + dias + " días" : "";
    }
    // --- Filtro de tiempo ---
    function actualizar() {
        const periodo = periodoActual();
        // Resalta el botón del período seleccionado
        document.querySelectorAll("#filtroDias button").forEach(b => {
            const activo = Number(b.dataset.dias) === dias;
            b.classList.toggle("active", activo);
            b.setAttribute("aria-pressed", activo);
        });
        document.getElementById("textoPeriodo").textContent = "Mostrando los últimos " + dias + " días";
        renderProductoMasVendido(periodo);
    }
    document.getElementById("filtroDias").addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-dias]");
        if (!btn) return;
        dias = Number(btn.dataset.dias);
        actualizar();
    });
    actualizar();
})();