# 📚 Tutorial Engine — Full Documentation

## 📑 Table of Contents
- [🚀 Description](#description)
- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [💻 Run Locally](#run-locally)
- [🧪 Example Included](#example-included)
- [🏗️ Architecture](#architecture)
- [✍️ Supported Syntax](#supported-syntax)
- [🧩 Challenges](#challenges)
- [📚 What I Learned](#what-i-learned)
- [✅ Next Strict Steps](#next-strict-steps)

## 🚀 Description

Tutorial Engine is a custom parser and generator that transforms **Extended Markdown** into **React components**.  
It is useful for creating interactive documentation sites with features like checklists, callouts, spoilers, code highlighting and navigation buttons, all generated from Markdown files.  
It can also be hosted on a server, where the user only needs to modify the `.md` files and rerun `index.ts` once the changes or folder structure updates are finished.

## ✨ Features

- Parse Extended Markdown with support for headings, lists, blockquotes, callouts, spoilers and to‑dos.
- Automatic generation of `.tsx` React components from `.md` files.
- Code fences with syntax highlighting, copy-to-clipboard and **language icons powered by devicons-react**.
- Side navigation with animated transitions (Framer Motion).
- Back/Next navigation buttons detected from Markdown markers.
- Support for multiple callout styles (`good`, `bad`, `warning`) with titles and dividers.
- Automatic route discovery and directory tree building.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Framer Motion
- **Code Highlighting:** highlight.js
- **Icons:** devicons-react
- **Parser/Engine:** Node.js + TypeScript (custom build pipeline)
- **Version Control:** Git + GitHub

## 💻 Run Locally

Clone the project

```bash
git clone <your-repo-url>
cd tutorial-engine-main
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

---

## 🧪 Example Included

This repository already includes **multiple example projects** generated automatically.  
Inside the `engine/tests` folder you will find **three separate test sets**, each representing a different collection of Markdown files and folder structures.  
When running the engine, **each test set is transformed into its own React project** inside the `frontend` folder.  

This demonstrates how the parser can handle different Markdown sources and produce distinct React applications out of them.  

### Where to write your Markdown files
- The Markdown files in `engine/tests` are intended only as **examples and tests**.  
- You can configure the input path to point to any folder where you prefer to keep your `.md` files.  
- For better organization, it is recommended to keep those Markdown content folders **inside the `engine` directory**, so everything related to parsing and generation stays together.
  
## 🏗️ Architecture

### Overview
This project converts **Extended Markdown** files into **React components (.tsx)** and automatically configures routes.

- **engine/**: parser and generator. Reads `*.md`, transforms content into JSX, highlights code with highlight.js, and writes files into `frontend/src/output`.
- **frontend/**: Vite + React + TypeScript application. Renders the generated components and the side navigation animated with Framer Motion.
- **frontend/src/output/**: generated output. Contains:
  - `directoriesList.ts`: list of routes from .md files to build the navigation tree.
  - `*.tsx`: React components for each .md file.

### Build Flow (high level)
1. **Discovery**: the engine scans the content tree and calls `processFile` for each `.md` file.
2. **Line-by-line parsing**: `processLine` interprets headings, lists, blockquotes, spoilers, callouts and code fences, maintaining global state to know what to open and close.
3. **Code block capture**: `fillArrOfCodeArrays` accumulates blocks with language metadata, and `generateArraysOfCodes` emits them as TypeScript arrays.
4. **TSX generation**: `processPath` writes the final component and creates any missing folders.
5. **Route directory**: `directoriesList.ts` is updated with the detected routes in `arrDirectories`.

### Parser State
The parser uses global variables to keep track of nested structures:
- Ordered and unordered lists, counters and levels.
- Blockquotes, callouts and spoilers.
- Code fences ``` with language tracking.
- Back and next navigation buttons.

`restartVariables` ensures the state is reset when processing each file.

### Render & UI
- **Navigation**: `MenuButton` with Framer Motion animations and hierarchical structure built from `directoriesList.ts`.
- **Code**: integrated with `highlight.js` for coloring. Copy button managed by `handleCopyClipboard`.
- **Routes**: Vite + React Router, generating `<Route>` entries for each file in `output/`.

### Decisions & Trade-offs
- Handwritten single-pass parser for performance and fine control. It might benefit from a formal grammar or a Markdown library with extensions, but that would reduce control over the current DSL.
- Global state vs block-level state stack: simpler, but requires discipline to close tags correctly.

### Known Risks
- Unclosed tags when transitioning between block types if content is malformed.
- Component name collisions if routes contain special characters.
- Dependency on processing order for `arrDirectories`.

### Recommended Next Steps
1. Unit tests for `processLine` with snapshots per pattern.
2. Normalize component names with a single robust `generateComponentName` function.
3. Migrate parser state from loose variables to a `ParserState` object.
4. Validate the resulting tree with an HTML/JSX linter to detect unclosed tags.

---

## ✍️ Supported Syntax

This is the **practical specification** of the _Extended Markdown_ understood by `engine/index.ts`. Where possible, input patterns, output JSX and notes are shown.

### Headings and Separators
- `# Title` → `<h1>Title</h1><hr className="hrN" />`
- `## Subtitle` → `<h2>…</h2><hr className="hrN" />`
- `### Section` → `<h3>…</h3>`
- Line `---` or `***` → `<hr className="hrN" />` with increment of N per section.

### Lists
- `- Item` or `* Item` → `<ul><li>Item</li></ul>`
- `1. Item` → `<ol start={{n}}><li>Item</li></ol>`
- Sublevels handled by indentation and variables `ulLayer` and `olLayer`.

### To‑dos
- Special prefix like `_\todo Text_` creates a **checkbox** with label.
  - Output: `<input type="checkbox" id="todo-component-…"/> <label>Text</label>`

### Blockquotes
- Lines starting with `>` open `<blockquote>` and close when the block changes.

### Code Blocks
- Fences with ````` or triple backticks open and close code blocks.  
- Each block’s language is detected and stored for rendering and imports.  
- In addition to syntax highlighting, the engine automatically imports icons from **devicons-react** and displays them next to each language tab (for example, `<JavascriptPlain size="30" />` next to the JavaScript tab).  
- **Multi-language blocks:**  
  - To create a tabbed block with different languages, place code fences **immediately one after another with no empty lines between them**.  
  - If there are spaces or empty lines, the engine will treat them as separate blocks.  
  - To intentionally separate blocks, use a **double line break**.

### 💡 Callouts

- Markers: `!good`, `!bad`, `!warning` open info boxes with green, red or yellow color.
- Versions with title: `!goodTitle <Text>`, `!badTitle <Text>`, `!warningTitle <Text>`.
- Horizontal divider inside callout: `!goodHr`, `!badHr`, `!warningHr`.
- Text shortcuts inside: `!<type> <Text>` adds paragraphs inside the open callout.

### 🙈 Spoilers

- Sections between `$` delimiters open a collapsible block, accumulating content until closed.

### 🧭 Navigation

- Special markers for **back** and **next** inside the file are extracted with `fillNavButtonsMap` and converted into navigation buttons.

### 🔤 HTML Entities

- `&mdash;` is allowed for em dash.
- The parser does not escape raw HTML inside normal lines. Use with caution.

---


## 🧩 Challenges

- Designing a parser with many global states was challenging; a more robust **data tree structure** would simplify nested elements.  
- Handling transitions between block types (e.g., callout → list → blockquote) required careful tag closing logic.  
- Normalizing component names for React without collisions demanded slugification and sanitization.  
- Ensuring accessibility (ARIA attributes, keyboard navigation) while keeping custom UI elements consistent.

---

## 📚 What I Learned

- Building a custom Markdown‑to‑React parser deepened my understanding of parsing strategies and state machines.  
- Using arrays of code blocks with language metadata provided flexibility for rendering and copy‑to‑clipboard features.  
- Framer Motion is powerful for navigation animations when combined with hierarchical data trees.  
- Balancing between quick string concatenations and more maintainable template literals is key for build pipelines.  
- Accessibility should be considered early, especially when extending Markdown with custom syntax.

---

## ✅ Next Strict Steps

1. **Parser tests**
   - Create `engine/tests/processLine.spec.ts`.
   - Minimum cases: headings, nested UL/OL list, blockquote, callout with title and hr, spoiler, code fence with language, back/next navigation.

2. **Unify state**
   - Create `ParserState` and implement `restartVariables(state)`.
   - Pass `state` as argument to `processLine`, `checkIfNeedClosingandAddTag`, etc.

3. **Safe escaping**
   - Add util `escapeHtml(str)` and apply to all literals except code blocks.

4. **Normalize names**
   - Rewrite `generateComponentName()` with slugify and deduplication.

5. **Engine CLI**
   - New npm command: `engine:build` and `engine:watch`.

6. **Accessibility**
   - Add `aria-*` to spoilers and callouts. See WAI-ARIA disclosure docs.
