// js/galeria.js
class Gallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.isOpen = false;
    }

    init() {
        this.setupGalleryItems();
        this.setupLightbox();
    }

    setupGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
            
            // Agregar loading lazy
            const img = item.querySelector('img');
            if (img) {
                img.loading = 'lazy';
                this.images.push({
                    src: img.src,
                    alt: img.alt,
                    element: img
                });
            }
        });
    }

    setupLightbox() {
        // Crear lightbox HTML
        const lightboxHTML = `
            <div class="lightbox" id="galleryLightbox">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">‹</button>
                <button class="lightbox-next">›</button>
                <div class="lightbox-content">
                    <img src="" alt="" id="lightboxImage">
                    <div class="lightbox-caption">
                        <span id="lightboxCaption"></span>
                        <span id="lightboxCounter"></span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.setupLightboxEvents();
    }

    setupLightboxEvents() {
        const lightbox = document.getElementById('galleryLightbox');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.prevImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.isOpen = true;
        const lightbox = document.getElementById('galleryLightbox');
        this.updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Track en Analytics
        if (window.InsectraXAnalytics) {
            InsectraXAnalytics.trackEvent('Galería', 'Abrir', `Imagen ${index + 1}`);
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('galleryLightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }

    updateLightboxImage() {
        const image = document.getElementById('lightboxImage');
        const caption = document.getElementById('lightboxCaption');
        const counter = document.getElementById('lightboxCounter');
        const currentImage = this.images[this.currentIndex];

        image.src = currentImage.src;
        image.alt = currentImage.alt;
        caption.textContent = currentImage.alt;
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
}

// Inicializar galería
const gallery = new Gallery();
window.InsectraXGallery = gallery;