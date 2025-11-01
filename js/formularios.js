particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ff0000" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ff0000",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    },
    retina_detect: true
});

class FormularioRegistro {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.form = document.getElementById('registrationForm');
        this.modal = document.getElementById('successModal');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
        this.updateProgress();
        this.updateNavigationButtons();
    }

    setupEventListeners() {
        document.getElementById('btnSiguiente').addEventListener('click', () => this.nextStep());
        document.getElementById('btnAnterior').addEventListener('click', () => this.previousStep());

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.getElementById('btnCerrarModal').addEventListener('click', () => this.cerrarModal());

        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.cerrarModal();
            }
        });
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                if (input.type === 'textarea') {
                    this.actualizarContadorCaracteres(input);
                }
            });

            if (input.type === 'checkbox' || input.type === 'radio') {
                input.addEventListener('change', () => this.validateField(input));
            }
        });

        const textareas = this.form.querySelectorAll('textarea');
        textareas.forEach(textarea => this.actualizarContadorCaracteres(textarea));
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            this.mostrarMensajeError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.hideStep(this.currentStep);
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    hideStep(step) {
        const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (stepElement) {
            stepElement.classList.remove('active');
        }
    }

    showStep(step) {
        const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }

    updateProgress() {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        document.querySelectorAll('.step-indicator').forEach(indicator => {
            indicator.textContent = `Paso ${this.currentStep} de ${this.totalSteps}`;
        });
    }

    updateNavigationButtons() {
        const btnAnterior = document.getElementById('btnAnterior');
        const btnSiguiente = document.getElementById('btnSiguiente');
        const btnEnviar = document.getElementById('btnEnviar');

        btnAnterior.style.display = this.currentStep > 1 ? 'flex' : 'none';

        if (this.currentStep === this.totalSteps) {
            btnSiguiente.classList.add('hidden');
            btnEnviar.classList.remove('hidden');
        } else {
            btnSiguiente.classList.remove('hidden');
            btnEnviar.classList.add('hidden');
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        if (field.type === 'checkbox' && field.name === 'intereses') {
            const checkboxes = document.querySelectorAll('input[name="intereses"]:checked');
            isValid = checkboxes.length >= 2;
            errorMessage = 'Selecciona al menos 2 áreas de interés';
        } else if (field.type === 'radio' && field.name === 'disponibilidad') {
            const radios = document.querySelectorAll('input[name="disponibilidad"]:checked');
            isValid = radios.length > 0;
            errorMessage = 'Selecciona tu disponibilidad semanal';
        } else if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value);
            errorMessage = 'Ingresa un correo electrónico válido';
        } else if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            isValid = phoneRegex.test(field.value.replace(/\s/g, ''));
            errorMessage = 'Ingresa un número de teléfono válido';
        } else if (field.type === 'number' && field.value) {
            if (field.name === 'edad') {
                const value = parseInt(field.value);
                isValid = value >= 16 && value <= 80;
                errorMessage = 'La edad debe estar entre 16 y 80 años';
            } else if (field.name === 'promedio') {
                const value = parseFloat(field.value);
                isValid = value >= 0 && value <= 10;
                errorMessage = 'El promedio debe estar entre 0 y 10';
            }
        }

        this.displayFieldError(field, isValid, errorMessage);
        return isValid;
    }

    displayFieldError(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup ? formGroup.querySelector('.error-message') : null;

        if (!isValid) {
            field.classList.add('input-error');
            field.classList.remove('input-success');
            if (errorElement) {
                errorElement.textContent = message;
            }
        } else {
            field.classList.remove('input-error');
            field.classList.add('input-success');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('input-error');
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup ? formGroup.querySelector('.error-message') : null;
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    actualizarContadorCaracteres(textarea) {
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
        const currentLength = textarea.value.length;
        const formGroup = textarea.closest('.form-group');
        const counter = formGroup ? formGroup.querySelector('.character-count') : null;

        if (counter) {
            counter.textContent = `${currentLength}/${maxLength}`;

            counter.classList.remove('warning', 'error');
            if (currentLength > maxLength * 0.8) {
                counter.classList.add('warning');
            }
            if (currentLength > maxLength) {
                counter.classList.add('error');
            }
        }
    }

    mostrarMensajeError(mensaje) {
        const existingAlert = document.querySelector('.alert-error');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = 'alert-error';
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: var(--shadow-glow);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
            font-weight: 600;
            backdrop-filter: blur(10px);
        `;
        alert.textContent = mensaje;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateCurrentStep()) {
            this.mostrarMensajeError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        this.mostrarLoading(true);

        try {
            const formData = this.getFormData();
            await this.enviarDatos(formData);
            this.mostrarLoading(false);
            this.mostrarModalExito();
            this.crearConfetti();
        } catch (error) {
            this.mostrarLoading(false);
            this.mostrarMensajeError('Error al enviar el formulario. Intenta nuevamente.');
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    async enviarDatos(data) {
        try {
            console.log('📨 Enviando datos al servidor...', data);

            // Crear FormData para enviar al PHP
            const formData = new FormData();

            // Agregar todos los datos al FormData
            for (const key in data) {
                if (Array.isArray(data[key])) {
                    // Para arrays (como intereses), agregar cada valor por separado
                    data[key].forEach(value => {
                        formData.append(key + '[]', value);
                    });
                } else {
                    formData.append(key, data[key]);
                }
            }

            // Mostrar lo que se va a enviar (para debug)
            console.log('📊 FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key + ': ' + value);
            }

            // Enviar al archivo PHP
            const response = await fetch('http://localhost/guardar_registro.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await response.text();
            console.log('📬 Respuesta del servidor:', resultado);

            // Verificar si fue exitoso
            if (resultado.includes('REGISTRO EXITOSO') || resultado.includes('éxito')) {
                return { success: true, message: 'Registro guardado correctamente' };
            } else {
                throw new Error('Error en el servidor: ' + resultado);
            }

        } catch (error) {
            console.error('❌ Error al enviar datos:', error);
            throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.');
        }
    }

    mostrarLoading(mostrar) {
        const btn = document.getElementById('btnEnviar');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        if (mostrar) {
            btn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
        } else {
            btn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
    }

    mostrarModalExito() {
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.form.reset();
        this.currentStep = 1;

        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.form-step[data-step="1"]').classList.add('active');

        this.updateProgress();
        this.updateNavigationButtons();

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.classList.remove('input-error', 'input-success');
        });

        document.querySelectorAll('.character-count').forEach(counter => {
            counter.textContent = '0/' + (counter.previousElementSibling?.getAttribute('maxlength') || '500');
        });
    }

    crearConfetti() {
        const confettiContainer = document.querySelector('.confetti');
        const colors = ['#ff0000', '#ff6b6b', '#ffffff', '#ff3333'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -20px;
                left: ${Math.random() * 100}%;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                opacity: ${Math.random() * 0.5 + 0.5};
                transform: rotate(${Math.random() * 360}deg);
            `;
            confettiContainer.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FormularioRegistro();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);