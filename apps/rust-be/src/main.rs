mod models;
mod handlers; 
mod routes;

use actix_web::{HttpServer};
use actix_cors::Cors;
use routes::config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .configure(config)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}