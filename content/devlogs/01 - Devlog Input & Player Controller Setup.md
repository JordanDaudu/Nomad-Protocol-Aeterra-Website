---
title: "Devlog 01 – Input & Player Controller Setup"
date: "2026-01-16"
summary: "Implement a modular player input and movement system to serve as the foundation for character control, aiming, and shooting mechanics."
order: 1
---

## 🎯 Goal
Implement a modular **player input** and **movement system** to serve as the foundation for **character control**, **aiming**, and **shooting mechanics**.

## 🧠 Design Approach
The focus was on decoupling **input** from **movement** and **actions**, ensuring the system is scalable for future **character models** and more complex **abilities**.

Key principles:

- **Input** should be flexible: support both **keyboard/mouse** and **gamepads** in the future.

- **Player logic** should handle **movement**, **gravity**, and **aiming** independently of the **rendering model**.

- **Shooting** should be triggered via **input** without coupling to a specific **weapon** or **projectile system** yet.

- **Aiming** should work relative to the **screen position** of the **mouse**, keeping **top-down shooter mechanics** intuitive.

This approach allows early testing with **simple objects** while keeping the system ready for **animation rigs** and advanced **gameplay** later.

---

## 🏗 Implementation
- Created a **Test Scene** with a **cube** as a placeholder **player**.

- Set up the **Unity New Input System** with three main actions:

  - **Move** – Vector2 input mapped to **WASD/arrow keys** and **left stick**.

  - **Look** – Vector2 input using the absolute **mouse position** on the screen (or **right stick** for gamepad).

  - **Attack** – Triggered by **mouse button** or **gamepad trigger**.

- Implemented a **PlayerController** script that:

  - Reads **input actions**.

  - Applies **movement** using **CharacterController**.

  - Rotates the **cube** to face the **Look position** relative to the **camera**.

  - Applies **gravity** and basic **physics**.

- **Input handling** is fully decoupled from the **rendering layer**, allowing swapping the cube for an **animated model** later without rewriting **movement** or **aim logic**.

---

## ⚠ Problems Encountered
- Initial coupling of **input** and **movement** caused awkward **rotation** when aiming toward the **mouse position**.

- **Gravity** felt unnatural with a placeholder cube.

- Converting **screen-space mouse position** to **world-space** for rotation was tricky at first.

---

## ✅ Solutions
- Separated **rotation** and **translation logic** to handle **movement** independently from **aiming**.

- Tuned **CharacterController**’s **gravity** and **speed parameters** to feel responsive but predictable.

- Converted **mouse screen position** to **world position** via **raycasting** or **camera projection**, enabling accurate **top-down aiming**.

---

## 🚀 Result
- The **cube** moves smoothly according to **Move input**.

- The **cube** rotates to face the **mouse cursor** via **Look input**.

- **Gravity** is applied consistently.

- **Attack input** is recognized without affecting **movement** or **aim**.

- **Input system** is fully modular and ready for integration with a **real character model** and **animation rig**.

![Scene Prototype](/devlog-assets/01.mp4)

---

## 📈 Engineering Takeaways
- Decoupling **input** from **movement** and **aiming** reduces future refactoring.

- Early testing with **placeholder objects** allows iteration without waiting for **art assets**.

- Using **absolute mouse positions** for **top-down aiming** ensures intuitive control.

- Setting up the **new Input System** upfront simplifies adding multiple **input devices** or **actions** later.

---

## ➡ Next Steps
### Devlog 02 – Player Rigging & Locomotion / Combat Animations
- Replace the **cube** with a **real player model** and **rig**.

- Integrate **animations** for **movement**, **aiming**, and **attack**.