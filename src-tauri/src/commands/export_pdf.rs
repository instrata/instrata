use std::path::Path;
use tauri::Manager;
use tera::Context;

#[tauri::command]
pub async fn export_pdf(app_handle: tauri::AppHandle, template_id: String, guide_id: String, params: serde_json::Value) -> Result<Vec<u8>, String> {
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

    let template_src = std::fs::read_to_string(&template_dir.join("template.typ.j2"))
        .map_err(|e| e.to_string())?;

    let context = serde_to_tera_context(params);
    let rendered: String = setup_tera()
        .render_str(&template_src, &context)
        .map_err(|e| e.to_string())?;

    let workdir = tempfile::Builder::new()
        .prefix("instrata-")
        // .disable_cleanup(true)
        .tempdir()
        .map_err(|e| e.to_string())?;

    std::fs::write(workdir.path().join("main.typ"), &rendered)
        .map_err(|e| e.to_string())?;

    let assets_dir = template_dir.join("assets");
    if assets_dir.is_dir() {
        copy_dir_recursive(&assets_dir, workdir.path().join("assets").as_path())
            .map_err(|e| e.to_string())?;
    }

    let screenshots_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join(guide_id);
    if screenshots_dir.is_dir() {
        copy_dir_recursive(&screenshots_dir, workdir.path().join("screenshots").as_path())
            .map_err(|e| e.to_string())?;
    }

    let pdf_bytes = run_typst_compile(workdir.path())
        .await?;

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


async fn run_typst_compile(root_dir: &Path) -> Result<Vec<u8>, String> {
    let template_source = std::fs::read_to_string(&root_dir.join("main.typ"))
        .expect("Could not read typst template");

    let template = typst_as_lib::TypstEngine::builder()
        .main_file(template_source)
        .with_file_system_resolver(root_dir)
        .search_fonts_with(typst_as_lib::typst_kit_options::TypstKitFontOptions::default())
        .build();

    let doc = template
        .compile()
        .output
        .map_err(|e| e.to_string())?;

    let options = Default::default();
    let pdf_bytes = typst_pdf::pdf(&doc, &options)
        .expect("failed to export to pdf");

    Ok(pdf_bytes)
}
