---
title: "Enemy Death Pipeline"
summary: "Health-driven death flow: EnemyHealth.Died triggers ragdoll + dissolve, optional cleanup (grenade/cover reservations), and pool return."
order: 55
status: "In Development"
tags: ["Enemy", "Combat", "Death", "Ragdoll", "VFX", "Pooling"]
last_updated: "2026-04-05"
---

## 🧭 Overview
Enemy death is driven by the `EnemyHealth` component.

When health reaches 0:
- `EnemyHealth` fires `Died`
- the base `Enemy` runs the shared death pipeline:
  - stop AI + nav
  - enable ragdoll
  - play dissolve VFX
  - return to pool after a delay (depending on implementation)

Archetypes may add extra cleanup:
- ranged enemies release reserved cover points
- bosses disable persistent damage areas
- grenade enemies may cancel pending throws, etc.

## 🎯 Purpose
- Keep death behavior consistent across all enemy types.
- Ensure pooled enemies can safely reset.
- Provide satisfying feedback (ragdoll + dissolve) without duplicating code per enemy.

## 🧱 Key Components
- `EnemyHealth` (`Scripts/Managers/Components/EnemyHealth.cs`)
- `Enemy` base (`Scripts/Enemy/Enemy.cs`)
- `Ragdoll` (`Scripts/Ragdoll.cs`)
- `EnemyDeathDissolve` (`Scripts/Enemy/EnemyDeathDissolve.cs`)

## 🔄 Execution Flow
1. Damage arrives through hitboxes (`EnemyHitBox`) → `Enemy.TakeDamage(DamageInfo)`
2. `EnemyHealth.TakeDamage(int)` reduces HP.
3. At 0 HP:
   - `EnemyHealth.Died` event fires
4. Enemy death pipeline:
   - disable movement/AI
   - enable ragdoll
   - play dissolve
   - return to pool (or destroy) depending on your pooling rules
5. On reuse:
   - `Enemy.OnSpawnedFromPool()` restores baseline state (health reset, visuals reset, ragdoll disabled, etc.)

## ⚠ Constraints & Assumptions
- Death logic assumes `EnemyHealth` is present on the enemy root.
- Ragdoll requires properly configured rigidbodies/colliders under the enemy hierarchy.

## ✅ Development Status
In Development
