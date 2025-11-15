import type { BBox } from "@/types/common.ts";

export type WindowInfo = {
  id: number
  appName: string
  title: string
  bbox: BBox & { z: number }
  isMinimized: boolean
  isMaximized: boolean
}

export type Architecture = "x86" | "x86_64" | "arm" | "aarch64" | (string & {})

export type RuntimeInfo =
    | { os: "windows", arch: Architecture, install: "dev" | "exe" | "msi" }
    | { os: "linux", arch: Architecture, install: "dev" | "pkg" | "appimage" | "tgz" }
    | { os: "macos", arch: Architecture, install: "dev" | "dmg" }
