---
title: "Weapon Runtime Model"
summary: "The Weapon class stores runtime weapon state and implements firing/reload/burst/spread logic."
order: 31
status: "In Development"
tags: ["Combat", "Weapons", "Runtime State"]
last_updated: "2026-02-19"
---

## 🧭 Overview
`Weapon` is a pure C# runtime model (not a MonoBehaviour). It represents one weapon instance in the player’s inventory and owns:
- Current ammo counts
- Fire timing (`lastFireTime`)
- Spread accumulation and cooldown
- Burst mode config + toggle logic

## 🎯 Purpose
Keep weapon rules and state separate from:
- Input handling (`PlayerWeaponController`)
- Visuals/animations (`PlayerWeaponVisuals`)
- Data assets (`WeaponData`)

## 🧠 Design Philosophy
- `WeaponData` defines defaults; `Weapon` holds runtime state.
- Encapsulate “can we shoot/reload?” checks inside the weapon model.
- Keep controller code focused on orchestration, not math.

Trade-off: `Weapon` currently mixes multiple concerns (spread + burst + ammo) in one class for simplicity.

## 📦 Core Responsibilities
**Does**
- Initialize from `WeaponData` via constructor.
- Implement spread:
    - `ApplySpread(Vector3)`
- Implement burst mode:
    - `IsBurstModeActive()`
    - `ToggleBurstMode()`
- Implement shooting checks:
    - `CanShoot()` (ammo + fire-rate gate)
- Implement reload logic:
    - `CanReload()`
    - `RefillBullets()`

**Does NOT**
- Spawn bullets or play animations.
- Know anything about the player, input, or camera.

## 🧱 Key Components
Classes / Enums
- `Weapon` (`Scripts/Weapon/Weapon.cs`)
- `WeaponType` enum
- `ShootType` enum

Data relationship
- Holds reference to the source `weaponData` (for identification + visuals).
    - Runtime ammo/state is stored on the `Weapon` instance itself (not on the ScriptableObject).

## 🔄 Execution Flow
1. Created via `new Weapon(weaponData)`
2. Firing cycle:
    - Controller calls `CanShoot()`
    - If true → controller decrements `bulletsInMagazine` and spawns bullet
3. Spread:
    - Controller calls `ApplySpread(direction)` when firing
4. Reload:
    - Controller checks `CanReload()`, plays reload animation
    - Animation event calls `RefillBullets()`

## ♻ Drop & Re-Pickup Persistence
- When a weapon is **dropped**, `PlayerWeaponController` spawns a pooled `PickupWeapon` and injects the **existing runtime** `Weapon` instance (ammo/state preserved).
- When the player picks it up again **and does not already own that weapon type**, the same runtime instance is re-added to the inventory, so `bulletsInMagazine` and `totalReservedAmmo` persist.
- If the player **already owns** that weapon type, the controller treats the pickup as **ammo-only** (transfers `bulletsInMagazine` and consumes the pickup).

## 🔗 Dependencies
**Depends On**
- Unity `Time.time` for fire-rate timing and spread cooldown.
- `WeaponData` for initialization.

**Used By**
- `PlayerWeaponController` (shoot/reload/toggle burst)
- `PickupWeapon` (stores/uses a `Weapon` instance)

## ⚠ Constraints & Assumptions
- `ReadyToFire()` updates `lastFireTime` when it returns true (the timing gate mutates state).
- Shotgun special-case: `IsBurstModeActive()` forces burst behavior and sets `burstFireDelay = 0`.
- Spread uses “random Euler” around all axes (same random value for x/y/z), which may not match final intended recoil feel.

## 📈 Scalability & Extensibility
- Add per-weapon “projectile pattern” logic (e.g., shotgun pellet cone) here if you keep it purely math/state.
- If complexity grows, split into sub-models (AmmoModel, SpreadModel, FireModeModel) later.

## ✅ Development Status
In Development

## 📝 Notes
Related devlogs:
- Devlog 06 – Fire modes, spread, burst, readiness gating
- Devlog 07 – Constructor from WeaponData
