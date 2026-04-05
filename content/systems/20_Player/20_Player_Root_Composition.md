---
title: "Player Root Composition"
summary: "The Player class acts as a hub that caches movement/aim/weapons/abilities/visuals and owns core runtime components like PlayerHealth + Ragdoll."
order: 20
status: "In Development"
tags: ["Player", "Architecture", "Composition", "Combat", "Health"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`Player` is a hub component that:
- caches references to the player subsystems
- provides a few shared utilities (death/reset, ragdoll toggling)
- holds the single `InputSystem_Actions` instance

It is intentionally not overloaded with gameplay logic; most behavior lives in dedicated components.

## 🎯 Purpose
- Provide a stable “composition root” for the player.
- Centralize shared references so other systems don’t do repeated `GetComponent` calls.
- Coordinate global lifecycle actions (death/reset).

## 📦 Core Responsibilities
**Does**
- Own and expose:
  - `PlayerMovement`
  - `PlayerAim`
  - `PlayerWeaponController`
  - `PlayerWeaponVisuals`
  - `PlayerAbilityController` (abilities framework)
  - `PlayerHealth` (HP)
  - `Ragdoll` (physics death / impact reactions)
  - `InputSystem_Actions`
- Initialize input actions and enable gameplay action maps.
- Subscribe to `PlayerHealth.Died` and trigger death behavior.

**Does NOT**
- Implement damage routing (that’s hitboxes + health).
- Implement weapon rules (that’s `Weapon` + `PlayerWeaponController`).
- Implement aim math (that’s `PlayerAim`).

## 🧱 Key Components
- `Player` (`Scripts/Player/Player.cs`)
- `PlayerHealth` (`Scripts/Managers/Components/PlayerHealth.cs`)
- `Ragdoll` (`Scripts/Ragdoll.cs`)
- Player subsystems (movement/aim/weapons/abilities)

Related
- `PlayerHitBox` (`Scripts/Player/PlayerHitBox.cs`)  
  Hitboxes route damage into `PlayerHealth`.

## 🔄 Execution Flow
1. `Awake()`
   - Creates `InputSystem_Actions`
   - Enables the default action map
2. `Start()`
   - Caches subsystem references
   - Hooks health death event
3. On death:
   - Enables ragdoll
   - Triggers any player death effects (as implemented)

## 🔗 Dependencies
- Unity Input System generated actions (`InputSystem_Actions`)
- Health + ragdoll components
- Subsystems under `Scripts/Player/...`

## ⚠ Constraints & Assumptions
- Hitboxes must be set up correctly (Player root collider is not expected to be damageable; body part hitboxes are).
- `Player` assumes a single local player for now.

## ✅ Development Status
In Development
