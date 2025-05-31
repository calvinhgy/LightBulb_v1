# Test Cases - LightBulb Mobile

## Core Gameplay Test Cases

### TC-001: Basic Light Bulb Swapping

**Objective**: Verify that players can swap adjacent light bulbs using touch gestures.

**Preconditions**:
- Game is loaded and in an active level
- Grid contains light bulbs of different colors

**Test Steps**:
1. Identify two adjacent light bulbs that will form a match when swapped
2. Swipe from the first light bulb toward the second light bulb
3. Observe the swap animation and match detection
4. Repeat using tap-select method (tap first bulb, then tap second bulb)

**Expected Results**:
- Light bulbs should swap positions with a smooth animation
- Matching light bulbs should be detected and removed
- New light bulbs should fall from the top to fill empty spaces
- Score should increase appropriately
- Both swipe and tap-select methods should work consistently

**Test Data**:
- Test on levels 1, 5, and 10
- Test with different color combinations

---

### TC-002: Invalid Swap Detection

**Objective**: Verify that the game correctly handles invalid swap attempts.

**Preconditions**:
- Game is loaded and in an active level
- Grid contains light bulbs of different colors

**Test Steps**:
1. Identify two adjacent light bulbs that will NOT form a match when swapped
2. Swipe from the first light bulb toward the second light bulb
3. Observe the response animation
4. Repeat using tap-select method

**Expected Results**:
- Light bulbs should briefly swap positions
- Light bulbs should return to their original positions
- An "invalid move" animation/effect should be displayed
- An error sound should play (if sound is enabled)
- No score change should occur
- Both swipe and tap-select methods should behave consistently

**Test Data**:
- Test on levels 1, 5, and 10
- Test with different color combinations

---

### TC-003: Match Detection - Basic Matches

**Objective**: Verify that the game correctly detects matches of 3, 4, and 5 light bulbs.

**Preconditions**:
- Game is loaded and in a test level with predefined patterns
- Grid contains specific patterns for testing

**Test Steps**:
1. Create a horizontal match of 3 identical light bulbs
2. Observe match detection and scoring
3. Create a vertical match of 3 identical light bulbs
4. Observe match detection and scoring
5. Create a match of 4 identical light bulbs
6. Observe match detection, scoring, and special bulb creation
7. Create a match of 5 identical light bulbs
8. Observe match detection, scoring, and special bulb creation

**Expected Results**:
- All valid matches should be detected correctly
- Score should increase proportionally to match size
- Match of 4 should create a Line Bulb
- Match of 5 should create a Rainbow Bulb
- Appropriate animations and sounds should play for each match type

**Test Data**:
- Test with each of the four colors (Red, Yellow, Blue, Green)
- Test both horizontal and vertical orientations

---

### TC-004: Cascade Effects

**Objective**: Verify that cascading matches work correctly after initial matches.

**Preconditions**:
- Game is loaded and in a level with potential for cascades
- Grid contains specific patterns that will trigger cascades

**Test Steps**:
1. Make a match that will cause light bulbs to fall and create a new match automatically
2. Observe the cascade sequence
3. Count the number of cascade steps
4. Note the score multiplier for cascades

**Expected Results**:
- After initial match, light bulbs should fall to fill empty spaces
- New matches formed by falling light bulbs should be detected automatically
- Each cascade step should increase the score multiplier
- Cascade animations should play smoothly in sequence
- Cascade sounds should play with increasing pitch/intensity

**Test Data**:
- Test with simple cascade (1 additional match)
- Test with complex cascade (3+ additional matches)

---

### TC-005: Special Light Bulbs - Creation

**Objective**: Verify that special light bulbs are created correctly from specific match patterns.

**Preconditions**:
- Game is loaded and in a test level
- Grid allows creation of special match patterns

**Test Steps**:
1. Create a match of 4 in a row
2. Observe the creation of a Line Bulb
3. Create a match of 5 in an L shape
4. Observe the creation of a Bomb Bulb
5. Create a match of 5 in a row
6. Observe the creation of a Rainbow Bulb

**Expected Results**:
- Line Bulb should be created at the position of the last swapped piece in a 4-match
- Bomb Bulb should be created at the intersection of the L or T shape in a 5-match
- Rainbow Bulb should be created at the position of the last swapped piece in a 5-in-a-row match
- Special creation animations should play
- Special creation sounds should play

