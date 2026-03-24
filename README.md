# Nomad Protocol: AETERRA - Engineering Archive

> **System Status:** DEGRADED  
> **Protocol:** NOMAD_v4.0

This repository contains the source code and content pipeline for the **Nomad Protocol: AETERRA** engineering archive website.

The site is now a **fully static React + Vite site** using a **file-based content management system**:
drop Markdown and media into the source folders, run the generation/build pipeline, and the site updates automatically.

---

## 🔧 Technical Overview

- **Frontend:** React + TypeScript + Vite
- **Architecture:** Fully static site
- **Styling:** Tailwind CSS v4 + Custom CSS Variables
- **Content:** Markdown files with YAML frontmatter
- **Routing:** wouter (lightweight client-side routing)
- **Build Pipeline:** TypeScript content generation + Vite static build
- **Media Pipeline:** Source media is synced into generated public folders during generation/build
- **Audio:** Route-aware OST switching between the site's major sections

---

## 📂 Project Structure

```text
/content
  /devlogs                  # Development log markdown files
    00-project-bootstrap.md
    01-movement-system.md

  /systems                  # Game systems documentation
    /10_Core
    /20_Player
    /30_Combat
    00_Systems_Index.md

  /lore                     # World lore markdown files
    AETERRA-System.md
    The-Orbital-Ark.md

  /gallery                  # Gallery media + config
    gallery.json            # Visual item metadata
    screenshot1.png
    combat-demo.mp4

/attached_assets
  /devlog_assets            # Images/videos embedded in markdown content
  /audio                    # Background music tracks
  /generated_images         # Homepage/imported visual assets
  Nomad_Protocol_Aeterra_Banner_Higher_Quality.png

/client
  /public
    /data                   # Generated JSON content output
    /audio                  # Generated public audio
    /devlog-assets          # Generated markdown media output
    /gallery-images         # Generated gallery image/video output
    _redirects              # Netlify SPA fallback
    favicon.png
    opengraph.jpg

  /src
    /components             # UI components
    /pages                  # Route views
    /hooks                  # Custom hooks
    /lib                    # Utilities / audio config / helpers
    index.css               # Design system (colors, fonts, effects)

/script
  generate-content.ts       # Generates JSON + syncs public assets
  build.ts                  # Runs generation, then builds the static site
```

---

## 📝 Adding a Devlog

1. Create a new `.md` file in `content/devlogs/`
2. Name it with a number prefix if you want explicit ordering
3. Use this template:

```markdown
---
title: "Devlog XX – TEXT HERE"
date: "XXXX-XX-XX"
summary: "TEXT HERE"
order: 1
titleColor: "#7dd3fc"
---

## 🎯 Goal
What this phase aimed to achieve.

## 🧠 Design Approach
How the system was planned.

---

## 🏗 Implementation
Key components, class structure, and flow.

---

## ⚠ Problems Encountered
Technical or architectural challenges.

---

## ✅ Solutions
What you changed or redesigned.

---

## 🚀 Result
What works now.

---

## 📈 Engineering Takeaways
What you learned as a developer.

---

## ➡ Next Steps
What comes next.
```

4. Run the generation pipeline
5. The devlog appears in the Devlogs section

### Devlog Frontmatter

| Field | Description |
|-------|-------------|
| `title` | Display title |
| `date` | Display date |
| `summary` | Short description shown on the devlog card |
| `order` | Numeric ordering (lower = first) |
| `titleColor` | Optional custom title color |

### Adding Images & Videos to Devlogs

Place your media files in:

```text
attached_assets/devlog_assets/
```

Reference them in markdown like this:

```markdown
![Screenshot](/devlog-assets/screenshot.png)

![Gameplay Video](/devlog-assets/demo.mp4)
```

**Supported formats:**
- Images: PNG, JPG, JPEG, GIF, WebP
- Videos: MP4, WebM, OGG, MOV

Video files referenced this way are rendered as embedded video on the site.

---

## ⚙️ Adding a System Documentation Page

The Systems Archive documents internal game mechanics, architecture, and implementation details.
Each system page is a Markdown file.

1. Create a new `.md` file in `content/systems/` or any subfolder inside it
2. Use a number prefix if you want explicit ordering
3. Use this template:

```markdown
---
title: "Player Movement"
summary: "Handles player locomotion, input buffering, and movement constraints"
order: 0
status: "Implemented"
tags: ["Player", "Movement"]
last_updated: "2026-03-23"
---

## Purpose

What this system does and why it exists.

## Responsibilities

- Key responsibilities of this system
- What it handles

## Main Components

### ComponentName.cs
Description of what this component does.

## Flow

Describe the system flow or architecture.

## Dependencies

- What other systems or packages this depends on

## Known Limitations

- Current limitations or constraints

## Future Extensions

- Planned improvements
```

