# 五彩灯泡 (Colorful Light Bulbs) - Code Architecture

## Project Structure

```
/src
  /js
    /core
      game.js           # Main game class
      board.js          # Board management
      bulb.js           # Bulb class definition
      matcher.js        # Match detection logic
      animator.js       # Animation system
    /ui
      renderer.js       # Canvas rendering
      input.js          # Input handling
      screens.js        # Game screens (menu, game over, etc.)
      hud.js            # In-game UI elements
    /utils
      audio.js          # Audio management
      storage.js        # Local storage handling
      helpers.js        # Utility functions
    /config
      constants.js      # Game constants
      levels.js         # Level definitions
    main.js             # Entry point
  /css
    style.css           # Main stylesheet
    animations.css      # CSS animations
    responsive.css      # Responsive design rules
  /assets
    /images
      /bulbs           # Bulb images for each color
      /ui              # UI elements
      /backgrounds     # Background images
    /audio
      /music           # Background music
      /sfx             # Sound effects
  index.html           # Main HTML file
```

## Class Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     Game        │       │    Renderer     │
├─────────────────┤       ├─────────────────┤
│ - board         │       │ - canvas        │
│ - renderer      │◄─────►│ - context       │
│ - inputHandler  │       │ - sprites       │
│ - audioManager  │       ├─────────────────┤
├─────────────────┤       │ + drawBoard()   │
│ + init()        │       │ + drawBulb()    │
│ + update()      │       │ + drawUI()      │
│ + start()       │       │ + animate()     │
│ + pause()       │       └─────────────────┘
└─────────────────┘
        ▲
        │
        │
┌─────────────────┐       ┌─────────────────┐
│     Board       │       │  InputHandler   │
├─────────────────┤       ├─────────────────┤
│ - grid          │       │ - dragState     │
│ - matcher       │◄─────►│ - selectedBulb  │
│ - animator      │       ├─────────────────┤
├─────────────────┤       │ + handleClick() │
│ + createBoard() │       │ + handleDrag()  │
│ + swapBulbs()   │       │ + handleDrop()  │
│ + checkMatches()│       └─────────────────┘
│ + clearMatches()│
│ + fillBoard()   │
└─────────────────┘
        ▲
        │
        │
┌─────────────────┐       ┌─────────────────┐
│      Bulb       │       │     Matcher     │
├─────────────────┤       ├─────────────────┤
│ - color         │       │ - board         │
│ - position      │       ├─────────────────┤
│ - state         │       │ + findMatches() │
├─────────────────┤       │ + isMatch()     │
│ + render()      │       │ + getChains()   │
│ + update()      │       └─────────────────┘
└─────────────────┘
```

## Module Interactions

### Game Initialization Flow

1. `main.js` loads and initializes the `Game` class
2. `Game` creates instances of `Board`, `Renderer`, `InputHandler`, and `AudioManager`
3. `Board` initializes the grid with random bulbs
4. `Renderer` sets up the canvas and loads assets
5. `InputHandler` attaches event listeners
6. `Game` starts the game loop

### Game Loop

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────┐     ┌─────────┐     ┌────────┐ │
│  │         │     │         │     │        │ │
│  │ Update  ├────►│ Render  ├────►│ Repeat │ │
│  │         │     │         │     │        │ │
│  └─────────┘     └─────────┘     └────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Bulb Swap Process

1. User initiates drag on a bulb
2. `InputHandler` detects drag and identifies source bulb
3. User drops bulb on an adjacent cell
4. `InputHandler` validates the move and calls `Board.swapBulbs()`
5. `Board` swaps the bulbs and calls `Matcher.findMatches()`
6. If matches are found:
   - `Board` marks matched bulbs for removal
   - `Animator` plays match animation
   - `Board` removes matched bulbs
   - `Board` triggers cascading effect
   - Process repeats from step 5 until no more matches
7. If no matches are found after initial swap:
   - `Board` swaps bulbs back to original positions
   - `Animator` plays invalid move animation

## State Management

### Game States

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  LOADING    ├────►│   PLAYING   ├────►│  GAME_OVER  │
│             │     │             │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │             │
                    │   PAUSED    │
                    │             │
                    └─────────────┘
```

### Bulb States

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   NORMAL    ├────►│  SELECTED   ├────►│  MATCHING   │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                                ▼
                                        ┌─────────────┐
                                        │             │
                                        │   FALLING   │
                                        │             │
                                        └─────────────┘
```

## Event System

The game uses a simple event system to communicate between components:

```javascript
// Example event types
const GameEvents = {
  BULB_SELECTED: 'bulb_selected',
  BULB_SWAPPED: 'bulb_swapped',
  MATCH_FOUND: 'match_found',
  SCORE_UPDATED: 'score_updated',
  LEVEL_COMPLETED: 'level_completed'
};

// Event subscription
eventEmitter.on(GameEvents.MATCH_FOUND, (matchData) => {
  // Handle match found event
});

// Event emission
eventEmitter.emit(GameEvents.MATCH_FOUND, { 
  bulbs: matchedBulbs, 
  count: matchedBulbs.length 
});
```

## Performance Optimizations

1. **Efficient Match Detection**
   - Only check for matches around swapped bulbs
   - Use spatial partitioning for large board

2. **Rendering Optimizations**
   - Only redraw changed portions of the board
   - Use sprite batching for bulb rendering
   - Implement dirty rectangle tracking

3. **Animation Management**
   - Use requestAnimationFrame for smooth animations
   - Implement animation pooling
   - Throttle animations during heavy cascading
