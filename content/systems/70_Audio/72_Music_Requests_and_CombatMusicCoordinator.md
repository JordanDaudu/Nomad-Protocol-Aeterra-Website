---
title: "Music Requests & Combat Music Coordinator"
summary: "AudioManager resolves music from active requests (priority + recency) and transitions without overlap. CombatMusicCoordinator translates enemy battle-mode events into music requests."
order: 72
status: "In Development"
tags: ["Audio", "Music", "AI", "Events", "State"]
last_updated: "2026-03-20"
---

## 🧭 Overview
Music in the project is **request-driven**.

Instead of a single script “owning” music, multiple systems can request tracks simultaneously:
- Each request returns a `MusicHandle`
- The highest-priority active request becomes the resolved track
- When requests end, releasing handles triggers re-resolution

`CombatMusicCoordinator` is the first system using this model. It listens to enemy battle-mode events and holds music requests while combat is active.

## 🎯 Purpose
- Keep music switching scalable (boss overrides combat, combat overrides exploration, etc.)
- Avoid brittle cross-system coupling (“whoever last called PlayMusic wins”)
- Ensure combat music doesn’t stutter when enemies briefly drop combat state

## 🧠 Design Philosophy
- **Handles are the contract**: if you request a track, you are responsible for releasing it.
- **Priority is data-driven**: `MusicTrackData.priority` controls which track wins.
- **No overlapping tracks**: transitions are fade-out → silence → fade-in.
- **Coordinator owns policy**: `CombatMusicCoordinator` decides *when* to request tracks; `AudioManager` only resolves and plays them.

## 📦 Core Responsibilities
**Does**
- `AudioManager`
  - Maintain `activeMusicRequests` and resolve the desired track
  - Support forced override (`ForcePlayMusic`) and clear (`ClearForcedMusic`)
  - Transition tracks using per-track fade durations (`MusicTrackData.fadeOutDuration` / `fadeInDuration`) and per-track target volume
  - Fall back to `defaultExplorationTrack` when no requests are active

- `CombatMusicCoordinator`
  - Subscribe to enemy lifecycle events:
    - `Enemy.BattleModeEntered`
    - `Enemy.BattleModeExited`
    - `Enemy.Died`
  - Acquire and release music handles per enemy
  - Apply a small “exit combat delay” by keeping a cooldown track alive briefly after combat ends
  - Select track IDs by enemy type:
    - `EnemyBoss` → `bossTrackId`
    - other enemies → `combatTrackId`

**Does NOT**
- Stream/load music dynamically beyond optional `clip.LoadAudioData()` preload
- Crossfade music layers (this is a single-track system)

## 🧱 Key Components
Classes
- `AudioManager` (`code/Audio/AudioManager.cs`)
  - `AcquireMusic(MusicTrackId trackId, Object owner = null) -> MusicHandle`
  - `ForcePlayMusic(MusicTrackId trackId)` / `ClearForcedMusic()`
  - Internal resolution uses request `priority` and `sequence` (newest wins ties)

- `CombatMusicCoordinator` (`code/Audio/CombatMusicCoordinator.cs`)
  - Fields:
    - `bossTrackId`, `combatTrackId`, `cooldownTrackId`
    - `exitCombatDelay`
  - Internal maps:
    - `Dictionary<Enemy, MusicHandle> activeEnemyHandles`
    - `MusicHandle cooldownHandle`

Data
- `MusicTrackData` (`code/Audio/MusicTrackData.cs`)
  - `MusicTrackId trackId`
  - `AudioClip clip`
  - `MusicPriority priority`
  - `float fadeOutDuration`, `fadeInDuration`
  - `float targetVolume`

Enums
- `MusicTrackId` (`code/Audio/MusicTrackId.cs`)
- `MusicPriority` (`code/Audio/MusicPriority.cs`)

## 🔄 Execution Flow
### Music request resolution (AudioManager)
1. A system requests music:
   - `handle = AudioManager.Instance.AcquireMusic(trackId, owner)`
2. `AudioManager` stores a `MusicRequest` record (id, priority, sequence)
3. `ResolveMusic()` chooses the desired track:
   - If `forcedTrackId != None` → forced wins
   - Else choose highest `priority`
   - If same priority, choose newest `sequence`
   - If no requests → `defaultExplorationTrack`
4. If desired != current:
   - Start transition coroutine:
     - fade current to 0
     - stop
     - swap sources
     - fade new track up

### Combat music policy (CombatMusicCoordinator)
1. On `Enemy.BattleModeEntered`:
   - Choose track ID:
     - If `enemy is EnemyBoss` → `bossTrackId`
     - Else → `combatTrackId`
   - Acquire a handle and store it in `activeEnemyHandles`
   - Cancel any pending exit cooldown handle

2. On `Enemy.BattleModeExited` or `Enemy.Died`:
   - Release that enemy’s handle
   - If no active enemies remain:
     - Start a short delay (`exitCombatDelay`)
     - Acquire `cooldownTrackId` for that delay (prevents instantly dropping to exploration)

3. On `OnDisable` / shutdown:
   - Coordinator attempts to release handles through `AudioManager` when available, otherwise clears references safely

## 🔗 Dependencies
**Depends On**
- `AudioManager` (music request API)
- `Enemy` events (`BattleModeEntered`, `BattleModeExited`, `Died`)

**Used By**
- Current: `CombatMusicCoordinator`
- Future: mission/biome systems can request tracks using the same handle model

## ⚠ Constraints & Assumptions
- Music tracks must be configured in `AudioManager.musicTracks`; unconfigured IDs log warnings.
- `CombatMusicCoordinator` relies on enemies firing battle-mode events consistently.
- If `exitCombatDelay` is 0, cooldown is skipped.

## 📈 Scalability & Extensibility
- Add more specialized coordinators (boss phases, low-health, stealth) without changing `AudioManager`.
- Add “music stacking rules” by adding new priority bands in `MusicPriority`.

## ✅ Development Status
In Development

## 📝 Notes
This system is compatible with future coop/multiplayer because requests are owned by systems/objects, not by the player singleton.
