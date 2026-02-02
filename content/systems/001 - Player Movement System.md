---
title: "Player Movement System"
summary: "Handles player locomotion, gravity, and animation parameter driving using Unity’s CharacterController."
order: 1
---

## 🧭 Overview
Handles player locomotion, gravity, and animation parameter driving using Unity’s CharacterController.

## 🎯 Purpose
Provide responsive, deterministic top-down movement while cleanly separating input intent from physical motion and animation.

## 🧠 Design Philosophy
- Deterministic movement over physics-driven motion

- Input intent decoupled from execution

- Animation driven by movement vectors, not raw input

## 📦 Core Responsibilities
Does:

- Translate movement input into world-space motion

- Apply gravity and ground checks

- Rotate the player toward aim direction

- Drive locomotion animation parameters

Does NOT:

- Handle aiming logic

- Handle shooting logic

- Own input definitions

## 🧱 Key Components
Classes

- `PlayerMovement`

  - Movement execution and animation coordination

Unity Components

`CharacterController`

`Animator`

## 🔄 Execution Flow
On `Start()`, caches Player, CharacterController, Animator

Input events update movement intent

On `Update()`, applies movement, gravity, rotation, and animation

## 🔗 Dependencies
Depends On

- `Player`
- `PlayerAim`
- Unity CharacterController

Used By

- Animation system

## ⚠ Constraints & Assumptions
- Assumes CharacterController-based movement

- Assumes top-down movement plane

## 📈 Scalability & Extensibility
- Can support strafing, dashes, or knockback

- Can swap CharacterController for physics if needed

## ✅ Development Status
Implemented