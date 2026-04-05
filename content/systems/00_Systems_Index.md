---
title: "Systems"
summary: "Architecture documentation for the implemented Unity gameplay systems."
order: 0
status: "In Development"
tags: ["Systems", "Documentation"]
last_updated: "2026-04-05"
---

This section documents **the systems that actually exist in the codebase** as of **2026-03-20**.

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
- [Player Abilities](./20_Player/24_Player_Abilities.md)

### Combat
- [Weapons Data (ScriptableObjects)](./30_Combat/30_Weapons_Data_ScriptableObjects.md)
- [Weapon Runtime Model](./30_Combat/31_Weapon_Runtime_Model.md)
- [Player Weapon Controller](./30_Combat/32_Player_Weapon_Controller.md)
- [Weapon Visuals, Rigging & Animation Events](./30_Combat/33_Weapon_Visuals_Rigging_AnimationEvents.md)
- [Projectiles: Bullet, EnemyBullet & Impact FX](./30_Combat/34_Projectiles_Bullet_ImpactFX.md)
- [Combat Targets And LockOn](./30_Combat/35_Combat_Targets_and_LockOn.md)
- [Damage And Hitboxes System](./30_Combat/36_Damage_and_Hitboxes_System.md)

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
- [Enemy Boss (Archetype + Attacks)](./50_Enemy/60_Enemy_Boss_Archetype.md)

### Audio
- [Audio System Overview](./70_Audio/70_Audio_System_Overview.md)
- [Audio Cues, Routing & Emitter Pooling](./70_Audio/71_Audio_Cues_Routing_and_Emitter_Pooling.md)
- [Music Requests & Combat Music Coordinator](./70_Audio/72_Music_Requests_and_CombatMusicCoordinator.md)
- [Volumes, Mixer Integration & Persistence](./70_Audio/73_Audio_Volumes_Mixer_and_Persistence.md)

## ✅ Scope Rule
These docs describe **implemented systems only**. Future features (new enemy archetypes, missions, etc.) are referenced only as *extension points*.
