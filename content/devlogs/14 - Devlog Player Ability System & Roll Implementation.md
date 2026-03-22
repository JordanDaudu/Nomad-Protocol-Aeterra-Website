---
title: "Devlog 14 – Player Ability System & Roll Implementation"
date: "2026-03-24"
summary: "Introduced a modular player ability system and implemented the first ability: roll/dodge with decoupled movement control."
order: 14
---

## 🎯 Goal
Introduce a **player ability system** and implement the first ability: **roll/dodge**.

This phase focused on:
- Adding a responsive roll mechanic to improve gameplay
- Designing a reusable **ability framework**
- Decoupling abilities from movement and input systems
- Preparing the player architecture for future abilities

---

## 🧠 Design Approach
Instead of implementing roll directly inside the movement system, the goal was to treat it as part of a **broader ability architecture**.

Key idea:
> Even though roll is the first ability, it should be built as if many abilities will exist.

Key principles:
- **System-first design**: Build the framework before scaling features
- **Separation of concerns**: Movement, input, and abilities should remain independent
- **Extensibility**: Future abilities should not require rewriting core systems
- **Clear control flow**: Ability activation and execution should be predictable and centralized

This approach ensures the player system remains **clean and scalable** as complexity grows.

---

## 🏗 Implementation

### 🧩 Ability System Architecture
Introduced a modular structure:

- `PlayerAbility` → base class for all abilities  
- `PlayerRollAbility` → first concrete implementation  
- `PlayerAbilityController` → input + coordination layer  
- `PlayerMovement` → updated to support ability control  

This separates:
- **Capabilities (abilities)**
- **Execution (movement)**
- **Input handling**

---

### 🧬 Base Ability Abstraction
Created a reusable `PlayerAbility` base class responsible for:
- Cooldown handling
- Activation validation
- Ability lifecycle (active / inactive)

Each ability:
- Determines when it can activate
- Manages its own execution
- Tracks its own cooldown

This establishes a consistent foundation for all future abilities.

---

### 🌀 Roll Ability Implementation
Implemented the first ability: **roll/dodge**.

Core behavior:
- Triggered via input
- Moves the player in a directional burst
- Temporarily overrides normal movement
- Ends cleanly and returns control to the player

Responsibilities:
- Control movement during roll
- Trigger animation
- Lock player movement while active
- Release control when finished

This provides:
- Faster repositioning
- Improved responsiveness in combat scenarios

![Roll In Combat](/devlog-assets/14_1.mp4)

---

### 🎮 Ability Controller (Input Layer)
Created a `PlayerAbilityController` responsible for:
- Listening to input events
- Routing input to the correct ability
- Validating activation conditions

This ensures:
- Input is centralized
- Abilities remain decoupled from input logic
- Clean and predictable activation flow

---

### 🚶 Movement Integration
Updated `PlayerMovement` to support abilities.

Key changes:
- Introduced **movement locking**
- Movement respects ability state
- Exposed helper methods for abilities:
  - Movement lock/unlock
  - Direction queries

This allows abilities to:
- Temporarily take control of movement
- Use movement data without owning it

---

### 🎞️ Animation Integration
The roll ability is synchronized with animation:

- Roll is triggered through animation parameters
- Movement timing aligns with animation duration
- Ensures consistent visual and gameplay behavior

This prevents:
- Sliding
- Delayed input recovery
- Animation/gameplay mismatch

---

## ⚠ Problems Encountered
- Deciding where roll logic should live (movement vs separate system).
- Preventing input conflicts between movement and abilities.
- Synchronizing roll movement with animation timing.
- Ensuring smooth transition back to normal movement after roll.
- Avoiding tight coupling between systems during the first implementation.

---

## ✅ Solutions
- Introduced a dedicated ability system instead of embedding roll in movement.
- Centralized input handling through an ability controller.
- Added movement locking to allow controlled overrides.
- Synced roll timing with animation for consistency.
- Established clear boundaries between systems early.

---

## 🚀 Result
- First implementation of a **player roll/dodge ability**
- A reusable **ability system foundation**
- Improved player responsiveness and control
- Clean separation between movement, input, and abilities
- A scalable base for future player mechanics

---

## 📈 Engineering Takeaways
- Building systems early, even for a single feature, improves long-term scalability.
- Abilities should be modeled as independent systems, not extensions of movement.
- Clear separation of responsibilities reduces bugs and complexity.
- Input should be centralized rather than distributed across systems.
- Even simple features benefit from strong architectural design.

---

## ➡ Next Steps
- Implement a **Damage & Health system**
- Integrate combat interactions with abilities
- Add feedback systems (hit reactions, UI, audio)
- Expand the ability system with new player abilities
