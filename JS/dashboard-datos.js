// 90 días de ventas, usuarios activos y usuarios nuevos.
// ----- Configuración -----
const DASHBOARD_DIAS = 90;
// ----- Generador de números aleatorios -----
// Semilla fija: los datos son los mismos en cada recarga.
function generadorAleatorio(semilla) {
    return function () {
        semilla |= 0; semilla = (semilla + 0x6D2B79F5) | 0;
        let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
// ----- Generación de los datos -----
const DASHBOARD_DATOS = (function () {
    const azar = generadorAleatorio(2026);
    const pesos = [5, 3, 2, 3, 6, 4, 1, 2]; // popularidad relativa de cada producto
    const datos = [];
    for (let i = DASHBOARD_DIAS - 1; i >= 0; i--) {
        // Fecha (de hace 89 días hasta hoy)
        const f = new Date();
        f.setDate(f.getDate() - i);
        const fecha = f.getFullYear() + "-" +
            String(f.getMonth() + 1).padStart(2, "0") + "-" +
            String(f.getDate()).padStart(2, "0");
        // Ventas del día por producto
        const ventas = [];
        productos.forEach((p, idx) => {
            const cantidad = Math.round(pesos[idx % pesos.length] * (0.3 + azar()) * 1.5);
            if (cantidad > 0) ventas.push({ id: p.id, cantidad: cantidad });
        });
        // Registro del día
        datos.push({
            fecha: fecha,
            ventas: ventas,
            // usuarios activos: crecen poco a poco con algo de ruido
            activos: Math.round(140 + (DASHBOARD_DIAS - 1 - i) * 0.6 + azar() * 30),
            // usuarios nuevos: altas diarias
            nuevos: Math.round(6 + azar() * 14)
        });
    }
    return datos;
})();