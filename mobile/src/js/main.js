/**
 * main.js
 * Entry point for the LightBulb Mobile game
 */

// Main game instance
let game;

// UI elements
const screens = {
    loading: document.getElementById('loading-screen'),
    mainMenu: document.getElementById('main-menu'),
    levelSelect: document.getElementById('level-select'),
    gameScreen: document.getElementById('game-screen'),
    pauseMenu: document.getElementById('pause-menu'),
    levelComplete: document.getElementById('level-complete'),
    settingsMenu: document.getElementById('settings-menu'),
    tutorial: document.getElementById('tutorial')
};

// Preloader for assets
const preloader = new Preloader();

// Initialize the game
async function initGame() {
    // Show loading screen
    showScreen(screens.loading);
    
    // Load assets
    loadAssets();
    
    // Initialize game
    game = new Game();
    await game.initialize();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show main menu when loading is complete
    showScreen(screens.mainMenu);
    
    // Check for saved game
    const playerData = game.playerData;
    const savedGame = playerData.getSavedGameState();
    
    if (savedGame) {
        document.getElementById('continue-game').classList.remove('hidden');
    } else {
        document.getElementById('continue-game').classList.add('hidden');
    }
}

// Load game assets
function loadAssets() {
    // Add images to preloader
    preloader.addImage('bulb_red', 'src/assets/images/bulbs/bulb_red.png', 'critical');
    preloader.addImage('bulb_yellow', 'src/assets/images/bulbs/bulb_yellow.png', 'critical');
    preloader.addImage('bulb_blue', 'src/assets/images/bulbs/bulb_blue.png', 'critical');
    preloader.addImage('bulb_green', 'src/assets/images/bulbs/bulb_green.png', 'critical');
    
    preloader.addImage('bulb_red_selected', 'src/assets/images/bulbs/bulb_red_selected.png', 'critical');
    preloader.addImage('bulb_yellow_selected', 'src/assets/images/bulbs/bulb_yellow_selected.png', 'critical');
    preloader.addImage('bulb_blue_selected', 'src/assets/images/bulbs/bulb_blue_selected.png', 'critical');
    preloader.addImage('bulb_green_selected', 'src/assets/images/bulbs/bulb_green_selected.png', 'critical');
    
    preloader.addImage('bulb_red_line', 'src/assets/images/bulbs/bulb_red_line.png', 'critical');
    preloader.addImage('bulb_yellow_line', 'src/assets/images/bulbs/bulb_yellow_line.png', 'critical');
    preloader.addImage('bulb_blue_line', 'src/assets/images/bulbs/bulb_blue_line.png', 'critical');
    preloader.addImage('bulb_green_line', 'src/assets/images/bulbs/bulb_green_line.png', 'critical');
    
    preloader.addImage('bulb_red_bomb', 'src/assets/images/bulbs/bulb_red_bomb.png', 'critical');
    preloader.addImage('bulb_yellow_bomb', 'src/assets/images/bulbs/bulb_yellow_bomb.png', 'critical');
    preloader.addImage('bulb_blue_bomb', 'src/assets/images/bulbs/bulb_blue_bomb.png', 'critical');
    preloader.addImage('bulb_green_bomb', 'src/assets/images/bulbs/bulb_green_bomb.png', 'critical');
    
    preloader.addImage('bulb_rainbow', 'src/assets/images/bulbs/bulb_rainbow.png', 'critical');
    
    preloader.addImage('background', 'src/assets/images/background.jpg', 'critical');
    preloader.addImage('grid_cell', 'src/assets/images/grid_cell.png', 'critical');
    
    // Add audio to preloader
    preloader.addAudio('music_menu', 'src/assets/sounds/music_menu.mp3', 'secondary');
    preloader.addAudio('music_gameplay', 'src/assets/sounds/music_gameplay.mp3', 'secondary');
    
    preloader.addAudio('select', 'src/assets/sounds/select.mp3', 'critical');
    preloader.addAudio('swap', 'src/assets/sounds/swap.mp3', 'critical');
    preloader.addAudio('invalid', 'src/assets/sounds/invalid.mp3', 'critical');
    preloader.addAudio('match_3', 'src/assets/sounds/match_3.mp3', 'critical');
    preloader.addAudio('match_4', 'src/assets/sounds/match_4.mp3', 'critical');
    preloader.addAudio('match_5', 'src/assets/sounds/match_5.mp3', 'critical');
    preloader.addAudio('cascade', 'src/assets/sounds/cascade.mp3', 'critical');
    
    // Start loading
    preloader.startLoading(
        // Progress callback
        (percent) => {
            document.querySelector('.loading-progress').style.width = `${percent}%`;
            document.querySelector('.loading-text').textContent = `加载中... ${Math.floor(percent)}%`;
        },
        // Complete callback
        () => {
            console.log('Assets loaded successfully');
        },
        // Error callback
        (asset, error) => {
            console.error(`Failed to load asset: ${asset.id}`, error);
        }
    );
}

