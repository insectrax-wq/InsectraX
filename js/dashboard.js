class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupMobileMenu();
        this.updateUserInterface();
    }

    async loadUserData() {
        try {
            const response = await fetch('get_user_data.php');
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
            } else {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            window.location.href = 'login.html';
        }
    }

    updateUserInterface() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('userRole').textContent = this.currentUser.carrera;
            document.getElementById('userInstitucion').textContent = this.currentUser.institucion;
            document.getElementById('userCarrera').textContent = this.currentUser.carrera;
            
            const initials = this.getInitials(this.currentUser.name);
            document.getElementById('userAvatar').textContent = initials;
            document.getElementById('userAvatarSm').textContent = initials;
            
            document.getElementById('welcomeTitle').textContent = `¡Hola, ${this.currentUser.name.split(' ')[0]}! 👋`;
            document.getElementById('sectionSubtitle').textContent = `Bienvenido de vuelta, ${this.currentUser.name.split(' ')[0]}! 👋`;
        }
    }

    getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    }

    setupEventListeners() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavClick(e);
            });
        });

        document.getElementById('btnLogout').addEventListener('click', () => {
            this.handleLogout();
        });

        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e);
            });
        }

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleNavClick(e) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const section = e.currentTarget.getAttribute('data-section');
        this.updateMainContent(section);
    }

    updateMainContent(section) {
        const titles = {
            'dashboard': ['Dashboard Principal', 'Panel de control principal'],
            'miembros': ['Gestión de Miembros', 'Administra los miembros del equipo'],
            'proyectos': ['Proyectos Activos', 'Seguimiento y gestión de proyectos'],
            'calendario': ['Calendario de Eventos', 'Programa y organiza tus actividades'],
            'chat': ['Chat del Equipo', 'Comunícate con los miembros'],
            'configuracion': ['Configuración', 'Personaliza tu experiencia']
        };
        
        if (titles[section]) {
            document.getElementById('sectionTitle').textContent = titles[section][0];
            document.getElementById('sectionSubtitle').textContent = titles[section][1];
        }
    }

    async handleLogout() {
        try {
            await fetch('logout.php');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            window.location.href = 'login.html';
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            console.log('Buscando:', searchTerm);
        }
    }

    loadDashboardData() {
        setTimeout(() => {
            this.animateStats();
        }, 500);
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-info h3');
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            stat.textContent = '0';
            
            let current = 0;
            const increment = parseInt(finalValue) / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= parseInt(finalValue)) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        });
    }

    setupMobileMenu() {
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: #ff0000;
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
        `;
        
        document.body.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.transform = sidebar.style.transform === 'translateX(0px)' ? 
                'translateX(-100%)' : 'translateX(0px)';
        });

        this.handleResize();
    }

    handleResize() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (window.innerWidth <= 480) {
            menuToggle.style.display = 'flex';
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            menuToggle.style.display = 'none';
            sidebar.style.transform = 'translateX(0)';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});