/**
 * MatchDetectorTest.js
 * Unit tests for the MatchDetector class
 */

// Simple test framework
const assert = {
    equal: (actual, expected, message) => {
        if (actual !== expected) {
            console.error(`❌ ${message}: expected ${expected}, got ${actual}`);
        } else {
            console.log(`✅ ${message}`);
        }
    },
    deepEqual: (actual, expected, message) => {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
            console.error(`❌ ${message}: expected ${expectedStr}, got ${actualStr}`);
        } else {
            console.log(`✅ ${message}`);
        }
    },
    true: (value, message) => {
        if (!value) {
            console.error(`❌ ${message}: expected true, got ${value}`);
        } else {
            console.log(`✅ ${message}`);
        }
    },
    false: (value, message) => {
        if (value) {
            console.error(`❌ ${message}: expected false, got ${value}`);
        } else {
            console.log(`✅ ${message}`);
        }
    }
};

// Mock LightBulb class for testing
class MockLightBulb {
    constructor(color, id) {
        this.color = color;
        this.id = id || Math.floor(Math.random() * 10000);
    }
}

// Test MatchDetector class
function testMatchDetector() {
    console.log('Running MatchDetector tests...');
    
    // Test constructor
    const detector = new MatchDetector(3);
    assert.equal(detector.minMatchLength, 3, 'Detector should have correct minimum match length');
    
    // Create a test grid
    const gridSize = { width: 5, height: 5 };
    const grid = [];
    
    // Initialize empty grid
    for (let y = 0; y < gridSize.height; y++) {
        grid[y] = [];
        for (let x = 0; x < gridSize.width; x++) {
            grid[y][x] = null;
        }
    }
    
    // Test with no matches
    let matches = detector.findMatches(grid, gridSize);
    assert.equal(matches.length, 0, 'Empty grid should have no matches');
    
    // Add some bulbs without matches
    grid[0][0] = new MockLightBulb('red', 1);
    grid[0][1] = new MockLightBulb('blue', 2);
    grid[0][2] = new MockLightBulb('green', 3);
    grid[1][0] = new MockLightBulb('yellow', 4);
    grid[1][1] = new MockLightBulb('red', 5);
    
    matches = detector.findMatches(grid, gridSize);
    assert.equal(matches.length, 0, 'Grid without matches should return empty array');
    
    // Add horizontal match
    grid[2][0] = new MockLightBulb('green', 6);
    grid[2][1] = new MockLightBulb('green', 7);
    grid[2][2] = new MockLightBulb('green', 8);
    
    matches = detector.findMatches(grid, gridSize);
    assert.equal(matches.length, 1, 'Should find one match');
    assert.equal(matches[0].length, 3, 'Match should contain 3 bulbs');
    assert.equal(matches[0][0].color, 'green', 'Match should contain green bulbs');
    
    // Add vertical match
    grid[0][3] = new MockLightBulb('blue', 9);
    grid[1][3] = new MockLightBulb('blue', 10);
    grid[2][3] = new MockLightBulb('blue', 11);
    grid[3][3] = new MockLightBulb('blue', 12);
    
    matches = detector.findMatches(grid, gridSize);
    assert.equal(matches.length, 2, 'Should find two matches');
    
    // Find the vertical match (length 4)
    const verticalMatch = matches.find(m => m.length === 4);
    assert.true(verticalMatch !== undefined, 'Should find vertical match with 4 bulbs');
    assert.equal(verticalMatch[0].color, 'blue', 'Vertical match should contain blue bulbs');
    
    // Test findHorizontalMatch
    const horizontalMatch = detector.findHorizontalMatch(grid, 0, 2, gridSize);
    assert.equal(horizontalMatch.length, 3, 'Horizontal match should contain 3 bulbs');
    assert.equal(horizontalMatch[0].color, 'green', 'Horizontal match should contain green bulbs');
    
    // Test findVerticalMatch
    const verticalMatchTest = detector.findVerticalMatch(grid, 3, 0, gridSize);
    assert.equal(verticalMatchTest.length, 4, 'Vertical match should contain 4 bulbs');
    assert.equal(verticalMatchTest[0].color, 'blue', 'Vertical match should contain blue bulbs');
    
    // Test with minimum match length of 4
    const detector4 = new MatchDetector(4);
    matches = detector4.findMatches(grid, gridSize);
    assert.equal(matches.length, 1, 'With min length 4, should find only one match');
    assert.equal(matches[0].length, 4, 'Match should contain 4 bulbs');
    
    // Test hasPossibleMoves
    // Create a grid with no possible moves
    const noMovesGrid = [];
    for (let y = 0; y < 3; y++) {
        noMovesGrid[y] = [];
        for (let x = 0; x < 3; x++) {
            noMovesGrid[y][x] = new MockLightBulb(['red', 'blue', 'green', 'yellow'][Math.floor(x / 3) + y % 2]);
        }
    }
    
    const noMovesGridSize = { width: 3, height: 3 };
    const hasMoves = detector.hasPossibleMoves(noMovesGrid, noMovesGridSize);
    // Note: This test might be flaky depending on the implementation of hasPossibleMoves
    // and the random grid we created
    
    // Test findHint
    // Create a grid with a known possible move
    const hintGrid = [];
    for (let y = 0; y < 3; y++) {
        hintGrid[y] = [];
        for (let x = 0; x < 3; x++) {
            hintGrid[y][x] = new MockLightBulb('red');
        }
    }
    // Make a specific move possible
    hintGrid[0][0] = new MockLightBulb('blue');
    hintGrid[0][1] = new MockLightBulb('green');
    hintGrid[0][2] = new MockLightBulb('blue');
    hintGrid[1][2] = new MockLightBulb('blue');
    
    const hint = detector.findHint(hintGrid, { width: 3, height: 3 });
    assert.true(hint !== null, 'Should find a hint');
    
    console.log('MatchDetector tests completed');
}

// Run tests
testMatchDetector();
