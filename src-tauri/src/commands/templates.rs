
#[tauri::command]
pub async fn render_template(
    template: String,
    values: serde_json::Value,
) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        let mut context = tera::Context::new();
        if let Some(obj) = values.as_object() {
            for (k, v) in obj {
                context.insert(k, v);
            }
        }

        let rendered: String = setup_tera()
            .render_str(&template, &context)
            .map_err(|e| e.to_string())?;

        Ok(rendered)
    })
    .await
    .map_err(|e| e.to_string())?
}


fn setup_tera() -> tera::Tera {
    let tera = tera::Tera::default();
    tera
}
