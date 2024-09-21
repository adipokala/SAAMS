#[macro_use]
extern crate diesel;

mod model {
    pub mod departments_model;
}
mod controller {
    pub mod departments_controller;
}
mod db;
mod schema;
mod error;

use warp::Filter;
use dotenvy::dotenv;
use crate::db::{DbPool, init_pool};
use crate::model::departments_model::NewDepartment;
use crate::controller::departments_controller::create;

#[tokio::main]
async fn main() {
    // Load environment variables (database url)
    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Initialize database pool
    let pool = init_pool(&database_url);

    // GET /hello/warp => 200 OK with body "Hello, warp!"
    let hello = warp::path!("hello" / String)
        .map(|name| format!("Hello, {}!", name));

    // POST
    let create_department = warp::path("departments")
        .and(warp::post())
        .and(with_db(pool.clone()))
        .and(warp::body::json())
        .and_then(create);

    warp::serve(hello)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

// Helper function to pass database connection pool to handlers
fn with_db(pool: DbPool) -> impl Filter<Extract = (DbPool,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || pool.clone())
}