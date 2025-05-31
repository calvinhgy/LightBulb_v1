# 五彩灯泡 (Colorful Light Bulbs) - Asset Requirements

## Visual Assets

### Light Bulb Sprites

#### Base Bulbs
| Asset Name | Description | Size | Format |
|------------|-------------|------|--------|
| `bulb_red.png` | Red light bulb | 64x64px | PNG with transparency |
| `bulb_yellow.png` | Yellow light bulb | 64x64px | PNG with transparency |
| `bulb_blue.png` | Blue light bulb | 64x64px | PNG with transparency |
| `bulb_green.png` | Green light bulb | 64x64px | PNG with transparency |

#### Bulb States
| Asset Name | Description | Size | Format |
|------------|-------------|------|--------|
| `bulb_red_selected.png` | Selected red bulb | 64x64px | PNG with transparency |
| `bulb_yellow_selected.png` | Selected yellow bulb | 64x64px | PNG with transparency |
| `bulb_blue_selected.png` | Selected blue bulb | 64x64px | PNG with transparency |
| `bulb_green_selected.png` | Selected green bulb | 64x64px | PNG with transparency |
| `bulb_red_matching.png` | Matching red bulb | 64x64px | PNG with transparency |
| `bulb_yellow_matching.png` | Matching yellow bulb | 64x64px | PNG with transparency |
| `bulb_blue_matching.png` | Matching blue bulb | 64x64px | PNG with transparency |
| `bulb_green_matching.png` | Matching green bulb | 64x64px | PNG with transparency |

#### Animation Frames
Each bulb color needs animation frames for:
- Idle animation (subtle glow, 4 frames)
- Match animation (flash and disappear, 6 frames)
- Falling animation (4 frames)

### UI Elements

#### Buttons
| Asset Name | Description | Size | Format |
|------------|-------------|------|--------|
| `btn_play.png` | Play button | 200x80px | PNG with transparency |
| `btn_play_hover.png` | Play button (hover state) | 200x80px | PNG with transparency |
| `btn_pause.png` | Pause button | 60x60px | PNG with transparency |
| `btn_resume.png` | Resume button | 200x80px | PNG with transparency |
| `btn_menu.png` | Menu button | 200x80px | PNG with transparency |
| `btn_restart.png` | Restart button | 200x80px | PNG with transparency |
| `btn_next.png` | Next level button | 200x80px | PNG with transparency |
| `btn_settings.png` | Settings button | 60x60px | PNG with transparency |

#### HUD Elements
| Asset Name | Description | Size | Format |
|------------|-------------|------|--------|
| `panel_score.png` | Score panel background | 200x100px | PNG with transparency |
| `panel_time.png` | Time panel background | 200x100px | PNG with transparency |
| `panel_level.png` | Level panel background | 200x100px | PNG with transparency |
| `star_empty.png` | Empty star for level rating | 64x64px | PNG with transparency |
| `star_filled.png` | Filled star for level rating | 64x64px | PNG with transparency |
| `icon_timer.png` | Timer icon | 32x32px | PNG with transparency |
| `icon_score.png` | Score icon | 32x32px | PNG with transparency |

#### Screens
| Asset Name | Description | Size | Format |
|------------|-------------|------|--------|
| `bg_menu.png` | Main menu background | 1920x1080px | JPEG/PNG |
| `bg_game.png` | Game background | 1920x1080px | JPEG/PNG |
| `panel_pause.png` | Pause menu panel | 600x800px | PNG with transparency |
| `panel_level_complete.png` | Level complete panel | 800x600px | PNG with transparency |
| `panel_game_over.png` | Game over panel | 800x600px | PNG with transparency |
| `logo.png` | Game logo | 600x300px | PNG with transparency |

### Effects
| Asset Name | Description | Size | Format |
|------------|-------------|------|--------|
| `effect_match.png` | Match effect sprite sheet | 256x256px | PNG with transparency |
| `effect_combo.png` | Combo effect sprite sheet | 256x256px | PNG with transparency |
| `effect_swap.png` | Swap effect sprite sheet | 128x128px | PNG with transparency |
| `particle_glow.png` | Glow particle | 32x32px | PNG with transparency |

## Audio Assets

