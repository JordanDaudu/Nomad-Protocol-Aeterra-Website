---
title: "Devlog 15 – Damage System, Hitboxes & Health Architecture"
date: "2026-04-05"
summary: "Implemented a modular damage and health pipeline with hitboxes, layered collision filtering, headshot modifiers, friendly-fire rules, and support for bullets, melee, explosives, flamethrowers, and boss attacks."
order: 15
---

## 🎯 Goal
Build a scalable **damage and health system** that works consistently across all combat sources in the game.

This phase focused on:
- Supporting multiple damage types and attack sources
- Adding proper **hitboxes** and collision-layer separation
- Introducing a reusable **health controller** structure
- Supporting **friendly fire rules**
- Improving combat readability with hit feedback and headshot bonuses
- Rebalancing combat values through scriptable data and live testing

---

## 🧠 Design Approach
The goal was not just to “subtract HP,” but to create a **combat pipeline** that could support the growing complexity of the project.

At this point, the game already had:
- Player weapons
- Enemy melee attacks
- Enemy ranged attacks
- Grenades
- Boss abilities
- Different enemy archetypes

Because of that, damage needed to become a **shared system** rather than a collection of one-off scripts.

Key principles:
- **Decouple damage delivery from health ownership**
- Use **interfaces** to make all damageable entities consistent
- Separate **hurt detection** from main actor objects through hitboxes
- Use **layers** to control exactly what can hit what
- Keep the system extensible for future modifiers and balancing

---

## 🏗 Implementation

### 🧩 Core Damage Pipeline
A new shared damage flow was introduced around:
- `DamageInfo`
- `IDamageable`
- `Health`
- `PlayerHealth`
- `EnemyHealth`

This creates a reusable contract:
- An attack generates a `DamageInfo`
- A hitbox or damage area forwards that damage
- A health component receives and processes it
- The owning character reacts appropriately

This made the system much easier to scale across all enemy and player attack types.

---

### ❤️ Health Controller Architecture
Health handling was separated into dedicated components:
- `Health` as the common base
- `PlayerHealth` for player-specific behavior
- `EnemyHealth` for enemy-specific behavior

This allows:
- Shared core logic for health and damage reception
- Different death / damage reactions depending on owner type
- Cleaner separation between combat logic and actor logic

Instead of storing health directly inside every actor script, health now has a more controlled and modular ownership model.

---

### 🎯 Hitboxes & Precise Hurt Detection
A major part of this devlog was the addition of dedicated hitboxes.

New components include:
- `HitBox`
- `PlayerHitBox`
- `EnemyHitBox`

These hitboxes:
- Represent damageable body regions
- Forward incoming damage to the correct health/controller target
- Allow finer control over what was actually hit

This made it possible to support:
- Precise bullet hits
- Separate player and enemy hurt layers
- Future body-part-specific balancing

---

### 🧱 Layer-Based Combat Filtering
To support reliable hit detection, combat-related layers were refined.

This included:
- Dedicated bullet/projectile layers
- Separate player and enemy hurtbox layers
- Aim / targeting layers
- Collision matrix filtering for combat-specific interactions

This reduces false positives and prevents bullets or abilities from interacting with the wrong objects.

It also made combat more deterministic, especially as the number of attack types increased.

---

### 💥 Multiple Damage Source Support
The damage system now supports a wide variety of sources, including:
- Standard bullet damage
- Melee attacks
- Grenades
- Jump attacks
- Hammer attacks
- Flamethrower damage areas
- Thrown enemy weapons (axe)
- Other scripted attack events

This was important because boss and enemy systems had already introduced attacks with very different behavior and timing.

The damage system now acts as the common language between all of them.

---

### 🎯 Headshot / Damage Modifier Support
Added support for **damage modifiers**, including a headshot bonus.

This means:
- Not all hits are equal
- Certain hitboxes can apply increased damage
- Combat feedback becomes more skill-driven

This adds extra depth to ranged combat and makes precise aiming more rewarding.

