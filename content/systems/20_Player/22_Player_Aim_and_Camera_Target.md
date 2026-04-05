---
title: "Player Aim & Camera Target"
summary: "Converts mouse position into a world aim point, rotates the player and weapon, and supports optional lock-on via LockOnTarget markers."
order: 22
status: "In Development"
tags: ["Player", "Combat", "Aim", "Camera", "Targeting"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`PlayerAim` is responsible for:
- computing a world-space aim point from mouse position
- producing a forward `BulletDirection()` used by weapons
- rotating the player smoothly toward aim
- optional lock-on behavior by selecting a `LockOnTarget`

The camera target is a separate transform updated to follow the aim point for a “look toward mouse” feel.

## 🎯 Purpose
Keep aim math and camera-target logic isolated from movement/weapon code.

## 🧱 Key Components
- `PlayerAim` (`Scripts/Player/PlayerAim.cs`)
- `LockOnTarget` (`Scripts/LockOnTarget.cs`)
- Camera target transform (scene object referenced by player)
- Layer masks:
  - ground/aim plane
  - lock-on target layers (EnemyHurtBox)

## 🔄 Execution Flow (high level)
1. Each frame:
   - Raycast from screen mouse position to world (aim plane / ground).
   - Update:
     - `aimDirection` (used for player rotation)
     - camera target position
2. If lock-on is enabled and a `LockOnTarget` is found:
   - Aim snaps toward that target’s transform instead of raw mouse world point.
3. Weapons request:
   - `BulletDirection()` (optionally with spread applied by `Weapon.ApplySpread`)

## 🔗 Dependencies
Used By
- `PlayerMovement` (rotate toward aim)
- `PlayerWeaponController` (shooting direction)
- Camera system (camera follow/target behavior)

## ⚠ Constraints & Assumptions
- `LockOnTarget` enforces the **EnemyHurtBox** layer on `Awake()`; make sure the layer exists.
- If hitboxes/targets are on different layers than the lock-on mask, lock-on will not find them.

## ✅ Development Status
In Development
