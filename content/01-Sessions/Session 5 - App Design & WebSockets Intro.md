---
tags: [websockets, planning, design, project]
session: 5
duration: 2 hours
status: ready
---

# Session 5 — What Are We Building? + WebSockets Intro

## 🎯 Objectives
- Decide on the final project as a class
- Understand what WebSockets are and when to use them
- Sketch the app UI and define features
- Set up the project repo

---

## 🧠 Part 1 — Choosing the App (30 min)

### What makes a good Electron + WebSocket project?
- Real-time updates (needs WebSockets)
- Benefits from being a desktop app (not just a website)
- Simple enough to build in 3 sessions
- Visual and satisfying to demo

### Proposed Options

| App Idea | WebSocket Use | Complexity |
|----------|---------------|------------|
| 🗨 LAN Chat App | Send/receive messages in real-time | ⭐⭐ |
| 📝 Collaborative Notes | Multiple users edit the same note | ⭐⭐⭐ |
| 📊 Live System Dashboard | Show CPU/memory data live | ⭐⭐ |
| 🎮 Multiplayer Quiz Game | Questions pushed to all clients | ⭐⭐⭐ |

> 💡 **Recommended:** LAN Chat App — no internet needed, instantly testable in class, clearly demonstrates WebSocket concepts

### Class Vote → Decision: _______________

---

## 🧠 Part 2 — WebSockets Explained (30 min)

### HTTP vs WebSocket
```
HTTP (request/response):
Client → "Give me the messages" → Server
Server → "Here are 3 messages"  → Client
(connection closes)

WebSocket (persistent):
Client ←→ Server  (connection stays open)
Server can push data anytime!
```

### When to use WebSockets vs HTTP
| Use HTTP | Use WebSockets |
|----------|----------------|
| Load a page | Live chat |
| Submit a form | Real-time notifications |
| Fetch data once | Multiplayer games |
| REST API calls | Live dashboards |

### WebSocket Lifecycle
```
1. Client sends HTTP upgrade request
2. Server agrees → connection upgrades to WS
3. Both sides can now send messages freely
4. Either side can close the connection
```

---

## 🛠 Part 3 — Design the App (60 min)

**For LAN Chat App:**

Sketch on paper / whiteboard first:
- What does the UI look like?
- What data does each message contain?
- What happens when someone connects / disconnects?

**Message structure:**
```json
{
  "type": "message",
  "username": "Alice",
  "text": "Hello everyone!",
  "timestamp": "14:32"
}
```

**Set up the project:**
```bash
mkdir lan-chat-app
cd lan-chat-app
npm init -y
npm install --save-dev electron
npm install ws
```

**File structure to set up today:**
```
lan-chat-app/
├── main.js
├── preload.js
├── package.json
└── renderer/
    ├── index.html
    ├── style.css
    └── app.js
```

Build the static HTML/CSS shell of the chat UI (no functionality yet)

---

## 📦 Resources
- [WebSocket MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws npm package](https://www.npmjs.com/package/ws)
- [[Session 6 - WebSocket Server]] ← next