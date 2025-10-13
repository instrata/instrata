export type RuntimeInfo =
    | { os: "windows", install: "dev" | "exe" | "msi" }
    | { os: "linux", install: "dev" | "pkg" | "appimage" | "tgz" }
    | { os: "macos", install: "dev" | "dmg" }
