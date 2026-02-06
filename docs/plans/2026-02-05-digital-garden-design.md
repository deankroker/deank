# Digital Garden Design

Personal website with terminal/hacker aesthetic serving notes and projects.

## Goals

- Learn Cloudflare Workers by building something real
- Digital garden: casual mix of notes and project writeups
- Terminal aesthetic: dark theme, monospace, ASCII art
- Content as markdown files in the repo (version controlled, deploy on push)

## Architecture

```
/content
  /notes          <- markdown files (thoughts, TILs, etc.)
  /projects       <- markdown files (project writeups)
/worker
  index.ts        <- serves routes, renders pages
/templates
  layout.ts       <- base HTML shell (terminal chrome)
  home.ts         <- landing page
  note.ts         <- single note view
  project.ts      <- single project view
  list.ts         <- list view for notes/projects
/styles
  terminal.css    <- the aesthetic
/scripts
  build-content.ts <- parses markdown at build time into JSON
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home - ASCII banner, intro, recent notes/projects |
| `/notes` | List of all notes |
| `/notes/:slug` | Single note |
| `/projects` | List of all projects |
| `/projects/:slug` | Single project |

## Content Format

Markdown files with YAML frontmatter:

```markdown
---
title: "Building a CLI in Rust"
date: 2024-01-15
tags: [rust, cli]
---

Your content here...
```

## Terminal Aesthetic

- Dark background (#0a0a0a)
- Green or amber text (configurable)
- Monospace font (JetBrains Mono)
- ASCII art header
- Prompt-style navigation (`> notes  > projects`)
- Subtle CRT effects (optional)

## Build Process

1. `build-content.ts` runs at build time
2. Parses markdown from `/content`
3. Outputs `dist/content.json`
4. Worker reads JSON and serves HTML

## Implementation Steps

1. Remove React/Vite frontend, Workflows, Durable Objects
2. Set up new directory structure
3. Create terminal CSS styles
4. Build markdown parser script
5. Create HTML templates
6. Update Worker to serve routes
7. Add sample content
8. Test and deploy

## What We're Removing

- React app (`/src` directory)
- Vite build for frontend
- Workflows (`worker/workflow.ts`)
- Durable Objects (`worker/durable-object.ts`)
- WebSocket functionality
- All workflow-related API routes

## What We're Keeping

- Cloudflare Worker (`worker/index.ts` - rewritten)
- Wrangler config (simplified)
- TypeScript
- Basic project structure
