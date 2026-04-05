---
title: "Enemy Core Composition"
summary: "Base Enemy architecture shared by melee, ranged, and boss enemies: CombatTarget acquisition, perception + target memory, Health integration, friendly-fire layer rules, pooling reset, and animation-event relays."
order: 50
status: "In Development"
tags: ["Enemy", "AI", "Combat", "Pooling", "Perception", "Health"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`Enemy` is the shared base class for all enemy archetypes (currently: `EnemyMelee`, `EnemyRange`, `EnemyBoss`).

It provides shared infrastructure:
- **Target acquisition** using the `CombatTarget.ActiveTargets` registry
- **Perception + target memory** via the required `EnemyPerception` component
- **Health + death lifecycle** via `EnemyHealth`
- Friendly-fire filtering via layer masks + `GameManager.FriendlyFireEnabled`
- Navigation helpers (`NavMeshAgent`, steering / facing helpers)
- Animation-event relays through `EnemyAnimationEvents`
- Pool-safe reset contract (`IPoolable` → `OnSpawnedFromPool()`)

Archetypes extend this base with their own **state machine** and attack implementations.

## 🎯 Purpose
Keep common enemy concerns in one place so each archetype can focus on its behavior loop without duplicating:
- “who am I fighting?”
- “can I see them / do I remember them?”
- “how do I take damage and die?”
- “how do I reset when pooled?”

## 📦 Core Responsibilities

### Targeting
- Chooses a `CombatTarget` (closest active target).
- Provides helper accessors:
  - `TargetRoot` and `TargetAimPoint` via perception/target.
- Feeds the target into `EnemyPerception.SetTarget(...)`.

### Perception + battle mode
- Ticks `EnemyPerception` and uses it to decide battle engagement:
  - `CanSeeTarget()`
  - `HasRecentTargetKnowledge()`
  - `GetKnownTargetPosition()`
- Owns battle-mode gates:
  - `EnterBattleMode()` / `ExitBattleMode()`

### Damage + health integration
- Owns an `EnemyHealth` component.
- Provides two related entry points:
  - `TakeDamage(DamageInfo info)` → applies damage to health
  - `GetHit(DamageInfo info)` → “reaction hook” (enter battle, refresh knowledge, apply impact feel)
- Subscribes to `EnemyHealth.Died` and runs the death pipeline.

### Shared combat helpers
- Friendly-fire helpers:
  - `FriendlyFireEnabled()`
  - `IsFriendly(GameObject target)`
- Factory for consistent damage payloads:
  - `CreateDamageInfo(amount, hitPoint, attackType, impactForce)`

### Pooling reset
- `OnSpawnedFromPool()` restores baseline state and visuals for reuse.

## 🧱 Key Components
- `Enemy` (`Scripts/Enemy/Enemy.cs`)
- `EnemyPerception` (`Scripts/Enemy/Perception/EnemyPerception.cs`)
- `EnemyHealth` (`Scripts/Managers/Components/EnemyHealth.cs`)
- `EnemyAnimationEvents` (`Scripts/Enemy/EnemyAnimationEvents.cs`)
- Death presentation:
  - `Ragdoll` (`Scripts/Ragdoll.cs`)
  - `EnemyDeathDissolve` (`Scripts/Enemy/EnemyDeathDissolve.cs`)

## 🔄 Execution Flow (high level)
1. `Start()`
   - Finds patrol points
   - Ensures perception exists
2. `Update()`
   - Select target from `CombatTarget.ActiveTargets`
   - Tick perception
   - Enter/exit battle mode as needed
   - (Archetypes tick their own state machine on top)
3. Damage
   - Hitboxes call `Enemy.TakeDamage(DamageInfo)`
   - Projectiles may also call `Enemy.GetHit(DamageInfo)` to trigger reactions
4. Death
   - `EnemyHealth` reaches 0 → `Died` event → base death pipeline

## 🔗 Dependencies
Depends On
- Unity: `NavMeshAgent`, `Animator`, physics
- `EnemyPerception` (required)
- `EnemyHealth` (required)

Used By
- `EnemyMelee`, `EnemyRange`, `EnemyBoss`
- Damage sources:
  - `EnemyHitBox` forwards into `TakeDamage`
  - `Bullet`/grenades/abilities may call `GetHit` for reactions

## ⚠ Constraints & Assumptions
- Targeting assumes the player (and any future actors) register a `CombatTarget`.
- Friendly-fire is layer-mask based. Your Unity Layer Collision Matrix must match the masks you pass into bullets and configure on enemies.
- Damage scaling happens via `DamageInfo` + hitboxes (not via “health decrement by 1” logic).

## ✅ Development Status
In Development