**Test Data**:
- Test with each of the four colors (Red, Yellow, Blue, Green)
- Test in different positions on the grid (center, edges, corners)

---

### TC-006: Special Light Bulbs - Activation

**Objective**: Verify that special light bulbs activate correctly when used.

**Preconditions**:
- Game is loaded with pre-placed special light bulbs
- Grid contains a mix of regular and special light bulbs

**Test Steps**:
1. Tap a Line Bulb and select a direction
2. Observe the line clearing effect
3. Tap a Bomb Bulb
4. Observe the explosion effect
5. Tap a Rainbow Bulb and then tap a regular colored bulb
6. Observe the color-clearing effect

**Expected Results**:
- Line Bulb should clear an entire row or column based on direction selected
- Bomb Bulb should clear a 3x3 area around it
- Rainbow Bulb should clear all bulbs of the selected color
- Appropriate animations should play for each special bulb activation
- Appropriate sounds should play for each special bulb activation
- Score should increase based on the number of bulbs cleared

**Test Data**:
- Test each special bulb type multiple times
- Test in different positions on the grid

---

## Touch Interaction Test Cases

### TC-007: Swipe Gesture Recognition

**Objective**: Verify that swipe gestures are recognized accurately in different directions and speeds.

**Preconditions**:
- Game is loaded and in an active level
- Grid contains light bulbs that can be swapped

**Test Steps**:
1. Perform a slow swipe up (500ms duration)
2. Perform a medium-speed swipe right (250ms duration)
3. Perform a fast swipe down (100ms duration)
4. Perform a very fast swipe left (50ms duration)
5. Perform short-distance swipes (10-20pt) in each direction
6. Perform long-distance swipes (100pt+) in each direction

**Expected Results**:
- All swipe gestures should be recognized correctly
- Swipe direction should determine which adjacent bulb is swapped
- Swipe speed should not affect recognition (within reasonable limits)
- Swipe distance should not affect recognition (as long as minimum threshold is met)
- Animations should be consistent regardless of swipe characteristics

**Test Data**:
- Test in center of grid
- Test near edges of grid
- Test with different finger pressure

---

### TC-008: Multi-Touch Handling

**Objective**: Verify that the game handles multiple simultaneous touches appropriately.

**Preconditions**:
- Game is loaded and in an active level
- Grid contains light bulbs that can be swapped

**Test Steps**:
1. Attempt to perform two simultaneous swipes in different areas of the grid
2. Tap one bulb, and while holding, tap another with a second finger
3. Perform a swipe while another finger is touching elsewhere on the screen
4. Perform a pinch gesture on the game board

**Expected Results**:
- Game should prioritize the first touch and ignore or queue secondary touches
- Multi-touch gestures like pinch should be handled according to design (zoom if implemented)
- Game should not crash or behave unpredictably with multi-touch input
- After completing one interaction, the next queued interaction should be processed

**Test Data**:
- Test with two-finger touches
- Test with three-finger touches
- Test rapid sequential touches

---

### TC-009: Edge Case Touch Interactions

**Objective**: Verify that touch interactions work correctly in edge case scenarios.

**Preconditions**:
- Game is loaded and in an active level
- Grid contains light bulbs that can be swapped

**Test Steps**:
1. Perform a swipe that starts on a bulb but ends outside the grid
2. Perform a swipe that starts outside the grid but ends on a bulb
3. Perform a swipe that starts and ends on the same bulb (no direction)
4. Perform a diagonal swipe between two bulbs
5. Perform a swipe during an ongoing animation
6. Perform a swipe while light bulbs are falling

**Expected Results**:
- Swipes starting on bulbs but ending outside should be interpreted based on direction
- Swipes starting outside the grid should be ignored
- Swipes with no clear direction should be ignored
- Diagonal swipes should be resolved to the dominant axis (horizontal or vertical)
- Swipes during animations should be queued or processed based on design decision
- Game should not crash or behave unpredictably in any scenario

**Test Data**:
- Test on different areas of the grid (center, edges, corners)
- Test during different game states (idle, animating, cascading)

---

## Game Progression Test Cases

### TC-010: Level Objectives

**Objective**: Verify that different level objectives are tracked and completed correctly.

