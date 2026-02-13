# Nomad Protocol: AETERRA - Engineering Archive

> **System Status:** DEGRADED  
> **Protocol:** NOMAD_v4.0

This repository contains the source code for the AETERRA devlog, lore archive, and media gallery.
The site uses a **file-based content management system** - simply drop Markdown files into folders and they appear on the site.

---

## 🔧 Technical Overview

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js (Node.js)
- **Styling:** Tailwind CSS v4 + Custom CSS Variables
- **Content:** Markdown files with YAML frontmatter
- **Routing:** wouter (lightweight client-side router)

---

## 📂 Project Structure

```
/content
  /devlogs                  # Development log markdown files
    00-project-bootstrap.md
    01-movement-system.md
  /systems                  # Game systems documentation
    0-player-movement.md
    1-combat.md
    2-camera.md
  /lore                     # World lore markdown files
    world-overview.md
    factions.md
  /gallery                  # Gallery images and config
    gallery.json            # Image metadata
    screenshot1.png
    combat-demo.gif

/client                     # Frontend React application
  /src
    /components             # UI components
    /pages                  # Route views
    /lib                    # API helpers and utilities
    index.css               # Design system (colors, fonts, effects)

/server                     # Backend Express server
  content.ts                # Markdown file parser
  routes.ts                 # API endpoints
```

---

## 📝 Adding a Devlog

1. Create a new `.md` file in `content/devlogs/`
2. Name it with a number prefix for ordering (e.g., `01-movement-system.md`)
3. Use this template:

```markdown
---
title: "Devlog XX – TEXT HERE"
date: "XXXX-XX-XX"
summary: "TEXT HERE"
order: 1
---

# Devlog XX – Title

Date:

## 🎯 Goal
What this phase aimed to achieve.

## 🧠 Design Approach
How the system was planned.

---

## 🏗 Implementation
Key components, class structure, and flow.
Can add code blocks:
\`\`\`csharp
public void Move(Vector3 direction) {
    // Your code here
}
\`\`\`

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

4. Save the file - it will automatically appear in the Devlogs section

### Adding Images & Videos to Devlogs

Place your media files in `attached_assets/devlog_assets/` and reference them in markdown:

```markdown
![Screenshot](/devlog-assets/screenshot.png)

![Gameplay Video](/devlog-assets/demo.mp4)
```

**Supported formats:**
- Images: PNG, JPG, GIF
- Videos: MP4, WebM, OGG, MOV (auto-plays on loop, muted)

---

## ⚙️ Adding a System Documentation Page

The Systems section documents internal game mechanics (movement, combat, camera, AI, etc.). Each system is a Markdown file.

1. Create a new `.md` file in `content/systems/`
2. Name it with a number prefix for ordering (e.g., `3-ai-system.md`)
3. Use this template:

```markdown
---
title: "Player Movement"
summary: "Handles player locomotion, input buffering, and movement constraints"
order: 0
ost: combat    # Optional: override the background music for this page
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

**Required Frontmatter:**
| Field | Description |
|-------|-------------|
| `title` | Display name in the Systems list |
| `summary` | Short description shown on the card |
| `order` | Numeric ordering (lower = first) |

**Optional Frontmatter:**
| Field | Description |
|-------|-------------|
| `ost` | Audio track ID to play on this page (see Audio System section) |

4. Save the file - it automatically appears in the Systems section

### Adding Images, GIFs, & Videos to System Docs

Reference media in markdown the same way as devlogs:

```markdown
![Architecture Diagram](/devlog-assets/system-diagram.png)

![Demo Video](/devlog-assets/movement-demo.mp4)
```

---

## 📜 Adding a Lore Entry (Archives)

1. Create a new `.md` file in `content/lore/`
2. Name it descriptively (e.g., `factions.md`, `technology.md`)
3. Use this template:

```markdown
---
title: "Entry Title"
category: "World"
summary: "Brief description for the card preview."
order: 1
---

# Entry Title

Your lore content here using standard Markdown...

## Section Header

- Bullet points work
- **Bold text** and *italics* too

> Blockquotes for emphasis

\`\`\`
Code blocks for technical data
\`\`\`
```

**Available Categories:**
| Category | Use For |
|----------|---------|
| `World` | General world lore and setting |
| `Faction` | Groups, organizations, and factions |
| `Tech` | Technology, weapons, and systems |

4. Save the file - it appears in the Archives section

---

## 🖼️ Adding Images to the Gallery (Visuals)

1. Place your image/video file in `content/gallery/`
   - Supported formats: PNG, JPG, GIF, MP4, WebM

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

**Fields:**
| Field | Description |
|-------|-------------|
| `id` | Unique identifier (any string) |
| `filename` | Exact filename in the gallery folder |
| `caption` | Text shown below the image |
| `type` | `image`, `gif`, or `video` |

