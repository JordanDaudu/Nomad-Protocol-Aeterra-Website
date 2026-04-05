---
title: "Player Weapon Controller"
summary: "Owns weapon inventory, equips weapons, drives shooting and reloading, spawns pooled bullets, and manages drop/pickup rules."
order: 32
status: "In Development"
tags: ["Combat", "Weapons", "Player"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`PlayerWeaponController` is the orchestration layer for the player combat loop:
- weapon inventory (slots)
- equip/switch
- shooting (semi / auto / burst)
- reloading (animation-gated)
- weapon pickups + drops (pooled)
- bullet spawning (pooled) + per-shot setup (damage, speed, layers)

## 🎯 Purpose
Translate player input into weapon gameplay outcomes while keeping:
- weapon rules inside `Weapon`
- visuals inside `PlayerWeaponVisuals`
- pooling inside `ObjectPool`

## 🧠 Design Philosophy
- Use a simple `weaponReady` gate controlled by animation events.
- Keep pickup/drop logic rule-based (predictable behavior).
- Prefer pooled objects for bullets and dropped pickups.

## 📦 Core Responsibilities
**Does**
- Create starting weapon from `defaultWeaponData`.
- Manage `weaponSlots` and equip by index.
- Fire bullets using pooling:
  - Uses `PlayerAim.BulletDirection()` and `Weapon.ApplySpread(...)`
  - Calls `Bullet.BulletSetup(...)` with:
    - direction, speed, damage, source
    - friendly layer mask
    - bullet layer (player bullet layer)
- Drive reload flow via animation events:
  - `Reload()` triggers animation, waits for `ReloadIsOver()` event
- Handle pickup/drop rules:
  1) If weapon already owned → convert pickup into ammo (adds pickup magazine ammo into reserve)
  2) If inventory full and different type → replace current weapon and drop old as pickup
  3) Else → add weapon and update backup weapon visuals
- Drop current weapon as a pooled `PickupWeapon` object.

**Does NOT**
- Apply damage directly (damage is applied by `Bullet` → `IDamageable.TakeDamage`).
- Handle hitboxes/health logic (see Damage & Hitboxes System).

## 🧱 Key Components
Classes
- `PlayerWeaponController` (`Scripts/Player/PlayerWeaponController.cs`)
- `Weapon` runtime model
- `WeaponData`
- `Bullet` (`Scripts/Bullet.cs`)
- `PickupWeapon` (`Scripts/Interaction/Pickups/PickupWeapon.cs`)
- `ObjectPool` (`Scripts/ObjectPool/ObjectPool.cs`)

Key config fields
- `defaultWeaponData`
- `bulletPrefab`
- `weaponPickupPrefab`
- `friendlyLayer` (layers considered “friendly” to the player)
- `playerBulletLayer` (the layer bullets should be set to when fired by the player)

## 🔄 Execution Flow (high level)
1. `Start()`
   - Cache `Player`
   - Hook input events
   - Equip starting weapon
2. Shooting
   - Input sets `isShooting`
   - Update calls `Shoot()` while held (auto) or once (semi)
   - Spawn pooled bullet and setup with damage/speed/layers
3. Reload
   - Trigger reload animation
   - Animation event calls `ReloadIsOver()` → `RefillBullets()` → `weaponReady = true`
4. Drop
   - Spawn pooled pickup and inject the runtime `Weapon` instance
   - Remove weapon from slots and equip another

## 🔗 Dependencies
Depends On
- `Player` (aim + visuals)
- `ObjectPool` (bullets + dropped pickups)
- Unity: coroutines, physics

Used By
- `PickupWeapon.Interaction()` calls `weaponController.PickupWeapon(weapon)`

## ⚠ Constraints & Assumptions
- `weaponSlots` and `maxWeaponSlots` must match your intended inventory UI.
- `friendlyLayer` and `playerBulletLayer` must align with your Unity Layer Collision Matrix and hurtbox layers.

## 📝 Notes
- Ammo/state persistence on drop → pickup is achieved by passing the **same runtime `Weapon` instance** into the pooled pickup object (`PickupWeapon.SetupPickupWeapon(...)`).
