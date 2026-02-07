use crate::models::*;
use crate::utils::errors::LauncherError;

pub struct SkinService;

impl SkinService {
    pub fn new() -> Self {
        Self
    }

    pub async fn upload(&self, _skin_data: Vec<u8>, _is_slim: bool) -> Result<bool, LauncherError> {
        Ok(true)
    }

    pub async fn get_url(&self, _uuid: &str) -> Result<String, LauncherError> {
        Ok(String::new())
    }

    pub async fn reset(&self) -> Result<bool, LauncherError> {
        Ok(true)
    }
}

pub struct NotificationService;

impl NotificationService {
    pub fn new() -> Self {
        Self
    }

    pub async fn show(&self, _title: &str, _body: &str, _icon: Option<&str>) -> Result<(), LauncherError> {
        Ok(())
    }
}

pub struct NewsService;

impl NewsService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_latest(&self, _limit: usize) -> Result<Vec<NewsItem>, LauncherError> {
        Ok(vec![])
    }
}

pub struct PrivilegeService;

impl PrivilegeService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_user_privileges(&self, _user_uuid: &str) -> Result<Vec<Privilege>, LauncherError> {
        Ok(vec![])
    }
}

pub struct ModpackService;

impl ModpackService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_all(&self) -> Result<Vec<Modpack>, LauncherError> {
        Ok(vec![])
    }

    pub async fn install(&self, _id: &str) -> Result<bool, LauncherError> {
        Ok(true)
    }

    pub async fn uninstall(&self, _id: &str) -> Result<bool, LauncherError> {
        Ok(true)
    }
}

pub struct SystemService;

impl SystemService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_info(&self) -> Result<SystemInfo, LauncherError> {
        Ok(SystemInfo {
            os: String::from("Windows"),
            os_version: String::from("10"),
            cpu: String::from("Unknown"),
            cpu_cores: 4,
            total_ram_gb: 16.0,
            available_ram_gb: 8.0,
            gpu: String::from("Unknown"),
            gpu_vram_gb: None,
        })
    }

    pub async fn get_storage(&self) -> Result<StorageInfo, LauncherError> {
        Ok(StorageInfo {
            total_gb: 1000.0,
            available_gb: 500.0,
            used_by_launcher_gb: 1.0,
        })
    }

    pub async fn open_directory(&self, _path: &str) -> Result<(), LauncherError> {
        Ok(())
    }
}
