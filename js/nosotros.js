// Animacion de elementos al hacer scroll
document.addEventListener('DOMContentLoaded', function () {
    // Elementos del menu movil
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Funcion para toggle del menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Event listeners para el menu
    hamburger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Cerrar menu al hacer clic en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Animacion inicial del hero
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
                // Asegurar que la opacidad se restablezca cuando son visibles
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos con animacion - SOLO aplicar estilos iniciales si no son visibles
    document.querySelectorAll('.team-card, .value-card').forEach(element => {
        // Solo aplicar opacidad 0 si el elemento no está visible en la pantalla inicial
        if (!element.getBoundingClientRect().top < window.innerHeight) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    // MEJORA: También observar las secciones principales
    document.querySelectorAll('.about-section, .team-section, .values-section, .uppe-section, .philosophy-section').forEach(section => {
        observer.observe(section);
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

    // Cerrar menu con la tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // SOLUCIÓN ALTERNATIVA: Forzar visibilidad después de un tiempo si el observer falla
    setTimeout(function() {
        document.querySelectorAll('.team-card, .value-card').forEach(element => {
            if (element.style.opacity === '0') {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('visible');
            }
        });
    }, 2000); // 2 segundos como respaldo
});