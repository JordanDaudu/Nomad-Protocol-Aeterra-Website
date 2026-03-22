---
title: "Devlog 13 – Audio System Foundation"
date: "2026-03-22"
summary: "Implemented a centralized and pooled audio system for scalable, performant sound playback."
order: 13
---

## 🎯 Goal
Design and implement a **scalable audio system** to support:
- Sound effects across gameplay systems
- Performance-safe playback
- Future expansion into music, mixing, and dynamic audio

---

## 🧠 Design Approach
The audio system was designed as a **centralized service**, rather than allowing gameplay systems to create and manage `AudioSource` components directly.

Key principles:
- **Centralization**: All audio playback goes through a single system
- **Object pooling**: Avoid runtime instantiation of audio sources
- **Decoupling**: Gameplay systems request sounds, but do not manage playback
- **Extensibility**: Prepare for future systems like music, mixers, and audio states

This ensures the system remains **clean, performant, and scalable**.

---

## 🏗 Implementation

### 🔊 Audio System Overview
The system routes all sound requests through a central manager, which retrieves reusable audio emitters from a pool.

Each emitter is responsible for:
- Playing the assigned audio clip
- Tracking its playback lifetime
- Following a target if required
- Returning itself to the pool when finished

> *(A full architecture diagram is available in the documentation section.)*

---

### 🎧 Centralized Audio Management
Implemented a **central audio manager** responsible for:
- Receiving audio requests from gameplay systems
- Configuring playback (clip, position, follow target)
- Delegating playback to pooled emitters

This removes the need for:
- Direct `AudioSource` usage in gameplay scripts
- Duplicate or inconsistent audio logic

---

### ♻️ Pooled Audio Emitters
Created a reusable `PooledAudioEmitter`:
- Wraps a Unity `AudioSource`
- Plays assigned clips
- Tracks playback duration
- Returns itself to the pool when finished

Features:
- Lifetime management via coroutine
- Optional follow target support
- Callback system for cleanup
- Safe reuse across multiple sound requests

---

### ⏱ Lifetime & Cleanup Handling
Each emitter:
- Starts playback
- Tracks duration
- Automatically stops and resets when finished

Additional safeguards:
- Stops active coroutines when recycled
- Clears callback references to prevent leaks
- Ensures emitters are always returned to a valid state

---

### 📍 Spatial & Dynamic Audio
The system supports:
- **3D positional audio** (world-based sounds)
- **Follow targets** (e.g., moving enemies or projectiles)

This allows:
- Weapon sounds to follow the player
- Enemy sounds to move dynamically
- Environmental sounds to remain anchored in space

---

### 🔇 System Extensibility
The architecture was designed to support future features:
- Music systems and transitions
- Audio mixer integration
- Volume control (SFX / Music)
- Global mute and audio settings
- Event-driven audio triggers

This ensures the system can grow without refactoring.

---

## ⚠ Problems Encountered
- Creating audio sources dynamically can cause performance spikes.
- Managing multiple overlapping sounds becomes messy without centralization.
- Audio emitters can leave stale references if not properly cleaned.
- Ensuring sounds follow moving targets required additional logic.
- Handling emitter lifecycle safely across reuse cycles was error-prone.

---

## ✅ Solutions
- Implemented object pooling for audio emitters to avoid allocations.
- Centralized all playback through a single audio manager.
- Added lifecycle management with automatic cleanup and recycling.
- Introduced follow-target logic for dynamic spatial audio.
- Ensured emitters reset completely before reuse.

---

## 🚀 Result
- A fully functional **audio system foundation**
- Clean and centralized audio playback architecture
- Improved runtime performance via pooling
- Flexible support for both static and dynamic sound sources
- A scalable base for future audio features

![Audio System Diagram](/devlog-assets/13_1.png)

---

## 📈 Engineering Takeaways
- Centralized systems scale better than distributed logic.
- Object pooling is essential for performance-critical systems like audio.
- Lifecycle management is critical for reusable components.
- Decoupling gameplay from systems improves maintainability.
- Designing for extensibility early prevents major refactors later.

---

## ➡ Next Steps
- Implement a **Player Ability System**
- Refactor player actions into reusable abilities
- Continue improving gameplay modularity and responsiveness
