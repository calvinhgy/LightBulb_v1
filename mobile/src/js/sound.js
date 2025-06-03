/**
 * 音频管理器
 * 处理游戏中的音效和背景音乐
 */
const SoundManager = {
    // 音频上下文
    audioContext: null,
    
    // 音频缓存
    audioBuffers: {},
    
    // 当前播放的音乐
    currentMusic: null,
    
    // 音量设置
    volumes: {
        music: CONFIG.AUDIO.DEFAULT_VOLUME.MUSIC,
        sfx: CONFIG.AUDIO.DEFAULT_VOLUME.SFX
    },
    
    // 是否已初始化
    initialized: false,
    
    /**
     * 初始化音频系统
     */
    init() {
        // 检查Web Audio API支持
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.initialized = true;
            
            // 加载设置中的音量
            const settings = Storage.loadSettings();
            if (settings && settings.audio) {
                this.volumes.music = settings.audio.musicVolume;
                this.volumes.sfx = settings.audio.sfxVolume;
            }
            
            // 预加载音效
            this.preloadSounds();
            
            console.log('Sound system initialized');
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
            this.initialized = false;
        }
    },
    
    /**
     * 预加载常用音效
     */
    async preloadSounds() {
        if (!this.initialized) return;
        
        const soundsToPreload = [
            CONFIG.AUDIO.SFX.SELECT,
            CONFIG.AUDIO.SFX.SWAP,
            CONFIG.AUDIO.SFX.MATCH,
            CONFIG.AUDIO.SFX.INVALID
        ];
        
        try {
            for (const soundPath of soundsToPreload) {
                await this.loadSound(soundPath);
            }
            console.log('Common sounds preloaded');
        } catch (error) {
            console.error('Error preloading sounds:', error);
        }
    },
    
    /**
     * 加载音频文件
     * @param {string} url - 音频文件URL
     * @returns {Promise} Promise对象，解析为音频缓冲区
     */
    loadSound(url) {
        if (!this.initialized) return Promise.resolve(null);
        
        // 如果已经加载过，直接返回缓存
        if (this.audioBuffers[url]) {
            return Promise.resolve(this.audioBuffers[url]);
        }
        
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.audioBuffers[url] = audioBuffer;
                return audioBuffer;
            })
            .catch(error => {
                console.error(`Error loading sound ${url}:`, error);
                return null;
            });
    },
    
    /**
     * 播放音效
     * @param {string} soundId - 音效ID或URL
     * @param {Object} options - 播放选项
     * @param {number} options.volume - 音量 (0-1)
     * @param {number} options.pitch - 音高倍数 (默认1)
     * @param {boolean} options.loop - 是否循环播放
     * @returns {Object|null} 音频源对象或null
     */
    playSFX(soundId, options = {}) {
        if (!this.initialized) return null;
        
        // 如果音频上下文被暂停，恢复它
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // 获取音效URL
        const soundUrl = CONFIG.AUDIO.SFX[soundId] || soundId;
        
        // 设置默认选项
        const settings = {
            volume: options.volume !== undefined ? options.volume : this.volumes.sfx,
            pitch: options.pitch || 1,
            loop: options.loop || false
        };
        
        // 加载并播放音效
        this.loadSound(soundUrl).then(buffer => {
            if (!buffer) return;
            
            // 创建音频源
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.playbackRate.value = settings.pitch;
            source.loop = settings.loop;
            
            // 创建增益节点控制音量
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = settings.volume;
            
            // 创建低通滤波器使声音更柔和
            const lowPassFilter = this.audioContext.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.value = 2200;
            lowPassFilter.Q.value = 0.7;
            
            // 创建包络器使声音更短促
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(settings.volume, now + 0.02); // 快速淡入
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2); // 快速淡出，总持续时间约0.2秒
            
            // 连接节点
            source.connect(lowPassFilter);
            lowPassFilter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 播放音效
            source.start(0);
            // 设置在0.25秒后停止，确保声音短促
            source.stop(now + 0.25);
            
            // 返回音频源，以便后续控制
            return { source, gainNode };
        }).catch(error => {
            console.error(`Error playing sound ${soundId}:`, error);
            return null;
        });
    },
    
    /**
     * 播放背景音乐
     * @param {string} musicId - 音乐ID或URL
     * @param {Object} options - 播放选项
     * @param {number} options.volume - 音量 (0-1)
     * @param {boolean} options.loop - 是否循环播放
     * @param {number} options.fadeIn - 淡入时间 (秒)
     */
    playMusic(musicId, options = {}) {
        if (!this.initialized) return;
        
        // 如果已经在播放相同的音乐，不做任何操作
        if (this.currentMusic && this.currentMusic.id === musicId) {
            return;
        }
        
        // 如果正在播放其他音乐，先停止
        if (this.currentMusic) {
            this.stopMusic();
        }
        
        // 获取音乐URL
        const musicUrl = CONFIG.AUDIO.MUSIC[musicId] || musicId;
        
        // 设置默认选项
        const settings = {
            volume: options.volume !== undefined ? options.volume : this.volumes.music,
            loop: options.loop !== undefined ? options.loop : true,
            fadeIn: options.fadeIn || 0
        };
        
        // 加载并播放音乐
        this.loadSound(musicUrl).then(buffer => {
            if (!buffer) return;
            
            // 创建音频源
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = settings.loop;
            
            // 创建增益节点控制音量
            const gainNode = this.audioContext.createGain();
            
            // 如果需要淡入，设置初始音量为0
            if (settings.fadeIn > 0) {
                gainNode.gain.value = 0;
                gainNode.gain.linearRampToValueAtTime(
                    settings.volume,
                    this.audioContext.currentTime + settings.fadeIn
                );
            } else {
                gainNode.gain.value = settings.volume;
            }
            
            // 连接节点
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 播放音乐
            source.start(0);
            
            // 保存当前音乐引用
            this.currentMusic = {
                id: musicId,
                source: source,
                gainNode: gainNode
            };
        }).catch(error => {
            console.error(`Error playing music ${musicId}:`, error);
        });
    },
    
    /**
     * 停止背景音乐
     * @param {number} fadeOut - 淡出时间 (秒)
     */
    stopMusic(fadeOut = 0) {
        if (!this.initialized || !this.currentMusic) return;
        
        const { source, gainNode } = this.currentMusic;
        
        if (fadeOut > 0) {
            // 淡出音乐
            const currentTime = this.audioContext.currentTime;
            gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeOut);
            
            // 淡出后停止
            setTimeout(() => {
                try {
                    source.stop();
                } catch (e) {
                    // 忽略已经停止的音频源
                }
                this.currentMusic = null;
            }, fadeOut * 1000);
        } else {
            // 直接停止
            try {
                source.stop();
            } catch (e) {
                // 忽略已经停止的音频源
            }
            this.currentMusic = null;
        }
    },
    
    /**
     * 暂停所有音频
     */
    pauseAll() {
        if (!this.initialized) return;
        this.audioContext.suspend();
    },
    
    /**
     * 恢复所有音频
     */
    resumeAll() {
        if (!this.initialized) return;
        this.audioContext.resume();
    },
    
    /**
     * 设置音乐音量
     * @param {number} volume - 音量 (0-1)
     */
    setMusicVolume(volume) {
        this.volumes.music = volume;
        
        // 更新当前播放的音乐音量
        if (this.currentMusic && this.currentMusic.gainNode) {
            this.currentMusic.gainNode.gain.value = volume;
        }
        
        // 保存设置
        const settings = Storage.loadSettings();
        settings.audio.musicVolume = volume;
        Storage.saveSettings(settings);
    },
    
    /**
     * 设置音效音量
     * @param {number} volume - 音量 (0-1)
     */
    setSFXVolume(volume) {
        this.volumes.sfx = volume;
        
        // 保存设置
        const settings = Storage.loadSettings();
        settings.audio.sfxVolume = volume;
        Storage.saveSettings(settings);
    },
    
    /**
     * 播放按钮点击音效
     */
    playButtonSound() {
        this.playSFX('SELECT');
    },
    
    /**
     * 播放灯泡选择音效
     */
    playSelectSound() {
        this.playSFX('SELECT');
    },
    
    /**
     * 播放灯泡交换音效
     */
    playSwapSound() {
        this.playSFX('SWAP');
    },
    
    /**
     * 播放匹配音效
     * @param {number} matchSize - 匹配的灯泡数量
     */
    playMatchSound(matchSize = 3) {
        // 根据匹配大小选择不同音阶的肥皂泡泡声音
        // 限制在1-5的范围内
        const comboLevel = Math.min(Math.max(matchSize - 2, 1), 5);
        
        // 使用对应音阶的肥皂泡泡声音
        const soundId = `MATCH_${comboLevel}`;
        
        // 如果有特定的连消音效，则使用它，否则使用基础音效并调整音高
        if (CONFIG.AUDIO.SFX[soundId]) {
            this.playSFX(soundId);
        } else {
            // 根据匹配大小调整音高作为备选方案
            const pitch = 1 + (matchSize - 3) * 0.15; // 3个匹配=1.0, 4个=1.15, 5个=1.3
            this.playSFX('MATCH', { pitch });
        }
    },
    
    /**
     * 播放无效移动音效
     */
    playInvalidSound() {
        this.playSFX('INVALID');
    },
    
    /**
     * 播放特殊灯泡激活音效
     */
    playSpecialSound() {
        this.playSFX('SPECIAL');
    },
    
    /**
     * 播放关卡完成音效
     */
    playLevelCompleteSound() {
        this.playSFX('LEVEL_COMPLETE');
    },
    
    /**
     * 播放关卡失败音效
     */
    playLevelFailedSound() {
        this.playSFX('LEVEL_FAILED');
    }
};
