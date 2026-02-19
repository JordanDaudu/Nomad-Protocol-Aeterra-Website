---
title: "Systems"
summary: "Architecture documentation for the implemented Unity gameplay systems."
order: 0
status: "In Development"
tags: ["Systems", "Documentation"]
last_updated: "2026-02-19"
---

This section documents **the systems that actually exist in the codebase** as of **2026-02-19**.

## 🗂 Index
## 🔎 Documentation
- [Doc Conventions](#Documentation/01_Doc_Conventions.md)
- [Scripts → Systems Map](#Documentation/02_Scripts_To_Systems_Map.md)

### Combat
- [Weapons Data (ScriptableObjects)](./Combat/30_Weapons_Data_ScriptableObjects.md)
- [Weapon Runtime Model](./Combat/31_Weapon_Runtime_Model.md)
- [Player Weapon Controller](./Combat/32_Player_Weapon_Controller.md)
- [Weapon Visuals, Rigging & Animation Events](./Combat/33_Weapon_Visuals_Rigging_AnimationEvents.md)
- [Projectiles: Bullet & Impact FX](./Combat/34_Projectiles_Bullet_ImpactFX.md)

### Core
- [Object Pooling](./Core/10_Object_Pooling.md)
- [Input Actions Integration](./Core/11_Input_Actions_Integration.md)

### Interaction & Pickups
- [Interaction System](./Interaction/40_Interaction_System.md)
- [Pickups: Weapons & Ammo](./Interaction/41_Pickups_Weapons_and_Ammo.md)

### Player
- [Player Root Composition](./Player/20_Player_Root_Composition.md)
- [Player Movement](./Player/21_Player_Movement.md)
- [Player Aim & Camera Target](./Player/22_Player_Aim_and_Camera_Target.md)
- [Camera Manager (Cinemachine Distance)](./Player/23_Camera_Manager.md)

## ✅ Scope Rule
These docs intentionally avoid describing future features (enemy AI, damage, missions, etc.) unless explicitly marked as **future extension points**.
