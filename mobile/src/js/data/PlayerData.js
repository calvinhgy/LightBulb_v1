/**
 * PlayerData.js
 * Manages player progress, statistics, and game state
 */
class PlayerData {
    constructor(storageManager) {
        this.storageManager = storageManager;
        
        // Default player data structure
        this.defaultData = {
            // Player progress
            progress: {
                currentLevel: 1,
                highestUnlockedLevel: 1,
                totalScore: 0,
                totalStars: 0,
                completedLevels: {}
            },
            
            // Player inventory
            inventory: {
                powerups: {
                    extraMoves: 0,
                    extraTime: 0,
                    colorBomb: 0,
                    shuffle: 0
                },
                coins: 0
            },
            
            // Player statistics
            stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                totalMatches: 0,
                totalSpecialBulbsCreated: 0,
                totalSpecialBulbsUsed: 0,
                longestChain: 0,
                highestSingleScore: 0,
                playTime: 0
            },
            
            // Current game state (for resuming)
            currentGame: null,
            
            // Settings (player preferences)
            settings: {
                musicVolume: 0.7,
                sfxVolume: 0.8,
                vibration: true,
                controlScheme: 'swipe',
                colorBlindMode: false,
                reducedMotion: false
            },
            
            // Achievements
            achievements: {},
            
            // Last played timestamp
            lastPlayed: Date.now()
        };
        
        // Current player data
        this.data = JSON.parse(JSON.stringify(this.defaultData));
        
