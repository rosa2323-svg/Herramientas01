(function () {
    const REGEX_CORREO = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const HTML_MODAL = `
<div class="modal fade" id="recuperarModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white border-secondary rounded-4 shadow-lg">
            <div class="modal-header border-0">
                <h5 class="modal-title fw-bold text-danger">
                    <i class="bi bi-key me-2"></i>Recuperar contraseña
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 pt-2">
                <!-- PASO 1: correo -->
                <form id="formRecuperarCorreo" novalidate>
                    <p class="text-secondary small">Ingresa el correo con el que te registraste para recuperar el acceso.</p>
                    <div class="mb-3">
                        <label class="form-label small text-secondary" for="recuperarCorreo">Correo electrónico</label>
                        <input type="email" id="recuperarCorreo" maxlength="100"
                               class="form-control bg-black text-white border-secondary rounded-3"
                               placeholder="ejemplo@correo.com">
                    </div>
                    <div id="recuperarError1" class="text-danger small mb-3 d-none"></div>
                    <button type="submit" class="btn btn-danger w-100 fw-bold rounded-pill py-2">CONTINUAR</button>
                </form>
                <!-- PASO 2 -->
                <!-- PASO 3 -->
                <!-- ENLACE VOLVER -->
            </div>
        </div>
    </div>
</div>`;

    document.addEventListener("DOMContentLoaded", () => {
        document.body.insertAdjacentHTML("beforeend", HTML_MODAL);

        const modalRecuperar = document.getElementById("recuperarModal");
        const modalLogin = document.getElementById("loginModal");
        const formCorreo = document.getElementById("formRecuperarCorreo");

        function mostrarError(id, mensaje) {
            const el = document.getElementById(id);
            el.textContent = mensaje;
            el.classList.remove("d-none");
        }

        function limpiarErrores() {
            document.querySelectorAll("#recuperarError1, #recuperarError2")
                .forEach(el => el.classList.add("d-none"));
        }

        // Cierra un modal y abre otro al terminar la animación (evita modales encimados)
        function cambiarModal(desde, hacia) {
            if (!hacia) return;
            const abrir = () => bootstrap.Modal.getOrCreateInstance(hacia).show();
            if (desde && desde.classList.contains("show")) {
                desde.addEventListener("hidden.bs.modal", abrir, { once: true });
                bootstrap.Modal.getInstance(desde).hide();
            } else {
                abrir();
            }
        }

        // Login -> Recuperar
        document.querySelectorAll("[data-olvide-password]").forEach(enlace => {
            enlace.addEventListener("click", e => {
                e.preventDefault();
                cambiarModal(modalLogin, modalRecuperar);
            });
        });

        // PASO 1: validar formato del correo
        formCorreo.addEventListener("submit", e => {
            e.preventDefault();
            limpiarErrores();

            const correo = document.getElementById("recuperarCorreo").value.trim().toLowerCase();

            if (!correo) return mostrarError("recuperarError1", "Ingresa tu correo electrónico.");
            if (!REGEX_CORREO.test(correo)) return mostrarError("recuperarError1", "El formato del correo no es válido.");

        });
    });
})();