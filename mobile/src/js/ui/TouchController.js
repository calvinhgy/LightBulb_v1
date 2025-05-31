/**
 * TouchController.js
 * Handles touch input for the game
 */
class TouchController {
    /**
     * Create a new touch controller
     * @param {HTMLElement} element - DOM element to attach touch events to
     * @param {Object} config - Touch configuration
     */
    constructor(element, config = {}) {
        this.element = element;
        
        // Configuration
        this.config = {
            controlScheme: config.controlScheme || 'swipe', // 'swipe' or 'tap'
            swipeSensitivity: config.swipeSensitivity || 0.5,
            touchDeadzone: config.touchDeadzone || 10,
            doubleTapTimeout: config.doubleTapTimeout || 300,
            longPressTimeout: config.longPressTimeout || 500,
            ...config
        };
        
        // Touch state
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isTouching = false;
        this.isLongPress = false;
        this.lastTapTime = 0;
        
        // Selected cell
        this.selectedCell = null;
        
        // Event callbacks
        this.onCellTap = null;
        this.onCellDoubleTap = null;
        this.onCellLongPress = null;
        this.onSwipe = null;
        this.onDrag = null;
        this.onPinch = null;
        
        // Bind event handlers
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        
        // Initialize
        this._init();
    }
    
    /**
     * Initialize touch events
     * @private
     */
    _init() {
        // Add touch event listeners
        this.element.addEventListener('touchstart', this._onTouchStart, { passive: false });
        this.element.addEventListener('touchmove', this._onTouchMove, { passive: false });
        this.element.addEventListener('touchend', this._onTouchEnd, { passive: false });
        this.element.addEventListener('touchcancel', this._onTouchEnd, { passive: false });
        
        // Add mouse event listeners for desktop testing
        this.element.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.element.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.element.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.element.addEventListener('mouseleave', this._onMouseUp.bind(this));
    }
    
    /**
     * Clean up event listeners
     */
    destroy() {
        this.element.removeEventListener('touchstart', this._onTouchStart);
        this.element.removeEventListener('touchmove', this._onTouchMove);
        this.element.removeEventListener('touchend', this._onTouchEnd);
        this.element.removeEventListener('touchcancel', this._onTouchEnd);
        
        this.element.removeEventListener('mousedown', this._onMouseDown);
        this.element.removeEventListener('mousemove', this._onMouseMove);
        this.element.removeEventListener('mouseup', this._onMouseUp);
        this.element.removeEventListener('mouseleave', this._onMouseUp);
    }
    
    /**
     * Set the control scheme
     * @param {string} scheme - 'swipe' or 'tap'
     */
    setControlScheme(scheme) {
        if (scheme === 'swipe' || scheme === 'tap') {
            this.config.controlScheme = scheme;
        }
    }
    
    /**
     * Handle touch start event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _onTouchStart(event) {
        // Prevent default to avoid scrolling
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // Single touch
            const touch = event.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchStartTime = Date.now();
            this.isTouching = true;
            this.isLongPress = false;
            
            // Get cell coordinates
            const cell = this._getCellFromTouch(touch);
            
            // Start long press timer
            this.longPressTimer = setTimeout(() => {
                if (this.isTouching && cell) {
                    this.isLongPress = true;
                    if (this.onCellLongPress) {
                        this.onCellLongPress(cell.x, cell.y);
                    }
                }
            }, this.config.longPressTimeout);
        } else if (event.touches.length === 2) {
            // Pinch gesture
            this._handlePinchStart(event);
        }
    }
    
    /**
     * Handle touch move event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _onTouchMove(event) {
        if (!this.isTouching) return;
        
        // Prevent default to avoid scrolling
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // Single touch
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Clear long press timer if moved beyond deadzone
            if (distance > this.config.touchDeadzone) {
                clearTimeout(this.longPressTimer);
                
                // Handle drag
                if (this.onDrag) {
                    const cell = this._getCellFromTouch(touch);
                    if (cell) {
                        this.onDrag(cell.x, cell.y, deltaX, deltaY);
                    }
                }
            }
        } else if (event.touches.length === 2) {
            // Pinch gesture
            this._handlePinchMove(event);
        }
    }
    
    /**
     * Handle touch end event
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _onTouchEnd(event) {
        // Prevent default
        event.preventDefault();
        
        // Clear long press timer
        clearTimeout(this.longPressTimer);
        
        if (!this.isTouching) return;
        
        // Get touch info
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;
        
        // Handle touch end based on control scheme
        if (this.config.controlScheme === 'swipe') {
            this._handleSwipeEnd(event, touchDuration);
        } else {
            this._handleTapEnd(event, touchDuration, touchEndTime);
        }
        
        this.isTouching = false;
    }
    
    /**
     * Handle swipe control scheme touch end
     * @param {TouchEvent} event - Touch event
     * @param {number} touchDuration - Duration of touch in ms
     * @private
     */
    _handleSwipeEnd(event, touchDuration) {
        // Only process if not a long press
        if (this.isLongPress) return;
        
        // Get touch position
        const touch = event.changedTouches ? event.changedTouches[0] : null;
        if (!touch) return;
        
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Check if this is a swipe
        if (distance > this.config.touchDeadzone && touchDuration < 300) {
            // Determine swipe direction
            let direction;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? 'right' : 'left';
            } else {
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            // Get starting cell
            const startCell = this._getCellFromCoordinates(this.touchStartX, this.touchStartY);
            
            if (startCell && this.onSwipe) {
                this.onSwipe(startCell.x, startCell.y, direction, distance);
            }
        } else if (distance <= this.config.touchDeadzone) {
            // This is a tap
            const cell = this._getCellFromTouch(touch);
            
            if (cell && this.onCellTap) {
                this.onCellTap(cell.x, cell.y);
            }
        }
    }
    
