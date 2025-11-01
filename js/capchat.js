class CustomCaptcha {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            difficulty: options.difficulty || 'medium', // easy, medium, hard
            type: options.type || 'checkbox', // checkbox, puzzle, math, drag
            autoRefresh: options.autoRefresh !== false,
            onSuccess: options.onSuccess || (() => {}),
            onError: options.onError || (() => {}),
            ...options
        };
        
        this.isVerified = false;
        this.attempts = 0;
        this.maxAttempts = 3;
        
        this.init();
    }

    init() {
        this.createCaptcha();
        this.setupEventListeners();
    }

    createCaptcha() {
        this.container.innerHTML = '';
        this.container.className = 'custom-captcha';

        switch (this.options.type) {
            case 'puzzle':
                this.createPuzzleCaptcha();
                break;
            case 'math':
                this.createMathCaptcha();
                break;
            case 'drag':
                this.createDragCaptcha();
                break;
            case 'checkbox':
            default:
                this.createCheckboxCaptcha();
                break;
        }

        // Agregar opción de refrescar
        if (this.options.autoRefresh) {
            this.addRefreshButton();
        }
    }

    createCheckboxCaptcha() {
        const captchaHTML = `
            <div class="captcha-checkbox">
                <label class="captcha-label">
                    <input type="checkbox" class="captcha-input">
                    <span class="captcha-box">
                        <span class="check-icon">✓</span>
                    </span>
                    <span class="captcha-text">No soy un robot</span>
                </label>
                <div class="captcha-challenge hidden">
                    <div class="challenge-content">
                        <div class="challenge-instruction">Completa la verificación:</div>
                        <div class="image-grid" id="imageGrid"></div>
                        <div class="challenge-feedback"></div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = captchaHTML;
        this.generateImageChallenge();
    }

    createPuzzleCaptcha() {
        const captchaHTML = `
            <div class="captcha-puzzle">
                <div class="puzzle-instruction">Arrastra la pieza al lugar correcto:</div>
                <div class="puzzle-container">
                    <div class="puzzle-image" id="puzzleImage"></div>
                    <div class="puzzle-target" id="puzzleTarget"></div>
                    <div class="puzzle-piece" id="puzzlePiece" draggable="true">🔲</div>
                </div>
                <div class="puzzle-feedback"></div>
            </div>
        `;

        this.container.innerHTML = captchaHTML;
        this.setupPuzzleChallenge();
    }

    createMathCaptcha() {
        const { question, answer } = this.generateMathQuestion();
        
        const captchaHTML = `
            <div class="captcha-math">
                <div class="math-instruction">Resuelve esta operación matemática:</div>
                <div class="math-question">${question} = ?</div>
                <div class="math-input-container">
                    <input type="number" class="math-input" placeholder="Ingresa el resultado">
                    <button class="math-submit">Verificar</button>
                </div>
                <div class="math-feedback"></div>
            </div>
        `;

        this.container.innerHTML = captchaHTML;
        this.correctAnswer = answer;
        this.setupMathChallenge();
    }

    createDragCaptcha() {
        const captchaHTML = `
            <div class="captcha-drag">
                <div class="drag-instruction">Arrastra el ícono al círculo:</div>
                <div class="drag-container">
                    <div class="drag-icon" draggable="true">🤖</div>
                    <div class="drag-target"></div>
                </div>
                <div class="drag-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="drag-feedback"></div>
            </div>
        `;

        this.container.innerHTML = captchaHTML;
        this.setupDragChallenge();
    }

    generateMathQuestion() {
        const operations = [
            { type: 'add', symbol: '+', generate: () => [this.getRandom(1, 10), this.getRandom(1, 10)] },
            { type: 'subtract', symbol: '-', generate: () => { const a = this.getRandom(5, 15); return [a, this.getRandom(1, a-1)]; } },
            { type: 'multiply', symbol: '×', generate: () => [this.getRandom(2, 6), this.getRandom(2, 6)] }
        ];

        const op = operations[this.getRandom(0, operations.length - 1)];
        const [a, b] = op.generate();
        
        let question, answer;
        
        switch (op.type) {
            case 'add':
                question = `${a} ${op.symbol} ${b}`;
                answer = a + b;
                break;
            case 'subtract':
                question = `${a} ${op.symbol} ${b}`;
                answer = a - b;
                break;
            case 'multiply':
                question = `${a} ${op.symbol} ${b}`;
                answer = a * b;
                break;
        }

        return { question, answer };
    }

    generateImageChallenge() {
        const categories = [
            { name: 'vehículos', items: ['🚗', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🏍️', '🚲', '🛴'] },
            { name: 'animales', items: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'] },
            { name: 'comida', items: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥'] },
            { name: 'deportes', items: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🎿'] }
        ];

        const targetCategory = categories[this.getRandom(0, categories.length - 1)];
        const targetItem = targetCategory.items[this.getRandom(0, targetCategory.items.length - 1)];
        
        this.correctAnswers = [targetItem];
        
        const imageGrid = document.getElementById('imageGrid');
        imageGrid.innerHTML = '';
        
        // Crear array con todos los ítems y mezclar
        let allItems = [...targetCategory.items];
        while (allItems.length < 9) {
            const otherCategory = categories[this.getRandom(0, categories.length - 1)];
            if (otherCategory !== targetCategory) {
                allItems.push(otherCategory.items[this.getRandom(0, otherCategory.items.length - 1)]);
            }
        }
        
        // Mezclar y tomar 9 elementos
        allItems = this.shuffleArray(allItems).slice(0, 9);
        
        // Asegurar que el target esté incluido
        if (!allItems.includes(targetItem)) {
            allItems[this.getRandom(0, 8)] = targetItem;
        }

        allItems.forEach((item, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `
                <div class="image-icon">${item}</div>
                <input type="checkbox" class="image-checkbox" value="${item}">
            `;
            imageGrid.appendChild(imageItem);
        });

        const instruction = document.querySelector('.challenge-instruction');
        instruction.textContent = `Selecciona todos los ${this.getCategoryName(targetItem)}:`;
    }

    getCategoryName(emoji) {
        const categories = {
            '🚗': 'vehículos', '🚙': 'vehículos', '🚌': 'vehículos', '🚎': 'vehículos', '🏎️': 'vehículos',
            '🚓': 'vehículos', '🚑': 'vehículos', '🚒': 'vehículos', '🚐': 'vehículos', '🚚': 'vehículos',
            '🚛': 'vehículos', '🚜': 'vehículos', '🏍️': 'vehículos', '🚲': 'vehículos', '🛴': 'vehículos',
            '🐶': 'animales', '🐱': 'animales', '🐭': 'animales', '🐹': 'animales', '🐰': 'animales',
            '🦊': 'animales', '🐻': 'animales', '🐼': 'animales', '🐨': 'animales', '🐯': 'animales',
            '🦁': 'animales', '🐮': 'animales', '🐷': 'animales', '🐸': 'animales', '🐵': 'animales',
            '🍎': 'frutas', '🍐': 'frutas', '🍊': 'frutas', '🍋': 'frutas', '🍌': 'frutas',
            '🍉': 'frutas', '🍇': 'frutas', '🍓': 'frutas', '🫐': 'frutas', '🍈': 'frutas',
            '🍒': 'frutas', '🍑': 'frutas', '🥭': 'frutas', '🍍': 'frutas', '🥥': 'frutas',
            '⚽': 'deportes', '🏀': 'deportes', '🏈': 'deportes', '⚾': 'deportes', '🎾': 'deportes',
            '🏐': 'deportes', '🏉': 'deportes', '🎱': 'deportes', '🏓': 'deportes', '🏸': 'deportes',
            '🏒': 'deportes', '🏑': 'deportes', '🥍': 'deportes', '🏏': 'deportes', '🎿': 'deportes'
        };
        
        return categories[emoji] || 'elementos';
    }

    setupPuzzleChallenge() {
        const piece = document.getElementById('puzzlePiece');
        const target = document.getElementById('puzzleTarget');

        // Posicionar el target en un lugar aleatorio
        const containerRect = this.container.getBoundingClientRect();
        const maxX = containerRect.width - 60;
        const maxY = containerRect.height - 60;
        
        const targetX = this.getRandom(50, maxX);
        const targetY = this.getRandom(50, maxY);
        
        target.style.left = `${targetX}px`;
        target.style.top = `${targetY}px`;

        let isDragging = false;
        let startX, startY;

        piece.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - piece.getBoundingClientRect().left;
            startY = e.clientY - piece.getBoundingClientRect().top;
            piece.style.opacity = '0.7';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - startX - this.container.getBoundingClientRect().left;
            const y = e.clientY - startY - this.container.getBoundingClientRect().top;
            
            piece.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            piece.style.top = `${Math.max(0, Math.min(y, maxY))}px`;

            // Verificar si está cerca del target
            const pieceRect = piece.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            const distance = Math.sqrt(
                Math.pow(pieceRect.left - targetRect.left, 2) + 
                Math.pow(pieceRect.top - targetRect.top, 2)
            );

            if (distance < 30) {
                target.classList.add('target-active');
            } else {
                target.classList.remove('target-active');
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            piece.style.opacity = '1';
            
            const pieceRect = piece.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            const distance = Math.sqrt(
                Math.pow(pieceRect.left - targetRect.left, 2) + 
                Math.pow(pieceRect.top - targetRect.top, 2)
            );

            if (distance < 30) {
                this.handleSuccess();
            }
        });
    }

    setupMathChallenge() {
        const submitBtn = document.querySelector('.math-submit');
        const input = document.querySelector('.math-input');
        const feedback = document.querySelector('.math-feedback');

        submitBtn.addEventListener('click', () => {
            const userAnswer = parseInt(input.value);
            
            if (isNaN(userAnswer)) {
                this.showFeedback(feedback, 'Por favor ingresa un número válido', 'error');
                return;
            }

            if (userAnswer === this.correctAnswer) {
                this.handleSuccess();
            } else {
                this.attempts++;
                this.showFeedback(feedback, 'Respuesta incorrecta. Intenta nuevamente.', 'error');
                
                if (this.attempts >= this.maxAttempts) {
                    this.refreshCaptcha();
                }
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }

    setupDragChallenge() {
        const icon = document.querySelector('.drag-icon');
        const target = document.querySelector('.drag-target');
        const progressFill = document.querySelector('.progress-fill');

        let isDragging = false;
        let progress = 0;

        icon.addEventListener('mousedown', () => {
            isDragging = true;
            icon.style.opacity = '0.7';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const containerRect = this.container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            const x = e.clientX - containerRect.left - 25;
            const y = e.clientY - containerRect.top - 25;
            
            icon.style.left = `${Math.max(0, Math.min(x, containerRect.width - 50))}px`;
            icon.style.top = `${Math.max(0, Math.min(y, containerRect.height - 50))}px`;

            // Calcular progreso basado en la distancia al target
            const iconRect = icon.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(iconRect.left - targetRect.left, 2) + 
                Math.pow(iconRect.top - targetRect.top, 2)
            );

            progress = Math.max(0, 100 - (distance / 3));
            progressFill.style.width = `${progress}%`;

            if (distance < 25) {
                target.classList.add('target-active');
                if (progress >= 95) {
                    this.handleSuccess();
                }
            } else {
                target.classList.remove('target-active');
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            icon.style.opacity = '1';
            
            if (progress < 95) {
                progress = 0;
                progressFill.style.width = '0%';
                this.showFeedback(document.querySelector('.drag-feedback'), 'Sigue intentando', 'error');
            }
        });
    }

    setupEventListeners() {
        // Para el captcha de checkbox
        const captchaInput = this.container.querySelector('.captcha-input');
        if (captchaInput) {
            captchaInput.addEventListener('change', (e) => {
                const challenge = this.container.querySelector('.captcha-challenge');
                if (e.target.checked) {
                    challenge.classList.remove('hidden');
                    this.generateImageChallenge();
                } else {
                    challenge.classList.add('hidden');
                    this.isVerified = false;
                }
            });
        }

        // Para el desafío de imágenes
        const imageGrid = this.container.querySelector('.image-grid');
        if (imageGrid) {
            imageGrid.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.validateImageChallenge();
                }
            });
        }
    }

    validateImageChallenge() {
        const selectedCheckboxes = this.container.querySelectorAll('.image-checkbox:checked');
        const selectedValues = Array.from(selectedCheckboxes).map(cb => cb.value);
        const feedback = this.container.querySelector('.challenge-feedback');

        // Verificar si se seleccionó el correcto
        const hasCorrect = this.correctAnswers.some(answer => selectedValues.includes(answer));
        const hasIncorrect = selectedValues.some(value => !this.correctAnswers.includes(value));

        if (hasCorrect && !hasIncorrect && selectedValues.length === this.correctAnswers.length) {
            this.handleSuccess();
        } else if (selectedValues.length > 0) {
            if (hasIncorrect) {
                this.showFeedback(feedback, 'Selección incorrecta', 'error');
                this.attempts++;
                
                if (this.attempts >= this.maxAttempts) {
                    this.refreshCaptcha();
                }
            } else if (selectedValues.length < this.correctAnswers.length) {
                this.showFeedback(feedback, 'Selecciona más elementos', 'info');
            } else {
                this.showFeedback(feedback, 'Demasiados elementos seleccionados', 'error');
            }
        } else {
            this.clearFeedback(feedback);
        }
    }

    handleSuccess() {
        this.isVerified = true;
        this.container.classList.add('captcha-success');
        
        // Mostrar animación de éxito
        this.showSuccessAnimation();
        
        // Ejecutar callback de éxito
        setTimeout(() => {
            this.options.onSuccess();
        }, 1000);
    }

    showSuccessAnimation() {
        const successElement = document.createElement('div');
        successElement.className = 'captcha-success-animation';
        successElement.innerHTML = '✅ Verificación completada';
        
        this.container.appendChild(successElement);
        
        setTimeout(() => {
            successElement.remove();
        }, 2000);
    }

    showFeedback(element, message, type) {
        element.textContent = message;
        element.className = `challenge-feedback feedback-${type}`;
        
        setTimeout(() => {
            this.clearFeedback(element);
        }, 3000);
    }

    clearFeedback(element) {
        element.textContent = '';
        element.className = 'challenge-feedback';
    }

    refreshCaptcha() {
        this.attempts = 0;
        this.isVerified = false;
        this.container.classList.remove('captcha-success');
        this.createCaptcha();
    }

    addRefreshButton() {
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'captcha-refresh';
        refreshBtn.innerHTML = '🔄';
        refreshBtn.title = 'Actualizar captcha';
        
        refreshBtn.addEventListener('click', () => {
            this.refreshCaptcha();
        });

        this.container.appendChild(refreshBtn);
    }

    // Utilidades
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Métodos públicos
    verify() {
        return this.isVerified;
    }

    reset() {
        this.refreshCaptcha();
    }
}

// CSS para el captcha (inyectarlo dinámicamente)
const captchaStyles = `
<style>
.custom-captcha {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    margin: 10px 0;
    backdrop-filter: blur(10px);
}

.captcha-success {
    border-color: #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

/* Checkbox Captcha */
.captcha-checkbox .captcha-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-weight: 600;
    color: #e0e0e0;
}

.captcha-input {
    display: none;
}

.captcha-box {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
}

.captcha-input:checked + .captcha-box {
    background: #ff0000;
    border-color: #ff0000;
}

.check-icon {
    color: white;
    font-size: 14px;
    font-weight: bold;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
}

.captcha-input:checked + .captcha-box .check-icon {
    opacity: 1;
    transform: scale(1);
}

.captcha-challenge {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.challenge-instruction {
    color: #b0b0b0;
    margin-bottom: 15px;
    font-size: 0.9rem;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.image-item {
    position: relative;
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid transparent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.image-item:hover {
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.image-item.selected {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.1);
}

.image-icon {
    font-size: 1.5rem;
}

.image-checkbox {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 16px;
    height: 16px;
    opacity: 0;
    cursor: pointer;
}

.image-checkbox:checked {
    opacity: 1;
}

.image-checkbox:checked::before {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 2px;
    color: #ff0000;
    font-weight: bold;
    font-size: 12px;
}

/* Puzzle Captcha */
.captcha-puzzle {
    text-align: center;
}

.puzzle-instruction {
    color: #b0b0b0;
    margin-bottom: 20px;
}

.puzzle-container {
    position: relative;
    height: 200px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 15px;
}

.puzzle-piece {
    position: absolute;
    width: 50px;
    height: 50px;
    background: #ff0000;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: move;
    transition: all 0.3s ease;
    z-index: 2;
}

.puzzle-target {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.puzzle-target.target-active {
    border-color: #00ff88;
    background: rgba(0, 255, 136, 0.1);
}

/* Math Captcha */
.captcha-math {
    text-align: center;
}

.math-instruction {
    color: #b0b0b0;
    margin-bottom: 10px;
}

.math-question {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 15px;
    color: #ff0000;
}

.math-input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.math-input {
    flex: 1;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    text-align: center;
}

.math-submit {
    padding: 10px 15px;
    background: #ff0000;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
}

.math-submit:hover {
    background: #ff3333;
}

/* Drag Captcha */
.captcha-drag {
    text-align: center;
}

.drag-instruction {
    color: #b0b0b0;
    margin-bottom: 20px;
}

.drag-container {
    position: relative;
    height: 150px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 15px;
}

.drag-icon {
    position: absolute;
    width: 50px;
    height: 50px;
    font-size: 2rem;
    cursor: move;
    transition: all 0.3s ease;
    z-index: 2;
}

.drag-target {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;
}

.drag-target.target-active {
    border-color: #00ff88;
    background: rgba(0, 255, 136, 0.1);
}

.drag-progress {
    margin-bottom: 15px;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #ff0000;
    width: 0%;
    transition: width 0.3s ease;
}

/* Feedback */
.challenge-feedback {
    font-size: 0.9rem;
    min-height: 20px;
    transition: all 0.3s ease;
}

.feedback-error {
    color: #ff4444;
}

.feedback-success {
    color: #00ff88;
}

.feedback-info {
    color: #ffa500;
}

/* Refresh Button */
.captcha-refresh {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #b0b0b0;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.captcha-refresh:hover {
    color: #ff0000;
    background: rgba(255, 255, 255, 0.1);
}

/* Success Animation */
.captcha-success-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 255, 136, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
    animation: fadeInOut 2s ease-in-out;
    z-index: 10;
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.hidden {
    display: none !important;
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', captchaStyles);

// Exportar para uso global
window.CustomCaptcha = CustomCaptcha;