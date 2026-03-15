---
tags: [electron, packaging, electron-builder, distribution]
session: 8
duration: 2 hours
status: ready
---

# Session 8 — Packaging, Distribution & Wrap-up

## 🎯 Objectives
- Package the app into a native installer
- Create `.exe` (Windows), `.dmg` (Mac), `.AppImage` (Linux)
- Understand what comes after (updates, crash reporting)
- Demo day — run each other's packaged apps

---

## 🧠 Concepts Covered

### electron-builder
```bash
npm install --save-dev electron-builder
```

Add to `package.json`:
```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.yourname.lanchat",
    "productName": "LAN Chat",
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": "nsis"
    },
    "mac": {
      "target": "dmg"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

Then run:
```bash
npm run build
```

Output appears in `/dist` folder.

### App Icons
- Create a 512x512 `.png` icon
- Save as `build/icon.png` (electron-builder picks it up automatically)
- Tools: [icon.kitchen](https://icon.kitchen) or Figma

### What's Inside the Package?
```
dist/
├── win-unpacked/          ← the app folder
├── LAN Chat Setup.exe     ← installer
└── builder-effective-config.yaml
```

---

## 🧠 What's Next After This Course?

### Electron Alternatives
| Tool | Language | Why Use It |
|------|----------|------------|
| **Tauri** | Rust + Web | Much smaller bundle size |
| **NW.js** | Web | Older, similar to Electron |
| **Flutter** | Dart | Cross-platform inc. mobile |

### Electron Features to Explore
- **Auto-updater** — push updates silently to users
- **Tray icon** — app lives in system tray
- **Notifications** — native OS notifications
- **Deep links** — open app from a URL
- **Crash reporter** — collect error reports

---

## 🛠 Demo Day (60 min)

**Each student / pair:**
1. Runs `npm run build`
2. Shares the installer via USB or local network share
3. Another student installs it on a fresh machine
4. Everyone's chat app connects to one room

**Presentation (2 min each):**
- What feature are you most proud of?
- What was the hardest bug you fixed?
- What would you add with more time?

---

## ✅ Course Wrap-up Checklist
- [ ] All students have a working packaged app
- [ ] Share the vault / notes repo with students
- [ ] Collect feedback form
- [ ] Share "what to learn next" resources

## 📦 Final Resources
- [electron-builder Docs](https://www.electron.build)
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)
- [[Session 1 - How Electron Works]] ← back to the beginning