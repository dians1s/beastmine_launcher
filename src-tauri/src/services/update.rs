use crate::models::*;
use crate::utils::errors::LauncherError;
use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

pub struct UpdateService {
    app: AppHandle,
}

impl UpdateService {
    pub fn new(app: AppHandle) -> Self {
        Self { app }
    }

    pub async fn check(&self) -> Result<UpdateInfo, LauncherError> {
        // Заглушка - в реальности здесь будет проверка обновлений
        Ok(UpdateInfo {
            available: false,
            version: env!("CARGO_PKG_VERSION").to_string(),
            download_url: None,
            changelog: vec![],
            size_mb: 0.0,
        })
    }

    pub async fn download_and_install(&self) -> Result<bool, LauncherError> {
        Ok(false)
    }
}
