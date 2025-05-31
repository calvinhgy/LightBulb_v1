/**
 * ScoreManager.js
 * Manages scoring, objectives, and level completion
 */
class ScoreManager {
    /**
     * Create a new score manager
     * @param {Object} config - Scoring configuration
     */
    constructor(config) {
        this.config = config || {
            baseMatchScore: 100,
            matchMultiplier: 1.5,
            cascadeMultiplier: 1.2,
            specialBulbMultiplier: 2.0,
            starThresholds: [1000, 2000, 3000]
        };
        
        this.reset();
    }
    
    /**
     * Reset the score manager
     */
    reset() {
        this.score = 0;
        this.moves = 0;
        this.remainingMoves = 0;
        this.timeElapsed = 0;
        this.timeLimit = 0;
        this.objectives = [];
        this.objectiveProgress = {};
        this.specialBulbsCreated = 0;
        this.specialBulbsUsed = 0;
        this.longestChain = 0;
        this.isComplete = false;
        this.stars = 0;
    }
    
    /**
     * Initialize the score manager for a level
     * @param {Object} levelData - Level data
     */
    initializeLevel(levelData) {
        this.reset();
        
        // Set up moves or time limit
        if (levelData.moves) {
            this.remainingMoves = levelData.moves;
        }
        
        if (levelData.timeLimit) {
            this.timeLimit = levelData.timeLimit;
        }
        
        // Set up objectives
        this.objectives = levelData.objectives || [];
        
        // Initialize objective progress
        this.objectiveProgress = {};
        for (const objective of this.objectives) {
            switch (objective.type) {
                case 'score':
                    this.objectiveProgress.score = 0;
                    break;
                    
                case 'collect':
                    this.objectiveProgress.collect = {};
                    for (const color in objective.colors) {
                        this.objectiveProgress.collect[color] = 0;
                    }
                    break;
                    
                case 'clear_obstacles':
                    this.objectiveProgress.clearedObstacles = 0;
                    break;
                    
                case 'special_bulbs':
                    this.objectiveProgress.specialBulbs = 0;
                    break;
            }
        }
        
        // Set star thresholds
        this.config.starThresholds = [
            levelData.scoreTarget.oneStarScore,
            levelData.scoreTarget.twoStarScore,
            levelData.scoreTarget.threeStarScore
        ];
    }
    
    /**
     * Update score for a match
     * @param {Array<LightBulb>} match - Array of matched bulbs
     * @param {number} cascadeLevel - Current cascade level
     * @param {string} specialType - Type of special bulb activation
     */
    updateScoreForMatch(match, cascadeLevel = 0, specialType = null) {
        // Calculate base score
        let matchScore = this.config.baseMatchScore;
        
        // Adjust for match length
        matchScore *= Math.pow(this.config.matchMultiplier, match.length - 3);
        
        // Adjust for cascade level
        if (cascadeLevel > 0) {
            matchScore *= Math.pow(this.config.cascadeMultiplier, cascadeLevel);
        }
        
        // Adjust for special bulb activation
        if (specialType) {
            matchScore *= this.config.specialBulbMultiplier;
            this.specialBulbsUsed++;
            
            // Update special bulbs objective
            if (this.objectiveProgress.specialBulbs !== undefined) {
                this.objectiveProgress.specialBulbs++;
            }
        }
        
        // Round to integer
        matchScore = Math.floor(matchScore);
        
        // Update total score
        this.score += matchScore;
        
        // Update score objective
        if (this.objectiveProgress.score !== undefined) {
            this.objectiveProgress.score = this.score;
        }
        
        // Update collection objective
        if (this.objectiveProgress.collect) {
            for (const bulb of match) {
                if (this.objectiveProgress.collect[bulb.color] !== undefined) {
                    this.objectiveProgress.collect[bulb.color]++;
                }
            }
        }
        
        // Update longest chain
        if (cascadeLevel > this.longestChain) {
            this.longestChain = cascadeLevel;
        }
        
        return matchScore;
    }
    
    /**
     * Update when a special bulb is created
     * @param {LightBulb} bulb - Created special bulb
     * @param {string} specialType - Type of special bulb
     */
    updateSpecialBulbCreated(bulb, specialType) {
        this.specialBulbsCreated++;
        
        // Update special bulbs objective
        if (this.objectiveProgress.specialBulbs !== undefined) {
            this.objectiveProgress.specialBulbs++;
        }
    }
    
    /**
     * Update when an obstacle is cleared
     */
    updateObstacleCleared() {
        if (this.objectiveProgress.clearedObstacles !== undefined) {
            this.objectiveProgress.clearedObstacles++;
        }
    }
    
    /**
     * Use a move
     * @returns {boolean} True if moves remain, false if out of moves
     */
    useMove() {
        this.moves++;
        
        if (this.remainingMoves > 0) {
            this.remainingMoves--;
            return this.remainingMoves > 0;
        }
        
        return true; // No move limit
    }
    
    /**
     * Update elapsed time
     * @param {number} deltaTime - Time elapsed in seconds
     * @returns {boolean} True if time remains, false if out of time
     */
    updateTime(deltaTime) {
        if (this.timeLimit === 0) {
            return true; // No time limit
        }
        
        this.timeElapsed += deltaTime;
        return this.timeElapsed < this.timeLimit;
    }
    
