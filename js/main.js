// js/main.js - ARCHIVO OPTIMIZADO
document.addEventListener('DOMContentLoaded', function () {

    // Elementos del menú móvil
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    // Animación inicial del hero
    setTimeout(() => {
        document.querySelector('.hero-content')?.classList.add('visible');
    }, 300);

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        header?.classList.toggle('header-scrolled', window.scrollY > 100);
    });

    // Observador para animaciones al scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('features-grid')) {
                    animateCards(entry.target.querySelectorAll('.feature-card'));
                }
                if (entry.target.classList.contains('tech-grid')) {
                    animateCards(entry.target.querySelectorAll('.tech-card'));
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    function animateCards(cards) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    document.querySelectorAll('.scroll-section .text-overlay, .features-grid, .tech-grid, .testimonials-grid').forEach(element => {
        observer.observe(element);
    });

    // Inicializar cards
    document.querySelectorAll('.feature-card, .tech-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });

    // Smooth scroll
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Inicializar componentes
    initializeTheme();
    initializeFAQ();
    inicializarAnalytics();
    inicializarFormularios();
    inicializarGaleria();
    inicializarOptimizaciones();
    
    // Tour 3D con verificación mejorada
    setTimeout(() => {
        if (typeof inicializarTour3D === 'function') {
            inicializarTour3D();
        } else {
        }
    }, 500);

});

// Sistema de tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeSwitch = document.querySelector('.theme-switch__checkbox');
    if (themeSwitch) themeSwitch.checked = newTheme === 'light';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeSwitch = document.querySelector('.theme-switch__checkbox');
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === 'light';
        themeSwitch.addEventListener('change', toggleTheme);
    }
}

// FAQ System
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Inicializadores de módulos
function inicializarAnalytics() {
    if (typeof InsectraXAnalytics !== 'undefined') {
        InsectraXAnalytics.init();
    }
}

function inicializarFormularios() {
    if (typeof InsectraXFormHandler !== 'undefined') {
        InsectraXFormHandler.init();
    }
}

function inicializarGaleria() {
    if (typeof InsectraXGallery !== 'undefined') {
        InsectraXGallery.init();
    }
}

function inicializarOptimizaciones() {
    if (typeof InsectraXOptimizations !== 'undefined') {
        InsectraXOptimizations.init();
    }
}

// Service Worker (comentado temporalmente)
function inicializarServiceWorker() {
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/sw.js')
    // }
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: tipo === 'success' ? '#27ae60' : tipo === 'error' ? '#e74c3c' : '#3498db',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideInRight 0.3s ease'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

window.mostrarNotificacion = mostrarNotificacion;