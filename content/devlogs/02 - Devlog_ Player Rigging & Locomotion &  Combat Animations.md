---
title: "Devlog 02 – Player Rigging & Locomotion / Combat Animations"
date: "2026-01-18"
summary: Replace the placeholder cube with a fully rigged player model and implement foundational locomotion and combat animations (walk, run, fire) that work together seamlessly in a top-down shooter context."
order: 2
---

## 🎯 Goal
Replace the placeholder **cube** with a fully **rigged player model** and implement foundational **locomotion** and **combat animations** (**walk**, **run**, **fire**) that work together seamlessly in a **top-down shooter** context.

## 🧠 Design Approach
The goal was not just to “add animations,” but to integrate **animation** as a **system** that cooperates with **movement**, **aiming**, and future **weapon logic**.

Key principles:

- **Animations** must be relative to **aim direction**, not world axes.

- **Locomotion** (**walk/run**) and **combat** (**fire**) should be able to play simultaneously.

- **Animation logic** must remain decoupled from **input** and **movement systems**.

- The setup should scale cleanly to more **weapons** and **animation states** later.

---

## 🏗 Implementation
- Imported a custom 3D **character model** and **rigged** it using **Mixamo**.

- Learned and applied the distinction between:

  - **With Skin**: full mesh + skeleton (**used for gameplay**).

  - **Without Skin**: skeleton only (**useful for testing or retargeting**).

- Created an **Animator Controller** with:

  - Float parameters: **xVelocity**, **zVelocity**

  - Bool parameter: **isRunning**

  - Trigger parameter: **Fire**

- Converted world-space movement into local **animation space** using **dot products**:
```csharp
private void AnimatorControllers()
{
    float xVelocity = Vector3.Dot(movementDirection.normalized, transform.right);
    float zVelocity = Vector3.Dot(movementDirection.normalized, transform.forward);

    animator.SetFloat("xVelocity", xVelocity, .1f, Time.deltaTime);
    animator.SetFloat("zVelocity", zVelocity, .1f, Time.deltaTime);
}
```

Implemented **running animation logic**, gated by both **input state** and actual **movement**.
```csharp
bool playRunAnimation = isRunning && movementDirection.magnitude > 0;
animator.SetBool("isRunning", playRunAnimation);
```

Added a second **Animator Layer**:

- **Common Weapon Layer**

- Weight set to **1**

- Upper-body **Humanoid Mask** applied

**Fire animation** plays on the weapon layer, allowing:

- **Walking + firing**

- **Running + firing**

- **Aiming** independent of **locomotion**

---

## ⚠ Problems Encountered
- Confusion around Mixamo **“with skin” vs “without skin”** exports.

- **Locomotion animations** initially felt disconnected from **aim direction**.

- **Running animation** continued playing when holding shift while standing still.

- **Fire animation** conflicted with **walking/running** on the **base layer**.

---

## ✅ Solutions
- Standardized on **“with skin”** models for **gameplay usage**.

- Used **dot product projections** to align **animation parameters** with the character’s **local axes**.

- Fixed the **running bug** by ensuring **animation state** depends on actual **movement magnitude**, not just input.

- Introduced a dedicated **upper-body animation layer** for **weapon actions** using an **Avatar Mask**.

- Cleanly separated **locomotion** (**base layer**) and **combat** (**weapon layer**).

---

## 🚀 Result
- Fully **rigged player model** replaces the placeholder cube.

- Smooth **walking** and **running animations** aligned with **aim direction**.

- **Fire animation** blends correctly with **movement**.

- **Animation system** supports simultaneous **locomotion** and **combat** without conflicts.

- Foundation is ready for **weapon-specific logic** and **animation extensions**.

![Player Animations](/devlog-assets/02.mp4)

---

## 📈 Engineering Takeaways
- **Animation systems** require the same architectural care as **gameplay systems**.

- **Dot products** are essential for converting **world movement** into **animation-friendly local space**.

- **Animator layers** and **masks** are powerful tools for composing behaviors instead of hardcoding states.

- Guarding **animation states** with real **movement data** prevents subtle but **immersion-breaking bugs**.

---

## ➡ Next Steps
### Devlog 03 – Weapon System, Animation Rigging & Visual State Control
- Design and implement a **Weapon Controller** system.

- Import and configure the first **3D weapon model**.

- Connect **Attack input** to **weapon logic** rather than directly to **animation**.

- Prepare **animation hooks** for different **weapon types**.
