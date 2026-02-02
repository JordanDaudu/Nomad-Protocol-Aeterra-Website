---
title: "Player Aim System"
summary: "Tracks player aim intent in world space using screen-to-world raycasts."
order: 2
---

## 🧭 Overview
Tracks player aim intent in world space using screen-to-world raycasts.

## 🎯 Purpose
Provide precise, camera-independent aiming suitable for top-down gameplay.

## 🧠 Design Philosophy
- World-space truth over screen-space assumptions

- Camera and aim fully decoupled

## 📦 Core Responsibilities
Does:

- Convert look input into world position

- Maintain aim transform

Does NOT:

- Rotate the player

- Fire weapons

## 🧱 Key Components
Classes

- `PlayerAim`

Data

- Aim LayerMask

## 🔄 Execution Flow
1. Input updates look vector

2. Raycast converts input to world position

3. Aim transform updates each frame

## 🔗 Dependencies
Depends On

- `Player`
- Camera

Used By

- PlayerMovement
- Shooting system

## ⚠ Constraints & Assumptions
- Requires valid aim collision layer

## 📈 Scalability & Extensibility
- Target lock assistance

- Aim smoothing

## ✅ Development Status
Implemented