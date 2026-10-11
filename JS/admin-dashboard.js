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
})();