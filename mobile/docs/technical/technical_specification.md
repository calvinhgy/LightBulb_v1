# Technical Specification - LightBulb Mobile

## Overview

This document outlines the technical architecture, implementation approach, and development considerations for the LightBulb Mobile game for iPhone devices. The technical design prioritizes performance, touch responsiveness, and a smooth user experience across all supported iPhone models.

## Technology Stack

### Frontend Framework
- **Framework**: Progressive Web App (PWA) with responsive design
- **HTML5 Canvas**: For rendering the game board and animations
- **CSS3**: For styling, animations, and responsive layouts
- **JavaScript (ES6+)**: For game logic and interactivity

### Mobile Optimization
- **Viewport Meta Tags**: For proper scaling on mobile devices
- **Touch Events API**: For handling touch interactions
- **Device Orientation API**: For optional tilt controls and orientation changes
- **Web App Manifest**: For home screen installation
- **Service Workers**: For offline functionality and caching

### Performance Optimization
- **RequestAnimationFrame**: For smooth animations
- **Web Workers**: For offloading intensive calculations
- **Asset Preloading**: For seamless gameplay
- **Texture Atlases**: For efficient rendering
- **Memory Management**: Proper cleanup of event listeners and objects

### Storage
- **LocalStorage**: For game settings and small data
- **IndexedDB**: For larger data storage (game progress, high scores)
- **Cache API**: For offline asset availability

### Analytics & Monitoring
- **Custom Analytics**: Lightweight analytics for game events and performance
- **Error Tracking**: Client-side error logging and reporting

## Architecture Overview

### Component Structure

```
LightBulbMobile
├── Core
│   ├── Game.js           # Main game controller
│   ├── Board.js          # Game board and grid management
│   ├── LightBulb.js      # Light bulb object definition
│   ├── MatchDetector.js  # Match detection algorithms
│   └── ScoreManager.js   # Scoring and progression
├── UI
│   ├── Renderer.js       # Canvas rendering engine
│   ├── AnimationManager.js # Animation system
│   ├── TouchController.js # Touch input handling
│   ├── SoundManager.js   # Audio system
│   └── UIComponents.js   # UI elements and screens
├── Data
│   ├── LevelManager.js   # Level loading and management
│   ├── PlayerData.js     # Player progress and statistics
│   ├── StorageManager.js # Data persistence
│   └── ConfigManager.js  # Game configuration
└── Utils
    ├── DeviceDetector.js # Device capability detection
    ├── Preloader.js      # Asset preloading
    ├── Analytics.js      # Usage tracking
    └── Debug.js          # Debugging utilities
```

### Data Flow

1. **Input Layer**: Captures touch events and translates to game actions
2. **Game Logic Layer**: Processes game rules and state changes
3. **Rendering Layer**: Updates visual representation based on game state
4. **Storage Layer**: Persists game state and player progress

## Detailed Technical Specifications

### Rendering System

- **Canvas-Based Rendering**: Primary rendering via HTML5 Canvas
- **Resolution**: Adaptive resolution based on device pixel ratio
- **Frame Rate Target**: 60fps on all supported devices
- **Fallback**: CSS-based rendering for devices with limited Canvas support

#### Rendering Pipeline
1. **Clear Canvas**: Clear previous frame
2. **Draw Background**: Render background elements
3. **Draw Grid**: Render game grid
4. **Draw Light Bulbs**: Render light bulbs with appropriate states
5. **Draw Animations**: Render active animations
6. **Draw UI Overlay**: Render UI elements
7. **Present Frame**: Display completed frame

### Touch Input System

- **Multi-Touch Support**: Track up to 5 simultaneous touch points
- **Gesture Recognition**: Swipe, tap, pinch, and long press detection
- **Input Buffering**: Queue rapid inputs for responsive gameplay
- **Touch Heatmap**: Optional debug visualization of touch points

#### Touch Processing Pipeline
1. **Capture Raw Events**: Listen for touchstart, touchmove, touchend
2. **Normalize Coordinates**: Convert to canvas coordinates
3. **Detect Gestures**: Analyze touch patterns for gesture recognition
4. **Map to Game Actions**: Convert gestures to game actions
5. **Apply Game Logic**: Update game state based on actions
6. **Provide Feedback**: Visual, audio, and haptic feedback

### Game Logic System

- **Grid System**: Dynamic grid sizing based on device dimensions
- **Match Detection**: Efficient algorithm for identifying matches
- **Cascade System**: Physics-based falling simulation for empty spaces
- **Special Piece Logic**: Rules for creating and activating special pieces

#### Game Loop
1. **Process Input**: Handle player interactions
2. **Update Game State**: Apply game rules and logic
3. **Check for Matches**: Detect and process matches
4. **Apply Cascades**: Fill empty spaces with new pieces
5. **Update Score**: Calculate and update player score
6. **Check Level Objectives**: Evaluate win/loss conditions
7. **Render Frame**: Update visual representation

### Audio System

