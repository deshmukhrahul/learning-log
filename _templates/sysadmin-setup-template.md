+++
title = "Production Setup: [Service or Cluster Name]"
description = "Comprehensive production deployment, network topology, security hardening, and diagnostic runbook."
date = 2026-09-01
weight = 1

[extra]
month = "SEPTEMBER"
year = "2026"
day = "01"
hours_spent = 3.0
+++

> **How to Use This Template**: This is a production-grade infrastructure template. Keep the sections relevant to your deployment and delete any unnecessary blocks.

---

## 1. OBJECTIVE & TARGET ARCHITECTURE

### The Mission:
* **What are we deploying?**: [e.g. WireGuard Site-to-Site Mesh VPN with FreeBSD Gateway and Linux clients]
* **End Result**: [e.g. Encrypted, authenticated L3 tunnel routing traffic across 10.10.0.0/24 subnet with automated failover, DNS leak protection, and sub-10ms latency]
* **Success Criteria**:
  * [x] Service starts automatically on boot (`systemd` / `rc.d`).
  * [x] Firewall strictly drops unauthenticated packets.
  * [x] Sustained throughput benchmark verified via `iperf3`.

### Network & Data Flow:
![Architecture Diagram](/images/wireguard-architecture.svg)

> [!TIP]
> You can sketch your own custom network topologies on [Excalidraw.com](https://excalidraw.com/), export as Dark Mode SVG, and drop them directly into `/static/images/`!

---

## 2. INFRASTRUCTURE MATRIX & PREREQUISITES

### Host Inventory & IP Assignments:
| Hostname | Role | Public / WAN IP | Tunnel / LAN IP | OS & Kernel | Resources |
|---|---|---|---|---|---|
| `gw-primary-01` | Hub Gateway | `203.0.113.10` | `10.10.0.1/24` | Ubuntu 24.04 (Linux 6.8) | 2 vCPU / 4GB |
| `bsd-peer-02` | Storage Peer | Dynamic / NAT | `10.10.0.2/32` | FreeBSD 14.1-RELEASE | 4 vCPU / 16GB |

### Baseline Prerequisites:
* **Privileges**: Root access (`sudo -i`).
* **Kernel Modules Required**: `wireguard.ko`, `iptable_filter`, `ip_forward=1`.
* **Firewall Ingress**: Inbound UDP port `51820` allowed on Gateway.
* **DNS Requirements**: Upstream internal DNS resolver listening on `10.10.0.1`.

---

## 3. STEP-BY-STEP IMPLEMENTATION LOG

### Step 1: Package Installation & Kernel Prep
```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y wireguard resolvconf ufw

# FreeBSD
sudo pkg install wireguard-tools

# Enable Kernel IP Packet Forwarding immediately & persistently:
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.d/99-sysctl.conf
```

### Step 2: Cryptographic Key Generation
```bash
# Set secure directory umask so private keys are never world-readable
umask 077
mkdir -p /etc/wireguard
cd /etc/wireguard

# Generate Server Private & Public Keypair
wg genkey | tee server_private.key | wg pubkey > server_public.key

# Verify file permissions (MUST be 600)
chmod 600 /etc/wireguard/*_private.key
ls -la /etc/wireguard/
```

### Step 3: Production Configuration Files

#### Primary Server Config: `/etc/wireguard/wg0.conf`
```ini
[Interface]
# Server tunnel interface address
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = <SERVER_PRIVATE_KEY_CONTENTS>
SaveConfig = false

# Firewall routing rules upon interface startup/shutdown
PostUp = ufw route allow in on wg0 out on eth0
PostUp = iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
PostDown = ufw route delete allow in on wg0 out on eth0
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# ── PEER 1: FreeBSD Storage Node ──
[Peer]
PublicKey = <CLIENT_PUBLIC_KEY_CONTENTS>
AllowedIPs = 10.10.0.2/32
# Keep NAT table active through stateful routers (every 25s)
PersistentKeepalive = 25
```

---

## 4. SECURITY HARDENING & THREAT MITIGATION

### 1. Firewall Isolation (Stateful Filtering)
```bash
# 1. Allow WireGuard UDP handshake port
sudo ufw allow 51820/udp comment "WireGuard VPN Ingress"

# 2. Block all direct public management access except through VPN subnet
sudo ufw allow in on wg0 to any port 22 proto tcp comment "SSH over VPN Only"

# 3. Enable UFW and reload
sudo ufw enable && sudo ufw status verbose
```

### 2. Attack Surface & Key Management:
* **Key Permissions**: Private keys are restricted to `root:root` with mode `0600`.
* **Killswitch Mechanism**: If the VPN interface terminates, outbound traffic to internal subnets is dropped by the kernel routing table rather than leaking over cleartext WAN interfaces.
* **Pre-shared Keys (Optional Quantum Resistance)**: Add `PresharedKey = ...` for post-quantum symmetric protection against harvest-now-decrypt-later attacks.

---

## 5. VERIFICATION & DIAGNOSTIC RUNBOOK

### Level 1: Daemon & Interface Verification
```bash
# Start and enable the interface daemon
sudo systemctl enable --now wg-quick@wg0

# Check daemon health status
sudo systemctl status wg-quick@wg0 --no-pager

# Verify kernel listening socket on UDP 51820
sudo ss -tulpn | grep 51820
```

### Level 2: Handshake & Transfer Diagnostics
```bash
# Inspect live transfer statistics, endpoints, and latest handshakes
sudo wg show

# Verify peer latency across the encrypted tunnel
ping -c 5 -i 0.2 10.10.0.2
```

### Level 3: Throughput & MTU Performance Benchmark
```bash
# Run iperf3 server on Gateway:
iperf3 -s -B 10.10.0.1

# Run iperf3 client on remote peer:
iperf3 -c 10.10.0.1 -t 10 -P 4
```

---

## 6. PRODUCTION GOTCHAS & TROUBLESHOOTING

| Symptom / Failure Mode | Root Cause | Immediate Diagnostic & Fix |
|---|---|---|
| **No Handshake (`latest handshake: none`)** | UDP port 51820 dropped by ISP, cloud security group, or router NAT. | Check upstream firewall: `sudo tcpdump -nn -i eth0 port 51820`. Ensure public IP matches endpoint. |
| **SSH or Web pages hang on transfer** | MTU mismatch / packet fragmentation over VPN headers. | Add `MTU = 1420` to `[Interface]` section on client config to avoid fragmentation. |
| **Traffic stops after 60 seconds of idle** | NAT mapping expired in intermediate firewall. | Add `PersistentKeepalive = 25` to client `[Peer]` block. |
| **DNS Leaks outside tunnel** | System resolver using local DHCP nameservers. | Ensure `DNS = 10.10.0.1` is defined in client configuration. |

---

## 7. MAINTENANCE & OPERATIONS COMMANDS

```bash
# View live tunnel traffic logs in real time
sudo journalctl -u wg-quick@wg0 -f

# Reload peer configurations without dropping active tunnels
sudo wg addconf wg0 <(wg-quick strip wg0)

# Back up configurations to secure offline archive
sudo tar -czvf wireguard-backup-$(date +%F).tar.gz /etc/wireguard/
```

---

## 8. DELIVERABLES & SIGN-OFF CHECKLIST

- [ ] Topology mapped and static IP matrix documented.
- [ ] Kernel packet forwarding and firewall rules configured.
- [ ] Private keys generated with strict `0600` permissions.
- [ ] Interface running, authenticated handshake verified with `wg show`.
- [ ] Latency verified under 15ms and throughput tested via `iperf3`.
- [ ] System reboot test completed (`sudo reboot` $\rightarrow$ auto-start verified).
