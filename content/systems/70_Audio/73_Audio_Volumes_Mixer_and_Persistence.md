---
title: "Volumes, Mixer Integration & Persistence"
summary: "AudioManager applies per-channel volumes (Master/Music/SFX/UI/Ambient) to AudioMixer exposed parameters and persists settings via PlayerPrefs."
order: 73
status: "In Development"
tags: ["Audio", "Mixer", "Settings", "PlayerPrefs"]
last_updated: "2026-03-20"
---

## 🧭 Overview
`AudioManager` owns the project’s runtime volume state:
- `masterVolume`, `musicVolume`, `sfx2DVolume`, `sfx3DVolume`, `uiVolume`, `ambientVolume`
- `isMuted`

It writes these values to an `AudioMixer` using exposed parameter names configured in the inspector.

## 🎯 Purpose
- Make audio settings consistent and centralized
- Allow UI sliders to control audio channels via `AudioManager.SetVolume(...)`
- Persist user settings across sessions

## 🧠 Design Philosophy
- **Normalized volumes (0..1)** are stored in code and assets.
- Mixer parameters are written in **decibels** (log scale) for perceptual correctness.
- Persistence is **optional** (`loadAndSaveSettings`).

## 📦 Core Responsibilities
**Does**
- Apply volumes to the mixer on startup and whenever values change
- Convert normalized volume to dB:
  - `volume <= ~0` → `-80dB` (effectively silent)
  - otherwise `20 * log10(volume)`
- Persist settings to PlayerPrefs:
  - Float keys: `Audio.Master`, `Audio.Music`, `Audio.Sfx2D`, `Audio.Sfx3D`, `Audio.UI`, `Audio.Ambient`
  - Int key: `Audio.Muted`

**Does NOT**
- Provide an in-game settings UI by itself (UI should call into this API)
- Clamp or validate mixer parameter names beyond null/empty checks

## 🧱 Key Components
- `AudioVolumeChannel` (`code/Audio/AudioVolumeChannel.cs`)
  - `Master`, `Music`, `Sfx2D`, `Sfx3D`, `UI`, `Ambient`

- `AudioManager` (`code/Audio/AudioManager.cs`)
  - Inspector fields:
    - `AudioMixer mainMixer`
    - exposed parameter strings (e.g., `masterVolumeParameter = "MasterVolume"`)
  - Public API:
    - `GetVolume(AudioVolumeChannel channel)`
    - `SetVolume(AudioVolumeChannel channel, float normalizedVolume)`
    - `SetMuted(bool muted)` / `IsMuted()`

## 🔄 Execution Flow
1. **Awake**
   - Optionally loads saved settings (`LoadSettings()`) from PlayerPrefs
   - Applies all volumes to mixer (`ApplyAllMixerVolumes()`)

2. **Runtime changes**
   - UI or debug input calls:
     - `SetVolume(channel, value)`
     - `SetMuted(muted)`
   - `AudioManager`:
     - Updates stored normalized value
     - Writes to mixer with `SetMixerVolume(parameterName, normalizedVolume)`
     - Saves to PlayerPrefs if enabled

3. **Mute behavior**
   - Mute only affects the master volume write:
     - master parameter is written as `0` (normalized) when muted
     - other channels are still written (so unmute restores the prior mix)

## 🔗 Dependencies
**Depends On**
- Unity: `AudioMixer`, `PlayerPrefs`

## ⚠ Constraints & Assumptions
- Mixer must expose the configured parameter names.
- Parameter values are written every time volumes change; avoid calling `SetVolume` every frame.

## 📈 Scalability & Extensibility
- If you add a new bus/channel, add:
  - an `AudioVolumeChannel` entry
  - an exposed mixer parameter
  - a field + PlayerPrefs key
  - a line in `ApplyAllMixerVolumes()`

## ✅ Development Status
In Development

## 📝 Notes
There is also a legacy `SoundManager` script in the project that controls music + mute, but the current systems are built around `AudioManager`.
