---
title: "Player Abilities"
summary: "Modular, component-based player abilities with a central input router (currently: dive roll)."
order: 24
status: "In Development"
tags: ["Player", "Abilities", "Input", "Architecture"]
last_updated: "2026-03-20"
---

## 🧭 Overview
The project implements player abilities as **modular components** attached to the Player.

The current ability set (implemented in code):
- **Dive Roll** (`PlayerRollAbility`)

Abilities share a common activation contract (cooldown + active state) via `PlayerAbility` and are triggered through a single router component: `PlayerAbilityController`.

## 🎯 Purpose
Provide a scalable foundation where:
- Abilities are **decoupled** from the locomotion/weapon scripts.
- Input wiring is centralized (one place to bind actions like `DiveRoll`).
- Each ability owns its own cooldown, lifecycle, and movement/animation coordination.

## 🧠 Design Philosophy
- **Composition over inheritance chains**: each ability is its own MonoBehaviour.
- **Single responsibility**:
  - `PlayerAbilityController` handles *input → activation*.
  - Each `PlayerAbility` handles *cooldown + ability execution*.
- **Ability-safe locomotion**: abilities coordinate with movement via a small public API (`PlayerMovement.SetMovementLocked`).

Trade-off: The controller caches abilities by **Type**, which assumes at most one ability instance per concrete type on the Player.

## 📦 Core Responsibilities
### `PlayerAbility`
**Does**
- Defines the common ability contract:
  - `CanActivate()` (cooldown + not already active)
  - `Activate()` (abstract)
- Stores shared runtime state:
  - `cooldown`, `lastUseTime`, `isActive`

**Does NOT**
- Subscribe to input.
- Decide which ability is bound to which action.

### `PlayerAbilityController`
**Does**
- Discovers all `PlayerAbility` components on the Player (`GetComponents<PlayerAbility>()`).
- Caches them by concrete type for quick access.
- Subscribes to ability input actions (currently: `Player.controls.Player.DiveRoll.performed`).
- Provides a safe activation API:
  - `TryActivate<T>()` checks presence + `CanActivate()`.

### `PlayerRollAbility`
**Does**
- Implements dive roll:
  - Locks locomotion (`PlayerMovement.SetMovementLocked(true)`).
  - Triggers the roll animation (`Animator.SetTrigger`).
  - Moves the player via `CharacterController.Move()` for a fixed duration.
  - Uses an `AnimationCurve` as a speed multiplier over time.
  - Unlocks locomotion at the end.
- Ensures cleanup safety:
  - `OnDisable()` force-stops the roll and unlocks movement.

## 🧱 Key Components
Classes
- `PlayerAbility` (`code/Player/Abilities/PlayerAbility.cs`)
- `PlayerAbilityController` (`code/Player/Abilities/PlayerAbilityController.cs`)
- `PlayerRollAbility` (`code/Player/Abilities/PlayerRollAbility.cs`)

Key integrations
- `Player` caches `PlayerAbilityController` as `player.abilities`.
- `PlayerMovement` exposes:
  - `SetMovementLocked(bool)`
  - `GetFacingDirection()`
  - `GetMoveDirectionOrFacing()`

## 🔄 Execution Flow
### Ability startup (Dive Roll)
1. Player presses **DiveRoll** input action.
2. `PlayerAbilityController.OnDiveRollPerformed()` executes.
3. Controller calls `TryActivate<PlayerRollAbility>()`.
4. `PlayerRollAbility.CanActivate()` verifies:
   - Cooldown elapsed (`Time.time >= lastUseTime + cooldown`)
   - Not already active
   - Required components exist (`CharacterController`, `PlayerMovement`, `Animator`)
   - Movement is not currently locked
5. `Activate()` starts the roll coroutine.

### Roll runtime
1. Ability sets:
   - `isActive = true`
   - `lastUseTime = Time.time`
2. Locks locomotion: `movement.SetMovementLocked(true)`.
3. Chooses direction policy:
   - Facing-based (default) via `movement.GetFacingDirection()`
   - Or input-based via `movement.GetMoveDirectionOrFacing()` if `useMoveInputDirection` is enabled.
4. Each frame during `rollDuration`:
   - Evaluate curve multiplier at normalized time
   - Move controller: `controller.Move(direction * rollSpeed * curve * dt)`
5. Ends roll:
   - Unlock movement
   - `isActive = false`

## 🔗 Dependencies
**Depends On**
- `Player` for access to `controls` (input actions instance).
- `CharacterController` for movement.
- `PlayerMovement` for movement locking + direction helpers.
- `Animator` for triggering the roll animation.

**Used By**
- Any future systems that need to query ability state (e.g., UI, stamina, invulnerability) can read `PlayerAbility.IsActive`.

## ⚠ Constraints & Assumptions
- The controller caches abilities by **concrete type**.
  - If you add two `PlayerRollAbility` components, the last one cached will overwrite the first.
- Abilities assume they live on the same GameObject as `Player`.
- `PlayerAbilityController` subscribes to `DiveRoll` in `Start()` and unsubscribes in `OnDestroy()`.
  - Other older systems may still need to be standardized to this pattern.

## 📈 Scalability & Extensibility
This architecture supports adding more abilities without touching locomotion or combat logic:
- Add a new component inheriting from `PlayerAbility`.
- Add one input binding in `PlayerAbilityController`.
- Reuse `PlayerMovement.SetMovementLocked` (or add more “ability hooks” as needed).

Recommended next extension points (only when implemented):
- Ability UI cooldown display (read `lastUseTime`/`cooldown` via accessors).
- Shared “ability gating” (stamina, status effects) inside `PlayerAbility.CanActivate()` overrides.

## ✅ Development Status
In Development

## 📝 Notes
Related devlogs:
- Devlog 02 – Player Rigging & Locomotion / Combat Animations

Related system docs:
- Player Movement (`Player/21_Player_Movement.md`)
- Input Actions Integration (`Core/11_Input_Actions_Integration.md`)
