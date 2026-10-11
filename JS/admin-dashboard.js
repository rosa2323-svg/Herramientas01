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
    // --- Filtro de tiempo (30, 60 o 90 días) ---
    let dias = 30; // período por defecto
    function actualizar() {
        // Resalta el botón del período seleccionado
        document.querySelectorAll("#filtroDias button").forEach(b => {
            const activo = Number(b.dataset.dias) === dias;
            b.classList.toggle("active", activo);
            b.setAttribute("aria-pressed", activo);
        });
        document.getElementById("textoPeriodo").textContent = "Mostrando los últimos " + dias + " días";
    }
    document.getElementById("filtroDias").addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-dias]");
        if (!btn) return;
        dias = Number(btn.dataset.dias);
        actualizar();
    });
    actualizar();
})();