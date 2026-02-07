use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub uuid: String,
    pub username: String,
    pub email: String,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
    pub skin_url: Option<String>,
    pub cape_url: Option<String>,
    pub privileges: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameVersion {
    pub id: String,
    pub name: String,
    pub release_date: DateTime<Utc>,
    pub version_type: VersionType,
    pub installed: bool,
    pub size_mb: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum VersionType {
    Release,
    Snapshot,
    OldAlpha,
    OldBeta,
    Modded,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchResult {
    pub success: bool,
    pub pid: Option<u32>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallProgress {
    pub version: String,
    pub progress: f32,
    pub stage: InstallStage,
    pub bytes_downloaded: u64,
    pub total_bytes: u64,
    pub speed_mbps: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InstallStage {
    Downloading,
    Verifying,
    Extracting,
    InstallingJava,
    Completed,
    Error(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JavaVersion {
    pub version: String,
    pub path: String,
    pub is_default: bool,
    pub arch: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameSettings {
    pub max_memory_mb: u32,
    pub min_memory_mb: u32,
    pub java_path: Option<String>,
    pub java_args: Vec<String>,
    pub game_args: Vec<String>,
    pub resolution: Resolution,
    pub fullscreen: bool,
    pub vsync: bool,
    pub render_distance: u8,
    pub graphics_quality: GraphicsQuality,
}

impl Default for GameSettings {
    fn default() -> Self {
        Self {
            max_memory_mb: 4096,
            min_memory_mb: 512,
            java_path: None,
            java_args: vec![
                "-XX:+UseG1GC".to_string(),
                "-XX:+ParallelRefProcEnabled".to_string(),
                "-XX:MaxGCPauseMillis=200".to_string(),
                "-XX:+UnlockExperimentalVMOptions".to_string(),
                "-XX:+DisableExplicitGC".to_string(),
                "-XX:+AlwaysPreTouch".to_string(),
                "-XX:G1NewSizePercent=30".to_string(),
                "-XX:G1MaxNewSizePercent=40".to_string(),
                "-XX:G1HeapRegionSize=8M".to_string(),
                "-XX:G1ReservePercent=20".to_string(),
                "-XX:G1HeapWastePercent=5".to_string(),
            ],
            game_args: vec![],
            resolution: Resolution { width: 1920, height: 1080 },
            fullscreen: false,
            vsync: true,
            render_distance: 12,
            graphics_quality: GraphicsQuality::Fancy,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resolution {
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GraphicsQuality {
    Fast,
    Fancy,
    Fabulous,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateInfo {
    pub available: bool,
    pub version: String,
    pub download_url: Option<String>,
    pub changelog: Vec<String>,
    pub size_mb: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub os_version: String,
    pub cpu: String,
    pub cpu_cores: usize,
    pub total_ram_gb: f64,
    pub available_ram_gb: f64,
    pub gpu: String,
    pub gpu_vram_gb: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageInfo {
    pub total_gb: f64,
    pub available_gb: f64,
    pub used_by_launcher_gb: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewsItem {
    pub id: String,
    pub title: String,
    pub content: String,
    pub image_url: Option<String>,
    pub published_at: DateTime<Utc>,
    pub author: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Privilege {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon_url: Option<String>,
    pub expires_at: Option<DateTime<Utc>>,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Modpack {
    pub id: String,
    pub name: String,
    pub description: String,
    pub version: String,
    pub mc_version: String,
    pub author: String,
    pub downloads: u64,
    pub rating: f32,
    pub icon_url: Option<String>,
    pub banner_url: Option<String>,
    pub size_mb: f64,
    pub installed: bool,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct LauncherSettings {
    pub auto_update: bool,
    pub close_on_launch: bool,
    pub show_snapshots: bool,
    pub keep_launcher_open: bool,
    pub theme: Theme,
    pub language: String,
    pub download_threads: u8,
    pub verify_downloads: bool,
    pub use_gpu_acceleration: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum Theme {
    #[default]
    Dark,
    Light,
    Auto,
}
