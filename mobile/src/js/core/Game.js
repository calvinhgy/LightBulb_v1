/**
 * Game.js
 * Main game controller that coordinates all game components
 */
class Game {
    /**
     * Create a new game instance
     * @param {Object} config - Game configuration
     */
    constructor(config = {}) {
        // Configuration
        this.config = {
            // Default configuration
            gridSize: { width: 8, height: 10 },
            colors: ['red', 'yellow', 'blue', 'green'],
            matchMinLength: 3,
            fallSpeed: 10,
            swapDuration: 200,
            matchDelay: 200,
            cascadeDelay: 50,
            hintDelay: 5000,
            initialMoves: 30,
            ...config
        };
        
        // Game state
        this.state = {
            isPlaying: false,
            isPaused: false,
            isGameOver: false,
            isLevelComplete: false,
            currentLevel: 1,
            hintTimer: null,
            lastInteractionTime: 0
        };
        
        // Game components
        this.deviceDetector = null;
        this.storageManager = null;
        this.configManager = null;
        this.playerData = null;
        this.levelManager = null;
        this.board = null;
        this.scoreManager = null;
        this.renderer = null;
        this.touchController = null;
        this.soundManager = null;
        this.animationManager = null;
        
        // Event callbacks
        this.onScoreChanged = null;
        this.onMovesChanged = null;
        this.onTimeChanged = null;
        this.onLevelComplete = null;
        this.onLevelFailed = null;
        this.onGamePaused = null;
        this.onGameResumed = null;
        
        // Animation frame ID
        this.animationFrameId = null;
        
        // Last update timestamp
        this.lastUpdateTime = 0;
    }
    
    /**
     * Initialize the game
     * @returns {Promise} Promise that resolves when initialization is complete
     */
    initialize() {
        return new Promise(async (resolve) => {
            // Initialize device detector
            this.deviceDetector = new DeviceDetector();
            
            // Optimize configuration for device
            const deviceInfo = this.deviceDetector.getDeviceInfo();
            const recommendedSettings = this.deviceDetector.getRecommendedSettings();
            
            // Update grid size based on device
            this.config.gridSize = recommendedSettings.gridSize;
            
            // Initialize storage manager
            this.storageManager = new StorageManager();
            
            // Initialize config manager
            this.configManager = new ConfigManager();
            this.configManager.optimizeForDevice(deviceInfo);
            
            // Initialize player data
            this.playerData = new PlayerData(this.storageManager);
            await this.playerData.initialize();
            
            // Initialize level manager
            this.levelManager = new LevelManager(this.storageManager);
            await this.levelManager.initialize();
            
            // Initialize board
            this.board = new Board({
                gridSize: this.config.gridSize,
                colors: this.config.colors,
                matchMinLength: this.config.matchMinLength
            });
            
            // Set up board callbacks
            this.board.onMatch = this._handleMatch.bind(this);
            this.board.onCascade = this._handleCascade.bind(this);
            this.board.onSpecialCreated = this._handleSpecialCreated.bind(this);
            this.board.onSwap = this._handleSwap.bind(this);
            this.board.onInvalidSwap = this._handleInvalidSwap.bind(this);
            
            // Initialize score manager
            this.scoreManager = new ScoreManager(this.configManager.getSection('scoring'));
            
            // Initialize renderer
            this.renderer = new Renderer({
                gameBoard: document.getElementById('game-board'),
                gameBackground: document.getElementById('game-background'),
                gameEffects: document.getElementById('game-effects'),
                gridSize: this.config.gridSize
            });
            
            // Initialize touch controller
            this.touchController = new TouchController(
                document.getElementById('game-board-container'),
                this.configManager.getSection('controls')
            );
            
            // Set up touch controller callbacks
            this.touchController.onCellTap = this._handleCellTap.bind(this);
            this.touchController.onSwipe = this._handleSwipe.bind(this);
            
            // Set cell converter for touch controller
            this.touchController.setCellConverter((clientX, clientY) => {
                return this.renderer.screenToGridCoordinates(clientX, clientY);
            });
            
            // Initialize sound manager
            this.soundManager = new SoundManager(this.configManager.getSection('audio'));
            
            // Initialize animation manager
            this.animationManager = new AnimationManager(this.renderer);
            
            // Load player progress
            const progress = this.playerData.getProgress();
            this.state.currentLevel = progress.currentLevel;
            
            resolve();
        });
    }
    
