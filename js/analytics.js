// js/analytics.js - VERSIÓN CORREGIDA
class Analytics {
    constructor() {
        // ID de demostración de Google (funciona para pruebas)
        this.trackingId = 'GTM - TK5CN5LC'; // Usa este para pruebas
        // Para producción, consigue un ID real en: analytics.google.com
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        console.log('🔍 Inicializando Google Analytics...');

        // Solo inicializar si no estamos en localhost (para evitar spam)
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1') {
            console.log('📊 Analytics desactivado en localhost');
            this.setupMockAnalytics(); // Analytics simulado para desarrollo
            return;
        }

        // Cargar Google Analytics 4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', this.trackingId);

        this.initialized = true;
        console.log('✅ Google Analytics inicializado');
    }

    // Analytics simulado para desarrollo
    setupMockAnalytics() {
        console.log('🎯 Usando Analytics simulado para desarrollo');

        window.gtag = function (event, action, params) {
            console.log('📊 Evento Analytics:', { event, action, params });
        };

        this.initialized = true;
    }

    // Track eventos personalizados (MEJORADO)
    trackEvent(category, action, label, value = null) {
        const eventData = {
            'event_category': category,
            'event_label': label,
            'value': value
        };

        console.log('🎯 Track Event:', action, eventData);

        if (window.gtag) {
            gtag('event', action, eventData);
        }
    }

    // Track páginas vistas (MEJORADO)
    trackPageView(pageTitle, pageLocation) {
        console.log('📄 Page View:', pageTitle, pageLocation);

        if (window.gtag) {
            gtag('event', 'page_view', {
                'page_title': pageTitle,
                'page_location': pageLocation,
                'page_path': window.location.pathname
            });
        }
    }

    // Track conversiones de la calculadora
    trackCalculatorConversion(ahorroMensual, hectareas) {
        this.trackEvent('Calculadora', 'Conversion', `Ahorro: $${ahorroMensual}`, hectareas);

        // Track como conversión económica
        if (window.gtag) {
            gtag('event', 'purchase', {
                'currency': 'MXN',
                'value': ahorroMensual,
                'items': [{
                    'item_id': 'calculadora_ahorro',
                    'item_name': 'Ahorro Calculado',
                    'category': 'Agricultura',
                    'quantity': hectareas
                }]
            });
        }
    }

    // Track clicks en CTA (MEJORADO)
    trackCTAClick(ctaType, location) {
        this.trackEvent('CTA', 'Click', `${ctaType} - ${location}`);

        // Agregar delay para simular comportamiento real
        setTimeout(() => {
            if (window.gtag) {
                gtag('event', 'generate_lead', {
                    'method': ctaType,
                    'section': location
                });
            }
        }, 1000);
    }

    // NUEVO: Track scroll depth
    trackScrollDepth(depth) {
        this.trackEvent('Engagement', 'Scroll', `Scroll depth: ${depth}%`, depth);
    }

    // NUEVO: Track tiempo en página
    trackTimeOnPage(seconds) {
        this.trackEvent('Engagement', 'TimeSpent', `Tiempo en página: ${seconds}s`, seconds);
    }
}

// Inicializar analytics inmediatamente
const analytics = new Analytics();

// Track página actual al cargar
window.addEventListener('load', () => {
    analytics.trackPageView(document.title, window.location.href);

    // Track tiempo en página
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const seconds = Math.round((Date.now() - startTime) / 1000);
        analytics.trackTimeOnPage(seconds);
    });
});

// Track scroll depth
window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth % 25 === 0) { // Cada 25%
        analytics.trackScrollDepth(scrollDepth);
    }
});

// Exportar para uso global
window.InsectraXAnalytics = analytics;