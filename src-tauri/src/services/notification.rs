use crate::models::*;
use crate::utils::errors::LauncherError;

pub struct NotificationService;

impl NotificationService {
    pub fn new() -> Self {
        Self
    }

    pub async fn show(&self, _title: &str, _body: &str, _icon: Option<&str>) -> Result<(), LauncherError> {
        Ok(())
    }
}
