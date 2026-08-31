+++
title = "Master Roadmap — 12-Month Mindmap & Slide Deck"
description = "Interactive mindmap and slide-deck view. High-density, zero-fluff breakdown of every weekly sprint, systems reality, and sellable product asset."
date = 2026-08-29
weight = 1

[extra]
label = "Master Roadmap"
+++

<div class="radar-pipeline">
<div class="radar-step active" onclick="document.querySelectorAll('.mindmap-thumb')[0].click();">
<div class="radar-step-badge"><span class="radar-pulse"></span><span>Q1 · ACTIVE MISSION</span></div>
<div class="radar-step-title">Systems & Storage</div>
<div class="radar-step-unlock">🔓 Product 2: ZFS DR Sentry</div>
<div class="radar-step-desc">M01–M03: Systems Go, eBPF Kernel Tracing & Vanilla OpenZFS.</div>
</div>
<div class="radar-step" onclick="document.querySelectorAll('.mindmap-thumb')[3].click();">
<div class="radar-step-badge">Q2 · PLATFORM</div>
<div class="radar-step-title">Sovereign K8s & Bus</div>
<div class="radar-step-unlock">🔓 Multi-Tenant Host</div>
<div class="radar-step-desc">M04–M06: 3-Node K8s, NATS JetStream & OpenTofu IaC.</div>
</div>
<div class="radar-step" onclick="document.querySelectorAll('.mindmap-thumb')[6].click();">
<div class="radar-step-badge">Q3 · PRODUCTS</div>
<div class="radar-step-title">AI & OTel Flagship</div>
<div class="radar-step-unlock">🔓 Product 1: Oracle Hub</div>
<div class="radar-step-desc">M07–M09: vLLM AI RAG, LGTM FinOps & Oracle OTel Receiver.</div>
</div>
<div class="radar-step" onclick="document.querySelectorAll('.mindmap-thumb')[9].click();">
<div class="radar-step-badge">Q4 · INDEPENDENCE</div>
<div class="radar-step-title">Launch & Cashflow</div>
<div class="radar-step-unlock">🎯 Financial Freedom</div>
<div class="radar-step-desc">M10–M12: 3 Paying Clients, Monthly Retainers, Exit Day Job.</div>
</div>
</div>

---

<div class="deck-viewport">

<div class="deck-controls">
<div class="deck-nav-group">
<button class="deck-btn" id="slide-prev-btn">◀ Prev Month</button>
<span class="deck-slide-indicator" id="slide-indicator">Month 01 of 10</span>
<button class="deck-btn" id="slide-next-btn">Next Month ▶</button>
</div>
<div class="deck-hint">Use <strong>◀ Left / Right ▶</strong> arrows on keyboard to navigate</div>
</div>

<!-- SLIDE 1: MONTH 01 -->
<div class="deck-slide" data-slide-id="m01">
<div class="slide-header">
<div class="slide-quarter-badge">Q1 · Systems Foundations & Core Scrapers</div>
<h2 class="slide-title">Month 01: Systems Go & OTel Collector Internals</h2>
<div class="slide-subtitle">Mastering Linux file descriptors, TCP sockets, streaming buffers, and building the custom Oracle OTel Receiver.</div>
</div>

<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1 (Days 01–07)</div>
<div class="week-node-title">Sockets, Streams & CLI</div>
<div class="week-node-body">Linux socket FDs in <code>/proc/</code>, <code>io.Reader</code> streaming, POSIX flags, Goroutines/Channels, signal traps, and building the <code>prom-inspect</code> static ELF binary.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2 (Days 08–14)</div>
<div class="week-node-title">Database Sockets & V$ Views</div>
<div class="week-node-body"><code>database/sql</code> connection pooling, Oracle latches, querying <code>V$SESSION</code> and <code>V$SYSSTAT</code>, and socket reuse without handshake latency.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3 (Days 15–21)</div>
<div class="week-node-title">OTel Collector Pipeline</div>
<div class="week-node-body">OpenTelemetry Collector internals, implementing <code>receiver.Factory</code>, and transforming rows into <code>pmetric.Metrics</code> objects.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4 (Days 22–28)</div>
<div class="week-node-title">Multi-Backend Exporters</div>
<div class="week-node-body">Routing Oracle metrics simultaneously to Azure Monitor Workspace (remote_write) and local Prometheus without code redeployment.</div>
</div>
</div>

