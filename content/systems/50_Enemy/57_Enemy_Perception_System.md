---
title: "Enemy Perception System"
summary: "Shared perception layer for enemies: FOV + LOS checks, target visibility, and short-term target memory (known position + timers)."
order: 57
status: "In Development"
tags: ["Enemy", "AI", "Perception", "LOS", "Memory"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`EnemyPerception` is a reusable component that provides enemies with a believable awareness model.

Instead of relying only on distance checks, enemies reason about:
- **Can I see the target right now?** (FOV + line-of-sight)
- **Do I remember where the target was recently?** (known position + timer)

This makes combat behavior more stable and readable:
- enemies don’t instantly “forget” you when you break LOS for a moment
- enemies can still throw a grenade or advance toward your last known position

## 🎯 Purpose
- Centralize all sight/awareness logic in one component shared by enemy archetypes.
- Expose simple query methods to state machines.

## 🧱 Key Components
- `EnemyPerception` (`Scripts/Enemy/Perception/EnemyPerception.cs`)
- `CombatTarget` (`Scripts/Managers/Components/CombatTarget.cs`)
- Used by `Enemy` base and enemy state machines.

## 📦 Responsibilities
**Does**
- Track a current `CombatTarget` (Root + AimPoint).
- Evaluate:
  - `IsTargetVisible`
  - `TargetInFOV` (angle check)
  - LOS raycast using occlusion mask
- Store knowledge:
  - `KnownTargetPosition`
  - `lastSeenTime` / knowledge timeout
- Provide helper queries:
  - `CanSeeTarget()`
  - `HasRecentTargetKnowledge()`
  - `GetKnownTargetPosition()`

**Does NOT**
- Choose which target to follow (base `Enemy` selects the closest `CombatTarget`).
- Decide which combat state to enter (state machine owns decisions).

## 🔄 Execution Flow
1. `Enemy` selects the closest valid `CombatTarget` from `CombatTarget.ActiveTargets`.
2. `Enemy` calls `perception.SetTarget(combatTarget)`.
3. Each tick, perception evaluates FOV + LOS:
   - If visible → updates known position + last seen time
   - If not visible → retains last known position until timeout
4. State machine reads perception outputs to decide:
   - battle vs idle
   - advance vs search vs take cover
   - grenade throw using recent knowledge window

## 🔗 Dependencies
- Accurate layer masks:
  - occlusion/visibility checks use layer masks (configured in perception)
- Targets must provide a valid `AimPoint` (for aiming and LOS).

## ✅ Development Status
In Development
