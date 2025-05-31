# 五彩灯泡 (Colorful Light Bulbs) - Game Design Document

## Game Overview

**Game Title:** 五彩灯泡 (Colorful Light Bulbs)  
**Genre:** Match-3 Puzzle Game  
**Platform:** Web Browser  
**Target Audience:** Casual gamers of all ages  

## Core Concept

"五彩灯泡" is a match-3 puzzle game where players manipulate a grid of colorful light bulbs to create matches of three or more identical colors. When matched, these light bulbs disappear from the board, potentially creating chain reactions and allowing for strategic gameplay.

## Game Mechanics

### Game Board
- 40x40 grid of light bulbs
- Four colors of light bulbs: Red, Yellow, Blue, and Green
- Random initial distribution of colors

### Player Actions
- **Drag and Drop:** Players can drag a light bulb and swap it with an adjacent bulb (left, right, up, or down)
- **Match Detection:** When three or more light bulbs of the same color are aligned horizontally or vertically, they disappear
- **Cascading Effect:** After matched bulbs disappear, bulbs above will fall down to fill empty spaces
- **Board Refill:** New random bulbs will appear at the top to fill the board

### Scoring System
- Basic match (3 bulbs): 100 points
- Longer matches: Additional 50 points per extra bulb
- Combo matches (matches triggered by falling bulbs): Multiplier increases with each combo in a chain

### Game Progression
- **Level-based:** Each level has specific goals (score targets, specific color matches, etc.)
- **Time Limit:** Optional time limit for each level to add pressure
- **Star Rating:** 1-3 stars awarded based on performance

## Visual and Audio Design

### Visual Style
- Bright, colorful, and cheerful aesthetic
- Light bulbs with distinct colors and subtle glow effects
- Simple but appealing animations for matches, movements, and special effects
- Clean and intuitive UI elements

### Audio Design
- Background music: Upbeat, cheerful tune that loops seamlessly
- Sound effects:
  - Bulb selection/movement sounds
  - Match completion sounds (varying based on match size)
  - Special effect sounds for combos and power-ups
  - Level completion jingles

## User Interface

### Main Menu
- Play button
- Options/Settings
- High Scores
- Credits

### In-Game UI
- Current score display
- Level progress/objectives
- Time remaining (if applicable)
- Pause button
- Settings access

### End of Level Screen
- Score summary
- Star rating
- Next level button
- Retry button
- Return to menu button

## Future Enhancements

### Power-Ups
- Special light bulbs that clear entire rows or columns
- Color bombs that clear all bulbs of a specific color
- Lightning bulbs that clear in a specific pattern

### Additional Game Modes
- Endless mode
- Time attack mode
- Challenge mode with specific objectives

## Technical Considerations

- Responsive design to accommodate different screen sizes
- Touch support for mobile devices
- Efficient match detection algorithms
- Smooth animations for bulb movements and matches

## Success Metrics

- Player retention rate
- Average session length
- Level completion rate
- Social sharing metrics
