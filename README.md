# Quick VJS

**Quick VJS** is a simple tools for instantly creating *boilerplate* Vanilla JavaScript projects. This script automates the creation of basic HTML/CSS/JS files, project configuration, and includes developer server local (*live reload*) without complicated configuration.

---

## Features

* **Ready to use Template**
* **Manifest & Metadata**
* **Built-in Local Server**

---

## Project Folder Structure

```text
project-name/
├── index.html          # Main HTML file
├── style.css           # Main CSS file
├── index.js            # Main JS file
└── quick-vjs.json      # Metadata and project configuration
```

---

## Dependencies

Make sure your system (Linux / MacOS / Windows) has these dependencies installed:

1. **[Bun](https://bun.com/)** JavaScript runtime and toolkit (Latest version recommended)

---

## Installation

You can download the compiled binary in the [Release](https://github.com/r4ymrch/quick-vjs/releases) page or compile the source code. But i'm highly recommended you to compile it manually according to your platform to reduce compatibility issues.

## Build from source

1. Clone this repo.
   ```bash
   git clone https://github.com/r4ymrch/quick-vjs.git
   cd quick-vjs
   ```

2. Compile the source code

   **Make sure you has Bun installed in your system!**
   
   ```bash
   bun build --compile --minify ./src/index.ts --outfile ./dist/quick-vjs
   ```

3. Your app will be compiled to `./dist/quick-vjs`.
4. Place the compiled app whatever you want. Example for linux users, you can place it in `~/.local/bin` for easy access in terminal.

---

## Usage

### 1. Initialize project

1. Run
  ```bash
  quick-vjs init
  ```
2. Follow the steps show by interactive CLI on your terminal

---

### 2. Editing template

3. Change working directory
   ```bash
   cd [your project name]
   ```

4. Run the development server
   ```bash
   quick-vjs run
   ```

   It will automatically open browser and show the template web

5. Start code and Edit the files

---

## TO-DO

---

## License
Free to use and modify for personal needs.
