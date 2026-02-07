use crate::models::*;
use crate::utils::errors::LauncherError;
use crate::utils::*;
use async_trait::async_trait;
use std::process::Stdio;
use tokio::process::Command;
use tracing::{info, error};

pub struct GameService;

impl GameService {
    pub fn new() -> Self {
        Self
    }

    pub async fn launch(&self, request: crate::commands::game::LaunchRequest) -> Result<LaunchResult, LauncherError> {
        info!("Запуск Minecraft версии {}", request.version);

        let java_path = self.get_java_path().await?;
        let version_dir = get_versions_dir().join(&request.version);
        
        if !version_dir.exists() {
            return Err(LauncherError::VersionNotFound(request.version));
        }

        let mut cmd = Command::new(&java_path);
        
        // JVM аргументы для максимальной производительности
        cmd.args(&self.get_optimized_jvm_args(&request));
        
        // Класспас
        cmd.arg("-cp").arg(self.build_classpath(&request.version).await?);
        
        // Главный класс
        cmd.arg("net.minecraft.client.main.Main");
        
        // Аргументы игры
        cmd.args(&self.build_game_args(&request).await?);
        
        // Настройка окружения
        cmd.current_dir(&version_dir)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        #[cfg(target_os = "windows")]
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW

        match cmd.spawn() {
            Ok(child) => {
                let pid = child.id();
                info!("Minecraft запущен с PID: {:?}", pid);
                
                Ok(LaunchResult {
                    success: true,
                    pid,
                    error: None,
                })
            }
            Err(e) => {
                error!("Ошибка запуска игры: {}", e);
                Err(LauncherError::GameError(e.to_string()))
            }
        }
    }

    async fn get_java_path(&self) -> Result<String, LauncherError> {
        // Проверяем встроенную Java
        let java_dir = get_java_dir();
        
        #[cfg(target_os = "windows")]
        let java_exe = java_dir.join("bin").join("java.exe");
        #[cfg(not(target_os = "windows"))]
        let java_exe = java_dir.join("bin").join("java");

        if java_exe.exists() {
            return Ok(java_exe.to_string_lossy().to_string());
        }

        // Ищем в PATH
        let output = Command::new("where")
            .arg("java")
            .output()
            .await
            .map_err(|_| LauncherError::JavaNotFound)?;

        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout);
            return Ok(path.lines().next().unwrap_or("java").trim().to_string());
        }

        Err(LauncherError::JavaNotFound)
    }

    fn get_optimized_jvm_args(&self, _request: &crate::commands::game::LaunchRequest) -> Vec<String> {
        vec![
            "-Xmx4G".to_string(),
            "-Xms1G".to_string(),
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
            "-XX:+UseStringDeduplication".to_string(),
            "-XX:+OptimizeStringConcat".to_string(),
            "-XX:+UseCompressedOops".to_string(),
            "-XX:+UseFastAccessorMethods".to_string(),
            "-Dfml.ignoreInvalidMinecraftCertificates=true".to_string(),
            "-Dfml.ignorePatchDiscrepancies=true".to_string(),
        ]
    }

    async fn build_classpath(&self, version: &str) -> Result<String, LauncherError> {
        let libs_dir = get_libraries_dir();
        let version_dir = get_versions_dir().join(version);
        
        let mut classpath = vec![];
        
        // Добавляем jar файлы библиотек
        if libs_dir.exists() {
            Self::collect_jars(&libs_dir, &mut classpath)?;
        }
        
        // Добавляем jar версии
        let version_jar = version_dir.join(format!("{}.jar", version));
        if version_jar.exists() {
            classpath.push(version_jar.to_string_lossy().to_string());
        }

        #[cfg(target_os = "windows")]
        let separator = ";";
        #[cfg(not(target_os = "windows"))]
        let separator = ":";

        Ok(classpath.join(separator))
    }

    fn collect_jars(dir: &std::path::Path, classpath: &mut Vec<String>) -> Result<(), LauncherError> {
        for entry in std::fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_dir() {
                Self::collect_jars(&path, classpath)?;
            } else if path.extension().map_or(false, |ext| ext == "jar") {
                classpath.push(path.to_string_lossy().to_string());
            }
        }
        Ok(())
    }

    async fn build_game_args(&self, request: &crate::commands::game::LaunchRequest) -> Result<Vec<String>, LauncherError> {
        let mut args = vec![];
        
        // Базовые аргументы
        args.push("--username".to_string());
        args.push("Player".to_string()); // Будет заменено на реального пользователя
        
        args.push("--version".to_string());
        args.push(request.version.clone());
        
        args.push("--gameDir".to_string());
        args.push(get_versions_dir().join(&request.version).to_string_lossy().to_string());
        
        args.push("--assetsDir".to_string());
        args.push(get_assets_dir().to_string_lossy().to_string());
        
        args.push("--assetIndex".to_string());
        args.push(request.version.clone());
        
        args.push("--uuid".to_string());
        args.push(uuid::Uuid::new_v4().to_string());
        
        args.push("--accessToken".to_string());
        args.push("0".to_string());
        
        args.push("--userType".to_string());
        args.push("legacy".to_string());
        
        args.push("--versionType".to_string());
        args.push("BeastMine".to_string());

        // Дополнительные аргументы
        args.extend(request.game_args.clone());

        Ok(args)
    }

    pub async fn get_installed_versions(&self) -> Result<Vec<GameVersion>, LauncherError> {
        let versions_dir = get_versions_dir();
        let mut versions = vec![];

        if versions_dir.exists() {
            for entry in std::fs::read_dir(&versions_dir)? {
                let entry = entry?;
                if entry.file_type()?.is_dir() {
                    let name = entry.file_name().to_string_lossy().to_string();
                    versions.push(GameVersion {
                        id: name.clone(),
                        name,
                        release_date: chrono::Utc::now(),
                        version_type: VersionType::Release,
                        installed: true,
                        size_mb: 0.0,
                    });
                }
            }
        }

        Ok(versions)
    }

    pub async fn install_version(&self, version: &str) -> Result<InstallProgress, LauncherError> {
        // Заглушка - в реальности здесь будет загрузка версии
        Ok(InstallProgress {
            version: version.to_string(),
            progress: 100.0,
            stage: InstallStage::Completed,
            bytes_downloaded: 0,
            total_bytes: 0,
            speed_mbps: 0.0,
        })
    }

    pub async fn get_java_versions(&self) -> Result<Vec<JavaVersion>, LauncherError> {
        let mut versions = vec![];
        
        // Проверяем встроенную Java
        let java_dir = get_java_dir();
        if java_dir.exists() {
            versions.push(JavaVersion {
                version: "21".to_string(),
                path: java_dir.to_string_lossy().to_string(),
                is_default: true,
                arch: "x64".to_string(),
            });
        }

        Ok(versions)
    }

    pub async fn get_settings(&self) -> Result<GameSettings, LauncherError> {
        let settings_path = get_launcher_dir().join("game_settings.json");
        
        if settings_path.exists() {
            let content = tokio::fs::read_to_string(&settings_path).await?;
            let settings: GameSettings = serde_json::from_str(&content)?;
            Ok(settings)
        } else {
            Ok(GameSettings::default())
        }
    }

    pub async fn save_settings(&self, settings: GameSettings) -> Result<bool, LauncherError> {
        let settings_path = get_launcher_dir().join("game_settings.json");
        let content = serde_json::to_string_pretty(&settings)?;
        tokio::fs::write(&settings_path, content).await?;
        Ok(true)
    }
}