### Music
| Asset Name | Description | Duration | Format |
|------------|-------------|----------|--------|
| `music_menu.mp3` | Main menu music | 1-2 minutes (looping) | MP3/OGG |
| `music_gameplay.mp3` | Gameplay background music | 2-3 minutes (looping) | MP3/OGG |
| `music_level_complete.mp3` | Level complete jingle | 5-10 seconds | MP3/OGG |
| `music_game_over.mp3` | Game over jingle | 3-5 seconds | MP3/OGG |

### Sound Effects

#### UI Sounds
| Asset Name | Description | Duration | Format |
|------------|-------------|----------|--------|
| `sfx_button_click.mp3` | Button click sound | <1 second | MP3/OGG |
| `sfx_button_hover.mp3` | Button hover sound | <1 second | MP3/OGG |
| `sfx_menu_open.mp3` | Menu opening sound | <1 second | MP3/OGG |
| `sfx_menu_close.mp3` | Menu closing sound | <1 second | MP3/OGG |

#### Gameplay Sounds
| Asset Name | Description | Duration | Format |
|------------|-------------|----------|--------|
| `sfx_bulb_select.mp3` | Bulb selection sound | <1 second | MP3/OGG |
| `sfx_bulb_swap.mp3` | Bulb swap sound | <1 second | MP3/OGG |
| `sfx_invalid_move.mp3` | Invalid move sound | <1 second | MP3/OGG |
| `sfx_match_3.mp3` | 3-bulb match sound | <1 second | MP3/OGG |
| `sfx_match_4.mp3` | 4-bulb match sound | <1 second | MP3/OGG |
| `sfx_match_5plus.mp3` | 5+ bulb match sound | <1 second | MP3/OGG |
| `sfx_combo_1.mp3` | First combo in chain | <1 second | MP3/OGG |
| `sfx_combo_2.mp3` | Second combo in chain | <1 second | MP3/OGG |
| `sfx_combo_3.mp3` | Third combo in chain | <1 second | MP3/OGG |
| `sfx_combo_4plus.mp3` | Fourth+ combo in chain | <1 second | MP3/OGG |
| `sfx_bulb_fall.mp3` | Bulbs falling sound | <1 second | MP3/OGG |
| `sfx_level_start.mp3` | Level start sound | <1 second | MP3/OGG |
| `sfx_time_warning.mp3` | Time running out warning | <1 second | MP3/OGG |

## Font Requirements

| Font Name | Usage | Styles |
|-----------|-------|--------|
| Primary Game Font | Game title, headers, buttons | Regular, Bold |
| Secondary Game Font | Score, time, instructions | Regular, Bold, Italic |

Font characteristics:
- Clear and readable at various sizes
- Supports multiple languages (especially Chinese characters for the game title)
- Playful but not childish
- Works well with the light bulb theme

## Asset Style Guide

### Color Palette

#### Primary Colors (for bulbs)
- Red: #FF3A3A
- Yellow: #FFD83A
- Blue: #3A8CFF
- Green: #3AFF5C

#### UI Colors
- Background Dark: #1A1A2E
- Background Light: #2A2A4E
- Accent Color: #FFB344
- Text Light: #FFFFFF
- Text Dark: #333333

### Visual Style Guidelines

1. **Light Bulbs**
   - Clear glass bulb shape with colored glow
   - Distinctive silhouette for each color
   - Soft inner glow effect
   - Slight reflection/highlight on glass surface

2. **UI Elements**
   - Rounded corners on panels and buttons
   - Subtle gradient backgrounds
   - Light glow effects around interactive elements
   - Semi-transparent panels over game board

3. **Animations**
   - Smooth, fluid movements
   - Elastic/bouncy feel for swaps and falls
   - Bright particle effects for matches
   - Subtle idle animations for bulbs (gentle pulsing glow)

4. **Overall Aesthetic**
   - Clean and modern
   - Bright and cheerful
   - Slightly stylized (not photorealistic)
   - Consistent light/glow theme throughout

## Asset Delivery Specifications

- All sprite assets should be delivered as individual PNG files and as sprite sheets
- Audio files should be delivered in both MP3 and OGG formats
- Font files should include web-compatible formats (WOFF, WOFF2)
- All assets should be optimized for web delivery
- Source files (PSD, AI, etc.) should be provided for future modifications