### Required Frontmatter

| Field | Description |
|-------|-------------|
| `title` | Display name in the Systems list/tree |
| `summary` | Short description shown on cards/search results |
| `order` | Numeric ordering (lower = first) |

### Optional Frontmatter

| Field | Description |
|-------|-------------|
| `status` | Badge shown in the doc header |
| `tags` | Searchable labels |
| `last_updated` | Date string shown in the doc header |

4. Run the generation pipeline
5. The page automatically appears in the Systems section

### Adding Images, GIFs, & Videos to System Docs

Reference media in markdown the same way as devlogs:

```markdown
![Architecture Diagram](/devlog-assets/system-diagram.png)

![Demo Video](/devlog-assets/movement-demo.mp4)
```

---

## 📜 Adding a Lore Entry (Archives)

1. Create a new `.md` file in `content/lore/`
2. Name it descriptively (for example: `factions.md`, `technology.md`, `orbital-ark.md`)
3. Use this template:

```markdown
---
title: "Entry Title"
category: "World"
summary: "Brief description for the card preview."
order: 1
loreImage: "/gallery-images/your-image.png"
---

# Entry Title

Your lore content here using standard Markdown...

## Section Header

- Bullet points work
- **Bold text** and *italics* too

> Blockquotes for emphasis

```text
Technical data / archive fragments / quotations
```
```

### Required Frontmatter

| Field | Description |
|-------|-------------|
| `title` | Display name in the Archives list |
| `category` | Category label |
| `summary` | Short description shown on the card and Home page lore highlight |
| `order` | Numeric ordering (lower = first) |

### Optional Frontmatter

| Field | Description |
|-------|-------------|
| `loreImage` | Image shown in the Home page lore highlight/carousel |

### Available Categories

| Category | Use For |
|----------|---------|
| `World` | General world lore and setting |
| `Faction` | Groups, organizations, and factions |
| `Tech` | Technology, weapons, and systems |
| `Threat` | Enemies, hazards, and anomalies |
| `History` | Historical events and timeline entries |

4. Run the generation pipeline
5. The entry appears in the Archives section

### Lore Images for the Home Page

To show an image on the Home page lore highlight:

1. Place the image inside `content/gallery/`
2. Reference it in frontmatter as:

```yaml
loreImage: "/gallery-images/filename.png"
```

When omitted, the site falls back to the default placeholder styling.

---

## 🖼️ Adding Images to the Gallery (Visuals)

1. Place your image or video file in `content/gallery/`

**Supported formats:**
- Images: PNG, JPG, JPEG, GIF, WebP
- Videos: MP4, WebM, OGG, MOV

2. Open `content/gallery/gallery.json`

3. Add a new entry to the JSON array:

```json
[
  {
    "id": "img-01",
    "filename": "my-screenshot.png",
    "caption": "Combat System - First Test",
    "type": "image"
  },
  {
    "id": "vid-01",
    "filename": "gameplay-demo.mp4",
    "caption": "Movement Demo - Air Strafing",
    "type": "video"
  }
]
```

### Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (any string) |
| `filename` | Exact filename in the gallery folder |
| `caption` | Text shown below the item |
| `type` | `image`, `gif`, or `video` |

4. Run the generation pipeline
5. The media appears in the Visuals section

---

## 🏠 Updating the Home Page

The Home page is a mix of **content-driven sections** and **hardcoded React-driven sections**.

### Content-Driven Home Sections

These sections update automatically from your content files:

- **Lore / archives preview section** → driven by `content/lore/`
- **Lore image preview** → uses the selected lore entry’s optional `loreImage`
- **Lore carousel navigation** → cycles through available lore/archive entries

### Home Sections Edited Directly in Code

These are currently maintained in React source files:

- `client/src/components/home/HomeHero.tsx` → top hero / system initialization section
- `client/src/components/home/HomeQuickAccess.tsx` → Devlogs / Systems / Archives / Visuals navigation cards
- `client/src/components/home/HomeHub.tsx` → main banner, mission statement / engineering focus tabs, system integrity panel, notifications, and engineering tags
- `client/src/components/home/HomeLoreHighlight.tsx` → lore highlight card and carousel controls
- `client/src/components/home/HomeExternalLinks.tsx` → external GitHub / LinkedIn cards
- `client/src/pages/home-site-manifest.tsx` → system alerts, engineering skills, and integrity stats used by the Home hub panel

