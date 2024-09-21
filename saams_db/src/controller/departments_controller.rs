use warp::{reject, reply, Rejection, Reply};
use diesel::prelude::*;
use crate::db::{DbPool};
use crate::model::departments_model::{NewDepartment, Department};
use crate::schema::departments::dsl::*;
use crate::error::CustomError;

pub async fn create(pool: DbPool, new_department: NewDepartment<'_>) -> Result<impl Reply, Rejection> {
    let mut conn = pool.get().map_err(|_| reject::custom(CustomError::new("Connection Error")))?;
    let result = diesel::insert_into(departments)
        .values(&new_department)
        .returning(Department::as_returning())
        .get_result::<Department>(&mut conn)
        .map_err(|_| reject::custom(CustomError::new("Error creating department")));

    Ok(reply::json(&result))
}

pub async fn delete(pool: DbPool, department_id: i16) -> Result<impl Reply, Rejection> {
    let mut conn = pool.get().map_err(|_| reject::custom(CustomError::new("Connection Error")))?;
    diesel::delete(departments.find(department_id)
        .execute(&mut conn)
        .map_err(|_| reject::custom(CustomError::new("Error deleting department"))));

    Ok(reply::with_status("User deleted", warp::http::status::StatusCode::OK))
}