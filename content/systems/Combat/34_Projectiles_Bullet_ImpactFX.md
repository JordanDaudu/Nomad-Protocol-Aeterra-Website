---
title: "Projectiles: Bullet & Impact FX"
summary: "Pooled bullet behavior: travel distance, trail fade-out, collision impact VFX, and pool return."
order: 34
status: "In Development"
tags: ["Combat", "Projectiles", "Pooling", "VFX"]
last_updated: "2026-02-18"
---

## 🧭 Overview
Bullets are pooled GameObjects controlled by the `Bullet` script. The projectile is spawned and launched by `PlayerWeaponController`, and the bullet:
- Tracks its start position and max fly distance
- Disables collider/mesh after traveling far enough (but keeps trail fading)
- Spawns an impact VFX object on collision (also pooled)
- Returns itself to the pool

## 🎯 Purpose
Provide consistent, performant projectile behavior with good visual feedback:
- Trails make bullet direction readable.
- Impact VFX confirms hits.
- Pooling keeps high fire rate viable.

## 🧠 Design Philosophy
- Separate projectile behavior (`Bullet`) from firing orchestration (`PlayerWeaponController`).
- Use a simple “distance-based lifetime” rather than time-based destroy.
- Fade the trail before returning for smoother visuals.

Trade-off: uses “magic numbers” for natural-looking fade timing; documented below.

## 📦 Core Responsibilities
**Does**
- Reset bullet state on spawn via `BulletSetup(flyDistance)`.
- Disable collision and mesh once past max distance.
- Fade trail near the end of travel.
- Spawn pooled impact FX on `OnCollisionEnter`.
- Return bullet + impact fx to pool.

**Does NOT**
- Apply damage (not implemented yet).
- Perform hit scanning; it uses physics collisions.

## 🧱 Key Components
Classes
- `Bullet` (`Scripts/Bullet.cs`)

Unity components (required)
- `Rigidbody`
- `BoxCollider`
- `MeshRenderer`
- `TrailRenderer`
- Impact FX prefab reference (`bulletImpactFX`)

## 🔄 Execution Flow
1. `PlayerWeaponController` spawns a pooled bullet and calls `BulletSetup(currentWeapon.gunDistance)`.
2. Bullet `Update()`:
   - `FadeTrailIfNeeded()`: when near end distance, trail time decreases rapidly.
   - `DisableBulletIfNeeded()`: once beyond flyDistance, collider/mesh disabled.
   - `ReturnToPoolIfNeeded()`: when `trailRenderer.time < 0`, return to pool.
3. On collision:
   - `CreateImpactFx(collision)` spawns pooled impact effect at contact point.
   - Bullet returns to pool immediately.

## 🔗 Dependencies
**Depends On**
- `ObjectPool` for bullet and impact FX pooling.
- Physics collisions (`OnCollisionEnter`).

**Used By**
- `PlayerWeaponController` (spawns and launches bullets).

## ⚠ Constraints & Assumptions
- `BulletSetup()` sets `flyDistance = weaponDistance + 0.5f`:
  - `0.5f` is intentionally used to match the laser’s “tip” segment (see `PlayerAim.UpdateAimVisuals()`).
- Trail fade uses magic constants:
  - starts fading at `flyDistance - 1.5f`
  - fade speed `8f * deltaTime`
- Bullet return is based on trail time reaching below 0.

## 📈 Scalability & Extensibility
- Add surface-based impact variations by checking collision material/tag (not implemented yet).
- Add ricochet or penetration by changing collision handling.

## ✅ Development Status
In Development

## 📝 Notes
Related devlogs:
- Devlog 04 – Shooting foundations
- Devlog 05 – Collision reliability + impact VFX
- Devlog 06/07 – Pooling evolution
