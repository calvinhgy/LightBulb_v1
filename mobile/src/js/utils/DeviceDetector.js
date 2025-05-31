/**
 * DeviceDetector.js
 * Detects device capabilities and characteristics to optimize game experience
 */
class DeviceDetector {
    constructor() {
        this.deviceInfo = {
            // Device type
            isIOS: this._detectIOS(),
            isIPhone: this._detectIPhone(),
            
            // Screen properties
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            
            // Performance tier
            performanceTier: 'unknown', // Will be set to 'low', 'medium', or 'high'
            
            // Capabilities
            hasTouch: this._detectTouch(),
            hasHapticFeedback: this._detectHapticFeedback(),
            
            // Orientation
            isPortrait: window.innerHeight > window.innerWidth,
            
            // Browser features
            supportsWebP: false, // Will be tested asynchronously
            supportsWebGL: this._detectWebGL(),
            supportsOffscreenCanvas: typeof OffscreenCanvas !== 'undefined',
            
            // Accessibility
            prefersReducedMotion: this._detectReducedMotion(),
            
            // Connection
            isOnline: navigator.onLine
        };
        
        // Set performance tier based on device detection
        this._setPerformanceTier();
        
        // Test WebP support
        this._testWebPSupport();
        
        // Set up event listeners for changes
        this._setupEventListeners();
    }
    
    /**
     * Get the current device information
     * @returns {Object} Device information
     */
    getDeviceInfo() {
        // Update dynamic properties
        this.deviceInfo.screenWidth = window.innerWidth;
        this.deviceInfo.screenHeight = window.innerHeight;
        this.deviceInfo.isPortrait = window.innerHeight > window.innerWidth;
        this.deviceInfo.isOnline = navigator.onLine;
        
        return this.deviceInfo;
    }
    
    /**
     * Get recommended game settings based on device capabilities
     * @returns {Object} Recommended settings
     */
    getRecommendedSettings() {
        const { performanceTier, screenWidth, screenHeight, isPortrait } = this.deviceInfo;
        
        // Calculate grid size based on performance tier and orientation
        let gridSize = { width: 8, height: 10 }; // Default size
        
        if (performanceTier === 'low') {
            gridSize = { width: 7, height: 9 };
        } else if (performanceTier === 'high') {
            gridSize = { width: 9, height: 11 };
        }
        
        // If in landscape, swap width and height
        if (!isPortrait) {
            [gridSize.width, gridSize.height] = [gridSize.height, gridSize.width];
        }
        
        // Calculate cell size based on screen dimensions and grid size
        const maxCellWidth = Math.floor(screenWidth * 0.9 / gridSize.width);
        const maxCellHeight = Math.floor(screenHeight * 0.7 / gridSize.height);
        const cellSize = Math.min(maxCellWidth, maxCellHeight);
        
        return {
            gridSize,
            cellSize,
            effectsLevel: this._getEffectsLevel(),
            audioQuality: this._getAudioQuality(),
            targetFPS: this._getTargetFPS()
        };
    }
    
    /**
     * Check if the device supports haptic feedback and is enabled
     * @returns {boolean} True if haptic feedback is supported and enabled
     */
    canUseHapticFeedback() {
        return this.deviceInfo.hasHapticFeedback && !this.deviceInfo.prefersReducedMotion;
    }
    
