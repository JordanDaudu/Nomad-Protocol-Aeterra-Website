---
title: "Enemy Range AI"
summary: "Tactical ranged archetype using perception + cover + ranged FSM (battle/advance/run-to-cover/grenade), firing pooled bullets and applying damage via hitboxes."
order: 53
status: "In Development"
tags: ["Enemy", "AI", "Ranged", "Cover", "Perception", "Projectiles"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`EnemyRange` is a tactical ranged archetype built on the shared `Enemy` base.

Key features:
- Dedicated ranged FSM (battle/advance/run-to-cover/throw-grenade)
- Shared perception + target memory
- Reusable cover system (`EnemyCoverController`)
- Projectile-based combat (pooled bullets + grenades)

## 🎯 Purpose
Make ranged enemies feel different from melee enemies by:
- committing to cover positions
- aiming and firing with readable cadence
- using grenades for pressure (optional perk)

## 📦 Core Responsibilities
**Does**
- Build and tick ranged states (`EnemyRangeStateMachine`).
- Use perception outputs to decide engagement and movement.
- Fire pooled bullets:
  - spawns `Bullet` from pool
  - calls `BulletSetup(...)` with enemy damage, speed, friendly mask, and enemy bullet layer
- Throw grenades (perk-gated) using `EnemyGrenade`.
- Interact with cover through `EnemyCoverController`.

**Does NOT**
- Implement cover scoring inside the enemy (delegated to `EnemyCoverController`).
- Apply damage directly (damage goes through `IDamageable` hitboxes).

## 🧱 Key Components
- `EnemyRange` (`Scripts/Enemy/EnemyRange/EnemyRange.cs`)
- Ranged states (`Scripts/Enemy/EnemyRange/States/...`)
- Perception:
  - `EnemyPerception` (`Scripts/Enemy/Perception/EnemyPerception.cs`)
- Cover:
  - `EnemyCoverController` (`Scripts/Enemy/CoverSystem/EnemyCoverController.cs`)
  - `Cover`, `CoverPoint`
- Projectiles:
  - `Bullet` (`Scripts/Bullet.cs`)
  - `EnemyGrenade` (`Scripts/Enemy/EnemyGrenade.cs`)

## 🔄 Execution Flow (high level)
1. Patrol loop: Idle ⇄ Move
2. Engage:
   - base `Enemy` selects a `CombatTarget` and ticks perception
3. Combat decisions:
   - BattleState: aim → shoot, evaluate cover if enabled
   - RunToCoverState: move to reserved cover point
   - AdvanceState: push forward when out of effective range / no cover
   - ThrowGrenadeState: animation-timed grenade throw (perk-gated)
4. Death:
   - base death pipeline (ragdoll + dissolve)

## 🧨 Damage Application (ranged)
- Bullets apply `DamageInfo` to `IDamageable` colliders (enemy hurtboxes implement this).
- Grenades apply AoE `DamageInfo` via overlap sphere.
- Friendly fire filtering uses the global flag + layer masks.

## ✅ Development Status
In Development
