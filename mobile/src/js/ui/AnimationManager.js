/**
 * AnimationManager.js
 * Manages visual animations and effects
 */
class AnimationManager {
    /**
     * Create a new animation manager
     * @param {Renderer} renderer - Game renderer
     */
    constructor(renderer) {
        this.renderer = renderer;
        
        // Active animations
        this.activeAnimations = [];
        
        // Animation frame ID
        this.animationFrameId = null;
        
        // Start animation loop
        this._startAnimationLoop();
    }
    
    /**
     * Start the animation loop
     * @private
     */
    _startAnimationLoop() {
        const animate = (timestamp) => {
            this._updateAnimations(timestamp);
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    /**
     * Stop the animation loop
     */
    stopAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Update active animations
     * @param {number} timestamp - Current timestamp
     * @private
     */
    _updateAnimations(timestamp) {
        // Update each animation
        for (let i = this.activeAnimations.length - 1; i >= 0; i--) {
            const animation = this.activeAnimations[i];
            
            // Calculate progress
            const elapsed = timestamp - animation.startTime;
            const progress = Math.min(1, elapsed / animation.duration);
            
            // Update animation
            animation.update(progress);
            
            // Remove completed animations
            if (progress >= 1) {
                if (animation.onComplete) {
                    animation.onComplete();
                }
                this.activeAnimations.splice(i, 1);
            }
        }
    }
    
    /**
     * Add a new animation
     * @param {Object} animation - Animation object
     * @param {Function} animation.update - Update function called with progress (0-1)
     * @param {number} animation.duration - Animation duration in milliseconds
     * @param {Function} [animation.onComplete] - Callback when animation completes
     */
    addAnimation(animation) {
        animation.startTime = performance.now();
        this.activeAnimations.push(animation);
    }
    
    /**
     * Show a score popup animation
     * @param {Array<LightBulb>} match - Matched bulbs
     * @param {number} score - Score to display
     */
    showScorePopup(match, score) {
        // Find center position of match
        let centerX = 0;
        let centerY = 0;
        
        for (const bulb of match) {
            const pos = this.renderer.gridToScreenCoordinates(bulb.gridX, bulb.gridY);
            centerX += pos.x;
            centerY += pos.y;
        }
        
        centerX /= match.length;
        centerY /= match.length;
        
        // Create score popup element
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.position = 'absolute';
        popup.style.left = `${centerX}px`;
        popup.style.top = `${centerY}px`;
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.color = '#ffffff';
        popup.style.fontSize = '24px';
        popup.style.fontWeight = 'bold';
        popup.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
        popup.style.pointerEvents = 'none';
        popup.style.zIndex = '100';
        
        // Add to game container
        const container = this.renderer.gameBoard.parentElement;
        container.appendChild(popup);
        
        // Animate popup
        this.addAnimation({
            update: (progress) => {
                // Move up and fade out
                const y = centerY - 50 * progress;
                const opacity = 1 - progress;
                const scale = 1 + progress * 0.5;
                
                popup.style.top = `${y}px`;
                popup.style.opacity = opacity;
                popup.style.transform = `translate(-50%, -50%) scale(${scale})`;
            },
            duration: 1000,
            onComplete: () => {
                // Remove popup when animation completes
                container.removeChild(popup);
            }
        });
    }
    
    /**
     * Show a match animation
     * @param {Array<LightBulb>} match - Matched bulbs
     */
    showMatchAnimation(match) {
        this.addAnimation({
            update: (progress) => {
                this.renderer.renderEffect('match', { bulbs: match, progress });
            },
            duration: 500
        });
    }
    
    /**
     * Show an invalid swap animation
     * @param {LightBulb} bulb1 - First bulb
     * @param {LightBulb} bulb2 - Second bulb
     */
    showInvalidSwapAnimation(bulb1, bulb2) {
        // Shake animation
        const originalX1 = bulb1.x;
        const originalY1 = bulb1.y;
        const originalX2 = bulb2.x;
        const originalY2 = bulb2.y;
        
        this.addAnimation({
            update: (progress) => {
                // Horizontal shake
                const shakeAmount = Math.sin(progress * Math.PI * 8) * (1 - progress) * 5;
                
                bulb1.x = originalX1 + shakeAmount;
                bulb2.x = originalX2 - shakeAmount;
                
                this.renderer.renderEffect('swap', { bulb1, bulb2, progress });
            },
            duration: 400,
            onComplete: () => {
                // Reset positions
                bulb1.x = originalX1;
                bulb1.y = originalY1;
                bulb2.x = originalX2;
                bulb2.y = originalY2;
            }
        });
    }
    
    /**
     * Show a hint animation
     * @param {Object} cell1 - First cell coordinates {x, y}
     * @param {Object} cell2 - Second cell coordinates {x, y}
     */
    showHint(cell1, cell2) {
        // Alternate highlighting both cells
        let currentCell = cell1;
        let pulseCount = 0;
        
        const pulseAnimation = {
            update: (progress) => {
                this.renderer.renderEffect('hint', { 
                    x: currentCell.x, 
                    y: currentCell.y, 
                    progress 
                });
            },
            duration: 500,
            onComplete: () => {
                pulseCount++;
                
                if (pulseCount < 6) {
                    // Switch cells and restart animation
                    currentCell = (currentCell === cell1) ? cell2 : cell1;
                    this.addAnimation(pulseAnimation);
                }
            }
        };
        
        this.addAnimation(pulseAnimation);
    }
    
    /**
     * Show a special bulb creation animation
     * @param {LightBulb} bulb - Special bulb
     * @param {string} specialType - Type of special bulb
     */
    showSpecialCreationAnimation(bulb, specialType) {
        // Flash animation
        const originalScale = bulb.scale;
        
        this.addAnimation({
            update: (progress) => {
                // Scale up and down
                if (progress < 0.5) {
                    bulb.scale = originalScale * (1 + progress);
                } else {
                    bulb.scale = originalScale * (2 - progress);
                }
                
                // Render special effect
                this.renderer.renderEffect('special', { 
                    bulb, 
                    type: specialType, 
                    progress 
                });
            },
            duration: 500,
            onComplete: () => {
                bulb.scale = originalScale;
            }
        });
    }
    
    /**
     * Show a special bulb activation animation
     * @param {LightBulb} bulb - Special bulb
     * @param {string} specialType - Type of special bulb
     * @param {Object} params - Additional parameters
     */
    showSpecialActivationAnimation(bulb, specialType, params = {}) {
        this.addAnimation({
            update: (progress) => {
                this.renderer.renderEffect('special', { 
                    bulb, 
                    type: specialType, 
                    progress,
                    ...params
                });
            },
            duration: 800
        });
    }
    
    /**
     * Show level complete animation
     */
    showLevelCompleteAnimation() {
        // Create confetti elements
        const container = this.renderer.gameBoard.parentElement;
        const confettiCount = 100;
        const confetti = [];
        
        for (let i = 0; i < confettiCount; i++) {
            const element = document.createElement('div');
            element.className = 'confetti';
            element.style.position = 'absolute';
            element.style.width = `${Math.random() * 10 + 5}px`;
            element.style.height = `${Math.random() * 10 + 5}px`;
            element.style.backgroundColor = this._getRandomColor();
            element.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '100';
            
            container.appendChild(element);
            
            confetti.push({
                element,
                x: Math.random() * container.clientWidth,
                y: -20,
                speedX: Math.random() * 6 - 3,
                speedY: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
        
        // Animate confetti
        this.addAnimation({
            update: (progress) => {
                for (const particle of confetti) {
                    // Update position
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.rotation += particle.rotationSpeed;
                    
                    // Apply gravity
                    particle.speedY += 0.1;
                    
                    // Update element
                    particle.element.style.left = `${particle.x}px`;
                    particle.element.style.top = `${particle.y}px`;
                    particle.element.style.transform = `rotate(${particle.rotation}deg)`;
                    
                    // Fade out near the end
                    if (progress > 0.7) {
                        particle.element.style.opacity = (1 - progress) / 0.3;
                    }
                }
            },
            duration: 3000,
            onComplete: () => {
                // Remove confetti elements
                for (const particle of confetti) {
                    container.removeChild(particle.element);
                }
            }
        });
    }
    
    /**
     * Show game over animation
     */
    showGameOverAnimation() {
        // Fade overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '100';
        
        // Game over text
        const text = document.createElement('div');
        text.textContent = '游戏结束';
        text.style.color = '#ffffff';
        text.style.fontSize = '48px';
        text.style.fontWeight = 'bold';
        text.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
        text.style.opacity = '0';
        text.style.transform = 'scale(2)';
        
        overlay.appendChild(text);
        
        const container = this.renderer.gameBoard.parentElement;
        container.appendChild(overlay);
        
        // Animate overlay
        this.addAnimation({
            update: (progress) => {
                overlay.style.backgroundColor = `rgba(0, 0, 0, ${progress * 0.7})`;
                
                if (progress > 0.3) {
                    const textProgress = (progress - 0.3) / 0.7;
                    text.style.opacity = textProgress;
                    text.style.transform = `scale(${2 - textProgress})`;
                }
            },
            duration: 1500,
            onComplete: () => {
                // Keep overlay visible
                setTimeout(() => {
                    container.removeChild(overlay);
                }, 1500);
            }
        });
    }
    
    /**
     * Get a random color
     * @returns {string} Random color in hex format
     * @private
     */
    _getRandomColor() {
        const colors = [
            '#ff0000', // Red
            '#ffcc00', // Yellow
            '#00cc00', // Green
            '#0099ff', // Blue
            '#ff00ff', // Magenta
            '#ffffff'  // White
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