// Set up event listeners
function setupEventListeners() {
    // Main menu buttons
    document.getElementById('continue-game').addEventListener('click', () => {
        if (game.resumeGame()) {
            showScreen(screens.gameScreen);
        }
    });
    
    document.getElementById('new-game').addEventListener('click', () => {
        showLevelSelect();
    });
    
    document.getElementById('settings').addEventListener('click', () => {
        showSettings();
    });
    
    document.getElementById('tutorial').addEventListener('click', () => {
        showTutorial();
    });
    
    // Level select
    document.getElementById('back-to-menu').addEventListener('click', () => {
        showScreen(screens.mainMenu);
    });
    
    // Game screen
    document.getElementById('pause-button').addEventListener('click', () => {
        game.pauseGame();
        showScreen(screens.pauseMenu);
    });
    
    // Pause menu
    document.getElementById('resume').addEventListener('click', () => {
        game.resumeFromPause();
        showScreen(screens.gameScreen);
    });
    
    document.getElementById('restart').addEventListener('click', () => {
        game.restartLevel();
        showScreen(screens.gameScreen);
    });
    
    document.getElementById('exit-to-menu').addEventListener('click', () => {
        game.endGame();
        showScreen(screens.mainMenu);
    });
    
    // Level complete
    document.getElementById('next-level').addEventListener('click', () => {
        const nextLevel = game.state.currentLevel + 1;
        game.startLevel(nextLevel);
        showScreen(screens.gameScreen);
    });
    
    document.getElementById('replay-level').addEventListener('click', () => {
        game.restartLevel();
        showScreen(screens.gameScreen);
    });
    
    document.getElementById('level-exit').addEventListener('click', () => {
        game.endGame();
        showScreen(screens.mainMenu);
    });
    
    // Settings menu
    document.getElementById('settings-close').addEventListener('click', () => {
        saveSettings();
        hideOverlay(screens.settingsMenu);
    });
    
    // Set up game callbacks
    game.onScoreChanged = updateScore;
    game.onMovesChanged = updateMoves;
    game.onTimeChanged = updateTime;
    game.onLevelComplete = handleLevelComplete;
    game.onLevelFailed = handleLevelFailed;
    game.onGamePaused = () => {};
    game.onGameResumed = () => {};
}

