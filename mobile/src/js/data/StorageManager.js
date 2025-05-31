/**
 * StorageManager.js
 * Handles data persistence for the game
 */
class StorageManager {
    constructor() {
        this.storageAvailable = this._checkStorageAvailability();
        this.dbAvailable = this._checkIndexedDBAvailability();
        
        // Initialize IndexedDB if available
        if (this.dbAvailable) {
            this._initializeDB();
        }
    }
    
    /**
     * Save data to storage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {Promise} Promise that resolves when data is saved
     */
    saveData(key, data) {
        return new Promise((resolve, reject) => {
            // For small data, use localStorage
            if (this.storageAvailable && this._isSmallData(data)) {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    resolve();
                } catch (error) {
                    console.error('Failed to save data to localStorage:', error);
                    
                    // Fall back to IndexedDB if available
                    if (this.dbAvailable) {
                        this._saveToIndexedDB(key, data)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(error);
                    }
                }
            } 
            // For larger data, use IndexedDB
            else if (this.dbAvailable) {
                this._saveToIndexedDB(key, data)
                    .then(resolve)
                    .catch(reject);
            } 
            // No storage available
            else {
                reject(new Error('No storage mechanism available'));
            }
        });
    }
    
    /**
     * Load data from storage
     * @param {string} key - Storage key
     * @returns {Promise} Promise that resolves with the loaded data
     */
    loadData(key) {
        return new Promise((resolve, reject) => {
            // Try localStorage first
            if (this.storageAvailable) {
                try {
                    const data = localStorage.getItem(key);
                    if (data !== null) {
                        resolve(JSON.parse(data));
                        return;
                    }
                } catch (error) {
                    console.warn('Failed to load data from localStorage:', error);
                    // Continue to try IndexedDB
                }
            }
            
            // Try IndexedDB if localStorage failed or data wasn't found
            if (this.dbAvailable) {
                this._loadFromIndexedDB(key)
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve(null); // No data found
            }
        });
    }
    
    /**
     * Delete data from storage
     * @param {string} key - Storage key
     * @returns {Promise} Promise that resolves when data is deleted
     */
    deleteData(key) {
        return new Promise((resolve, reject) => {
            const promises = [];
            
            // Delete from localStorage if available
            if (this.storageAvailable) {
                try {
                    localStorage.removeItem(key);
                } catch (error) {
                    console.warn('Failed to delete data from localStorage:', error);
                }
            }
            
            // Delete from IndexedDB if available
            if (this.dbAvailable) {
                promises.push(this._deleteFromIndexedDB(key));
            }
            
            // Resolve when all deletions are complete
            Promise.all(promises)
                .then(() => resolve())
                .catch(reject);
        });
    }
    
    /**
     * Clear all game data
     * @returns {Promise} Promise that resolves when all data is cleared
     */
    clearAllData() {
        return new Promise((resolve, reject) => {
            const promises = [];
            
            // Clear localStorage if available
            if (this.storageAvailable) {
                try {
                    // Only clear keys that belong to our game
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('lightbulb_')) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    console.warn('Failed to clear localStorage:', error);
                }
            }
            
            // Clear IndexedDB if available
            if (this.dbAvailable) {
                promises.push(this._clearIndexedDB());
            }
            
            // Resolve when all clearing is complete
            Promise.all(promises)
                .then(() => resolve())
                .catch(reject);
        });
    }
    
    /**
     * Check if data exists in storage
     * @param {string} key - Storage key
     * @returns {Promise<boolean>} Promise that resolves with true if data exists
     */
    hasData(key) {
        return new Promise((resolve) => {
            // Check localStorage first
            if (this.storageAvailable) {
                try {
                    if (localStorage.getItem(key) !== null) {
                        resolve(true);
                        return;
                    }
                } catch (error) {
                    console.warn('Failed to check localStorage:', error);
                }
            }
            
            // Check IndexedDB if localStorage failed or data wasn't found
            if (this.dbAvailable) {
                this._loadFromIndexedDB(key)
                    .then(data => resolve(data !== null))
                    .catch(() => resolve(false));
            } else {
                resolve(false);
            }
        });
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     * @private
     */
    _checkStorageAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check if IndexedDB is available
     * @returns {boolean} True if IndexedDB is available
     * @private
     */
    _checkIndexedDBAvailability() {
        return 'indexedDB' in window;
    }
    
    /**
     * Initialize IndexedDB
     * @private
     */
    _initializeDB() {
        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open('LightBulbGame', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains('gameData')) {
                    db.createObjectStore('gameData');
                }
            };
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    /**
     * Save data to IndexedDB
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {Promise} Promise that resolves when data is saved
     * @private
     */
    _saveToIndexedDB(key, data) {
        return this.dbPromise.then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['gameData'], 'readwrite');
                const store = transaction.objectStore('gameData');
                const request = store.put(data, key);
                
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }
    
    /**
     * Load data from IndexedDB
     * @param {string} key - Storage key
     * @returns {Promise} Promise that resolves with the loaded data
     * @private
     */
    _loadFromIndexedDB(key) {
        return this.dbPromise.then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['gameData'], 'readonly');
                const store = transaction.objectStore('gameData');
                const request = store.get(key);
                
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }
    
    /**
     * Delete data from IndexedDB
     * @param {string} key - Storage key
     * @returns {Promise} Promise that resolves when data is deleted
     * @private
     */
    _deleteFromIndexedDB(key) {
        return this.dbPromise.then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['gameData'], 'readwrite');
                const store = transaction.objectStore('gameData');
                const request = store.delete(key);
                
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }
    
    /**
     * Clear all data from IndexedDB
     * @returns {Promise} Promise that resolves when all data is cleared
     * @private
     */
    _clearIndexedDB() {
        return this.dbPromise.then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['gameData'], 'readwrite');
                const store = transaction.objectStore('gameData');
                const request = store.clear();
                
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }
    
    /**
     * Check if data is small enough for localStorage
     * @param {*} data - Data to check
     * @returns {boolean} True if data is small enough
     * @private
     */
    _isSmallData(data) {
        try {
            const serialized = JSON.stringify(data);
            return serialized.length < 100000; // ~100KB limit
        } catch (e) {
            return false;
        }
    }
}
