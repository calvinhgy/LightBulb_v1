/**
 * 游戏配置
 * 包含游戏的全局配置参数
 */
const CONFIG = {
    // 游戏板配置
    BOARD: {
        // 默认网格大小 (会根据设备自动调整)
        DEFAULT_GRID_SIZE: { rows: 8, cols: 8 },
        // 小屏幕设备网格大小 (iPhone SE等)
        SMALL_SCREEN_GRID_SIZE: { rows: 7, cols: 7 },
        // 大屏幕设备网格大小 (iPhone Pro Max等)
        LARGE_SCREEN_GRID_SIZE: { rows: 9, cols: 9 },
        // 灯泡颜色
        COLORS: ['red', 'yellow', 'blue', 'green'],
        // 灯泡大小 (像素)
        BULB_SIZE: 60,
        // 灯泡间距 (像素)
        BULB_PADDING: 5,
        // 动画持续时间 (毫秒)
        ANIMATION_DURATION: 300,
        // 级联延迟 (毫秒)
        CASCADE_DELAY: 100,
        // 匹配闪烁持续时间 (毫秒)
        MATCH_FLASH_DURATION: 200,
        // 无效移动抖动持续时间 (毫秒)
        INVALID_SHAKE_DURATION: 200,
        // 提示闪烁持续时间 (毫秒)
        HINT_FLASH_DURATION: 500,
        // 提示闪烁次数
        HINT_FLASH_COUNT: 3
    },
    
    // 游戏规则配置
    GAME: {
        // 最小匹配数量
        MIN_MATCH: 3,
        // 特殊灯泡匹配数量
        SPECIAL_MATCH: {
            LINE: 4,  // 直线灯泡 (匹配4个)
            BOMB: 5,  // 炸弹灯泡 (匹配5个L或T形)
            RAINBOW: 5 // 彩虹灯泡 (匹配5个一行)
        },
        // 基础分数
        BASE_SCORE: 10,
        // 级联分数倍数
        CASCADE_MULTIPLIER: 1.5,
        // 特殊灯泡分数倍数
        SPECIAL_MULTIPLIER: {
            LINE: 2,
            BOMB: 3,
            RAINBOW: 5
        },
        // 默认移动次数
        DEFAULT_MOVES: 15,
        // 星级评分阈值 (目标分数的百分比)
        STAR_THRESHOLDS: [0.5, 0.75, 1.0]
    },
    
    // 触摸控制配置
    TOUCH: {
        // 最小滑动距离 (像素)
        MIN_SWIPE_DISTANCE: 10,
        // 最大滑动距离 (像素)
        MAX_SWIPE_DISTANCE: 100,
        // 滑动方向容差 (度)
        DIRECTION_TOLERANCE: 30,
        // 滑动速度范围 (像素/秒)
        VELOCITY: {
            MIN: 50,
            MAX: 500
        },
        // 点击容差 (像素)
        TAP_TOLERANCE: 5,
        // 点击持续时间上限 (毫秒)
        MAX_TAP_DURATION: 200
    },
    
    // 音频配置
    AUDIO: {
        // 默认音量 (0-1)
        DEFAULT_VOLUME: {
            MUSIC: 0.7,
            SFX: 0.8
        },
        // 音效文件
        SFX: {
            SELECT: 'assets/sounds/select.mp3',
            SWAP: 'assets/sounds/swap.mp3',
            MATCH: 'sounds/match.mp3',
            MATCH_1: 'sounds/match_1.mp3',
            MATCH_2: 'sounds/match_2.mp3',
            MATCH_3: 'sounds/match_3.mp3',
            MATCH_4: 'sounds/match_4.mp3',
            MATCH_5: 'sounds/match_5.mp3',
            INVALID: 'assets/sounds/invalid.mp3',
            SPECIAL: 'assets/sounds/special.mp3',
            LEVEL_COMPLETE: 'assets/sounds/level_complete.mp3',
            LEVEL_FAILED: 'assets/sounds/level_failed.mp3'
        },
        // 背景音乐文件
        MUSIC: {
            MENU: 'assets/sounds/menu_music.mp3',
            GAME: 'assets/sounds/game_music.mp3'
        }
    },
    
    // 存储键
    STORAGE: {
        SETTINGS: 'lightbulb_settings',
        PROGRESS: 'lightbulb_progress',
        HIGH_SCORES: 'lightbulb_high_scores'
    },
    
    // 设备检测阈值
    DEVICE: {
        SMALL_SCREEN_HEIGHT: 667,  // iPhone SE高度
        LARGE_SCREEN_HEIGHT: 844   // iPhone Pro Max高度
    }
};

// 根据设备调整配置
function adjustConfigForDevice() {
    const screenHeight = window.innerHeight;
    
    // 小屏幕设备
    if (screenHeight <= CONFIG.DEVICE.SMALL_SCREEN_HEIGHT) {
        CONFIG.BOARD.BULB_SIZE = 50;
        CONFIG.BOARD.CURRENT_GRID_SIZE = CONFIG.BOARD.SMALL_SCREEN_GRID_SIZE;
    } 
    // 大屏幕设备
    else if (screenHeight >= CONFIG.DEVICE.LARGE_SCREEN_HEIGHT) {
        CONFIG.BOARD.BULB_SIZE = 70;
        CONFIG.BOARD.CURRENT_GRID_SIZE = CONFIG.BOARD.LARGE_SCREEN_GRID_SIZE;
    } 
    // 中等屏幕设备
    else {
        CONFIG.BOARD.CURRENT_GRID_SIZE = CONFIG.BOARD.DEFAULT_GRID_SIZE;
    }
    
    // 计算游戏板尺寸
    const { rows, cols } = CONFIG.BOARD.CURRENT_GRID_SIZE;
    const totalSize = (CONFIG.BOARD.BULB_SIZE + CONFIG.BOARD.BULB_PADDING * 2);
    
    CONFIG.BOARD.WIDTH = cols * totalSize;
    CONFIG.BOARD.HEIGHT = rows * totalSize;
}

// 页面加载时调整配置
window.addEventListener('load', adjustConfigForDevice);
// 屏幕方向改变时重新调整
window.addEventListener('orientationchange', adjustConfigForDevice);
