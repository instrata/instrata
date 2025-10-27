---
layout: home

hero:
  name: Instrata
  text: Create step-by-step guides effortlessly
  tagline: Capture, edit, and export screenshots into clean, structured tutorials in seconds.
  image:
    light: /instrata-light.svg
    dark: /instrata-dark.svg
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: Releases
      link: https://github.com/instrata/instrata/releases/latest

features:
  - icon: "::camera::"
    title: Automatic Screenshot Capture
    details: Record your actions automatically and let Instrata build step-by-step visuals.
  - icon: "::pencil::"
    title: Simple Text Tools
    details: Insert captions or step descriptions directly into your guide with basic formatting options.
  - icon: "::brush::"
    title: Simple Image Editing Tools
    details: Add highlights, blur sensitive areas, and annotate images with minimal effort.
  - icon: "::file-text::"
    title: Multi-format Export
    details: Export your guides as PDF, Markdown, PDF, HTML, or JSON for sharing and reuse.
  - icon: "::app-window::"
    title: Lightweight & Offline
    details: Built with Tauri and Vue, Instrata runs fast without requiring an internet connection.
  - icon: "::monitor-down::"
    title: Cross-platform Support
    details: Available for Windows, Linux, and macOS.
    link: https://github.com/instrata/instrata/releases/latest
    linkText: "See Releases"

downloads:
  windows:
    - title: "instrata-x86_64.msi"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-x86_64.msi"
    - title: "instrata-x86_64-setup.exe"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-x86_64-setup.exe"
  linux:
    - title: "instrata-x86_64.AppImage"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-x86_64.AppImage"
    - title: "instrata-x86_64.deb"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-x86_64.deb"
    - title: "instrata-x86_64.rpm"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-x86_64.rpm"
  macos:
    - title: "instrata-arm64.dmg"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-arm64.dmg"
    - title: "instrata-arm64.app.tar.gz"
      link: "https://github.com/instrata/instrata/releases/latest/download/instata-arm64.app.tar.gz"
---

<script setup>
import VPFeatures from "vitepress/dist/client/theme-default/components/VPFeatures.vue";
</script>
<style scoped>
.vp-doc h1 {
  text-align: center;
}
</style>
<style>
.vp-doc .VPFeature .title {
margin: 0;
border-top: none;
padding-top: unset;
}
</style>

---

# ::hand:: Welcome to Instrata

Instrata helps you turn workflows into professional documentation.  
Capture your screen, annotate steps, and export ready-to-use guides without switching tools.

---

# ::circle-question-mark:: Why Instrata

Most documentation tools focus on writing. Instrata focuses on showing.  
It’s ideal for creating visual tutorials, QA documentation, or reproducible bug reports.

- ::camera:: Capture sequential screenshots automatically
- ::pencil:: Edit with minimal clicks
- ::file-text:: Export to multiple shareable formats
- ::app-window:: Works offline and across platforms ::social/windows:: ::social/linux:: ::social/apple::

Start from the [::hand:: Introduction](./guide/introduction) to learn the basics or go straight to [::monitor-down:: Installation](./guide/installation) to set up the app.

---

# ::monitor-down:: Download

<div style="height: 1em"></div>

<VPFeatures :features="$frontmatter.downloads.windows" />
<VPFeatures :features="$frontmatter.downloads.linux" />
<VPFeatures :features="$frontmatter.downloads.macos" />
