# Touch Interaction Design - LightBulb Mobile

## Overview

This document details the touch interaction patterns for the LightBulb Mobile game, focusing on creating intuitive, responsive, and satisfying touch-based gameplay optimized for iPhone devices.

## Core Touch Interactions

### Swipe to Swap

The primary game mechanic involves swiping to swap adjacent light bulbs.

#### Implementation Details
- **Direction Recognition**: Recognize swipes in four cardinal directions (up, down, left, right)
- **Minimum Distance**: 10pt minimum swipe distance to trigger swap
- **Maximum Distance**: 100pt maximum distance recognition to prevent accidental scrolling
- **Speed Threshold**: 50-500pt/second velocity range for recognition
- **Angle Tolerance**: ±30° tolerance for directional recognition
- **Feedback Timing**: Visual feedback begins immediately on touch, completes on release

#### Edge Cases
- **Diagonal Swipes**: Interpret based on dominant axis
- **Multi-Touch**: Ignore secondary touches during active swap
- **Rapid Swipes**: Queue rapid sequential swipes (max 2 in queue)
- **Edge Swipes**: System gestures take precedence at screen edges

### Tap to Select

An alternative interaction method for players who prefer tap-based controls.

#### Implementation Details
- **First Tap**: Selects a light bulb with visual highlight
- **Second Tap**: If adjacent to selected bulb, performs swap
- **Tap Elsewhere**: Deselects current selection
- **Timing Window**: 3-second window to complete selection pair
- **Visual Indicator**: Pulsing highlight on selected bulb
- **Valid Target Indication**: Subtle highlights on valid swap targets

## Special Touch Interactions

### Special Bulb Activation

Special light bulbs require specific activation methods.

#### Line Bulb
- **Activation**: Tap the special bulb, then tap or swipe in direction to clear
- **Visual Guidance**: Directional arrows indicating possible clearance paths
- **Cancellation**: Tap elsewhere to cancel activation mode

#### Bomb Bulb
- **Activation**: Simple tap activates explosion effect
- **Visual Guidance**: Brief pulse animation showing affected area
- **Timing**: 0.3-second delay before explosion to allow for cancellation

#### Rainbow Bulb
- **Activation**: Tap rainbow bulb, then tap any color bulb to clear all of that color
- **Visual Guidance**: Color highlighting effect on potential targets
- **Cancellation**: Tap rainbow bulb again to cancel selection

### Power-Up Interactions

Power-ups are activated through distinct touch patterns.

#### Extra Moves/Time
- **Activation**: Tap power-up button, then confirm in modal dialog
- **Visual Feedback**: Animation showing +5 moves or +30 seconds

#### Color Bomb
- **Activation**: Tap power-up, then tap color to clear
- **Visual Guidance**: Color filter effect showing targets

#### Shuffle
- **Activation**: Tap shuffle button or shake device
- **Animation**: Whirling animation of all pieces

## Gesture Recognition Parameters

### Swipe Recognition

| Parameter | Value | Notes |
|-----------|-------|-------|
| Min Distance | 10pt | Prevents accidental triggers |
| Max Distance | 100pt | Prevents conflict with scrolling |
| Min Velocity | 50pt/s | Allows for deliberate movements |
| Max Velocity | 500pt/s | Captures quick flicks |
| Direction Tolerance | ±30° | Forgiving directional recognition |
| Touch Duration | ≤300ms | Distinguishes from long press |

### Tap Recognition

| Parameter | Value | Notes |
|-----------|-------|-------|
| Max Movement | 5pt | Distinguishes from accidental movement |
| Max Duration | 200ms | Distinguishes from long press |
| Double Tap Window | 300ms | Time between taps to register as double |
| Touch Radius | 44pt | Minimum touch target size |

## Feedback Mechanisms

### Visual Feedback

- **Touch Down**: Immediate 95% scale + highlight effect (15ms)
- **Valid Swap**: Smooth transition animation (300ms)
- **Invalid Swap**: Return animation with horizontal shake (200ms)
- **Match Recognition**: Glow effect + pulse before removal (200ms)
- **Cascading**: Sequential animations for falling pieces (varies by distance)

### Haptic Feedback

| Interaction | Haptic Type | Duration | Notes |
|-------------|-------------|----------|-------|
| Selection | Light tap | 10ms | Subtle acknowledgment |
| Valid Swap | Light impact | 20ms | Confirmation |
| Invalid Swap | Error | 50ms | Three-pulse pattern |
| Match (3) | Light impact | 20ms | Basic match feedback |
| Match (4+) | Medium impact | 30ms | Enhanced for special matches |
| Special Activation | Heavy impact | 40ms | Significant game event |
| Level Complete | Success | 100ms | Celebration pattern |

### Audio Feedback

- **Selection**: Light 'click' sound (10ms)
- **Swap**: Sliding sound matching direction (100ms)
- **Match**: Chime sound scaled by match size (200-500ms)
- **Cascade**: Sequential notes forming pleasant scale
- **Special Activation**: Distinctive activation sound by type

## Touch Accommodations

### Accessibility Options

- **Touch Accommodation**: Integration with iOS touch accommodations
- **Hold Duration**: Adjustable duration for touch recognition (100-500ms)
- **Ignore Repeat**: Option to ignore repeated touches within timeframe
- **Tap Assistance**: Hold duration adjustment for tap recognition

### Alternative Control Schemes

- **Tap-Only Mode**: Eliminates need for swipe gestures
- **Drag Mode**: Touch and drag instead of swipe
- **Auto-Select**: Automatically selects best move after inactivity period

## Testing Methodology

### Touch Accuracy Testing

- **Grid Overlay Test**: Touch accuracy across 9-point grid on screen
- **Rapid Input Test**: Recognition rate during fast gameplay
- **Edge Case Testing**: Screen protectors, wet fingers, different finger sizes

### Responsiveness Testing

- **Frame Rate Monitoring**: Maintain 60fps during all interactions
- **Input Latency**: Target <50ms from touch to visual response
- **Animation Timing**: Consistent timing across device generations

### Device-Specific Considerations

| Device | Screen Size | Touch Considerations |
|--------|-------------|----------------------|
| iPhone SE | 4.7" | Smaller touch targets, tighter grid |
| iPhone 13 | 6.1" | Standard reference design |
| iPhone Pro Max | 6.7" | Larger touch targets, thumb reach considerations |

## Implementation Guidelines

### Touch Event Handling

```javascript
// Pseudocode for swipe recognition
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  touchStartTime = Date.now();
}

function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const touchEndTime = Date.now();
  
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const duration = touchEndTime - touchStartTime;
  const velocity = distance / duration;
  
  if (duration > 300 || distance < 10 || velocity < 50 || velocity > 500) {
    return; // Not a valid swipe
  }
  
  // Determine direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    const direction = deltaX > 0 ? 'right' : 'left';
    attemptSwap(selectedCell, direction);
  } else {
    // Vertical swipe
    const direction = deltaY > 0 ? 'down' : 'up';
    attemptSwap(selectedCell, direction);
  }
}
```

### Performance Optimization

- **Touch Event Throttling**: Limit to 60fps (16ms)
- **Passive Event Listeners**: Use passive listeners for scroll events
- **Hardware Acceleration**: Use CSS transforms for animations
- **Touch Prediction**: Implement basic touch prediction for responsiveness

## Playtesting Focus Areas

- **Swipe Accuracy**: Test recognition rate across different user behaviors
- **Fatigue Testing**: Extended play sessions to test for touch fatigue
- **Contextual Testing**: Testing while walking, on transit, etc.
- **Cross-Generation Testing**: Verify consistent experience across iPhone generations
