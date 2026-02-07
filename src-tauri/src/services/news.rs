use crate::models::*;
use crate::utils::errors::LauncherError;

pub struct NewsService;

impl NewsService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_latest(&self, _limit: usize) -> Result<Vec<NewsItem>, LauncherError> {
        Ok(vec![])
    }
}
