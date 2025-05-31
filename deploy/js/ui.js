/**
 * UI class for managing game user interface
 */
const UI = {
    /**
     * Initialize UI elements and event listeners
     * @param {Game} game - Game instance
     */
    init: function(game) {
        console.log('Initializing UI...');
        this.game = game;
        
        // Cache DOM elements
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            gameScreen: document.getElementById('game-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            levelCompleteScreen: document.getElementById('level-complete-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            settingsScreen: document.getElementById('settings-screen'),
            highScoresScreen: document.getElementById('high-scores-screen')
        };
        
        this.elements = {
            scoreValue: document.getElementById('score-value'),
            levelValue: document.getElementById('level-value'),
            timeValue: document.getElementById('time-value'),
            finalScore: document.getElementById('final-score'),
            gameOverScore: document.getElementById('game-over-score'),
            stars: [
                document.getElementById('star1'),
                document.getElementById('star2'),
                document.getElementById('star3')
            ]
        };
        
        // Set up button event listeners
        document.getElementById('play-button').addEventListener('click', () => {
            console.log('Play button clicked');
            this.game.startGame();
        });
        
        document.getElementById('pause-button').addEventListener('click', () => {
            console.log('Pause button clicked');
            this.game.pauseGame();
        });
        
        document.getElementById('resume-button').addEventListener('click', () => {
            console.log('Resume button clicked');
            this.game.resumeGame();
        });
        
        document.getElementById('restart-button').addEventListener('click', () => {
            console.log('Restart button clicked');
            this.hideAllScreens();
            this.game.startGame();
        });
        
        document.getElementById('menu-button').addEventListener('click', () => {
            console.log('Menu button clicked');
            this.showScreen('main-menu');
        });
        
        document.getElementById('next-level-button').addEventListener('click', () => {
            console.log('Next level button clicked');
            this.game.nextLevel();
        });
        
        document.getElementById('level-menu-button').addEventListener('click', () => {
            console.log('Level menu button clicked');
            this.showScreen('main-menu');
        });
        
        document.getElementById('try-again-button').addEventListener('click', () => {
            console.log('Try again button clicked');
            this.hideAllScreens();
            this.game.startGame();
        });
        
        document.getElementById('game-over-menu-button').addEventListener('click', () => {
            console.log('Game over menu button clicked');
            this.showScreen('main-menu');
        });
        
        document.getElementById('settings-button').addEventListener('click', () => {
            console.log('Settings button clicked');
            this.showScreen('settings-screen');
        });
        
        document.getElementById('settings-save').addEventListener('click', () => {
            console.log('Settings save button clicked');
            this.showScreen('main-menu');
        });
        
        document.getElementById('high-scores-button').addEventListener('click', () => {
            console.log('High scores button clicked');
            this.showScreen('high-scores-screen');
        });
        
        document.getElementById('scores-back').addEventListener('click', () => {
            console.log('Scores back button clicked');
            this.showScreen('main-menu');
        });
        
        // Show main menu initially
        this.showScreen('main-menu');
        console.log('UI initialized successfully');
    },
    
    /**
     * Hide all screens
     */
    hideAllScreens: function() {
        for (const screen of Object.values(this.screens)) {
            screen.classList.add('hidden');
        }
    },
    
    /**
     * Show a specific screen
     * @param {string} screenId - ID of the screen to show
     */
    showScreen: function(screenId) {
        console.log(`Showing screen: ${screenId}`);
        this.hideAllScreens();
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
    },
    
    /**
     * Update the score display
     * @param {number} score - Current score
     */
    updateScore: function(score) {
        this.elements.scoreValue.textContent = Utils.formatNumber(score);
    },
    
    /**
     * Update the level display
     * @param {number} level - Current level
     */
    updateLevel: function(level) {
        this.elements.levelValue.textContent = level;
    },
    
    /**
     * Update the time display
     * @param {number} seconds - Time remaining in seconds
     */
    updateTime: function(seconds) {
        this.elements.timeValue.textContent = Utils.formatTime(seconds);
        
        // Add warning class when time is low
        if (seconds <= 10) {
            this.elements.timeValue.classList.add('warning');
        } else {
            this.elements.timeValue.classList.remove('warning');
        }
    },
    
    /**
     * Show the level complete screen
     * @param {number} score - Final score
     * @param {number} stars - Number of stars earned (1-3)
     */
    showLevelComplete: function(score, stars) {
        // Update score
        this.elements.finalScore.textContent = Utils.formatNumber(score);
        
        // Update stars
        for (let i = 0; i < this.elements.stars.length; i++) {
            if (i < stars) {
                this.elements.stars[i].classList.add('filled');
            } else {
                this.elements.stars[i].classList.remove('filled');
            }
        }
        
        // Show screen
        this.showScreen('level-complete-screen');
    },
    
    /**
     * Show the game over screen
     * @param {number} score - Final score
     * @param {boolean} completed - Whether the game was completed (all levels)
     */
    showGameOver: function(score, completed = false) {
        // Update score
        this.elements.gameOverScore.textContent = Utils.formatNumber(score);
        
        // Update title if game was completed
        const gameOverTitle = document.querySelector('#game-over-screen h2');
        if (completed) {
            gameOverTitle.textContent = 'Game Complete!';
        } else {
            gameOverTitle.textContent = 'Game Over';
        }
        
        // Show screen
        this.showScreen('game-over-screen');
    }
};

console.log('UI module loaded');