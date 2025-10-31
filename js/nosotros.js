document.addEventListener('DOMContentLoaded', function () {

    // ===== CONFIGURACIÓN BÁSICA =====
    const config = {
        selectores: {
            header: 'header',
            hamburger: '.hamburger',
            navMenu: '.nav-menu',
            menuOverlay: '.menu-overlay',
            heroContent: '.hero-content',
            teamSection: '#equipo',
            teamCards: '.team-card',
            filterBtns: '.filter-btn',
            galleryItems: '.gallery-item, .process-item',
            lightbox: '.lightbox',
            lightboxImg: '#lightboxImage',
            lightboxCaption: '#lightboxCaption',
            lightboxCounter: '#lightboxCounter'
        }
    };

    // ===== FUNCIONES BÁSICAS DE SELECCIÓN =====
    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    // ===== MENÚ MÓVIL (igual al que funciona) =====
    const hamburger = $('#hamburger');
    const navMenu = $('#navMenu');
    const menuOverlay = $('#menuOverlay');

    function toggleMenu() {
        if (hamburger && navMenu && menuOverlay) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en enlaces
    $$('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ===== ANIMACIÓN HERO =====
    setTimeout(function () {
        const heroContent = $('.hero-content');
        if (heroContent) {
            heroContent.classList.add('visible');
        }
    }, 300);

    // ===== HEADER SCROLL =====
    window.addEventListener('scroll', function () {
        const header = $('#main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    });

    // ===== ANIMACIONES AL SCROLL (versión simple) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos con animación
    $$('.team-card, .value-card, .stat-card, .process-item, .timeline-content, .feature').forEach(element => {
        // Solo aplicar opacidad 0 si el elemento no está visible en la pantalla inicial
        const rect = element.getBoundingClientRect();
        if (rect.top >= window.innerHeight) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    // Observar secciones principales
    $$('.about-section, .team-section, .values-section, .uppe-section, .timeline-section, .gallery-section, .process-section').forEach(section => {
        observer.observe(section);
    });

    // ===== SCROLL SUAVE =====
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = $(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== FILTROS DE EQUIPO (versión simple) =====
    function inicializarFiltrosEquipo() {
        const filterBtns = $$('.filter-btn');
        const teamCards = $$('.team-card');

        if (filterBtns.length === 0 || teamCards.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos los botones
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Agregar active al botón clickeado
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter') || 'all';
                
                teamCards.forEach(card => {
                    const category = card.getAttribute('data-category') || 'all';
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ===== GALERÍA Y LIGHTBOX (versión simple) =====
    function inicializarGaleria() {
        const galleryItems = $$('.gallery-item, .process-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img && img.src) {
                    const caption = this.querySelector('.gallery-overlay span, .process-overlay h4');
                    abrirLightbox(img.src, caption ? caption.textContent : 'Imagen');
                }
            });
        });

        // View buttons
        $$('.gallery-view').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const galleryItem = this.closest('.gallery-item, .process-item');
                const img = galleryItem ? galleryItem.querySelector('img') : null;
                if (img && img.src) {
                    const caption = galleryItem.querySelector('.gallery-overlay span, .process-overlay h4');
                    abrirLightbox(img.src, caption ? caption.textContent : 'Imagen');
                }
            });
        });
    }

    function inicializarLightbox() {
        const lightbox = $('.lightbox');
        if (!lightbox) return;

        // Cerrar con botón
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.addEventListener('click', cerrarLightbox);

        // Cerrar con click fuera
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) cerrarLightbox();
        });

        // Navegación con teclado
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') cerrarLightbox();
        });
    }

    function abrirLightbox(src, caption = '') {
        const lightbox = $('.lightbox');
        const lightboxImg = $('#lightboxImage');
        
        if (!lightbox || !lightboxImg) return;
        
        lightboxImg.src = src;
        lightboxImg.style.opacity = '1';
        
        const lightboxCaption = $('#lightboxCaption');
        if (lightboxCaption) lightboxCaption.textContent = caption;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function cerrarLightbox() {
        const lightbox = $('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===== CONTADORES ANIMADOS (versión simple) =====
    function inicializarContadores() {
        const counterElements = $$('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-count'));
                    if (target && !element.classList.contains('animated')) {
                        animateCounter(element, target);
                        element.classList.add('animated');
                    }
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(element => counterObserver.observe(element));
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ===== INICIALIZAR FUNCIONALIDADES =====
    inicializarFiltrosEquipo();
    inicializarGaleria();
    inicializarLightbox();
    inicializarContadores();

    // ===== RESPUESTA DE SEGURIDAD =====
    setTimeout(function() {
        $$('.team-card, .value-card, .stat-card').forEach(element => {
            if (element.style.opacity === '0') {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('visible');
            }
        });
    }, 2000);

});

// ===== SISTEMA DE TEMA (igual al que funciona) =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const themeSwitch = document.querySelector('.theme-switch__checkbox');
    if (themeSwitch) {
        themeSwitch.checked = newTheme === 'light';
    }
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

document.addEventListener('DOMContentLoaded', initializeTheme);