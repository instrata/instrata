use std::io::Write;
use std::path::{Path};
use tauri::Manager;

#[tauri::command]
pub async fn export_guide(
    app_handle: tauri::AppHandle,
    guide_id: String,
) -> Result<Vec<u8>, String> {
    tokio::task::spawn_blocking(move || {
        blocking_export_guide(app_handle, guide_id)
    })
        .await
        .map_err(|e| e.to_string())?
}

fn blocking_export_guide(app_handle: tauri::AppHandle, guide_id: String) -> Result<Vec<u8>, String> {
    let mut buffer = std::io::Cursor::new(Vec::new());
    let mut zip = zip::ZipWriter::new(&mut buffer);

    let guide_root = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(guide_id);

    write_directory_recursive(&mut zip, &guide_root, Path::new(""))
        .map_err(|e| e.to_string())?;

    zip.finish().map_err(|e| e.to_string())?;
    buffer.flush().map_err(|e| e.to_string())?;

    Ok(buffer.into_inner())
}

fn write_directory_recursive<W: Write + std::io::Seek>(
    zip: &mut zip::ZipWriter<W>,
    source_dir: &Path,
    dest_dir: &Path,
) -> Result<(), std::io::Error> {
    for entry in std::fs::read_dir(source_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_symlink() {
            continue
        } else if path.is_dir() {
            let sub_dest_dir = dest_dir.join(path.file_name().unwrap());
            zip.add_directory(
                sub_dest_dir.as_path().to_string_lossy().replace("\\", "/"),
                zip::write::SimpleFileOptions::default(),
            )?;
            write_directory_recursive(zip, &path, sub_dest_dir.as_path())?;
        } else if path.is_file() {
            let dest_file = dest_dir.join(path.file_name().unwrap());
            zip.start_file(
                dest_file.as_path().to_string_lossy().replace("\\", "/"),
                zip::write::SimpleFileOptions::default(),
            )?;
            zip.write_all(&std::fs::read(path)?)?;
        }
    }

    Ok(())
}
