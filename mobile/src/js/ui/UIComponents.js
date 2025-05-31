/**
 * UIComponents.js
 * Manages UI components and interactions
 */
class UIComponents {
    /**
     * Create UI components manager
     * @param {Game} game - Game instance
     */
    constructor(game) {
        this.game = game;
        
        // UI elements
        this.elements = {
            score: document.getElementById('score'),
            moves: document.getElementById('moves'),
            powerups: document.getElementById('powerups')
        };
        
        // Screen states
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            levelSelect: document.getElementById('level-select'),
            gameScreen: document.getElementById('game-screen'),
            pauseMenu: document.getElementById('pause-menu'),
            levelComplete: document.getElementById('level-complete'),
            settingsMenu: document.getElementById('settings-menu')
        };
        
        // Initialize
        this._init();
    }
    
    /**
     * Initialize UI components
     * @private
     */
    _init() {
        // Set up event listeners
        this._setupEventListeners();
        
        // Create powerup buttons
        this._createPowerupButtons();
    }
    
    /**
     * Set up event listeners
     * @private
     */
    _setupEventListeners() {
        // Main menu buttons
        document.getElementById('continue-game').addEventListener('click', () => {
            this.game.resumeGame();
            this.showScreen('gameScreen');
        });
        
        document.getElementById('new-game').addEventListener('click', () => {
            this.showLevelSelect();
        });
        
        document.getElementById('settings').addEventListener('click', () => {
            this.showSettings();
        });
        
        // Level select
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
        
        // Game screen
        document.getElementById('pause-button').addEventListener('click', () => {
            this.game.pauseGame();
            this.showScreen('pauseMenu');
        });
        
        // Pause menu
        document.getElementById('resume').addEventListener('click', () => {
            this.game.resumeFromPause();
            this.showScreen('gameScreen');
        });
        
        document.getElementById('restart').addEventListener('click', () => {
            this.game.restartLevel();
            this.showScreen('gameScreen');
        });
        
        document.getElementById('exit-to-menu').addEventListener('click', () => {
            this.game.endGame();
            this.showScreen('mainMenu');
        });
        
        // Level complete
        document.getElementById('next-level').addEventListener('click', () => {
            const nextLevel = this.game.state.currentLevel + 1;
            this.game.startLevel(nextLevel);
            this.showScreen('gameScreen');
        });
        
        document.getElementById('replay-level').addEventListener('click', () => {
            this.game.restartLevel();
            this.showScreen('gameScreen');
        });
        
        document.getElementById('level-exit').addEventListener('click', () => {
            this.game.endGame();
            this.showScreen('mainMenu');
        });
        
        // Settings menu
        document.getElementById('settings-close').addEventListener('click', () => {
            this.saveSettings();
            this.hideOverlay('settingsMenu');
        });
    }
    
    /**
     * Create powerup buttons
     * @private
     */
    _createPowerupButtons() {
        const powerupsContainer = this.elements.powerups;
        
        // Clear existing buttons
        powerupsContainer.innerHTML = '';
        
        // Create powerup buttons
        const powerups = [
            { id: 'extraMoves', icon: '+5', label: '额外步数' },
            { id: 'shuffle', icon: '🔄', label: '重新排列' },
            { id: 'colorBomb', icon: '💥', label: '颜色炸弹' }
        ];
        
        for (const powerup of powerups) {
            const button = document.createElement('div');
            button.className = 'powerup';
            button.dataset.powerup = powerup.id;
            button.innerHTML = `
                <div class="powerup-icon">${powerup.icon}</div>
                <div class="powerup-count">0</div>
            `;
            button.title = powerup.label;
            
            button.addEventListener('click', () => {
                this.usePowerup(powerup.id);
            });
            
            powerupsContainer.appendChild(button);
        }
    }
    
    /**
     * Update powerup counts
     */
    updatePowerupCounts() {
        const inventory = this.game.playerData.getInventory();
        
        // Update each powerup button
        const powerupButtons = document.querySelectorAll('.powerup');
        powerupButtons.forEach(button => {
            const powerupId = button.dataset.powerup;
            const countElement = button.querySelector('.powerup-count');
            
            if (countElement && inventory.powerups[powerupId] !== undefined) {
                countElement.textContent = inventory.powerups[powerupId];
                
                // Disable button if count is 0
                if (inventory.powerups[powerupId] <= 0) {
                    button.classList.add('disabled');
                } else {
                    button.classList.remove('disabled');
                }
            }
        });
    }
    
    /**
     * Use a powerup
     * @param {string} powerupId - Powerup identifier
     */
    usePowerup(powerupId) {
        // Check if game is active
        if (!this.game.state.isPlaying || this.game.state.isPaused) {
            return;
        }
        
        // Use powerup
        let params = {};
        
        if (powerupId === 'colorBomb') {
            // Show color selection dialog
            this.showColorSelectionDialog(selectedColor => {
                params.color = selectedColor;
                const success = this.game.usePowerup(powerupId, params);
                
                if (success) {
                    this.updatePowerupCounts();
                }
            });
        } else {
            const success = this.game.usePowerup(powerupId, params);
            
            if (success) {
                this.updatePowerupCounts();
            }
        }
    }
    
    /**
     * Show color selection dialog
     * @param {Function} callback - Callback function with selected color
     */
    showColorSelectionDialog(callback) {
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'color-selection-dialog';
        dialog.style.position = 'absolute';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#333333';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        dialog.style.zIndex = '200';
        
        // Add title
        const title = document.createElement('h3');
        title.textContent = '选择颜色';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        dialog.appendChild(title);
        
        // Add color buttons
        const colors = ['red', 'yellow', 'blue', 'green'];
        const colorNames = {
            red: '红色',
            yellow: '黄色',
            blue: '蓝色',
            green: '绿色'
        };
        
        const colorContainer = document.createElement('div');
        colorContainer.style.display = 'flex';
        colorContainer.style.justifyContent = 'space-around';
        colorContainer.style.marginBottom = '15px';
        
        for (const color of colors) {
            const colorButton = document.createElement('div');
            colorButton.className = 'color-button';
            colorButton.style.width = '50px';
            colorButton.style.height = '50px';
            colorButton.style.borderRadius = '50%';
            colorButton.style.cursor = 'pointer';
            colorButton.style.margin = '0 5px';
            
            // Set color
            switch (color) {
                case 'red': colorButton.style.backgroundColor = '#ff0000'; break;
                case 'yellow': colorButton.style.backgroundColor = '#ffcc00'; break;
                case 'blue': colorButton.style.backgroundColor = '#0099ff'; break;
                case 'green': colorButton.style.backgroundColor = '#00cc00'; break;
            }
            
            // Add label
            const label = document.createElement('div');
            label.textContent = colorNames[color];
            label.style.textAlign = 'center';
            label.style.marginTop = '5px';
            label.style.fontSize = '12px';
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'column';
            buttonContainer.style.alignItems = 'center';
            
            buttonContainer.appendChild(colorButton);
            buttonContainer.appendChild(label);
            
            colorContainer.appendChild(buttonContainer);
            
            // Add click event
            colorButton.addEventListener('click', () => {
                document.body.removeChild(dialog);
                callback(color);
            });
        }
        
        dialog.appendChild(colorContainer);
        
        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.width = '100%';
        cancelButton.style.padding = '10px';
        cancelButton.style.backgroundColor = '#555555';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.color = '#ffffff';
        cancelButton.style.cursor = 'pointer';
        
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        dialog.appendChild(cancelButton);
        
        // Add dialog to body
        document.body.appendChild(dialog);
    }
    
    /**
     * Show level select screen
     */
    showLevelSelect() {
        // Clear existing level buttons
        const levelsGrid = document.getElementById('levels-grid');
        levelsGrid.innerHTML = '';
        
        // Get player progress
        const progress = this.game.playerData.getProgress();
        
        // Create level buttons
        for (let i = 1; i <= 50; i++) {
            const levelButton = document.createElement('div');
            levelButton.className = 'level-button';
            
            if (i > progress.highestUnlockedLevel) {
                levelButton.classList.add('locked');
            } else {
                levelButton.addEventListener('click', () => {
                    this.game.startLevel(i);
                    this.showScreen('gameScreen');
                });
            }
            
            // Level number
            const levelNumber = document.createElement('div');
            levelNumber.textContent = i;
            levelButton.appendChild(levelNumber);
            
            // Stars
            const stars = this.game.playerData.getLevelStars(i);
            const starsContainer = document.createElement('div');
            starsContainer.className = 'level-stars';
            
            for (let s = 0; s < 3; s++) {
                const star = document.createElement('div');
                star.className = 'level-star';
                if (s < stars) {
                    star.classList.add('earned');
                }
                starsContainer.appendChild(star);
            }
            
            levelButton.appendChild(starsContainer);
            levelsGrid.appendChild(levelButton);
        }
        
        this.showScreen('levelSelect');
    }
    
    /**
     * Show settings screen
     */
    showSettings() {
        // Load current settings
        const settings = this.game.playerData.getSettings();
        
        document.getElementById('music-volume').value = settings.musicVolume * 100;
        document.getElementById('sfx-volume').value = settings.sfxVolume * 100;
        document.getElementById('vibration').checked = settings.vibration;
        document.getElementById('control-scheme').value = settings.controlScheme;
        document.getElementById('colorblind-mode').checked = settings.colorBlindMode;
        document.getElementById('reduced-motion').checked = settings.reducedMotion;
        
        this.showOverlay('settingsMenu');
    }
    
    /**
     * Save settings
     */
    saveSettings() {
        const settings = {
            musicVolume: document.getElementById('music-volume').value / 100,
            sfxVolume: document.getElementById('sfx-volume').value / 100,
            vibration: document.getElementById('vibration').checked,
            controlScheme: document.getElementById('control-scheme').value,
            colorBlindMode: document.getElementById('colorblind-mode').checked,
            reducedMotion: document.getElementById('reduced-motion').checked
        };
        
        // Update player settings
        this.game.playerData.updateSettings(settings);
        
        // Apply settings
        this.game.soundManager.setMusicVolume(settings.musicVolume);
        this.game.soundManager.setSfxVolume(settings.sfxVolume);
        this.game.touchController.setControlScheme(settings.controlScheme);
        
        // Apply colorblind mode
        if (settings.colorBlindMode) {
            document.body.classList.add('colorblind-mode');
        } else {
            document.body.classList.remove('colorblind-mode');
        }
        
        // Apply reduced motion
        if (settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    /**
     * Update score display
     * @param {number} score - Current score
     */
    updateScore(score) {
        if (this.elements.score) {
            this.elements.score.textContent = score;
        }
    }
    
    /**
     * Update moves display
     * @param {number} moves - Remaining moves
     */
    updateMoves(moves) {
        if (this.elements.moves) {
            this.elements.moves.textContent = moves;
            
            // Add warning class if low on moves
            if (moves <= 5) {
                this.elements.moves.parentElement.classList.add('low');
            } else {
                this.elements.moves.parentElement.classList.remove('low');
            }
        }
    }
    
    /**
     * Handle level complete
     * @param {Object} results - Level results
     */
    handleLevelComplete(results) {
        // Update level complete screen
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('remaining-moves').textContent = results.remainingMoves;
        
        // Update stars
        for (let i = 1; i <= 3; i++) {
            const star = document.getElementById(`star${i}`);
            if (i <= results.stars) {
                star.classList.add('earned');
            } else {
                star.classList.remove('earned');
            }
        }
        
        // Show level complete screen after a delay
        setTimeout(() => {
            this.showOverlay('levelComplete');
        }, 1000);
    }
    
    /**
     * Handle level failed
     * @param {Object} results - Level results
     */
    handleLevelFailed(results) {
        // Show game over message
        alert('游戏结束！\n\n你的分数: ' + results.score);
        
        // Return to main menu
        this.game.endGame();
        this.showScreen('mainMenu');
    }
    
    /**
     * Show a screen
     * @param {string} screenId - Screen identifier
     */
    showScreen(screenId) {
        // Hide all screens
        for (const id in this.screens) {
            this.screens[id].classList.add('hidden');
        }
        
        // Show the requested screen
        if (this.screens[screenId]) {
            this.screens[screenId].classList.remove('hidden');
        }
    }
    
    /**
     * Show an overlay
     * @param {string} overlayId - Overlay identifier
     */
    showOverlay(overlayId) {
        if (this.screens[overlayId]) {
            this.screens[overlayId].classList.remove('hidden');
        }
    }
    
    /**
     * Hide an overlay
     * @param {string} overlayId - Overlay identifier
     */
    hideOverlay(overlayId) {
        if (this.screens[overlayId]) {
            this.screens[overlayId].classList.add('hidden');
        }
    }
}
