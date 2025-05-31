/**
 * Scores module for managing high scores
 */
const Scores = {
    /**
     * Maximum number of high scores to store
     */
    MAX_SCORES: 10,
    
    /**
     * Local storage key for high scores
     */
    STORAGE_KEY: 'colorfulBulbs_highScores',
    
    /**
     * Get high scores from local storage
     * @returns {Array} Array of high score objects
     */
    getHighScores: function() {
        const scoresJson = localStorage.getItem(this.STORAGE_KEY);
        if (scoresJson) {
            try {
                return JSON.parse(scoresJson);
            } catch (e) {
                console.error('Error parsing high scores:', e);
                return [];
            }
        }
        return [];
    },
    
    /**
     * Save high scores to local storage
     * @param {Array} scores - Array of high score objects
     */
    saveHighScores: function(scores) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
        } catch (e) {
            console.error('Error saving high scores:', e);
        }
    },
    
    /**
     * Add a new high score
     * @param {number} score - Score value
     * @param {number} level - Level reached
     * @returns {boolean} True if score was high enough to be added
     */
    addHighScore: function(score, level) {
        const scores = this.getHighScores();
        const newScore = {
            score: score,
            level: level,
            date: new Date().toISOString()
        };
        
        // Add score if there are fewer than MAX_SCORES or if it's higher than the lowest score
        if (scores.length < this.MAX_SCORES || score > scores[scores.length - 1].score) {
            scores.push(newScore);
            scores.sort((a, b) => b.score - a.score); // Sort descending
            
            // Keep only the top MAX_SCORES
            if (scores.length > this.MAX_SCORES) {
                scores.length = this.MAX_SCORES;
            }
            
            this.saveHighScores(scores);
            return true;
        }
        
        return false;
    },
    
    /**
     * Display high scores in the table
     */
    displayHighScores: function() {
        const scores = this.getHighScores();
        const table = document.getElementById('high-scores-table');
        
        if (!table) {
            console.error('High scores table not found');
            return;
        }
        
        // Clear existing rows
        table.innerHTML = '';
        
        // Create header row
        const headerRow = document.createElement('tr');
        ['Rank', 'Score', 'Level', 'Date'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        
        // Add score rows
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            
            // Rank
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);
            
            // Score
            const scoreCell = document.createElement('td');
            scoreCell.textContent = Utils.formatNumber(score.score);
            row.appendChild(scoreCell);
            
            // Level
            const levelCell = document.createElement('td');
            levelCell.textContent = score.level;
            row.appendChild(levelCell);
            
            // Date
            const dateCell = document.createElement('td');
            const date = new Date(score.date);
            dateCell.textContent = date.toLocaleDateString();
            row.appendChild(dateCell);
            
            table.appendChild(row);
        });
        
        // If no scores, show message
        if (scores.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No high scores yet!';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            table.appendChild(row);
        }
    }
};

console.log('Scores module loaded');