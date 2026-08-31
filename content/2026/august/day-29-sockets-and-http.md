+++
title = "Lab 01: Go Setup, Linux File Descriptors & Network Sockets"
description = "Install modern Go, trace socket FDs in /proc/<pid>/fd/, and write a production HTTP client with strict timeout control."
date = 2026-08-29
weight = 10

[extra]
month = "AUGUST"
year = 2026
day = "01"
week = "4"
hours_spent = 2.5
+++

> [!NOTE]
> **SAMPLE LAB / DUMMY STARTER ENTRY**: This is an example daily lab demonstrating the 4-part systems architecture structure, interactive hardware simulators, and completion tracking. You can edit this file to record your own custom daily study notes.

## 1. The Brief: Sockets as Kernel File Descriptors

In Linux, **everything is a file descriptor (FD)**. When your Go program opens a TCP connection or listens on a port, the Linux kernel allocates an integer index in the process FD table pointing to a kernel `struct file` and `struct socket`.

Mastering socket primitives is the foundation for understanding high-throughput OpenTelemetry collectors, proxies, and kernel network tracing with eBPF.

### Interactive Visualizer 1: Linux TCP Socket Allocation & Handshake

<div class="hud-simulator" data-title="Linux TCP Socket Allocation & Handshake">

[step 1: Process Calls net.DialTCP]
- node: Go User Process (PID 4102) | SOCKET: Allocating | MEMORY: User Space | state: active
- conduit: Syscall socket(AF_INET) ──► Kernel FD
- target: Linux Kernel FD Table | NEXT AVAILABLE FD: 3 (/proc/4102/fd/3) | state: normal
- desc: The Go application invokes the socket syscall. The Linux kernel assigns integer File Descriptor 3 pointing to an unbound struct socket.
- cmd: ls -l /proc/$$/fd/

[step 2: TCP 3-Way Handshake SYN Packet]
- node: Go Client Socket (FD 3) | TCP STATE: SYN_SENT | PORT: Ephemeral 52140 | state: active
- node: Remote Server | TCP STATE: LISTEN | PORT: 8080 | state: online
- conduit: TCP SYN (Seq=0) ──► eth0 Wire
- target: Remote Network Stack | CONNECTION QUEUE: SYN Backlog | state: normal
- desc: Client sends a TCP SYN packet across the virtual interface. The server receives the SYN and reserves buffer space in its listen queue.
- cmd: sudo tcpdump -nn -i any port 8080 -c 1

[step 3: Established Connection & Socket Buffers]
- node: Go Client Socket (FD 3) | TCP STATE: ESTABLISHED | SO_RCVBUF: 131,072 Bytes | state: online
- node: Remote Server | TCP STATE: ESTABLISHED | SO_SNDBUF: 131,072 Bytes | state: online
- conduit: Full-Duplex TCP Stream ◄──►
- target: Kernel Socket Layer | ESTABLISHED: Bidirectional Stream Active | state: online
- desc: Handshake completes. The kernel sets up the SO_RCVBUF and SO_SNDBUF ring buffers for high-throughput I/O.
- cmd: ss -tie dst :8080

</div>

### Interactive Visualizer 2: Duplicate IP Conflict & MAC Flapping Engine

<div class="hud-simulator" data-title="Duplicate IP Conflict & MAC Flapping Engine">

[step 1: Host A Boots & Announces IP]
- node: Host A | IP: 10.0.0.10 | MAC: AA:AA:AA:AA:AA:AA | PORT: 1 | state: online
- node: Host B | IP: OFF | MAC: BB:BB:BB:BB:BB:BB | PORT: 2 | state: offline
- conduit: Gratuitous ARP ──► Port 1
- target: Core Switch | 10.0.0.10 ──► Port 1 (MAC: AA) | state: normal
- desc: Host A boots up and announces 10.0.0.10 via Gratuitous ARP. The core switch registers MAC-AA on Port 1.
- cmd: sudo arping -U -c 1 -I eth0 10.0.0.10

[step 2: Rogue Host B Boot Conflict]
- node: Host A | IP: 10.0.0.10 | MAC: AA:AA:AA:AA:AA:AA | PORT: 1 | state: online
- node: Host B | IP: 10.0.0.10 | MAC: BB:BB:BB:BB:BB:BB | PORT: 2 | state: rogue
- conduit: Duplicate ARP ──► Overwrite Port 2
- target: Core Switch | 10.0.0.10 ──► Port 2 (Overwritten!) | state: conflict
- desc: Misconfigured Host B claims the exact same IP. The switch overwrites its MAC forwarding table, pointing all incoming traffic to Port 2.
- cmd: sudo tcpdump -n -i eth0 arp and host 10.0.0.10

[step 3: MAC Table Flapping & TCP Session Destruction]
- node: Host A | IP: 10.0.0.10 | MAC: AA:AA:AA:AA:AA:AA | PORT: 1 | state: flapping
- node: Host B | IP: 10.0.0.10 | MAC: BB:BB:BB:BB:BB:BB | PORT: 2 | state: flapping
- conduit: Port Thrashing ◄──► Collision
- target: Core Switch | Port 1 ◄──► Port 2 (Thrashing) | state: flapping
- desc: Switch MAC table rapidly flips back and forth between Port 1 and Port 2 on every packet. Host B receives packets for Host A's TCP connection and immediately replies with TCP RST flags, destroying active sessions.
- cmd: ip neigh show | grep 10.0.0.10

</div>

## 2. Hands-on Experiment: Go Raw Socket Listener & FD Inspection

Below is a production-grade minimal TCP listener in Go that demonstrates raw file descriptor inspection and non-blocking timeout handling:

```go
package main

import (
	"context"
	"fmt"
	"net"
	"os"
	"syscall"
	"time"
)

func main() {
	// 1. Listen on local TCP port
	lc := net.ListenConfig{
		Control: func(network, address string, c syscall.RawConn) error {
			return c.Control(func(fd uintptr) {
				fmt.Printf("[KERNEL] Allocated Socket File Descriptor: FD=%d\n", fd)
			})
		},
	}

	listener, err := lc.Listen(context.Background(), "tcp", "127.0.0.1:9090")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Listen error: %v\n", err)
		os.Exit(1)
	}
	defer listener.Close()

	fmt.Printf("[SERVER] Listening on %s (PID=%d)\n", listener.Addr(), os.Getpid())
	fmt.Println("[HINT] Run in another terminal: ls -l /proc/$PID/fd/")

	time.Sleep(3 * time.Second)
}
```

## 3. Anomalies & Gotchas: Linux Socket Leaks

> **[CRITICAL] Always close body streams in Go clients!**  
> If you call `resp, err := http.Get(url)` and fail to call `defer resp.Body.Close()`, the underlying socket file descriptor remains open in the kernel table until the garbage collector runs. Under 5,000 req/sec, your process will exhaust its file descriptor limit (`ulimit -n`) and fail with `socket: too many open files`.

## 4. Daily Deliverables Checklist

To complete today's session and bank **+2.5 Hours**:
* [ ] Compile and run the Go socket server with custom `ListenConfig`.
* [ ] Inspect your process socket descriptors in `/proc/<pid>/fd/`.
* [ ] Verify active connection state in terminal using `ss -tlpn`.
