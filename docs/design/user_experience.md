# 五彩灯泡 (Colorful Light Bulbs) - User Experience Design

## Player Journey

### First-Time Experience
1. **Welcome Screen**
   - Game logo animation
   - "Play" button prominently displayed
   - Brief tagline explaining the game concept

2. **Tutorial**
   - Interactive tutorial explaining basic mechanics
   - Guided first moves to demonstrate matching
   - Introduction to scoring system
   - Completion reward (bonus points or special item)

3. **First Level**
   - Simplified objective (reach a modest score)
   - Generous time limit (if applicable)
   - Celebratory feedback upon completion

### Core Gameplay Loop

```
┌─────────────────┐
│                 │
│  Select Bulb    │◄─────────────┐
│                 │              │
└────────┬────────┘              │
         │                       │
         ▼                       │
┌─────────────────┐              │
│                 │              │
│  Swap Position  │              │
│                 │              │
└────────┬────────┘              │
         │                       │
         ▼                       │
┌─────────────────┐     ┌────────┴────────┐
│                 │ No  │                 │
│  Match Found?   ├────►│  Revert Swap    │
│                 │     │                 │
└────────┬────────┘     └─────────────────┘
         │ Yes
         ▼
┌─────────────────┐
│                 │
│  Clear Matches  │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│                 │
│  Cascade Bulbs  │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│                 │
│  Fill Board     │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│                 │ Yes │                 │
│  Level Complete?├────►│   Next Level    │
│                 │     │                 │
└────────┬────────┘     └─────────────────┘
         │ No
         │
         └─────────────┐
                       │
                       ▼
               Continue Gameplay
```

## User Interface Design

### Main Menu Screen
![Main Menu Wireframe]

- Game logo at top
- Play button (large, centered)
- Options button
- High Scores button
- Credits button
- Animated background with floating light bulbs

### Game Screen Layout
![Game Screen Wireframe]

```
┌────────────────────────────────────────────┐
│ ┌──────────┐                    ┌────────┐ │
│ │ Score    │                    │ Pause  │ │
│ │ 000000   │                    │   ▶    │ │
│ └──────────┘                    └────────┘ │
│ ┌──────────┐                    ┌────────┐ │
│ │ Level    │                    │ Time   │ │
│ │   1      │                    │ 02:30  │ │
│ └──────────┘                    └────────┘ │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │                                        │ │
│ │                                        │ │
│ │                                        │ │
│ │                                        │ │
│ │             Game Board                 │ │
│ │          (40x40 Light Bulbs)           │ │
│ │                                        │ │
│ │                                        │ │
│ │                                        │ │
│ │                                        │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │             Objective Panel            │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Pause Menu
- Resume Game
- Restart Level
- Sound Settings
- Return to Main Menu
- Quit Game

### Level Complete Screen
- Level number
- Score achieved
- Star rating (1-3 stars)
- "Next Level" button
- "Replay Level" button
- "Main Menu" button

## Interaction Design

### Bulb Selection and Swapping
1. **Selection Feedback**
   - Visual highlight around selected bulb
   - Subtle pulsing animation
   - Soft selection sound

2. **Drag Interaction**
   - Bulb follows cursor/finger with slight lag
   - Semi-transparent ghost image shows original position
   - Adjacent valid swap positions highlighted

3. **Swap Animation**
   - Smooth transition between positions
   - Slight bounce effect at end of movement
   - Distinctive swap sound

### Match Feedback

1. **Visual Feedback**
   - Matched bulbs flash briefly before disappearing
   - Particle effects emanate from match location
   - Score numbers float upward from match

2. **Audio Feedback**
   - Escalating sound effects for larger matches
   - Distinct sounds for different colors
   - Combo sounds increase in pitch/intensity

### Cascading Effects

1. **Falling Animation**
   - Bulbs fall with gravity-like acceleration
   - Slight bounce on landing
   - Falling sounds with pitch variation

2. **New Bulbs Appearance**
   - Fade-in effect for new bulbs
   - Subtle popping sound

## Accessibility Considerations

1. **Visual Accessibility**
   - Color-blind friendly palette with distinct patterns
   - High contrast UI elements
   - Adjustable text size
   - Option to enable bulb symbols in addition to colors

2. **Audio Accessibility**
   - Separate volume controls for music and sound effects
   - Visual cues for all audio feedback
   - Option to enable screen reader support

3. **Motor Accessibility**
   - Adjustable game speed
   - Option for tap-to-select, tap-to-place instead of drag
   - No time-critical elements in standard mode

## Onboarding and Learning Curve

1. **Progressive Disclosure**
   - Basic mechanics introduced first
   - Advanced techniques revealed gradually
   - Tips shown during loading screens

2. **Contextual Help**
   - Hint system for stuck players
   - Optional highlighting of potential matches
   - "How to Play" accessible from pause menu

3. **Feedback Systems**
   - Clear success/failure indicators
   - Encouraging messages for near-misses
   - Celebration of achievements and milestones

## Emotional Design Elements

1. **Delight Factors**
   - Satisfying match animations
   - Unexpected bonus effects for large matches
   - Easter eggs and hidden interactions

2. **Progression Satisfaction**
   - Level-up celebrations
   - Milestone achievements
   - Personal best notifications

3. **Recovery Mechanics**
   - Comeback opportunities when close to failure
   - Bonus time/moves for skilled play
   - Encouraging messages after failed levels
