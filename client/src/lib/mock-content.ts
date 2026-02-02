export interface Devlog {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export interface Lore {
  id: string;
  title: string;
  category: "World" | "Faction" | "Tech";
  summary: string;
  content: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  caption: string;
}

export const devlogs: Devlog[] = [
  {
    id: "00-project-bootstrap",
    title: "Devlog 00 – Project Bootstrap",
    date: "2026-01-16",
    summary: "Set up the project structure, repository, and documentation foundation.",
    content: `
# Devlog 00 – Project Bootstrap

Date: 16/01/26

## 🎯 Goal
Set up the **project structure**, **repository**, and **documentation foundation**.

## 🧠 Design Approach
Before writing gameplay code, the focus was on treating the project as a **software system** rather than a prototype.  
The goal was to establish clear boundaries between **systems**, prepare **documentation containers**, and ensure the project could scale without **structural refactors** later.

Key principles:

- Treat the **project architecture** as the foundation for long-term scalability.

- Prepare **documentation and devlog frameworks** before building gameplay systems.

- Avoid starting gameplay implementation before **structure** and **planning** are solid.

---

## 🏗 Implementation
- Created a new **Unity 3D project** (**Unity 6.3 LTS**).

- Defined a clean **folder structure** separating **core logic**, **systems**, **data**, and **assets**.

- Initialized a **GitHub repository** with a **Unity .gitignore**.

- Set up a **/Docs** directory with **roadmap** and **devlog structure**.

- Created a **sandbox development scene** for early experimentation.

---

## ⚠ Problems Encountered
- Initial temptation to start implementing **gameplay** immediately without **architectural planning**.

- Risk of **over-documenting** too early without concrete systems in place.

---

## ✅ Solutions
- Limited this phase strictly to **structure** and **foundations**.

- Created **documentation placeholders** instead of detailed specs.

- Deferred **system implementation** to the next phase to avoid **premature design decisions**.

---

## 🚀 Result
- A **stable Unity project** with a scalable **folder structure**.

- A clean **GitHub repository** ready for long-term development.

- A **documentation framework** that will grow alongside the project.

---

## 📈 Engineering Takeaways
- Treating a **game project** like a **software system** from day one reduces **technical debt**.

- **Documentation containers** are more valuable early on than detailed documentation.

- Clear **structure** enables faster and safer **iteration** later.

---

## ➡ Next Steps
- Design and implement the **input** and **character controller system**.

- Define clear responsibilities between **input handling**, **movement logic**, and **animation control**.

- Document the first real **system** in **Devlog 01**.

> *[GIF placeholder: gifs/00.gif]*
`
  },
  {
    id: "01-movement-system",
    title: "Kinematics & Movement Vectors",
    date: "2024-10-28",
    summary: "Refining the player controller. Implementing bunny-hopping and friction curves.",
    content: `
# Devlog 01 – Kinematics & Movement

Date: 2024-10-28

## 🎯 Goal
Create a fluid, momentum-based movement system that rewards mastery. Think Arena Shooters of the late 90s but with weight.

## 🏗 Implementation
We're using a standard vector-based velocity modification system.

\`\`\`csharp
public Vector3 CalculateVelocity(Vector3 currentVelocity, Vector3 wishDir, float accel, float maxSpeed) {
    float currentSpeed = Vector3.Dot(currentVelocity, wishDir);
    float addSpeed = maxSpeed - currentSpeed;
    if (addSpeed <= 0) return currentVelocity;
    
    float accelSpeed = accel * Time.deltaTime * maxSpeed;
    if (accelSpeed > addSpeed) accelSpeed = addSpeed;
    
    return currentVelocity + wishDir * accelSpeed;
}
\`\`\`

## 📈 Engineering Takeaways
Don't fight the physics engine; manipulate the inputs *before* they hit the Rigidbody.

`
  },
  {
    id: "02-weapon-architecture",
    title: "Modular Weapon Systems",
    date: "2024-11-15",
    summary: "Building the component-based weapon system allowing for procedural generation of firearms.",
    content: `
# Devlog 02 – Weapon Architecture

Date: 2024-11-15

## 🎯 Goal
A weapon system where parts (Barrel, Receiver, Stock, Sight) can be swapped at runtime, affecting stats like **Spread**, **Recoil**, and **Handling**.

## 🧠 Design Approach
Composite pattern. A \`Weapon\` entity is just a container for \`WeaponPart\` components.

## ⚠ Problems Encountered
Inverse Kinematics (IK) for hand placement varies wildly depending on the stock length.

## ✅ Solutions
Added "Grip Points" metadata to every Receiver part. The IK solver now targets these dynamic transforms rather than a static offset.

## 🚀 Result
We can now generate over 4,000 weapon combinations that all animate correctly.
`
  }
];

export const lore: Lore[] = [
  {
    id: "world-overview",
    title: "System: AETERRA",
    category: "World",
    summary: "The current state of the simulation world and its degrading boundaries.",
    content: `
# 📖 World Overview: Nomad Protocol: AETERRA

> **System Status:** DEGRADED  
> **Current Epoch:** 0x7E4  
> **Active Protocol:** NOMAD_v4.0  

---

## 1. The World: What is AETERRA?
**Aeterra** is not just a place; it is a **Reality-Simulation Layer**.

Centuries ago, humanity attempted to solve a global climate collapse by overlaying the planet with a massive, self-regulating AI network designed to terraform the Earth using nanites. This network was known as the **Aeterra System**.

For a hundred years, the system functioned perfectly. However, the system eventually encountered a **Fatal Exception**. The logic that built the world fractured. The AI began treating physical matter as corrupted data. Now, the world exists in a constant state of **"Glitch"**:
* **Structural Flux:** Mountains shift and rearrange overnight (**Procedural Generation**).
* **Atmospheric Drift:** Deserts freeze into glass, and gravity fails in specific high-corruption zones.

---

## 2. The Catastrophe: The Null-Blight
The purple, glowing entities encountered in the wasteland are not biological—they are the **Null-Blight** (or simply "The Nulls").

* **The Logic:** They are the Aeterra System’s "Antivirus" or "Garbage Collector" gone rogue.
* **The Conflict:** The System no longer recognizes physical matter (buildings, vehicles, robots) as valid. It identifies these objects as "bugs" or "orphan files."
* **The Manifestation:** The purple crystals are **Debug Data** manifesting in the physical world, overwriting the desert sand. When they swarm a target, they are not hunting—they are attempting to **Delete**.

---

## 3. The Protagonist: The Nomad Unit
Players control a **Model-7 "Nomad" Maintenance Frame**.

* **Legacy Hardware:** You are a remnant of the Old World, originally designed to repair the terraforming towers.
* **The Kernel Key:** You possess a fragment of the original, clean source code. This makes you "invisible" to the System’s automated deletion sweeps until you begin active data extraction.
* **The Archivist:** Your mission is not to save the world—the world is already dead. You must travel into unstable sectors to recover **Legacy Data** (DNA records, blueprints, history) and upload it to the **Orbital Ark** via extraction planes before the sector is formatted.

---
`
  },
  {
    id: "factions",
    title: "Active Factions",
    category: "Faction",
    summary: "Groups vying for control of the remaining Stable Zones.",
    content: `
# Active Factions

## The Null_Pointers
**Type:** Technotheocratic Cult
**Goal:** Accelerate the crash.
They believe that outside the simulation lies a higher plane of existence. They actively destroy data anchors to destabilize the world.

## Checksum Guardians
**Type:** Military Police / Paramilitary
**Goal:** Preserve the archive.
They hoard processing power and memory allocation. They view "glitches" as heresy to be purged.

## The Fragmented
**Type:** Civilians / Scavengers
Those who have lost significant portions of their memory file. They wander the wastes, trading corrupted data packets for stability.
`
  },
  {
    id: "technology",
    title: "Manifest Technologies",
    category: "Tech",
    summary: "How code manifests as physical tools in the simulation.",
    content: `
# Manifest Technologies

In AETERRA, code is matter.

**Reality Anchors:**
Heavy, pylon-like devices that force the local area to render at high fidelity. They prevent "noclip" accidents and gravity failures.

**Compilers (Weapons):**
Firearms that execute destructive scripts. A "bullet" is a packet of deletion code. Upon impact, it commands the target's geometry to de-rez.

**Glitch-Drives:**
Vehicles that exploit physics bugs to move faster than intended speed limits.
`
  }
];

// Placeholder for now - will be populated with the generated images path in the component
export const gallery: GalleryItem[] = [
    {
        id: "img-01",
        type: "image",
        src: "", // will be filled in component
        caption: "Weapon Schematic: Railgun Prototype v4"
    },
    {
        id: "img-02",
        type: "image",
        src: "", // will be filled in component
        caption: "Sector 7 Topography - Elevation Scan"
    },
    {
        id: "img-03",
        type: "image",
        src: "", // will be filled in component
        caption: "Faction Symbol: The Null_Pointers"
    },
    {
        id: "img-04",
        type: "image",
        src: "", // will be filled in component
        caption: "Combat Sim - Low Poly Render Test"
    }
];
