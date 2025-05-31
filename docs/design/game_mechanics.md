# 五彩灯泡 (Colorful Light Bulbs) - Game Mechanics

## Core Mechanics

### Game Board
- **Size**: 40x40 grid of light bulbs
- **Colors**: Four distinct colors - Red, Yellow, Blue, and Green
- **Initial State**: Random distribution of colors across the board
- **Visibility**: The visible portion of the board may be smaller than 40x40, with scrolling/panning to see the full board

### Basic Interactions

#### Bulb Selection
- Player can select a bulb by clicking/tapping on it
- Selected bulb is visually highlighted
- Selection can be canceled by clicking elsewhere

#### Bulb Swapping
- Player can drag a selected bulb to swap with an adjacent bulb (left, right, up, or down)
- Swapping is only allowed between directly adjacent bulbs
- Diagonal swaps are not permitted
- Swapping animation shows bulbs smoothly trading places

#### Match Detection
- After each swap, the game checks for matches
- A match consists of 3 or more identical colored bulbs in a horizontal or vertical line
- Matches can be formed horizontally, vertically, or both
- Multiple matches can be formed in a single swap

#### Match Resolution
- Matched bulbs are highlighted briefly
- Matched bulbs disappear from the board
- Score is awarded based on the number of bulbs matched
- Empty spaces are created where matched bulbs were located

#### Cascading Effect
- After matches are removed, bulbs above empty spaces fall down to fill the gaps
- New random bulbs appear at the top of the board to fill any remaining empty spaces
- After cascading, the game checks for new matches that may have formed
- This process continues until no more matches are found

### Invalid Moves
- If a swap does not create a match, it is considered invalid
- Invalid swaps are automatically reversed
- Visual and audio feedback indicates an invalid move
- No penalty is applied for invalid moves

## Scoring System

### Basic Scoring
- **3-Bulb Match**: 100 points
- **4-Bulb Match**: 150 points
- **5-Bulb Match**: 200 points
- **6+ Bulb Match**: 50 additional points per bulb beyond 5

### Combo Scoring
- **Chain Reaction**: When cascading bulbs create new matches
- **Combo Multiplier**: Each subsequent match in a chain increases the multiplier
  - First match: 1x (base score)
  - Second match: 1.5x
  - Third match: 2x
  - Fourth match: 2.5x
  - Fifth+ match: 3x

### Special Patterns
- **L-Shape**: 200 points
- **T-Shape**: 250 points
- **Cross-Shape**: 300 points

## Game Progression

### Level Structure
- **Objective-Based**: Each level has specific goals to achieve
- **Progression**: Levels increase in difficulty as the player advances
- **Star Rating**: 1-3 stars awarded based on performance

### Level Objectives
1. **Score Target**: Reach a specific score within constraints
2. **Color Collection**: Match a certain number of specific colored bulbs
3. **Pattern Clearing**: Clear specific patterns or areas of the board
4. **Time Challenge**: Complete objectives within a time limit

### Constraints
- **Move Limit**: Complete the objective within a limited number of moves
- **Time Limit**: Complete the objective before time runs out
- **Special Bulbs**: Deal with special bulb types that have unique behaviors

## Advanced Mechanics

### Special Bulbs
These can be introduced in later levels or as rewards:

1. **Bomb Bulb**
   - Created by matching 4 in a row/column
   - Clears bulbs in a 3x3 area when matched

2. **Line Clearer**
   - Created by matching 5 in a row/column
   - Clears an entire row or column when matched

3. **Color Bomb**
   - Created by matching bulbs in special patterns
   - Clears all bulbs of a specific color when matched

4. **Locked Bulbs**
   - Cannot be moved until adjacent matches free them
   - Requires strategic planning to unlock

5. **Rainbow Bulb**
   - Rare special bulb that can match with any color
   - Acts as a wildcard in forming matches

### Power-Ups
Players can earn or purchase power-ups to help with difficult levels:

1. **Color Swap**
   - Changes a selected bulb to a different color
   - Limited uses per level

2. **Shuffle**
   - Randomly rearranges all bulbs on the board
   - Useful when no obvious matches are available

3. **Extra Moves**
   - Adds additional moves to the move counter
   - Helps when close to completing an objective

4. **Time Boost**
   - Adds additional time in timed levels
   - Provides breathing room to complete objectives

5. **Super Match**
   - Automatically finds and clears the largest possible match
   - Strategic use can trigger massive cascades

## Balance Considerations

### Difficulty Curve
- **Early Levels**: Simple objectives, generous limits, frequent matches
- **Mid-Game**: Increased complexity, tighter constraints, strategic thinking required
- **Late-Game**: Challenging objectives, precise play required, mastery of mechanics tested

### Random Generation
- **Controlled Randomness**: Board generation ensures at least a minimum number of possible matches
- **Anti-Frustration**: System prevents long sequences without viable matches
- **Difficulty Scaling**: Random generation parameters adjust based on player skill and level

### Feedback Systems
- **Near-Miss Highlighting**: Optional hints when player is stuck
- **Pattern Recognition**: Visual cues for potential special bulb formations
- **Progress Indicators**: Clear visualization of objective progress

## Strategic Depth

### Planning Ahead
- Players are rewarded for thinking multiple moves ahead
- Setting up chain reactions is more valuable than single matches
- Creating special bulbs requires planning and pattern recognition

### Resource Management
- Managing limited moves or time requires strategic decision-making
- Power-ups should be saved for critical moments
- Risk/reward decisions when setting up larger combos vs. taking immediate matches

### Board Analysis
- Identifying high-value areas of the board
- Recognizing potential chain reaction opportunities
- Prioritizing matches that advance level objectives

## Accessibility Considerations

### Difficulty Options
- **Casual Mode**: Relaxed time limits, more moves, optional hints
- **Standard Mode**: Balanced challenge for average players
- **Expert Mode**: Stricter limits, fewer hints, greater challenge

### Assistance Features
- **Hint System**: Highlights potential matches after period of inactivity
- **Color-Blind Mode**: Adds patterns to bulbs to distinguish colors
- **Reduced Motion Option**: Minimizes animations for players sensitive to motion

### Control Options
- **Touch Controls**: Optimized for mobile devices
- **Mouse Controls**: Precision control for desktop
- **Alternative Input**: Option for click-to-select, click-to-place instead of drag
