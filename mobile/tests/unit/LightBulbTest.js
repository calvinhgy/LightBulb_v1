/**
 * LightBulbTest.js
 * Unit tests for the LightBulb class
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

// Test LightBulb class
function testLightBulb() {
    console.log('Running LightBulb tests...');
    
    // Test constructor
    const bulb = new LightBulb('red');
    assert.equal(bulb.color, 'red', 'Bulb should have correct color');
    assert.equal(bulb.type, 'regular', 'Bulb should have default type');
    assert.equal(bulb.scale, 1, 'Bulb should have default scale');
    assert.equal(bulb.alpha, 1, 'Bulb should have default alpha');
    assert.false(bulb.isSelected, 'Bulb should not be selected by default');
    assert.false(bulb.isMatched, 'Bulb should not be matched by default');
    
    // Test setGridPosition
    bulb.setGridPosition(3, 4);
    assert.equal(bulb.gridX, 3, 'Bulb should have correct gridX');
    assert.equal(bulb.gridY, 4, 'Bulb should have correct gridY');
    
    // Test setPosition
    bulb.setPosition(100, 200, true);
    assert.equal(bulb.x, 100, 'Bulb should have correct x position');
    assert.equal(bulb.y, 200, 'Bulb should have correct y position');
    assert.equal(bulb.targetX, 100, 'Bulb should have correct target x position');
    assert.equal(bulb.targetY, 200, 'Bulb should have correct target y position');
    
    // Test setSelected
    bulb.setSelected(true);
    assert.true(bulb.isSelected, 'Bulb should be selected');
    bulb.setSelected(false);
    assert.false(bulb.isSelected, 'Bulb should not be selected');
    
    // Test match
    bulb.match();
    assert.true(bulb.isMatched, 'Bulb should be matched');
    
    // Test startFalling
    bulb.startFalling();
    assert.true(bulb.isFalling, 'Bulb should be falling');
    
    // Test update
    const originalX = bulb.x;
    const originalY = bulb.y;
    bulb.targetX = originalX + 50;
    bulb.targetY = originalY + 50;
    
    // Update with small delta time
    const changed = bulb.update(16); // 16ms
    assert.true(changed, 'Update should return true when bulb state changes');
    assert.true(bulb.x > originalX, 'Bulb x should increase');
    assert.true(bulb.y > originalY, 'Bulb y should increase');
    
    // Test reset
    bulb.reset();
    assert.false(bulb.isSelected, 'Reset should clear selected state');
    assert.false(bulb.isMatched, 'Reset should clear matched state');
    assert.false(bulb.isFalling, 'Reset should clear falling state');
    assert.true(bulb.isNew, 'Reset should set new state');
    
    // Test convertToSpecial
    bulb.convertToSpecial('line');
    assert.equal(bulb.type, 'line', 'Bulb should be converted to line type');
    assert.true(bulb.isNew, 'Special bulb should be marked as new');
    
    // Test canSwap
    assert.false(bulb.canSwap(), 'Bulb with alpha 0 should not be swappable');
    bulb.alpha = 1;
    assert.true(bulb.canSwap(), 'Bulb should be swappable');
    
    // Test getAssetKey
    assert.equal(bulb.getAssetKey(), 'bulb_red_line', 'Asset key should be correct');
    
    // Test clone
    const clone = bulb.clone();
    assert.equal(clone.color, bulb.color, 'Clone should have same color');
    assert.equal(clone.type, bulb.type, 'Clone should have same type');
    
    // Test serialize/deserialize
    const serialized = bulb.serialize();
    const deserialized = LightBulb.deserialize(serialized);
    assert.equal(deserialized.color, bulb.color, 'Deserialized bulb should have same color');
    assert.equal(deserialized.type, bulb.type, 'Deserialized bulb should have same type');
    
    console.log('LightBulb tests completed');
}

// Make the test function globally available
window.testLightBulb = testLightBulb;
