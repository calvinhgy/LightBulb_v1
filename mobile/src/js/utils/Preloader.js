/**
 * Preloader.js
 * Handles preloading of game assets
 */
class Preloader {
    /**
     * Create a new preloader
     */
    constructor() {
        this.images = {};
        this.loadPromises = [];
    }
    
    /**
     * Load an image
     * @param {string} key - Key to store the image under
     * @param {string} src - Image source URL
     * @returns {Promise} Promise that resolves when the image is loaded
     */
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                // Create a placeholder image
                const placeholderImg = this._createPlaceholderImage(key);
                this.images[key] = placeholderImg;
                resolve(placeholderImg);
            };
            img.src = src;
        });
    }
    
    /**
     * Create a placeholder image for missing assets
     * @param {string} key - Key of the missing image
     * @returns {HTMLCanvasElement} Canvas element with placeholder image
     * @private
     */
    _createPlaceholderImage(key) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Parse the key to determine what kind of placeholder to create
        let color = '#ffffff';
        let type = 'regular';
        
        if (key.startsWith('bulb_')) {
            const parts = key.substring(5).split('_');
            
            // Get color
            switch (parts[0]) {
                case 'red': color = '#ff0000'; break;
                case 'yellow': color = '#ffcc00'; break;
                case 'blue': color = '#0099ff'; break;
                case 'green': color = '#00cc00'; break;
                case 'rainbow': 
                    this._drawRainbowBulb(ctx);
                    return canvas;
            }
            
            // Get type
            if (parts.length > 1) {
                type = parts[1];
            }
        }
        
        // Draw the appropriate placeholder
        switch (type) {
            case 'regular': this._drawRegularBulb(ctx, color); break;
            case 'selected': this._drawSelectedBulb(ctx, color); break;
            case 'line': this._drawLineBulb(ctx, color); break;
            case 'bomb': this._drawBombBulb(ctx, color); break;
            default: this._drawRegularBulb(ctx, color);
        }
        
        return canvas;
    }
    
    /**
     * Draw a regular bulb placeholder
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} color - Bulb color
     * @private
     */
    _drawRegularBulb(ctx, color) {
        // Clear canvas
        ctx.clearRect(0, 0, 128, 128);
        
        // Draw bulb
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(64, 64, 48, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(48, 48, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glow
        const gradient = ctx.createRadialGradient(64, 64, 48, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(64, 64, 64, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * Draw a selected bulb placeholder
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} color - Bulb color
     * @private
     */
    _drawSelectedBulb(ctx, color) {
        // Draw regular bulb
        this._drawRegularBulb(ctx, color);
        
        // Add selection glow
        const gradient = ctx.createRadialGradient(64, 64, 48, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(64, 64, 64, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw selection ring
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(64, 64, 56, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    /**
     * Draw a line bulb placeholder
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} color - Bulb color
     * @private
     */
    _drawLineBulb(ctx, color) {
        // Draw regular bulb
        this._drawRegularBulb(ctx, color);
        
        // Draw line symbol
        ctx.fillStyle = 'white';
        ctx.fillRect(32, 60, 64, 8);
        
        // Draw perpendicular line
        ctx.fillRect(60, 32, 8, 64);
    }
    
    /**
     * Draw a bomb bulb placeholder
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} color - Bulb color
     * @private
     */
    _drawBombBulb(ctx, color) {
        // Draw regular bulb
        this._drawRegularBulb(ctx, color);
        
        // Draw bomb symbol
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(64, 64, 24, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fuse
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(64, 40);
        ctx.quadraticCurveTo(80, 30, 90, 40);
        ctx.stroke();
        
        // Draw spark
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(90, 40, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * Draw a rainbow bulb placeholder
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @private
     */
    _drawRainbowBulb(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, 128, 128);
        
        // Create rainbow gradient
        const gradient = ctx.createLinearGradient(16, 16, 112, 112);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.2, 'orange');
        gradient.addColorStop(0.4, 'yellow');
        gradient.addColorStop(0.6, 'green');
        gradient.addColorStop(0.8, 'blue');
        gradient.addColorStop(1, 'purple');
        
        // Draw bulb
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(64, 64, 48, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(48, 48, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glow
        const glowGradient = ctx.createRadialGradient(64, 64, 48, 64, 64, 64);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(64, 64, 64, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw star symbol
        ctx.fillStyle = 'white';
        ctx.beginPath();
        this._drawStar(ctx, 64, 64, 5, 24, 12);
        ctx.fill();
    }
    
    /**
     * Draw a star shape
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} spikes - Number of spikes
     * @param {number} outerRadius - Outer radius
     * @param {number} innerRadius - Inner radius
     * @private
     */
    _drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
    
    /**
     * Load all game assets
     * @returns {Promise} Promise that resolves when all assets are loaded
     */
    loadAll() {
        // Create placeholders immediately instead of trying to load images
        const colors = ['red', 'yellow', 'blue', 'green'];
        const types = ['', '_selected', '_line', '_bomb'];
        
        // Create all bulb images directly
        for (const color of colors) {
            for (const type of types) {
                const key = `bulb_${color}${type}`;
                this.images[key] = this._createPlaceholderImage(key);
                console.log(`Created placeholder for ${key}`);
            }
        }
        
        // Create rainbow bulb
        this.images['bulb_rainbow'] = this._createPlaceholderImage('bulb_rainbow');
        console.log('Created placeholder for bulb_rainbow');
        
        // Create other images
        this.images['background'] = this._createPlaceholderImage('background');
        this.images['grid_cell'] = this._createPlaceholderImage('grid_cell');
        
        // Return resolved promise since we've created all images
        return Promise.resolve();
    }
    
    /**
     * Get a loaded image
     * @param {string} key - Key of the image to get
     * @returns {HTMLImageElement|HTMLCanvasElement} The loaded image or a placeholder
     */
    getImage(key) {
        if (this.images[key]) {
            return this.images[key];
        }
        
        console.warn(`Image not found: ${key}, creating placeholder`);
        const placeholder = this._createPlaceholderImage(key);
        this.images[key] = placeholder;
        return placeholder;
    }
}

// Create global preloader instance
window.preloader = new Preloader();
