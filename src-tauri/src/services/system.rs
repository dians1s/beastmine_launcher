use crate::models::*;
use crate::utils::errors::LauncherError;

pub struct SystemService;

impl SystemService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_info(&self) -> Result<SystemInfo, LauncherError> {
        Ok(SystemInfo {
            os: "Windows".to_string(),
            os_version: "10".to_string(),
            cpu: "Unknown".to_string(),
            cpu_cores: 4,
            total_ram_gb: 16.0,
            available_ram_gb: 8.0,
            gpu: "Unknown".to_string(),
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
