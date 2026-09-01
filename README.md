# Personal Learning — Systems Engineering Curriculum & Daily Workbench

A high-performance systems engineering curriculum and daily lab workbench built with Zola (Rust SSG), semantic HTML5, CSS3 design tokens, and vanilla JavaScript.

Designed and architected collaboratively with AI (Antigravity by Google DeepMind).

---

## Key Features

* **Sub-70ms Compilation:** Powered by Zola (Rust static site generator) with 0KB framework bloat.
* **4-Box Telemetry Workbench:** Live Home Cockpit and Monthly Syllabus tracking banked study hours, sprint momentum, and active lab objectives.
* **Progressive Web App (PWA) & Offline Reading:** Installable standalone app with Service Worker pre-caching for air-gapped or offline learning.
* **Global Keyboard Navigation & Help HUD:** Full terminal-style hotkey navigation (H, R, S, L, ?, /).
* **Spotlight Instant Search:** Zero-dependency fuzzy search across all curriculum topics and labs (/ or Ctrl + K).
* **Interactive Systems Simulators:** Markdown DSL blocks rendered as interactive hardware state machines (network sockets, eBPF pipelines, Raft consensus).
* **Persistent Interactive Checklists:** Daily deliverables save checkmark states to localStorage.
* **Study Log Backup & Sync:** 1-Click JSON export and import on the Verified History Ledger.
* **Zero Dependencies:** No Node.js, no npm build steps, pure native web standards.

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
git clone https://github.com/deshmukhrahul/learning-log.git
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

## Adding New Curriculum Content & Labs

To create a new runbook or lab without starting from scratch, use the ready-made starter template in `_templates/`:

### 1. Create a New Setup Runbook:
```bash
# Duplicate the sysadmin runbook template into your target year and month:
mkdir -p content/2026/september
cp _templates/sysadmin-setup-template.md content/2026/september/day-01-wireguard-mesh.md
```

### 2. Component & Formatting Reference:
* Refer to `_templates/markdown-kitchen-sink.md` for live examples of multi-OS tabs, callout boxes, matrix tables, and vector architecture diagrams.

### 3. Edit & Build:
Open your new Markdown files, add your notes/code, and run `zola build` or `zola serve`. Zola automatically indexes the new lab in search, syllabus cards, telemetry trackers, and the multi-year roadmap!

---

## Advancing Monthly Sprints

To advance your active learning focus to a new month or year, update `active_section_path` in `config.toml`:

```toml
[extra]
active_section_path = "2026/september/_index.md"
```

The Home Cockpit, active syllabus, and roadmap automatically shift to the new sprint across the entire site.

---

## Documentation
For complete architectural details, simulator DSL syntax, state machine schemas, and deployment instructions, see [GUIDE.md](GUIDE.md).

---

## License
MIT
