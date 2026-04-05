---
title: "Enemy Melee AI"
summary: "NavMesh-driven patrol/chase + animation-driven melee windows, with optional shield + axe throw variants, and damage applied through the shared DamageInfo/IDamageable pipeline."
order: 52
status: "In Development"
tags: ["Enemy", "AI", "Melee", "NavMesh", "Animation", "Damage"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`EnemyMelee` is a close-combat archetype built on the shared `Enemy` base.

It uses:
- `NavMeshAgent` for patrol + chase
- A melee state machine (idle/move/chase/attack/recovery/ability/dead)
- Animation events to open/close attack windows
- Variant abilities (shield durability, axe throw)

## 🎯 Purpose
Provide a melee enemy that feels:
- readable (attack windows synced to animation)
- fair (hit checks only during intended frames)
- extensible (variants via data + small components)

## 🧠 Design Philosophy
- **State machine clarity**: combat decisions funnel through predictable states.
- **Animation-driven damage windows**: attack checks only run when enabled by events.
- **Precision damage**: melee hits target colliders in `targetLayers` that implement `IDamageable` (usually hitboxes).

## 📦 Core Responsibilities
**Does**
- Build and tick melee states (`EnemyStateMachine`).
- Patrol (Idle/Move) and chase (Chase).
- Trigger melee animations and enable hit checks through `EnemyAnimationEvents`.
- Apply melee damage via `Enemy.MeleeAttackCheck(...)` (OverlapSphere at damage points).
- Execute axe throw using a pooled `EnemyAxe` projectile.
- Support shield variants via `EnemyShield` (durability-based IDamageable).

**Does NOT**
- Perform perception math (handled by `EnemyPerception`).
- Apply bullet damage logic (handled by `Bullet` + hitboxes).
- Handle cover (ranged-only system currently).

## 🧱 Key Components
- `EnemyMelee` (`Scripts/Enemy/EnemyMelee/EnemyMelee.cs`)
- Melee states (`Scripts/Enemy/EnemyMelee/States/...`)
- Shared base systems:
  - `Enemy` (`Scripts/Enemy/Enemy.cs`)
  - `EnemyPerception` (`Scripts/Enemy/Perception/EnemyPerception.cs`)
  - `EnemyHealth` (`Scripts/Managers/Components/EnemyHealth.cs`)
  - `EnemyAnimationEvents` (`Scripts/Enemy/EnemyAnimationEvents.cs`)

Variants / helpers
- `EnemyShield` (`Scripts/Enemy/EnemyShield.cs`)
- `EnemyAxe` (`Scripts/Enemy/EnemyAxe.cs`)

## 🔄 Execution Flow (combat loop)
1. Spawn
   - State machine starts in Idle.
2. Patrol
   - Idle ⇄ Move between patrol points.
3. Engage
   - Target selection + perception handled in base `Enemy.Update()`.
   - On visibility (or on hit), enemy enters battle mode.
4. Chase → Attack
   - Chase steers via `NavMeshAgent`.
   - Attack triggers animation:
     - events call `EnableMeleeAttackCheck(true/false)`
     - events call `MeleeAttackCheck(...)` during the damage window
5. Recovery / Ability
   - Recovery chooses next action:
     - continue chasing
     - start another attack
     - throw axe (if enabled / in range)
6. Death
   - `EnemyHealth.Died` triggers base death pipeline (ragdoll + dissolve).

## 🧨 Damage Application (melee + axe)
- **Melee**: OverlapSphere finds colliders in `targetLayers`.
  - Applies `DamageInfo` to `IDamageable` colliders (hitboxes/shields).
- **Axe**: The thrown `EnemyAxe` carries a `DamageInfo` payload and applies it on trigger hit.

## 🔗 Dependencies
- Unity: `NavMeshAgent`, physics, animator
- Correct layer setup (`targetLayers` must include the hurtbox layers you want to damage)

## ✅ Development Status
In Development
