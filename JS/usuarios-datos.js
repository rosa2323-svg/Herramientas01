// ===== MOCK DATA DE USUARIOS =====
// ----- Roles disponibles -----
const ROLES_USUARIO = ["Cliente", "Vendedor", "Administrador"];
// ----- Usuarios iniciales -----
const USUARIOS_INICIALES = [
    { id: 1,  nombre: "Rosa Mendoza",      correo: "rosa.mendoza@mastertech.pe",     telefono: "987 654 321", rol: "Administrador", activo: true,  fechaRegistro: "2026-01-12" },
    { id: 2,  nombre: "Carlos Quispe",     correo: "carlos.quispe@mastertech.pe",    telefono: "986 112 233", rol: "Vendedor",      activo: true,  fechaRegistro: "2026-01-20" },
    { id: 3,  nombre: "Lucía Fernández",   correo: "lucia.fernandez@example.com",    telefono: "945 220 118", rol: "Cliente",       activo: true,  fechaRegistro: "2026-02-03" },
    { id: 4,  nombre: "Miguel Torres",     correo: "miguel.torres@example.com",      telefono: "932 874 560", rol: "Cliente",       activo: true,  fechaRegistro: "2026-02-14" },
    { id: 5,  nombre: "Andrea Vargas",     correo: "andrea.vargas@example.com",      telefono: "958 330 471", rol: "Cliente",       activo: false, fechaRegistro: "2026-02-27" },
    { id: 6,  nombre: "Diego Rojas",       correo: "diego.rojas@example.com",        telefono: "921 456 789", rol: "Cliente",       activo: true,  fechaRegistro: "2026-03-09" },
    { id: 7,  nombre: "Valeria Castillo",  correo: "valeria.castillo@example.com",   telefono: "974 118 205", rol: "Vendedor",      activo: true,  fechaRegistro: "2026-03-18" },
    { id: 8,  nombre: "Jorge Salazar",     correo: "jorge.salazar@example.com",      telefono: "963 540 992", rol: "Cliente",       activo: false, fechaRegistro: "2026-04-02" },
    { id: 9,  nombre: "Camila Paredes",    correo: "camila.paredes@example.com",     telefono: "951 667 304", rol: "Cliente",       activo: true,  fechaRegistro: "2026-04-21" },
    { id: 10, nombre: "Renzo Delgado",     correo: "renzo.delgado@example.com",      telefono: "942 301 876", rol: "Cliente",       activo: true,  fechaRegistro: "2026-05-11" },
    { id: 11, nombre: "Sofía Huamán",      correo: "sofia.huaman@example.com",       telefono: "927 905 143", rol: "Cliente",       activo: true,  fechaRegistro: "2026-06-05" },
    { id: 12, nombre: "Luis Ramírez",      correo: "luis.ramirez@example.com",       telefono: "989 472 650", rol: "Cliente",       activo: false, fechaRegistro: "2026-07-16" }
];