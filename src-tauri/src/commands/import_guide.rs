use std::fs::{self, File};
use std::path::PathBuf;
use tauri::Manager;
use nanoid::nanoid;
use zip::ZipArchive;

#[tauri::command]
pub async fn import_guide(
    app_handle: tauri::AppHandle,
    archive_path: String,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        blocking_import_guide(app_handle, PathBuf::from(archive_path))
    })
        .await
        .map_err(|e| e.to_string())?
}

fn blocking_import_guide(
    app_handle: tauri::AppHandle,
    archive_path: PathBuf,
) -> Result<String, String> {
    let file = File::open(&archive_path).map_err(|e| e.to_string())?;
    let mut zip = ZipArchive::new(file).map_err(|e| e.to_string())?;

    // verify .instrata exists at root
    let has_marker = (0..zip.len())
        .any(|i| zip.by_index(i).map(|f| f.name() == ".instrata").unwrap_or(false));
    if !has_marker {
        return Err("Invalid archive: missing .instrata marker".into());
    }

    // generate new guide ID
    let guide_id = nanoid!();
    let guide_root = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(&guide_id);

    fs::create_dir_all(&guide_root).map_err(|e| e.to_string())?;

    // extract contents (skip .instrata)
    for i in 0..zip.len() {
        let mut file = zip.by_index(i).map_err(|e| e.to_string())?;
        let name = file.enclosed_name().unwrap();

        let out_path = guide_root.join(name);

        if file.is_dir() {
            fs::create_dir_all(&out_path).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            let mut outfile = File::create(&out_path).map_err(|e| e.to_string())?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }

    Ok(guide_id)
}
