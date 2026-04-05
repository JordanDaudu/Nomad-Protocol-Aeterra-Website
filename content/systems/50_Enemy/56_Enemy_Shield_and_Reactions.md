---
title: "Enemy Shield & Durability Reactions"
summary: "Durability-based shield implemented as an IDamageable collider; absorbs bullets until broken, then disables itself and updates enemy visuals."
order: 56
status: "In Development"
tags: ["Enemy", "Combat", "Shield", "Damage", "Hitboxes"]
last_updated: "2026-04-05"
---

## 🧭 Overview
Some melee enemies can spawn with a defensive `EnemyShield` object.

The shield is a dedicated collider that implements `IDamageable`:
- bullets hit it first (because it has a collider in the hurtbox layer setup)
- each hit reduces durability
- once durability reaches 0, the shield disables itself and the enemy can switch animations/behavior accordingly

## 🎯 Purpose
- Add variety to melee enemies without creating a new enemy class.
- Create a readable “break the shield first” gameplay loop.

## 🧱 Key Components
- `EnemyShield` (`Scripts/Enemy/EnemyShield.cs`)
- `IDamageable` (`Scripts/Interfaces/IDamageable.cs`)
- `Bullet` (`Scripts/Bullet.cs`) *(applies damage to any IDamageable collider it hits)*
- `EnemyMelee` initializes durability for shield variants (implementation detail in enemy script)

## 🔄 Execution Flow
1. Bullet collides with shield collider.
2. Bullet queries `IDamageable` on the collider and calls `TakeDamage(DamageInfo)`.
3. `EnemyShield` reduces `currentDurability` by `damageInfo.Amount`.
4. If durability hits 0:
   - shield disables itself
   - optional `OnShieldBroken` event can be used to switch visuals/animations

## 🔗 Dependencies
- Shield collider must be on a layer that bullets can collide with.
- Enemy visuals/animations should listen for shield state changes (as implemented).

## ✅ Development Status
In Development