    /**
     * Start a new game
     * @param {number} levelId - Level ID to start
     */
    async startLevel(levelId) {
        // Clear any existing game
        this._clearGame();
        
        // Load level data
        const levelData = await this.levelManager.getLevel(levelId);
        
        // Update grid size if different from current
        if (levelData.gridSize.width !== this.config.gridSize.width || 
            levelData.gridSize.height !== this.config.gridSize.height) {
            this.config.gridSize = levelData.gridSize;
            this.board = new Board({
                gridSize: this.config.gridSize,
                colors: levelData.colors || this.config.colors,
                matchMinLength: this.config.matchMinLength
            });
            
            // Re-set up board callbacks
            this.board.onMatch = this._handleMatch.bind(this);
            this.board.onCascade = this._handleCascade.bind(this);
            this.board.onSpecialCreated = this._handleSpecialCreated.bind(this);
            this.board.onSwap = this._handleSwap.bind(this);
            this.board.onInvalidSwap = this._handleInvalidSwap.bind(this);
            
            // Update renderer grid size
            this.renderer.setGridSize(this.config.gridSize);
        }
        
        // Initialize score manager for this level
        this.scoreManager.initializeLevel(levelData);
        
        // Initialize the board
        if (levelData.initialBoard) {
            this.board.loadBoard(levelData.initialBoard);
        } else {
            this.board.fillGrid(true);
        }
        
        // Update game state
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.isGameOver = false;
        this.state.isLevelComplete = false;
        this.state.currentLevel = levelId;
        this.state.lastInteractionTime = Date.now();
        
        // Start game loop
        this._startGameLoop();
        
        // Play background music
        this.soundManager.playMusic('gameplay');
        
        // Save current game state
        this._saveGameState();
    }
    
    /**
     * Resume a saved game
     * @returns {boolean} True if game was resumed, false if no saved game
     */
    resumeGame() {
        const savedGame = this.playerData.getSavedGameState();
        
        if (!savedGame) {
            return false;
        }
        
        // Clear any existing game
        this._clearGame();
        
        // Restore game state
        this.state = savedGame.state;
        
        // Restore board
        this.board.deserialize(savedGame.board);
        
        // Restore score manager
        Object.assign(this.scoreManager, savedGame.scoreManager);
        
        // Start game loop
        this._startGameLoop();
        
        // Play background music
        this.soundManager.playMusic('gameplay');
        
        return true;
    }
    
    /**
     * Pause the game
     */
    pauseGame() {
        if (!this.state.isPlaying || this.state.isPaused) {
            return;
        }
        
        this.state.isPaused = true;
        
        // Stop game loop
        this._stopGameLoop();
        
        // Pause music
        this.soundManager.pauseMusic();
        
        // Save game state
        this._saveGameState();
        
        // Notify listeners
        if (this.onGamePaused) {
            this.onGamePaused();
        }
    }
    
    /**
     * Resume the game from pause
     */
    resumeFromPause() {
        if (!this.state.isPlaying || !this.state.isPaused) {
            return;
        }
        
        this.state.isPaused = false;
        
        // Start game loop
        this._startGameLoop();
        
        // Resume music
        this.soundManager.resumeMusic();
        
        // Notify listeners
        if (this.onGameResumed) {
            this.onGameResumed();
        }
    }
    
    /**
     * End the current game
     */
    endGame() {
        // Stop game loop
        this._stopGameLoop();
        
        // Stop music
        this.soundManager.stopMusic();
        
        // Clear game state
        this.state.isPlaying = false;
        this.state.isPaused = false;
        
        // Clear saved game
        this.playerData.clearGameState();
    }
    
    /**
     * Restart the current level
     */
    restartLevel() {
        this.startLevel(this.state.currentLevel);
    }
    
    /**
     * Show a hint
     */
    showHint() {
        if (!this.state.isPlaying || this.state.isPaused) {
            return;
        }
        
        const hint = this.board.matchDetector.findHint(this.board.grid, this.board.gridSize);
        
        if (hint) {
            this.animationManager.showHint(hint.bulb1, hint.bulb2);
            this.soundManager.playSound('hint');
        } else {
            // No possible moves - shuffle the board
            this.board.shuffleBoard();
            this.soundManager.playSound('shuffle');
        }
    }
    
