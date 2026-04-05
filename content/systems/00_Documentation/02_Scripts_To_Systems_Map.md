---
title: "Scripts → Systems Map"
summary: "Quick reference mapping C# scripts in the showcase repo to their corresponding system documentation pages."
order: 2
status: "In Development"
tags: ["Docs", "Navigation", "Map"]
last_updated: "2026-04-05"
---

> This is a navigation aid, not a source of truth.  
> The system docs describe behavior; this page helps you find the relevant scripts quickly.

## 🧠 Core Combat & Damage
**Docs**
- `30_Combat/35_Combat_Targets_and_LockOn.md`
- `30_Combat/36_Damage_and_Hitboxes_System.md`
- `30_Combat/34_Projectiles_Bullet_ImpactFX.md`

**Scripts**
- `Scripts/DamageInfo.cs`
- `Scripts/Interfaces/IDamageable.cs`
- `Scripts/HitBox.cs`
- `Scripts/Player/PlayerHitBox.cs`
- `Scripts/Enemy/EnemyHitBox.cs`
- `Scripts/Managers/Components/Health.cs`
- `Scripts/Managers/Components/PlayerHealth.cs`
- `Scripts/Managers/Components/EnemyHealth.cs`
- `Scripts/Bullet.cs`
- `Scripts/Enemy/EnemyGrenade.cs`
- `Scripts/Enemy/EnemyAxe.cs`
- `Scripts/Enemy/EnemyBoss/Flamethrower_DamageArea.cs`

## 🎯 Targeting / Lock-on
**Docs**
- `30_Combat/35_Combat_Targets_and_LockOn.md`
- `20_Player/22_Player_Aim_and_Camera_Target.md`

**Scripts**
- `Scripts/Managers/Components/CombatTarget.cs`
- `Scripts/LockOnTarget.cs`
- `Scripts/Player/PlayerAim.cs`

## 🧍 Player
**Docs**
- `20_Player/20_Player_Root_Composition.md`
- `20_Player/21_Player_Movement.md`
- `20_Player/22_Player_Aim_and_Camera_Target.md`
- `30_Combat/32_Player_Weapon_Controller.md`
- `40_Interaction & Pickups/41_Pickups_Weapons_and_Ammo.md`

**Scripts**
- `Scripts/Player/Player.cs`
- `Scripts/Player/PlayerMovement.cs`
- `Scripts/Player/PlayerWeaponController.cs`
- `Scripts/Player/PlayerWeaponVisuals.cs`
- `Scripts/Player/Weapon/WeaponData.cs`
- `Scripts/Player/Weapon/Weapon.cs`
- `Scripts/Interaction/Pickups/PickupWeapon.cs`

## 👹 Enemy (shared)
**Docs**
- `50_Enemy/50_Enemy_Core_Composition.md`
- `50_Enemy/57_Enemy_Perception_System.md`
- `50_Enemy/55_Enemy_Death_Pipeline.md`

**Scripts**
- `Scripts/Enemy/Enemy.cs`
- `Scripts/Enemy/EnemyAnimationEvents.cs`
- `Scripts/Enemy/Perception/EnemyPerception.cs`
- `Scripts/Enemy/EnemyDeathDissolve.cs`
- `Scripts/Ragdoll.cs`

## 🗡 Enemy Melee
**Docs**
- `50_Enemy/52_Enemy_Melee_AI.md`
- `50_Enemy/56_Enemy_Shield_and_Reactions.md`

**Scripts**
- `Scripts/Enemy/EnemyMelee/EnemyMelee.cs`
- `Scripts/Enemy/EnemyMelee/States/*`
- `Scripts/Enemy/EnemyShield.cs`
- `Scripts/Enemy/EnemyAxe.cs`
- `Scripts/Enemy/Data/EnemyMeleeWeaponData.cs`

## 🔫 Enemy Range
**Docs**
- `50_Enemy/53_Enemy_Ranged_AI.md`

**Scripts**
- `Scripts/Enemy/EnemyRange/EnemyRange.cs`
- `Scripts/Enemy/EnemyRange/States/*`
- `Scripts/Enemy/Data/EnemyRangeWeaponData.cs`
- Cover system:
  - `Scripts/Enemy/CoverSystem/Cover.cs`
  - `Scripts/Enemy/CoverSystem/CoverPoint.cs`
  - `Scripts/Enemy/CoverSystem/EnemyCoverController.cs`

## 👑 Enemy Boss
**Docs**
- `50_Enemy/60_Enemy_Boss_Archetype.md`

**Scripts**
- `Scripts/Enemy/EnemyBoss/EnemyBoss.cs`
- `Scripts/Enemy/EnemyBoss/EnemyBossVisuals.cs`
- `Scripts/Enemy/EnemyBoss/*State_Boss.cs`
- `Scripts/Enemy/EnemyBoss/Flamethrower_DamageArea.cs`

## 🧪 Tools / Testing
- `Scripts/Dummy.cs` (damage tuning sandbox)

## ✅ Notes
- Audio docs and other systems are documented in their respective sections; this page focuses on scripts touched by the damage-system pass.
