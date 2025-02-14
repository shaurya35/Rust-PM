use crate::models::{ User, PasswordEntry };
use actix_web:: { web, HttpResponse, Responder };
use lazy_static::lazy_static;
use std::sync::Mutex;
use uuid:Uuid;

lazy_static! {
    static ref USERS: Mutex<Vec<User>> = Mutex::new(Vec::new());
}

pub async fn signup() -> impl Responder{
    let code = format!("{:06}", rand::random::<u32>() % 1_000_000);
    let user_id = Uuid::new_v4().to_string();

    let mut users = USERS.lock().unwrap();

    users.push(User {
        id: user_id,
        code: code.clone(),
        password: Vec::new(),
    })

    HttpResponse::Ok().json(code)
}

pub async fn add_password(
    code: web::Json<String>,
    entry: web::Json<PasswordEntry>,
) -> impl Responder {
    let mut users = USERS.lock().unwrap();
    if let Some(user) = users.iter_mut().find(|u| u.code == *code) {
        user.password.push(entry.into_inner());
        HttpResponse::Ok().json("Password added")
    }else{
        HttpResponse::NotFound().json("Invalid Code")
    }
}