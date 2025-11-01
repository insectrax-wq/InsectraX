class Robot3DViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.isRotating = true;
        this.rotationSpeed = 0.01;
        this.interactiveObjects = [];
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        
        this.init();
    }

    async init() {
        try {
            await this.loadThreeJS();
            await this.loadGLTFLoader();
            this.setupScene();
            await this.loadRobotModel();
            this.setupControls();
            this.animate();
            this.hideLoading();
        } catch (error) {
            this.showError();
        }
    }

    loadThreeJS() {
        return new Promise((resolve, reject) => {
            if (window.THREE) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('No se pudo cargar Three.js'));
            document.head.appendChild(script);
        });
    }

    loadGLTFLoader() {
        return new Promise((resolve, reject) => {
            if (THREE.GLTFLoader) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('No se pudo cargar GLTFLoader'));
            document.head.appendChild(script);
        });
    }

    setupScene() {
        const container = document.getElementById('robot3dContainer');
        
        if (!container) {
            throw new Error('No se encontró el contenedor robot3dContainer');
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);

        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        const canvas = document.getElementById('robot3dCanvas');
        if (!canvas) {
            throw new Error('No se encontró el canvas robot3dCanvas');
        }

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    async loadRobotModel() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            const modelPath = 'models/robot.glb';
            
            loader.load(
                modelPath,
                (gltf) => {
                    this.robot = gltf.scene;
                    this.setupModel();
                    this.scene.add(this.robot);
                    resolve();
                },
                (progress) => {
                    const percent = (progress.loaded / (progress.total || 1000000) * 100).toFixed(1);
                    const loadingText = document.querySelector('.loading-3d p');
                    if (loadingText) {
                        loadingText.textContent = `Cargando modelo 3D... ${percent}%`;
                    }
                },
                (error) => {
                    this.createBasicRobotModel();
                    resolve();
                }
            );
        });
    }

    setupModel() {
        this.robot.scale.set(1, 1, 1);
        this.robot.position.set(0, 0, 0);
        
        this.robot.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.5;
                }
                
                this.setupMeshInteractivity(child);
            }
        });
        
        const box = new THREE.Box3().setFromObject(this.robot);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        this.camera.position.z = maxDim * 2;
    }

    setupMeshInteractivity(mesh) {
        const name = mesh.name.toLowerCase();
        
        if (name.includes('solar') || name.includes('panel')) {
            mesh.userData = this.getComponentData('solar');
            this.interactiveObjects.push(mesh);
        } else if (name.includes('sensor') || name.includes('camera')) {
            mesh.userData = this.getComponentData('sensors');
            this.interactiveObjects.push(mesh);
        } else if (name.includes('application') || name.includes('spray')) {
            mesh.userData = this.getComponentData('application');
            this.interactiveObjects.push(mesh);
        } else if (name.includes('battery') || name.includes('power')) {
            mesh.userData = this.getComponentData('battery');
            this.interactiveObjects.push(mesh);
        } else if (name.includes('track') || name.includes('chassis')) {
            mesh.userData = this.getComponentData('chassis');
            this.interactiveObjects.push(mesh);
        }
        
        mesh.cursor = 'pointer';
    }

    getComponentData(type) {
        const components = {
            solar: {
                title: '☀️ Panel Solar Integrado',
                description: 'Sistema de energía renovable de 400W para operación continua.',
                features: [
                    'Potencia: 400W pico',
                    'Eficiencia: 22%',
                    'Carga completa: 6-8 horas',
                    'Batería backup: 48V 100Ah'
                ]
            },
            sensors: {
                title: '📡 Sensores Multiespectrales', 
                description: 'Tecnología avanzada para análisis de salud vegetal en tiempo real.',
                features: [
                    'Sensores: Multiespectral + NIR + RGB',
                    'Resolución: 12 MP',
                    'Análisis: NDVI, NDRE, OSAVI',
                    'Frecuencia: 5 escaneos/segundo'
                ]
            },
            application: {
                title: '💧 Sistema de Aplicación',
                description: 'Mecanismo de precisión para aplicación milimétrica de insumos.',
                features: [
                    'Precisión: ±2 cm',
                    'Capacidad: 20 litros',
                    'Ahorro: 40% en insumos',
                    'Control: Flujo variable'
                ]
            },
            camera: {
                title: '📷 Cámara con IA',
                description: 'Sistema de visión artificial para reconocimiento de plagas.',
                features: [
                    'Resolución: 4K UHD',
                    'IA: Reconocimiento de 50+ plagas',
                    'Procesamiento: Tiempo real',
                    'Conectividad: 5G/LTE'
                ]
            },
            battery: {
                title: '🔋 Sistema de Batería',
                description: 'Batería de litio de alta capacidad para operación extendida.',
                features: [
                    'Tipo: LiFePO4 48V',
                    'Capacidad: 100Ah (4.8 kWh)',
                    'Autonomía: 12 horas',
                    'Vida útil: 3,000+ ciclos'
                ]
            },
            chassis: {
                title: '🚜 Chasis Principal',
                description: 'Estructura robusta fabricada en aluminio aeronáutico.',
                features: [
                    'Material: Aluminio 6061',
                    'Protección: IP67',
                    'Peso: 25 kg',
                    'Dimensiones: 120x80x50 cm'
                ]
            }
        };
        
        return components[type] || components.solar;
    }

    createBasicRobotModel() {
        this.robot = new THREE.Group();

        const chassisGeometry = new THREE.BoxGeometry(2, 1, 1);
        const chassisMaterial = new THREE.MeshPhongMaterial({ color: 0x4a5568 });
        const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
        chassis.castShadow = true;
        this.robot.add(chassis);

        this.scene.add(this.robot);
    }

    setupControls() {
        const rotateBtn = document.getElementById('rotateAuto');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.isRotating = !this.isRotating;
                rotateBtn.textContent = this.isRotating ? '⏸️' : '▶️';
            });
        }

        const zoomIn = document.getElementById('zoomIn');
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                this.camera.position.z = Math.max(2, this.camera.position.z - 0.5);
            });
        }

        const zoomOut = document.getElementById('zoomOut');
        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                this.camera.position.z = Math.min(15, this.camera.position.z + 0.5);
            });
        }

        const resetBtn = document.getElementById('resetView');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.robot) {
                    this.robot.rotation.set(0, 0, 0);
                }
                this.camera.position.z = 5;
            });
        }

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const component = btn.dataset.component;
                this.showComponentInfo(component);
            });
        });

        const canvas = document.getElementById('robot3dCanvas');
        if (canvas) {
            canvas.addEventListener('click', (event) => this.onModelClick(event));
        }
    }

    onModelClick(event) {
        if (this.interactiveObjects.length === 0) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (!this.raycaster) {
            this.raycaster = new THREE.Raycaster();
        }
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData) {
                this.showComponentInfo(object.userData);
                this.highlightObject(object);
            }
        }
    }

    highlightObject(object) {
        this.interactiveObjects.forEach(obj => {
            if (obj.userData && obj !== object) {
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => {
                            if (mat.emissive) mat.emissive.setHex(0x000000);
                        });
                    } else if (obj.material.emissive) {
                        obj.material.emissive.setHex(0x000000);
                    }
                }
            }
        });
        
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => {
                    if (mat.emissive) mat.emissive.setHex(0x333333);
                });
            } else if (object.material.emissive) {
                object.material.emissive.setHex(0x333333);
            }
        }
    }

    showComponentInfo(data) {
        if (typeof data === 'string') {
            const components = {
                solar: this.getComponentData('solar'),
                sensors: this.getComponentData('sensors'),
                application: this.getComponentData('application'),
                camera: this.getComponentData('camera'),
                battery: this.getComponentData('battery'),
                chassis: this.getComponentData('chassis')
            };
            data = components[data] || components.solar;
        }
        
        document.getElementById('componentTitle').textContent = data.title;
        document.getElementById('componentDescription').textContent = data.description;
        
        const featureList = document.getElementById('featureList');
        featureList.innerHTML = data.features.map(feature => 
            `<div class="feature-item">${feature}</div>`
        ).join('');
    }

    hideLoading() {
        const loading = document.querySelector('.loading-3d');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError() {
        const loading = document.querySelector('.loading-3d');
        if (loading) {
            loading.innerHTML = '<p>❌ Error cargando el modelo 3D</p>';
        }
    }

    onWindowResize() {
        const container = document.getElementById('robot3dContainer');
        if (container && this.camera && this.renderer) {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.robot && this.isRotating) {
            this.robot.rotation.y += this.rotationSpeed;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

window.inicializarTour3D = function() {
    const tourSection = document.getElementById('tour-virtual');
    if (!tourSection) {
        return;
    }
    
    new Robot3DViewer();
};