    /**
     * Handle tap control scheme touch end
     * @param {TouchEvent} event - Touch event
     * @param {number} touchDuration - Duration of touch in ms
     * @param {number} touchEndTime - Timestamp of touch end
     * @private
     */
    _handleTapEnd(event, touchDuration, touchEndTime) {
        // Only process if not a long press
        if (this.isLongPress) return;
        
        // Get touch position
        const touch = event.changedTouches ? event.changedTouches[0] : null;
        if (!touch) return;
        
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Check if this is a tap
        if (distance <= this.config.touchDeadzone && touchDuration < 300) {
            const cell = this._getCellFromTouch(touch);
            
            if (cell) {
                // Check for double tap
                const isDoubleTap = (touchEndTime - this.lastTapTime) < this.config.doubleTapTimeout;
                
                if (isDoubleTap && this.onCellDoubleTap) {
                    this.onCellDoubleTap(cell.x, cell.y);
                } else if (this.onCellTap) {
                    this.onCellTap(cell.x, cell.y);
                }
                
                this.lastTapTime = touchEndTime;
            }
        }
    }
    
    /**
     * Handle pinch start
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _handlePinchStart(event) {
        if (event.touches.length !== 2) return;
        
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        
        this.pinchStartDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }
    
    /**
     * Handle pinch move
     * @param {TouchEvent} event - Touch event
     * @private
     */
    _handlePinchMove(event) {
        if (event.touches.length !== 2 || !this.pinchStartDistance) return;
        
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        
        const currentDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const pinchRatio = currentDistance / this.pinchStartDistance;
        
        if (this.onPinch) {
            const centerX = (touch1.clientX + touch2.clientX) / 2;
            const centerY = (touch1.clientY + touch2.clientY) / 2;
            this.onPinch(pinchRatio, centerX, centerY);
        }
    }
    
    /**
     * Mouse event handlers (for desktop testing)
     */
    _onMouseDown(event) {
        this._onTouchStart({
            preventDefault: () => {},
            touches: [{ clientX: event.clientX, clientY: event.clientY }]
        });
    }
    
    _onMouseMove(event) {
        if (!this.isTouching) return;
        
        this._onTouchMove({
            preventDefault: () => {},
            touches: [{ clientX: event.clientX, clientY: event.clientY }]
        });
    }
    
    _onMouseUp(event) {
        this._onTouchEnd({
            preventDefault: () => {},
            changedTouches: [{ clientX: event.clientX, clientY: event.clientY }]
        });
    }
    
    /**
     * Get cell coordinates from touch event
     * @param {Touch} touch - Touch object
     * @returns {Object|null} Cell coordinates {x, y} or null
     * @private
     */
    _getCellFromTouch(touch) {
        return this._getCellFromCoordinates(touch.clientX, touch.clientY);
    }
    
    /**
     * Get cell coordinates from screen coordinates
     * @param {number} clientX - Screen X coordinate
     * @param {number} clientY - Screen Y coordinate
     * @returns {Object|null} Cell coordinates {x, y} or null
     * @private
     */
    _getCellFromCoordinates(clientX, clientY) {
        // Get element position
        const rect = this.element.getBoundingClientRect();
        
        // Convert to element coordinates
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // Check if within bounds
        if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
            return null;
        }
        
        // Convert to cell coordinates (this is a placeholder - actual implementation depends on grid layout)
        // This should be overridden by the game to provide actual cell coordinates
        return { x, y };
    }
    
    /**
     * Set the cell coordinate converter function
     * @param {Function} converter - Function that converts screen coordinates to cell coordinates
     */
    setCellConverter(converter) {
        this._getCellFromCoordinates = converter;
    }
}
