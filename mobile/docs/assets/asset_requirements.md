# Asset Requirements - LightBulb Mobile

## Overview

This document outlines the detailed specifications for all visual and audio assets required for the LightBulb Mobile game. These specifications ensure consistency, optimal performance, and high-quality presentation across all supported iPhone devices.

## Visual Assets

### Light Bulbs

#### Regular Light Bulbs

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Red Bulb | Red light bulb with glow effect | 128x128px | PNG with transparency | Normal, Selected, Matched |
| Yellow Bulb | Yellow light bulb with glow effect | 128x128px | PNG with transparency | Normal, Selected, Matched |
| Blue Bulb | Blue light bulb with glow effect | 128x128px | PNG with transparency | Normal, Selected, Matched |
| Green Bulb | Green light bulb with glow effect | 128x128px | PNG with transparency | Normal, Selected, Matched |

**Technical Requirements:**
- Center point of bulb should be exactly at center of image (64x64px)
- Glow effect should extend 16px from edge of bulb
- Transparent background
- Color-blind patterns should be included as separate layer
- 2x and 3x resolution versions required for different device densities

**Animation States:**
- Idle: Subtle pulsing glow (30% opacity variation)
- Selected: Brighter glow (100% opacity)
- Matched: Flash effect before disappearing

#### Special Light Bulbs

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Line Bulb | Striped bulb with directional indicators | 128x128px | PNG with transparency | Red, Yellow, Blue, Green |
| Bomb Bulb | Bulb with explosion pattern | 128x128px | PNG with transparency | Red, Yellow, Blue, Green |
| Rainbow Bulb | Multi-colored bulb with rainbow effect | 128x128px | PNG with transparency | Single variant |

**Technical Requirements:**
- Same base specifications as regular bulbs
- Special effects should be clearly visible but not obscure the base color
- Animation states should be more pronounced than regular bulbs

### Game Board

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Board Background | Dark textured background for game grid | 1080x1920px | JPEG | Light, Dark |
| Grid Cell | Individual cell for light bulb placement | 128x128px | PNG with transparency | Normal, Highlighted |
| Grid Border | Decorative border around game grid | Scalable | SVG | Light, Dark |
| Obstacle | Blocking element for special levels | 128x128px | PNG with transparency | Multiple types |

**Technical Requirements:**
- Background should be tileable for different screen sizes
- Grid cells should have subtle inner shadow
- Border should be scalable for different grid sizes
- All elements should maintain theme consistency

### UI Elements

#### Buttons

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Primary Button | Main action buttons | 300x100px | PNG with transparency | Normal, Pressed, Disabled |
| Secondary Button | Alternative action buttons | 240x80px | PNG with transparency | Normal, Pressed, Disabled |
| Icon Button | Square buttons with icons | 100x100px | PNG with transparency | Multiple icons |
| Back Button | Navigation button | 80x80px | PNG with transparency | Normal, Pressed |

**Technical Requirements:**
- Minimum touch target area of 44x44pt
- Clear visual states for all interaction states
- Consistent styling across button types
- Text areas should accommodate different text lengths

#### Menus and Overlays

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Main Menu Background | Themed background for main menu | 1080x1920px | JPEG | Single variant |
| Level Select Background | Background for level selection screen | 1080x1920px | JPEG | Single variant |
| Dialog Box | Container for messages and prompts | 800x600px | PNG with transparency | Light, Dark |
| Level Complete Overlay | Celebration screen after level completion | 1080x1920px | PNG with transparency | 1-Star, 2-Star, 3-Star |

**Technical Requirements:**
- Backgrounds should accommodate different screen aspect ratios
- Dialog boxes should be scalable for different content lengths
- Overlays should have semi-transparent background
- All text areas should support dynamic text

#### HUD Elements

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Score Display | Container for score information | 400x100px | PNG with transparency | Single variant |
| Move Counter | Display for remaining moves | 200x100px | PNG with transparency | Normal, Low (red) |
| Timer | Display for remaining time | 200x100px | PNG with transparency | Normal, Low (red) |
| Objective Indicator | Shows level objectives | 400x150px | PNG with transparency | Multiple types |

**Technical Requirements:**
- HUD elements should be positioned for one-handed play
- Elements should be semi-transparent to not obstruct gameplay
- Clear visual hierarchy between elements
- Support for different text lengths

### Icons and Symbols

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Game Icon | App icon for home screen | 1024x1024px | PNG | Single variant |
| Settings Icon | Gear or cog symbol | 64x64px | PNG with transparency | Normal, Selected |
| Sound Icons | Audio control symbols | 64x64px | PNG with transparency | On, Off, Multiple volumes |
| Star Icon | Level rating indicator | 128x128px | PNG with transparency | Empty, Filled, Animated |

**Technical Requirements:**
- App icon should follow iOS icon guidelines
- All icons should be recognizable at small sizes
- Consistent style across all icons
- Vector sources should be provided for scaling

### Visual Effects

| Asset | Description | Dimensions | Format | Variants |
|-------|-------------|------------|--------|----------|
| Match Explosion | Particle effect for matches | 256x256px | Sprite sheet | Small, Medium, Large |
| Cascade Trail | Visual trail for falling bulbs | 128x512px | PNG sequence | Multiple colors |
| Special Activation | Effects for special bulb activation | 512x512px | Sprite sheet | Line, Bomb, Rainbow |
| Level Complete | Celebration particles and effects | 1080x1920px | Sprite sheet | Bronze, Silver, Gold |