        // Load player data
        this.loaded = false;
    }
    
    /**
     * Initialize player data
     * @returns {Promise} Promise that resolves when data is loaded
     */
    initialize() {
        return new Promise((resolve) => {
            this.storageManager.loadData('lightbulb_player_data')
                .then(data => {
                    if (data) {
                        // Merge loaded data with default data structure
                        this._mergeData(data);
                    }
                    this.loaded = true;
                    resolve();
                })
                .catch(error => {
                    console.error('Failed to load player data:', error);
                    this.loaded = true;
                    resolve();
                });
        });
    }
    
    /**
     * Save player data
     * @returns {Promise} Promise that resolves when data is saved
     */
    saveData() {
        // Update last played timestamp
        this.data.lastPlayed = Date.now();
        
        return this.storageManager.saveData('lightbulb_player_data', this.data);
    }
    
    /**
     * Reset player data to defaults
     * @returns {Promise} Promise that resolves when data is reset
     */
    resetData() {
        this.data = JSON.parse(JSON.stringify(this.defaultData));
        return this.saveData();
    }
    
    /**
     * Get player progress
     * @returns {Object} Player progress data
     */
    getProgress() {
        return this.data.progress;
    }
    
    /**
     * Get player inventory
     * @returns {Object} Player inventory data
     */
    getInventory() {
        return this.data.inventory;
    }
    
    /**
     * Get player statistics
     * @returns {Object} Player statistics data
     */
    getStats() {
        return this.data.stats;
    }
    
    /**
     * Get player settings
     * @returns {Object} Player settings data
     */
    getSettings() {
        return this.data.settings;
    }
    
    /**
     * Update player settings
     * @param {Object} settings - New settings
     * @returns {Promise} Promise that resolves when settings are saved
     */
    updateSettings(settings) {
        Object.assign(this.data.settings, settings);
        return this.saveData();
    }
    
    /**
     * Get level data for a specific level
     * @param {number} levelId - Level ID
     * @returns {Object|null} Level data or null if not completed
     */
    getLevelData(levelId) {
        return this.data.progress.completedLevels[levelId] || null;
    }
    
    /**
     * Update level data after completion
     * @param {number} levelId - Level ID
     * @param {Object} levelData - Level completion data
     * @returns {Promise} Promise that resolves when data is saved
     */
    updateLevelData(levelId, levelData) {
        const { score, stars, moves } = levelData;
        
        // Get existing level data or create new
        const existingData = this.data.progress.completedLevels[levelId] || { 
            highScore: 0, 
            stars: 0, 
            plays: 0 
        };
        
        // Update level data
        existingData.plays++;
        existingData.lastPlayed = Date.now();
        
        // Update high score and stars if better than previous
        if (score > existingData.highScore) {
            existingData.highScore = score;
        }
        
        if (stars > existingData.stars) {
            // Add new stars to total
            this.data.progress.totalStars += (stars - existingData.stars);
            existingData.stars = stars;
        }
        
        // Save best moves (lower is better)
        if (!existingData.bestMoves || moves < existingData.bestMoves) {
            existingData.bestMoves = moves;
        }
        
        // Update completed levels
        this.data.progress.completedLevels[levelId] = existingData;
        
        // Update total score
        this.data.progress.totalScore += score;
        
        // Update current level if this was the current level
        if (levelId === this.data.progress.currentLevel) {
            this.data.progress.currentLevel = levelId + 1;
        }
        
        // Update highest unlocked level
        if (levelId + 1 > this.data.progress.highestUnlockedLevel) {
            this.data.progress.highestUnlockedLevel = levelId + 1;
        }
        
        // Update statistics
        this.data.stats.gamesPlayed++;
        this.data.stats.gamesWon++;
        
        if (score > this.data.stats.highestSingleScore) {
            this.data.stats.highestSingleScore = score;
        }
        
        return this.saveData();
    }
    
    /**
     * Save current game state for resuming later
     * @param {Object} gameState - Current game state
     * @returns {Promise} Promise that resolves when state is saved
     */
    saveGameState(gameState) {
        this.data.currentGame = gameState;
        return this.saveData();
    }
    
    /**
     * Get saved game state
     * @returns {Object|null} Saved game state or null
     */
    getSavedGameState() {
        return this.data.currentGame;
    }
    
    /**
     * Clear saved game state
     * @returns {Promise} Promise that resolves when state is cleared
     */
    clearGameState() {
        this.data.currentGame = null;
        return this.saveData();
    }
    
    /**
     * Update player statistics
     * @param {Object} stats - Statistics to update
     * @returns {Promise} Promise that resolves when stats are saved
     */
    updateStats(stats) {
        // Update each statistic
        for (const [key, value] of Object.entries(stats)) {
            if (this.data.stats[key] !== undefined) {
                if (typeof value === 'number' && typeof this.data.stats[key] === 'number') {
                    this.data.stats[key] += value;
                } else {
                    this.data.stats[key] = value;
                }
            }
        }
        
        return this.saveData();
    }
    
    /**
     * Add powerup to inventory
     * @param {string} powerupType - Type of powerup
     * @param {number} amount - Amount to add
     * @returns {Promise} Promise that resolves when inventory is updated
     */
    addPowerup(powerupType, amount = 1) {
        if (this.data.inventory.powerups[powerupType] !== undefined) {
            this.data.inventory.powerups[powerupType] += amount;
            return this.saveData();
        }
        return Promise.resolve();
    }
    
    /**
     * Use powerup from inventory
     * @param {string} powerupType - Type of powerup
     * @returns {boolean} True if powerup was used successfully
     */
    usePowerup(powerupType) {
        if (this.data.inventory.powerups[powerupType] > 0) {
            this.data.inventory.powerups[powerupType]--;
            this.saveData();
            return true;
        }
        return false;
    }
    
    /**
     * Add coins to inventory
     * @param {number} amount - Amount of coins to add
     * @returns {Promise} Promise that resolves when coins are added
     */
    addCoins(amount) {
        this.data.inventory.coins += amount;
        return this.saveData();
    }
    
    /**
     * Use coins from inventory
     * @param {number} amount - Amount of coins to use
     * @returns {boolean} True if coins were used successfully
     */
    useCoins(amount) {
        if (this.data.inventory.coins >= amount) {
            this.data.inventory.coins -= amount;
            this.saveData();
            return true;
        }
        return false;
    }
    
    /**
     * Check if a level is unlocked
     * @param {number} levelId - Level ID
     * @returns {boolean} True if level is unlocked
     */
    isLevelUnlocked(levelId) {
        return levelId <= this.data.progress.highestUnlockedLevel;
    }
    
    /**
     * Get number of stars earned for a level
     * @param {number} levelId - Level ID
     * @returns {number} Number of stars (0-3)
     */
    getLevelStars(levelId) {
        const levelData = this.data.progress.completedLevels[levelId];
        return levelData ? levelData.stars : 0;
    }
    
    /**
     * Merge loaded data with default structure
     * @param {Object} loadedData - Data loaded from storage
     * @private
     */
    _mergeData(loadedData) {
        // Helper function for deep merging
        const deepMerge = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        };
        
        // Merge loaded data into default structure
        deepMerge(this.data, loadedData);
    }
}
