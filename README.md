# Personal Learning — Systems Engineering Curriculum & Daily Workbench

A high-performance systems engineering curriculum and daily lab workbench built with **Zola (Rust SSG)**, semantic HTML5, CSS3 design tokens, and vanilla JavaScript.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![SSG](https://img.shields.io/badge/Engine-Zola-orange.svg)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-success.svg)
![Designed with AI](https://img.shields.io/badge/Designed_with-AI%20%28Antigravity%20by%20Google%20DeepMind%29-8A2BE2.svg)

> **🤖 Designed & Architected with AI**: This entire systems engineering platform—including the 4-box mission control telemetry layout, interactive HUD system simulators, zero-dependency search engine, and PWA offline architecture—was designed and built with **AI (Antigravity by Google DeepMind)**.

---

## Key Features

* **⚡ Sub-70ms Compilation:** Powered by Zola (Rust static site generator) with 0KB framework bloat.
* **🖥️ 4-Box Telemetry Workbench:** Live Home Cockpit and Monthly Syllabus tracking banked study hours, sprint momentum, and active lab objectives.
* **📱 Progressive Web App (PWA) & Offline Reading:** Installable standalone app with Service Worker pre-caching for air-gapped or offline learning.
* **⌨️ Global Keyboard Navigation & Help HUD:** Full terminal-style hotkey navigation (<kbd>H</kbd>, <kbd>R</kbd>, <kbd>S</kbd>, <kbd>L</kbd>, <kbd>?</kbd>, <kbd>/</kbd>).
* **🔍 Spotlight Instant Search:** Zero-dependency fuzzy search across all curriculum topics and labs (<kbd>/</kbd> or <kbd>Ctrl + K</kbd>).
* **📈 Interactive Systems Simulators:** Markdown DSL blocks rendered as interactive hardware state machines (network sockets, eBPF pipelines, Raft consensus).
* **📋 Persistent Interactive Checklists:** Daily deliverables save checkmark states to `localStorage`.
* **💾 Study Log Backup & Sync:** 1-Click JSON export and import on the Verified History Ledger.
* **📦 Zero Dependencies:** No Node.js, no npm build steps, pure native web standards.

---

## Quick Start

### Option A: Standalone Binary (Recommended — Zero Dependencies)

1. Download the latest pre-compiled archive for your OS from **[Zola Latest Releases](https://github.com/getzola/zola/releases/latest)**.
2. **Verify SHA256 Checksum** against the hash published in the release notes:
   ```bash
   # Linux (x86_64)
   sha256sum zola-v*-x86_64-unknown-linux-gnu.tar.gz

   # macOS (Apple Silicon / Intel)
   shasum -a 256 zola-v*-*-apple-darwin.tar.gz
   ```
3. Extract and move `zola` to your PATH:
   ```bash
   tar -xzf zola-v*.tar.gz
   sudo mv zola /usr/local/bin/
   ```
4. Run local development server:
   ```bash
   zola serve
   ```
   Open **`http://localhost:1111`** in your browser.

---

### Option B: Using Podman / Docker
```bash
# Clone the repository
git clone https://github.com/<username>/learning-log.git
cd learning-log

# Build static site to public/
podman run --rm -v "$(pwd):/app:Z" -w /app ghcr.io/getzola/zola:v0.23.4 build

# Serve locally
python3 -m http.server 1111 --directory public
```
Open **`http://localhost:1111`** in your browser.

---

### Option C: Package Managers
```bash
# macOS
brew install zola

# Arch Linux
pacman -S zola

# Cargo (Rust)
cargo install --locked zola
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>/</kbd> or <kbd>Ctrl+K</kbd> | Open Spotlight Search Modal |
| <kbd>H</kbd> | Jump to Home Cockpit |
| <kbd>R</kbd> | Jump to Master Roadmap |
| <kbd>S</kbd> | Jump to Active Sprint Syllabus |
| <kbd>L</kbd> | Jump to Verified History Ledger |
| <kbd>?</kbd> | Open Keyboard Shortcuts HUD |
| <kbd>ESC</kbd> | Dismiss any open modal |

---

## Adding New Curriculum Content

Simply create a Markdown file in `content/<year>/<month>/day-XX-<topic>.md`:

```toml
+++
title = "Lab 01: Linux Process Tracing & System Calls"
description = "Inspect running Linux processes, system calls, and build a lightweight process monitor."
date = 2026-09-01
weight = 10

[extra]
month = "SEPTEMBER"
year = 2026
day = "01"
hours_spent = 2.5
+++

## 1. THE BRIEF
Your lab brief and architecture explanations...

## 4. DAILY DELIVERABLES CHECKLIST
- [ ] Compile and verify the tracing program.
- [ ] Capture kernel trace output.
```

Zola and the template engine automatically index the new lab in search, syllabus cards, and telemetry tracking.

---

## Documentation
For complete architectural details, simulator DSL syntax, state machine schemas, and deployment instructions, see [GUIDE.md](GUIDE.md).

---

## License
MIT
