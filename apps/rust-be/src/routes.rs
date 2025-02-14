use actix_web::web;
use crate::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .route("/signup", web::post().to(handlers::signup))
            .route("/login", web::post().to(handlers::login))
            .route("/passwords", web::post().to(handlers::add_password))
            .route("/passwords", web::get().to(handlers::get_passwords))
    );
}