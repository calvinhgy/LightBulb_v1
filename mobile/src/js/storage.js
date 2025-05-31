/**
 * 存储管理器
 * 处理游戏数据的本地存储和读取
 */
const Storage = {
    /**
     * 保存数据到本地存储
     * @param {string} key - 存储键
     * @param {*} data - 要存储的数据
     * @returns {boolean} 是否成功保存
     */
    save(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },
    
    /**
     * 从本地存储加载数据
     * @param {string} key - 存储键
     * @param {*} defaultValue - 如果数据不存在时的默认值
     * @returns {*} 加载的数据或默认值
     */
    load(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return defaultValue;
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    },
    
    /**
     * 从本地存储删除数据
     * @param {string} key - 存储键
     * @returns {boolean} 是否成功删除
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    /**
     * 清除所有本地存储数据
     * @returns {boolean} 是否成功清除
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },
    
    /**
     * 保存游戏设置
     * @param {Object} settings - 游戏设置对象
     * @returns {boolean} 是否成功保存
     */
    saveSettings(settings) {
        return this.save(CONFIG.STORAGE.SETTINGS, settings);
    },
    
    /**
     * 加载游戏设置
     * @returns {Object} 游戏设置对象
     */
    loadSettings() {
        const defaultSettings = {
            audio: {
                musicVolume: CONFIG.AUDIO.DEFAULT_VOLUME.MUSIC,
                sfxVolume: CONFIG.AUDIO.DEFAULT_VOLUME.SFX
            },
            accessibility: {
                colorBlindMode: false,
                reducedMotion: false
            },
            controls: {
                scheme: 'swipe' // 'swipe' 或 'tap'
            }
        };
        
        return this.load(CONFIG.STORAGE.SETTINGS, defaultSettings);
    },
    
    /**
     * 保存游戏进度
     * @param {Object} progress - 游戏进度对象
     * @returns {boolean} 是否成功保存
     */
    saveProgress(progress) {
        return this.save(CONFIG.STORAGE.PROGRESS, progress);
    },
    
    /**
     * 加载游戏进度
     * @returns {Object} 游戏进度对象
     */
    loadProgress() {
        const defaultProgress = {
            currentLevel: 1,
            unlockedLevels: 1,
            levelData: {} // 格式: { levelId: { stars: 0, score: 0, completed: false } }
        };
        
        return this.load(CONFIG.STORAGE.PROGRESS, defaultProgress);
    },
    
    /**
     * 更新特定关卡的进度
     * @param {number} levelId - 关卡ID
     * @param {Object} levelData - 关卡数据 { stars, score, completed }
     * @returns {boolean} 是否成功更新
     */
    updateLevelProgress(levelId, levelData) {
        const progress = this.loadProgress();
        
        // 更新关卡数据
        if (!progress.levelData[levelId] || levelData.score > progress.levelData[levelId].score) {
            progress.levelData[levelId] = {
                stars: levelData.stars,
                score: levelData.score,
                completed: levelData.completed
            };
        }
        
        // 如果完成了当前关卡，解锁下一关
        if (levelData.completed && levelId === progress.unlockedLevels) {
            progress.unlockedLevels = Math.max(progress.unlockedLevels, levelId + 1);
        }
        
        return this.saveProgress(progress);
    },
    
    /**
     * 保存高分记录
     * @param {Object} highScores - 高分记录对象
     * @returns {boolean} 是否成功保存
     */
    saveHighScores(highScores) {
        return this.save(CONFIG.STORAGE.HIGH_SCORES, highScores);
    },
    
    /**
     * 加载高分记录
     * @returns {Object} 高分记录对象
     */
    loadHighScores() {
        return this.load(CONFIG.STORAGE.HIGH_SCORES, {});
    },
    
    /**
     * 更新高分记录
     * @param {number} levelId - 关卡ID
     * @param {number} score - 分数
     * @param {string} playerName - 玩家名称 (可选)
     * @returns {boolean} 是否是新的高分
     */
    updateHighScore(levelId, score, playerName = '') {
        const highScores = this.loadHighScores();
        
        // 如果没有该关卡的记录或分数更高，则更新
        if (!highScores[levelId] || score > highScores[levelId].score) {
            highScores[levelId] = {
                score,
                playerName,
                date: new Date().toISOString()
            };
            
            this.saveHighScores(highScores);
            return true;
        }
        
        return false;
    }
};
