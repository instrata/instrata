use crate::commands::utils;
use std::path::Path;
use tauri::Manager;

#[tauri::command]
pub async fn export_pdf(
    app_handle: tauri::AppHandle,
    template_id: String,
    guide_id: String,
    context: serde_json::Value,
) -> Result<Vec<u8>, String> {
    tokio::task::spawn_blocking(move || {
        blocking_export_pdf(app_handle, template_id, guide_id, context)
    })
    .await
    .map_err(|e| e.to_string())?
}

fn blocking_export_pdf(
    app_handle: tauri::AppHandle,
    template_id: String,
    guide_id: String,
    context_raw: serde_json::Value,
) -> Result<Vec<u8>, String> {
    let template_dir = utils::resolve_template_dir(&app_handle, &template_id)?;

    let template_src = std::fs::read_to_string(&template_dir.join("template.typ.j2"))
        .map_err(|e| e.to_string())?;

    let context = utils::serde_to_tera_context(context_raw);
    let rendered: String = tera::Tera::default()
        .render_str(&template_src, &context)
        .map_err(|e| e.to_string())?;

    let workdir = tempfile::Builder::new()
        .prefix("instrata-")
        // .disable_cleanup(true)
        .tempdir()
        .map_err(|e| e.to_string())?;

    std::fs::write(workdir.path().join("main.typ"), &rendered).map_err(|e| e.to_string())?;

    let assets_dir = template_dir.join("assets");
    if assets_dir.is_dir() {
        copy_dir_recursive(&assets_dir, workdir.path().join("assets").as_path())
            .map_err(|e| e.to_string())?;
    }

    let images_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("guides")
        .join(guide_id)
        .join("images");
    if images_dir.is_dir() {
        copy_dir_recursive(&images_dir, workdir.path().join("images").as_path())
            .map_err(|e| e.to_string())?;
    }

    let pdf_bytes = run_typst_compile(workdir.path())?;

    Ok(pdf_bytes)
}

fn copy_dir_recursive(source_dir: &Path, dest_dir: &Path) -> Result<(), std::io::Error> {
    std::fs::create_dir_all(&dest_dir)?;

    for entry in std::fs::read_dir(source_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            let sub_dest_dir = dest_dir.join(path.file_name().unwrap());
            copy_dir_recursive(path.as_path(), &sub_dest_dir)?;
        } else if path.is_file() {
            let dest_file = dest_dir.join(path.file_name().unwrap());
            std::fs::copy(path, dest_file)?;
        }
    }

    Ok(())
}

fn run_typst_compile(root_dir: &Path) -> Result<Vec<u8>, String> {
    let template_source =
        std::fs::read_to_string(&root_dir.join("main.typ")).map_err(|e| e.to_string())?;

    let template = typst_as_lib::TypstEngine::builder()
        .main_file(template_source)
        .with_file_system_resolver(root_dir)
        .search_fonts_with(typst_as_lib::typst_kit_options::TypstKitFontOptions::default())
        .build();

    let doc = template.compile().output.map_err(|e| e.to_string())?;

    let options = Default::default();
    let pdf_bytes = typst_pdf::pdf(&doc, &options).expect("failed to export to pdf");

    Ok(pdf_bytes)
}
