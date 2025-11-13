document.addEventListener('DOMContentLoaded', function () {
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

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

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

    $$('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    setTimeout(function () {
        const heroContent = $('.hero-content');
        if (heroContent) {
            heroContent.classList.add('visible');
        }
    }, 300);

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

    $$('.team-card, .value-card, .stat-card, .process-item, .timeline-content, .feature').forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top >= window.innerHeight) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    $$('.about-section, .team-section, .values-section, .uppe-section, .timeline-section, .gallery-section, .process-section').forEach(section => {
        observer.observe(section);
    });

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

    function inicializarFiltrosEquipo() {
        const filterBtns = $$('.filter-btn');
        const teamCards = $$('.team-card');

        if (filterBtns.length === 0 || teamCards.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
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

    function inicializarGaleria() {
        const galleryItems = $$('.gallery-item, .process-item');

        galleryItems.forEach(item => {
            item.addEventListener('click', function () {
                const img = this.querySelector('img');
                if (img && img.src) {
                    const caption = this.querySelector('.gallery-overlay span, .process-overlay h4');
                    abrirLightbox(img.src, caption ? caption.textContent : 'Imagen');
                }
            });
        });

        $$('.gallery-view').forEach(btn => {
            btn.addEventListener('click', function (e) {
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

        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.addEventListener('click', cerrarLightbox);

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) cerrarLightbox();
        });

        document.addEventListener('keydown', function (e) {
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
        const increment = target / (duration / 16);

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

    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    document.querySelectorAll('a, button, .team-card, .gallery-item, .process-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.2)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        animateOnScroll.observe(el);
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    const cityMarkers = document.querySelectorAll('.city-marker');
    
    cityMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', function() {
            const city = this.getAttribute('data-city');
        });
        
        marker.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
        });
    });

    const teamInfoCards = document.querySelectorAll('.team-info-card');
    
    teamInfoCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const mapVisual = document.querySelector('.map-visual');
    
    if (mapVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            mapVisual.style.transform = `translateY(${rate}px)`;
        });
    }

    inicializarFiltrosEquipo();
    inicializarGaleria();
    inicializarLightbox();
    inicializarContadores();

    setTimeout(function () {
        $$('.team-card, .value-card, .stat-card').forEach(element => {
            if (element.style.opacity === '0') {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('visible');
            }
        });
    }, 2000);
});

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

document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltrosMejorados();
    inicializarParticulas();
});

function inicializarFiltrosMejorados() {
    const filterBtns = document.querySelectorAll('.filter-btn-enhanced');
    const teamCards = document.querySelectorAll('.team-info-card');
    const memberCount = document.getElementById('memberCount');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            let visibleCount = 0;

            teamCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden', 'fade-out');
                    card.classList.add('fade-in');
                    visibleCount++;
                } else {
                    card.classList.remove('fade-in');
                    card.classList.add('fade-out');
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });

            if (memberCount) {
                memberCount.textContent = visibleCount;
            }
        });
    });
}

function inicializarParticulas() {
    const particlesContainer = document.getElementById('teamParticles');
    if (!particlesContainer) return;

    for (let i = 0; i < 15; i++) {
        crearParticula(particlesContainer);
    }
}

function crearParticula(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 107, 107, 0.2)'};
        border-radius: 50%;
        left: ${posX}%;
        top: ${posY}%;
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', initializeTheme);