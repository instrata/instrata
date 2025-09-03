/// Convert serde_json::Value into Tera Context
pub fn serde_to_tera_context(values: serde_json::Value) -> tera::Context {
    let mut context = tera::Context::new();
    if let Some(obj) = values.as_object() {
        for (k, v) in obj {
            context.insert(k, v);
        }
    }
    context
}

/// Resolve template directory (prefers app_config_dir, falls back to resource_dir/templates)
pub fn resolve_template_dir(
    app_handle: &tauri::AppHandle,
    template_id: &str,
) -> Result<std::path::PathBuf, String> {
    use tauri::Manager;

    let mut dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?
        .join(template_id);

    if !dir.is_dir() {
        dir = app_handle
            .path()
            .resource_dir()
            .map_err(|e| e.to_string())?
            .join("templates")
            .join(template_id);
    }

    if !dir.is_dir() {
        return Err(format!("template {:?} not found", template_id));
    }

    Ok(dir)
}
