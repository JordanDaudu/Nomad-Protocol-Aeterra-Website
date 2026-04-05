---
title: "Weapon Runtime Model"
summary: "The Weapon class is a pure C# runtime model that stores per-instance weapon state (ammo, cooldowns, burst/spread) and exposes CanShoot/CanReload logic."
order: 31
status: "In Development"
tags: ["Combat", "Weapons", "Runtime State"]
last_updated: "2026-04-05"
---

## 🧭 Overview
`Weapon` is **not** a MonoBehaviour. It is a runtime model created from `WeaponData` and stored in the player’s weapon slots.

It owns mutable state such as:
- `bulletsInMagazine`
- `totalReservedAmmo`
- fire timing (`lastTimeShot`)
- burst mode enable + cadence values
- spread application

## 🎯 Purpose
Keep weapon rules and state separate from:
- Input handling (`PlayerWeaponController`)
- Animation / visuals (`PlayerWeaponVisuals`)
- Data tuning (`WeaponData`)

This makes the codebase easier to scale (new weapons are mostly data).

## 📦 Core Responsibilities
**Does**
- Construct from `WeaponData` (`new Weapon(weaponData)`).
- Provide readiness checks:
  - `CanShoot()`
  - `CanReload()`
- Update state on shoot:
  - `ReadyToFire()` gate
  - decrement magazine ammo
- Provide reload math:
  - `RefillBullets()` moves ammo from reserve → magazine
- Provide spread:
  - `ApplySpread(direction)`

**Does NOT**
- Spawn projectiles
- Choose hit layers / friendly-fire rules
- Play animations

## 🧱 Key Components
Classes
- `Weapon` (`Scripts/Player/Weapon/Weapon.cs`)
- `WeaponData` (`Scripts/Player/Weapon/WeaponData.cs`)

Key runtime fields (examples)
- `weaponType`
- `bulletsInMagazine`
- `totalReservedAmmo`
- `lastTimeShot`
- `burstModeActive`

## 🔄 Execution Flow
1. Created from data (player start weapon or pickup):
   - `new Weapon(weaponData)`
2. Firing:
   - Controller checks `weaponReady && currentWeapon.CanShoot()`
   - On shoot:
     - controller spawns a pooled `Bullet`
     - weapon updates its timing and ammo state
3. Reload:
   - Controller checks `CanReload()`
   - Animation event triggers:
     - `currentWeapon.RefillBullets()`

## 🔗 Dependencies
Depends On
- Unity `Time.time` (fire-rate timing)

Used By
- `PlayerWeaponController` (combat loop + ammo UI access)
- `PickupWeapon` (pickups hold a runtime Weapon instance)

## ⚠ Constraints & Assumptions
- `Weapon` stores a reference to its `weaponData` asset for type/metadata.
- Ammo persistence on drop/re-pickup comes from reusing the same `Weapon` instance when dropped.

## 📈 Scalability & Extensibility
If the weapon model grows further, this can be split into smaller sub-models:
- `AmmoModel`, `FireModeModel`, `SpreadModel`  
…but at current scale a single `Weapon` class is a clean trade-off.

## ✅ Development Status
In Development
