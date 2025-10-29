// js/main.js - ARCHIVO COMPLETO Y FUNCIONAL
document.addEventListener('DOMContentLoaded', function () {
    console.log('InsectraX - Inicializando aplicación...');
    
    // ===== CÓDIGO ORIGINAL (que ya funcionaba) =====
    // Elementos del menú móvil
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Función para toggle del menú
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Event listeners para el menú
    hamburger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Animación inicial del hero
    setTimeout(function () {
        document.querySelector('.hero-content').classList.add('visible');
    }, 300);

    // Header scroll effect
    window.addEventListener('scroll', function () {
        const header = document.getElementById('main-header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Observador para animar elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animar features cards con delay
                if (entry.target.classList.contains('features-grid')) {
                    const cards = entry.target.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
                
                // Animar tech cards con delay
                if (entry.target.classList.contains('tech-grid')) {
                    const cards = entry.target.querySelectorAll('.tech-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);

    // Observar elementos con efecto de desplazamiento
    document.querySelectorAll('.scroll-section .text-overlay, .features-grid, .tech-grid, .testimonials-grid').forEach(element => {
        observer.observe(element);
    });

    // Inicializar opacidad de las cards
    document.querySelectorAll('.feature-card, .tech-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cerrar menu con Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Inicializar tema
    initializeTheme();

    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open current if wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ===== NUEVAS FUNCIONALIDADES =====
    inicializarAnalytics();
    inicializarFormularios();
    inicializarGaleria();
    inicializarOptimizaciones();
    inicializarServiceWorker();
    
    console.log('Aplicación InsectraX inicializada correctamente');
});

// ===== FUNCIONES DE TEMA (existentes) =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Aplicar el nuevo tema
    document.documentElement.setAttribute('data-theme', newTheme);

    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', newTheme);

    // Actualizar el estado del checkbox (INVERTIDO - modo oscuro es el predeterminado)
    const themeSwitch = document.querySelector('.theme-switch__checkbox');
    if (themeSwitch) {
        themeSwitch.checked = newTheme === 'light';
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Modo oscuro por defecto
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Configurar el estado del checkbox (INVERTIDO)
    const themeSwitch = document.querySelector('.theme-switch__checkbox');
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === 'light';
        themeSwitch.addEventListener('change', toggleTheme);
    }
}

// ===== NUEVAS FUNCIONES DE INICIALIZACIÓN =====

// Analytics
function inicializarAnalytics() {
    if (typeof InsectraXAnalytics !== 'undefined') {
        InsectraXAnalytics.init();
        console.log('✅ Analytics inicializado');
    } else {
        console.log('❌ Analytics no disponible');
    }
}

// Formularios
function inicializarFormularios() {
    if (typeof InsectraXFormHandler !== 'undefined') {
        InsectraXFormHandler.init();
        console.log('✅ Formularios inicializados');
    } else {
        console.log('❌ Formularios no disponibles');
    }
}

// Galería
function inicializarGaleria() {
    if (typeof InsectraXGallery !== 'undefined') {
        InsectraXGallery.init();
        console.log('✅ Galería inicializada');
    } else {
        console.log('❌ Galería no disponible');
    }
}

// Optimizaciones
function inicializarOptimizaciones() {
    if (typeof InsectraXOptimizations !== 'undefined') {
        InsectraXOptimizations.init();
        console.log('✅ Optimizaciones inicializadas');
    } else {
        console.log('❌ Optimizaciones no disponibles');
    }
}

// Service Worker
function inicializarServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('✅ Service Worker registrado:', registration))
            .catch(error => console.log('❌ Error registrando Service Worker:', error));
    }
}

// Función global para notificaciones (necesaria para formularios)
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#27ae60' : tipo === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Hacerla global para que otros archivos la usen
window.mostrarNotificacion = mostrarNotificacion;