<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">🎯 Month 1 Milestone Gateway</div>
<div class="slide-capstone-desc">A standalone Go OTel Receiver connected to Oracle XE routing telemetry to Azure Monitor and Grafana.</div>
</div>
<a href="/2026/august/day-29-sockets-and-http/" class="deck-btn deck-btn-primary">Launch Day 01 Lab →</a>
</div>
</div>

<!-- SLIDE 2: MONTH 02 -->
<div class="deck-slide" style="display: none;" data-slide-id="m02">
<div class="slide-header">
<div class="slide-quarter-badge">Q1 · Kernel Telemetry & Enforcement</div>
<h2 class="slide-title">Month 02: eBPF Kernel Telemetry & Security</h2>
<div class="slide-subtitle">Loading in-kernel BPF programs, Cilium CNI routing, Pixie zero-instrumentation database tracing, and Tetragon security.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">eBPF Verifier & bpftool</div>
<div class="week-node-body">Kernel safety verifier, <code>bpf()</code> syscall, helper functions, and tracing <code>execve()</code> syscalls.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">Cilium CNI & Hubble</div>
<div class="week-node-body">Bypassing iptables overhead using eBPF socket layer enforcement and live network flow tracing.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">Pixie Zero-Agent Tracing</div>
<div class="week-node-body">Extracting live Oracle SQL query latency automatically using eBPF kprobes with zero application changes.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">Tetragon Security Policies</div>
<div class="week-node-body">Enforcing real-time kernel security policies and blocking unauthorized namespace privilege transitions.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">🎯 Month 2 Milestone Gateway</div>
<div class="slide-capstone-desc">Zero-instrumentation database performance monitor and kernel security enforcement sentry.</div>
</div>
<a href="/2026/september/" class="deck-btn">View Month 2 Track →</a>
</div>
</div>

<!-- SLIDE 3: MONTH 03 -->
<div class="deck-slide" style="display: none;" data-slide-id="m03">
<div class="slide-header">
<div class="slide-quarter-badge">Q1 · Storage Engineering & DR</div>
<h2 class="slide-title">Month 03: Vanilla OpenZFS & Immutable Storage</h2>
<div class="slide-subtitle">Mastering ZFS pool topology, ARC memory caching, WireGuard replication, and automated backup verification.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">Pool Topology & ashift</div>
<div class="week-node-body">Striped mirrors, RAIDZ2 write amplification, ashift sizing, and Merkle tree Fletcher4 checksums.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">ARC Tuning & SLOG</div>
<div class="week-node-body">Adaptive Replacement Cache (MRU/MFU) and optimizing recordsize (<code>8k</code>) for Oracle database IOPs.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">Encrypted zfs send/recv</div>
<div class="week-node-body">Raw encrypted snapshot stream replication over WireGuard to offsite replica servers.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">Automated Verification</div>
<div class="week-node-body">Building a Go daemon that clones snapshots, runs DB integrity checks, and emits Prometheus metrics.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">Production Artifact 2: ZFS Backup Verification Sentry</div>
<div class="slide-capstone-desc">Cryptographic daily proof that database backups are 100% recoverable after ransomware attacks.</div>
</div>
<a href="/2026/october/" class="deck-btn">View Month 3 Track →</a>
</div>
</div>

