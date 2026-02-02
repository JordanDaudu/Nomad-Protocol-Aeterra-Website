---
title: "Camera System"
summary: "Controls top-down camera framing with aim-based lookahead and safety constraints."
order: 3
---

## 🧭 Overview
Controls top-down camera framing with aim-based lookahead and safety constraints.

## 🎯 Purpose
Improve situational awareness without disorienting the player.

## 🧠 Design Philosophy
- Camera follows intent, not position only

- Player always remains visible

## 📦 Core Responsibilities
Does:

- Follow player with interpolation

- Apply aim-based lookahead

Does NOT:

- Control aim logic

## 🧱 Key Components
Classes

- Uses Cinemachine

## 🔄 Execution Flow
1. Reads player position and aim

2. Calculates lookahead offset

3. Interpolates camera target

## 🔗 Dependencies
Depends On

- `Player`
- `PlayerAim`

Used By

- Rendering pipeline

## ⚠ Constraints & Assumptions
- Top-down perspective

## 📈 Scalability & Extensibility
- Screen shake

- Dynamic zoom

## ✅ Development Status
In development

## 📝 Notes
Camera uses Cinemachine package for better camera control and usability