---
title: "Projectiles & Impact FX"
summary: "Bullet projectile behavior (pooling, collision, DamageInfo delivery) plus grenade/axe projectiles and impact reactions."
order: 34
status: "In Development"
tags: ["Combat", "Projectiles", "Pooling", "FX", "Damage"]
last_updated: "2026-04-05"
---

## 🧭 Overview
Projectiles are real physics objects, spawned via `ObjectPool`, and apply damage through the shared `IDamageable` pipeline.

Current projectile-style damage sources include:
- `Bullet` (player + enemy ranged weapons)
- `EnemyAxe` (thrown projectile from melee enemies)
- `EnemyGrenade` (AoE explosion)
- Boss area damage (e.g., flamethrower damage area) *(not a projectile, but part of the same DamageInfo pipeline)*

## 🎯 Purpose
- Use a consistent combat “language”: visible projectiles + readable impact.
- Keep projectile spawning cheap via pooling.
- Apply damage through a single interface (`IDamageable`) so hitboxes/shields can decide how to react.

## 🧱 Key Components
Classes
- `Bullet` (`Scripts/Bullet.cs`)
- `EnemyAxe` (`Scripts/Enemy/EnemyAxe.cs`)
- `EnemyGrenade` (`Scripts/Enemy/EnemyGrenade.cs`)
- `DamageInfo` (`Scripts/DamageInfo.cs`)
- `IDamageable` (`Scripts/Interfaces/IDamageable.cs`)

Supporting
- `ObjectPool` (`Scripts/ObjectPool/ObjectPool.cs`)
- `GameManager` (friendly fire toggle)
- Hitboxes (`PlayerHitBox`, `EnemyHitBox`) and `EnemyShield` implement `IDamageable`

## 🔫 Bullet (player + enemy)
### Setup
Bullets are configured at spawn time using:
`Bullet.BulletSetup(direction, speed, damage, source, friendlyLayerMask, bulletLayer)`

This allows the *same bullet prefab* to be used by:
- player weapons (sets player bullet layer + player friendly mask)
- enemy ranged weapons (sets enemy bullet layer + enemy friendly mask)

### Collision behavior
On collision, the bullet:
1. Spawns impact FX at the collision point.
2. Performs friendly-fire filtering.
3. If allowed, calls `TakeDamage(DamageInfo)` on the hit collider’s `IDamageable`.
4. If the hit collider belongs to a dead enemy ragdoll, applies an impulse to the closest rigidbody for extra impact feel.
5. Returns itself to the pool.

> Enemy awareness/reaction is handled when damage reaches the enemy via `EnemyHitBox → Enemy.TakeDamage(...)`.

## 🪓 EnemyAxe
- A pooled thrown projectile.
- Stores a `DamageInfo` payload via `Setup(damageInfo)`.
- On trigger hit:
  - applies damage to `IDamageable` if present
  - respects friendly-fire rules via the owning enemy’s configured layer masks
  - returns to pool

## 💣 EnemyGrenade
- Explosion uses `Physics.OverlapSphere` with `targetLayers`.
- Applies `DamageInfo` to every `IDamageable` collider found, with optional physics force.
- Uses the global friendly-fire flag + friendly layer mask to decide whether allies can be damaged.

## 🧪 Impact reactions & physics feel
- `DamageInfo` includes `ImpactForce` and `HitDirection`.
- Enemies can use these to apply ragdoll impulses or “hit feel” effects via `Ragdoll.AddForceToClosestRigidbody(...)`.
- Hitboxes can apply multipliers (headshots) before damage reaches `Health`.

## 🔗 Dependencies
- Correct Unity layers for:
  - hurtboxes (player/enemy)
  - bullets (player bullet layer / enemy bullet layer)
  - friendly layer masks
- `ObjectPool` must include prefabs for bullets and any pooled projectiles.

## ⚠ Constraints & Assumptions
- Bullets only deal damage to colliders that implement `IDamageable` (usually hitboxes/shields).
- Impact FX are intentionally created even when damage is filtered (e.g., friendly-fire off).

## ✅ Development Status
In Development
