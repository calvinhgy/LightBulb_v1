/**
 * Game class for managing game state and logic
 */
class Game {
    /**
     * Create a new game instance
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     */
    constructor(canvas) {
        console.log('Initializing Game class...');
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Game state
        this.state = 'menu'; // menu, playing, paused, levelComplete, gameOver
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 60; // seconds
        this.timerActive = false;
        this.timerInterval = null;
        
        // Level settings - Using 8x8 grid for better visibility
        this.levelSettings = {
            1: { rows: 8, cols: 8, timeLimit: 120, scoreTarget: 2000 },
            2: { rows: 8, cols: 8, timeLimit: 120, scoreTarget: 4000 },
            3: { rows: 9, cols: 9, timeLimit: 150, scoreTarget: 6000 },
            4: { rows: 9, cols: 9, timeLimit: 150, scoreTarget: 8000 },
            5: { rows: 10, cols: 10, timeLimit: 180, scoreTarget: 10000 }
        };
        
        // Calculate bulb size based on canvas size and level
        this.calculateBulbSize();
        
        // Create game board
        const settings = this.levelSettings[this.level];
        this.board = new Board(settings.rows, settings.cols, this.bulbSize);
        
        // Set game instance reference in board
        this.board.setGameInstance(this);
        
        // Input handling
        this.lastClickTime = 0;
        this.setupEventListeners();
        
        // Animation
        this.lastFrameTime = 0;
        this.animationFrameId = null;
        
        console.log('Game class initialized successfully');
        console.log(`Canvas size: ${this.canvas.width}x${this.canvas.height}`);
        console.log(`Board size: ${settings.rows}x${settings.cols}`);
        console.log(`Bulb size: ${this.bulbSize}px`);
        console.log(`Board offset: ${this.boardOffsetX}, ${this.boardOffsetY}`);
    }
    
    /**
     * Calculate bulb size based on canvas size and current level
     */
    calculateBulbSize() {
        const settings = this.levelSettings[this.level];
        
        // Make sure canvas dimensions are valid
        if (!this.canvas.width || !this.canvas.height) {
            console.error('Canvas dimensions are invalid:', this.canvas.width, this.canvas.height);
            // Set default size if canvas dimensions are invalid
            this.canvas.width = 640;
            this.canvas.height = 640;
        }
        
        const maxBulbWidth = this.canvas.width / settings.cols;
        const maxBulbHeight = this.canvas.height / settings.rows;
        this.bulbSize = Math.floor(Math.min(maxBulbWidth, maxBulbHeight));
        
        // Ensure minimum bulb size for visibility
        this.bulbSize = Math.max(this.bulbSize, 20);
        
        // Center the board on the canvas
        this.boardOffsetX = Math.floor((this.canvas.width - settings.cols * this.bulbSize) / 2);
        this.boardOffsetY = Math.floor((this.canvas.height - settings.rows * this.bulbSize) / 2);
        
        console.log(`Calculated bulb size: ${this.bulbSize}px`);
    }
    
    /**
     * Start a new game
     */
    startGame() {
        console.log('Starting game...');
        
        // Hide main menu and show game screen
        if (typeof UI !== 'undefined') {
            UI.showScreen('game-screen');
        } else {
            document.getElementById('main-menu').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
        }
        
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        
        // Set up level
        this.setupLevel();
        
        // Start game loop
        this.lastFrameTime = performance.now();
        this.gameLoop();
        
        // Start timer
        this.startTimer();
        
        // Update UI
        if (typeof UI !== 'undefined') {
            UI.updateScore(this.score);
            UI.updateLevel(this.level);
            UI.updateTime(this.timeRemaining);
        } else {
            document.getElementById('score-value').textContent = this.score;
            document.getElementById('level-value').textContent = this.level;
            document.getElementById('time-value').textContent = this.timeRemaining;
        }
        
        console.log('Game started successfully');
        
        // Force an immediate render to ensure the board is visible
        this.render();
    }
    
