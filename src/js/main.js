/**
 * Main entry point for the Colorful Light Bulbs game
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    try {
        // Initialize sound system first
        if (typeof Sound !== 'undefined') {
            Sound.init();
            console.log('Sound system initialized');
            
            // Test sound
            setTimeout(() => {
                Sound.play('select');
                console.log('Test sound played');
            }, 1000);
        }
        
        // Get canvas element
        const canvas = document.getElementById('game-board');
        
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        // Set initial canvas size
        if (!canvas.width || !canvas.height) {
            canvas.width = 640;
            canvas.height = 640;
        }
        
        console.log(`Initial canvas size: ${canvas.width}x${canvas.height}`);
        
        // Initialize UI
        if (typeof UI !== 'undefined') {
            // Create game instance
            console.log('Creating game instance...');
            const game = new Game(canvas);
            
            // Initialize UI with game instance
            UI.init(game);
            
            // Store game instance globally for access from other scripts
            window.gameInstance = game;
        } else {
            console.error('UI module not loaded, falling back to simple game');
            initSimpleGame();
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            resizeCanvas();
        });
        
        // Initial canvas resize
        resizeCanvas();
        
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});

/**
 * Resize canvas to fit the container while maintaining aspect ratio
 */
function resizeCanvas() {
    const canvas = document.getElementById('game-board');
    const container = document.getElementById('game-board-container');
    
    if (!canvas || !container) {
        console.error('Canvas or container not found');
        return;
    }
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    console.log(`Container size: ${containerWidth}x${containerHeight}`);
    
    // Determine the size that fits within the container
    const size = Math.min(containerWidth, containerHeight);
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    console.log(`Resized canvas to: ${canvas.width}x${canvas.height}`);
    
    // If game is already initialized, recalculate bulb size
    if (window.gameInstance && window.gameInstance.board) {
        window.gameInstance.calculateBulbSize();
        window.gameInstance.render();
    }
}

/**
 * Initialize a simple game if the full game classes aren't available
 */
function initSimpleGame() {
    console.log('Initializing simple game');
    
    // Add click handler to play button
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', () => {
            document.getElementById('main-menu').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
            
            // Initialize simple game
            const canvas = document.getElementById('game-board');
            const ctx = canvas.getContext('2d');
            
            // Define bulb types and colors
            const BULB_TYPES = ['red', 'yellow', 'blue', 'green'];
            const COLORS = {
                red: '#FF3A3A',
                yellow: '#FFD83A',
                blue: '#3A8CFF',
                green: '#3AFF5C',
                background: '#1A1A2E',
                backgroundLight: '#2A2A4E'
            };
            
            // Game state
            let bulbSize = 40;
            let rows = 8, cols = 8;
            let grid = [];
            let boardOffsetX = 0, boardOffsetY = 0;
            
            // Calculate board dimensions
            const maxBulbWidth = canvas.width / cols;
            const maxBulbHeight = canvas.height / rows;
            bulbSize = Math.floor(Math.min(maxBulbWidth, maxBulbHeight));
            
            // Center the board on the canvas
            boardOffsetX = Math.floor((canvas.width - cols * bulbSize) / 2);
            boardOffsetY = Math.floor((canvas.height - rows * bulbSize) / 2);
            
            // Create grid with random bulbs
            grid = [];
            for (let row = 0; row < rows; row++) {
                grid[row] = [];
                for (let col = 0; col < cols; col++) {
                    const typeIndex = Math.floor(Math.random() * BULB_TYPES.length);
                    grid[row][col] = {
                        type: BULB_TYPES[typeIndex],
                        row: row,
                        col: col
                    };
                }
            }
            
            // Render the board
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set transform to center the board
            ctx.save();
            ctx.translate(boardOffsetX, boardOffsetY);
            
            // Draw background grid
            ctx.fillStyle = COLORS.backgroundLight;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    ctx.fillRect(
                        col * bulbSize + 1, 
                        row * bulbSize + 1, 
                        bulbSize - 2, 
                        bulbSize - 2
                    );
                }
            }
            
            // Draw bulbs
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const bulb = grid[row][col];
                    const x = col * bulbSize;
                    const y = row * bulbSize;
                    
                    // Draw bulb background (circle)
                    ctx.fillStyle = '#222';
                    ctx.beginPath();
                    ctx.arc(x + bulbSize/2, y + bulbSize/2, bulbSize/2 - 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw bulb color
                    ctx.fillStyle = COLORS[bulb.type];
                    ctx.beginPath();
                    ctx.arc(x + bulbSize/2, y + bulbSize/2, bulbSize/2 - 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw highlight
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.arc(x + bulbSize/2 - bulbSize/6, y + bulbSize/2 - bulbSize/6, bulbSize/6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Draw grid lines
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 1;
            
            // Horizontal lines
            for (let row = 0; row <= rows; row++) {
                ctx.beginPath();
                ctx.moveTo(0, row * bulbSize);
                ctx.lineTo(cols * bulbSize, row * bulbSize);
                ctx.stroke();
            }
            
            // Vertical lines
            for (let col = 0; col <= cols; col++) {
                ctx.beginPath();
                ctx.moveTo(col * bulbSize, 0);
                ctx.lineTo(col * bulbSize, rows * bulbSize);
                ctx.stroke();
            }
            
            ctx.restore();
        });
    }
}