<!-- SLIDE 4: MONTH 04 -->
<div class="deck-slide" style="display: none;" data-slide-id="m04">
<div class="slide-header">
<div class="slide-quarter-badge">Q2 · Sovereign Cloud Platform</div>
<h2 class="slide-title">Month 04: 3-Node Upstream Kubernetes Platform</h2>
<div class="slide-subtitle">Deploying real upstream Kubernetes across 3 VMs with Cilium eBPF networking and persistent ZFS CSI storage.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">3-Node Cluster Bootstrap</div>
<div class="week-node-body">Bootstrapping 1 Control Plane + 2 Workers across our 3 VMs with etcd quorum.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">Cilium CNI & Host Routing</div>
<div class="week-node-body">eBPF native pod routing, BGP peering, and node-to-node WireGuard encryption.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">ZFS CSI Storage Provisioner</div>
<div class="week-node-body">Dynamic persistent volume provisioning delivering bare-metal NVMe IOPs to container pods.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">Stateful DB Workloads</div>
<div class="week-node-body">Running high-availability PostgreSQL and Oracle databases with automated failover testing.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">🎯 Month 4 Milestone Gateway</div>
<div class="slide-capstone-desc">Sovereign multi-tenant Kubernetes platform ready for hosting and scaling your SaaS products.</div>
</div>
<a href="/2026/november/" class="deck-btn">View Month 4 Track →</a>
</div>
</div>

<!-- SLIDE 5: MONTH 05 -->
<div class="deck-slide" style="display: none;" data-slide-id="m05">
<div class="slide-header">
<div class="slide-quarter-badge">Q2 · Distributed Messaging Bus</div>
<h2 class="slide-title">Month 05: NATS.io JetStream Bus & Telemetry</h2>
<div class="slide-subtitle">High-throughput distributed event streaming in Go connecting edge monitoring agents to central SaaS backends.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">NATS Clustering & Go Pub/Sub</div>
<div class="week-node-body">Clustering NATS servers, subject hierarchies, and building fast publishers/subscribers in Go.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">JetStream Persistence</div>
<div class="week-node-body">Configuring persistent event streams, consumer deduplication, and at-least-once delivery.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">Edge Telemetry Ingestion</div>
<div class="week-node-body">Streaming Prometheus metrics over NATS and forwarding to Prometheus Remote Write.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">Multi-Tenant Event Logging</div>
<div class="week-node-body">Unified audit log aggregation across isolated customer namespaces with sub-ms latency.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">🎯 Month 5 Milestone Gateway</div>
<div class="slide-capstone-desc">High-throughput telemetry message bus handling 100K+ metrics/sec with zero JVM bloat.</div>
</div>
<a href="/2026/december/" class="deck-btn">View Month 5 Track →</a>
</div>
</div>

<!-- SLIDE 6: MONTH 06 -->
<div class="deck-slide" style="display: none;" data-slide-id="m06">
<div class="slide-header">
<div class="slide-quarter-badge">Q2 · Automation & GitOps Delivery</div>
<h2 class="slide-title">Month 06: OpenTofu IaC & Ansible Automation</h2>
<div class="slide-subtitle">Single-command bare-metal cluster provisioning, agentless Ansible OS hardening, and ArgoCD GitOps sync.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">OpenTofu Modules & State</div>
<div class="week-node-body">Declarative infrastructure blueprints and remote state management with S3 locking.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">Agentless Ansible (SSH)</div>
<div class="week-node-body">Idempotent playbooks for Linux & FreeBSD OS hardening and ZFS pool provisioning via pure SSH.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">Automated K8s Bootstrap</div>
<div class="week-node-body">One-command cluster initialization, Cilium deployment, and secret injection.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">ArgoCD GitOps Pipelines</div>
<div class="week-node-body">Continuous delivery pipelines automatically syncing Git changes directly into Kubernetes.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">🎯 Month 6 Milestone Gateway</div>
<div class="slide-capstone-desc">Single-command sovereign cloud provisioner and zero-touch tenant deployment engine.</div>
</div>
<a href="/2027/january/" class="deck-btn">View Month 6 Track →</a>
</div>
</div>