// Show level select screen
function showLevelSelect() {
    // Clear existing level buttons
    const levelsGrid = document.getElementById('levels-grid');
    levelsGrid.innerHTML = '';
    
    // Get player progress
    const progress = game.playerData.getProgress();
    
    // Create level buttons
    for (let i = 1; i <= 50; i++) {
        const levelButton = document.createElement('div');
        levelButton.className = 'level-button';
        
        if (i > progress.highestUnlockedLevel) {
            levelButton.classList.add('locked');
        } else {
            levelButton.addEventListener('click', () => {
                game.startLevel(i);
                showScreen(screens.gameScreen);
            });
        }
        
        // Level number
        const levelNumber = document.createElement('div');
        levelNumber.textContent = i;
        levelButton.appendChild(levelNumber);
        
        // Stars
        const stars = game.playerData.getLevelStars(i);
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
    
    showScreen(screens.levelSelect);
}

// Show settings screen
function showSettings() {
    // Load current settings
    const settings = game.playerData.getSettings();
    
    document.getElementById('music-volume').value = settings.musicVolume * 100;
    document.getElementById('sfx-volume').value = settings.sfxVolume * 100;
    document.getElementById('vibration').checked = settings.vibration;
    document.getElementById('control-scheme').value = settings.controlScheme;
    document.getElementById('colorblind-mode').checked = settings.colorBlindMode;
    document.getElementById('reduced-motion').checked = settings.reducedMotion;
    
    showOverlay(screens.settingsMenu);
}

// Save settings
function saveSettings() {
    const settings = {
        musicVolume: document.getElementById('music-volume').value / 100,
        sfxVolume: document.getElementById('sfx-volume').value / 100,
        vibration: document.getElementById('vibration').checked,
        controlScheme: document.getElementById('control-scheme').value,
        colorBlindMode: document.getElementById('colorblind-mode').checked,
        reducedMotion: document.getElementById('reduced-motion').checked
    };
    
    // Update player settings
    game.playerData.updateSettings(settings);
    
    // Apply settings
    game.soundManager.setMusicVolume(settings.musicVolume);
    game.soundManager.setSfxVolume(settings.sfxVolume);
    game.touchController.setControlScheme(settings.controlScheme);
    
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

// Show tutorial
function showTutorial() {
    // Create tutorial content
    const tutorialContent = `
        <div class="overlay-content tutorial-content">
            <h2>游戏教程</h2>
            <div class="tutorial-step">
                <h3>基本玩法</h3>
                <p>交换相邻的灯泡，创建三个或更多相同颜色的匹配。</p>
                <div class="tutorial-image">
                    <img src="src/assets/images/tutorial/basic_match.png" alt="基本匹配">
                </div>
            </div>
            <div class="tutorial-step">
                <h3>特殊灯泡</h3>
                <p>匹配4个灯泡创建线型灯泡，匹配5个创建彩虹灯泡。</p>
                <div class="tutorial-image">
                    <img src="src/assets/images/tutorial/special_bulbs.png" alt="特殊灯泡">
                </div>
            </div>
            <button id="tutorial-close" class="menu-button">关闭</button>
        </div>
    `;
    
    screens.tutorial.innerHTML = tutorialContent;
    document.getElementById('tutorial-close').addEventListener('click', () => {
        hideOverlay(screens.tutorial);
    });
    
    showOverlay(screens.tutorial);
}

// Update score display
function updateScore(score) {
    document.getElementById('score').textContent = score;
}

// Update moves display
function updateMoves(moves) {
    document.getElementById('moves').textContent = moves;
}

// Update time display
function updateTime(time) {
    // Not implemented in this version
}

// Handle level complete
function handleLevelComplete(results) {
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
        showOverlay(screens.levelComplete);
    }, 1000);
}

// Handle level failed
function handleLevelFailed(results) {
    // Show game over message
    alert('游戏结束！\n\n你的分数: ' + results.score);
    
    // Return to main menu
    game.endGame();
    showScreen(screens.mainMenu);
}

// Show a screen
function showScreen(screen) {
    // Hide all screens
    Object.values(screens).forEach(s => {
        s.classList.add('hidden');
    });
    
    // Show the requested screen
    screen.classList.remove('hidden');
}

// Show an overlay
function showOverlay(overlay) {
    overlay.classList.remove('hidden');
}

// Hide an overlay
function hideOverlay(overlay) {
    overlay.classList.add('hidden');
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);
