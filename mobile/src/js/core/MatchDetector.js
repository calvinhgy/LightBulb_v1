/**
 * MatchDetector.js
 * Detects matches on the game board
 */
class MatchDetector {
    /**
     * Create a new match detector
     * @param {number} minMatchLength - Minimum number of bulbs for a match
     */
    constructor(minMatchLength = 3) {
        this.minMatchLength = minMatchLength;
    }
    
    /**
     * Find all matches on the board
     * @param {Array<Array<LightBulb>>} grid - Game grid
     * @param {Object} gridSize - Grid dimensions {width, height}
     * @returns {Array<Array<LightBulb>>} Array of match groups
     */
    findMatches(grid, gridSize) {
        const matches = [];
        const visited = new Set();
        
        // Find horizontal matches
        for (let y = 0; y < gridSize.height; y++) {
            for (let x = 0; x < gridSize.width; x++) {
                const bulb = grid[y][x];
                if (!bulb || visited.has(bulb.id)) continue;
                
                const horizontalMatch = this.findHorizontalMatch(grid, x, y, gridSize);
                if (horizontalMatch.length >= this.minMatchLength) {
                    matches.push(horizontalMatch);
                    horizontalMatch.forEach(b => visited.add(b.id));
                }
            }
        }
        
        // Reset visited set for vertical matches
        visited.clear();
        
        // Find vertical matches
        for (let x = 0; x < gridSize.width; x++) {
            for (let y = 0; y < gridSize.height; y++) {
                const bulb = grid[y][x];
                if (!bulb || visited.has(bulb.id)) continue;
                
                const verticalMatch = this.findVerticalMatch(grid, x, y, gridSize);
                if (verticalMatch.length >= this.minMatchLength) {
                    matches.push(verticalMatch);
                    verticalMatch.forEach(b => visited.add(b.id));
                }
            }
        }
        
        return matches;
    }
    
    /**
     * Find a horizontal match starting at a position
     * @param {Array<Array<LightBulb>>} grid - Game grid
     * @param {number} startX - Starting X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} gridSize - Grid dimensions {width, height}
     * @returns {Array<LightBulb>} Array of matching bulbs
     */
    findHorizontalMatch(grid, startX, y, gridSize) {
        const match = [];
        const startBulb = grid[y][startX];
        if (!startBulb) return match;
        
        const color = startBulb.color;
        
        // Check to the right
        for (let x = startX; x < gridSize.width; x++) {
            const bulb = grid[y][x];
            if (bulb && bulb.color === color) {
                match.push(bulb);
            } else {
                break;
            }
        }
        
        return match;
    }
    
    /**
     * Find a vertical match starting at a position
     * @param {Array<Array<LightBulb>>} grid - Game grid
     * @param {number} x - X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {Object} gridSize - Grid dimensions {width, height}
     * @returns {Array<LightBulb>} Array of matching bulbs
     */
    findVerticalMatch(grid, x, startY, gridSize) {
        const match = [];
        const startBulb = grid[startY][x];
        if (!startBulb) return match;
        
        const color = startBulb.color;
        
        // Check downward
        for (let y = startY; y < gridSize.height; y++) {
            const bulb = grid[y][x];
            if (bulb && bulb.color === color) {
                match.push(bulb);
            } else {
                break;
            }
        }
        
        return match;
    }
    