<!-- SLIDE 7: MONTH 07 -->
<div class="deck-slide" style="display: none;" data-slide-id="m07">
<div class="slide-header">
<div class="slide-quarter-badge">Q3 · Local AI Inference & Search</div>
<h2 class="slide-title">Month 07: Local AI Inference: vLLM & Qdrant</h2>
<div class="slide-subtitle">Running open-weight LLMs with PagedAttention on CPU/RAM and building high-speed vector RAG pipelines in Go.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">vLLM Serving on CPU/RAM</div>
<div class="week-node-body">Serving quantized Llama/DeepSeek models locally with PagedAttention memory optimization.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">Qdrant Vector Database</div>
<div class="week-node-body">Deploying Qdrant on K8s with persistent ZFS storage and HNSW graph indexing.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">Systems RAG Engine in Go</div>
<div class="week-node-body">Embedding technical documentation and querying Qdrant for semantic similarity in sub-10ms.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">AI Prometheus Observability</div>
<div class="week-node-body">Monitoring TTFT (Time to First Token), latency percentiles, and KV cache utilization.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">🎯 Month 7 Milestone Gateway</div>
<div class="slide-capstone-desc">Air-gapped AI diagnostic summarizer embedded directly into your SaaS architecture.</div>
</div>
<a href="/2027/february/" class="deck-btn">View Month 7 Track →</a>
</div>
</div>

<!-- SLIDE 8: MONTH 08 -->
<div class="deck-slide" style="display: none;" data-slide-id="m08">
<div class="slide-header">
<div class="slide-quarter-badge">Q3 · Full Observability & FinOps</div>
<h2 class="slide-title">Month 08: Full LGTM Stack & eBPF FinOps Sentry</h2>
<div class="slide-subtitle">Loki log aggregation, Tempo tracing, Pyroscope continuous profiling, and OpenCost dollar attribution.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">Loki Logs & Tempo Traces</div>
<div class="week-node-body">Aggregating structured logs in Loki and ingesting distributed OTel traces in Tempo.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">Pyroscope eBPF Profiling</div>
<div class="week-node-body">Continuous CPU/memory profiling flamegraphs identifying expensive code paths.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">OpenCost Kubernetes FinOps</div>
<div class="week-node-body">Attributing real-time dollar compute and network egress spend per pod and namespace.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">Unified Telemetry Dashboard</div>
<div class="week-node-body">Correlating Prometheus metrics, Loki logs, and Pyroscope flamegraphs in Grafana.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">Production Artifact 3: eBPF Kubernetes FinOps Sentry</div>
<div class="slide-capstone-desc">Zero-overhead Kubernetes dashboard eliminating 40%+ wasted cloud compute fees.</div>
</div>
<a href="/2027/march/" class="deck-btn">View Month 8 Track →</a>
</div>
</div>

<!-- SLIDE 9: MONTH 09 -->
<div class="deck-slide" style="display: none;" data-slide-id="m09">
<div class="slide-header">
<div class="slide-quarter-badge">Q3 · Flagship Open-Source Asset</div>
<h2 class="slide-title">Month 09: The Oracle OTel Receiver Product</h2>
<div class="slide-subtitle">Publishing the flagship open-source Go receiver for Oracle wait-event analytics and top SQL telemetry.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Week 1</div>
<div class="week-node-title">Receiver Architecture in Go</div>
<div class="week-node-body">Implementing OTel Collector <code>receiver.Factory</code> with custom DSN and scrape tickers.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 2</div>
<div class="week-node-title">Deep V$ View Scrapers</div>
<div class="week-node-body">Querying <code>V$SESSION</code>, <code>V$SYSTEM_EVENT</code>, and <code>V$SQLAREA</code> into typed metrics.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 3</div>
<div class="week-node-title">Multi-Backend Fan-Out</div>
<div class="week-node-body">Routing telemetry simultaneously to Azure Monitor Workspace, Grafana Cloud, and Datadog.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Week 4</div>
<div class="week-node-title">Open-Source Release</div>
<div class="week-node-body">Publishing on GitHub with DBA installation guide, minimum grants, and Grafana templates.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title">Production Artifact 1: Oracle Enterprise Observability Hub</div>
<div class="slide-capstone-desc">Turnkey Oracle monitoring SaaS saving enterprise clients $17,500/year per processor.</div>
</div>
<a href="/2027/april/" class="deck-btn">View Month 9 Track →</a>
</div>
</div>

