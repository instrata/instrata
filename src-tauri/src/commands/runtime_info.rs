use serde::Serialize;
use std::path::PathBuf;

#[derive(Serialize)]
pub struct RuntimeInfo {
    pub os: String,
    pub arch: String,
    pub install: String,
}

#[tauri::command]
pub fn get_runtime_info() -> RuntimeInfo {
    let os_const = std::env::consts::OS.to_lowercase();
    let arch_const = std::env::consts::ARCH.to_lowercase();
    let exe_path = std::env::current_exe().ok();

    match os_const.as_str() {
        "windows" => RuntimeInfo {
            os: "windows".into(),
            arch: arch_const,
            install: detect_windows_install(&exe_path),
        },
        "linux" => RuntimeInfo {
            os: "linux".into(),
            arch: arch_const,
            install: detect_linux_install(&exe_path),
        },
        "macos" | "darwin" => RuntimeInfo {
            os: "macos".into(),
            arch: arch_const,
            install: detect_macos_install(&exe_path),
        },
        _ => RuntimeInfo {
            os: os_const,
            arch: arch_const,
            install: "dev".into(),
        },
    }
}

fn detect_windows_install(exe_path: &Option<PathBuf>) -> String {
    if cfg!(debug_assertions) {
        return "dev".into();
    }

    if let Some(path) = exe_path {
        if path
            .extension()
            .and_then(|s| s.to_str())
            .map_or(false, |ext| ext.eq_ignore_ascii_case("exe"))
        {
            return "exe".into();
        }
    }

    "msi".into()
}

fn detect_linux_install(exe_path: &Option<PathBuf>) -> String {
    if cfg!(debug_assertions) {
        return "dev".into();
    }

    if std::env::var("APPIMAGE")
        .ok()
        .filter(|v| !v.is_empty())
        .is_some()
    {
        return "appimage".into();
    }

    if let Some(path) = exe_path {
        let s = path.display().to_string();

        if s.starts_with("/usr/bin/") {
            return "pkg".into(); // installed via package manager
        }
    }

    "tgz".into()
}

fn detect_macos_install(exe_path: &Option<PathBuf>) -> String {
    if cfg!(debug_assertions) {
        return "dev".into();
    }

    if let Some(path) = exe_path {
        let s = path.display().to_string();
        if s.contains(".app/") || s.contains(".app\\") {
            return "dmg".into();
        }
    }

    // fallback
    "dev".into()
}