**Technical Requirements:**
- Particle effects should be optimized for mobile performance
- Effects should scale appropriately for different device sizes
- Animation frame rate should be consistent (30fps)
- Effects should not obscure important gameplay elements

## Audio Assets

### Music

| Asset | Description | Duration | Format | Variants |
|-------|-------------|----------|--------|----------|
| Main Theme | Upbeat, engaging theme for main menu | 1-2 minutes | MP3, OGG | Single track with loop point |
| Gameplay Music | Background music during gameplay | 2-3 minutes | MP3, OGG | Multiple tracks for different worlds |
| Victory Theme | Triumphant short theme for level completion | 5-10 seconds | MP3, OGG | Bronze, Silver, Gold variations |
| Game Over Theme | Somber theme for failed level | 5 seconds | MP3, OGG | Single variant |

**Technical Requirements:**
- 44.1kHz sample rate, 128-192kbps bitrate
- Clear loop points for seamless repetition
- Dynamic mixing capability (separable tracks)
- Consistent volume levels across all tracks

### Sound Effects

#### Gameplay Sounds

| Asset | Description | Duration | Format | Variants |
|-------|-------------|----------|--------|----------|
| Bulb Select | Sound when selecting a light bulb | 0.1-0.2 seconds | MP3, OGG | 4 slight variations |
| Bulb Swap | Sound when swapping light bulbs | 0.2-0.3 seconds | MP3, OGG | Valid, Invalid variations |
| Match Sound | Sound when matching 3+ bulbs | 0.3-0.5 seconds | MP3, OGG | 3-Match, 4-Match, 5-Match variations |
| Cascade Sound | Sound for falling bulbs | 0.2-0.4 seconds | MP3, OGG | Multiple variations for chain length |
| Special Activation | Sounds for special bulb activation | 0.5-1.0 seconds | MP3, OGG | Line, Bomb, Rainbow variations |

**Technical Requirements:**
- 44.1kHz sample rate, 128-192kbps bitrate
- Quick attack and decay for responsive feedback
- Layerable for simultaneous events
- Consistent volume levels

#### UI Sounds

| Asset | Description | Duration | Format | Variants |
|-------|-------------|----------|--------|----------|
| Button Press | Sound for UI button interaction | 0.1 seconds | MP3, OGG | Primary, Secondary variations |
| Menu Navigation | Sound when navigating menus | 0.1 seconds | MP3, OGG | Forward, Back variations |
| Level Start | Sound when level begins | 0.5 seconds | MP3, OGG | Single variant |
| Level Complete | Sound for level completion | 1.0-2.0 seconds | MP3, OGG | 1-Star, 2-Star, 3-Star variations |
| Error Sound | Sound for invalid actions | 0.2 seconds | MP3, OGG | Single variant |

**Technical Requirements:**
- 44.1kHz sample rate, 128-192kbps bitrate
- Distinct from gameplay sounds
- Consistent style across UI
- Non-intrusive but clear feedback

#### Ambient Sounds

| Asset | Description | Duration | Format | Variants |
|-------|-------------|----------|--------|----------|
| Background Ambience | Subtle atmospheric sound | 30-60 seconds | MP3, OGG | Multiple themes for different worlds |
| Time Warning | Sound when time is running low | 5 seconds | MP3, OGG | Loopable with increasing intensity |
| Achievement Unlock | Sound when unlocking achievement | 1.0 seconds | MP3, OGG | Single variant |

**Technical Requirements:**
- 44.1kHz sample rate, 128-192kbps bitrate
- Subtle enough to not distract from gameplay
- Loopable without noticeable seams
- Mixable with other game audio

## Asset Delivery Specifications

### File Naming Convention

All assets should follow this naming convention:
```
lb_[category]_[name]_[variant]_[state].[format]
```

Examples:
- `lb_bulb_red_normal.png`
- `lb_bulb_red_selected.png`
- `lb_sfx_match_3.mp3`
- `lb_ui_button_primary_pressed.png`

### File Organization

Assets should be organized in the following directory structure:
```
assets/
├── images/
│   ├── bulbs/
│   ├── board/
│   ├── ui/
│   ├── effects/
│   └── icons/
└── sounds/
    ├── music/
    ├── sfx/
    └── ambient/
```

### Delivery Format

- All source files should be provided in their original format (PSD, AI, etc.)
- All exported assets should be optimized for file size
- Assets should be provided in all required resolutions (1x, 2x, 3x)
- Audio assets should be provided in both MP3 and OGG formats
- A complete asset manifest should be included

## Asset Optimization Guidelines

### Image Optimization

- PNG files should be compressed using pngquant or similar tool
- JPEG quality should be set to 85% for optimal size/quality balance
- SVG files should be optimized to remove unnecessary paths and metadata
- Sprite sheets should be efficiently packed to minimize empty space

### Audio Optimization

- Audio files should be compressed to appropriate bitrates (128-192kbps)
- Short sound effects should be consolidated into audio sprites where appropriate
- Longer tracks should have streaming capability
- Audio files should be properly trimmed to remove silence

## Accessibility Considerations

### Color Blind Support

- Each colored light bulb should have a distinct pattern or symbol
- Color combinations should be tested against common color vision deficiencies
- Critical information should not rely solely on color

### Visual Clarity

- Text should maintain minimum contrast ratio of 4.5:1
- Interactive elements should be clearly distinguishable
- Visual effects should not overwhelm the core gameplay elements

## Version Control

All assets should be versioned using the following scheme:
```
v[major].[minor].[revision]
```

Example: `v1.2.3`

Changes to assets should be documented in an asset changelog.
