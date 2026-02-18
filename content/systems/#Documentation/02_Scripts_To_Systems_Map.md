---
title: "Scripts → Systems Map"
summary: "Mapping of every custom script to its owning system documentation."
order: 2
status: "In Development"
tags: ["Systems", "Docs", "Mapping"]
last_updated: "2026-02-18"
---

# Scripts → Systems Map

Primary ownership mapping (one script → one “home” system doc).

| System Doc | Script/Class | File Path |
|---|---|---|
| Core/Object Pooling | `ObjectPool` | `Scripts/Object Pool/ObjectPool.cs` |
| Core/Object Pooling | `PooledObject` | `Scripts/Object Pool/PooledObject.cs` |
| Core/Input Actions Integration | `Player (enables InputSystem_Actions)` | `Scripts/Player/Player.cs` |
| Player/Movement | `PlayerMovement` | `Scripts/Player/PlayerMovement.cs` |
| Player/Aim & Camera Target | `PlayerAim` | `Scripts/Player/PlayerAim.cs` |
| Player/Camera Manager | `CameraManager` | `Scripts/CameraManager.cs` |
| Combat/Weapons Data | `WeaponData` | `Scripts/Weapon/WeaponData.cs` |
| Combat/Weapon Runtime Model | `Weapon` | `Scripts/Weapon/Weapon.cs` |
| Combat/Weapon Visual Models | `WeaponModel` | `Scripts/Weapon/WeaponModel.cs` |
| Combat/Weapon Visual Models | `BackupWeaponModel` | `Scripts/Weapon/BackupWeaponModel.cs` |
| Combat/Player Weapon Controller | `PlayerWeaponController` | `Scripts/Player/PlayerWeaponController.cs` |
| Combat/Weapon Visuals & Rigging | `PlayerWeaponVisuals` | `Scripts/Player/PlayerWeaponVisuals.cs` |
| Combat/Weapon Visuals & Rigging | `PlayerAnimationEvents` | `Scripts/Player/PlayerAnimationEvents.cs` |
| Combat/Projectiles | `Bullet` | `Scripts/Bullet.cs` |
| Interaction | `Interactable` | `Scripts/Interactable.cs` |
| Interaction | `PlayerInteraction` | `Scripts/Player/PlayerInteraction.cs` |
| Interaction/Pickups | `PickupWeapon` | `Scripts/Pickups/PickupWeapon.cs` |
| Interaction/Pickups | `PickupAmmo` | `Scripts/Pickups/PickupAmmo.cs` |
| Player/Aim & Camera Target | `Target (aim lock marker)` | `Scripts/Target.cs` |


## 📝 Note
Some scripts participate in multiple systems (e.g., `PlayerWeaponController` depends on `ObjectPool`). This table shows the *primary* place we document each script.
