// Dashboard de indicadores (KPI)
(function () {
    // Chart.js viene por CDN: si no carga, las tarjetas y el filtro siguen funcionando
    const hayChart = typeof Chart !== "undefined";
    if (hayChart) {
        // Configuración global de Chart.js para todos los gráficos del dashboard
        Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
        Chart.defaults.color = "#555";
        Chart.defaults.responsive = true;
    } else {
        console.error("Chart.js no se cargó. Se muestran las tarjetas, pero no los gráficos.");
    }
    let dias = 30; // período por defecto
    let graficoVentas = null;
    let graficoUsuarios = null;

    // Últimos N días del mock data
    const periodoActual = () => DASHBOARD_DATOS.slice(-dias);
    const nombreProducto = id => (productos.find(p => p.id === id) || {}).nombre || ("Producto " + id);
    const etiquetaFecha = fecha => fecha.slice(5).split("-").reverse().join("/"); // 2026-10-11 -> 11/10

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

    // Usuarios activos y usuarios nuevos del período ---
    function renderUsuarios(periodo) {
        // Activos: promedio diario (sumar todos los días contaría varias veces a las mismas personas)
        const promedioActivos = Math.round(periodo.reduce((s, d) => s + d.activos, 0) / periodo.length);
        // Nuevos: total de altas del período (cada alta ocurre una sola vez)
        const totalNuevos = periodo.reduce((s, d) => s + d.nuevos, 0);
        document.getElementById("kpiActivos").textContent = promedioActivos.toLocaleString("es-PE");
        document.getElementById("kpiNuevos").textContent = totalNuevos.toLocaleString("es-PE");
    }

    // Gráficos de Chart.js ---
    // Si el gráfico no existe lo crea; si ya existe solo actualiza sus datos
    function renderGraficos(periodo) {
        if (!hayChart) return; // sin Chart.js solo se omiten los gráficos

        const etiquetas = periodo.map(d => etiquetaFecha(d.fecha));
        const unidades = periodo.map(d => d.ventas.reduce((s, v) => s + v.cantidad, 0));
        const activos = periodo.map(d => d.activos);
        const nuevos = periodo.map(d => d.nuevos);

        // Gráfico 1: unidades vendidas por día
        if (!graficoVentas) {
            graficoVentas = new Chart(document.getElementById("graficoVentas"), {
                type: "line",
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: "Unidades vendidas",
                        data: unidades,
                        borderColor: "#cc0000",
                        backgroundColor: "rgba(204, 0, 0, 0.12)",
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    }]
                },
                options: { interaction: { mode: "index", intersect: false } }
            });
        } else {
            graficoVentas.data.labels = etiquetas;
            graficoVentas.data.datasets[0].data = unidades;
            graficoVentas.update();
        }

        // Gráfico 2: usuarios activos (eje izquierdo) y nuevos (eje derecho)
        if (!graficoUsuarios) {
            graficoUsuarios = new Chart(document.getElementById("graficoUsuarios"), {
                type: "line",
                data: {
                    labels: etiquetas,
                    datasets: [
                        { label: "Usuarios activos", data: activos, borderColor: "#1a0b3d", tension: 0.3, pointRadius: 0, yAxisID: "y" },
                        { label: "Usuarios nuevos", data: nuevos, borderColor: "#198754", tension: 0.3, pointRadius: 0, yAxisID: "y1" }
                    ]
                },
                options: {
                    interaction: { mode: "index", intersect: false },
                    scales: {
                        y:  { position: "left",  title: { display: true, text: "Activos" } },
                        y1: { position: "right", title: { display: true, text: "Nuevos" }, grid: { drawOnChartArea: false } }
                    }
                }
            });
        } else {
            graficoUsuarios.data.labels = etiquetas;
            graficoUsuarios.data.datasets[0].data = activos;
            graficoUsuarios.data.datasets[1].data = nuevos;
            graficoUsuarios.update();
        }
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
        renderUsuarios(periodo);
        renderGraficos(periodo);
    }

    document.getElementById("filtroDias").addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-dias]");
        if (!btn) return;
        dias = Number(btn.dataset.dias);
        actualizar();
    });

    actualizar(); // estado inicial: pinta tarjetas y gráficos con 30 días
})();