### Home Page Visual Assets

These are imported directly and are not driven by markdown:

- `attached_assets/generated_images/dark_sci-fi_system_terminal_boot_background.png`
- `attached_assets/Nomad_Protocol_Aeterra_Banner_Higher_Quality.png`

If you want to change the hero or banner visuals, replace those files or update the component imports.

---

## 🎨 Design System

The visual theme is defined mainly in:

```text
client/src/index.css
```

### Colors
| Token | Usage |
|-------|-------|
| `--color-primary` | Highlights, active states |
| `--color-secondary` | Secondary accents, lore |
| `--color-accent` | Warnings, alerts |
| `--color-destructive` | Errors, critical |
| `--color-background` | Main page background |
| `--color-foreground` | Main text color |

### Fonts
- **Space Grotesk** - Headers and display text
- **JetBrains Mono** - Terminal/code text
- **Inter** - Body text

### Effects
- Scanline / HUD overlay styling
- Glitch-style text effects
- Flicker / terminal-like atmospheric effects

---

## 🔄 Static Content Pipeline

The site no longer uses backend API routes.
Instead, content is transformed into static JSON and public assets during generation/build.

### Source → Generated Output

| Source | Generated Public Output |
|--------|--------------------------|
| `content/devlogs/` | `client/public/data/devlogs.json` |
| `content/lore/` | `client/public/data/lore.json` |
| `content/systems/` | `client/public/data/systems.json` and `systems-tree.json` |
| `content/gallery/gallery.json` | `client/public/data/gallery.json` |
| `content/gallery/` media | `client/public/gallery-images/` |
| `attached_assets/devlog_assets/` | `client/public/devlog-assets/` |
| `attached_assets/audio/` | `client/public/audio/` |

### Important Note

Do **not** manually edit generated files in:

- `client/public/data/`
- `client/public/audio/`
- `client/public/devlog-assets/`
- `client/public/gallery-images/`

Always edit the source folders instead, then regenerate.

---

## 📋 Quick Reference

### Add a Devlog
1. Create `content/devlogs/XX-title.md`
2. Add frontmatter (`title`, `date`, `summary`, `order`)
3. Add markdown content
4. Put media in `attached_assets/devlog_assets/` if needed
5. Run `npm run generate`

### Add Lore
1. Create `content/lore/topic-name.md`
2. Add frontmatter (`title`, `category`, `summary`, `order`, optional `loreImage`)
3. Write Markdown content
4. To show an image on the Home page, use `loreImage: "/gallery-images/filename.png"`
5. Run `npm run generate`

### Add Gallery Media
1. Place file in `content/gallery/`
2. Add entry to `content/gallery/gallery.json`
3. Run `npm run generate`

### Update the Home Page
1. Change content-driven data through `content/`
2. Change hardcoded sections in `client/src/components/home/` and related page files
3. Regenerate or rebuild

---

## 📚 Systems Archive - Full Usage Guide

The Systems Archive is a browsable documentation hub for game system technical docs.
It supports nested folders, automatic tree navigation, search, and per-page metadata.

### Folder Structure

All systems content lives in `content/systems/`.
Drop `.md` files there (or in any subfolder) and they appear automatically on the site.

```text
content/systems/
├── 00_Systems_Index.md
├── 10_Core/
│   ├── 10_Object_Pooling.md
│   └── 11_Input_Actions_Integration.md
├── 20_Player/
│   ├── 20_Player_Root_Composition.md
│   ├── 21_Player_Movement.md
│   ├── 22_Player_Aim_and_Camera_Target.md
│   └── 23_Camera_Manager.md
├── 30_Combat/
│   ├── 30_Weapons_Data_ScriptableObjects.md
│   ├── 31_Weapon_Runtime_Model.md
│   ├── 32_Player_Weapon_Controller.md
│   ├── 33_Weapon_Visuals_Rigging_AnimationEvents.md
│   └── 34_Projectiles_Bullet_ImpactFX.md
└── 40_Interaction_&_Pickups/
    ├── 40_Interaction_System.md
    └── 41_Pickups_Weapons_and_Ammo.md
```

### Adding a New System Doc

1. Create a `.md` file in `content/systems/` or any subfolder
2. Add YAML frontmatter
3. Run `npm run generate`
4. The doc appears in the tree and becomes routable automatically

### Frontmatter Reference

Required fields:

```yaml
---
title: "System Name"
summary: "One-line description of what this system does"
order: 10
---
```

Optional fields:

