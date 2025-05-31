/**
 * SoundManager.js
 * Handles audio playback for the game
 */
class SoundManager {
    /**
     * Create a new sound manager
     * @param {Object} config - Sound configuration
     */
    constructor(config = {}) {
        this.config = {
            musicVolume: config.musicVolume !== undefined ? config.musicVolume : 0.7,
            sfxVolume: config.sfxVolume !== undefined ? config.sfxVolume : 0.8,
            vibration: config.vibration !== undefined ? config.vibration : true,
            ...config
        };
        
        // Audio context
        this.audioContext = null;
        
        // Sound collections
        this.music = {};
        this.sounds = {};
        
        // Currently playing music
        this.currentMusic = null;
        
        // Mute state
        this.musicMuted = false;
        this.sfxMuted = false;
        
        // Initialize
        this._init();
    }
    
    /**
     * Initialize the sound manager
     * @private
     */
    _init() {
        // Create audio context
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported in this browser');
        }
        
        // Load sounds from preloader
        this._loadSounds();
        
        // Set up iOS audio unlock
        this._setupiOSAudioUnlock();
    }
    
    /**
     * Load sounds from preloader
     * @private
     */
    _loadSounds() {
        const preloader = window.preloader;
        if (!preloader) return;
        
        // Load music
        this._loadSound('music_menu', preloader.getAudio('music_menu'), true);
        this._loadSound('music_gameplay', preloader.getAudio('music_gameplay'), true);
        
        // Load sound effects
        this._loadSound('select', preloader.getAudio('select'));
        this._loadSound('swap', preloader.getAudio('swap'));
        this._loadSound('invalid', preloader.getAudio('invalid'));
        this._loadSound('match_3', preloader.getAudio('match_3'));
        this._loadSound('match_4', preloader.getAudio('match_4'));
        this._loadSound('match_5', preloader.getAudio('match_5'));
        this._loadSound('cascade', preloader.getAudio('cascade'));
    }
    
    /**
     * Load a sound
     * @param {string} id - Sound identifier
     * @param {HTMLAudioElement} audioElement - Audio element
     * @param {boolean} isMusic - Whether this is music or a sound effect
     * @private
     */
    _loadSound(id, audioElement, isMusic = false) {
        if (!audioElement) return;
        
        if (isMusic) {
            audioElement.loop = true;
            this.music[id] = audioElement;
        } else {
            this.sounds[id] = audioElement;
        }
    }
    
    /**
     * Set up iOS audio unlock
     * @private
     */
    _setupiOSAudioUnlock() {
        // iOS requires user interaction to start audio
        document.addEventListener('touchstart', () => {
            // Create and play a silent audio element
            const silentSound = document.createElement('audio');
            silentSound.src = 'data:audio/mp3;base64,//MkxAAHiAICWABElBeKPL/RANb2w+yiT1g/gTok//lP/W/l3h8QO/OCdCqCW2Cw//MkxAQHkAIWUAhEmAQXWUOFW2dxPu//9mr60ElY5sseQ+xxesmHKtZr7bsqqX2L//MkxAgFwAYiQAhEAC2hq22d3///9FTV6tA36JdgBJoOGgc+7qvqej5Zu7/7uI9l//MkxBQHAAYi8AhEAO193vt9KGOq+6qcT7hhfN5FTInmwk8RkqKImTM55pRQHQSq//MkxBsGkgoIAABHhTACIJLf99nVI///yuW1uBqWfEu7CgNPWGpUadBmZ////4sL//MkxCMHMAH9iABEmAsKioqKigsLCwtVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVV//MkxCkECAUYCAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
            silentSound.play();
            
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }
    
    /**
     * Play a sound effect
     * @param {string} id - Sound identifier
     * @param {Object} options - Playback options
     * @returns {HTMLAudioElement|null} The audio element or null
     */
    playSound(id, options = {}) {
        if (this.sfxMuted || !this.sounds[id]) {
            return null;
        }
        
        // Clone the audio element to allow overlapping sounds
        const sound = this.sounds[id].cloneNode();
        
        // Set volume
        sound.volume = this.config.sfxVolume;
        
        // Apply options
        if (options.volume !== undefined) {
            sound.volume *= options.volume;
        }
        
        if (options.pitch !== undefined && this.audioContext) {
            // Use Web Audio API for pitch shifting
            const source = this.audioContext.createMediaElementSource(sound);
            const pitchEffect = this.audioContext.createBiquadFilter();
            
            pitchEffect.type = 'allpass';
            pitchEffect.frequency.value = 350 * options.pitch;
            
            source.connect(pitchEffect);
            pitchEffect.connect(this.audioContext.destination);
        }
        
        // Play the sound
        sound.play().catch(e => console.warn(`Failed to play sound: ${id}`, e));
        
        return sound;
    }
    
    /**
     * Play background music
     * @param {string} id - Music identifier
     * @returns {HTMLAudioElement|null} The audio element or null
     */
    playMusic(id) {
        if (this.musicMuted || !this.music[id]) {
            return null;
        }
        
        // Stop current music
        this.stopMusic();
        
        // Play new music
        const music = this.music[id];
        music.volume = this.config.musicVolume;
        music.currentTime = 0;
        music.play().catch(e => console.warn(`Failed to play music: ${id}`, e));
        
        this.currentMusic = music;
        return music;
    }
    
    /**
     * Stop background music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    /**
     * Pause background music
     */
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }
    
    /**
     * Resume background music
     */
    resumeMusic() {
        if (this.currentMusic) {
            this.currentMusic.play().catch(e => console.warn('Failed to resume music', e));
        }
    }
    
    /**
     * Set music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.config.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.currentMusic) {
            this.currentMusic.volume = this.config.musicVolume;
        }
    }
    
    /**
     * Set sound effect volume
     * @param {number} volume - Volume level (0-1)
     */
    setSfxVolume(volume) {
        this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Mute or unmute music
     * @param {boolean} muted - Whether music should be muted
     */
    setMusicMuted(muted) {
        this.musicMuted = muted;
        
        if (this.currentMusic) {
            if (muted) {
                this.pauseMusic();
            } else {
                this.resumeMusic();
            }
        }
    }
    
    /**
     * Mute or unmute sound effects
     * @param {boolean} muted - Whether sound effects should be muted
     */
    setSfxMuted(muted) {
        this.sfxMuted = muted;
    }
    
    /**
     * Enable or disable vibration
     * @param {boolean} enabled - Whether vibration should be enabled
     */
    setVibrationEnabled(enabled) {
        this.config.vibration = enabled;
    }
    
    /**
     * Trigger vibration if enabled
     * @param {number|Array<number>} pattern - Vibration pattern in milliseconds
     */
    vibrate(pattern) {
        if (this.config.vibration && 'vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}