- **Web Audio API**: For precise audio control and effects
- **Audio Sprites**: Combined audio files for efficient loading
- **Dynamic Mixing**: Adjust audio levels based on game state
- **Mute Detection**: Respect device mute switch

#### Audio Categories
- **UI Sounds**: Menu navigation, button presses
- **Gameplay Sounds**: Swaps, matches, special activations
- **Ambient Sounds**: Background music, environmental effects
- **Feedback Sounds**: Success, failure, achievements

### Storage System

- **Player Progress**: Level completion, stars earned, high scores
- **Game Settings**: Audio settings, control preferences, accessibility options
- **Cached Assets**: Offline-available game assets
- **Analytics Data**: Usage statistics and performance metrics

#### Data Models
```javascript
// Player Progress Model
{
  currentLevel: Number,
  levelsCompleted: Array<{
    levelId: Number,
    stars: Number,
    score: Number,
    attempts: Number
  }>,
  totalScore: Number,
  powerups: {
    extraMoves: Number,
    extraTime: Number,
    colorBomb: Number,
    shuffle: Number
  }
}

// Game Settings Model
{
  audio: {
    musicVolume: Number,
    sfxVolume: Number,
    vibration: Boolean
  },
  controls: {
    swipeSensitivity: Number,
    controlScheme: String, // 'swipe' or 'tap'
    autoHints: Boolean
  },
  accessibility: {
    colorBlindMode: Boolean,
    reducedMotion: Boolean,
    largeText: Boolean
  }
}
```

## Performance Considerations

### Memory Management

- **Asset Unloading**: Unload unused assets when changing levels
- **Object Pooling**: Reuse objects for particles and animations
- **Event Cleanup**: Proper removal of event listeners
- **Garbage Collection**: Minimize GC pauses through object reuse

### Rendering Optimization

- **Dirty Rectangle Rendering**: Only redraw changed areas
- **Layer Compositing**: Separate static and dynamic elements
- **Sprite Batching**: Combine draw calls for similar elements
- **Resolution Scaling**: Dynamically adjust resolution based on performance

### Battery Efficiency

- **Frame Rate Throttling**: Reduce frame rate when game is inactive
- **Background Suspension**: Pause game logic when app is in background
- **Touch Throttling**: Limit touch event processing frequency
- **Efficient Animations**: Use CSS animations where appropriate

## Device Support Matrix

| Device Category | Minimum Spec | Target Spec | Premium Spec |
|-----------------|--------------|-------------|--------------|
| **Devices** | iPhone 8, SE (2020) | iPhone 11-13 | iPhone 13 Pro, 14 Pro |
| **iOS Version** | iOS 14 | iOS 15 | iOS 16+ |
| **Resolution** | 750 x 1334 | 1170 x 2532 | 1290 x 2796 |
| **Grid Size** | 7x9 | 8x10 | 9x11 |
| **Visual Effects** | Basic | Standard | Enhanced |
| **Frame Rate** | 30fps | 60fps | 60fps+ |

## Testing Strategy

### Automated Testing

- **Unit Tests**: Core game logic and algorithms
- **Integration Tests**: Component interactions
- **Performance Tests**: Frame rate and memory benchmarks
- **Compatibility Tests**: Browser and device compatibility

### Manual Testing

- **Playability Testing**: Gameplay experience and balance
- **Touch Responsiveness**: Input lag and gesture recognition
- **Visual Verification**: Rendering across devices
- **Battery Impact**: Power consumption during extended play

## Development Workflow

### Environment Setup

- **Development Server**: Local development with hot reloading
- **Build Pipeline**: Webpack for bundling and optimization
- **Version Control**: Git with feature branch workflow
- **CI/CD**: Automated testing and deployment

### Build Process

1. **Lint**: ESLint for code quality
2. **Test**: Run automated tests
3. **Bundle**: Webpack bundling with code splitting
4. **Optimize**: Asset optimization and minification
5. **Package**: Generate PWA manifest and service workers
6. **Deploy**: Push to hosting environment

## Deployment Strategy

### Web Deployment

- **Hosting**: AWS S3 with CloudFront distribution
- **HTTPS**: Secure connections via CloudFront
- **Cache Control**: Appropriate caching headers for assets
- **Versioning**: Cache busting for updated assets

### PWA Installation

- **Web App Manifest**: For home screen installation
- **Service Workers**: For offline functionality
- **Install Prompts**: Custom install experience

## Monitoring and Analytics

- **Performance Metrics**: FPS, load times, memory usage
- **User Behavior**: Level completion rates, retry patterns
- **Error Tracking**: Client-side error logging
- **Usage Patterns**: Session length, feature usage

## Security Considerations

- **Data Storage**: Secure local storage practices
- **API Communication**: HTTPS for all external communication
- **Input Validation**: Sanitize all user inputs
- **Update Mechanism**: Secure update process for game content

## Future Expansion Considerations

- **Multiplayer**: Architecture supports future addition of multiplayer modes
- **Additional Content**: Modular level loading for content updates
- **Monetization**: Hooks for optional in-app purchases
- **Social Features**: Sharing and social interaction capabilities
