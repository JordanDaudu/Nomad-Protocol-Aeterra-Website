---
title: "Combat Targets & Lock-On"
summary: "Shared target representation for AI + player lock-on: CombatTarget registry (Root/AimPoint) and LockOnTarget markers."
order: 35
status: "In Development"
tags: ["Combat", "Targeting", "Player", "Enemy", "AI"]
last_updated: "2026-04-05"
---

## 🧭 Overview
Nomad Protocol uses **two small components** to make “who can be targeted” explicit and reusable:

- **`CombatTarget`**: a shared *AI-facing* representation of an actor that enemies can detect, aim at, and remember.
- **`LockOnTarget`**: a lightweight *player-facing* marker used by `PlayerAim` to support optional lock-on.

They solve two separate problems:
- Enemies need a consistent “root + aim point” to feed into perception and aiming logic.
- The player needs an optional “candidate marker” to snap aim toward without hard-coding enemy classes.

## 🎯 Purpose
- Standardize how AI reasons about targets (**Root vs AimPoint**) using `CombatTarget`.
- Keep player lock-on decoupled from enemy implementation using `LockOnTarget` markers and a layer mask.

## 📦 Core Responsibilities

### CombatTarget
**Does**
- Provides:
  - `Root` (usually the character root transform)
  - `AimPoint` (e.g., chest/head transform used for aiming and perception)
- Self-registers into a static `CombatTarget.ActiveTargets` list for discovery.

**Does NOT**
- Do perception/LOS checks (that’s `EnemyPerception`)
- Do threat scoring or team logic
- Apply damage

### LockOnTarget
**Does**
- Acts as a lock-on candidate marker.
- Enforces its GameObject layer to **EnemyHurtBox** on `Awake()` (for consistent raycast filtering).

**Does NOT**
- Register globally
- Contain combat logic
- Affect AI

## 🧱 Key Components
Classes
- `CombatTarget` (`Scripts/Managers/Components/CombatTarget.cs`)
- `LockOnTarget` (`Scripts/LockOnTarget.cs`)

Related
- `EnemyPerception.SetTarget(CombatTarget)` (`Scripts/Enemy/Perception/EnemyPerception.cs`)
- `Enemy` acquires targets from `CombatTarget.ActiveTargets` (`Scripts/Enemy/Enemy.cs`)
- `PlayerAim` lock-on checks via `LockOnTarget` layer mask (`Scripts/Player/PlayerAim.cs`)

## 🔄 Execution Flow

### CombatTarget lifecycle
1. `OnEnable()`
   - Adds itself to `CombatTarget.ActiveTargets`
2. `OnDisable()`
   - Removes itself from the list

### Enemy target acquisition (high level)
1. `Enemy` queries the active list and picks the closest valid target.
2. `EnemyPerception` is pointed at the chosen `CombatTarget` (Root + AimPoint).
3. States use perception outputs (`IsTargetVisible`, `KnownTargetPosition`) to decide actions.

### Player lock-on (high level)
1. `PlayerAim` raycasts using a dedicated lock-on layer mask.
2. If it hits a `LockOnTarget`, aim can snap toward that target (implementation details live in `PlayerAim`).

## 🔗 Dependencies
Depends On
- Correct layer setup:
  - `LockOnTarget` expects an **EnemyHurtBox** layer to exist.

Used By
- All enemy archetypes (via `CombatTarget` + `EnemyPerception`)
- Player aim (via `LockOnTarget`)

## ⚠ Constraints & Assumptions
- `CombatTarget.ActiveTargets` is a simple global list:
  - Fine for current scale; if the number of targets grows, you may later add spatial partitioning.
- Lock-on is only as correct as your layer setup:
  - If you change the layer name, `LockOnTarget` will log an error and default may break.

## 📈 Scalability & Extensibility
- Add more target types (turrets, objectives, allies) by simply attaching `CombatTarget`.
- Add team filtering by extending `CombatTarget` with faction/team metadata (without touching perception math).
- Add multiple lock-on markers per enemy (head/weakpoint) by placing multiple `LockOnTarget` objects.

## ✅ Development Status
In Development
