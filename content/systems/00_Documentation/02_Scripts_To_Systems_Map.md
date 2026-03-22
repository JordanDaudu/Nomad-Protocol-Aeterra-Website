---
title: "Scripts → Systems Map"
summary: "Mapping of every custom script to its owning system documentation (primary ownership)."
order: 2
status: "In Development"
tags: ["Systems", "Docs", "Mapping"]
last_updated: "2026-03-20"
---

Primary ownership mapping (one script → one “home” system doc).

| System Doc | Script/Class | File Path |
|---|---|---|
| Core/Object Pooling | `ObjectPool` | `code/Object Pool/ObjectPool.cs` |
| Core/Object Pooling | `PooledObject` | `code/Object Pool/PooledObject.cs` |
| Core/Object Pooling | `IPoolable` | `code/Object Pool/IPoolable.cs` |
| Core/Input Actions Integration | `Player` (enables `InputSystem_Actions`) | `code/Player/Player.cs` |
| Player/Movement | `PlayerMovement` | `code/Player/PlayerMovement.cs` |
| Player/Aim & Camera Target | `PlayerAim` | `code/Player/PlayerAim.cs` |
| Player/Abilities | `PlayerAbility` | `code/Player/Abilities/PlayerAbility.cs` |
| Player/Abilities | `PlayerAbilityController` | `code/Player/Abilities/PlayerAbilityController.cs` |
| Player/Abilities | `PlayerRollAbility` | `code/Player/Abilities/PlayerRollAbility.cs` |
| Player/Camera Manager | `CameraManager` | `code/CameraManager.cs` |
| Combat/Weapons Data | `WeaponData` | `code/Weapon/WeaponData.cs` |
| Combat/Weapon Runtime Model | `Weapon` | `code/Weapon/Weapon.cs` |
| Combat/Weapon Visual Models | `WeaponModel` | `code/Weapon/WeaponModel.cs` |
| Combat/Weapon Visual Models | `BackupWeaponModel` | `code/Weapon/BackupWeaponModel.cs` |
| Combat/Player Weapon Controller | `PlayerWeaponController` | `code/Player/PlayerWeaponController.cs` |
| Combat/Weapon Visuals & Rigging | `PlayerWeaponVisuals` | `code/Player/PlayerWeaponVisuals.cs` |
| Combat/Weapon Visuals & Rigging | `PlayerAnimationEvents` | `code/Player/PlayerAnimationEvents.cs` |
| Combat/Projectiles | `Bullet` | `code/Bullet.cs` |
| Interaction | `Interactable` | `code/Interactable.cs` |
| Interaction | `PlayerInteraction` | `code/Player/PlayerInteraction.cs` |
| Interaction/Pickups | `PickupWeapon` | `code/Pickups/PickupWeapon.cs` |
| Interaction/Pickups | `PickupAmmo` | `code/Pickups/PickupAmmo.cs` |
| Player/Aim & Camera Target | `Target` (aim lock marker) | `code/Target.cs` |
| Enemy/Core Composition | `Enemy` | `code/Enemy/Enemy.cs` |
| Enemy/Perception System | `EnemyPerception` | `code/Enemy/Perception/EnemyPerception.cs` |
| Enemy/State Machine | `EnemyStateMachine` | `code/Enemy/StateMachine/EnemyStateMachine.cs` |
| Enemy/State Machine | `EnemyState` | `code/Enemy/StateMachine/EnemyState.cs` |
| Enemy/Melee AI | `EnemyMelee` | `code/Enemy/EnemyMelee/EnemyMelee.cs` |
| Enemy/Melee AI | `IdleState_Melee` | `code/Enemy/EnemyMelee/IdleState_Melee.cs` |
| Enemy/Melee AI | `MoveState_Melee` | `code/Enemy/EnemyMelee/MoveState_Melee.cs` |
| Enemy/Melee AI | `ChaseState_Melee` | `code/Enemy/EnemyMelee/ChaseState_Melee.cs` |
| Enemy/Melee AI | `AttackState_Melee` | `code/Enemy/EnemyMelee/AttackState_Melee.cs` |
| Enemy/Melee AI | `RecoveryState_Melee` | `code/Enemy/EnemyMelee/RecoveryState_Melee.cs` |
| Enemy/Melee AI | `AbilityState_Melee` | `code/Enemy/EnemyMelee/AbilityState_Melee.cs` |
| Enemy/Melee AI | `DeadState_Melee` | `code/Enemy/EnemyMelee/DeadState_Melee.cs` |
| Enemy/Ranged AI | `EnemyRange` | `code/Enemy/EnemyRange/EnemyRange.cs` |
| Enemy/Ranged AI | `IdleState_Range` | `code/Enemy/EnemyRange/IdleState_Range.cs` |
| Enemy/Ranged AI | `MoveState_Range` | `code/Enemy/EnemyRange/MoveState_Range.cs` |
| Enemy/Ranged AI | `BattleState_Range` | `code/Enemy/EnemyRange/BattleState_Range.cs` |
| Enemy/Ranged AI | `RunToCoverState_Range` | `code/Enemy/EnemyRange/RunToCoverState_Range.cs` |
| Enemy/Ranged AI | `AdvanceToPlayer_Range` | `code/Enemy/EnemyRange/AdvanceToPlayer_Range.cs` |
| Enemy/Ranged AI | `ThrowGrenadeState_Range` | `code/Enemy/EnemyRange/ThrowGrenadeState_Range.cs` |
| Enemy/Ranged AI | `DeadState_Range` | `code/Enemy/EnemyRange/DeadState_Range.cs` |
| Enemy/Ranged AI | `EnemyRangeWeaponData` | `code/Enemy/Data/EnemyRangeWeaponData.cs` |
| Enemy/Cover System | `Cover` | `code/Enemy/CoverSystem/Cover.cs` |
| Enemy/Cover System | `CoverPoint` | `code/Enemy/CoverSystem/CoverPoint.cs` |
| Enemy/Cover System | `EnemyCoverController` | `code/Enemy/CoverSystem/EnemyCoverController.cs` |
| Enemy/Visuals & Variants | `EnemyVisuals` | `code/Enemy/EnemyVisuals.cs` |
| Enemy/Visuals & Variants | `EnemyWeaponModel` | `code/Enemy/EnemyWeaponModel.cs` |
| Enemy/Visuals & Variants | `EnemyMeleeWeaponModel` | `code/Enemy/EnemyMeleeWeaponModel.cs` |
| Enemy/Visuals & Variants | `EnemyRangeWeaponModel` | `code/Enemy/EnemyRangeWeaponModel.cs` |
| Enemy/Visuals & Variants | `EnemySecondaryRangeWeaponModel` | `code/Enemy/EnemyRange/EnemySecondaryRangeWeaponModel.cs` |
| Enemy/Visuals & Variants | `EnemyCorruptionCrystal` | `code/Enemy/EnemyCorruptionCrystal.cs` |
| Enemy/Visuals & Variants | `EnemyMeleeWeaponData` | `code/Enemy/Data/EnemyMeleeWeaponData.cs` |
| Enemy/Death Pipeline | `EnemyRagdoll` | `code/Enemy/EnemyRagdoll.cs` |
| Enemy/Death Pipeline | `EnemyDeathDissolve` | `code/Enemy/EnemyDeathDissolve.cs` |
| Enemy/Shield & Reactions | `EnemyShield` | `code/Enemy/EnemyShield.cs` |
| Enemy/Animation Events | `EnemyAnimationEvents` | `code/Enemy/EnemyAnimationEvents.cs` |
| Enemy/Projectiles | `EnemyAxe` | `code/Enemy/EnemyAxe.cs` |
| Combat/Projectiles | `EnemyBullet` | `code/Enemy/EnemyBullet.cs` |
| Combat/Projectiles | `EnemyGrenade` | `code/Enemy/EnemyGrenade.cs` |