---

### 🔥 Friendly Fire Rules
Added friendly fire handling through shared combat rules and filtering.

This allows attacks to correctly distinguish between:
- Player damage
- Enemy damage
- Valid vs invalid friendly targets

This was especially important because the game now includes:
- Player projectiles
- Enemy projectiles
- AoE abilities
- Multiple enemy archetypes operating at once

Without clear friendly-fire rules, the combat layer would become unpredictable very quickly.

---

### 🛡️ Existing System Integration
A large amount of integration work was required across existing systems.

Updated / touched systems included:
- `Bullet`
- `Enemy`
- `EnemyMelee`
- `EnemyRange`
- `EnemyBoss`
- `EnemyAxe`
- `EnemyGrenade`
- `EnemyShield`
- `Flamethrower_DamageArea`
- `Ragdoll`
- `GameManager`
- `LockOnTarget` (renamed from previous target logic)
- Weapon / damage-related scriptable objects

This was necessary to ensure every attack source participates in the same damage pipeline.

---

### 🧪 Combat Dummy & Feel Testing
Added a dummy target to test combat feel and balancing.

This helped validate:
- Base damage values
- Hit feedback
- Modifier behavior
- Different attack types
- Overall combat readability

This was especially useful because so many attack sources were being unified at once.

---

### ✨ Hit Feedback & FX
Additional combat feedback was added, including:
- More hit VFX when damage is applied
- Better readability when attacks connect
- Stronger feedback for impactful hits

This improves both player feel and debugging during balancing.

---

### ⚖️ Rebalancing & Scriptable Object Pass
This devlog also included a broad rebalance pass.

Updated areas include:
- Damage values
- Health values
- Attack tuning
- Scriptable object data for weapons / enemies / abilities

This was necessary because once all damage sources were unified, inconsistencies became much easier to see.

---

## ⚠ Problems Encountered
- Combat logic had become fragmented across many attack types.
- Different systems were applying damage in inconsistent ways.
- Without dedicated hitboxes, precision combat was limited.
- Layer collisions needed much stricter control once hurtboxes and projectiles were separated.
- Friendly fire rules became more important as more projectiles and AoE attacks were added.
- Balancing was difficult before all damage sources used the same pipeline.
- Adding modifiers like headshots required more structure than simple “flat damage” handling.

---

## ✅ Solutions
- Introduced a shared `DamageInfo` pipeline.
- Standardized damage reception through `IDamageable`.
- Split health into `Health`, `PlayerHealth`, and `EnemyHealth`.
- Added dedicated hitbox scripts for player and enemy body regions.
- Refined collision layers and combat filtering rules.
- Unified bullets, grenades, melee attacks, flamethrowers, and boss attacks under the same damage model.
- Added damage modifiers for headshots and other future extensions.
- Used a combat dummy and scriptable object rebalance pass to tune the overall feel.

---

## 🚀 Result
- A functional and scalable **damage / health system**
- Precise hurt detection through hitboxes
- Clear separation between attack delivery and health ownership
- Headshot support and modifier-based damage
- Friendly fire rules that make combat more reliable
- Consistent combat handling across player, enemies, grenades, flamethrowers, and boss abilities
- Better hit feedback and combat readability

This devlog turns combat from a set of disconnected attack scripts into a real **shared gameplay system**.

---

## 📈 Engineering Takeaways
- Damage systems should be treated as shared architecture, not local feature code.
- Hitboxes become essential once combat precision and modifiers matter.
- Interfaces make it much easier to scale combat across many actor types.
- Layers and collision rules are just as important as damage logic.
- Rebalancing becomes easier once all attacks participate in the same pipeline.
- Combat feedback is critical both for player feel and for debugging.

---

## ➡ Next Steps
- Begin implementing **procedural level generation**
- Design a modular system for spawning environments and encounters
- Integrate enemies and combat systems into generated levels
- Ensure scalability and performance for dynamic level creation