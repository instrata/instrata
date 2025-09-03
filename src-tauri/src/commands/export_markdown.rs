use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::Manager;
use tera::Context;

#[tauri::command]
pub async fn export_markdown(
    app_handle: tauri::AppHandle,
    template_id: String,
    guide_id: String,
    params: serde_json::Value,
) -> Result<Vec<u8>, String> {
    let mut template_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?
        .join(&template_id);
    if !template_dir.is_dir() {
        template_dir = app_handle
            .path()
            .resource_dir()
            .map_err(|e| e.to_string())?
            .join("templates")
            .join(&template_id);
    }
    if !template_dir.is_dir() {
        return Err(String::from("template not found"));
    }

    let template_src = std::fs::read_to_string(&template_dir.join("template.md.j2"))
        .map_err(|e| e.to_string())?;

    let context = serde_to_tera_context(params);
    let rendered: String = setup_tera()
        .render_str(&template_src, &context)
        .map_err(|e| e.to_string())?;

    let mut buffer = std::io::Cursor::new(Vec::new());
    let mut zip = zip::ZipWriter::new(&mut buffer);
    let options = zip::write::SimpleFileOptions::default().compression_method(zip::CompressionMethod::Stored);

    zip.start_file("README.md", options).map_err(|e| e.to_string())?;
    zip.write_all(rendered.as_bytes()).map_err(|e| e.to_string())?;

    let assets_dir = template_dir.join("assets");
    if assets_dir.is_dir() {
        write_dir_recursive(&mut zip, &assets_dir, PathBuf::from("assets").as_path())
            .map_err(|e| e.to_string())?;
    }

    let screenshots_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join(guide_id);
    if screenshots_dir.is_dir() {
        write_dir_recursive(&mut zip, &screenshots_dir, PathBuf::from("screenshots").as_path())
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
    zip.add_directory(dest_dir.to_str().unwrap(), zip::write::SimpleFileOptions::default())?;

    for entry in std::fs::read_dir(source_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            let sub_dest_dir = dest_dir.join(path.file_name().unwrap());
            write_dir_recursive(zip, path.as_path(), &sub_dest_dir)?;
        } else if path.is_file() {
            let dest_file = dest_dir.join(path.file_name().unwrap());
            zip.start_file(dest_file.as_path().to_str().unwrap(), zip::write::SimpleFileOptions::default())?;
            zip.write_all(std::fs::read(path)?.as_slice())?;
        }
    }

    Ok(())
}

fn setup_tera() -> tera::Tera {
    let tera = tera::Tera::default();
    tera
}

fn serde_to_tera_context(values: serde_json::Value) -> tera::Context {
    let mut context = Context::new();
    if let Some(obj) = values.as_object() {
        for (k, v) in obj {
            context.insert(k, v);
        }
    }
    context
}