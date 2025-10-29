// js/optimizaciones.js
class Optimizations {
    constructor() {
        this.observedImages = new Set();
    }

    init() {
        this.setupLazyLoading();
        this.setupPreloadCriticalResources();
        this.setupPerformanceMonitoring();
    }

    setupLazyLoading() {
        // Usar Intersection Observer para lazy loading avanzado
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        });

        // Observar todas las imágenes no críticas
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.src = src;
        img.removeAttribute('data-src');
        
        img.onload = () => {
            img.classList.add('loaded');
        };
    }

    setupPreloadCriticalResources() {
        // Preload fuentes críticas
        const preloadLinks = [
            { href: '/img/fondos/campo.jpg', as: 'image' },
            { href: '/img/logos/InsectraX.png', as: 'image' }
        ];

        preloadLinks.forEach(link => {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = link.href;
            preload.as = link.as;
            document.head.appendChild(preload);
        });
    }

    setupPerformanceMonitoring() {
        // Monitorizar Core Web Vitals
        if ('PerformanceObserver' in window) {
            // LCP (Largest Contentful Paint)
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                
                if (window.InsectraXAnalytics) {
                    InsectraXAnalytics.trackEvent('Performance', 'LCP', lastEntry.startTime.toFixed(0));
                }
            });
            lcpObserver.observe({entryTypes: ['largest-contentful-paint']});

            // FID (First Input Delay)
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({entryTypes: ['first-input']});
        }
    }

    // Compresión de imágenes (para implementar en build process)
    optimizeImage(src, width, quality = 0.8) {
        // Esto sería implementado en el servidor o build process
        return `${src}?width=${width}&quality=${quality}`;
    }

    // Debounce para eventos de scroll/resize
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Inicializar optimizaciones
const optimizations = new Optimizations();
window.InsectraXOptimizations = optimizations;