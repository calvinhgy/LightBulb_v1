/**
 * Debug utilities for development
 */
const Debug = {
    /**
     * Enable debug mode
     */
    enabled: true,
    
    /**
     * Log a message if debug is enabled
     * @param {string} message - Message to log
     */
    log: function(message) {
        if (this.enabled) {
            console.log(`[DEBUG] ${message}`);
        }
    },
    
    /**
     * Log an error
     * @param {string} message - Error message
     */
    error: function(message) {
        console.error(`[ERROR] ${message}`);
    },
    
    /**
     * Log a warning
     * @param {string} message - Warning message
     */
    warn: function(message) {
        console.warn(`[WARNING] ${message}`);
    },
    
    /**
     * Toggle debug grid overlay
     * @param {boolean} show - Whether to show the grid
     */
    showGrid: function(show) {
        this.showDebugGrid = show;
    },
    
    /**
     * Draw debug information on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Game} game - Game instance
     */
    drawDebugInfo: function(ctx, game) {
        if (!this.enabled) return;
        
        // Save context state
        ctx.save();
        
        // Draw FPS counter
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`FPS: ${Math.round(1000 / game.deltaTime)}`, 10, 20);
        
        // Draw board dimensions
        ctx.fillText(`Board: ${game.board.rows}x${game.board.cols}`, 10, 40);
        
        // Draw bulb size
        ctx.fillText(`Bulb size: ${game.bulbSize}px`, 10, 60);
        
        // Restore context state
        ctx.restore();
    }
};

console.log('Debug module loaded');