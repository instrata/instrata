use xcap::Window;

#[derive(serde::Serialize)]
pub struct BBox {
    x: i32,
    y: i32,
    z: i32,
    width: u32,
    height: u32,
}

#[derive(serde::Serialize)]
pub struct WindowInfo {
    id: u32,
    app_name: String,
    title: String,
    bbox: BBox,
    is_minimized: bool,
    is_maximized: bool,
}

#[tauri::command]
pub async fn list_windows() -> Result<Vec<WindowInfo>, String> {
    let result = tokio::task::spawn_blocking(|| blocking_list_windows())
        .await
        .map_err(|e| e.to_string())??;

    Ok(result)
}

fn blocking_list_windows() -> Result<Vec<WindowInfo>, String> {
    let windows = Window::all().map_err(|e| e.to_string())?;
    let infos = windows
        .into_iter()
        .map(|w| {
            let bbox = BBox {
                x: w.x().unwrap(),
                y: w.y().unwrap(),
                z: w.z().unwrap(),
                width: w.width().unwrap(),
                height: w.height().unwrap(),
            };

            WindowInfo {
                id: w.id().unwrap(),
                app_name: w.app_name().unwrap_or_default(),
                title: w.title().unwrap_or_default(),
                bbox,
                is_minimized: w.is_minimized().unwrap_or(false),
                is_maximized: w.is_maximized().unwrap_or(false),
            }
        })
        .collect::<Vec<_>>();

    Ok(infos)
}
