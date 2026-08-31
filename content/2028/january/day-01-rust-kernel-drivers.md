+++
title = "Lab 01: Rust in the Linux Kernel & Character Devices"
description = "Write a safe Linux character device driver using the Rust kernel abstractions and register file operations."
date = 2028-01-01
weight = 1

[extra]
day = "01"
duration = "2.5 Hours"
+++

# 1. THE BRIEF: RUST FOR LINUX KERNEL DRIVERS

The Linux kernel officially supports Rust as a first-class language for writing safe kernel drivers and subsystems. Rust prevents memory safety vulnerabilities such as use-after-free, double-free, and data races at compile time.

In this lab, we write a safe Linux character device driver using the `kernel` crate abstractions, register a miscdevice node in `/dev/rust_sentry`, and implement safe user-to-kernel memory copies.

```simulator
TITLE: Rust Kernel Module Registration & VFS Dispatch
NODE: RUST CHRDEV DRIVER | STATUS: ACTIVE
NODE: LINUX KERNEL VFS | STATUS: ONLINE
STEP 1: Register miscdevice registration with kernel VFS
STEP 2: Bind FileOperations trait to handle read/write syscalls
STEP 3: Zero-copy user-space buffer transfer via UserSlicePtr
```

---

## 2. RUST KERNEL MODULE CODE

```rust
//! Safe Rust Linux Kernel Character Device
use kernel::prelude::*;
use kernel::file::File;
use kernel::io_buffer::IoBufferWriter;
use kernel::miscdevice::{MiscDevice, MiscDeviceOptions, MiscDeviceRegistration};

module! {
    type: RustSentryModule,
    name: "rust_sentry",
    author: "Systems Engineer",
    description: "Production Rust Linux Character Device",
    license: "GPL",
}

struct RustSentryDevice;

#[vtable]
impl kernel::file::Operations for RustSentryDevice {
    type Data = ();

    fn open(_data: &(), _file: &File) -> Result<()> {
        pr_info!("Rust Sentry: Device opened by PID {}\n", kernel::task::Task::current().pid());
        Ok(())
    }

    fn read(_data: &(), _file: &File, writer: &mut impl IoBufferWriter, _offset: u64) -> Result<usize> {
        let msg = b"RUST_KERNEL_TELEMETRY_OK\n";
        writer.write_slice(msg)?;
        Ok(msg.len())
    }
}

struct RustSentryModule {
    _dev: Pin<Box<MiscDeviceRegistration<RustSentryDevice>>>,
}

impl kernel::Module for RustSentryModule {
    fn init(_name: &'static CStr, _module: &'static ThisModule) -> Result<Self> {
        pr_info!("Initializing 2028 Rust Kernel Module\n");
        let reg = MiscDeviceRegistration::register(MiscDeviceOptions {
            name: c_str!("rust_sentry"),
        })?;
        Ok(RustSentryModule { _dev: reg })
    }
}
```

---

## 3. VERIFICATION COMMANDS

```bash
# Compile and insert the Rust kernel module
make -C /lib/modules/$(uname -r)/build M=$(pwd) LLVM=1 modules
sudo insmod rust_sentry.ko

# Verify device node creation in /dev
ls -la /dev/rust_sentry

# Test reading telemetry from userspace
cat /dev/rust_sentry
```

---

## 4. DAILY DELIVERABLES CHECKLIST

To complete today's session and bank **+2.5 Hours**:

- [ ] Compile the Rust kernel module with LLVM toolchain.
- [ ] Verify `/dev/rust_sentry` device registration in kernel ring buffer (`dmesg`).
- [ ] Test reading telemetry messages from user-space.