4. Save the file - the image appears in the Visuals section

---

## 🎨 Design System

The visual theme is defined in `client/src/index.css`.

### Colors
| Token | Color | Usage |
|-------|-------|-------|
| `--color-primary` | Corrupted Violet | Highlights, active states |
| `--color-secondary` | Muted Cyan | Secondary accents, lore |
| `--color-accent` | Amber | Warnings, alerts |
| `--color-destructive` | Red | Errors, critical |
| `--color-background` | Near Black | Page background |
| `--color-foreground` | Soft White | Text |

### Fonts
- **Space Grotesk** - Headers and display text (`.font-display`)
- **JetBrains Mono** - Terminal/code text (`.font-terminal`)
- **Inter** - Body text (`.font-body`)

### Effects
- `.scanlines` - CRT scanline overlay
- `.glitch-text` - Glitch animation (use with `data-text` attribute)
- `.flicker` - Subtle screen flicker

---

## 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/devlogs` | GET | List all devlogs |
| `/api/devlogs/:id` | GET | Get specific devlog by ID |
| `/api/lore` | GET | List all lore entries |
| `/api/lore/:id` | GET | Get specific lore entry by ID |
| `/api/gallery` | GET | List all gallery items |
| `/api/systems` | GET | List all system docs |
| `/api/systems/:id` | GET | Get specific system doc by ID |

---

## 📋 Quick Reference

### Add a Devlog
1. Create `content/devlogs/XX-title.md`
2. Add frontmatter (title, date, summary, order)
3. Write content using the template above

### Add Lore
1. Create `content/lore/topic-name.md`
2. Add frontmatter (title, category, summary, order)
3. Write Markdown content

### Add Gallery Image
1. Place file in `content/gallery/`
2. Add entry to `content/gallery/gallery.json` (order = position in array)
3. Done!

### Add System Documentation
1. Create `content/systems/X-system-name.md`
2. Add frontmatter (title, summary, order, optional ost)
3. Write flexible Markdown content (no fixed structure required)

## 🎵 Audio System (Dynamic OST)

The site includes a dynamic page-aware audio system with smooth crossfade transitions between tracks.

### How It Works

- **Global toggle** in the top bar controls mute/unmute (persists across sessions)
- **Each page can have its own soundtrack** that automatically plays when you visit
- **Smooth crossfades** (1.5 seconds) when transitioning between different tracks
- **Automatic revert** to default OST when leaving a page with custom audio

### Adding New Audio Tracks

1. Place your audio file (MP3, OGG, WAV) in `attached_assets/`

2. Register the track in `client/src/lib/audioTracks.ts`:

```typescript
export const AUDIO_TRACKS: Record<string, AudioTrack> = {
  default: {
    src: "/audio/your_default_track.mp3",  // Replace with actual filename
    volume: 0.3,
    loop: true,
  },
  combat: {
    src: "/audio/combat_theme.mp3",
    volume: 0.5,
    loop: true,
  },
  exploration: {
    src: "/audio/exploration_ambient.mp3",
    volume: 0.4,
    loop: true,
  },
};
```

**Note:** Use the exact filename from `attached_assets/` folder in the `src` path (e.g., `/audio/site_ost.mp3`).

3. Associate routes with tracks in the same file:

```typescript
export const ROUTE_AUDIO_CONTEXT: Record<string, string> = {
  "/": "default",
  "/devlogs": "default",
  "/devlogs/combat-systems": "combat",  // Specific devlog gets combat music
  "/lore": "exploration",               // All lore pages get exploration music
  "/gallery": "default",
};
```

**Matching rules:**
- Exact path matches take priority (e.g., `/devlogs/combat-systems`)
- Prefix matches work for child routes (e.g., `/lore` matches `/lore/factions`)
- Unmatched routes fall back to `default`

### Audio Files Location

Audio files are served from `attached_assets/` at the `/audio/` URL path.

---

## 🔢 Ordering System

All content supports custom ordering:

**Devlogs & Lore:** Add `order: X` to the frontmatter where X is a number. Lower numbers appear first.

```markdown
---
title: "My Entry"
order: 0   # This appears first
---
```

**Gallery:** Items appear in the order they are listed in `gallery.json`. To reorder, simply move entries up or down in the array.

---

## 🖥️ Running Locally

1️⃣ Install Dependencies
```
npm install
```
2️⃣ Development Mode
```
npm run dev
```
Should be available at http://localhost:5000

3️⃣ Production Mode (full build)
- Windows (PowerShell):
```
npm run build
$env:NODE_ENV="production"; npm start
```
- macOS / Linux:
```
npm run build
NODE_ENV=production npm start
```
---
## 📜 License

This project is part of the Nomad Protocol development documentation.
