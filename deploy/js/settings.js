/**
 * Settings manager for game configuration
 */
const Settings = {
    /**
     * Default settings
     */
    defaults: {
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'normal',
        showDebug: false
    },
    
    /**
     * Current settings
     */
    current: {},
    
    /**
     * Initialize settings
     */
    init: function() {
        // Load settings from local storage
        this.loadSettings();
        
        // Set up settings UI
        this.setupUI();
        
        console.log('Settings initialized');
    },
    
    /**
     * Load settings from local storage
     */
    loadSettings: function() {
        try {
            const savedSettings = localStorage.getItem('colorfulBulbs_settings');
            if (savedSettings) {
                this.current = JSON.parse(savedSettings);
            } else {
                this.current = {...this.defaults};
            }
        } catch (e) {
            console.error('Error loading settings:', e);
            this.current = {...this.defaults};
        }
        
        // Apply settings to UI elements
        this.applySettings();
    },
    
    /**
     * Save settings to local storage
     */
    saveSettings: function() {
        try {
            localStorage.setItem('colorfulBulbs_settings', JSON.stringify(this.current));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    },
    
    /**
     * Apply current settings to the game
     */
    applySettings: function() {
        // Apply sound settings
        if (typeof Sound !== 'undefined') {
            Sound.enabled = this.current.soundEnabled;
            Sound.musicEnabled = this.current.musicEnabled;
        }
        
        // Apply debug settings
        if (typeof Debug !== 'undefined') {
            Debug.enabled = this.current.showDebug;
        }
    },
    
    /**
     * Set up settings UI
     */
    setupUI: function() {
        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.checked = this.current.soundEnabled;
            soundToggle.addEventListener('change', () => {
                this.current.soundEnabled = soundToggle.checked;
                this.saveSettings();
                this.applySettings();
            });
        }
        
        // Music toggle
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.checked = this.current.musicEnabled;
            musicToggle.addEventListener('change', () => {
                this.current.musicEnabled = musicToggle.checked;
                this.saveSettings();
                this.applySettings();
            });
        }
        
        // Difficulty select
        const difficultySelect = document.getElementById('difficulty-select');
        if (difficultySelect) {
            difficultySelect.value = this.current.difficulty;
            difficultySelect.addEventListener('change', () => {
                this.current.difficulty = difficultySelect.value;
                this.saveSettings();
                this.applySettings();
            });
        }
    }
};

console.log('Settings module loaded');