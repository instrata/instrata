mod commands;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            #[cfg(desktop)]
            {
                let _ = app
                    .get_webview_window("main")
                    .expect("no main window")
                    .set_focus();
            }
        }))
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new()
            .with_filter(|label| label != "screenshot-overlay")
            .build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            commands::capture_monitor::capture_monitor,
            commands::capture_region::capture_region,
            commands::capture_window::capture_window,
            commands::export_guide::export_guide,
            commands::export_markdown::export_markdown,
            commands::export_pdf::export_pdf,
            commands::import_guide::import_guide,
            commands::link_external_guide::link_external_guide,
            commands::list_windows::list_windows,
            commands::runtime_info::get_runtime_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
