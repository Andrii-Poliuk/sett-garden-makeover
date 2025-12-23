# Garden Makeover

A 3D farming simulation game built with Three.js and PixiJS where players manage crops, livestock, and land to defeat the ever-looming rent.

**[Play the game](https://andrii-poliuk.github.io/garden-makeover/)**

## Tech Stack

- **3D Rendering**: Three.js
- **2D UI**: PixiJS
- **Animations**: GSAP
- **Particles**: three.quarks
- **Build Tool**: Vite
- **Language**: TypeScript

## Architecture Overview

The game uses a dual-renderer architecture:

- **Three.js** handles 3D scene rendering (farm, objects, lighting)
- **PixiJS** handles 2D UI overlay (menus, popups, HUD)

## Class Hierarchy

### Game Core

```
Game (Singleton)
├── GameScene          # Three.js scene, camera, lights
├── UIScene            # PixiJS stage, menus, popups
├── DayNightController # Controls lights for Day/night cycle
├── GameLevel          # Base class for levels
│   ├── TutorialLevel
│   └── MainLevel
└── CameraPosition     # Setup to configure camera and move cinematic camera
```

### 3D Objects (Three.js Object3D)

```
Object3D
├── MultiStageObject         # Crops with growth stages
│   ├── Corn
│   ├── Tomato
│   ├── Grape
│   └── Strawberry
├── AnimatedObject           # Animated characters with mixers
│   ├── Chicken
│   ├── Cow
│   └── Sheep
├── PlaceableObject          # Land tiles with interactive areas
│   ├── Ground               # Cropland
│   └── Fence                # Cattle pen
├── InteractiveArea          # Clickable 3D regions
├── ObjectHighlight          # Transparent placement preview
└── SoundSource              # Positional audio emitter
```

### UI Components (PixiJS Container)

```
Container
├── MenuBase                 # Animated slide-in menus
│   ├── HomeMenu
│   ├── CropPlacementMenu
│   ├── CattlePlacementMenu
│   └── LandPlacementMenu
├── PopupBase                # Modal dialog base
│   ├── DialogPopup
│   ├── ConfirmationPopup
│   ├── GameOverPopup
│   └── LoadingPopup
├── GameControls             # HUD (money display, skip day)
├── SpriteButton             # Interactive button with icon
└── EconomyHint              # Cost/income labels on buttons
```

### Utilities

```
MeshLoader           # GLB model loading and caching
RaycastManager       # Mouse/touch hit test for Interactive Areas
PixiAssetsLoader     # Texture and sound loading
FloatingText         # Animated income/cost popups, uses Pixi
SpriteParticleEffect # Particle systems (leaves, smoke), uses three-quarks
```

## Composition Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          Game                               │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐    │
│  │  GameScene  │  │   UIScene   │  │ DayNightController│    │
│  │  ─────────  │  │  ─────────  │  └───────────────────┘    │
│  │  - Scene    │  │  - Stage    │                           │
│  │  - Camera   │  │  - Menus    │  ┌──────────────────┐     │
│  │  - Lights   │  │  - Popups   │  │   CurrentLevel   │     │
│  │  - Renderer │  │  - Controls │  │  (GameLevel)     │     │
│  └─────────────┘  └─────────────┘  └──────────────────┘     │
│                                                             │
│  Collections:                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  crops[] │ │ cattle[] │ │ grounds[]│ │ fences[] │        │
│  │MultiStage│ │ Animated │ │ Placeable│ │ Placeable│        │
│  │ Object   │ │  Object  │ │  Object  │ │  Object  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    MultiStageObject                         │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │ stage1Model    │  │ particlesEffect│  │interactiveArea│  │
│  │ stage2Model    │  │ (SpriteParticle│  │(InteractiveA.)│  │
│  │ stage3Model    │  │  Effect)       │  │               │  │
│  └────────────────┘  └────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     AnimatedObject                          │
│  ┌─────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ AnimationMixer  │  │ particlesEffect│  │  soundSource │  │
│  │ animationActions│  │ (SpriteParticle│  │ (SoundSource)│  │
│  │ activeAction    │  │  Effect)       │  │              │  │
│  └─────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     PlaceableObject                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              interactiveAreas[]                      │   │
│  │              (InteractiveArea)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        UIScene                              │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌─────────────┐   │
│  │ HomeMenu │ │ CropMenu │ │ CattleMenu │ │  LandMenu   │   │
│  └──────────┘ └──────────┘ └────────────┘ └─────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐  │
│  │DialogPop │ │ConfirmPop│ │GameOverPop │ │ LoadingPopup │  │
│  └──────────┘ └──────────┘ └────────────┘ └──────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    GameControls                       │  │
│  │  ┌─────────────┐  ┌─────────────┐                     │  │
│  │  │MoneyDisplay │  │SkipDayButton│                     │  │
│  │  └─────────────┘  └─────────────┘                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Game Flow

1. **Loading**: `LoadingPopup` shows while assets load via `MeshLoader` and `PixiAssetsLoader`
2. **Tutorial**: `TutorialLevel` guides player through basic mechanics
3. **Main Game**: `MainLevel` handles core gameplay loop
4. **Day Cycle**: Plant crops → Skip day → Crops grow → Collect harvest → Pay rent

## Key Systems

### Day/Night Cycle

`DayNightController` interpolates lighting, sky color, and shadow positions between time-of-day presets (morning, day, evening, night).

### Object Interaction

`InteractiveArea` creates clickable 3D regions. `RaycastManager` converts screen touches to 3D raycasts. `ObjectHighlight` shows transparent previews during placement.

### Economy

`MoneyCost` defines all prices and incomes. `EconomyHint` displays cost/income on menu buttons. `FloatingText` shows animated currency changes.

## Project Structure

```
src/
├── Game/
│   ├── Game.ts              # Main singleton, object factory
│   ├── GameScene.ts         # Three.js setup
│   ├── GameLevel.ts         # Level base class
│   ├── MainLevel.ts         # Main gameplay
│   ├── TutorialLevel.ts     # Tutorial sequence
│   ├── DayNightController.ts
│   ├── CameraPosition.ts
│   ├── MoneyCost.ts
│   ├── PixiAssetsLoader.ts
│   └── RaycastManager.ts
├── Objects/
│   ├── MultiStageObject.ts  # Crop base
│   ├── AnimatedObject.ts    # Animal base
│   ├── PlaceableObject.ts   # Land base
│   ├── InteractiveArea.ts
│   ├── MeshLoader.ts
│   └── [Corn|Tomato|...].ts
├── UI/
│   ├── UIScene.ts
│   ├── SpriteButton.ts
│   ├── EconomyHint.ts
│   ├── Menu/
│   │   └── [HomeMenu|...].ts
│   └── Popups/
│       └── [DialogPopup|...].ts
├── Particles/
│   ├── FloatingText.ts
│   └── SpriteParticleEffect.ts
└── main.ts
```

## Getting Started

```bash
npm install
npm run dev
```

## License

MIT
