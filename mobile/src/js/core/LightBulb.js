/**
 * LightBulb.js
 * Represents a light bulb object in the game
 */
class LightBulb {
    /**
     * Create a new light bulb
     * @param {string} color - Color of the light bulb ('red', 'yellow', 'blue', 'green', etc.)
     * @param {string} type - Type of light bulb ('regular', 'line', 'bomb', 'rainbow')
     */
    constructor(color, type = 'regular') {
        this.color = color;
        this.type = type;
        
        // Position in grid coordinates
        this.gridX = 0;
        this.gridY = 0;
        
        // Position in pixel coordinates (for animations)
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        // Animation properties
        this.scale = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.glowIntensity = 0;
        
        // State flags
        this.isSelected = false;
        this.isMatched = false;
        this.isFalling = false;
        this.isNew = true;
        this.isActivating = false;
        
        // Special bulb properties
        this.specialDirection = null; // For line bulbs
        this.activationPhase = 0; // For animation sequencing
        
        // Unique identifier
        this.id = LightBulb.nextId++;
    }
    
    /**
     * Clone this light bulb
     * @returns {LightBulb} A new light bulb with the same properties
     */
    clone() {
        const clone = new LightBulb(this.color, this.type);
        clone.gridX = this.gridX;
        clone.gridY = this.gridY;
        clone.x = this.x;
        clone.y = this.y;
        clone.targetX = this.targetX;
        clone.targetY = this.targetY;
        clone.scale = this.scale;
        clone.rotation = this.rotation;
        clone.alpha = this.alpha;
        clone.glowIntensity = this.glowIntensity;
        clone.isSelected = this.isSelected;
        clone.isMatched = this.isMatched;
        clone.isFalling = this.isFalling;
        clone.isNew = this.isNew;
        clone.isActivating = this.isActivating;
        clone.specialDirection = this.specialDirection;
        clone.activationPhase = this.activationPhase;
        return clone;
    }
    
    /**
     * Update the light bulb's state for animation
     * @param {number} deltaTime - Time elapsed since last update in milliseconds
     * @returns {boolean} True if the bulb's state changed
     */
    update(deltaTime) {
        let changed = false;
        
        // Update position animation
        if (this.x !== this.targetX || this.y !== this.targetY) {
            // Move towards target position
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Speed is proportional to distance (faster when further away)
            const speed = Math.max(distance * 5, 200); // pixels per second
            const movement = speed * (deltaTime / 1000);
            
            if (distance <= movement) {
                // Reached target
                this.x = this.targetX;
                this.y = this.targetY;
                this.isFalling = false;
            } else {
                // Move towards target
                this.x += (dx / distance) * movement;
                this.y += (dy / distance) * movement;
            }
            
            changed = true;
        }
        
        // Update selection animation
        if (this.isSelected) {
            // Pulsing glow effect
            this.glowIntensity = 0.5 + Math.sin(Date.now() / 200) * 0.5;
            changed = true;
        } else if (this.glowIntensity > 0) {
            // Fade out glow
            this.glowIntensity = Math.max(0, this.glowIntensity - deltaTime / 200);
            changed = true;
        }
        
        // Update match animation
        if (this.isMatched) {
            // Fade out and scale up
            this.alpha = Math.max(0, this.alpha - deltaTime / 300);
            this.scale = 1 + (1 - this.alpha) * 0.5;
            
            if (this.alpha <= 0) {
                // Completely faded out
                this.isMatched = false;
            }
            
            changed = true;
        }
        
        // Update new bulb animation
        if (this.isNew) {
            // Bounce in effect
            const progress = Math.min(1, 1 - this.alpha);
            this.scale = 0.5 + 0.5 * progress;
            
            if (progress >= 1) {
                this.isNew = false;
                this.scale = 1;
            }
            
            changed = true;
        }
        
        // Update special bulb animations
        if (this.type !== 'regular') {
            // Rotation for special bulbs
            this.rotation += deltaTime * 0.001;
            
            // Special activation animations
            if (this.isActivating) {
                this.activationPhase += deltaTime / 1000;
                
                if (this.activationPhase >= 1) {
                    this.isActivating = false;
                    this.activationPhase = 0;
                }
                
                changed = true;
            }
        }
        
        return changed;
    }
    
    /**
     * Set the grid position of the light bulb
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    setGridPosition(x, y) {
        this.gridX = x;
        this.gridY = y;
    }
    
    /**
     * Set the pixel position of the light bulb
     * @param {number} x - Pixel X coordinate
     * @param {number} y - Pixel Y coordinate
     * @param {boolean} immediate - If true, set position immediately without animation
     */
    setPosition(x, y, immediate = false) {
        this.targetX = x;
        this.targetY = y;
        
        if (immediate) {
            this.x = x;
            this.y = y;
        }
    }
    
    /**
     * Set the light bulb as selected
     * @param {boolean} selected - Whether the bulb is selected
     */
    setSelected(selected) {
        this.isSelected = selected;
    }
    
    /**
     * Mark the light bulb as matched (to be removed)
     */
    match() {
        this.isMatched = true;
        this.alpha = 1;
    }
    
    /**
     * Start falling animation
     */
    startFalling() {
        this.isFalling = true;
    }
    
    /**
     * Activate special bulb effect
     * @param {string} [direction] - Direction for line bulb ('horizontal' or 'vertical')
     */
    activate(direction = null) {
        this.isActivating = true;
        this.activationPhase = 0;
        
        if (this.type === 'line' && direction) {
            this.specialDirection = direction;
        }
    }
    
    /**
     * Reset the light bulb to its default state
     */
    reset() {
        this.isSelected = false;
        this.isMatched = false;
        this.isFalling = false;
        this.isNew = true;
        this.isActivating = false;
        this.scale = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.glowIntensity = 0;
        this.activationPhase = 0;
    }
    
    /**
     * Convert the light bulb to a special type
     * @param {string} specialType - Type of special bulb ('line', 'bomb', 'rainbow')
     */
    convertToSpecial(specialType) {
        this.type = specialType;
        this.isNew = true;
        this.alpha = 0;
    }
    
    /**
     * Check if this bulb can be swapped
     * @returns {boolean} True if the bulb can be swapped
     */
    canSwap() {
        return !this.isMatched && !this.isFalling && !this.isActivating && this.alpha === 1;
    }
    
    /**
     * Get the asset key for this light bulb
     * @returns {string} Asset key for rendering
     */
    getAssetKey() {
        let key = `bulb_${this.color}`;
        
        if (this.type !== 'regular') {
            key += `_${this.type}`;
        }
        
        return key;
    }
    
    /**
     * Serialize the light bulb for storage
     * @returns {Object} Serialized light bulb data
     */
    serialize() {
        return {
            color: this.color,
            type: this.type,
            gridX: this.gridX,
            gridY: this.gridY,
            specialDirection: this.specialDirection
        };
    }
    
    /**
     * Create a light bulb from serialized data
     * @param {Object} data - Serialized light bulb data
     * @returns {LightBulb} New light bulb instance
     */
    static deserialize(data) {
        const bulb = new LightBulb(data.color, data.type);
        bulb.setGridPosition(data.gridX, data.gridY);
        bulb.specialDirection = data.specialDirection;
        return bulb;
    }
}

// Static counter for generating unique IDs
LightBulb.nextId = 1;
