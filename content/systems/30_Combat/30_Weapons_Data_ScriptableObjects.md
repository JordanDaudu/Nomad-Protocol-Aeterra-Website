---
title: "Weapons Data (ScriptableObjects)"
summary: "WeaponData assets define player weapon stats (fire rate, magazine, damage, spread, bullet speed, recoil, camera distance) and are used to construct runtime Weapon instances."
order: 30
status: "In Development"
tags: ["Combat", "Weapons", "ScriptableObjects", "DataDriven"]
last_updated: "2026-04-05"
---

## 🧭 Overview
Player weapons are configured using `WeaponData` ScriptableObjects.

A `WeaponData` is **static tuning** (what the weapon *is*).  
A runtime `Weapon` instance is **mutable state** (ammo remaining, cooldown timers, etc.).

This split keeps the system scalable:
- Designers can tweak weapons without touching code.
- Runtime state stays per-weapon-instance (not shared across all users of the asset).

## 🎯 Purpose
- Make weapon balancing data-driven.
- Allow the same weapon type to be instantiated multiple times with independent ammo/timers.

## 📦 Core Responsibilities
**WeaponData does**
- Store weapon tuning values (serialized in assets).
- Provide read-only properties used by `Weapon`.

**WeaponData does NOT**
- Track runtime ammo or cooldowns.
- Spawn bullets or play animations.

## 🧱 Key Components
Classes
- `WeaponData` (`Scripts/Player/Weapon/WeaponData.cs`)
- `Weapon` runtime model (`Scripts/Player/Weapon/Weapon.cs`)

Key fields in `WeaponData` (high-level)
- Identity: `weaponType`, `weaponName`
- Fire: `fireMode` (Semi / Auto / Burst), `fireRate`, `burstCount`, `burstDelay`
- Ammo: `magazineSize`, `startingAmmo`, `maxReservedAmmo`
- Damage: `damage` *(used to build `DamageInfo` for bullets)*
- Projectile: `bulletSpeed`, `weaponSpread`
- Feel: `recoilForce`, `reloadTime`
- Camera: `cameraDistance`
- UI/Visuals: optional references depending on your setup

## 🔄 Execution Flow
1. The player starts with a `defaultWeaponData`.
2. `PlayerWeaponController` constructs a runtime weapon:
   - `new Weapon(defaultWeaponData)`
3. Firing reads values from the asset (fire rate, spread, damage), but updates runtime state (ammo/cooldowns).

## 🔗 Dependencies
Used By
- `PlayerWeaponController` (weapon creation + combat loop)
- `PickupWeapon` (world pickups use `WeaponData` to create a fresh runtime `Weapon` when the pickup is not a dropped weapon)

## ⚠ Notes on ammo persistence
- **ScriptableObjects do not store ammo**.
- Ammo persistence across drop → pickup is achieved by passing the **same runtime `Weapon` instance** into the pooled pickup object (`PickupWeapon.SetupPickupWeapon(...)`).

## ✅ Development Status
In Development
