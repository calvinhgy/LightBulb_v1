# Mobile Optimization - LightBulb Mobile

## Overview

This document outlines the specific optimizations implemented for the iPhone version of LightBulb to ensure smooth performance, responsive touch interactions, and efficient battery usage across all supported iPhone devices.

## Performance Targets

| Metric | Minimum Target | Ideal Target |
|--------|----------------|--------------|
| Frame Rate | 30 FPS | 60 FPS |
| Initial Load Time | < 3 seconds | < 1.5 seconds |
| Touch Response Time | < 100ms | < 50ms |
| Memory Usage | < 200MB | < 150MB |
| Battery Impact | < 10%/hour | < 5%/hour |

## Rendering Optimizations

### Canvas Optimization

- **Double Buffering**: Implement off-screen canvas rendering to reduce flickering
- **Canvas Sizing**: Match canvas dimensions to device pixel ratio for crisp rendering
- **Layer Management**: Separate static and dynamic elements into different canvas layers
- **Dirty Rectangle Rendering**: Only redraw areas that have changed

```javascript
// Example implementation of dirty rectangle rendering
class CanvasRenderer {
  constructor() {
    this.dirtyRects = [];
    this.mainCanvas = document.getElementById('gameCanvas');
    this.ctx = this.mainCanvas.getContext('2d');
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCtx = this.bufferCanvas.getContext('2d');
  }
  
  markDirty(x, y, width, height) {
    this.dirtyRects.push({x, y, width, height});
  }
  
  render() {
    // Only redraw dirty areas
    for (const rect of this.dirtyRects) {
      // Clear buffer for this rectangle
      this.bufferCtx.clearRect(rect.x, rect.y, rect.width, rect.height);
      
      // Draw to buffer
      this.drawGameElements(this.bufferCtx, rect);
      
      // Copy buffer to main canvas
      this.ctx.drawImage(
        this.bufferCanvas, 
        rect.x, rect.y, rect.width, rect.height,
        rect.x, rect.y, rect.width, rect.height
      );
    }
    
    // Reset dirty rectangles
    this.dirtyRects = [];
  }
}
```

### Asset Optimization

- **Texture Atlases**: Combine multiple images into sprite sheets
- **Image Compression**: Use WebP format with fallback to optimized PNG
- **SVG Usage**: Use SVG for UI elements that need to scale across devices
- **Procedural Generation**: Generate simple patterns and effects procedurally

### Animation Optimization

- **CSS Animations**: Use hardware-accelerated CSS animations for UI elements
- **RequestAnimationFrame**: Synchronize game animations with browser refresh rate
- **Animation Pooling**: Reuse animation objects to reduce garbage collection
- **Adaptive Complexity**: Scale animation detail based on device capability

```javascript
// Example of adaptive animation complexity
class ParticleSystem {
  constructor(deviceTier) {
    this.maxParticles = this.getMaxParticlesForDevice(deviceTier);
    this.particlePool = [];
    this.initializeParticlePool();
  }
  
  getMaxParticlesForDevice(deviceTier) {
    switch(deviceTier) {
      case 'low': return 50;
      case 'medium': return 100;
      case 'high': return 200;
      default: return 75;
    }
  }
  
  createExplosion(x, y, color) {
    const particleCount = Math.min(
      this.maxParticles, 
      this.getParticleCountForEffect('explosion')
    );
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.getParticleFromPool();
      if (particle) {
        particle.activate(x, y, color);
      }
    }
  }
}
```

## Touch Interaction Optimizations

### Touch Responsiveness

- **Event Delegation**: Use event delegation for efficient touch handling
- **Passive Event Listeners**: Implement passive listeners to prevent blocking scrolling
- **Touch Action CSS**: Use `touch-action` CSS property to optimize browser touch handling
- **Predictive Touch**: Implement basic touch prediction for perceived responsiveness

```javascript
// Example of optimized touch handling
function setupTouchHandlers() {
  const gameBoard = document.getElementById('gameBoard');
  
  // Use passive listener to prevent blocking scroll
  gameBoard.addEventListener('touchstart', handleTouchStart, {passive: true});
  
  // Event delegation - handle all cell touches in one listener
  gameBoard.addEventListener('touchend', (e) => {
    const cell = findCellFromTouch(e);
    if (cell) {
      handleCellTouch(cell);
    }
  }, {passive: false}); // Need to call preventDefault() for game actions
}
```

### Gesture Recognition

- **Efficient Algorithms**: Optimize gesture detection algorithms for mobile
- **Gesture Simplification**: Simplify complex gestures for better recognition
- **Calibration System**: Allow users to calibrate touch sensitivity
- **Adaptive Thresholds**: Adjust recognition thresholds based on user behavior

## Memory Management

### Asset Loading

- **Progressive Loading**: Load essential assets first, then non-critical assets
- **Asset Unloading**: Unload unused assets when changing game states
- **Memory Budgets**: Establish memory budgets for different game components
- **Texture Downscaling**: Scale down textures for lower-end devices

