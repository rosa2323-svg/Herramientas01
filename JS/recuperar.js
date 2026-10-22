(function () {
    const REGEX_CORREO = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

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

                <!-- PASO 2: nueva contraseña -->
                <form id="formRecuperarNueva" class="d-none" novalidate>
                    <p class="text-secondary small">
                        Crea tu nueva contraseña: mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
                    </p>
                    <div class="mb-3">
                        <label class="form-label small text-secondary" for="recuperarPassword">Nueva contraseña</label>
                        <div class="input-group">
                            <input type="password" id="recuperarPassword"
                                   class="form-control bg-black text-white border-secondary rounded-start-3"
                                   placeholder="••••••••">
                            <button class="btn btn-outline-secondary" type="button" data-ver-pass="recuperarPassword">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-secondary" for="recuperarConfirmar">Confirmar contraseña</label>
                        <div class="input-group">
                            <input type="password" id="recuperarConfirmar"
                                   class="form-control bg-black text-white border-secondary rounded-start-3"
                                   placeholder="••••••••">
                            <button class="btn btn-outline-secondary" type="button" data-ver-pass="recuperarConfirmar">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div id="recuperarError2" class="text-danger small mb-3 d-none"></div>
                    <button type="submit" class="btn btn-danger w-100 fw-bold rounded-pill py-2">ACTUALIZAR CONTRASEÑA</button>
                </form>

                <!-- PASO 3: éxito -->
                <div id="recuperarExito" class="d-none text-center">
                    <i class="bi bi-check-circle-fill text-success mb-3" style="font-size: 3.5rem;"></i>
                    <h5 class="fw-bold mb-2">¡Contraseña actualizada!</h5>
                    <p class="text-secondary small mb-4">Ya puedes iniciar sesión con tu nueva contraseña.</p>
                    <button type="button" data-volver-login class="btn btn-danger w-100 fw-bold rounded-pill py-2">
                        INICIAR SESIÓN
                    </button>
                </div>

                <!-- ENLACE VOLVER -->
                <hr class="border-secondary">
                <div class="text-center">
                    <a href="#" data-volver-login class="small text-danger text-decoration-none">
                        <i class="bi bi-arrow-left me-1"></i>Volver a iniciar sesión
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>`;

    document.addEventListener("DOMContentLoaded", () => {
        document.body.insertAdjacentHTML("beforeend", HTML_MODAL);

        const modalRecuperar = document.getElementById("recuperarModal");
        const modalLogin = document.getElementById("loginModal");
        let usuarioId = null;
        const formCorreo = document.getElementById("formRecuperarCorreo");
        const formNueva = document.getElementById("formRecuperarNueva");
        const exito = document.getElementById("recuperarExito");

        function mostrarError(id, mensaje) {
            const el = document.getElementById(id);
            el.textContent = mensaje;
            el.classList.remove("d-none");
        }

        function limpiarErrores() {
            document.querySelectorAll("#recuperarError1, #recuperarError2")
                .forEach(el => el.classList.add("d-none"));
        }

        function mostrarPaso(paso) {
            formCorreo.classList.toggle("d-none", paso !== 1);
            formNueva.classList.toggle("d-none", paso !== 2);
            exito.classList.toggle("d-none", paso !== 3);
        }

        function reiniciar() {
            formCorreo.reset();
            formNueva.reset();
            limpiarErrores();
            usuarioId = null;
            mostrarPaso(1);
            modalRecuperar.querySelectorAll("[data-ver-pass]").forEach(btn => {
                document.getElementById(btn.dataset.verPass).type = "password";
                btn.querySelector("i").className = "bi bi-eye";
            });
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
                reiniciar();
                cambiarModal(modalLogin, modalRecuperar);
            });
        });

        // Recuperar -> Login
        modalRecuperar.querySelectorAll("[data-volver-login]").forEach(enlace => {
            enlace.addEventListener("click", e => {
                e.preventDefault();
                cambiarModal(modalRecuperar, modalLogin);
            });
        });

        // Mostrar / ocultar contraseña
        modalRecuperar.addEventListener("click", e => {
            const btn = e.target.closest("[data-ver-pass]");
            if (!btn) return;
            const input = document.getElementById(btn.dataset.verPass);
            const mostrar = input.type === "password";
            input.type = mostrar ? "text" : "password";
            btn.querySelector("i").className = mostrar ? "bi bi-eye-slash" : "bi bi-eye";
        });

        // PASO 1: validar formato y buscar el correo en localStorage
        formCorreo.addEventListener("submit", e => {
            e.preventDefault();
            limpiarErrores();

            const correo = document.getElementById("recuperarCorreo").value.trim().toLowerCase();

            if (!correo) return mostrarError("recuperarError1", "Ingresa tu correo electrónico.");
            if (!REGEX_CORREO.test(correo)) return mostrarError("recuperarError1", "El formato del correo no es válido.");

            const usuario = obtenerUsuarios().find(u => u.correo.toLowerCase() === correo);
            if (!usuario) return mostrarError("recuperarError1", "No encontramos una cuenta con ese correo.");
            if (!usuario.activo) return mostrarError("recuperarError1", "Esta cuenta está deshabilitada. Contacta a soporte.");

            usuarioId = usuario.id;
            mostrarPaso(2);
        });

        // PASO 2: validar nueva contraseña y guardarla
        formNueva.addEventListener("submit", e => {
            e.preventDefault();
            limpiarErrores();

            const nueva = document.getElementById("recuperarPassword").value;
            const confirmar = document.getElementById("recuperarConfirmar").value;

            if (!REGEX_PASSWORD.test(nueva)) {
                return mostrarError("recuperarError2", "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.");
            }
            if (nueva !== confirmar) return mostrarError("recuperarError2", "Las contraseñas no coinciden.");

            const lista = obtenerUsuarios().map(u => (u.id === usuarioId ? { ...u, password: nueva } : u));
            const resultado = guardarLista(CLAVE_USUARIOS, lista);
            if (!resultado.ok) return mostrarError("recuperarError2", resultado.error);

            mostrarPaso(3);
        });
    });
})();