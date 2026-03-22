---
title: "Player Movement"
summary: "CharacterController-based locomotion with sprint, gravity, aim-facing rotation, and ability movement-lock support."
order: 21
status: "In Development"
tags: ["Player", "Movement", "Input", "Abilities"]
last_updated: "2026-03-20"
---

## 🧭 Overview
Movement is implemented with Unity’s `CharacterController` and driven by input actions:
- `Move` (Vector2)
- `Sprint` (press/hold)

Rotation is aim-driven: the player turns to face the world point returned by `PlayerAim.GetMouseHitInfo()`.

This system also exposes **ability support hooks** used by the Player Abilities system:
- Movement can be *locked* so an ability can take over motion (e.g., dive roll).
- Direction helpers allow abilities to choose between **facing-based** or **input-based** direction policies.

## 🎯 Purpose
Provide a robust locomotion base for a top-down shooter:
- Responsive movement
- Consistent gravity handling
- Smooth aim-relative rotation
- Animator parameters for blend trees

## 🧠 Design Philosophy
- Movement and rotation are independent but coordinated:
  - Translation comes from WASD input
  - Rotation comes from aim (mouse world point)
- Keep the logic deterministic and animation-friendly.

Trade-off: movement is currently “direct” (no acceleration curves), which is simpler but less physically nuanced.

## 📦 Core Responsibilities
**Does**
- Read movement input and translate via `CharacterController.Move()`.
- Apply custom gravity using a `verticalVelocity` accumulator.
- Rotate the player toward aim point (using `Quaternion.Slerp`).
- Drive animator parameters:
  - `xVelocity`, `zVelocity`
  - `isRunning`
- Provide movement-lock + direction helpers for abilities:
  - `SetMovementLocked(bool)`
  - `GetFacingDirection()`
  - `GetMoveDirectionOrFacing()`

**Does NOT**
- Handle weapon firing, interaction, or camera behavior.
- Implement ability logic (roll is implemented in `PlayerRollAbility`).

## 🧱 Key Components
Classes
- `PlayerMovement` (`code/Player/PlayerMovement.cs`)
  - Owns movement input, speed selection, gravity, rotation, animator updates.
  - Exposes movement-lock helpers used by `PlayerRollAbility`.

Unity components (required)
- `CharacterController`
- `Animator` (in children)

## 🔄 Execution Flow
1. `Start()`
   - Cache `Player`, `CharacterController`, `Animator`
   - Set initial speed to walk
   - Subscribe to input actions
2. `Update()`
   - If movement is **not locked**:
     - `ApplyMovement()`
     - `ApplyRotation()`
   - Always:
     - `ApplyGravity()`
     - `UpdateAnimator()` updates blend parameters (forces idle params when locked)

## 🔗 Dependencies
**Depends On**
- `Player` for `controls` and `aim`.
- Unity: `CharacterController`, `Animator`.

**Integrates With**
- `PlayerAbilityController` and concrete abilities (currently: `PlayerRollAbility`).

**Used By**
- `PlayerAim` reads `player.movement.moveInput` to influence camera target distance.
- `PlayerRollAbility` locks locomotion and applies its own motion using `CharacterController.Move()`.

## ⚠ Constraints & Assumptions
- Gravity uses a small grounding value (`verticalVelocity = -0.5f` when grounded) for stability.
- Assumes `PlayerAim.GetMouseHitInfo()` returns a usable point.
- Input events are subscribed in `Start()` and unsubscribed in `OnDestroy()` to avoid duplicate subscriptions.

## 📈 Scalability & Extensibility
- Add acceleration/deceleration without changing the input contract.
- Add “strafing vs forward locomotion” animation support by extending animator parameters.
- Add “movement modifiers” (slow, knockback) by adjusting `speed` and movementDirection scaling.
- Add new abilities by reusing the movement lock API (stun, dash, knockback, cutscene lock).

## ✅ Development Status
In Development

## 📝 Notes
Related devlogs:
- Devlog 01 – Input & Player Controller Setup
- Devlog 02 – Player Rigging & Locomotion / Combat Animations

Related system doc:
- Player Abilities (`Player/24_Player_Abilities.md`)
