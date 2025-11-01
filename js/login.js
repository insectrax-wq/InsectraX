// Configuración de partículas
particlesJS('particles-js', {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ff0000" },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: 2, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ff0000",
            opacity: 0.1,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
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

class LoginSystem {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.modal = document.getElementById('welcomeModal');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
        this.checkRememberedUser();
    }

    setupEventListeners() {
        // Envío del formulario
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Toggle de contraseña
        document.getElementById('togglePassword').addEventListener('click', () => this.togglePassword());
        
        // Botones sociales
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
        
        // Modal
        document.getElementById('btnCerrarModal').addEventListener('click', () => this.cerrarModal());
        document.getElementById('btnIrDashboard').addEventListener('click', () => this.irAlDashboard());
        
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

        // Efectos de hover
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('.toggle-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            toggleIcon.textContent = '👁️';
        }
    }

    validateField(field) {
        const errorElement = field.closest('.form-group')?.querySelector('.error-message');
        
        this.clearFieldError(field);

        let isValid = true;
        let errorMessage = '';

        switch(field.type) {
            case 'email':
                isValid = this.validateEmail(field);
                if (!isValid) errorMessage = 'Ingresa un correo electrónico válido';
                break;
                
            case 'password':
                isValid = this.validatePassword(field);
                if (!isValid) errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                break;
                
            case 'checkbox':
                if (field.name === 'captcha' && !field.checked) {
                    isValid = false;
                    errorMessage = 'Debes verificar que no eres un robot';
                }
                break;
        }

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        }

        if (!isValid && errorElement) {
            this.showFieldError(field, errorMessage);
        } else if (isValid) {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    validateEmail(field) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(field.value.trim());
    }

    validatePassword(field) {
        return field.value.length >= 6;
    }

    showFieldError(field, message) {
        field.classList.add('input-error');
        field.classList.remove('input-success');
        
        const errorElement = field.closest('.form-group')?.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    showFieldSuccess(field) {
        field.classList.remove('input-error');
        field.classList.add('input-success');
        
        const errorElement = field.closest('.form-group')?.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearFieldError(field) {
        field.classList.remove('input-error');
        const errorElement = field.closest('.form-group')?.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.mostrarMensajeError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        this.mostrarLoading(true);

        try {
            const formData = this.getFormData();
            
            // Simular autenticación
            const userData = await this.autenticarUsuario(formData);
            
            this.mostrarLoading(false);
            this.mostrarModalBienvenida(userData);
            
            // Recordar usuario si está marcado
            if (formData.remember) {
                this.recordarUsuario(userData);
            }
            
        } catch (error) {
            this.mostrarLoading(false);
            this.mostrarMensajeError('Credenciales incorrectas. Intenta nuevamente.');
            console.error('Error:', error);
        }
    }

    async handleSocialLogin(e) {
        const provider = e.currentTarget.classList.contains('google-btn') ? 'google' : 'github';
        this.mostrarMensajeInfo(`Iniciando sesión con ${provider}...`);
        
        // Simular login social
        setTimeout(() => {
            const userData = {
                name: provider === 'google' ? 'Usuario Google' : 'Usuario GitHub',
                email: `usuario@${provider}.com`,
                avatar: provider === 'google' ? '👤' : '💻'
            };
            this.mostrarModalBienvenida(userData);
        }, 2000);
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        data.remember = document.getElementById('remember').checked;
        return data;
    }

    async autenticarUsuario(credentials) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulación de base de datos de usuarios
                const users = {
                    'admin@insectrax.com': { password: '123456', name: 'Administrador', avatar: '👨‍💼' },
                    'usuario@insectrax.com': { password: '123456', name: 'Usuario Demo', avatar: '👤' },
                    'angel@insectrax.com': { password: '123456', name: 'Ángel Escamilla', avatar: '🚀' }
                };

                const user = users[credentials.email];
                
                if (user && user.password === credentials.password) {
                    resolve({
                        name: user.name,
                        email: credentials.email,
                        avatar: user.avatar
                    });
                } else {
                    reject(new Error('Credenciales inválidas'));
                }
            }, 1500);
        });
    }

    recordarUsuario(userData) {
        localStorage.setItem('insectrax_remembered_user', JSON.stringify({
            email: userData.email,
            timestamp: Date.now()
        }));
    }

    checkRememberedUser() {
        const remembered = localStorage.getItem('insectrax_remembered_user');
        if (remembered) {
            const userData = JSON.parse(remembered);
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            
            if (Date.now() - userData.timestamp < oneWeek) {
                document.getElementById('email').value = userData.email;
                document.getElementById('remember').checked = true;
            }
        }
    }

    mostrarLoading(mostrar) {
        const btn = document.querySelector('.login-btn');
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

    mostrarModalBienvenida(userData) {
        document.getElementById('welcomeMessage').textContent = `¡Bienvenido de vuelta, ${userData.name.split(' ')[0]}!`;
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userAvatar').textContent = userData.avatar;
        
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Efectos de confeti
        this.crearConfeti();
    }

    cerrarModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.form.reset();
    }

    irAlDashboard() {
        this.mostrarMensajeInfo('Redirigiendo al dashboard...');
        setTimeout(() => {
            // En una implementación real, aquí iría la redirección
            console.log('Redirigiendo al dashboard...');
            this.cerrarModal();
        }, 1000);
    }

    crearConfeti() {
        const colors = ['#ff0000', '#ff6b6b', '#ffffff', '#ff3333'];
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: confettiFall ${Math.random() * 2 + 1}s linear forwards;
                opacity: ${Math.random() * 0.5 + 0.5};
                transform: rotate(${Math.random() * 360}deg);
                z-index: 1001;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    mostrarMensajeError(mensaje) {
        this.mostrarNotificacion(mensaje, 'error');
    }

    mostrarMensajeInfo(mensaje) {
        this.mostrarNotificacion(mensaje, 'info');
    }

    mostrarNotificacion(mensaje, tipo) {
        const existingAlert = document.querySelector('.notification');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `notification ${tipo}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'error' ? 'var(--error-color)' : 'var(--accent-color)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: var(--shadow-glow);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
            font-weight: 600;
            backdrop-filter: blur(10px);
            max-width: 300px;
        `;
        alert.textContent = mensaje;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Agregar estilos de animación adicionales
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
    
    .form-group.focused label {
        color: var(--accent-color);
    }
    
    .form-group.focused .label-icon {
        transform: scale(1.1);
    }
    
    .notification {
        font-family: inherit;
    }
`;
document.head.appendChild(style);

// EN login.js - Reemplaza la línea que da error
document.addEventListener('DOMContentLoaded', function() {
    const loginSystem = new LoginSystem();
    
    // INICIALIZACIÓN SEGURA DEL CAPTCHA
    if (typeof CustomCaptcha !== 'undefined') {
        const captcha = new CustomCaptcha('customCaptcha', {
            type: 'checkbox',
            onSuccess: function() {
                console.log('Captcha verificado');
            }
        });
    } else {
        console.warn('CustomCaptcha no disponible - usando verificación simple');
        // Puedes agregar un captcha de respaldo aquí
    }
});