**Preconditions**:
- Game is loaded with test levels for each objective type
- Player has access to levels with different objectives

**Test Steps**:
1. Play a level with a score objective
2. Track progress toward the score goal
3. Play a level with a "collect specific colors" objective
4. Track progress toward collecting each color
5. Play a level with an "obstacle clearing" objective
6. Track progress toward clearing obstacles

**Expected Results**:
- Objective progress should be displayed accurately
- Progress should update in real-time as actions are taken
- When objectives are met, level should be marked as complete
- Appropriate celebration/completion animations should play
- Stars should be awarded based on performance metrics

**Test Data**:
- Test each objective type in multiple levels
- Test partial completion and full completion scenarios

---

### TC-011: Level Progression and Unlocking

**Objective**: Verify that level progression and unlocking works correctly.

**Preconditions**:
- Game is installed with a fresh player profile
- Initial levels are unlocked

**Test Steps**:
1. Complete Level 1 with 1 star
2. Check if Level 2 is unlocked
3. Complete Level 2 with 3 stars
4. Check if Level 3 is unlocked
5. Skip to last level of current world
6. Complete it and check if next world unlocks

**Expected Results**:
- Completing a level should unlock the next level
- Star ratings should be saved correctly
- Level selection screen should accurately show unlocked levels
- Level selection screen should accurately show star ratings
- World progression should work when final level of a world is completed

**Test Data**:
- Test with minimum completion (1 star)
- Test with maximum completion (3 stars)
- Test world boundaries

---

## Performance Test Cases

### TC-012: Frame Rate Stability

**Objective**: Verify that the game maintains acceptable frame rates during various gameplay scenarios.

**Preconditions**:
- Game is installed on test devices from each device category
- FPS monitoring is enabled

**Test Steps**:
1. Measure baseline FPS during idle game board
2. Create a simple match and measure FPS during animation
3. Create a cascade of 3+ matches and measure FPS
4. Activate a special bulb that affects many pieces and measure FPS
5. Rapidly make multiple moves in succession and measure FPS

**Expected Results**:
- Minimum spec devices: Maintain at least 30 FPS in all scenarios
- Target spec devices: Maintain at least 45 FPS in all scenarios
- Premium spec devices: Maintain 60 FPS in all scenarios
- No visible stuttering during animations
- No significant frame drops during complex cascades

**Test Data**:
- Test on iPhone SE (minimum spec)
- Test on iPhone 12 (target spec)
- Test on iPhone 14 Pro (premium spec)

---

### TC-013: Memory Usage

**Objective**: Verify that the game manages memory efficiently during extended gameplay.

**Preconditions**:
- Game is installed on test devices
- Memory monitoring is enabled
- Test session is prepared for extended play

**Test Steps**:
1. Measure baseline memory usage at game start
2. Play through 5 levels and measure memory
3. Play through 15 levels and measure memory
4. Navigate between menus and gameplay repeatedly
5. Leave game running in background, then return to it

**Expected Results**:
- Memory usage should remain below 200MB on all devices
- No significant memory leaks (continuous growth) during extended play
- Memory should be properly released when navigating between screens
- Game should recover properly after being in background

**Test Data**:
- Test with 30-minute gameplay session
- Test with frequent navigation between menus and gameplay
- Test with background/foreground transitions

---

### TC-014: Battery Impact

**Objective**: Verify that the game has reasonable battery consumption.

**Preconditions**:
- Test devices are at 100% battery or connected to battery monitoring
- Baseline battery drain rate is established

**Test Steps**:
1. Play game continuously for 30 minutes
2. Measure battery percentage drop
3. Calculate drain rate per hour
4. Compare to baseline drain rate for device

**Expected Results**:
- Battery drain should not exceed 10% per hour above baseline
- No abnormal device heating during gameplay
- Performance should remain stable as battery depletes

**Test Data**:
- Test on multiple device categories
- Test with both Wi-Fi on and off
- Test with different brightness settings

---

## Usability Test Cases

### TC-015: First-Time User Experience

**Objective**: Verify that new players can easily understand and play the game.

**Preconditions**:
- Fresh installation of the game
- No previous player data

**Test Steps**:
1. Launch the game for the first time
2. Observe tutorial presentation
3. Follow tutorial instructions
4. Complete first level without additional help
5. Navigate to second level