    /**
     * Start the game timer
     */
    startTimer() {
        clearInterval(this.timerInterval);
        this.timerActive = true;
        
        this.timerInterval = setInterval(() => {
            if (this.state === 'playing') {
                this.timeRemaining--;
                
                // Update UI
                if (typeof UI !== 'undefined') {
                    UI.updateTime(this.timeRemaining);
                } else {
                    document.getElementById('time-value').textContent = this.timeRemaining;
                }
                
                // Check for time up
                if (this.timeRemaining <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }
    
    /**
     * Pause the game
     */
    pauseGame() {
        if (this.state !== 'playing') return;
        
        console.log('Pausing game');
        this.state = 'paused';
        this.timerActive = false;
        
        // Show pause screen
        if (typeof UI !== 'undefined') {
            UI.showScreen('pause-screen');
        } else {
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('pause-screen').classList.remove('hidden');
        }
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Resume the game
     */
    resumeGame() {
        if (this.state !== 'paused') return;
        
        console.log('Resuming game');
        this.state = 'playing';
        this.timerActive = true;
        
        // Show game screen
        if (typeof UI !== 'undefined') {
            UI.showScreen('game-screen');
        } else {
            document.getElementById('pause-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
        }
        
        // Restart game loop
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
    
    /**
     * End the current game
     */
    endGame() {
        console.log('Game over');
        this.state = 'gameOver';
        this.timerActive = false;
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Clear timer interval
        clearInterval(this.timerInterval);
        
        // Show game over screen
        if (typeof UI !== 'undefined') {
            UI.showGameOver(this.score);
        } else {
            document.getElementById('game-over-score').textContent = this.score;
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('game-over-screen').classList.remove('hidden');
        }
    }
    
    /**
     * Advance to the next level
     */
    nextLevel() {
        this.level++;
        
        // Check if there are more levels
        if (this.level > Object.keys(this.levelSettings).length) {
            // Game completed
            if (typeof UI !== 'undefined') {
                UI.showGameOver(this.score, true);
            } else {
                const gameOverTitle = document.querySelector('#game-over-screen h2');
                gameOverTitle.textContent = 'Game Complete!';
                document.getElementById('game-over-score').textContent = this.score;
                document.getElementById('game-screen').classList.add('hidden');
                document.getElementById('game-over-screen').classList.remove('hidden');
            }
            return;
        }
        
        // Set up the next level
        this.setupLevel();
        
        // Update UI
        if (typeof UI !== 'undefined') {
            UI.updateLevel(this.level);
            UI.showScreen('game-screen');
        } else {
            document.getElementById('level-value').textContent = this.level;
            document.getElementById('level-complete-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
        }
        
        // Start timer
        this.startTimer();
        
        // Resume game loop
        this.state = 'playing';
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
    
    /**
     * Set up the current level
     */
    setupLevel() {
        const settings = this.levelSettings[this.level];
        
        // Update time remaining
        this.timeRemaining = settings.timeLimit;
        
        // Calculate bulb size and create new board
        this.calculateBulbSize();
        this.board = new Board(settings.rows, settings.cols, this.bulbSize);
        this.board.setGameInstance(this);
        
        // Update UI
        if (typeof UI !== 'undefined') {
            UI.updateTime(this.timeRemaining);
        } else {
            document.getElementById('time-value').textContent = this.timeRemaining;
        }
    }
    
    /**
     * Check if level is complete
     */
    checkLevelComplete() {
        const settings = this.levelSettings[this.level];
        
        // Only complete level if score target is reached AND minimum play time of 2 minutes has passed
        const minimumPlayTime = 120; // 2 minutes in seconds
        const elapsedTime = settings.timeLimit - this.timeRemaining;
        
        if (this.score >= settings.scoreTarget && (elapsedTime >= minimumPlayTime || this.timeRemaining <= 0)) {
            console.log('Level complete!');
            this.state = 'levelComplete';
            this.timerActive = false;
            
            // Cancel animation frame
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            // Clear timer interval
            clearInterval(this.timerInterval);
            
            // Calculate stars based on score and time
            const scoreRatio = this.score / settings.scoreTarget;
            let stars = 1;
            
            if (scoreRatio >= 1.5) {
                stars = 3;
            } else if (scoreRatio >= 1.2) {
                stars = 2;
            }
            
            // Show level complete screen
            if (typeof UI !== 'undefined') {
                UI.showLevelComplete(this.score, stars);
            } else {
                // Update stars
                const starElements = [
                    document.getElementById('star1'),
                    document.getElementById('star2'),
                    document.getElementById('star3')
                ];
                
                for (let i = 0; i < starElements.length; i++) {
                    if (i < stars) {
                        starElements[i].classList.add('filled');
                    } else {
                        starElements[i].classList.remove('filled');
                    }
                }
                
                document.getElementById('final-score').textContent = this.score;
                document.getElementById('game-screen').classList.add('hidden');
                document.getElementById('level-complete-screen').classList.remove('hidden');
            }
        }
    }
    
    /**
     * Render the game
     */
    render() {
        if (!this.ctx || !this.canvas) {
            console.error('Canvas context or canvas is not available');
            return;
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.board) {
            console.error('Board is not initialized');
            return;
        }
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1A1A2E');
        gradient.addColorStop(1, '#16213E');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set transform to center the board
        this.ctx.save();
        this.ctx.translate(this.boardOffsetX, this.boardOffsetY);
        
        // Draw board background
        this.ctx.fillStyle = 'rgba(42, 42, 78, 0.8)';
        this.ctx.fillRect(0, 0, this.board.cols * this.bulbSize, this.board.rows * this.bulbSize);
        
        // Draw subtle border around board
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.board.cols * this.bulbSize, this.board.rows * this.bulbSize);
        
        // Render board
        this.board.render(this.ctx);
        
        // Restore transform
        this.ctx.restore();
    }
    
    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp
     */
    gameLoop(timestamp = 0) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Update game state
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Schedule next frame
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * Update game state
     * @param {number} deltaTime - Time since last update in ms
     */
    update(deltaTime) {
        // Check if level is complete
        this.checkLevelComplete();
        
        // Update board animations
        if (this.board) {
            this.board.updateAnimations(deltaTime);
        }
    }
    
    /**
     * Set up event listeners for user input
     */
    setupEventListeners() {
        // Mouse/touch event variables
        this.isDragging = false;
        this.dragStartBulb = null;
        
        // Add mouse/touch event listeners for drag and drop
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Add event listeners for game controls if UI is not available
        if (typeof UI === 'undefined') {
            document.getElementById('pause-button').addEventListener('click', () => this.pauseGame());
            document.getElementById('resume-button').addEventListener('click', () => this.resumeGame());
            document.getElementById('restart-button').addEventListener('click', () => this.startGame());
            document.getElementById('next-level-button').addEventListener('click', () => this.nextLevel());
            document.getElementById('try-again-button').addEventListener('click', () => this.startGame());
            
            // Menu buttons
            const menuButtons = [
                'menu-button',
                'level-menu-button',
                'game-over-menu-button'
            ];
            
            menuButtons.forEach(id => {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', () => {
                        document.getElementById('pause-screen').classList.add('hidden');
                        document.getElementById('game-screen').classList.add('hidden');
                        document.getElementById('level-complete-screen').classList.add('hidden');
                        document.getElementById('game-over-screen').classList.add('hidden');
                        document.getElementById('main-menu').classList.remove('hidden');
                    });
                }
            });
        }
    }
    
    /**
     * Handle mouse down events
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseDown(event) {
        if (this.state !== 'playing') return;
        
        // Get click position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - this.boardOffsetX;
        const y = event.clientY - rect.top - this.boardOffsetY;
        
        // Select bulb at position
        const bulb = this.board.getBulbAtCoordinates(x, y);
        if (bulb) {
            this.isDragging = true;
            this.dragStartBulb = bulb;
            this.board.selectBulb(bulb);
            
            // Play selection sound
            if (typeof Sound !== 'undefined') {
                Sound.play('select');
            }
        }
    }
    
    /**
     * Handle mouse move events
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
        if (!this.isDragging || this.state !== 'playing') return;
        
        // Get current position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - this.boardOffsetX;
        const y = event.clientY - rect.top - this.boardOffsetY;
        
        // Check if we've moved to an adjacent bulb
        const currentBulb = this.board.getBulbAtCoordinates(x, y);
        if (currentBulb && currentBulb !== this.dragStartBulb) {
            // Check if the bulbs are adjacent
            if (Utils.areAdjacent(this.dragStartBulb, currentBulb)) {
                // Swap bulbs
                this.board.swapBulbs(this.dragStartBulb, currentBulb);
                
                // Play swap sound
                if (typeof Sound !== 'undefined') {
                    Sound.play('swap');
                }
                
                // End dragging
                this.isDragging = false;
                this.dragStartBulb = null;
            }
        }
    }
    
    /**
     * Handle mouse up events
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseUp(event) {
        this.isDragging = false;
        this.dragStartBulb = null;
    }
    
    /**
     * Handle touch start events
     * @param {TouchEvent} event - Touch event
     */
    handleTouchStart(event) {
        event.preventDefault();
        if (this.state !== 'playing') return;
        
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left - this.boardOffsetX;
        const y = touch.clientY - rect.top - this.boardOffsetY;
        
        const bulb = this.board.getBulbAtCoordinates(x, y);
        if (bulb) {
            this.isDragging = true;
            this.dragStartBulb = bulb;
            this.board.selectBulb(bulb);
            
            // Play selection sound
            if (typeof Sound !== 'undefined') {
                Sound.play('select');
            }
        }
    }
    
    /**
     * Handle touch move events
     * @param {TouchEvent} event - Touch event
     */
    handleTouchMove(event) {
        event.preventDefault();
        if (!this.isDragging || this.state !== 'playing') return;
        
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left - this.boardOffsetX;
        const y = touch.clientY - rect.top - this.boardOffsetY;
        
        const currentBulb = this.board.getBulbAtCoordinates(x, y);
        if (currentBulb && currentBulb !== this.dragStartBulb) {
            if (Utils.areAdjacent(this.dragStartBulb, currentBulb)) {
                this.board.swapBulbs(this.dragStartBulb, currentBulb);
                
                // Play swap sound
                if (typeof Sound !== 'undefined') {
                    Sound.play('swap');
                }
                
                this.isDragging = false;
                this.dragStartBulb = null;
            }
        }
    }
    
    /**
     * Handle touch end events
     * @param {TouchEvent} event - Touch event
     */
    handleTouchEnd(event) {
        this.isDragging = false;
        this.dragStartBulb = null;
    }
    
    /**
     * Add score from matches
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.score += points;
        if (typeof UI !== 'undefined') {
            UI.updateScore(this.score);
        } else {
            document.getElementById('score-value').textContent = this.score;
        }
        console.log(`Score added: ${points}, Total score: ${this.score}`);
    }
}
