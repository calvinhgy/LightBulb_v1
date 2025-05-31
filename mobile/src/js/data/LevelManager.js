/**
 * LevelManager.js
 * Manages level data, generation, and loading
 */
class LevelManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        
        // Level data cache
        this.levels = {};
        
        // Level types
        this.levelTypes = {
            STANDARD: 'standard',   // Reach score target with limited moves
            TIMED: 'timed',         // Reach score target with time limit
            COLLECTION: 'collection', // Collect specific colored bulbs
            OBSTACLE: 'obstacle',   // Clear obstacles by matching adjacent bulbs
            BOSS: 'boss'            // Special levels with unique mechanics
        };
        
        // Default level template
        this.defaultLevel = {
            id: 0,
            type: this.levelTypes.STANDARD,
            gridSize: { width: 8, height: 10 },
            moves: 30,
            timeLimit: null,
            scoreTarget: {
                oneStarScore: 1000,
                twoStarScore: 2000,
                threeStarScore: 3000
            },
            colors: ['red', 'yellow', 'blue', 'green'],
            objectives: [],
            obstacles: [],
            specialBulbs: [],
            initialBoard: null, // If null, generate random board
            allowedSpecials: ['line', 'bomb', 'rainbow'],
            tutorial: null
        };
    }
    
    /**
     * Initialize level manager
     * @returns {Promise} Promise that resolves when initialization is complete
     */
    initialize() {
        return new Promise((resolve) => {
            // Try to load level data from storage first
            this.storageManager.loadData('lightbulb_levels')
                .then(data => {
                    if (data) {
                        this.levels = data;
                        resolve();
                    } else {
                        // If no stored data, generate default levels
                        this._generateDefaultLevels()
                            .then(() => resolve());
                    }
                })
                .catch(error => {
                    console.error('Failed to load level data:', error);
                    // Generate default levels if loading fails
                    this._generateDefaultLevels()
                        .then(() => resolve());
                });
        });
    }
    
    /**
     * Get level data by ID
     * @param {number} levelId - Level ID
     * @returns {Promise<Object>} Promise that resolves with level data
     */
    getLevel(levelId) {
        return new Promise((resolve, reject) => {
            // Check if level exists in cache
            if (this.levels[levelId]) {
                resolve(this.levels[levelId]);
                return;
            }
            
            // Try to load level from storage
            this.storageManager.loadData(`lightbulb_level_${levelId}`)
                .then(levelData => {
                    if (levelData) {
                        // Cache the level data
                        this.levels[levelId] = levelData;
                        resolve(levelData);
                    } else {
                        // Generate level if it doesn't exist
                        const generatedLevel = this._generateLevel(levelId);
                        this.levels[levelId] = generatedLevel;
                        
                        // Save generated level
                        this.storageManager.saveData(`lightbulb_level_${levelId}`, generatedLevel)
                            .then(() => resolve(generatedLevel))
                            .catch(error => {
                                console.error(`Failed to save generated level ${levelId}:`, error);
                                resolve(generatedLevel);
                            });
                    }
                })
                .catch(error => {
                    console.error(`Failed to load level ${levelId}:`, error);
                    reject(error);
                });
        });
    }
    
    /**
     * Get total number of levels
     * @returns {number} Total number of levels
     */
    getTotalLevels() {
        return Object.keys(this.levels).length;
    }
    
    /**
     * Get level summary data for all levels
     * @returns {Promise<Array>} Promise that resolves with array of level summaries
     */
    getLevelSummaries() {
        return new Promise((resolve) => {
            const summaries = [];
            
            // Get all level IDs
            const levelIds = Object.keys(this.levels).map(id => parseInt(id));
            
            // Sort level IDs numerically
            levelIds.sort((a, b) => a - b);
            
            // Create summary for each level
            for (const levelId of levelIds) {
                const level = this.levels[levelId];
                summaries.push({
                    id: level.id,
                    type: level.type,
                    scoreTarget: level.scoreTarget,
                    moves: level.moves,
                    timeLimit: level.timeLimit
                });
            }
            
            resolve(summaries);
        });
    }
    
    /**
     * Create a custom level
     * @param {Object} levelData - Custom level data
     * @returns {Promise<Object>} Promise that resolves with created level
     */
    createCustomLevel(levelData) {
        return new Promise((resolve, reject) => {
            // Generate a unique ID for the custom level
            const customId = 10000 + Object.keys(this.levels).length;
            
            // Merge with default level template
            const newLevel = { ...this.defaultLevel, ...levelData, id: customId };
            
            // Save the custom level
            this.levels[customId] = newLevel;
            
            this.storageManager.saveData(`lightbulb_level_${customId}`, newLevel)
                .then(() => {
                    // Update level index
                    return this.storageManager.saveData('lightbulb_levels', this.levels);
                })
                .then(() => resolve(newLevel))
                .catch(error => {
                    console.error('Failed to save custom level:', error);
                    reject(error);
                });
        });
    }
    
    /**
     * Generate a random board for a level
     * @param {Object} levelData - Level data
     * @returns {Array<Array>} 2D array representing the board
     */
    generateRandomBoard(levelData) {
        const { gridSize, colors } = levelData;
        const board = [];
        
        // Create empty board
        for (let y = 0; y < gridSize.height; y++) {
            board[y] = [];
            for (let x = 0; x < gridSize.width; x++) {
                board[y][x] = null;
            }
        }
        
        // Fill board with random colors
        for (let y = 0; y < gridSize.height; y++) {
            for (let x = 0; x < gridSize.width; x++) {
                // Keep generating a random color until it doesn't create a match
                let validColor = false;
                let attempts = 0;
                
                while (!validColor && attempts < 10) {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    board[y][x] = { color: randomColor, type: 'regular' };
                    
                    // Check if this creates a match
                    if (!this._checkForInitialMatches(board, x, y)) {
                        validColor = true;
                    } else {
                        board[y][x] = null;
                    }
                    
                    attempts++;
                }
                
                // If we couldn't find a non-matching color after 10 attempts, just use any color
                if (!validColor) {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    board[y][x] = { color: randomColor, type: 'regular' };
                }
            }
        }
        
        return board;
    }
    
    /**
     * Generate default levels
     * @returns {Promise} Promise that resolves when levels are generated
     * @private
     */
    _generateDefaultLevels() {
        return new Promise((resolve) => {
            // Generate first 50 levels
            for (let i = 1; i <= 50; i++) {
                this.levels[i] = this._generateLevel(i);
            }
            
            // Save level index
            this.storageManager.saveData('lightbulb_levels', this.levels)
                .then(() => resolve())
                .catch(error => {
                    console.error('Failed to save level index:', error);
                    resolve();
                });
        });
    }
    
    /**
     * Generate a level based on ID
     * @param {number} levelId - Level ID
     * @returns {Object} Generated level data
     * @private
     */
    _generateLevel(levelId) {
        // Clone default level template
        const level = JSON.parse(JSON.stringify(this.defaultLevel));
        
        // Set level ID
        level.id = levelId;
        
        // Adjust difficulty based on level ID
        this._adjustLevelDifficulty(level, levelId);
        
        // Set level type based on pattern
        this._setLevelType(level, levelId);
        
        // Set level objectives based on type
        this._setLevelObjectives(level);
        
        return level;
    }
    
    /**
     * Adjust level difficulty based on level ID
     * @param {Object} level - Level data to adjust
     * @param {number} levelId - Level ID
     * @private
     */
    _adjustLevelDifficulty(level, levelId) {
        // Base difficulty factors
        const difficultyFactor = Math.min(1 + (levelId - 1) * 0.05, 3); // Caps at 3x difficulty
        
        // Adjust score targets
        level.scoreTarget = {
            oneStarScore: Math.floor(1000 * difficultyFactor),
            twoStarScore: Math.floor(2000 * difficultyFactor),
            threeStarScore: Math.floor(3000 * difficultyFactor)
        };
        
        // Adjust moves
        level.moves = Math.max(20, Math.floor(30 - (levelId - 1) * 0.2));
        
        // Adjust time limit for timed levels
        level.timeLimit = Math.max(30, Math.floor(120 - (levelId - 1) * 0.5));
        
        // Adjust grid size for higher levels
        if (levelId > 20) {
            level.gridSize = { width: 8, height: 11 };
        }
        if (levelId > 40) {
            level.gridSize = { width: 9, height: 11 };
        }
        
        // Add more colors for higher levels
        if (levelId > 10 && !level.colors.includes('purple')) {
            level.colors.push('purple');
        }
        if (levelId > 30 && !level.colors.includes('orange')) {
            level.colors.push('orange');
        }
    }
    
    /**
     * Set level type based on level ID pattern
     * @param {Object} level - Level data to adjust
     * @param {number} levelId - Level ID
     * @private
     */
    _setLevelType(level, levelId) {
        // Pattern: Every 5th level is a boss level
        if (levelId % 5 === 0) {
            level.type = this.levelTypes.BOSS;
        }
        // Every 4th level is an obstacle level
        else if (levelId % 4 === 0) {
            level.type = this.levelTypes.OBSTACLE;
        }
        // Every 3rd level is a collection level
        else if (levelId % 3 === 0) {
            level.type = this.levelTypes.COLLECTION;
        }
        // Every 2nd level is a timed level
        else if (levelId % 2 === 0) {
            level.type = this.levelTypes.TIMED;
        }
        // Other levels are standard
        else {
            level.type = this.levelTypes.STANDARD;
        }
        
        // First level is always standard with tutorial
        if (levelId === 1) {
            level.type = this.levelTypes.STANDARD;
            level.tutorial = 'basic';
        }
    }
    
    /**
     * Set level objectives based on level type
     * @param {Object} level - Level data to adjust
     * @private
     */
    _setLevelObjectives(level) {
        switch (level.type) {
            case this.levelTypes.STANDARD:
                // Standard levels just have score targets
                level.objectives = [
                    { type: 'score', target: level.scoreTarget.oneStarScore }
                ];
                break;
                
            case this.levelTypes.TIMED:
                // Timed levels have score targets with time limit
                level.objectives = [
                    { type: 'score', target: level.scoreTarget.oneStarScore }
                ];
                level.moves = null; // No move limit for timed levels
                break;
                
            case this.levelTypes.COLLECTION:
                // Collection levels require collecting specific colors
                const colorCounts = {};
                level.colors.forEach(color => {
                    colorCounts[color] = Math.floor(10 + level.id * 0.5);
                });
                
                level.objectives = [
                    { type: 'collect', colors: colorCounts }
                ];
                break;
                
            case this.levelTypes.OBSTACLE:
                // Obstacle levels require clearing obstacles
                const obstacleCount = Math.floor(5 + level.id * 0.3);
                
                level.objectives = [
                    { type: 'clear_obstacles', target: obstacleCount }
                ];
                
                // Generate obstacles
                for (let i = 0; i < obstacleCount; i++) {
                    level.obstacles.push({
                        type: 'block',
                        health: Math.floor(1 + level.id * 0.1)
                    });
                }
                break;
                
            case this.levelTypes.BOSS:
                // Boss levels have multiple objectives
                level.objectives = [
                    { type: 'score', target: level.scoreTarget.oneStarScore },
                    { type: 'special_bulbs', target: Math.floor(3 + level.id * 0.1) }
                ];
                
                // Add color collection for some boss levels
                if (level.id % 10 === 0) {
                    const colorCounts = {};
                    level.colors.forEach(color => {
                        colorCounts[color] = Math.floor(5 + level.id * 0.2);
                    });
                    
                    level.objectives.push({ type: 'collect', colors: colorCounts });
                }
                break;
        }
    }
    
    /**
     * Check if placing a bulb creates a match
     * @param {Array<Array>} board - Game board
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if a match is found
     * @private
     */
    _checkForInitialMatches(board, x, y) {
        const currentBulb = board[y][x];
        if (!currentBulb) return false;
        
        const color = currentBulb.color;
        
        // Check horizontal match (need 2 more of the same color)
        if (x >= 2 && 
            board[y][x-1]?.color === color && 
            board[y][x-2]?.color === color) {
            return true;
        }
        
        if (x >= 1 && x < board[y].length - 1 && 
            board[y][x-1]?.color === color && 
            board[y][x+1]?.color === color) {
            return true;
        }
        
        if (x < board[y].length - 2 && 
            board[y][x+1]?.color === color && 
            board[y][x+2]?.color === color) {
            return true;
        }
        
        // Check vertical match (need 2 more of the same color)
        if (y >= 2 && 
            board[y-1][x]?.color === color && 
            board[y-2][x]?.color === color) {
            return true;
        }
        
        if (y >= 1 && y < board.length - 1 && 
            board[y-1][x]?.color === color && 
            board[y+1][x]?.color === color) {
            return true;
        }
        
        if (y < board.length - 2 && 
            board[y+1][x]?.color === color && 
            board[y+2][x]?.color === color) {
            return true;
        }
        
        return false;
    }
}
