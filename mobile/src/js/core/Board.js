/**
 * Board.js
 * Manages the game board grid and light bulb interactions
 */
class Board {
    /**
     * Create a new game board
     * @param {Object} config - Board configuration
     * @param {Object} config.gridSize - Grid dimensions {width, height}
     * @param {Array<string>} config.colors - Available bulb colors
     * @param {number} config.matchMinLength - Minimum match length (default: 3)
     */
    constructor(config) {
        this.gridSize = config.gridSize || { width: 8, height: 10 };
        this.colors = config.colors || ['red', 'yellow', 'blue', 'green'];
        this.matchMinLength = config.matchMinLength || 3;
        
        // Create empty grid
        this.grid = [];
        this.resetGrid();
        
        // Selected bulb
        this.selectedBulb = null;
        
        // Callback functions
        this.onMatch = null;
        this.onCascade = null;
        this.onSpecialCreated = null;
        this.onSwap = null;
        this.onInvalidSwap = null;
        
        // Match detector
        this.matchDetector = new MatchDetector(this.matchMinLength);
        
        // Animation flags
        this.isAnimating = false;
        this.pendingSwaps = [];
    }
    
    /**
     * Reset the grid to empty state
     */
    resetGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridSize.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize.width; x++) {
                this.grid[y][x] = null;
            }
        }
    }
    
    /**
     * Fill the grid with random bulbs
     * @param {boolean} ensureNoMatches - If true, ensure no matches exist initially
     */
    fillGrid(ensureNoMatches = true) {
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                if (!this.grid[y][x]) {
                    this.grid[y][x] = this.createRandomBulb(x, y, ensureNoMatches);
                }
            }
        }
    }
    
    /**
     * Create a random light bulb
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {boolean} ensureNoMatches - If true, ensure the bulb doesn't create a match
     * @returns {LightBulb} New light bulb
     */
    createRandomBulb(x, y, ensureNoMatches = true) {
        if (ensureNoMatches) {
            // Get colors that won't create a match
            const availableColors = this.getAvailableColors(x, y);
            
            if (availableColors.length > 0) {
                const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
                const bulb = new LightBulb(randomColor);
                bulb.setGridPosition(x, y);
                return bulb;
            }
        }
        
        // If we can't ensure no matches or no available colors, just pick a random one
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const bulb = new LightBulb(randomColor);
        bulb.setGridPosition(x, y);
        return bulb;
    }
    
    /**
     * Get colors that won't create a match at the given position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {Array<string>} Available colors
     */
    getAvailableColors(x, y) {
        const unavailableColors = new Set();
        
        // Check horizontal matches
        if (x >= 1 && x < this.gridSize.width - 1) {
            const left = this.grid[y][x-1];
            const right = this.grid[y][x+1];
            if (left && right && left.color === right.color) {
                unavailableColors.add(left.color);
            }
        }
        
        if (x >= 2) {
            const left1 = this.grid[y][x-1];
            const left2 = this.grid[y][x-2];
            if (left1 && left2 && left1.color === left2.color) {
                unavailableColors.add(left1.color);
            }
        }
        
        if (x < this.gridSize.width - 2) {
            const right1 = this.grid[y][x+1];
            const right2 = this.grid[y][x+2];
            if (right1 && right2 && right1.color === right2.color) {
                unavailableColors.add(right1.color);
            }
        }
        
        // Check vertical matches
        if (y >= 1 && y < this.gridSize.height - 1) {
            const above = this.grid[y-1][x];
            const below = this.grid[y+1][x];
            if (above && below && above.color === below.color) {
                unavailableColors.add(above.color);
            }
        }
        
        if (y >= 2) {
            const above1 = this.grid[y-1][x];
            const above2 = this.grid[y-2][x];
            if (above1 && above2 && above1.color === above2.color) {
                unavailableColors.add(above1.color);
            }
        }
        
        if (y < this.gridSize.height - 2) {
            const below1 = this.grid[y+1][x];
            const below2 = this.grid[y+2][x];
            if (below1 && below2 && below1.color === below2.color) {
                unavailableColors.add(below1.color);
            }
        }
        
        // Return colors that are not unavailable
        return this.colors.filter(color => !unavailableColors.has(color));
    }
    
    /**
     * Load a board from a predefined layout
     * @param {Array<Array>} layout - 2D array of bulb data
     */
    loadBoard(layout) {
        this.resetGrid();
        
        for (let y = 0; y < Math.min(layout.length, this.gridSize.height); y++) {
            for (let x = 0; x < Math.min(layout[y].length, this.gridSize.width); x++) {
                const bulbData = layout[y][x];
                if (bulbData) {
                    const bulb = new LightBulb(bulbData.color, bulbData.type || 'regular');
                    bulb.setGridPosition(x, y);
                    this.grid[y][x] = bulb;
                }
            }
        }
    }
    
    /**
     * Get the bulb at a specific grid position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {LightBulb|null} The bulb at the position or null
     */
    getBulbAt(x, y) {
        if (x >= 0 && x < this.gridSize.width && y >= 0 && y < this.gridSize.height) {
            return this.grid[y][x];
        }
        return null;
    }
    
    /**
     * Select a bulb at a specific grid position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean} True if selection changed
     */
    selectBulbAt(x, y) {
        const bulb = this.getBulbAt(x, y);
        
        if (!bulb || !bulb.canSwap()) {
            return false;
        }
        
        // If we already have a selected bulb
        if (this.selectedBulb) {
            // Check if the new selection is adjacent to the current selection
            const dx = Math.abs(x - this.selectedBulb.gridX);
            const dy = Math.abs(y - this.selectedBulb.gridY);
            
            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                // Adjacent bulbs - swap them
                this.swapBulbs(this.selectedBulb, bulb);
                this.clearSelection();
                return true;
            } else {
                // Not adjacent - change selection
                this.clearSelection();
                this.selectedBulb = bulb;
                bulb.setSelected(true);
                return true;
            }
        } else {
            // No current selection - select this bulb
            this.selectedBulb = bulb;
            bulb.setSelected(true);
            return true;
        }
    }
    
    /**
     * Clear the current bulb selection
     */
    clearSelection() {
        if (this.selectedBulb) {
            this.selectedBulb.setSelected(false);
            this.selectedBulb = null;
        }
    }
    
    /**
     * Swap two bulbs
     * @param {LightBulb} bulb1 - First bulb
     * @param {LightBulb} bulb2 - Second bulb
     */
    swapBulbs(bulb1, bulb2) {
        if (this.isAnimating) {
            // Queue the swap for later
            this.pendingSwaps.push({ bulb1, bulb2 });
            return;
        }
        
        this.isAnimating = true;
        
        // Swap grid positions
        const tempX = bulb1.gridX;
        const tempY = bulb1.gridY;
        
        bulb1.setGridPosition(bulb2.gridX, bulb2.gridY);
        bulb2.setGridPosition(tempX, tempY);
        
        // Update grid references
        this.grid[bulb1.gridY][bulb1.gridX] = bulb1;
        this.grid[bulb2.gridY][bulb2.gridX] = bulb2;
        
        // Check if the swap creates a match
        const matches = this.findAllMatches();
        
        if (matches.length > 0) {
            // Valid swap - notify listeners
            if (this.onSwap) {
                this.onSwap(bulb1, bulb2);
            }
            
            // Process matches after a short delay
            setTimeout(() => {
                this.processMatches(matches);
            }, 250);
        } else {
            // Invalid swap - swap back
            bulb1.setGridPosition(tempX, tempY);
            bulb2.setGridPosition(bulb1.gridX, bulb1.gridY);
            
            this.grid[bulb1.gridY][bulb1.gridX] = bulb1;
            this.grid[bulb2.gridY][bulb2.gridX] = bulb2;
            
            // Notify listeners
            if (this.onInvalidSwap) {
                this.onInvalidSwap(bulb1, bulb2);
            }
            
            // Reset animation flag after a short delay
            setTimeout(() => {
                this.isAnimating = false;
                this.processPendingSwaps();
            }, 500);
        }
    }
    
    /**
     * Process any pending swaps
     */
    processPendingSwaps() {
        if (this.pendingSwaps.length > 0 && !this.isAnimating) {
            const { bulb1, bulb2 } = this.pendingSwaps.shift();
            this.swapBulbs(bulb1, bulb2);
        }
    }
    
    /**
     * Find all matches on the board
     * @returns {Array<Array<LightBulb>>} Array of match groups
     */
    findAllMatches() {
        return this.matchDetector.findMatches(this.grid, this.gridSize);
    }
    
    /**
     * Process matches and create cascades
     * @param {Array<Array<LightBulb>>} matches - Array of match groups
     * @param {number} cascadeLevel - Current cascade level (for scoring)
     */
    processMatches(matches, cascadeLevel = 0) {
        if (matches.length === 0) {
            this.isAnimating = false;
            this.processPendingSwaps();
            return;
        }
        
        // Process each match group
        for (const match of matches) {
            // Check for special bulb creation
            const specialBulb = this.checkForSpecialBulb(match);
            
            // Mark bulbs as matched
            for (const bulb of match) {
                if (bulb !== specialBulb) {
                    bulb.match();
                    this.grid[bulb.gridY][bulb.gridX] = null;
                }
            }
            
            // Notify listeners
            if (this.onMatch) {
                this.onMatch(match, cascadeLevel);
            }
        }
        
        // After a delay, make bulbs fall and check for cascades
        setTimeout(() => {
            this.applyGravity();
            
            // Fill empty spaces at the top
            this.fillEmptySpaces();
            
            // After bulbs have fallen, check for new matches
            setTimeout(() => {
                const newMatches = this.findAllMatches();
                
                if (newMatches.length > 0) {
                    // Notify cascade listeners
                    if (this.onCascade) {
                        this.onCascade(cascadeLevel + 1);
                    }
                    
                    // Process new matches as a cascade
                    this.processMatches(newMatches, cascadeLevel + 1);
                } else {
                    // No more matches
                    this.isAnimating = false;
                    this.processPendingSwaps();
                }
            }, 500);
        }, 300);
    }
    
    /**
     * Check if a match should create a special bulb
     * @param {Array<LightBulb>} match - Match group
     * @returns {LightBulb|null} Created special bulb or null
     */
    checkForSpecialBulb(match) {
        if (match.length < 4) {
            return null;
        }
        
        // Get the last swapped bulb (this would be the one that created the match)
        // For simplicity, we'll just use the first bulb in the match
        const bulb = match[0];
        const color = bulb.color;
        
        // Check for different special bulb patterns
        if (match.length >= 5) {
            // 5 or more in a row = Rainbow Bulb
            bulb.convertToSpecial('rainbow');
            
            if (this.onSpecialCreated) {
                this.onSpecialCreated(bulb, 'rainbow');
            }
            
            return bulb;
        } else if (match.length === 4) {
            // 4 in a row = Line Bulb
            bulb.convertToSpecial('line');
            
            if (this.onSpecialCreated) {
                this.onSpecialCreated(bulb, 'line');
            }
            
            return bulb;
        }
        
        return null;
    }
    
    /**
     * Apply gravity to make bulbs fall into empty spaces
     */
    applyGravity() {
        // For each column
        for (let x = 0; x < this.gridSize.width; x++) {
            // Start from the bottom and move up
            let emptyY = null;
            
            for (let y = this.gridSize.height - 1; y >= 0; y--) {
                if (!this.grid[y][x]) {
                    // Found an empty space
                    if (emptyY === null) {
                        emptyY = y;
                    }
                } else if (emptyY !== null) {
                    // Found a bulb above an empty space - move it down
                    const bulb = this.grid[y][x];
                    bulb.setGridPosition(x, emptyY);
                    bulb.startFalling();
                    
                    this.grid[emptyY][x] = bulb;
                    this.grid[y][x] = null;
                    
                    // The position above this is now the new empty space
                    emptyY--;
                }
            }
        }
    }
    
    /**
     * Fill empty spaces at the top with new bulbs
     */
    fillEmptySpaces() {
        for (let x = 0; x < this.gridSize.width; x++) {
            for (let y = 0; y < this.gridSize.height; y++) {
                if (!this.grid[y][x]) {
                    // Create a new bulb above the grid
                    const bulb = this.createRandomBulb(x, y, false);
                    bulb.startFalling();
                    this.grid[y][x] = bulb;
                }
            }
        }
    }
    
    /**
     * Activate a special bulb
     * @param {LightBulb} bulb - Special bulb to activate
     * @param {Object} params - Activation parameters
     */
    activateSpecialBulb(bulb, params = {}) {
        if (!bulb || bulb.type === 'regular') {
            return;
        }
        
        this.isAnimating = true;
        
        switch (bulb.type) {
            case 'line':
                this.activateLineBulb(bulb, params.direction || 'horizontal');
                break;
                
            case 'bomb':
                this.activateBombBulb(bulb);
                break;
                
            case 'rainbow':
                this.activateRainbowBulb(bulb, params.targetColor);
                break;
        }
    }
    
    /**
     * Activate a line bulb
     * @param {LightBulb} bulb - Line bulb to activate
     * @param {string} direction - 'horizontal' or 'vertical'
     */
    activateLineBulb(bulb, direction) {
        const { gridX, gridY } = bulb;
        const affectedBulbs = [];
        
        // Mark the special bulb itself
        bulb.match();
        this.grid[gridY][gridX] = null;
        affectedBulbs.push(bulb);
        
        // Collect bulbs in the specified direction
        if (direction === 'horizontal') {
            // Clear entire row
            for (let x = 0; x < this.gridSize.width; x++) {
                if (x !== gridX && this.grid[gridY][x]) {
                    const targetBulb = this.grid[gridY][x];
                    targetBulb.match();
                    this.grid[gridY][x] = null;
                    affectedBulbs.push(targetBulb);
                }
            }
        } else {
            // Clear entire column
            for (let y = 0; y < this.gridSize.height; y++) {
                if (y !== gridY && this.grid[y][gridX]) {
                    const targetBulb = this.grid[y][gridX];
                    targetBulb.match();
                    this.grid[y][gridX] = null;
                    affectedBulbs.push(targetBulb);
                }
            }
        }
        
        // Notify listeners
        if (this.onMatch) {
            this.onMatch(affectedBulbs, 0, 'line');
        }
        
        // After a delay, apply gravity and check for cascades
        setTimeout(() => {
            this.applyGravity();
            this.fillEmptySpaces();
            
            setTimeout(() => {
                const newMatches = this.findAllMatches();
                
                if (newMatches.length > 0) {
                    if (this.onCascade) {
                        this.onCascade(1);
                    }
                    
                    this.processMatches(newMatches, 1);
                } else {
                    this.isAnimating = false;
                    this.processPendingSwaps();
                }
            }, 500);
        }, 300);
    }
    
    /**
     * Activate a bomb bulb
     * @param {LightBulb} bulb - Bomb bulb to activate
     */
    activateBombBulb(bulb) {
        const { gridX, gridY } = bulb;
        const affectedBulbs = [];
        
        // Mark the special bulb itself
        bulb.match();
        this.grid[gridY][gridX] = null;
        affectedBulbs.push(bulb);
        
        // Clear 3x3 area around the bomb
        for (let y = Math.max(0, gridY - 1); y <= Math.min(this.gridSize.height - 1, gridY + 1); y++) {
            for (let x = Math.max(0, gridX - 1); x <= Math.min(this.gridSize.width - 1, gridX + 1); x++) {
                if ((x !== gridX || y !== gridY) && this.grid[y][x]) {
                    const targetBulb = this.grid[y][x];
                    targetBulb.match();
                    this.grid[y][x] = null;
                    affectedBulbs.push(targetBulb);
                }
            }
        }
        
        // Notify listeners
        if (this.onMatch) {
            this.onMatch(affectedBulbs, 0, 'bomb');
        }
        
        // After a delay, apply gravity and check for cascades
        setTimeout(() => {
            this.applyGravity();
            this.fillEmptySpaces();
            
            setTimeout(() => {
                const newMatches = this.findAllMatches();
                
                if (newMatches.length > 0) {
                    if (this.onCascade) {
                        this.onCascade(1);
                    }
                    
                    this.processMatches(newMatches, 1);
                } else {
                    this.isAnimating = false;
                    this.processPendingSwaps();
                }
            }, 500);
        }, 300);
    }
    
    /**
     * Activate a rainbow bulb
     * @param {LightBulb} bulb - Rainbow bulb to activate
     * @param {string} targetColor - Color to clear
     */
    activateRainbowBulb(bulb, targetColor) {
        const { gridX, gridY } = bulb;
        const affectedBulbs = [];
        
        // If no target color specified, use the color of an adjacent bulb
        if (!targetColor) {
            // Try to find an adjacent bulb
            const adjacent = [
                this.getBulbAt(gridX + 1, gridY),
                this.getBulbAt(gridX - 1, gridY),
                this.getBulbAt(gridX, gridY + 1),
                this.getBulbAt(gridX, gridY - 1)
            ].filter(b => b !== null);
            
            if (adjacent.length > 0) {
                targetColor = adjacent[0].color;
            } else {
                // No adjacent bulbs, just pick a random color
                targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            }
        }
        
        // Mark the special bulb itself
        bulb.match();
        this.grid[gridY][gridX] = null;
        affectedBulbs.push(bulb);
        
        // Clear all bulbs of the target color
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const targetBulb = this.grid[y][x];
                if (targetBulb && targetBulb.color === targetColor) {
                    targetBulb.match();
                    this.grid[y][x] = null;
                    affectedBulbs.push(targetBulb);
                }
            }
        }
        
        // Notify listeners
        if (this.onMatch) {
            this.onMatch(affectedBulbs, 0, 'rainbow');
        }
        
        // After a delay, apply gravity and check for cascades
        setTimeout(() => {
            this.applyGravity();
            this.fillEmptySpaces();
            
            setTimeout(() => {
                const newMatches = this.findAllMatches();
                
                if (newMatches.length > 0) {
                    if (this.onCascade) {
                        this.onCascade(1);
                    }
                    
                    this.processMatches(newMatches, 1);
                } else {
                    this.isAnimating = false;
                    this.processPendingSwaps();
                }
            }, 500);
        }, 300);
    }
    
    /**
     * Check if there are possible moves available
     * @returns {Array<Object>} Array of possible moves
     */
    findPossibleMoves() {
        const possibleMoves = [];
        
        // Check each position
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const bulb = this.getBulbAt(x, y);
                if (!bulb) continue;
                
                // Try swapping with each adjacent position
                const adjacentPositions = [
                    { x: x + 1, y: y },
                    { x: x - 1, y: y },
                    { x: x, y: y + 1 },
                    { x: x, y: y - 1 }
                ];
                
                for (const pos of adjacentPositions) {
                    const adjacentBulb = this.getBulbAt(pos.x, pos.y);
                    if (!adjacentBulb) continue;
                    
                    // Temporarily swap bulbs
                    this.grid[y][x] = adjacentBulb;
                    this.grid[pos.y][pos.x] = bulb;
                    
                    // Check if this creates a match
                    const matches = this.findAllMatches();
                    
                    // Swap back
                    this.grid[y][x] = bulb;
                    this.grid[pos.y][pos.x] = adjacentBulb;
                    
                    if (matches.length > 0) {
                        possibleMoves.push({
                            bulb1: { x, y },
                            bulb2: { x: pos.x, y: pos.y },
                            matchCount: matches.length
                        });
                    }
                }
            }
        }
        
        return possibleMoves;
    }
    
    /**
     * Shuffle the board when no moves are available
     */
    shuffleBoard() {
        // Collect all bulbs
        const bulbs = [];
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                if (this.grid[y][x]) {
                    bulbs.push(this.grid[y][x]);
                }
            }
        }
        
        // Shuffle bulbs
        for (let i = bulbs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bulbs[i], bulbs[j]] = [bulbs[j], bulbs[i]];
        }
        
        // Place bulbs back on grid
        let index = 0;
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                if (index < bulbs.length) {
                    const bulb = bulbs[index++];
                    bulb.setGridPosition(x, y);
                    this.grid[y][x] = bulb;
                } else {
                    this.grid[y][x] = null;
                }
            }
        }
        
        // Ensure the shuffled board has valid moves
        let possibleMoves = this.findPossibleMoves();
        let attempts = 0;
        
        while (possibleMoves.length === 0 && attempts < 5) {
            // Shuffle again
            for (let i = bulbs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [bulbs[i], bulbs[j]] = [bulbs[j], bulbs[i]];
            }
            
            // Place bulbs back on grid
            index = 0;
            for (let y = 0; y < this.gridSize.height; y++) {
                for (let x = 0; x < this.gridSize.width; x++) {
                    if (index < bulbs.length) {
                        const bulb = bulbs[index++];
                        bulb.setGridPosition(x, y);
                        this.grid[y][x] = bulb;
                    } else {
                        this.grid[y][x] = null;
                    }
                }
            }
            
            possibleMoves = this.findPossibleMoves();
            attempts++;
        }
        
        // If we still don't have valid moves, just fill with new random bulbs
        if (possibleMoves.length === 0) {
            this.resetGrid();
            this.fillGrid();
        }
    }
    
    /**
     * Serialize the board for storage
     * @returns {Object} Serialized board data
     */
    serialize() {
        const serializedGrid = [];
        
        for (let y = 0; y < this.gridSize.height; y++) {
            serializedGrid[y] = [];
            for (let x = 0; x < this.gridSize.width; x++) {
                const bulb = this.grid[y][x];
                serializedGrid[y][x] = bulb ? bulb.serialize() : null;
            }
        }
        
        return {
            gridSize: this.gridSize,
            colors: this.colors,
            grid: serializedGrid
        };
    }
    
    /**
     * Load a serialized board
     * @param {Object} data - Serialized board data
     */
    deserialize(data) {
        this.gridSize = data.gridSize;
        this.colors = data.colors;
        
        this.resetGrid();
        
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const bulbData = data.grid[y][x];
                if (bulbData) {
                    this.grid[y][x] = LightBulb.deserialize(bulbData);
                }
            }
        }
    }
}
