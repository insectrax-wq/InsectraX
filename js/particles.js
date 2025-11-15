class ParticlesManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (typeof particlesJS === 'undefined') {
            this.loadParticlesJS().then(() => {
                this.initializeParticles();
            }).catch(error => {
                console.warn('ParticlesJS no pudo cargarse:', error);
                this.createFallbackParticles();
            });
        } else {
            this.initializeParticles();
        }
    }

    loadParticlesJS() {
        return new Promise((resolve, reject) => {
            if (typeof particlesJS !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
            script.integrity = 'sha256-+8dHDU4UvOXpzLM1vCg6kR5aJZ+J5y6h5qERJ0W7VU=';
            script.crossOrigin = 'anonymous';
            
            script.onload = () => {
                if (typeof particlesJS !== 'undefined') {
                    resolve();
                } else {
                    reject(new Error('ParticlesJS no se cargó correctamente'));
                }
            };
            
            script.onerror = () => reject(new Error('Error al cargar ParticlesJS'));
            
            document.head.appendChild(script);
        });
    }

    initializeParticles() {
        if (this.isInitialized) return;

        const container = document.getElementById('particles-js');
        if (!container) {
            console.warn('Contenedor de partículas no encontrado');
            return;
        }

        try {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 80, 
                        density: { 
                            enable: true, 
                            value_area: 1000 
                        } 
                    },
                    color: { 
                        value: "#ff0000" 
                    },
                    shape: { 
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#ff0000"
                        }
                    },
                    opacity: { 
                        value: 0.25, 
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: { 
                        value: 2.5, 
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 120,
                        color: "#ff0000",
                        opacity: 0.15,
                        width: 1.2
                    },
                    move: {
                        enable: true,
                        speed: 1.8,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "bounce",
                        bounce: true,
                        attract: {
                            enable: true,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { 
                            enable: true, 
                            mode: "repulse",
                            parallax: {
                                enable: true,
                                force: 30,
                                smooth: 10
                            }
                        },
                        onclick: { 
                            enable: true, 
                            mode: "push" 
                        },
                        resize: true
                    },
                    modes: {
                        repulse: {
                            distance: 100,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true,
                config_demo: {
                    hide_card: false,
                    background_color: "#000000",
                    background_image: "",
                    background_position: "50% 50%",
                    background_repeat: "no-repeat",
                    background_size: "cover"
                }
            });

            this.isInitialized = true;
            
            this.setupResizeHandler();
            this.enhanceParticlesContainer(container);
            
        } catch (error) {
            console.error('Error al inicializar partículas:', error);
            this.createFallbackParticles();
        }
    }

    setupResizeHandler() {
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                    window.pJSDom[0].pJS.fn.vendors.refresh();
                }
            }, 250);
        };

        window.addEventListener('resize', handleResize);
    }

    enhanceParticlesContainer(container) {
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '1';
        container.style.pointerEvents = 'none';
        
        const parent = container.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            parent.style.overflow = 'hidden';
        }
    }

    createFallbackParticles() {
        const container = document.getElementById('particles-js');
        if (!container) return;

        container.innerHTML = '';
        container.style.background = 'radial-gradient(circle at 20% 80%, rgba(255, 0, 3, 0.7) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.08) 0%, transparent 50%)';
        
        for (let i = 0; i < 30; i++) {
            this.createFallbackParticle(container);
        }
    }

    createFallbackParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'fallback-particle';
        
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 0, 0, ${opacity});
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            animation: floatFallbackParticle ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
    }

    destroy() {
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.fn.vendors.destroy();
        }
        this.isInitialized = false;
    }

    updateOptions(newOptions) {
        if (!this.isInitialized || !window.pJSDom || !window.pJSDom[0]) return;
        
        try {
            window.pJSDom[0].pJS.fn.particlesRefresh(newOptions);
        } catch (error) {
            console.error('Error al actualizar partículas:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new ParticlesManager();
    
    if (!document.querySelector('style#fallback-particles')) {
        const style = document.createElement('style');
        style.id = 'fallback-particles';
        style.textContent = `
            @keyframes floatFallbackParticle {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.1;
                }
                25% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.1);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(0.9);
                    opacity: 0.2;
                }
                75% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.05);
                    opacity: 0.25;
                }
            }
            
            .fallback-particle {
                will-change: transform, opacity;
            }
            
            #particles-js {
                transition: opacity 0.5s ease;
            }
            
            #particles-js.loading {
                opacity: 0.5;
            }
            
            #particles-js.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticlesManager;
}