---
title: "Systems"
summary: "Architecture documentation for the implemented Unity gameplay systems."
order: 0
status: "In Development"
tags: ["Systems", "Documentation"]
last_updated: "2026-03-14"
---

This section documents **the systems that actually exist in the codebase** as of **2026-03-14**.

## 🗂 Index

## 🔎 Documentation
- [Doc Conventions](./00_Documentation/01_Doc_Conventions.md)
- [Scripts → Systems Map](./00_Documentation/02_Scripts_To_Systems_Map.md)

### Core
- [Object Pooling](./10_Core/10_Object_Pooling.md)
- [Input Actions Integration](./10_Core/11_Input_Actions_Integration.md)

### Player
- [Player Root Composition](./20_Player/20_Player_Root_Composition.md)
- [Player Movement](./20_Player/21_Player_Movement.md)
- [Player Aim & Camera Target](./20_Player/22_Player_Aim_and_Camera_Target.md)
- [Camera Manager (Cinemachine Distance)](./20_Player/23_Camera_Manager.md)

### Combat
- [Weapons Data (ScriptableObjects)](./30_Combat/30_Weapons_Data_ScriptableObjects.md)
- [Weapon Runtime Model](./30_Combat/31_Weapon_Runtime_Model.md)
- [Player Weapon Controller](./30_Combat/32_Player_Weapon_Controller.md)
- [Weapon Visuals, Rigging & Animation Events](./30_Combat/33_Weapon_Visuals_Rigging_AnimationEvents.md)
- [Projectiles: Bullet, EnemyBullet & Impact FX](./30_Combat/34_Projectiles_Bullet_ImpactFX.md)

### Interaction & Pickups
- [Interaction System](./40_Interaction_and_Pickups/40_Interaction_System.md)
- [Pickups: Weapons & Ammo](./40_Interaction_and_Pickups/41_Pickups_Weapons_and_Ammo.md)

### Enemy
- [Enemy Core Composition](./50_Enemy/50_Enemy_Core_Composition.md)
- [Enemy State Machine](./50_Enemy/51_Enemy_State_Machine.md)
- [Enemy Melee AI](./50_Enemy/52_Enemy_Melee_AI.md)
- [Enemy Ranged AI](./50_Enemy/53_Enemy_Ranged_AI.md)
- [Enemy Visuals & Variant Pipeline](./50_Enemy/54_Enemy_Visuals_and_Variants.md)
- [Enemy Death Pipeline](./50_Enemy/55_Enemy_Death_Pipeline.md)
- [Enemy Shield & Reactions](./50_Enemy/56_Enemy_Shield_and_Reactions.md)
- [Enemy Perception System](./50_Enemy/57_Enemy_Perception_System.md)
- [Cover System](./50_Enemy/58_Cover_System.md)
- [Enemy Range Perks & Abilities](./50_Enemy/59_Enemy_Range_Perks_and_Abilities.md)

## ✅ Scope Rule
These docs describe **implemented systems only**. Future features (new enemy archetypes, missions, etc.) are referenced only as *extension points*.