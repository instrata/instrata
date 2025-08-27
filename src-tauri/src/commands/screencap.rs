use base64::{engine::general_purpose, Engine as _};
use image::{DynamicImage, RgbImage, RgbaImage};
use xcap::Monitor;

#[tauri::command]
pub async fn capture_screen(index: usize) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        // Get all monitors
        let monitors = Monitor::all().map_err(|e| e.to_string())?;

        // Select monitor
        let monitor = monitors.get(index).ok_or("Invalid monitor index")?;

        // Capture image
        let image: RgbaImage = monitor.capture_image().map_err(|e| e.to_string())?;

        // Convert RGBA to RGB
        let rgb_image: RgbImage = DynamicImage::ImageRgba8(image).into_rgb8();

        // Encode image to PNG
        let mut png_bytes: Vec<u8> = Vec::new();
        rgb_image
            .write_to(
                &mut std::io::Cursor::new(&mut png_bytes),
                image::ImageFormat::Jpeg,
            )
            .map_err(|e| e.to_string())?;

        // Convert to base64
        let b64 = general_purpose::STANDARD.encode(&png_bytes);

        let data_url = format!("data:image/jpeg;base64,{}", b64);

        Ok(data_url)
    })
    .await
    .map_err(|e| e.to_string())?
}
