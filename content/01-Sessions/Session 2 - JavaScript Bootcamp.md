---
tags: [javascript, fundamentals, dom]
session: 2
duration: 2 hours
status: ready
---

# Session 2 — JavaScript Crash Bootcamp

## 🎯 Objectives
- Write and understand modern JavaScript
- Manipulate the DOM
- Use Node.js modules with `require`
- Install and use an npm package

---

## 🧠 Concepts Covered

### Variables & Functions
```js
// Prefer const and let over var
const name = "Alice"
let count = 0

// Arrow function
const greet = (name) => {
  return `Hello, ${name}!`
}

// Short form
const double = (n) => n * 2
```

### DOM Manipulation
```js
// Select an element
const btn = document.getElementById('myButton')
const title = document.querySelector('h1')

// Change content
title.textContent = "New Title"
title.style.color = "blue"

// Listen for events
btn.addEventListener('click', () => {
  console.log('Button clicked!')
})
```

### Node.js Modules
```js
// Built-in Node module
const path = require('path')
const fs = require('fs')

// Read a file
const content = fs.readFileSync('notes.txt', 'utf-8')
console.log(content)
```

### npm Packages
```bash
npm install moment   # installs a package
```
```js
const moment = require('moment')
console.log(moment().format('MMMM Do YYYY'))
```

### Async Basics
```js
// Things that take time use callbacks or async/await
setTimeout(() => {
  console.log("This runs after 2 seconds")
}, 2000)
```

---

## 🖥 Talking Points

1. Show the browser DevTools console — students can try JS right there
2. Demo DOM changes live in the browser
3. Show `require` in Node.js vs `import` (keep it simple, use require)
4. Explain why `const` is preferred

---

## 🛠 Hands-on Exercise (50 min)

**Build a click counter app, then load it in Electron**

Part 1 — Build in browser first:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 40px; }
    button { font-size: 24px; padding: 10px 30px; cursor: pointer; }
    #count { font-size: 72px; color: #333; }
  </style>
</head>
<body>
  <h1>Click Counter</h1>
  <div id="count">0</div>
  <button id="btn">Click me!</button>

  <script>
    let clicks = 0
    const countEl = document.getElementById('count')
    const btn = document.getElementById('btn')

    btn.addEventListener('click', () => {
      clicks++
      countEl.textContent = clicks
      if (clicks >= 10) countEl.style.color = 'red'
    })
  </script>
</body>
</html>
```

Part 2 — Load it in Electron:
- Drop this `index.html` into their Electron project from Session 1
- Run `npm start` — it's now a desktop app!

**Challenges:**
- Add a reset button
- Show a congratulations message at 20 clicks
- Change the background color based on click count

---

## 📦 Resources
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [[Session 1 - How Electron Works]] ← previous
- [[Session 3 - Windows Menus & Native Features]] ← next
-