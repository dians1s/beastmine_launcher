use crate::models::*;
use crate::utils::errors::LauncherError;

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
