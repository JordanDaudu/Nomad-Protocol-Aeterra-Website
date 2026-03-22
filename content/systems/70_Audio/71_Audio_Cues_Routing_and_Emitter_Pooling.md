---
title: "Audio Cues, Routing & Emitter Pooling"
summary: "AudioCue ScriptableObjects describe SFX playback and routing. AudioManager plays them via pooled PooledAudioEmitter instances and routes them through AudioBus mixer groups."
order: 71
status: "In Development"
tags: ["Audio", "SFX", "ScriptableObject", "Pooling", "Routing"]
last_updated: "2026-03-20"
---

## 🧭 Overview
SFX playback is **data-driven** via `AudioCue` assets and **runtime-driven** via pooled `PooledAudioEmitter` instances.

At runtime:
- A system requests playback (`AudioManager.PlayCue2D/3D/UICue/...`)
- `AudioManager` acquires a pooled emitter
- The emitter configures its `AudioSource` using the `AudioCue`
- The emitter plays and then recycles back to the pool

## 🎯 Purpose
- Keep SFX tuning in assets (clip lists, volume/pitch variation, spatial distances)
- Avoid instantiating/destroying `AudioSource` objects during gameplay
- Keep routing consistent (all cues go through mixer groups via `AudioBus`)

## 🧠 Design Philosophy
- **Cues are the unit of sound design**: gameplay references `AudioCue`, not raw `AudioClip`.
- **Pooling by default**: emitters are reused to prevent spikes and garbage.
- **Routing lives in data**: `AudioBus` on the cue determines which mixer group is used.

## 📦 Core Responsibilities
**Does**
- `AudioCue`
  - Select random clip (`GetRandomClip()`)
  - Provide random volume/pitch within ranges
  - Provide routing metadata (bus + spatial settings)
- `PooledAudioEmitter`
  - Configure an `AudioSource` from a cue
  - Optionally follow a `Transform` while playing
  - Recycle itself back to `AudioManager`
- `AudioManager`
  - Maintain an emitter pool
  - Assign mixer group per cue bus
  - Recycle emitters when finished

**Does NOT**
- Guarantee that every gameplay feature plays sound yet (call sites are added over time)
- Provide built-in “cooldowns per cue” (not implemented yet)

## 🧱 Key Components
Assets
- `AudioCue` (`code/Audio/AudioCue.cs`)
  - Fields:
    - `AudioBus bus`
    - `AudioClip[] clips`
    - `bool loop`
    - `float spatialBlend`, `minDistance`, `maxDistance`
    - `Vector2 volumeRange`, `pitchRange`
  - Routing helper:
    - `GetResolvedSpatialBlend()` forces 2D blend for `Sfx2D`, `UI`, and `Ambient`

Classes
- `PooledAudioEmitter` (`code/Audio/PooledAudioEmitter.cs`)
  - Owns a single `AudioSource`
  - `Play(AudioCue cue, Vector3 position, Transform followTarget, Action<PooledAudioEmitter> onFinished)`
  - `StopAndRecycle()`

- `AudioManager` (`code/Audio/AudioManager.cs`)
  - Pool:
    - `Queue<PooledAudioEmitter> availableEmitters`
    - `initialEmitterPoolSize`
    - `AcquireEmitter()` / `RecycleEmitter()` (internal)

Routing
- `AudioBus` (`code/Audio/AudioBus.cs`)
  - `Music`, `Sfx2D`, `Sfx3D`, `UI`, `Ambient`

## 🔄 Execution Flow
1. System calls `AudioManager.Instance.PlayCue3D(cue, position, followTarget)`
2. `AudioManager`:
   - Picks a clip (`cue.GetRandomClip()`)
   - Acquires a pooled `PooledAudioEmitter`
   - Routes emitter’s `AudioSource.outputAudioMixerGroup` by `cue.bus`
   - Applies:
     - `loop`
     - `volume` (randomized)
     - `pitch` (randomized)
     - `spatialBlend` (resolved via `GetResolvedSpatialBlend()`)
     - `minDistance` / `maxDistance`
   - Starts playback
3. `PooledAudioEmitter`:
   - Optionally follows the provided transform in `Update()`
   - When clip finishes (or when stopped), invokes `onFinished` and returns to the pool

## 🔗 Dependencies
**Depends On**
- Unity: `AudioSource`, `AudioMixerGroup`

**Used By**
- Any gameplay system that holds an `AudioCue` reference and calls `AudioManager`

## ⚠ Constraints & Assumptions
- If a cue has no clips, playback becomes a no-op.
- Pool size is fixed at startup (initial pool creation). If the pool is exhausted, behavior depends on `AudioManager`’s internal acquire path (it can create additional emitters if needed).
- Spatial behavior is intentionally bus-driven:
  - `Sfx2D`, `UI`, `Ambient` → forced 2D (`spatialBlend = 0`)
  - `Sfx3D` → uses `AudioCue.spatialBlend`

## 📈 Scalability & Extensibility
- Add new `AudioBus` entries if you need more routing lanes.
- Add bus-level voice limits / cooldowns if cue spam becomes an issue.
- Add “one-shot instance limits” per cue if needed (e.g., max 3 overlapping impacts).

## ✅ Development Status
In Development

## 📝 Notes
The pooling design is intentionally compatible with future multiplayer/coop because emitters are stateless objects configured per playback request.
