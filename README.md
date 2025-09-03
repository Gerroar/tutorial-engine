# 📚 Tutorial Engine — Full Documentation

## 📑 Table of Contents
- [🚀 Description](#user-content-description)
- [✨ Features](#user-content-features)
- [🛠️ Tech Stack](#user-content-tech-stack)
- [💻 Run Locally](#user-content-run-locally)
- [🧪 Example Included](#user-content-example-included)
- [🏗️ Architecture](#user-content-architecture)
- [✍️ Supported Syntax](#user-content-supported-syntax)
- [🧩 Challenges](#user-content-challenges)
- [📚 What I Learned](#user-content-what-i-learned)
- [✅ Next Strict Steps](#user-content-next-strict-steps)

<a id="description"></a>
## 🚀 Description
Tutorial Engine is a custom parser and generator that transforms **Extended Markdown** into **React components**.  
It is useful for creating interactive documentation sites with features like checklists, callouts, spoilers, code highlighting and navigation buttons, all generated from Markdown files.

<a id="features"></a>
## ✨ Features
- Parse Extended Markdown with support for headings, lists, blockquotes, callouts, spoilers and to‑dos.
- Automatic generation of `.tsx` React components from `.md` files.
- Code fences with syntax highlighting and copy‑to‑clipboard.
- Side navigation with animated transitions (Framer Motion).
- Back/Next navigation buttons detected from Markdown markers.
- Support for multiple callout styles (`good`, `bad`, `warning`) with titles and dividers.
- Automatic route discovery and directory tree building.


<a id="tech-stack"></a>
## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite, TailwindCSS, Framer Motion
- **Code Highlighting:** highlight.js
- **Parser/Engine:** Node.js + TypeScript (custom build pipeline)
- **Version Control:** Git + GitHub

<a id="run-locally"></a>
## 💻 Run Locally

Clone the project

```bash
git clone https://github.com/Gerroar/tutorial-engine.git
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

### Configure Markdown input path
By default, the engine is configured to read Markdown files from a path defined inside `engine/index.ts`.  
- If you want to keep your `.md` files in a different folder, adjust the path there.  
- For testing, the repository includes the examples inside `engine/tests`.  
- For production use, it is recommended to keep your Markdown content inside `engine/` for easier organization.  

### Run the engine manually
To rebuild the React output after editing or adding Markdown files, run:

```bash
npx ts-node engine/index.ts
```

---

<a id="example-included"></a>
## 🧪 Example Included
This repository already includes **multiple example projects** generated automatically.  
Inside the `engine/tests` folder you will find **three separate test sets**, each representing a different collection of Markdown files and folder structures.  
When running the engine, **each test set is transformed into its own React project** inside the `frontend` folder.  

This demonstrates how the parser can handle different Markdown sources and produce distinct React applications out of them.  

### Where to write your Markdown files
- The Markdown files in `engine/tests` are intended only as **examples and tests**.  
- You can configure the input path to point to any folder where you prefer to keep your `.md` files.  
- For better organization, it is recommended to keep those Markdown content folders **inside the `engine` directory**, so everything related to parsing and generation stays together.
  
---

<a id="architecture"></a>
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
- Handwritten single-pass parser for performance and fine control. [Not verified] It might benefit from a formal grammar or a Markdown library with extensions, but that would reduce control over the current DSL.
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

<a id="supported-syntax"></a>
## ✍️ Supported Syntax

This is the **practical specification** of the _Extended Markdown_ understood by `engine/index.ts`. Where possible, input patterns, output JSX and notes are shown.

> Source: analyzed directly from the parser code in `engine/index.ts`. Anything not shown here should be considered **[Not verified]**.

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
- Fences with ````` or triple backticks open and close blocks. If a language is specified, it is used by `highlight.js`.
- Stored in arrays `ArrCodeElement[]` and rendered with tabs and copy button.

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
- The parser does not escape raw HTML inside normal lines. [Not verified] Use with caution.

---

<a id="challenges"></a>
## 🧩 Challenges
- Designing a parser with many global states was challenging; a more robust **data tree structure** would simplify nested elements.  
- Handling transitions between block types (e.g., callout → list → blockquote) required careful tag closing logic.  
- Normalizing component names for React without collisions demanded slugification and sanitization.  
- Ensuring accessibility (ARIA attributes, keyboard navigation) while keeping custom UI elements consistent.

---

<a id="what-i-learned"></a>
## 📚 What I Learned
- Building a custom Markdown‑to‑React parser deepened my understanding of parsing strategies and state machines.  
- Using arrays of code blocks with language metadata provided flexibility for rendering and copy‑to‑clipboard features.  
- Framer Motion is powerful for navigation animations when combined with hierarchical data trees.  
- Balancing between quick string concatenations and more maintainable template literals is key for build pipelines.  
- Accessibility should be considered early, especially when extending Markdown with custom syntax.

---

<a id="next-strict-steps"></a>
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