<!-- SLIDE 10: MONTH 10-12 -->
<div class="deck-slide" style="display: none;" data-slide-id="m10">
<div class="slide-header">
<div class="slide-quarter-badge">Q4 · Financial & Career Independence</div>
<h2 class="slide-title">Month 10–12: Product Launch & Cashflow</h2>
<div class="slide-subtitle">Packaging productized audits, acquiring 3 paying enterprise clients, and transitioning from the day job.</div>
</div>
<div class="slide-grid">
<div class="week-node">
<div class="week-node-badge">Month 10</div>
<div class="week-node-title">Productized Audits</div>
<div class="week-node-body">Packaging the 3 products into fixed-scope consulting audits ($5,000–$15,000).</div>
</div>
<div class="week-node">
<div class="week-node-badge">Month 11</div>
<div class="week-node-title">Client Acquisition</div>
<div class="week-node-body">Securing initial 3 paying enterprise clients and monthly recurring maintenance retainers.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Month 12</div>
<div class="week-node-title">Systematized SaaS</div>
<div class="week-node-body">Reaching $15,000+/month recurring revenue and achieving full independence.</div>
</div>
<div class="week-node">
<div class="week-node-badge">Outcome</div>
<div class="week-node-title">Career Sovereignty</div>
<div class="week-node-body">100% control of your time, working on interesting systems, and no reliance on a job.</div>
</div>
</div>
<div class="slide-capstone-banner">
<div>
<div class="slide-capstone-title" style="color: var(--amber);">🎯 The Ultimate Milestone Achieved</div>
<div class="slide-capstone-desc">Complete technical competence, recurring cash flow, and career independence.</div>
</div>
<span class="product-badge" style="background: rgba(245, 158, 11, 0.2); color: var(--amber); border-color: var(--amber);">Independence</span>
</div>
</div>

<!-- MINDMAP ZOOM STRIP -->
<div style="margin-top: 1.5rem;">
<div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-bottom: 0.5rem;">Mindmap Navigation (Click to Focus Node):</div>
<div class="mindmap-strip">
<div class="mindmap-thumb active" data-slide-index="0">
<div class="mindmap-thumb-num">M 01</div>
<div class="mindmap-thumb-title">Go + Sockets</div>
</div>
<div class="mindmap-thumb" data-slide-index="1">
<div class="mindmap-thumb-num">M 02</div>
<div class="mindmap-thumb-title">eBPF Kernel</div>
</div>
<div class="mindmap-thumb" data-slide-index="2">
<div class="mindmap-thumb-num">M 03</div>
<div class="mindmap-thumb-title">Vanilla ZFS</div>
</div>
<div class="mindmap-thumb" data-slide-index="3">
<div class="mindmap-thumb-num">M 04</div>
<div class="mindmap-thumb-title">3-Node K8s</div>
</div>
<div class="mindmap-thumb" data-slide-index="4">
<div class="mindmap-thumb-num">M 05</div>
<div class="mindmap-thumb-title">NATS Bus</div>
</div>
<div class="mindmap-thumb" data-slide-index="5">
<div class="mindmap-thumb-num">M 06</div>
<div class="mindmap-thumb-title">OpenTofu IaC</div>
</div>
<div class="mindmap-thumb" data-slide-index="6">
<div class="mindmap-thumb-num">M 07</div>
<div class="mindmap-thumb-title">vLLM AI RAG</div>
</div>
<div class="mindmap-thumb" data-slide-index="7">
<div class="mindmap-thumb-num">M 08</div>
<div class="mindmap-thumb-title">LGTM FinOps</div>
</div>
<div class="mindmap-thumb" data-slide-index="8">
<div class="mindmap-thumb-num">M 09</div>
<div class="mindmap-thumb-title">Oracle OTel</div>
</div>
<div class="mindmap-thumb" data-slide-index="9">
<div class="mindmap-thumb-num">M 10–12</div>
<div class="mindmap-thumb-title">Independence</div>
</div>
</div>
</div>

