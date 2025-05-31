/**
 * ConfigManager.js
 * Manages game configuration settings
 */
class ConfigManager {
    constructor() {
        // Default configuration
        this.defaultConfig = {
            // Game settings
            game: {
                defaultGridSize: { width: 8, height: 10 },
                colors: ['red', 'yellow', 'blue', 'green'],
                matchMinLength: 3,
                fallSpeed: 10, // Cells per second
                swapDuration: 200, // ms
                matchDelay: 200, // ms
                cascadeDelay: 50, // ms between cascade steps
                hintDelay: 5000, // ms of inactivity before showing hint
                initialMoves: 30
            },
            
            // Visual settings
            visual: {
                effectsLevel: 'medium', // 'low', 'medium', 'high'
                animationSpeed: 1.0, // Multiplier
                showHints: true,
                colorBlindMode: false,
                reducedMotion: false
            },
            
            // Audio settings
            audio: {
                musicVolume: 0.7,
                sfxVolume: 0.8,
                vibration: true
            },
            
            // Control settings
            controls: {
                controlScheme: 'swipe', // 'swipe' or 'tap'
                swipeSensitivity: 0.5, // 0.0 to 1.0
                touchDeadzone: 10, // Pixels
                doubleTapTimeout: 300 // ms
            },
            
            // Performance settings
            performance: {
                targetFPS: 60,
                particleLimit: 100,
                useWebGL: true,
                useOffscreenCanvas: true
            },
            
            // Special bulb settings
            specialBulbs: {
                lineBulbMatch: 4,
                bombBulbMatch: 5, // In L or T shape
                rainbowBulbMatch: 5 // In a row
            },
            
            // Scoring settings
            scoring: {
                baseMatchScore: 100,
                matchMultiplier: 1.5, // Per additional bulb
                cascadeMultiplier: 1.2, // Per cascade level
                specialBulbMultiplier: 2.0,
                starThresholds: [1000, 2000, 3000] // Scores for 1, 2, 3 stars
            },
            
            // Level progression
            progression: {
                initialUnlockedLevels: 1,
                starsToUnlockNext: 1
            }
        };
        
        // Current configuration (will be merged with saved config)
        this.config = JSON.parse(JSON.stringify(this.defaultConfig));
        
        // Load saved configuration if available
        this._loadSavedConfig();
    }
    
    /**
     * Get the entire configuration object
     * @returns {Object} Current configuration
     */
    getConfig() {
        return this.config;
    }
    
    /**
     * Get a specific configuration section
     * @param {string} section - Section name
     * @returns {Object} Configuration section
     */
    getSection(section) {
        return this.config[section] || {};
    }
    
    /**
     * Get a specific configuration value
     * @param {string} section - Section name
     * @param {string} key - Configuration key
     * @returns {*} Configuration value
     */
    getValue(section, key) {
        if (this.config[section] && this.config[section][key] !== undefined) {
            return this.config[section][key];
        }
        return null;
    }
    
    /**
     * Update a configuration value
     * @param {string} section - Section name
     * @param {string} key - Configuration key
     * @param {*} value - New value
     */
    setValue(section, key, value) {
        if (!this.config[section]) {
            this.config[section] = {};
        }
        
        this.config[section][key] = value;
        this._saveConfig();
    }
    
    /**
     * Update multiple configuration values
     * @param {string} section - Section name
     * @param {Object} values - Object with key-value pairs to update
     */
    updateSection(section, values) {
        if (!this.config[section]) {
            this.config[section] = {};
        }
        
        Object.assign(this.config[section], values);
        this._saveConfig();
    }
    
    /**
     * Reset configuration to defaults
     * @param {string} [section] - Optional section to reset, or all if not specified
     */
    resetToDefaults(section = null) {
        if (section) {
            if (this.defaultConfig[section]) {
                this.config[section] = JSON.parse(JSON.stringify(this.defaultConfig[section]));
            }
        } else {
            this.config = JSON.parse(JSON.stringify(this.defaultConfig));
        }
        
        this._saveConfig();
    }
    
    /**
     * Apply device-specific optimizations to the configuration
     * @param {Object} deviceInfo - Device information from DeviceDetector
     */
    optimizeForDevice(deviceInfo) {
        // Adjust grid size based on device
        if (deviceInfo.performanceTier === 'low') {
            this.config.game.defaultGridSize = { width: 7, height: 9 };
        } else if (deviceInfo.performanceTier === 'high') {
            this.config.game.defaultGridSize = { width: 9, height: 11 };
        }
        
        // Adjust visual effects based on performance tier
        this.config.visual.effectsLevel = deviceInfo.performanceTier;
        
        // Adjust performance settings
        if (deviceInfo.performanceTier === 'low') {
            this.config.performance.targetFPS = 30;
            this.config.performance.particleLimit = 50;
        } else if (deviceInfo.performanceTier === 'medium') {
            this.config.performance.targetFPS = 60;
            this.config.performance.particleLimit = 100;
        } else if (deviceInfo.performanceTier === 'high') {
            this.config.performance.targetFPS = 60;
            this.config.performance.particleLimit = 200;
        }
        
        // Use WebGL if supported
        this.config.performance.useWebGL = deviceInfo.supportsWebGL;
        
        // Use OffscreenCanvas if supported
        this.config.performance.useOffscreenCanvas = deviceInfo.supportsOffscreenCanvas;
        
        // Apply accessibility settings if needed
        if (deviceInfo.prefersReducedMotion) {
            this.config.visual.reducedMotion = true;
            this.config.visual.animationSpeed = 0.5;
        }
        
        // Save the optimized config
        this._saveConfig();
    }
    
    /**
     * Load saved configuration from localStorage
     * @private
     */
    _loadSavedConfig() {
        try {
            const savedConfig = localStorage.getItem('lightbulb_config');
            if (savedConfig) {
                const parsedConfig = JSON.parse(savedConfig);
                
                // Merge saved config with default config (to ensure all properties exist)
                this._deepMerge(this.config, parsedConfig);
            }
        } catch (error) {
            console.error('Failed to load saved configuration:', error);
            // Use default config if loading fails
            this.config = JSON.parse(JSON.stringify(this.defaultConfig));
        }
    }
    
    /**
     * Save current configuration to localStorage
     * @private
     */
    _saveConfig() {
        try {
            localStorage.setItem('lightbulb_config', JSON.stringify(this.config));
        } catch (error) {
            console.error('Failed to save configuration:', error);
        }
    }
    
    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @private
     */
    _deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this._deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
}
