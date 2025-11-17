use std::path::PathBuf;
use tauri::Manager;


#[tauri::command]
pub async fn link_external_guide(
    app_handle: tauri::AppHandle,
    external_path: String,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        blocking_link_external_guide(app_handle, PathBuf::from(external_path))
    })
        .await
        .map_err(|e| e.to_string())?
}


fn blocking_link_external_guide(
    app_handle: tauri::AppHandle,
    external_path: PathBuf,
) -> Result<String, String> {

    if !external_path.join(".instrata").is_file() {
        return Err("missing marker file in external directory".into());
    }

    let guide_id = nanoid::nanoid!();

    let link_path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(&guide_id);

    create_symlink(external_path, link_path)?;

    Ok(guide_id)
}

fn create_symlink(
    target: PathBuf,
    link_path: PathBuf,
) -> Result<(), String> {

    // Ensure parent exists (or create as needed)
    if let Some(parent) = link_path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("failed to create parent: {}", e))?;
    }

    // Platform-specific symlink creation
    #[cfg(unix)]
    {
        use std::os::unix::fs::symlink;
        symlink(&target, &link_path).map_err(|e| format!("symlink failed: {}", e))?;
        return Ok(());
    }

    #[cfg(windows)]
    {
        use std::os::windows::fs::{symlink_dir, symlink_file};
        if target.is_dir() {
            symlink_dir(&target, &link_path).map_err(|e| format!("symlink_dir failed: {}", e))?;
        } else {
            symlink_file(&target, &link_path).map_err(|e| format!("symlink_file failed: {}", e))?;
        }
        return Ok(());
    }

    #[cfg(not(any(unix, windows)))]
    {
        Err("symlink not supported on this platform".into())
    }
}
