// ========================================
// SMOOTH SCROLL PARA LA NAVEGACIÓN
// ========================================
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// HEADER DINÁMICO AL HACER SCROLL
// ========================================
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Añade sombra cuando scrolleas
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// ANIMACIONES AL HACER SCROLL (FADE IN)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// ========================================
// DATOS DE LOS SERVICIOS
// ========================================
const serviciosData = {
    'facial': {
        titulo: 'Tratamientos Faciales',
        descripcion: 'Recuperá la luminosidad y frescura de tu rostro con una piel profundamente hidratada, libre de impurezas y visiblemente rejuvenecida. Es el tratamiento ideal para quienes buscan combatir los signos de fatiga y restaurar la vitalidad cutánea frente al estrés urbano.',
        beneficios: [
            'Limpieza profunda de poros',
            'Hidratación intensiva',
            'Reducción de líneas de expresión',
            'Luminosidad inmediata',
            'Tonificación de la piel'
        ],
        duracion: '60-90 minutos',
        whatsappMsg: 'Hola! Me interesa consultar por los Tratamientos Faciales'
    },
    'corporal': {
        titulo: 'Cuidado Corporal',
        descripcion: 'Lográ una silueta más tonificada y una piel de textura sedosa mediante la eliminación de toxinas y la reactivación de la circulación natural. Diseñado para personas que desean reducir la retención de líquidos y regalarse un alivio profundo de las tensiones acumuladas.',
        beneficios: [
            'Reducción de celulitis y adiposidad',
            'Drenaje linfático efectivo',
            'Mejora de la circulación',
            'Exfoliación profunda',
            'Relajación muscular'
        ],
        duracion: '60-75 minutos',
        whatsappMsg: 'Hola! Me interesa consultar por el Cuidado Corporal (masajes y exfoliación)'
    },
    'depilacion': {
        titulo: 'Depilación Láser',
        descripcion: 'Disfrutá de una libertad total con una piel suave y sin vello de forma prolongada, olvidándote de las irritaciones constantes de los métodos tradicionales. Dirigido a quienes priorizan la comodidad diaria y buscan una solución definitiva, segura y eficaz para el cuidado de su cuerpo.',
        beneficios: [
            'Eliminación permanente del vello',
            'Piel suave sin irritación',
            'Tecnología de última generación',
            'Resultados visibles desde la primera sesión',
            'Apto para todo tipo de piel'
        ],
        duracion: 'Variable según zona',
        whatsappMsg: 'Hola! Me interesa consultar por la Depilación Láser'
    }
};

// ========================================
// CREAR ESTRUCTURA DEL MODAL
// ========================================
function crearModal() {
    const modalHTML = `
        <div id="servicioModal" class="modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2 id="modalTitulo"></h2>
                <div class="modal-body">
                    <p id="modalDescripcion" class="modal-descripcion"></p>
                    
                    <div class="modal-info">
                        <h3>Beneficios</h3>
                        <ul id="modalBeneficios"></ul>
                    </div>
                    
                    <div class="modal-duracion">
                        <strong>Duración:</strong> <span id="modalDuracion"></span>
                    </div>
                    
                    <div class="modal-actions">
                        <a href="#" id="modalWhatsapp" class="btn-modal btn-whatsapp" target="_blank">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Reservar turno por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ========================================
// AGREGAR BOTONES A LAS CARDS DE SERVICIOS
// ========================================
function agregarBotonesServicios() {
    const servicios = document.querySelectorAll('#servicios .card');
    
    servicios.forEach((card, index) => {
        // Determinar qué servicio es según el orden
        let servicioKey = '';
        const titulo = card.querySelector('h3').textContent.toLowerCase();
        
        if (titulo.includes('facial')) {
            servicioKey = 'facial';
        } else if (titulo.includes('corporal')) {
            servicioKey = 'corporal';
        } else if (titulo.includes('depilación') || titulo.includes('láser')) {
            servicioKey = 'depilacion';
        }
        
        // Crear botón "Más info"
        const boton = document.createElement('button');
        boton.className = 'btn-mas-info';
        boton.textContent = 'Más información';
        boton.setAttribute('data-servicio', servicioKey);
        
        // Insertar el botón al final del card-content
        const cardContent = card.querySelector('.card-content');
        if (cardContent) {
            cardContent.appendChild(boton);
        }
        
        // Event listener para abrir modal
        boton.addEventListener('click', () => abrirModal(servicioKey));
    });
}

// ========================================
// ABRIR MODAL CON INFORMACIÓN DEL SERVICIO
// ========================================
function abrirModal(servicioKey) {
    const servicio = serviciosData[servicioKey];
    if (!servicio) return;
    
    const modal = document.getElementById('servicioModal');
    
    // Llenar contenido del modal
    document.getElementById('modalTitulo').textContent = servicio.titulo;
    document.getElementById('modalDescripcion').textContent = servicio.descripcion;
    document.getElementById('modalDuracion').textContent = servicio.duracion;
    
    // Llenar beneficios
    const beneficiosLista = document.getElementById('modalBeneficios');
    beneficiosLista.innerHTML = '';
    servicio.beneficios.forEach(beneficio => {
        const li = document.createElement('li');
        li.textContent = beneficio;
        beneficiosLista.appendChild(li);
    });
    
    // Configurar botón de WhatsApp
    const whatsappBtn = document.getElementById('modalWhatsapp');
    const numeroWhatsapp = '5491234567890'; // REEMPLAZAR con tu número real
    const mensajeEncoded = encodeURIComponent(servicio.whatsappMsg);
    whatsappBtn.href = `https://wa.me/${numeroWhatsapp}?text=${mensajeEncoded}`;
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

// ========================================
// CERRAR MODAL
// ========================================
function cerrarModal() {
    const modal = document.getElementById('servicioModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// ========================================
// VALIDACIÓN DEL FORMULARIO
// ========================================
function validarFormulario() {
    const form = document.querySelector('#contacto form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const mensaje = this.querySelector('textarea').value.trim();
            
            // Validaciones básicas
            if (nombre === '' || email === '' || mensaje === '') {
                alert('Por favor completá todos los campos');
                return false;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresá un email válido');
                return false;
            }
            
            // Si todo está OK, redirigir a WhatsApp con la consulta
            const numeroWhatsapp = '5491234567890'; // REEMPLAZAR con tu número real
            const mensajeWhatsapp = `Hola! Mi nombre es ${nombre}. ${mensaje}`;
            const mensajeEncoded = encodeURIComponent(mensajeWhatsapp);
            
            window.open(`https://wa.me/${numeroWhatsapp}?text=${mensajeEncoded}`, '_blank');
            
            // Limpiar formulario
            this.reset();
            
            // Mostrar mensaje de confirmación
            alert('¡Gracias por tu consulta! Te estamos redirigiendo a WhatsApp.');
            
            return false;
        });
    }
}

// ========================================
// INICIALIZACIÓN CUANDO CARGA LA PÁGINA
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Crear el modal
    crearModal();
    
    // Agregar botones a las cards de servicios
    agregarBotonesServicios();
    
    // Event listener para cerrar modal
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar modal al hacer click fuera de él
    const modal = document.getElementById('servicioModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
    
    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Inicializar validación del formulario
    validarFormulario();
    
    console.log('✅ JavaScript cargado correctamente');
});