pub mod errors;

use std::path::PathBuf;
use dirs;

pub fn get_launcher_dir() -> PathBuf {
    let path = dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("AppData")
        .join("Roaming")
        .join(".beastmine");
    
    std::fs::create_dir_all(&path).ok();
    path
}

pub fn get_versions_dir() -> PathBuf {
    let path = get_launcher_dir().join("versions");
    std::fs::create_dir_all(&path).ok();
    path
}

pub fn get_java_dir() -> PathBuf {
    let path = get_launcher_dir().join("java");
    std::fs::create_dir_all(&path).ok();
    path
}

pub fn get_assets_dir() -> PathBuf {
    let path = get_launcher_dir().join("assets");
    std::fs::create_dir_all(&path).ok();
    path
}

pub fn get_libraries_dir() -> PathBuf {
    let path = get_launcher_dir().join("libraries");
    std::fs::create_dir_all(&path).ok();
    path
}

pub fn get_modpacks_dir() -> PathBuf {
    let path = get_launcher_dir().join("modpacks");
    std::fs::create_dir_all(&path).ok();
    path
}

pub fn get_skins_dir() -> PathBuf {
    let path = get_launcher_dir().join("skins");
    std::fs::create_dir_all(&path).ok();
    path
}
