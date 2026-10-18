// MODAL PROMOCIÓN EMERGENTE (aparece en cada recarga, con delay de 3s)
const elementoModal = document.getElementById('promoModal');

if (elementoModal) {
    const myModal = new bootstrap.Modal(elementoModal);
    let otrosModalesActivos = 0;
    let promoPendiente = false;

    const mostrarPromoSiLibre = () => {
        if (promoPendiente && otrosModalesActivos === 0) {
            promoPendiente = false;
            myModal.show();
        }
    };

    // Registra los modales que se abren
    document.addEventListener('show.bs.modal', function (e) {
        if (e.target === elementoModal || e.defaultPrevented) return;
        otrosModalesActivos++;
    });

    // Cuando otro modal termina de cerrarse, muestra la promoción si estaba pendiente
    document.addEventListener('hidden.bs.modal', function (e) {
        if (e.target === elementoModal) return;
        otrosModalesActivos = Math.max(0, otrosModalesActivos - 1);
        mostrarPromoSiLibre();
    });

    // Espera 3 segundos antes de lanzarse
    setTimeout(() => {
        promoPendiente = true;
        mostrarPromoSiLibre();
    }, 3000);
}

// MOSTRAR/OCULTAR CONTRASEÑA
document.querySelectorAll('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', function() {
        const inputId = this.getAttribute('data-toggle-password');
        const input = document.getElementById(inputId);
        const icon = this.querySelector('i');

        if (input && icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        }
    });
});