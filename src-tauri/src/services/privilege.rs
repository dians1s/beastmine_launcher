use crate::models::*;
use crate::utils::errors::LauncherError;

pub struct PrivilegeService;

impl PrivilegeService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_user_privileges(&self, _user_uuid: &str) -> Result<Vec<Privilege>, LauncherError> {
        Ok(vec![])
    }
}
