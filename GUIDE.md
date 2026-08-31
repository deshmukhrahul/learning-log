# Personal Learning — Complete Architecture & Operations Guide

A high-performance, zero-dependency systems engineering curriculum and daily lab workbench built with **Zola (Rust SSG)**, semantic HTML5, CSS3 design tokens, and vanilla ES6 JavaScript.

---

## 1. System Architecture Overview

```
                          ┌────────────────────────┐
                          │   config.toml & Data   │
                          └───────────┬────────────┘
                                      │
                                      ▼
┌──────────────────┐      ┌────────────────────────┐      ┌──────────────────┐
│ Markdown Content │ ──►  │    Zola SSG (Rust)     │  ──► │ Static Build     │
│ (content/**/*.md)│      │ (Sub-70ms Compilation) │      │ (HTML/CSS/JS)    │
└──────────────────┘      └────────────────────────┘      └──────────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │  Client Telemetry & PWA│
                          │  (Service Worker + LS) │
                          └────────────────────────┘
```

### Core Technologies:
* **Static Site Generator:** [Zola](https://www.getzola.org/) (Written in Rust, compiles in <70ms).
* **Styling:** Pure CSS3 with custom properties (`style.css`), WCAG AAA high-contrast monochromatic palette, responsive grid/flexbox. Zero npm/CSS framework overhead.
* **Client Runtime:** Vanilla ES6 JavaScript (`app.js`), local telemetry state synchronization, dynamic HUD simulator parsing, instant spotlight search, and Service Worker registration. Zero runtime dependencies.
* **Progressive Web App (PWA):** Web app manifest (`manifest.json`), custom SVG vectors (`icon-192.svg`, `icon-512.svg`), and offline Service Worker (`sw.js`).
* **Typography:** `Chakra Petch` (Headlines), `Space Grotesk` (Body / Editorial), `JetBrains Mono` (Code & Terminal telemetry).

---

## 2. Directory Structure

```
.
├── config.toml                 # Global SSG parameters, track focus, active sprint
├── content/                    # Markdown content hierarchy
│   ├── _index.md               # Root section (mounts Home Cockpit index.html)
│   ├── roadmap/                # Master 24-Month Roadmap section & pages
│   ├── history/                # Verified Lab History section & pages
│   ├── stack/                  # Architecture & Technology stack pages
│   ├── 2026/                   # Year 1 Curriculum
│   │   ├── _index.md           # Year 1 section metadata
│   │   ├── august/             # Month sprint directory
│   │   │   ├── _index.md       # Monthly syllabus metadata (Sprint Topic, Goal)
│   │   │   ├── day-29-*.md     # Daily lab session 01
│   │   │   ├── day-30-*.md     # Daily lab session 02
│   │   │   └── day-31-*.md     # Daily lab session 03
│   │   ├── september/          # Future monthly sprints...
│   │   └── ...
│   ├── 2027/                   # Year 2 Curriculum (Distributed Systems, Raft)
│   └── 2028/                   # Year 3 Curriculum (Microkernels, Custom Hypervisors)
├── static/                     # Assets served as-is
│   ├── manifest.json           # PWA Web App Manifest
│   ├── sw.js                   # Offline caching Service Worker
│   ├── icons/                  # PWA Scalable App Icons
│   │   ├── icon-192.svg        # 192x192 maskable app icon
│   │   └── icon-512.svg        # 512x512 maskable app icon
│   ├── css/
│   │   └── style.css           # Complete design system & component styles
│   └── js/
│       └── app.js              # State machine, HUD parser & search engine
├── templates/                  # Tera HTML templates
│   ├── base.html               # Global shell, navigation, search & shortcuts modals
│   ├── index.html              # Home 4-Box telemetry workbench
│   ├── section.html            # Monthly syllabus page & lab list
│   ├── page.html               # Daily lab prose view & completion gate
│   ├── roadmap.html            # 24-month roadmap with modal view
│   └── history.html            # Chronological lab ledger & JSON export/import
├── .gitignore                  # Ignores public/ build output and scratch files
├── README.md                   # Quickstart summary
└── GUIDE.md                    # System architecture & user manual
```

---

## 3. How the Frontend State Machine Works

All user progress is synchronized in real-time using `localStorage` under the key `learning_log_telemetry_state`.

### Telemetry State Schema:
```json
{
  "totalHours": 2.5,
  "completedLabs": [
    "/2026/august/day-29-sockets-and-http/"
  ],
  "sessions": [
    {
      "day": "01",
      "title": "Lab 01: Go Setup, Linux File Descriptors & Network Sockets",
      "hours": 2.5,
      "url": "/2026/august/day-29-sockets-and-http/",
      "dateCompleted": "2026-08-31T10:00:00.000Z"
    }
  ]
}
```

### State Synchronization Lifecycle:
1. **Daily Lab Completion Gate (`page.html`):**
   * When the user clicks **`MARK LAB COMPLETE`** on any lab page, `app.js` captures the lab metadata (`day`, `title`, `hours`, `url`) and saves it to `localStorage`.
   * The button transitions to **`LAB COMPLETED [✓]`** in green.
2. **Home Cockpit (`index.html`):**
   * Computes **Total Hours Banked**, **Total Labs Completed**, and **Month Progress Percentage**.
   * The central CTA button dynamically advances to point to the next uncompleted lab session.
3. **Monthly Syllabus (`section.html`):**
   * **Box 1 (Month Metadata):** Updates `MONTH PROGRESS` bar (e.g. `33.3%`, `66.7%`, `100%`).
   * **Box 2 (Daily Labs List):** Verified rows receive green `DONE` badges; next upcoming lab receives `START` status; bottom button updates to next lab.
   * **Box 3 (Next Lab Preview):** Dynamically displays upcoming lab title, duration, and objective.
   * **Box 4 (History & Project Status):** Updates total banked hours, decrements `LABS REMAINING`, and flips `PROJECT GOAL` from `NOT STARTED` → `IN PROGRESS` → `READY TO BUILD`.
4. **History Ledger (`history.html`):**
   * Renders a verified chronological ledger of completed sessions with banked time metrics.
   * Provides **`EXPORT JSON`** (timestamped backup) and **`IMPORT JSON`** (cross-device sync).
5. **Resilient Matcher (`isLabDone`):**
   * Progress matching uses a multi-strategy matcher that verifies relative path, Day index, and Title, ensuring progress remains 100% in sync regardless of local network IP or domain name.

---

## 4. Progressive Web App (PWA) & Offline Mode

The application includes an offline-first Service Worker:
* **Pre-Caching (`install`):** Pre-caches core styling, scripts, manifests, and icons on initial load.
* **Network-First with Cache Fallback (`fetch`):** All HTML navigation requests attempt network first. If offline, the Service Worker serves the cached lab and syllabus pages.
* **Stand-Alone Display:** Can be added to Home Screen or installed on desktop with native window chrome and custom app icon.

---

## 5. Keyboard Navigation System

Global keyboard event dispatcher in `app.js`:

| Key | Target | Behavior |
|---|---|---|
| <kbd>/</kbd> or <kbd>Ctrl+K</kbd> | Spotlight Search | Opens full fuzzy curriculum search |
| <kbd>H</kbd> | Home | Navigates to `/` (Home Telemetry Cockpit) |
| <kbd>R</kbd> | Roadmap | Navigates to `/roadmap/` |
| <kbd>S</kbd> | Syllabus | Navigates to active sprint syllabus |
| <kbd>L</kbd> | Ledger | Navigates to `/history/` |
| <kbd>?</kbd> | Help HUD | Opens keyboard shortcuts overlay |
| <kbd>ESC</kbd> | Modal Dismissal | Closes search, shortcuts, or roadmap modals |

---

## 6. Interactive HUD System Simulator DSL

The site features an inline system simulator that converts structured Markdown DSL blocks into interactive hardware animations.

### Authoring a Simulator Block in Markdown:
```markdown
<div class="hud-simulator" data-title="Linux TCP Socket Allocation & Handshake">

[step 1: Process Calls net.DialTCP]
- node: Go Process (PID 4102) | SOCKET: Allocating | MEMORY: User Space | state: active
- conduit: Syscall socket(AF_INET, SOCK_STREAM) ──► Kernel
- target: Linux Kernel FD Table | NEXT AVAILABLE FD: 3 | state: normal
- desc: The Go application invokes the socket syscall. Kernel assigns integer FD 3.
- cmd: ls -l /proc/$$/fd/

[step 2: TCP 3-Way Handshake SYN Packet]
- node: Go Client Socket (FD 3) | TCP STATE: SYN_SENT | PORT: Ephemeral 52140 | state: active
- node: Remote Server | TCP STATE: LISTEN | PORT: 8080 | state: online
- conduit: TCP SYN Flag ──► Network Wire
- target: Remote Stack | QUEUE: SYN Backlog | state: normal
- desc: Client dispatches TCP SYN packet across network interface.
- cmd: sudo tcpdump -nn -i any port 8080 -c 1

</div>
```

---

## 7. How to Author a New Daily Lab

1. **Create a Markdown File:**
   Create a `.md` file inside the target month directory (e.g. `content/2026/september/ebpf-tracing.md` or `content/2028/january/day-01-rust-kernel-drivers.md`).

2. **Add Frontmatter Metadata:**
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
   ```

3. **Standard 4-Part Lab Structure:**
   * **Section 1: The Brief** — Architecture fundamentals and memory pipeline.
   * **Interactive Visualizer** — Optional `<div class="hud-simulator">` interactive hardware block.
   * **Section 2: Hands-on Experiment** — Complete, runnable Go / C / Rust implementation with 1-click copy toolbar.
   * **Section 3: Anomalies & Gotchas** — Production edge cases, socket leaks, kernel parameters.
   * **Section 4: Daily Deliverables Checklist** — Task checklist (`- [ ] ...`) with automatic `localStorage` persistence.

---

## 8. Local Development & Deployment

### Option 1: Standalone Binary (Recommended — Zero Toolchain Overhead)
1. Download the latest pre-compiled archive for your OS from **[Zola Latest Releases](https://github.com/getzola/zola/releases/latest)**.
2. **Verify SHA256 Checksum** against the official hash in the release notes:
   ```bash
   # Linux (x86_64)
   sha256sum zola-v*-x86_64-unknown-linux-gnu.tar.gz

   # macOS (Apple Silicon / Intel)
   shasum -a 256 zola-v*-*-apple-darwin.tar.gz
   ```
3. Extract and install binary to your PATH:
   ```bash
   tar -xzf zola-v*.tar.gz
   sudo mv zola /usr/local/bin/
   ```
4. Start local live-reload development server:
   ```bash
   zola serve
   ```

### Option 2: Run with Podman / Docker
```bash
# Build static site to public/
podman run --rm -v "$(pwd):/app:Z" -w /app ghcr.io/getzola/zola:v0.23.4 build

# Serve locally
python3 -m http.server 1111 --directory public
```

### Deploying to GitHub Pages:
Add `.github/workflows/deploy.yml`:
```yaml
name: Deploy Zola Site to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Build Zola Site
        uses: shalzz/zola-deploy-action@v0.19.2
        env:
          PAGES_BRANCH: gh-pages
          BUILD_DIR: .
          TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 9. Theme Customization & Design Tokens

All colors, typography, and layout spacing are controlled via CSS custom properties in `static/css/style.css`:

```css
:root {
  --bg:           #06090e;      /* Deep core background */
  --surface:      #090e17;      /* Panel surface */
  --surface-hover:#0d1422;      /* Elevated hover surface */
  --border:       rgba(255, 255, 255, 0.08); /* Minimal border */

  --text-pure:    #ffffff;      /* High contrast pure white */
  --text-main:    #d1dced;      /* Readable body text */
  --text-muted:   #94a3b8;      /* Dimmed labels and metadata */

  --font-head:    'Chakra Petch', system-ui, sans-serif;
  --font-body:    'Space Grotesk', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --max-w:        1600px;
}
```
