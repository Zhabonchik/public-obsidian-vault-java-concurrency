---
tags: [websockets, server, nodejs, ws]
session: 6
duration: 2 hours
status: ready
---

# Session 6 — Building the WebSocket Server

## 🎯 Objectives
- Set up a `ws` WebSocket server inside Electron's Main process
- Handle client connections and disconnections
- Receive and broadcast messages to all clients
- Test with two laptops communicating in real-time

---

## 🧠 Concepts Covered

### The `ws` Package
```bash
npm install ws
```

### Basic WebSocket Server
```js
const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 3000 })

wss.on('connection', (socket) => {
  console.log('A client connected!')

  socket.on('message', (data) => {
    const message = JSON.parse(data)
    console.log('Received:', message)

    // Broadcast to ALL connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  })

  socket.on('close', () => {
    console.log('A client disconnected')
  })
})

console.log('WebSocket server running on ws://localhost:3000')
```

### Integrating Into Electron's Main Process
```js
// main.js
const { app, BrowserWindow } = require('electron')
const { WebSocketServer } = require('ws')

let wss

function startServer() {
  wss = new WebSocketServer({ port: 3000 })

  wss.on('connection', (socket) => {
    socket.on('message', (data) => {
      // Broadcast to all
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(data.toString())
        }
      })
    })
  })
}

app.whenReady().then(() => {
  startServer()
  createWindow()
})
```

### Connecting From Another Machine (LAN)
```js
// On another laptop, connect to the server's IP
const ws = new WebSocket('ws://192.168.1.X:3000')
// Replace X with the server machine's local IP
```

> Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

---

## 🛠 Hands-on Exercise (70 min)

**Goal: Two laptops, one chat**

1. Student A sets up the WebSocket server in `main.js`
2. Student B opens a plain HTML file and connects to Student A's IP
3. Student B types a message → it appears on Student A's console
4. Add broadcasting so it goes back to all clients

**Test script for Student B (plain HTML):**
```html
<!DOCTYPE html>
<html>
<body>
  <input id="msg" placeholder="Type a message">
  <button onclick="send()">Send</button>
  <div id="log"></div>
  <script>
    const ws = new WebSocket('ws://REPLACE_WITH_IP:3000')

    ws.onmessage = (event) => {
      const log = document.getElementById('log')
      log.innerHTML += `<p>${event.data}</p>`
    }

    function send() {
      const text = document.getElementById('msg').value
      ws.send(JSON.stringify({ username: 'Student B', text }))
    }
  </script>
</body>
</html>
```

---

## ⚠️ Common Issues
- Firewall blocking port 3000 → disable Windows Defender firewall temporarily
- Wrong IP address → double check with `ipconfig`
- Port already in use → change to `3001`

---

## 📦 Resources
- [ws Documentation](https://github.com/websockets/ws)
- [[Session 7 - Connecting UI to WebSocket]] ← next