| Enemy/Boss Archetype | `EnemyBoss` | `code/Enemy/EnemyBoss/EnemyBoss.cs` |
| Enemy/Boss Archetype | `EnemyBossVisuals` | `code/Enemy/EnemyBoss/EnemyBossVisuals.cs` |
| Enemy/Boss Archetype | `IdleState_Boss` | `code/Enemy/EnemyBoss/IdleState_Boss.cs` |
| Enemy/Boss Archetype | `MoveState_Boss` | `code/Enemy/EnemyBoss/MoveState_Boss.cs` |
| Enemy/Boss Archetype | `TurnToPlayerState_Boss` | `code/Enemy/EnemyBoss/TurnToPlayerState_Boss.cs` |
| Enemy/Boss Archetype | `AttackState_Boss` | `code/Enemy/EnemyBoss/AttackState_Boss.cs` |
| Enemy/Boss Archetype | `JumpAttackState_Boss` | `code/Enemy/EnemyBoss/JumpAttackState_Boss.cs` |
| Enemy/Boss Archetype | `AbilityState_Boss` | `code/Enemy/EnemyBoss/AbilityState_Boss.cs` |
| Enemy/Boss Archetype | `DeadState_Boss` | `code/Enemy/EnemyBoss/DeadState_Boss.cs` |

| Audio/System Overview | `AudioManager` | `code/Audio/AudioManager.cs` |
| Audio/Cues & Emitter Pooling | `AudioCue` | `code/Audio/AudioCue.cs` |
| Audio/Cues & Emitter Pooling | `PooledAudioEmitter` | `code/Audio/PooledAudioEmitter.cs` |
| Audio/Music Requests | `CombatMusicCoordinator` | `code/Audio/CombatMusicCoordinator.cs` |
| Audio/Music Requests | `MusicTrackData` | `code/Audio/MusicTrackData.cs` |
| Audio/Music Requests | `MusicTrackId` | `code/Audio/MusicTrackId.cs` |
| Audio/Music Requests | `MusicPriority` | `code/Audio/MusicPriority.cs` |
| Audio/Volumes & Routing | `AudioBus` | `code/Audio/AudioBus.cs` |
| Audio/Volumes & Routing | `AudioVolumeChannel` | `code/Audio/AudioVolumeChannel.cs` |
| Audio/Legacy | `SoundManager` | `code/Audio/SoundManager.cs` |

## 📝 Note
Some scripts participate in multiple systems (e.g., `Bullet` interacts with `EnemyShield` and `Enemy`). This table shows the *primary* place each script is documented.
