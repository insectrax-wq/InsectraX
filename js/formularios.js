// js/formularios.js
class FormHandler {
    constructor() {
        this.apiUrl = 'https://tu-backend.com/api'; // Reemplaza con tu URL
        this.forms = [];
    }

    init() {
        this.setupNewsletterForm();
        this.setupContactForms();
    }

    setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }

    setupContactForms() {
        // Puedes agregar más formularios aquí
        const contactButtons = document.querySelectorAll('[data-contact]');
        contactButtons.forEach(button => {
            button.addEventListener('click', () => this.openContactModal());
        });
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Mostrar loading
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            const response = await this.subscribeNewsletter(email);
            
            if (response.success) {
                this.showNotification('¡Gracias por suscribirte! Te contactaremos pronto.', 'success');
                emailInput.value = '';
                
                // Track en Analytics
                if (window.InsectraXAnalytics) {
                    InsectraXAnalytics.trackEvent('Newsletter', 'Subscription', 'Suscripción exitosa');
                }
            } else {
                throw new Error(response.message || 'Error en el servidor');
            }
        } catch (error) {
            this.showNotification('Error al enviar. Intenta nuevamente.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async subscribeNewsletter(email) {
        // Simular envío a API - Reemplaza con tu endpoint real
        const payload = {
            email: email,
            source: 'insectrax_website',
            timestamp: new Date().toISOString()
        };

        // Para desarrollo, simula una respuesta exitosa
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({ success: true, message: 'Suscripción exitosa' });
                }, 1000);
            });
        }

        // Para producción, usa fetch real
        const response = await fetch(`${this.apiUrl}/newsletter/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showNotification(message, type = 'info') {
        // Reutilizar tu función existente o crear una nueva
        if (window.mostrarNotificacion) {
            mostrarNotificacion(message, type);
        } else {
            alert(message); // Fallback
        }
    }

    openContactModal() {
        // Implementar modal de contacto
        this.showContactModal();
    }

    showContactModal() {
        const modalHTML = `
            <div class="modal-overlay" id="contactModal">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h3>Contacta a nuestro equipo</h3>
                    <form id="contactForm" class="contact-form">
                        <div class="form-group">
                            <label for="contactName">Nombre completo</label>
                            <input type="text" id="contactName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="contactEmail">Email</label>
                            <input type="email" id="contactEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="contactPhone">Teléfono</label>
                            <input type="tel" id="contactPhone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="contactMessage">Mensaje</label>
                            <textarea id="contactMessage" name="message" rows="4" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="contactHectareas">Hectáreas aproximadas</label>
                            <input type="number" id="contactHectareas" name="hectareas" min="1">
                        </div>
                        <button type="submit" class="hero-button primary">Enviar mensaje</button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupContactModal();
    }

    setupContactModal() {
        const modal = document.getElementById('contactModal');
        const form = document.getElementById('contactForm');
        const closeBtn = modal.querySelector('.modal-close');

        closeBtn.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        form.addEventListener('submit', (e) => this.handleContactSubmit(e));

        // Mostrar modal con animación
        setTimeout(() => modal.classList.add('active'), 10);
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Aquí iría el envío real al backend
        this.showNotification('Mensaje enviado. Te contactaremos pronto.', 'success');
        this.closeModal();
    }

    closeModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Inicializar
const formHandler = new FormHandler();
window.InsectraXFormHandler = formHandler;