```javascript
// Example of progressive asset loading
class AssetLoader {
  constructor() {
    this.criticalAssets = ['board.png', 'bulbs.png', 'ui_essential.png'];
    this.secondaryAssets = ['effects.png', 'backgrounds.png'];
    this.optionalAssets = ['high_res_effects.png', 'additional_animations.png'];
  }
  
  async loadAssets() {
    // Load critical assets first
    await this.loadAssetGroup(this.criticalAssets);
    
    // Signal game can start
    this.onCriticalAssetsLoaded();
    
    // Load secondary assets
    await this.loadAssetGroup(this.secondaryAssets);
    
    // Load optional assets based on device capability
    if (this.deviceHasHighCapability()) {
      await this.loadAssetGroup(this.optionalAssets);
    }
  }
}
```

### Object Pooling

- **Entity Pooling**: Reuse game objects instead of creating/destroying
- **Event Pooling**: Pool and reuse event objects
- **Component Recycling**: Recycle UI components when navigating screens
- **Buffer Reuse**: Reuse buffers for audio and graphics processing

```javascript
// Example of object pooling for light bulbs
class LightBulbPool {
  constructor(initialSize = 100) {
    this.pool = [];
    this.initializePool(initialSize);
  }
  
  initializePool(size) {
    for (let i = 0; i < size; i++) {
      this.pool.push(new LightBulb());
    }
  }
  
  getBulb() {
    // Get from pool or create new if pool is empty
    return this.pool.pop() || new LightBulb();
  }
  
  returnBulb(bulb) {
    bulb.reset(); // Reset state
    this.pool.push(bulb);
  }
}
```

### Garbage Collection Optimization

- **Avoid Object Creation**: Minimize object creation in critical loops
- **Object Reuse**: Reuse objects instead of creating new ones
- **Value Types**: Use primitive types where possible
- **Static Allocation**: Pre-allocate arrays and objects

## Network Optimization

### Offline Support

- **Service Workers**: Implement service workers for offline gameplay
- **Asset Caching**: Cache game assets for offline access
- **State Persistence**: Save game state locally for resuming offline
- **Background Sync**: Sync progress when connection is restored

```javascript
// Example service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}
```

### Data Efficiency

- **Compression**: Compress data for storage and transmission
- **Delta Updates**: Only transmit changed data
- **Batch Processing**: Batch API requests to reduce overhead
- **Lazy Loading**: Load level data only when needed

## Battery Optimization

### CPU Usage

- **Throttling**: Reduce update frequency when game is inactive
- **Background Behavior**: Pause non-essential processes when in background
- **Computation Distribution**: Spread heavy computations across frames
- **Efficient Algorithms**: Optimize algorithms for mobile processors

```javascript
// Example of throttling when inactive
class GameLoop {
  constructor() {
    this.isActive = true;
    this.lastFrameTime = 0;
    this.activeFrameRate = 60;
    this.inactiveFrameRate = 10;
  }
  
  loop(timestamp) {
    requestAnimationFrame(this.loop.bind(this));
    
    const frameInterval = 1000 / (this.isActive ? 
                                  this.activeFrameRate : 
                                  this.inactiveFrameRate);
                                  
    if (timestamp - this.lastFrameTime < frameInterval) {
      return; // Skip this frame
    }
    
    this.lastFrameTime = timestamp;
    this.update();
    this.render();
  }
  
  setActive(active) {
    this.isActive = active;
  }
}
```

### GPU Usage

- **Reduce Overdraw**: Minimize overlapping transparent elements
- **Simplify Shaders**: Use simpler visual effects on mobile
- **Batch Rendering**: Combine draw calls to reduce GPU state changes
- **Resolution Scaling**: Dynamically adjust resolution based on performance

### Screen Optimization

- **Dark Mode**: Implement dark theme to reduce power consumption on OLED screens
- **Brightness Awareness**: Adjust visual effects based on ambient brightness
- **Refresh Rate Adaptation**: Support different refresh rates (60Hz, 120Hz)
- **Efficient UI Updates**: Minimize full screen redraws

## Device-Specific Optimizations

### iPhone SE / Older Models

- **Reduced Particle Effects**: Fewer particles in visual effects
- **Simplified Animations**: Less complex animation sequences
- **Smaller Grid Size**: 7x9 grid instead of 8x10
- **Texture Downscaling**: Use lower resolution textures

### iPhone Pro Models

- **Enhanced Visual Effects**: More detailed particle systems
- **Higher Resolution Assets**: Use full resolution textures
- **Larger Grid Size**: Option for 9x11 grid
- **ProMotion Support**: Utilize 120Hz refresh rate when available

## Testing and Profiling

### Performance Profiling

- **Frame Rate Monitoring**: Track and log FPS during gameplay
- **Memory Profiling**: Monitor memory usage patterns
- **CPU Profiling**: Identify CPU-intensive operations
- **Battery Impact**: Measure battery consumption during extended play

### Automated Testing

- **Device Farm Testing**: Test on multiple real devices
- **Performance Regression Tests**: Ensure updates don't degrade performance
- **Load Testing**: Simulate extended gameplay sessions
- **Memory Leak Detection**: Automated tests for memory leaks

## Implementation Checklist

- [ ] Implement texture atlases for all game assets
- [ ] Set up object pooling for frequently created/destroyed objects
- [ ] Configure service workers for offline support
- [ ] Implement dirty rectangle rendering
- [ ] Create device detection and capability adaptation system
- [ ] Set up touch event optimization with passive listeners
- [ ] Implement adaptive animation complexity
- [ ] Configure battery-aware throttling system
- [ ] Set up performance monitoring and reporting
- [ ] Create device-specific asset sets
