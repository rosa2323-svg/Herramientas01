// ===== CHATBOT MASTER TECH =====
// Maqueta visual 100% simulada (sin backend).
// Si existe un elemento #contenedorChatbot (html/asistente.html) el chat se muestra en la página;
// si no, aparece como botón flotante.
// Cuando se conecte la IA, solo hay que reemplazar la función obtenerRespuesta().

(function () {
    const CONFIG = {
        CLAVE_HISTORIAL: 'mastertech_chatbot_historial',
        MAX_HISTORIAL: 40,
        RETARDO_SIMULADO_MS: 900
    };

    const SUGERENCIAS = [
        'Recomiéndame algo',
        'Quiero una laptop gamer',
        'Celulares disponibles',
        'Ver ofertas'
    ];

    const MENSAJE_BIENVENIDA = 'Hola, soy el asistente de Master Tech. Puedo ayudarte a elegir productos, revisar stock y recomendarte según lo que has comprado antes. ¿En qué te ayudo?';

    const raizProyecto = location.pathname.includes('/html/') ? '../' : '';
    const rutaPaginas = location.pathname.includes('/html/') ? '' : 'html/';

    let historial = [];
    let esperandoRespuesta = false;

    // ---------- Utilidades ----------

    function escapar(texto) {
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function horaActual() {
        return new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    }

    function soles(n) {
        return 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function catalogo() {
        return (typeof productos !== 'undefined' && Array.isArray(productos)) ? productos : [];
    }

    // ---------- Construcción del DOM ----------

    function construirWidget() {
        const contenedor = document.getElementById('contenedorChatbot');
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'chatbot-boton';
        boton.setAttribute('aria-label', 'Abrir asistente');
        boton.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';

        const panel = document.createElement('section');
        panel.className = contenedor ? 'chatbot-panel chatbot-en-pagina abierto' : 'chatbot-panel';
        panel.setAttribute('aria-label', 'Asistente Master Tech');
        panel.innerHTML = `
            <header class="chatbot-cabecera">
                <div class="chatbot-avatar"><i class="bi bi-robot"></i></div>
                <div class="chatbot-titulo">
                    <strong>Asistente Master Tech</strong>
                    <span class="chatbot-estado" id="chatbotEstado">En línea</span>
                </div>
                <button type="button" class="chatbot-accion" id="chatbotLimpiar" title="Nueva conversación" aria-label="Nueva conversación">
                    <i class="bi bi-arrow-counterclockwise"></i>
                </button>
                <button type="button" class="chatbot-accion" id="chatbotCerrar" title="Cerrar" aria-label="Cerrar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </header>
            <div class="chatbot-mensajes" id="chatbotMensajes" aria-live="polite"></div>
            <div class="chatbot-sugerencias" id="chatbotSugerencias"></div>
            <form class="chatbot-formulario" id="chatbotFormulario" autocomplete="off">
                <input type="text" class="chatbot-entrada" id="chatbotEntrada" placeholder="Escribe tu mensaje..." maxlength="500" required>
                <button type="submit" class="chatbot-enviar" id="chatbotEnviar" aria-label="Enviar"><i class="bi bi-send-fill"></i></button>
            </form>
        `;

        if (contenedor) {
            contenedor.appendChild(panel);
        } else {
            document.body.appendChild(boton);
            document.body.appendChild(panel);
        }
        return { boton, panel, enPagina: !!contenedor };
    }

    // ---------- Render de mensajes ----------

    function crearBurbuja(texto, tipo, hora) {
        const div = document.createElement('div');
        div.className = `chatbot-mensaje ${tipo}`;
        div.innerHTML = `${escapar(texto)}<span class="chatbot-hora">${escapar(hora)}</span>`;
        return div;
    }

    function crearTarjetasProductos(lista) {
        const contenedor = document.createElement('div');
        contenedor.className = 'chatbot-recomendaciones';

        lista.forEach(p => {
            const agotado = p.stock <= 0;
            const tarjeta = document.createElement('article');
            tarjeta.className = 'chatbot-producto';
            tarjeta.innerHTML = `
                <div class="chatbot-producto-img">
                    <img src="${raizProyecto}Imagenes/${escapar(p.imagen)}" alt="${escapar(p.nombre)}">
                </div>
                <span class="chatbot-producto-marca">${escapar(p.marca)}</span>
                <p class="chatbot-producto-nombre">${escapar(p.nombre)}</p>
                <span class="chatbot-producto-precio">${soles(p.precio)}</span>
                <div class="chatbot-producto-acciones">
                    <a class="chatbot-producto-ver" href="${rutaPaginas}producto.html?id=${encodeURIComponent(p.id)}">Ver</a>
                    <button type="button" class="chatbot-producto-agregar" ${agotado ? 'disabled' : ''}
                        data-id="${escapar(p.id)}"
                        data-nombre="${escapar(p.nombre)}"
                        data-precio="${escapar(p.precio)}"
                        data-imagen="Imagenes/${escapar(p.imagen)}"
                        data-marca="${escapar(p.marca)}"
                        data-stock="${escapar(p.stock)}">${agotado ? 'Agotado' : 'Agregar'}</button>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
        return contenedor;
    }

    function agregarMensaje(texto, tipo, opciones = {}) {
        const zona = document.getElementById('chatbotMensajes');
        const hora = opciones.hora || horaActual();
        zona.appendChild(crearBurbuja(texto, tipo, hora));

        if (opciones.productos && opciones.productos.length) {
            zona.appendChild(crearTarjetasProductos(opciones.productos));
        }
        zona.scrollTop = zona.scrollHeight;

        if (!opciones.sinGuardar && tipo !== 'error') {
            historial.push({
                texto, tipo, hora,
                productos: (opciones.productos || []).map(p => p.id)
            });
            historial = historial.slice(-CONFIG.MAX_HISTORIAL);
            try { localStorage.setItem(CONFIG.CLAVE_HISTORIAL, JSON.stringify(historial)); } catch { /* sin cuota */ }
        }
    }

    function mostrarEscribiendo(visible) {
        const zona = document.getElementById('chatbotMensajes');
        let indicador = document.getElementById('chatbotEscribiendo');

        if (visible && !indicador) {
            indicador = document.createElement('div');
            indicador.id = 'chatbotEscribiendo';
            indicador.className = 'chatbot-escribiendo';
            indicador.innerHTML = '<span></span><span></span><span></span>';
            zona.appendChild(indicador);
            zona.scrollTop = zona.scrollHeight;
        } else if (!visible && indicador) {
            indicador.remove();
        }
    }

    function bloquearEntrada(bloqueado) {
        esperandoRespuesta = bloqueado;
        document.getElementById('chatbotEnviar').disabled = bloqueado;
        document.getElementById('chatbotEntrada').disabled = bloqueado;
        if (!bloqueado) document.getElementById('chatbotEntrada').focus();
    }

    function ocultarSugerencias() {
        document.getElementById('chatbotSugerencias').innerHTML = '';
    }

    function pintarSugerencias() {
        const caja = document.getElementById('chatbotSugerencias');
        caja.innerHTML = '';
        SUGERENCIAS.forEach(texto => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chatbot-sugerencia';
            b.textContent = texto;
            b.addEventListener('click', () => enviarMensaje(texto));
            caja.appendChild(b);
        });
    }

    // ---------- Historial ----------

    function restaurarHistorial() {
        try {
            const guardado = JSON.parse(localStorage.getItem(CONFIG.CLAVE_HISTORIAL));
            historial = Array.isArray(guardado) ? guardado : [];
        } catch {
            historial = [];
        }

        if (!historial.length) {
            agregarMensaje(MENSAJE_BIENVENIDA, 'bot');
            pintarSugerencias();
            return;
        }

        const lista = catalogo();
        const copia = [...historial];
        historial = [];
        copia.forEach(m => {
            const prods = (m.productos || []).map(id => lista.find(p => p.id === id)).filter(Boolean);
            agregarMensaje(m.texto, m.tipo, { hora: m.hora, productos: prods, sinGuardar: true });
        });
        historial = copia;
    }

    function reiniciarConversacion() {
        try { localStorage.removeItem(CONFIG.CLAVE_HISTORIAL); } catch { /* almacenamiento no disponible */ }
        historial = [];
        document.getElementById('chatbotMensajes').innerHTML = '';
        agregarMensaje(MENSAJE_BIENVENIDA, 'bot');
        pintarSugerencias();
    }

    // ---------- Respuestas simuladas ----------

    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function responderSimulado(texto) {
        const t = normalizar(texto);
        const lista = catalogo().filter(p => p.stock > 0);
        const porCategoria = cat => lista.filter(p => p.categoria === cat);

        if (/(hola|buenas|buenos dias|buenas tardes|buenas noches)/.test(t)) {
            return { texto: 'Hola, ¿buscas algo en particular? Puedo recomendarte laptops, celulares, accesorios o componentes.' };
        }
        if (/(laptop|computadora|pc|notebook|gamer)/.test(t)) {
            return { texto: 'Estas son las opciones de laptops y computadoras que tenemos con stock:', productos: porCategoria('laptops').slice(0, 4) };
        }
        if (/(celular|telefono|smartphone|iphone|tablet)/.test(t)) {
            return { texto: 'Te dejo los teléfonos disponibles ahora:', productos: porCategoria('telefonos').slice(0, 4) };
        }
        if (/(mouse|accesorio|consola|teclado|audifono)/.test(t)) {
            return { texto: 'Mira estos accesorios:', productos: porCategoria('accesorios').slice(0, 4) };
        }
        if (/(componente|ram|procesador|tarjeta de video|armar)/.test(t)) {
            return { texto: 'Para armado de PC tenemos esto:', productos: porCategoria('componentes').slice(0, 4) };
        }
        if (/(oferta|promo|descuento|pack)/.test(t)) {
            return { texto: 'Ahora hay packs con garantía oficial de 12 meses: Pack Laptop Pro, Pack Teléfono + Tablet y Pack PC a tu medida. Los ves en el inicio de la tienda.' };
        }
        if (/(recomiend|sugier|que me|algo)/.test(t)) {
            const destacados = [...lista].sort((a, b) => b.stock - a.stock).slice(0, 4);
            return { texto: 'Estos son algunos productos destacados:', productos: destacados };
        }
        if (/(envio|entrega|delivery)/.test(t)) {
            return { texto: 'El envío es gratis a todo el Perú.' };
        }
        if (/(garantia)/.test(t)) {
            return { texto: 'Todos los productos tienen garantía oficial de 12 meses, y hay garantía extendida disponible.' };
        }
        return { texto: 'Estoy en modo de prueba y entiendo consultas sobre laptops, celulares, accesorios, componentes, ofertas, envío y garantía.' };
    }

    // Punto de reemplazo: de momento responde en simulado; luego se cambia por la llamada a la IA.
    async function obtenerRespuesta(texto) {
        await new Promise(r => setTimeout(r, CONFIG.RETARDO_SIMULADO_MS));
        return responderSimulado(texto);
    }

    // ---------- Flujo de envío ----------

    async function enviarMensaje(texto) {
        texto = texto.trim();
        if (!texto || esperandoRespuesta) return;

        ocultarSugerencias();
        agregarMensaje(texto, 'usuario');
        bloquearEntrada(true);
        mostrarEscribiendo(true);

        try {
            const respuesta = await obtenerRespuesta(texto);
            mostrarEscribiendo(false);
            agregarMensaje(respuesta.texto, 'bot', { productos: respuesta.productos });
        } catch {
            mostrarEscribiendo(false);
            agregarMensaje('No pude comunicarme con el asistente. Inténtalo de nuevo en unos minutos.', 'error');
        } finally {
            bloquearEntrada(false);
        }
    }

    // ---------- Inicio ----------

    function iniciar() {
        const { boton, panel, enPagina } = construirWidget();
        const formulario = document.getElementById('chatbotFormulario');
        const entrada = document.getElementById('chatbotEntrada');

        // Modo flotante: el panel arranca cerrado, así que sus controles no deben ser enfocables.
        // En modo página (enPagina) el panel está siempre visible y no se toca.
        if (!enPagina) panel.inert = true;

        function abrir() {
            panel.inert = false;          // primero habilitar, para poder enfocar la entrada
            panel.classList.add('abierto');
            boton.classList.add('oculto');
            boton.inert = true;           // el botón oculto no debe recibir foco
            entrada.focus();
        }
        function cerrar() {
            if (!panel.classList.contains('abierto')) return;
            panel.classList.remove('abierto');
            panel.inert = true;           // saca del orden de tabulación el campo y los botones
            boton.classList.remove('oculto');
            boton.inert = false;
            boton.focus();                // devuelve el foco al botón de apertura
        }

        boton.addEventListener('click', abrir);
        if (enPagina) document.getElementById('chatbotCerrar').remove();
        else document.getElementById('chatbotCerrar').addEventListener('click', cerrar);
        document.getElementById('chatbotLimpiar').addEventListener('click', reiniciarConversacion);
        if (!enPagina) document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });

        formulario.addEventListener('submit', e => {
            e.preventDefault();
            const texto = entrada.value;
            entrada.value = '';
            enviarMensaje(texto);
        });

        // Botón "Agregar" dentro de las tarjetas: reutiliza agregarAlCarrito de carrito.js
        document.getElementById('chatbotMensajes').addEventListener('click', e => {
            const btn = e.target.closest('.chatbot-producto-agregar');
            if (btn && typeof agregarAlCarrito === 'function') agregarAlCarrito(btn);
        });

        restaurarHistorial();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