    /**
     * Trigger haptic feedback if supported
     * @param {string} intensity - 'light', 'medium', or 'heavy'
     */
    triggerHapticFeedback(intensity = 'medium') {
        if (!this.canUseHapticFeedback()) return;
        
        if ('vibrate' in navigator) {
            switch (intensity) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    navigator.vibrate([30, 10, 30]);
                    break;
                default:
                    navigator.vibrate(20);
            }
        }
    }
    
    /**
     * Detect if device is running iOS
     * @returns {boolean} True if iOS
     * @private
     */
    _detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    
    /**
     * Detect if device is an iPhone
     * @returns {boolean} True if iPhone
     * @private
     */
    _detectIPhone() {
        return /iPhone/.test(navigator.userAgent) && !window.MSStream;
    }
    
    /**
     * Detect if device has touch capabilities
     * @returns {boolean} True if touch is supported
     * @private
     */
    _detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    /**
     * Detect if device supports haptic feedback
     * @returns {boolean} True if haptic feedback is supported
     * @private
     */
    _detectHapticFeedback() {
        return 'vibrate' in navigator;
    }
    
    /**
     * Detect if user prefers reduced motion
     * @returns {boolean} True if reduced motion is preferred
     * @private
     */
    _detectReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    /**
     * Detect WebGL support
     * @returns {boolean} True if WebGL is supported
     * @private
     */
    _detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Test WebP image format support
     * @private
     */
    _testWebPSupport() {
        const webP = new Image();
        webP.onload = () => {
            this.deviceInfo.supportsWebP = (webP.height === 1);
        };
        webP.onerror = () => {
            this.deviceInfo.supportsWebP = false;
        };
        webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    }
    
    /**
     * Set the performance tier based on device detection
     * @private
     */
    _setPerformanceTier() {
        // This is a simplified version - in production, you would use more sophisticated detection
        const { isIPhone, pixelRatio } = this.deviceInfo;
        
        if (!isIPhone) {
            // Non-iPhone iOS devices or other devices
            this.deviceInfo.performanceTier = 'medium';
            return;
        }
        
        // Get iPhone model info from user agent
        const userAgent = navigator.userAgent;
        
        // Check for newer iPhone models (simplified)
        if (pixelRatio >= 3 && window.screen.height >= 812) {
            // iPhone X, 11 Pro, 12, 13, 14, etc.
            this.deviceInfo.performanceTier = 'high';
        } else if (pixelRatio >= 2 && window.screen.height >= 667) {
            // iPhone 8, X, 11, etc.
            this.deviceInfo.performanceTier = 'medium';
        } else {
            // Older iPhones
            this.deviceInfo.performanceTier = 'low';
        }
    }
    
    /**
     * Get recommended effects level based on performance tier
     * @returns {string} 'low', 'medium', or 'high'
     * @private
     */
    _getEffectsLevel() {
        switch (this.deviceInfo.performanceTier) {
            case 'low': return 'low';
            case 'medium': return 'medium';
            case 'high': return 'high';
            default: return 'medium';
        }
    }
    
    /**
     * Get recommended audio quality based on performance tier
     * @returns {string} 'low', 'medium', or 'high'
     * @private
     */
    _getAudioQuality() {
        switch (this.deviceInfo.performanceTier) {
            case 'low': return 'low';
            case 'medium': return 'medium';
            case 'high': return 'high';
            default: return 'medium';
        }
    }
    
    /**
     * Get target FPS based on performance tier
     * @returns {number} Target FPS
     * @private
     */
    _getTargetFPS() {
        switch (this.deviceInfo.performanceTier) {
            case 'low': return 30;
            case 'medium': return 60;
            case 'high': return 60;
            default: return 60;
        }
    }
    
    /**
     * Set up event listeners for device changes
     * @private
     */
    _setupEventListeners() {
        // Listen for orientation changes
        window.addEventListener('resize', () => {
            this.deviceInfo.screenWidth = window.innerWidth;
            this.deviceInfo.screenHeight = window.innerHeight;
            this.deviceInfo.isPortrait = window.innerHeight > window.innerWidth;
        });
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.deviceInfo.isOnline = true;
        });
        
        window.addEventListener('offline', () => {
            this.deviceInfo.isOnline = false;
        });
        
        // Listen for reduced motion preference changes
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionMediaQuery.addEventListener) {
            motionMediaQuery.addEventListener('change', () => {
                this.deviceInfo.prefersReducedMotion = motionMediaQuery.matches;
            });
        }
    }
}
