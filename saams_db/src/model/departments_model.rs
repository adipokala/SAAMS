use diesel::prelude::*;
use chrono::{NaiveDateTime, Utc};
use serde::{Deserialize, Serialize};
use crate::schema::departments;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = departments)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Department {
    pub id: i16,
    pub name: String,
    pub code: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = departments)]
pub struct NewDepartment<'a> {
    pub name: &'a str,
    pub code: &'a str,
}

impl <'a> NewDepartment<'a> {
    pub fn new(name: &'a str, code: &'a str) -> NewDepartment<'a> {
        NewDepartment {
            name,
            code,
        }
    }
}