```yaml
---
title: "System Name"
summary: "One-line description"
order: 10
status: "In Development"
tags: ["Combat", "Weapons", "Data-Driven"]
last_updated: "2026-03-23"
---
```

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Display title in the tree and page header |
| `summary` | string | Yes | Short description shown in listings and search results |
| `order` | number | Yes | Controls sort position within its folder |
| `status` | string | No | Shown as a badge |
| `tags` | string[] | No | Shown as labels and searchable |
| `last_updated` | string | No | Date string shown in the doc header |

### Sorting Rules

Docs and folders are sorted by these rules in order:

1. Index files (`00_*_Index.md`) first
2. Folders before docs
3. `order` frontmatter value (ascending)
4. Numeric prefix in the filename
5. Alphabetical by title

### Creating Subfolders

Create any directory inside `content/systems/`.

Folder names are cleaned up for display:
- Numeric prefixes are stripped
- Underscores and hyphens become spaces

To give a folder a custom title and summary, add an index file named:

```text
00_<FolderName>_Index.md
```

inside that folder.

### Cross-Linking Between Docs

Use relative Markdown links to connect system docs:

```markdown
See the [Player Core System](./20_Player_Root_Composition.md) for details.
See the [Object Pooling](../10_Core/10_Object_Pooling.md) system.
```

These are resolved into in-app navigation automatically.

### Search

The archive search matches against:
- doc titles
- summaries
- tags

Index files are excluded from search results.

---

## 🎵 Audio System (Dynamic OST)

The site includes a dynamic route-aware audio system with different OST tracks for its major sections.

### How It Works

- **Global toggle** controls mute/unmute
- **Different major sections use different OST tracks**
- **Route-aware switching** changes the music as you move through the site
- Child pages inherit the section track through route matching

### Current Section Mapping

- **Home** → `site_ost.mp3`
- **Devlogs** → `devlogs.mp3`
- **Systems** → `systems.mp3`
- **Archives** → `archives.mp3`
- **Gallery** → `gallery.mp3`

### Adding New Audio Tracks

1. Place your audio file in:

```text
attached_assets/audio/
```

2. Register the track in:

```text
client/src/lib/audioTracks.ts
```

Example:

```ts
export const AUDIO_TRACKS = {
  default: {
    src: "/audio/site_ost.mp3",
    volume: 0.5,
    loop: true,
  },
  devlogs: {
    src: "/audio/devlogs.mp3",
    volume: 0.45,
    loop: true,
  },
  systems: {
    src: "/audio/systems.mp3",
    volume: 0.45,
    loop: true,
  },
};
```

3. Associate routes with tracks in the same file:

```ts
export const ROUTE_AUDIO_CONTEXT = {
  "/": "default",
  "/devlogs": "devlogs",
  "/systems": "systems",
  "/lore": "archives",
  "/gallery": "gallery",
};
```

### Matching Rules

- Exact route matches take priority
- Prefix matches apply to child routes
- Unmatched routes fall back to the default track

### Audio Files Location

Audio source files live in `attached_assets/audio/` and are generated into public `/audio/...` paths during generation/build.

---

## 🔢 Ordering System

All content supports custom ordering.

### Devlogs, Lore, and Systems Docs
Add `order: X` to the frontmatter where `X` is a number.
Lower numbers appear first.

```markdown
---
title: "My Entry"
order: 0
---
```

### Gallery
Gallery items appear in the order they are listed in `gallery.json`.

To reorder them, move entries up or down in the array.

---

## 🖥️ Running Locally

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Generate Content

```bash
npm run generate
```

This generates JSON data and syncs public media/assets.

### 3️⃣ Development Mode

```bash
npm run dev
```

The site should be available at:

```text
http://localhost:5000
```

### 4️⃣ Production Build

```bash
npm run build
npm run preview
```

Production output is written to:

```text
dist/public
```

---

## 🚀 Deployment

This project builds to a fully static output, so it can be deployed on **any static hosting provider**.

### Production Build

```bash
npm run build
```

The final deployable site is generated in:

```text
dist/public
```

### What to Deploy

Upload the contents of `dist/public` to your static host of choice.

Examples of compatible platforms include:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Render Static Sites
- Firebase Hosting
- Any custom Nginx/Apache static hosting setup

### SPA Routing Note

Because this is a client-routed app, some hosts need a fallback rule so deep links work correctly.

For hosts that support a fallback file, `client/public/_redirects` is included for SPA routing:

```text
/* /index.html 200
```

If your hosting provider uses a different routing/rewrite format, configure it so all unknown routes fall back to `index.html`.

---

## 📜 License

This project is part of the Nomad Protocol development documentation.