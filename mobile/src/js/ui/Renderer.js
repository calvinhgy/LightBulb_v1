/**
 * Renderer.js
 * Handles rendering the game board and visual effects
 */
class Renderer {
    /**
     * Create a new renderer
     * @param {Object} config - Renderer configuration
     * @param {HTMLCanvasElement} config.gameBoard - Canvas for the game board
     * @param {HTMLCanvasElement} config.gameBackground - Canvas for the background
     * @param {HTMLCanvasElement} config.gameEffects - Canvas for visual effects
     * @param {Object} config.gridSize - Grid dimensions {width, height}
     */
    constructor(config) {
        this.gameBoard = config.gameBoard;
        this.gameBackground = config.gameBackground;
        this.gameEffects = config.gameEffects;
        
        this.gridSize = config.gridSize || { width: 8, height: 10 };
        
        // Get canvas contexts
        this.boardCtx = this.gameBoard.getContext('2d');
        this.bgCtx = this.gameBackground.getContext('2d');
        this.fxCtx = this.gameEffects.getContext('2d');
        
        // Cell size and grid position
        this.cellSize = 0;
        this.gridOffset = { x: 0, y: 0 };
        
        // Image cache
        this.images = {};
        
        // Initialize
        this._init();
    }
    
    /**
     * Initialize the renderer
     * @private
     */
    _init() {
        // Set up canvas sizes
        this._resizeCanvases();
        
        // Calculate cell size and grid position
        this._calculateGridDimensions();
        
        // Draw background
        this._drawBackground();
        
        // Set up resize listener
        window.addEventListener('resize', () => {
            this._resizeCanvases();
            this._calculateGridDimensions();
            this._drawBackground();
        });
        
        // Load images
        this._loadImages();
    }
    
    /**
     * Set the grid size
     * @param {Object} gridSize - Grid dimensions {width, height}
     */
    setGridSize(gridSize) {
        this.gridSize = gridSize;
        this._calculateGridDimensions();
        this._drawBackground();
    }
    
