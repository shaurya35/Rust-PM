use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub stuct User {
    pub id: String,
    pub code: String,
    pub passwords: Vec<PasswordEntry>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PasswordEntry{
    pub id: String,
    pub website: String,
    pub username: String, 
    pub password: String,
}

