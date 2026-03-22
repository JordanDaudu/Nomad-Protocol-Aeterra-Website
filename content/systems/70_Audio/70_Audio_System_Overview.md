---
title: "Audio System Overview"
summary: "Centralized audio service (AudioManager) providing request-driven music, pooled SFX emitters, ambient loop control, mixer volume routing, and persisted settings."
order: 70
status: "In Development"
tags: ["Audio", "Music", "SFX", "Mixer", "Pooling"]
last_updated: "2026-03-20"
---

## 🧭 Overview
The project’s runtime audio is owned by `AudioManager`.

It is designed as a **single persistent service** (`DontDestroyOnLoad`) that:
- Resolves and plays **music** (request-driven)
- Plays **one-shot SFX** through pooled emitters
- Plays / fades an optional **ambient loop source**
- Applies **mixer volume routing + user settings persistence**

## 🎯 Purpose
Provide one reliable audio surface for the entire project:
- Avoid “audio logic scattered across gameplay scripts”
- Avoid excessive `AudioSource` churn during gameplay via pooling
- Make music behavior deterministic and scalable (multiple systems can request tracks safely)

## 🧠 Design Philosophy
- **Single owner**: `AudioManager` owns all audio routing and state.
- **Request-driven music**: gameplay systems ask for a track and get a `MusicHandle` they must release.
- **Non-overlapping music transitions**: fade current track to silence, then fade in the next.
- **Data-driven cues**: SFX are described by `AudioCue` assets (clips + variation + routing).

## 📦 Core Responsibilities
**Does**
- Music
  - Maintain a music library (`List<MusicTrackData>`) keyed by `MusicTrackId`
  - Resolve the best desired track from active requests
  - Transition tracks with fade-out → silence → fade-in
- SFX
  - Play 2D/3D/UI/ambient one-shots via pooled `PooledAudioEmitter`
  - Route cues to mixer groups based on `AudioBus`
- Settings
  - Apply volumes to `AudioMixer` exposed parameters
  - Persist volumes + mute using `PlayerPrefs`
- Ambient
  - Run a dedicated ambient loop `AudioSource` with fade transitions

**Does NOT**
- Decide *when* combat starts/ends (that lives in gameplay systems like `CombatMusicCoordinator`)
- Provide an event-driven “global audio event bus” (calls are direct for now)
- Automatically attach footstep / weapon SFX to all gameplay (call sites are still added per-feature)

## 🧱 Key Components
Classes
- `AudioManager` (`code/Audio/AudioManager.cs`)
  - Singleton audio service
  - Music request resolution + transitions
  - Emitter pooling and cue playback
  - Mixer volumes + persistence

Assets / Data
- `AudioCue` (`code/Audio/AudioCue.cs`)
  - ScriptableObject for clip selection + variation + routing
- `MusicTrackData` (`code/Audio/MusicTrackData.cs`)
  - ScriptableObject describing a music track (clip, fades, priority)

Enums
- `AudioBus` (`code/Audio/AudioBus.cs`) — routing category (Music/SFX/UI/Ambient)
- `AudioVolumeChannel` (`code/Audio/AudioVolumeChannel.cs`) — volume sliders (Master/Music/Sfx2D/Sfx3D/UI/Ambient)
- `MusicTrackId` / `MusicPriority`

## 🔄 Execution Flow
1. **Awake** (`AudioManager.Awake()`)
   - Enforces singleton and persists via `DontDestroyOnLoad`
   - Builds music lookup from `musicTracks`
   - Assigns mixer groups to dedicated music sources and ambient loop source
   - Creates the initial `PooledAudioEmitter` pool
   - Optionally preloads music clip audio data (`preloadMusicOnAwake`)
   - Loads saved settings (if enabled)
   - Applies mixer volumes and optional start-muted behavior

2. **Start**
   - Calls `ResolveMusic()` so the default exploration track begins if no requests are present

3. **Runtime usage**
   - Music:
     - Systems call `AcquireMusic(trackId)` and hold the returned `MusicHandle`
     - When the handle is released, music resolution is recalculated
   - SFX:
     - Systems call `PlayCue2D()`, `PlayCue3D()`, `PlayUICue()`, or `PlayAmbientOneShot()`
     - Manager pulls a pooled emitter, configures it, plays, then recycles it

4. **Shutdown safety**
   - `OnApplicationQuit()` / `OnDestroy()` set `isShuttingDown` so no new transition coroutines are started late in shutdown

## 🔗 Dependencies
**Depends On**
- Unity: `AudioMixer`, `AudioSource`, `PlayerPrefs`
- `PooledAudioEmitter` (pooled one-shot playback)

**Used By**
- `CombatMusicCoordinator` (requests music based on enemies entering/exiting battle mode)

## ⚠ Constraints & Assumptions
- Mixer must expose the parameter names configured in the inspector (e.g., `MasterVolume`, `MusicVolume`, etc.).
- Music sources (`musicSourceA`, `musicSourceB`) must be assigned and routed to the music mixer group.
- If no `emitterPrefab` is provided, `AudioManager` will create emitters at runtime.

## 📈 Scalability & Extensibility
- Add more call sites gradually by referencing `AudioCue` assets from gameplay systems.
- Add “cooldowns / polyphony caps” per `AudioBus` if needed (spam control).
- Expand music transitions (stingers, layers) without changing call sites by keeping the request model.

## ✅ Development Status
In Development

## 📝 Notes
See:
- `71_Audio_Cues_Routing_and_Emitter_Pooling.md` (SFX)
- `72_Music_Requests_and_CombatMusicCoordinator.md` (music)
- `73_Audio_Volumes_Mixer_and_Persistence.md` (settings)
