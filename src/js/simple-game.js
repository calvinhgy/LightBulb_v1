/**
 * Simple game implementation to ensure the board displays correctly
 */

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
let canvas, ctx;
let bulbSize = 40;
let rows = 8, cols = 8;
let grid = [];
let boardOffsetX = 0, boardOffsetY = 0;

// Initialize the game
function initGame() {
    console.log('Initializing simple game');
    
    // Get canvas and context
    canvas = document.getElementById('game-board');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    
    // Set canvas size if not already set
    if (!canvas.width || !canvas.height) {
        canvas.width = 640;
        canvas.height = 640;
    }
    
    console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
    
    // Calculate bulb size and board offset
    calculateBoardDimensions();
    
    // Create the grid
    createGrid();
    
    // Render the board
    renderBoard();
    
    console.log('Game initialized successfully');
}

// Calculate board dimensions
function calculateBoardDimensions() {
    const maxBulbWidth = canvas.width / cols;
    const maxBulbHeight = canvas.height / rows;
    bulbSize = Math.floor(Math.min(maxBulbWidth, maxBulbHeight));
    
    // Center the board on the canvas
    boardOffsetX = Math.floor((canvas.width - cols * bulbSize) / 2);
    boardOffsetY = Math.floor((canvas.height - rows * bulbSize) / 2);
    
    console.log(`Bulb size: ${bulbSize}px`);
    console.log(`Board offset: ${boardOffsetX}, ${boardOffsetY}`);
}

// Create the grid with random bulbs
function createGrid() {
    grid = [];
    
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            // Create a random bulb
            const typeIndex = Math.floor(Math.random() * BULB_TYPES.length);
            grid[row][col] = {
                type: BULB_TYPES[typeIndex],
                row: row,
                col: col
            };
        }
    }
    
    console.log('Grid created with random bulbs');
}

// Render the board
function renderBoard() {
    if (!ctx || !canvas) {
        console.error('Canvas context or canvas is not available');
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw debug border around canvas
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Set transform to center the board
    ctx.save();
    ctx.translate(boardOffsetX, boardOffsetY);
    
    // Draw debug border around board area
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cols * bulbSize, rows * bulbSize);
    
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
            if (bulb) {
                drawBulb(ctx, bulb, col * bulbSize, row * bulbSize);
            }
        }
    }
    
    // Draw grid lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.5;
    
    // Draw horizontal grid lines
    for (let row = 0; row <= rows; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * bulbSize);
        ctx.lineTo(cols * bulbSize, row * bulbSize);
        ctx.stroke();
    }
    
    // Draw vertical grid lines
    for (let col = 0; col <= cols; col++) {
        ctx.beginPath();
        ctx.moveTo(col * bulbSize, 0);
        ctx.lineTo(col * bulbSize, rows * bulbSize);
        ctx.stroke();
    }
    
    // Restore transform
    ctx.restore();
}

// Draw a single bulb
function drawBulb(ctx, bulb, x, y) {
    const size = bulbSize;
    const padding = size * 0.1;
    const bulbSize = size - padding * 2;
    
    // Draw bulb background (circle)
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, bulbSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bulb color
    let bulbColor = COLORS[bulb.type] || '#FFFFFF';
    
    // Create gradient for glow effect
    const gradient = ctx.createRadialGradient(
        x + size/2, y + size/2, 0,
        x + size/2, y + size/2, bulbSize/2
    );
    gradient.addColorStop(0, bulbColor);
    gradient.addColorStop(0.7, bulbColor);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, bulbSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x + size/2 - bulbSize/6, y + size/2 - bulbSize/6, bulbSize/6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw debug text (row, col)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${bulb.row},${bulb.col}`, x + size/2, y + size/2);
}

// Start the game
function startSimpleGame() {
    console.log('Starting simple game');
    
    // Hide main menu and show game screen
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Initialize the game
    initGame();
}

// Add event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - setting up simple game');
    
    // Add click handler to play button
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', startSimpleGame);
    }
    
    // Add resize handler
    window.addEventListener('resize', function() {
        if (canvas) {
            const container = document.getElementById('game-board-container');
            if (container) {
                const size = Math.min(container.clientWidth, container.clientHeight);
                canvas.width = size;
                canvas.height = size;
                calculateBoardDimensions();
                renderBoard();
            }
        }
    });
});
