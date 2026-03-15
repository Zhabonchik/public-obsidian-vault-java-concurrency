---
tags: [electron, setup, architecture]
session: 1
duration: 2 hours
status: ready
---

# Session 1 — The Desktop Web: How Electron Works

## 🎯 Objectives
- Understand what Electron is and why it exists
- Set up the development environment
- Run a working Electron app
- Understand the Main vs Renderer process model

---

## 🧠 Concepts Covered

### What is Electron?
Electron lets you build desktop apps using HTML, CSS, and JavaScript.
It bundles two things together:
- **Chromium** → renders your UI (like a built-in browser)
- **Node.js** → gives you access to the filesystem, OS, and more

> Real apps built with Electron: VS Code, Slack, Discord, Figma, Notion

### Desktop vs Web Apps
| Web App | Desktop App |
|---------|-------------|
| Runs in browser | Runs natively on OS |
| No file system access | Full file system access |
| URL-based | Has its own window/icon |
| Auto-updated | Needs packaging/installer |

### The Two-Process Model ⚠️ (Most Important Concept)
```
┌─────────────────────────────┐
│        MAIN PROCESS         │  ← Node.js world
│  - Creates windows          │     File system, OS APIs
│  - App lifecycle            │
│  - Background logic         │
└────────────┬────────────────┘
             │ IPC (messages)
┌────────────▼────────────────┐
│      RENDERER PROCESS       │  ← Browser world
│  - Displays your HTML/CSS   │     DOM, UI events
│  - One per window           │
└─────────────────────────────┘
```

**Key rule:** Renderer cannot directly access Node.js. They communicate via IPC (covered in Session 4).

---

## 🖥 Talking Points

1. Open VS Code and show the folder structure of a blank Electron app
2. Walk through `package.json` — point out `"main": "main.js"`
3. Open `main.js` — explain `app.whenReady()` and `BrowserWindow`
4. Open `index.html` — show it's just normal HTML
5. Run `npm start` — a window appears!

---

## 💻 Live Demo
```js
// main.js — bare minimum Electron app
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head><title>My First App</title></head>
  <body>
    <h1>Hello Electron! 👋</h1>
  </body>
</html>
```

---

## 🛠 Hands-on Exercise (45 min)

**Goal:** Get a window running and customize it

1. Install Node.js from nodejs.org
2. Run in terminal:
```bash
   mkdir my-electron-app
   cd my-electron-app
   npm init -y
   npm install --save-dev electron
```
3. Create `main.js` and `index.html` from the demo above
4. Add to `package.json`: `"start": "electron ."`
5. Run `npm start`

**Challenges (pick one or more):**
- Change the window title
- Change the window size to 400x400
- Add your name in big text to `index.html`
- Set `resizable: false` on the window

---

## 📦 Resources
- [Electron Docs](https://electronjs.org/docs)
- [Node.js Download](https://nodejs.org)
- [[Session 2 - JavaScript Bootcamp]] ← next session

## ✅ Checklist
- [ ] Node.js installed on lab machines
- [ ] Starter repo shared with students
- [ ] Demo code tested on Windows + Mac
