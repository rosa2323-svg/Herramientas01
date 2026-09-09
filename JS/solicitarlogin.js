// VALIDACIÓN CLIENTE: INICIO DE SESIÓN
const formLogin = document.getElementById("formLogin"); // Asegúrate de que tu form de login tenga este ID

if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
        e.preventDefault(); // Previene recarga de página

        const email = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        // 1. Validar campos vacíos
        if (!email || !password) {
            alert("Por favor, ingresa tu correo y contraseña.");
            return;
        }

        // 2. Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("El formato del correo electrónico no es válido.");
            return;
        }

        // Simulación de éxito
        alert("¡Inicio de sesión exitoso! (Simulación Frontend)");
        formLogin.reset();

        // Cierra el modal automáticamente si está dentro de uno
        const modalElement = document.getElementById("loginModal");
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
    });
}


// VALIDACIÓN CLIENTE: REGISTRO DE CUENTA
const formRegistro = document.getElementById("formRegistro"); // Asegúrate de que tu form de registro tenga este ID

if (formRegistro) {
    formRegistro.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombreCompleto").value;
        const dni = document.getElementById("dni").value;
        const direccion = document.getElementById("direccion").value;
        const email = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terminos = document.getElementById("terminos").checked;

        // 1. Validar que no haya campos vacíos
        if (!nombre || !dni || !direccion || !email || !telefono || !password || !confirmPassword) {
            alert("Por favor, completa todos los campos del formulario.");
            return;
        }

        // 2. Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        // 3. Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, verifícalas.");
            return;
        }

        // 4. Validar que se aceptaron los términos
        if (!terminos) {
            alert("Debes aceptar los Términos y Condiciones para continuar.");
            return;
        }

        // Simulación de éxito
        alert("¡Cuenta creada exitosamente!");
        formRegistro.reset();
    });
}