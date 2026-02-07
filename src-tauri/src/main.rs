#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WindowEvent};
use tracing::info;

mod commands;
mod models;
mod services;
mod utils;

use commands::*;

fn main() {
    tracing_subscriber::fmt()
        .with_env_filter("beastmine_launcher=debug,tauri=info")
        .init();

    info!("Запуск BeastMine Launcher v1.0.0");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Показываем окно после загрузки
            window.show().unwrap();
            window.set_focus().unwrap();

            // Настройка трея
            #[cfg(target_os = "windows")]
            setup_tray(app)?;

            info!("Лаунчер успешно инициализирован");
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    // Скрываем в трей вместо закрытия
                    window.hide().unwrap();
                    api.prevent_close();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            auth::login,
            auth::logout,
            auth::check_session,
            auth::refresh_token,
            game::launch_game,
            game::terminate_game,
            game::get_installed_versions,
            game::install_version,
            game::get_java_versions,
            game::get_game_settings,
            game::save_game_settings,
            updates::check_updates,
            updates::download_update,
            updates::get_launcher_version,
            skin::upload_skin,
            skin::get_skin_url,
            skin::reset_skin,
            system::get_system_info,
            system::get_storage_info,
            system::open_directory,
            news::get_news,
            privilege::get_privileges,
            modpack::get_modpacks,
            modpack::install_modpack,
            modpack::uninstall_modpack,
            notification::send_notification,
        ])
        .run(tauri::generate_context!())
        .expect("Ошибка запуска приложения");
}

#[cfg(target_os = "windows")]
fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::tray::TrayIconBuilder;
    use tauri::menu::{Menu, MenuItem};

    let quit_i = MenuItem::with_id(app, "quit", "Выйти", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "Показать", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}
