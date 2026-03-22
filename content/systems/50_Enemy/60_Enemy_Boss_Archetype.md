---
title: "Enemy Boss (Archetype + Attacks)"
summary: "Boss archetype built on Enemy + FSM with weapon-type specific abilities (Hammer jump/slam, Flamethrower) and dedicated visuals coordination."
order: 60
status: "In Development"
tags: ["Enemy", "Boss", "AI", "FSM", "VFX"]
last_updated: "2026-03-20"
---

## 🧭 Overview
`EnemyBoss` is a distinct enemy archetype that still reuses the shared `Enemy` infrastructure (health, NavMeshAgent, perception, battle-mode events), but runs its own **boss-only state machine** and **attack presentation layer**.

In code terms:
- `EnemyBoss : Enemy`
- Owns a boss FSM (`EnemyStateMachine`) with boss states (`*State_Boss`)
- Owns a dedicated visuals coordinator (`EnemyBossVisuals`) for jump-zone previews, impact FX, flamethrower FX, and weapon model toggles

## 🎯 Purpose
Provide a “capstone” combatant that demonstrates:
- A scalable FSM architecture (boss-only decision loop)
- Weapon-type branching without copying a whole archetype
- Clear coordination between gameplay (damage / knockback) and visuals (landing zones, particles, trails)

## 🧠 Design Philosophy
- **Boss is an archetype, not a modifier**: the boss gets its own state set instead of bolting special cases into melee/ranged.
- **Animation-driven timing**: jump impact timing and ability execution are synced through animation event relays (`AnimationTrigger()` / `AbilityTrigger()`).
- **Visuals are composed**: `EnemyBossVisuals` owns VFX and model toggling so `EnemyBoss` stays focused on gameplay decisions.

## 📦 Core Responsibilities
**Does**
- Construct and tick a boss FSM (`idle → move → attack / jump / ability / dead`).
- Decide between actions with cooldowns and randomization:
  - Standard attack when in range + facing
  - Jump attack / ability action from `MoveState_Boss` after `ActionCooldown`
- Apply **area damage + physics impulse** for jump impact (`Physics.OverlapSphere` + `Rigidbody.AddExplosionForce`).
- Coordinate ability VFX (flamethrower activation, battery fill, zone FX) through `EnemyBossVisuals`.

**Does NOT**
- Implement generic perception or battle-mode rules (delegates to base `Enemy` + `EnemyPerception`).
- Own cover logic or ranged weapon systems (those remain in `EnemyRange`).
- Provide data-driven boss attacks via ScriptableObjects (boss tuning is currently inspector-driven fields).

## 🧱 Key Components
Classes
- `EnemyBoss` (`code/Enemy/EnemyBoss/EnemyBoss.cs`)
  - Boss setup + high-level action decision helpers
  - Jump impact damage logic (`JumpAttackImpact`)
  - Ability decision + cooldown management

- Boss states (`code/Enemy/EnemyBoss/*State_Boss.cs`)
  - `IdleState_Boss`
  - `MoveState_Boss`
  - `TurnToPlayerState_Boss`
  - `AttackState_Boss`
  - `JumpAttackState_Boss`
  - `AbilityState_Boss`
  - `DeadState_Boss`

- `EnemyBossVisuals` (`code/Enemy/EnemyBoss/EnemyBossVisuals.cs`)
  - Flamethrower particles + activation prefab
  - Jump landing-zone / impact-zone FX previews
  - Hammer trail toggling
  - Flamethrower “battery” fill UI scaling (based on cooldown)

Data / Enums
- `BossWeaponType` (currently: `FlameThrower`, `Hammer`)

## 🔄 Execution Flow
1. **Awake (boss initialization)**
   - Creates an `EnemyStateMachine`
   - Instantiates boss states and stores references (properties)
   - Caches `EnemyBossVisuals`

2. **Start**
   - Initializes FSM to `idleState`
   - Sets `abilityCooldownTimer = abilityCooldown`

3. **Update (per frame)**
   - Calls `base.Update()` (ticks perception + battle-mode entry)
   - Ticks the boss FSM: `stateMachine.currentState.Update()`
   - (Boss also calls `ShouldEnterBattleMode()` again after state update.)

4. **Combat loop examples**
   - `IdleState_Boss`:
     - If `inBattleMode` and `PlayerInAttackRange()`:
       - If `IsFacingPlayerForAttack()` → `AttackState_Boss`
       - Else → `TurnToPlayerState_Boss`
     - Otherwise transitions to patrol `MoveState_Boss` on timer

   - `MoveState_Boss`:
     - Patrol movement when not in battle
     - In battle:
       - Pursues player/known position
       - Chooses actions when `actionTimer` elapses:
         - `AbilityState_Boss` if off cooldown
         - Otherwise `JumpAttackState_Boss`

   - `JumpAttackState_Boss`:
     - Captures landing target (`enemy.GetKnownPlayerPosition()`)
     - Spawns landing preview FX (`bossVisuals.PlayJumpAttackZoneFX`)
     - During animation event:
       - `AbilityTrigger()` triggers gameplay impact
       - `AnimationTrigger()` exits into `MoveState_Boss`

   - `AbilityState_Boss`:
     - Branches per `BossWeaponType`:
       - Flamethrower: starts particles + updates battery fill each frame
       - Hammer: enables/disables weapon trail and plays zone VFX

5. **Death**
   - Boss enters `DeadState_Boss` and runs the same core death pipeline as `Enemy` (ragdoll + dissolve composition), while also ensuring boss-specific VFX are turned off (flamethrower / trails / zones).

## 🔗 Dependencies
**Depends On**
- Unity: `NavMeshAgent`, `Animator`, physics (`OverlapSphere`, `Rigidbody.AddExplosionForce`)
- `EnemyPerception` (inherited requirement via `Enemy`)
- `EnemyBossVisuals` (boss-specific VFX & model control)

**Used By**
- `CombatMusicCoordinator` (treats `EnemyBoss` as a boss combatant for music selection)

## ⚠ Constraints & Assumptions
- Boss animator must contain bool parameters matching state names used in constructors (`"Idle"`, `"Move"`, `"Attack"`, `"JumpAttack"`, `"Ability"`, `"TurnToPlayer"`, `"Dead"`).
- Jump impact uses a **fixed radius + damage** (inspector-driven), and applies knockback only to objects with `Rigidbody`.
- Ability cooldown and action cooldown are simple timers (no external pacing system yet).

## 📈 Scalability & Extensibility
- Add new boss weapons by extending `BossWeaponType` and branching in `EnemyBossVisuals` + relevant boss states.
- Add more boss actions by introducing new states (preferred) rather than adding more conditional logic inside `MoveState_Boss`.
- If future bosses need data-driven tuning, migrate boss attack parameters into ScriptableObjects similar to the weapon system.

## ✅ Development Status
In Development

## 📝 Notes
- Boss uses the shared perception memory (`EnemyPerception.KnownTargetPosition`) so it can continue acting briefly after LOS breaks.
- Boss VFX are intentionally centralized in `EnemyBossVisuals` so states don’t fight over particle systems and model toggles.