</div>

---

<h2>The 3 Sellable SaaS Assets</h2>

<div class="product-grid">

<div class="product-card">
<div class="product-header">
<div class="product-title">Product 1: Oracle Enterprise Observability Hub</div>
<div class="product-badge">B2B SaaS Pipeline</div>
</div>
<p class="product-desc">Turns deep Oracle <code>V$</code> session waits, buffer cache stats, and top SQL latency into standard OpenTelemetry metrics routed to Azure Monitor and Grafana without Oracle Diagnostics Pack licensing fees.</p>
<div class="product-meta-grid">
<div>
<div class="product-meta-label">Stack</div>
<div class="product-meta-val">Go · OTel Collector · NATS · Prometheus · Grafana</div>
</div>
<div>
<div class="product-meta-label">ROI & Market</div>
<div class="product-meta-val">Saves Oracle enterprise shops $17,500/year per processor.</div>
</div>
</div>
</div>

<div class="product-card">
<div class="product-header">
<div class="product-title">Product 2: ZFS Automated Restore & Verification Sentry</div>
<div class="product-badge">Appliance / Managed DR</div>
</div>
<p class="product-desc">Takes encrypted ZFS snapshot streams over WireGuard, automatically clones them into temporary namespaces, runs database integrity tests, and provides daily cryptographic proof that backups are recoverable.</p>
<div class="product-meta-grid">
<div>
<div class="product-meta-label">Stack</div>
<div class="product-meta-val">FreeBSD / Ubuntu ZFS · WireGuard · Go Daemon · NATS</div>
</div>
<div>
<div class="product-meta-label">ROI & Market</div>
<div class="product-meta-val">Guaranteed ransomware recovery proof for legal, health, and finance.</div>
</div>
</div>
</div>

<div class="product-card">
<div class="product-header">
<div class="product-title">Product 3: eBPF Kubernetes FinOps & Telemetry Sentry</div>
<div class="product-badge">Kubernetes SaaS Sentry</div>
</div>
<p class="product-desc">Zero-instrumentation Kubernetes observability daemon providing sub-millisecond database tracing and granular dollar-level cost attribution per pod without modifying application code or deploying sidecars.</p>
<div class="product-meta-grid">
<div>
<div class="product-meta-label">Stack</div>
<div class="product-meta-val">eBPF (Cilium/Pixie) · OpenCost · Go · 3-Node K8s · Grafana</div>
</div>
<div>
<div class="product-meta-label">ROI & Market</div>
<div class="product-meta-val">Eliminates 40%+ wasted cloud compute and network egress fees.</div>
</div>
</div>
</div>

</div>

---

<h2>6-Hour Daily Session Structure</h2>

<div class="session-grid">
<div class="session-card active-block">
<div class="session-time">Block 1 · 2.5 Hours</div>
<div class="session-title">Deep Systems Build</div>
<ul class="session-items">
<li>Writing Go daemons & CLI tools</li>
<li>OTel Collector receiver internals</li>
<li>NATS.io JetStream event streaming</li>
<li>Building the 3 sellable products</li>
</ul>
</div>

<div class="session-card">
<div class="session-time">Block 2 · 2.0 Hours</div>
<div class="session-title">Systems Lab & Break</div>
<ul class="session-items">
<li>Simulating ZFS disk bit-rot & healing</li>
<li>Testing socket timeouts & FD leaks</li>
<li>Profiling with eBPF and Pyroscope</li>
<li>Breaking network connections deliberately</li>
</ul>
</div>

<div class="session-card">
<div class="session-time">Block 3 · 1.5 Hours</div>
<div class="session-title">Document & Publish</div>
<ul class="session-items">
<li>Documenting daily lessons & findings</li>
<li>Writing technical case studies on bugs</li>
<li>Publishing verified configs to site</li>
<li>Building distribution & authority</li>
</ul>
</div>
</div>
