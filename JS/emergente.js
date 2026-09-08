
//  MODAL PROMOCIÓN EMERGENTE
const elementoModal = document.getElementById('promoModal');
const hayLoginError = document.getElementById('loginError') !== null;

if (elementoModal && !hayLoginError) {
    const myModal = new bootstrap.Modal(elementoModal);
    setTimeout(() => {
        myModal.show();
    }, 1000);
}

// MODAL LOGIN CON ERROR
const loginModal = document.getElementById('loginModal');
if (loginModal && hayLoginError) {
    const modal = new bootstrap.Modal(loginModal);
    modal.show();
}

// MODAL REGISTRO EXITOSO
const registroExitosoModal = document.getElementById('registroExitosoModal');
if (registroExitosoModal && registroExitosoModal.dataset.show === 'true') {
    const modal = new bootstrap.Modal(registroExitosoModal);
    modal.show();
}

// MODAL COMPRA
const compraModal = document.getElementById('compraModal');
if (compraModal) {
    compraModal.addEventListener('show.bs.modal', function(event) {
        const boton = event.relatedTarget;
        document.getElementById('modalProductoNombre').textContent = boton.getAttribute('data-producto');
        document.getElementById('modalProductoPrecio').textContent = boton.getAttribute('data-precio');
    });
}
// MOSTRAR/OCULTAR CONTRASEÑA
document.querySelectorAll('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', function() {
        const inputId = this.getAttribute('data-toggle-password');
        const input = document.getElementById(inputId);
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('bi-eye', 'bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('bi-eye-slash', 'bi-eye');
        }
    });
});