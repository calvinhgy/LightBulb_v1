# Game Design Document - LightBulb Mobile

## Game Overview

"五彩灯泡 Mobile" (Colorful Light Bulbs for iPhone) is a touch-optimized match-3 puzzle game designed specifically for iPhone devices. Players swipe to swap adjacent light bulbs, creating matches of three or more identical colors. When matched, these light bulbs disappear from the board, creating cascading effects and chain reactions.

## Core Gameplay

### Game Mechanics

- **Grid Size**: Adaptive grid size based on device screen size (default 8x10 for portrait orientation)
- **Colors**: Four distinct colors: Red, Yellow, Blue, and Green
- **Mechanics**: Players swipe to swap adjacent light bulbs
- **Match Criteria**: Three or more identical colors in a row or column
- **Cascading**: When matches are made, new light bulbs fall from the top to fill empty spaces
- **Chain Reactions**: Cascading can create new matches automatically
- **Special Light Bulbs**: Special light bulbs are created when matching 4 or more in a pattern:
  - **Line Bulb**: Created by matching 4 in a row, clears an entire row or column when used
  - **Bomb Bulb**: Created by matching 5 in an L or T shape, clears a 3x3 area when used
  - **Rainbow Bulb**: Created by matching 5 in a row, clears all bulbs of the same color when used

### Controls

- **Swipe**: Swipe in any direction to swap adjacent light bulbs
- **Tap**: Tap to select a light bulb, then tap an adjacent position to swap
- **Pinch**: Pinch to zoom in/out on larger grid sizes (optional feature)
- **Shake**: Shake device to shuffle the board (limited uses per level)

## Game Flow

1. **Main Menu**: Players start at the main menu with options for:
   - Continue Game
   - New Game
   - Settings
   - Leaderboards
   - Tutorial

2. **Level Selection**: Players can select levels they've unlocked

3. **Gameplay Loop**:
   - Level objectives are displayed
   - Player swipes to create matches
   - Matches award points and clear light bulbs
   - New light bulbs fall to fill empty spaces
   - Chain reactions may occur
   - Level ends when objectives are completed or moves/time runs out

4. **Level Completion**:
   - Score summary is displayed
   - Stars awarded (1-3) based on performance
   - Option to continue to next level, replay, or return to level selection

## Progression System

- **Levels**: 50 initial levels with progressive difficulty
- **Star Rating**: 1-3 stars per level based on score thresholds
- **Unlocking**: New levels unlock when previous level is completed with at least 1 star
- **Level Types**:
  - **Standard**: Reach a target score within move limit
  - **Timed**: Reach a target score within time limit
  - **Collection**: Collect specific colored light bulbs
  - **Obstacle**: Clear obstacles by making matches adjacent to them
  - **Boss**: Special levels with unique mechanics

## Economy & Rewards

- **Stars**: Earned by completing levels with high scores
- **Coins**: Earned through gameplay and achievements
- **Power-ups**: Purchasable with coins:
  - **Extra Moves**: +5 moves in a level
  - **Extra Time**: +30 seconds in timed levels
  - **Color Bomb**: Clears all bulbs of a selected color
  - **Shuffle**: Rearranges all bulbs on the board

## Visual Style

- **Light Bulbs**: Colorful, glowing light bulbs with distinct colors and subtle animations
- **Background**: Dark, subtle background that doesn't distract from gameplay
- **UI**: Clean, minimalist UI with clear touch targets
- **Effects**: Particle effects for matches, cascades, and special bulb activations
- **Animations**: Smooth, responsive animations for all interactions

## Audio Design

- **Background Music**: Relaxing, ambient music with dynamic intensity based on gameplay
- **Sound Effects**:
  - Selection sounds
  - Swap sounds
  - Match sounds (different for different match sizes)
  - Cascade sounds
  - Special bulb activation sounds
  - Level completion sounds
- **Haptic Feedback**: Subtle haptic feedback for interactions and matches

## Accessibility Features

- **Color Blind Mode**: Alternative color schemes and patterns for color blind players
- **Sound Options**: Separate volume controls for music and sound effects
- **Text Size**: Adjustable text size
- **Tutorial**: Interactive tutorial explaining game mechanics
- **Alternative Controls**: Option to use tap-based controls instead of swipe

## Technical Considerations

- **Portrait Orientation**: Primary gameplay in portrait orientation
- **One-Handed Play**: Designed for comfortable one-handed play on various iPhone sizes
- **Offline Play**: Full functionality without internet connection
- **Save System**: Automatic saving of progress
- **Performance**: Optimized for smooth performance on iPhone devices (iPhone 8 and newer)

## Target Audience

- **Primary**: Casual mobile gamers ages 18-45
- **Secondary**: Puzzle game enthusiasts of all ages
- **Tertiary**: Fans of the original web-based LightBulb game

## Competitive Analysis

- **Candy Crush Saga**: Similar core mechanics but with more complex special pieces
- **Bejeweled**: Classic match-3 with simpler mechanics
- **Two Dots**: Minimalist design with unique level objectives
- **Toon Blast**: Team-based social features

Our differentiation:
- Clean, minimalist aesthetic with glowing light bulb theme
- Focus on smooth, responsive touch controls
- Balanced progression system without aggressive monetization
- Unique special light bulbs and level mechanics
