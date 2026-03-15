---
tags: [electron, ipc, preload, contextBridge, security]
session: 4
duration: 2 hours
status: ready
---

# Session 4 — IPC: Making the Two Processes Talk

## 🎯 Objectives
- Understand why IPC exists and why it's necessary
- Send messages from Renderer → Main and back
- Use `preload.js` and `contextBridge` safely
- Wire a full two-way communication flow

---

## 🧠 Concepts Covered

### Why IPC?
The Renderer runs in a sandboxed browser context.
It cannot directly call `fs.readFile()` or access Node.js.
IPC is the secure message-passing bridge.
```
Renderer → ipcRenderer.send('open-file') →
Main    → ipcMain.on('open-file', handler) →
Main    → win.webContents.send('file-content', data) →
Renderer → ipcRenderer.on('file-content', handler)
```

### The Secure Way: preload.js + contextBridge
```js
// preload.js — runs in a special context with BOTH Node and DOM access
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  onFileLoaded: (callback) => ipcRenderer.on('file-loaded', callback)
})
```
```js
// main.js — handles the requests
const { ipcMain, dialog } = require('electron')
const fs = require('fs')

ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog({ ... })
  if (!result.canceled) {
    return fs.readFileSync(result.filePaths[0], 'utf-8')
  }
})

ipcMain.handle('save-file', async (event, content) => {
  const result = await dialog.showSaveDialog({})
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, content)
    return true
  }
})
```
```js
// renderer (index.html script) — uses the exposed API
document.getElementById('open-btn').addEventListener('click', async () => {
  const content = await window.electronAPI.openFile()
  document.getElementById('editor').value = content
})
```

### invoke vs send
| `ipcRenderer.send` | `ipcRenderer.invoke` |
|--------------------|----------------------|
| Fire and forget | Returns a Promise |
| One-way | Two-way (request/response) |
| Use for events | Use for data fetching |

---

## 🛠 Hands-on Exercise — Wire the Notepad (60 min)

Complete the Notepad from Session 3 using proper IPC:

1. Set up `preload.js` with `contextBridge`
2. Add `webPreferences: { preload: ... }` to BrowserWindow
3. Expose `openFile` and `saveFile` via `electronAPI`
4. Wire up Open and Save buttons in the renderer
5. **Bonus:** Add a word count display that updates as you type

---

## ⚠️ Common Mistakes
- Forgetting to set `preload` in `webPreferences`
- Using `nodeIntegration: true` (insecure, avoid it)
- Trying to `require('fs')` in renderer directly

---

## 📦 Resources
- [IPC Docs](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [contextBridge Docs](https://www.electronjs.org/docs/latest/api/context-bridge)
- [[Session 5 - App Design & WebSockets Intro]] ← next