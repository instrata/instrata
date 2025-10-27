---
title: Installation
---

# ::monitor-down:: Installation

Instrata is available for **::social/windows:: [Windows](#windows)**, **::social/linux:: [Linux](#linux)**, and **::social/apple:: [macOS](#macos)**.  
You can download the latest release from the [official ::social/github:: GitHub releases page](https://github.com/instrata/instrata/releases/latest) or the direct links in the sections below.

> [!IMPORTANT]
> On ::social/windows:: Windows and ::social/apple:: macOS, system warnings may appear because Instrata binaries are not code-signed.  
> These alerts are expected and safe to bypass when installing from the [official ::social/github:: GitHub releases](https://github.com/instrata/instrata/releases/latest).  
> See the ::social/windows:: Windows and ::social/apple:: macOS sections below for OS-specific instructions.

## ::social/windows:: Windows

### Download formats:
- [::download:: `instrata-x86_64.msi` - standard Windows installer](https://github.com/instrata/instrata/releases/latest/download/instrata-x86_64.msi)
- [::download:: `instrata-x86_64-setup.exe` - alternative executable installer](https://github.com/instrata/instrata/releases/latest/download/instrata-x86_64-setup.exe)

### Installation steps:
1. Download either the `.msi` or `.exe` file.
2. Run the installer and follow the setup wizard.
   > [!IMPORTANT]
   > On Windows, you may see a **“Windows protected your PC”** or **SmartScreen** warning when running the `.msi` or `.exe` installer.
   > Instrata is an open-source project and the binaries are **not code-signed**, which triggers these alerts.
   > This is expected and does **not** indicate malware.
   > You can safely continue by selecting **More info → Run anyway** if you downloaded the installer from the [official ::social/github:: GitHub releases](https://github.com/instrata/instrata/releases/latest).
3. Launch *Instrata* from the Start Menu or desktop shortcut.


## ::social/linux:: Linux

### Download formats:
- [::download:: `instrata-x86_64.AppImage` - portable, executable file](https://github.com/instrata/instrata/releases/latest/download/instrata-x86_64.AppImage)
- [::download:: `instrata-x86_64.deb` - for Debian and Ubuntu-based distributions](https://github.com/instrata/instrata/releases/latest/download/instrata-x86_64.deb)
- [::download:: `instrata-x86_64.rpm` - for Fedora, RHEL, or openSUSE](https://github.com/instrata/instrata/releases/latest/download/instrata-x86_64.rpm)

### Installation steps:

#### Using AppImage
1. Download the `.AppImage` file.
2. Make it executable:
   ```shell
   chmod +x instrata-x86_64.AppImage
   ```
3. Run it directly:
   ```shell
   ./instrata-x86_64.AppImage
   ```

#### Using DEB or RPM

1. Install via your package manager:
   ```shell
   # Debian/Ubuntu
   $ sudo apt install ./instrata-x86_64.deb
   
   # Fedora/RHEL/openSUSE
   $ sudo rpm -i instrata-x86_64.rpm
   ```
2. Run it directly:
   ```shell
   $ instrata
   ```

## ::social/apple:: macOS

**Download formats:**

* [::download:: `instrata-arm64.dmg` - drag-and-drop installer](https://github.com/instrata/instrata/releases/latest/download/instrata-arm64.dmg)
* [::download:: `instrata-arm64.app.tar.gz` - portable app archive](https://github.com/instrata/instrata/releases/latest/download/instrata-arm64.app.tar.gz)

**Installation steps:**

1. Download the `.dmg` file and open it.
2. Drag *Instrata.app* into your **Applications** folder.
3. Launch it from Launchpad or Finder.

If macOS blocks the app (unverified developer warning), open **System Preferences → Security & Privacy → General** and click **Open Anyway**.

> [!IMPORTANT]
> On macOS, you may see a message stating that *“Instrata.app can’t be opened because it is from an unidentified developer.”*  
> The app is **not signed with an Apple Developer ID**, which causes this warning.  
> This is normal for open-source software.  
> To run it, open **System Settings → Privacy & Security**, then click **Open Anyway** next to the warning.  
> Always ensure you downloaded from the [official ::social/github:: GitHub releases](https://github.com/instrata/instrata/releases/latest).

## ::package-plus:: Updating

Instrata automatically informs you of new versions with an in-app notification for most installation formats.
When available, you can update directly from within the application.

Alternatively, you can manually download and install the latest version from the [official ::social/github:: GitHub releases](https://github.com/instrata/instrata/releases/latest).
Your existing guides and settings should remain intact after updating.

## ::footprints:: Next Steps

Once installed, continue to the [Usage guide](./usage) to learn how to create and export your first documentation sequence.
