use thiserror::Error;

#[derive(Error, Debug)]
pub enum LauncherError {
    #[error("Ошибка аутентификации: {0}")]
    AuthError(String),
    
    #[error("Ошибка сети: {0}")]
    NetworkError(#[from] reqwest::Error),
    
    #[error("Ошибка файловой системы: {0}")]
    IoError(#[from] std::io::Error),
    
    #[error("Ошибка сериализации: {0}")]
    SerializationError(#[from] serde_json::Error),
    
    #[error("Ошибка игры: {0}")]
    GameError(String),
    
    #[error("Версия не найдена: {0}")]
    VersionNotFound(String),
    
    #[error("Java не найдена")]
    JavaNotFound,
    
    #[error("Недостаточно памяти")]
    InsufficientMemory,
    
    #[error("Ошибка обновления: {0}")]
    UpdateError(String),
    
    #[error("Ошибка скина: {0}")]
    SkinError(String),
    
    #[error("Сессия истекла")]
    SessionExpired,
    
    #[error("Неизвестная ошибка: {0}")]
    Unknown(String),
}

impl serde::Serialize for LauncherError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
