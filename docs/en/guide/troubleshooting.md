---
title: Troubleshooting
---

# ::bug:: Troubleshooting

This page covers common issues you might encounter while installing or using Instrata and how to resolve them.

## ::monitor-down:: Installation Issues

### ::social/windows:: Windows
- **SmartScreen warning**  
  If Windows shows a **“Windows protected your PC”** message, select **More info → Run anyway**. This is normal for unsigned open-source binaries.

- **Installer won’t run**  
  Ensure you downloaded the file from the [official GitHub releases](https://github.com/instrata/instrata/releases/latest). Verify the file extension matches your download (`.msi` or `-setup.exe`).

### ::social/apple:: macOS
- **Unidentified Developer warning**  
  If macOS prevents opening the app, go to **System Settings → Privacy & Security**, then click **Open Anyway** next to the warning.

### ::social/linux:: Linux
- **Permission denied for AppImage**  
  Run `chmod +x instrata-x.x.x.AppImage` before launching.

- **Dependency issues with DEB/RPM packages**  
  Use your package manager to install missing dependencies or ensure your system is up to date.

## ::app-window:: Application Issues

- **App crashes on startup**
    - Ensure your system meets minimum requirements.
    - Check for other applications that may block screen capture permissions.
    - Try running the latest release from GitHub.

- **Screenshots not captured**
    - Verify that Instrata has permission to capture the screen.
    - On macOS, check **System Preferences → Security & Privacy → Screen Recording**.
    - On Linux, some desktop environments require enabling screen capture in system settings.

- **Export fails or files are corrupted**
    - Ensure you have write permissions in the export directory.
    - Avoid special characters in file names.
    - Update to the latest release to fix known export issues.

## ::info:: General Tips

- Restart the application after changing permissions.
- Keep Instrata updated to benefit from bug fixes and new features.
- For persistent issues, consult the [::social/github:: GitHub Issues page](https://github.com/instrata/instrata/issues) to see if the problem has already been reported or fixed.