    /**
     * Resize canvases to match container size
     * @private
     */
    _resizeCanvases() {
        const container = this.gameBoard.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Set canvas dimensions
        [this.gameBoard, this.gameBackground, this.gameEffects].forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        });
    }
    
    /**
     * Calculate cell size and grid position
     * @private
     */
    _calculateGridDimensions() {
        const width = this.gameBoard.width;
        const height = this.gameBoard.height;
        
        // Calculate cell size to fit the grid within the canvas
        // with some padding (90% of available space)
        const maxCellWidth = Math.floor(width * 0.9 / this.gridSize.width);
        const maxCellHeight = Math.floor(height * 0.9 / this.gridSize.height);
        
        // Use the smaller dimension to ensure square cells
        this.cellSize = Math.min(maxCellWidth, maxCellHeight);
        
        // Calculate grid offset to center the grid
        const gridWidth = this.cellSize * this.gridSize.width;
        const gridHeight = this.cellSize * this.gridSize.height;
        
        this.gridOffset = {
            x: Math.floor((width - gridWidth) / 2),
            y: Math.floor((height - gridHeight) / 2)
        };
    }
    
    /**
     * Draw the background
     * @private
     */
    _drawBackground() {
        const ctx = this.bgCtx;
        const width = this.gameBackground.width;
        const height = this.gameBackground.height;
        
        // Clear background
        ctx.clearRect(0, 0, width, height);
        
        // Draw dark background
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid background
        const gridWidth = this.cellSize * this.gridSize.width;
        const gridHeight = this.cellSize * this.gridSize.height;
        
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(
            this.gridOffset.x - 10,
            this.gridOffset.y - 10,
            gridWidth + 20,
            gridHeight + 20
        );
        
        // Draw grid cells
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const cellX = this.gridOffset.x + x * this.cellSize;
                const cellY = this.gridOffset.y + y * this.cellSize;
                
                // Draw cell background
                ctx.fillStyle = '#222222';
                ctx.fillRect(
                    cellX + 1,
                    cellY + 1,
                    this.cellSize - 2,
                    this.cellSize - 2
                );
                
                // Draw cell border
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    cellX + 0.5,
                    cellY + 0.5,
                    this.cellSize - 1,
                    this.cellSize - 1
                );
            }
        }
    }
    
    /**
     * Load images for rendering
     * @private
     */
    _loadImages() {
        // Use preloader to get images
        const preloader = window.preloader;
        if (!preloader) return;
        
        // Load bulb images
        const colors = ['red', 'yellow', 'blue', 'green'];
        const states = ['', '_selected', '_line', '_bomb'];
        
        for (const color of colors) {
            for (const state of states) {
                const key = `bulb_${color}${state}`;
                this.images[key] = preloader.getImage(key);
            }
        }
        
        // Load rainbow bulb
        this.images['bulb_rainbow'] = preloader.getImage('bulb_rainbow');
        
        // Load other images
        this.images['background'] = preloader.getImage('background');
        this.images['grid_cell'] = preloader.getImage('grid_cell');
    }
    
    /**
     * Render the game board
     * @param {Array<Array<LightBulb>>} grid - Game grid
     */
    render(grid) {
        const ctx = this.boardCtx;
        
        // Clear the canvas
        ctx.clearRect(0, 0, this.gameBoard.width, this.gameBoard.height);
        
        // Render each bulb
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const bulb = grid[y][x];
                if (bulb) {
                    this._renderBulb(ctx, bulb);
                }
            }
        }
    }
    
    /**
     * Render a light bulb
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {LightBulb} bulb - Light bulb to render
     * @private
     */
    _renderBulb(ctx, bulb) {
        // Calculate pixel position
        const pixelX = this.gridOffset.x + bulb.gridX * this.cellSize;
        const pixelY = this.gridOffset.y + bulb.gridY * this.cellSize;
        
        // If bulb is animating, use its current position
        const x = bulb.isFalling ? bulb.x : pixelX;
        const y = bulb.isFalling ? bulb.y : pixelY;
        
        // Set bulb's target position for animations
        bulb.targetX = pixelX;
        bulb.targetY = pixelY;
        
        // If bulb is not visible, don't render
        if (bulb.alpha <= 0) {
            return;
        }
        
        // Get the appropriate image based on bulb state
        let imageKey = `bulb_${bulb.color}`;
        
        if (bulb.type !== 'regular') {
            imageKey = bulb.type === 'rainbow' ? 'bulb_rainbow' : `${imageKey}_${bulb.type}`;
        } else if (bulb.isSelected) {
            imageKey = `${imageKey}_selected`;
        }
        
        const image = this.images[imageKey];
        if (!image) return;
        
        // Save context state
        ctx.save();
        
        // Apply transformations
        ctx.translate(x + this.cellSize / 2, y + this.cellSize / 2);
        ctx.rotate(bulb.rotation);
        ctx.scale(bulb.scale, bulb.scale);
        ctx.globalAlpha = bulb.alpha;
        
        // Draw bulb
        const size = this.cellSize * 0.9; // Slightly smaller than cell
        ctx.drawImage(
            image,
            -size / 2,
            -size / 2,
            size,
            size
        );
        
        // Draw glow effect if selected or special
        if (bulb.glowIntensity > 0 || bulb.type !== 'regular') {
            const glowSize = size * (1 + bulb.glowIntensity * 0.2);
            ctx.globalAlpha = bulb.glowIntensity * 0.5;
            
            // Set glow color based on bulb type/color
            let glowColor;
            switch (bulb.type) {
                case 'line':
                    glowColor = '#ffffff';
                    break;
                case 'bomb':
                    glowColor = '#ff9900';
                    break;
                case 'rainbow':
                    glowColor = '#ff00ff';
                    break;
                default:
                    switch (bulb.color) {
                        case 'red': glowColor = '#ff0000'; break;
                        case 'yellow': glowColor = '#ffcc00'; break;
                        case 'blue': glowColor = '#0099ff'; break;
                        case 'green': glowColor = '#00cc00'; break;
                        default: glowColor = '#ffffff';
                    }
            }
            
            // Create radial gradient for glow
            const gradient = ctx.createRadialGradient(0, 0, size / 2, 0, 0, glowSize / 2);
            gradient.addColorStop(0, `${glowColor}80`); // Semi-transparent
            gradient.addColorStop(1, `${glowColor}00`); // Transparent
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Restore context state
        ctx.restore();
    }
    
    /**
     * Render visual effects
     * @param {string} effectType - Type of effect
     * @param {Object} params - Effect parameters
     */
    renderEffect(effectType, params) {
        const ctx = this.fxCtx;
        
        // Clear previous effects
        ctx.clearRect(0, 0, this.gameEffects.width, this.gameEffects.height);
        
        switch (effectType) {
            case 'match':
                this._renderMatchEffect(ctx, params);
                break;
            case 'swap':
                this._renderSwapEffect(ctx, params);
                break;
            case 'hint':
                this._renderHintEffect(ctx, params);
                break;
            case 'special':
                this._renderSpecialEffect(ctx, params);
                break;
        }
    }
    
    /**
     * Render match effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Effect parameters
     * @private
     */
    _renderMatchEffect(ctx, params) {
        const { bulbs, progress } = params;
        
        for (const bulb of bulbs) {
            const x = this.gridOffset.x + bulb.gridX * this.cellSize + this.cellSize / 2;
            const y = this.gridOffset.y + bulb.gridY * this.cellSize + this.cellSize / 2;
            
            // Create particle effect
            const particleCount = 10;
            const particleSize = this.cellSize * 0.1;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const distance = this.cellSize * 0.5 * progress;
                
                const px = x + Math.cos(angle) * distance;
                const py = y + Math.sin(angle) * distance;
                
                // Set particle color based on bulb color
                let particleColor;
                switch (bulb.color) {
                    case 'red': particleColor = '#ff0000'; break;
                    case 'yellow': particleColor = '#ffcc00'; break;
                    case 'blue': particleColor = '#0099ff'; break;
                    case 'green': particleColor = '#00cc00'; break;
                    default: particleColor = '#ffffff';
                }
                
                ctx.fillStyle = particleColor;
                ctx.globalAlpha = 1 - progress;
                ctx.beginPath();
                ctx.arc(px, py, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    /**
     * Render swap effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Effect parameters
     * @private
     */
    _renderSwapEffect(ctx, params) {
        const { bulb1, bulb2, progress } = params;
        
        // Draw arrow between bulbs
        const x1 = this.gridOffset.x + bulb1.gridX * this.cellSize + this.cellSize / 2;
        const y1 = this.gridOffset.y + bulb1.gridY * this.cellSize + this.cellSize / 2;
        const x2 = this.gridOffset.x + bulb2.gridX * this.cellSize + this.cellSize / 2;
        const y2 = this.gridOffset.y + bulb2.gridY * this.cellSize + this.cellSize / 2;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.5 * (1 - progress);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    /**
     * Render hint effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Effect parameters
     * @private
     */
    _renderHintEffect(ctx, params) {
        const { x, y, progress } = params;
        
        const cellX = this.gridOffset.x + x * this.cellSize;
        const cellY = this.gridOffset.y + y * this.cellSize;
        
        // Draw pulsing highlight
        const pulseSize = 1 + 0.1 * Math.sin(progress * Math.PI * 2);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2);
        
        ctx.strokeRect(
            cellX + (1 - pulseSize) * this.cellSize / 2,
            cellY + (1 - pulseSize) * this.cellSize / 2,
            this.cellSize * pulseSize,
            this.cellSize * pulseSize
        );
    }
    
    /**
     * Render special effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Effect parameters
     * @private
     */
    _renderSpecialEffect(ctx, params) {
        const { bulb, type, progress } = params;
        
        const x = this.gridOffset.x + bulb.gridX * this.cellSize + this.cellSize / 2;
        const y = this.gridOffset.y + bulb.gridY * this.cellSize + this.cellSize / 2;
        
        switch (type) {
            case 'line':
                // Draw line effect
                const lineLength = this.cellSize * 5 * progress;
                
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = this.cellSize * 0.2;
                ctx.globalAlpha = 0.7 * (1 - progress);
                
                ctx.beginPath();
                
                if (params.direction === 'horizontal') {
                    ctx.moveTo(x - lineLength / 2, y);
                    ctx.lineTo(x + lineLength / 2, y);
                } else {
                    ctx.moveTo(x, y - lineLength / 2);
                    ctx.lineTo(x, y + lineLength / 2);
                }
                
                ctx.stroke();
                break;
                
            case 'bomb':
                // Draw explosion effect
                const radius = this.cellSize * 2 * progress;
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 128, 0, 0.5)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'rainbow':
                // Draw rainbow effect
                const colors = ['#ff0000', '#ffcc00', '#00cc00', '#0099ff', '#9900ff'];
                
                for (let i = 0; i < colors.length; i++) {
                    const ringRadius = this.cellSize * (i + 1) * progress;
                    const ringWidth = this.cellSize * 0.2;
                    
                    ctx.strokeStyle = colors[i];
                    ctx.lineWidth = ringWidth;
                    ctx.globalAlpha = 0.7 * (1 - progress);
                    
                    ctx.beginPath();
                    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;
        }
    }
    
    /**
     * Convert screen coordinates to grid coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object|null} Grid coordinates {x, y} or null if outside grid
     */
    screenToGridCoordinates(screenX, screenY) {
        // Get position relative to grid
        const relX = screenX - this.gridOffset.x;
        const relY = screenY - this.gridOffset.y;
        
        // Convert to grid coordinates
        const gridX = Math.floor(relX / this.cellSize);
        const gridY = Math.floor(relY / this.cellSize);
        
        // Check if within grid bounds
        if (gridX >= 0 && gridX < this.gridSize.width && 
            gridY >= 0 && gridY < this.gridSize.height) {
            return { x: gridX, y: gridY };
        }
        
        return null;
    }
    
    /**
     * Convert grid coordinates to screen coordinates
     * @param {number} gridX - Grid X coordinate
     * @param {number} gridY - Grid Y coordinate
     * @returns {Object} Screen coordinates {x, y}
     */
    gridToScreenCoordinates(gridX, gridY) {
        return {
            x: this.gridOffset.x + gridX * this.cellSize + this.cellSize / 2,
            y: this.gridOffset.y + gridY * this.cellSize + this.cellSize / 2
        };
    }
}
