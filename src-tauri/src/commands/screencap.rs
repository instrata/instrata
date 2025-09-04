use image::{DynamicImage, RgbImage, RgbaImage};
use tauri::Manager;
use xcap::Monitor;

#[tauri::command]
pub async fn capture_screen(
    app_handle: tauri::AppHandle,
    guide_id: String,
    screen_index: usize,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        blocking_capture_screen(app_handle, guide_id, screen_index)
    })
    .await
    .map_err(|e| e.to_string())?
}

fn blocking_capture_screen(
    app_handle: tauri::AppHandle,
    guide_id: String,
    screen_index: usize,
) -> Result<String, String> {
    let screenshot_id = nanoid::nanoid!();

    let file_path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(guide_id)
        .join("screenshots")
        .join(format!("{}.png", screenshot_id));
    std::fs::create_dir_all(file_path.parent().unwrap()).map_err(|e| e.to_string())?;

    // Get all monitors
    let monitors = Monitor::all().map_err(|e| e.to_string())?;

    // Select monitor
    let monitor = monitors.get(screen_index).ok_or("Invalid monitor index")?;

    // Capture image
    let image: RgbaImage = monitor.capture_image().map_err(|e| e.to_string())?;

    // Convert RGBA to RGB
    let rgb_image: RgbImage = DynamicImage::ImageRgba8(image).into_rgb8();

    // Encode image to PNG
    rgb_image.save(&file_path).map_err(|e| e.to_string())?;

    Ok(screenshot_id)
}
