/**
 * Sound manager for game audio
 */
const Sound = {
    /**
     * Whether sound is enabled
     */
    enabled: true,
    
    /**
     * Whether music is enabled
     */
    musicEnabled: true,
    
    /**
     * Volume level (0-1)
     */
    volume: 0.7,
    
    /**
     * Music volume level (0-1)
     */
    musicVolume: 0.5,
    
    /**
     * Audio elements cache
     */
    sounds: {},
    
    /**
     * Background music element
     */
    backgroundMusic: null,
    
    /**
     * Sound effects paths
     */
    soundPaths: {
        select: 'assets/sounds/select.mp3',
        swap: 'assets/sounds/swap.mp3',
        match: 'assets/sounds/match.mp3',
        fall: 'assets/sounds/fall.mp3',
        invalid: 'assets/sounds/invalid.mp3',
        levelup: 'assets/sounds/levelup.mp3',
        gameover: 'assets/sounds/gameover.mp3'
    },
    
    /**
     * Initialize sound system
     */
    init: function() {
        // Load settings from local storage
        this.loadSettings();
        
        // Create background music element
        this.backgroundMusic = new Audio();
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
        
        // Preload sound effects
        this.preloadSounds();
        
        console.log('Sound system initialized');
    },
    
    /**
     * Preload sound effects
     */
    preloadSounds: function() {
        console.log('Preloading sound effects...');
        
        // Create dummy sounds for testing when actual sound files aren't available
        const dummySounds = {
            select: this.createOscillatorSound(800, 100),
            swap: this.createOscillatorSound(600, 150),
            match: this.createOscillatorSound(1000, 200),
            fall: this.createOscillatorSound(400, 300),
            invalid: this.createOscillatorSound(300, 200),
            levelup: this.createOscillatorSound(1200, 500),
            gameover: this.createOscillatorSound(200, 800)
        };
        
        // Create audio elements for each sound
        for (const [name, path] of Object.entries(this.soundPaths)) {
            try {
                // Try to load the actual sound file
                const audio = new Audio(path);
                audio.volume = this.volume;
                
                // Add error handler to fall back to dummy sound
                audio.addEventListener('error', () => {
                    console.warn(`Failed to load sound file: ${path}, using fallback`);
                    this.sounds[name] = dummySounds[name];
                });
                
                this.sounds[name] = audio;
                console.log(`Preloaded sound: ${name}`);
            } catch (e) {
                console.warn(`Failed to preload sound: ${name}, using fallback`, e);
                this.sounds[name] = dummySounds[name];
            }
        }
    },
    
    /**
     * Create a simple oscillator sound as fallback
     * @param {number} frequency - Sound frequency
     * @param {number} duration - Sound duration in ms
     * @returns {Object} Sound-like object with play method
     */
    createOscillatorSound: function(frequency, duration) {
        return {
            play: function() {
                try {
                    // Create audio context
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (!AudioContext) return Promise.resolve();
                    
                    const audioCtx = new AudioContext();
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = frequency;
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    
                    // Add fade out
                    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration/1000);
                    
                    oscillator.start();
                    setTimeout(() => {
                        oscillator.stop();
                        audioCtx.close();
                    }, duration);
                    
                    return Promise.resolve();
                } catch (e) {
                    console.debug('Error playing oscillator sound:', e);
                    return Promise.resolve();
                }
            },
            pause: function() {},
            currentTime: 0,
            volume: 0.3
        };
    },
    
    /**
     * Load sound settings from local storage
     */
    loadSettings: function() {
        try {
            const soundEnabled = localStorage.getItem('colorfulBulbs_soundEnabled');
            const musicEnabled = localStorage.getItem('colorfulBulbs_musicEnabled');
            const volume = localStorage.getItem('colorfulBulbs_volume');
            const musicVolume = localStorage.getItem('colorfulBulbs_musicVolume');
            
            if (soundEnabled !== null) this.enabled = soundEnabled === 'true';
            if (musicEnabled !== null) this.musicEnabled = musicEnabled === 'true';
            if (volume !== null) this.volume = parseFloat(volume);
            if (musicVolume !== null) this.musicVolume = parseFloat(musicVolume);
        } catch (e) {
            console.error('Error loading sound settings:', e);
        }
    },
    
    /**
     * Save sound settings to local storage
     */
    saveSettings: function() {
        try {
            localStorage.setItem('colorfulBulbs_soundEnabled', this.enabled);
            localStorage.setItem('colorfulBulbs_musicEnabled', this.musicEnabled);
            localStorage.setItem('colorfulBulbs_volume', this.volume);
            localStorage.setItem('colorfulBulbs_musicVolume', this.musicVolume);
        } catch (e) {
            console.error('Error saving sound settings:', e);
        }
    },
    
    /**
     * Play a sound effect
     * @param {string} name - Sound name
     */
    play: function(name) {
        if (!this.enabled) return;
        
        const sound = this.sounds[name];
        if (!sound) {
            console.warn(`Sound not found: ${name}`);
            return;
        }
        
        // Reset and play
        try {
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Silently ignore play errors (common in browsers that block autoplay)
                console.debug(`Error playing sound ${name}:`, e);
            });
        } catch (e) {
            console.debug(`Error playing sound ${name}:`, e);
        }
    },
    
    /**
     * Play background music
     * @param {string} name - Music track name
     */
    playMusic: function(name) {
        if (!this.musicEnabled) return;
        
        // Set music source
        try {
            this.backgroundMusic.src = `assets/music/${name}.mp3`;
            this.backgroundMusic.volume = this.musicVolume;
            
            // Play music
            this.backgroundMusic.play().catch(e => {
                console.debug(`Error playing music ${name}:`, e);
            });
        } catch (e) {
            console.debug(`Error playing music ${name}:`, e);
        }
    },
    
    /**
     * Stop background music
     */
    stopMusic: function() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    },
    
    /**
     * Toggle sound effects on/off
     * @returns {boolean} New sound state
     */
    toggleSound: function() {
        this.enabled = !this.enabled;
        this.saveSettings();
        return this.enabled;
    },
    
    /**
     * Toggle music on/off
     * @returns {boolean} New music state
     */
    toggleMusic: function() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled) {
            if (this.backgroundMusic.src) {
                this.backgroundMusic.play().catch(e => {
                    console.debug('Error resuming music:', e);
                });
            }
        } else {
            this.backgroundMusic.pause();
        }
        
        this.saveSettings();
        return this.musicEnabled;
    }
};

// Initialize sound system
document.addEventListener('DOMContentLoaded', function() {
    Sound.init();
});

console.log('Sound module loaded');