**Expected Results**:
- Tutorial should clearly explain core mechanics
- Tutorial should be interactive, requiring player actions
- Players should be able to complete first level after tutorial
- Navigation to subsequent levels should be intuitive
- No confusion about game objectives or controls

**Test Data**:
- Test with users of different gaming experience levels
- Test with users of different age groups

---

### TC-016: One-Handed Playability

**Objective**: Verify that the game can be comfortably played with one hand on different iPhone sizes.

**Preconditions**:
- Game is installed on different iPhone models
- Test users with different hand sizes are available

**Test Steps**:
1. Hold device in one hand (dominant hand)
2. Navigate through menus using only thumb
3. Play through a complete level using only thumb
4. Reach all areas of the game grid
5. Access all on-screen controls during gameplay

**Expected Results**:
- All essential interactions should be possible with one-handed play
- Thumb should be able to reach all areas of the grid (or game should accommodate)
- No hand strain reported after 5-minute play session
- No accidental touches due to grip position

**Test Data**:
- Test on iPhone SE (small)
- Test on iPhone 12 (medium)
- Test on iPhone 14 Pro Max (large)
- Test with different hand sizes (small, medium, large)

---

## Accessibility Test Cases

### TC-017: Color Blind Mode

**Objective**: Verify that color blind mode makes the game playable for users with color vision deficiencies.

**Preconditions**:
- Game is installed with accessibility options
- Color blind mode is available

**Test Steps**:
1. Enable color blind mode in settings
2. Observe changes to game visuals
3. Identify different colored light bulbs
4. Play through a complete level
5. Create and activate special light bulbs

**Expected Results**:
- Each color should be distinguishable through patterns or symbols
- Color information should not be the only means of distinction
- Gameplay should be fully functional with color blind mode enabled
- No confusion between different colored light bulbs
- Special light bulbs should be clearly identifiable

**Test Data**:
- Test with simulated protanopia (red-blind)
- Test with simulated deuteranopia (green-blind)
- Test with simulated tritanopia (blue-blind)
- Test with simulated achromatopsia (monochromacy)

---

### TC-018: VoiceOver Compatibility

**Objective**: Verify that the game is usable with VoiceOver screen reader.

**Preconditions**:
- Game is installed on device with VoiceOver enabled
- Game supports VoiceOver

**Test Steps**:
1. Navigate main menu using VoiceOver
2. Start a game level using VoiceOver
3. Identify light bulb positions and colors
4. Make a match using VoiceOver guidance
5. Complete a level using VoiceOver

**Expected Results**:
- All UI elements should be properly labeled for VoiceOver
- Game grid should be navigable with VoiceOver
- Light bulb colors and positions should be announced
- Match possibilities should be identifiable
- Game should be playable (though potentially more challenging) with VoiceOver

**Test Data**:
- Test menu navigation
- Test gameplay
- Test special features and power-ups

---

## Offline Functionality Test Cases

### TC-019: Offline Play

**Objective**: Verify that the game functions properly without an internet connection.

**Preconditions**:
- Game is installed and previously launched at least once
- Device has been placed in airplane mode

**Test Steps**:
1. Launch the game with no internet connection
2. Navigate through menus
3. Play through multiple levels
4. Earn achievements and progress
5. Close and relaunch the game while still offline

**Expected Results**:
- Game should launch successfully without internet
- All core gameplay should function normally
- Progress should be saved locally
- Achievements should be recorded locally
- Game should maintain state between sessions while offline

**Test Data**:
- Test after fresh install with one initial online session
- Test after extended offline period
- Test transition from online to offline

---

### TC-020: Progress Synchronization

**Objective**: Verify that offline progress synchronizes correctly when connection is restored.

**Preconditions**:
- Game is installed and player has existing online progress
- Device has been placed in airplane mode
- Player has made offline progress

**Test Steps**:
1. Play and complete several levels while offline
2. Earn achievements while offline
3. Turn on internet connection
4. Launch the game
5. Check if offline progress is synchronized

**Expected Results**:
- Offline level progress should be preserved
- Offline achievements should be synchronized
- No loss of data when transitioning from offline to online
- Synchronization should happen automatically
- Conflict resolution should favor the highest achievement/progress

**Test Data**:
- Test with small amount of offline progress
- Test with significant offline progress
- Test with conflicting progress (same levels played online on another device)
