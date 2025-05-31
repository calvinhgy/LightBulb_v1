# Mobile UX Design - LightBulb Mobile

## Overview

This document outlines the user experience design considerations specific to the iPhone version of the LightBulb game. The mobile UX design focuses on creating an intuitive, engaging, and accessible experience optimized for touch interactions and various iPhone screen sizes.

## Design Principles

### 1. Touch-First Design
- All interactions are designed for touch input
- Touch targets are appropriately sized (minimum 44x44 points)
- Interactive elements have clear visual affordances

### 2. One-Handed Operation
- Primary gameplay can be completed with one hand
- Critical UI elements positioned within thumb reach zone
- Consideration for different hand sizes and grip styles

### 3. Responsive Layout
- Adapts to different iPhone screen sizes (from iPhone SE to iPhone Pro Max)
- Maintains consistent experience across devices
- Scales game grid appropriately for each device

### 4. Minimal Cognitive Load
- Clear, focused UI with minimal distractions
- Progressive disclosure of complex features
- Consistent visual language throughout the app

### 5. Immediate Feedback
- Visual, audio, and haptic feedback for all interactions
- Animations that reinforce causality
- Clear communication of game state changes

## Screen Flow

### App Launch Experience
1. **Splash Screen**: Branded splash screen (2 seconds)
2. **Main Menu**: Immediate access to continue game or start new game
3. **First-Time User Experience**: Tutorial for new players

### Core Navigation Structure
```
Main Menu
├── Play
│   ├── Level Select
│   │   └── Gameplay
│   │       └── Level Complete/Fail
├── Settings
├── Achievements
├── Leaderboard
└── Shop
```

## Screen Designs

### Main Menu
- **Layout**: Vertical layout with logo at top, primary actions in middle, secondary actions at bottom
- **Primary Actions**: Continue Game, New Game
- **Secondary Actions**: Settings, Achievements, Leaderboard, Shop
- **Visual Style**: Dark background with glowing light bulb elements

### Level Select
- **Layout**: Scrollable grid of level buttons
- **Information Display**: Level number, star rating, high score
- **Organization**: Levels grouped into "worlds" of 15 levels each
- **Visual Progression**: Visual themes evolve as players progress through worlds

### Gameplay Screen
- **Layout**: Game grid occupies majority of screen
- **HUD Elements**:
  - Top: Level objective, score, moves/time remaining
  - Bottom: Power-up buttons, pause button
- **Minimal Chrome**: UI elements fade during active gameplay to maximize game area

### Level Complete Screen
- **Layout**: Center-focused results display
- **Information**: Score, star rating, objectives completed
- **Actions**: Next Level, Replay Level, Return to Map
- **Celebrations**: Particle effects and animations for achievements

### Settings Screen
- **Layout**: Vertical list of settings categories
- **Categories**: Audio, Visual, Controls, Notifications, Account
- **Actions**: Reset Progress, Restore Purchases, Contact Support

## Interaction Patterns

### Touch Gestures
- **Tap**: Select menu items, buttons, and UI elements
- **Swipe**: Swap light bulbs, navigate between screens
- **Pinch**: Zoom in/out on game board (optional)
- **Long Press**: Activate contextual information or special actions
- **Shake**: Activate shuffle (limited uses per level)

### Game Board Interactions
- **Swipe to Swap**: Primary interaction method
- **Invalid Swap Feedback**: Visual shake animation + haptic feedback
- **Match Recognition**: Automatic highlighting of potential matches after period of inactivity
- **Special Bulb Activation**: Tap to activate special bulbs after they're created

### Transitions
- **Screen Transitions**: Smooth slide transitions between major screens
- **Level Start**: Fade in with objective callout
- **Level Complete**: Celebratory animation expanding from center
- **Menu Opening**: Slide up from bottom with subtle backdrop blur

## Accessibility Considerations

### Vision Accommodations
- **Color Blind Mode**: Alternative color schemes with patterns
- **High Contrast Mode**: Enhanced contrast for UI elements
- **Dynamic Type Support**: Respects system text size settings
- **VoiceOver Support**: Screen reader compatibility for menus

### Motor Accommodations
- **Alternative Control Schemes**: Tap-to-select instead of swipe
- **Adjustable Timing**: Options to extend time limits
- **Touch Accommodations**: Compatible with iOS touch accommodations

### Cognitive Accommodations
- **Simplified Tutorial**: Step-by-step guidance with visual cues
- **Reduced Motion Mode**: Minimized animations
- **Consistent Navigation**: Predictable back button behavior

## Responsive Design

### Device Adaptations
| Device | Grid Size | UI Scale | Special Considerations |
|--------|-----------|----------|------------------------|
| iPhone SE | 7x9 | Compact | Simplified HUD |
| iPhone 13 | 8x10 | Standard | Full feature set |
| iPhone Pro Max | 9x11 | Expanded | Enhanced visual effects |

### Orientation Support
- **Primary**: Portrait orientation optimized for one-handed play
- **Optional**: Landscape support with redesigned UI for wider screens
- **Transition**: Smooth transition between orientations with game state preservation

## Onboarding Experience

### First-Time User Flow
1. **Welcome**: Brief introduction to game concept
2. **Core Mechanics**: Interactive tutorial showing swipe mechanics
3. **Special Pieces**: Introduction to special light bulbs
4. **Objectives**: Explanation of different level types
5. **Rewards**: Overview of progression system

### Progressive Tutorials
- **Just-in-Time Learning**: New mechanics introduced when first encountered
- **Contextual Tips**: Helpful hints based on player behavior
- **Skip Option**: Allow experienced players to skip tutorials

## Feedback Systems

### Visual Feedback
- **Match Indicators**: Glow effect around matched bulbs
- **Score Popups**: Floating numbers showing points earned
- **Combo Indicators**: Visual effects for chain reactions
- **Objective Progress**: Clear visual tracking of level objectives

### Audio Feedback
- **Interaction Sounds**: Distinct sounds for selection, swapping, matching
- **Ambient Effects**: Background sounds that respond to gameplay intensity
- **Voice Prompts**: Encouraging phrases at key moments

### Haptic Feedback
- **Light Haptics**: For selection and valid moves
- **Medium Haptics**: For matches and special bulb creation
- **Strong Haptics**: For level completion and achievements

## Personalization

### Player Preferences
- **Color Themes**: Multiple theme options for game board and UI
- **Sound Profiles**: Different sound effect collections
- **Control Customization**: Sensitivity adjustments for swipe recognition

### Progress Tracking
- **Statistics**: Detailed gameplay statistics
- **Achievements**: In-game achievement system
- **Leaderboards**: Friend and global leaderboards

## Testing Recommendations

- **Thumb Zone Mapping**: Heat map testing for one-handed reachability
- **Swipe Recognition**: Calibration testing across different user behaviors
- **Device Testing**: Verification across iPhone device range
- **Accessibility Testing**: Testing with assistive technologies
- **First-Time User Testing**: Observation of new player onboarding
