use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub code: String,
    pub passwords: Vec<PasswordEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PasswordEntry{
    pub id: String,
    pub website: String,
    pub username: String, 
    pub password: String,
}

