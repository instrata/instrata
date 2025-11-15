use tauri::Manager;
use xcap::Monitor;

#[tauri::command]
pub async fn capture_monitor(
    app_handle: tauri::AppHandle,
    guide_id: String,
    monitor_name: String,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || blocking_capture_monitor(app_handle, guide_id, monitor_name))
        .await
        .map_err(|e| e.to_string())?
}

fn blocking_capture_monitor(
    app_handle: tauri::AppHandle,
    guide_id: String,
    monitor_name: String,
) -> Result<String, String> {
    let screenshot_id = nanoid::nanoid!();

    let file_path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(guide_id)
        .join("images")
        .join(format!("{}.png", screenshot_id));
    std::fs::create_dir_all(file_path.parent().unwrap()).map_err(|e| e.to_string())?;

    // Get all monitors
    let monitors = Monitor::all().map_err(|e| e.to_string())?;

    // Find monitor by name
    let monitor = monitors.iter().find(|w| w.name().unwrap() == monitor_name).ok_or("Unknown monitor name")?;

    // Capture image
    monitor
        .capture_image()
        .map_err(|e| e.to_string())?
        .save(&file_path)
        .map_err(|e| e.to_string())?;

    Ok(screenshot_id)
}
