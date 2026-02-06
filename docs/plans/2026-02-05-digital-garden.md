# Digital Garden Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Cloudflare Workflows starter into a personal digital garden with terminal aesthetic.

**Architecture:** Static-ish site served by Cloudflare Workers. Markdown content is compiled to JSON at build time. Worker serves HTML pages rendered from templates. No React - pure HTML/CSS/JS for authentic terminal feel.

**Tech Stack:** Cloudflare Workers, TypeScript, Marked (markdown), Gray-Matter (frontmatter), Vite (build only)

---

## Task 1: Clean Up - Remove React and Workflow Code

**Files:**
- Delete: `src/` (entire directory)
- Delete: `worker/workflow.ts`
- Delete: `worker/durable-object.ts`
- Delete: `test/workflow.test.ts`
- Delete: `tailwind.config.js`
- Delete: `postcss.config.js`
- Delete: `tsconfig.app.json`
- Delete: `assets/template-screenshot.png`

**Step 1: Remove the files**

```bash
rm -rf src/
rm worker/workflow.ts worker/durable-object.ts
rm test/workflow.test.ts
rm tailwind.config.js postcss.config.js tsconfig.app.json
rm -rf assets/
```

**Step 2: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove React frontend and Workflow code"
```

---

## Task 2: Update Configuration Files

**Files:**
- Modify: `package.json`
- Modify: `wrangler.jsonc`
- Modify: `tsconfig.json`
- Delete: `tsconfig.node.json`
- Modify: `vite.config.ts`
- Modify: `index.html`

**Step 1: Update package.json**

Replace entire contents:

```json
{
  "name": "deank",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "build": "npm run build:content && wrangler deploy --dry-run --outdir=dist",
    "build:content": "tsx scripts/build-content.ts",
    "deploy": "npm run build:content && wrangler deploy",
    "cf-typegen": "wrangler types"
  },
  "devDependencies": {
    "wrangler": "^4.51.0",
    "typescript": "~5.8.3",
    "tsx": "^4.19.0",
    "marked": "^15.0.0",
    "gray-matter": "^4.0.3",
    "@types/node": "^22.0.0"
  }
}
```

**Step 2: Update wrangler.jsonc**

Replace entire contents:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "deank",
  "main": "worker/index.ts",
  "compatibility_date": "2025-10-08",
  "assets": {
    "directory": "./public",
    "not_found_handling": "none"
  },
  "observability": {
    "enabled": true
  }
}
```

**Step 3: Update tsconfig.json**

Replace entire contents:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["@cloudflare/workers-types"],
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "include": ["worker/**/*", "scripts/**/*"],
  "exclude": ["node_modules"]
}
```

**Step 4: Delete unused config files**

```bash
rm tsconfig.node.json tsconfig.worker.json vite.config.ts vitest.config.ts eslint.config.js index.html
rm test/cloudflare-test.d.ts
rmdir test
```

**Step 5: Commit config changes**

```bash
git add -A
git commit -m "chore: update config for static site"
```

---

## Task 3: Create Directory Structure

**Files:**
- Create: `content/notes/.gitkeep`
- Create: `content/projects/.gitkeep`
- Create: `public/styles/terminal.css`
- Create: `scripts/build-content.ts`
- Create: `worker/templates/layout.ts`
- Create: `worker/templates/home.ts`
- Create: `worker/templates/list.ts`
- Create: `worker/templates/single.ts`

**Step 1: Create directories**

```bash
mkdir -p content/notes content/projects public/styles worker/templates scripts
touch content/notes/.gitkeep content/projects/.gitkeep
```

**Step 2: Commit structure**

```bash
git add -A
git commit -m "chore: create directory structure"
```

---

## Task 4: Create Terminal CSS

**Files:**
- Create: `public/styles/terminal.css`

**Step 1: Write the CSS**

```css
/* Terminal aesthetic */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  --bg: #0a0a0a;
  --fg: #33ff33;
  --fg-dim: #1a8c1a;
  --fg-bright: #66ff66;
  --accent: #ffcc00;
  --border: #333;
  --selection: #33ff3333;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

::selection {
  background: var(--selection);
}

html {
  font-size: 16px;
}

body {
  font-family: 'JetBrains Mono', monospace;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* ASCII header */
.ascii-header {
  white-space: pre;
  font-size: 0.6rem;
  line-height: 1.2;
  color: var(--fg-dim);
  margin-bottom: 2rem;
  overflow-x: auto;
}

/* Navigation */
nav {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--border);
}

