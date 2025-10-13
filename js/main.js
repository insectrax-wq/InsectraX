// Animación de elementos al hacer scroll
document.addEventListener('DOMContentLoaded', function () {
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

    // Pa cerrar menu con Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// JavaScript corregido
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

// Inicializar el tema al cargar la página
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

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeTheme);