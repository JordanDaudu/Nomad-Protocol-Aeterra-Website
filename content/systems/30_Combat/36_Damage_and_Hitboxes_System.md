---
title: "Damage & Hitboxes System"
summary: "Unified damage pipeline built on DamageInfo + IDamageable, routed through hitboxes and Health components, with friendly-fire filtering."
order: 36
status: "In Development"
tags: ["Combat", "Damage", "Health", "Hitboxes", "FriendlyFire"]
last_updated: "2026-04-05"
---

## 🧭 Overview
This project implements a **single damage pipeline** that supports many attack types (bullets, melee swings, grenades, boss abilities) without duplicating “how damage is applied”.

The core idea:
> Damage sources produce a `DamageInfo` payload and deliver it to something that implements `IDamageable`.

Hitboxes (`PlayerHitBox`, `EnemyHitBox`, shields, etc.) are the main `IDamageable` entry points, which then forward the final damage into a **Health** component (`PlayerHealth`, `EnemyHealth`) or special logic (`EnemyShield` durability).

## 🎯 Purpose
- Support multiple damage sources with one interface contract.
- Make precision combat possible via **hurtbox colliders** (headshots, shields, weak points).
- Keep team / friendly-fire rules consistent across sources.

## 🧠 Design Philosophy
- **Data-first damage**: `DamageInfo` carries what happened (amount, source, hit point, force).
- **Interface-based delivery**: `IDamageable.TakeDamage(DamageInfo)` is the only required entry point.
- **Hitboxes as routers**: hitboxes can modify damage (multipliers, invulnerability) before forwarding.
- **Health as a reusable component**: health does not care what caused the damage.

## 📦 Core Responsibilities

### DamageInfo (damage payload)
**Does**
- Encapsulates damage details:
  - `Amount`
  - `Source`
  - `HitPoint`
  - `HitDirection`
  - `ImpactForce`
  - `AttackType`
- Allows hitboxes to modify the amount (e.g., headshot multiplier) by mutating `Amount`.

**Does NOT**
- Apply damage itself
- Decide friendly-fire rules
- Contain references to specific enemy/player scripts

### IDamageable (delivery contract)
**Does**
- Provides `TakeDamage(DamageInfo info)`

**Does NOT**
- Require a Health component (shields/dummies can implement it differently)

### Hitboxes (precision routing)
Hitboxes are **colliders on body parts** (or defensive parts like shields) that:
- receive damage
- optionally modify it
- forward it to the owning actor

Key behaviors:
- **Enemy hitboxes** can multiply damage (`damageMultiplier`) for headshots/weak points.
- **Player hitboxes** route into `PlayerHealth`.
- Any hitbox can be toggled invulnerable (`isInvulnerable`).

### Health (shared HP + events)
**Does**
- Tracks `MaxHealth` and `CurrentHealth`
- Exposes events:
  - `OnHealthChanged(current, max)`
  - `Died`
- Provides:
  - `TakeDamage(int)`
  - `Heal(int)`
  - `ResetHealth()`

`Enemy` listens to `EnemyHealth.Died` to run the death pipeline (ragdoll + dissolve + pool return).

### Friendly fire filtering
Friendly fire is controlled by:
- `GameManager.Instance.FriendlyFireEnabled`
- Layer-mask checks (`friendlyLayers` / `targetLayers`) passed into bullets and configured on enemies.

Damage sources generally follow this rule:
- If friendly-fire is OFF and the target is “friendly” → **do not apply damage**.

## 🧱 Key Components
Core
- `DamageInfo` (`Scripts/DamageInfo.cs`)
- `IDamageable` (`Scripts/Interfaces/IDamageable.cs`)
- `Health` (`Scripts/Managers/Components/Health.cs`)
- `PlayerHealth` (`Scripts/Managers/Components/PlayerHealth.cs`)
- `EnemyHealth` (`Scripts/Managers/Components/EnemyHealth.cs`)

Hitboxes / precision
- `HitBox` (`Scripts/HitBox.cs`)
- `PlayerHitBox` (`Scripts/Player/PlayerHitBox.cs`)
- `EnemyHitBox` (`Scripts/Enemy/EnemyHitBox.cs`)
- `EnemyShield` (`Scripts/Enemy/EnemyShield.cs`) *(durability-based IDamageable)*

Damage sources (examples)
- `Bullet` (`Scripts/Bullet.cs`)
- `EnemyAxe` (`Scripts/Enemy/EnemyAxe.cs`)
- `EnemyGrenade` (`Scripts/Enemy/EnemyGrenade.cs`)
- `Flamethrower_DamageArea` (`Scripts/Enemy/EnemyBoss/Flamethrower_DamageArea.cs`)
- Enemy melee overlap checks (`Enemy.MeleeAttackCheck`)

## 🔄 Execution Flow

### Bullet hit
1. Shooter spawns pooled `Bullet` and calls `BulletSetup(...)` with:
   - direction, speed, damage, source
   - friendly layer mask + bullet layer
2. On collision:
   - Bullet tries `collision.gameObject.GetComponent<IDamageable>()`
   - If friendly-fire rules allow → calls `TakeDamage(DamageInfo)`
   - Enemy reactions (battle-mode, awareness refresh, hit feel) occur when damage reaches the enemy through `EnemyHitBox → Enemy.TakeDamage(...)`.
   - If the enemy is already dead and ragdolled, the bullet applies an impulse for extra impact feel.

### Melee hit (OverlapSphere)
1. Enemy state opens an attack window via animation events.
2. `Enemy.MeleeAttackCheck(...)` overlaps sphere(s) at weapon damage points.
3. For each collider hit:
   - Calls `TryApplyMeleeDamage(...)`
   - Gets `IDamageable` and applies `DamageInfo` (with optional impact force)

### Grenade AoE
1. Grenade explodes and overlaps colliders by `targetLayers`.
2. For each collider:
   - Filters friendly-fire
   - Applies `DamageInfo` + physics impulse

### Hitbox headshot
1. Bullet hits an `EnemyHitBox` collider.
2. `EnemyHitBox.TakeDamage(...)` multiplies `DamageInfo.Amount` by `damageMultiplier`.
3. Forwards to `Enemy.TakeDamage(...)`, which forwards to `EnemyHealth.TakeDamage(...)`.

## 🔗 Dependencies
Depends On
- Consistent Unity layer setup for:
  - player/enemy hurtboxes
  - friendly layer masks
  - bullet layers (player vs enemy) when needed

Used By
- Player combat
- Enemy melee/ranged/boss attacks
- Any future damage sources (explosions, traps, status effects)

## ⚠ Constraints & Assumptions
- Damage routing assumes the colliders you want to damage implement `IDamageable` (usually hitboxes).
- If a bullet hits a non-damageable collider, it will still create impact FX and return to pool (by design).
- Headshot multipliers are data-driven per hitbox (you must configure `damageMultiplier` per collider).

## 📈 Scalability & Extensibility
- Add new damage types by:
  1) Creating `DamageInfo` with `AttackType`
  2) Calling `IDamageable.TakeDamage(...)`
- Add resistances/armor by extending `Health` or inserting a middleware component between hitbox and health.
- Add DOT/status effects by expanding `DamageInfo` or by applying effects alongside `TakeDamage`.

## ✅ Development Status
In Development
