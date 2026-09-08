// MODAL PROMOCIÓN EMERGENTE (Con LocalStorage y Delay de 3s)
const elementoModal = document.getElementById('promoModal');

if (elementoModal) {
    // Comprobamos si el usuario ya vio/cerró la promoción
    const promoMostrada = localStorage.getItem('promoMostrada');

    if (!promoMostrada) {
        const myModal = new bootstrap.Modal(elementoModal);

        // Espera 3 segundos antes de lanzarse
        setTimeout(() => {
            myModal.show();
        }, 3000);
        elementoModal.addEventListener('hidden.bs.modal', function () {
            localStorage.setItem('promoMostrada', 'true');
        });
    }
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