    /**
     * Use a powerup
     * @param {string} powerupType - Type of powerup to use
     * @param {Object} params - Powerup parameters
     * @returns {boolean} True if powerup was used successfully
     */
    usePowerup(powerupType, params = {}) {
        if (!this.state.isPlaying || this.state.isPaused) {
            return false;
        }
        
        // Check if player has this powerup
        if (!this.playerData.usePowerup(powerupType)) {
            return false;
        }
        
        // Apply powerup effect
        switch (powerupType) {
            case 'extraMoves':
                this.scoreManager.addExtraMoves(5);
                this.soundManager.playSound('powerup');
                
                if (this.onMovesChanged) {
                    this.onMovesChanged(this.scoreManager.remainingMoves);
                }
                break;
                
            case 'extraTime':
                this.scoreManager.addExtraTime(30);
                this.soundManager.playSound('powerup');
                
                if (this.onTimeChanged) {
                    this.onTimeChanged(this.scoreManager.getRemainingTime());
                }
                break;
                
            case 'colorBomb':
                // Find all bulbs of the selected color and remove them
                const color = params.color || this.config.colors[0];
                const affectedBulbs = [];
                
                for (let y = 0; y < this.board.gridSize.height; y++) {
                    for (let x = 0; x < this.board.gridSize.width; x++) {
                        const bulb = this.board.getBulbAt(x, y);
                        if (bulb && bulb.color === color) {
                            bulb.match();
                            this.board.grid[y][x] = null;
                            affectedBulbs.push(bulb);
                        }
                    }
                }
                
                if (affectedBulbs.length > 0) {
                    this.soundManager.playSound('powerup');
                    this._handleMatch(affectedBulbs, 0, 'powerup');
                }
                break;
                
            case 'shuffle':
                this.board.shuffleBoard();
                this.soundManager.playSound('shuffle');
                break;
                
            default:
                return false;
        }
        
        return true;
    }
    
    /**
     * Update the game state
     * @param {number} timestamp - Current timestamp
     * @private
     */
    _update(timestamp) {
        if (!this.state.isPlaying || this.state.isPaused) {
            return;
        }
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastUpdateTime;
        this.lastUpdateTime = timestamp;
        
        // Update time-based game elements
        if (this.scoreManager.timeLimit > 0) {
            const timeRemaining = this.scoreManager.updateTime(deltaTime / 1000);
            
            // Notify time change
            if (this.onTimeChanged) {
                this.onTimeChanged(this.scoreManager.getRemainingTime());
            }
            
            // Check for time out
            if (!timeRemaining && !this.state.isGameOver) {
                this._handleGameOver();
            }
        }
        
        // Update board animations
        let boardChanged = false;
        for (let y = 0; y < this.board.gridSize.height; y++) {
            for (let x = 0; x < this.board.gridSize.width; x++) {
                const bulb = this.board.getBulbAt(x, y);
                if (bulb) {
                    const changed = bulb.update(deltaTime);
                    boardChanged = boardChanged || changed;
                }
            }
        }
        
        // Update renderer if board changed
        if (boardChanged) {
            this.renderer.render(this.board.grid);
        }
        
        // Check for hint timer
        if (this.config.hintDelay > 0 && 
            Date.now() - this.state.lastInteractionTime > this.config.hintDelay) {
            this.showHint();
            this.state.lastInteractionTime = Date.now(); // Reset timer
        }
        
        // Check for level completion
        if (!this.state.isLevelComplete && this.scoreManager.checkLevelComplete()) {
            this._handleLevelComplete();
        }
        
        // Check for level failure
        if (!this.state.isGameOver && !this.state.isLevelComplete && this.scoreManager.checkLevelFailed()) {
            this._handleGameOver();
        }
    }
    
    /**
     * Start the game loop
     * @private
     */
    _startGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.lastUpdateTime = performance.now();
        
