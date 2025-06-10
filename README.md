# 🐾 KAT – Keyboard Assisted Terminal

**KAT** is a sleek, customizable web-embedded terminal built with **Vanilla JavaScript**, **Electron.js**, and pure **HTML/CSS**. It runs a real shell in the background while offering a cleaner interface, custom keybindings, sound effects, and CSS-injected themes — making customization fast and powerful.

Designed to feel familiar but enhanced, KAT gives you power and clarity in one beautiful terminal.

---

## ⚙️ Key Features

- 🎨 **Themes with CSS Injection**  
  Powered by direct CSS injection — creating a theme is as easy as changing class names or CSS variables. Style your terminal in seconds without touching the core logic.


## 🛠️ Customization

- **Themes (Powered by CSS Injection):**  
  Drop your `.css` files into the `/themes` folder and activate them via the settings menu.  
  You can build your own theme by simply redefining existing CSS variables or overriding class styles.  
  No compilation, no complexity — just pure styling freedom.

  ```css
  /* Example: Light Theme */
  :root {
    --bg-color: #ffffff;
    --text-color: #111111;
    --accent-color: #00b894;
  }

  .terminal {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
  ```

- 🔊 **Custom sounds**  
  Enjoy unique sound feedback for key events, making the experience more immersive.

- ⌨️ **Keyboard Shortcuts**  
  Boost your productivity with custom keybindings and command macros.

- 📦 **Modular system**  
  Simple module installation and management for expanding functionality.

- 📁 **Log compatibility**  
  Perfectly displays output from languages like **C#**, **Python**, **Bash**, and more — ideal for tailing logs or running scripts.

- 🧼 **Minimal and Clean UI**  
  Designed to keep distractions out of the way and focus on what matters.

- 🪟 **CMD Compatible**  
  Full compatibility with Windows' CMD environment for extended use cases.

---

## 🚀 Built With

- [Electron.js](https://www.electronjs.org/)  
- Vanilla JavaScript  
- Pure HTML & CSS

No frameworks. No bloat. Just raw power.

---

## 📦 Installation

> Make sure you have **Node.js** installed. Then:

```bash
git clone https://github.com/your-username/kat.git
cd kat
npm install
npm run start
