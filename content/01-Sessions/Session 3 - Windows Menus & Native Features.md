---
tags: [electron, BrowserWindow, menus, dialogs, filesystem]
session: 3
duration: 2 hours
status: ready
---

# Session 3 — Windows, Menus & Native Features

## 🎯 Objectives
- Configure BrowserWindow with different options
- Build a native application menu
- Open and save files using system dialogs
- Read and write files with Node.js `fs`

---

## 🧠 Concepts Covered

### BrowserWindow Options
```js
const win = new BrowserWindow({
  width: 1000,
  height: 700,
  minWidth: 400,
  title: "My App",
  backgroundColor: '#1e1e1e',
  frame: true,           // set false for frameless window
  resizable: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
})
```

### App Lifecycle Events
```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
```

### Native Menus
```js
const { Menu, MenuItem } = require('electron')

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      { label: 'Open', accelerator: 'CmdOrCtrl+O', click: openFile },
      { label: 'Save', accelerator: 'CmdOrCtrl+S', click: saveFile },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  { role: 'editMenu' },
  { role: 'viewMenu' }
])

Menu.setApplicationMenu(menu)
```

### File Dialogs & fs
```js
const { dialog } = require('electron')
const fs = require('fs')

async function openFile() {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'Text Files', extensions: ['txt', 'md'] }]
  })
  if (!result.canceled) {
    const content = fs.readFileSync(result.filePaths[0], 'utf-8')
    // send content to renderer via IPC (next session!)
  }
}
```

---

## 🛠 Hands-on Exercise — Markdown Notepad (60 min)

Build a simple text editor:

**Features to implement:**
1. A `<textarea>` that fills the window
2. File → Open loads a `.txt` file into the textarea
3. File → Save writes the textarea content back to disk
4. Title bar shows the filename

**Starter structure:**
```
notepad/
├── main.js
├── preload.js
├── index.html
└── package.json
```

> ⚠️ Note: Full IPC wiring comes in Session 4 — for now, students can use `remote` module or handle everything in main.js as a simplified demo

---

## 📦 Resources
- [BrowserWindow Docs](https://www.electronjs.org/docs/latest/api/browser-window)
- [dialog Docs](https://www.electronjs.org/docs/latest/api/dialog)
- [[Session 4 - IPC Communication]] ← next (this is where it all clicks)