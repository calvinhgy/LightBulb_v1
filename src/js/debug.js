/**
 * Debug utilities for the Colorful Light Bulbs game
 */
const Debug = {
    /**
     * Enable or disable debug mode
     */
    enabled: true,
    
    /**
     * Log a message if debug mode is enabled
     * @param {string} message - Message to log
     * @param {any} data - Optional data to log
     */
    log: function(message, data) {
        if (!this.enabled) return;
        
        if (data !== undefined) {
            console.log(`[DEBUG] ${message}`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    },
    
    /**
     * Log an error if debug mode is enabled
     * @param {string} message - Error message to log
     * @param {any} data - Optional error data to log
     */
    error: function(message, data) {
        if (!this.enabled) return;
        
        if (data !== undefined) {
            console.error(`[DEBUG ERROR] ${message}`, data);
        } else {
            console.error(`[DEBUG ERROR] ${message}`);
        }
    },
    
    /**
     * Log a warning if debug mode is enabled
     * @param {string} message - Warning message to log
     * @param {any} data - Optional warning data to log
     */
    warn: function(message, data) {
        if (!this.enabled) return;
        
        if (data !== undefined) {
            console.warn(`[DEBUG WARNING] ${message}`, data);
        } else {
            console.warn(`[DEBUG WARNING] ${message}`);
        }
    },
    
    /**
     * Print the current state of the game board
     * @param {Board} board - Game board to print
     */
    printBoard: function(board) {
        if (!this.enabled) return;
        
        console.log(`[DEBUG] Current board state (${board.rows}x${board.cols}):`);
        
        // Print column headers
        let header = "   ";
        for (let col = 0; col < board.cols; col++) {
            header += `${col} `;
        }
        console.log(header);
        
        // Print rows
        for (let row = 0; row < board.rows; row++) {
            let rowStr = `${row < 10 ? ' ' : ''}${row}|`;
            
            for (let col = 0; col < board.cols; col++) {
                const bulb = board.grid[row][col];
                if (bulb) {
                    rowStr += bulb.type.charAt(0) + " ";
                } else {
                    rowStr += "- ";
                }
            }
            
            console.log(rowStr);
        }
    },
    
    /**
     * Check the integrity of the game board
     * @param {Board} board - Game board to check
     * @returns {boolean} True if the board is valid
     */
    checkBoardIntegrity: function(board) {
        if (!this.enabled) return true;
        
        let valid = true;
        
        // Check that all positions have a bulb
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.cols; col++) {
                const bulb = board.grid[row][col];
                
                if (!bulb) {
                    this.error(`Missing bulb at [${row},${col}]`);
                    valid = false;
                    continue;
                }
                
                // Check that bulb's row and col match its position in the grid
                if (bulb.row !== row || bulb.col !== col) {
                    this.error(`Bulb at [${row},${col}] has incorrect position: [${bulb.row},${bulb.col}]`);
                    valid = false;
                }
                
                // Check that bulb's x and y match its position
                const expectedX = col * board.bulbSize;
                const expectedY = row * board.bulbSize;
                
                if (bulb.x !== expectedX || bulb.y !== expectedY) {
                    this.warn(`Bulb at [${row},${col}] has incorrect coordinates: (${bulb.x},${bulb.y}), expected: (${expectedX},${expectedY})`);
                    // Don't set valid to false for this, as it might be during animation
                }
                
                // Check that bulb has a valid type
                if (!Utils.bulbTypes.includes(bulb.type)) {
                    this.error(`Bulb at [${row},${col}] has invalid type: ${bulb.type}`);
                    valid = false;
                }
            }
        }
        
        return valid;
    },
    
    /**
     * Force a board reset to fix any issues
     * @param {Board} board - Game board to reset
     */
    resetBoard: function(board) {
        if (!this.enabled) return;
        
        this.warn("Forcing board reset to fix issues");
        
        // Reset all bulb positions and properties
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.cols; col++) {
                const bulb = board.grid[row][col];
                
                if (!bulb) {
                    // Create a new bulb if missing
                    const newType = Utils.bulbTypes[Utils.randomInt(0, Utils.bulbTypes.length - 1)];
                    board.grid[row][col] = {
                        type: newType,
                        row: row,
                        col: col,
                        x: col * board.bulbSize,
                        y: row * board.bulbSize,
                        targetX: col * board.bulbSize,
                        targetY: row * board.bulbSize,
                        selected: false,
                        matched: false,
                        animationProgress: 0
                    };
                } else {
                    // Reset properties
                    bulb.row = row;
                    bulb.col = col;
                    bulb.x = col * board.bulbSize;
                    bulb.y = row * board.bulbSize;
                    bulb.targetX = col * board.bulbSize;
                    bulb.targetY = row * board.bulbSize;
                    bulb.selected = false;
                    bulb.matched = false;
                    bulb.isSwapping = false;
                    bulb.isFalling = false;
                    bulb.animationProgress = 0;
                }
            }
        }
        
        // Reset board state
        board.isSwapping = false;
        board.isFalling = false;
        board.selectedBulb = null;
        board.matchedBulbs = [];
        
        // Ensure no matches exist
        board.resolveInitialMatches();
        
        this.log("Board reset complete");
    }
};

console.log('Debug module loaded');