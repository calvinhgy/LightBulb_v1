/**
 * Utility functions for the Colorful Light Bulbs game
 */

const Utils = {
    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Check if two positions are adjacent
     * @param {Object} pos1 - First position {row, col}
     * @param {Object} pos2 - Second position {row, col}
     * @returns {boolean} True if positions are adjacent
     */
    areAdjacent: function(pos1, pos2) {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        
        // Adjacent if exactly one position differs by 1 and the other is the same
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    },
    
    /**
     * Format a number with commas as thousands separators
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * Format time in seconds to MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Ease-out function for animations
     * @param {number} t - Current time (0-1)
     * @returns {number} Eased value
     */
    easeOutQuad: function(t) {
        return t * (2 - t);
    },
    
    /**
     * Ease-in-out function for animations
     * @param {number} t - Current time (0-1)
     * @returns {number} Eased value
     */
    easeInOutQuad: function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    /**
     * Bounce ease-out function for animations
     * @param {number} t - Current time (0-1)
     * @returns {number} Eased value
     */
    easeOutBounce: function(t) {
        if (t < 1/2.75) {
            return 7.5625 * t * t;
        } else if (t < 2/2.75) {
            return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
        } else if (t < 2.5/2.75) {
            return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
        }
    },
    
    /**
     * Elastic ease-out function for animations
     * @param {number} t - Current time (0-1)
     * @returns {number} Eased value
     */
    easeOutElastic: function(t) {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    
    /**
     * Colors used in the game
     */
    colors: {
        red: '#FF3A3A',
        yellow: '#FFD83A',
        blue: '#3A8CFF',
        green: '#3AFF5C',
        background: '#1A1A2E',
        backgroundLight: '#2A2A4E',
        backgroundMedium: '#252545',
        accent: '#FFB344',
        textLight: '#FFFFFF',
        textDark: '#333333'
    },
    
    /**
     * Bulb types available in the game
     */
    bulbTypes: ['red', 'yellow', 'blue', 'green']
};

console.log('Utils module loaded');