nav a {
  color: var(--fg);
  text-decoration: none;
  margin-right: 1.5rem;
}

nav a:hover,
nav a.active {
  color: var(--fg-bright);
}

nav a::before {
  content: '> ';
  color: var(--fg-dim);
}

/* Headings */
h1, h2, h3 {
  color: var(--fg-bright);
  font-weight: 700;
  margin: 1.5rem 0 1rem;
}

h1 { font-size: 1.5rem; }
h2 { font-size: 1.25rem; }
h3 { font-size: 1rem; }

/* Links */
a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Lists */
.item-list {
  list-style: none;
}

.item-list li {
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--border);
}

.item-list li:last-child {
  border-bottom: none;
}

.item-list a {
  color: var(--fg);
  display: block;
}

.item-list a:hover {
  color: var(--fg-bright);
}

.item-meta {
  font-size: 0.8rem;
  color: var(--fg-dim);
  margin-top: 0.25rem;
}

.item-tags span {
  margin-right: 0.5rem;
}

.item-tags span::before {
  content: '#';
}

/* Content */
.content {
  margin-top: 2rem;
}

.content p {
  margin: 1rem 0;
}

.content ul, .content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.content li {
  margin: 0.5rem 0;
}

.content code {
  background: #1a1a1a;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.content pre {
  background: #1a1a1a;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
  border-left: 3px solid var(--fg-dim);
}

.content pre code {
  background: none;
  padding: 0;
}

.content blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--fg-dim);
  margin: 1rem 0;
}

/* Footer */
footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border);
  color: var(--fg-dim);
  font-size: 0.8rem;
}

/* Intro text */
.intro {
  color: var(--fg-dim);
  margin-bottom: 2rem;
}

/* Section headers */
.section-header {
  color: var(--fg-dim);
  margin: 2rem 0 1rem;
  font-size: 0.9rem;
}

.section-header::before {
  content: '// ';
}

/* CRT effect (subtle) */
@keyframes flicker {
  0% { opacity: 0.97; }
  50% { opacity: 1; }
  100% { opacity: 0.98; }
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
  animation: flicker 0.15s infinite;
}

/* Responsive */
@media (max-width: 600px) {
  .ascii-header {
    font-size: 0.35rem;
  }

  .container {
    padding: 1rem;
  }
}
```

**Step 2: Commit CSS**

```bash
git add public/styles/terminal.css
git commit -m "feat: add terminal CSS styles"
```

---

## Task 5: Create HTML Templates

**Files:**
- Create: `worker/templates/layout.ts`
- Create: `worker/templates/home.ts`
- Create: `worker/templates/list.ts`
- Create: `worker/templates/single.ts`

**Step 1: Create layout template**

`worker/templates/layout.ts`:

```typescript
export const ASCII_ART = `
    ____  _________    _   ____ __
   / __ \\/ ____/   |  / | / / //_/
  / / / / __/ / /| | /  |/ / ,<
 / /_/ / /___/ ___ |/ /|  / /| |
/_____/_____/_/  |_/_/ |_/_/ |_|
`;

