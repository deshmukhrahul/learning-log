+++
title = "Reference: Complete Markdown & Component Kitchen Sink"
description = "Visual reference showcase of every supported Markdown syntax, HUD tabs, callouts, tables, code blocks, and diagrams."
date = 2026-09-01
weight = 1

[extra]
month = "AUGUST"
year = "2026"
day = "99"
hours_spent = 2.0
+++

> **About This Reference**: This document demonstrates all supported formatting, components, callouts, interactive tabs, tables, and visualizers. You can copy any snippet into your own labs.

---

## 1. TYPOGRAPHY & TEXT FORMATTING

You can format text using standard Markdown syntax:

* **Bold Text**: `**System Initialization**` → **System Initialization**
* *Italic Text*: `*Kernel Socket Ring*` → *Kernel Socket Ring*
* ~~Strikethrough~~: `~~Deprecated Syscall~~` → ~~Deprecated Syscall~~
* Inline Code: `` `sudo sysctl -w net.ipv4.ip_forward=1` ``
* Keyboard Shortcuts: `<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>` or `<kbd>Esc</kbd>`
* External Links: [Linux Kernel Documentation](https://www.kernel.org/doc/html/latest/)

### Heading Hierarchy:
### H3 Sub-Heading Example
#### H4 Micro-Section Example

---

## 2. CALLOUTS & ALERT BOXES

GitHub-style callout alerts are automatically rendered with HUD accent badges and glowing borders:

> [!NOTE]
> This is a **NOTE** callout. Use it for background context, architectural explanations, or helpful reference links.

> [!TIP]
> This is a **TIP** callout. Use it for performance optimizations, CLI shortcuts, and best practices.

> [!IMPORTANT]
> This is an **IMPORTANT** callout. Use it for mandatory prerequisites, required kernel modules, and key steps.

> [!WARNING]
> This is a **WARNING** callout. Use it for potential gotchas, MTU packet fragmentation traps, and breaking configuration changes.

> [!CAUTION]
> This is a **CAUTION** callout. Use it for high-risk commands that could cause downtime, data loss, or firewall lockouts.

---

## 3. MULTI-OS / SCENARIO INTERACTIVE TABS

Use `<div class="hud-tabs">` to create interactive tabs for different Operating Systems or Deployment Scenarios:

<div class="hud-tabs">

<div class="hud-tab" data-tab="Ubuntu / Debian">

```bash
# Ubuntu / Debian Setup
sudo apt update && sudo apt install -y wireguard ufw
sudo systemctl enable --now wg-quick@wg0
```

</div>

<div class="hud-tab" data-tab="FreeBSD">

```bash
# FreeBSD Setup
sudo pkg install wireguard-tools
sysrc wireguard_enable="YES"
sysrc wireguard_interfaces="wg0"
sudo service wireguard start
```

</div>

<div class="hud-tab" data-tab="RHEL / Rocky">

```bash
# RHEL / Rocky Linux Setup
sudo dnf install -y epel-release wireguard-tools
sudo firewall-cmd --add-port=51820/udp --permanent
sudo firewall-cmd --reload
```

</div>

<div class="hud-tab" data-tab="Alpine Linux">

```bash
# Alpine Linux (OpenRC)
apk add wireguard-tools
rc-update add wireguard
rc-service wireguard start
```

</div>

</div>

---

## 4. MULTI-LANGUAGE SYNTAX HIGHLIGHTING & 1-CLICK COPY

Every code block automatically gets syntax highlighting and a 1-click **`[ COPY ]`** toolbar:

### Go (Systems Programming):
```go
package main

import (
	"fmt"
	"net"
)

func main() {
	ln, err := net.Listen("tcp", ":8080")
	if err != nil {
		panic(err)
	}
	fmt.Printf("==> Server listening on %s\n", ln.Addr().String())
}
```

### Rust (Kernel / Low-Level):
```rust
use std::net::TcpListener;

fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8080")?;
    println!("==> Rust listener active on port 8080");
    Ok(())
}
```

### INI / Configuration File (`/etc/wireguard/wg0.conf`):
```ini
[Interface]
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = <SERVER_PRIVATE_KEY>

[Peer]
PublicKey = <PEER_PUBLIC_KEY>
AllowedIPs = 10.10.0.2/32
PersistentKeepalive = 25
```

### YAML (Kubernetes Manifest):
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: systems-probe
  labels:
    tier: infrastructure
spec:
  containers:
  - name: probe
    image: alpine:latest
    command: ["sleep", "3600"]
```

---

## 5. DATA & MATRIX TABLES

| Hostname | Role | IP Address | Subnet Mask | OS / Kernel | Status |
|---|---|---|---|---|---|
| `gw-ingress-01` | Edge Gateway | `192.168.1.1` | `255.255.255.0` | Linux 6.8 (Ubuntu) | `ONLINE` |
| `srv-storage-02` | ZFS Storage Pool | `192.168.1.10` | `255.255.255.0` | FreeBSD 14.1 | `ONLINE` |
| `k8s-ctrl-03` | Control Plane | `192.168.1.20` | `255.255.255.0` | Alpine Linux 3.20 | `QUEUED` |

---

## 6. VISUAL ARCHITECTURE DIAGRAMS (EXCALIDRAW & VECTOR SVG)

### Excalidraw Vector SVG Architecture:
![WireGuard Production Mesh Architecture](/images/wireguard-architecture.svg)

### Native ASCII Art (Terminal Fallback):
```
┌────────────────────────┐                   ┌────────────────────────┐
│  Client / Remote Node  │ ─── [UDP 51820] ──► │  Gateway / Hub Server  │
│  (10.10.0.2/32)        │  (Encrypted Wire)  │  (10.10.0.1/24)        │
└───────────┬────────────┘                   └───────────┬────────────┘
            │                                            │
            ▼                                            ▼
┌────────────────────────┐                   ┌────────────────────────┐
│  Encrypted Tunnel wg0  │                   │ Protected Subnet / LAN │
└────────────────────────┘                   └────────────────────────┘
```

---

## 7. INTERACTIVE SYSTEMS HUD SIMULATOR

Live interactive hardware/packet flows can be embedded with `<div class="hud-simulator">`:

<div class="hud-simulator" data-title="Kernel Packet Ingress & Routing Pipeline">

[step 1: Network Ingress & Interrupt]
- node: NIC Hardware Ring | BUFFER: 10Gbps RX | FIFO: Filled | state: active
- conduit: DMA Transfer ──► Kernel Ring Buffer
- target: Kernel Core (sk_buff) | STATE: Ingress Parse | PROTO: UDP 51820 | state: normal
- desc: Packet arrives on wire, triggering hardware interrupt and zero-copy DMA transfer.
- cmd: ip -s link show eth0

[step 2: Cryptographic Decapsulation & Handshake]
- node: WireGuard Module (if_wg) | CIPHER: ChaCha20-Poly1305 | KEY: Verified | state: active
- conduit: Authenticated Decrypted Stream ──► Virtual Interface
- target: wg0 Interface (10.10.0.1) | STATE: Route Dispatched | state: online
- desc: Kernel decapsulates tunnel headers and verifies peer authentication keys.
- cmd: wg show wg0 latest-handshakes

[step 3: Application Delivery]
- node: wg0 Interface | MTU: 1420 | STATUS: Forwarding | state: active
- conduit: IP Forwarding ──► Local Socket
- target: Target Server Daemon (PID 4096) | SOCKET: Established | state: normal
- desc: Kernel routing table forwards decrypted packet to target service without packet drops.
- cmd: ss -tulpn | grep 8080

</div>

---

## 8. DELIVERABLES & VERIFICATION CHECKLIST

Interactive checkboxes that save to your browser's `localStorage` and track completed labs in your History ledger:

- [ ] Review all Markdown typography and callout alerts.
- [ ] Test multi-OS interactive tabs by clicking Ubuntu, FreeBSD, RHEL, and Alpine.
- [ ] Verify 1-click code copying on Go, Rust, and YAML snippets.
- [ ] Run through all 3 steps of the interactive packet pipeline simulator.
