/**
 * Preloader.js
 * Handles asset preloading to ensure smooth gameplay experience
 */
class Preloader {
    constructor() {
        this.assets = {
            images: {},
            audio: {},
            data: {}
        };
        
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.isLoading = false;
        
        // Event callbacks
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;
        
        // Asset queues
        this.criticalQueue = [];
        this.secondaryQueue = [];
        this.optionalQueue = [];
    }
    
    /**
     * Add an image to the loading queue
     * @param {string} id - Unique identifier for the image
     * @param {string} src - Image source URL
     * @param {string} priority - 'critical', 'secondary', or 'optional'
     */
    addImage(id, src, priority = 'critical') {
        const asset = { id, src, type: 'image' };
        this._addToQueue(asset, priority);
    }
    
    /**
     * Add an audio file to the loading queue
     * @param {string} id - Unique identifier for the audio
     * @param {string} src - Audio source URL
     * @param {string} priority - 'critical', 'secondary', or 'optional'
     */
    addAudio(id, src, priority = 'secondary') {
        const asset = { id, src, type: 'audio' };
        this._addToQueue(asset, priority);
    }
    
    /**
     * Add a data file (JSON) to the loading queue
     * @param {string} id - Unique identifier for the data
     * @param {string} src - Data source URL
     * @param {string} priority - 'critical', 'secondary', or 'optional'
     */
    addData(id, src, priority = 'critical') {
        const asset = { id, src, type: 'data' };
        this._addToQueue(asset, priority);
    }
    
    /**
     * Start loading all assets in the queue
     * @param {Function} onProgress - Progress callback (percent)
     * @param {Function} onComplete - Completion callback
     * @param {Function} onError - Error callback
     */
    startLoading(onProgress = null, onComplete = null, onError = null) {
        if (this.isLoading) return;
        
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        this.onError = onError;
        this.isLoading = true;
        
        // Calculate total assets
        this.totalAssets = this.criticalQueue.length + this.secondaryQueue.length + this.optionalQueue.length;
        this.loadedAssets = 0;
        
        // Start with critical assets
        this._loadQueue(this.criticalQueue, () => {
            // After critical assets, load secondary
            this._loadQueue(this.secondaryQueue, () => {
                // After secondary assets, load optional
                this._loadQueue(this.optionalQueue, () => {
                    this.isLoading = false;
                    if (this.onComplete) this.onComplete();
                });
            });
        });
    }
    
    /**
     * Get a loaded image asset
     * @param {string} id - Asset identifier
     * @returns {HTMLImageElement} The loaded image
     */
    getImage(id) {
        return this.assets.images[id] || null;
    }
    
    /**
     * Get a loaded audio asset
     * @param {string} id - Asset identifier
     * @returns {HTMLAudioElement} The loaded audio
     */
    getAudio(id) {
        return this.assets.audio[id] || null;
    }
    
    /**
     * Get a loaded data asset
     * @param {string} id - Asset identifier
     * @returns {Object} The loaded data
     */
    getData(id) {
        return this.assets.data[id] || null;
    }
    
    /**
     * Add an asset to the appropriate queue
     * @param {Object} asset - Asset object
     * @param {string} priority - Priority level
     * @private
     */
    _addToQueue(asset, priority) {
        switch (priority) {
            case 'critical':
                this.criticalQueue.push(asset);
                break;
            case 'secondary':
                this.secondaryQueue.push(asset);
                break;
            case 'optional':
                this.optionalQueue.push(asset);
                break;
            default:
                this.secondaryQueue.push(asset);
        }
    }
    
    /**
     * Load all assets in a queue
     * @param {Array} queue - Queue of assets to load
     * @param {Function} callback - Callback when queue is complete
     * @private
     */
    _loadQueue(queue, callback) {
        if (queue.length === 0) {
            callback();
            return;
        }
        
        let loadedCount = 0;
        
        queue.forEach(asset => {
            this._loadAsset(asset, () => {
                loadedCount++;
                this.loadedAssets++;
                
                // Update progress
                if (this.onProgress) {
                    const percent = (this.loadedAssets / this.totalAssets) * 100;
                    this.onProgress(percent);
                }
                
                // Check if queue is complete
                if (loadedCount === queue.length) {
                    callback();
                }
            });
        });
    }
    
    /**
     * Load a single asset
     * @param {Object} asset - Asset to load
     * @param {Function} callback - Callback when asset is loaded
     * @private
     */
    _loadAsset(asset, callback) {
        switch (asset.type) {
            case 'image':
                this._loadImage(asset, callback);
                break;
            case 'audio':
                this._loadAudio(asset, callback);
                break;
            case 'data':
                this._loadData(asset, callback);
                break;
            default:
                console.warn(`Unknown asset type: ${asset.type}`);
                callback();
        }
    }
    
    /**
     * Load an image asset
     * @param {Object} asset - Image asset to load
     * @param {Function} callback - Callback when image is loaded
     * @private
     */
    _loadImage(asset, callback) {
        const img = new Image();
        
        img.onload = () => {
            this.assets.images[asset.id] = img;
            callback();
        };
        
        img.onerror = (err) => {
            console.error(`Failed to load image: ${asset.src}`, err);
            if (this.onError) this.onError(asset, err);
            callback(); // Still call callback to continue loading
        };
        
        img.src = asset.src;
    }
    
    /**
     * Load an audio asset
     * @param {Object} asset - Audio asset to load
     * @param {Function} callback - Callback when audio is loaded
     * @private
     */
    _loadAudio(asset, callback) {
        const audio = new Audio();
        
        audio.oncanplaythrough = () => {
            this.assets.audio[asset.id] = audio;
            callback();
        };
        
        audio.onerror = (err) => {
            console.error(`Failed to load audio: ${asset.src}`, err);
            if (this.onError) this.onError(asset, err);
            callback(); // Still call callback to continue loading
        };
        
        // For iOS, we need to load audio differently
        audio.preload = 'auto';
        audio.src = asset.src;
        audio.load();
    }
    
    /**
     * Load a data asset
     * @param {Object} asset - Data asset to load
     * @param {Function} callback - Callback when data is loaded
     * @private
     */
    _loadData(asset, callback) {
        fetch(asset.src)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.assets.data[asset.id] = data;
                callback();
            })
            .catch(err => {
                console.error(`Failed to load data: ${asset.src}`, err);
                if (this.onError) this.onError(asset, err);
                callback(); // Still call callback to continue loading
            });
    }
}
