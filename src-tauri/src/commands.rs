use serde::{Deserialize, Serialize};
use crate::models::*;
use crate::services::auth::AuthService;
use crate::services::game::GameService;
use crate::services::skin::SkinService;
use crate::services::notification::NotificationService;
use crate::services::news::NewsService;
use crate::services::privilege::PrivilegeService;
use crate::services::modpack::ModpackService;
use crate::services::system::SystemService;
use crate::utils::errors::LauncherError;

pub mod auth {
    use super::*;

    #[derive(Debug, Deserialize)]
    pub struct LoginRequest {
        pub username: String,
        pub password: String,
    }

    #[derive(Debug, Serialize)]
    pub struct LoginResponse {
        pub success: bool,
        pub user: Option<User>,
        pub error: Option<String>,
    }

    #[tauri::command]
    pub async fn login(
        request: LoginRequest,
    ) -> Result<LoginResponse, LauncherError> {
        let auth_service = AuthService::new();
        
        match auth_service.authenticate(&request.username, &request.password).await {
            Ok(user) => {
                Ok(LoginResponse {
                    success: true,
                    user: Some(user),
                    error: None,
                })
            }
            Err(e) => Ok(LoginResponse {
                success: false,
                user: None,
                error: Some(e.to_string()),
            }),
        }
    }

    #[tauri::command]
    pub async fn logout() -> Result<bool, LauncherError> {
        Ok(true)
    }

    #[tauri::command]
    pub async fn check_session() -> Result<Option<User>, LauncherError> {
        Ok(None)
    }

    #[tauri::command]
    pub async fn refresh_token() -> Result<bool, LauncherError> {
        Ok(false)
    }
}

pub mod game {
    use super::*;

    #[derive(Debug, Deserialize)]
    pub struct LaunchRequest {
        pub version: String,
        pub java_args: Vec<String>,
        pub game_args: Vec<String>,
        pub modpack_id: Option<String>,
    }

    #[tauri::command]
    pub async fn launch_game(
        request: LaunchRequest,
    ) -> Result<LaunchResult, LauncherError> {
        let game_service = GameService::new();
        let result = game_service.launch(request).await?;
        Ok(result)
    }

    #[tauri::command]
    pub async fn terminate_game() -> Result<bool, LauncherError> {
        Ok(true)
    }

    #[tauri::command]
    pub async fn get_installed_versions() -> Result<Vec<GameVersion>, LauncherError> {
        let game_service = GameService::new();
        game_service.get_installed_versions().await
    }

    #[tauri::command]
    pub async fn install_version(version: String) -> Result<InstallProgress, LauncherError> {
        let game_service = GameService::new();
        game_service.install_version(&version).await
    }

    #[tauri::command]
    pub async fn get_java_versions() -> Result<Vec<JavaVersion>, LauncherError> {
        let game_service = GameService::new();
        game_service.get_java_versions().await
    }

    #[tauri::command]
    pub async fn get_game_settings() -> Result<GameSettings, LauncherError> {
        let game_service = GameService::new();
        game_service.get_settings().await
    }

    #[tauri::command]
    pub async fn save_game_settings(settings: GameSettings) -> Result<bool, LauncherError> {
        let game_service = GameService::new();
        game_service.save_settings(settings).await
    }
}

pub mod updates {
    use super::*;

    #[tauri::command]
    pub async fn check_updates(_app: tauri::AppHandle) -> Result<UpdateInfo, LauncherError> {
        Ok(UpdateInfo {
            available: false,
            version: env!("CARGO_PKG_VERSION").to_string(),
            download_url: None,
            changelog: vec![],
            size_mb: 0.0,
        })
    }

    #[tauri::command]
    pub async fn download_update(_app: tauri::AppHandle) -> Result<bool, LauncherError> {
        Ok(false)
    }

    #[tauri::command]
    pub fn get_launcher_version() -> String {
        env!("CARGO_PKG_VERSION").to_string()
    }
}

pub mod skin {
    use super::*;

    #[tauri::command]
    pub async fn upload_skin(
        skin_data: Vec<u8>,
        is_slim: bool,
    ) -> Result<bool, LauncherError> {
        let skin_service = SkinService::new();
        skin_service.upload(skin_data, is_slim).await
    }

    #[tauri::command]
    pub async fn get_skin_url(uuid: String) -> Result<String, LauncherError> {
        let skin_service = SkinService::new();
        skin_service.get_url(&uuid).await
    }

    #[tauri::command]
    pub async fn reset_skin() -> Result<bool, LauncherError> {
        let skin_service = SkinService::new();
        skin_service.reset().await
    }
}

pub mod system {
    use super::*;

    #[tauri::command]
    pub async fn get_system_info() -> Result<SystemInfo, LauncherError> {
        let sys_service = SystemService::new();
        sys_service.get_info().await
    }

    #[tauri::command]
    pub async fn get_storage_info() -> Result<StorageInfo, LauncherError> {
        let sys_service = SystemService::new();
        sys_service.get_storage().await
    }

    #[tauri::command]
    pub async fn open_directory(path: String) -> Result<(), LauncherError> {
        let sys_service = SystemService::new();
        sys_service.open_directory(&path).await
    }
}

pub mod news {
    use super::*;

    #[tauri::command]
    pub async fn get_news(limit: Option<usize>) -> Result<Vec<NewsItem>, LauncherError> {
        let news_service = NewsService::new();
        news_service.get_latest(limit.unwrap_or(10)).await
    }
}

pub mod privilege {
    use super::*;

    #[tauri::command]
    pub async fn get_privileges(user_uuid: String) -> Result<Vec<Privilege>, LauncherError> {
        let priv_service = PrivilegeService::new();
        priv_service.get_user_privileges(&user_uuid).await
    }
}

pub mod modpack {
    use super::*;

    #[tauri::command]
    pub async fn get_modpacks() -> Result<Vec<Modpack>, LauncherError> {
        let modpack_service = ModpackService::new();
        modpack_service.get_all().await
    }

    #[tauri::command]
    pub async fn install_modpack(id: String) -> Result<bool, LauncherError> {
        let modpack_service = ModpackService::new();
        modpack_service.install(&id).await
    }

    #[tauri::command]
    pub async fn uninstall_modpack(id: String) -> Result<bool, LauncherError> {
        let modpack_service = ModpackService::new();
        modpack_service.uninstall(&id).await
    }
}

pub mod notification {
    use super::*;

    #[tauri::command]
    pub async fn send_notification(
        title: String,
        body: String,
        icon: Option<String>,
    ) -> Result<(), LauncherError> {
        let notif_service = NotificationService::new();
        notif_service.show(&title, &body, icon.as_deref()).await
    }
}