    /**
     * Get remaining time
     * @returns {number} Remaining time in seconds
     */
    getRemainingTime() {
        if (this.timeLimit === 0) {
            return Infinity;
        }
        
        return Math.max(0, this.timeLimit - this.timeElapsed);
    }
    
    /**
     * Check if all objectives are complete
     * @returns {boolean} True if all objectives are complete
     */
    checkObjectivesComplete() {
        for (const objective of this.objectives) {
            switch (objective.type) {
                case 'score':
                    if (this.score < objective.target) {
                        return false;
                    }
                    break;
                    
                case 'collect':
                    for (const color in objective.colors) {
                        if (this.objectiveProgress.collect[color] < objective.colors[color]) {
                            return false;
                        }
                    }
                    break;
                    
                case 'clear_obstacles':
                    if (this.objectiveProgress.clearedObstacles < objective.target) {
                        return false;
                    }
                    break;
                    
                case 'special_bulbs':
                    if (this.objectiveProgress.specialBulbs < objective.target) {
                        return false;
                    }
                    break;
            }
        }
        
        return true;
    }
    
    /**
     * Check if the level is complete
     * @returns {boolean} True if level is complete
     */
    checkLevelComplete() {
        // Level is complete if all objectives are met
        const objectivesComplete = this.checkObjectivesComplete();
        
        if (objectivesComplete) {
            this.isComplete = true;
            this.calculateStars();
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if the level is failed
     * @returns {boolean} True if level is failed
     */
    checkLevelFailed() {
        // Level is failed if out of moves or time
        if (this.remainingMoves === 0 || (this.timeLimit > 0 && this.timeElapsed >= this.timeLimit)) {
            return !this.checkObjectivesComplete();
        }
        
        return false;
    }
    
    /**
     * Calculate stars earned
     * @returns {number} Number of stars (0-3)
     */
    calculateStars() {
        let stars = 0;
        
        for (let i = 0; i < this.config.starThresholds.length; i++) {
            if (this.score >= this.config.starThresholds[i]) {
                stars = i + 1;
            } else {
                break;
            }
        }
        
        this.stars = stars;
        return stars;
    }
    
    /**
     * Get objective progress
     * @returns {Object} Objective progress
     */
    getObjectiveProgress() {
        const progress = {};
        
        for (const objective of this.objectives) {
            switch (objective.type) {
                case 'score':
                    progress.score = {
                        current: this.score,
                        target: objective.target,
                        percent: Math.min(100, Math.floor((this.score / objective.target) * 100))
                    };
                    break;
                    
                case 'collect':
                    progress.collect = {};
                    for (const color in objective.colors) {
                        const current = this.objectiveProgress.collect[color] || 0;
                        const target = objective.colors[color];
                        progress.collect[color] = {
                            current,
                            target,
                            percent: Math.min(100, Math.floor((current / target) * 100))
                        };
                    }
                    break;
                    
                case 'clear_obstacles':
                    progress.clearedObstacles = {
                        current: this.objectiveProgress.clearedObstacles || 0,
                        target: objective.target,
                        percent: Math.min(100, Math.floor(((this.objectiveProgress.clearedObstacles || 0) / objective.target) * 100))
                    };
                    break;
                    
                case 'special_bulbs':
                    progress.specialBulbs = {
                        current: this.objectiveProgress.specialBulbs || 0,
                        target: objective.target,
                        percent: Math.min(100, Math.floor(((this.objectiveProgress.specialBulbs || 0) / objective.target) * 100))
                    };
                    break;
            }
        }
        
        return progress;
    }
    
    /**
     * Get level results
     * @returns {Object} Level results
     */
    getLevelResults() {
        return {
            score: this.score,
            moves: this.moves,
            remainingMoves: this.remainingMoves,
            timeElapsed: this.timeElapsed,
            specialBulbsCreated: this.specialBulbsCreated,
            specialBulbsUsed: this.specialBulbsUsed,
            longestChain: this.longestChain,
            isComplete: this.isComplete,
            stars: this.stars,
            objectiveProgress: this.getObjectiveProgress()
        };
    }
    
    /**
     * Add bonus points for remaining moves
     * @returns {number} Bonus points added
     */
    addRemainingMovesBonus() {
        if (this.remainingMoves <= 0) {
            return 0;
        }
        
        const bonusPoints = this.remainingMoves * this.config.baseMatchScore;
        this.score += bonusPoints;
        
        // Update score objective
        if (this.objectiveProgress.score !== undefined) {
            this.objectiveProgress.score = this.score;
        }
        
        // Recalculate stars
        this.calculateStars();
        
        return bonusPoints;
    }
    
    /**
     * Add extra moves
     * @param {number} moves - Number of moves to add
     */
    addExtraMoves(moves) {
        this.remainingMoves += moves;
    }
    
    /**
     * Add extra time
     * @param {number} seconds - Seconds to add
     */
    addExtraTime(seconds) {
        if (this.timeLimit > 0) {
            this.timeLimit += seconds;
        }
    }
}