    /**
     * Find special patterns like L, T shapes for special bulbs
     * @param {Array<Array<LightBulb>>} grid - Game grid
     * @param {Object} gridSize - Grid dimensions {width, height}
     * @returns {Array<Object>} Array of special pattern matches
     */
    findSpecialPatterns(grid, gridSize) {
        const patterns = [];
        
        // Check for L and T shapes
        for (let y = 0; y < gridSize.height; y++) {
            for (let x = 0; x < gridSize.width; x++) {
                const bulb = grid[y][x];
                if (!bulb) continue;
                
                const color = bulb.color;
                
                // Check for L shape (horizontal + vertical)
                const horizontalMatch = this.findHorizontalMatch(grid, x, y, gridSize);
                if (horizontalMatch.length >= 3) {
                    // Check for vertical match from the start
                    const verticalMatch = this.findVerticalMatch(grid, x, y, gridSize);
                    if (verticalMatch.length >= 3) {
                        // We have an L shape
                        patterns.push({
                            type: 'L',
                            center: { x, y },
                            bulbs: [...horizontalMatch, ...verticalMatch.slice(1)] // Avoid counting the corner twice
                        });
                    }
                    
                    // Check for vertical match from the end
                    const endX = x + horizontalMatch.length - 1;
                    const endVerticalMatch = this.findVerticalMatch(grid, endX, y, gridSize);
                    if (endVerticalMatch.length >= 3) {
                        // We have a reversed L shape
                        patterns.push({
                            type: 'L',
                            center: { x: endX, y },
                            bulbs: [...horizontalMatch, ...endVerticalMatch.slice(1)] // Avoid counting the corner twice
                        });
                    }
                }
                
                // Check for T shape (horizontal with vertical in middle)
                if (horizontalMatch.length >= 3) {
                    for (let i = 0; i < horizontalMatch.length; i++) {
                        const checkX = x + i;
                        const verticalMatch = this.findVerticalMatch(grid, checkX, y + 1, gridSize);
                        if (verticalMatch.length >= 2) { // Need at least 2 more below
                            // We have a T shape
                            patterns.push({
                                type: 'T',
                                center: { x: checkX, y },
                                bulbs: [...horizontalMatch, ...verticalMatch]
                            });
                        }
                    }
                }
                
                // Check for inverted T shape (vertical with horizontal in middle)
                const verticalMatch = this.findVerticalMatch(grid, x, y, gridSize);
                if (verticalMatch.length >= 3) {
                    for (let i = 0; i < verticalMatch.length; i++) {
                        const checkY = y + i;
                        const horizontalLeftMatch = [];
                        const horizontalRightMatch = [];
                        
                        // Check left
                        for (let checkX = x - 1; checkX >= 0; checkX--) {
                            const checkBulb = grid[checkY][checkX];
                            if (checkBulb && checkBulb.color === color) {
                                horizontalLeftMatch.push(checkBulb);
                            } else {
                                break;
                            }
                        }
                        
                        // Check right
                        for (let checkX = x + 1; checkX < gridSize.width; checkX++) {
                            const checkBulb = grid[checkY][checkX];
                            if (checkBulb && checkBulb.color === color) {
                                horizontalRightMatch.push(checkBulb);
                            } else {
                                break;
                            }
                        }
                        
                        if (horizontalLeftMatch.length + horizontalRightMatch.length >= 2) {
                            // We have an inverted T shape
                            patterns.push({
                                type: 'T',
                                center: { x, y: checkY },
                                bulbs: [...verticalMatch, ...horizontalLeftMatch, ...horizontalRightMatch]
                            });
                        }
                    }
                }
            }
        }
        
        return patterns;
    }
    
    /**
     * Check if there are any possible moves on the board
     * @param {Array<Array<LightBulb>>} grid - Game grid
     * @param {Object} gridSize - Grid dimensions {width, height}
     * @returns {boolean} True if there are possible moves
     */
    hasPossibleMoves(grid, gridSize) {
        // Check each position
        for (let y = 0; y < gridSize.height; y++) {
            for (let x = 0; x < gridSize.width; x++) {
                const bulb = grid[y][x];
                if (!bulb) continue;
                
                // Try swapping with each adjacent position
                const adjacentPositions = [
                    { x: x + 1, y },
                    { x: x - 1, y },
                    { x, y: y + 1 },
                    { x, y: y - 1 }
                ];
                
                for (const pos of adjacentPositions) {
                    if (pos.x < 0 || pos.x >= gridSize.width || pos.y < 0 || pos.y >= gridSize.height) {
                        continue;
                    }
                    
                    const adjacentBulb = grid[pos.y][pos.x];
                    if (!adjacentBulb) continue;
                    
                    // Temporarily swap bulbs
                    grid[y][x] = adjacentBulb;
                    grid[pos.y][pos.x] = bulb;
                    
                    // Check if this creates a match
                    const matches = this.findMatches(grid, gridSize);
                    
                    // Swap back
                    grid[y][x] = bulb;
                    grid[pos.y][pos.x] = adjacentBulb;
                    
                    if (matches.length > 0) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Find a hint for the player
     * @param {Array<Array<LightBulb>>} grid - Game grid
     * @param {Object} gridSize - Grid dimensions {width, height}
     * @returns {Object|null} Hint information or null if no hint available
     */
    findHint(grid, gridSize) {
        // Check each position
        for (let y = 0; y < gridSize.height; y++) {
            for (let x = 0; x < gridSize.width; x++) {
                const bulb = grid[y][x];
                if (!bulb) continue;
                
                // Try swapping with each adjacent position
                const adjacentPositions = [
                    { x: x + 1, y },
                    { x: x - 1, y },
                    { x, y: y + 1 },
                    { x, y: y - 1 }
                ];
                
                for (const pos of adjacentPositions) {
                    if (pos.x < 0 || pos.x >= gridSize.width || pos.y < 0 || pos.y >= gridSize.height) {
                        continue;
                    }
                    
                    const adjacentBulb = grid[pos.y][pos.x];
                    if (!adjacentBulb) continue;
                    
                    // Temporarily swap bulbs
                    grid[y][x] = adjacentBulb;
                    grid[pos.y][pos.x] = bulb;
                    
                    // Check if this creates a match
                    const matches = this.findMatches(grid, gridSize);
                    
                    // Swap back
                    grid[y][x] = bulb;
                    grid[pos.y][pos.x] = adjacentBulb;
                    
                    if (matches.length > 0) {
                        return {
                            bulb1: { x, y },
                            bulb2: { x: pos.x, y: pos.y },
                            matchCount: matches.length
                        };
                    }
                }
            }
        }
        
        return null;
    }
}
