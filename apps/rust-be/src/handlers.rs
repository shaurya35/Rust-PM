use crate::models::{ User, PasswordEntry };
use actix_web:: { web, HttpResponse, Responder };
use lazy_static::lazy_static;
use std::sync::Mutex;
use uuid::Uuid;
use serde::{Deserialize};

#[derive(Debug, Deserialize)]
pub struct PasswordRequest {
    pub code: String,
    pub website: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct CodeForm {
    pub code: String,
}

lazy_static! {
    static ref USERS: Mutex<Vec<User>> = Mutex::new(Vec::new());
}

pub async fn login(code: web::Json<String>) -> impl Responder {
    let users = USERS.lock().unwrap();
    
    if let Some(user) = users.iter().find(|u| u.code == *code) {
        HttpResponse::Ok().json(&user.passwords)
    } else {
        HttpResponse::Unauthorized().json("Invalid code")
    }
}

pub async fn signup() -> impl Responder{
    let code = format!("{:06}", rand::random::<u32>() % 1_000_000);
    let user_id = Uuid::new_v4().to_string();

    let mut users = USERS.lock().unwrap();

    users.push(User {
        id: user_id,
        code: code.clone(),
        passwords: Vec::new(),
    });

    HttpResponse::Ok().json(code)
}

pub async fn add_password(
    payload: web::Json<PasswordRequest>,
) -> impl Responder {
    let mut users = USERS.lock().unwrap();
    
    if let Some(user) = users.iter_mut().find(|u| u.code == payload.code) {
        user.passwords.push(PasswordEntry {
            id: Uuid::new_v4().to_string(),
            website: payload.website.clone(),
            username: payload.username.clone(),
            password: payload.password.clone(),
        });
        HttpResponse::Ok().json("Password added")
    } else {
        HttpResponse::Unauthorized().json("Invalid code")
    }
}

pub async fn get_passwords(
    code: web::Query<CodeForm>, 
) -> impl Responder {
    let users = USERS.lock().unwrap();
    
    if let Some(user) = users.iter().find(|u| u.code == code.code) {
        HttpResponse::Ok().json(&user.passwords)
    } else {
        HttpResponse::Unauthorized().json("Invalid code")
    }
}