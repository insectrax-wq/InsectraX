document.addEventListener('DOMContentLoaded', function () {
    const config = {
        selectores: {
            header: '#main-header',
            hamburger: '.hamburger',
            navMenu: '#navMenu',
            menuOverlay: '#menuOverlay',
            galleryItems: '.gallery-item, .process-item',
            lightbox: '#galleryLightbox',
            lightboxImg: '#lightboxImage',
            lightboxCaption: '#lightboxCaption',
            lightboxCounter: '#lightboxCounter',
            filterBtns: '.filter-btn-enhanced',
            teamCards: '.team-info-card',
            memberCount: '#memberCount'
        }
    };

    class GalleryManager {
        constructor() {
            this.currentIndex = 0;
            this.images = [];
            this.isOpen = false;
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            this.collectImages();
        }

        cacheElements() {
            this.lightbox = document.querySelector(config.selectores.lightbox);
            this.lightboxImg = document.querySelector(config.selectores.lightboxImg);
            this.lightboxCaption = document.querySelector(config.selectores.lightboxCaption);
            this.lightboxCounter = document.querySelector(config.selectores.lightboxCounter);
            this.closeBtn = this.lightbox?.querySelector('.lightbox-close');
            this.prevBtn = this.lightbox?.querySelector('.lightbox-prev');
            this.nextBtn = this.lightbox?.querySelector('.lightbox-next');
        }

        collectImages() {
            this.images = Array.from(document.querySelectorAll('.gallery-item img, .process-item img'))
                .map(img => ({
                    src: img.src,
                    alt: img.alt,
                    caption: this.getImageCaption(img)
                }));
        }

        getImageCaption(img) {
            const parent = img.closest('.gallery-item, .process-item');
            const captionElement = parent?.querySelector('.gallery-overlay span, .process-overlay h4');
            return captionElement?.textContent || img.alt;
        }

        bindEvents() {
            document.addEventListener('click', (e) => {
                const galleryItem = e.target.closest('.gallery-item, .process-item');
                const viewBtn = e.target.closest('.gallery-view');
                
                if (galleryItem || viewBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const targetItem = viewBtn ? viewBtn.closest('.gallery-item, .process-item') : galleryItem;
                    if (targetItem) {
                        const img = targetItem.querySelector('img');
                        if (img) {
                            this.openLightbox(img.src, this.getImageCaption(img));
                        }
                    }
                }
            });

            this.closeBtn?.addEventListener('click', () => this.closeLightbox());
            this.prevBtn?.addEventListener('click', () => this.navigate(-1));
            this.nextBtn?.addEventListener('click', () => this.navigate(1));

            document.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;

                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.navigate(-1);
                        break;
                    case 'ArrowRight':
                        this.navigate(1);
                        break;
                }
            });

            this.lightbox?.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }

        openLightbox(src, caption) {
            this.currentIndex = this.images.findIndex(img => img.src === src);
            if (this.currentIndex === -1) return;

            this.updateLightbox();
            this.lightbox?.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
        }

        closeLightbox() {
            this.lightbox?.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;
        }

        navigate(direction) {
            this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
            this.updateLightbox();
        }

        updateLightbox() {
            if (!this.images[this.currentIndex]) return;

            const { src, caption } = this.images[this.currentIndex];
            
            if (this.lightboxImg) {
                this.lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    this.lightboxImg.src = src;
                    this.lightboxImg.alt = caption;
                    this.lightboxImg.style.opacity = '1';
                }, 200);
            }

            if (this.lightboxCaption) {
                this.lightboxCaption.textContent = caption;
            }

            if (this.lightboxCounter) {
                this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
            }
        }
    }

    class TeamFilterManager {
        constructor() {
            this.activeFilter = 'all';
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            this.updateMemberCount();
        }

        cacheElements() {
            this.filterBtns = document.querySelectorAll(config.selectores.filterBtns);
            this.teamCards = document.querySelectorAll(config.selectores.teamCards);
            this.memberCount = document.querySelector(config.selectores.memberCount);
        }

        bindEvents() {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    this.setActiveFilter(filter);
                    this.filterCards(filter);
                    this.updateMemberCount();
                });
            });
        }

        setActiveFilter(filter) {
            this.filterBtns.forEach(btn => btn.classList.remove('active'));
            const activeBtn = Array.from(this.filterBtns).find(btn => btn.dataset.filter === filter);
            activeBtn?.classList.add('active');
            this.activeFilter = filter;
        }

        filterCards(filter) {
            let visibleCount = 0;

            this.teamCards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
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

            return visibleCount;
        }

        updateMemberCount() {
            if (this.memberCount) {
                const visibleCount = this.filterCards(this.activeFilter);
                this.memberCount.textContent = visibleCount;
            }
        }
    }

    class ScrollManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupScrollAnimations();
            this.setupHeaderScroll();
            this.setupSmoothScroll();
        }

        setupScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.scroll-animate').forEach(el => {
                observer.observe(el);
            });

            const timelineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.3 });

            document.querySelectorAll('.timeline-item').forEach(item => {
                timelineObserver.observe(item);
            });
        }

        setupHeaderScroll() {
            const header = document.querySelector(config.selectores.header);
            
            window.addEventListener('scroll', () => {
                if (header) {
                    if (window.scrollY > 100) {
                        header.classList.add('header-scrolled');
                    } else {
                        header.classList.remove('header-scrolled');
                    }
                }
            });
        }

        setupSmoothScroll() {
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
        }
    }

    class NavigationManager {
        constructor() {
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
        }

        cacheElements() {
            this.hamburger = document.querySelector(config.selectores.hamburger);
            this.navMenu = document.querySelector(config.selectores.navMenu);
            this.menuOverlay = document.querySelector(config.selectores.menuOverlay);
            this.navLinks = document.querySelectorAll('.nav-menu a');
        }

        bindEvents() {
            this.hamburger?.addEventListener('click', () => this.toggleMenu());
            this.menuOverlay?.addEventListener('click', () => this.toggleMenu());
            
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.navMenu?.classList.contains('active')) {
                        this.toggleMenu();
                    }
                });
            });
        }

        toggleMenu() {
            this.hamburger?.classList.toggle('active');
            this.navMenu?.classList.toggle('active');
            this.menuOverlay?.classList.toggle('active');
            document.body.style.overflow = this.navMenu?.classList.contains('active') ? 'hidden' : '';
        }
    }

    class CursorManager {
        constructor() {
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
        }

        cacheElements() {
            this.cursor = document.querySelector('.custom-cursor');
            this.cursorFollower = document.querySelector('.cursor-follower');
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                if (this.cursor) {
                    this.cursor.style.left = e.clientX + 'px';
                    this.cursor.style.top = e.clientY + 'px';
                }

                if (this.cursorFollower) {
                    setTimeout(() => {
                        this.cursorFollower.style.left = e.clientX + 'px';
                        this.cursorFollower.style.top = e.clientY + 'px';
                    }, 100);
                }
            });

            document.querySelectorAll('a, button, .team-card, .gallery-item, .process-item').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.cursor?.style.setProperty('transform', 'scale(1.5)');
                    this.cursorFollower?.style.setProperty('transform', 'scale(1.2)');
                });

                element.addEventListener('mouseleave', () => {
                    this.cursor?.style.setProperty('transform', 'scale(1)');
                    this.cursorFollower?.style.setProperty('transform', 'scale(1)');
                });
            });
        }
    }

    class CounterManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupCounters();
        }

        setupCounters() {
            const counterElements = document.querySelectorAll('[data-count]');
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const target = parseInt(element.getAttribute('data-count'));
                        if (target && !element.classList.contains('animated')) {
                            this.animateCounter(element, target);
                            element.classList.add('animated');
                        }
                    }
                });
            }, { threshold: 0.5 });

            counterElements.forEach(element => counterObserver.observe(element));
        }

        animateCounter(element, target) {
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
    }

    class ParticleManager {
        constructor() {
            this.init();
        }

        init() {
            this.createParticles();
        }

        createParticles() {
            const particlesContainer = document.getElementById('teamParticles');
            if (!particlesContainer) return;

            for (let i = 0; i < 15; i++) {
                this.createParticle(particlesContainer);
            }
        }

        createParticle(container) {
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
                background: ${Math.random() > 0.5 ? 'rgba(255, 0, 0, 0.9)' : 'rgba(255, 107, 107, 0.5)'};
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
        }
    }

    class ThemeManager {
        constructor() {
            this.init();
        }

        init() {
            this.initializeTheme();
        }

        initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);

            const themeSwitch = document.querySelector('.theme-switch__checkbox');
            if (themeSwitch) {
                themeSwitch.checked = savedTheme === 'light';
                themeSwitch.addEventListener('change', this.toggleTheme);
            }
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            const themeSwitch = document.querySelector('.theme-switch__checkbox');
            if (themeSwitch) {
                themeSwitch.checked = newTheme === 'light';
            }
        }
    }

    class HeroManager {
        constructor() {
            this.init();
        }

        init() {
            this.animateHeroContent();
        }

        animateHeroContent() {
            setTimeout(() => {
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.classList.add('visible');
                }
            }, 300);
        }
    }

    const initializeApp = () => {
        new NavigationManager();
        new ScrollManager();
        new GalleryManager();
        new TeamFilterManager();
        new CursorManager();
        new CounterManager();
        new ParticleManager();
        new ThemeManager();
        new HeroManager();

        setTimeout(() => {
            document.querySelectorAll('.team-card, .value-card, .stat-card').forEach(element => {
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('visible');
                }
            });
        }, 2000);

        const teamInfoCards = document.querySelectorAll('.team-info-card');
        teamInfoCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    };

    initializeApp();

    if (!document.querySelector('style#particle-animations')) {
        const style = document.createElement('style');
        style.id = 'particle-animations';
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
    }
});

(function () {
    var script = document.createElement('script');
    script.dataset.bot = "68e9ce94ba0e3e818618c369";
    script.dataset.zindex = "99999";
    script.src = "https://panel.chatfuel.com/widgets/chat-widget/chat-widget.js";
    script.async = true;
    script.defer = true;
    document.getElementsByTagName('head')[0].appendChild(script);
})();