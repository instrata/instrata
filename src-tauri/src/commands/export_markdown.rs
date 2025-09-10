use crate::commands::utils;
use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::Manager;

#[tauri::command]
pub async fn export_markdown(
    app_handle: tauri::AppHandle,
    template_id: String,
    guide_id: String,
    params: serde_json::Value,
) -> Result<Vec<u8>, String> {
    tokio::task::spawn_blocking(move || {
        blocking_export_markdown(app_handle, template_id, guide_id, params)
    })
    .await
    .map_err(|e| e.to_string())?
}

fn blocking_export_markdown(
    app_handle: tauri::AppHandle,
    template_id: String,
    guide_id: String,
    params: serde_json::Value,
) -> Result<Vec<u8>, String> {
    let template_dir = utils::resolve_template_dir(&app_handle, &template_id)?;

    let template_src =
        std::fs::read_to_string(&template_dir.join("template.md.j2")).map_err(|e| e.to_string())?;

    let context = utils::serde_to_tera_context(params);
    let rendered: String = tera::Tera::default()
        .render_str(&template_src, &context)
        .map_err(|e| e.to_string())?;

    let mut buffer = std::io::Cursor::new(Vec::new());
    let mut zip = zip::ZipWriter::new(&mut buffer);

    zip.start_file("README.md", zip::write::SimpleFileOptions::default())
        .map_err(|e| e.to_string())?;
    zip.write_all(rendered.as_bytes())
        .map_err(|e| e.to_string())?;

    let assets_dir = template_dir.join("assets");
    if assets_dir.is_dir() {
        write_dir_recursive(&mut zip, &assets_dir, PathBuf::from("assets").as_path())
            .map_err(|e| e.to_string())?;
    }

    let screenshots_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(guide_id)
        .join("screenshots");
    if screenshots_dir.is_dir() {
        write_dir_recursive(
            &mut zip,
            &screenshots_dir,
            PathBuf::from("screenshots").as_path(),
        )
        .map_err(|e| e.to_string())?;
    }

    zip.finish().map_err(|e| e.to_string())?;

    Ok(buffer.into_inner())
}

fn write_dir_recursive<W: std::io::Write + std::io::Seek>(
    zip: &mut zip::ZipWriter<W>,
    source_dir: &Path,
    dest_dir: &Path,
) -> Result<(), std::io::Error> {
    zip.add_directory(
        dest_dir.to_str().unwrap(),
        zip::write::SimpleFileOptions::default(),
    )?;

    for entry in std::fs::read_dir(source_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            let sub_dest_dir = dest_dir.join(path.file_name().unwrap());
            write_dir_recursive(zip, path.as_path(), &sub_dest_dir)?;
        } else if path.is_file() {
            let dest_file = dest_dir.join(path.file_name().unwrap());
            zip.start_file(
                dest_file.as_path().to_str().unwrap(),
                zip::write::SimpleFileOptions::default(),
            )?;
            zip.write_all(std::fs::read(path)?.as_slice())?;
        }
    }

    Ok(())
}
