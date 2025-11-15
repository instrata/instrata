use tauri::Manager;
use xcap::Monitor;

#[derive(serde::Deserialize)]
pub struct BBox {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

#[tauri::command]
pub async fn capture_region(
    app_handle: tauri::AppHandle,
    guide_id: String,
    region: BBox,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || blocking_capture_region(app_handle, guide_id, region))
        .await
        .map_err(|e| e.to_string())?
}

fn blocking_capture_region(
    app_handle: tauri::AppHandle,
    guide_id: String,
    region: BBox,
) -> Result<String, String> {
    use image::{GenericImage, ImageBuffer, Rgba};

    let screenshot_id = nanoid::nanoid!();

    let file_path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(&guide_id)
        .join("images")
        .join(format!("{}.png", screenshot_id));

    std::fs::create_dir_all(file_path.parent().unwrap())
        .map_err(|e| e.to_string())?;

    let monitors = Monitor::all().map_err(|e| e.to_string())?;

    let target_x = region.x as i32;
    let target_y = region.y as i32;
    let target_w = region.width as i32;
    let target_h = region.height as i32;

    // Preallocate output buffer
    let mut output = ImageBuffer::<Rgba<u8>, Vec<u8>>::new(region.width, region.height);

    for monitor in monitors {
        let mx = monitor.x().map_err(|e| e.to_string())? as i32;
        let my = monitor.y().map_err(|e| e.to_string())? as i32;
        let mw = monitor.width().map_err(|e| e.to_string())? as i32;
        let mh = monitor.height().map_err(|e| e.to_string())? as i32;

        let inter_left = target_x.max(mx);
        let inter_top = target_y.max(my);
        let inter_right = (target_x + target_w).min(mx + mw);
        let inter_bottom = (target_y + target_h).min(my + mh);

        if inter_left >= inter_right || inter_top >= inter_bottom {
            continue;
        }

        let inter_w = (inter_right - inter_left) as u32;
        let inter_h = (inter_bottom - inter_top) as u32;

        let cap_x = (inter_left - mx) as u32;
        let cap_y = (inter_top - my) as u32;
        let captured = monitor
            .capture_region(cap_x, cap_y, inter_w, inter_h)
            .map_err(|e| e.to_string())?;

        let paste_x = (inter_left - target_x) as u32;
        let paste_y = (inter_top - target_y) as u32;

        // Faster block copy
        output
            .copy_from(&captured, paste_x, paste_y)
            .map_err(|_| "Failed to copy captured region")?;
    }

    output.save(&file_path).map_err(|e| e.to_string())?;

    Ok(screenshot_id)
}
