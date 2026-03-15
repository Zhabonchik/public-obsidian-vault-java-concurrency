---
tags: [websockets, ipc, renderer, UI, final-project]
session: 7
duration: 2 hours
status: ready
---

# Session 7 — Connecting the UI to the WebSocket

## 🎯 Objectives
- Connect the Renderer UI to the WebSocket via IPC
- Display incoming messages dynamically in the DOM
- Send messages from the input field
- Handle connection states and polish the UX

---

## 🧠 Architecture Recap
```
[Renderer UI]
    ↕ ipcRenderer (via preload.js)
[Main Process]
    ↕ WebSocket
[Other Clients]
```

The Renderer doesn't touch WebSocket directly — it talks to Main via IPC, and Main relays to/from the WebSocket server.

---

## 🧠 Concepts Covered

### Forwarding WebSocket Messages via IPC
```js
// main.js — when a WS message arrives, forward to renderer
wss.on('connection', (socket) => {
  socket.on('message', (data) => {
    // Broadcast to all WS clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(data.toString())
    })
    // Also send to our own renderer window
    mainWindow.webContents.send('new-message', JSON.parse(data.toString()))
  })
})
```

### Exposing the API via preload.js
```js
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('chatAPI', {
  sendMessage: (message) => ipcRenderer.send('send-message', message),
  onMessage: (callback) => ipcRenderer.on('new-message', (_, msg) => callback(msg))
})
```

### Renderer: Sending & Displaying Messages
```js
// renderer/app.js
const form = document.getElementById('message-form')
const input = document.getElementById('message-input')
const chatBox = document.getElementById('chat-box')

// Send a message
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return

  window.chatAPI.sendMessage({
    username: localStorage.getItem('username') || 'Anonymous',
    text,
    timestamp: new Date().toLocaleTimeString()
  })
  input.value = ''
})

// Receive messages
window.chatAPI.onMessage((msg) => {
  const div = document.createElement('div')
  div.className = 'message'
  div.innerHTML = `
    <span class="username">${msg.username}</span>
    <span class="text">${msg.text}</span>
    <span class="time">${msg.timestamp}</span>
  `
  chatBox.appendChild(div)
  chatBox.scrollTop = chatBox.scrollHeight
})
```

### Connection State UI
```js
// Show "connecting..." / "connected" / "disconnected" states
ipcRenderer.on('ws-status', (_, status) => {
  document.getElementById('status').textContent = status
  document.getElementById('status').className = status
})
```

---

## 🛠 Hands-on Exercise — Complete the App (80 min)

1. Wire up `preload.js` with `chatAPI`
2. Implement the message send handler
3. Implement the message receive + DOM append
4. Style the chat bubbles in `style.css`
5. Add username prompt on app start (`prompt()` or a simple input screen)
6. Test across 3+ laptops on the same network

**Bonus challenges:**
- Show "User X joined" when someone connects
- Different color bubbles for your messages vs others
- Sound notification on new message
- Timestamp on each message

---

## 📦 Resources
- [[Session 6 - WebSocket Server]] ← previous
- [[Session 8 - Packaging & Distribution]] ← next