export function layout(title: string, content: string, activePath: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | deank</title>
  <link rel="stylesheet" href="/styles/terminal.css">
</head>
<body>
  <div class="container">
    <header>
      <pre class="ascii-header">${ASCII_ART}</pre>
      <nav>
        <a href="/" class="${activePath === '/' ? 'active' : ''}">home</a>
        <a href="/notes" class="${activePath === '/notes' ? 'active' : ''}">notes</a>
        <a href="/projects" class="${activePath === '/projects' ? 'active' : ''}">projects</a>
      </nav>
    </header>
    <main>
      ${content}
    </main>
    <footer>
      <p>$ echo "built with cloudflare workers"</p>
    </footer>
  </div>
</body>
</html>`;
}
```

**Step 2: Create home template**

`worker/templates/home.ts`:

```typescript
import { layout } from './layout';

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
}

export function home(notes: ContentItem[], projects: ContentItem[]): string {
  const recentNotes = notes.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  const content = `
    <p class="intro">Welcome to my digital garden. A place for notes, projects, and random thoughts.</p>

    <h2 class="section-header">recent notes</h2>
    ${recentNotes.length > 0 ? `
      <ul class="item-list">
        ${recentNotes.map(n => `
          <li>
            <a href="/notes/${n.slug}">${n.title}</a>
            <div class="item-meta">${n.date}</div>
          </li>
        `).join('')}
      </ul>
      <p><a href="/notes">all notes →</a></p>
    ` : '<p>No notes yet.</p>'}

    <h2 class="section-header">recent projects</h2>
    ${recentProjects.length > 0 ? `
      <ul class="item-list">
        ${recentProjects.map(p => `
          <li>
            <a href="/projects/${p.slug}">${p.title}</a>
            <div class="item-meta">${p.date}</div>
          </li>
        `).join('')}
      </ul>
      <p><a href="/projects">all projects →</a></p>
    ` : '<p>No projects yet.</p>'}
  `;

  return layout('Home', content, '/');
}
```

**Step 3: Create list template**

`worker/templates/list.ts`:

```typescript
import { layout } from './layout';

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
}

export function list(type: 'notes' | 'projects', items: ContentItem[]): string {
  const title = type === 'notes' ? 'Notes' : 'Projects';
  const basePath = `/${type}`;

  const content = `
    <h1>${title}</h1>
    ${items.length > 0 ? `
      <ul class="item-list">
        ${items.map(item => `
          <li>
            <a href="${basePath}/${item.slug}">${item.title}</a>
            <div class="item-meta">
              <span>${item.date}</span>
              ${item.tags?.length ? `
                <span class="item-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</span>
              ` : ''}
            </div>
          </li>
        `).join('')}
      </ul>
    ` : `<p>No ${type} yet.</p>`}
  `;

  return layout(title, content, basePath);
}
```

**Step 4: Create single template**

`worker/templates/single.ts`:

```typescript
import { layout } from './layout';

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  content: string;
}

export function single(type: 'notes' | 'projects', item: ContentItem): string {
  const basePath = `/${type}`;

  const content = `
    <article>
      <header>
        <h1>${item.title}</h1>
        <div class="item-meta">
          <span>${item.date}</span>
          ${item.tags?.length ? `
            <span class="item-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</span>
          ` : ''}
        </div>
      </header>
      <div class="content">
        ${item.content}
      </div>
      <p><a href="${basePath}">← back to ${type}</a></p>
    </article>
  `;

  return layout(item.title, content, basePath);
}
```

**Step 5: Commit templates**

```bash
git add worker/templates/
git commit -m "feat: add HTML templates"
```

---

## Task 6: Create Build Script

**Files:**
- Create: `scripts/build-content.ts`

**Step 1: Write the build script**

`scripts/build-content.ts`:

```typescript
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

interface ContentData {
  notes: ContentItem[];
  projects: ContentItem[];
}

async function parseMarkdownFiles(dir: string): Promise<ContentItem[]> {
  const items: ContentItem[] = [];

  try {
    const files = await readdir(dir);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = join(dir, file);
      const raw = await readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const slug = file.replace('.md', '');
      const html = await marked(content);

      items.push({
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        tags: data.tags || [],
        content: html,
      });
    }
  } catch (e) {
    // Directory might not exist or be empty
  }

  // Sort by date, newest first
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

async function main() {
  console.log('Building content...');

  const notes = await parseMarkdownFiles('content/notes');
  const projects = await parseMarkdownFiles('content/projects');

  const data: ContentData = { notes, projects };

  await mkdir('worker', { recursive: true });
  await writeFile('worker/content.json', JSON.stringify(data, null, 2));

  console.log(`Built ${notes.length} notes, ${projects.length} projects`);
}

main().catch(console.error);
```

**Step 2: Commit build script**

```bash
git add scripts/build-content.ts
git commit -m "feat: add content build script"
```

---

## Task 7: Update Worker

**Files:**
- Modify: `worker/index.ts`

**Step 1: Rewrite the worker**

Replace `worker/index.ts` entirely:

```typescript
import { home } from './templates/home';
import { list } from './templates/list';
import { single } from './templates/single';
import { layout } from './templates/layout';
import contentData from './content.json';

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

interface ContentData {
  notes: ContentItem[];
  projects: ContentItem[];
}

const content: ContentData = contentData as ContentData;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Home
    if (path === '/' || path === '') {
      return html(home(content.notes, content.projects));
    }

    // Notes list
    if (path === '/notes' || path === '/notes/') {
      return html(list('notes', content.notes));
    }

    // Single note
    if (path.startsWith('/notes/')) {
      const slug = path.replace('/notes/', '').replace(/\/$/, '');
      const note = content.notes.find(n => n.slug === slug);
      if (note) {
        return html(single('notes', note));
      }
    }

    // Projects list
    if (path === '/projects' || path === '/projects/') {
      return html(list('projects', content.projects));
    }

    // Single project
    if (path.startsWith('/projects/')) {
      const slug = path.replace('/projects/', '').replace(/\/$/, '');
      const project = content.projects.find(p => p.slug === slug);
      if (project) {
        return html(single('projects', project));
      }
    }

    // 404
    const notFound = layout('Not Found', '<h1>404</h1><p>Page not found.</p><p><a href="/">← home</a></p>');
    return html(notFound, 404);
  },
} satisfies ExportedHandler<Env>;

function html(body: string, status: number = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
```

**Step 2: Commit worker**

```bash
git add worker/index.ts
git commit -m "feat: rewrite worker for static site routing"
```

---

## Task 8: Add Sample Content

**Files:**
- Create: `content/notes/hello-world.md`
- Create: `content/projects/digital-garden.md`

**Step 1: Create sample note**

`content/notes/hello-world.md`:

```markdown
---
title: "Hello World"
date: 2026-02-05
tags: [meta, first-post]
---

This is my first note. Welcome to my digital garden.

## What is this?

A place to collect thoughts, learnings, and half-baked ideas. Not everything here is polished - that's the point.

## Why "digital garden"?

Unlike a blog with its chronological pressure, a garden is:

- **Non-linear** - explore however you want
- **Always growing** - notes get updated over time
- **Imperfect** - seedlings and mature plants coexist

```bash
echo "hello, world"
```

More to come.
```

**Step 2: Create sample project**

`content/projects/digital-garden.md`:

```markdown
---
title: "This Website"
date: 2026-02-05
tags: [cloudflare, workers, typescript]
---

My personal digital garden, built with Cloudflare Workers.

## Stack

- **Cloudflare Workers** - serverless edge compute
- **TypeScript** - type safety
- **Markdown** - content authoring
- **No frameworks** - just HTML, CSS, and a bit of JS

## Features

- Terminal aesthetic with monospace everything
- Markdown content compiled at build time
- Fast edge delivery via Cloudflare's network

## What I learned

Building this taught me the basics of Cloudflare Workers:

1. How Workers handle requests and responses
2. Serving static assets alongside dynamic routes
3. TypeScript configuration for Workers
4. Wrangler CLI for development and deployment

[View source on GitHub](https://github.com/dean/deank)
```

**Step 3: Commit sample content**

```bash
git add content/
git commit -m "feat: add sample content"
```

---

## Task 9: Install Dependencies and Test

**Step 1: Remove node_modules and reinstall**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Step 2: Generate Cloudflare types**

```bash
npm run cf-typegen
```

**Step 3: Build content**

```bash
npm run build:content
```

**Step 4: Run dev server**

```bash
npm run dev
```

**Step 5: Test in browser**

- Visit http://localhost:8787
- Check home page loads with ASCII art
- Click through to /notes and /projects
- View individual note and project pages
- Verify 404 page works for invalid routes

**Step 6: Commit generated files if needed**

```bash
git add worker/content.json worker-configuration.d.ts
git commit -m "chore: add generated files"
```

---

## Task 10: Update README

**Files:**
- Modify: `README.md`

**Step 1: Replace README**

```markdown
# deank

My personal digital garden. Built with Cloudflare Workers.

## Development

```bash
npm install
npm run dev
```

## Adding Content

Create markdown files in:
- `content/notes/` - for notes and thoughts
- `content/projects/` - for project writeups

Format:

```markdown
---
title: "Your Title"
date: 2026-02-05
tags: [tag1, tag2]
---

Your content here...
```

## Deploy

```bash
npm run deploy
```

## Stack

- Cloudflare Workers
- TypeScript
- Marked (markdown)
- Gray-matter (frontmatter)
```

**Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: update README for digital garden"
```

---

## Summary

After completing all tasks you'll have:

1. A working Cloudflare Worker serving your digital garden
2. Terminal aesthetic with ASCII art header
3. Markdown-based content system
4. Home, notes list, projects list, and single item pages
5. Sample content to start with
6. Simple workflow: write markdown → deploy → live

To add new content: create a `.md` file in `content/notes/` or `content/projects/`, then `npm run deploy`.
