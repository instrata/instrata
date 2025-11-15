use tauri::Manager;
use xcap::Window;

#[tauri::command]
pub async fn capture_window(
    app_handle: tauri::AppHandle,
    guide_id: String,
    window_id: u32,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || blocking_capture_window(app_handle, guide_id, window_id))
        .await
        .map_err(|e| e.to_string())?
}

fn blocking_capture_window(
    app_handle: tauri::AppHandle,
    guide_id: String,
    window_id: u32,
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

    // Get all windows
    let windows = Window::all().map_err(|e| e.to_string())?;

    // Find window by id
    let window = windows.iter().find(|w| w.id().unwrap() == window_id).ok_or("Unknown window id")?;

    // Capture image
    window
        .capture_image()
        .map_err(|e| e.to_string())?
        .save(&file_path)
        .map_err(|e| e.to_string())?;

    Ok(screenshot_id)
}
