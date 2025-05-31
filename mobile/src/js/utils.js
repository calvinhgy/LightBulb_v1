/**
 * 工具函数库
 * 包含通用的辅助函数
 */
const Utils = {
    /**
     * 生成指定范围内的随机整数
     * @param {number} min - 最小值（包含）
     * @param {number} max - 最大值（包含）
     * @returns {number} 随机整数
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * 从数组中随机选择一个元素
     * @param {Array} array - 源数组
     * @returns {*} 随机选中的元素
     */
    randomChoice(array) {
        return array[this.randomInt(0, array.length - 1)];
    },
    
    /**
     * 打乱数组顺序
     * @param {Array} array - 要打乱的数组
     * @returns {Array} 打乱后的新数组
     */
    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    /**
     * 延迟执行函数
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * 计算两点之间的距离
     * @param {number} x1 - 第一点的x坐标
     * @param {number} y1 - 第一点的y坐标
     * @param {number} x2 - 第二点的x坐标
     * @param {number} y2 - 第二点的y坐标
     * @returns {number} 两点间的距离
     */
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    /**
     * 计算两点之间的角度（弧度）
     * @param {number} x1 - 第一点的x坐标
     * @param {number} y1 - 第一点的y坐标
     * @param {number} x2 - 第二点的x坐标
     * @param {number} y2 - 第二点的y坐标
     * @returns {number} 角度（弧度）
     */
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    /**
     * 将弧度转换为角度
     * @param {number} radians - 弧度
     * @returns {number} 角度
     */
    radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    },
    
    /**
     * 将角度转换为方向（上、右、下、左）
     * @param {number} degrees - 角度
     * @returns {string} 方向 ('up', 'right', 'down', 'left')
     */
    degreesToDirection(degrees) {
        // 标准化角度到0-360范围
        const normalized = ((degrees % 360) + 360) % 360;
        
        // 根据角度确定方向
        if (normalized >= 315 || normalized < 45) {
            return 'right';
        } else if (normalized >= 45 && normalized < 135) {
            return 'down';
        } else if (normalized >= 135 && normalized < 225) {
            return 'left';
        } else {
            return 'up';
        }
    },
    
    /**
     * 根据方向获取行列偏移量
     * @param {string} direction - 方向 ('up', 'right', 'down', 'left')
     * @returns {Object} 包含行列偏移量的对象 {row, col}
     */
    getOffsetFromDirection(direction) {
        switch (direction) {
            case 'up': return { row: -1, col: 0 };
            case 'right': return { row: 0, col: 1 };
            case 'down': return { row: 1, col: 0 };
            case 'left': return { row: 0, col: -1 };
            default: return { row: 0, col: 0 };
        }
    },
    
    /**
     * 检查坐标是否在网格范围内
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {number} rows - 总行数
     * @param {number} cols - 总列数
     * @returns {boolean} 是否在范围内
     */
    isInBounds(row, col, rows, cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    },
    
    /**
     * 格式化数字（添加千位分隔符）
     * @param {number} num - 要格式化的数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * 限制数值在指定范围内
     * @param {number} value - 要限制的值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 限制后的值
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * 线性插值
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} t - 插值因子 (0-1)
     * @returns {number} 插值结果
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    /**
     * 缓动函数 - 缓入
     * @param {number} t - 时间因子 (0-1)
     * @returns {number} 缓动结果
     */
    easeIn(t) {
        return t * t;
    },
    
    /**
     * 缓动函数 - 缓出
     * @param {number} t - 时间因子 (0-1)
     * @returns {number} 缓动结果
     */
    easeOut(t) {
        return t * (2 - t);
    },
    
    /**
     * 缓动函数 - 缓入缓出
     * @param {number} t - 时间因子 (0-1)
     * @returns {number} 缓动结果
     */
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    /**
     * 检测设备类型
     * @returns {Object} 设备信息对象
     */
    detectDevice() {
        const ua = navigator.userAgent;
        const isIOS = /iPhone|iPad|iPod/.test(ua);
        const isAndroid = /Android/.test(ua);
        const isMobile = isIOS || isAndroid;
        const isTablet = /iPad/.test(ua) || (isAndroid && !/Mobile/.test(ua));
        
        // 检测iPhone型号
        let iPhoneModel = 'unknown';
        if (isIOS) {
            // 根据屏幕尺寸粗略判断iPhone型号
            const { width, height } = window.screen;
            const screenSize = Math.max(width, height);
            
            if (screenSize <= 667) {
                iPhoneModel = 'small'; // iPhone SE, 8等
            } else if (screenSize <= 812) {
                iPhoneModel = 'medium'; // iPhone X, 11等
            } else {
                iPhoneModel = 'large'; // iPhone Pro Max等
            }
        }
        
        return {
            isIOS,
            isAndroid,
            isMobile,
            isTablet,
            iPhoneModel
        };
    },
    
    /**
     * 检测浏览器支持的特性
     * @returns {Object} 特性支持信息
     */
    detectFeatures() {
        return {
            touchEvents: 'ontouchstart' in window,
            webAudio: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined',
            localStorage: (() => {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            webGL: (() => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(window.WebGLRenderingContext && 
                        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
                } catch (e) {
                    return false;
                }
            })(),
            vibration: 'vibrate' in navigator
        };
    },
    
    /**
     * 振动设备（如果支持）
     * @param {number|Array} pattern - 振动时间或模式
     */
    vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },
    
    /**
     * 预加载图片
     * @param {string|Array} urls - 图片URL或URL数组
     * @returns {Promise} Promise对象，解析为加载的图片
     */
    preloadImages(urls) {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        const promises = urlArray.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                img.src = url;
            });
        });
        return Promise.all(promises);
    },
    
    /**
     * 预加载音频
     * @param {string|Array} urls - 音频URL或URL数组
     * @returns {Promise} Promise对象，解析为加载的音频
     */
    preloadAudio(urls) {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        const promises = urlArray.map(url => {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                audio.oncanplaythrough = () => resolve(audio);
                audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
                audio.src = url;
            });
        });
        return Promise.all(promises);
    },
    
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖处理后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流处理后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
