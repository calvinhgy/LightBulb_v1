/**
 * Board class for managing the game board state and operations
 */
class Board {
    /**
     * Create a new game board
     * @param {number} rows - Number of rows in the board
     * @param {number} cols - Number of columns in the board
     * @param {number} bulbSize - Size of each bulb in pixels
     */
    constructor(rows, cols, bulbSize) {
        console.log(`Creating board with ${rows} rows, ${cols} columns, bulb size: ${bulbSize}px`);
        this.rows = rows;
        this.cols = cols;
        this.bulbSize = bulbSize;
        this.grid = [];
        this.selectedBulb = null;
        this.isSwapping = false;
        this.isFalling = false;
        this.matchedBulbs = [];
        this.animations = [];
        this.gameInstance = null; // Reference to the game instance
        
        // Initialize the grid with random bulbs
        this.initializeGrid();
        console.log('Board initialized successfully');
    }
    
    /**
     * Set the game instance reference
     * @param {Game} game - Game instance
     */
    setGameInstance(game) {
        this.gameInstance = game;
    }
    
    /**
     * Initialize the grid with random bulbs
     */
    initializeGrid() {
        this.grid = [];
        
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                // Create a random bulb
                const bulbType = Utils.bulbTypes[Utils.randomInt(0, Utils.bulbTypes.length - 1)];
                this.grid[row][col] = {
                    type: bulbType,
                    row: row,
                    col: col,
                    x: col * this.bulbSize,
                    y: row * this.bulbSize,
                    targetX: col * this.bulbSize,
                    targetY: row * this.bulbSize,
                    selected: false,
                    matched: false,
                    animationProgress: 0
                };
            }
        }
        
        // Ensure no matches exist at the start
        this.resolveInitialMatches();
    }
    
    /**
     * Resolve any matches that exist in the initial board setup
     */
    resolveInitialMatches() {
        let hasMatches = true;
        let iterations = 0;
        const maxIterations = 10; // Prevent infinite loops
        
        while (hasMatches && iterations < maxIterations) {
            const matches = this.findMatches();
            if (matches.length > 0) {
                // Replace matched bulbs with new random ones
                for (const bulb of matches) {
                    let newType;
                    do {
                        newType = Utils.bulbTypes[Utils.randomInt(0, Utils.bulbTypes.length - 1)];
                    } while (newType === bulb.type);
                    
                    this.grid[bulb.row][bulb.col].type = newType;
                }
                iterations++;
            } else {
                hasMatches = false;
            }
        }
        
        console.log(`Resolved initial matches in ${iterations} iterations`);
    }
    
    /**
     * Get a bulb at the specified row and column
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Object|null} Bulb object or null if out of bounds
     */
    getBulb(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }
    
    /**
     * Get the bulb at the specified coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object|null} Bulb object or null if out of bounds
     */
    getBulbAtCoordinates(x, y) {
        if (x < 0 || y < 0 || x >= this.cols * this.bulbSize || y >= this.rows * this.bulbSize) {
            return null;
        }
        
        const col = Math.floor(x / this.bulbSize);
        const row = Math.floor(y / this.bulbSize);
        
        return this.getBulb(row, col);
    }
    
    /**
     * Select a bulb
     * @param {Object} bulb - Bulb to select
     */
    selectBulb(bulb) {
        if (this.isSwapping || this.isFalling) {
            console.log('Cannot select bulb during animation');
            return;
        }
        
        if (!this.selectedBulb) {
            // First selection
            bulb.selected = true;
            this.selectedBulb = bulb;
            console.log(`Selected bulb at [${bulb.row}, ${bulb.col}], type: ${bulb.type}`);
        } else if (this.selectedBulb === bulb) {
            // Deselect
            bulb.selected = false;
            this.selectedBulb = null;
            console.log('Deselected bulb');
        } else if (Utils.areAdjacent(this.selectedBulb, bulb)) {
            // Swap with adjacent bulb
            console.log(`Swapping bulbs: [${this.selectedBulb.row}, ${this.selectedBulb.col}] and [${bulb.row}, ${bulb.col}]`);
            this.selectedBulb.selected = false;
            this.swapBulbs(this.selectedBulb, bulb);
            this.selectedBulb = null;
        } else {
            // Select new bulb
            this.selectedBulb.selected = false;
            bulb.selected = true;
            this.selectedBulb = bulb;
            console.log(`Selected new bulb at [${bulb.row}, ${bulb.col}], type: ${bulb.type}`);
        }
    }
    
    /**
     * Swap two bulbs
     * @param {Object} bulb1 - First bulb
     * @param {Object} bulb2 - Second bulb
     */
    swapBulbs(bulb1, bulb2) {
        if (this.isSwapping || this.isFalling) {
            console.log('Cannot swap bulbs during animation');
            return;
        }
        
        // Verify bulbs are adjacent
        if (!Utils.areAdjacent(bulb1, bulb2)) {
            console.log('Cannot swap non-adjacent bulbs');
            return;
        }
        
        this.isSwapping = true;
        
        // Set up animation properties for visual swap
        bulb1.sourceX = bulb1.x;
        bulb1.sourceY = bulb1.y;
        bulb1.targetX = bulb2.x;
        bulb1.targetY = bulb2.y;
        bulb1.animationProgress = 0;
        bulb1.isSwapping = true;
        
        bulb2.sourceX = bulb2.x;
        bulb2.sourceY = bulb2.y;
        bulb2.targetX = bulb1.x;
        bulb2.targetY = bulb1.y;
        bulb2.animationProgress = 0;
        bulb2.isSwapping = true;
        
        // Start swap animation
        this.animateSwap(bulb1, bulb2);
    }
    
    /**
     * Animate the swap between two bulbs
     * @param {Object} bulb1 - First bulb
     * @param {Object} bulb2 - Second bulb
     */
    animateSwap(bulb1, bulb2) {
        // Animation duration in milliseconds
        const duration = 200;
        const startTime = Date.now();
        
        // Play swap sound
        if (typeof Sound !== 'undefined') {
            Sound.play('swap');
        }
        
        // Swap positions in the grid immediately for correct match detection
        // Store original positions
        const bulb1OrigRow = bulb1.row;
        const bulb1OrigCol = bulb1.col;
        const bulb2OrigRow = bulb2.row;
        const bulb2OrigCol = bulb2.col;
        
        // Update row and col properties
        const tempRow = bulb1.row;
        const tempCol = bulb1.col;
        bulb1.row = bulb2.row;
        bulb1.col = bulb2.col;
        bulb2.row = tempRow;
        bulb2.col = tempCol;
        
        // Update grid references
        this.grid[bulb1.row][bulb1.col] = bulb1;
        this.grid[bulb2.row][bulb2.col] = bulb2;
        
        // Check for matches immediately after swapping positions
        const matches = this.findMatches();
        
        if (matches.length === 0) {
            // No matches - swap back immediately
            bulb1.row = bulb1OrigRow;
            bulb1.col = bulb1OrigCol;
            bulb2.row = bulb2OrigRow;
            bulb2.col = bulb2OrigCol;
            
            // Restore grid references
            this.grid[bulb1.row][bulb1.col] = bulb1;
            this.grid[bulb2.row][bulb2.col] = bulb2;
        }
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Update positions using easing function
            const t = Utils.easeInOutQuad(progress);
            
            bulb1.x = bulb1.sourceX + (bulb1.targetX - bulb1.sourceX) * t;
            bulb1.y = bulb1.sourceY + (bulb1.targetY - bulb1.sourceY) * t;
            
            bulb2.x = bulb2.sourceX + (bulb2.targetX - bulb2.sourceX) * t;
            bulb2.y = bulb2.sourceY + (bulb2.targetY - bulb2.sourceY) * t;
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                bulb1.x = bulb1.targetX;
                bulb1.y = bulb1.targetY;
                bulb2.x = bulb2.targetX;
                bulb2.y = bulb2.targetY;
                
                bulb1.isSwapping = false;
                bulb2.isSwapping = false;
                
                // Force update of x and y coordinates to match grid position
                bulb1.x = bulb1.col * this.bulbSize;
                bulb1.y = bulb1.row * this.bulbSize;
                bulb2.x = bulb2.col * this.bulbSize;
                bulb2.y = bulb2.row * this.bulbSize;
                
                if (matches.length > 0) {
                    // Valid swap - process matches
                    this.processMatches(matches);
                } else {
                    // Invalid swap - already swapped back, just play sound
                    if (typeof Sound !== 'undefined') {
                        Sound.play('invalid');
                    }
                    this.isSwapping = false;
                }
            }
        };
        
        // Start animation
        animate();
    }
    
    /**
     * Animate swapping back invalid moves
     * @param {Object} bulb1 - First bulb
     * @param {Object} bulb2 - Second bulb
     */
    animateSwapBack(bulb1, bulb2) {
        // Animation duration in milliseconds
        const duration = 200;
        const startTime = Date.now();
        
        // Play invalid move sound
        if (typeof Sound !== 'undefined') {
            Sound.play('invalid');
        }
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Update positions using easing function
            const t = Utils.easeInOutQuad(progress);
            
            bulb1.x = bulb1.sourceX + (bulb1.targetX - bulb1.sourceX) * t;
            bulb1.y = bulb1.sourceY + (bulb1.targetY - bulb1.sourceY) * t;
            
            bulb2.x = bulb2.sourceX + (bulb2.targetX - bulb2.sourceX) * t;
            bulb2.y = bulb2.sourceY + (bulb2.targetY - bulb2.sourceY) * t;
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                bulb1.x = bulb1.targetX;
                bulb1.y = bulb1.targetY;
                bulb2.x = bulb2.targetX;
                bulb2.y = bulb2.targetY;
                
                // Reset swap flags
                bulb1.isSwapping = false;
                bulb2.isSwapping = false;
                this.isSwapping = false;
            }
        };
        
        // Start animation
        animate();
    }
    
    /**
     * Find all matches on the board
     * @returns {Array} Array of matched bulbs
     */
    findMatches() {
        const matches = [];
        const matchedPositions = new Set(); // Track positions to avoid duplicates
        
        console.log(`Finding matches on the board...`);
        
        // Debug: Print the entire board state
        console.log("Current board state:");
        for (let row = 0; row < this.rows; row++) {
            let rowStr = "";
            for (let col = 0; col < this.cols; col++) {
                const bulb = this.grid[row][col];
                if (bulb) {
                    rowStr += bulb.type.charAt(0) + " ";
                } else {
                    rowStr += "- ";
                }
            }
            console.log(rowStr);
        }
        
        // Check horizontal matches
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 2; col++) {
                const bulb = this.grid[row][col];
                if (!bulb) {
                    console.error(`Missing bulb at [${row},${col}]`);
                    continue;
                }
                
                const type = bulb.type;
                const bulb2 = this.grid[row][col + 1];
                const bulb3 = this.grid[row][col + 2];
                
                if (!bulb2 || !bulb3) {
                    console.error(`Missing adjacent bulbs at row ${row}, col ${col}`);
                    continue;
                }
                
                // Check if we have at least 3 in a row
                if (bulb2.type === type && bulb3.type === type) {
                    console.log(`Found horizontal match at [${row},${col}] of type ${type}`);
                    
                    // Find how far this match extends
                    let matchLength = 3;
                    while (col + matchLength < this.cols) {
                        const nextBulb = this.grid[row][col + matchLength];
                        if (nextBulb && nextBulb.type === type) {
                            matchLength++;
                        } else {
                            break;
                        }
                    }
                    
                    console.log(`Match extends to length ${matchLength}`);
                    
                    // Add all bulbs in this match
                    for (let i = 0; i < matchLength; i++) {
                        const pos = `${row},${col + i}`;
                        if (!matchedPositions.has(pos)) {
                            matchedPositions.add(pos);
                            const matchBulb = this.grid[row][col + i];
                            if (matchBulb) {
                                matches.push(matchBulb);
                            } else {
                                console.error(`Missing bulb in match at [${row},${col + i}]`);
                            }
                        }
                    }
                    
                    // Skip ahead
                    col += matchLength - 1;
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows - 2; row++) {
                const bulb = this.grid[row][col];
                if (!bulb) {
                    console.error(`Missing bulb at [${row},${col}]`);
                    continue;
                }
                
                const type = bulb.type;
                const bulb2 = this.grid[row + 1][col];
                const bulb3 = this.grid[row + 2][col];
                
                if (!bulb2 || !bulb3) {
                    console.error(`Missing adjacent bulbs at row ${row}, col ${col}`);
                    continue;
                }
                
                // Check if we have at least 3 in a column
                if (bulb2.type === type && bulb3.type === type) {
                    console.log(`Found vertical match at [${row},${col}] of type ${type}`);
                    
                    // Find how far this match extends
                    let matchLength = 3;
                    while (row + matchLength < this.rows) {
                        const nextBulb = this.grid[row + matchLength][col];
                        if (nextBulb && nextBulb.type === type) {
                            matchLength++;
                        } else {
                            break;
                        }
                    }
                    
                    console.log(`Match extends to length ${matchLength}`);
                    
                    // Add all bulbs in this match
                    for (let i = 0; i < matchLength; i++) {
                        const pos = `${row + i},${col}`;
                        if (!matchedPositions.has(pos)) {
                            matchedPositions.add(pos);
                            const matchBulb = this.grid[row + i][col];
                            if (matchBulb) {
                                matches.push(matchBulb);
                            } else {
                                console.error(`Missing bulb in match at [${row + i},${col}]`);
                            }
                        }
                    }
                    
                    // Skip ahead
                    row += matchLength - 1;
                }
            }
        }
        
        console.log(`Found ${matches.length} matching bulbs`);
        return matches;
    }
    
    /**
     * Process matches
     * @param {Array} matches - Array of matched bulbs
     */
    processMatches(matches) {
        if (matches.length === 0) {
            this.isSwapping = false;
            return;
        }
        
        console.log(`Processing ${matches.length} matches`);
        
        // Store matched bulbs for later reference
        this.matchedBulbs = [...matches];
        
        // Mark bulbs as matched
        for (const bulb of matches) {
            console.log(`Marking bulb at [${bulb.row},${bulb.col}] of type ${bulb.type} as matched`);
            bulb.matched = true;
            bulb.animationProgress = 0;
            bulb.matchTime = Date.now();
            bulb.explosionRadius = 0;
            bulb.explosionParticles = [];
            
            // Create explosion particles
            const particleCount = 8 + Math.floor(Math.random() * 5);
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const speed = 1 + Math.random() * 2;
                bulb.explosionParticles.push({
                    angle: angle,
                    distance: 0,
                    speed: speed,
                    size: 2 + Math.random() * 3,
                    color: bulb.type
                });
            }
        }
        
        // Calculate score
        const matchScore = this.calculateScore(matches);
        if (this.gameInstance) {
            this.gameInstance.addScore(matchScore);
        }
        
        // Play match sound
        if (typeof Sound !== 'undefined') {
            Sound.play('match');
        }
        
        // After a shorter delay, remove matches and trigger cascade
        console.log(`Scheduling removal of matches in 500ms`);
        setTimeout(() => {
            this.removeMatches(this.matchedBulbs);
        }, 500); // Reduced to 0.5 seconds
    }
    
    /**
     * Calculate score for matches
     * @param {Array} matches - Array of matched bulbs
     * @returns {number} Score for these matches
     */
    calculateScore(matches) {
        // Enhanced scoring: base 100 points per bulb with bonus for larger matches
        const baseScore = matches.length * 100;
        let bonus = 0;
        
        // Bonus for matches larger than 3
        if (matches.length > 3) {
            bonus = (matches.length - 3) * 50;
        }
        
        return baseScore + bonus;
    }
    
    /**
     * Remove matched bulbs and trigger cascade
     * @param {Array} matches - Array of matched bulbs
     */
    removeMatches(matches) {
        console.log(`Removing ${matches.length} matched bulbs`);
        
        // Create a map to track empty positions
        const emptyPositions = new Map();
        
        // Mark positions as empty
        for (const bulb of matches) {
            console.log(`Processing matched bulb at [${bulb.row},${bulb.col}] of type ${bulb.type}`);
            const col = bulb.col;
            if (!emptyPositions.has(col)) {
                emptyPositions.set(col, []);
            }
            emptyPositions.get(col).push(bulb.row);
            bulb.matched = false;
        }
        
        // Clear the matched bulbs array
        this.matchedBulbs = [];
        
        // Process each column with empty positions
        for (const [col, rows] of emptyPositions.entries()) {
            console.log(`Processing column ${col} with ${rows.length} empty positions`);
            
            // Sort rows in descending order (bottom to top)
            rows.sort((a, b) => b - a);
            
            // For each empty position, move bulbs down
            for (const emptyRow of rows) {
                console.log(`Processing empty position at [${emptyRow},${col}]`);
                
                // Move all bulbs above this position down
                for (let row = emptyRow; row > 0; row--) {
                    const bulbAbove = this.grid[row - 1][col];
                    const currentBulb = this.grid[row][col];
                    
                    console.log(`Moving bulb from [${row-1},${col}] to [${row},${col}]`);
                    
                    // Copy properties from bulb above
                    currentBulb.type = bulbAbove.type;
                    
                    // Update row reference for the bulb that's moving down
                    bulbAbove.row = row;
                    
                    // Set animation properties with staggered timing for more dynamic effect
                    currentBulb.sourceY = bulbAbove.y;
                    currentBulb.targetY = currentBulb.y;
                    currentBulb.animationProgress = 0;
                    currentBulb.isFalling = true;
                    
                    // Add slight delay based on position for cascading effect
                    currentBulb.fallDelay = (emptyRow - row) * 20; // 20ms delay per row
                }
                
                // Create a new bulb at the top
                const topBulb = this.grid[0][col];
                const newType = Utils.bulbTypes[Utils.randomInt(0, Utils.bulbTypes.length - 1)];
                console.log(`Creating new bulb of type ${newType} at [0,${col}]`);
                topBulb.type = newType;
                topBulb.row = 0; // Ensure row is set correctly
                topBulb.col = col; // Ensure column is set correctly
                topBulb.sourceY = -this.bulbSize * 1.5; // Start further above the board for more dramatic fall
                topBulb.targetY = topBulb.y;
                topBulb.animationProgress = 0;
                topBulb.isFalling = true;
                topBulb.fallDelay = 0; // No delay for top bulbs
            }
        }
        
        // Set falling state
        this.isFalling = true;
        
        // Play falling sound
        if (typeof Sound !== 'undefined') {
            Sound.play('fall');
        }
        
        console.log(`Scheduling check for new matches in 500ms`);
        
        // Wait for animations to complete before checking for new matches
        // Reduced to 0.5 seconds total
        setTimeout(() => {
            this.isFalling = false;
            console.log(`Fall animation complete, checking for new matches`);
            
            // Ensure all bulbs have correct positions in the grid
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const bulb = this.grid[row][col];
                    bulb.row = row;
                    bulb.col = col;
                    bulb.x = col * this.bulbSize;
                    bulb.y = row * this.bulbSize;
                    bulb.targetX = bulb.x;
                    bulb.targetY = bulb.y;
                    bulb.isFalling = false;
                }
            }
            
            // Debug: Print the board state after falling
            console.log("Board state after falling:");
            for (let row = 0; row < this.rows; row++) {
                let rowStr = "";
                for (let col = 0; col < this.cols; col++) {
                    const bulb = this.grid[row][col];
                    if (bulb) {
                        rowStr += bulb.type.charAt(0) + " ";
                    } else {
                        rowStr += "- ";
                    }
                }
                console.log(rowStr);
            }
            
            // Check for new matches
            const newMatches = this.findMatches();
            console.log(`Found ${newMatches.length} new matches after falling`);
            
            if (newMatches.length > 0) {
                this.processMatches(newMatches);
            } else {
                this.isSwapping = false;
                console.log(`No new matches, ready for next move`);
            }
        }, 500); // 500ms total animation time
    }
    
    /**
     * Update animations
     * @param {number} deltaTime - Time since last update in ms
     */
    updateAnimations(deltaTime) {
        const animationSpeed = 0.008; // Faster animation speed for more dynamic movement
        let needsRedraw = false;
        
        // Update falling animations
        if (this.isFalling) {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const bulb = this.grid[row][col];
                    if (bulb.isFalling) {
                        bulb.animationProgress += animationSpeed * deltaTime;
                        
                        if (bulb.animationProgress >= 1) {
                            bulb.animationProgress = 1;
                            bulb.y = bulb.targetY;
                            bulb.isFalling = false;
                            
                            // Add bounce effect at the end of falling
                            if (row === this.rows - 1 || !this.grid[row + 1][col].isFalling) {
                                bulb.bounceTime = Date.now();
                                bulb.isBouncing = true;
                            }
                        } else {
                            // Use elastic easing for more dynamic fall
                            const t = Utils.easeOutElastic(bulb.animationProgress);
                            bulb.y = bulb.sourceY + (bulb.targetY - bulb.sourceY) * t;
                            needsRedraw = true;
                        }
                    }
                    
                    // Handle bounce animation
                    if (bulb.isBouncing) {
                        const bounceElapsed = Date.now() - bulb.bounceTime;
                        if (bounceElapsed > 300) { // Shorter bounce animation (300ms)
                            bulb.isBouncing = false;
                        } else {
                            needsRedraw = true;
                        }
                    }
                    
                    // Handle match animation
                    if (bulb.matched) {
                        needsRedraw = true;
                    }
                    
                    // Handle swap animation
                    if (bulb.isSwapping) {
                        needsRedraw = true;
                    }
                }
            }
        }
        
        // Always redraw when there are matched bulbs
        if (this.matchedBulbs.length > 0) {
            needsRedraw = true;
        }
        
        return needsRedraw;
    }
    
    /**
     * Render the board
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        if (!ctx) {
            console.error('Canvas context is not available');
            return;
        }
        
        // Clear the canvas area for the board
        ctx.clearRect(0, 0, this.cols * this.bulbSize, this.rows * this.bulbSize);
        
        // Draw background grid with subtle pattern
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // Alternating pattern for better visual appeal
                const isEven = (row + col) % 2 === 0;
                ctx.fillStyle = isEven ? Utils.colors.backgroundLight : Utils.colors.backgroundMedium;
                
                ctx.fillRect(
                    col * this.bulbSize, 
                    row * this.bulbSize, 
                    this.bulbSize, 
                    this.bulbSize
                );
            }
        }
        
        // Draw subtle grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        // Draw horizontal grid lines
        for (let row = 0; row <= this.rows; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * this.bulbSize);
            ctx.lineTo(this.cols * this.bulbSize, row * this.bulbSize);
            ctx.stroke();
        }
        
        // Draw vertical grid lines
        for (let col = 0; col <= this.cols; col++) {
            ctx.beginPath();
            ctx.moveTo(col * this.bulbSize, 0);
            ctx.lineTo(col * this.bulbSize, this.rows * this.bulbSize);
            ctx.stroke();
        }
        
        // Draw bulbs
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const bulb = this.getBulb(row, col);
                if (bulb) {
                    this.drawBulb(ctx, bulb);
                }
            }
        }
        
        // Draw falling bulbs above the board if needed
        for (let col = 0; col < this.cols; col++) {
            const topBulb = this.grid[0][col];
            if (topBulb.isFalling && topBulb.y < 0) {
                this.drawBulb(ctx, topBulb);
            }
        }
    }
    
    /**
     * Draw a single bulb
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} bulb - Bulb to draw
     */
    drawBulb(ctx, bulb) {
        const x = bulb.x;
        const y = bulb.y;
        const size = this.bulbSize;
        const padding = size * 0.1;
        const bulbRadius = (size - padding * 2) / 2;
        
        // If bulb is matched, draw explosion effect
        if (bulb.matched) {
            // Calculate explosion progress (0-1)
            const elapsed = Date.now() - bulb.matchTime;
            const explosionProgress = Math.min(elapsed / 500, 1); // 500ms explosion animation
            
            // Get bulb color
            let bulbColor;
            switch (bulb.type) {
                case 'red': bulbColor = Utils.colors.red; break;
                case 'yellow': bulbColor = Utils.colors.yellow; break;
                case 'blue': bulbColor = Utils.colors.blue; break;
                case 'green': bulbColor = Utils.colors.green; break;
                default: bulbColor = '#FFF';
            }
            
            // Draw explosion particles
            if (bulb.explosionParticles) {
                for (const particle of bulb.explosionParticles) {
                    const distance = particle.speed * explosionProgress * bulbRadius * 2;
                    const particleX = x + size/2 + Math.cos(particle.angle) * distance;
                    const particleY = y + size/2 + Math.sin(particle.angle) * distance;
                    const particleSize = particle.size * (1 - explosionProgress * 0.5);
                    
                    // Draw particle with fade-out
                    ctx.globalAlpha = 1 - explosionProgress;
                    ctx.fillStyle = bulbColor;
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw particle glow
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, particleSize * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
            
            // Draw shrinking bulb
            const shrinkFactor = 1 - explosionProgress * 0.8;
            
            // Draw bulb with shrinking effect
            ctx.globalAlpha = 1 - explosionProgress;
            
            // Draw bulb background
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, bulbRadius * shrinkFactor, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw bulb color with gradient
            const gradient = ctx.createRadialGradient(
                x + size/2, y + size/2, 0,
                x + size/2, y + size/2, bulbRadius * shrinkFactor
            );
            gradient.addColorStop(0, bulbColor);
            gradient.addColorStop(0.7, bulbColor);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, (bulbRadius - 2) * shrinkFactor, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw explosion ring
            const ringRadius = explosionProgress * bulbRadius * 2.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * (1 - explosionProgress)})`;
            ctx.lineWidth = 3 * (1 - explosionProgress);
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw second explosion ring
            const ringRadius2 = explosionProgress * bulbRadius * 1.8;
            ctx.strokeStyle = `rgba(${bulbColor.substr(1, 6)}, ${0.6 * (1 - explosionProgress)})`;
            ctx.lineWidth = 2 * (1 - explosionProgress);
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, ringRadius2, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.globalAlpha = 1;
            return; // Skip normal bulb drawing
        }
        
        // Normal bulb drawing (not exploding)
        // Draw bulb background (circle)
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, bulbRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bulb color
        let bulbColor;
        switch (bulb.type) {
            case 'red': bulbColor = Utils.colors.red; break;
            case 'yellow': bulbColor = Utils.colors.yellow; break;
            case 'blue': bulbColor = Utils.colors.blue; break;
            case 'green': bulbColor = Utils.colors.green; break;
            default: bulbColor = '#FFF';
        }
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, bulbRadius
        );
        gradient.addColorStop(0, bulbColor);
        gradient.addColorStop(0.7, bulbColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, bulbRadius - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x + size/2 - bulbRadius/3, y + size/2 - bulbRadius/3, bulbRadius/6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw selection indicator
        if (bulb.selected) {
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, bulbRadius + 2, 0, Math.PI * 2);
            ctx.stroke();
            
            // Add pulsing effect for selected bulb
            const glowSize = bulbRadius + 5 + Math.sin(Date.now() / 200) * 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, glowSize, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Add bounce effect for bulbs that just landed
        if (bulb.isBouncing) {
            const bounceElapsed = Date.now() - bulb.bounceTime;
            const bounceProgress = Math.min(bounceElapsed / 300, 1); // 300ms bounce animation
            const bounceScale = 1 + 0.15 * Math.sin(bounceProgress * Math.PI) * (1 - bounceProgress);
            
            // Draw bounce indicator
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2 * (1 - bounceProgress);
            ctx.beginPath();
            ctx.arc(x + size/2, y + size/2, bulbRadius * bounceScale, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}