(function () {
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
                <!-- PASO 1 -->
                <p class="text-secondary small">Aquí irá el formulario de recuperación.</p>
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
    });
})();