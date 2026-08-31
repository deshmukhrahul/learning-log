+++
title = "Tech Stack — SaaS Architecture Matrix"
description = "Lean 8-layer systems stack. Zero encyclopedia fluff. What each tool does, what it replaces, and what sellable SaaS asset it builds."
date = 2026-08-29
weight = 1

[extra]
label = "Master Stack"
+++

<div class="filter-bar">
  <button class="filter-btn active" data-stack-filter="all">All Layers (8)</button>
  <button class="filter-btn" data-stack-filter="core">Systems Core</button>
  <button class="filter-btn" data-stack-filter="storage">Storage & DR</button>
  <button class="filter-btn" data-stack-filter="bus">Real-Time Bus</button>
  <button class="filter-btn" data-stack-filter="obs">Observability</button>
  <button class="filter-btn" data-stack-filter="ebpf">Kernel eBPF</button>
  <button class="filter-btn" data-stack-filter="k8s">Kubernetes</button>
  <button class="filter-btn" data-stack-filter="auto">Automation</button>
  <button class="filter-btn" data-stack-filter="ai">AI Infra</button>
</div>

<div class="prose">
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Layer</th>
      <th style="width: 24%;">The Tech</th>
      <th style="width: 27%;">Why This (Not the Bloat)</th>
      <th style="width: 27%;">SaaS Production Artifact</th>
    </tr>
  </thead>
  <tbody>
    <tr data-stack-row data-layer="core">
      <td><strong>1. Systems Core</strong></td>
      <td><strong>Go (Golang)</strong><br><span class="tag">Linux / FreeBSD</span></td>
      <td>Static ELF binaries (<code>CGO_ENABLED=0</code>). Zero runtime deps. Pure socket & signal control.</td>
      <td>Single-binary SaaS backend APIs, scrapers, and custom OTel receivers.</td>
    </tr>
    <tr data-stack-row data-layer="storage">
      <td><strong>2. Storage & DR</strong></td>
      <td><strong>Vanilla OpenZFS</strong><br><span class="tag">FreeBSD & Ubuntu</span></td>
      <td>Replaces heavy Ceph/TrueNAS GUI with pure CLI ZFS + WireGuard replication.</td>
      <td><strong>Product 2:</strong> Automated ZFS Backup Verification & Ransomware DR Sentry.</td>
    </tr>
    <tr data-stack-row data-layer="bus">
      <td><strong>3. Real-Time Bus</strong></td>
      <td><strong>NATS.io</strong><br><span class="tag">JetStream in Go</span></td>
      <td>Replaces Kafka. 20MB single binary, sub-millisecond latency, zero JVM heap tuning.</td>
      <td>Multi-tenant telemetry event bus and edge-to-cloud agent sync.</td>
    </tr>
    <tr data-stack-row data-layer="obs">
      <td><strong>4. Observability</strong></td>
      <td><strong>OTel Collector</strong><br><span class="tag">Prometheus / Grafana</span></td>
      <td>Replaces proprietary agents. One Go receiver routes to Azure, Grafana, and Datadog.</td>
      <td><strong>Product 1:</strong> Oracle Enterprise Observability Hub (No $17K pack licenses).</td>
    </tr>
    <tr data-stack-row data-layer="ebpf">
      <td><strong>5. Kernel eBPF</strong></td>
      <td><strong>Cilium & Pixie</strong><br><span class="tag">Kernel VM</span></td>
      <td>Replaces sidecars. Zero-overhead socket routing and live DB syscall tracing.</td>
      <td><strong>Product 3:</strong> eBPF Kubernetes FinOps & Telemetry Sentry.</td>
    </tr>
    <tr data-stack-row data-layer="k8s">
      <td><strong>6. Kubernetes</strong></td>
      <td><strong>3-Node Upstream K8s</strong><br><span class="tag">Cilium CNI · ZFS CSI</span></td>
      <td>Replaces cloud AKS/EKS vendor lock-in. Real multi-node bare-metal cluster.</td>
      <td>The sovereign multi-tenant platform hosting and running all your SaaS products.</td>
    </tr>
    <tr data-stack-row data-layer="auto">
      <td><strong>7. Automation</strong></td>
      <td><strong>OpenTofu & Ansible</strong><br><span class="tag">ArgoCD GitOps</span></td>
      <td>Replaces Puppet. Agentless pure SSH configuration across Linux and FreeBSD.</td>
      <td>Automated tenant provisioning, OS hardening, and GitOps delivery.</td>
    </tr>
    <tr data-stack-row data-layer="ai">
      <td><strong>8. AI Infra</strong></td>
      <td><strong>vLLM & Qdrant</strong><br><span class="tag">Local Vector RAG</span></td>
      <td>Replaces paid OpenAI APIs. Local PagedAttention inference and single-binary vector search.</td>
      <td>Embedded AI root-cause diagnostic assistant and log summarizer in SaaS dashboards.</td>
    </tr>
  </tbody>
</table>
</div>

---

## 3. The 3 Sellable SaaS Assets

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
