---
title: Features
---

# ::list-todo:: Features

Instrata helps you capture, edit, and export step-by-step visual guides efficiently.  
Below is a comprehensive list of all features, both available and planned.

> ::circle-check:: implemented  
> ::circle-dot:: partially completed  
> ::circle:: planned  
> ::circle-dashed:: considered  

::circle-dot:: **Automatic Screenshot Capture**  
Record your actions automatically and let Instrata build step-by-step visuals.  
::empty:: <small>Screenshots are already working. Taking them automatically requires more work.</small>  

::circle-check:: **Simple Text Tools**  
Insert captions or step descriptions directly into your guide with basic formatting like bold, italic, and inline code.  
::empty:: <small>Text-Editing kept simple to support most output-formats. May be extended with fonts or colors.</small>  

::circle:: **Simple Image Editing Tools**  
Add highlights, blur sensitive areas, and annotate images with minimal effort.

::circle-check:: **Multi-format Export**  
Export your guides as Markdown, <strike>HTML</strike>, PDF for sharing and reuse.

::circle-check:: **Custom Export Layouts via Templates**  
Export your guide with custom layout, styling, and structure via a template to match your branding or company.    
::empty:: <small>[See template documentation](./templates.md)</small>

::circle:: **Hotkeys and Systray Integration**  
Access capture and editing tools quickly through global shortcuts and a minimal system tray menu.

::circle:: **Guide Collaboration**  
::empty:: ::circle-dot:: Share guide projects by exporting to an archive. ::file-archive::  
::empty:: ::circle:: Share guide projects via version control within a repository. ::social/git::  
::empty:: ::empty:: <small>Allow adding/editing of projects saved externally (e.g. within a git repository)</small>  
::empty:: ::circle-dashed:: Share guide projects via online accounts or cloud storage. ::cloud-upload::  
::empty:: ::empty:: <small>Maybe just documentation for tools like [syncthing](https://syncthing.net/)</small>

::circle-check:: **Lightweight & Offline**  
Built with Tauri and Vue, Instrata runs fast without requiring an internet connection.

::circle-check:: **Cross-platform Support**  
Available for Windows (`.msi`, `.exe`), Linux (`.AppImage`, `.deb`, `.rpm`), and macOS (`.dmg`, `.app.tar.gz`).  
::empty:: <small>[Download latest release](https://github.com/instrata/instrata/releases/latest)</small>

::circle-dashed:: **OCR and Searchable Text**  
Extract text from screenshots to make exported guides fully searchable.  
::empty:: <small>User may need to install an OCR-Engines like tesseract themselves</small>  

::circle-dashed:: **Animated Exports**  
Generate GIF, WebP, or video versions of your guides to demonstrate workflows dynamically.