        const gameLoop = (timestamp) => {
            this._update(timestamp);
            this.animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        this.animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    /**
     * Stop the game loop
     * @private
     */
    _stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Clear the current game
     * @private
     */
    _clearGame() {
        // Stop game loop
        this._stopGameLoop();
        
        // Clear hint timer
        if (this.state.hintTimer) {
            clearTimeout(this.state.hintTimer);
            this.state.hintTimer = null;
        }
        
        // Reset game state
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.isGameOver = false;
        this.state.isLevelComplete = false;
        
        // Reset board
        if (this.board) {
            this.board.resetGrid();
        }
        
        // Reset score manager
        if (this.scoreManager) {
            this.scoreManager.reset();
        }
    }
    
    /**
     * Save the current game state
     * @private
     */
    _saveGameState() {
        if (!this.state.isPlaying) {
            return;
        }
        
        const gameState = {
            state: { ...this.state },
            board: this.board.serialize(),
            scoreManager: { ...this.scoreManager }
        };
        
        this.playerData.saveGameState(gameState);
    }
    
    /**
     * Handle cell tap event
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @private
     */
    _handleCellTap(x, y) {
        if (!this.state.isPlaying || this.state.isPaused) {
            return;
        }
        
        // Update last interaction time
        this.state.lastInteractionTime = Date.now();
        
        // Select bulb
        const changed = this.board.selectBulbAt(x, y);
        
        if (changed) {
            this.soundManager.playSound('select');
            this.renderer.render(this.board.grid);
        }
    }
    
    /**
     * Handle swipe event
     * @param {number} x - Starting grid X coordinate
     * @param {number} y - Starting grid Y coordinate
     * @param {string} direction - Swipe direction ('up', 'down', 'left', 'right')
     * @private
     */
    _handleSwipe(x, y, direction) {
        if (!this.state.isPlaying || this.state.isPaused) {
            return;
        }
        
        // Update last interaction time
        this.state.lastInteractionTime = Date.now();
        
        // Get starting bulb
        const startBulb = this.board.getBulbAt(x, y);
        if (!startBulb || !startBulb.canSwap()) {
            return;
        }
        
        // Get target coordinates based on direction
        let targetX = x;
        let targetY = y;
        
        switch (direction) {
            case 'up':
                targetY--;
                break;
            case 'down':
                targetY++;
                break;
            case 'left':
                targetX--;
                break;
            case 'right':
                targetX++;
                break;
        }
        
        // Get target bulb
        const targetBulb = this.board.getBulbAt(targetX, targetY);
        if (!targetBulb || !targetBulb.canSwap()) {
            return;
        }
        
        // Swap bulbs
        this.board.swapBulbs(startBulb, targetBulb);
        
        // Use a move
        this.scoreManager.useMove();
        
        // Update moves display
        if (this.onMovesChanged) {
            this.onMovesChanged(this.scoreManager.remainingMoves);
        }
    }
    
    /**
     * Handle match event
     * @param {Array<LightBulb>} match - Array of matched bulbs
     * @param {number} cascadeLevel - Current cascade level
     * @param {string} specialType - Type of special bulb activation
     * @private
     */
    _handleMatch(match, cascadeLevel = 0, specialType = null) {
        // Update score
        const matchScore = this.scoreManager.updateScoreForMatch(match, cascadeLevel, specialType);
        
        // Play match sound
        if (specialType) {
            this.soundManager.playSound(`special_${specialType}`);
        } else {
            const soundType = match.length >= 5 ? 'match_5' : 
                             match.length >= 4 ? 'match_4' : 'match_3';
            this.soundManager.playSound(soundType);
        }
        
        // Show score popup
        this.animationManager.showScorePopup(match, matchScore);
        
        // Show match animation
        this.animationManager.showMatchAnimation(match);
        
        // Update score display
        if (this.onScoreChanged) {
            this.onScoreChanged(this.scoreManager.score);
        }
        
        // Trigger haptic feedback
        if (cascadeLevel === 0) {
            this.deviceDetector.triggerHapticFeedback('medium');
        } else {
            this.deviceDetector.triggerHapticFeedback('heavy');
        }
        
        // Save game state
        this._saveGameState();
    }
    
    /**
     * Handle cascade event
     * @param {number} cascadeLevel - Current cascade level
     * @private
     */
    _handleCascade(cascadeLevel) {
        // Play cascade sound with increasing pitch
        this.soundManager.playSound('cascade', { pitch: 1 + cascadeLevel * 0.1 });
        
        // Trigger haptic feedback
        this.deviceDetector.triggerHapticFeedback('medium');
    }
    
    /**
     * Handle special bulb creation
     * @param {LightBulb} bulb - Created special bulb
     * @param {string} specialType - Type of special bulb
     * @private
     */
    _handleSpecialCreated(bulb, specialType) {
        // Update score manager
        this.scoreManager.updateSpecialBulbCreated(bulb, specialType);
        
        // Play special creation sound
        this.soundManager.playSound(`create_${specialType}`);
        
        // Show special creation animation
        this.animationManager.showSpecialCreationAnimation(bulb, specialType);
        
        // Trigger haptic feedback
        this.deviceDetector.triggerHapticFeedback('heavy');
    }
    
    /**
     * Handle swap event
     * @param {LightBulb} bulb1 - First bulb
     * @param {LightBulb} bulb2 - Second bulb
     * @private
     */
    _handleSwap(bulb1, bulb2) {
        // Play swap sound
        this.soundManager.playSound('swap');
        
        // Trigger haptic feedback
        this.deviceDetector.triggerHapticFeedback('light');
    }
    
    /**
     * Handle invalid swap event
     * @param {LightBulb} bulb1 - First bulb
     * @param {LightBulb} bulb2 - Second bulb
     * @private
     */
    _handleInvalidSwap(bulb1, bulb2) {
        // Play invalid swap sound
        this.soundManager.playSound('invalid');
        
        // Show invalid swap animation
        this.animationManager.showInvalidSwapAnimation(bulb1, bulb2);
        
        // Trigger haptic feedback
        this.deviceDetector.triggerHapticFeedback('error');
    }
    
    /**
     * Handle level complete
     * @private
     */
    _handleLevelComplete() {
        this.state.isLevelComplete = true;
        
        // Add bonus points for remaining moves
        const bonusPoints = this.scoreManager.addRemainingMovesBonus();
        
        // Play level complete sound
        this.soundManager.playSound('level_complete');
        
        // Show level complete animation
        this.animationManager.showLevelCompleteAnimation();
        
        // Trigger haptic feedback
        this.deviceDetector.triggerHapticFeedback('success');
        
        // Update player data
        const levelResults = this.scoreManager.getLevelResults();
        this.playerData.updateLevelData(this.state.currentLevel, {
            score: levelResults.score,
            stars: levelResults.stars,
            moves: levelResults.moves
        });
        
        // Update player statistics
        this.playerData.updateStats({
            gamesPlayed: 1,
            gamesWon: 1,
            totalMatches: levelResults.moves,
            totalSpecialBulbsCreated: levelResults.specialBulbsCreated,
            totalSpecialBulbsUsed: levelResults.specialBulbsUsed,
            longestChain: Math.max(levelResults.longestChain, 0),
            playTime: levelResults.timeElapsed
        });
        
        // Clear saved game state
        this.playerData.clearGameState();
        
        // Notify listeners
        if (this.onLevelComplete) {
            this.onLevelComplete(levelResults);
        }
    }
    
    /**
     * Handle game over
     * @private
     */
    _handleGameOver() {
        this.state.isGameOver = true;
        
        // Play game over sound
        this.soundManager.playSound('game_over');
        
        // Show game over animation
        this.animationManager.showGameOverAnimation();
        
        // Trigger haptic feedback
        this.deviceDetector.triggerHapticFeedback('error');
        
        // Update player statistics
        const levelResults = this.scoreManager.getLevelResults();
        this.playerData.updateStats({
            gamesPlayed: 1,
            gamesWon: 0,
            totalMatches: levelResults.moves,
            totalSpecialBulbsCreated: levelResults.specialBulbsCreated,
            totalSpecialBulbsUsed: levelResults.specialBulbsUsed,
            longestChain: Math.max(levelResults.longestChain, 0),
            playTime: levelResults.timeElapsed
        });
        
        // Clear saved game state
        this.playerData.clearGameState();
        
        // Notify listeners
        if (this.onLevelFailed) {
            this.onLevelFailed(levelResults);
        }
    }
}
