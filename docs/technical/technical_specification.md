# 五彩灯泡 (Colorful Light Bulbs) - Technical Specification

## Technology Stack

### Frontend
- **HTML5:** Structure of the game
- **CSS3:** Styling and animations
- **JavaScript (ES6+):** Game logic and interactivity
- **Canvas API:** Rendering the game board and animations

### Build Tools (Optional)
- **Webpack:** For bundling and optimization
- **Babel:** For cross-browser compatibility

### Version Control
- **Git:** For source code management

## Architecture Overview

### Core Components

1. **Game Engine**
   - Manages game state
   - Handles game loop
   - Processes user input
   - Controls game flow

2. **Board Manager**
   - Creates and maintains the 40x40 grid
   - Handles bulb placement and randomization
   - Manages bulb swapping logic
   - Detects matches and handles cascading effects

3. **Renderer**
   - Draws the game board and bulbs
   - Handles animations for swapping, matching, and cascading
   - Renders UI elements

4. **Input Handler**
   - Processes mouse/touch events
   - Manages drag and drop functionality
   - Validates move legality

5. **Audio Manager**
   - Loads and plays sound effects
   - Manages background music
   - Handles volume control

6. **UI Manager**
   - Manages menu screens
   - Updates score and progress displays
   - Handles button interactions

## Data Structures

### Game Board
```javascript
// 2D array representing the 40x40 grid
board = [
  [/* row 0 */],
  [/* row 1 */],
  // ...
  [/* row 39 */]
];

// Each cell contains an object representing a bulb
bulb = {
  color: 'red' | 'yellow' | 'blue' | 'green',
  state: 'normal' | 'selected' | 'matching' | 'falling',
  // Additional properties as needed
};
```

### Color Enumeration
```javascript
const BulbColors = {
  RED: 'red',
  YELLOW: 'yellow',
  BLUE: 'blue',
  GREEN: 'green'
};
```

## Core Algorithms

### Match Detection
1. After each swap, check for horizontal and vertical matches
2. For each bulb, check if it forms part of a match of 3 or more
3. Mark matched bulbs for removal

### Cascading Logic
1. After removing matched bulbs, identify empty spaces
2. Move bulbs downward to fill empty spaces
3. Generate new random bulbs at the top
4. Check for new matches created by cascading bulbs

### Swap Validation
1. Verify that the swap is between adjacent bulbs
2. Perform the swap
3. Check if the swap creates a match
4. If no match is created, revert the swap

## Performance Considerations

### Optimization Techniques
- Use object pooling for bulb objects to reduce garbage collection
- Implement efficient match detection algorithms
- Use requestAnimationFrame for smooth animations
- Optimize canvas rendering with layered approach

### Memory Management
- Properly dispose of event listeners when not needed
- Clear references to objects that are no longer used
- Minimize DOM manipulations

## Responsive Design

- Adapt game board size based on screen dimensions
- Scale UI elements proportionally
- Support both mouse and touch inputs
- Adjust difficulty based on device capabilities

## Browser Compatibility

- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Implement polyfills for older browsers if necessary
- Test on multiple devices and screen sizes

## Loading Strategy

1. Show loading screen with progress indicator
2. Preload essential assets (bulb images, basic UI elements)
3. Load game code and initialize engine
4. Load remaining assets in background
5. Start game when ready

## Error Handling

- Implement global error catching
- Log errors for debugging
- Provide user-friendly error messages
- Include recovery mechanisms where possible

## Testing Strategy

- Unit tests for core game logic
- Integration tests for component interaction
- Performance testing for animation smoothness
- Cross-browser testing
- Mobile device testing
